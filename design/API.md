# API Documentation — Yarmouk Reservation

Base URL: `http://localhost:5000/api`

All protected endpoints require: `Authorization: Bearer <token>`

---

## Authentication

### POST /auth/register
Create a new doctor account.

**Body:**
```json
{
  "name": "Dr. Ahmad",
  "email": "ahmad@yu.edu.jo",
  "password": "securepass",
  "department": "Computer Science"
}
```

**Response (201):**
```json
{
  "token": "jwt-token-here",
  "user": { "id": 1, "name": "Dr. Ahmad", "email": "ahmad@yu.edu.jo", "role": "doctor", "department": "Computer Science" }
}
```

### POST /auth/login
Authenticate a user.

**Body:**
```json
{ "email": "admin@yu.edu.jo", "password": "admin123" }
```

**Response (200):**
```json
{
  "token": "jwt-token-here",
  "user": { "id": 1, "name": "System Admin", "email": "admin@yu.edu.jo", "role": "admin", "department": "IT Department" }
}
```

---

## Buildings (Admin only for CUD)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /buildings | ✅ | List all buildings |
| POST | /buildings | ✅ Admin | Create building |
| PUT | /buildings/:id | ✅ Admin | Update building |
| DELETE | /buildings/:id | ✅ Admin | Delete building |

**POST/PUT Body:**
```json
{ "name": "Hijawi Faculty", "code": "HE", "description": "Engineering building" }
```

---

## Rooms (Admin only for CUD)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /rooms | ✅ | List rooms (filterable) |
| GET | /rooms/available | ✅ | Available rooms for a time slot |
| POST | /rooms | ✅ Admin | Create room |
| PUT | /rooms/:id | ✅ Admin | Update room |
| DELETE | /rooms/:id | ✅ Admin | Delete room |

**GET /rooms query params:** `building_id`, `room_type`, `status`, `capacity`, `date`

**GET /rooms/available query params:** `date`, `start_time`, `end_time`, `building_id`, `capacity`

**POST/PUT Body:**
```json
{ "room_name": "HE-101", "building_id": 1, "capacity": 60, "room_type": "lecture_hall", "status": "available" }
```

---

## Reservations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /reservations | ✅ | All reservations (admin) or own (doctor) |
| GET | /reservations/mine | ✅ | Current user's reservations |
| POST | /reservations | ✅ | Create a reservation |
| PUT | /reservations/:id/status | ✅ Admin | Approve or reject |
| DELETE | /reservations/:id | ✅ | Cancel reservation (owner or admin) |

**GET /reservations query params:** `status`, `start`, `end`, `limit`

**POST Body:**
```json
{
  "room_id": 1,
  "date": "2025-06-15",
  "start_time": "09:00",
  "end_time": "11:00",
  "students_number": 45,
  "purpose": "Midterm Exam"
}
```

**PUT /reservations/:id/status Body:**
```json
{ "status": "approved", "notes": "Approved for midterm" }
```

---

## Users (Admin only)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /users | ✅ Admin | List all users |
| PUT | /users/:id/status | ✅ Admin | Activate/deactivate user |

**PUT Body:**
```json
{ "status": "inactive" }
```

---

## Analytics (Admin only)

### GET /analytics/summary
Returns system-wide statistics.

**Response:**
```json
{
  "total_rooms": 21,
  "total_users": 4,
  "total_reservations": 20,
  "pending_approvals": 5,
  "approved_count": 12,
  "rejected_count": 3,
  "usage_by_building": [...],
  "room_type_distribution": [...],
  "department_usage": [...],
  "system_health": 98
}
```

---

## Health Check

### GET /health
```json
{ "status": "ok", "timestamp": "2025-06-01T12:00:00.000Z" }
```

---

## Error Responses

All errors follow this format:
```json
{ "message": "Error description here" }
```

| Status | Meaning |
|---|---|
| 400 | Bad request / missing fields |
| 401 | Unauthorized / invalid token |
| 403 | Forbidden / insufficient role |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, time clash) |
| 500 | Internal server error |
