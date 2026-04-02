const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/users
router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        status: true,
        createdAt: true,
        _count: { select: { reservations: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      status: u.status,
      created_at: u.createdAt,
      reservations_count: u._count.reservations,
    }))

    res.json(mapped)
  } catch (err) {
    console.error('Get users error:', err)
    res.status(500).json({ message: 'Failed to fetch users.' })
  }
})

// PUT /api/users/:id/status
router.put('/:id/status', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.body
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be active or inactive.' })
    }

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      select: { id: true, name: true, email: true, status: true },
    })

    res.json(user)
  } catch (err) {
    console.error('Update user status error:', err)
    res.status(500).json({ message: 'Failed to update user status.' })
  }
})

module.exports = router
