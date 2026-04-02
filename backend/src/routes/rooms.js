const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Helper: map Prisma room to frontend-friendly format
function mapRoom(r) {
  return {
    id: r.id,
    room_name: r.roomName,
    building_id: r.buildingId,
    capacity: r.capacity,
    room_type: r.roomType,
    status: r.status,
    building_name: r.building?.name ?? '',
    building_code: r.building?.code ?? '',
    created_at: r.createdAt,
  }
}

// GET /api/rooms
router.get('/', authenticate, async (req, res) => {
  try {
    const { building_id, room_type, status, capacity, date } = req.query
    const where = {}

    if (building_id) where.buildingId = parseInt(building_id)
    if (room_type) where.roomType = room_type
    if (status) where.status = status
    if (capacity) where.capacity = { gte: parseInt(capacity) }

    const rooms = await prisma.room.findMany({
      where,
      include: { building: true },
      orderBy: { roomName: 'asc' },
    })

    res.json(rooms.map(mapRoom))
  } catch (err) {
    console.error('Get rooms error:', err)
    res.status(500).json({ message: 'Failed to fetch rooms.' })
  }
})

// GET /api/rooms/available
router.get('/available', authenticate, async (req, res) => {
  try {
    const { date, start_time, end_time, building_id, capacity } = req.query
    const where = { status: 'available' }

    if (building_id) where.buildingId = parseInt(building_id)
    if (capacity) where.capacity = { gte: parseInt(capacity) }

    let rooms = await prisma.room.findMany({
      where,
      include: { building: true },
      orderBy: { roomName: 'asc' },
    })

    // Filter out rooms that have conflicting reservations
    if (date && start_time && end_time) {
      const conflicts = await prisma.reservation.findMany({
        where: {
          date: new Date(date),
          status: { in: ['pending', 'approved'] },
          startTime: { lt: end_time },
          endTime: { gt: start_time },
        },
        select: { roomId: true },
      })
      const conflictIds = new Set(conflicts.map(c => c.roomId))
      rooms = rooms.filter(r => !conflictIds.has(r.id))
    }

    res.json(rooms.map(mapRoom))
  } catch (err) {
    console.error('Get available rooms error:', err)
    res.status(500).json({ message: 'Failed to fetch available rooms.' })
  }
})

// POST /api/rooms
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { room_name, building_id, capacity, room_type, status } = req.body
    if (!room_name || !building_id || !capacity) {
      return res.status(400).json({ message: 'Room name, building, and capacity are required.' })
    }

    const room = await prisma.room.create({
      data: {
        roomName: room_name,
        buildingId: parseInt(building_id),
        capacity: parseInt(capacity),
        roomType: room_type || 'lecture_hall',
        status: status || 'available',
      },
      include: { building: true },
    })
    res.status(201).json(mapRoom(room))
  } catch (err) {
    console.error('Create room error:', err)
    res.status(500).json({ message: 'Failed to create room.' })
  }
})

// PUT /api/rooms/:id
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { room_name, building_id, capacity, room_type, status } = req.body
    const data = {}
    if (room_name !== undefined) data.roomName = room_name
    if (building_id !== undefined) data.buildingId = parseInt(building_id)
    if (capacity !== undefined) data.capacity = parseInt(capacity)
    if (room_type !== undefined) data.roomType = room_type
    if (status !== undefined) data.status = status

    const room = await prisma.room.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { building: true },
    })
    res.json(mapRoom(room))
  } catch (err) {
    console.error('Update room error:', err)
    res.status(500).json({ message: 'Failed to update room.' })
  }
})

// DELETE /api/rooms/:id
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    await prisma.room.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Room deleted.' })
  } catch (err) {
    console.error('Delete room error:', err)
    res.status(500).json({ message: 'Failed to delete room.' })
  }
})

module.exports = router
