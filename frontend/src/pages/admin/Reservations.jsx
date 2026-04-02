import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { reservationService } from '../../services/reservationService'

/* ── No demo data — real backend ── */

const STATUS_TABS = ['all', 'pending', 'approved', 'rejected']
const STATUS_TAB_LABELS = { all: 'الكل', pending: 'بانتظار', approved: 'مقبولة', rejected: 'مرفوضة' }

function StatusBadge({ status }) {
  const s = {
    pending:  'bg-[#e1dfff] text-[#4744e5]',
    approved: 'bg-[#6bff8f] text-[#005321]',
    rejected: 'bg-[#ffdad6] text-[#93000a]',
  }[status] ?? 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${s}`}>
      {status === 'approved' && <span className="w-1.5 h-1.5 rounded-full bg-[#006d2e]" />}
      {status === 'pending'  && <span className="w-1.5 h-1.5 rounded-full bg-[#4744e5] animate-pulse" />}
      {status === 'rejected' && <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />}
      {status === 'approved' ? 'مقبول' : status === 'pending' ? 'بانتظار' : status === 'rejected' ? 'مرفوض' : status}
    </span>
  )
}

/* ═══════════════════════════════════════════
   RESERVATIONS PAGE
═══════════════════════════════════════════ */
export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [actionId, setActionId] = useState(null)

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

  const handleExport = () => {
    const rows = filtered.map(r => ([
      r.doctor_name ?? r.user_name ?? '',
      r.room_name ?? '',
      r.building_name ?? '',
      r.date ?? '',
      r.start_time ?? '',
      r.end_time ?? '',
      r.students_number ?? '',
      r.purpose ?? '',
      r.status ?? '',
    ]))

    const suffix = filter === 'all' ? 'all' : filter
    downloadCsv(
      `reservations_${suffix}.csv`,
      ['عضو هيئة التدريس', 'القاعة', 'المبنى', 'التاريخ', 'وقت البداية', 'وقت النهاية', 'عدد الطلاب', 'الغرض', 'الحالة'],
      rows
    )
  }

  const load = () => {
    setLoading(true)
    reservationService.getAll(filter !== 'all' ? { status: filter } : {})
      .then(d => { const arr = Array.isArray(d) ? d : (d.data ?? []); setReservations(arr) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [filter])

  const handleStatus = async (id, status) => {
    setActionId(id)
    try {
      await reservationService.updateStatus(id, status)
      load()
    } catch (e) {
      console.error('Update status error:', e)
    } finally { setActionId(null) }
  }

  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter)
  const pending  = reservations.filter(r => r.status === 'pending').length
  const approved = reservations.filter(r => r.status === 'approved').length
  const rejected = reservations.filter(r => r.status === 'rejected').length

  return (
    <>
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-1">
          <p className="text-[#4744e5] uppercase tracking-[0.2em] text-[11px] font-bold">لوحة الإدارة</p>
          <h2 className="text-4xl font-headline font-extrabold text-[#171b2a] tracking-tight">إدارة الحجوزات</h2>
          <p className="text-slate-500 text-sm max-w-md">راجع واعتمد أو ارفض طلبات حجز القاعات من أعضاء هيئة التدريس.</p>
        </div>
        <button onClick={handleExport} disabled={loading || filtered.length === 0}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#4744e5]/20 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #4744e5, #6161ff)' }}>
          <span className="material-symbols-outlined text-[20px]">download</span>
          تصدير
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { icon: 'event_available', iconBg: 'bg-[#4744e5]/10', iconColor: 'text-[#4744e5]', label: 'الإجمالي',    value: reservations.length },
          { icon: 'pending_actions', iconBg: 'bg-[#4744e5]/10', iconColor: 'text-[#4744e5]', label: 'بانتظار',  value: pending  },
          { icon: 'check_circle',   iconBg: 'bg-[#006d2e]/10', iconColor: 'text-[#006d2e]', label: 'مقبولة', value: approved },
          { icon: 'cancel',         iconBg: 'bg-[#ba1a1a]/10', iconColor: 'text-[#ba1a1a]', label: 'مرفوضة', value: rejected },
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#c7c4d8]/10">
        {/* Filter tabs */}
        <div className="px-6 py-4 flex items-center gap-2 border-b border-[#c7c4d8]/10 bg-[#f2f3ff]/30">
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === s ? 'bg-[#4744e5] text-white shadow' : 'text-slate-500 hover:bg-[#f2f3ff]'
              }`}>
              {STATUS_TAB_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f3ff]/20">
                {['عضو هيئة التدريس', 'القاعة', 'التاريخ والوقت', 'الطلاب', 'الغرض', 'الحالة', 'إجراءات'].map((h, i) => (
                  <th key={h}
                    className={`px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest ${i === 0 ? 'pl-8' : ''} ${i === 6 ? 'text-right pr-8' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/05">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-16">
                  <Loader2 size={24} className="animate-spin mx-auto text-[#4744e5]" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-slate-400">لا توجد حجوزات.</td></tr>
              ) : filtered.map((r, idx) => (
                <tr key={r.id} className={`hover:bg-[#e1dfff]/20 transition-colors ${idx % 2 === 1 ? 'bg-[#f2f3ff]/05' : ''}`}>
                  {/* Faculty */}
                  <td className="pl-8 pr-6 py-4">
                    <p className="font-bold text-sm text-[#171b2a]">{r.doctor_name ?? r.user_name}</p>
                  </td>
                  {/* Room */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold">{r.room_name}</p>
                    <p className="text-[10px] text-slate-400">{r.building_name}</p>
                  </td>
                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{r.date}</p>
                    <p className="text-[10px] text-slate-400">{r.start_time} – {r.end_time}</p>
                  </td>
                  {/* Students */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold px-3 py-1 bg-[#e4e7fc] rounded-full">{r.students_number}</span>
                  </td>
                  {/* Purpose */}
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-[140px] truncate" title={r.purpose}>
                    {r.purpose}
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  {/* Actions */}
                  <td className="pr-8 py-4 text-right">
                    {r.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={actionId === r.id}
                          onClick={() => handleStatus(r.id, 'approved')}
                          className="p-2 text-[#006d2e] hover:bg-[#6bff8f]/30 rounded-lg transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        </button>
                        <button
                          disabled={actionId === r.id}
                          onClick={() => handleStatus(r.id, 'rejected')}
                          className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                        </button>
                        {actionId === r.id && <Loader2 size={16} className="animate-spin text-[#4744e5]" />}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 flex items-center justify-between border-t border-[#c7c4d8]/10 bg-[#f2f3ff]/10">
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-[#171b2a]">{filtered.length}</span> of{' '}
            <span className="font-bold text-[#171b2a]">{reservations.length}</span> reservations
          </p>
        </div>
      </div>
    </>
  )
}
