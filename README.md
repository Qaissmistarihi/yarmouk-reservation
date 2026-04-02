# Yarmouk University — Room Reservation System

A full-stack web application for managing classroom and hall reservations at Yarmouk University. Built as a graduation project.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TailwindCSS, FullCalendar, Chart.js |
| Backend | Express.js, Prisma ORM |
| Database | MySQL 8 |
| Auth | JWT + bcryptjs |

## Project Structure

```
yarmouk-reservation/
├── frontend/    →  React + Vite (port 3000)
├── backend/     →  Express + Prisma (port 5000)
├── database/    →  SQL schema & ERD documentation
├── design/      →  Architecture & API documentation
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8 (XAMPP or standalone)

### 1. Database Setup
```bash
# Create the database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS yarmouk_reservation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Backend
```bash
cd backend
npm install
# Edit .env if needed (DATABASE_URL, JWT_SECRET)
npx prisma db push
npm run seed       # Populate with demo data
npm run dev        # Starts on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev        # Starts on http://localhost:3000
```

### Demo Accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@yu.edu.jo | admin123 |
| Doctor | doctor@yu.edu.jo | doctor123 |

## API Documentation
See [design/API.md](design/API.md)

## Database Schema
See [database/ERD.md](database/ERD.md) and [database/schema.sql](database/schema.sql)

## Architecture
See [design/ARCHITECTURE.md](design/ARCHITECTURE.md)
