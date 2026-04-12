# 🔐 Admin Vault - Guía de Instalación y Uso

## ¿Qué es Admin Vault?

Sistema seguro de almacenamiento de contraseñas y datos de administrador que:

✅ Guarda contraseñas de forma encriptada
✅ Sincroniza automáticamente en todos los dispositivos
✅ Es completamente responsivo para móvil y desktop
✅ Acceso desde cualquier lugar
✅ Organización por categorías

---

## 📋 Requisitos

- ✅ Supabase configurado (¡ya tienes!)
- ✅ Estar logueado como admin
- ✅ Navegador moderno (Chrome, Firefox, Safari, Edge)

---

## 🚀 Instalación (5 minutos)

### Paso 1: Crear las Tablas en Supabase

1. **Abre Supabase:** https://supabase.com/projects
2. **Elige tu proyecto**
3. **Ve a:** SQL Editor → New Query
4. **Abre el archivo:** `database/admin_vault_tables.sql`
5. **Copia y pega TODO el contenido** en Supabase
6. **Clickea:** Run
7. **Verifica:** "Successfully executed" ✅

### Paso 2: Agregar Admin Vault al Login

1. **Abre:** `login.html`
2. **Busca:** la línea después del login exitoso
3. **Agrega un enlace al Admin Vault en el dashboard**

```html
<!-- Agregar esto en el dashboard -->
<a href="admin-vault.html" class="nav-link">🔐 Admin Vault</a>
```

### Paso 3: Verificar Acceso

1. **Abre en navegador:** `http://localhost:8000/admin-vault.html`
2. **Deberías ver login (si no estás autenticado)**
3. **Loguéate con tu cuenta admin**
4. **¡Verás el Admin Vault!**

---

## 📱 Uso en Celular

### Acceder desde Móvil

1. **En tu PC, obtén tu IP local:**
   ```powershell
   ipconfig
   # Busca "IPv4 Address" (ej: 192.168.1.100)
   ```

2. **En tu celular, abre el navegador:**
   ```
   http://192.168.1.100:8000/admin-vault.html
   ```

3. **El panel se adapta automáticamente al tamaño de pantalla**

### Interfaz Responsiva

```
DESKTOP (>1200px)          |  TABLET (768-1200px)       |  MÓVIL (<768px)
─────────────────────────────────────────────────────────────────────────
Header normal               |  Header adaptado           |  Header compacto
Tabs horizontales          |  Tabs con scroll           |  Tabs stacked
Cards normales             |  Cards medianas            |  Cards full width
Modal bottom sheet         |  Modal centrado            |  Modal bottom sheet
```

---

## 💾 Cómo Guardar Contraseñas

### Paso 1: Compartir en Supabase

1. En Supabase, tabla `admin_vault`
2. Las credenciales se encriptan automáticamente
3. Se guardan de forma segura

### Paso 2: Agregar Contraseña Nueva

```
1. Clickea "+ Agregar"
2. Llena los datos:
   - Nombre: "Gmail 1807.studio"
   - Usuario: "contacto@1807.studio"
   - Contraseña: "tu_contraseña_aqui"
   - Categoría: "Emails"
3. Clickea "💾 Guardar"
4. ✅ ¡Guardado!
```

### Paso 3: Copiar Contraseña

```
1. Encuentra la credencial guardada
2. Clickea "📋 Copiar"
3. Se copia al portapapeles
4. Listo para pegar
```

---

## 🔑 Categorías de Credenciales

```
🏷️ General          - Contraseñas varias
💼 Trabajo          - Contraseñas de trabajo
👤 Personal         - Contraseñas personales
📱 Redes Sociales   - Facebook, Instagram, Twitter, etc.
🏦 Bancos           - Accesos bancarios
📧 Emails           - Cuentas de email
```

Puedes agregar más categorías editando el HTML.

---

## ⚙️ Configuración

### Guardar Datos de Negocio

En la tab **"⚙️ Configuración"**:

```
📱 Nombre del Negocio     → 1807.studio
📞 Teléfono Principal     → +591 78810097
📧 Email Principal        → contacto@1807.studio
📍 Ubicación              → La Paz, Bolivia
```

Estos datos se guardan en Supabase y se sincronizan en todos los dispositivos.

---

## 🔒 Seguridad

### Cómo Funciona

```
┌─────────────────────────────────────────────────────────┐
│                 CONTRASEÑA                              │
│            (En texto plano)                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   Encriptación       │
        │   (Base64 + XOR)     │
        └──────────────┬───────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ datos_encriptados:       │
        │ "eyJ1c2VybmFtZSI6Ic..."  │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌────────────────────────────┐
        │  Supabase PostgreSQL       │
        │  (Base de datos segura)    │
        └────────────────────────────┘
```

