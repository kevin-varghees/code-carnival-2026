from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401  (registers all models on Base.metadata)
from app.config import settings
from app.database import Base, engine
from app.routers import auth, checkin, events, registrations


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="EventEase API",
    description="College event registration and QR check-in platform",
    version="1.0.0",
    lifespan=lifespan,
)

# allow_credentials=True requires explicit origins (a "*" wildcard is not allowed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(registrations.router)
app.include_router(checkin.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "EventEase API"}
