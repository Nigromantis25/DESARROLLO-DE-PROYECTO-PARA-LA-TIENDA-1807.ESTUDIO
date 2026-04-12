# 🎨 Arquitectura del Sistema 1807.studio

## 📐 Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                    🌐 USUARIO FINAL                             │
│              (Computadora / Móvil / Tablet)                     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    HTTP:8000 / HTTPS
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ┌────▼─────┐          ┌────▼──────┐         ┌────▼────┐
   │  Login   │          │  Chatbot  │         │  Admin  │
   │ login.   │          │ chatbot-  │         │ admin-  │
   │  html    │          │ intelig.  │         │ vault.  │
   │          │          │  html     │         │  html   │
   └────┬─────┘          └────┬──────┘         └────┬────┘
        │                      │                     │
        └──────────────────────┼─────────────────────┘
                               │
              ┌────────────────▼─────────────────┐
              │  JavaScript Modules (.js)        │
              ├────────────────────────────────┤
              │  • supabase.js                  │
              │  • chatbot-v2.js (800+ líneas) │
              │  • ordenes-utils.js            │
              │  • admin-vault.js (300+ líneas)│
              └────────────┬────────────────────┘
                           │
            ┌──────────────▼──────────────┐
            │   🔄 SUPABASE CLOUD         │
            ├──────────────────────────────┤
            │                              │
            │  ┌──────────────┐            │
            │  │ PostgreSQL   │            │
            │  │ + RLS + Auth │            │
            │  └──┬───────────┘            │
            │     │                        │
            │  Tablas:                     │
            │  • auth.users                │
            │  • producto                  │
            │  • pedido_tienda             │
            │  • pago_tienda               │
            │  • reserva_tienda            │
            │  • qr_code_tienda            │
            │  • notificacion_whatsapp     │
            │  • admin_vault (NUEVA)       │
            │  • admin_settings (NUEVA)    │
            │  • admin_audit_log (NUEVA)   │
            │                              │
            └──────────────┬───────────────┘
                           │
            HTTPS/REST API │
                           │
       ┌───────────────────▼─────────────────┐
       │  🖥️ BACKEND SERVER (Optional)       │
       │       backend/server.js             │
       │       http://localhost:3000         │
       ├──────────────────────────────────────┤
       │  Express.js + Twilio Integration   │
       │                                      │
       │  Endpoints:                          │
       │  • POST /api/orders                  │
       │  • GET /orders/:referencia           │
       │  • POST /orders/:ref/confirm-payment │
       │  • POST /api/generate-qr             │
       │  • POST /api/send-whatsapp           │
       │                                      │
       └───────────┬─────────────────────────┘
                   │
        ┌──────────▼─────────────┐
        │  🌐 APIs EXTERNAS      │
        ├────────────────────────┤
        │  • Twilio WhatsApp     │
        │  • QRCode.js Library   │
        │  • Supabase Auth + DB  │
        └────────────────────────┘
```

---

## 🔁 Flujos de Usuario

### 1️⃣ Flujo de Compra/Reserva

```
Usuario Escritorio (Laptop)              Usuario Móvil (Phone)
        │                                       │
        ├─ Abre http://localhost:8000/login.html│
        │  └─ Ingresa email + password          │
        │     └─ Supabase valida               │
        │        └─ Sesión creada en localStorage
        │                                       │
        ├─ Entra a chatbot-inteligente.html     │
        │     (Layout: Chat | Productos)       │ Abre http://IP:8000/chatbot
        │                                       │ (Header + Chat apilado)
        │                                       │
        ├─ Lee mensaje bot: "Hola ¿Qué deseas?"
        │     (Panel productos a la derecha)   │ (Panel abajo como bottom-sheet)
        │                                       │ Toca botón "📦 Productos"
        │                                       │ (desliza desde abajo)
        │
        ├─ Selecciona producto #1
        │  └─ Entra estado: "seleccionando"    │
        │     └─ Bot pide cantidad             │
        │                                       │
        ├─ Escribe cantidad
        │  └─ Bot pide correo                  │
        │                                       │
        ├─ Continúa conversación
        │  └─ Elige: Compra / Reserva          │
        │  └─ Elige: Tienda / Delivery         │
        │  └─ COMPLETADO                       │
        │                                       │
        ├─ Aparece modal QR
        │  └─ Código QR para pago              │
        │  └─ Escanea (si puede)               │
        │  └─ Reserva confirmada / Pedido listo
        │                                       │
        └─ Recibe WhatsApp con detalles        │
           (número pedido, monto, etc)         │
                                               │
