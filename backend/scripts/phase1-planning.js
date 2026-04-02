/**
 * Phase 1 Planning Documentation Generator
 * Yarmouk University Room Reservation System
 * Generates: design/PHASE1_PLANNING.docx with embedded diagram images
 */

'use strict'
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  TableBorders, BorderStyle, ShadingType, ImageRun,
  PageBreak, NumberFormat, LevelFormat,
  convertInchesToTwip, UnderlineType,
} = require('docx')

const DESIGN_DIR = path.resolve(__dirname, '..', '..', 'design')
if (!fs.existsSync(DESIGN_DIR)) fs.mkdirSync(DESIGN_DIR, { recursive: true })

/* ══════════════════════════════════════════════════════════
   SVG DIAGRAM GENERATORS
══════════════════════════════════════════════════════════ */

function svgArchitecture() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="820" height="560" font-family="Arial, sans-serif">
  <!-- background -->
  <rect width="820" height="560" fill="#f8f9ff" rx="10"/>
  <text x="410" y="36" font-size="20" font-weight="bold" fill="#171b2a" text-anchor="middle">System Architecture — 3-Tier Design</text>

  <!-- TIER 1: Client -->
  <rect x="30" y="60" width="760" height="140" rx="8" fill="#e8eaff" stroke="#4744e5" stroke-width="2"/>
  <text x="50" y="82" font-size="13" font-weight="bold" fill="#4744e5">CLIENT LAYER  (Browser — Port 3000)</text>
  <rect x="80" y="95" width="260" height="80" rx="6" fill="#4744e5" stroke="#4744e5" stroke-width="1.5"/>
  <text x="210" y="128" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">Admin Panel</text>
  <text x="210" y="148" font-size="11" fill="#ccc" text-anchor="middle">React 19 + Vite + TailwindCSS</text>
  <text x="210" y="164" font-size="10" fill="#bbb" text-anchor="middle">Dashboard · Rooms · Reservations · Analytics</text>

  <rect x="480" y="95" width="260" height="80" rx="6" fill="#6161ff" stroke="#4744e5" stroke-width="1.5"/>
  <text x="610" y="128" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">Doctor Portal</text>
  <text x="610" y="148" font-size="11" fill="#ccc" text-anchor="middle">React 19 + Vite + TailwindCSS</text>
  <text x="610" y="164" font-size="10" fill="#bbb" text-anchor="middle">Find Room · My Reservations · Calendar · Chatbot</text>

  <!-- Arrow down to API -->
  <line x1="210" y1="200" x2="210" y2="245" stroke="#4744e5" stroke-width="2" marker-end="url(#arr)"/>
  <line x1="610" y1="200" x2="610" y2="245" stroke="#4744e5" stroke-width="2" marker-end="url(#arr)"/>
  <line x1="410" y1="200" x2="410" y2="245" stroke="#4744e5" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="440" y="228" font-size="10" fill="#4744e5">HTTP / Axios</text>

  <!-- TIER 2: API -->
  <rect x="30" y="245" width="760" height="150" rx="8" fill="#fff7ed" stroke="#d97706" stroke-width="2"/>
  <text x="50" y="267" font-size="13" font-weight="bold" fill="#d97706">API LAYER  (Express.js — Port 5000)</text>
  <rect x="60" y="278" width="700" height="34" rx="5" fill="#fde68a" stroke="#d97706" stroke-width="1.5"/>
  <text x="410" y="300" font-size="12" font-weight="bold" fill="#78350f" text-anchor="middle">JWT Authentication Middleware  ·  Role Authorization (admin / doctor)</text>
  <rect x="60" y="320" width="100" height="54" rx="5" fill="#d97706"/>
  <text x="110" y="345" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold">auth</text>
  <text x="110" y="362" font-size="9" fill="#ffe" text-anchor="middle">register/login</text>
  <rect x="170" y="320" width="100" height="54" rx="5" fill="#d97706"/>
  <text x="220" y="345" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold">buildings</text>
  <text x="220" y="362" font-size="9" fill="#ffe" text-anchor="middle">CRUD</text>
  <rect x="280" y="320" width="100" height="54" rx="5" fill="#d97706"/>
  <text x="330" y="345" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold">rooms</text>
  <text x="330" y="362" font-size="9" fill="#ffe" text-anchor="middle">CRUD + available</text>
  <rect x="390" y="320" width="110" height="54" rx="5" fill="#d97706"/>
  <text x="445" y="345" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold">reservations</text>
  <text x="445" y="362" font-size="9" fill="#ffe" text-anchor="middle">CRUD + status</text>
  <rect x="510" y="320" width="90" height="54" rx="5" fill="#d97706"/>
  <text x="555" y="345" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold">users</text>
  <text x="555" y="362" font-size="9" fill="#ffe" text-anchor="middle">list + manage</text>
  <rect x="610" y="320" width="90" height="54" rx="5" fill="#d97706"/>
  <text x="655" y="345" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold">analytics</text>
  <text x="655" y="362" font-size="9" fill="#ffe" text-anchor="middle">summary stats</text>
  <rect x="710" y="320" width="60" height="54" rx="5" fill="#b45309"/>
  <text x="740" y="345" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold">ai</text>
  <text x="740" y="362" font-size="9" fill="#ffe" text-anchor="middle">exam dist.</text>

  <!-- Arrow down to DB -->
  <line x1="410" y1="395" x2="410" y2="445" stroke="#d97706" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="425" y="425" font-size="10" fill="#d97706">Prisma ORM</text>

  <!-- TIER 3: Database -->
  <rect x="30" y="445" width="760" height="95" rx="8" fill="#ecfdf5" stroke="#059669" stroke-width="2"/>
  <text x="50" y="467" font-size="13" font-weight="bold" fill="#059669">DATABASE LAYER  (MySQL 8 — Port 3306)</text>
  <rect x="80" y="476" width="140" height="45" rx="5" fill="#059669"/>
  <text x="150" y="504" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">users</text>
  <rect x="240" y="476" width="140" height="45" rx="5" fill="#059669"/>
  <text x="310" y="504" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">buildings</text>
  <rect x="400" y="476" width="140" height="45" rx="5" fill="#059669"/>
  <text x="470" y="504" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">rooms</text>
  <rect x="560" y="476" width="190" height="45" rx="5" fill="#047857"/>
  <text x="655" y="504" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">reservations</text>

  <!-- Arrow markers -->
  <defs>
    <marker id="arr" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#4744e5"/>
    </marker>
    <marker id="arr2" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#d97706"/>
    </marker>
  </defs>
