# دليل تشغيل المشروع على جهاز قديم (خطوة بخطوة)

> ⚠️ **مهم:** هذا الدليل مخصص لأجهزة اللابتوب القديمة أو ذات المواصفات المحدودة.  
> إذا كان الجهاز حديثاً، استخدم `README.md` العادي.

---

## 1. التحقق من المتطلبات الأساسية

### 1.1. نظام التشغيل
- ✅ Windows 10 (64-bit) **أو أحدث**  
- ❌ لا يعمل على Windows 7 أو 32-bit

### 1.2. المواصفات الدنيا
| المكون | الحد الأدنى | الموصى به |
|---|---|---|
| RAM | 4 GB | 8 GB |
| مساحة القرص | 5 GB فارغة | 10 GB |
| المعالج | Intel i3 / AMD A6 | Intel i5 / AMD Ryzen 5 |

### 1.3. التحقق من مواصفات الجهاز
1. افتح **Task Manager** (Ctrl + Shift + Esc)
2. اذهب لـ **Performance** tab
3. تأكد من:
   - **Memory**: على الأقل 3.5 GB متاحة
   - **Disk**: 5 GB مساحة فارغة

---

## 2. تثبيت البرامج المطلوبة

### 2.1. Node.js (مهم جداً)

#### الطريقة الأولى: ملف التثبيت (موصى بها)
1. اذهب لـ: https://nodejs.org/en/download/
2. اختر **LTS** (Long Term Support)
3. اختر **Windows Installer (.msi) 64-bit**
4. حمل الملف (حجم ~30 MB)

#### الطريقة الثانية: نسخة محمولة (إذا فشل التثبيت)
1. حمل **nvm-windows** من: https://github.com/coreybutler/nvm-windows/releases
2. حمل ملف `nvm-setup.zip`
3. فك الضغط وثبّت
4. افتح Command Prompt واكتب:
   ```cmd
   nvm install 18.20.0
   nvm use 18.20.0
   ```

### 2.2. MySQL (قاعدة البيانات)

#### الخيار الأفضل: XAMPP (موصى به للأجهزة القديمة)
1. اذهب لـ: https://www.apachefriends.org/download.html
2. حمل **XAMPP for Windows 7.4.33** (لا تحمل أحدث إصدار)
3. اختر **PHP 7.4** (أخف على الموارد)
4. حجم الملف: ~160 MB

#### خطوات التثبيت:
1. شغّل الملف كـ **Administrator**
2. اختر مسار التثبيت: `C:\xampp` (افتراضي)
3. في صفحة المكونات، تأكد اختيار:
   - ✅ Apache
   - ✅ MySQL
   - ❌ FileZilla (يمكن إلغاؤه)
   - ❌ Mercury (يمكن إلغاؤه)
4. اكمل التثبيت

### 2.3. التحقق من التثبيتات

#### التحقق من Node.js
1. افتح **Command Prompt** (ابحث `cmd`)
2. اكتب:
   ```cmd
   node --version
   npm --version
   ```
3. يجب يظهر:
   ```
   v18.20.0 (أو مشابه)
   9.x.x (أو مشابه)
   ```

#### التحقق من MySQL/XAMPP
1. افتح **XAMPP Control Panel**
2. تأكد وجود ✅ بجانب Apache و MySQL
3. إذا لم يشتغل MySQL:
   - اضغط **Config** بجانب MySQL
   - اختر `my.ini`
   - ابحث عن `innodb_buffer_pool_size`
   - خليها `128M` (إذا كانت أكبر)

---

## 3. تجهيز قاعدة البيانات

### 3.1. تشغيل MySQL
1. افتح XAMPP Control Panel
2. اضغط **Start** بجانب MySQL
3. انتظر يصير لونها أخضر

### 3.2. إنشاء قاعدة البيانات
1. اضغط **Admin** بجانب MySQL (يفتح phpMyAdmin)
2. اذهب لـ **Databases** tab
3. في "Create database"، اكتب: `yarmouk_reservation`
4. اضغط **Create**

### 3.3. استيراد ملف SQL
1. اذهب لـ **Import** tab
2. اضغط **Choose file**
3. اختر ملف: `database\schema.sql` من المشروع
4. اضغط **Go** (أسفل الصفحة)

---

## 4. تجهيز المشروع

### 4.1. فك ضغط المشروع
1. انقل ملف المشروع المضغوط للجهاز
2. فك الضغط في مسار بسيط (مثلاً: `C:\yarmouk-reservation`)
3. **مهم:** لا تضع مسافات أو عربي في اسم المسار

### 4.2. تثبيت الاعتماديات (Backend)
1. افتح **Command Prompt**
2. انتقل لمجلد المشروع:
   ```cmd
   cd C:\yarmouk-reservation\backend
   ```
3. ثبّت المكتبات:
   ```cmd
   npm install --production
   ```
4. إذا فشل الأمر، جرب:
   ```cmd
   npm install --legacy-peer-deps
   ```

### 4.3. تثبيت الاعتماديات (Frontend)
1. انتقل لمجلد الـ frontend:
   ```cmd
   cd ..\frontend
   ```
2. ثبّت المكتبات:
   ```cmd
   npm install
   ```
3. إذا استغرق وقت طويل (>5 دقائق)، اضغط **Ctrl + C** وجرب:
   ```cmd
   npm install --no-optional
   ```

---

## 5. إعدادات خاصة للأجهزة القديمة

### 5.1. تعديل ملفات التكوين

