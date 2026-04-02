import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { reservationService } from '../../services/reservationService'

/* ────────────────────────────────────────
   Config & Helpers
──────────────────────────────────────── */
const DAYS    = ['أح', 'اث', 'ث', 'رب', 'خ', 'ج', 'س']
const MONTHS  = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']

/* Building → color mapping (Stitch design) */
const BUILDING_COLORS = {
  'Al-Maqdisi':   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-500',   dot: 'bg-blue-500' },
  'Al-Khwarizmi': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-500', dot: 'bg-indigo-500' },
  'PHU':          { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-500',  dot: 'bg-green-500' },
}
const COLOR_POOL = [
  { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-500',   dot: 'bg-blue-500' },
  { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-500', dot: 'bg-indigo-500' },
  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-500',  dot: 'bg-green-500' },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500', dot: 'bg-purple-500' },
]

function colorFor(building = '', idx = 0) {
  for (const [key, c] of Object.entries(BUILDING_COLORS)) {
    if (building.includes(key)) return c
  }
  return COLOR_POOL[idx % COLOR_POOL.length]
}

/* ── No demo events — real backend ── */

/* Build a month grid (6 rows × 7 cols) */
function buildGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const cells = []
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true })
  }
  while (cells.length < 42) {
    cells.push({ day: cells.length - daysInMonth - firstDay + 1, current: false })
  }
  return cells
}

