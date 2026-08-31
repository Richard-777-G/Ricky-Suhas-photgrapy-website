from fastapi import APIRouter, HTTPException
from typing import List
from models.inquiries import Inquiry, InquiryCreate
from lib.db import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/inquiries", tags=["inquiries"])

@router.post("", response_model=Inquiry)
async def create_inquiry(payload: InquiryCreate):
    i_dict = payload.model_dump()
    i_dict["id"] = str(uuid.uuid4())
    i_dict["created_at"] = datetime.utcnow()
    
    inquiry = Inquiry(**i_dict)
    await db.inquiries.insert_one(inquiry.model_dump())
    return inquiry

@router.get("", response_model=List[Inquiry])
async def list_inquiries():
    docs = await db.inquiries.find().sort("created_at", -1).to_list(100)
    return [Inquiry(**doc) for doc in docs]
