import React from 'react'
import { Link } from 'react-router-dom'
import maqdisiImg from '../../assets/maqdisi.jpg'
import khwarizmiImg from '../../assets/khwarizmi.jpg'
import phuImg from '../../assets/PHU.jpg'

/* ─── Floating glass card in hero ─── */
function GlassCard() {
  return (
    <div className="absolute top-12 -left-12 bg-white/80 backdrop-blur-[12px] p-6 rounded-2xl shadow-xl max-w-[200px]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-[#6bff8f] flex items-center justify-center">
          <span className="material-symbols-outlined text-[#005321] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <span className="text-xs font-bold text-on-surface">قاعة PHU-102</span>
      </div>
      <p className="text-[10px] text-on-surface-variant">تمت الموافقة لمحاضرة التفاضل المتقدم، 10:00 ص</p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="bg-[#faf8ff] text-[#171b2a] selection:bg-[#e1dfff] selection:text-[#09006b]">

      {/* ── Google Fonts ── */}
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* ════════════════ TOP NAV ════════════════ */}
      <nav className="fixed top-0 right-0 w-full z-50 bg-[#faf8ff]/80 backdrop-blur-md flex items-center justify-between px-6 md:px-20 py-4 h-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4744e5] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4744e5]/20">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#4744e5] font-headline">الأتريوم الأكاديمي</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <a className="text-[#4744e5] font-bold border-b-2 border-[#4744e5] py-1 transition-all" href="#">لوحة التحكم</a>
          <a className="text-slate-600 hover:text-[#4744e5] transition-all py-1" href="#">التقويم</a>
          <a className="text-slate-600 hover:text-[#4744e5] transition-all py-1" href="#">المباني</a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-bold text-[#4744e5] hover:bg-[#e4e7fc] rounded-xl transition-all"
          >
            تسجيل الدخول
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-sm font-bold bg-[#4744e5] text-white rounded-xl shadow-lg shadow-[#4744e5]/20 hover:scale-[1.02] transition-all"
          >
            إنشاء حساب
          </Link>
        </div>
      </nav>

      <main className="pt-20">

        {/* ════════════════ HERO ════════════════ */}
        <section className="relative px-6 md:px-20 pt-16 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#e1dfff] text-[#2c24ce] text-xs font-bold tracking-widest uppercase mb-6">
                جامعة اليرموك • المنصة الرسمية
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-[#171b2a] leading-[1.1] mb-6 tracking-tight font-headline">
                نظام <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#4744e5] to-[#6161ff]">حجز القاعات</span> الذكي
              </h1>
              <p className="text-lg text-[#464555] mb-10 max-w-lg leading-relaxed">
                منصة رقمية متطورة لإدارة وتنظيم حجز القاعات الدراسية في جامعة اليرموك، تساعد أعضاء الهيئة التدريسية على حجز القاعات بسهولة وتنظيم استخدامها في مباني الجامعة المختلفة.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-br from-[#4744e5] to-[#6161ff] text-white rounded-xl font-bold shadow-xl shadow-[#4744e5]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  ابدأ الآن
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-[#e4e7fc] text-[#4744e5] rounded-xl font-bold hover:bg-[#dee1f6] transition-all"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </div>

            {/* Right – hero card */}
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#4744e5]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#6063ee]/10 rounded-full blur-3xl" />
              <div className="relative bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-[#4744e5]/5">
                <img
                  className="rounded-[2rem] w-full aspect-[4/3] object-cover"
                  src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop"
                  alt="Modern university lecture hall"
                />
                <GlassCard />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ STATS BENTO ════════════════ */}
        <section className="px-6 md:px-20 py-16 bg-[#f2f3ff]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: 'meeting_room', value: '+60', label: 'إجمالي القاعات', border: false },
                { icon: 'corporate_fare', value: '3', label: 'المباني المدعومة', border: false },
                { icon: 'group', value: '50', label: 'مستخدم نشط', border: false },
                { icon: 'event_available', value: '12', label: 'حجوزات اليوم', border: true },
              ].map(({ icon, value, label, border }) => (
                <div key={label} className={`bg-white p-8 rounded-2xl hover:shadow-xl transition-all group ${border ? 'border-2 border-[#4744e5]/20' : ''}`}>
                  <span className="material-symbols-outlined text-[#4744e5] mb-4 text-3xl block group-hover:scale-110 transition-transform">{icon}</span>
                  <h3 className="text-4xl font-extrabold text-[#171b2a] mb-1 font-headline">{value}</h3>
                  <p className="text-sm font-bold text-[#464555] tracking-wider uppercase">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ FEATURES ════════════════ */}
        <section className="px-6 md:px-20 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl font-extrabold text-[#171b2a] mb-4 font-headline">مزايا قوية</h2>
              <p className="text-[#464555] max-w-xl">كل ما تحتاجه لإدارة المساحات الأكاديمية بسهولة وبدون تعقيد إداري.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  bg: 'bg-[#e1dfff]', iconColor: 'text-[#4744e5]', icon: 'bolt',
                  title: 'حجز لحظي',
                  desc: 'تحقق فوراً من توفر القاعات واحجز بدون تأخير، مع تحديثات مباشرة عند حجز القاعات من الآخرين.',
                },
                {
                  bg: 'bg-[#e1e0ff]', iconColor: 'text-[#4648d4]', icon: 'calendar_month',
                  title: 'تكامل ذكي',
                  desc: 'يتزامن مع التقويم ويعرض حجوزاتك بشكل منظم، مع تنبيهات للمحاضرات والامتحانات القادمة.',
                },
                {
                  bg: 'bg-[#6bff8f]', iconColor: 'text-[#006d2e]', icon: 'verified',
                  title: 'موافقات منظمة',
                  desc: 'نظام واضح لمراجعة الطلبات واعتمادها من الإدارة، مع تتبع الحالة (بانتظار/مقبول/مرفوض).',
                },
              ].map(({ bg, iconColor, icon, title, desc }) => (
                <div key={title} className="space-y-6">
                  <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${iconColor} text-3xl`}>{icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#171b2a] font-headline">{title}</h3>
                  <p className="text-[#464555] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ BUILDINGS ════════════════ */}
        <section className="px-6 md:px-20 py-24 bg-[#e4e7fc]/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-[#171b2a] mb-2 font-headline">المباني المدعومة</h2>
              <p className="text-[#464555]">تغطية متزايدة لتشمل مباني جامعة اليرموك.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  img: maqdisiImg,
                  name: 'مبنى المقدسي',
                  desc: 'تكنولوجيا المعلومات وعلوم الحاسوب',
                },
                {
                  img: khwarizmiImg,
                  name: 'مبنى الخوارزمي',
                  desc: 'مختبرات وقاعات محاضرات',
                },
                {
                  img: phuImg,
                  name: 'مبنى الأمير حسين',
                  desc: 'قاعات تدريس ومدرجات',
                },
              ].map(({ img, name, desc }) => (
                <div key={name} className="relative group overflow-hidden rounded-3xl bg-white">
                  <img
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    src={img}
                    alt={name}
                  />
                  <div className="p-8">
                    <h4 className="text-xl font-bold text-[#171b2a] font-headline">{name}</h4>
                    <p className="text-sm text-[#464555] mt-2">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ CTA ════════════════ */}
        <section className="px-6 md:px-20 py-32">
          <div className="max-w-5xl mx-auto bg-[#4744e5] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#4744e5]/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-10 -mb-10 blur-xl" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10 font-headline">
              احجز أول قاعة لك
            </h2>
            <p className="text-[#e1dfff] text-lg mb-10 max-w-2xl mx-auto relative z-10">
              انضم إلى أعضاء هيئة التدريس واستمتع بجدولة أسهل للحجوزات اليومية.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link to="/login" className="px-10 py-5 bg-white text-[#4744e5] rounded-2xl font-bold shadow-lg hover:bg-[#faf8ff] transition-all">
                دخول النظام
              </Link>
              <Link to="/register" className="px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-bold hover:bg-white/10 transition-all">
                إنشاء حساب
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="bg-[#f2f3ff]/50 border-t border-[#c7c4d8]/15 py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#4744e5] rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                </div>
                <span className="text-lg font-extrabold text-[#171b2a] font-headline">الأتريوم الأكاديمي</span>
              </div>
              <p className="text-[#464555] max-w-sm mb-6 leading-relaxed">
                منصة تساعد أعضاء هيئة التدريس في جامعة اليرموك على إدارة القاعات والحجوزات بكفاءة ضمن تجربة تعليمية حديثة.
              </p>
              <div className="flex gap-4">
                {['public', 'share', 'mail'].map((icon) => (
                  <a key={icon} className="w-10 h-10 rounded-full bg-[#e4e7fc] flex items-center justify-center text-[#4744e5] hover:bg-[#4744e5] hover:text-white transition-all" href="#">
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-bold text-[#171b2a] uppercase tracking-widest mb-6">المنصة</h5>
              <ul className="space-y-4">
                {['خريطة الحرم', 'الدعم التقني', 'دليل المباني', 'مركز المساعدة'].map((link) => (
                  <li key={link}><a className="text-[#464555] hover:text-[#4744e5] transition-colors text-sm" href="#">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-bold text-[#171b2a] uppercase tracking-widest mb-6">السياسات</h5>
              <ul className="space-y-4">
                {['سياسة الخصوصية', 'شروط الاستخدام', 'إمكانية الوصول'].map((link) => (
                  <li key={link}><a className="text-[#464555] hover:text-[#4744e5] transition-colors text-sm" href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#c7c4d8]/15 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">© 2026 جامعة اليرموك. جميع الحقوق محفوظة.</p>
            <div className="flex gap-8">
              <span className="text-xs uppercase tracking-widest text-slate-500">إربد، الأردن</span>
              <span className="text-xs uppercase tracking-widest text-slate-500">Version 1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
 }
