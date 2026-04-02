# Entity Relationship Diagram (ERD)

## Yarmouk University Room Reservation System

```
┌──────────────────────┐       ┌──────────────────────┐
│       USERS           │       │     BUILDINGS         │
├──────────────────────┤       ├──────────────────────┤
│ PK  id          INT   │       │ PK  id          INT   │
│     name     VARCHAR  │       │     name     VARCHAR  │
│ UK  email    VARCHAR  │       │ UK  code     VARCHAR  │
│     password VARCHAR  │       │     description TEXT   │
│     role     ENUM     │       │     created_at  DT    │
│     department VARCHAR│       │     updated_at  DT    │
│     status   ENUM     │       └──────────┬───────────┘
│     created_at  DT    │                  │
│     updated_at  DT    │                  │ 1
└──────────┬───────────┘                  │
           │                              ▼ *
           │                   ┌──────────────────────┐
           │                   │       ROOMS           │
           │                   ├──────────────────────┤
           │                   │ PK  id          INT   │
           │                   │     room_name VARCHAR  │
           │                   │ FK  building_id INT   │
           │                   │     capacity    INT   │
           │                   │     room_type  ENUM   │
           │                   │     status     ENUM   │
           │                   │     created_at  DT    │
           │                   │     updated_at  DT    │
           │                   └──────────┬───────────┘
           │                              │
           │ 1                          1 │
           │                              │
           ▼ *                          * ▼
        ┌─────────────────────────────────────┐
        │          RESERVATIONS                │
        ├─────────────────────────────────────┤
        │ PK  id               INT             │
        │ FK  user_id          INT             │
        │ FK  room_id          INT             │
        │     date             DATE            │
        │     start_time       VARCHAR         │
        │     end_time         VARCHAR         │
        │     students_number  INT (nullable)  │
        │     purpose          TEXT (nullable)  │
        │     status           ENUM            │
        │     admin_notes      TEXT (nullable)  │
        │     created_at       DATETIME        │
        │     updated_at       DATETIME        │
        └─────────────────────────────────────┘
```

## Relationships

| Relationship | Type | Description |
|---|---|---|
| Users → Reservations | One-to-Many | A user (doctor) can have many reservations |
| Buildings → Rooms | One-to-Many | A building contains many rooms |
| Rooms → Reservations | One-to-Many | A room can have many reservations |

## Enums

| Enum | Values |
|---|---|
| Role | `admin`, `doctor` |
| UserStatus | `active`, `inactive` |
| RoomType | `lecture_hall`, `lab`, `meeting_room`, `auditorium` |
| RoomStatus | `available`, `maintenance`, `occupied` |
| ReservationStatus | `pending`, `approved`, `rejected`, `cancelled` |

## Constraints

- **users.email** — unique index
- **buildings.code** — unique index
- **reservations.room_id + date + start_time/end_time** — conflict check enforced at application level (no overlapping approved/pending reservations for the same room and time)
- All foreign keys use `ON DELETE CASCADE`
