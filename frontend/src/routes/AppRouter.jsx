import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'

// Public Pages
import LandingPage from '../pages/public/LandingPage'
import LoginPage from '../pages/public/LoginPage'
import RegisterPage from '../pages/public/RegisterPage'

// Admin Pages
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminBuildings from '../pages/admin/Buildings'
import AdminRooms from '../pages/admin/Rooms'
import AdminReservations from '../pages/admin/Reservations'
import AdminUsers from '../pages/admin/Users'
import AdminCalendar from '../pages/admin/Calendar'
import AdminAnalytics from '../pages/admin/Analytics'
import AdminExamDistribution from '../pages/admin/ExamDistribution'

// Portal (Doctor) Pages
import PortalLayout from '../layouts/PortalLayout'
import PortalDashboard from '../pages/portal/Dashboard'
import FindRoom from '../pages/portal/FindRoom'
import MyReservations from '../pages/portal/MyReservations'
import PortalCalendar from '../pages/portal/Calendar'
import Chatbot from '../pages/portal/Chatbot'

import { ProtectedRoute } from './ProtectedRoute'

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/portal/dashboard" replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="buildings" element={<AdminBuildings />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="exams" element={<AdminExamDistribution />} />
          </Route>

          {/* Doctor Portal */}
          <Route path="/portal" element={<ProtectedRoute role="doctor"><PortalLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PortalDashboard />} />
            <Route path="find-room" element={<FindRoom />} />
            <Route path="my-reservations" element={<MyReservations />} />
            <Route path="calendar" element={<PortalCalendar />} />
            <Route path="chatbot" element={<Chatbot />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
