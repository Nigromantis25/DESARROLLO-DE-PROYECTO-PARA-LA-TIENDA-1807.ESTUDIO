# ✅ CHECKLIST DE CONFIGURACIÓN - 1807.studio

## 🎯 Guía Paso a Paso para Poner en Marcha el Sistema

---

## FASE 1️⃣: PREPARACIÓN (15 MINUTOS)

### ☐ 1. Verificar requisitos previos
```
☐ Node.js v16+ instalado
  └─ Verificar: node --version
  
☐ Python 3.x instalado
  └─ Verificar: python --version
  
☐ Cuenta en Twilio (gratis)
  └─ Registrarse: https://www.twilio.com/
  
☐ Supabase configurado
  └─ ¡Ya tienes acceso! ✅
```

### ☐ 2. Obtener credenciales Twilio
```
☐ Ir a: https://console.twilio.com/
☐ Copiar: Account SID
☐ Copiar: Auth Token
☐ Ir a: Messaging > WhatsApp > Sandbox
☐ Copiar: Número de WhatsApp (ej: whatsapp:+14155238886)
☐ Guardar estos valores
```

---

## FASE 2️⃣: CONFIGURACIÓN DEL BACKEND (10 MINUTOS)

### ☐ 3. Navegar a la carpeta backend
```powershell
☐ Abre PowerShell en: 
   C:\Users\ithan\OneDrive\Escritorio\DESARROLLO DE PROYECTO PARA LA TIENDA 1807.ESTUDIO\backend

☐ O ejecuta:
   cd "C:\Users\ithan\OneDrive\Escritorio\DESARROLLO DE PROYECTO PARA LA TIENDA 1807.ESTUDIO"
   cd backend
```

### ☐ 4. Instalar dependencias
```powershell
☐ Ejecuta: npm install
☐ Espera 1-2 minutos
☐ Verifica que diga ✅ added XXX packages
```

### ☐ 5. Configurar archivo .env
```powershell
☐ Abre: backend\.env (con bloc de notas o VS Code)

☐ Llena estos campos:
   TWILIO_ACCOUNT_SID=<tu_account_sid>
   TWILIO_AUTH_TOKEN=<tu_auth_token>
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   OWNER_WHATSAPP=whatsapp:+59178810097

☐ IMPORTANTE: Cambiar +59178810097 por TU número
   (Debe ser el formato +591XXXXXXXXX)

☐ Guarda el archivo
```

---

## FASE 3️⃣: CONFIGURACIÓN DE SUPABASE (5 MINUTOS)

### ☐ 6. Crear nuevas tablas
```
☐ Ir a: https://supabase.com/projects
☐ Abre tu proyecto
☐ Ve a: SQL Editor
☐ Clickea: New Query
☐ Abre el archivo: database\new_tables.sql
☐ Copia TODO el contenido
☐ Pégalo en Supabase SQL Editor
☐ Clickea: Run
☐ Verifica: "Successfully executed" ✅
```

### ☐ 7. Verificar tablas creadas
```
☐ En Supabase, ve a: Databases > Tables
☐ Deberías ver:
   ☑ pedido_tienda (nueva)
   ☑ pago_tienda (nueva)
   ☑ reserva_tienda (nueva)
   ☑ qr_code_tienda (nueva)
   ☑ notificacion_whatsapp (nueva)
```

---

## FASE 4️⃣: EJECUTAR EL SISTEMA (10 MINUTOS)

### ☐ 8. Ejecutar Backend (Terminal 1)
```powershell
☐ Abre PowerShell NUEVA
☐ Navega a:
   cd "C:\Users\ithan\OneDrive\Escritorio\DESARROLLO DE PROYECTO PARA LA TIENDA 1807.ESTUDIO\backend"

☐ Ejecuta:
   npm start

☐ Deberías ver:
   🚀 Servidor 1807.studio corriendo en puerto 3000
   📧 Notificaciones a: whatsapp:+59178810097

☐ NO CIERRES ESTA TERMINAL
```

