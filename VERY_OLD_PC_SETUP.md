# تشغيل المشروع على جهاز قديم جداً (2 GB RAM - Celeron)

> ⚠️ **تنبيه:** هذا الجهاز تحت الحد الأدنى. المشروع قد يعمل ببطء شديد.

---

## 1. متطلبات أساسية (لا يمكن تجاوزها)

### نظام التشغيل
- ❌ Windows XP/7: **لا يعمل**
- ✅ Windows 10 32-bit: **يعمل ببطء**
- ✅ Windows 10 64-bit: **مفضل**

### مساحة القرص
- ❌ 40 GB: **لا تكفي** (تحتاج 5 GB فارغة + مساحة للبرامج)
- ✅ 80 GB: **كافية**

---

## 2. تثبيت البرامج (نسخ خفيفة جداً)

### Node.js (نسخة محمولة)
```cmd
# حمل هذه النسخة المضغوطة:
https://nodejs.org/dist/v18.20.0/node-v18.20.0-win-x86.zip

# فك الضغط في C:\nodejs
# أضف للمسار PATH: C:\nodejs
```

### XAMPP (نسخة قديمة)
```cmd
# حمل XAMPP 1.8.3 (PHP 5.5)
https://www.apachefriends.org/download.php?id=xampp-win32-1.8.3-5-VC11-installer

# حجم: 50 MB فقط
```

---

## 3. تعديلات خاصة للأجهزة الضعيفة

### Backend (تقليل استهلاك الذاكرة)
```json
// backend/package-minimal.json
{
  "scripts": {
    "dev": "set NODE_OPTIONS=--max-old-space-size=512 && node src/server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "@prisma/client": "^5.19.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5"
  }
}
```

### Frontend (إزالة المكتبات غير الضرورية)
```json
// frontend/package-minimal.json
{
  "scripts": {
    "dev": "vite --port 3000 --host --minify false --no-hmr"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "axios": "^1.7.2"
  }
}
```

---

## 4. خطوات التشغيل (معدلة)

### 4.1. تثبيت المكتبات (بدون devDependencies)
```cmd
# Backend
cd backend
npm install --production --no-optional

# Frontend  
cd frontend
npm install --production --no-optional
```

### 4.2. تشغيل الخادم
```cmd
# Backend (نافذة 1)
cd backend
set NODE_OPTIONS=--max-old-space-size=512
node src/server.js

# Frontend (نافذة 2)
cd frontend
set NODE_OPTIONS=--max-old-space-size=256
npm run dev
```

---

## 5. تحسينات الأداء

### 5.1. تعديل MySQL (XAMPP)
```ini
# في C:\xampp\mysql\bin\my.ini
[mysqld]
innodb_buffer_pool_size=64M
key_buffer_size=16M
max_connections=10
```

### 5.2. إغلاق الخدمات غير الضرورية
- أغلق Antivirus مؤقتاً
- أغلق Windows Update
- أغلق كل البرامج في الخلفية
- استخدم Task Manager لإنهاء العمليات غير الضرورية

---

## 6. الحلول البديلة (موصى بها)

### 6.1. استخدام Online IDE
```bash
# Stackblitz
https://stackblitz.com/edit/react

# Replit  
https://replit.com/templates/nodejs

# CodeSandbox
https://codesandbox.io/s/react
```

### 6.2. استخدام Docker (إذا متوفر)
```dockerfile
# dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 7. المشاكل المتوقعة وحلولها

### المشكلة: "Out of memory"
```cmd
# الحل: تقليل حجم الـ heap
set NODE_OPTIONS=--max-old-space-size=256
```

### المشكلة: "npm install بطيء جداً"
```cmd
# الحل: استخدام yarn أسرع
npm install -g yarn
yarn install --production
```

### المشكلة: "Vite لا يعمل"
```cmd
# الحل: استخدام serve بسيط
npm install -g serve
cd frontend
serve -s build -l 3000
```

---

## 8. توصية نهائية

**إذا كان الجهاز بهذه المواصفات، أنصح بشدة:**

1. **استخدام Online IDE** (Stackblitz/Replit) — أفضل حل
2. **ترقية الجهاز** إذا أمكن — إضافة RAM أو استخدام جهاز آخر
3. **تشغيل Backend فقط** على الجهاز القديم + Frontend على جهاز آخر

---

## 9. أمر تشغيل سريع (للأجهزة الضعيفة جداً)

```cmd
# نسخة مصغرة جداً
cd backend
set NODE_OPTIONS=--max-old-space-size=256 && node src/server.js

# في نافذة ثانية
cd frontend  
set NODE_OPTIONS=--max-old-space-size=128 && npx serve -s build -l 3000
```

---

**ملاحظة:** مع 2 GB RAM ومعالج Celeron، المشروع قد يستغرق 5-10 دقائق ليبدأ. الصبر مطلوب!
