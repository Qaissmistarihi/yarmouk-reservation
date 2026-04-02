# System Architecture — Yarmouk Reservation

## Overview

A full-stack web application for managing classroom and hall reservations at Yarmouk University. The system supports two user roles: **Admin** (manages rooms, buildings, users, and approves reservations) and **Doctor** (searches rooms, creates reservations, views calendar).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TailwindCSS |
| Backend | Express.js + Node.js |
| ORM | Prisma |
| Database | MySQL 8 |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| HTTP Client | Axios |
| Calendar | FullCalendar |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |

---

## Project Structure

```
yarmouk-reservation/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── context/       # AuthContext (global auth state)
│   │   ├── layouts/       # AdminLayout, PortalLayout
│   │   ├── pages/
│   │   │   ├── admin/     # Dashboard, Rooms, Buildings, Reservations, Users, Calendar, Analytics, ExamDistribution
│   │   │   ├── portal/    # Dashboard, FindRoom, MyReservations, Calendar, Chatbot
│   │   │   └── public/    # LandingPage, LoginPage, RegisterPage
│   │   ├── routes/        # AppRouter, ProtectedRoute
│   │   └── services/      # api.js, authService, roomService, reservationService
│   ├── vite.config.js
│   └── package.json
│
├── backend/           # Express.js API server
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── src/
│   │   ├── middleware/     # JWT auth middleware
│   │   ├── routes/        # auth, buildings, rooms, reservations, users, analytics
│   │   ├── index.js       # Server entry point
│   │   └── seed.js        # Database seeder
│   ├── .env
│   └── package.json
│
├── database/          # SQL schema & ERD documentation
│   ├── schema.sql
│   └── ERD.md
│
├── design/            # Architecture & API documentation
│   ├── ARCHITECTURE.md
│   └── API.md
│
└── README.md
```

---

## Authentication Flow

1. User submits email + password via Login/Register page
2. Frontend sends `POST /api/auth/login` or `/api/auth/register`
3. Backend validates credentials, returns `{ token, user }`
4. Frontend stores `token` and `user` in `localStorage`
5. All subsequent API calls include `Authorization: Bearer <token>` header
6. Backend middleware verifies JWT on every protected route
7. On 401 response, frontend clears storage and redirects to `/login`

---

## Role-Based Access

| Feature | Admin | Doctor |
|---|:---:|:---:|
| Dashboard | ✅ | ✅ |
| Manage Buildings | ✅ | ❌ |
| Manage Rooms | ✅ | ❌ |
| Manage Users | ✅ | ❌ |
| View All Reservations | ✅ | ❌ |
| Approve/Reject Reservations | ✅ | ❌ |
| Analytics | ✅ | ❌ |
| Exam Distribution | ✅ | ❌ |
| Find & Book Rooms | ❌ | ✅ |
| My Reservations | ❌ | ✅ |
| Personal Calendar | ❌ | ✅ |
| Chatbot | ❌ | ✅ |

---

## Data Flow

```
Browser (React)
    │
    │  HTTP (Axios)
    ▼
Vite Dev Proxy (:3000)
    │
    │  /api/* → :5000
    ▼
Express Server (:5000)
    │
    │  Prisma ORM
    ▼
MySQL Database (:3306)
```
