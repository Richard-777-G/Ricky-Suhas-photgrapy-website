from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.stories import Story, StoryCreate, StoryUpdate
from lib.db import db
import re
import uuid
from datetime import datetime

router = APIRouter(prefix="/stories", tags=["stories"])

def slugify(text: str) -> str:
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', text).strip().lower()
    return re.sub(r'[\s-]+', '-', slug)

@router.get("", response_model=List[Story])
async def list_stories(featured: Optional[bool] = None, published: Optional[bool] = None):
    query = {}
    if featured is not None:
        query["featured"] = featured
    if published is not None:
        query["published"] = published
        
    docs = await db.stories.find(query).sort("date", -1).to_list(100)
    return [Story(**doc) for doc in docs]

@router.get("/{id_or_slug}", response_model=Story)
async def get_story(id_or_slug: str):
    doc = await db.stories.find_one({"$or": [{"id": id_or_slug}, {"slug": id_or_slug}]})
    if not doc:
        raise HTTPException(status_code=404, detail="Story journal entry not found")
    return Story(**doc)

@router.post("", response_model=Story)
async def create_story(payload: StoryCreate):
    s_dict = payload.model_dump()
    s_dict["id"] = str(uuid.uuid4())
    s_dict["slug"] = f"{slugify(payload.title)}-{s_dict['id'][:6]}"
    s_dict["created_at"] = datetime.utcnow()
    if not s_dict.get("date"):
        s_dict["date"] = datetime.utcnow().strftime("%B %d, %Y")
        
    if payload.location_id:
        loc = await db.locations.find_one({"id": payload.location_id})
        if loc:
            s_dict["location_name"] = loc.get("place_name")
            
    if payload.collection_id:
        col = await db.collections.find_one({"id": payload.collection_id})
        if col:
            s_dict["collection_name"] = col.get("title")
            
    story = Story(**s_dict)
    await db.stories.insert_one(story.model_dump())
    return story

@router.patch("/{id}", response_model=Story)
async def update_story(id: str, payload: StoryUpdate):
    doc = await db.stories.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Story not found")
        
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "title" in update_data:
        update_data["slug"] = f"{slugify(update_data['title'])}-{id[:6]}"
    if "location_id" in update_data:
        loc = await db.locations.find_one({"id": update_data["location_id"]})
        update_data["location_name"] = loc.get("place_name") if loc else None
    if "collection_id" in update_data:
        col = await db.collections.find_one({"id": update_data["collection_id"]})
        update_data["collection_name"] = col.get("title") if col else None
        
    await db.stories.update_one({"id": id}, {"$set": update_data})
    updated_doc = await db.stories.find_one({"id": id})
    return Story(**updated_doc)

@router.delete("/{id}")
async def delete_story(id: str):
    doc = await db.stories.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Story not found")
    await db.stories.delete_one({"id": id})
    return {"message": "Story deleted successfully"}
