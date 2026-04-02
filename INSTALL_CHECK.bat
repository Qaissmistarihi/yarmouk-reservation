@echo off
chcp 65001 >nul
title فحص متطلبات تشغيل المشروع
color 0B

echo.
echo ══════════════════════════════════════════════════════════
echo    فحص متطلبات تشغيل مشروع حجز القاعات
echo ══════════════════════════════════════════════════════════
echo.

echo [1] التحقق من نظام التشغيل...
ver | find "10." >nul
if errorlevel 1 (
    echo ❌ نظام التشغيل ليس Windows 10 أو أحدث
    echo المشروع يتطلب Windows 10 64-bit على الأقل
) else (
    echo ✅ نظام التشغيل متوافق
)
echo.

echo [2] التحقق من بنية النظام...
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    echo ✅ بنية 64-bit
) else (
    echo ❌ بنية 32-bit - المشروع يتطلب 64-bit
)
echo.

echo [3] التحقق من الذاكرة RAM...
for /f "skip=1" %%p in ('wmic os get TotalVisibleMemorySize') do (
    set ram=%%p
    goto :ram_done
)
:ram_done
set /a ram_gb=%ram%/1024
if %ram_gb% GEQ 4096 (
    echo ✅ الذاكرة: %ram_gb% GB (متوافق)
) else (
    echo ⚠️  الذاكرة: %ram_gb% GB (قد يكون بطيئاً)
)
echo.

echo [4] التحقق من مساحة القرص...
for /f "tokens=2 delims==" %%a in ('wmic logicaldisk get freespace /value ^| find "="') do (
    set free=%%a
    goto :disk_done
)
:disk_done
set /a free_gb=%free%/1073741824
if %free_gb% GEQ 5 (
    echo ✅ المساحة الحرة: %free_gb% GB (متوافق)
) else (
    echo ❌ المساحة الحرة: %free_gb% GB (يتطلب 5 GB على الأقل)
)
echo.

echo [5] التحقق من Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js غير مثبت
    echo الرجاء تحميله من: https://nodejs.org
) else (
    for /f "tokens=*" %%i in ('node --version') do set node_ver=%%i
    echo ✅ Node.js: %node_ver%
)
echo.

echo [6] التحقق من MySQL/XAMPP...
tasklist | find "mysqld.exe" >nul 2>&1
if errorlevel 1 (
    echo ❌ MySQL لا يعمل
    echo الرجاء تشغيل MySQL من XAMPP Control Panel
) else (
    echo ✅ MySQL يعمل
)
echo.

echo [7] التحقق من ملفات المشروع...
if exist "backend\package.json" (
    echo ✅ ملف backend/package.json موجود
) else (
    echo ❌ ملف backend/package.json غير موجود
)

if exist "frontend\package.json" (
    echo ✅ ملف frontend/package.json موجود
) else (
    echo ❌ ملف frontend/package.json غير موجود
)

if exist "database\schema.sql" (
    echo ✅ ملف database/schema.sql موجود
) else (
    echo ❌ ملف database/schema.sql غير موجود
)
echo.

echo ══════════════════════════════════════════════════════════
echo    ملخص الفحص
echo ══════════════════════════════════════════════════════════
echo.

echo إذا كانت كل العناصر ✅، يمكنك تشغيل:
echo   QUICK_START_OLD_PC.bat
echo.
echo إذا كانت هناك عناصر ❌ أو ⚠️، راجع:
echo   INSTALL_ON_OLD_PC.md
echo.

echo اضغط أي مفتاح للخروج...
pause >nul
