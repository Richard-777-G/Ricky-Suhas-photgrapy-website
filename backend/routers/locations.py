from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.locations import Location, LocationCreate, LocationUpdate
from models.media import Media
from lib.db import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/locations", tags=["locations"])

@router.get("", response_model=List[Location])
async def list_locations(featured: Optional[bool] = None):
    query = {}
    if featured is not None:
        query["featured"] = featured
        
    docs = await db.locations.find(query).sort("country", 1).to_list(100)
    res = []
    for doc in docs:
        loc_id = doc["id"]
        count = await db.media.count_documents({"location_id": loc_id})
        doc["works_count"] = count
        res.append(Location(**doc))
    return res

@router.get("/spatial-map")
async def get_spatial_map_data():
    loc_docs = await db.locations.find().to_list(100)
    features = []
    for loc in loc_docs:
        loc_id = loc["id"]
        works = await db.media.find({"location_id": loc_id, "published": True}).limit(6).to_list(6)
        total_photos = await db.media.count_documents({"location_id": loc_id, "type": "photo"})
        total_films = await db.media.count_documents({"location_id": loc_id, "type": "video"})
        total_reels = await db.media.count_documents({"location_id": loc_id, "type": "reel"})
        
        features.append({
            "location": Location(**loc),
            "stats": {
                "total_works": total_photos + total_films + total_reels,
                "photos_count": total_photos,
                "films_count": total_films,
                "reels_count": total_reels
            },
            "recent_works": [Media(**m) for m in works]
        })
    return {"spatial_locations": features}

@router.get("/{id}")
async def get_location(id: str):
    doc = await db.locations.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Location not found")
        
    works = await db.media.find({"location_id": id, "published": True}).sort("created_at", -1).to_list(100)
    collections = await db.collections.find({"location_id": id}).to_list(50)
    
    return {
        "location": Location(**doc),
        "works": [Media(**m) for m in works],
        "collections": collections
    }

@router.post("", response_model=Location)
async def create_location(payload: LocationCreate):
    l_dict = payload.model_dump()
    l_dict["id"] = str(uuid.uuid4())
    l_dict["works_count"] = 0
    l_dict["created_at"] = datetime.utcnow()
    
    loc = Location(**l_dict)
    await db.locations.insert_one(loc.model_dump())
    return loc

@router.patch("/{id}", response_model=Location)
async def update_location(id: str, payload: LocationUpdate):
    doc = await db.locations.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Location not found")
        
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    await db.locations.update_one({"id": id}, {"$set": update_data})
    updated_doc = await db.locations.find_one({"id": id})
    return Location(**updated_doc)

@router.delete("/{id}")
async def delete_location(id: str):
    doc = await db.locations.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Location not found")
    
    await db.media.update_many({"location_id": id}, {"$set": {"location_id": None, "location_name": None}})
    await db.collections.update_many({"location_id": id}, {"$set": {"location_id": None, "location_name": None}})
    await db.locations.delete_one({"id": id})
    return {"message": "Location deleted successfully"}
