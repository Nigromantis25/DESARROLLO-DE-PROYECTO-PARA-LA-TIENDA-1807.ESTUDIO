# ============================================
# 1807.studio - Script Rápido de Instalación
# Windows PowerShell
# ============================================

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  🛍️  1807.studio - Chat Inteligente Setup       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# ============================================
# 1. VERIFICAR NODE.JS
# ============================================

Write-Host "✓ [1/4] Verificando Node.js..." -ForegroundColor Cyan

$nodeCheck = node --version 2>&1
if ($?) {
    Write-Host "✅ Node.js $nodeCheck instalado" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js no detectado" -ForegroundColor Red
    Write-Host "   Descargue desde: https://nodejs.org/" -ForegroundColor Yellow
    exit
}

# ============================================
# 2. INSTALAR DEPENDENCIAS
# ============================================

Write-Host ""
Write-Host "✓ [2/4] Instalando dependencias del backend..." -ForegroundColor Cyan

if (Test-Path "backend") {
    Set-Location backend
    
    if (Test-Path "package.json") {
        Write-Host "   Ejecutando npm install..." -ForegroundColor Yellow
        npm install
        
        if ($?) {
            Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
        } else {
            Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
            exit
        }
    } else {
        Write-Host "❌ package.json no encontrado" -ForegroundColor Red
        exit
    }
    
    Set-Location ..
} else {
    Write-Host "❌ Carpeta backend no encontrada" -ForegroundColor Red
    exit
}

# ============================================
# 3. VERIFICAR .ENV
# ============================================

Write-Host ""
Write-Host "✓ [3/4] Configurando archivo .env..." -ForegroundColor Cyan

if (Test-Path "backend/.env") {
    Write-Host "✅ .env ya existe" -ForegroundColor Green
} elseif (Test-Path "backend/.env.example") {
    Copy-Item "backend/.env.example" "backend/.env"
    Write-Host "✅ .env creado desde template" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
    Write-Host "   Edita: backend/.env" -ForegroundColor Yellow
    Write-Host "   Con tus credenciales de Twilio" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  .env.example no encontrado" -ForegroundColor Yellow
}

# ============================================
# 4. MOSTRAR INSTRUCCIONES FINALES
# ============================================

Write-Host ""
Write-Host "✓ [4/4] Configuración completada" -ForegroundColor Cyan
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ LISTO PARA FUNCIONAR!             ║" -ForegroundColor Green  
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  Edita credenciales de Twilio:" -ForegroundColor White
Write-Host "    • Abre: backend\.env" -ForegroundColor Gray
Write-Host "    • Ve a: https://www.twilio.com/console" -ForegroundColor Gray
Write-Host "    • Copia Account SID y Auth Token" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  Crea tablas en Supabase:" -ForegroundColor White
Write-Host "    • Ve a: https://supabase.com/projects" -ForegroundColor Gray
Write-Host "    • SQL Editor > New Query" -ForegroundColor Gray
Write-Host "    • Copia: database\new_tables.sql" -ForegroundColor Gray
Write-Host "    • Pega y ejecuta" -ForegroundColor Gray
Write-Host ""

Write-Host "3️⃣  Abre 2 Terminales PowerShell:" -ForegroundColor White
Write-Host ""
Write-Host "    TERMINAL 1 (Backend):" -ForegroundColor White
Write-Host "    $ cd backend" -ForegroundColor Gray
Write-Host "    $ npm start" -ForegroundColor Gray
Write-Host "    → Espera: 🚀 Servidor corriendo en puerto 3000" -ForegroundColor Gray
Write-Host ""

Write-Host "    TERMINAL 2 (Frontend):" -ForegroundColor White
Write-Host "    $ python -m http.server 8000" -ForegroundColor Gray
Write-Host "    → Espera: Serving HTTP on..." -ForegroundColor Gray
Write-Host ""

Write-Host "4️⃣  Abre en navegador:" -ForegroundColor White
Write-Host "    http://localhost:8000/chatbot-inteligente.html" -ForegroundColor Cyan
Write-Host ""

Write-Host "📖 Guía completa: CHATBOT_INTELIGENTE_GUIA.md" -ForegroundColor Gray
Write-Host "📄 Resumen rápido: RESUMEN_RAPIDO.md" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 ¡Listo para empezar!" -ForegroundColor Green
Write-Host ""

# ============================================
# OPCIÓN: ABRIR ARCHIVO ENV EN EDITOR
# ============================================

Write-Host "¿Deseas abrir backend\.env para editar credenciales? (S/N)" -ForegroundColor Yellow
$response = Read-Host "Respuesta"

if ($response -eq "S" -or $response -eq "s") {
    # Abrir con el editor por defecto
    if (Test-Path "backend/.env") {
        Start-Process "backend/.env"
    }
}

Write-Host ""
Write-Host "✅ ¡Script completado!" -ForegroundColor Green
