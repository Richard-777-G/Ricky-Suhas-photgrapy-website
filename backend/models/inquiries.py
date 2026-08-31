from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class Inquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    inquiry_type: str = "Commercial Licensing"  # Commercial Licensing | Fine Art Print | Film Production | Expedition / Collaboration
    message: str
    location_or_subject: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    inquiry_type: str = "Commercial Licensing"
    message: str
    location_or_subject: Optional[str] = None
