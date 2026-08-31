# Ricky Suhas — Digital Visual Exploration Platform & Cinematic Archive
Living Product Specification & Architecture Document

## Overview
A world-class digital visual archive and spatial exploration platform for **Ricky Suhas** (`@rickysuhas`), International Nature Photographer, Videographer, and Percussionist.
Brand Identity & Philosophy: **"Beauty Seeker — Take a moment to enjoy God's creation"** (no emoji in UI copy — intentional).

## Public Experience (World A — Discovery)
1. **Cinematic Hero** — one anchor photograph with slow drift + scroll parallax, letter-by-letter name emergence, optical telemetry HUD (EXIF), magnetic CTAs.
2. **Motion System** (`components/Motion.tsx`) — shared primitives, all respecting `prefers-reduced-motion`:
   - `Reveal` (scroll-triggered blur/rise), `AnimatedHeading` (word-by-word type emergence), `Magnetic` (cursor attraction), `TiltCard` (3D perspective + cursor-tracked sheen), `ParallaxLayer` (depth-plane scroll), `ScrollProgressRail`, `useLockBodyScroll`.
3. **Editorial Photography Grid** — deliberate asymmetric rhythm (wide / portrait / portrait / wide / trio), not a uniform grid.
4. **Spatial Photo Viewer** — fullscreen, 2-line description, EXIF drawer, prev/next + keyboard arrows, collection link, body-scroll locked.
5. **Parallax Philosophy Section** — "Take a moment. Look closer." with count-up statistics.
6. **Topographical World Explorer** (`components/InteractiveMap.tsx`) — real SVG relief map: coastline/border silhouette projected from true `[lon, lat]` pairs (equirectangular), ocean-shelf halo, nested elevation contours, Himalayan/Western Ghats ridge strokes, animated great-circle expedition arcs, sonar-pulse location nodes sized by work count, coordinate tooltips, HUD readouts. Location pins and landmass share one projection so pins land correctly.
7. **Cinematic Films** — featured stage + secondary strip; player uses `preload="metadata"` (no autoplay) and locks body scroll to eliminate scroll-stutter.
8. **Vertical Reels** — 9:16 tilt cards; player autoplays muted with mute/pause controls.
9. **Collections** — cinematic covers; detail page has per-collection **Ambient Score**.
10. **Fine Art Print Room** (`/prints`) — 5 sizes × 4 framing finishes, live framed preview, **inquiry-only** (no payment taken); requests land in the Studio as `Fine Art Print` inquiries.
11. **Archive Search Palette** — ⌘K / Ctrl+K or navbar button; universal search across media, collections and places with smart related-tag suggestions and category facets.
12. **Journal**, **About** (photographer + percussionist), **Social Hub**, **Contact inquiry form**.
13. **Themes** — Dark Obsidian (`#050607`) cinematic + warm Ivory (`#F2F0EA`) museum/editorial light mode (not an inversion).

## Ambient Score System (`components/AmbientScore.tsx`)
Procedural Web Audio percussion — no audio assets. Each category maps to its own handpan tuning/tempo:
Landscape → D Celtic Minor · Ocean → A Kurd · Aerial → F Pygmy · Travel → E Amara · Wildlife → G Hijaz.
Struck-metal synthesis (sine + triangle partials, fast attack/long decay) through lowpass + delay feedback; sparse slow phrasing.

## Admin Studio (World B — Management)
`/admin` login → dashboard, media library CRUD (publish/feature/edit/delete), **bulk drag-and-drop upload** with shared batch metadata + per-file title/2-line description, collections, places, journal, site settings.
Sign-out returns to the public site; login screen has a **Back to Site** link.

## Data Model
- **Media**: `id, type (photo|video|reel), title, slug, description, short_description, file_url, thumbnail_url, width, height, duration, capture_date, location_id/name, collection_id/name, category, tags[], featured, published, sort_order, exif{camera,lens,shutter_speed,aperture,iso,focal_length}, source_url, created_at, updated_at`
- **Collections**: `id, title, slug, description, subtitle, location_id/name, cover_image_url, date_from, date_to, category, featured, status, media_count`
- **Locations**: `id, country, region, city, place_name, latitude, longitude, altitude, description, cover_image_url, works_count, featured`
- **Stories**: `id, title, slug, excerpt, content, cover_image_url, location_id, collection_id, date, read_time, published, featured, tags[]`
- **Inquiries**: `id, name, email, inquiry_type, message, location_or_subject, media_id, media_title, print_size, frame_option, quoted_price, status, created_at`
- **SiteSettings**: identity, motto, bio, about/equipment/percussion text, social URLs, contact email, stats
- **Users**: `id, email, name, password_hash, role`

## API (all on `api_router`, prefix `/api`)
`/auth/{login,me,logout}` · `/media` (+`/bulk`, `/bulk-tags`, `/{id}`) · `/collections` · `/locations` (+`/spatial-map`) · `/stories` · `/settings` (+`/dashboard-stats`) · `/inquiries` · `/uploads` · `/ai-assist/generate-description` · `/discovery/{facets,search}`

## Storage
Media binaries live on disk via `/api/uploads`; the database stores metadata + references only, so a Cloudinary/S3 swap needs no frontend change.

## Credentials
- **Admin**: `admin@rickysuhas.com` / `RickySuhas2026!`

## Known Deviations
- **Live Instagram/Facebook sync is NOT implemented** — deferred by the client; the website is the master archive and social links are outbound only.
- **Print store takes no payment** — inquiry-only by client choice.
