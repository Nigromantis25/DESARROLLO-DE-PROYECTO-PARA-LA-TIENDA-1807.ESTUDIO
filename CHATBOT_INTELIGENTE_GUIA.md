# 🛍️ 1807.studio - Sistema Inteligente de Compra/Reserva por WhatsApp

Chatbot avanzado con integración de WhatsApp, pagos QR y reservas con 50% adelantado.

---

## 📋 Características

✅ **Chatbot Inteligente**
- Conversación natural y contexto
- Muestra productos disponibles con fotos
- Selección fácil de cantidad

✅ **Flujo de Compra Completo**
- Recolecta datos del cliente (nombre, WhatsApp, email)
- Opción de compra o reserva
- Selección de lugar de entrega (tienda o delivery)

✅ **Sistema de Pagos QR**
- Genera QR automático para cada transacción
- Pago instantáneo (compra) o 50% adelantado (reserva)
- Mantiene referencia para seguimiento

✅ **Notificaciones WhatsApp**
- Notifica al dueño cuando hay nuevo pedido
- Envía QR de pago al cliente
- Confirmación de pago automática
- Mensajes personalizados

✅ **Base de Datos Integrada**
- Almacena pedidos y reservas
- Historial de pagos
- Seguimiento de transacciones

---

## 🎯 Requisitos Previos

### 1. **Node.js** (Para el backend)
   - Descarga desde: https://nodejs.org/
   - Versión recomendada: v16 o superior

### 2. **Cuenta Twilio** (Para WhatsApp)
   - Crea cuenta en: https://www.twilio.com/
   - Es GRATIS para pruebas
   - Obtendrás:
     - Account SID
     - Auth Token
     - Número de WhatsApp

### 3. **Supabase** (Ya configurado ✅)
   - Tu proyecto ya está conectado

---

## 🚀 Instrucciones de Instalación

### Paso 1: Configurar Twilio (15 minutos)

1. **Ir a Twilio Console**: https://console.twilio.com/
2. **En la sección Messaging > Try it out > Send an SMS**
3. **Copiar:**
   - Account SID
   - Auth Token
   - WhatsApp Number

4. **En el panel lateral, ir a: Messaging > Whatsapp > Sandbox**
5. **Guardar estos valores para el paso 3**

### Paso 2: Configurar Backend

1. **Abrir terminal en la carpeta `/backend`**
   ```powershell
   cd backend
   ```

2. **Instalar dependencias**
   ```
   npm install
   ```

3. **Crear archivo `.env` con tus credenciales:**
   ```
   cp .env.example .env
   ```

4. **Editar `.env` con tus valores de Twilio:**
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   OWNER_WHATSAPP=whatsapp:+59178810097
   PORT=3000
   ```

   **⚠️ Importante:** Cambia el `OWNER_WHATSAPP` a tu número (+591XXXXXXXXX)

### Paso 3: Preparar Supabase

1. **En Supabase (https://supabase.com)**
2. **Ir a SQL Editor**
3. **Ejecutar el script `database/new_tables.sql`**
   - Esto crea las tablas para pedidos, reservas y pagos

### Paso 4: Ejecutar el Proyecto

**Terminal 1 - Backend (Node.js):**
```powershell
cd backend
npm start
```
Deberías ver:
```
🚀 Servidor 1807.studio corriendo en puerto 3000
```

**Terminal 2 - Frontend (HTTP Server):**
```powershell
python -m http.server 8000
```

### Paso 5: Acceder al Chatbot

Abre tu navegador:
```
http://localhost:8000/chatbot-inteligente.html
```

---

## 💬 Cómo Usar el Chatbot

### Para Clientes:

**Ejemplo de flujo de compra:**

```
Cliente: quiero comprar algo
Bot: Muestra lista de productos con números

Cliente: 1
Bot: Seleccionaste Bolso Cuero Negro
      ¿Cuántos deseas?

Cliente: 2
Bot: Cantidad: 2
    Total: $900
    Nombre completo?

Cliente: Juan Pérez González
Bot: ¿Cuál es tu número de WhatsApp?

Cliente: 78810097
Bot: ¿Email? (skip para omitir)

Cliente: juan@email.com
Bot: ¿Dónde prefieres recibir?
    1️⃣ Tienda 1807.studio
    2️⃣ Delivery

Cliente: 1
Bot: [Muestra resumen]
    ¿Confirmar compra?

Cliente: confirmar
Bot: ✅ Compra confirmada!
    🔲 Muestra QR de pago
    💰 Total: $900
