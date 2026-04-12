# 🏗️ Arquitectura del Sistema - 1807.studio Chat Inteligente

## Diagrama General del Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENTE (Navegador)                          │
│  http://localhost:8000/chatbot-inteligente.html                │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         Interfaz Visual del Chatbot (HTML/CSS)          │  │
│  │  - Lista de productos con fotos                         │  │
│  │  - Chat interactivo                                     │  │
│  │  - Visualización de QR                                  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │ JavaScript
                            │ (chatbot-v2.js)
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
    ┌─────────────────┐               ┌──────────────────┐
    │   SUPABASE BD   │               │  BACKEND NODE.JS │
    │                 │               │  (Puerto 3000)   │
    │ - Productos     │◄─────────────►│                  │
    │ - Pedidos       │  API REST     │ - Twilio SDK     │
    │ - Pagos         │               │ - QR Generator   │
    │ - Reservas      │               │ - WhatsApp API   │
    └─────────────────┘               └──────────────────┘
                                             │
                                    ┌────────▼─────────┐
                                    │  TWILIO SERVICE  │
                                    │                  │
                                    │ - Envía SMS/WA   │
                                    │ - Sandbox API    │
                                    └────────┬─────────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │  WHATSAPP        │
                                    │                  │
                                    │ Notificaciones:  │
                                    │ ✓ Al dueño       │
                                    │ ✓ Al cliente     │
                                    │ ✓ Confirmaciones │
                                    └──────────────────┘
```

---

## Flujo de Compra en Detalle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         INICIO DEL CHATBOT                              │
│                                                                           │
│  Cliente abre: chatbot-inteligente.html                                 │
│  ↓                                                                        │
│  chatbot-v2.js → initChatbotV2()                                        │
│    • Detectar tipo de usuario                                            │
│    • Cargar productos desde Supabase                                     │
│    • Mostrar interfaz                                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    CLIENTE INICIA COMPRA                                │
│                                                                           │
│  Escribe: "quiero comprar algo"                                         │
│  ↓                                                                        │
│  procesarCompraReserva()                                                │
│    • getProducts() → Supabase                                           │
│    • Muestra lista numerada de productos                                │
│    • Estado: seleccionando_producto                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                  CLIENTE SELECCIONA PRODUCTO                            │
│                                                                           │
│  Escribe: "1" (o número 2, 3, etc)                                      │
│  ↓                                                                        │
│  procesarSeleccionProducto()                                            │
│    • Valida número                                                       │
│    • Guarda: producto.id, nombre, precio                                │
│    • Pide cantidad                                                       │
│    • Estado: esperando_cantidad                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    CLIENTE INGRESA DATOS                                │
│                                                                           │
│  Secuencia de preguntas:                                                │
│  1. Cantidad → Estado: esperando_nombre                                 │
│  2. Nombre → Estado: esperando_tel                                      │
│  3. WhatsApp → Estado: esperando_email                                  │
│  4. Email → Estado: esperando_tipo                                      │
│  5. Entrega → Estado: confirmacion_pago                                 │
│                                                                           │
│  La clase Pedido() guarda todos los datos:                              │
│  - cliente_nombre                                                        │
│  - cliente_whatsapp                                                      │
│  - cliente_email                                                         │
│  - producto_nombre, id, precio                                          │
│  - cantidad, monto_total, monto_adelanto                                │
│  - tipo (compra/reserva)                                                │
│  - lugar_entrega (tienda/delivery)                                      │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│              CLIENTE CONFIRMA LA COMPRA                                 │
│                                                                           │
│  Escribe: "confirmar"                                                   │
│  ↓                                                                        │
│  procesarConfirmacionPago()                                             │
│    ↓                                                                      │
│    crearPedido(Pedido) → Backend (/api/orders)                         │
│      ↓                                                                    │
│      Backend:                                                            │
│      • Valida datos                                                      │
│      • Calcula montos (50% si es reserva)                               │
│      • Genera referencia única                                           │
│      • Guarda en Supabase (pedido_tienda)                              │
│      • Genera QR con qrcode.js                                          │
│      • Envía notificación a dueño por Twilio/WhatsApp                 │
│      ↓ Responde al cliente con:                                         │
│      • ID del pedido                                                     │
│      • Referencia                                                        │
│      • Monto a pagar                                                     │
│      • Imagen QR                                                         │
│    ↓                                                                      │
│    Frontend:                                                             │
│    • Muestra QR al cliente                                              │
│    • Guarda QR en localStorage                                          │
│    • Muestra confeti (emoji)                                            │
│    • Estado: completado                                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│              PAGO Y CONFIRMACIÓN                                        │
│                                                                           │
│  Cliente escanea QR                                                      │
│  ↓                                                                        │
│  Realiza transferencia/pago                                             │
│  ↓                                                                        │
│  (Manual o Automático según pasarela)                                   │
│  ↓                                                                        │
│  confirmarPago(referencia) → Backend (/api/orders/:ref/confirm-payment)│
│    ↓                                                                      │
│    Backend:                                                              │
│    • Busca pedido por referencia                                        │
│    • Actualiza estado a "pagado"                                        │
│    • Guarda fecha_pago en pedido_tienda                                │
│    • Envía confirmación por WhatsApp al cliente                        │
│    ↓ Respuesta:                                                          │
│    • "Pago confirmado exitosamente"                                    │
│                                                                           │
│  Cliente recibe:                                                         │
│  ✓ Notificación WhatsApp: "PAGO CONFIRMADO"                            │
│  ✓ Reforma de entrega                                                   │
│  ✓ Número de referencia del pedido                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Estructura de Archivos por Capas

```
CAPA DE PRESENTACIÓN (Frontend)
├─── chatbot-inteligente.html
│    ├─ Interfaz visual
│    ├─ Manejo de eventos
│    └─ Mostrar QR
│
└─── styles.css
     └─ Estilos CSS

