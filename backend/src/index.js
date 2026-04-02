require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const authRoutes = require('./routes/auth')
const buildingRoutes = require('./routes/buildings')
const roomRoutes = require('./routes/rooms')
const reservationRoutes = require('./routes/reservations')
const userRoutes = require('./routes/users')
const analyticsRoutes = require('./routes/analytics')
const aiRoutes = require('./routes/ai')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/buildings', buildingRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/users', userRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
