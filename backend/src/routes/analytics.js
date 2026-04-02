const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/analytics/summary
router.get('/summary', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const [totalRooms, totalUsers, totalReservations, pendingCount, approvedCount, rejectedCount] =
      await Promise.all([
        prisma.room.count(),
        prisma.user.count({ where: { role: 'doctor' } }),
        prisma.reservation.count(),
        prisma.reservation.count({ where: { status: 'pending' } }),
        prisma.reservation.count({ where: { status: 'approved' } }),
        prisma.reservation.count({ where: { status: 'rejected' } }),
      ])

    // Usage by building
    const buildings = await prisma.building.findMany({
      include: {
        rooms: {
          include: { _count: { select: { reservations: true } } },
        },
      },
    })

    const usageByBuilding = buildings.map(b => ({
      name: b.name,
      code: b.code,
      total_rooms: b.rooms.length,
      total_reservations: b.rooms.reduce((sum, r) => sum + r._count.reservations, 0),
    }))

    // Room type distribution
    const roomTypes = await prisma.room.groupBy({
      by: ['roomType'],
      _count: { id: true },
    })

    const roomTypeDistribution = roomTypes.map(rt => ({
      type: rt.roomType,
      count: rt._count.id,
    }))

    // Top departments
    const topDepartments = await prisma.reservation.groupBy({
      by: ['userId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    })

    const userIds = topDepartments.map(td => td.userId)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, department: true },
    })

    const deptMap = {}
    for (const td of topDepartments) {
      const user = users.find(u => u.id === td.userId)
      const dept = user?.department || 'Unknown'
      deptMap[dept] = (deptMap[dept] || 0) + td._count.id
    }

    const departmentUsage = Object.entries(deptMap)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count)

    res.json({
      total_rooms: totalRooms,
      total_users: totalUsers,
      total_reservations: totalReservations,
      pending_approvals: pendingCount,
      approved_count: approvedCount,
      rejected_count: rejectedCount,
      usage_by_building: usageByBuilding,
      room_type_distribution: roomTypeDistribution,
      department_usage: departmentUsage,
      system_health: 98,
    })
  } catch (err) {
    console.error('Analytics summary error:', err)
    res.status(500).json({ message: 'Failed to fetch analytics.' })
  }
})

module.exports = router