```

### 2️⃣ Flujo de Admin Panel

```
Admin (Desktop)                          Admin (Móvil)
   │                                          │
   ├─ Abre http://localhost:8000/admin.html  │
   │  └─ Login requerido                      │
   │     └─ Ingresa credenciales Supabase    │
   │                                          │
   ├─ Ve Contraseñas guardadas               │ ├─ Panel apilado vertical
   │  (Tabla cards: Nombre | Categoría)     │ │  (Cards full-width)
   │                                          │ │
   │  Opción 1: Copiar contraseña             │ │ Toca "📋" para copiar
   │  └─ Click "📋"                          │ │ └─ Se copia al portapapeles
   │     └─ "¡Copiado!" (notificación)      │ │
   │                                          │ │
   │  Opción 2: Editar/Eliminar              │ │ Toca "✏️" para editar
   │  └─ Click "✏️"                          │ │ └─ Modal bottom-sheet
   │     └─ Modal centrado                  │ │    (desliza desde abajo)
   │        └─ Editar campos                │ │
   │        └─ Guardar                       │ │
   │                                          │ │
   │  Opción 3: Agregar nueva                │ │ Toca "+ Agregar"
   │  └─ Click "+ Agregar"                  │ │ └─ Modal bottom-sheet
   │     └─ Modal (centered)                │ │
   │        └─ Nombre, Usuario, Contraseña │ │
   │        └─ Categoría (dropdown)         │ │
   │        └─ Guardar                       │ │
   │           └─ Encriptación Base64+XOR   │ │
   │           └─ Almacena en admin_vault   │ │
   │                                          │ │
   │  Tab "⚙️ Configuración"                 │ │ Scroll a segunda tab
   │  └─ Nombre tienda, Teléfono            │ │ └─ Edita configuraciones
   │  └─ Email, Dirección                    │ │
   │  └─ Click "Guardar"                     │ │
   │                                          │ │
   │  Tab "ℹ️ Información"                   │ │ Scroll a tercera tab
   │  └─ Sobre seguridad                    │ │ └─ Lee información
   │  └─ Historial de auditoría             │ │
   │                                          │ │
   └─ Logout                                 │ └─ Toca "🚪 Salir"
                                              │    └─ Vuelve a login

SINCRONIZACIÓN:
  Desktop → Guarda contraseña en Supabase
            ↓
  Móvil   → Recibe actualización real-time (Supabase)
            ↓
  Ambos   → Ven la misma contraseña (RLS protege por usuario)
```

---

## 🗂️ Estructura de Datos

### Backend Storage Flow

```
Usuario Input (Form)
        │
    Validación Cliente (HTML5)
        │
  JavaScript Encriptación
        │ (Base64 + XOR)
        │
  Request HTTPS → Supabase
        │
   Supabase Backend
        │
  ┌─────▼──────────────────┐
  │  Row Level Security    │
  │  (Valida usuario_id)   │
  └─────┬──────────────────┘
        │
  ┌─────▼──────────────────┐
  │  PostgreSQL INSERT     │
  │  → admin_vault table   │
  └─────┬──────────────────┘
        │
  ┌─────▼──────────────────┐
  │  Trigger Timestamp     │
  │  (Auto fecha_actualiz) │
  └─────┬──────────────────┘
        │
  ✅ Stored Encrypted
     (Can only read back)
```

---

## 🔐 Security Layers

```
LAYER 1: Frontend
┌──────────────────────────┐
│ • HTML5 validation       │
│ • JavaScript sanitize    │
│ • localStorage tokens    │
│ • Client-side encryption │
└──────────────────────────┘
        ↓
LAYER 2: Transport
┌──────────────────────────┐
│ • HTTPS encryption       │
│ • CORS headers           │
│ • Supabase JWT tokens    │
└──────────────────────────┘
        ↓
LAYER 3: Backend
┌──────────────────────────┐
│ • Supabase Auth verify   │
│ • Request validation     │
│ • API rate limit         │
└──────────────────────────┘
        ↓
