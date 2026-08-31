from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class Location(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    country: str
    region: str
    city: Optional[str] = None
    place_name: str
    latitude: float
    longitude: float
    altitude: Optional[str] = None
    description: str
    cover_image_url: str
    works_count: int = 0
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LocationCreate(BaseModel):
    country: str
    region: str
    city: Optional[str] = None
    place_name: str
    latitude: float
    longitude: float
    altitude: Optional[str] = None
    description: str
    cover_image_url: str
    featured: bool = False

class LocationUpdate(BaseModel):
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    place_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    altitude: Optional[str] = None
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    featured: Optional[bool] = None
