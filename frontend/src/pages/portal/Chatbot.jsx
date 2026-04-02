import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { roomService } from '../../services/roomService'
import { reservationService } from '../../services/reservationService'

/* ── Quick action suggestions ── */
const QUICK_ACTIONS = [
  { icon: 'search_check',   label: 'التحقق من توفر القاعة' },
  { icon: 'help_outline',   label: 'كيف أحجز؟' },
  { icon: 'history',        label: 'حجوزاتي الأخيرة' },
]

/* ── Initial chat history ── */
const INITIAL_MESSAGES = [
  {
    id: 1, role: 'bot', time: '09:12',
    text: "مرحباً دكتور! أنا مساعدك الأكاديمي الذكي. كيف يمكنني مساعدتك في إدارة قاعاتك أو جدولك اليوم?\n\nيمكنني التحقق من توفر القاعات لحظياً، حجز مختبر لامتحاناتك، أو تقديم تحليلات عن استخدام المباني.",
  },
  {
    id: 2, role: 'user', time: '09:14',
    text: 'أحتاج قاعة في مبنى تكنولوجيا المعلومات لمحاضرة تعويضية. السعة: 40 طالب. الوقت: الاثنين الساعة 10 صباحاً.',
  },
  {
    id: 3, role: 'bot', time: '09:14',
    text: 'جاري البحث عن قاعة في <b>مبنى تقنية المعلومات</b> يوم <b>الاثنين 10:00 صباحاً</b>...\n\nوجدت 3 خيارات مناسبة لك:',
  },
]

/* ── Simple "typing" bot reply simulator ── */
function botReply(input, roomsForCards) {
  const q = input.toLowerCase()

  if (
    q.includes('مرحبا') ||
    q.includes('أهلا') ||
    q.includes('اهلا') ||
    q.includes('السلام') ||
    q.includes('كيف حال') ||
    q.includes('كيفك') ||
    q.includes('كيفك؟') ||
    q.includes('كيفك؟') ||
    q.includes('شو اخبارك') ||
    q.includes('شو أخبارك') ||
    q.includes('شو اخبارك؟') ||
    q.includes('شو أخبارك؟') ||
    q.includes('هاي')
  )
    return { text: 'أهلاً وسهلاً! كيف أقدر أساعدك اليوم؟' }

  if (q.includes('شكرا') || q.includes('يسلم') || q.includes('مشكور'))
    return { text: 'العفو! إذا بدك أي مساعدة إضافية أنا جاهز.' }

  if (q.includes('room') || q.includes('classroom') || q.includes('find') || q.includes('قاعة') || q.includes('بحث'))
    return roomsForCards?.length
      ? { text: "وجدت عدة قاعات متاحة تلائم طلبك. إليك أفضل الخيارات:", cards: roomsForCards }
      : { text: 'حالياً ما قدرت أجيب قائمة القاعات. جرّب مرة ثانية أو افتح صفحة <b>البحث عن قاعة</b>.' }
  if (q.includes('book') || q.includes('reserve') || q.includes('حجز') || q.includes('حجوز'))
    return { text: "لإجراء حجز، توجه إلى صفحة <b>البحث عن قاعة</b> واملأ نموذج الحجز. يمكنني إرشادك خطوة بخطوة — فقط اسأل!" }
  if (q.includes('cancel') || q.includes('إلغاء'))
    return { text: "يمكنك إلغاء حجز موجود من صفحة <b>حجوزاتي</b>. فقط اضغط على أيقونة الإلغاء بجانب الطلب المعلق." }
  return { text: "أنا هنا لمساعدتك! احكيلي شو بدك: حجز قاعة، التحقق من التوفر، أو أي سؤال عام." }
}

function toIsoDate(d) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

function parseTimeRange(text) {
  const m = text.match(/(\d{1,2})(?::(\d{2}))?\s*[-–]\s*(\d{1,2})(?::(\d{2}))?/)
  if (!m) return null
  const h1 = String(parseInt(m[1], 10)).padStart(2, '0')
  const m1 = String(m[2] ? parseInt(m[2], 10) : 0).padStart(2, '0')
  const h2 = String(parseInt(m[3], 10)).padStart(2, '0')
  const m2 = String(m[4] ? parseInt(m[4], 10) : 0).padStart(2, '0')
  return { start_time: `${h1}:${m1}`, end_time: `${h2}:${m2}` }
}

function parseAvailabilityIntent(text) {
  const t = (text || '').toLowerCase()
  const out = {}

  const iso = t.match(/\b(\d{4}-\d{2}-\d{2})\b/)
  if (iso) out.date = iso[1]
  else if (t.includes('بكرا') || t.includes('بكرة') || t.includes('غدا') || t.includes('غداً')) {
    const d = new Date(); d.setDate(d.getDate() + 1)
    out.date = toIsoDate(d)
  } else if (t.includes('اليوم')) {
    out.date = toIsoDate(new Date())
  }

  const tr = parseTimeRange(t)
  if (tr) {
    out.start_time = tr.start_time
    out.end_time = tr.end_time
  }

  const cap = t.match(/(\d{1,3})\s*(طالب|طلاب|student|students)/)
  if (cap) out.capacity = cap[1]

  const lab = t.includes('مختبر')
  if (lab) out.room_type = 'lab'

  return out
}

