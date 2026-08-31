from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.media import Media, MediaCreate, MediaUpdate, BulkMediaCreate, BulkTagUpdate
from lib.db import db
import re
import uuid
from datetime import datetime

router = APIRouter(prefix="/media", tags=["media"])

def slugify(text: str) -> str:
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', text).strip().lower()
    return re.sub(r'[\s-]+', '-', slug)

@router.get("", response_model=List[Media])
async def list_media(
    type: Optional[str] = None, # photo | video | reel
    category: Optional[str] = None,
    collection_id: Optional[str] = None,
    location_id: Optional[str] = None,
    featured: Optional[bool] = None,
    published: Optional[bool] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    skip: int = 0
):
    query = {}
    if type:
        query["type"] = type
    if category and category.lower() != "all":
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}
    if collection_id:
        query["collection_id"] = collection_id
    if location_id:
        query["location_id"] = location_id
    if featured is not None:
        query["featured"] = featured
    if published is not None:
        query["published"] = published
    if tag:
        query["tags"] = {"$in": [tag]}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"short_description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search]}}
        ]
    
    cursor = db.media.find(query).sort([("sort_order", 1), ("created_at", -1)]).skip(skip).limit(limit)
    docs = await cursor.to_list(limit)
    return [Media(**doc) for doc in docs]

@router.get("/{id}", response_model=Media)
async def get_media_item(id: str):
    doc = await db.media.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Media item not found")
    return Media(**doc)

@router.post("", response_model=Media)
async def create_media_item(payload: MediaCreate):
    media_dict = payload.model_dump()
    media_dict["id"] = str(uuid.uuid4())
    media_dict["slug"] = f"{slugify(payload.title)}-{media_dict['id'][:6]}"
    media_dict["created_at"] = datetime.utcnow()
    media_dict["updated_at"] = datetime.utcnow()
    
    # Resolve collection & location names if ids provided
    if payload.collection_id:
        col = await db.collections.find_one({"id": payload.collection_id})
        if col:
            media_dict["collection_name"] = col.get("title")
            await db.collections.update_one({"id": payload.collection_id}, {"$inc": {"media_count": 1}})
    
    if payload.location_id:
        loc = await db.locations.find_one({"id": payload.location_id})
        if loc:
            media_dict["location_name"] = loc.get("place_name")
            await db.locations.update_one({"id": payload.location_id}, {"$inc": {"works_count": 1}})
            
    media_obj = Media(**media_dict)
    await db.media.insert_one(media_obj.model_dump())
    return media_obj

@router.post("/bulk", response_model=List[Media])
async def bulk_create_media(payload: BulkMediaCreate):
    created_items = []
    for item in payload.items:
        media_dict = item.model_dump()
        media_dict["id"] = str(uuid.uuid4())
        media_dict["slug"] = f"{slugify(item.title)}-{media_dict['id'][:6]}"
        media_dict["created_at"] = datetime.utcnow()
        media_dict["updated_at"] = datetime.utcnow()
        
        if item.collection_id:
            col = await db.collections.find_one({"id": item.collection_id})
            if col:
                media_dict["collection_name"] = col.get("title")
                await db.collections.update_one({"id": item.collection_id}, {"$inc": {"media_count": 1}})
        
        if item.location_id:
            loc = await db.locations.find_one({"id": item.location_id})
            if loc:
                media_dict["location_name"] = loc.get("place_name")
                await db.locations.update_one({"id": item.location_id}, {"$inc": {"works_count": 1}})
                
        media_obj = Media(**media_dict)
        await db.media.insert_one(media_obj.model_dump())
        created_items.append(media_obj)
    return created_items

@router.put("/bulk-tags")
async def bulk_tag_update(payload: BulkTagUpdate):
    update_data = {"updated_at": datetime.utcnow()}
    if payload.category:
        update_data["category"] = payload.category
    if payload.location_id:
        update_data["location_id"] = payload.location_id
        loc = await db.locations.find_one({"id": payload.location_id})
        if loc:
            update_data["location_name"] = loc.get("place_name")
    if payload.collection_id:
        update_data["collection_id"] = payload.collection_id
        col = await db.collections.find_one({"id": payload.collection_id})
        if col:
            update_data["collection_name"] = col.get("title")
    if payload.published is not None:
        update_data["published"] = payload.published
    if payload.featured is not None:
        update_data["featured"] = payload.featured
        
    ops = {"$set": update_data}
    if payload.tags_to_add:
        ops["$addToSet"] = {"tags": {"$each": payload.tags_to_add}}
        
    res = await db.media.update_many({"id": {"$in": payload.media_ids}}, ops)
    return {"modified_count": res.modified_count, "message": "Bulk update completed"}

@router.patch("/{id}", response_model=Media)
async def update_media_item(id: str, payload: MediaUpdate):
    doc = await db.media.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Media item not found")
        
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if "title" in update_data:
        update_data["slug"] = f"{slugify(update_data['title'])}-{id[:6]}"
    if "collection_id" in update_data:
        col = await db.collections.find_one({"id": update_data["collection_id"]})
        update_data["collection_name"] = col.get("title") if col else None
    if "location_id" in update_data:
        loc = await db.locations.find_one({"id": update_data["location_id"]})
        update_data["location_name"] = loc.get("place_name") if loc else None
        
    await db.media.update_one({"id": id}, {"$set": update_data})
    updated_doc = await db.media.find_one({"id": id})
    return Media(**updated_doc)

@router.delete("/{id}")
async def delete_media_item(id: str):
    doc = await db.media.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Media item not found")
    
    if doc.get("collection_id"):
        await db.collections.update_one({"id": doc["collection_id"]}, {"$inc": {"media_count": -1}})
    if doc.get("location_id"):
        await db.locations.update_one({"id": doc["location_id"]}, {"$inc": {"works_count": -1}})
        
    await db.media.delete_one({"id": id})
    return {"message": "Media item deleted successfully"}
