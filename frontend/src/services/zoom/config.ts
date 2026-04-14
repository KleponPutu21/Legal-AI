/**
 * Centralized configuration for API and environment settings.
 */

// Pakai environment variable jika tersedia, fallback ke default
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const API_CONFIG = {
    baseURL: baseURL,
    timeout: 30000, // 30 seconds
    maxFileSize: 100 * 1024 * 1024, // 100MB
} as const

export default API_CONFIG
