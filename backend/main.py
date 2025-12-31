import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient
import pypdf
import io
from pathlib import Path

# Load environment variables from backend directory
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face Client
HF_TOKEN = os.getenv("HF_TOKEN")
# Using Qwen2.5-7B-Instruct as requested
REPO_ID = "Qwen/Qwen2.5-7B-Instruct"

client = InferenceClient(token=HF_TOKEN)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "LegalBot ID API is running"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    if not HF_TOKEN:
        raise HTTPException(status_code=500, detail="HF_TOKEN not set in backend")
    
    try:
        # Panggil endpoint Inference API
        # Kita gunakan template chat sederhana untuk Qwen
        messages = [
            {"role": "system", "content": "Anda adalah asisten hukum AI yang membantu menjawab pertanyaan terkait hukum di Indonesia. Jawablah dengan sopan, jelas, dan menggunakan Bahasa Indonesia yang baik."},
            {"role": "user", "content": request.message}
        ]
        
        response = client.chat_completion(
            model=REPO_ID,
            messages=messages,
            max_tokens=512,
            temperature=0.7
        )
        
        return {"response": response.choices[0].message.content}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
async def analyze_document(file: UploadFile = File(...)):
    if not HF_TOKEN:
        raise HTTPException(status_code=500, detail="HF_TOKEN not set in backend")
    
    try:
        # Baca PDF
        content = await file.read()
        pdf_file = io.BytesIO(content)
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
        # Batasi text agar tidak melebihi context window (kasar)
        text_preview = text[:2000] 
        
        prompt = f"Analisa dokumen hukum berikut dan berikan poin-poin pentingnya:\n\n{text_preview}..."
        
        messages = [
            {"role": "system", "content": "Anda adalah ahli hukum yang bertugas menganalisa dokumen."},
            {"role": "user", "content": prompt}
        ]
        
        response = client.chat_completion(
            model=REPO_ID,
            messages=messages,
            max_tokens=512,
            temperature=0.5
        )
        
        return {"result": response.choices[0].message.content}

    except Exception as e:
        print(f"Error analyzing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class SearchRequest(BaseModel):
    query: str

@app.post("/api/search")
async def search_endpoint(request: SearchRequest):
    if not HF_TOKEN:
        raise HTTPException(status_code=500, detail="HF_TOKEN not set in backend")

    try:
        # Mocking search with LLM generation for now (Prototype phase)
        # In real app, this would query a Vector DB or Search Engine
        prompt = f"Berikan daftar 3-5 peraturan atau undang-undang di Indonesia yang relevan dengan topik '{request.query}'. Format hasil sebagai daftar JSON dengan field 'title' dan 'description'."
        
        messages = [
            {"role": "system", "content": "Anda adalah mesin pencari hukum. Berikan hasil yang relevan."},
            {"role": "user", "content": prompt}
        ]
        
        response = client.chat_completion(
            model=REPO_ID,
            messages=messages,
            max_tokens=512,
            temperature=0.7
        )
        
        # Karena kita minta LLM, kita kembalikan raw text dulu untuk diparsing di frontend atau ditampilkan langsung
        # Namun agar sesuai struktur frontend sebelumnya, kita kembalikan list of objects
        # Disini kita simplifikasi: kita minta LLM jelaskan saja, nanti frontend menampilkan textnya.
        # TAPI, frontend view mengharapkan array of objects {id, title, description}.
        # Kita ubah backend return format TEXT saja, dan frontend adaptasi, 
        # ATAU kita parsing output LLM.
        # Untuk kestabilan prototipe ini, kita minta LLM generate text, lalu kita bungkus jadi 1 item result.
        
        return [
            {
                "id": "ai-generated",
                "title": f"Hasil Pencarian AI untuk '{request.query}'",
                "description": response.choices[0].message.content
            }
        ]

    except Exception as e:
        print(f"Error searching: {e}")
        raise HTTPException(status_code=500, detail=str(e))
