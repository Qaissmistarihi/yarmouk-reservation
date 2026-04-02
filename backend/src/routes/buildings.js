const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/buildings
router.get('/', authenticate, async (req, res) => {
  try {
    const buildings = await prisma.building.findMany({
      include: {
        rooms: {
          select: { id: true, roomName: true, capacity: true, roomType: true, status: true },
          orderBy: { roomName: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    const mapped = buildings.map(b => ({
      id: b.id,
      name: b.name,
      code: b.code,
      description: b.description,
      status: 'active',
      rooms: b.rooms.length,
      room_list: b.rooms.map(r => ({
        id: r.id,
        room_name: r.roomName,
        capacity: r.capacity,
        room_type: r.roomType,
        status: r.status,
      })),
    }))

    res.json(mapped)
  } catch (err) {
    console.error('Get buildings error:', err)
    res.status(500).json({ message: 'Failed to fetch buildings.' })
  }
})

// POST /api/buildings
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name, code, description } = req.body
    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required.' })
    }

    const existing = await prisma.building.findUnique({ where: { code } })
    if (existing) {
      return res.status(409).json({ message: 'Building code already exists.' })
    }

    const building = await prisma.building.create({ data: { name, code, description } })
    res.status(201).json(building)
  } catch (err) {
    console.error('Create building error:', err)
    res.status(500).json({ message: 'Failed to create building.' })
  }
})

// PUT /api/buildings/:id
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name, code, description } = req.body
    const building = await prisma.building.update({
      where: { id: parseInt(req.params.id) },
      data: { name, code, description },
    })
    res.json(building)
  } catch (err) {
    console.error('Update building error:', err)
    res.status(500).json({ message: 'Failed to update building.' })
  }
})

// DELETE /api/buildings/:id
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    await prisma.building.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Building deleted.' })
  } catch (err) {
    console.error('Delete building error:', err)
    res.status(500).json({ message: 'Failed to delete building.' })
  }
})

module.exports = router
