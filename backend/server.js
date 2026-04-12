/**
 * Backend 1807.studio - Pedidos y generación de QR
 * Node.js server para crear pedidos, reservas y devolver información de pago
 */

const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🚀 Iniciando servidor 1807.studio...');
console.log('📡 Puerto:', PORT);
console.log('🗄️ Supabase URL:', SUPABASE_URL ? 'Configurado' : 'No configurado');
console.log('🔑 Supabase Key:', SUPABASE_KEY ? 'Presente' : 'Faltante');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// MODELOS DE DATOS
// ============================================

// Almacenar conversaciones en memoria (en prod usar Redis o BD)
const conversations = new Map();

// ============================================
// RUTAS DE SALUD
// ============================================

app.get('/health', (req, res) => {
    res.json({ status: 'Server running', timestamp: new Date() });
});

// ============================================
// RUTAS DE PAGOS Y QR
// ============================================

/**
 * Generar código QR para pago
 * POST /api/generate-qr
 */
app.post('/api/generate-qr', async (req, res) => {
    try {
        const { monto, referencia, cliente_id } = req.body;

        if (!monto || !referencia) {
            return res.status(400).json({ error: 'Monto y referencia son requeridos' });
        }

        // Crear datos para QR (puede ser URL de pago, número de transferencia, etc.)
        const qrData = {
            monto,
            referencia,
            tienda: '1807.studio',
            cliente_id,
            timestamp: new Date().toISOString()
        };

        // Generar QR
        const qrString = JSON.stringify(qrData);
        const qrImage = await QRCode.toDataURL(qrString);

        return res.json({
            success: true,
            qr_code: qrImage,
            data: qrData
        });
    } catch (error) {
        console.error('Error generando QR:', error);
        return res.status(500).json({ error: 'Error al generar QR' });
    }
});

// ============================================
// RUTAS DE PEDIDOS Y RESERVAS
// ============================================

/**
 * Crear pedido/reserva
 * POST /api/orders
 */
app.post('/api/orders', async (req, res) => {
    try {
        const {
            cliente_nombre,
            cliente_whatsapp,
            cliente_email,
            producto_nombre,
            producto_id,
            precio,
            cantidad,
            tipo, // 'compra' o 'reserva'
            lugar_entrega, // 'tienda' o 'delivery'
            reserva_adelanto = 0.5 // 50% por defecto
        } = req.body;

        // Validar datos
        if (!cliente_nombre || !cliente_whatsapp || !producto_nombre || !precio) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        // Calcular monto total
        const monto_total = precio * cantidad;
        const monto_adelanto = tipo === 'reserva' ? monto_total * reserva_adelanto : monto_total;

        // Generar número de referencia único
        const referencia = `${tipo.toUpperCase()}-${Date.now()}`;

        // Guardar en Supabase
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedido_tienda')
            .insert([{
                cliente_nombre,
                cliente_whatsapp,
                cliente_email,
                producto_nombre,
                producto_id,
                precio,
                cantidad,
                monto_total,
                monto_adelanto,
                tipo,
                lugar_entrega,
                estado: tipo === 'reserva' ? 'reservado' : 'pendiente_pago',
                referencia,
                fecha_creacion: new Date().toISOString()
            }])
            .select();

        if (pedidoError) throw pedidoError;

        // Generar QR para pago
        const qrData = {
            monto: monto_adelanto,
            referencia,
            tienda: '1807.studio',
            tipo
        };
        const qrString = JSON.stringify(qrData);
        const qrImage = await QRCode.toDataURL(qrString);

        return res.json({
            success: true,
            pedido_id: pedido[0].id,
            referencia,
            monto_adelanto,
            qr_code: qrImage,
            mensaje: `${tipo === 'reserva' ? 'Reserva' : 'Compra'} creada exitosamente. Monto a pagar: $${monto_adelanto.toFixed(2)}`
        });

    } catch (error) {
        console.error('Error creando pedido:', error);
        return res.status(500).json({ error: 'Error al crear pedido' });
    }
});

/**
 * Obtener estado de pedido
 * GET /api/orders/:referencia
 */
app.get('/api/orders/:referencia', async (req, res) => {
    try {
        const { referencia } = req.params;

        const { data, error } = await supabase
            .from('pedido_tienda')
            .select('*')
            .eq('referencia', referencia)
            .single();

        if (error) throw error;

        return res.json({
            success: true,
            pedido: data
        });
    } catch (error) {
        console.error('Error obteniendo pedido:', error);
        return res.status(404).json({ error: 'Pedido no encontrado' });
    }
});

/**
 * Confirmar pago de pedido
 * POST /api/orders/:referencia/confirm-payment
 */
app.post('/api/orders/:referencia/confirm-payment', async (req, res) => {
    try {
        const { referencia } = req.params;
        const { metodo_pago = 'QR' } = req.body;

        // Obtener pedido
        const { data: pedido, error: fetchError } = await supabase
            .from('pedido_tienda')
            .select('*')
            .eq('referencia', referencia)
            .single();

        if (fetchError) throw fetchError;

        // Actualizar estado
        const { data: updated, error: updateError } = await supabase
            .from('pedido_tienda')
            .update({
                estado: pedido.tipo === 'reserva' ? 'reservado_pagado' : 'pagado',
                metodo_pago,
                fecha_pago: new Date().toISOString()
            })
            .eq('referencia', referencia)
            .select();

        if (updateError) throw updateError;

        return res.json({
            success: true,
            mensaje: 'Pago confirmado exitosamente'
        });

    } catch (error) {
        console.error('Error confirmando pago:', error);
        return res.status(500).json({ error: 'Error al confirmar pago' });
    }
});

// ============================================
// NOTIFICACIONES DESHABILITADAS
// ============================================

// Este backend solo crea pedidos, genera QR y devuelve la referencia.

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
    console.log(`🚀 Servidor 1807.studio corriendo en puerto ${PORT}`);
});