</svg>`
}

function svgERD() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" font-family="Arial, sans-serif">
  <rect width="900" height="600" fill="#f8f9ff" rx="10"/>
  <text x="450" y="36" font-size="20" font-weight="bold" fill="#171b2a" text-anchor="middle">Entity Relationship Diagram (ERD)</text>

  <!-- USERS -->
  <rect x="40" y="60" width="200" height="265" rx="6" fill="#e8eaff" stroke="#4744e5" stroke-width="2"/>
  <rect x="40" y="60" width="200" height="34" rx="6" fill="#4744e5"/>
  <text x="140" y="83" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">USERS</text>
  <text x="55" y="112" font-size="11" fill="#171b2a">PK  id  INT</text>
  <text x="55" y="130" font-size="11" fill="#171b2a">    name  VARCHAR</text>
  <text x="55" y="148" font-size="11" fill="#171b2a">UK  email  VARCHAR</text>
  <text x="55" y="166" font-size="11" fill="#171b2a">    password  VARCHAR</text>
  <text x="55" y="184" font-size="11" fill="#4744e5" font-weight="bold">    role  ENUM</text>
  <text x="120" y="184" font-size="9" fill="#666">  admin|doctor</text>
  <text x="55" y="202" font-size="11" fill="#171b2a">    department  VARCHAR</text>
  <text x="55" y="220" font-size="11" fill="#4744e5" font-weight="bold">    status  ENUM</text>
  <text x="130" y="220" font-size="9" fill="#666">  active|inactive</text>
  <text x="55" y="238" font-size="11" fill="#171b2a">    created_at  DT</text>
  <text x="55" y="256" font-size="11" fill="#171b2a">    updated_at  DT</text>

  <!-- BUILDINGS -->
  <rect x="660" y="60" width="210" height="220" rx="6" fill="#fff7ed" stroke="#d97706" stroke-width="2"/>
  <rect x="660" y="60" width="210" height="34" rx="6" fill="#d97706"/>
  <text x="765" y="83" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">BUILDINGS</text>
  <text x="675" y="112" font-size="11" fill="#171b2a">PK  id  INT</text>
  <text x="675" y="130" font-size="11" fill="#171b2a">    name  VARCHAR</text>
  <text x="675" y="148" font-size="11" fill="#171b2a">UK  code  VARCHAR</text>
  <text x="675" y="166" font-size="11" fill="#171b2a">    description  TEXT</text>
  <text x="675" y="184" font-size="11" fill="#171b2a">    created_at  DT</text>
  <text x="675" y="202" font-size="11" fill="#171b2a">    updated_at  DT</text>

  <!-- ROOMS -->
  <rect x="660" y="330" width="210" height="230" rx="6" fill="#ecfdf5" stroke="#059669" stroke-width="2"/>
  <rect x="660" y="330" width="210" height="34" rx="6" fill="#059669"/>
  <text x="765" y="353" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">ROOMS</text>
  <text x="675" y="382" font-size="11" fill="#171b2a">PK  id  INT</text>
  <text x="675" y="400" font-size="11" fill="#171b2a">    room_name  VARCHAR</text>
  <text x="675" y="418" font-size="11" fill="#059669" font-weight="bold">FK  building_id  INT</text>
  <text x="675" y="436" font-size="11" fill="#171b2a">    capacity  INT</text>
  <text x="675" y="454" font-size="11" fill="#4744e5" font-weight="bold">    room_type  ENUM</text>
  <text x="675" y="472" font-size="9" fill="#666">    lecture_hall|lab|meeting_room|auditorium</text>
  <text x="675" y="490" font-size="11" fill="#4744e5" font-weight="bold">    status  ENUM</text>
  <text x="675" y="508" font-size="9" fill="#666">    available|maintenance|occupied</text>
  <text x="675" y="524" font-size="11" fill="#171b2a">    created_at / updated_at  DT</text>

  <!-- RESERVATIONS -->
  <rect x="310" y="200" width="250" height="370" rx="6" fill="#fdf2f2" stroke="#ba1a1a" stroke-width="2"/>
  <rect x="310" y="200" width="250" height="34" rx="6" fill="#ba1a1a"/>
  <text x="435" y="223" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">RESERVATIONS</text>
  <text x="325" y="252" font-size="11" fill="#171b2a">PK  id  INT</text>
  <text x="325" y="270" font-size="11" fill="#4744e5" font-weight="bold">FK  user_id  INT</text>
  <text x="325" y="288" font-size="11" fill="#059669" font-weight="bold">FK  room_id  INT</text>
  <text x="325" y="306" font-size="11" fill="#171b2a">    date  DATE</text>
  <text x="325" y="324" font-size="11" fill="#171b2a">    start_time  VARCHAR</text>
  <text x="325" y="342" font-size="11" fill="#171b2a">    end_time  VARCHAR</text>
  <text x="325" y="360" font-size="11" fill="#171b2a">    students_number  INT</text>
  <text x="325" y="378" font-size="11" fill="#171b2a">    purpose  TEXT</text>
  <text x="325" y="396" font-size="11" fill="#ba1a1a" font-weight="bold">    status  ENUM</text>
  <text x="325" y="414" font-size="9" fill="#666">    pending|approved|rejected|cancelled</text>
  <text x="325" y="432" font-size="11" fill="#171b2a">    admin_notes  TEXT</text>
  <text x="325" y="450" font-size="11" fill="#171b2a">    created_at / updated_at  DT</text>

  <!-- Relationship lines -->
  <!-- USERS 1→* RESERVATIONS -->
  <line x1="240" y1="192" x2="310" y2="320" stroke="#4744e5" stroke-width="2"/>
  <text x="245" y="260" font-size="11" fill="#4744e5" font-weight="bold">1</text>
  <text x="297" y="315" font-size="11" fill="#4744e5" font-weight="bold">*</text>

  <!-- BUILDINGS 1→* ROOMS -->
  <line x1="765" y1="280" x2="765" y2="330" stroke="#d97706" stroke-width="2"/>
  <text x="774" y="305" font-size="11" fill="#d97706" font-weight="bold">1</text>
  <text x="774" y="328" font-size="11" fill="#d97706" font-weight="bold">*</text>

  <!-- ROOMS 1→* RESERVATIONS -->
  <line x1="660" y1="440" x2="560" y2="370" stroke="#059669" stroke-width="2"/>
  <text x="648" y="437" font-size="11" fill="#059669" font-weight="bold">1</text>
  <text x="558" y="368" font-size="11" fill="#059669" font-weight="bold">*</text>

  <!-- Legend -->
  <rect x="40" y="490" width="250" height="90" rx="6" fill="#f0f0f0" stroke="#999" stroke-width="1"/>
  <text x="165" y="508" font-size="11" font-weight="bold" fill="#171b2a" text-anchor="middle">Legend</text>
  <rect x="55" y="515" width="16" height="16" fill="#4744e5" rx="2"/><text x="78" y="528" font-size="10" fill="#171b2a">Primary Key (PK)</text>
  <rect x="55" y="537" width="16" height="16" fill="#d97706" rx="2"/><text x="78" y="550" font-size="10" fill="#171b2a">Foreign Key (FK)</text>
  <rect x="55" y="558" width="16" height="16" fill="#ba1a1a" rx="2"/><text x="78" y="572" font-size="10" fill="#171b2a">Unique Key (UK)</text>
</svg>`
}