CAPA DE LÓGICA DE APLICACIÓN (Frontend JS)
├─── chatbot-v2.js
│    ├─ procesarMensajeChatbot()
│    ├─ procesarCompraReserva()
│    ├─ procesarSeleccionProducto()
│    ├─ procesarConfirmacionPago()
│    └─ Máquina de estados (conversationState)
│
├─── ordenes-utils.js
│    ├─ Clase Pedido
│    ├─ crearPedido()
│    ├─ generarQR()
│    ├─ validarDatos()
│    └─ formatearPrecio()
│
└─── supabase.js
     ├─ getProducts()
     ├─ getProductById()
     ├─ getCartItems()
     └─ Funciones de BD

CAPA DE NEGOCIO (Backend Node.js)
├─── backend/server.js
│    ├─ POST /api/orders               (Crear pedido)
│    ├─ GET /api/orders/:ref           (Obtener estado)
│    ├─ POST /api/orders/:ref/confirm  (Confirmar pago)
│    ├─ POST /api/generate-qr          (Generar QR)
│    └─ POST /api/whatsapp/webhook     (Recibir mensajes)
│
└─── backend/package.json
     ├─ express
     ├─ twilio
     ├─ qrcode
     └─ @supabase/supabase-js

CAPA DE DATOS (Supabase PostgreSQL)
├─── producto (tabla original)
├─── pedido_tienda (nueva)
│    └─ Almacena pedidos/reservas
├─── pago_tienda (nueva)
│    └─ Histórico de pagos
├─── reserva_tienda (nueva)
│    └─ Detalles de reservas
├─── qr_code_tienda (nueva)
│    └─ QR generados
└─── notificacion_whatsapp (nueva)
     └─ Log de notificaciones

SERVICIOS EXTERNOS
├─── Twilio API
│    ├─ SDK Node.js
│    ├─ WhatsApp Sandbox
│    └─ Message Sending
│
└─── Supabase API
     ├─ Auth
     ├─ PostgreSQL
     └─ REST API