```

### Para Reservas:

Igual que compra, pero:
- Solo paga 50% adelantado
- Válida por 48 horas
- Completa el resto al retirar

---

## 🔐 Estructura de Carpetas

```
proyecto/
├── chatbot-inteligente.html      # Interfaz del chat (ABRIR AQUÍ)
├── chatbot-v2.js                # Lógica mejorada del chatbot
├── ordenes-utils.js             # Utilidades de compra/pago
├── supabase.js                  # Conexión a BD
├── styles.css                   # Estilos generales
│
├── backend/
│   ├── server.js                # Servidor Node.js (backend)
│   ├── package.json             # Dependencias
│   ├── .env                     # Credenciales (NO subir a Git!)
│   └── .env.example             # Plantilla de .env
│
├── database/
│   ├── new_tables.sql           # Nuevas tablas (ejecutar en Supabase)
│   ├── schema.sql               # Schema original
│   └── schema_backup.sql        # Backup
```

---

## 📊 Tablas en Supabase (Nuevas)

### `pedido_tienda`
Almacena todos los pedidos y reservas:
- `id`: UUID único
- `cliente_nombre`: Nombre del cliente
- `cliente_whatsapp`: Número de WhatsApp
- `producto_nombre`: Producto comprado
- `monto_total`: Monto completo
- `monto_adelanto`: Lo que debe pagar (50% si es reserva)
- `tipo`: 'compra' o 'reserva'
- `estado`: 'pendiente', 'pagado', 'entregado', etc.
- `referencia`: Código único como "COMPRA-1712082400000"

### `pago_tienda`
Registro de pagos realizados:
- `pedido_id`: Relación con pedido
- `monto`: Cantidad pagada
- `metodo_pago`: 'QR', 'transferencia', 'efectivo'
- `estado`: 'confirmado', 'pendiente'

### `reserva_tienda`
Detalles de reservas:
- `pedido_id`: Relación
- `fecha_reserva`: Cuándo se reservó
- `fecha_expiracion`: Cuándo expira (48h)
- `adelanto_pagado`: True/False

### `qr_code_tienda`
Códigos QR generados:
- `pedido_id`: Relación
- `qr_image_url`: URL de la imagen
- `qr_data`: Datos JSON del QR

---

## 🔔 Notificaciones WhatsApp

El sistema envía automáticamente:

**1. Al dueño (78810097):**
```
📅 NUEVA COMPRA - 1807.studio

👤 Cliente: Juan Pérez García
📱 WhatsApp: +591 78810097
🛍️ Producto: Bolso Cuero Negro
💰 Monto a pagar: $450.00
📍 Entrega: Tienda 1807.studio

🔔 El cliente recibirá un QR de pago.
```

**2. Al cliente:**
```
✅ COMPRA CONFIRMADA - 1807.studio

📋 Referencia: COMPRA-1712082400000
💰 Monto a pagar: $450.00
🛍️ Producto: Bolso Cuero Negro
📍 Entrega: Tienda 1807.studio

[CÓDIGO QR ESCANEBLE]

Te contactaremos pronto.
```

---

## 🐛 Solución de Problemas

### Error: "TWILIO_ACCOUNT_SID not defined"
**Solución:** Revisa que tu `.env` tenga las credenciales correctas en `/backend`

### El chatbot no se carga
**Solución:** 
- Verifica que el servidor HTTP esté corriendo: `python -m http.server 8000`
- Abre http://localhost:8000/chatbot-inteligente.html

### No llega la notificación a WhatsApp
**Solución:**
- Verifica que el backend esté corriendo: `npm start` en `/backend`
- Confirma que el número en `.env` sea correcto: `+591XXXXXXXXX`
- En Twilio Sandbox, verifica que el número esté autorizado

### El QR no se genera
**Solución:**
- Verifica que la librería `qrcode` esté instalada: `npm install`
- Recarga la página del chatbot

---

## 📱 Prueba en tu Celular

1. **Habilita acceso a Supabase desde URL local**
   - En Supabase: Settings > Authentication > Redirect URLs
   - Agregar: `http://localhost:8000/`

2. **Desde tu red local:**
   - En tu celular, abre: `http://[TU_IP_LOCAL]:8000/chatbot-inteligente.html`
   - Reemplaza `[TU_IP_LOCAL]` con tu IP (ej: `192.168.1.100`)

---

## 💡 Customización

### Cambiar número del dueño
En `/backend/.env`:
```env
OWNER_WHATSAPP=whatsapp:+59178810097  # Tu número
```

### Cambiar porcentaje de reserva
En `/ordenes-utils.js`, línea ~80:
```javascript
get monto_adelanto() {
    return this.tipo === 'reserva' ? this.monto_total * 0.50 : this.monto_total;
    //                                                    ↑
    //                                   Cambia 0.50 por otra cantidad
}
```

### Cambiar colores del chat
En `/chatbot-inteligente.html`, línea ~14:
```css
:root {
    --primary: #8B4513;      /* Marrón claro */
    --secondary: #D2691E;    /* Marrón oscuro */
    --accent: #FF6B6B;       /* Rojo/rosa */
    // ... más colores
}
```

---

## 📞 Contato y Soporte

**Tienda 1807.studio**
- WhatsApp: +591 78810097
- Ubicación: La Paz, Bolivia

---

## 📝 Notas Importantes

⚠️ **SEGURIDAD:**
- Nunca commits `backend/.env` a GitHub
- Añade `.env` a `.gitignore`

⚠️ **TESTING:**
- Usa la sandbox de Twilio para pruebas gratis
- Luego pasa a producción

⚠️ **LIMITES:**
- Twilio free tier: 100 SMS/mes
- Para mayor uso, necesitarás plan de pago

---

## 🎯 Próximas Mejoras (Opcional)

- [ ] Integración con pasarela de pago (PayPal, Stripe)
- [ ] Imágenes reales de productos
- [ ] Seguimiento de entregas en tiempo real
- [ ] Chat en vivo con soporte
- [ ] Integración con inventario automático
- [ ] Análisis de ventas y reportes

---

**Versión:** 2.0  
**Última actualización:** Abril 2026  
**Desarrollado para:** 1807.studio
