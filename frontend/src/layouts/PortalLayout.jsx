import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu } from 'lucide-react'

const mainNav = [
  { to: '/portal/dashboard',       icon: 'dashboard',       label: 'لوحة التحكم',   fill: true },
  { to: '/portal/find-room',       icon: 'search_check',    label: 'البحث عن قاعة' },
  { to: '/portal/my-reservations', icon: 'event_available', label: 'حجوزاتي' },
  { to: '/portal/chatbot',         icon: 'forum',           label: 'المساعد الذكي',  fill: true },
  { to: '/portal/calendar',        icon: 'calendar_month',  label: 'التقويم' },
]

const adminNav = [
  { icon: 'meeting_room',   label: 'القاعات' },
  { icon: 'corporate_fare', label: 'المباني' },
  { icon: 'group',          label: 'المستخدمون' },
  { icon: 'settings',       label: 'الإعدادات' },
]

function SidebarContent({ user, onClose, onLogout }) {
  return (
    <div className="flex flex-col h-full w-72 bg-[#f2f3ff]">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-6 pt-6 px-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#4744e5]/20 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            school
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="text-[15px] font-bold text-[#4744e5] tracking-tight leading-none font-headline truncate">
            الأتريوم الأكاديمي
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            حجوزات القاعات
          </p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {mainNav.map(({ to, icon, label, fill }) => (
          <NavLink
            key={to + label}
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
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive && fill ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Administration section */}
        <div className="pt-4 pb-2 px-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            الإدارة
          </span>
        </div>
        {adminNav.map(({ icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 font-headline font-medium text-sm hover:bg-white/50 transition-colors rounded-xl w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* User info + Logout at bottom */}
      <div className="mt-auto pt-4 border-t border-[#c7c4d8]/15 px-3 pb-4 space-y-1">
        {/* Logout button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6] transition-all font-headline font-medium text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>تسجيل الخروج</span>
        </button>

        {/* User row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-[#dee1f6] flex items-center justify-center text-[#4744e5] font-bold text-sm flex-shrink-0 overflow-hidden">
            {user?.name?.[0]?.toUpperCase() ?? 'D'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">
              {user?.name ? `Dr. ${user.name}` : 'Dr. Ahmad Al-Zoubi'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {user?.department ?? 'Computer Science Dept.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PortalLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }
  const isCalendar = location.pathname.includes('/calendar')

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#171b2a]">

      {/* ── Fixed Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-72 z-50 shadow-sm">
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full shadow-xl">
            <SidebarContent user={user} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* ── Fixed Topbar ── */}
      <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-18rem)] h-20 bg-[#faf8ff]/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 z-40">
        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-[#ebedff] text-slate-600 mr-3"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Search pill */}
        <div className="flex items-center bg-white rounded-full px-4 py-2 w-full max-w-sm shadow-sm ring-1 ring-slate-200/50">
          <span className="material-symbols-outlined text-slate-400 mr-2 text-[18px]">search</span>
          <input
            type="text"
            placeholder="ابحث عن قاعة، موعد أو محاضرة..."
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 outline-none"
          />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 ml-4">
          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-8 mr-2">
            <NavLink
              to="/portal/dashboard"
              className={({ isActive }) =>
                `text-sm tracking-tight font-bold py-2 transition-all ${
                  isActive && !isCalendar
                    ? 'text-[#4744e5] border-b-2 border-[#4744e5]'
                    : 'text-slate-600 hover:text-[#4744e5]'
                }`
              }
            >
              لوحة التحكم
            </NavLink>
            <NavLink
              to="/portal/calendar"
              className={({ isActive }) =>
                `text-sm tracking-tight font-bold py-2 transition-all ${
                  isActive
                    ? 'text-[#4744e5] border-b-2 border-[#4744e5]'
                    : 'text-slate-600 hover:text-[#4744e5]'
                }`
              }
            >
              التقويم
            </NavLink>
          </nav>

          {/* Icon buttons */}
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-white transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-white transition-all">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="lg:ml-72 pt-20 min-h-screen">
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="lg:ml-72 bg-[#faf8ff] border-t border-[#c7c4d8]/15 py-12 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-slate-900 mb-1">الأتريوم الأكاديمي</p>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              © 2026 جامعة اليرموك. جميع الحقوق محفوظة.
            </p>
          </div>
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
  )
}
