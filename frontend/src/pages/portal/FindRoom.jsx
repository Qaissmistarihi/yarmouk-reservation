import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { roomService, buildingService } from '../../services/roomService'
import { reservationService } from '../../services/reservationService'
import api from '../../services/api'

/* ── Equipment tag config ── */
const EQUIPMENT_TAGS = {
  projector:    { icon: 'videocam',        label: 'جهاز عرض',      cls: 'bg-blue-50 text-blue-600' },
  smart_board:  { icon: 'border_color',    label: 'سبورة ذكية',   cls: 'bg-emerald-50 text-emerald-600' },
  wifi:         { icon: 'wifi',            label: 'WiFi سريع',    cls: 'bg-amber-50 text-amber-600' },
  audio:        { icon: 'mic',             label: 'نظام صوتي',   cls: 'bg-indigo-50 text-indigo-600' },
  workstations: { icon: 'computer',        label: 'محطات عمل',   cls: 'bg-purple-50 text-purple-600' },
  av_suite:     { icon: 'videocam',        label: 'جهاز AV كامل',  cls: 'bg-slate-100 text-slate-500' },
}

/* ── Room type → icon ── */
function roomIcon(type) {
  switch (type) {
    case 'lab':        return 'laptop_chromebook'
    case 'auditorium': return 'school'
    default:           return 'meeting_room'
  }
}

/* ── No demo rooms — real backend ── */

/* ── Reservation Modal ── */
function ReservationModal({ room, form, onClose, onSubmit, loading, error, success }) {
  const [purpose, setPurpose] = useState('')
  const [startTime, setStartTime] = useState(form.start_time || '')
  const [endTime, setEndTime]     = useState(form.end_time   || '')
  const [date, setDate]           = useState(form.date       || '')
  const [students, setStudents]   = useState(form.students_number || '')

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-[#6bff8f]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-[#006d2e]"
              style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h3 className="text-xl font-bold font-headline mb-2">تم إرسال الحجز!</h3>
          <p className="text-slate-500 text-sm mb-6">{success}</p>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #4744e5, #6161ff)' }}>
            تمّ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold font-headline">حجز {room.room_name}</h3>
            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {room.building_name}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-[#ffdad6] border border-[#93000a]/20 rounded-xl text-sm text-[#93000a] flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">التاريخ</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">عدد الطلاب</label>
              <input type="number" min="1" max={room.capacity} value={students}
                onChange={e => setStudents(e.target.value)} placeholder={`الحد الأقصى ${room.capacity}`} required
                className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">وقت البداية</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required
                className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">وقت الانتهاء</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required
                className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">الغرض</label>
            <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)}
              placeholder="مثل: امتحان نصفي، محاضرة، جلسة بحث" required
              className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
          </div>
        </div>

        <button
          disabled={loading}
          onClick={() => onSubmit(room, { date, start_time: startTime, end_time: endTime, students_number: students, purpose })}
          className="mt-6 w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-[#4744e5]/20 flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #4744e5, #6161ff)' }}
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> جاري الإرسال…</> : <>
            تأكيد الحجز
            <span className="material-symbols-outlined">arrow_forward</span>
          </>}
        </button>
      </div>
    </div>
  )
}