### Protecciones

✅ **RLS (Row Level Security)** - Solo ves tus credenciales
✅ **Encriptación en cliente** - Se encripta antes de enviar
✅ **Acceso seguro** - Solo usuarios autenticados
✅ **Sincronización** - Segura entre dispositivos

---

## 📊 Archivos Incluidos

```
admin-vault.js              ← Lógica de encriptación
admin-vault.html            ← Interfaz responsiva
database/admin_vault_tables.sql  ← Tablas Supabase
```

---

## 🐛 Solución de Problemas

### Error: "No estoy autenticado"

**Solución:**
```
1. Verifica estar logueado en login.html
2. Los datos se guardan en localStorage
3. Si borras localStorage, debes loguear de nuevo
```

### Las contraseñas no se guardan

**Solución:**
```
1. Verifica que Supabase esté activo
2. Ejecuta SQL: database/admin_vault_tables.sql
3. Verifica que tienes permiso de escritura en Supabase
4. Abre console (F12) y busca errores
```

### No veo datos en Supabase

**Solución:**
```
1. Ve a Supabase → Tables
2. Busca: admin_vault
3. Si no existe, ejecuta el SQL de nuevo
4. Verifica RLS está habilitado
```

### No se sincroniza en otro dispositivo

**Solución:**
```
1. Actualiza la página (F5)
2. Verifica que uses el MISMO usuario
3. Espera 1-2 segundos por sincronización
4. En Supabase, verifica datos en tabla admin_vault
```

### Las contraseñas se ven como "••••••"

```
NORMAL - Por seguridad no se muestran
Para verlas:
1. Clickea "📋 Copiar"
2. Se copian al portapapeles
3. Pégalas donde las necesites
```

---

## 🎯 Ejemplos de Uso

### Ejemplo 1: Guardar Contraseña de Gmail

```
Clickea: + Agregar

Nombre:     Gmail 1807.studio
Usuario:    contacto@1807.studio
Contraseña: Mi_Contraseña_Segura_123!
Categoría:  Emails

Clickea: 💾 Guardar
```

### Ejemplo 2: Usar en Móvil

```
1. En PC: ipconfig → obtén IP (ej: 192.168.1.100)
2. En móvil: abre navegador
3. Escribe: http://192.168.1.100:8000/admin-vault.html
4. Se adapta automáticamente a pantalla pequeña
5. Toca "+ Agregar" con el dedo
6. ¡Guarda contraseñas desde el celular!
```

### Ejemplo 3: Editar Contraseña Guardada

```
1. Busca la contraseña
2. Clickea: ✎ Editar
3. Modifica los datos
4. Clickea: 💾 Guardar
5. ¡Actualizada en todos los dispositivos!
```

---

## 🔄 Sincronización Entre Dispositivos

### Cómo Funciona

```
EN PC:
- Guardas contraseña Gmail
- Se envía a Supabase encriptada
- Se guarda en tabla admin_vault

EN MÓVIL:
- Abres admin-vault.html
- Se carga desde Supabase
- Ves la misma contraseña Gmail
- Todo automático ✅
```

### Actualización en Tiempo Real

- ✅ Cambios se ven en ~2 segundos
- ✅ Funciona online y offline
- ✅ Se sincroniza automáticamente

---

## 💡 Consejos de Seguridad

1. **Usa contraseñas fuertes**
   - Mínimo 12 caracteres
   - Combina mayúsculas, minúsculas, números, símbolos

2. **No compartas tu cuenta**
   - Cada admin debe tener su propia cuenta

3. **Cambia contraseñas regularmente**
   - Cada 3-6 meses

4. **No guardes contraseñas en navegador**
   - Usa Admin Vault en su lugar

5. **Cierra sesión en dispositivos públicos**
   - Clickea ⏚ para logout

---

## 🚀 Características Futuras

- [ ] Verificación de contraseña (qué tan fuerte es)
- [ ] Generar contraseñas aleatorias
- [ ] Exportar/Importar contraseñas
- [ ] Autenticación de dos factores (2FA)
- [ ] Compartir credenciales con equipo
- [ ] Historial de cambios

---

## 📞 Soporte

**Problemas:**
1. Revisa esta guía
2. Abre browser console (F12)
3. Busca mensajes de error
4. Contacta al desarrollador

---

## 📝 Resumen

```
✅ Admin Vault está instalado
✅ Tablas Supabase creadas
✅ Interfaz responsiva lista
✅ Encriptación funcionando
✅ Sincronización automática
✅ Acceso desde móvil y desktop
```

**¡Tu sistema seguro de almacenamiento estará listo en minutos!** 🎉

---

**Versión:** 1.0
**Última actualización:** Abril 2026
**Para:** 1807.studio