function svgUseCases() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="580" font-family="Arial, sans-serif">
  <rect width="900" height="580" fill="#f8f9ff" rx="10"/>
  <text x="450" y="36" font-size="20" font-weight="bold" fill="#171b2a" text-anchor="middle">Use Case Diagram</text>

  <!-- System boundary -->
  <rect x="160" y="55" width="580" height="500" rx="10" fill="#fff" stroke="#4744e5" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="450" y="78" font-size="13" font-weight="bold" fill="#4744e5" text-anchor="middle">Room Reservation System</text>

  <!-- Admin Actor -->
  <circle cx="80" cy="180" r="20" fill="none" stroke="#d97706" stroke-width="2.5"/>
  <line x1="80" y1="200" x2="80" y2="248" stroke="#d97706" stroke-width="2.5"/>
  <line x1="80" y1="215" x2="55" y2="240" stroke="#d97706" stroke-width="2.5"/>
  <line x1="80" y1="215" x2="105" y2="240" stroke="#d97706" stroke-width="2.5"/>
  <line x1="80" y1="248" x2="60" y2="280" stroke="#d97706" stroke-width="2.5"/>
  <line x1="80" y1="248" x2="100" y2="280" stroke="#d97706" stroke-width="2.5"/>
  <text x="80" y="298" font-size="13" font-weight="bold" fill="#d97706" text-anchor="middle">Admin</text>

  <!-- Doctor Actor -->
  <circle cx="820" cy="240" r="20" fill="none" stroke="#4744e5" stroke-width="2.5"/>
  <line x1="820" y1="260" x2="820" y2="308" stroke="#4744e5" stroke-width="2.5"/>
  <line x1="820" y1="275" x2="795" y2="300" stroke="#4744e5" stroke-width="2.5"/>
  <line x1="820" y1="275" x2="845" y2="300" stroke="#4744e5" stroke-width="2.5"/>
  <line x1="820" y1="308" x2="800" y2="340" stroke="#4744e5" stroke-width="2.5"/>
  <line x1="820" y1="308" x2="840" y2="340" stroke="#4744e5" stroke-width="2.5"/>
  <text x="820" y="358" font-size="13" font-weight="bold" fill="#4744e5" text-anchor="middle">Doctor</text>

  <!-- Admin use cases (left side inside boundary) -->
  <ellipse cx="340" cy="110" rx="130" ry="22" fill="#fff7ed" stroke="#d97706" stroke-width="1.5"/>
  <text x="340" y="115" font-size="11" fill="#78350f" text-anchor="middle">Manage Buildings</text>

  <ellipse cx="340" cy="165" rx="130" ry="22" fill="#fff7ed" stroke="#d97706" stroke-width="1.5"/>
  <text x="340" y="170" font-size="11" fill="#78350f" text-anchor="middle">Manage Rooms</text>

  <ellipse cx="340" cy="220" rx="130" ry="22" fill="#fff7ed" stroke="#d97706" stroke-width="1.5"/>
  <text x="340" y="225" font-size="11" fill="#78350f" text-anchor="middle">Manage Users</text>

  <ellipse cx="340" cy="275" rx="130" ry="22" fill="#fff7ed" stroke="#d97706" stroke-width="1.5"/>
  <text x="340" y="280" font-size="11" fill="#78350f" text-anchor="middle">View All Reservations</text>

  <ellipse cx="340" cy="330" rx="130" ry="22" fill="#fff7ed" stroke="#d97706" stroke-width="1.5"/>
  <text x="340" y="335" font-size="11" fill="#78350f" text-anchor="middle">Approve / Reject Reservations</text>

  <ellipse cx="340" cy="385" rx="130" ry="22" fill="#fff7ed" stroke="#d97706" stroke-width="1.5"/>
  <text x="340" y="390" font-size="11" fill="#78350f" text-anchor="middle">View Analytics</text>

  <ellipse cx="340" cy="440" rx="130" ry="22" fill="#fff7ed" stroke="#d97706" stroke-width="1.5"/>
  <text x="340" y="445" font-size="11" fill="#78350f" text-anchor="middle">AI Exam Distribution</text>

  <!-- Doctor use cases (right side inside boundary) -->
  <ellipse cx="590" cy="120" rx="110" ry="22" fill="#e8eaff" stroke="#4744e5" stroke-width="1.5"/>
  <text x="590" y="125" font-size="11" fill="#2e2c8f" text-anchor="middle">Login / Register</text>

  <ellipse cx="590" cy="185" rx="110" ry="22" fill="#e8eaff" stroke="#4744e5" stroke-width="1.5"/>
  <text x="590" y="190" font-size="11" fill="#2e2c8f" text-anchor="middle">Search Available Rooms</text>

  <ellipse cx="590" cy="250" rx="110" ry="22" fill="#e8eaff" stroke="#4744e5" stroke-width="1.5"/>
  <text x="590" y="255" font-size="11" fill="#2e2c8f" text-anchor="middle">Create Reservation</text>

  <ellipse cx="590" cy="315" rx="110" ry="22" fill="#e8eaff" stroke="#4744e5" stroke-width="1.5"/>
  <text x="590" y="320" font-size="11" fill="#2e2c8f" text-anchor="middle">Cancel Reservation</text>

  <ellipse cx="590" cy="380" rx="110" ry="22" fill="#e8eaff" stroke="#4744e5" stroke-width="1.5"/>
  <text x="590" y="385" font-size="11" fill="#2e2c8f" text-anchor="middle">View My Reservations</text>

  <ellipse cx="590" cy="445" rx="110" ry="22" fill="#e8eaff" stroke="#4744e5" stroke-width="1.5"/>
  <text x="590" y="450" font-size="11" fill="#2e2c8f" text-anchor="middle">View Calendar / Chatbot</text>

  <!-- Connection lines Admin -->
  <line x1="118" y1="190" x2="210" y2="140" stroke="#d97706" stroke-width="1.2"/>
  <line x1="118" y1="200" x2="210" y2="185" stroke="#d97706" stroke-width="1.2"/>
  <line x1="118" y1="210" x2="210" y2="230" stroke="#d97706" stroke-width="1.2"/>
  <line x1="118" y1="220" x2="210" y2="275" stroke="#d97706" stroke-width="1.2"/>
  <line x1="118" y1="225" x2="210" y2="330" stroke="#d97706" stroke-width="1.2"/>
  <line x1="118" y1="228" x2="210" y2="385" stroke="#d97706" stroke-width="1.2"/>
  <line x1="118" y1="230" x2="210" y2="440" stroke="#d97706" stroke-width="1.2"/>

  <!-- Connection lines Doctor -->
  <line x1="782" y1="248" x2="700" y2="145" stroke="#4744e5" stroke-width="1.2"/>
  <line x1="784" y1="250" x2="700" y2="210" stroke="#4744e5" stroke-width="1.2"/>
  <line x1="784" y1="255" x2="700" y2="270" stroke="#4744e5" stroke-width="1.2"/>
  <line x1="784" y1="260" x2="700" y2="335" stroke="#4744e5" stroke-width="1.2"/>
  <line x1="783" y1="265" x2="700" y2="400" stroke="#4744e5" stroke-width="1.2"/>
  <line x1="782" y1="268" x2="700" y2="460" stroke="#4744e5" stroke-width="1.2"/>
