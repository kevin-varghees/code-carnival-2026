# EventEase Backend

FastAPI + SQLAlchemy + Pydantic API for college event registration and QR check-in.

## Run locally (VS Code terminal)

    python -m venv venv
    venv\Scripts\activate          # macOS/Linux: source venv/bin/activate
    pip install -r requirements.txt
    copy .env.example .env         # macOS/Linux: cp .env.example .env
    # edit .env and set SECRET_KEY
    uvicorn app.main:app --reload

API docs: http://localhost:8000/docs
