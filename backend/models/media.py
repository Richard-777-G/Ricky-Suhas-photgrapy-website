from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class ExifData(BaseModel):
    camera: Optional[str] = "Sony Alpha 7R V"
    lens: Optional[str] = "FE 24-70mm F2.8 GM II"
    shutter_speed: Optional[str] = "1/800s"
    aperture: Optional[str] = "f/4.0"
    iso: Optional[str] = "ISO 100"
    focal_length: Optional[str] = "35mm"

class Media(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str = "photo"  # photo | video | reel
    title: str
    slug: str
    description: Optional[str] = ""
    short_description: str  # Mandatory 2-line description
    file_url: str
    thumbnail_url: Optional[str] = None
    width: Optional[int] = 3840
    height: Optional[int] = 2160
    duration: Optional[str] = None  # for videos (e.g. "04:32")
    capture_date: Optional[str] = None
    location_id: Optional[str] = None
    location_name: Optional[str] = None
    collection_id: Optional[str] = None
    collection_name: Optional[str] = None
    category: str = "Landscape"  # Landscape, Wildlife, Aerial, Macro, Ocean, Travel, Other
    tags: List[str] = Field(default_factory=list)
    featured: bool = False
    published: bool = True
    sort_order: int = 0
    exif: Optional[ExifData] = Field(default_factory=ExifData)
    source_url: Optional[str] = None  # e.g. Instagram reel or YouTube link
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MediaCreate(BaseModel):
    type: str = "photo"
    title: str
    description: Optional[str] = ""
    short_description: str
    file_url: str
    thumbnail_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[str] = None
    capture_date: Optional[str] = None
    location_id: Optional[str] = None
    collection_id: Optional[str] = None
    category: str = "Landscape"
    tags: List[str] = Field(default_factory=list)
    featured: bool = False
    published: bool = True
    exif: Optional[ExifData] = None
    source_url: Optional[str] = None

class MediaUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    file_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[str] = None
    capture_date: Optional[str] = None
    location_id: Optional[str] = None
    collection_id: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    featured: Optional[bool] = None
    published: Optional[bool] = None
    exif: Optional[ExifData] = None
    source_url: Optional[str] = None

class BulkMediaCreate(BaseModel):
    items: List[MediaCreate]

class BulkTagUpdate(BaseModel):
    media_ids: List[str]
    category: Optional[str] = None
    location_id: Optional[str] = None
    collection_id: Optional[str] = None
    tags_to_add: Optional[List[str]] = None
    published: Optional[bool] = None
    featured: Optional[bool] = None