```

---

## Estados de la Conversación (State Machine)

```
                    ┌──────────────────┐
                    │    INICIO        │
                    └────────┬─────────┘
                             │
                    Saludo / /start
                             │
                    ┌────────▼────────┐
         ┌─────────►│  seleccionando  │◄─────────┐
         │          │   producto      │          │
         │          └────────┬────────┘          │
         │                   │                   │
         │        Número válido de 1-10         │
         │                   │                   │
         │          ┌────────▼────────┐         │
         └──────────│ esperando_      │         │
        cancelar    │ cantidad        │─────► numero inválido
                    └────────┬────────┘
                             │
                    cantidad válida
                             │
                    ┌────────▼────────┐
                    │ esperando_      │
                    │ nombre          │
                    └────────┬────────┘
                             │
                    nombre ≥ 3 caracteres
                             │
                    ┌────────▼────────┐
                    │ esperando_      │
                    │ tel             │
                    └────────┬────────┘
                             │
                    tel válido (≥7 dígitos)
                             │
                    ┌────────▼────────┐
                    │ esperando_      │
                    │ email           │
                    └────────┬────────┘
                             │
                    (skip o email válido)
                             │
                    ┌────────▼────────┐
                    │ esperando_      │
                    │ tipo            │
                    └────────┬────────┘
                             │
                    (1=tienda o 2=delivery)
                             │
                    ┌────────▼────────────┐
                    │ confirmacion_       │
                    │ pago                │
                    └────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    "confirmar"         "cancelar"              error
        │                    │                    │
        │                    │                    │
    ┌───▼────────┐       ┌───▼────────┐       ┌──▼──────┐
    │ completado │       │  inicio    │       │ error   │
    │ (pagado)   │       │(reinicia)  │       │(retry)  │
    └────────────┘       └────────────┘       └─────────┘
```

---

## Flujo de Datos en Pedido

```
FRONTEND (chatbot-inteligente.html)
          │
          ├─► conversationState
          │    ├─ pedido (Objeto Pedido)
          │    ├─ estado ("confirmacion_pago")
          │    └─ productoSeleccionado
          │
          └─► Envía POST a backend
               /api/orders con JSON:
               {
                 cliente_nombre: "Juan Pérez",
                 cliente_whatsapp: "78810097",
                 cliente_email: "juan@email",
                 producto_nombre: "Bolso Cuero",
                 producto_id: 5,
                 precio: 450.00,
                 cantidad: 2,
                 tipo: "compra",
                 lugar_entrega: "tienda"
               }
                    │
                    ▼
BACKEND (server.js)
          │
          ├─► Valida datos
          │
          ├─► Calcula:
          │    ├─ monto_total = precio * cantidad
          │    ├─ monto_adelanto = si reserva ? total*0.5 : total
          │    └─ referencia = "COMPRA-" + timestamp
          │
          ├─► Genera QR con qrcode.js
          │    └─ QRCode.toDataURL(JSON.stringify(qrData))
          │
          ├─► Guarda en Supabase
          │    INSERT INTO pedido_tienda {...}
          │
          ├─► Envía notificación Twilio
          │    twilio_client.messages.create({
          │      body: "📅 NUEVA COMPRA...",
          │      from: TWILIO_WHATSAPP,
          │      to: OWNER_WHATSAPP
          │    })
          │
          └─► Responde al frontend:
               {
                 success: true,
                 pedido_id: "uuid",
                 referencia: "COMPRA-1712082400",
                 monto_adelanto: 900,
                 qr_code: "data:image/png;base64,...",
                 mensaje: "Compra creada!"
               }
                    │
                    ▼
FRONTEND (recibe respuesta)
          │
          ├─► Muestra QR en modal
          │
          ├─► Guarda Estado: completado
          │
          └─► Display: "Escanea QR para pagar"
```

---

## Tablas Supabase (Schema)

### `pedido_tienda`
```sql
id                UUID            PRIMARY KEY
cliente_nombre    VARCHAR(255)    NOT NULL
cliente_whatsapp  VARCHAR(20)     NOT NULL
cliente_email     VARCHAR(255)    
producto_nombre   VARCHAR(255)    NOT NULL
producto_id       INT             FOREIGN KEY → producto
precio            DECIMAL(10,2)   NOT NULL
cantidad          INT             DEFAULT 1
monto_total       DECIMAL(10,2)   NOT NULL
monto_adelanto    DECIMAL(10,2)   
tipo              VARCHAR(20)     ('compra', 'reserva')
lugar_entrega     VARCHAR(50)     ('tienda', 'delivery')
estado            VARCHAR(50)     ('pendiente', 'pagado', 'entregado')
metodo_pago       VARCHAR(50)     ('QR', 'transferencia')
referencia        VARCHAR(100)    UNIQUE (ej: "COMPRA-1712082400")
fecha_creacion    TIMESTAMP       DEFAULT NOW()
fecha_pago        TIMESTAMP       
fecha_entrega     TIMESTAMP       
observaciones     TEXT            
```

### `pago_tienda`
```sql
id                UUID            PRIMARY KEY
pedido_id         UUID            FOREIGN KEY → pedido_tienda
monto             DECIMAL(10,2)   NOT NULL
porcentaje        DECIMAL(5,2)    DEFAULT 100
metodo_pago       VARCHAR(50)     ('QR', 'transferencia')
estado            VARCHAR(50)     ('pendiente', 'confirmado')
referencia_pago   VARCHAR(100)    UNIQUE
fecha_creacion    TIMESTAMP       DEFAULT NOW()
fecha_confirmacion TIMESTAMP      
```

---

## APIs Backend REST

### 1. Crear Pedido
```
POST /api/orders

