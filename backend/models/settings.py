from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SiteSettings(BaseModel):
    id: str = "main_settings"
    site_name: str = "Ricky Suhas"
    brand_title: str = "Ricky Suhas — Digital Visual Exploration & Cinematic Archive"
    motto: str = "Beauty Seeker — Take a moment to enjoy God's creation"
    bio: str = "International Nature Photographer, Cinematographer, and Percussionist dedicated to capturing the raw, sacred beauty of God's earth."
    instagram_url: str = "https://www.instagram.com/rickysuhas/"
    youtube_url: str = "https://www.youtube.com/@Rickysuhas0110"
    facebook_url: Optional[str] = "https://www.facebook.com/rickysuhas"
    contact_email: str = "contact@rickysuhas.com"
    about_text: str = "Ricky Suhas travels across pristine wilderness, cloud forests, and high-altitude sanctuaries to chronicle the untamed elegance of the natural world. Blending visual mastery with the organic pulse of rhythm and percussion, his work captures not merely images, but living atmospheres."
    equipment_text: str = "Sony Alpha 7R V, Sony FX6 Cinema Line, Sony FE 24-70mm f/2.8 GM II, FE 70-200mm f/2.8 GM OSS II, FE 200-600mm f/5.6-6.3 G OSS, DJI Mavic 3 Pro Cine, Zoom F6 Field Recorder."
    percussion_text: str = "Custom Maple Drum Kit, Meinl Byzance Cymbals, Djembe, Handpan in D Celtic Minor, Ambient Acoustic Shakers and tuned organic percussion instruments recorded live on location."
    featured_hero_media_id: Optional[str] = None
    stats: dict = Field(default_factory=lambda: {
        "posts_archived": "372+",
        "countries_documented": "12+",
        "expeditions": "45+",
        "master_films": "18+"
    })
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SiteSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    brand_title: Optional[str] = None
    motto: Optional[str] = None
    bio: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    facebook_url: Optional[str] = None
    contact_email: Optional[str] = None
    about_text: Optional[str] = None
    equipment_text: Optional[str] = None
    percussion_text: Optional[str] = None
    featured_hero_media_id: Optional[str] = None
    stats: Optional[dict] = None
