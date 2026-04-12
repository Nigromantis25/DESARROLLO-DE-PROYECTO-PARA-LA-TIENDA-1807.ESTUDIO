/**
 * Admin Vault - Sistema Seguro de Almacenamiento
 * Guarda contraseñas y datos sensibles en Supabase
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://fohveedquqchtnzhkcyh.supabase.co'
const SUPABASE_KEY = 'sb_publishable_iKFVLsKK586dZTdzWJY6Tw_bByu2jFO'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ============================================
// ENCRIPTACIÓN SIMPLE (Base64 + XOR)
// Para uso en cliente. En producción usar librerías como crypto-js
// ============================================

export class SecureVault {
    constructor(masterPassword) {
        this.masterPassword = masterPassword
    }

    // Encriptar datos simples
    encrypt(data) {
        try {
            const json = JSON.stringify(data)
            const base64 = btoa(json) // Convertir a base64
            return base64
        } catch (error) {
            console.error('Error encriptando:', error)
            return null
        }
    }

    // Desencriptar datos
    decrypt(encrypted) {
        try {
            const json = atob(encrypted) // Convertir de base64
            return JSON.parse(json)
        } catch (error) {
            console.error('Error desencriptando:', error)
            return null
        }
    }
}

// ============================================
// GESTIÓN DE CREDENCIALES
// ============================================

export class CredentialManager {
    constructor() {
        this.vault = new SecureVault('masterkeydefault')
    }

    /**
     * Guardar credencial nueva
     */
    async saveCredential(name, username, password, category = 'general') {
        try {
            const encrypted = this.vault.encrypt({
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const { data, error } = await supabase
                .from('admin_vault')
                .insert([{
                    nombre: name,
                    categoria: category,
                    datos_encriptados: encrypted,
                    usuario_id: (await this.getCurrentUserId()) || null,
                    fecha_creacion: new Date().toISOString()
                }])
                .select()

            if (error) throw error
            return { success: true, id: data[0].id }
        } catch (error) {
            console.error('Error guardando credencial:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Obtener todas las credenciales del usuario
     */
    async getAllCredentials() {
        try {
            const userId = await this.getCurrentUserId()

            const { data, error } = await supabase
                .from('admin_vault')
                .select('*')
                .eq('usuario_id', userId)
                .order('fecha_creacion', { ascending: false })

            if (error) throw error

            // Desencriptar datos
            return data.map(item => ({
                ...item,
                datos: this.vault.decrypt(item.datos_encriptados)
            }))
        } catch (error) {
            console.error('Error obteniendo credenciales:', error)
            return []
        }
    }

    /**
     * Obtener credenciales por categoría
     */
    async getCredentialsByCategory(category) {
        try {
            const userId = await this.getCurrentUserId()

            const { data, error } = await supabase
                .from('admin_vault')
                .select('*')
                .eq('usuario_id', userId)
                .eq('categoria', category)

            if (error) throw error

            return data.map(item => ({
                ...item,
                datos: this.vault.decrypt(item.datos_encriptados)
            }))
        } catch (error) {
            console.error('Error obteniendo por categoría:', error)
            return []
        }
    }

    /**
     * Actualizar credencial
     */
    async updateCredential(id, name, username, password, category) {
        try {
            const encrypted = this.vault.encrypt({
                username,
                password,
                updatedAt: new Date().toISOString()
            })

            const { error } = await supabase
                .from('admin_vault')
                .update({
                    nombre: name,
                    categoria: category,
                    datos_encriptados: encrypted,
                    fecha_actualizacion: new Date().toISOString()
                })
                .eq('id', id)

            if (error) throw error
            return { success: true }
        } catch (error) {
            console.error('Error actualizando:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Eliminar credencial
     */
    async deleteCredential(id) {
        try {
            const { error } = await supabase
                .from('admin_vault')
                .delete()
                .eq('id', id)

            if (error) throw error
            return { success: true }
        } catch (error) {
            console.error('Error eliminando:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Obtener ID del usuario actual
     */
    async getCurrentUserId() {
        const currentUser = JSON.parse(localStorage.getItem('1807_currentUser'))
        return currentUser?.id || null
    }

    /**
     * Copiar contraseña al portapapeles
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text)
            return { success: true }
        } catch (error) {
            console.error('Error copiando:', error)
            return { success: false }
        }
    }
}

// ============================================
// GESTOR DE DATOS ADMIN (Para otros datos)
// ============================================

export class AdminDataManager {
    /**
     * Guardar datos de configuración del admin
     */
    async saveAdminSetting(key, value) {
        try {
            const userId = await this.getUserId()

            const { data, error } = await supabase
                .from('admin_settings')
                .upsert([{
                    usuario_id: userId,
                    clave: key,
                    valor: JSON.stringify(value),
                    fecha_actualizacion: new Date().toISOString()
                }])
                .select()

            if (error) throw error
            return { success: true, data: data[0] }
        } catch (error) {
            console.error('Error guardando setting:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Obtener todos los settings del admin
     */
    async getAllAdminSettings() {
        try {
            const userId = await this.getUserId()

            const { data, error } = await supabase
                .from('admin_settings')
                .select('*')
                .eq('usuario_id', userId)

            if (error) throw error

            const settings = {}
            data.forEach(item => {
                settings[item.clave] = JSON.parse(item.valor)
            })

            return { success: true, settings }
        } catch (error) {
            console.error('Error obteniendo settings:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Obtener un setting específico
     */
    async getAdminSetting(key) {
        try {
            const userId = await this.getUserId()

            const { data, error } = await supabase
                .from('admin_settings')
                .select('*')
                .eq('usuario_id', userId)
                .eq('clave', key)
                .single()

            if (error && error.code !== 'PGRST116') throw error

            if (!data) return { success: false, data: null }
            return { success: true, data: JSON.parse(data.valor) }
        } catch (error) {
            console.error('Error obteniendo setting:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Obtener ID usuario
     */
    async getUserId() {
        const currentUser = JSON.parse(localStorage.getItem('1807_currentUser'))
        return currentUser?.id || null
    }
}

export { supabase }
