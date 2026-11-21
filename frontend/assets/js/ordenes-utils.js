/**
 * Utilidades para Compras y Reservas
 * Conecta con el backend para procesar pagos y enviar notificaciones
 */

// URL del backend (ajusta según tu configuración)
const BACKEND_URL = localStorage.getItem('backend_url') || 'http://localhost:3001';

// ============================================
// TIPOS DE DATOS
// ============================================

export class Pedido {
    constructor(data = {}) {
        this.cliente_nombre = data.cliente_nombre || '';
        this.cliente_whatsapp = data.cliente_whatsapp || '';
        this.cliente_email = data.cliente_email || '';
        this.producto_nombre = data.producto_nombre || '';
        this.producto_id = data.producto_id || null;
        this.precio = data.precio || 0;
        this.cantidad = data.cantidad || 1;
        this.tipo = data.tipo || 'compra'; // 'compra' o 'reserva'
        this.lugar_entrega = data.lugar_entrega || 'tienda'; // 'tienda' o 'delivery'
        this.observaciones = data.observaciones || '';
    }

    get monto_total() {
        return this.precio * this.cantidad;
    }

    get monto_adelanto() {
        return this.tipo === 'reserva' ? this.monto_total * 0.5 : this.monto_total;
    }

    get es_reserva() {
        return this.tipo === 'reserva';
    }

    to_json() {
        return {
            cliente_nombre: this.cliente_nombre,
            cliente_whatsapp: this.cliente_whatsapp,
            cliente_email: this.cliente_email,
            producto_nombre: this.producto_nombre,
            producto_id: this.producto_id,
            precio: this.precio,
            cantidad: this.cantidad,
            tipo: this.tipo,
            lugar_entrega: this.lugar_entrega,
            observaciones: this.observaciones
        };
    }
}

// ============================================
// FUNCIONES DE COMPRA
// ============================================

/**
 * Crear un nuevo pedido/reserva
 */
export async function crearPedido(pedido) {
    try {
        if (!(pedido instanceof Pedido)) {
            throw new Error('Debes pasar una instancia de Pedido');
        }

        const response = await fetch(`${BACKEND_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido.to_json())
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creando pedido:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtener estado de un pedido
 */
export async function obtenerEstadoPedido(referencia) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/orders/${referencia}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo estado:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Confirmar pago de un pedido
 */
export async function confirmarPago(referencia, metodo_pago = 'QR') {
    try {
        const response = await fetch(`${BACKEND_URL}/api/orders/${referencia}/confirm-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ metodo_pago })
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error confirmando pago:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Generar código QR para pago
 */
export async function generarQR(monto, referencia, cliente_id = null) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/generate-qr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                monto,
                referencia,
                cliente_id
            })
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error generando QR:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// VALIDACIÓN
// ============================================

export function validarDatos(nombre, telefono, email) {
    const errors = [];

    if (!nombre || nombre.trim().length < 3) {
        errors.push('El nombre debe tener al menos 3 caracteres');
    }

    if (!telefono || telefono.trim().length < 7) {
        errors.push('El teléfono es requerido (mínimo 7 dígitos)');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email inválido');
    }

    return {
        valido: errors.length === 0,
        errores: errors
    };
}

export function validarTelefono(numero) {
    // Remover caracteres especiales y espacios
    const cleaned = numero.replace(/[^\d+]/g, '');
    
    // Validar que sea un número de al menos 7 dígitos
    if (cleaned.length < 7) {
        return { valido: false, error: 'Número de teléfono inválido' };
    }

    return { valido: true, numero: cleaned };
}

// ============================================
// FORMATEO
// ============================================

export function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB'
    }).format(precio);
}

export function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-BO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
