import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loader2 } from 'lucide-react'

const DEPARTMENTS = ['Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Humanities', 'Medicine', 'Law', 'Business', 'Other']

/* ── Shared Left Panel ── */
function LeftPanel() {
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
          backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?w=900&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[#4744e5]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>The Academic Atrium</span>
        </div>
        <div className="max-w-md">
          <h1 className="font-bold text-5xl text-white leading-tight mb-6" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Join your <br />Modern Campus.
          </h1>
          <p className="text-white/80 text-lg font-light leading-relaxed">
            Create your account and start managing classrooms, schedules, and academic spaces at Yarmouk University.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 max-w-sm">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="material-symbols-outlined text-[#6bff8f]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            ))}
          </div>
          <p className="text-white font-medium mb-2 italic">
            "Efficiency on campus has increased by 40% since implementing the Atrium."
          </p>
          <p className="text-white/60 text-sm">— Dr. Sarah Jenkins, Faculty Dean</p>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
            ].map((src, i) => (
              <img key={i} src={src} alt="Faculty" className="w-10 h-10 rounded-full border-2 border-[#4744e5] shadow-sm object-cover" />
            ))}
          </div>
          <span className="text-white/70 text-sm">Join 2,500+ Faculty Members</span>
        </div>
      </div>
    </section>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'doctor', department: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/portal/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = "w-full bg-white border-none ring-1 ring-[#c7c4d8]/30 focus:ring-2 focus:ring-[#4744e5]/40 rounded-xl py-3.5 pl-12 pr-4 text-[#171b2a] transition-all placeholder:text-[#767587]/60 outline-none text-sm"
  const iconClass = "material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#767587] transition-colors group-focus-within:text-[#4744e5]"
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-[#464555] ml-1"

  return (
    <div className="bg-[#faf8ff] font-body text-[#171b2a] selection:bg-[#e1dfff] selection:text-[#09006b] antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <main className="min-h-screen flex items-stretch">
        <LeftPanel />

        {/* ── Right: Form ── */}
        <section className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 bg-[#faf8ff] overflow-y-auto">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}>
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              </div>
              <span className="font-extrabold text-2xl text-[#4744e5] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>Atrium</span>
            </div>

            {/* Tab switcher */}
            <div className="bg-[#f2f3ff] p-1 rounded-2xl mb-8 flex items-center">
              <Link to="/login" className="flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 text-[#464555] hover:text-[#4744e5] text-center">
                Log In
              </Link>
              <button className="flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 bg-white text-[#4744e5] shadow-sm">
                Register
              </button>
            </div>

            {/* Heading */}
            <div className="mb-6 text-center lg:text-left">
              <h2 className="font-bold text-3xl text-[#171b2a] mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>Create Account</h2>
              <p className="text-[#464555]">Register with your academic credentials to get started.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 bg-[#ffdad6] border border-[#93000a]/20 rounded-xl text-sm text-[#93000a]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full name */}
              <div className="space-y-2">
                <label className={labelClass}>Full Name</label>
                <div className="relative group">
                  <span className={iconClass}>person</span>
                  <input type="text" required value={form.name} onChange={set('name')} placeholder="Dr. Ahmad Al-Khalil" className={fieldClass} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className={labelClass}>Academic Email</label>
                <div className="relative group">
                  <span className={iconClass}>mail</span>
                  <input type="email" required value={form.email} onChange={set('email')} placeholder="name@yu.edu.jo" className={fieldClass} />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className={labelClass}>Department</label>
                <div className="relative group">
                  <span className={iconClass}>school</span>
                  <select required value={form.department} onChange={set('department')}
                    className="w-full bg-white border-none ring-1 ring-[#c7c4d8]/30 focus:ring-2 focus:ring-[#4744e5]/40 rounded-xl py-3.5 pl-12 pr-4 text-[#171b2a] transition-all outline-none text-sm appearance-none">
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className={labelClass}>Password</label>
                <div className="relative group">
                  <span className={iconClass}>lock</span>
                  <input type={showPass ? 'text' : 'password'} required minLength={8} value={form.password} onChange={set('password')} placeholder="Min. 8 characters" className={`${fieldClass} pr-12`} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#767587] hover:text-[#171b2a] transition-colors">
                    <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-4 rounded-xl shadow-lg shadow-[#4744e5]/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{ background: 'linear-gradient(135deg, #4744e5 0%, #6161ff 100%)' }}
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Creating account...</>
                ) : (
                  <>
                    Join the Atrium
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <footer className="mt-10 text-center">
              <p className="text-xs text-[#767587] uppercase tracking-widest leading-loose">
                © 2026 Yarmouk University. <br />
                Part of the <span className="text-[#4744e5] font-bold">Smart Campus Initiative</span>.
              </p>
              <div className="mt-4 flex justify-center gap-6">
                {['Privacy', 'Support', 'Terms'].map(link => (
                  <a key={link} className="text-xs font-bold text-[#767587] hover:text-[#4744e5] transition-colors" href="#">{link}</a>
                ))}
              </div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  )
}
