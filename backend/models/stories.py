from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class Story(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    cover_image_url: str
    location_id: Optional[str] = None
    location_name: Optional[str] = None
    collection_id: Optional[str] = None
    collection_name: Optional[str] = None
    date: str
    read_time: str = "4 min read"
    published: bool = True
    featured: bool = False
    tags: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class StoryCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    cover_image_url: str
    location_id: Optional[str] = None
    collection_id: Optional[str] = None
    date: Optional[str] = None
    read_time: Optional[str] = "4 min read"
    published: bool = True
    featured: bool = False
    tags: List[str] = Field(default_factory=list)

class StoryUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image_url: Optional[str] = None
    location_id: Optional[str] = None
    collection_id: Optional[str] = None
    date: Optional[str] = None
    read_time: Optional[str] = None
    published: Optional[bool] = None
    featured: Optional[bool] = None
    tags: Optional[List[str]] = None