/* ── Individual message bubble ── */
function MessageBubble({ msg, onSelectRoom }) {
  return (
    <div className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse ml-auto max-w-[80%]' : 'max-w-[90%]'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm ${
        msg.role === 'user' ? 'bg-[#e1dfff]' : 'bg-[#e4e7fc]'
      }`}>
        <span className="material-symbols-outlined text-[18px] text-[#4744e5]"
          style={{ fontVariationSettings: "'FILL' 1" }}>
          {msg.role === 'user' ? 'person' : 'smart_toy'}
        </span>
      </div>

      {/* Content */}
      <div className={`space-y-1 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
        {/* Bubble */}
        <div className={`text-sm leading-relaxed rounded-2xl p-5 ${
          msg.role === 'user'
            ? 'text-white rounded-tr-none shadow-md'
            : 'bg-white text-[#171b2a] rounded-tl-none shadow-sm border border-[#c7c4d8]/10'
        }`}
          style={msg.role === 'user' ? { background: 'linear-gradient(135deg,#4744e5,#6161ff)' } : {}}>
          <span dangerouslySetInnerHTML={{ __html: (msg.text || '').replace(/\n/g, '<br/>') }} />
        </div>

        {/* Room cards */}
        {msg.cards && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 w-full">
            {msg.cards.map(room => (
              <div key={room.id}
                className="bg-white border border-[#c7c4d8]/15 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-[#171b2a]">{room.room_name}</h4>
                  <span className="px-2 py-0.5 bg-[#6bff8f] text-[#005321] text-[10px] font-bold rounded-full">متاحة</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">groups</span>{room.capacity} مقعد
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">corporate_fare</span>{room.building_name}
                  </span>
                </div>
                <button
                  onClick={() => onSelectRoom(room)}
                  className="w-full py-2 rounded-lg text-xs font-bold text-[#4744e5] bg-[#4744e5]/05 group-hover:bg-[#4744e5] group-hover:text-white transition-all">
                  اختر هذه القاعة
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-[10px] text-slate-400 font-medium ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>{msg.time}</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   CHATBOT PAGE
══════════════════════════════════════ */
export default function Chatbot() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages]   = useState(INITIAL_MESSAGES)
  const [input, setInput]         = useState('')
  const [typing, setTyping]       = useState(false)
  const [roomsForCards, setRoomsForCards] = useState([])
  const [pendingAvail, setPendingAvail] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    roomService.getAll({ status: 'available' })
      .then((r) => setRoomsForCards(Array.isArray(r) ? r.slice(0, 4) : []))
      .catch(() => setRoomsForCards([]))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const now = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const pushBot = (payload) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), role: 'bot', time: now(), ...payload }])
  }

  const formatMyReservations = (list) => {
    if (!Array.isArray(list) || list.length === 0) {
      return 'ما في حجوزات حالياً.'
    }
    const top = list.slice(0, 5)
    const lines = top.map((r, i) => {
      const when = `${r.date} ${r.start_time}-${r.end_time}`
      const status = r.status === 'approved' ? 'مقبول' : r.status === 'pending' ? 'بانتظار' : r.status === 'rejected' ? 'مرفوض' : r.status
      return `${i + 1}) ${r.room_name} • ${r.building_name} • ${when} • ${status}`
    })
    return `آخر حجوزاتك:\n${lines.join('\n')}`
  }

  const runAvailabilitySearch = async (params) => {
    const missing = []
    if (!params?.date) missing.push('التاريخ')
    if (!params?.start_time) missing.push('وقت البداية')
    if (!params?.end_time) missing.push('وقت النهاية')
    if (!params?.capacity) missing.push('عدد الطلاب')

    if (missing.length) {
      setPendingAvail({ ...(pendingAvail || {}), ...(params || {}) })
      pushBot({ text: `تمام. ناقصني: <b>${missing.join('، ')}</b>.\nاكتبهم مثلاً: 2026-04-10 و 10-12 و 40 طالب.` })
      return
    }

    setPendingAvail(null)
    const query = {
      date: params.date,
      start_time: params.start_time,
      end_time: params.end_time,
      capacity: params.capacity,
    }

    let rooms = await roomService.getAvailable(query)
    if (params.room_type) rooms = (rooms || []).filter(r => r.room_type === params.room_type)

    if (!rooms || rooms.length === 0) {
      pushBot({ text: 'ما لقيت قاعات متاحة بهالوقت. جرّب وقت ثاني أو قلل عدد الطلاب.' })
      return
    }

    pushBot({ text: 'هاي أفضل القاعات المتاحة حسب طلبك:', cards: rooms.slice(0, 4) })
  }

  const sendMessage = (text) => {
    const msg = (text ?? '').trim() || input.trim()
    if (!msg) return
    setInput('')
    const userMsg = { id: Date.now(), role: 'user', time: now(), text: msg }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)
    setTimeout(async () => {
      try {
        const lower = msg.toLowerCase()

        if (lower.trim() === '/my') {
          try {
            const mine = await reservationService.getMine()
            const list = Array.isArray(mine) ? mine : (mine?.data ?? [])
            pushBot({ text: formatMyReservations(list) })
          } catch (err) {
            console.error('/my error:', err)
            pushBot({ text: `تعذر جلب الحجوزات — تأكد من تشغيل السيرفر. (${err?.response?.status ?? err?.message ?? 'خطأ'})` })
          }
          return
        }

        if (lower.includes('شو عندي') || lower.includes('شو في عندي') || lower.includes('جدولي')) {
          const mine = await reservationService.getMine()
          const target = (lower.includes('بكرا') || lower.includes('بكرة') || lower.includes('غدا') || lower.includes('غداً'))
            ? (() => { const d = new Date(); d.setDate(d.getDate() + 1); return toIsoDate(d) })()
            : toIsoDate(new Date())
          const today = (Array.isArray(mine) ? mine : []).filter(r => r.date === target)
          if (!today.length) {
            pushBot({ text: `ما عندك حجوزات بتاريخ <b>${target}</b>.` })
          } else {
            pushBot({ text: formatMyReservations(today) })
          }
          return
        }

        if (lower.startsWith('/available')) {
          const parts = msg.split(/\s+/).slice(1)
          const date = parts[0]
          const start_time = parts[1]
          const end_time = parts[2]
          const capacity = parts[3]
          await runAvailabilitySearch({ date, start_time, end_time, capacity })
          return
        }

        const intent = parseAvailabilityIntent(msg)
        const isAvail = lower.includes('متاح') || lower.includes('توفر') || lower.includes('available') || lower.includes('بدي قاعة') || lower.includes('ابدي قاعة') || lower.includes('أبدي قاعة') || lower.includes('ابدي مختبر') || lower.includes('أبدي مختبر')
        if (isAvail) {
          const merged = { ...(pendingAvail || {}), ...intent }
          await runAvailabilitySearch(merged)
          return
        }

        const reply = botReply(msg, roomsForCards)
        pushBot(reply)
      } catch (err) {
        console.error('Chatbot error:', err)
        pushBot({ text: `صار خطأ: ${err?.response?.data?.message ?? err?.message ?? 'جرّب مرة ثانية.'}` })
      } finally {
        setTyping(false)
      }
    }, 800)
  }

  const handleSelectRoom = (room) => {
    navigate(`/portal/find-room?room_id=${room.id}`)
  }

  const handleQuickAction = (label) => {
    if (label.includes('حجوزاتي')) {
      navigate('/portal/my-reservations')
      return
    }
    if (label.includes('توفر') || label.includes('التحقق')) {
      navigate('/portal/find-room')
      return
    }
    if (label.includes('أحجز') || label.includes('احجز')) {
      sendMessage('كيف أحجز؟')
      return
    }
    sendMessage(label)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-8 py-6 gap-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#4744e5]/20"
            style={{ background: 'linear-gradient(135deg,#4744e5,#6161ff)' }}>
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div>
            <h2 className="font-headline text-xl font-bold tracking-tight">مساعد الأتريوم الذكي</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006d2e]" />
              <span className="text-xs text-slate-500 font-medium">النظام متصل • جاهز للمساعدة</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {['history', 'more_vert'].map(ic => (
            <button key={ic}
              className="p-2 hover:bg-[#f2f3ff] rounded-xl text-slate-500 transition-colors">
              <span className="material-symbols-outlined">{ic}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1 min-h-0">
        {/* Date separator */}
        <div className="flex items-center justify-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#faf8ff] px-4 relative z-10">
            Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <div className="absolute left-8 right-8 h-px bg-[#c7c4d8]/15" />
        </div>

        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} onSelectRoom={handleSelectRoom} />
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex gap-4 max-w-[80%]">
            <div className="w-8 h-8 rounded-lg bg-[#e4e7fc] flex-shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-[#4744e5]"
                style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div className="bg-white border border-[#c7c4d8]/10 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-[#4744e5]/40 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
        {QUICK_ACTIONS.map(({ icon, label }) => (
          <button key={label} onClick={() => handleQuickAction(label)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#e4e7fc] hover:bg-[#dee1f6] rounded-full text-xs font-bold text-[#4744e5] transition-all whitespace-nowrap">
            <span className="material-symbols-outlined text-base">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 pb-2">
        <div className="flex items-end gap-3 bg-white p-4 rounded-2xl shadow-xl ring-1 ring-[#c7c4d8]/15">
          <button className="p-2.5 text-slate-400 hover:text-[#4744e5] hover:bg-[#4744e5]/05 rounded-xl transition-all">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="اكتب طلبك هنا (مثال: أبحث لي عن قاعة هادئة)..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32 placeholder:text-slate-400"
          />
          <div className="flex items-center gap-2 mb-1">
            <button className="p-2.5 text-slate-400 hover:text-[#4744e5] hover:bg-[#4744e5]/05 rounded-xl transition-all">
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className="text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#4744e5,#6161ff)' }}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          قد يخطئ المساعد أحياناً. تحقق من تفاصيل القاعة قبل الحجز.
        </p>
      </div>
    </div>
  )
}
