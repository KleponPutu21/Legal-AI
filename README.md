# Integrasi-AI PLN - Prototipe Asisten Hukum AI Indonesia dan Transcript Meeting Online

Selamat datang di repositori LegalBot ID. Proyek ini adalah **prototipe** aplikasi web yang menyediakan layanan bantuan hukum berbasis AI untuk konteks hukum di Indonesia.

## ⚠️ Disclaimer
**PENTING: Aplikasi ini adalah PROTOTIPE dan HANYA UNTUK TUJUAN REFERENSI.**
Informasi yang diberikan oleh AI dalam aplikasi ini **TIDAK** menggantikan nasihat hukum profesional dari pengacara atau ahli hukum yang berwenang. Jangan gunakan informasi dari aplikasi ini sebagai dasar tunggal untuk pengambilan keputusan hukum.

## Fitur Utama
1.  **Chatbot Hukum**: Tanya jawab interaktif seputar masalah hukum umum di Indonesia menggunakan AI.
2.  **Analisa Dokumen**: Unggah dokumen hukum (PDF) untuk mendapatkan ringkasan dan poin-poin penting.
3.  **Pencarian Legal**: Mesin pencari (simulasi) untuk menemukan regulasi yang relevan.

## Struktur Repositori
- **`frontend/`**: Kode antarmuka pengguna (Vue.js 3, Tailwind CSS, shadcn-vue).
- **`backend/`**: Kode server API (FastAPI, Python) yang menangani logika AI.

## Cara Menjalankan

### Persiapan
Pastikan Anda telah menginstall:
- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)

### 1. Menjalankan Backend
Masuk ke folder backend, install dependencies, dan jalankan server.
```bash
cd backend
pip install -r requirements.txt
# Buat file .env dan isi HF_TOKEN=token_huggingface_anda
python -m uvicorn main:app --reload
```
Server backend akan berjalan di `http://localhost:8000`.

### 2. Menjalankan Frontend
Masuk ke folder frontend, install dependencies, dan jalankan server dev.
```bash
cd frontend
npm install
npm run dev
```
Aplikasi frontend akan berjalan di `http://localhost:5173`.

## Teknologi
- **Frontend**: Vue.js, TypeScript, Tailwind CSS, shadcn-vue.
- **Backend**: FastAPI, Hugging Face Inference API (Model: Qwen/Qwen2.5-7B-Instruct).

---
Dibuat sebagai referensi pengembangan teknologi hukum (LegalTech) di Indonesia.
