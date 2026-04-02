const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

router.post('/exam-distribute', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { total_students, building_id } = req.body
    const total = parseInt(total_students)

    if (!total_students || Number.isNaN(total) || total < 1) {
      return res.status(400).json({ message: 'total_students is required and must be a positive number.' })
    }

    const where = { status: 'available' }
    if (building_id) where.buildingId = parseInt(building_id)

    const rooms = await prisma.room.findMany({
      where,
      include: { building: true },
      orderBy: { capacity: 'desc' },
    })

    if (!rooms.length) {
      return res.status(404).json({ message: 'لا توجد قاعات متاحة للتوزيع ضمن المحددات الحالية.' })
    }

    let remaining = total
    const distribution = []

    for (const room of rooms) {
      if (remaining <= 0) break
      const take = Math.min(remaining, room.capacity)
      if (take <= 0) continue

      distribution.push({
        room_id: room.id,
        room_name: room.roomName,
        building: room.building?.name ?? '',
        building_code: room.building?.code ?? '',
        capacity: room.capacity,
        students: take,
      })
      remaining -= take
    }

    const totalAllocated = total - remaining

    res.json({
      total_students: total,
      total_allocated: totalAllocated,
      remaining_students: remaining,
      distribution,
    })
  } catch (err) {
    console.error('AI exam distribute error:', err)
    res.status(500).json({ message: 'Failed to distribute students.' })
  }
})

module.exports = router
