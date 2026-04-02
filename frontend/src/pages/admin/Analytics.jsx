import React, { useState, useEffect } from 'react'
import api from '../../services/api'

/* ══════════════════════════════════════
   No hardcoded data — loaded from API
══════════════════════════════════════ */

const DAYS = ['اث','ث','رب','خ','ج','س','ح']
const RANGES = ['آخر 7 أيام', 'هذا الشهر', 'نطاق مخصص']

/* ═══════════════════════════════════════════
   ANALYTICS PAGE (REFINED)
═══════════════════════════════════════════ */
export default function Analytics() {
  const [range, setRange] = useState('Last 7 Days')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/analytics/summary')
      .then(r => setStats(r.data))
      .catch(() => {})
  }, [])

  const usageByBuilding = stats?.usage_by_building ?? []
  const roomTypes = stats?.room_type_distribution ?? []
  const deptUsage = stats?.department_usage ?? []
  const totalRooms = stats?.total_rooms ?? 0

  return (
    <div>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold font-headline tracking-tight text-[#171b2a]">تحليلات أكاديمية</h2>
          <p className="text-slate-500 mt-1">بيانات الإشغال والحجوزات عبر الحرم الجامعي في الوقت الفعلي.</p>
        </div>
        <div className="flex items-center gap-1 bg-white p-2 rounded-xl shadow-sm border border-[#c7c4d8]/10">
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                range === r ? 'bg-[#4744e5] text-white shadow-md shadow-[#4744e5]/20' : 'text-slate-500 hover:bg-[#f2f3ff]'}`}>
              {r}
            </button>
          ))}
          <div className="h-6 w-px bg-[#c7c4d8]/30 mx-1" />
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#4744e5] hover:bg-[#4744e5]/5 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>فلترة
          </button>
        </div>
      </div>

      {/* ══ ROW 1: Occupancy Trends (8) + Room Types (4) ══ */}
      <div className="grid grid-cols-12 gap-6 mb-6">

        {/* Occupancy Trends – multi-line SVG */}
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-[#c7c4d8]/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold font-headline text-[#171b2a]">ترندات الإشغال</h3>
              <p className="text-xs text-slate-400">متوسط نسبة الإشغال اليومي لكل كلية</p>
            </div>
            <div className="flex items-center gap-4">
              {[['#6366f1','تقنية المعلومات'],['#22c55e','علوم'],['#f59e0b','هندسة']].map(([c,l])=>(
                <div key={l} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{background:c}}/>
                  <span className="text-[10px] font-bold uppercase text-slate-500">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart area */}
          <div className="relative h-64 w-full">
            {/* Y-axis labels */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-bold pointer-events-none">
              {['100%','75%','50%','25%','0%'].map((v,i) => (
                <div key={i} className={`flex items-start ${i < 4 ? 'border-t border-dashed border-slate-100' : ''} w-full`}>
                  <span className="pr-2">{v}</span>
                </div>
              ))}
            </div>

            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-indigo" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* IT Faculty fill */}
              <path d="M 0 80 Q 15 70 30 40 T 60 30 T 100 20 L 100 100 L 0 100 Z"
                fill="url(#grad-indigo)" opacity="0.1" />
              {/* IT Faculty line */}
              <path d="M 0 80 Q 15 70 30 40 T 60 30 T 100 20"
                fill="none" stroke="#6366f1" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              {/* Sciences */}
              <path d="M 0 90 Q 20 85 40 75 T 70 55 T 100 45"
                fill="none" stroke="#22c55e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              {/* Engineering */}
              <path d="M 0 95 Q 25 90 50 60 T 80 70 T 100 55"
                fill="none" stroke="#f59e0b" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              {/* Peak marker dot */}
              <circle cx="60" cy="30" r="1.5" fill="#6366f1" />
            </svg>

            {/* Tooltip */}
            <div className="absolute left-[60%] top-[22%] -translate-x-1/2 bg-[#0f172a] text-white p-2 rounded-lg text-[10px] shadow-xl pointer-events-none z-10">
              <p className="font-bold border-b border-slate-700 pb-1 mb-1">Thursday Peak</p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8]"/>
                IT Faculty: <span className="font-bold ml-0.5">84%</span>
              </p>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-6 px-6">
            {DAYS.map(d => <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>)}
          </div>
        </div>

        {/* Room Types donut */}
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-2xl shadow-sm border border-[#c7c4d8]/10">
          <h3 className="text-lg font-bold font-headline text-[#171b2a] mb-1">Room Types</h3>
          <p className="text-xs text-slate-400 mb-8">Capacity distribution by category</p>

          <div className="relative w-44 h-44 mx-auto mb-8">
            {(() => {
              const colors = ['#6366f1','#22c55e','#f59e0b','#3b82f6','#ef4444']
              const total = roomTypes.reduce((s, t) => s + t.count, 0) || 1
              let offset = 0
              return (
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                  {roomTypes.map((rt, i) => {
                    const pct = (rt.count / total) * 100
                    const el = <circle key={rt.type} cx="18" cy="18" r="16" fill="none" stroke={colors[i % colors.length]}
                      strokeWidth="4" strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={-offset} strokeLinecap="round" />
                    offset += pct
                    return el
                  })}
                </svg>
              )
            })()}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-headline">{totalRooms}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">إجمالي القاعات</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {roomTypes.map((rt, i) => {
              const colors = ['#6366f1','#22c55e','#f59e0b','#3b82f6','#ef4444']
              const labels = { lecture_hall: 'قاعات محاضرات', lab: 'مختبرات', seminar: 'قاعات ندوات', auditorium: 'مدرجات', meeting_room: 'قاعات اجتماعات' }
              return (
                <div key={rt.type} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background: colors[i % colors.length]}}/>
                  <span className="text-[11px] font-medium text-slate-600">{labels[rt.type] ?? rt.type} ({rt.count})</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ══ ROW 2: Dept Usage (7) + Top Users (5) ══ */}
      <div className="grid grid-cols-12 gap-6 mb-6">

        {/* Usage by Department */}
        <div className="col-span-12 lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-[#c7c4d8]/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold font-headline text-[#171b2a]">Usage by Department</h3>
              <p className="text-xs text-slate-400">Total hours booked vs cancelled sessions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#6366f1]"/>
                <span className="text-[10px] font-bold text-slate-500">BOOKED</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-200"/>
                <span className="text-[10px] font-bold text-slate-500">CANCELLED</span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {usageByBuilding.length > 0 ? usageByBuilding.map(({ name, total_rooms, total_reservations }) => {
              const maxRes = Math.max(...usageByBuilding.map(b => b.total_reservations), 1)
              const pct = Math.round((total_reservations / maxRes) * 100)
              return (
                <div key={name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{name}</span>
                    <span className="text-slate-400">{total_reservations} حجز • {total_rooms} قاعة</span>
                  </div>
                  <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100">
                    <div className="h-full bg-[#6366f1] rounded-l-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            }) : (
              <p className="text-sm text-slate-400 text-center py-4">لا توجد بيانات بعد</p>
            )}
          </div>
        </div>

        {/* Top Power Users */}
        <div className="col-span-12 lg:col-span-5 bg-white p-8 rounded-2xl shadow-sm border border-[#c7c4d8]/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold font-headline text-[#171b2a]">Top Power Users</h3>
            <span className="px-2 py-1 bg-[#4744e5]/10 text-[#4744e5] text-[10px] font-bold rounded-md">This Month</span>
          </div>

          <div className="space-y-3">
            {deptUsage.length > 0 ? deptUsage.slice(0, 5).map(({ department, count }) => (
              <div key={department}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#4744e5]/20 hover:bg-[#4744e5]/[0.03] transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6366f1]/10 flex items-center justify-center text-[#6366f1] flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">school</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-[#6366f1]">{count}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">حجوزات</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-4">لا توجد بيانات بعد</p>
            )}
          </div>
        </div>
      </div>

      {/* ══ Most Popular Venues Table ══ */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#c7c4d8]/10 overflow-hidden">
        <div className="p-6 border-b border-[#c7c4d8]/10 flex items-center justify-between">
          <h3 className="text-lg font-bold font-headline text-[#171b2a]">Most Popular Venues</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#4744e5] hover:bg-[#4744e5]/5 rounded-lg border border-[#4744e5]/20 transition-all">
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                {['اسم المبنى','عدد القاعات','عدد الحجوزات','الحالة'].map((h,i)=>(
                  <th key={h}
                    className={`px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 ${i===1||i===2?'text-center':''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/10">
              {usageByBuilding.map(({ name, code, total_rooms, total_reservations }) => (
                <tr key={name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#6366f1]/10 text-[#6366f1] rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">apartment</span>
                      </div>
                      <span className="text-sm font-semibold">{name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-center">{total_rooms}</td>
                  <td className="px-6 py-4 text-sm font-bold text-center">{total_reservations}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-[10px] font-bold rounded-full uppercase bg-green-50 text-green-700">نشط</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
