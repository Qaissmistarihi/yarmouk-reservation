import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import api from '../../services/api'

/* ── No demo users — data from real backend ── */
const DEMO_USERS = []

/* ── Role badge style ── */
const ROLE_STYLES = {
  doctor:     'bg-[#e1e0ff] text-[#2f2ebe]',
  admin:      'bg-[#e1dfff] text-[#2c24ce]',
  assistant:  'bg-slate-100 text-slate-500',
  it_support: 'bg-[#e4e7fc] text-[#4744e5]',
}
const ROLE_LABELS = {
  doctor: 'دكتور', admin: 'مدير', assistant: 'مساعد', it_support: 'دعم تقني',
}

/* ── Invite Modal ── */
function InviteModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'doctor', department: '' })
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-bold font-headline text-[#171b2a]">دعوة مستخدم جديد</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="space-y-4">
          {[['الاسم الكامل', 'name', 'text', 'مثال: د. ريم علي'],
            ['Email Address', 'email', 'email', 'name@yu.edu.jo']].map(([label, key, type, ph]) => (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{label}</label>
              <input type={type} placeholder={ph} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30">
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
                <option value="assistant">Assistant</option>
                <option value="it_support">IT Support</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Department</label>
              <input type="text" placeholder="e.g. Computer Science" value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                className="w-full px-4 py-3 bg-[#f2f3ff] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/30" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#c7c4d8]/30 text-sm font-medium text-[#464555] hover:bg-[#f2f3ff] transition-all">
            Cancel
          </button>
          <button onClick={() => { alert('تم إرسال الدعوة!'); onClose() }}
            className="flex-1 py-3 rounded-xl text-white text-sm font-bold shadow-lg shadow-[#4744e5]/20"
            style={{ background: 'linear-gradient(135deg, #4744e5, #6161ff)' }}>
            Send Invite
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Row action dropdown ── */
function ActionMenu({ userId, onDeactivate }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="p-2 text-slate-400 hover:text-[#4744e5] transition-colors rounded-lg hover:bg-[#f2f3ff]">
        <span className="material-symbols-outlined">more_vert</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-[#c7c4d8]/20 z-10 py-1 text-sm">
          <button onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2.5 hover:bg-[#f2f3ff] text-slate-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#4744e5]">edit</span> Edit User
          </button>
          <button onClick={() => { onDeactivate(userId); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 hover:bg-[#ffdad6] text-[#ba1a1a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">block</span> Deactivate
          </button>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   USERS PAGE
═══════════════════════════════════════════ */
const TABS = ['All Faculty', 'Administrators', 'IT Staff']

export default function Users() {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]       = useState('All Faculty')
  const [search, setSearch] = useState('')
  const [invite, setInvite] = useState(false)
  const [page, setPage]     = useState(1)

  const loadUsers = () => {
    setLoading(true)
    api.get('/users')
      .then(r => { if (r.data) setUsers(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(loadUsers, [])

  const handleDeactivate = (id) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, status: 'inactive' } : u))
  }

  const filtered = users.filter(u => {
    if (tab === 'Administrators') return u.role === 'admin'
    if (tab === 'IT Staff')       return u.role === 'it_support'
    const q = search.toLowerCase()
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) ||
           u.department?.toLowerCase().includes(q)
  })

  const activeCount     = users.filter(u => u.status === 'active').length
  const pendingInvites  = 0
  const securityAlerts  = 0

  return (
    <>
      <InviteModal open={invite} onClose={() => setInvite(false)} />

      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-[#171b2a] tracking-tight">User Management</h2>
          <p className="text-[#464555] mt-1">Manage faculty members, administrators, and campus staff access levels.</p>
        </div>
        <button
          onClick={() => setInvite(true)}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#4744e5]/20 hover:scale-[1.02] active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Invite New User
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c7c4d8]/05">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Users</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-headline font-bold">{users.length}</span>
            <span className="text-[#006d2e] text-xs font-bold bg-[#6bff8f]/30 px-2 py-1 rounded-lg">مسجّل</span>
          </div>
        </div>

        {/* Active Now */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c7c4d8]/05">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Now</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-headline font-bold">{activeCount}</span>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-white bg-[#e1dfff] text-[8px] flex items-center justify-center font-bold text-[#4744e5]">
                {activeCount}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Invites */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c7c4d8]/05">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Invites</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-headline font-bold">{pendingInvites}</span>
            <span className="material-symbols-outlined text-[#6161ff]">mail</span>
          </div>
        </div>

        {/* Security Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c7c4d8]/05">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Security Alerts</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-headline font-bold">{securityAlerts}</span>
            <span className="material-symbols-outlined text-[#006d2e]"
              style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#c7c4d8]/10">

        {/* Tab bar */}
        <div className="px-8 py-5 flex items-center justify-between bg-[#f2f3ff]/30 border-b border-[#c7c4d8]/10">
          <div className="flex gap-6">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-sm font-bold pb-1 transition-colors ${
                  tab === t
                    ? 'text-[#4744e5] border-b-2 border-[#4744e5]'
                    : 'text-slate-500 hover:text-[#4744e5]'
                }`}>
                {t}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-[#c7c4d8]/20 hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f3ff]/20">
                {['Name & Profile', 'Email Address', 'Role', 'Department', 'Last Active', 'Status', 'Actions'].map((h, i) => (
                  <th key={h}
                    className={`px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest ${i === 0 ? 'pl-8' : ''} ${i === 6 ? 'text-right pr-8' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/05">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Loader2 size={24} className="animate-spin mx-auto text-[#4744e5]" />
                  </td>
                </tr>
              ) : filtered.map((u, idx) => (
                <tr key={u.id}
                  className={`hover:bg-[#e1dfff]/20 transition-colors ${idx % 2 === 1 ? 'bg-[#f2f3ff]/05' : ''}`}>
                  {/* Name */}
                  <td className="pl-8 pr-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=e1dfff&color=4744e5`}
                        alt={u.name}
                        className={`w-10 h-10 rounded-full object-cover ${u.status === 'inactive' ? 'grayscale opacity-60' : ''}`}
                      />
                      <div>
                        <p className={`font-headline font-bold text-sm ${u.status === 'inactive' ? 'text-slate-500' : 'text-[#171b2a]'}`}>
                          {u.name}
                        </p>
                        <p className={`text-xs ${u.status === 'inactive' ? 'text-slate-400' : 'text-slate-500'}`}>
                          ID: #{u.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${ROLE_STYLES[u.role] ?? 'bg-[#f2f3ff] text-[#464555]'}`}>
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </td>
                  {/* Department */}
                  <td className={`px-6 py-4 text-sm ${u.status === 'inactive' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {u.department ?? '—'}
                  </td>
                  {/* Last Active */}
                  <td className={`px-6 py-4 text-sm ${u.status === 'inactive' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {u.lastActive ?? u.last_active ?? '—'}
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4">
                    {u.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6bff8f] text-[#005321] text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006d2e] animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                        Inactive
                      </span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="pr-8 py-4 text-right">
                    <ActionMenu userId={u.id} onDeactivate={handleDeactivate} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-4 flex items-center justify-between bg-[#f2f3ff]/10 border-t border-[#c7c4d8]/10">
          <p className="text-xs text-slate-500">
            عرض <span className="font-bold text-[#171b2a]">{filtered.length}</span> من{' '}
            <span className="font-bold text-[#171b2a]">{users.length}</span> مستخدم
          </p>
        </div>
      </div>
    </>
  )
}
