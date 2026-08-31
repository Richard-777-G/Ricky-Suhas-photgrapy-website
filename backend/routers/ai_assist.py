from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
import random

router = APIRouter(prefix="/ai-assist", tags=["ai-assist"])

class DescriptionPrompt(BaseModel):
    title: str
    category: Optional[str] = "Landscape"
    location: Optional[str] = None
    elements: Optional[List[str]] = None

class DescriptionResponse(BaseModel):
    title: str
    suggested_short_description: str
    suggested_tags: List[str]

TEMPLATES = {
    "Landscape": [
        "First light fractures across ancient ridgelines, casting deep gold shadows upon the mist.",
        "Layers of cloud drift through the high mountain canopy, revealing emerald valleys below.",
        "A quiet stillness descends as twilight paints the horizon in shades of obsidian and amber."
    ],
    "Wildlife": [
        "A fleeting glance through dense bamboo thickets reveals the silent grace of the predator.",
        "Early morning bird calls echo over still waters as endemic species take flight in unison.",
        "Caught in mid-motion against the golden hour glow, embodying the raw wilderness pulse."
    ],
    "Aerial": [
        "Carved by glacial waters over millennia, the river bends like silver thread through deep ravines.",
        "Geometric patterns of canopy and coastline converge where the mountain range meets the sea.",
        "From high above the cloud deck, sacred peaks pierce the dawn atmosphere with silent majesty."
    ],
    "Ocean": [
        "Rhythmic swells crash against basalt cliffs, leaving glowing bioluminescent spray in the dark.",
        "Monsoon swells roll into the secluded cove, carrying the untamed cadence of the Arabian Sea.",
        "Sunlight filters through coastal mist, turning the endless tidal horizon into liquid silver."
    ],
    "Macro": [
        "Dewdrops cling to fern fronds in the rainforest understory, reflecting miniature dawn skies.",
        "Intricate organic textures and moss gradients revealed under diffused morning rainforest light."
    ]
}

@router.post("/generate-description", response_model=DescriptionResponse)
async def generate_description(payload: DescriptionPrompt):
    category = payload.category or "Landscape"
    templates = TEMPLATES.get(category, TEMPLATES["Landscape"])
    
    selected_desc = random.choice(templates)
    if payload.location:
        selected_desc = f"{selected_desc} Captured in {payload.location}."
        
    tags = ["Nature", category, "BeautySeeker"]
    if payload.location:
        tags.append(payload.location.split(",")[0].strip())
    if payload.elements:
        tags.extend(payload.elements[:3])
        
    return DescriptionResponse(
        title=payload.title,
        suggested_short_description=selected_desc,
        suggested_tags=list(set(tags))
    )
