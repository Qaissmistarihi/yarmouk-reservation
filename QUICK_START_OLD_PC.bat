@echo off
chcp 65001 >nul
title تشغيل مشروع حجز القاعات - جهاز قديم
color 0A

echo.
echo ══════════════════════════════════════════════════════════
echo    تشغيل مشروع حجز القاعات - جهاز قديم
echo ══════════════════════════════════════════════════════════
echo.

echo [1/5] التحقق من Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js غير مثبت!
    echo الرجاء تثبيت Node.js LTS من https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js مثبت

echo.
echo [2/5] التحقق من MySQL...
tasklist | find "mysqld.exe" >nul 2>&1
if errorlevel 1 (
    echo ❌ MySQL لا يعمل!
    echo الرجاء تشغيل MySQL من XAMPP Control Panel
    pause
    exit /b 1
)
echo ✅ MySQL يعمل

echo.
echo [3/5] التحقق من مجلد المشروع...
if not exist "backend\package.json" (
    echo ❌ مجلد المشروع غير صحيح!
    echo تأكد من تشغيل هذا الملف من مجلد المشروع الرئيسي
    pause
    exit /b 1
)
echo ✅ مجلد المشروع صحيح

echo.
echo [4/5] تشغيل Backend (الخادم)...
cd backend
start "Backend Server" cmd /k "echo Backend Server Running && npm run dev-low"
cd ..
timeout /t 3 /nobreak >nul
echo ✅ Backend شغال في الخلفية

echo.
echo [5/5] تشغيل Frontend (الواجهة)...
cd frontend
start "Frontend Server" cmd /k "echo Frontend Running && npm run dev-low"
cd ..
timeout /t 3 /nobreak >nul
echo ✅ Frontend شغال في الخلفية

echo.
echo ══════════════════════════════════════════════════════════
echo    🎉 المشروع يعمل الآن!
echo ══════════════════════════════════════════════════════════
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo الرجاء فتح المتصفح على: http://localhost:3000
echo.
echo ملاحظات:
echo - لا تغلق نوافذ cmd المفتوحة
echo - للإيقاف: اضغط Ctrl+C في كل نافذة
echo.
echo اضغط أي مفتاح لفتح المتصفح...
pause >nul

start http://localhost:3000

echo.
echo تم! يمكنك الآن استخدام المشروع.
echo اضغط أي مفتاح للخروج...
pause >nul
