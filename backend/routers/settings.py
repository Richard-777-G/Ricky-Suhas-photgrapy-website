from fastapi import APIRouter, HTTPException
from models.settings import SiteSettings, SiteSettingsUpdate
from lib.db import db
from datetime import datetime

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("", response_model=SiteSettings)
async def get_site_settings():
    doc = await db.settings.find_one({"id": "main_settings"})
    if not doc:
        default_settings = SiteSettings()
        await db.settings.insert_one(default_settings.model_dump())
        return default_settings
    return SiteSettings(**doc)

@router.patch("", response_model=SiteSettings)
async def update_site_settings(payload: SiteSettingsUpdate):
    doc = await db.settings.find_one({"id": "main_settings"})
    if not doc:
        current = SiteSettings().model_dump()
    else:
        current = doc
        
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.settings.update_one({"id": "main_settings"}, {"$set": update_data}, upsert=True)
    updated_doc = await db.settings.find_one({"id": "main_settings"})
    return SiteSettings(**updated_doc)

@router.get("/dashboard-stats")
async def get_dashboard_stats():
    total_photos = await db.media.count_documents({"type": "photo"})
    total_videos = await db.media.count_documents({"type": "video"})
    total_reels = await db.media.count_documents({"type": "reel"})
    total_collections = await db.collections.count_documents({})
    total_locations = await db.locations.count_documents({})
    total_stories = await db.stories.count_documents({})
    draft_media = await db.media.count_documents({"published": False})
    featured_media = await db.media.count_documents({"featured": True})
    
    recent_uploads = await db.media.find().sort("created_at", -1).limit(6).to_list(6)
    from models.media import Media
    
    return {
        "counts": {
            "photos": total_photos,
            "videos": total_videos,
            "reels": total_reels,
            "total_media": total_photos + total_videos + total_reels,
            "collections": total_collections,
            "locations": total_locations,
            "stories": total_stories,
            "drafts": draft_media,
            "featured": featured_media
        },
        "recent_uploads": [Media(**m) for m in recent_uploads]
    }