</svg>`
}

function svgReservationFlow() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="820" height="640" font-family="Arial, sans-serif">
  <rect width="820" height="640" fill="#f8f9ff" rx="10"/>
  <text x="410" y="36" font-size="20" font-weight="bold" fill="#171b2a" text-anchor="middle">Reservation Lifecycle — Workflow</text>

  <defs>
    <marker id="a" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#464555"/>
    </marker>
    <marker id="ag" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#059669"/>
    </marker>
    <marker id="ar" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#ba1a1a"/>
    </marker>
  </defs>

  <!-- Step 1: Doctor submits -->
  <rect x="260" y="55" width="300" height="52" rx="26" fill="#4744e5" stroke="#4744e5" stroke-width="1.5"/>
  <text x="410" y="78" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">Doctor Submits Reservation</text>
  <text x="410" y="97" font-size="11" fill="#ccc" text-anchor="middle">Fills: date, time, room, purpose, students</text>
  <line x1="410" y1="107" x2="410" y2="145" stroke="#464555" stroke-width="2" marker-end="url(#a)"/>

  <!-- Step 2: Conflict check -->
  <polygon points="410,145 545,185 410,225 275,185" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="410" y="180" font-size="12" font-weight="bold" fill="#78350f" text-anchor="middle">Time Conflict?</text>
  <text x="410" y="198" font-size="10" fill="#78350f" text-anchor="middle">Room + Date + Time overlap</text>

  <!-- Yes → Error -->
  <line x1="545" y1="185" x2="660" y2="185" stroke="#ba1a1a" stroke-width="2" marker-end="url(#ar)"/>
  <text x="590" y="176" font-size="11" fill="#ba1a1a" font-weight="bold">YES</text>
  <rect x="660" y="163" width="130" height="44" rx="8" fill="#ffdad6" stroke="#ba1a1a" stroke-width="1.5"/>
  <text x="725" y="183" font-size="11" fill="#93000a" text-anchor="middle" font-weight="bold">Error 409</text>
  <text x="725" y="200" font-size="10" fill="#93000a" text-anchor="middle">Conflict shown to doctor</text>

  <!-- No → Create -->
  <line x1="410" y1="225" x2="410" y2="268" stroke="#059669" stroke-width="2" marker-end="url(#ag)"/>
  <text x="420" y="252" font-size="11" fill="#059669" font-weight="bold">NO</text>

  <!-- Step 3: Reservation Created -->
  <rect x="260" y="268" width="300" height="52" rx="8" fill="#d1fae5" stroke="#059669" stroke-width="2"/>
  <text x="410" y="289" font-size="13" font-weight="bold" fill="#065f46" text-anchor="middle">Reservation Created</text>
  <text x="410" y="308" font-size="11" fill="#065f46" text-anchor="middle">Status: PENDING  —  Saved to database</text>
  <line x1="410" y1="320" x2="410" y2="360" stroke="#464555" stroke-width="2" marker-end="url(#a)"/>

  <!-- Step 4: Admin Reviews -->
  <rect x="260" y="360" width="300" height="52" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="410" y="381" font-size="13" font-weight="bold" fill="#78350f" text-anchor="middle">Admin Reviews Request</text>
  <text x="410" y="400" font-size="11" fill="#78350f" text-anchor="middle">Views in Reservations panel + optional notes</text>
  <line x1="410" y1="412" x2="410" y2="452" stroke="#464555" stroke-width="2" marker-end="url(#a)"/>

  <!-- Step 5: Decision -->
  <polygon points="410,452 545,492 410,532 275,492" fill="#e8eaff" stroke="#4744e5" stroke-width="2"/>
  <text x="410" y="487" font-size="12" font-weight="bold" fill="#2e2c8f" text-anchor="middle">Admin Decision?</text>

  <!-- Approve -->
  <line x1="275" y1="492" x2="175" y2="492" stroke="#059669" stroke-width="2" marker-end="url(#ag)"/>
  <text x="225" y="483" font-size="11" fill="#059669" font-weight="bold">APPROVE</text>
  <rect x="60" y="470" width="115" height="44" rx="8" fill="#d1fae5" stroke="#059669" stroke-width="2"/>
  <text x="117" y="490" font-size="11" fill="#065f46" text-anchor="middle" font-weight="bold">APPROVED</text>
  <text x="117" y="507" font-size="10" fill="#065f46" text-anchor="middle">Doctor notified</text>

  <!-- Reject -->
  <line x1="545" y1="492" x2="645" y2="492" stroke="#ba1a1a" stroke-width="2" marker-end="url(#ar)"/>
  <text x="582" y="483" font-size="11" fill="#ba1a1a" font-weight="bold">REJECT</text>
  <rect x="645" y="470" width="115" height="44" rx="8" fill="#ffdad6" stroke="#ba1a1a" stroke-width="2"/>
  <text x="702" y="490" font-size="11" fill="#93000a" text-anchor="middle" font-weight="bold">REJECTED</text>
  <text x="702" y="507" font-size="10" fill="#93000a" text-anchor="middle">With admin notes</text>

  <!-- Cancel path -->
  <line x1="117" y1="514" x2="117" y2="570" stroke="#464555" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="60" y="545" font-size="10" fill="#464555">Doctor can</text>
  <text x="60" y="558" font-size="10" fill="#464555">also cancel</text>
  <rect x="55" y="572" width="125" height="38" rx="8" fill="#f0f0f0" stroke="#888" stroke-width="1.5"/>
  <text x="117" y="591" font-size="11" fill="#444" text-anchor="middle" font-weight="bold">CANCELLED</text>
  <text x="117" y="605" font-size="9" fill="#666" text-anchor="middle">Future reservations only</text>
</svg>`
}

