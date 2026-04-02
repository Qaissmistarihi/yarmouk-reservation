import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loader2 } from 'lucide-react'

/* ─────────────────────────────────────────
   Left branding panel (shared with Register)
───────────────────────────────────────── */
export function LeftPanel() {
  return (
    <section
      className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-16"
      style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6161ff]/20 rounded-full -ml-32 -mb-32 blur-2xl" />
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDB8aaGeKJMsM_12cwVMV_y5Y2ml9bwrqZ4ZoO03eKPhLQJ0FmvL5PU7eGB8IOnxhsvpIiGVWMDqYmu16xLglvrcxKmflJVi-3of4WMriiODQqEeLYtpiO-lGTdkXa8UEEWLaEFH3jPGg6fdYX-_w_W0PtE7V8Tjc4J-3lHQzPDce2T9m3sWGsYxhyRbKSx5ujCmh-YzcpUyhuhpzwiM-XWDS5OUrHjH1e-7KP_IdxeutdEqrNJ3GmjWQqjuSXCzMvRfOURmFSnC-c')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[#4744e5]">account_balance</span>
          </div>
          <span className="font-headline font-extrabold text-2xl text-white tracking-tight">
            نظام حجز القاعات الذكي
          </span>
        </div>
        <div className="max-w-md">
          <h1 className="font-headline font-bold text-5xl text-white leading-tight mb-6">
            مرحبًا بك في نظام<br />حجز القاعات الذكي.
          </h1>
          <p className="text-white/80 text-lg font-light leading-relaxed">
            منصة رقمية متطورة لإدارة وتنظيم حجز القاعات الدراسية
            في جامعة اليرموك، تساعد أعضاء الهيئة التدريسية على حجز
            القاعات بسهولة وتنظيم استخدامها بكفاءة عالية.
          </p>
          <p className="text-white/60 text-sm mt-4">
            يشمل النظام القاعات في: مبنى المقدسي • مبنى الخوارزمي • مبنى PHU
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 max-w-sm">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="material-symbols-outlined text-[#6bff8f]"
                style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            ))}
          </div>
          <p className="text-white font-medium mb-2 italic">
            "ساهم النظام في تحسين تنظيم القاعات وتقليل تعارض الحجوزات داخل الجامعة."
          </p>
          <p className="text-white/60 text-sm">— الدكتور بلال أبو العطا</p>
        </div>
        <div className="mt-12 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[
              'https://lh3.googleusercontent.com/aida-public/AB6AXuB5pEORk4Oo7JDOupD7azTLgQ5DyJCl9NZNVKaCpH6BzF53xlmhcxRxl0Q_rtEmO99Dj5YncIUY1cU3PhYQiwM9yy3yOZj69AGftG1IqUeZELueyf4lc5Jk7Hh_hFTFQu0kaHvOVVoPIiSj09BHf40bNqvWB8_KBNykfMTr5vpuLQ0d1-E7HK1_21SfUMGbiRkY9ekmjl65Emizqg9166dnaiuAMzdPMokl-3R8o23ed1khudeEg1Xew1O3T4M6aW6xSvRG9elqdp8',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCOh2erfr2qPTQpYbSid7umnVH4HFQmBd4wgg1QhNgIVp2nIjGmSre6WINeXaqhgJzUwVJ2oqHYQE_nNlHHlVP1PgJWuMRDntpPY7plFyyI6D8ej2BGYe-3Tk1QQJW05Dpor5T8grs8oabxMQ2ufCmn_vmJuapqiUCuBr4_8f-O504RzWD3Oj4zBq6qvSEazDsuLIUlKTqnK86A3fzZvT8iK2qPghUuNFqbSXEmeTUJWMWDZjEDIz2z87NmoumGZt472A8AsYi6F2k',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDRspUM3oW8Cv4hgxHJZBgEsuG7Tk24RX_9-9FejCMnt4WrpnaJ70WpR-XhQOFcVONAzReHEM3k_fFDkUB8fO7-O3S3PTPGVyYWBZD94YF6xxxrh1WYRl4ejNzT7dJ8cnic21k5IrACi7t6l2exALyv4BUnyTv-0bA8l7NEhp45LiEDVf03etl24pFEuOC2YOkfGO5PNyn92q9IH09JpiIxdWlB_c63FSr5uk6QyYiN-idCkvJhzAV2UeXyOvbG5uOin7aKEidJOKI',
            ].map((src, i) => (
              <img key={i} src={src} alt={`Member ${i + 1}`}
                className="w-10 h-10 rounded-full border-2 border-[#4744e5] shadow-sm object-cover" />
            ))}
          </div>
          <span className="text-white/70 text-sm">يستخدم النظام مئات أعضاء الهيئة التدريسية في جامعة اليرموك يوميًا</span>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Demo accounts config
───────────────────────────────────────── */
const DEMO_ACCOUNTS = [
  {
    label: 'مدير النظام',
    role: 'صلاحيات كاملة',
    email: 'admin@yu.edu.jo',
    password: 'admin123',
    icon: 'admin_panel_settings',
    color: '#4744e5',
    bg: '#f2f3ff',
    border: '#4744e520',
    iconBg: '#4744e515',
  },
  {
    label: 'عضو هيئة تدريس',
    role: 'بوابة الدكتور',
    email: 'doctor@yu.edu.jo',
    password: 'doctor123',
    icon: 'school',
    color: '#006d2e',
    bg: '#f0fdf4',
    border: '#006d2e20',
    iconBg: '#006d2e15',
  },
]

