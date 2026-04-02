import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { reservationService } from '../../services/reservationService'

/* ── Status badge ── */
function StatusBadge({ status }) {
  const map = {
    approved: {
      cls: 'bg-[#6bff8f] text-[#005321]',
      dot: 'bg-[#006d2e]',
      label: 'Approved',
    },
    pending: {
      cls: 'bg-[#e4e7fc] text-slate-600',
      dot: 'bg-slate-400',
      label: 'Pending',
    },
    rejected: {
      cls: 'bg-[#ffdad6] text-[#93000a]',
      dot: 'bg-[#ba1a1a]',
      label: 'Rejected',
    },
  }
  const s = map[status] ?? map.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

/* ── No demo data — real backend ── */

/* ── Stat Card (Stitch style) ── */
function StatCard({ iconSymbol, badgeText, badgeColor, label, value, hoverBorder, iconBg, iconColor }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-transparent ${hoverBorder} transition-all group`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform`}>
          <span
            className="material-symbols-outlined text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {iconSymbol}
          </span>
        </div>
        <span className={`font-bold text-xs ${badgeColor}`}>{badgeText}</span>
      </div>
      <p className="text-[#464555] text-xs font-bold uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black mt-1 text-[#171b2a] font-headline">{value}</h3>
    </div>
  )
}

/* ═══════════════════════════════════════════
   DOCTOR PORTAL DASHBOARD
═══════════════════════════════════════════ */
export default function PortalDashboard() {
  const { user } = useAuth()
  const [allBookings, setAllBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reservationService.getMine()
      .then(d => setAllBookings(Array.isArray(d) ? d : []))
      .catch(() => setAllBookings([]))
      .finally(() => setLoading(false))
  }, [])

  const rows = allBookings.slice(0, 4)

  const totalBookings = allBookings.length
  const pendingCount  = allBookings.filter(r => r.status === 'pending').length
  const approvedCount = allBookings.filter(r => r.status === 'approved').length

  const doctorName = user?.name
    ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`)
    : 'Dr. Al-Zoubi'

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="bg-[#e1dfff] text-[#2c24ce] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            بوابة الدكتور
          </span>
          <h2 className="text-3xl font-extrabold text-[#171b2a] mt-2 tracking-tight font-headline">
            أهلاً بعودتك، {doctorName}
          </h2>
          <p className="text-[#464555] mt-1">
            أدر قاعات التدريس وحجوزاتك من منصة واحدة متكاملة.
          </p>
        </div>
        <Link
          to="/portal/find-room"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg shadow-[#4744e5]/20 hover:scale-[1.02] transition-transform"
          style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
        >
          <span className="material-symbols-outlined">add</span>
          حجز جديد
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          iconSymbol="event_note"
          badgeText="إجمالي"
          badgeColor="text-blue-500"
          label="حجوزاتي"
          value={totalBookings}
          hoverBorder="hover:border-[#4744e5]/20"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          iconSymbol="check_circle"
          badgeText="مقبولة"
          badgeColor="text-emerald-500"
          label="حجوزات موافق عليها"
          value={approvedCount}
          hoverBorder="hover:border-[#006d2e]/20"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          iconSymbol="pending_actions"
          badgeText="بانتظار"
          badgeColor="text-indigo-500"
          label="بانتظار الموافقة"
          value={pendingCount}
          hoverBorder="hover:border-[#4648d4]/20"
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <StatCard
          iconSymbol="timer"
          badgeText="الإجمالي"
          badgeColor="text-amber-500"
          label="إجمالي الطلاب"
          value={allBookings.reduce((s, r) => s + (r.students_number ?? 0), 0)}
          hoverBorder="hover:border-amber-500/20"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* ── Two-column section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT: Upcoming Schedule */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#171b2a] tracking-tight font-headline">
              الجدول القادم
            </h3>
            <Link
              to="/portal/calendar"
              className="text-[#4744e5] text-xs font-bold uppercase tracking-wider hover:underline"
            >
              عرض التقويم
            </Link>
          </div>

          <div className="space-y-4">
            {allBookings.filter(r => r.status === 'approved' || r.status === 'pending').slice(0, 3).map((ev, i) => {
              const colors = ['border-[#4744e5]', 'border-[#4648d4]', 'border-[#006d2e]']
              const labelColors = ['text-[#4744e5] bg-blue-50', 'text-[#4648d4] bg-indigo-50', 'text-[#006d2e] bg-emerald-50']
              return (
                <div key={ev.id} className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 ${colors[i % 3]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${labelColors[i % 3]}`}>
                      {ev.date} • {ev.start_time}
                    </span>
                    <span className="material-symbols-outlined text-slate-300 text-sm">more_vert</span>
                  </div>
                  <h4 className="font-bold text-slate-900 leading-tight">{ev.room_name}</h4>
                  <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{ev.building_name} • {ev.purpose ?? ''}</span>
                  </div>
                </div>
              )
            })}
            {allBookings.length === 0 && !loading && (
              <div className="bg-white p-5 rounded-2xl shadow-sm text-center text-slate-400 text-sm">
                لا توجد حجوزات قادمة
              </div>
            )}
          </div>

          {/* Promo card */}
          <div
            className="rounded-2xl p-6 text-white relative overflow-hidden"
            style={{ backgroundColor: '#2c303f' }}
          >
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-1">تحتاج مختبراً متخصصاً؟</h4>
              <p className="text-white/70 text-sm mb-4">
                تصفح مختبراتنا المتطورة المتاحة لجلسات البحث.
              </p>
              <Link
                to="/portal/find-room?room_type=lab"
                className="inline-flex bg-white text-[#171b2a] px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                استكشف المختبرات
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-8xl">biotech</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Recent Bookings Table */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#171b2a] tracking-tight font-headline">
              حجوزاتي الأخيرة
            </h3>
            <div className="flex gap-2">
              <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  {['القاعة', 'التاريخ والوقت', 'الغرض', 'الحالة', ''].map((h, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                      جاري التحميل…
                    </td>
                  </tr>
                ) : rows.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Classroom */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                          <span className="material-symbols-outlined text-sm">meeting_room</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{r.room_name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                            {r.building ?? r.building_name ?? '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Date & Time */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-slate-900">{r.date}</p>
                      <p className="text-[10px] text-slate-500">
                        {r.start_time} - {r.end_time}
                      </p>
                    </td>
                    {/* Purpose */}
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600">
                        {r.purpose ?? '—'}
                      </p>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-5">
                      <StatusBadge status={r.status} />
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <button className="text-slate-400 hover:text-[#4744e5] transition-colors">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Load more */}
            <div className="p-4 bg-slate-50/50 flex items-center justify-center">
              <Link
                to="/portal/my-reservations"
                className="text-slate-500 hover:text-[#4744e5] text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                استعراض المزيد
                <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
