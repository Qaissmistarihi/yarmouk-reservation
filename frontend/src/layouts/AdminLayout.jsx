import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X } from 'lucide-react'

const navItems = [
  { to: '/admin/dashboard',    icon: 'dashboard',       label: 'لوحة التحكم' },
  { to: '/admin/rooms',        icon: 'meeting_room',    label: 'القاعات' },
  { to: '/admin/buildings',    icon: 'corporate_fare',  label: 'المباني' },
  { to: '/admin/reservations', icon: 'event_available', label: 'الحجوزات' },
  { to: '/admin/calendar',     icon: 'calendar_month',  label: 'التقويم' },
  { to: '/admin/exams',        icon: 'layers',          label: 'توزيع الامتحانات' },
  { to: '/admin/analytics',    icon: 'analytics',       label: 'التحليلات' },
  { to: '/admin/users',        icon: 'group',           label: 'المستخدمون' },
]

function SidebarContent({ user, onClose, onLogout }) {
  return (
    <div className="flex flex-col h-full bg-[#f2f3ff] w-72">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-6 pt-6 px-2">
        <div className="w-10 h-10 rounded-xl bg-[#4744e5] flex items-center justify-center text-white shadow-lg flex-shrink-0">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance
          </span>
        </div>
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-[#4744e5] leading-none font-headline truncate">
            الأتريوم الأكاديمي
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
            حجوزات القاعات
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto p-1 text-slate-400 hover:text-slate-600 lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-headline font-medium text-sm ${
                isActive
                  ? 'bg-white text-[#4744e5] shadow-sm scale-[0.98]'
                  : 'text-slate-500 hover:bg-white/50'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: logout + user card */}
      <div className="mt-auto p-4 space-y-3">
        {/* Logout button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6] transition-all font-headline font-medium text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>تسجيل الخروج</span>
        </button>

        {/* User card */}
        <div className="bg-[#4744e5]/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#dee1f6] flex items-center justify-center text-[#4744e5] font-bold text-xs overflow-hidden flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() ?? 'A'
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#171b2a] truncate">
                {user?.name ?? 'Admin Control'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">مدير الجامعة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  // Derive current page title for topbar nav highlight
  const isCalendar = location.pathname.includes('/calendar')

  return (
    <div className="flex min-h-screen bg-[#faf8ff] text-[#171b2a]">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-72 z-50 shadow-sm">
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex flex-col h-full shadow-xl">
            <SidebarContent user={user} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* ── Main area (offset by sidebar width on desktop) ── */}
      <div className="flex-1 flex flex-col lg:ml-72 min-h-screen">

        {/* ── Topbar ── */}
        <header className="sticky top-0 right-0 w-full z-40 bg-[#faf8ff]/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 py-4 h-20 border-b border-[#c7c4d8]/10">
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-[#ebedff] text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Search */}
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="ابحث عن قاعة، حجز أو مستخدم..."
                className="w-full bg-white border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#4744e5]/20 transition-all placeholder:text-slate-400 outline-none"
              />
            </div>

            {/* Nav links (desktop) */}
            <nav className="hidden lg:flex items-center gap-6 text-sm tracking-tight">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `py-2 font-bold transition-all ${
                    isActive && !isCalendar
                      ? 'text-[#4744e5] border-b-2 border-[#4744e5]'
                      : 'text-slate-600 hover:text-[#4744e5]'
                  }`
                }
              >
                لوحة التحكم
              </NavLink>
              <NavLink
                to="/admin/calendar"
                className={({ isActive }) =>
                  `py-2 font-bold transition-all ${
                    isActive
                      ? 'text-[#4744e5] border-b-2 border-[#4744e5]'
                      : 'text-slate-600 hover:text-[#4744e5]'
                  }`
                }
              >
                التقويم
              </NavLink>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#4744e5]/5 text-slate-600 transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#4744e5]/5 text-slate-600 transition-all">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="h-8 w-px bg-[#c7c4d8]/25 mx-1" />
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-[#dee1f6] flex items-center justify-center text-[#4744e5] font-bold text-sm"
              title="تسجيل الخروج"
            >
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 p-6 lg:p-10 space-y-10">
          <Outlet />
        </main>

        {/* ── Footer ── */}
        <footer className="w-full py-10 border-t border-[#c7c4d8]/15 bg-[#faf8ff]">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 lg:px-10 gap-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              © 2026 جامعة اليرموك. جميع الحقوق محفوظة.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['خصوصية', 'شروط الاستخدام', 'خريطة الحرم', 'دعم تقني'].map(l => (
                <a
                  key={l}
                  href="#"
                  className="text-xs uppercase tracking-widest text-slate-500 hover:text-[#4744e5] transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