### ☐ 9. Ejecutar Frontend (Terminal 2)
```powershell
☐ Abre PowerShell NUEVA
☐ Navega a la carpeta principal:
   cd "C:\Users\ithan\OneDrive\Escritorio\DESARROLLO DE PROYECTO PARA LA TIENDA 1807.ESTUDIO"

☐ Ejecuta:
   python -m http.server 8000

☐ Deberías ver:
   Serving HTTP on :: port 8000

☐ NO CIERRES ESTA TERMINAL
```

### ☐ 10. Abrir chatbot en navegador
```
☐ Abre tu navegador (Chrome, Firefox, Edge)
☐ Ve a: http://localhost:8000/chatbot-inteligente.html
☐ Deberías ver:
   ✓ Panel de chat a la izquierda
   ✓ Lista de productos a la derecha
   ✓ Campo de entrada para escribir
```

---

## FASE 5️⃣: PRUEBA DEL SISTEMA (10 MINUTOS)

### ☐ 11. Probar flujo de compra
```
EN EL CHATBOT:
☐ Escribe: quiero comprar algo
☐ Verifica: Lista de 10 productos aparcece
☐ Escribe: 1
☐ Verifica: "Seleccionaste Bolso..."
☐ Escribe: 2
☐ Verifica: Pide nombre
☐ Escribe: Juan Pérez
☐ Verifica: Pide WhatsApp
☐ Escribe: 78810097
☐ Verifica: Pide email
☐ Escribe: juan@email.com
☐ Verifica: Pide lugar entrega
☐ Escribe: 1
☐ Verifica: Muestra resumen
☐ Escribe: confirmar
☐ Verifica: ✅ Compra confirmada + QR aparece
```

### ☐ 12. Verificar notificación WhatsApp
```
EN TU WHATSAPP:
☐ Deberías recibir en +59178810097 UN MENSAJE con:
   ✓ "NUEVA COMPRA - 1807.studio"
   ✓ Cliente: Juan Pérez
   ✓ Producto y monto
   ✓ Lugar de entrega

☐ Si NO llega:
   → Verifica que backend esté corriendo (Terminal 1)
   → Verifica que .env tenga credenciales correctas
   → Verifica que el número esté autenticado en Twilio
```

### ☐ 13. Verificar que el QR se generó
```
☐ En la interfaz del chat:
   ✓ Deberías ver un modal con "CÓDIGO QR DE PAGO"
   ✓ Con una imagen QR
   ✓ Monto a pagar ($XX.XX)
   ✓ Botón "Cerrar"

☐ Si NO aparece:
   → Recarga la página
   → Verifica que npm install se ejecutó en backend
```

### ☐ 14. Verificar datos en Supabase
```
EN SUPABASE:
☐ Ve a: Tables > pedido_tienda
☐ Deberías ver 1 fila con los datos:
   ✓ cliente_nombre: "Juan Pérez"
   ✓ cliente_whatsapp: "78810097"
   ✓ producto_nombre: (nombre seleccionado)
   ✓ monto_total: (cantidad * precio)
   ✓ tipo: "compra"
   ✓ lugar_entrega: "tienda"
   ✓ referencia: "COMPRA-1712082400..."
```

---

## FASE 6️⃣: PRUEBA AVANZADA (OPCIONAL)

### ☐ 15. Probar una reserva
```
☐ En el chat: quiero reservar algo
☐ Sigue el mismo proceso que compra
☐ Verifica:
   ✓ Monto a pagar = 50% del total
   ✓ tipo: "reserva" (en Supabase)
   ✓ El mensaje al dueño dice "NUEVA RESERVA"
   ✓ El adelanto es exactamente 50%
```

### ☐ 16. Probar con delivery
```
☐ En el chat: quiero comprar algo
☐ Sigue el proceso
☐ Cuando pida lugar entrega, escribe: 2
☐ Verifica:
   ✓ Resumen muestra "📍 Delivery"
   ✓ Notificación WhatsApp menciona "Delivery"
   ✓ Supabase: lugar_entrega = "delivery"
```

