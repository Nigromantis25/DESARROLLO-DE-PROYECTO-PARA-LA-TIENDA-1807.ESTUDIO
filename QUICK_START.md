# ⚡ Guía Rápida - Iniciar Sistema

**Tiempo estimado**: 5 minutos  
**Dificultad**: Muy Fácil

---

## 🎯 Tu Sistema Está 100% Listo

Todo está creado y funcionando. Solo necesitas seguir estos pasos:

---

## 📋 PASO 1: Preparar Base de Datos (5 min)

### ✅ En Supabase

```
1. Ve a: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a SQL Editor → New Query
4. Copia y pega el contenido de cada archivo:
   
   a) database/schema.sql (ejecutar primero)
   b) database/new_tables.sql (para chatbot)
   c) database/admin_vault_tables.sql (para admin panel)

5. Ejecuta cada uno (⏯️ Play button)
```

**✓ Si ves "Query successful"** → Listo!

---

## 🖥️ PASO 2: Iniciar Servidor Frontal

### Opción A: Python (Recomendado - Más Fácil)

```bash
cd "C:\Users\ithan\OneDrive\Escritorio\DESARROLLO DE PROYECTO PARA LA TIENDA 1807.ESTUDIO"
python -m http.server 8000
```

Deberías ver:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### Opción B: Si No Tienes Python

En VS Code:
- Click derecho en carpeta del proyecto
- "Open in Integrated Terminal"
- Escribe: `npx http-server -p 8000`

---

## 🚀 PASO 3: Acceder en Navegador

```
http://localhost:8000/login.html
```

Deberías ver la pantalla de **Login**

---

## 📱 PASO 4: Probar en Móvil (Opcional)

```bash
1. Abre CMD y escribe: ipconfig
2. Busca "IPv4 Address" (algo como 192.168.1.x)
3. En tu móvil, ve a:
   http://[TU_IP]:8000/chatbot-inteligente.html
   
   Ejemplo: http://192.168.1.100:8000/chatbot-inteligente.html
```

---

## 💬 PASO 5: Probar Chatbot

```
1. Haz clic en "Chatbot" (o abre chatbot-inteligente.html)
2. Escribe: "hola"
3. El chat debería responder y mostrar productos
4. Selecciona un producto
5. Sigue la conversación
```

**Si ves productos**: ✅ Perfectamente configurado!

---

## 🔐 PASO 6: Probar Admin Panel

```
1. Haz clic en "Admin" (o abre admin-vault.html)
2. Click en "+ Agregar"
3. Rellena:
   - Nombre: "Mi Contraseña WiFi"
   - Usuario: "admin"
   - Contraseña: "1234"
   - Categoría: "Personal"
4. Click "Guardar"
```

**Si ves la contraseña guardada**: ✅ Todo funciona!

---

## 🔧 PASO 7 (OPCIONAL): Activar WhatsApp

Para que WhatsApp funcione:

```bash
1. Ve a backend/
2. Abre .env.example y renómbralo a .env
3. Solicita credenciales Twilio (https://www.twilio.com)
4. Pega en .env:
   TWILIO_ACCOUNT_SID=xxx
   TWILIO_AUTH_TOKEN=xxx
   TWILIO_PHONE=+123456789
5. En terminal:
   cd backend
   npm install
   npm start
```

---

## 📲 URLs Principales

| Función | URL |
|---------|-----|
| 🔐 Login | http://localhost:8000/login.html |
| 💬 Chatbot | http://localhost:8000/chatbot-inteligente.html |
| 🔐 Admin Panel | http://localhost:8000/admin-vault.html |
| 💷 Tienda | http://localhost:8000/tienda.html |
| 🏠 Inicio | http://localhost:8000/index.html |

---

## ✅ Checklist Rápido

- [ ] SQL ejecutado en Supabase
- [ ] Servidor corriendo en puerto 8000
- [ ] Navegador abierto en login.html
- [ ] Chat cargando productos
- [ ] Admin panel guardando contraseñas
- [ ] En móvil se ve responsivo

---

## 🆘 ¿Algo No Funciona?

### Error: "Cannot find module 'supabase'"

```bash
# En la carpeta del proyecto:
npm install @supabase/supabase-js
```

### Error: "Database connection failed"

```
1. Verifica las claves en supabase.js
2. Abre DevTools (F12) → Console
3. Busca el error rojo
4. Verifica que Supabase proyecto esté activo
```

### Chat vacío / Sin productos

```
1. Verifica que new_tables.sql fue ejecutado
2. Verifica que hay productos en BD:
   - Supabase → Editor → Tabla producto
3. Recarga la página (Ctrl+Shift+R)
```

### "Contraseña no se guarda"

```
1. Verifica que admin_vault_tables.sql fue ejecutado
2. Abre DevTools (F12) → Console
3. ¿Hay errores rojos?
4. Verifica que estés logueado
```

---

## 📞 Información Importante

**Tienda**: 1807.studio  
**Ubicación**: La Paz, Bolivia  
**WhatsApp Destino**: +59178810097  
**Productos**: Bolsos (Handbags)

---

## 🎉 ¡Listo!

Tu sistema está completamente operacional. Haz las pruebas básicas y todo debería funcionar perfectamente.

**¿Preguntas?** Revisa los archivos de documentación:
- `CHATBOT_GUIA.md` - Detalles del chat
- `ADMIN_VAULT_GUIA.md` - Detalles del admin
- `RESUMEN_IMPLEMENTACION.md` - Documentación completa

---

*Sistema actualizado: 2024 | Versión 3.0 | ✅ Completamente Funcional*
