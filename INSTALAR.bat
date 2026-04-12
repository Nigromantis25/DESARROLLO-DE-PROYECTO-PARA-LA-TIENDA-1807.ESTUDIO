@echo off
REM ============================================
REM 1807.studio - Script de Instalación Rápida
REM ============================================

setlocal enabledelayedexpansion

cls
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║     🛍️  1807.studio - Instalación Chat Inteligente            ║
echo ║                                                                  ║
echo ║    Chatbot con Compra/Reserva, QR y Notificaciones WhatsApp   ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM ============================================
REM VERIFICAR NODE.JS
REM ============================================

echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado
    echo.
    echo Descárgalo desde: https://nodejs.org/
    echo Versión recomendada: v16 o superior
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js !NODE_VERSION! detectado
)

echo.

REM ============================================
REM INSTALAR DEPENDENCIAS BACKEND
REM ============================================

echo [2/5] Instalando dependencias del backend...

if not exist "backend" (
    echo ❌ Error: No se encuentra la carpeta 'backend'
    pause
    exit /b 1
)

cd backend

if not exist "package.json" (
    echo ❌ Error: No se encuentra package.json en backend/
    cd ..
    pause
    exit /b 1
)

echo.
echo Ejecutando: npm install
echo Por favor, espera (esto puede tardar 1-2 minutos)...
echo.

npm install

if errorlevel 1 (
    echo ❌ Error al instalar dependencias
    cd ..
    pause
    exit /b 1
) else (
    echo ✅ Dependencias instaladas correctamente
)

cd ..

echo.

REM ============================================
REM CREAR ARCHIVO .env
REM ============================================

echo [3/5] Configurando archivo .env para backend...

if exist "backend\.env" (
    echo ℹ️  backend\.env ya existe
) else (
    if exist "backend\.env.example" (
        copy backend\.env.example backend\.env >nul
        echo ✅ Archivo .env creado desde template
        echo.
        echo ⚠️  IMPORTANTE: Edita backend\.env con tus credenciales de Twilio:
        echo.
        echo   1. Ve a: https://console.twilio.com/
        echo   2. Copia tu Account SID y Auth Token
        echo   3. Guarda el número de WhatsApp
        echo.
        echo   Abre backend\.env y completa:
        echo   - TWILIO_ACCOUNT_SID=tu_sid
        echo   - TWILIO_AUTH_TOKEN=tu_token
        echo   - OWNER_WHATSAPP=+591XXXXXXXXX (tu número)
        echo.
    ) else (
        echo ❌ No se encontró .env.example
    )
)

echo.

REM ============================================
REM VERIFICAR SUPABASE
REM ============================================

echo [4/5] Verificando configuración Supabase...

if exist "supabase.js" (
    echo ✅ Archivo supabase.js detectado
    echo ℹ️  Las credenciales de Supabase están configuradas
) else (
    echo ❌ No se encuentr supabase.js
)

echo.

REM ============================================
REM CREAR TABLAS SUPABASE
REM ============================================

echo [5/5] Tablas de la base de datos...

if exist "database\new_tables.sql" (
    echo ✅ Script SQL disponible: database\new_tables.sql
    echo.
    echo ⚠️  IMPORTANTE: Ejecuta el SQL en Supabase:
    echo.
    echo   1. Ve a: https://supabase.com/
    echo   2. Abre tu proyecto
    echo   3. Ve a SQL Editor
    echo   4. Copia el contenido de: database\new_tables.sql
    echo   5. Pégalo y ejecuta
    echo.
) else (
    echo ❌ No se encontró database\new_tables.sql
)

echo.

REM ============================================
REM FIN
REM ============================================

echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                ✅ INSTALACIÓN COMPLETADA                       ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo 📋 PRÓXIMOS PASOS:
echo.
echo 1️⃣  Editar credenciales de Twilio:
echo    • Abre: backend\.env
echo    • Llena con tus datos de Twilio
echo.
echo 2️⃣  Crear tablas en Supabase:
echo    • Abre: database\new_tables.sql
echo    • Cópialo y ejecuta en SQL Editor de Supabase
echo.
echo 3️⃣  Ejecutar Backend (Terminal 1):
echo    • Abre PowerShell
echo    • cd backend
echo    • npm start
echo    • Espera: "✅ Servidor 1807.studio corriendo en puerto 3000"
echo.
echo 4️⃣  Ejecutar Frontend (Terminal 2):
echo    • Abre PowerShell en la carpeta del proyecto
echo    • python -m http.server 8000
echo.
echo 5️⃣  Abrir en navegador:
echo    • http://localhost:8000/chatbot-inteligente.html
echo.
echo 📖 Guía completa: CHATBOT_INTELIGENTE_GUIA.md
echo.
echo 🚀 ¡Listo para empezar!
echo.

pause
