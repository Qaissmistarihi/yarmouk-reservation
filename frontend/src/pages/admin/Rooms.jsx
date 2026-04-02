import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { roomService, buildingService } from '../../services/roomService'

/* ── Room type → label ── */
const TYPE_LABELS = {
  lecture_hall: 'قاعة محاضرات',
  lab:          'مختبر',
  seminar:      'قاعة ندوات',
  auditorium:   'مدرج',
}

/* ── No demo rooms — data from real backend ── */

/* ── Status badge ── */
function StatusBadge({ status }) {
  if (status === 'maintenance') return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ffdad6] text-[#93000a]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] mr-2 animate-pulse" />
      صيانة
    </span>
  )
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#6bff8f] text-[#005321]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#006d2e] mr-2" />
      نشط
    </span>
  )
}

/* ── Add/Edit Modal ── */
const ROOM_TYPES = ['lecture_hall', 'lab', 'seminar', 'auditorium']
const STATUS_OPTS = ['available', 'maintenance', 'unavailable']

function RoomModal({ open, onClose, onSave, initial, buildings }) {
  const blank = { room_name: '', building_id: '', capacity: '', room_type: 'lecture_hall', status: 'available' }
  const [form, setForm] = useState(initial ?? blank)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm(initial ?? blank) }, [initial])
  if (!open) return null

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-bold font-headline text-[#171b2a]">
            {initial?.id ? 'تعديل قاعة' : 'إضافة قاعة جديدة'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">اسم / رقم القاعة</label>
            <input value={form.room_name} onChange={set('room_name')} placeholder="مثال: 302 - قاعة محاضرات"
              className="w-full px-4 py-3 rounded-xl bg-[#f2f3ff] border-none text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">المبنى</label>
            <select value={form.building_id} onChange={set('building_id')}
              className="w-full px-4 py-3 rounded-xl bg-[#f2f3ff] border-none text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30">
              <option value="">اختر مبنى</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">السعة</label>
              <input type="number" min="1" value={form.capacity} onChange={set('capacity')}
                className="w-full px-4 py-3 rounded-xl bg-[#f2f3ff] border-none text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">نوع القاعة</label>
              <select value={form.room_type} onChange={set('room_type')}
                className="w-full px-4 py-3 rounded-xl bg-[#f2f3ff] border-none text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30">
                {ROOM_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">الحالة</label>
            <select value={form.status} onChange={set('status')}
              className="w-full px-4 py-3 rounded-xl bg-[#f2f3ff] border-none text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30">
              {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#c7c4d8]/30 text-sm font-medium text-[#464555] hover:bg-[#f2f3ff] transition-all">
            إلغاء
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl text-white text-sm font-bold shadow-lg shadow-[#4744e5]/20 disabled:opacity-60 transition-all"
            style={{ background: 'linear-gradient(135deg, #4744e5, #6161ff)' }}>
            {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : (initial?.id ? 'حفظ التغييرات' : 'إضافة قاعة')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   ROOMS MANAGEMENT PAGE
═══════════════════════════════════════════ */
export default function AdminRooms() {
  const [rooms, setRooms]       = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState({ open: false, data: null })
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([roomService.getAll(), buildingService.getAll()])
      .then(([r, b]) => { setRooms(r || []); setBuildings(b || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleSave = async (form) => {
    try {
      if (modal.data?.id) await roomService.update(modal.data.id, form)
      else await roomService.create(form)
      setModal({ open: false, data: null })
      load()
    } catch (e) {
      console.error('Save room error:', e)
      alert(e.response?.data?.message || 'فشل في حفظ القاعة')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('حذف هذه القاعة؟')) return
    try {
      await roomService.remove(id)
      load()
    } catch (e) {
      console.error('Delete room error:', e)
    }
  }

  const filtered = rooms.filter(r =>
    !search || r.room_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.building_name?.toLowerCase().includes(search.toLowerCase())
  )

  /* Stats */
  const active      = rooms.filter(r => r.status === 'available').length
  const maintenance = rooms.filter(r => r.status === 'maintenance').length
  const totalCap    = rooms.length ? Math.round(rooms.reduce((s, r) => s + (r.capacity ?? 0), 0) / rooms.length) : 0

  return (
    <>
      <RoomModal
        open={modal.open}
        onClose={() => setModal({ open: false, data: null })}
        onSave={handleSave}
        initial={modal.data}
        buildings={buildings}
      />

      {/* ── Page Header ── */}
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-1">
          <p className="text-[#4744e5] uppercase tracking-[0.2em] text-[11px] font-bold">لوحة الإدارة</p>
          <h2 className="text-4xl font-headline font-extrabold text-[#171b2a] tracking-tight">إدارة القاعات</h2>
          <p className="text-slate-500 text-sm max-w-md">
            إدارة تخصيص القاعات ومتابعة حالة الصيانة وضبط مواصفاتها عبر الحرم الجامعي.
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true, data: null })}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#4744e5]/30 hover:shadow-[#4744e5]/40 active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          إضافة قاعة جديدة
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          {
            icon: 'meeting_room', iconBg: 'bg-[#4744e5]/10', iconColor: 'text-[#4744e5]',
            badge: '+4 هذا الشهر', badgeCls: 'text-[#006d2e] bg-[#6bff8f] px-2 py-1 rounded-full',
            label: 'إجمالي القاعات', value: rooms.length,
          },
          {
            icon: 'check_circle', iconBg: 'bg-[#006d2e]/10', iconColor: 'text-[#006d2e]',
            badge: '91% تشغيل', badgeCls: 'text-slate-400',
            label: 'نشطة الآن', value: active,
          },
          {
            icon: 'build', iconBg: 'bg-[#ba1a1a]/10', iconColor: 'text-[#ba1a1a]',
            badge: 'تتطلب انتباهاً', badgeCls: 'text-[#93000a] bg-[#ffdad6] px-2 py-1 rounded-full',
            label: 'صيانة', value: maintenance,
          },
          {
            icon: 'group', iconBg: 'bg-[#4648d4]/10', iconColor: 'text-[#4648d4]',
            badge: null, badgeCls: '',
            label: 'متوسط السعة', value: totalCap,
          },
        ].map(({ icon, iconBg, iconColor, badge, badgeCls, label, value }) => (
          <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c4d8]/05">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${iconBg} ${iconColor}`}>
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              {badge && <span className={`text-[10px] font-bold ${badgeCls}`}>{badge}</span>}
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
            <h3 className="text-3xl font-headline font-bold mt-1">{value}</h3>
          </div>
        ))}
      </div>

      {/* ── Table Section ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="p-6 flex items-center justify-between border-b border-[#c7c4d8]/10">
          <div className="flex items-center gap-4">
            <h3 className="font-headline font-bold text-lg">قائمة القاعات</h3>
            {/* Inline search */}
            <div className="relative hidden md:flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">search</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="بحث باسم القاعة أو المبنى..."
                className="pl-10 pr-4 py-2 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/20 w-56"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-[#ebedff] transition-colors rounded-lg border border-[#c7c4d8]/30">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              تصفية
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-[#ebedff] transition-colors rounded-lg border border-[#c7c4d8]/30">
              <span className="material-symbols-outlined text-sm">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f3ff]/50">
                {['رقم القاعة', 'المبنى', 'السعة', 'نوع القاعة', 'الحالة', 'إجراءات'].map((h, i) => (
                  <th key={h}
                    className={`px-6 py-4 text-xs font-bold uppercase tracking-[0.1em] text-slate-500 ${i === 5 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/05">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Loader2 size={24} className="animate-spin mx-auto text-[#4744e5]" />
                  </td>
                </tr>
              ) : filtered.map((r, idx) => (
                <tr key={r.id}
                  className={`hover:bg-[#4744e5]/5 transition-colors group ${idx % 2 === 1 ? 'bg-[#f2f3ff]/10' : ''}`}>
                  {/* Room Number */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#e4e7fc] flex items-center justify-center font-headline font-bold text-[#4744e5] text-xs flex-shrink-0">
                        {r.building_code ?? '?'}
                      </div>
                      <span className="font-headline font-bold text-[#171b2a]">{r.room_name}</span>
                    </div>
                  </td>
                  {/* Building */}
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium">{r.building_name}</p>
                    <p className="text-[10px] text-slate-400">{TYPE_LABELS[r.room_type] ?? r.room_type}</p>
                  </td>
                  {/* Capacity */}
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-bold px-3 py-1 bg-[#e4e7fc] rounded-full">{r.capacity}</span>
                  </td>
                  {/* Room Type */}
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-[#f2f3ff] text-[#4744e5] text-[10px] font-bold rounded-lg">
                      {TYPE_LABELS[r.room_type] ?? r.room_type}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-5">
                    <StatusBadge status={r.status} />
                  </td>
                  {/* Actions (hidden, show on hover) */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModal({ open: true, data: r })}
                        className="p-2 text-slate-400 hover:text-[#4744e5] hover:bg-[#4744e5]/10 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-2 text-slate-400 hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#c7c4d8]/10">
          <p className="text-xs text-slate-500">
            عرض <span className="font-bold">{filtered.length}</span> من{' '}
            <span className="font-bold">{rooms.length}</span> قاعة
          </p>
        </div>
      </div>
    </>
  )
}
