import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

/* ── Status badge helper ── */
function statusBadge(status) {
  switch (status) {
    case 'approved': return { bg: 'bg-[#6bff8f] text-[#005321]', label: 'مقبول' }
    case 'pending':  return { bg: 'bg-[#e4e7fc] text-[#4648d4]', label: 'قيد المراجعة' }
    case 'rejected': return { bg: 'bg-[#ffdad6] text-[#93000a]', label: 'مرفوض' }
    default:         return { bg: 'bg-[#ebedff] text-[#464555]', label: status }
  }
}

/* ── Initials avatar color map ── */
const avatarColors = [
  'bg-[#4744e5]/10 text-[#4744e5]',
  'bg-[#6063ee]/10 text-[#6063ee]',
  'bg-[#ba1a1a]/10 text-[#ba1a1a]',
  'bg-[#4744e5]/10 text-[#4744e5]',
]

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

/* ─────────────────────────────────────────
   STAT CARD (matches Stitch design exactly)
───────────────────────────────────────── */
function StatCard({ label, value, sub, subIcon, borderColor, bgIcon, iconClass }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${borderColor} relative overflow-hidden group`}>
      <div className="relative z-10">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-4xl font-extrabold font-headline">{value ?? '—'}</h3>
        <div className={`mt-4 flex items-center text-xs font-medium ${iconClass}`}>
          <span className="material-symbols-outlined text-sm mr-1">{subIcon}</span>
          <span>{sub}</span>
        </div>
      </div>
      <span className={`material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-5 group-hover:scale-110 transition-transform ${bgIcon}`}>
        {bgIcon}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────
   BAR CHART — real data from analytics API
───────────────────────────────────────── */
function UsageByBuilding({ buildings = [] }) {
  const maxRes = Math.max(...buildings.map(b => b.total_reservations), 1)

  return (
    <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-lg font-bold">استخدام المباني</h4>
          <p className="text-sm text-slate-500">حجم الحجوزات لكل مبنى</p>
        </div>
      </div>
      {buildings.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">لا توجد بيانات بعد</div>
      ) : (
        <div className="h-64 flex items-end justify-between gap-4 px-2">
          {buildings.map(({ name, code, total_reservations, total_rooms }) => {
            const pct = Math.max(Math.round((total_reservations / maxRes) * 100), 4)
            return (
              <div key={code ?? name} className="w-full flex flex-col items-center gap-3">
                <span className="text-[10px] font-bold text-[#4744e5]">{total_reservations}</span>
                <div
                  className="w-full bg-[#4744e5]/10 rounded-t-lg relative group flex items-end"
                  style={{ height: `${pct}%` }}
                >
                  <div className="w-full bg-[#4744e5] rounded-t-lg absolute bottom-0 left-0 h-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 text-center leading-tight">{name}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   PEAK TIMES CARD
───────────────────────────────────────── */
function PeakTimes() {
  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm flex flex-col">
      <div className="mb-8">
        <h4 className="text-lg font-bold">أوقات الذروة</h4>
        <p className="text-sm text-slate-500">توزيع الازدحام اليومي</p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full h-40 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4744e5" />
                <stop offset="100%" stopColor="#6161ff" />
              </linearGradient>
            </defs>
            <path
              d="M0 35 Q 20 5, 40 25 T 80 15 T 100 30"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="40" cy="25" r="3" fill="#ffffff" stroke="#4744e5" strokeWidth="2" />
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#171b2a] text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
            Peak: 10:00 AM (88%)
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 bg-[#ebedff] rounded-xl">
          <p className="text-[10px] text-slate-500 uppercase font-bold">الأكثر نشاطاً</p>
          <p className="text-sm font-bold">10:00 - 12:30</p>
        </div>
        <div className="p-3 bg-[#ebedff] rounded-xl">
          <p className="text-[10px] text-slate-500 uppercase font-bold">الأقل نشاطاً</p>
          <p className="text-sm font-bold">16:00 - 18:00</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   ADMIN DASHBOARD PAGE
───────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const downloadCsv = (filename, headers, rows) => {
    const esc = (v) => {
      if (v === null || v === undefined) return ''
      const s = String(v)
      return /["\n,]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }

    const lines = [
      headers.map(esc).join(','),
      ...rows.map(r => r.map(esc).join(',')),
    ]

    const csv = `\uFEFF${lines.join('\n')}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    Promise.all([
      api.get('/analytics/summary').catch(() => ({ data: null })),
      api.get('/reservations?limit=4').catch(() => ({ data: [] })),
    ]).then(([s, r]) => {
      setStats(s.data)
      setRecent(Array.isArray(r.data) ? r.data : r.data?.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const rows = recent

  const handleExport = () => {
    const exportRows = rows.map(r => ([
      r.doctor_name ?? r.user_name ?? '',
      r.building ?? r.building_name ?? '',
      r.room_name ?? '',
      r.date ?? '',
      r.start_time ?? '',
      r.end_time ?? '',
      r.status ?? '',
    ]))

    downloadCsv(
      'recent_reservations.csv',
      ['عضو هيئة التدريس', 'المبنى', 'القاعة', 'التاريخ', 'وقت البداية', 'وقت النهاية', 'الحالة'],
      exportRows
    )
  }

  return (
    <div className="space-y-10">

      {/* ── Header ── */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-[#171b2a]">
            نظرة عامة على النظام
          </h1>
          <p className="text-slate-500 mt-1">مراقبة حجوزات الحرم الجامعي بشكل فوري.</p>
        </div>
        <Link
          to="/admin/reservations"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white shadow-lg shadow-[#4744e5]/20 hover:scale-[1.02] transition-transform"
          style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
        >
          <span className="material-symbols-outlined text-xl">add</span>
          حجز جديد
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="إجمالي القاعات"
          value={stats?.total_rooms ?? 0}
          sub="قاعات مسجلة"
          subIcon="trending_up"
          borderColor="border-[#4744e5]"
          bgIcon="meeting_room"
          iconClass="text-[#006d2e]"
        />
        <StatCard
          label="بانتظار الموافقة"
          value={stats?.pending_approvals ?? 0}
          sub="يتطلب انتباهاً"
          subIcon="pending_actions"
          borderColor="border-[#6063ee]"
          bgIcon="approval"
          iconClass="text-[#6063ee]"
        />
        <StatCard
          label="المستخدمون"
          value={stats?.total_users ?? 0}
          sub="عضو هيئة تدريس"
          subIcon="bolt"
          borderColor="border-[#006d2e]"
          bgIcon="group"
          iconClass="text-[#006d2e]"
        />
        <StatCard
          label="صحة النظام"
          value={`${stats?.system_health ?? 98}%`}
          sub="النظام يعمل بشكل طبيعي"
          subIcon="verified_user"
          borderColor="border-[#ba1a1a]"
          bgIcon="memory"
          iconClass="text-[#006d2e]"
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <UsageByBuilding buildings={stats?.usage_by_building ?? []} />
        <PeakTimes />
      </div>

      {/* ── Recent Reservations Table ── */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold">Recent Reservations</h4>
            <p className="text-sm text-slate-500">Manage the latest classroom booking requests.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport} disabled={loading || rows.length === 0}
              className="px-4 py-2 text-xs font-bold border border-[#c7c4d8]/30 rounded-lg hover:bg-[#f2f3ff] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              Export CSV
            </button>
            <Link
              to="/admin/reservations"
              className="px-4 py-2 text-xs font-bold text-[#4744e5] bg-[#4744e5]/5 rounded-lg hover:bg-[#4744e5]/10 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f3ff]/50">
                {['Doctor Name', 'Building', 'Room', 'Date', 'Time', 'Status', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 ${i === 6 ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <span className="material-symbols-outlined animate-spin text-[#4744e5] block mx-auto mb-2">
                      progress_activity
                    </span>
                    Loading reservations…
                  </td>
                </tr>
              ) : rows.map((r, idx) => {
                const badge = statusBadge(r.status)
                const color = avatarColors[r.colorIdx ?? idx % 4]
                const init  = r.initials ?? initials(r.user_name)
                return (
                  <tr key={r.id} className="hover:bg-[#f2f3ff]/30 transition-colors group">
                    {/* Doctor */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${color}`}>
                          {init}
                        </div>
                        <p className="text-sm font-semibold whitespace-nowrap">{r.doctor_name ?? r.user_name}</p>
                      </div>
                    </td>
                    {/* Building */}
                    <td className="px-8 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {r.building ?? r.building_name ?? '—'}
                    </td>
                    {/* Room */}
                    <td className="px-8 py-4">
                      <span className="px-2 py-1 bg-[#ebedff] rounded text-xs font-headline font-bold">
                        {r.room_name}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-8 py-4 text-sm text-slate-600 whitespace-nowrap">{r.date}</td>
                    {/* Time */}
                    <td className="px-8 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {r.start_time} - {r.end_time}
                    </td>
                    {/* Status */}
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-8 py-4 text-right">
                      <button className="p-2 hover:bg-[#ebedff] rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-[#f2f3ff]/20 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#c7c4d8]/10">
          <p className="text-xs text-slate-500 font-medium">
            عرض {rows.length} من {stats?.total_reservations ?? rows.length} حجز
          </p>
        </div>
      </div>
    </div>
  )
}