---

## FASE 7️⃣: TROUBLESHOOTING

### ❌ Error: "TWILIO_ACCOUNT_SID not defined"
```
SOLUCIÓN:
☐ Abre backend/.env
☐ Verifica que tenga:
   TWILIO_ACCOUNT_SID=<valor aquí, NO vacío>
☐ NO tiene espacios extras
☐ Guarda el archivo
☐ Reinicia: npm start (en Terminal 1)
```

### ❌ Error: "Cannot GET /health"
```
SOLUCIÓN:
☐ Verifica que backend esté corriendo
☐ Terminal 1 debe mostrar: "🚀 Servidor corriendo..."
☐ Si no, ejecuta: npm start en backend
```

### ❌ El chat no se carga o está vacío
```
SOLUCIÓN:
☐ Verifica: http://localhost:8000/chatbot-inteligente.html
☐ Terminal 2 debe mostrar: "Serving HTTP on..."
☐ Si no, ejecuta: python -m http.server 8000
☐ Abre browser en URL correcta
☐ Refresca con F5
```

### ❌ No llega notificación a WhatsApp
```
SOLUCIÓN:
☐ Verifica que backend esté corriendo (Terminal 1)
☐ Abre browser console (F12) y busca errores
☐ Verifica que .env tenga credenciales Twilio
☐ Verifica que OWNER_WHATSAPP sea tu número
☐ Verifica en Twilio que Sandbox esté activado
```

### ❌ El QR no aparece
```
SOLUCIÓN:
☐ Ejecuta en backend terminal: npm install
☐ Verifica que librería qrcode esté instalada
☐ Recarga la página del navegador (F5)
☐ Abre console (F12) y busca errores
```

### ❌ Productos no cargan
```
SOLUCIÓN:
☐ Verifica que Supabase esté conectada
☐ Ve a supabase.js y confirma credenciales
☐ En Supabase, verifica que tabla producto tenga datos
☐ Abre console (F12) y busca errores de fetch
```

---

## 🎯 CHECKLIST FINAL

### Sistema Preparado ✅
```
☐ Node.js instalado
☐ .env completado con credenciales Twilio
☐ Npm install ejecutado
☐ Tablas Supabase creadas
☐ Backend corriendo en Terminal 1
☐ Frontend corriendo en Terminal 2
☐ Navegador abierto en http://localhost:8000/chatbot-inteligente.html
```

### Pruebas Exitosas ✅
```
☐ Chatbot responde a "quiero comprar algo"
☐ Lista de productos aparece
☐ Puedo seleccionar un producto
☐ Puedo ingresar datos del cliente
☐ QR se genera automáticamente
☐ Notificación llega a WhatsApp del dueño
☐ Datos se guardan en Supabase
```

### Sistema Funcionando ✅
```
☐ Compras creadas correctamente
☐ Reservas con 50% adelantado funcionan
☐ Opciones de entrega (tienda/delivery) funcionan
☐ Notificaciones WhatsApp llegan
☐ QR código escaneable genera en modal
☐ Base de datos actualiza en tiempo real
```

---

## 📞 Si Algo Falla

1. **Revisa primero esto:**
   - ¿Node.js está instalado? `node --version`
   - ¿Terminal 1 (backend) está corriendo?
   - ¿Terminal 2 (frontend) está corriendo?
   - ¿.env tiene credenciales Twilio?

2. **Consulta la documentación:**
   - CHATBOT_INTELIGENTE_GUIA.md
   - ARQUITECTURA_SISTEMA.md
   - RESUMEN_RAPIDO.md

3. **Abre browser console (F12):**
   - Busca mensajes de error
   - Verifica que se conecte a:
     - Supabase
     - Backend en puerto 3000

---

## 🎉 ¡LISTO!

Una vez completes este checklist, tu sistema estará funcionando al 100%.

**¡Disfruta tu chatbot inteligente! 🚀**

---

**Creado:** 12 de Abril de 2026  
**Para:** 1807.studio  
**Versión:** 2.0 Final
