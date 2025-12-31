/**
 * API Service untuk menghubungkan Frontend dengan Backend FastAPI.
 */

const API_URL = 'http://localhost:8000/api';

// Tipe data untuk pesan chat
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

/**
 * Mengirim pesan ke AI
 * @param message Pesan dari pengguna
 * @returns Respon dari AI
 */
export async function sendMessage(message: string): Promise<string> {
    try {
        const response = await fetch(`${API_URL}/chat`, {
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
 * Menganalisa dokumen
 * @param file File dokumen yang diupload
 * @returns Hasil analisa
 */
export async function analyzeDocument(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/analyze`, {
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
 * Mencari data legal
 * @param query Kata kunci pencarian
 * @returns Hasil pencarian
 */
export async function searchLegal(query: string): Promise<any[]> {
    try {
        const response = await fetch(`${API_URL}/search`, {
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

        // Backend mengembalikan array, jadi langsung return
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
