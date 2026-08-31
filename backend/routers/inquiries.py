from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.inquiries import Inquiry, InquiryCreate, InquiryQuote, InquiryStatusUpdate
from lib.db import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


@router.post("", response_model=Inquiry)
async def create_inquiry(payload: InquiryCreate):
    i_dict = payload.model_dump()
    i_dict["id"] = str(uuid.uuid4())
    i_dict["created_at"] = datetime.utcnow()
    i_dict["status"] = "new"

    # Attach the artwork thumbnail so the Studio inbox can show what was requested
    if payload.media_id and not payload.media_thumbnail:
        media = await db.media.find_one({"id": payload.media_id})
        if media:
            i_dict["media_thumbnail"] = media.get("thumbnail_url") or media.get("file_url")

    inquiry = Inquiry(**i_dict)
    await db.inquiries.insert_one(inquiry.model_dump())
    return inquiry


@router.get("", response_model=List[Inquiry])
async def list_inquiries(inquiry_type: Optional[str] = None, status: Optional[str] = None):
    query = {}
    if inquiry_type:
        query["inquiry_type"] = inquiry_type
    if status and status != "all":
        query["status"] = status

    docs = await db.inquiries.find(query).sort("created_at", -1).to_list(200)
    return [Inquiry(**doc) for doc in docs]


@router.get("/stats")
async def inquiry_stats():
    total = await db.inquiries.count_documents({})
    new = await db.inquiries.count_documents({"status": "new"})
    quoted = await db.inquiries.count_documents({"status": "quoted"})
    fulfilled = await db.inquiries.count_documents({"status": "fulfilled"})
    prints = await db.inquiries.count_documents({"inquiry_type": "Fine Art Print"})
    return {
        "total": total,
        "new": new,
        "quoted": quoted,
        "fulfilled": fulfilled,
        "print_requests": prints,
    }


@router.post("/{id}/quote", response_model=Inquiry)
async def send_quote(id: str, payload: InquiryQuote):
    doc = await db.inquiries.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    update = {
        "quote_amount": payload.quote_amount,
        "quote_message": payload.quote_message
        or f"Thank you for your interest. Your print is available at {payload.quote_amount}, including archival packaging and insured shipping.",
        "status": payload.status or "quoted",
        "replied_at": datetime.utcnow(),
    }
    await db.inquiries.update_one({"id": id}, {"$set": update})
    updated = await db.inquiries.find_one({"id": id})
    return Inquiry(**updated)


@router.patch("/{id}", response_model=Inquiry)
async def update_inquiry_status(id: str, payload: InquiryStatusUpdate):
    doc = await db.inquiries.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    await db.inquiries.update_one({"id": id}, {"$set": {"status": payload.status}})
    updated = await db.inquiries.find_one({"id": id})
    return Inquiry(**updated)


@router.delete("/{id}")
async def delete_inquiry(id: str):
    doc = await db.inquiries.find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    await db.inquiries.delete_one({"id": id})
    return {"message": "Inquiry deleted"}