/* ══════════════════════════════════════════════════════════
   SVG → PNG
══════════════════════════════════════════════════════════ */
async function svgToPng(svgStr, scale = 2) {
  const buf = Buffer.from(svgStr, 'utf-8')
  return sharp(buf, { density: 150 * scale }).png().toBuffer()
}

/* ══════════════════════════════════════════════════════════
   DOCX HELPERS
══════════════════════════════════════════════════════════ */
function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 120 },
  })
}
function h2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
  })
}
function h3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 60 },
  })
}
function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, ...opts })],
    spacing: { before: 60, after: 60 },
  })
}
function bullet(text, bold = false) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, bold })],
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
  })
}
function subBullet(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 21 })],
    bullet: { level: 1 },
    spacing: { before: 30, after: 30 },
  })
}
function gap() {
  return new Paragraph({ text: '' })
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] })
}
function img(pngBuf, w = 700, h = 420) {
  return new Paragraph({
    children: [
      new ImageRun({
        data: pngBuf,
        transformation: { width: w, height: h },
        type: 'png',
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
  })
}
function caption(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, italics: true, color: '464555' })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 160 },
  })
}
function makeTable(headers, rows) {
  const headerRow = new TableRow({
    children: headers.map(h =>
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: h, bold: true, size: 20, color: 'FFFFFF' })],
          alignment: AlignmentType.CENTER,
        })],
        shading: { type: ShadingType.CLEAR, fill: '4744e5' },
      })
    ),
  })
  const bodyRows = rows.map(r =>
    new TableRow({
      children: r.map((cell, i) =>
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: cell, size: 20, bold: i === 0 })],
          })],
          shading: { type: ShadingType.CLEAR, fill: 'F2F3FF' },
        })
      ),
    })
  )
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows],
  })
}