#### Backend (.env)
1. افتح `backend\.env`
2. تأكد المحتوى:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/yarmouk_reservation"
   JWT_SECRET="your-secret-key-here"
   PORT=5000
   ```

#### Frontend (Vite config)
1. افتح `frontend\vite.config.js`
2. تأكد وجود:
   ```js
   server: {
     port: 3000,
     host: true,
     hmr: {
       overlay: false  // يخفي الأخطاء في الشاشة
     }
   }
   ```

### 5.2. تقليل استهلاك الموارد

#### تعديل package.json (Backend)
1. افتح `backend\package.json`
2. في `scripts`، أضف:
   ```json
   "dev-low": "set NODE_OPTIONS=--max-old-space-size=2048 && npm run dev"
   ```

#### تعديل package.json (Frontend)
1. افتح `frontend\package.json`
2. في `scripts`، أضف:
   ```json
   "dev-low": "vite --port 3000 --host --minify false"
   ```

---

## 6. تشغيل المشروع (خطوة بخطوة)

### 6.1. تشغيل Backend (الخادم)
1. افتح **Command Prompt جديد**
2. انتقل لمجلد الـ backend:
   ```cmd
   cd C:\yarmouk-reservation\backend
   ```
3. شغّل الخادم:
   ```cmd
   npm run dev-low
   ```
4. انتظر يظهر:
   ```
   Server ready at http://localhost:5000
   Database connected
   ```

### 6.2. تشغيل Frontend (الواجهة)
1. افتح **Command Prompt آخر** (لا تغلق الأول)
2. انتقل لمجلد الـ frontend:
   ```cmd
   cd C:\yarmouk-reservation\frontend
   ```
3. شغّل الواجهة:
   ```cmd
   npm run dev-low
   ```
4. انتظر يظهر:
   ```
   Local:   http://localhost:3000
   ready in 1234ms
   ```

### 6.3. فتح المشروع في المتصفح
1. افتح **Google Chrome** (أو Firefox)
2. اذهب لـ: `http://localhost:3000`
3. يجب تظهر صفحة الرئيسية

---

## 7. حل المشاكل الشائعة

### 7.1. المشكلة: "npm command not found"
**الحل:**
1. أعد تشغيل الكمبيوتر
2. افتح Command Prompt جديد
3. جرب مرة أخرى

### 7.2. المشكلة: "MySQL connection failed"
**الحل:**
1. تأكد MySQL شغال في XAMPP
2. تأكد قاعدة البيانات اسمها `yarmouk_reservation`
3. تأكد ملف `.env` صحيح

### 7.3. المشكلة: "Port already in use"
**الحل:**
1. افتح Task Manager
2. ابحث عن `node.exe`
3. أغلق كل العمليات
4. أعد تشغيل الأوامر

### 7.4. المشكلة: "Out of memory"
**الحل:**
1. أغلق البرامج غير المستخدمة
2. استخدم الأوامر `dev-low` (راجع قسم 5.2)
3. أغلق المتصفح وأعد فتحه

### 7.5. المشكلة: "Vite build failed"
**الحل:**
1. استخدم الأمر:
   ```cmd
   npm run dev-low -- --force
   ```
2. إذا ما زال، امسح مجلد `node_modules` وأعد التثبيت

---

## 8. اختبار سريع

### 8.1. تسجيل الدخول
1. اذهب لـ: `http://localhost:3000`
2. اضغط "تسجيل الدخول"
3. استخدم حساب **Admin**:
   - البريد: `admin@yu.edu.jo`
   - كلمة المرور: `admin123`

### 8.2. التحقق من الوظائف
1. يجب تظهر لوحة الإدارة
2. جرب فتح "إدارة القاعات"
3. جرب فتح "إدارة الحجوزات"

---

## 9. نصائح للأجهزة القديمة

### 9.1. تحسين الأداء
- أغلق التطبيقات في الخلفية (مثل Antivirus مؤقتاً)
- استخدم **Google Chrome** (أخف من Firefox)
- لا تفتح أكثر من 3-4 تبويبات في المتصفح

### 9.2. توفير المساحة
- بعد التثبيت، يمكنك حذف مجلد `node_modules` في الـ backend
- احتفظ بـ `package-lock.json` لإعادة التثبيت السريع

### 9.3. النسخ الاحتياطي
- انسخ مجلد `backend\.env` و `frontend\.env` (إذا وجد)
- احتفظ بنسخة من قاعدة البيانات (Export من phpMyAdmin)

---

## 10. إذا لم ينجح أي شيء

### 10.1. التحقق من الخطوات
1. هل Node.js يعمل؟ (`node --version`)
2. هل MySQL شاغل؟ (XAMPP Control Panel)
3. هل قاعدة البيانات موجودة؟ (phpMyAdmin)
4. هل الملفات في المسار الصحيح؟ (لا مسافات أو عربي)

### 10.2. طلب المساعدة
- صورة الخطأ في Command Prompt
- صورة من XAMPP Control Panel
- صورة من Task Manager (Memory و CPU)

---

## 11. تشغيل سريع (موجز)

```cmd
# 1. فتح XAMPP وتشغيل MySQL
# 2. فتح Command Prompt الأول
cd C:\yarmouk-reservation\backend
npm run dev-low

# 3. فتح Command Prompt الثاني
cd C:\yarmouk-reservation\frontend
npm run dev-low

# 4. فتح المتصفح على:
http://localhost:3000
```

---

## 12. ملاحظات أخيرة

- **لا تغلق** نافذتي Command Prompt أثناء العمل
- **لا تضغط** Ctrl + C إلا إذا تريد إيقاف الخادم
- **إذا ظهرت أخطاء** حاول تحديث الصفحة (F5)
- **للتوقف**، اضغط Ctrl + C في كل نافذة

---

**ملاحظة:** هذا الدليل مكتوب خصيصاً للأجهزة القديمة. إذا واجهت صعوبات، لا تتردد في طلب المساعدة مع صورة الخطأ.
