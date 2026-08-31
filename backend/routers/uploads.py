from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
import uuid
from pathlib import Path
import shutil

router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = Path("/app/backend/uploaded_media")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("")
async def upload_file(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    ext = Path(file.filename or "").suffix.lower()
    if not ext:
        ext = ".jpg"
        
    unique_filename = f"{uuid.uuid4()}{ext}"
    dest_path = UPLOAD_DIR / unique_filename
    
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Return relative URL
    file_url = f"/api/uploads/files/{unique_filename}"
    return {
        "file_url": file_url,
        "filename": unique_filename,
        "original_name": file.filename,
        "content_type": file.content_type,
        "size": os.path.getsize(dest_path)
    }

@router.get("/files/{filename}")
async def serve_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
