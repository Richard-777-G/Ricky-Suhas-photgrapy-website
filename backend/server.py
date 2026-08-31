from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
from lib.db import client, db

# Import routers
from routers.auth import router as auth_router
from routers.media import router as media_router
from routers.collections import router as collections_router
from routers.locations import router as locations_router
from routers.stories import router as stories_router
from routers.settings import router as settings_router
from routers.inquiries import router as inquiries_router
from routers.uploads import router as uploads_router
from routers.ai_assist import router as ai_assist_router
from routers.discovery import router as discovery_router


# Startup runs before the yield, shutdown after it.
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure default settings and seed if empty
    settings_count = await db.settings.count_documents({"id": "main_settings"})
    if settings_count == 0:
        from models.settings import SiteSettings
        await db.settings.insert_one(SiteSettings().model_dump())
    yield
    client.close()


# Create the main app without a prefix
app = FastAPI(
    title="Ricky Suhas API",
    description="Digital Visual Exploration Platform & Cinematic Archive",
    version="2.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models for root status check
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Status check routes
@api_router.get("/")
async def root():
    return {
        "status": "online",
        "archive": "Ricky Suhas Visual Exploration Universe",
        "motto": "Beauty Seeker — Take a moment to enjoy God's creation",
        "version": "2.0.0"
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Mount all feature routers
api_router.include_router(auth_router)
api_router.include_router(media_router)
api_router.include_router(collections_router)
api_router.include_router(locations_router)
api_router.include_router(stories_router)
api_router.include_router(settings_router)
api_router.include_router(inquiries_router)
api_router.include_router(uploads_router)
api_router.include_router(ai_assist_router)
api_router.include_router(discovery_router)

# Include the main router in the app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