/* ═══════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════ */
export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm]         = useState({ email: '', password: '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }))
  }

  const doLogin = async (email, password) => {
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/portal/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    doLogin(form.email, form.password)
  }

  return (
    <main className="min-h-screen flex items-stretch bg-[#faf8ff] font-body text-[#171b2a] antialiased selection:bg-[#e1dfff] selection:text-[#09006b]">

      {/* ── Left branding panel ── */}
      <LeftPanel />

      {/* ── Right: Auth form ── */}
      <section className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-10 bg-[#faf8ff]">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}>
              <span className="material-symbols-outlined text-white">account_balance</span>
            </div>
            <span className="font-headline font-extrabold text-2xl text-[#4744e5] tracking-tight">Atrium</span>
          </div>

          {/* Tab switcher */}
          <div className="bg-[#f2f3ff] p-1 rounded-2xl mb-7 flex items-center">
            <button type="button"
              className="flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 bg-white text-[#4744e5] shadow-sm">
              دخوول
            </button>
            <Link to="/register"
              className="flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 text-[#464555] hover:text-[#4744e5] text-center">
              تسجيل
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-5 text-center lg:text-right">
            <h2 className="font-headline font-bold text-3xl text-[#171b2a] mb-1">أهلاً بعودتك</h2>
            <p className="text-[#464555] text-sm">أدخل بيانات حسابك الجامعي للمتابعة.</p>
          </div>

          {/* ── Demo Accounts ── */}
          <div className="mb-5 p-4 rounded-2xl bg-[#f2f3ff]/80 border border-[#c7c4d8]/25">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#767587] mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              دخوول تجريبي سريع — اضغط للدخوول فوراً
            </p>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map(({ label, role, email, password, icon, color, bg, border, iconBg }) => (
                <button
                  key={label}
                  type="button"
                  disabled={loading}
                  onClick={() => doLogin(email, password)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: bg, borderColor: border }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: iconBg }}>
                    <span className="material-symbols-outlined text-[20px]"
                      style={{ color, fontVariationSettings: "'FILL' 1" }}>
                      {icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight" style={{ color }}>{label}</p>
                    <p className="text-[10px] text-[#767587] truncate">{role}</p>
                    <p className="text-[9px] text-[#767587]/70 truncate">{email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#c7c4d8]/20" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-[#767587]">
              <span className="bg-[#faf8ff] px-4">أو سجّل دخولك يدوياً</span>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-[#ffdad6] border border-[#93000a]/20 rounded-xl text-sm text-[#93000a] flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#464555] mr-1" htmlFor="email">
                البريد الجامعي
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#767587] transition-colors group-focus-within:text-[#4744e5]">
                  mail
                </span>
                <input
                  id="email" type="email" required autoComplete="email"
                  value={form.email} onChange={handleChange}
                  placeholder="name@yu.edu.jo"
                  className="w-full bg-white border-none ring-1 ring-[#c7c4d8]/30 focus:ring-2 focus:ring-[#4744e5]/40 rounded-xl py-4 pl-12 pr-4 text-[#171b2a] transition-all placeholder:text-[#767587]/60 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#464555]" htmlFor="password">
                  كلمة المرور
                </label>
                <a className="text-xs font-semibold text-[#4744e5] hover:underline" href="#">نسيت كلمة المرور؟</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#767587] transition-colors group-focus-within:text-[#4744e5]">
                  lock
                </span>
                <input
                  id="password" type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white border-none ring-1 ring-[#c7c4d8]/30 focus:ring-2 focus:ring-[#4744e5]/40 rounded-xl py-4 pl-12 pr-12 text-[#171b2a] transition-all placeholder:text-[#767587]/60 outline-none"
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#767587] hover:text-[#171b2a] transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3 py-1">
              <input id="remember" type="checkbox" checked={form.remember} onChange={handleChange}
                className="w-5 h-5 rounded border-[#c7c4d8] text-[#4744e5] focus:ring-[#4744e5]/20 cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-[#464555] cursor-pointer select-none">
                تذكُّر هذا الجهاز لمدة 30 يوماً
              </label>
            </div>

            {/* CTA */}
            <button type="submit" disabled={loading}
              className="w-full text-white font-bold py-4 rounded-xl shadow-lg shadow-[#4744e5]/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}>
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> جاري تسجيل الدخوول…</>
              ) : (
                <>
                  ادخل إلى الأتريوم
                  <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                </>
              )}
            </button>

            {/* SSO / Google buttons removed */}

          </form>

          {/* Footer */}
          <footer className="mt-8 text-center">
            <p className="text-xs text-[#767587] uppercase tracking-widest leading-loose">
              © 2026 جامعة اليرموك. <br />
              ضمن مبادرة <span className="text-[#4744e5] font-bold">الحرم الذكي</span>.
            </p>
            <div className="mt-4 flex justify-center gap-6">
              {['خصوصية', 'دعم', 'شروط'].map(label => (
                <a key={label} href="#"
                  className="text-xs font-bold text-[#767587] hover:text-[#4744e5] transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </footer>

        </div>
      </section>
    </main>
  )
}
