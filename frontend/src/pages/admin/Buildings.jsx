import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { buildingService } from '../../services/roomService'

/* ── Demo buildings (fallback if API unreachable) ── */
const DEMO_BUILDINGS = []

/* ── Add/Edit Modal ── */
function BuildingModal({ open, onClose, onSave, initial }) {
  const blank = { name: '', code: '', description: '' }
  const [form, setForm] = useState(initial ?? blank)
  const [saving, setSaving] = useState(false)
  useEffect(() => { setForm(initial ?? blank) }, [initial])
  if (!open) return null

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
            {initial?.id ? 'تعديل مبنى' : 'إضافة مبنى جديد'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">اسم المبنى</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="مثال: قاعة المقدسي"
              className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">الرمز</label>
            <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="مثال: MQ"
              className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">الوصف</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="وصف مختصر لهذا المبنى…"
              className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#c7c4d8]/30 text-sm font-medium text-[#464555] hover:bg-[#f2f3ff] transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl text-white text-sm font-bold shadow-lg shadow-[#4744e5]/20 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #4744e5, #6161ff)' }}>
            {saving ? <Loader2 size={16} className="animate-spin mx-auto" /> : (initial?.id ? 'Save Changes' : 'Add Building')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   BUILDINGS PAGE
═══════════════════════════════════════════ */
export default function Buildings() {
  const [buildings, setBuildings] = useState(DEMO_BUILDINGS)
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState({ open: false, data: null })

  const load = () => {
    setLoading(true)
    buildingService.getAll()
      .then(data => { if (data) setBuildings(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleSave = async (form) => {
    try {
      if (modal.data?.id) await buildingService.update(modal.data.id, form)
      else await buildingService.create(form)
      setModal({ open: false, data: null }); load()
    } catch {
      if (modal.data?.id) {
        setBuildings(bs => bs.map(b => b.id === modal.data.id ? { ...b, ...form } : b))
      } else {
        setBuildings(bs => [...bs, { ...form, id: Date.now(), rooms: 0, status: 'active' }])
      }
      setModal({ open: false, data: null })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this building?')) return
    try { await buildingService.remove(id) } catch {}
    setBuildings(bs => bs.filter(b => b.id !== id))
  }

  const active      = buildings.filter(b => b.status !== 'maintenance').length
  const totalRooms  = buildings.reduce((s, b) => s + (b.rooms ?? 0), 0)

  return (
    <>
      <BuildingModal
        open={modal.open}
        onClose={() => setModal({ open: false, data: null })}
        onSave={handleSave}
        initial={modal.data}
      />

      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-1">
          <p className="text-[#4744e5] uppercase tracking-[0.2em] text-[11px] font-bold">Administrative Panel</p>
          <h2 className="text-4xl font-headline font-extrabold text-[#171b2a] tracking-tight">Buildings Management</h2>
          <p className="text-slate-500 text-sm max-w-md">Manage campus buildings and monitor facility status across Yarmouk University.</p>
        </div>
        <button
          onClick={() => setModal({ open: true, data: null })}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#4744e5]/30 hover:shadow-[#4744e5]/40 active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Building
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: 'corporate_fare', iconBg: 'bg-[#4744e5]/10', iconColor: 'text-[#4744e5]', label: 'Total Buildings', value: buildings.length },
          { icon: 'check_circle',   iconBg: 'bg-[#006d2e]/10', iconColor: 'text-[#006d2e]', label: 'Active',          value: active },
          { icon: 'meeting_room',   iconBg: 'bg-[#4648d4]/10', iconColor: 'text-[#4648d4]', label: 'Total Rooms',     value: totalRooms },
        ].map(({ icon, iconBg, iconColor, label, value }) => (
          <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c4d8]/05">
            <div className="mb-4">
              <div className={`p-2 rounded-lg ${iconBg} ${iconColor} inline-block`}>
                <span className="material-symbols-outlined">{icon}</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
            <h3 className="text-3xl font-headline font-bold mt-1">{value}</h3>
          </div>
        ))}
      </div>

      {/* Grid of building cards */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 size={24} className="animate-spin text-[#4744e5]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {buildings.map(b => (
            <div key={b.id}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-[#c7c4d8]/10 hover:shadow-xl transition-all duration-300 flex flex-col">
              {/* Icon + badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#e4e7fc] flex items-center justify-center text-[#4744e5] group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">corporate_fare</span>
                </div>
                {b.status === 'maintenance' ? (
                  <span className="px-3 py-1 bg-[#ffdad6] text-[#93000a] text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    Maintenance
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-[#6bff8f] text-[#005321] text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    Active
                  </span>
                )}
              </div>

              {/* Code badge + name */}
              <div className="mb-1 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#e1dfff] text-[#4744e5] text-[10px] font-bold rounded-md">{b.code}</span>
              </div>
              <h3 className="text-xl font-bold font-headline mb-1">{b.name}</h3>
              <p className="text-slate-500 text-sm flex-1 mb-4">{b.description}</p>

              {/* Rooms count + list */}
              <div className="mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg w-fit mb-2">
                  <span className="material-symbols-outlined text-slate-600 text-[18px]">meeting_room</span>
                  <span className="text-xs font-semibold">{b.rooms ?? 0} Rooms</span>
                </div>
                {b.room_list?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {b.room_list.map(r => (
                      <span key={r.id} className="px-2 py-1 bg-[#f2f3ff] text-[#4744e5] text-[10px] font-bold rounded-md border border-[#e1dfff]">
                        {r.room_name} ({r.capacity})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => setModal({ open: true, data: b })}
                  className="flex-1 py-2.5 rounded-xl bg-[#e4e7fc] text-[#4744e5] font-bold text-sm hover:bg-[#dee1f6] transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">edit</span> Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="px-4 py-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] font-bold text-sm hover:bg-[#ba1a1a] hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
