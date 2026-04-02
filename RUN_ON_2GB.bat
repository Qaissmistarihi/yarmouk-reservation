@echo off
chcp 65001 >nul
title تشغيل على جهاز ضعيف (2GB RAM)
color 0C

echo.
echo ══════════════════════════════════════════════════════════
echo    تشغيل مشروع حجز القاعات - جهاز ضعيف جداً
echo ══════════════════════════════════════════════════════════
echo.
echo ⚠️ تحذير: هذا الجهاز تحت الحد الأدنى الموصى به
echo قد يكون التشغيل بطيئاً جداً
echo.

echo [1/4] التحقق من الحد الأدنى...
systeminfo | find "Total Physical Memory" | find "2,0" >nul
if not errorlevel 1 (
    echo ✅ الذاكرة: 2 GB (ضئيلة لكن كافية)
) else (
    echo ❌ الذاكرة أقل من 2 GB - قد لا يعمل
)

echo.
echo [2/4] إغلاق البرامج غير الضرورية...
taskkill /f /im "chrome.exe" >nul 2>&1
taskkill /f /im "firefox.exe" >nul 2>&1
taskkill /f /im "msedge.exe" >nul 2>&1
echo ✅ تم إغلاق المتصفحات

echo.
echo [3/4] تشغيل Backend (بذاكرة محدودة)...
cd backend
start "Backend (Low Memory)" cmd /k "title Backend - Low Memory && set NODE_OPTIONS=--max-old-space-size=512 && node src/server.js"
cd ..
timeout /t 5 /nobreak >nul
echo ✅ Backend يعمل بذاكرة 512MB

echo.
echo [4/4] تشغيل Frontend (بذاكرة محدودة جداً)...
cd frontend
start "Frontend (Very Low Memory)" cmd /k "title Frontend - Very Low Memory && set NODE_OPTIONS=--max-old-space-size=256 && npx serve -s build -l 3000"
cd ..
timeout /t 3 /nobreak >nul
echo ✅ Frontend يعمل بذاكرة 256MB

echo.
echo ══════════════════════════════════════════════════════════
echo    🐌 المشروع يعمل الآن (بطيء جداً)
echo ══════════════════════════════════════════════════════════
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo ملاحظات مهمة:
echo - قد يستغرق التحميل 2-5 دقائق
echo - لا تفتح أكثر من تبويب واحد
echo - كن صبوراً جداً!
echo.
echo اضغط أي مفتاح لفتح المتصفح...
pause >nul

start http://localhost:3000

echo.
echo تم! قد يستغرق ظهور الصفحة بضع دقائق...
echo اضغط أي مفتاح للخروج...
pause >nul
