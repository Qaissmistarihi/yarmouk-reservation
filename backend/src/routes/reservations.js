const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/reservations
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, start, end, limit } = req.query
    const where = {}

    if (status) where.status = status
    if (start || end) {
      where.date = {}
      if (start) where.date.gte = new Date(start)
      if (end) where.date.lte = new Date(end)
    }

    // Non-admin users only see their own reservations
    if (req.user.role !== 'admin') {
      where.userId = req.user.id
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, department: true } },
        room: { include: { building: true } },
      },
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: parseInt(limit) } : {}),
    })

    // Map to frontend-friendly format
    const mapped = reservations.map(r => ({
      id: r.id,
      user_id: r.userId,
      room_id: r.roomId,
      date: r.date.toISOString().split('T')[0],
      start_time: r.startTime,
      end_time: r.endTime,
      students_number: r.studentsNumber,
      purpose: r.purpose,
      status: r.status,
      admin_notes: r.adminNotes,
      created_at: r.createdAt,
      doctor_name: r.user.name,
      doctor_email: r.user.email,
      department: r.user.department,
      room_name: r.room.roomName,
      building_name: r.room.building.name,
      building_code: r.room.building.code,
    }))

    res.json(mapped)
  } catch (err) {
    console.error('Get reservations error:', err)
    res.status(500).json({ message: 'Failed to fetch reservations.' })
  }
})

// GET /api/reservations/mine
router.get('/mine', authenticate, async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user.id },
      include: {
        room: { include: { building: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = reservations.map(r => ({
      id: r.id,
      room_id: r.roomId,
      date: r.date.toISOString().split('T')[0],
      start_time: r.startTime,
      end_time: r.endTime,
      students_number: r.studentsNumber,
      purpose: r.purpose,
      status: r.status,
      admin_notes: r.adminNotes,
      created_at: r.createdAt,
      room_name: r.room.roomName,
      building_name: r.room.building.name,
      building_code: r.room.building.code,
    }))

    res.json(mapped)
  } catch (err) {
    console.error('Get my reservations error:', err)
    res.status(500).json({ message: 'Failed to fetch reservations.' })
  }
})

// POST /api/reservations
router.post('/', authenticate, async (req, res) => {
  try {
    const { room_id, date, start_time, end_time, students_number, purpose } = req.body

    if (!room_id || !date || !start_time || !end_time) {
      return res.status(400).json({ message: 'Room, date, start time, and end time are required.' })
    }

    // Check for time conflicts
    const conflict = await prisma.reservation.findFirst({
      where: {
        roomId: parseInt(room_id),
        date: new Date(date),
        status: { in: ['pending', 'approved'] },
        startTime: { lt: end_time },
        endTime: { gt: start_time },
      },
    })

    if (conflict) {
      return res.status(409).json({ message: 'This room is already reserved for the selected time slot.' })
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: req.user.id,
        roomId: parseInt(room_id),
        date: new Date(date),
        startTime: start_time,
        endTime: end_time,
        studentsNumber: students_number ? parseInt(students_number) : null,
        purpose,
      },
      include: {
        room: { include: { building: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    res.status(201).json({
      id: reservation.id,
      room_id: reservation.roomId,
      date: reservation.date.toISOString().split('T')[0],
      start_time: reservation.startTime,
      end_time: reservation.endTime,
      students_number: reservation.studentsNumber,
      purpose: reservation.purpose,
      status: reservation.status,
      room_name: reservation.room.roomName,
      building_name: reservation.room.building.name,
    })
  } catch (err) {
    console.error('Create reservation error:', err)
    res.status(500).json({ message: 'Failed to create reservation.' })
  }
})

// PUT /api/reservations/:id/status
router.put('/:id/status', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected.' })
    }

    const reservation = await prisma.reservation.update({
      where: { id: parseInt(req.params.id) },
      data: { status, adminNotes: notes || null },
      include: {
        user: { select: { id: true, name: true, email: true } },
        room: { include: { building: true } },
      },
    })

    res.json({
      id: reservation.id,
      status: reservation.status,
      admin_notes: reservation.adminNotes,
      doctor_name: reservation.user.name,
      room_name: reservation.room.roomName,
      building_name: reservation.room.building.name,
    })
  } catch (err) {
    console.error('Update reservation status error:', err)
    res.status(500).json({ message: 'Failed to update reservation status.' })
  }
})

// DELETE /api/reservations/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(req.params.id) },
    })

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' })
    }

    // Only the owner or admin can cancel
    if (reservation.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation.' })
    }

    await prisma.reservation.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'cancelled' },
    })

    res.json({ message: 'Reservation cancelled.' })
  } catch (err) {
    console.error('Cancel reservation error:', err)
    res.status(500).json({ message: 'Failed to cancel reservation.' })
  }
})

module.exports = router
