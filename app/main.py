from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, checkin, events, registrations, attendance

# Create database tables automatically on startup if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EventEase API",
    description="Campus Event Management & QR Check-In Platform",
    version="1.0.0"
)

# Enable CORS for Frontend (Vite running on localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers under the /api prefix so frontend requests match perfectly
app.include_router(auth.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(registrations.router, prefix="/api")
app.include_router(checkin.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to EventEase API! Everything is running smoothly."}