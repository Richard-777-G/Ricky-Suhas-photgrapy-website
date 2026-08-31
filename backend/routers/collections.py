from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.collections import Collection, CollectionCreate, CollectionUpdate
from models.media import Media
from lib.db import db
import re
import uuid
from datetime import datetime

router = APIRouter(prefix="/collections", tags=["collections"])

def slugify(text: str) -> str:
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', text).strip().lower()
    return re.sub(r'[\s-]+', '-', slug)

@router.get("", response_model=List[Collection])
async def list_collections(
    featured: Optional[bool] = None,
    status: Optional[str] = None,
    location_id: Optional[str] = None,
    category: Optional[str] = None
):
    query = {}
    if featured is not None:
        query["featured"] = featured
    if status:
        query["status"] = status
    if location_id:
        query["location_id"] = location_id
    if category and category.lower() != "all":
        query["category"] = category
        
    docs = await db.collections.find(query).sort("created_at", -1).to_list(100)
    # Sync media counts
    res = []
    for doc in docs:
        c_id = doc["id"]
        count = await db.media.count_documents({"collection_id": c_id})
        doc["media_count"] = count
        res.append(Collection(**doc))
    return res

@router.get("/{id_or_slug}")
async def get_collection(id_or_slug: str):
    doc = await db.collections.find_one({"$or": [{"id": id_or_slug}, {"slug": id_or_slug}]})
    if not doc:
        raise HTTPException(status_code=404, detail="Collection not found")
        
    col_id = doc["id"]
    media_docs = await db.media.find({"collection_id": col_id, "published": True}).sort([("sort_order", 1), ("created_at", -1)]).to_list(200)
    
    col_obj = Collection(**doc)
    return {
        "collection": col_obj,
        "media": [Media(**m) for m in media_docs],
        "photos": [Media(**m) for m in media_docs if m.get("type") == "photo"],
        "videos": [Media(**m) for m in media_docs if m.get("type") == "video"],
        "reels": [Media(**m) for m in media_docs if m.get("type") == "reel"]
    }

@router.post("", response_model=Collection)
async def create_collection(payload: CollectionCreate):
    c_dict = payload.model_dump()
    c_dict["id"] = str(uuid.uuid4())
    c_dict["slug"] = f"{slugify(payload.title)}-{c_dict['id'][:6]}"
    c_dict["created_at"] = datetime.utcnow()
    c_dict["updated_at"] = datetime.utcnow()
    c_dict["media_count"] = 0
    
    if payload.location_id:
        loc = await db.locations.find_one({"id": payload.location_id})
        if loc:
            c_dict["location_name"] = loc.get("place_name")
            
    col = Collection(**c_dict)
    await db.collections.insert_one(col.model_dump())
    return col

@router.patch("/{id}", response_model=Collection)
async def update_collection(id: str, payload: CollectionUpdate):
    doc = await db.collections.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Collection not found")
        
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if "title" in update_data:
        update_data["slug"] = f"{slugify(update_data['title'])}-{id[:6]}"
    if "location_id" in update_data:
        loc = await db.locations.find_one({"id": update_data["location_id"]})
        update_data["location_name"] = loc.get("place_name") if loc else None
        
    await db.collections.update_one({"id": id}, {"$set": update_data})
    updated_doc = await db.collections.find_one({"id": id})
    return Collection(**updated_doc)

@router.delete("/{id}")
async def delete_collection(id: str):
    doc = await db.collections.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Detach collection from media
    await db.media.update_many({"collection_id": id}, {"$set": {"collection_id": None, "collection_name": None}})
    await db.collections.delete_one({"id": id})
    return {"message": "Collection deleted successfully"}