/* ══════════════════════════════════════════════════════════
   DOCUMENT CONTENT
══════════════════════════════════════════════════════════ */
async function buildDocument(pngs) {
  const [pngArch, pngERD, pngUseCases, pngFlow] = pngs

  const children = [

    /* ── COVER ── */
    gap(), gap(),
    new Paragraph({
      children: [new TextRun({ text: 'Yarmouk University', size: 40, bold: true, color: '4744e5' })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Room Reservation System', size: 36, bold: true, color: '171b2a' })],
      alignment: AlignmentType.CENTER,
    }),
    gap(),
    new Paragraph({
      children: [new TextRun({ text: 'Phase 1 — Planning Documentation', size: 30, bold: true, color: '464555' })],
      alignment: AlignmentType.CENTER,
    }),
    gap(),
    new Paragraph({
      children: [new TextRun({ text: 'Version 1.0  |  March 2026', size: 22, italics: true, color: '888888' })],
      alignment: AlignmentType.CENTER,
    }),
    gap(), gap(), gap(),

    /* ── TOC note ── */
    new Paragraph({
      children: [new TextRun({ text: 'Table of Contents', size: 26, bold: true })],
      alignment: AlignmentType.LEFT,
    }),
    para('1. Project Overview'),
    para('2. Objectives'),
    para('3. Stakeholders'),
    para('4. Target Users'),
    para('5. Functional Requirements'),
    para('6. Non-Functional Requirements'),
    para('7. Scope Definition'),
    para('8. Key Features'),
    para('9. Technical Overview'),
    para('10. System Architecture Diagram'),
    para('11. Entity Relationship Diagram'),
    para('12. Use Case Diagram'),
    para('13. Reservation Workflow'),
    para('14. Constraints & Assumptions'),
    para('15. Risks'),
    para('16. Timeline'),
    para('17. Phase 1 Deliverables'),

    pageBreak(),

    /* ══ 1. PROJECT OVERVIEW ══ */
    h1('1. Project Overview'),
    h3('Project Name'),
    para('Yarmouk University Room Reservation System (YU-RRS)'),

    h3('Description'),
    para(
      'YU-RRS is a full-stack web application designed to digitize and streamline the classroom and hall reservation ' +
      'process at Yarmouk University. The system provides an Admin Panel for facility managers and a Doctor Portal ' +
      'for faculty members, enabling end-to-end management of room bookings from request to approval.'
    ),

    h3('Problem Statement'),
    para(
      'Currently, faculty members at Yarmouk University rely on manual or informal methods (phone calls, paper forms, ' +
      'or email) to reserve lecture halls, labs, and meeting rooms. This results in double-bookings, lack of visibility ' +
      'into room availability, slow approval cycles, and difficulty generating utilization reports for management.'
    ),

    h3('Business Value'),
    bullet('Eliminates scheduling conflicts through real-time availability checking.'),
    bullet('Reduces administrative overhead by automating reservation approval workflows.'),
    bullet('Provides management with actionable analytics on room utilization.'),
    bullet('Improves faculty experience with a self-service portal accessible from any browser.'),
    bullet('Enables data-driven decisions on resource allocation and building planning.'),

    gap(),

    /* ══ 2. OBJECTIVES ══ */
    h1('2. Objectives'),
    para('The following measurable goals define the success criteria for Phase 1:'),
    bullet('Provide a role-based web application accessible to Admin and Doctor user roles.'),
    bullet('Enable real-time room availability search with filtering by date, time, capacity, building, and type.'),
    bullet('Implement a complete reservation lifecycle: Submit → Pending → Approve/Reject → Cancel.'),
    bullet('Give administrators a centralized dashboard to manage buildings, rooms, users, and reservations.'),
    bullet('Provide faculty members with a personal portal including reservations history, calendar view, and smart chatbot.'),
    bullet('Deliver an AI-powered exam seat distribution feature to allocate students across available rooms.'),
    bullet('Generate analytics reports covering room utilization, approval rates, and departmental usage.'),
    bullet('Export reservation data as CSV for offline reporting and record-keeping.'),

    gap(),

    /* ══ 3. STAKEHOLDERS ══ */
    h1('3. Stakeholders'),
    makeTable(
      ['Stakeholder', 'Role', 'Primary Interest'],
      [
        ['University Administration', 'Sponsor / Decision Maker', 'Efficient resource management and utilization reports'],
        ['IT Department (Admin)', 'System Administrator', 'Managing buildings, rooms, users, and approvals'],
        ['Faculty Members (Doctors)', 'Primary End Users', 'Quick room booking, availability, personal schedule'],
        ['Development Team', 'Builder / Maintainer', 'Clean architecture, maintainable codebase'],
        ['Department Coordinators', 'Indirect Users', 'Awareness of room availability per department'],
      ]
    ),
    gap(),

    /* ══ 4. TARGET USERS ══ */
    h1('4. Target Users'),

    h3('Persona 1 — System Administrator (Admin)'),
    bullet('Role: IT staff or facility manager assigned by the university.'),
    bullet('Technical Level: Intermediate — comfortable with web dashboards.'),
    bullet('Goals: Approve/reject reservations quickly, manage room inventory, extract CSV reports, and view analytics.'),
    bullet('Pain Points: Volume of manual requests, double-booking incidents, no visibility into usage patterns.'),

    gap(),
    h3('Persona 2 — Faculty Member (Doctor)'),
    bullet('Role: University professor or lecturer needing a room for classes, exams, or meetings.'),
    bullet('Technical Level: Basic to intermediate — comfortable with email and university portals.'),
    bullet('Goals: Find an available room quickly, submit a booking, track approval status, cancel if needed.'),
    bullet('Pain Points: Not knowing which rooms are free, waiting for manual confirmation, no self-service tool.'),

    gap(),

    /* ══ 5. FUNCTIONAL REQUIREMENTS ══ */
    h1('5. Functional Requirements'),

    h3('5.1 Authentication & Authorization'),
    bullet('FR-01: Users can register a Doctor account with name, email, password, and department.'),
    bullet('FR-02: Users can log in and receive a JWT token valid for a session.'),
    bullet('FR-03: All API routes are protected; role-based access enforced (Admin vs. Doctor).'),
    bullet('FR-04: Inactive users are blocked from logging in.'),

    h3('5.2 Building Management (Admin)'),
    bullet('FR-05: Admin can create, view, update, and delete buildings.'),
    bullet('FR-06: Each building has a unique code, name, and optional description.'),

    h3('5.3 Room Management (Admin)'),
    bullet('FR-07: Admin can create, view, update, and delete rooms.'),
    bullet('FR-08: Rooms are linked to a building, have a capacity, type, and status.'),
    bullet('FR-09: Room types: lecture_hall, lab, meeting_room, auditorium.'),
    bullet('FR-10: Room status: available, maintenance, occupied.'),

    h3('5.4 Reservation Management'),
    bullet('FR-11: Doctor can search for available rooms filtered by date, time, capacity, building, and type.'),
    bullet('FR-12: Doctor can submit a reservation request (status: pending).'),
    bullet('FR-13: System performs a conflict check — rejects if room is already booked (pending/approved) for overlapping times.'),
    bullet('FR-14: Doctor can view all personal reservations with status indicators and admin notes.'),
    bullet('FR-15: Doctor can cancel future reservations (pending or approved) before the start time.'),
    bullet('FR-16: Admin can view all reservations with filters (status, date range).'),
    bullet('FR-17: Admin can approve or reject a reservation and add notes.'),
    bullet('FR-18: Cancelled reservations show status "cancelled" in the portal.'),

    h3('5.5 Analytics (Admin)'),
    bullet('FR-19: Admin dashboard shows totals: rooms, users, reservations, pending approvals.'),
    bullet('FR-20: Charts display room type distribution, building usage, and departmental breakdown.'),
    bullet('FR-21: Admin can export reservation data as CSV.'),

    h3('5.6 AI Exam Distribution (Admin)'),
    bullet('FR-22: Admin provides total student count and optional building preference.'),
    bullet('FR-23: System uses a greedy algorithm to allocate students across available rooms (largest first).'),
    bullet('FR-24: Result shows each room, allocated count, capacity, utilization percentage, and remaining unallocated students.'),

    h3('5.7 Doctor Portal'),
    bullet('FR-25: Doctor dashboard shows personal reservation stats (total, approved, pending, rejected).'),
    bullet('FR-26: Calendar view shows personal reservations by month.'),
    bullet('FR-27: Chatbot supports natural language queries for availability, reservation history, and general guidance.'),
    bullet('FR-28: Chatbot command /my returns the doctor\'s latest reservations.'),
    bullet('FR-29: Chatbot command /available <date> <start> <end> <capacity> searches real room availability.'),

    gap(),

    /* ══ 6. NON-FUNCTIONAL REQUIREMENTS ══ */
    h1('6. Non-Functional Requirements'),

    h3('Performance'),
    bullet('API response time for room availability search: < 500ms under normal load.'),
    bullet('Frontend initial load (Vite production build): < 3 seconds on standard broadband.'),

    h3('Security'),
    bullet('JWT tokens must be validated on every protected API call.'),
    bullet('Passwords stored as bcrypt hashes (cost factor ≥ 10).'),
    bullet('Role authorization enforced server-side; client-side role checks are UI-only.'),
    bullet('No sensitive data (passwords, tokens) logged to console in production.'),

    h3('Scalability'),
    bullet('Database indexed on reservation date, room_id, user_id, and status for query performance.'),
    bullet('Stateless API design allows horizontal scaling behind a load balancer.'),

    h3('Usability'),
    bullet('All user-facing text in the Doctor Portal is in Arabic (RTL support via TailwindCSS).'),
    bullet('Responsive layout — usable on desktop browsers (primary) and tablets.'),
    bullet('Inline error messages and loading states on all forms and data fetches.'),

    h3('Reliability'),
    bullet('Conflict detection prevents double-booking at the database query level.'),
    bullet('API returns structured error JSON with appropriate HTTP status codes (400/401/403/404/409/500).'),
    bullet('Frontend gracefully handles API errors and displays user-friendly messages.'),

    gap(),

    /* ══ 7. SCOPE ══ */
    h1('7. Scope Definition'),

    h3('In-Scope (Phase 1)'),
    bullet('User authentication and role-based access control.'),
    bullet('Full CRUD for buildings and rooms (Admin).'),
    bullet('Reservation submission, approval/rejection, and cancellation workflow.'),
    bullet('Room availability search with conflict detection.'),
    bullet('Admin analytics dashboard (summary stats + charts).'),
    bullet('AI-powered exam student distribution.'),
    bullet('Doctor portal: dashboard, find room, my reservations, calendar, chatbot.'),
    bullet('CSV export for reservations.'),
    bullet('Arabic-language UI for Doctor Portal.'),

    gap(),
    h3('Out-of-Scope (Phase 1)'),
    bullet('Real-time push notifications (WebSocket / Server-Sent Events).'),
    bullet('Email or SMS notification system.'),
    bullet('Mobile application (iOS / Android).'),
    bullet('Integration with university LDAP / SSO directory.'),
    bullet('Production deployment, CDN, and monitoring setup.'),
    bullet('Recurring / periodic reservations (weekly schedule blocks).'),
    bullet('QR code check-in system.'),
    bullet('Multi-language support beyond Arabic and English.'),

    gap(),

    /* ══ 8. KEY FEATURES ══ */
    h1('8. Key Features'),
    makeTable(
      ['#', 'Feature', 'User', 'Description'],
      [
        ['1', 'Room Availability Search', 'Doctor', 'Filter by date, time, capacity, building, room type'],
        ['2', 'Reservation Submission', 'Doctor', 'Submit pending request with conflict detection'],
        ['3', 'Reservation Approval', 'Admin', 'Approve or reject with optional admin notes'],
        ['4', 'Cancellation', 'Doctor', 'Cancel pending or approved future reservations'],
        ['5', 'Analytics Dashboard', 'Admin', 'Stats, charts, utilization, export CSV'],
        ['6', 'AI Exam Distribution', 'Admin', 'Greedy allocation of students across available rooms'],
        ['7', 'Personal Calendar', 'Doctor', 'Monthly calendar view of own reservations'],
        ['8', 'Smart Chatbot', 'Doctor', 'NL queries: /my, /available, schedule, availability'],
        ['9', 'User Management', 'Admin', 'View users, activate/deactivate accounts'],
        ['10', 'CSV Export', 'Admin', 'Download reservations and dashboard data as CSV'],
      ]
    ),
    gap(),

    /* ══ 9. TECHNICAL OVERVIEW ══ */
    h1('9. Technical Overview'),

    h3('Tech Stack'),
    makeTable(
      ['Layer', 'Technology', 'Version / Notes'],
      [
        ['Frontend Framework', 'React', '19 — with Vite build tool'],
        ['Styling', 'TailwindCSS', '3 — utility-first CSS'],
        ['Calendar Component', 'FullCalendar', 'React adapter'],
        ['Charts', 'Chart.js + react-chartjs-2', 'Bar, Doughnut, Line'],
        ['Icons', 'Lucide React + Material Symbols', 'Outline icons'],
        ['HTTP Client', 'Axios', 'Centralized API service layer'],
        ['Backend Framework', 'Express.js', 'Node.js 18+'],
        ['ORM', 'Prisma', 'MySQL adapter'],
        ['Database', 'MySQL', '8.0 — InnoDB engine, utf8mb4'],
        ['Authentication', 'JWT + bcryptjs', 'Stateless token auth'],
        ['Dev Server', 'Vite', 'Proxy /api/* → :5000'],
      ]
    ),
    gap(),
    h3('Architecture Style'),
    para(
      'The system follows a classic 3-Tier Architecture: a React SPA (Client), an Express.js REST API (Server), ' +
      'and a MySQL relational database. Communication between layers uses JSON over HTTP. ' +
      'The Vite development server proxies /api/* requests to the backend, and Axios manages all HTTP calls ' +
      'from the frontend through a centralized api.js service file.'
    ),
    h3('Port Configuration'),
    makeTable(
      ['Service', 'Port', 'Protocol'],
      [
        ['React Frontend (Vite Dev)', '3000', 'HTTP'],
        ['Express Backend API', '5000', 'HTTP'],
        ['MySQL Database', '3306', 'TCP'],
      ]
    ),
    gap(),

    /* ══ 10. ARCHITECTURE DIAGRAM ══ */
    pageBreak(),
    h1('10. System Architecture Diagram'),
    img(pngArch, 680, 465),
    caption('Figure 1 — 3-Tier Architecture: Client Layer (React), API Layer (Express + JWT), Database Layer (MySQL)'),

    /* ══ 11. ERD ══ */
    pageBreak(),
    h1('11. Entity Relationship Diagram'),
    img(pngERD, 720, 480),
    caption('Figure 2 — ERD: 4 entities (users, buildings, rooms, reservations) with FK relationships and enum fields'),

    para('Key Relationships:'),
    bullet('Users (1) → Reservations (*) — a doctor can have many reservations'),
    bullet('Buildings (1) → Rooms (*) — a building contains many rooms'),
    bullet('Rooms (1) → Reservations (*) — a room can be reserved many times'),
    gap(),
    para('Reservation Conflict Rule:'),
    bullet(
      'When submitting a reservation, the backend queries for existing reservations on the same room, same date, ' +
      'with overlapping times and status IN (pending, approved). If any match is found, a 409 Conflict is returned.'
    ),

    /* ══ 12. USE CASE DIAGRAM ══ */
    pageBreak(),
    h1('12. Use Case Diagram'),
    img(pngUseCases, 720, 465),
    caption('Figure 3 — Use Cases: Admin (left) manages system resources; Doctor (right) manages own reservations'),

    /* ══ 13. RESERVATION WORKFLOW ══ */
    pageBreak(),
    h1('13. Reservation Workflow'),
    img(pngFlow, 640, 500),
    caption('Figure 4 — Reservation Lifecycle: Submit → Conflict Check → Pending → Admin Decision → Approved/Rejected/Cancelled'),

    para('Step-by-step:'),
    bullet('Step 1: Doctor fills the reservation form (room, date, start/end time, students, purpose).'),
    bullet('Step 2: Backend checks for time conflicts on the selected room. Returns 409 if conflict found.'),
    bullet('Step 3: No conflict → reservation created with status PENDING.'),
    bullet('Step 4: Admin reviews the pending request in the Reservations panel.'),
    bullet('Step 5: Admin approves → status APPROVED; Admin rejects → status REJECTED (with optional notes).'),
    bullet('Step 6: Doctor can cancel any future (upcoming) reservation with status PENDING or APPROVED → status CANCELLED.'),

    pageBreak(),

    /* ══ 14. CONSTRAINTS ══ */
    h1('14. Constraints & Assumptions'),

    h3('Constraints'),
    bullet('The system is designed for local/university LAN deployment in Phase 1 — no external hosting.'),
    bullet('MySQL 8 and Node.js 18+ must be installed on the host machine.'),
    bullet('XAMPP or equivalent is the assumed local database server on Windows.'),
    bullet('The chatbot uses deterministic rule-based logic — no external AI API is integrated in Phase 1.'),
    bullet('No file upload capability (e.g., room images) is included in Phase 1.'),

    gap(),
    h3('Assumptions'),
    bullet('Each doctor self-registers; the admin can deactivate accounts if needed.'),
    bullet('A single admin account exists by default (seeded). Admin role assignment is done directly in the database.'),
    bullet('The university operates in Arabic (Jordan timezone UTC+3); all dates/times are local.'),
    bullet('Room availability conflicts are checked at the application layer (no database-level time-range locking).'),
    bullet('The Prisma ORM seed script populates representative demo data for testing.'),

    gap(),

    /* ══ 15. RISKS ══ */
    h1('15. Risks'),
    makeTable(
      ['Risk', 'Likelihood', 'Impact', 'Mitigation'],
      [
        ['Double booking due to race conditions', 'Low', 'High', 'Add database-level unique constraint or pessimistic lock on reservation creation'],
        ['JWT token theft / XSS attack', 'Medium', 'High', 'Store token in memory (not localStorage) in Phase 2; add Content-Security-Policy headers'],
        ['Database grows large with no archiving', 'Low', 'Medium', 'Add a soft-delete / archive mechanism for old reservations in Phase 2'],
        ['User password brute-force', 'Medium', 'Medium', 'Add rate limiting middleware (e.g., express-rate-limit) to /auth/login'],
        ['Chatbot misinterprets natural language', 'High', 'Low', 'Fallback to generic helpful message; add slash commands (/available, /my) as reliable alternatives'],
        ['Scope creep from stakeholders', 'Medium', 'Medium', 'Strictly follow Phase 1 scope; log new requests for Phase 2 backlog'],
      ]
    ),
    gap(),

    /* ══ 16. TIMELINE ══ */
    h1('16. Timeline — Rough Estimation'),
    makeTable(
      ['Phase', 'Activities', 'Duration'],
      [
        ['Planning (Phase 1)', 'Requirements gathering, stakeholder interviews, scope definition, this document', '1 week'],
        ['Design', 'UI/UX wireframes, DB schema design, API contract definition, architecture decision', '1 week'],
        ['Development — Backend', 'Express server, Prisma schema, routes: auth/buildings/rooms/reservations/users/analytics/ai, seed', '2 weeks'],
        ['Development — Frontend', 'React app, Admin panel pages, Doctor portal pages, service layer, chatbot', '3 weeks'],
        ['Integration & Testing', 'End-to-end flow testing, conflict detection testing, role authorization, CSV export', '1 week'],
        ['Bug Fixes & Polish', 'UI polish, Arabic localization, error handling, performance review', '1 week'],
        ['Delivery / Demo', 'Final demo, documentation delivery (README, API docs, Phase 1 doc)', '2–3 days'],
      ]
    ),
    gap(),
    para('Total estimated duration: ~9 weeks (1 developer). Can be reduced to ~5 weeks with a team of 2–3.'),

    gap(),

    /* ══ 17. DELIVERABLES ══ */
    h1('17. Phase 1 Deliverables'),
    bullet('Working full-stack web application (Frontend + Backend + Database) running locally.'),
    bullet('MySQL database with complete schema and representative seed data.'),
    bullet('Admin Panel — fully functional with all CRUD pages, analytics, and exam distribution.'),
    bullet('Doctor Portal — fully functional with room search, reservations, calendar, and chatbot.'),
    bullet('JWT-based authentication with Admin and Doctor roles.'),
    bullet('REST API with all documented endpoints.'),
    bullet('AI Exam Distribution feature (greedy algorithm).'),
    bullet('Smart Chatbot with real-data commands (/my, /available, schedule queries).'),
    bullet('CSV export for reservation data.'),
    bullet('Project documentation:'),
    subBullet('README.md — quick start guide'),
    subBullet('design/API.md — full API reference'),
    subBullet('design/ARCHITECTURE.md — system architecture'),
    subBullet('database/ERD.md — entity relationship documentation'),
    subBullet('database/schema.sql — raw SQL schema'),
    subBullet('design/PHASE1_PLANNING.docx — this document'),

    gap(), gap(),
    new Paragraph({
      children: [new TextRun({ text: '— End of Phase 1 Planning Documentation —', size: 20, italics: true, color: '888888' })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Yarmouk University Room Reservation System  |  2026', size: 20, italics: true, color: '888888' })],
      alignment: AlignmentType.CENTER,
    }),
  ]

  return new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 },
        },
      },
    },
    sections: [{ children }],
  })
}

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
async function main() {
  console.log('Rendering diagrams...')
  const pngArch     = await svgToPng(svgArchitecture())
  const pngERD      = await svgToPng(svgERD())
  const pngUseCases = await svgToPng(svgUseCases())
  const pngFlow     = await svgToPng(svgReservationFlow())
  console.log('All diagrams rendered.')

  console.log('Building Word document...')
  const doc = await buildDocument([pngArch, pngERD, pngUseCases, pngFlow])
  const buf = await Packer.toBuffer(doc)

  const outPath = path.join(DESIGN_DIR, 'PHASE1_PLANNING.docx')
  fs.writeFileSync(outPath, buf)
  console.log(`\n✓ Created: ${outPath}`)
}

main().catch(e => { console.error(e); process.exit(1) })
