-- ============================================
-- ADMIN VAULT - TABLAS DE ALMACENAMIENTO SEGURO
-- ============================================

-- Tabla: Admin Vault (Almacena credenciales encriptadas)
CREATE TABLE IF NOT EXISTS admin_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) DEFAULT 'general',
    datos_encriptados TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla: Admin Settings (Configuración del admin)
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    clave VARCHAR(100) NOT NULL,
    valor TEXT NOT NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices
    CONSTRAINT fk_usuario_settings FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, clave)
);

-- Tabla: Audit Log (Registro de acceso a credenciales)
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    accion VARCHAR(50) NOT NULL, -- 'view', 'create', 'update', 'delete', 'copy'
    credencial_id UUID REFERENCES admin_vault(id) ON DELETE SET NULL,
    detalles TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    -- Índices
    CONSTRAINT fk_usuario_audit FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_admin_vault_usuario_id ON admin_vault(usuario_id);
CREATE INDEX IF NOT EXISTS idx_admin_vault_categoria ON admin_vault(categoria);
CREATE INDEX IF NOT EXISTS idx_admin_vault_fecha ON admin_vault(fecha_creacion DESC);

CREATE INDEX IF NOT EXISTS idx_admin_settings_usuario ON admin_settings(usuario_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_usuario ON admin_audit_log(usuario_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_accion ON admin_audit_log(accion);
CREATE INDEX IF NOT EXISTS idx_admin_audit_fecha ON admin_audit_log(fecha DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - SEGURIDAD
-- ============================================

-- Habilitar RLS
ALTER TABLE admin_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Políticas para admin_vault
-- Los usuarios solo pueden ver/editar sus propias credenciales
CREATE POLICY "Users can view own credentials" 
ON admin_vault FOR SELECT
USING (usuario_id = auth.uid());

CREATE POLICY "Users can create credentials" 
ON admin_vault FOR INSERT
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Users can update own credentials" 
ON admin_vault FOR UPDATE
USING (usuario_id = auth.uid())
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Users can delete own credentials" 
ON admin_vault FOR DELETE
USING (usuario_id = auth.uid());

-- Políticas para admin_settings
CREATE POLICY "Users can view own settings" 
ON admin_settings FOR SELECT
USING (usuario_id = auth.uid());

CREATE POLICY "Users can manage own settings" 
ON admin_settings FOR INSERT
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Users can update own settings" 
ON admin_settings FOR UPDATE
USING (usuario_id = auth.uid())
WITH CHECK (usuario_id = auth.uid());

-- Políticas para admin_audit_log
CREATE POLICY "Users can view own audit logs" 
ON admin_audit_log FOR SELECT
USING (usuario_id = auth.uid());

CREATE POLICY "System can log actions" 
ON admin_audit_log FOR INSERT
WITH CHECK (usuario_id = auth.uid());

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para admin_vault
DROP TRIGGER IF EXISTS update_admin_vault_timestamp ON admin_vault;
CREATE TRIGGER update_admin_vault_timestamp
BEFORE UPDATE ON admin_vault
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger para admin_settings
DROP TRIGGER IF EXISTS update_admin_settings_timestamp ON admin_settings;
CREATE TRIGGER update_admin_settings_timestamp
BEFORE UPDATE ON admin_settings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Credenciales por categoría
CREATE OR REPLACE VIEW vw_credentials_by_category AS
SELECT 
    usuario_id,
    categoria,
    COUNT(*) as total
FROM admin_vault
GROUP BY usuario_id, categoria;

-- Vista: Resumen de actividad
CREATE OR REPLACE VIEW vw_audit_summary AS
SELECT 
    usuario_id,
    accion,
    COUNT(*) as total,
    MAX(fecha) as ultima_actividad
FROM admin_audit_log
GROUP BY usuario_id, accion;

-- ============================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ============================================

-- Descomentar si necesitas datos de prueba
/*
INSERT INTO admin_vault (usuario_id, nombre, categoria, datos_encriptados)
VALUES (
    (SELECT id FROM auth.users LIMIT 1),
    'Gmail - 1807.studio',
    'emails',
    'eyJ1c2VybmFtZSI6ImNvbnRhY3RvQDE4MDcuc3R1ZGlvIiwicGFzc3dvcmQiOiJ0ZXN0MjAyNiJ9'
);
*/

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE admin_vault IS '
Almacena credenciales encriptadas del admin.
- datos_encriptados: JSON encriptado en base64
- Acceso restringido por RLS (Row Level Security)
';

COMMENT ON TABLE admin_settings IS '
Configuración personalizada del admin
- Nombre del negocio, teléfono, email, ubicación, etc
- Un registro por usuario por clave
';

COMMENT ON TABLE admin_audit_log IS '
Registro de acceso y cambios en credenciales
- Para auditoria y seguridad
- Quien accedió, cuándo, qué hizo
';
