@echo off
echo ==========================================
echo   Legal-AI Local Environment Setup
echo ==========================================

cd /d "%~dp0"

echo.
echo [1/3] Checking Backend Configuration...
if not exist "backend\.env" (
    echo    Creating backend\.env from .env.example...
    copy "backend\.env.example" "backend\.env" >nul
    echo    [IMPORTANT] Please edit backend\.env and add your HF_TOKEN later!
) else (
    echo    backend\.env already exists. Skipping.
)

echo.
echo [2/3] Setting up Python Backend...
cd backend
if not exist ".venv" (
    echo    Creating virtual environment...
    python -m venv .venv
) else (
    echo    Virtual environment already exists.
)

echo    Installing dependencies...
call .venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..

echo.
echo [3/3] Setting up Vue Frontend...
cd frontend
if not exist "node_modules" (
    echo    Installing npm dependencies...
    call npm install
) else (
    echo    node_modules already exists. Skipping install.
)
cd ..

echo.
echo ==========================================
echo   Setup Complete!
echo ==========================================
echo.
echo To run the project locally:
echo 1. Edit 'backend\.env' and insert your Hugging Face Token.
echo 2. Run Backend: cd backend ^&^& .venv\Scripts\uvicorn main:app --reload
echo 3. Run Frontend: cd frontend ^&^& npm run dev
echo.
pause