Body:
{
  "cliente_nombre": "Juan Pérez",
  "cliente_whatsapp": "78810097",
  "cliente_email": "juan@email.com",
  "producto_nombre": "Bolso Cuero",
  "producto_id": 5,
  "precio": 450.00,
  "cantidad": 2,
  "tipo": "reserva",
  "lugar_entrega": "tienda"
}

Response:
{
  "success": true,
  "pedido_id": "550e8400-e29b-41d4-a716-446655440000",
  "referencia": "RESERVA-1712082400123",
  "monto_adelanto": 450.00,
  "qr_code": "data:image/png;base64,iVBORw0KGgo..."
}
```

### 2. Obtener Estado Pedido
```
GET /api/orders/RESERVA-1712082400123

Response:
{
  "success": true,
  "pedido": {
    "id": "550e8400...",
    "referencia": "RESERVA-1712082400123",
    "estado": "pagado",
    "monto_total": 900.00,
    "fecha_pago": "2025-04-12 15:30:45"
  }
}
```

### 3. Confirmar Pago
```
POST /api/orders/RESERVA-1712082400123/confirm-payment

Body:
{
  "metodo_pago": "QR"
}

Response:
{
  "success": true,
  "mensaje": "Pago confirmado exitosamente"
}
```

---

## Notificaciones WhatsApp

### Al Dueño (cuando hay nuevo pedido):
```
📅 NUEVA COMPRA - 1807.studio

👤 Cliente: Juan Pérez García
📧 Email: juan@email.com
📱 WhatsApp: +591 78810097

🛍️ Producto a Comprar:
📦 Bolso Cuero Negro
💰 Precio: $450.00
📝 Cantidad: 2

💰 Monto Total: $900.00
💵 Monto a Pagar: $900.00 (compra)

📍 Entrega: Tienda 1807.studio
⏰ 12/04/2025 15:30:45

🔔 El cliente recibirá un QR de pago.
```

### Al Cliente (cuando confirma compra):
```
✅ COMPRA CONFIRMADA - 1807.studio

📋 Referencia: COMPRA-1712082400000
💰 Monto a pagar: $900.00
🛍️ Producto: Bolso Cuero Negro
📍 Entrega: Tienda 1807.studio

PRÓXIMOS PASOS:
1️⃣ Escanea el código QR
2️⃣ Realiza el pago
3️⃣ Te enviaremos confirmación

📞 Preguntas? +591 78810097
```

---

## Flujo de Reserva (Diferencia con Compra)

```
COMPRA                          RESERVA
─────────────────────────────────────────
Pago 100% inmediato      VS     Pago 50% adelantado
│                                │
Estado: "pagado"                Estado: "reservado"
                         (después de pagar: "reservado_pagado")
│                                │
Entrega inmediata        VS     Entrega en 48 horas
                                (o según disponibilidad)
│                                │
Finalizando pedido       VS     Espera confirmación de disponibilidad
│                                │
Sin validez de tiempo    VS     Válida solo 48 horas
                                Luego expira
```

---

## Seguridad y Mejores Prácticas

```
✓ Credenciales en .env (NO en código)
✓ Validación en Frontend Y Backend
✓ CORS habilitado para localhost
✓ Números WhatsApp validados
✓ Referencias únicas por transacción
✓ Timestamps de auditoría
✓ Estado del pedido inmutable (solo lectura después de crear)
```

---

**Diagrama actualizado:** Abril 2026  
**Sistema:** 1807.studio Chat Inteligente V2
