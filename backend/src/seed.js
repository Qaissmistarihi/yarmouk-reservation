require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.reservation.deleteMany()
  await prisma.room.deleteMany()
  await prisma.building.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const doctorPassword = await bcrypt.hash('doctor123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@yu.edu.jo',
      password: adminPassword,
      role: 'admin',
      department: 'IT Department',
    },
  })

  const doctors = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Dr. Ahmad Al-Khateeb',
        email: 'doctor@yu.edu.jo',
        password: doctorPassword,
        role: 'doctor',
        department: 'Computer Science',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Sara Al-Masri',
        email: 'sara@yu.edu.jo',
        password: doctorPassword,
        role: 'doctor',
        department: 'Information Technology',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Mohammad Hasan',
        email: 'mohammad@yu.edu.jo',
        password: doctorPassword,
        role: 'doctor',
        department: 'Software Engineering',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Lina Nasser',
        email: 'lina@yu.edu.jo',
        password: doctorPassword,
        role: 'doctor',
        department: 'Computer Information Systems',
      },
    }),
  ])

  console.log(`Created ${doctors.length + 1} users`)

  // Create buildings
  const buildings = await Promise.all([
    prisma.building.create({
      data: { name: 'مبنى المقدسي', code: 'MQ', description: 'كلية تكنولوجيا المعلومات وعلوم الحاسوب – المبنى الرئيسي للمحاضرات.' },
    }),
    prisma.building.create({
      data: { name: 'مبنى الخوارزمي', code: 'KZ', description: 'كلية تكنولوجيا المعلومات وعلوم الحاسوب – مختبرات ومحاضرات.' },
    }),
    prisma.building.create({
      data: { name: 'مبنى الأمير حسين بن عبدالله الثاني', code: 'PHU', description: 'مبنى القاعات التدريسية – الحرم الرئيسي.' },
    }),
    prisma.building.create({
      data: { name: 'كلية الحجاوي للهندسة', code: 'HE', description: 'كلية الهندسة التكنولوجية – مختبرات وقاعات محاضرات.' },
    }),
    prisma.building.create({
      data: { name: 'مركز الأبحاث', code: 'RC', description: 'مركز الأبحاث والمؤتمرات – قاعات اجتماعات ومدرجات.' },
    }),
  ])

  console.log(`Created ${buildings.length} buildings`)

  // Create rooms
  const roomsData = [
    // المقدسي
    { roomName: 'MQ-101', buildingId: buildings[0].id, capacity: 60, roomType: 'lecture_hall' },
    { roomName: 'MQ-102', buildingId: buildings[0].id, capacity: 45, roomType: 'lecture_hall' },
    { roomName: 'MQ-103', buildingId: buildings[0].id, capacity: 40, roomType: 'lecture_hall' },
    { roomName: 'MQ-مختبر1', buildingId: buildings[0].id, capacity: 30, roomType: 'lab' },
    { roomName: 'MQ-مختبر2', buildingId: buildings[0].id, capacity: 25, roomType: 'lab' },
    { roomName: 'MQ-201', buildingId: buildings[0].id, capacity: 80, roomType: 'lecture_hall' },
    // الخوارزمي
    { roomName: 'KZ-101', buildingId: buildings[1].id, capacity: 50, roomType: 'lecture_hall' },
    { roomName: 'KZ-102', buildingId: buildings[1].id, capacity: 45, roomType: 'lecture_hall' },
    { roomName: 'KZ-مختبر1', buildingId: buildings[1].id, capacity: 35, roomType: 'lab' },
    { roomName: 'KZ-مختبر2', buildingId: buildings[1].id, capacity: 30, roomType: 'lab' },
    { roomName: 'KZ-201', buildingId: buildings[1].id, capacity: 70, roomType: 'lecture_hall' },
    // الأمير حسين
    { roomName: 'PHU-101', buildingId: buildings[2].id, capacity: 55, roomType: 'lecture_hall' },
    { roomName: 'PHU-102', buildingId: buildings[2].id, capacity: 50, roomType: 'lecture_hall' },
    { roomName: 'PHU-مختبر1', buildingId: buildings[2].id, capacity: 25, roomType: 'lab' },
    { roomName: 'PHU-201', buildingId: buildings[2].id, capacity: 100, roomType: 'auditorium' },
    // الحجاوي
    { roomName: 'HE-101', buildingId: buildings[3].id, capacity: 60, roomType: 'lecture_hall' },
    { roomName: 'HE-102', buildingId: buildings[3].id, capacity: 40, roomType: 'lecture_hall' },
    { roomName: 'HE-مختبر1', buildingId: buildings[3].id, capacity: 30, roomType: 'lab' },
    { roomName: 'HE-مختبر2', buildingId: buildings[3].id, capacity: 25, roomType: 'lab' },
    { roomName: 'HE-قاعة اجتماعات', buildingId: buildings[3].id, capacity: 15, roomType: 'meeting_room' },
    // مركز الأبحاث
    { roomName: 'RC-قاعة اجتماعات 1', buildingId: buildings[4].id, capacity: 20, roomType: 'meeting_room' },
    { roomName: 'RC-قاعة اجتماعات 2', buildingId: buildings[4].id, capacity: 12, roomType: 'meeting_room' },
    { roomName: 'RC-المدرج', buildingId: buildings[4].id, capacity: 150, roomType: 'auditorium' },
  ]

  const rooms = await Promise.all(
    roomsData.map(r => prisma.room.create({ data: r }))
  )

  console.log(`Created ${rooms.length} rooms`)

  // Create sample reservations
  const today = new Date()
  const reservationsData = []

  for (let i = 0; i < 20; i++) {
    const dayOffset = Math.floor(Math.random() * 14) - 3 // -3 to +10 days
    const date = new Date(today)
    date.setDate(date.getDate() + dayOffset)

    const startHour = 8 + Math.floor(Math.random() * 8) // 8 AM to 3 PM
    const duration = 1 + Math.floor(Math.random() * 2) // 1-2 hours

    const statuses = ['pending', 'approved', 'approved', 'approved', 'rejected']
    const purposes = [
      'Lecture - Data Structures',
      'Lab Session - Database Systems',
      'Midterm Exam',
      'Research Seminar',
      'Faculty Meeting',
      'Workshop - Machine Learning',
      'Final Exam Review',
      'Guest Lecture',
      'Project Presentation',
      'Tutorial Session',
    ]

    reservationsData.push({
      userId: doctors[Math.floor(Math.random() * doctors.length)].id,
      roomId: rooms[Math.floor(Math.random() * rooms.length)].id,
      date,
      startTime: `${String(startHour).padStart(2, '0')}:00`,
      endTime: `${String(startHour + duration).padStart(2, '0')}:00`,
      studentsNumber: 20 + Math.floor(Math.random() * 60),
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    })
  }

  await Promise.all(
    reservationsData.map(r => prisma.reservation.create({ data: r }))
  )

  console.log(`Created ${reservationsData.length} reservations`)
  console.log('\nSeed completed!')
  console.log('\nDemo accounts:')
  console.log('  Admin: admin@yu.edu.jo / admin123')
  console.log('  Doctor: doctor@yu.edu.jo / doctor123')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
