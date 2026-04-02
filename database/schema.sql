-- ============================================================
-- Yarmouk University Room Reservation System - Database Schema
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS yarmouk_reservation
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE yarmouk_reservation;

-- ──────────────────────────────────────────────
-- USERS TABLE
-- ──────────────────────────────────────────────
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin','doctor') NOT NULL DEFAULT 'doctor',
  department  VARCHAR(255) NULL,
  status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ──────────────────────────────────────────────
-- BUILDINGS TABLE
-- ──────────────────────────────────────────────
CREATE TABLE buildings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  code        VARCHAR(50)  NOT NULL UNIQUE,
  description TEXT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_buildings_code (code)
) ENGINE=InnoDB;

-- ──────────────────────────────────────────────
-- ROOMS TABLE
-- ──────────────────────────────────────────────
CREATE TABLE rooms (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  room_name   VARCHAR(255) NOT NULL,
  building_id INT NOT NULL,
  capacity    INT NOT NULL,
  room_type   ENUM('lecture_hall','lab','meeting_room','auditorium') NOT NULL DEFAULT 'lecture_hall',
  status      ENUM('available','maintenance','occupied') NOT NULL DEFAULT 'available',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
  INDEX idx_rooms_building (building_id),
  INDEX idx_rooms_type (room_type),
  INDEX idx_rooms_status (status)
) ENGINE=InnoDB;

-- ──────────────────────────────────────────────
-- RESERVATIONS TABLE
-- ──────────────────────────────────────────────
CREATE TABLE reservations (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  room_id         INT NOT NULL,
  date            DATE NOT NULL,
  start_time      VARCHAR(10) NOT NULL,
  end_time        VARCHAR(10) NOT NULL,
  students_number INT NULL,
  purpose         TEXT NULL,
  status          ENUM('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
  admin_notes     TEXT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  INDEX idx_reservations_user (user_id),
  INDEX idx_reservations_room (room_id),
  INDEX idx_reservations_date (date),
  INDEX idx_reservations_status (status)
) ENGINE=InnoDB;
