from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class Inquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    inquiry_type: str = "Commercial Licensing"
    message: str
    location_or_subject: Optional[str] = None
    # Fine art print request fields
    media_id: Optional[str] = None
    media_title: Optional[str] = None
    print_size: Optional[str] = None
    frame_option: Optional[str] = None
    quoted_price: Optional[str] = None
    status: str = "new"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    inquiry_type: str = "Commercial Licensing"
    message: str
    location_or_subject: Optional[str] = None
    media_id: Optional[str] = None
    media_title: Optional[str] = None
    print_size: Optional[str] = None
    frame_option: Optional[str] = None
    quoted_price: Optional[str] = None
