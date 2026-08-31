import asyncio
import hashlib
from datetime import datetime
import os
import uuid
from lib.db import db

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

async def seed_database():
    print("🌱 Seeding Ricky Suhas Visual Exploration Universe...")
    
    # 1. Clear existing collections
    await db.users.delete_many({})
    await db.media.delete_many({})
    await db.collections.delete_many({})
    await db.locations.delete_many({})
    await db.stories.delete_many({})
    await db.settings.delete_many({})
    await db.inquiries.delete_many({})

    # 2. Seed Admin User
    admin_user = {
        "id": str(uuid.uuid4()),
        "email": "admin@rickysuhas.com",
        "name": "Ricky Suhas",
        "role": "admin",
        "password_hash": hash_password("RickySuhas2026!"),
        "created_at": datetime.utcnow()
    }
    await db.users.insert_one(admin_user)
    print("✅ Seeded Admin User: admin@rickysuhas.com")

    # 3. Seed Locations (Geographical dimension)
    loc_wg = {
        "id": "loc_western_ghats",
        "country": "India",
        "region": "Kerala & Karnataka",
        "city": "Wayanad & Agumbe",
        "place_name": "Western Ghats Rainforests",
        "latitude": 10.8505,
        "longitude": 76.2711,
        "altitude": "1,400m - 2,600m",
        "description": "One of the world's eight biodiversity hotspots. Ancient shola grasslands and mist-cloaked rainforest canopies.",
        "cover_image_url": "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "works_count": 8,
        "featured": True,
        "created_at": datetime.utcnow()
    }

    loc_him = {
        "id": "loc_himalayas",
        "country": "India",
        "region": "Ladakh & Kashmir",
        "city": "Pangong & Nubra",
        "place_name": "The High Himalayas",
        "latitude": 34.1526,
        "longitude": 77.5771,
        "altitude": "4,200m - 5,600m",
        "description": "Sovereign mountain ranges, glacial lakes, and cosmic starscapes at the edge of the Tibetan plateau.",
        "cover_image_url": "https://images.unsplash.com/photo-1775755276316-ced9bfc24bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "works_count": 9,
        "featured": True,
        "created_at": datetime.utcnow()
    }

    loc_spiti = {
        "id": "loc_spiti",
        "country": "India",
        "region": "Himachal Pradesh",
        "city": "Kaza & Key Monastery",
        "place_name": "Spiti Valley Cold Desert",
        "latitude": 32.2461,
        "longitude": 78.0349,
        "altitude": "3,800m",
        "description": "The middle land between India and Tibet. Carved by raw winds, dramatic canyon light, and thousand-year monasteries.",
        "cover_image_url": "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "works_count": 7,
        "featured": True,
        "created_at": datetime.utcnow()
    }

    loc_varkala = {
        "id": "loc_varkala",
        "country": "India",
        "region": "Kerala",
        "city": "Varkala & Alleppey",
        "place_name": "Varkala Coastal Cliffs & Backwaters",
        "latitude": 8.7379,
        "longitude": 76.7163,
        "altitude": "Sea Level to 60m",
        "description": "Dramatic red laterite cliffs bordering the Arabian Sea where rhythmic ocean swells meet emerald palms.",
        "cover_image_url": "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "works_count": 6,
        "featured": True,
        "created_at": datetime.utcnow()
    }

    loc_kaziranga = {
        "id": "loc_kaziranga",
        "country": "India",
        "region": "Assam",
        "city": "Golaghat & Nagaon",
        "place_name": "Kaziranga Floodplains",
        "latitude": 26.5775,
        "longitude": 93.1711,
        "altitude": "80m",
        "description": "Dense elephant-grass wetlands nourished by the majestic Brahmaputra River, shelter to untamed giants.",
        "cover_image_url": "https://images.unsplash.com/photo-1675702662605-57e37a8cb2c3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "works_count": 5,
        "featured": True,
        "created_at": datetime.utcnow()
    }

    locations = [loc_wg, loc_him, loc_spiti, loc_varkala, loc_kaziranga]
    await db.locations.insert_many(locations)
    print(f"✅ Seeded {len(locations)} Locations")

    # 4. Seed Collections
    col_1 = {
        "id": "col_western_ghats",
        "title": "Mist Over the Western Ghats",
        "slug": "mist-over-the-western-ghats",
        "subtitle": "An odyssey through ancient cloud canopies and sacred rain",
        "description": "Deep within the shola forests of Southern India, moisture from the Arabian Sea rises over ancient peaks. This collection chronicles morning mist reveals, endemic wildlife, and sacred forest silence.",
        "location_id": "loc_western_ghats",
        "location_name": "Western Ghats Rainforests",
        "cover_image_url": "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
        "date_from": "2024",
        "date_to": "2026",
        "category": "Landscape",
        "featured": True,
        "status": "published",
        "media_count": 8,
        "created_at": datetime.utcnow()
    }

    col_2 = {
        "id": "col_himalayan_silence",
        "title": "The High Himalayan Silence",
        "slug": "the-high-himalayan-silence",
        "subtitle": "Glacial frontiers and celestial night skies at 15,000 feet",
        "description": "Where thin air sharpens the senses and the earth touches the stars. A tribute to the eternal glaciers, cold desert wind, and monasteries perched on stone ridges.",
        "location_id": "loc_himalayas",
        "location_name": "The High Himalayas",
        "cover_image_url": "https://images.unsplash.com/photo-1775755276316-ced9bfc24bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
        "date_from": "2023",
        "date_to": "2025",
        "category": "Aerial",
        "featured": True,
        "status": "published",
        "media_count": 9,
        "created_at": datetime.utcnow()
    }

    col_3 = {
        "id": "col_varkala_rhythms",
        "title": "Varkala Coastal Rhythms",
        "slug": "varkala-coastal-rhythms",
        "subtitle": "Tidal cadences, cliff light, and golden hour swells",
        "description": "Observing the oceanic breath where laterite cliffs drop into crashing surf. A study in coastal movement, reflection, and the percussion of waves.",
        "location_id": "loc_varkala",
        "location_name": "Varkala Coastal Cliffs & Backwaters",
        "cover_image_url": "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
        "date_from": "2024",
        "date_to": "2026",
        "category": "Ocean",
        "featured": True,
        "status": "published",
        "media_count": 6,
        "created_at": datetime.utcnow()
    }

    col_4 = {
        "id": "col_spiti_canyons",
        "title": "Spiti: Valley of Shadow & Sun",
        "slug": "spiti-valley-of-shadow-and-sun",
        "subtitle": "Geometric rock spires, wind-sculpted passes, and prayer flags",
        "description": "The geological wonder of Spiti reveals raw Earth history. High contrasts between blinding sunlight and obsidian canyon shadows.",
        "location_id": "loc_spiti",
        "location_name": "Spiti Valley Cold Desert",
        "cover_image_url": "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
        "date_from": "2024",
        "date_to": "2025",
        "category": "Travel",
        "featured": False,
        "status": "published",
        "media_count": 7,
        "created_at": datetime.utcnow()
    }

    collections = [col_1, col_2, col_3, col_4]
    await db.collections.insert_many(collections)
    print(f"✅ Seeded {len(collections)} Collections")

    # 5. Seed Photography, Films, and Vertical Reels
    media_items = [
        # HERO ANCHOR PHOTO
        {
            "id": "m_hero_anchor",
            "type": "photo",
            "title": "Where Clouds Touch the Forest Canopy",
            "slug": "where-clouds-touch-the-forest-canopy",
            "description": "At 5:45 AM, dense oceanic mist drifted up the Western Ghats ridge, momentarily parting to reveal centuries-old canopy layers untouched by human presence.",
            "short_description": "Mist rolled through the mountain forest just after sunrise, briefly revealing layers of green hidden beneath the clouds.",
            "file_url": "https://images.unsplash.com/photo-1675702662605-57e37a8cb2c3?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
            "thumbnail_url": "https://images.unsplash.com/photo-1675702662605-57e37a8cb2c3?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "width": 3840,
            "height": 2160,
            "capture_date": "October 2025",
            "location_id": "loc_western_ghats",
            "location_name": "Western Ghats Rainforests",
            "collection_id": "col_western_ghats",
            "collection_name": "Mist Over the Western Ghats",
            "category": "Landscape",
            "tags": ["Mist", "Rainforest", "Canopy", "Dawn", "Atmosphere"],
            "featured": True,
            "published": True,
            "sort_order": 1,
            "exif": {
                "camera": "Sony Alpha 7R V",
                "lens": "FE 24-70mm F2.8 GM II",
                "shutter_speed": "1/640s",
                "aperture": "f/5.6",
                "iso": "ISO 100",
                "focal_length": "42mm"
            },
            "created_at": datetime.utcnow()
        },
        {
            "id": "m_himalaya_first_light",
            "type": "photo",
            "title": "First Light on Glacial Spire",
            "slug": "first-light-on-glacial-spire",
            "description": "Standing at minus 12 degrees Celsius as the sun's first ray struck the 6,000-meter apex, transforming cold blue ice into liquid champagne fire.",
            "short_description": "Sub-zero morning air meets the first beam of sunlight, igniting pristine glacial ridges across the Ladakh frontier.",
            "file_url": "https://images.unsplash.com/photo-1775755276316-ced9bfc24bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
            "thumbnail_url": "https://images.unsplash.com/photo-1775755276316-ced9bfc24bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "width": 3840,
            "height": 2560,
            "capture_date": "September 2025",
            "location_id": "loc_himalayas",
            "location_name": "The High Himalayas",
            "collection_id": "col_himalayan_silence",
            "collection_name": "The High Himalayan Silence",
            "category": "Landscape",
            "tags": ["Himalayas", "Glacier", "Sunrise", "Subzero", "Peak"],
            "featured": True,
            "published": True,
            "sort_order": 2,
            "exif": {
                "camera": "Sony Alpha 7R V",
                "lens": "FE 70-200mm F2.8 GM OSS II",
                "shutter_speed": "1/1000s",
                "aperture": "f/4.0",
                "iso": "ISO 100",
                "focal_length": "135mm"
            },
            "created_at": datetime.utcnow()
        },
        {
            "id": "m_foggy_forest_path",
            "type": "photo",
            "title": "Sacred Path of the Monsoon",
            "slug": "sacred-path-of-the-monsoon",
            "description": "A quiet mossy corridor in Wayanad where rainwater creates temporary musical tributaries across ancient tree roots.",
            "short_description": "Rain-washed emerald canopies form natural cathedral arches over centuries-old forest pathways in Wayanad.",
            "file_url": "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
            "thumbnail_url": "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "width": 3840,
            "height": 2560,
            "capture_date": "August 2025",
            "location_id": "loc_western_ghats",
            "location_name": "Western Ghats Rainforests",
            "collection_id": "col_western_ghats",
            "collection_name": "Mist Over the Western Ghats",
            "category": "Landscape",
            "tags": ["Monsoon", "Emerald", "Rainforest", "Wayanad"],
            "featured": True,
            "published": True,
            "sort_order": 3,
            "exif": {
                "camera": "Sony Alpha 7R V",
                "lens": "FE 24-70mm F2.8 GM II",
                "shutter_speed": "1/250s",
                "aperture": "f/2.8",
                "iso": "ISO 200",
                "focal_length": "28mm"
            },
            "created_at": datetime.utcnow()
        },
        {
            "id": "m_varkala_aerial_cliff",
            "type": "photo",
            "title": "Red Cliffs of the Arabian Sea",
            "slug": "red-cliffs-of-the-arabian-sea",
            "description": "Aerial view looking down at Varkala's distinctive red laterite formations as afternoon waves break into foaming lace.",
            "short_description": "Towering red laterite cliffs stand guard against the endless rhythmic surf of the southern coast.",
            "file_url": "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
            "thumbnail_url": "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "width": 3840,
            "height": 2160,
            "capture_date": "November 2025",
            "location_id": "loc_varkala",
            "location_name": "Varkala Coastal Cliffs & Backwaters",
            "collection_id": "col_varkala_rhythms",
            "collection_name": "Varkala Coastal Rhythms",
            "category": "Aerial",
            "tags": ["Aerial", "Cliffs", "Ocean", "Varkala", "Drone"],
            "featured": True,
            "published": True,
            "sort_order": 4,
            "exif": {
                "camera": "DJI Mavic 3 Pro Cine",
                "lens": "Hasselblad 24mm f/2.8",
                "shutter_speed": "1/1250s",
                "aperture": "f/4.0",
                "iso": "ISO 100",
                "focal_length": "24mm eq"
            },
            "created_at": datetime.utcnow()
        },
        {
            "id": "m_spiti_sunset_glow",
            "type": "photo",
            "title": "Canyon Shadows in Spiti",
            "slug": "canyon-shadows-in-spiti",
            "description": "As the sun dips behind the trans-Himalayan divide, geological strata carved across millions of years glow in rich bronze and umber.",
            "short_description": "Late evening warmth paints the dramatic sediment layers of Spiti's cold mountain canyons.",
            "file_url": "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
            "thumbnail_url": "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "width": 3840,
            "height": 2560,
            "capture_date": "July 2025",
            "location_id": "loc_spiti",
            "location_name": "Spiti Valley Cold Desert",
            "collection_id": "col_spiti_canyons",
            "collection_name": "Spiti: Valley of Shadow & Sun",
            "category": "Landscape",
            "tags": ["Spiti", "Canyon", "Sunset", "Geology"],
            "featured": False,
            "published": True,
            "sort_order": 5,
            "exif": {
                "camera": "Sony Alpha 7R V",
                "lens": "FE 24-70mm F2.8 GM II",
                "shutter_speed": "1/400s",
                "aperture": "f/8.0",
                "iso": "ISO 100",
                "focal_length": "50mm"
            },
            "created_at": datetime.utcnow()
        },
        {
            "id": "m_mountain_clouds_peak",
            "type": "photo",
            "title": "The Sovereign Peak at Twilight",
            "slug": "the-sovereign-peak-at-twilight",
            "description": "Wisps of high-altitude clouds wrap around jagged pinnacles like sacred silk as twilight turns the atmosphere deep indigo.",
            "short_description": "Alpine clouds drift silently across sharp rocky pinnacles as twilight envelopes the mountain range.",
            "file_url": "https://images.unsplash.com/photo-1760368799560-8e9c32c77223?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
            "thumbnail_url": "https://images.unsplash.com/photo-1760368799560-8e9c32c77223?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "width": 3840,
            "height": 2560,
            "capture_date": "September 2025",
            "location_id": "loc_himalayas",
            "location_name": "The High Himalayas",
            "collection_id": "col_himalayan_silence",
            "collection_name": "The High Himalayan Silence",
            "category": "Landscape",
            "tags": ["Twilight", "Pinnacle", "Altitude", "Silence"],
            "featured": True,
            "published": True,
            "sort_order": 6,
            "exif": {
                "camera": "Sony Alpha 7R V",
                "lens": "FE 70-200mm F2.8 GM OSS II",
                "shutter_speed": "1/200s",
                "aperture": "f/4.0",
                "iso": "ISO 400",
                "focal_length": "180mm"
            },
            "created_at": datetime.utcnow()
        },
        {
            "id": "m_wildlife_monarch",
            "type": "photo",
            "title": "Guardian of the Wet Grasslands",
            "slug": "guardian-of-the-wet-grasslands",
            "description": "Emerging from pre-dawn fog in Kaziranga, an Indian one-horned rhinoceros grazing in dew-soaked elephant grass.",
            "short_description": "A prehistoric silhouette emerges from morning river fog along the Brahmaputra floodplain.",
            "file_url": "https://images.unsplash.com/photo-1549223565-49541e8416dc?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
            "thumbnail_url": "https://images.unsplash.com/photo-1549223565-49541e8416dc?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "width": 3840,
            "height": 2560,
            "capture_date": "January 2025",
            "location_id": "loc_kaziranga",
            "location_name": "Kaziranga Floodplains",
            "collection_id": None,
            "category": "Wildlife",
            "tags": ["Wildlife", "Assam", "Fog", "Raw"],
            "featured": True,
            "published": True,
            "sort_order": 7,
            "exif": {
                "camera": "Sony Alpha 7R V",
                "lens": "FE 200-600mm F5.6-6.3 G OSS",
                "shutter_speed": "1/1600s",
                "aperture": "f/6.3",
                "iso": "ISO 800",
                "focal_length": "450mm"
            },
            "created_at": datetime.utcnow()
        },
        {
            "id": "m_macro_rain_dew",
            "type": "photo",
            "title": "Rainforest Microcosm: Dawn Dew",
            "slug": "rainforest-microcosm-dawn-dew",
            "description": "Each miniature drop contains an inverted world of the overhead canopy, reflecting God's intricate micro-architecture.",
            "short_description": "Pristine dew drops balanced on endemic fern fronds reveal tiny mirrored landscapes of the forest floor.",
            "file_url": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
            "thumbnail_url": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
            "width": 3840,
            "height": 2560,
            "capture_date": "July 2025",
            "location_id": "loc_western_ghats",
            "location_name": "Western Ghats Rainforests",
            "collection_id": "col_western_ghats",
            "collection_name": "Mist Over the Western Ghats",
            "category": "Macro",
            "tags": ["Macro", "Dew", "Rain", "Geometry"],
            "featured": False,
            "published": True,
            "sort_order": 8,
            "exif": {
                "camera": "Sony Alpha 7R V",
                "lens": "FE 90mm F2.8 Macro G OSS",
                "shutter_speed": "1/500s",
                "aperture": "f/5.6",
                "iso": "ISO 200",
                "focal_length": "90mm"
            },
            "created_at": datetime.utcnow()
        },
        
        # 6 CINEMATIC 4K FILMS
        {
            "id": "film_western_ghats_odyssey",
            "type": "video",
            "title": "THE BREATH OF THE CANOPY",
            "slug": "the-breath-of-the-canopy",
            "description": "An 8-minute 4K documentary capturing the arrival of the southwest monsoon over the Western Ghats mountain spine. Features live acoustic handpan and percussion soundscapes recorded on location.",
            "short_description": "A cinematic pilgrimage into India's oldest rainforests where monsoon cloudscapes meet ancient rhythms.",
            "file_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
            "duration": "07:45",
            "capture_date": "2025",
            "location_id": "loc_western_ghats",
            "location_name": "Western Ghats Rainforests",
            "collection_id": "col_western_ghats",
            "collection_name": "Mist Over the Western Ghats",
            "category": "Landscape",
            "tags": ["4K Film", "Cinematic", "Monsoon", "Soundscape"],
            "featured": True,
            "published": True,
            "sort_order": 1,
            "source_url": "https://www.youtube.com/@Rickysuhas0110",
            "created_at": datetime.utcnow()
        },
        {
            "id": "film_himalayan_silence",
            "type": "video",
            "title": "BETWEEN SKY AND STONE",
            "slug": "between-sky-and-stone",
            "description": "Filmed across remote passes in Ladakh and Spiti. Exploring the sacred relationship between mountain solitude, high winds, and internal silence.",
            "short_description": "High altitude cinematography across remote Himalayan ridgelines and ancient Tibetan monasteries.",
            "file_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1775755276316-ced9bfc24bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
            "duration": "11:20",
            "capture_date": "2025",
            "location_id": "loc_himalayas",
            "location_name": "The High Himalayas",
            "collection_id": "col_himalayan_silence",
            "collection_name": "The High Himalayan Silence",
            "category": "Aerial",
            "tags": ["Himalayas", "Documentary", "Glacial", "4K"],
            "featured": True,
            "published": True,
            "sort_order": 2,
            "source_url": "https://www.youtube.com/@Rickysuhas0110",
            "created_at": datetime.utcnow()
        },
        {
            "id": "film_varkala_swells",
            "type": "video",
            "title": "TIDES OF GOD'S CREATION",
            "slug": "tides-of-gods-creation",
            "description": "Slow-motion 120fps study of ocean swells crashing against basalt rocks, scored to polyrhythmic percussion compositions by Ricky Suhas.",
            "short_description": "High frame-rate oceanic visual study exploring the fluid percussion of the Arabian sea.",
            "file_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
            "duration": "05:12",
            "capture_date": "2025",
            "location_id": "loc_varkala",
            "location_name": "Varkala Coastal Cliffs & Backwaters",
            "collection_id": "col_varkala_rhythms",
            "collection_name": "Varkala Coastal Rhythms",
            "category": "Ocean",
            "tags": ["Ocean", "Percussion", "120fps", "SlowMotion"],
            "featured": True,
            "published": True,
            "sort_order": 3,
            "source_url": "https://www.youtube.com/@Rickysuhas0110",
            "created_at": datetime.utcnow()
        },
        
        # 6 VERTICAL 9:16 REELS
        {
            "id": "reel_monsoon_drop",
            "type": "reel",
            "title": "5:30 AM in the Cloud Canopy 🌧️",
            "slug": "530-am-in-the-cloud-canopy",
            "description": "Take a moment to listen to the rain. Raw audio recorded in the high ridges of Wayanad.",
            "short_description": "Waking up before dawn as dense mountain mist engulfs the forest treehouse.",
            "file_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
            "duration": "00:45",
            "location_id": "loc_western_ghats",
            "location_name": "Western Ghats Rainforests",
            "collection_id": "col_western_ghats",
            "collection_name": "Mist Over the Western Ghats",
            "category": "Landscape",
            "tags": ["Reel", "Rain", "Audio", "Wayanad"],
            "featured": True,
            "published": True,
            "sort_order": 1,
            "source_url": "https://www.instagram.com/rickysuhas/",
            "created_at": datetime.utcnow()
        },
        {
            "id": "reel_spiti_timelapse",
            "type": "reel",
            "title": "Milky Way Rising Over Key Monastery ✨",
            "slug": "milky-way-rising-over-key-monastery",
            "description": "Zero light pollution at 4,000 meters altitude. 600 RAW frames compressed into pure cosmic motion.",
            "short_description": "Cosmic time-lapse tracking the galactic core over the ancient 1000-year Key Monastery.",
            "file_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
            "duration": "00:30",
            "location_id": "loc_spiti",
            "location_name": "Spiti Valley Cold Desert",
            "collection_id": "col_spiti_canyons",
            "collection_name": "Spiti: Valley of Shadow & Sun",
            "category": "Travel",
            "tags": ["Reel", "MilkyWay", "Astrophotography", "Spiti"],
            "featured": True,
            "published": True,
            "sort_order": 2,
            "source_url": "https://www.instagram.com/rickysuhas/",
            "created_at": datetime.utcnow()
        },
        {
            "id": "reel_percussion_nature",
            "type": "reel",
            "title": "Percussion x Mountain Echoes 🥁",
            "slug": "percussion-x-mountain-echoes",
            "description": "Recording handpan and organic rhythms live overlooking the valley at sunset. When nature joins the rhythm.",
            "short_description": "Harmonizing acoustic handpan grooves with evening birdsong and valley winds.",
            "file_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1549223565-49541e8416dc?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
            "duration": "00:55",
            "location_id": "loc_western_ghats",
            "location_name": "Western Ghats Rainforests",
            "collection_id": None,
            "category": "Other",
            "tags": ["Percussion", "Handpan", "Musician", "Rhythm"],
            "featured": True,
            "published": True,
            "sort_order": 3,
            "source_url": "https://www.instagram.com/rickysuhas/",
            "created_at": datetime.utcnow()
        },
        {
            "id": "reel_varkala_sunset_wave",
            "type": "reel",
            "title": "The Golden Swell in Slow Motion 🌊",
            "slug": "the-golden-swell-in-slow-motion",
            "description": "Watch until the end for the light refraction through the crest.",
            "short_description": "Pure amber light refracting through sunset ocean spray along Varkala beach.",
            "file_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            "thumbnail_url": "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
            "duration": "00:25",
            "location_id": "loc_varkala",
            "location_name": "Varkala Coastal Cliffs & Backwaters",
            "collection_id": "col_varkala_rhythms",
            "collection_name": "Varkala Coastal Rhythms",
            "category": "Ocean",
            "tags": ["Reel", "Ocean", "Sunset", "Varkala"],
            "featured": True,
            "published": True,
            "sort_order": 4,
            "source_url": "https://www.instagram.com/rickysuhas/",
            "created_at": datetime.utcnow()
        }
    ]

    await db.media.insert_many(media_items)
    print(f"✅ Seeded {len(media_items)} Media Items (Photos, Films, Reels)")

    # 6. Seed Field Notes / Journal Stories
    stories = [
        {
            "id": "story_wayanad_monsoon",
            "title": "Percussion of the Monsoon: Field Recording in Wayanad",
            "slug": "percussion-of-the-monsoon-field-recording-in-wayanad",
            "excerpt": "When the southwest monsoon breaks over the Western Ghats, the forest doesn't just receive water—it begins to play music.",
            "content": """The air in Wayanad at 5:00 AM carries the metallic tang of approaching thunder. As a photographer, your natural instinct is to protect the lenses from moisture. But as a percussionist, the rain is an orchestra.

We set up three binaural microphones under a canopy of wild teak and fern. The initial drops fell slowly—steady quarter-notes tapping against broad leaves. Within ten minutes, the tempo doubled. Rhythms layered upon rhythms: deep bass resonances as water cascaded into hollow logs, high shimmering white noise as thousands of needles struck bamboo stalks.

In nature photography, we spend hours waiting for light. But when you close your eyes and listen, you realize that every visual landscape has an acoustic signature. Beauty Seeker isn't just about what the camera sees—it is about taking a moment to absorb God's creation in its fullness.""",
            "cover_image_url": "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
            "location_id": "loc_western_ghats",
            "location_name": "Western Ghats Rainforests",
            "collection_id": "col_western_ghats",
            "collection_name": "Mist Over the Western Ghats",
            "date": "October 14, 2025",
            "read_time": "5 min read",
            "published": True,
            "featured": True,
            "tags": ["Field Notes", "Monsoon", "Soundscapes", "Western Ghats"],
            "created_at": datetime.utcnow()
        },
        {
            "id": "story_spiti_first_light",
            "title": "Chasing First Light at 15,000 Feet in Spiti Valley",
            "slug": "chasing-first-light-at-15000-feet-in-spiti-valley",
            "excerpt": "In the cold desert of Spiti, silence has weight. At sub-zero dawn, the world strips away all superficial noise.",
            "content": """At 4:15 AM, the thermometer read -14°C inside the tent. Operating mechanical dials on modern cinema cameras with heavy thermal gloves is an exercise in patience. 

We positioned our tripod on an exposed cliff edge overlooking the Spiti River bed. Below us lay Key Monastery, ancient and silent under the last dying stars. When the sun finally breached the eastern ridge, it didn't warm the air immediately—it illuminated the dust motes and ice crystals floating between the peaks.

The light in high-altitude cold deserts is unlike anywhere else on earth. There is no moisture to diffuse the shadows. The contrast is raw and sovereign. You are reminded of how small our human ambitions are compared to the timeless stone around us.""",
            "cover_image_url": "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
            "location_id": "loc_spiti",
            "location_name": "Spiti Valley Cold Desert",
            "collection_id": "col_spiti_canyons",
            "collection_name": "Spiti: Valley of Shadow & Sun",
            "date": "August 22, 2025",
            "read_time": "6 min read",
            "published": True,
            "featured": True,
            "tags": ["Expedition", "Spiti", "Astrophotography", "Silence"],
            "created_at": datetime.utcnow()
        }
    ]

    await db.stories.insert_many(stories)
    print(f"✅ Seeded {len(stories)} Stories / Field Notes")

    # 7. Seed Site Settings
    settings = {
        "id": "main_settings",
        "site_name": "Ricky Suhas",
        "brand_title": "Ricky Suhas — Digital Visual Exploration & Cinematic Archive",
        "motto": "Beauty Seeker — Take a moment to enjoy God's creation",
        "bio": "International Nature Photographer, Cinematographer, and Percussionist dedicated to capturing the raw, sacred beauty of God's earth.",
        "instagram_url": "https://www.instagram.com/rickysuhas/",
        "youtube_url": "https://www.youtube.com/@Rickysuhas0110",
        "facebook_url": "https://www.facebook.com/rickysuhas",
        "contact_email": "contact@rickysuhas.com",
        "about_text": "Ricky Suhas traverses mist-shrouded rainforests, high-altitude trans-Himalayan frontiers, and rugged coastal cliffs to chronicle the untamed elegance of the natural world. Combining visual storytelling with the acoustic pulse of live organic percussion, his work invites you to pause, breathe, and witness the majesty of creation.",
        "equipment_text": "Sony Alpha 7R V (61MP Full-Frame), Sony FX6 Full-Frame Cinema Line, Sony FE 24-70mm f/2.8 GM II, FE 70-200mm f/2.8 GM OSS II, FE 200-600mm f/5.6-6.3 G OSS, FE 90mm f/2.8 Macro G, DJI Mavic 3 Pro Cine (Apple ProRes 422 HQ), Zoom F6 32-bit Float Field Recorder.",
        "percussion_text": "Custom Maple Acoustic Drums, Meinl Byzance Cymbals, Handpan in D Celtic Minor, Djembe, West African Udu, and tuned organic shakers recorded on-location in wilderness environments.",
        "featured_hero_media_id": "m_hero_anchor",
        "stats": {
            "posts_archived": "372+",
            "countries_documented": "12+",
            "expeditions": "45+",
            "master_films": "18+"
        },
        "updated_at": datetime.utcnow()
    }

    await db.settings.insert_one(settings)
    print("✅ Seeded Site Settings & Social Hub Links")
    print("🎉 Seed complete! All collections initialized successfully.")

if __name__ == "__main__":
    asyncio.run(seed_database())
