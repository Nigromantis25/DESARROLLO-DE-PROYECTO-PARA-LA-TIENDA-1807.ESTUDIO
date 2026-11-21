/**
 * CHATBOT INTELIGENTE MEJORADO - 1807.studio
 * Versión 2.0 con Compra/Reserva, Pagos QR y descarga de factura
 */

import { getProducts, getProductById, getCategories } from './supabase.js';
import { 
    Pedido, 
    crearPedido, 
    obtenerEstadoPedido, 
    confirmarPago, 
    generarQR, 
    validarDatos,
    validarTelefono,
    formatearPrecio,
    formatearFecha
} from './ordenes-utils.js';

// ============================================
// CONFIGURACIÓN DEL CHATBOT V2
// ============================================

let chatbotOpen = false;
let userType = 'guest';
let currentUser = null;

let conversationState = {
    estado: 'inicio', // inicio, esperando_nombre, esperando_tel, esperando_email, esperando_tipo, esperando_cantidad, seleccionando_producto, confirmacion_pago, completado
    pedido: new Pedido(),
    productoSeleccionado: null,
    listaProductos: [],
    indiceProducto: null
};

// ============================================
// INICIALIZAR CHATBOT
// ============================================

export function initChatbotV2() {
    detectarUsuario();
    cargarProductos();
    console.log('✅ Chatbot V2 Inicializado');
}

function detectarUsuario() {
    const userData = JSON.parse(localStorage.getItem('1807_currentUser'));
    const url = window.location.pathname;

    if (url.includes('tienda.html') && userData) {
        userType = 'client';
        currentUser = userData;
    } else if (userData && userData.role === 'admin') {
        userType = 'admin';
        currentUser = userData;
    } else {
        userType = 'guest';
    }

    console.log(`👤 Usuario: ${userType}`);
}

