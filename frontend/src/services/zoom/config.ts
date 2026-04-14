/**
 * Centralized configuration for API and environment settings.
 */

export const API_CONFIG = {
    baseURL: 'https://able-estimate-towers-tide.trycloudflare.com',
    timeout: 30000, // 30 seconds
    maxFileSize: 100 * 1024 * 1024, // 100MB
} as const

export default API_CONFIG