/* ────────────────────────────────────────
   CALENDAR PAGE
──────────────────────────────────────── */
export default function CalendarPage() {
  const now = new Date()
  const [year, setYear]       = useState(now.getFullYear())
  const [month, setMonth]     = useState(now.getMonth())
  const [events, setEvents]   = useState([])
  const [selected, setSelected] = useState(null)
  const [view, setView]       = useState('Month')

  useEffect(() => {
    reservationService.getMine()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data
            .filter(r => {
              const d = new Date(r.date)
              return d.getFullYear() === year && d.getMonth() === month
            })
            .map((r) => ({
              id:          r.id,
              day:         new Date(r.date).getDate(),
              title:       r.purpose ?? r.room_name ?? 'حجز',
              building:    r.building_name ?? '',
              room:        r.room_name,
              time:        `${r.start_time} - ${r.end_time}`,
              invigilator: '',
              students:    `${r.students_number ?? '—'}`,
              av:          '',
              status:      r.status,
            }))
          setEvents(mapped)
          if (mapped.length > 0) setSelected(mapped[0])
          else setSelected(null)
        } else {
          setEvents([])
          setSelected(null)
        }
      })
      .catch(() => { setEvents([]); setSelected(null) })
  }, [year, month])

  const grid = buildGrid(year, month)

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  /* events indexed by day */
  const byDay = {}
  events.forEach(ev => {
    if (!byDay[ev.day]) byDay[ev.day] = []
    byDay[ev.day].push(ev)
  })

  const today = now.getDate()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  const selColor = selected ? colorFor(selected.building) : COLOR_POOL[1]

  return (
    <>
      {/* ── Page header ── */}
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-headline text-[#171b2a] tracking-tight">Calendar</h2>
          <p className="text-slate-500 font-medium">
            {MONTHS[month]} {year} • Academic Schedule Overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Month nav */}
          <div className="flex items-center gap-1">
            <button onClick={prevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#ebedff] text-slate-600 transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button onClick={nextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#ebedff] text-slate-600 transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          {/* View switcher */}
          <div className="flex bg-[#f2f3ff] p-1 rounded-xl">
            {['Day', 'Week', 'Month'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  view === v
                    ? 'bg-white text-[#4744e5] shadow-sm'
                    : 'text-slate-500 hover:bg-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="flex gap-8 items-start">

        {/* ── Calendar Grid ── */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-[#c7c4d8]/10 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-[#c7c4d8]/10">
            {DAYS.map(d => (
              <div key={d} className="p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7" style={{ gridAutoRows: '120px' }}>
            {grid.map((cell, idx) => {
              const isToday   = isCurrentMonth && cell.current && cell.day === today
              const cellEvents = cell.current ? (byDay[cell.day] ?? []) : []
              const isLast    = idx % 7 === 6

              return (
                <div
                  key={idx}
                  className={`p-3 border-b border-[#c7c4d8]/05 transition-colors relative
                    ${!isLast ? 'border-r' : ''}
                    ${!cell.current ? 'bg-slate-50/30' : isToday ? 'bg-[#4744e5]/5' : 'hover:bg-slate-50/50'}
                  `}
                >
                  <span className={`text-sm font-bold mb-1.5 block
                    ${!cell.current ? 'text-slate-300' : isToday ? 'text-[#4744e5]' : 'text-slate-400'}
                  `}>
                    {cell.day}
                  </span>

                  {/* Today dot */}
                  {isToday && (
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-[#4744e5] rounded-full" />
                  )}

                  {/* Events */}
                  <div className="space-y-1">
                    {cellEvents.slice(0, 2).map((ev, ei) => {
                      const c = colorFor(ev.building, ei)
                      const isSelected = selected?.id === ev.id
                      return (
                        <button
                          key={ev.id}
                          onClick={() => setSelected(ev)}
                          className={`w-full text-left px-2 py-0.5 text-[10px] font-bold rounded-lg border-l-4 truncate transition-all
                            ${c.bg} ${c.text} ${c.border}
                            ${isSelected ? 'ring-1 ring-offset-1 ring-current' : 'hover:brightness-95'}
                          `}
                        >
                          {ev.title}
                        </button>
                      )
                    })}
                    {cellEvents.length > 2 && (
                      <p className="text-[9px] font-bold text-slate-400 pl-1">+{cellEvents.length - 2} more</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="w-80 space-y-6 sticky top-24 flex-shrink-0">

          {/* Event Details Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#c7c4d8]/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-headline text-[#171b2a]">Event Details</h3>
              <button className="text-slate-400 hover:text-[#171b2a] transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>

            {selected ? (
              <>
                {/* Event banner */}
                <div className={`mb-6 p-4 rounded-2xl ${selColor.bg} border-l-4 ${selColor.border}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${selColor.text} bg-white px-2 py-0.5 rounded-full`}>
                      {selected.building}
                    </span>
                  </div>
                  <h4 className={`text-base font-bold leading-tight mb-4 ${selColor.text.replace('text-', 'text-').replace('700', '900')}`}>
                    {selected.title}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span className="text-sm font-medium">{selected.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="material-symbols-outlined text-sm">meeting_room</span>
                      <span className="text-sm font-medium">{selected.room}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="material-symbols-outlined text-sm">person</span>
                      <span className="text-sm font-medium">Invigilator: {selected.invigilator}</span>
                    </div>
                  </div>
                </div>

                {/* Info rows */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f2f3ff] transition-all border border-transparent hover:border-[#c7c4d8]/10 group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined">groups</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#171b2a]">Capacity Tracking</p>
                        <p className="text-[11px] text-slate-500">{selected.students} Students Registered</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-[#4744e5] transition-colors">chevron_right</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f2f3ff] transition-all border border-transparent hover:border-[#c7c4d8]/10 group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined">settings_input_component</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#171b2a]">AV Requirements</p>
                        <p className="text-[11px] text-slate-500">{selected.av}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-[#4744e5] transition-colors">chevron_right</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 bg-[#e4e7fc] py-3 rounded-xl text-[#4744e5] font-bold text-sm hover:bg-[#dee1f6] transition-all">
                    Edit Booking
                  </button>
                  <button className="px-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl hover:bg-[#ba1a1a] hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-4xl text-slate-300">event_note</span>
                <p className="text-slate-400 text-sm mt-2">Click an event to see details</p>
              </div>
            )}
          </div>

          {/* Building Color Guide */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#c7c4d8]/10">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Building Color Guide
            </h5>
            <div className="space-y-3">
              {[
                { label: 'Al-Maqdisi',           dot: 'bg-blue-500' },
                { label: 'Al-Khwarizmi',         dot: 'bg-indigo-500' },
                { label: 'PHU (Public Health)',   dot: 'bg-green-500' },
              ].map(({ label, dot }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${dot}`} />
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick book CTA */}
          <Link
            to="/portal/find-room"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white font-bold text-sm shadow-lg shadow-[#4744e5]/20 hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
          >
            <span className="material-symbols-outlined">add</span>
            Reserve a Room
          </Link>

        </div>
      </div>
    </>
  )
}
