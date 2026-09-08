import os
import io
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient
import pypdf
import requests

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

# Custom Model Config
INFERENCE_URL = os.getenv("INFERENCE_URL")
INFERENCE_API_KEY = os.getenv("INFERENCE_API_KEY")

base_client = InferenceClient(token=HF_TOKEN)

class ChatRequest(BaseModel):
    message: str
    model_id: str = "base-model" # default to base-model

@app.get("/")
def read_root():
    return {"message": "LegalBot ID API is running"}

@app.get("/api/models")
def get_models_status():
    """
    Mengembalikan daftar model dan status ketersediaannya secara dinamis.
    """
    hf_token = os.getenv("HF_TOKEN")
    base_available = bool(hf_token)
    
    inf_url = os.getenv("INFERENCE_URL")
    inf_key = os.getenv("INFERENCE_API_KEY")
    force_enable = os.getenv("ENABLE_FINE_TUNED_MODEL", "").strip().lower() in ("true", "1", "yes")
    
    fine_tuned_available = False
    fine_tuned_status = "unconfigured"
    fine_tuned_message = "INFERENCE_URL belum dikonfigurasi"
    
    if force_enable:
        fine_tuned_available = True
        fine_tuned_status = "online"
        fine_tuned_message = "Tersedia"
    elif inf_url:
        try:
            headers = {}
            if inf_key:
                headers["X-API-KEY"] = inf_key
            # Quick health check with timeout (2 seconds)
            requests.get(inf_url, headers=headers, timeout=2.0)
            fine_tuned_available = True
            fine_tuned_status = "online"
            fine_tuned_message = "Tersedia"
        except requests.exceptions.RequestException:
            fine_tuned_available = False
            fine_tuned_status = "offline"
            fine_tuned_message = "Server offline"

    return {
        "models": [
            {
                "id": "base-model",
                "name": "Base Model",
                "available": base_available,
                "status": "online" if base_available else "unconfigured",
                "description": "Model dasar Qwen2.5-7B-Instruct via Hugging Face"
            },
            {
                "id": "fine-tuned-v1",
                "name": "Fine-tuned v1",
                "available": fine_tuned_available,
                "status": fine_tuned_status,
                "message": fine_tuned_message,
                "description": "Model fine-tuned spesialis hukum Indonesia"
            }
        ]
    }

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Panggil endpoint Inference API
        # Kita gunakan template chat sederhana untuk Qwen
        messages = [
            {"role": "system", "content": "Anda adalah asisten hukum AI yang membantu menjawab pertanyaan terkait hukum di Indonesia. Jawablah dengan sopan, jelas, dan menggunakan Bahasa Indonesia yang baik."},
            {"role": "user", "content": request.message}
        ]
        
        # Check model selection
        if request.model_id == "fine-tuned-v1":
            inf_url = os.getenv("INFERENCE_URL") or INFERENCE_URL
            inf_key = os.getenv("INFERENCE_API_KEY") or INFERENCE_API_KEY
            force_enable = os.getenv("ENABLE_FINE_TUNED_MODEL", "").strip().lower() in ("true", "1", "yes")
            
            if (not inf_url or not inf_key) and force_enable:
                return {"response": f"Halo! Ini adalah respon simulasi dari model **Fine-tuned v1 (Legal Specialist)**.\n\nAnda menanyakan: *\"{request.message}\"*.\n\n*(Catatan: Model fine-tuned aktif dalam mode simulasi. Untuk menghubungkan ke server model sungguhan, konfigurasikan `INFERENCE_URL` dan `INFERENCE_API_KEY` di file `.env`)*"}

            if not inf_url or not inf_key:
                 raise HTTPException(status_code=500, detail="INFERENCE_URL or INFERENCE_API_KEY not configured for Fine-tuned v1")
            
            # Using direct HTTP request for custom model to avoid automatic path appending
            # UPDATE: Adapting to user-specified server format
            payload = {
                "user_message": request.message, # Server expects single string
                "max_new_tokens": 512,           # Server expects max_new_tokens
                "temperature": 0.7
            }
            
            headers = {
                "X-API-KEY": INFERENCE_API_KEY,
            "Content-Type": "application/json"
            }
            
            try:
                response = requests.post(INFERENCE_URL, json=payload, headers=headers, timeout=120)
                response.raise_for_status()
                
                # Attempt to parse response
                # Case 1: OpenAI format {"choices": [{"message": {"content": "..."}}]}
                # Case 2: Simple JSON {"response": "..."} or {"generated_text": "..."}
                data = response.json()
                
                if "choices" in data and len(data["choices"]) > 0:
                     return {"response": data["choices"][0]["message"]["content"]}
                elif "response" in data:
                     return {"response": data["response"]}
                elif "generated_text" in data:
                     return {"response": data["generated_text"]}
                else:
                    # Fallback: dump the whole JSON or specific field
                    print(f"Unknown response format: {data}")
                    return {"response": str(data)}
                    
            except Exception as e:
                print(f"Error calling custom model: {e}")
                raise HTTPException(status_code=500, detail=f"Custom Model Error: {str(e)}")

        else:
            # Base Model (Qwen via HF Client)
            if not HF_TOKEN:
                 raise HTTPException(status_code=500, detail="HF_TOKEN not set in backend")

            response = base_client.chat_completion(
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
        
        response = base_client.chat_completion(
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
        prompt = f"Berikan daftar 3-5 peraturan atau undang-undang di Indonesia yang relevan dengan topik '{request.query}'. Berikan respons HANYA dalam format JSON Array raw. Jangan gunakan markdown block ```json. Setiap item harus memiliki field 'title' (Nama Peraturan), 'description' (Penjelasan singkat), dan 'type' (Misal: 'uu', 'pp', 'permen')."
        
        messages = [
            {"role": "system", "content": "Anda adalah mesin pencari hukum. Keluarkan hasil HANYA dalam format JSON valid tanpa teks tambahan."},
            {"role": "user", "content": prompt}
        ]
        
        response = base_client.chat_completion(
            model=REPO_ID,
            messages=messages,
            max_tokens=512,
            temperature=0.7
        )
        
        # Cleaning formatting if exists
        content = response.choices[0].message.content.strip()
        
        # Try to parse JSON from the response
        import json
        import re
        
        try:
            # Remove markdown code blocks if present
            clean_content = re.sub(r'```json\s*|\s*```', '', content)
            parsed_results = json.loads(clean_content)
            
            if isinstance(parsed_results, list):
                # Ensure each item has an id
                for idx, item in enumerate(parsed_results):
                    if 'id' not in item:
                        item['id'] = f"ai-result-{idx}"
                    # Ensure type exists for badge
                    if 'type' not in item:
                         item['type'] = 'Regulasi'
                return parsed_results
                
        except json.JSONDecodeError:
            print("Failed to parse LLM JSON response")
            # Fallback to text description if parsing fails
            pass
            
        return [
            {
                "id": "ai-generated",
                "title": f"Hasil Pencarian AI untuk '{request.query}'",
                "description": content
            }
        ]

    except Exception as e:
        print(f"Error searching: {e}")
        raise HTTPException(status_code=500, detail=str(e))
