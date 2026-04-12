-- ============================================
-- NUEVAS TABLAS PARA SISTEMA DE COMPRA/RESERVA
-- 1807.studio
-- ============================================

-- Tabla de Pedidos y Reservas
CREATE TABLE IF NOT EXISTS pedido_tienda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_whatsapp VARCHAR(20) NOT NULL,
    cliente_email VARCHAR(255),
    producto_nombre VARCHAR(255) NOT NULL,
    producto_id INT,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT DEFAULT 1,
    monto_total DECIMAL(10, 2) NOT NULL,
    monto_adelanto DECIMAL(10, 2),
    tipo VARCHAR(20) NOT NULL, -- 'compra' o 'reserva'
    lugar_entrega VARCHAR(50) DEFAULT 'tienda', -- 'tienda' o 'delivery'
    estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'pagado', 'enviado', 'entregado', 'cancelado', 'reservado', 'reservado_pagado'
    metodo_pago VARCHAR(50) DEFAULT 'QR', -- 'QR', 'transferencia', 'efectivo'
    referencia VARCHAR(100) UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_pago TIMESTAMP,
    fecha_entrega TIMESTAMP,
    observaciones TEXT,
    
    -- Foreign key a tabla de clientes si existe
    -- cliente_id INT REFERENCES cliente(idcliente) ON DELETE SET NULL,
    
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pagos (Para rastrear pagos)
CREATE TABLE IF NOT EXISTS pago_tienda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedido_tienda(id) ON DELETE CASCADE,
    monto DECIMAL(10, 2) NOT NULL,
    porcentaje DECIMAL(5, 2) DEFAULT 100, -- Porcentaje del monto (ej: 50% para adelanto)
    metodo_pago VARCHAR(50) DEFAULT 'QR',
    estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'confirmado', 'rechazado'
    referencia_pago VARCHAR(100) UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_confirmacion TIMESTAMP,
    
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reservas (Más detallada)
CREATE TABLE IF NOT EXISTS reserva_tienda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedido_tienda(id) ON DELETE CASCADE,
    cliente_nombre VARCHAR(255) NOT NULL,
    producto_nombre VARCHAR(255) NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP, -- La reserva expira en 48 horas o cuando se defina
    adelanto_pagado BOOLEAN DEFAULT FALSE,
    estado VARCHAR(50) DEFAULT 'activa', -- 'activa', 'pagada', 'cancelada', 'completada'
    notas TEXT,
    
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de QR Codes Generados
CREATE TABLE IF NOT EXISTS qr_code_tienda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID REFERENCES pedido_tienda(id) ON DELETE SET NULL,
    monto DECIMAL(10, 2) NOT NULL,
    referencia VARCHAR(100) UNIQUE,
    qr_data JSON, -- Datos del QR en formato JSON
    qr_image_url TEXT, -- URL donde se almacena la imagen del QR
    estado VARCHAR(50) DEFAULT 'activo', -- 'activo', 'cancelado', 'expirado'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Notificaciones WhatsApp
CREATE TABLE IF NOT EXISTS notificacion_whatsapp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destinatario VARCHAR(20) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'notificacion', -- 'notificacion', 'confirmacion', 'alerta'
    pedido_id UUID REFERENCES pedido_tienda(id) ON DELETE SET NULL,
    estado VARCHAR(50) DEFAULT 'enviada', -- 'enviada', 'fallida', 'leida'
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    respuesta_cliente VARCHAR(500),
    
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear indices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_pedido_referencia ON pedido_tienda(referencia);
CREATE INDEX IF NOT EXISTS idx_pedido_cliente_whatsapp ON pedido_tienda(cliente_whatsapp);
CREATE INDEX IF NOT EXISTS idx_pedido_estado ON pedido_tienda(estado);
CREATE INDEX IF NOT EXISTS idx_pedido_tipo ON pedido_tienda(tipo);
CREATE INDEX IF NOT EXISTS idx_pago_pedido_id ON pago_tienda(pedido_id);
CREATE INDEX IF NOT EXISTS idx_reserva_pedido_id ON reserva_tienda(pedido_id);
CREATE INDEX IF NOT EXISTS idx_qr_referencia ON qr_code_tienda(referencia);
CREATE INDEX IF NOT EXISTS idx_notificacion_destinatario ON notificacion_whatsapp(destinatario);

-- ============================================
-- INSERTAR DATOS DE PRUEBA
-- ============================================

-- Estos son datos de ejemplo, elimina si no los necesitas
INSERT INTO pedido_tienda (cliente_nombre, cliente_whatsapp, cliente_email, producto_nombre, precio, cantidad, monto_total, monto_adelanto, tipo, lugar_entrega, estado, referencia)
VALUES 
('Juan Pérez', '59178810097', 'juan@email.com', 'Bolso Cuero Negro', 450.00, 1, 450.00, 225.00, 'reserva', 'tienda', 'reservado', 'RESERVA-' || extract(epoch from now())::text);