/* ── Room Card (Stitch style) ── */
function RoomCard({ room, onReserve }) {
  const available = room.status !== 'booked'
  const icon = roomIcon(room.room_type)

  return (
    <div className={`group bg-white p-6 rounded-[1.5rem] shadow-sm transition-all duration-300 relative flex flex-col
      ${available ? 'hover:shadow-xl' : 'opacity-80 border border-[#c7c4d8]/10'}`}>

      {/* Status badge */}
      <div className="absolute top-6 right-6">
        {available ? (
          <span className="px-3 py-1 bg-[#6bff8f] text-[#005321] text-[10px] font-bold uppercase tracking-wider rounded-lg">
            متاحة
          </span>
        ) : (
          <span className="px-3 py-1 bg-[#ffdad6] text-[#93000a] text-[10px] font-bold uppercase tracking-wider rounded-lg">
            محجوزة
          </span>
        )}
      </div>

      {/* Icon + name */}
      <div className="mb-6">
        <div className={`w-14 h-14 rounded-2xl bg-[#e4e7fc] flex items-center justify-center mb-4 transition-transform
          ${available ? 'group-hover:scale-110 text-[#4744e5]' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <h3 className="text-2xl font-bold font-headline mb-1">{room.room_name}</h3>
        <p className="text-slate-500 text-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">location_on</span>
          {room.building_name}
        </p>
      </div>

      {/* Capacity */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
          <span className="material-symbols-outlined text-slate-600 text-[18px]">groups</span>
          <span className="text-xs font-semibold">{room.capacity} مقعد</span>
        </div>
      </div>

      {/* Equipment */}
      {room.equipment?.length > 0 && (
        <div className="space-y-3 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">التجهيزات</p>
          <div className="flex flex-wrap gap-2">
            {room.equipment.map(eq => {
              const t = EQUIPMENT_TAGS[eq] ?? { icon: 'devices', label: eq, cls: 'bg-slate-100 text-slate-600' }
              return (
                <div key={eq} className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${t.cls}`}>
                  <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                  <span className="text-[10px] font-bold">{t.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      {available ? (
        <button
          onClick={() => onReserve(room)}
          className="mt-auto w-full py-4 bg-[#4744e5] group-hover:bg-[#6161ff] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#4744e5]/20"
        >
          احجز الآن
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      ) : (
        <button disabled
          className="mt-auto w-full py-4 bg-slate-200 text-slate-500 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
          غير متاحة حالياً
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   FIND ROOM PAGE
═══════════════════════════════════════════ */
export default function FindRoom() {
  const location = useLocation()
  const [buildings, setBuildings] = useState([])
  const [rooms, setRooms]         = useState([])
  const [filters, setFilters]     = useState({ building: '', date: '', capacity: '', room_type: '' })
  const [loading, setLoading]     = useState(false)
  const [selected, setSelected]   = useState(null)   // room being reserved
  const [bookLoading, setBookLoading] = useState(false)
  const [bookError, setBookError]     = useState('')
  const [bookSuccess, setBookSuccess] = useState('')

  const findAndSelectRoom = (roomId, list) => {
    if (!roomId) return
    const idNum = parseInt(roomId)
    if (Number.isNaN(idNum)) return
    const r = (list || []).find(x => x.id === idNum)
    if (r) setSelected(r)
  }

  useEffect(() => {
    const qs = new URLSearchParams(location.search)
    const rt = qs.get('room_type') || ''
    const rid = qs.get('room_id') || ''
    if (rt) setFilters(f => ({ ...f, room_type: rt }))

    buildingService.getAll()
      .then(b => setBuildings(b || []))
      .catch(() => {})
    // Load rooms on mount (respect query filter)
    roomService.getAll(rt ? { room_type: rt } : undefined)
      .then(r => {
        const list = r || []
        setRooms(list)
        if (rid) findAndSelectRoom(rid, list)
      })
      .catch(() => {})
  }, [location.search])

  const handleFilter = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const params = {}
      if (filters.building) params.building_id = filters.building
      if (filters.date)     params.date         = filters.date
      if (filters.capacity) params.capacity      = filters.capacity
      if (filters.room_type) params.room_type    = filters.room_type
      const data = await roomService.getAll(params)
      setRooms(data || [])
    } catch {
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  const handleReserve = async (room, formData) => {
    setBookLoading(true)
    setBookError('')
    setBookSuccess('')
    try {
      await reservationService.create({
        room_id: room.id,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        students_number: parseInt(formData.students_number),
        purpose: formData.purpose,
      })
      setBookSuccess(`تم إرسال طلب حجز ${room.room_name} بنجاح! بانتظار موافقة الإدارة.`)
    } catch (err) {
      setBookError(err.response?.data?.message ?? 'فشل الحجز — قد يكون الموعد محجوزاً مسبقاً.')
    } finally {
      setBookLoading(false)
    }
  }

  return (
    <>
      {/* ── Reservation Modal ── */}
      {selected && (
        <ReservationModal
          room={selected}
          form={filters}
          loading={bookLoading}
          error={bookError}
          success={bookSuccess}
          onClose={() => { setSelected(null); setBookError(''); setBookSuccess('') }}
          onSubmit={handleReserve}
        />
      )}

      {/* ── Hero Header ── */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-[#4744e5]/10 text-[#4744e5] text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
              بوابة أعضاء هيئة التدريس
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#171b2a] mb-2 font-headline">
              احجز قاعة
            </h2>
            <p className="text-[#464555] max-w-lg">
              ابحث عن القاعة المناسبة واحجزها لمحاضرتك أو ندوتك القادمة
              عبر حرم جامعة اليرموك.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/portal/my-reservations"
              className="px-6 py-3 bg-white text-[#4744e5] font-semibold rounded-xl shadow-sm border border-[#4744e5]/10 hover:bg-[#4744e5]/5 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">history</span>
              سجل الحجوزات
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
              className="px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              حجز سريع
            </button>
          </div>
        </div>
      </section>

      {/* ── Filter Section ── */}
      <section className="mb-10 bg-[#f2f3ff] p-6 rounded-[2rem]">
        <form onSubmit={handleFilter}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Building */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                المبنى
              </label>
              <select
                value={filters.building}
                onChange={e => setFilters(f => ({ ...f, building: e.target.value }))}
                className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4744e5]/40 shadow-sm appearance-none cursor-pointer outline-none"
              >
                <option value="">جميع المباني</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                تاريخ الحجز
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#767587] text-[18px] pointer-events-none">
                  calendar_today
                </span>
                <input
                  type="date"
                  value={filters.date}
                  onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4744e5]/40 shadow-sm cursor-pointer outline-none"
                />
              </div>
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                السعة
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#767587] text-[18px] pointer-events-none">
                  groups
                </span>
                <select
                  value={filters.capacity}
                  onChange={e => setFilters(f => ({ ...f, capacity: e.target.value }))}
                  className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4744e5]/40 shadow-sm appearance-none cursor-pointer outline-none"
                >
                  <option value="">أي سعة</option>
                  <option value="30">10 - 30 طالب</option>
                  <option value="60">30 - 60 طالب</option>
                  <option value="100">100+ مدرج</option>
                </select>
              </div>
            </div>

            {/* Apply */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#4648d4] text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> جاري البحث…</>
                ) : (
                  <><span className="material-symbols-outlined">filter_list</span> بحث</>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* ── Room Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} onReserve={setSelected} />
        ))}
      </div>
    </>
  )
}
