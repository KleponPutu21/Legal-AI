/**
 * API Service untuk menghubungkan Frontend dengan Backend FastAPI.
 */

// Ambil dari Environment Variable Vercel / Vite
const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Validasi agar error langsung kelihatan kalau env belum diset
 */
if (!API_URL) {
    throw new Error("VITE_API_BASE_URL is not defined");
}

// Tipe data untuk pesan chat
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

/**
 * Mengirim pesan ke AI
 */
export async function sendMessage(message: string): Promise<string> {
    try {
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to send message');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Analisa dokumen
 */
export async function analyzeDocument(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/api/analyze`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to analyze document');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Pencarian legal
 */
export async function searchLegal(query: string): Promise<any[]> {
    try {
        const response = await fetch(`${API_URL}/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to search');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
