import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { reservationService } from '../../services/reservationService'

/* ── No demo data — real backend ── */

const STATUS_STYLE = {
  approved: { card: 'border-l-[#4744e5] bg-[#f2f3ff]',  badge: 'bg-[#6bff8f] text-[#005321]',  dot: 'bg-[#006d2e]',       label: 'مقبول' },
  pending:  { card: 'border-l-amber-400 bg-amber-50/50', badge: 'bg-[#e1dfff] text-[#4744e5]',  dot: 'bg-[#4744e5] animate-pulse', label: 'بانتظار الموافقة' },
  rejected: { card: 'border-l-[#ba1a1a] bg-[#ffdad6]/20',badge: 'bg-[#ffdad6] text-[#93000a]', dot: 'bg-[#ba1a1a]',       label: 'مرفوض' },
  cancelled:{ card: 'border-l-slate-400 bg-slate-50/70',  badge: 'bg-slate-200 text-slate-700',   dot: 'bg-slate-500',      label: 'ملغي' },
}

export default function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]   = useState(true)
  const [canceling, setCanceling] = useState(null)
  const [filter, setFilter]     = useState('all')

  const load = () => {
    setLoading(true)
    reservationService.getMine()
      .then(data => setReservations(Array.isArray(data) ? data : []))
      .catch(() => setReservations([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleCancel = async (id) => {
    if (!confirm('هل تريد إلغاء هذا الحجز؟')) return
    setCanceling(id)
    try {
      await reservationService.cancel(id)
      load()
    } catch (e) {
      console.error('Cancel error:', e)
    } finally {
      setCanceling(null)
    }
  }

  const canCancel = (r) => {
    if (!r) return false
    if (!(r.status === 'pending' || r.status === 'approved')) return false
    if (!r.date || !r.start_time) return true
    const dt = new Date(`${r.date}T${r.start_time}:00`)
    return !Number.isNaN(dt.getTime()) && dt.getTime() > Date.now()
  }

  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter)
  const approved = reservations.filter(r => r.status === 'approved').length
  const pending  = reservations.filter(r => r.status === 'pending').length
  const rejected = reservations.filter(r => r.status === 'rejected').length

  return (
    <>
      {/* Header */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-[#4744e5]/10 text-[#4744e5] text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
              بوابة أعضاء هيئة التدريس
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#171b2a] mb-2 font-headline">حجوزاتي</h2>
            <p className="text-[#464555] max-w-lg">
              تابع وأدر جميع طلبات حجز القاعات عبر حرم جامعة اليرموك.
            </p>
          </div>
          <Link
            to="/portal/find-room"
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#4744e5]/20 hover:opacity-90 transition-all w-fit"
            style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            حجز جديد
          </Link>
        </div>
      </section>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'الإجمالي',   value: reservations.length, icon: 'event_note',     bg: 'bg-[#4744e5]/10', color: 'text-[#4744e5]' },
          { label: 'مقبولة',   value: approved,            icon: 'check_circle',   bg: 'bg-[#006d2e]/10', color: 'text-[#006d2e]' },
          { label: 'بانتظار', value: pending,             icon: 'pending_actions',bg: 'bg-amber-100',    color: 'text-amber-600' },
          { label: 'مرفوضة',   value: rejected,            icon: 'cancel',         bg: 'bg-[#ba1a1a]/10', color: 'text-[#ba1a1a]' },
        ].map(({ label, value, icon, bg, color }) => (
          <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c4d8]/05">
            <div className={`p-2 rounded-lg ${bg} ${color} inline-block mb-3`}>
              <span className="material-symbols-outlined">{icon}</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
            <h3 className="text-3xl font-headline font-bold mt-1">{value}</h3>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-2xl shadow-sm mb-6 w-fit">
        {[['all','الكل'], ['pending','بانتظار'], ['approved','مقبولة'], ['rejected','مرفوضة']].map(([s, label]) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === s ? 'bg-[#4744e5] text-white shadow' : 'text-slate-500 hover:bg-[#f2f3ff]'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 size={24} className="animate-spin text-[#4744e5]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#c7c4d8]/10 p-16 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-200 block mb-3">event_busy</span>
          <p className="text-slate-400 text-sm">لا توجد حجوزات {filter !== 'all' ? ({'pending':'بانتظار','approved':'مقبولة','rejected':'مرفوضة'}[filter] ?? '') : ''}</p>
          <Link to="/portal/find-room"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg shadow-[#4744e5]/20"
            style={{ background: 'linear-gradient(135deg, #4744e5, #6161ff)' }}>
            <span className="material-symbols-outlined text-sm">add</span>
            احجز قاعة
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => {
            const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.pending
            return (
              <div key={r.id} className={`bg-white rounded-2xl border-l-4 border border-[#c7c4d8]/10 p-6 ${s.card} flex items-start gap-6 hover:shadow-lg transition-shadow`}>
                {/* Left: room icon */}
                <div className="w-12 h-12 rounded-2xl bg-[#e4e7fc] flex items-center justify-center text-[#4744e5] flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">meeting_room</span>
                </div>

                {/* Center: details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-base font-bold font-headline text-[#171b2a]">{r.room_name}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex-shrink-0 ${s.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {r.building_name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {r.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {r.start_time} – {r.end_time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">groups</span>
                      {r.students_number} طالب
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 italic">"{r.purpose}"</p>
                  {(r.admin_notes || r.notes) && (
                    <p className="text-xs text-[#ba1a1a] mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">info</span>
                      ملاحظة الإدارة: {r.admin_notes || r.notes}
                    </p>
                  )}
                </div>

                {/* Right: cancel button */}
                {canCancel(r) && (
                  <button
                    onClick={() => handleCancel(r.id)}
                    disabled={canceling === r.id}
                    className="flex-shrink-0 p-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white transition-all disabled:opacity-50"
                    title="Cancel request"
                  >
                    {canceling === r.id
                      ? <Loader2 size={18} className="animate-spin" />
                      : <span className="material-symbols-outlined text-[18px]">close</span>
                    }
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
