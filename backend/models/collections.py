from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class Collection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    description: str
    subtitle: Optional[str] = None
    location_id: Optional[str] = None
    location_name: Optional[str] = None
    cover_image_url: str
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    category: str = "Exploration"
    featured: bool = False
    status: str = "published"  # published | draft
    media_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CollectionCreate(BaseModel):
    title: str
    description: str
    subtitle: Optional[str] = None
    location_id: Optional[str] = None
    cover_image_url: str
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    category: str = "Exploration"
    featured: bool = False
    status: str = "published"

class CollectionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    subtitle: Optional[str] = None
    location_id: Optional[str] = None
    cover_image_url: Optional[str] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    category: Optional[str] = None
    featured: Optional[bool] = None
    status: Optional[str] = None