LAYER 4: Database
┌──────────────────────────┐
│ • Row Level Security     │
│ • usuario_id matching    │
│ • No cross-user access   │
│ • Audit logging          │
└──────────────────────────┘
```

---

## 📱 Responsive Layout Transformations

### Desktop (>900px)
```
┌───────────────────────────────────────┐
│  Header                               │
├────────────────┬──────────────────────┤
│                │                      │
│   Chatbox      │   Panel Productos    │
│                │                      │
│  600px         │     600px            │
│                │                      │
└────────────────┴──────────────────────┘
```

### Tablet (768px - 900px)
```
┌───────────────────────────────────────┐
│  Header                               │
├───────────────────────────────────────┤
│                                       │
│   Chatbox (100%)                      │
│                                       │
├───────────────────────────────────────┤
│                                       │
│   Panel Productos (100%)              │
│                                       │
└───────────────────────────────────────┘
```

### Móvil (<480px)
```
┌───────────────────────────────────────┐
│ Home │ 📦 Productos │ 🏠 │           │
├───────────────────────────────────────┤
│                                       │
│   Chatbox (60vh)                      │
│   Scroll automático                   │
│                                       │
└───────────────────────────────────────┘
        ↓ Toca "📦 Productos"
┌───────────────────────────────────────┐
│ Home │ 📦 Productos │ 🏠 │   ✕      │
├───────────────────────────────────────┤
│                                       │
│   Chatbox (60vh)                      │
│   Semitransparente de fondo           │
│                                       │
├───────────────────────────────────────┤
│      Panel Productos                  │
│      (40vh) Bottom-Sheet               │
│      Desliza desde abajo              │
│                                       │
└───────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos en Tiempo Real

```
Usuario A (Móvil)          Supabase         Usuario B (Laptop)
                           Real-time
    │                         │                    │
    ├─ Guarda contraseña      │                    │
    │  "Gmail"                │                    │
    │                    ┌────▼────────┐          │
    │                    │ INSERT or   │          │
    │                    │ UPDATE      │          │
    │                    │ admin_vault │          │
    │                    └────┬────────┘          │
    │                         │                    │
    │                    ┌────▼────────┐          │
    │                    │ Broadcast   │          │
    │                    │ Change Event│          │
    │                    └────┬────────┘          │
    │                         │                    │
    ├──────────────────────── CHANGE EVENT ───────>│
    │                                              │
    │                         │          Get Nueva│
    │                         │          Contraseña
    │                         │             ✅
    │  (Tiempo real: <1seg)   │
    │                                              │
    └─ Sincronización
       Automática
```

---

## 🧮 Database Relations

```
           auth.users (Supabase)
                │
     ┌──────────┼──────────┬──────────┐
     │          │          │          │
     │    admin_vault   admin_settings admin_audit_log
     │    - id, FK       - id, FK     - id, FK
     │    - nombre       - clave      - accion
     │    - categoria    - valor      - detalles
     │    - datos_enc


     producto
     ├─ id
     ├─ nombre
     ├─ precio
     └─ stock
           │
           └─ (FK) pedido_tienda
              - producto_id
              - cantidad
              - monto_total
                  │
                  ├─ (FK) pago_tienda
                  │   - monto
                  │   - estado
                  │
                  ├─ (FK) reserva_tienda
                  │   - fecha_expiracion
                  │
                  ├─ (FK) qr_code_tienda
                  │   - qr_image_url
                  │
                  └─ (FK) notificacion_whatsapp
                      - numero_destino
                      - mensaje
```

---

## 🚀 Flujo de Deployment

```
Desarrollo Local
│
├─ python -m http.server 8000
├─ http://localhost:8000
├─ Usando SQLite/Supabase dev
│
PRODUCCIÓN
│
├─ Frontend: Vercel / Netlify
│  ├─ https://tu-dominio.com
│  ├─ CDN global
│  └─ SSL automático
│
├─ Backend: Heroku / Railway
│  ├─ https://api.tu-dominio.com
│  ├─ Environment variables
│  ├─ Twilio credenciales
│  └─ Auto-scaling
│
└─ BD: Supabase Cloud
   ├─ PostgreSQL managed
   ├─ Backups automáticos
   ├─ Real-time subscriptions
   └─ RLS enforced
```

---

## 📊 Componentes Principales

| Componente | Tipo | Líneas | Función |
|-----------|------|--------|---------|
| supabase.js | Módulo | 150+ | Conexión BD + Auth |
| chatbot-v2.js | Lógica | 800+ | Máquina de estados + conversación |
| chatbot-inteligente.html | UI | 1000+ | Interface chat (RESPONSIVO) |
| admin-vault.js | Lógica | 300+ | Encriptación + CRUD |
| admin-vault.html | UI | 500+ | Panel admin (RESPONSIVO) |
| backend/server.js | API | 200+ | Express + Twilio + endpoints |

---

**Diagrama actualizado**: 2024 | Versión 3.0

