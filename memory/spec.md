# Ricky Suhas — Digital Visual Exploration Platform & Cinematic Archive
Living Product Specification & Architecture Document

## Overview
A world-class digital visual archive and spatial exploration platform for **Ricky Suhas** (`@rickysuhas`), International Nature Photographer, Videographer, and Percussionist.
Brand Identity & Philosophy: **"Beauty Seeker — Take a moment to enjoy God's creation 🌍"**.

## Core Capabilities & Features
1. **Cinematic Hero**:
   - Single breathtaking anchor visual, atmospheric particles, ambient soundscape toggle, live camera telemetry / EXIF, and spatial entrance.
2. **Explore & Curated Archives**:
   - Filterable by MediaType (All, Photography, Cinematic Films, Vertical Reels), Category (Landscape, Wildlife, Aerial, Macro, Ocean, Travel), Tags, Collections, and Locations.
3. **Editorial Photography Grid & Spatial Fullscreen Viewer**:
   - Dynamic asymmetric layout.
   - Spatial fullscreen viewer with 2-line descriptions, EXIF drawer (shutter, aperture, ISO, lens), Prev/Next arrow navigation, keyboard controls, and collection links.
4. **Cinematic 4K Films Player**:
   - Film showcases with runtime badges, soundscape details, and immersive player with ambient canvas glow.
5. **Vertical 9:16 Reels**:
   - Mobile-first aspect ratio cards with play/pause, mute/unmute, captions, and links.
6. **Interactive Spatial Places & Topographical World Map**:
   - Interactive spatial map with location nodes (Western Ghats, Spiti Valley, Himalayas, Coastal Kerala, Kaziranga, etc.), coordinate readouts, altitude, work counts, and geographical drill-downs.
7. **Curated Collections**:
   - Deep story collections with cover hero, location badges, date ranges, and associated photography, films, and reels.
8. **Stories / Field Notes Journal**:
   - Editorial articles documenting expeditions, weather, sacred moments, and percussion rhythms in nature.
9. **Editorial About Ricky**:
   - Dual identity: Nature Visualist & Percussionist.
   - Equipment loadout (cameras, optical lenses, field audio recorders, percussion instruments).
10. **Social Hub & Contact**:
    - Live links to Instagram (`https://www.instagram.com/rickysuhas/`), YouTube (`https://www.youtube.com/@Rickysuhas0110`), and Facebook.
    - Professional inquiry form for Commercial, Print, Expedition & Film licensing.
11. **Full Admin Studio CMS**:
    - Authenticated management dashboard (`admin@rickysuhas.com` / `RickySuhas2026!`).
    - Single and Drag-and-Drop Bulk media upload with batch metadata tagging, location/collection assigner, draft/publish status, and 2-line description editor.
    - Collections manager, Places manager, Stories manager, and Site settings editor.
12. **Theme Modes**:
    - Dark Obsidian Luxury (`#050607`) default & Warm Ivory (`#F2F0EA`) light mode.

## Data Model
- **Media**: `id`, `type` (photo | video | reel), `title`, `slug`, `description`, `short_description` (2-line), `file_url`, `thumbnail_url`, `width`, `height`, `duration`, `capture_date`, `location_id`, `collection_id`, `category`, `tags`, `featured`, `published`, `exif` (camera, lens, shutter, aperture, iso), `created_at`
- **Collections**: `id`, `title`, `slug`, `description`, `location_id`, `cover_image_url`, `date_from`, `date_to`, `category`, `featured`, `status`, `created_at`
- **Locations**: `id`, `country`, `region`, `city`, `place_name`, `latitude`, `longitude`, `description`, `cover_image_url`, `works_count`, `featured`
- **Stories**: `id`, `title`, `slug`, `excerpt`, `content`, `cover_image_url`, `location_id`, `collection_id`, `date`, `read_time`, `published`
- **SiteSettings**: `site_name`, `motto`, `bio`, `instagram_url`, `youtube_url`, `facebook_url`, `contact_email`, `about_text`, `equipment_text`, `percussion_text`
- **Users**: `id`, `email`, `name`, `password_hash`, `role`

## Credentials
- **Admin**: `admin@rickysuhas.com` / `RickySuhas2026!`
