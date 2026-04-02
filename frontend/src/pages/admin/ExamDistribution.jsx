import React, { useState, useEffect } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { roomService, buildingService } from '../../services/roomService'
import api from '../../services/api'

export default function ExamDistribution() {
  const [totalStudents, setTotalStudents] = useState('')
  const [buildings, setBuildings] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { buildingService.getAll().then(setBuildings) }, [])

  const handleDistribute = async () => {
    if (!totalStudents || totalStudents < 1) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await api.post('/ai/exam-distribute', {
        total_students: parseInt(totalStudents),
        building_id: selectedBuilding || undefined,
      })
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.message ?? 'تعذر تنفيذ التوزيع حالياً. تأكد من تشغيل السيرفر ثم أعد المحاولة.')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold text-[#171b2a]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Exam Distribution</h1><p className="text-sm text-[#464555]">AI-powered student distribution across available rooms</p></div>

      <div className="bg-white rounded-2xl border border-[#c7c4d8]/10 p-8 max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[#e1dfff] rounded-xl flex items-center justify-center"><Sparkles size={18} className="text-[#4744e5]" /></div>
          <div><p className="text-sm font-bold text-[#171b2a]">AI Room Allocator</p><p className="text-xs text-[#464555]">Greedy bin-packing algorithm</p></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#171b2a] uppercase tracking-wider block mb-1.5">Total Students</label>
            <input type="number" min="1" value={totalStudents} onChange={e => setTotalStudents(e.target.value)} placeholder="e.g. 200"
              className="w-full px-4 py-3 rounded-xl bg-[#f2f3ff] border border-[#c7c4d8]/40 text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/20 focus:border-[#4744e5] transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#171b2a] uppercase tracking-wider block mb-1.5">Preferred Building (optional)</label>
            <select value={selectedBuilding} onChange={e => setSelectedBuilding(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f2f3ff] border border-[#c7c4d8]/40 text-sm outline-none focus:ring-2 focus:ring-[#4744e5]/20 focus:border-[#4744e5] transition-all">
              <option value="">All buildings</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <button onClick={handleDistribute} disabled={loading || !totalStudents}
            className="w-full py-3 bg-gradient-to-br from-[#4744e5] to-[#6161ff] text-white rounded-xl font-bold shadow-lg shadow-[#4744e5]/20 hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Distributing...</> : <><Sparkles size={16} /> Distribute Students</>}
          </button>
        </div>

        {error && <div className="mt-4 px-4 py-3 bg-[#ffdad6] border border-[#93000a]/20 rounded-xl text-sm text-[#93000a]">{error}</div>}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#171b2a]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Distribution Result</h2>
            <span className="px-3 py-1 bg-[#6bff8f]/30 text-[#005321] rounded-full text-xs font-bold">{result.total_allocated}/{totalStudents} Allocated</span>
          </div>
          <div className="bg-white rounded-2xl border border-[#c7c4d8]/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#f2f3ff]">{['Room','Building','Capacity','Allocated','Utilization'].map(h => <th key={h} className="text-left px-6 py-3 text-xs font-bold text-[#464555] uppercase tracking-wider">{h}</th>)}</tr></thead>
              <tbody>
                {result.distribution?.map((row, i) => (
                  <tr key={i} className="border-t border-[#c7c4d8]/10 hover:bg-[#f2f3ff] transition-colors">
                    <td className="px-6 py-3 font-semibold text-[#171b2a]">{row.room_name}</td>
                    <td className="px-6 py-3 text-[#464555]">{row.building}</td>
                    <td className="px-6 py-3 text-[#464555]">{row.capacity}</td>
                    <td className="px-6 py-3 font-bold text-[#4744e5]">{row.students}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#e1dfff] rounded-full overflow-hidden">
                          <div className="h-full bg-[#4744e5] rounded-full" style={{ width: `${Math.round(row.students/row.capacity*100)}%` }} />
                        </div>
                        <span className="text-xs text-[#464555] font-medium">{Math.round(row.students/row.capacity*100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
