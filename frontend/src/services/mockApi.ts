/**
 * Mock API Service untuk simulasi backend.
 * Saat ini hanya mengembalikan respon "Out of service".
 */

// Tipe data untuk pesan chat
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Pseudo-code untuk penyimpanan data (TODO: Implementasi masa depan)
/*
async function saveToDatabase(data: any) {
  // const response = await fetch('/api/save', {
  //   method: 'POST',
  //   body: JSON.stringify(data)
  // });
  // return response.json();
}

async function loadFromDatabase() {
  // const response = await fetch('/api/load');
  // return response.json();
}
*/

/**
 * Mengirim pesan ke AI (Simulasi)
 * @param message Pesan dari pengguna
 * @returns Respon dari AI
 */
export async function sendMessage(message: string): Promise<string> {
    // Simulasi penggunaan parameter
    console.log(`Sending message: ${message}`);

    // Simulasi delay jaringan
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Respon sementara
    return "Maaf, layanan chatbot AI saat ini sedang tidak tersedia (Out of service).";
}

/**
 * Menganalisa dokumen (Simulasi)
 * @param file File dokumen yang diupload
 * @returns Hasil analisa
 */
export async function analyzeDocument(file: File): Promise<string> {
    // Simulasi penggunaan parameter
    console.log(`Analyzing file: ${file.name}`);

    await new Promise(resolve => setTimeout(resolve, 1500));
    return "Maaf, layanan analisa dokumen saat ini sedang tidak tersedia (Out of service).";
}

import type { SearchFilters } from './api'

/**
 * Mencari data legal (Simulasi)
 * @param query Kata kunci pencarian
 * @param filters Filter pencarian
 * @returns Hasil pencarian
 */
export async function searchLegal(query: string, filters?: SearchFilters): Promise<any[]> {
    // Simulasi penggunaan parameter
    console.log(`Searching for query: ${query}`, filters);

    await new Promise(resolve => setTimeout(resolve, 1000));
    // Kembalikan array kosong atau pesan error dalam bentuk item
    return [
        {
            id: 1,
            title: "Out of Service",
            description: "Maaf, layanan pencarian legal saat ini sedang tidak tersedia."
        }
    ];
}