async function cargarProductos() {
    try {
        const res = await getProducts();
        if (res.success) {
            conversationState.listaProductos = res.data;
            console.log(`📦 ${res.data.length} productos cargados`);
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

// ============================================
// PROCESADOR PRINCIPAL DEL CHATBOT
// ============================================

export async function procesarMensajeChatbot(mensaje) {
    const msg = mensaje.toLowerCase().trim();

    // Comandos principales
    if (msg.includes('hola') || msg.includes('hola') || msg === '/start') {
        return saludoInicial();
    }

    if (msg.includes('ver productos')) {
        return await procesarCompraReserva('quiero comprar');
    }

    if (msg.includes('quiero comprar') || msg.includes('quiero reservar')) {
        return await procesarCompraReserva(msg);
    }

    if (msg === '/ayuda' || msg === 'ayuda') {
        return mostrarAyuda();
    }

    if (conversationState.estado === 'inicio' && /^\d+$/.test(msg) && conversationState.listaProductos.length) {
        conversationState.estado = 'seleccionando_producto';
    }

    // Según el estado actual de la conversación
    switch (conversationState.estado) {
        case 'esperando_nombre':
            return procesarNombre(msg);
        case 'esperando_tel':
            return procesarTelefono(msg);
        case 'esperando_email':
            return procesarEmail(msg);
        case 'esperando_tipo':
            return procesarTipo(msg);
        case 'esperando_cantidad':
            return procesarCantidad(msg);
        case 'seleccionando_producto':
            return procesarSeleccionProducto(msg);
        case 'confirmacion_pago':
            return procesarConfirmacionPago(msg);
        default:
            return "¿En qué puedo ayudarte? Escribe 'ayuda' para ver opciones.";
    }
}

// ============================================
// SALUDO INICIAL
// ============================================

function saludoInicial() {
    let saludo = '👋 ¡Hola! Bienvenido a 1807.studio\n\n';
    
    if (userType === 'guest') {
        saludo += '🛍️ Soy tu asistente de compras inteligente.\n\n';
        saludo += 'Selecciona un producto con su número o toca la tarjeta en el chat.\n';
        saludo += 'Te pediré la cantidad y tus datos antes de confirmar.\n\n';
        saludo += '💡 Compra fácil con pago QR y factura descargable';
    } else if (userType === 'client') {
        saludo += `¡Hola ${currentUser.name}! 👋\n\n`;
        saludo += '¿Qué deseas hoy?\n';
        saludo += '🛒 "ver productos" - Catálogo completo\n';
        saludo += '🛍️ "quiero comprar algo" - Compra rápida\n';
        saludo += '📅 "quiero reservar algo" - Reservar productos\n';
        saludo += '🛒 "carrito" - Ver mi carrito\n';
    }

    return saludo;
}

// ============================================
// PROCESO DE COMPRA/RESERVA
// ============================================

async function procesarCompraReserva(msg) {
    const esReserva = msg.includes('reservar');
    
    // Mostrar productos disponibles
    conversationState.estado = 'seleccionando_producto';
    let respuesta = esReserva 
        ? '📅 *RESERVA DE PRODUCTOS*\n\n'
        : '🛒 *COMPRA RÁPIDA*\n\n';

    respuesta += 'Aquí están nuestros productos disponibles:\n\n';

    // Mostrar productos con número y detalles
    let index = 1;
    conversationState.listaProductos.forEach((producto, i) => {
        if (producto.stock > 0) {
            const imagen = producto.imagen_url ? '📷' : '📦';
            respuesta += `${index}. ${imagen} *${producto.nombre}*\n`;
            respuesta += `   💰 ${formatearPrecio(producto.precio)}\n`;
            respuesta += `   📊 Stock: ${producto.stock} disponibles\n`;
            if (producto.descripcion) {
                respuesta += `   📝 ${producto.descripcion}\n`;
            }
            respuesta += '\n';
            index++;
        }
    });

    respuesta += `\n📌 Escribe el *número* del producto que deseas ${esReserva ? 'reservar' : 'comprar'}`;
    
    conversationState.pedido.tipo = esReserva ? 'reserva' : 'compra';
    return respuesta;
}

function procesarSeleccionProducto(msg) {
    const numero = parseInt(msg.trim());
    const productos = conversationState.listaProductos.filter(p => p.stock > 0);

    if (isNaN(numero) || numero < 1 || numero > productos.length) {
        return `❌ Número inválido. Por favor, escribe un número entre 1 y ${productos.length}`;
    }

    const producto = productos[numero - 1];
    conversationState.productoSeleccionado = producto;
    conversationState.indiceProducto = numero;

    conversationState.estado = 'esperando_cantidad';
    
    let respuesta = `✅ Seleccionaste: *${producto.nombre}*\n\n`;
    respuesta += `💰 Precio: ${formatearPrecio(producto.precio)}\n`;
    respuesta += `📝 ${producto.descripcion || 'Sin descripción'}\n\n`;
    respuesta += '¿Cuántos deseas? (escribe un número)';

    return respuesta;
}

function procesarCantidad(msg) {
    const cantidad = parseInt(msg.trim());

    if (isNaN(cantidad) || cantidad < 1 || cantidad > conversationState.productoSeleccionado.stock) {
        return `❌ Cantidad inválida. Disponibles: ${conversationState.productoSeleccionado.stock}`;
    }

    conversationState.pedido.cantidad = cantidad;
    conversationState.pedido.producto_nombre = conversationState.productoSeleccionado.nombre;
    conversationState.pedido.producto_id = conversationState.productoSeleccionado.idproducto;
    conversationState.pedido.precio = conversationState.productoSeleccionado.precio;

    conversationState.estado = 'esperando_nombre';

    let respuesta = `✅ Cantidad: ${cantidad}\n\n`;
    respuesta += `💰 Monto ${conversationState.pedido.tipo === 'reserva' ? 'con 50% adelantado' : 'total'}: ${formatearPrecio(conversationState.pedido.monto_adelanto)}\n\n`;
    respuesta += '📝 Ahora necesito tus datos:\n';
    respuesta += '¿Cuál es tu nombre completo?';

    return respuesta;
}

function procesarNombre(msg) {
    const nombre = msg.trim();

    if (nombre.length < 3) {
        return '❌ El nombre debe tener al menos 3 caracteres.';
    }

    conversationState.pedido.cliente_nombre = nombre;
    conversationState.estado = 'esperando_tel';

    return `✅ Nombre: ${nombre}\n\n📱 ¿Cuál es tu teléfono de contacto? (ej: 78810097)`;
}

function procesarTelefono(msg) {
    const resultado = validarTelefono(msg);

    if (!resultado.valido) {
        return `❌ ${resultado.error}\n\n📱 Por favor, ingresa un número de teléfono válido`;
    }

    conversationState.pedido.cliente_whatsapp = resultado.numero;
    conversationState.estado = 'esperando_email';

    return `✅ Teléfono: +591${resultado.numero}\n\n📧 ¿Cuál es tu email? (opcional, presiona "skip" para omitir)`;
}

function procesarEmail(msg) {
    let email = msg.trim();

    if (email.toLowerCase() !== 'skip') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return '❌ Email inválido. Intenta de nuevo o escribe "skip".';
        }
        conversationState.pedido.cliente_email = email;
    }

    conversationState.estado = 'esperando_tipo';

    let respuesta = email && email.toLowerCase() !== 'skip' 
        ? `✅ Email: ${email}\n\n` 
        : `✅ (Sin email)\n\n`;

    respuesta += `🏪 ¿Dónde prefieres recibir?\n`;
    respuesta += '1️⃣ Tienda 1807.studio (La Paz)\n';
    respuesta += '2️⃣ Delivery (según tu ubicación)\n\n';
    respuesta += 'Escribe 1 o 2';

    return respuesta;
}

function procesarTipo(msg) {
    const opcion = msg.trim();

    if (opcion === '1') {
        conversationState.pedido.lugar_entrega = 'tienda';
    } else if (opcion === '2') {
        conversationState.pedido.lugar_entrega = 'delivery';
    } else {
        return '❌ Opción inválida. Escribe 1 o 2.';
    }

    conversationState.estado = 'confirmacion_pago';
    return mostrarConfirmacion();
}

function mostrarConfirmacion() {
    const pedido = conversationState.pedido;
    const tipoEntrega = pedido.lugar_entrega === 'tienda' 
        ? '🏪 Tienda 1807.studio' 
        : '🚚 Delivery';

    let respuesta = `📋 *RESUMEN DE TU ${pedido.tipo.toUpperCase()}*\n\n`;
    respuesta += `👤 Nombre: ${pedido.cliente_nombre}\n`;
    respuesta += `📱 Teléfono: +591${pedido.cliente_whatsapp}\n`;
    respuesta += `${pedido.cliente_email ? `📧 Email: ${pedido.cliente_email}\n` : ''}`;
    respuesta += `\n🛍️ Producto: ${pedido.producto_nombre}\n`;
    respuesta += `📦 Cantidad: ${pedido.cantidad}\n`;
    respuesta += `💰 Precio unitario: ${formatearPrecio(pedido.precio)}\n`;
    respuesta += `💰 Monto total: ${formatearPrecio(pedido.monto_total)}\n`;

    if (pedido.es_reserva) {
        respuesta += `\n📅 RESERVA (50% adelantado)\n`;
        respuesta += `💵 Monto a pagar ahora: ${formatearPrecio(pedido.monto_adelanto)}\n`;
        respuesta += `⏰ Válida por 48 horas\n`;
        respuesta += `💰 Restante: ${formatearPrecio(pedido.monto_total - pedido.monto_adelanto)} (al retirar)\n`;
    }

    respuesta += `\n📍 Entrega: ${tipoEntrega}\n`;
    respuesta += `\n✅ ¿Confirmar compra?\n`;
    respuesta += 'Escribe "confirmar compra" para continuar o "cancelar" para empezar de nuevo';

    return respuesta;
}

async function procesarConfirmacionPago(msg) {
    if (msg.toLowerCase() === 'cancelar') {
        conversationState.estado = 'inicio';
        conversationState.pedido = new Pedido();
        return '❌ Compra cancelada.\n\nEscribe "quiero comprar algo" para intentar de nuevo.';
    }

    const confirmText = msg.toLowerCase();
    if (confirmText !== 'confirmar' && confirmText !== 'confirmar compra') {
        return 'Por favor, escribe "confirmar compra" o "cancelar"';
    }

    // Crear el pedido en el backend
    const resultado = await crearPedido(conversationState.pedido);

    if (!resultado.success) {
        return `❌ Error al procesar la compra: ${resultado.error}\n\n📞 Por favor, intenta nuevamente más tarde o contáctanos por teléfono.`;
    }

    conversationState.pedido.referencia = resultado.referencia;
    conversationState.pedido.qr_code = resultado.qr_code;
    localStorage.setItem('ultimo_pedido', JSON.stringify({
        ...conversationState.pedido,
        referencia: resultado.referencia,
        qr_code: resultado.qr_code,
        monto_adelanto: resultado.monto_adelanto
    }));

    conversationState.estado = 'completado';

    let respuesta = `✅ **¡${conversationState.pedido.tipo.toUpperCase()} CONFIRMADA!**\n\n`;
    respuesta += `📋 Referencia: ${resultado.referencia}\n`;
    respuesta += `💰 Monto a pagar: ${formatearPrecio(resultado.monto_adelanto)}\n\n`;
    respuesta += `**PRÓXIMOS PASOS:**\n\n`;
    respuesta += `1️⃣ Escanea el código QR inferior para el pago\n`;
    respuesta += `2️⃣ Realiza la transferencia o pago por QR\n`;
    respuesta += `3️⃣ Confirma el pago (nosotros lo verificaremos)\n\n`;
    respuesta += `� Guarda esta referencia y descarga tu factura en el botón del QR\n`;
    respuesta += `🏪 Luego coordinaremos la entrega\n\n`;
    respuesta += `¿Necesitas más ayuda? Escribe "contacto"`;

    // Aquí mostrarías el QR
    if (resultado.qr_code) {
        // Guardar la imagen del QR temporalmente
        localStorage.setItem('qr_code_actual', resultado.qr_code);
    }

    if (typeof window !== 'undefined' && typeof window.openWhatsAppAlert === 'function') {
        window.openWhatsAppAlert(conversationState.pedido);
        respuesta += `\n🔔 Enviamos una alerta a nuestro WhatsApp de atención para que te atiendan pronto.`;
    }

    return respuesta;
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function mostrarAyuda() {
    return `
🤖 *AYUDA - OPCIONES DISPONIBLES*

📦 *VER PRODUCTOS*
• Escribe: "ver productos"
• Muestra el catálogo completo

🛍️ *COMPRAR*
• Escribe: "quiero comprar algo"
• Compra rápida con pago por QR

📅 *RESERVAR*
• Escribe: "quiero reservar algo"
• Reserva con 50% adelantado
• Válida por 48 horas

❓ *MÁS AYUDA*
• Escribe: "ayuda"

👉 ¿En qué te puedo ayudar?
`;
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================

export { conversationState };
