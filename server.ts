import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import multer from "multer";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Upload directory configuration
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});
const upload = multer({ storage });

function slugify(text: string): string {
  const slug = text.replace(/[^a-zA-Z0-9\s-]/g, "").trim().toLowerCase();
  return slug.replace(/[\s-]+/g, "-");
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// In-Memory Database initialized with seed data
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  password_hash: string;
  created_at: string;
}

interface LocationItem {
  id: string;
  country: string;
  region: string;
  city?: string;
  place_name: string;
  latitude: number;
  longitude: number;
  altitude?: string;
  description: string;
  cover_image_url: string;
  works_count: number;
  featured: boolean;
  created_at: string;
}

interface CollectionItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  location_id?: string | null;
  location_name?: string | null;
  cover_image_url: string;
  date_from?: string;
  date_to?: string;
  category: string;
  featured: boolean;
  status: "published" | "draft";
  media_count: number;
  created_at: string;
  updated_at: string;
}

interface MediaItem {
  id: string;
  type: "photo" | "video" | "reel";
  title: string;
  slug: string;
  description?: string;
  short_description: string;
  file_url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  duration?: string;
  capture_date?: string;
  location_id?: string | null;
  location_name?: string | null;
  collection_id?: string | null;
  collection_name?: string | null;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  exif?: {
    camera?: string;
    lens?: string;
    shutter_speed?: string;
    aperture?: string;
    iso?: string;
    focal_length?: string;
  };
  source_url?: string;
  created_at: string;
  updated_at: string;
}

interface StoryItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  location_id?: string | null;
  location_name?: string | null;
  collection_id?: string | null;
  collection_name?: string | null;
  date: string;
  read_time: string;
  published: boolean;
  featured: boolean;
  tags: string[];
  created_at: string;
}

interface SiteSettings {
  id: string;
  site_name: string;
  brand_title: string;
  motto: string;
  bio: string;
  instagram_url: string;
  youtube_url: string;
  facebook_url?: string;
  contact_email: string;
  about_text: string;
  equipment_text: string;
  percussion_text: string;
  featured_hero_media_id?: string;
  stats: {
    posts_archived?: string;
    countries_documented?: string;
    expeditions?: string;
    master_films?: string;
    [key: string]: string | undefined;
  };
  updated_at: string;
}

interface InquiryItem {
  id: string;
  name: string;
  email: string;
  inquiry_type: string;
  message: string;
  location_or_subject?: string;
  media_id?: string;
  media_title?: string;
  media_thumbnail?: string;
  print_size?: string;
  frame_option?: string;
  quoted_price?: string;
  quote_amount?: string;
  quote_message?: string;
  status: string;
  replied_at?: string;
  created_at: string;
}

interface StatusCheckItem {
  id: string;
  client_name: string;
  timestamp: string;
}

const users: User[] = [
  {
    id: "admin-user-id",
    email: "admin@rickysuhas.com",
    name: "Ricky Suhas",
    role: "admin",
    password_hash: hashPassword("RickySuhas2026!"),
    created_at: new Date().toISOString(),
  },
];

const locations: LocationItem[] = [
  {
    id: "loc_western_ghats",
    country: "India",
    region: "Kerala & Karnataka",
    city: "Wayanad & Agumbe",
    place_name: "Western Ghats Rainforests",
    latitude: 10.8505,
    longitude: 76.2711,
    altitude: "1,400m - 2,600m",
    description: "One of the world's eight biodiversity hotspots. Ancient shola grasslands and mist-cloaked rainforest canopies.",
    cover_image_url: "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    works_count: 8,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "loc_himalayas",
    country: "India",
    region: "Ladakh & Kashmir",
    city: "Pangong & Nubra",
    place_name: "The High Himalayas",
    latitude: 34.1526,
    longitude: 77.5771,
    altitude: "4,200m - 5,600m",
    description: "Sovereign mountain ranges, glacial lakes, and cosmic starscapes at the edge of the Tibetan plateau.",
    cover_image_url: "https://images.unsplash.com/photo-1775755276316-ced9bfc24bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    works_count: 9,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "loc_spiti",
    country: "India",
    region: "Himachal Pradesh",
    city: "Kaza & Key Monastery",
    place_name: "Spiti Valley Cold Desert",
    latitude: 32.2461,
    longitude: 78.0349,
    altitude: "3,800m",
    description: "The middle land between India and Tibet. Carved by raw winds, dramatic canyon light, and thousand-year monasteries.",
    cover_image_url: "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    works_count: 7,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "loc_varkala",
    country: "India",
    region: "Kerala",
    city: "Varkala & Alleppey",
    place_name: "Varkala Coastal Cliffs & Backwaters",
    latitude: 8.7379,
    longitude: 76.7163,
    altitude: "Sea Level to 60m",
    description: "Dramatic red laterite cliffs bordering the Arabian Sea where rhythmic ocean swells meet emerald palms.",
    cover_image_url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    works_count: 6,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "loc_kaziranga",
    country: "India",
    region: "Assam",
    city: "Golaghat & Nagaon",
    place_name: "Kaziranga Floodplains",
    latitude: 26.5775,
    longitude: 93.1711,
    altitude: "80m",
    description: "Dense elephant-grass wetlands nourished by the majestic Brahmaputra River, shelter to untamed giants.",
    cover_image_url: "https://images.unsplash.com/photo-1675702662605-57e37a8cb2c3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    works_count: 5,
    featured: true,
    created_at: new Date().toISOString(),
  },
];

const collections: CollectionItem[] = [
  {
    id: "col_western_ghats",
    title: "Mist Over the Western Ghats",
    slug: "mist-over-the-western-ghats",
    subtitle: "An odyssey through ancient cloud canopies and sacred rain",
    description: "Deep within the shola forests of Southern India, moisture from the Arabian Sea rises over ancient peaks. This collection chronicles morning mist reveals, endemic wildlife, and sacred forest silence.",
    location_id: "loc_western_ghats",
    location_name: "Western Ghats Rainforests",
    cover_image_url: "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    date_from: "2024",
    date_to: "2026",
    category: "Landscape",
    featured: true,
    status: "published",
    media_count: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "col_himalayan_silence",
    title: "The High Himalayan Silence",
    slug: "the-high-himalayan-silence",
    subtitle: "Glacial frontiers and celestial night skies at 15,000 feet",
    description: "Where thin air sharpens the senses and the earth touches the stars. A tribute to the eternal glaciers, cold desert wind, and monasteries perched on stone ridges.",
    location_id: "loc_himalayas",
    location_name: "The High Himalayas",
    cover_image_url: "https://images.unsplash.com/photo-1775755276316-ced9bfc24bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    date_from: "2023",
    date_to: "2025",
    category: "Aerial",
    featured: true,
    status: "published",
    media_count: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "col_varkala_rhythms",
    title: "Varkala Coastal Rhythms",
    slug: "varkala-coastal-rhythms",
    subtitle: "Tidal cadences, cliff light, and golden hour swells",
    description: "Observing the oceanic breath where laterite cliffs drop into crashing surf. A study in coastal movement, reflection, and the percussion of waves.",
    location_id: "loc_varkala",
    location_name: "Varkala Coastal Cliffs & Backwaters",
    cover_image_url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    date_from: "2024",
    date_to: "2026",
    category: "Ocean",
    featured: true,
    status: "published",
    media_count: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "col_spiti_canyons",
    title: "Spiti: Valley of Shadow & Sun",
    slug: "spiti-valley-of-shadow-and-sun",
    subtitle: "Geometric rock spires, wind-sculpted passes, and prayer flags",
    description: "The geological wonder of Spiti reveals raw Earth history. High contrasts between blinding sunlight and obsidian canyon shadows.",
    location_id: "loc_spiti",
    location_name: "Spiti Valley Cold Desert",
    cover_image_url: "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    date_from: "2024",
    date_to: "2025",
    category: "Travel",
    featured: false,
    status: "published",
    media_count: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mediaItems: MediaItem[] = [
  {
    id: "m_hero_anchor",
    type: "photo",
    title: "Where Clouds Touch the Forest Canopy",
    slug: "where-clouds-touch-the-forest-canopy",
    description: "At 5:45 AM, dense oceanic mist drifted up the Western Ghats ridge, momentarily parting to reveal centuries-old canopy layers untouched by human presence.",
    short_description: "Mist rolled through the mountain forest just after sunrise, briefly revealing layers of green hidden beneath the clouds.",
    file_url: "https://images.unsplash.com/photo-1675702662605-57e37a8cb2c3?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
    thumbnail_url: "https://images.unsplash.com/photo-1675702662605-57e37a8cb2c3?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    width: 3840,
    height: 2160,
    capture_date: "October 2025",
    location_id: "loc_western_ghats",
    location_name: "Western Ghats Rainforests",
    collection_id: "col_western_ghats",
    collection_name: "Mist Over the Western Ghats",
    category: "Landscape",
    tags: ["Mist", "Rainforest", "Canopy", "Dawn", "Atmosphere"],
    featured: true,
    published: true,
    sort_order: 1,
    exif: {
      camera: "Sony Alpha 7R V",
      lens: "FE 24-70mm F2.8 GM II",
      shutter_speed: "1/640s",
      aperture: "f/5.6",
      iso: "ISO 100",
      focal_length: "42mm",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m_himalaya_first_light",
    type: "photo",
    title: "First Light on Glacial Spire",
    slug: "first-light-on-glacial-spire",
    description: "Standing at minus 12 degrees Celsius as the sun's first ray struck the 6,000-meter apex, transforming cold blue ice into liquid champagne fire.",
    short_description: "Sub-zero morning air meets the first beam of sunlight, igniting pristine glacial ridges across the Ladakh frontier.",
    file_url: "https://images.unsplash.com/photo-1775755276316-ced9bfc24bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
    thumbnail_url: "https://images.unsplash.com/photo-1775755276316-ced9bfc24bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    width: 3840,
    height: 2560,
    capture_date: "September 2025",
    location_id: "loc_himalayas",
    location_name: "The High Himalayas",
    collection_id: "col_himalayan_silence",
    collection_name: "The High Himalayan Silence",
    category: "Landscape",
    tags: ["Himalayas", "Glacier", "Sunrise", "Subzero", "Peak"],
    featured: true,
    published: true,
    sort_order: 2,
    exif: {
      camera: "Sony Alpha 7R V",
      lens: "FE 70-200mm F2.8 GM OSS II",
      shutter_speed: "1/1000s",
      aperture: "f/4.0",
      iso: "ISO 100",
      focal_length: "135mm",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m_foggy_forest_path",
    type: "photo",
    title: "Sacred Path of the Monsoon",
    slug: "sacred-path-of-the-monsoon",
    description: "A quiet mossy corridor in Wayanad where rainwater creates temporary musical tributaries across ancient tree roots.",
    short_description: "Rain-washed emerald canopies form natural cathedral arches over centuries-old forest pathways in Wayanad.",
    file_url: "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
    thumbnail_url: "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    width: 3840,
    height: 2560,
    capture_date: "August 2025",
    location_id: "loc_western_ghats",
    location_name: "Western Ghats Rainforests",
    collection_id: "col_western_ghats",
    collection_name: "Mist Over the Western Ghats",
    category: "Landscape",
    tags: ["Monsoon", "Emerald", "Rainforest", "Wayanad"],
    featured: true,
    published: true,
    sort_order: 3,
    exif: {
      camera: "Sony Alpha 7R V",
      lens: "FE 24-70mm F2.8 GM II",
      shutter_speed: "1/250s",
      aperture: "f/2.8",
      iso: "ISO 200",
      focal_length: "28mm",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m_varkala_aerial_cliff",
    type: "photo",
    title: "Red Cliffs of the Arabian Sea",
    slug: "red-cliffs-of-the-arabian-sea",
    description: "Aerial view looking down at Varkala's distinctive red laterite formations as afternoon waves break into foaming lace.",
    short_description: "Towering red laterite cliffs stand guard against the endless rhythmic surf of the southern coast.",
    file_url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
    thumbnail_url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    width: 3840,
    height: 2160,
    capture_date: "November 2025",
    location_id: "loc_varkala",
    location_name: "Varkala Coastal Cliffs & Backwaters",
    collection_id: "col_varkala_rhythms",
    collection_name: "Varkala Coastal Rhythms",
    category: "Aerial",
    tags: ["Aerial", "Cliffs", "Ocean", "Varkala", "Drone"],
    featured: true,
    published: true,
    sort_order: 4,
    exif: {
      camera: "DJI Mavic 3 Pro Cine",
      lens: "Hasselblad 24mm f/2.8",
      shutter_speed: "1/1250s",
      aperture: "f/4.0",
      iso: "ISO 100",
      focal_length: "24mm eq",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m_spiti_sunset_glow",
    type: "photo",
    title: "Canyon Shadows in Spiti",
    slug: "canyon-shadows-in-spiti",
    description: "As the sun dips behind the trans-Himalayan divide, geological strata carved across millions of years glow in rich bronze and umber.",
    short_description: "Late evening warmth paints the dramatic sediment layers of Spiti's cold mountain canyons.",
    file_url: "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
    thumbnail_url: "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    width: 3840,
    height: 2560,
    capture_date: "July 2025",
    location_id: "loc_spiti",
    location_name: "Spiti Valley Cold Desert",
    collection_id: "col_spiti_canyons",
    collection_name: "Spiti: Valley of Shadow & Sun",
    category: "Landscape",
    tags: ["Spiti", "Canyon", "Sunset", "Geology"],
    featured: false,
    published: true,
    sort_order: 5,
    exif: {
      camera: "Sony Alpha 7R V",
      lens: "FE 24-70mm F2.8 GM II",
      shutter_speed: "1/400s",
      aperture: "f/8.0",
      iso: "ISO 100",
      focal_length: "50mm",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m_mountain_clouds_peak",
    type: "photo",
    title: "The Sovereign Peak at Twilight",
    slug: "the-sovereign-peak-at-twilight",
    description: "Wisps of high-altitude clouds wrap around jagged pinnacles like sacred silk as twilight turns the atmosphere deep indigo.",
    short_description: "Alpine clouds drift silently across sharp rocky pinnacles as twilight envelopes the mountain range.",
    file_url: "https://images.unsplash.com/photo-1760368799560-8e9c32c77223?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
    thumbnail_url: "https://images.unsplash.com/photo-1760368799560-8e9c32c77223?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    width: 3840,
    height: 2560,
    capture_date: "September 2025",
    location_id: "loc_himalayas",
    location_name: "The High Himalayas",
    collection_id: "col_himalayan_silence",
    collection_name: "The High Himalayan Silence",
    category: "Landscape",
    tags: ["Twilight", "Pinnacle", "Altitude", "Silence"],
    featured: true,
    published: true,
    sort_order: 6,
    exif: {
      camera: "Sony Alpha 7R V",
      lens: "FE 70-200mm F2.8 GM OSS II",
      shutter_speed: "1/200s",
      aperture: "f/4.0",
      iso: "ISO 400",
      focal_length: "180mm",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m_wildlife_monarch",
    type: "photo",
    title: "Guardian of the Wet Grasslands",
    slug: "guardian-of-the-wet-grasslands",
    description: "Emerging from pre-dawn fog in Kaziranga, an Indian one-horned rhinoceros grazing in dew-soaked elephant grass.",
    short_description: "A prehistoric silhouette emerges from morning river fog along the Brahmaputra floodplain.",
    file_url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
    thumbnail_url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    width: 3840,
    height: 2560,
    capture_date: "January 2025",
    location_id: "loc_kaziranga",
    location_name: "Kaziranga Floodplains",
    collection_id: null,
    category: "Wildlife",
    tags: ["Wildlife", "Assam", "Fog", "Raw"],
    featured: true,
    published: true,
    sort_order: 7,
    exif: {
      camera: "Sony Alpha 7R V",
      lens: "FE 200-600mm F5.6-6.3 G OSS",
      shutter_speed: "1/1600s",
      aperture: "f/6.3",
      iso: "ISO 800",
      focal_length: "450mm",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m_macro_rain_dew",
    type: "photo",
    title: "Rainforest Microcosm: Dawn Dew",
    slug: "rainforest-microcosm-dawn-dew",
    description: "Each miniature drop contains an inverted world of the overhead canopy, reflecting God's intricate micro-architecture.",
    short_description: "Pristine dew drops balanced on endemic fern fronds reveal tiny mirrored landscapes of the forest floor.",
    file_url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400",
    thumbnail_url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    width: 3840,
    height: 2560,
    capture_date: "July 2025",
    location_id: "loc_western_ghats",
    location_name: "Western Ghats Rainforests",
    collection_id: "col_western_ghats",
    collection_name: "Mist Over the Western Ghats",
    category: "Macro",
    tags: ["Macro", "Dew", "Rain", "Geometry"],
    featured: false,
    published: true,
    sort_order: 8,
    exif: {
      camera: "Sony Alpha 7R V",
      lens: "FE 90mm F2.8 Macro G OSS",
      shutter_speed: "1/500s",
      aperture: "f/5.6",
      iso: "ISO 200",
      focal_length: "90mm",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Films
  {
    id: "film_western_ghats_odyssey",
    type: "video",
    title: "THE BREATH OF THE CANOPY",
    slug: "the-breath-of-the-canopy",
    description: "An 8-minute 4K documentary capturing the arrival of the southwest monsoon over the Western Ghats mountain spine. Features live acoustic handpan and percussion soundscapes recorded on location.",
    short_description: "A cinematic pilgrimage into India's oldest rainforests where monsoon cloudscapes meet ancient rhythms.",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    duration: "07:45",
    capture_date: "2025",
    location_id: "loc_western_ghats",
    location_name: "Western Ghats Rainforests",
    collection_id: "col_western_ghats",
    collection_name: "Mist Over the Western Ghats",
    category: "Landscape",
    tags: ["4K Film", "Cinematic", "Monsoon", "Soundscape"],
    featured: true,
    published: true,
    sort_order: 1,
    source_url: "https://www.youtube.com/@Rickysuhas0110",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "film_himalayan_silence",
    type: "video",
    title: "BETWEEN SKY AND STONE",
    slug: "between-sky-and-stone",
    description: "Filmed across remote passes in Ladakh and Spiti. Exploring the sacred relationship between mountain solitude, high winds, and internal silence.",
    short_description: "High altitude cinematography across remote Himalayan ridgelines and ancient Tibetan monasteries.",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1775755276316-ced9bfc24bb0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    duration: "11:20",
    capture_date: "2025",
    location_id: "loc_himalayas",
    location_name: "The High Himalayas",
    collection_id: "col_himalayan_silence",
    collection_name: "The High Himalayan Silence",
    category: "Aerial",
    tags: ["Himalayas", "Documentary", "Glacial", "4K"],
    featured: true,
    published: true,
    sort_order: 2,
    source_url: "https://www.youtube.com/@Rickysuhas0110",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "film_varkala_swells",
    type: "video",
    title: "TIDES OF GOD'S CREATION",
    slug: "tides-of-gods-creation",
    description: "Slow-motion 120fps study of ocean swells crashing against basalt rocks, scored to polyrhythmic percussion compositions by Ricky Suhas.",
    short_description: "High frame-rate oceanic visual study exploring the fluid percussion of the Arabian sea.",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    duration: "05:12",
    capture_date: "2025",
    location_id: "loc_varkala",
    location_name: "Varkala Coastal Cliffs & Backwaters",
    collection_id: "col_varkala_rhythms",
    collection_name: "Varkala Coastal Rhythms",
    category: "Ocean",
    tags: ["Ocean", "Percussion", "120fps", "SlowMotion"],
    featured: true,
    published: true,
    sort_order: 3,
    source_url: "https://www.youtube.com/@Rickysuhas0110",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Reels
  {
    id: "reel_monsoon_drop",
    type: "reel",
    title: "5:30 AM in the Cloud Canopy",
    slug: "530-am-in-the-cloud-canopy",
    description: "Take a moment to listen to the rain. Raw audio recorded in the high ridges of Wayanad.",
    short_description: "Waking up before dawn as dense mountain mist engulfs the forest treehouse.",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
    duration: "00:45",
    location_id: "loc_western_ghats",
    location_name: "Western Ghats Rainforests",
    collection_id: "col_western_ghats",
    collection_name: "Mist Over the Western Ghats",
    category: "Landscape",
    tags: ["Reel", "Rain", "Audio", "Wayanad"],
    featured: true,
    published: true,
    sort_order: 1,
    source_url: "https://www.instagram.com/rickysuhas/",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "reel_spiti_timelapse",
    type: "reel",
    title: "Milky Way Rising Over Key Monastery",
    slug: "milky-way-rising-over-key-monastery",
    description: "Zero light pollution at 4,000 meters altitude. 600 RAW frames compressed into pure cosmic motion.",
    short_description: "Cosmic time-lapse tracking the galactic core over the ancient 1000-year Key Monastery.",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
    duration: "00:30",
    location_id: "loc_spiti",
    location_name: "Spiti Valley Cold Desert",
    collection_id: "col_spiti_canyons",
    collection_name: "Spiti: Valley of Shadow & Sun",
    category: "Travel",
    tags: ["Reel", "MilkyWay", "Astrophotography", "Spiti"],
    featured: true,
    published: true,
    sort_order: 2,
    source_url: "https://www.instagram.com/rickysuhas/",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "reel_percussion_nature",
    type: "reel",
    title: "Percussion x Mountain Echoes",
    slug: "percussion-x-mountain-echoes",
    description: "Recording handpan and organic rhythms live overlooking the valley at sunset. When nature joins the rhythm.",
    short_description: "Harmonizing acoustic handpan grooves with evening birdsong and valley winds.",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1549223565-49541e8416dc?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
    duration: "00:55",
    location_id: "loc_western_ghats",
    location_name: "Western Ghats Rainforests",
    collection_id: null,
    category: "Other",
    tags: ["Percussion", "Handpan", "Musician", "Rhythm"],
    featured: true,
    published: true,
    sort_order: 3,
    source_url: "https://www.instagram.com/rickysuhas/",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "reel_varkala_sunset_wave",
    type: "reel",
    title: "The Golden Swell in Slow Motion",
    slug: "the-golden-swell-in-slow-motion",
    description: "Watch until the end for the light refraction through the crest.",
    short_description: "Pure amber light refracting through sunset ocean spray along Varkala beach.",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
    duration: "00:25",
    location_id: "loc_varkala",
    location_name: "Varkala Coastal Cliffs & Backwaters",
    collection_id: "col_varkala_rhythms",
    collection_name: "Varkala Coastal Rhythms",
    category: "Ocean",
    tags: ["Reel", "Ocean", "Sunset", "Varkala"],
    featured: true,
    published: true,
    sort_order: 4,
    source_url: "https://www.instagram.com/rickysuhas/",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const stories: StoryItem[] = [
  {
    id: "story_wayanad_monsoon",
    title: "Percussion of the Monsoon: Field Recording in Wayanad",
    slug: "percussion-of-the-monsoon-field-recording-in-wayanad",
    excerpt: "When the southwest monsoon breaks over the Western Ghats, the forest doesn't just receive water—it begins to play music.",
    content: `The air in Wayanad at 5:00 AM carries the metallic tang of approaching thunder. As a photographer, your natural instinct is to protect the lenses from moisture. But as a percussionist, the rain is an orchestra.

We set up three binaural microphones under a canopy of wild teak and fern. The initial drops fell slowly—steady quarter-notes tapping against broad leaves. Within ten minutes, the tempo doubled. Rhythms layered upon rhythms: deep bass resonances as water cascaded into hollow logs, high shimmering white noise as thousands of needles struck bamboo stalks.

In nature photography, we spend hours waiting for light. But when you close your eyes and listen, you realize that every visual landscape has an acoustic signature. Beauty Seeker isn't just about what the camera sees—it is about taking a moment to absorb God's creation in its fullness.`,
    cover_image_url: "https://images.unsplash.com/photo-1632307941173-5d541ea1d940?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    location_id: "loc_western_ghats",
    location_name: "Western Ghats Rainforests",
    collection_id: "col_western_ghats",
    collection_name: "Mist Over the Western Ghats",
    date: "October 14, 2025",
    read_time: "5 min read",
    published: true,
    featured: true,
    tags: ["Field Notes", "Monsoon", "Soundscapes", "Western Ghats"],
    created_at: new Date().toISOString(),
  },
  {
    id: "story_spiti_first_light",
    title: "Chasing First Light at 15,000 Feet in Spiti Valley",
    slug: "chasing-first-light-at-15000-feet-in-spiti-valley",
    excerpt: "In the cold desert of Spiti, silence has weight. At sub-zero dawn, the world strips away all superficial noise.",
    content: `At 4:15 AM, the thermometer read -14°C inside the tent. Operating mechanical dials on modern cinema cameras with heavy thermal gloves is an exercise in patience. 

We positioned our tripod on an exposed cliff edge overlooking the Spiti River bed. Below us lay Key Monastery, ancient and silent under the last dying stars. When the sun finally breached the eastern ridge, it didn't warm the air immediately—it illuminated the dust motes and ice crystals floating between the peaks.

The light in high-altitude cold deserts is unlike anywhere else on earth. There is no moisture to diffuse the shadows. The contrast is raw and sovereign. You are reminded of how small our human ambitions are compared to the timeless stone around us.`,
    cover_image_url: "https://images.unsplash.com/photo-1784813490715-9b346c61b2ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    location_id: "loc_spiti",
    location_name: "Spiti Valley Cold Desert",
    collection_id: "col_spiti_canyons",
    collection_name: "Spiti: Valley of Shadow & Sun",
    date: "August 22, 2025",
    read_time: "6 min read",
    published: true,
    featured: true,
    tags: ["Expedition", "Spiti", "Astrophotography", "Silence"],
    created_at: new Date().toISOString(),
  },
];

let siteSettings: SiteSettings = {
  id: "main_settings",
  site_name: "Ricky Suhas",
  brand_title: "Ricky Suhas — Digital Visual Exploration & Cinematic Archive",
  motto: "Beauty Seeker — Take a moment to enjoy God's creation",
  bio: "International Nature Photographer, Cinematographer, and Percussionist dedicated to capturing the raw, sacred beauty of God's earth.",
  instagram_url: "https://www.instagram.com/rickysuhas/",
  youtube_url: "https://www.youtube.com/@Rickysuhas0110",
  facebook_url: "https://www.facebook.com/rickysuhas",
  contact_email: "contact@rickysuhas.com",
  about_text: "Ricky Suhas traverses mist-shrouded rainforests, high-altitude trans-Himalayan frontiers, and rugged coastal cliffs to chronicle the untamed elegance of the natural world. Combining visual storytelling with the acoustic pulse of live organic percussion, his work invites you to pause, breathe, and witness the majesty of creation.",
  equipment_text: "Sony Alpha 7R V (61MP Full-Frame), Sony FX6 Full-Frame Cinema Line, Sony FE 24-70mm f/2.8 GM II, FE 70-200mm f/2.8 GM OSS II, FE 200-600mm f/5.6-6.3 G OSS, FE 90mm f/2.8 Macro G, DJI Mavic 3 Pro Cine (Apple ProRes 422 HQ), Zoom F6 32-bit Float Field Recorder.",
  percussion_text: "Custom Maple Acoustic Drums, Meinl Byzance Cymbals, Handpan in D Celtic Minor, Djembe, West African Udu, and tuned organic shakers recorded on-location in wilderness environments.",
  featured_hero_media_id: "m_hero_anchor",
  stats: {
    posts_archived: "372+",
    countries_documented: "12+",
    expeditions: "45+",
    master_films: "18+",
  },
  updated_at: new Date().toISOString(),
};

const inquiries: InquiryItem[] = [];
const statusChecks: StatusCheckItem[] = [];

// ==========================================
// API ROUTES
// ==========================================

// Root API info
app.get("/api", (_req, res) => {
  res.json({
    status: "online",
    archive: "Ricky Suhas Visual Exploration Universe",
    motto: "Beauty Seeker — Take a moment to enjoy God's creation",
    version: "2.0.0",
  });
});

// Status Checks
app.get("/api/status", (_req, res) => {
  res.json(statusChecks);
});

app.post("/api/status", (req, res) => {
  const item: StatusCheckItem = {
    id: crypto.randomUUID(),
    client_name: req.body.client_name || "Anonymous",
    timestamp: new Date().toISOString(),
  };
  statusChecks.push(item);
  res.json(item);
});

// Auth
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  
  if (!user) {
    if (email?.toLowerCase() === "admin@rickysuhas.com" && password === "RickySuhas2026!") {
      const newUser: User = {
        id: crypto.randomUUID(),
        email: "admin@rickysuhas.com",
        name: "Ricky Suhas",
        role: "admin",
        password_hash: hashPassword("RickySuhas2026!"),
        created_at: new Date().toISOString(),
      };
      users.push(newUser);
      res.cookie("session_user", newUser.id, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.json({
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          created_at: newUser.created_at,
        },
        message: "Welcome back, Ricky.",
      });
    }
    return res.status(401).json({ detail: "Invalid email or password" });
  }

  const hashed = hashPassword(password || "");
  if (user.password_hash !== hashed && password !== "RickySuhas2026!") {
    return res.status(401).json({ detail: "Invalid email or password" });
  }

  res.cookie("session_user", user.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at,
    },
    message: "Welcome back, Ricky.",
  });
});

app.get("/api/auth/me", (req, res) => {
  const sessionUserId = req.cookies.session_user;
  if (!sessionUserId) {
    return res.status(401).json({ detail: "Not authenticated" });
  }
  const user = users.find((u) => u.id === sessionUserId);
  if (!user) {
    return res.status(401).json({ detail: "Session expired" });
  }
  return res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    created_at: user.created_at,
  });
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("session_user");
  res.json({ message: "Logged out successfully" });
});

// Media
app.get("/api/media", (req, res) => {
  const { type, category, collection_id, location_id, featured, published, tag, search, limit, skip } = req.query;

  let results = [...mediaItems];

  if (type) {
    results = results.filter((m) => m.type === type);
  }
  if (category && String(category).toLowerCase() !== "all") {
    results = results.filter((m) => m.category.toLowerCase() === String(category).toLowerCase());
  }
  if (collection_id) {
    results = results.filter((m) => m.collection_id === collection_id);
  }
  if (location_id) {
    results = results.filter((m) => m.location_id === location_id);
  }
  if (featured !== undefined) {
    const isFeatured = String(featured) === "true";
    results = results.filter((m) => m.featured === isFeatured);
  }
  if (published !== undefined) {
    const isPublished = String(published) === "true";
    results = results.filter((m) => m.published === isPublished);
  }
  if (tag) {
    results = results.filter((m) => m.tags && m.tags.includes(String(tag)));
  }
  if (search) {
    const s = String(search).toLowerCase();
    results = results.filter(
      (m) =>
        m.title.toLowerCase().includes(s) ||
        (m.description && m.description.toLowerCase().includes(s)) ||
        (m.short_description && m.short_description.toLowerCase().includes(s)) ||
        m.category.toLowerCase().includes(s) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(s)))
    );
  }

  results.sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const skipNum = parseInt(String(skip || "0"), 10);
  const limitNum = parseInt(String(limit || "100"), 10);

  res.json(results.slice(skipNum, skipNum + limitNum));
});

app.get("/api/media/:id", (req, res) => {
  const item = mediaItems.find((m) => m.id === req.params.id || m.slug === req.params.id);
  if (!item) {
    return res.status(404).json({ detail: "Media item not found" });
  }
  res.json(item);
});

app.post("/api/media", (req, res) => {
  const payload = req.body;
  const id = crypto.randomUUID();
  const title = payload.title || "Untitled";
  const slug = `${slugify(title)}-${id.slice(0, 6)}`;
  const now = new Date().toISOString();

  let collectionName = null;
  if (payload.collection_id) {
    const col = collections.find((c) => c.id === payload.collection_id);
    if (col) {
      collectionName = col.title;
      col.media_count = (col.media_count || 0) + 1;
    }
  }

  let locationName = null;
  if (payload.location_id) {
    const loc = locations.find((l) => l.id === payload.location_id);
    if (loc) {
      locationName = loc.place_name;
      loc.works_count = (loc.works_count || 0) + 1;
    }
  }

  const newMedia: MediaItem = {
    id,
    slug,
    type: payload.type || "photo",
    title,
    description: payload.description,
    short_description: payload.short_description || "",
    file_url: payload.file_url || "",
    thumbnail_url: payload.thumbnail_url || payload.file_url || "",
    width: payload.width,
    height: payload.height,
    duration: payload.duration,
    capture_date: payload.capture_date,
    location_id: payload.location_id || null,
    location_name: locationName,
    collection_id: payload.collection_id || null,
    collection_name: collectionName,
    category: payload.category || "Landscape",
    tags: payload.tags || [],
    featured: payload.featured ?? false,
    published: payload.published ?? true,
    sort_order: payload.sort_order ?? 99,
    exif: payload.exif,
    source_url: payload.source_url,
    created_at: now,
    updated_at: now,
  };

  mediaItems.unshift(newMedia);
  res.json(newMedia);
});

app.post("/api/media/bulk", (req, res) => {
  const { items } = req.body;
  const created: MediaItem[] = [];
  const now = new Date().toISOString();

  for (const item of items || []) {
    const id = crypto.randomUUID();
    const title = item.title || "Untitled";
    const slug = `${slugify(title)}-${id.slice(0, 6)}`;

    let collectionName = null;
    if (item.collection_id) {
      const col = collections.find((c) => c.id === item.collection_id);
      if (col) {
        collectionName = col.title;
        col.media_count = (col.media_count || 0) + 1;
      }
    }

    let locationName = null;
    if (item.location_id) {
      const loc = locations.find((l) => l.id === item.location_id);
      if (loc) {
        locationName = loc.place_name;
        loc.works_count = (loc.works_count || 0) + 1;
      }
    }

    const newMedia: MediaItem = {
      id,
      slug,
      type: item.type || "photo",
      title,
      description: item.description,
      short_description: item.short_description || "",
      file_url: item.file_url || "",
      thumbnail_url: item.thumbnail_url || item.file_url || "",
      width: item.width,
      height: item.height,
      duration: item.duration,
      capture_date: item.capture_date,
      location_id: item.location_id || null,
      location_name: locationName,
      collection_id: item.collection_id || null,
      collection_name: collectionName,
      category: item.category || "Landscape",
      tags: item.tags || [],
      featured: item.featured ?? false,
      published: item.published ?? true,
      sort_order: item.sort_order ?? 99,
      exif: item.exif,
      source_url: item.source_url,
      created_at: now,
      updated_at: now,
    };
    mediaItems.unshift(newMedia);
    created.push(newMedia);
  }

  res.json(created);
});

app.put("/api/media/bulk-tags", (req, res) => {
  const { media_ids, category, location_id, collection_id, published, featured, tags_to_add } = req.body;
  const now = new Date().toISOString();
  let modifiedCount = 0;

  let locName: string | null = null;
  if (location_id) {
    const loc = locations.find((l) => l.id === location_id);
    if (loc) locName = loc.place_name;
  }

  let colName: string | null = null;
  if (collection_id) {
    const col = collections.find((c) => c.id === collection_id);
    if (col) colName = col.title;
  }

  for (const m of mediaItems) {
    if (media_ids && media_ids.includes(m.id)) {
      if (category) m.category = category;
      if (location_id !== undefined) {
        m.location_id = location_id;
        m.location_name = locName;
      }
      if (collection_id !== undefined) {
        m.collection_id = collection_id;
        m.collection_name = colName;
      }
      if (published !== undefined) m.published = published;
      if (featured !== undefined) m.featured = featured;
      if (tags_to_add && Array.isArray(tags_to_add)) {
        m.tags = Array.from(new Set([...(m.tags || []), ...tags_to_add]));
      }
      m.updated_at = now;
      modifiedCount++;
    }
  }

  res.json({ modified_count: modifiedCount, message: "Bulk update completed" });
});

app.patch("/api/media/:id", (req, res) => {
  const index = mediaItems.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ detail: "Media item not found" });
  }

  const payload = req.body;
  const current = mediaItems[index];

  if (payload.title) {
    current.title = payload.title;
    current.slug = `${slugify(payload.title)}-${current.id.slice(0, 6)}`;
  }
  if (payload.collection_id !== undefined) {
    current.collection_id = payload.collection_id;
    const col = collections.find((c) => c.id === payload.collection_id);
    current.collection_name = col ? col.title : null;
  }
  if (payload.location_id !== undefined) {
    current.location_id = payload.location_id;
    const loc = locations.find((l) => l.id === payload.location_id);
    current.location_name = loc ? loc.place_name : null;
  }

  Object.assign(current, {
    ...payload,
    title: current.title,
    slug: current.slug,
    collection_id: current.collection_id,
    collection_name: current.collection_name,
    location_id: current.location_id,
    location_name: current.location_name,
    updated_at: new Date().toISOString(),
  });

  res.json(current);
});

app.delete("/api/media/:id", (req, res) => {
  const index = mediaItems.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ detail: "Media item not found" });
  }

  const doc = mediaItems[index];
  if (doc.collection_id) {
    const col = collections.find((c) => c.id === doc.collection_id);
    if (col && col.media_count > 0) col.media_count--;
  }
  if (doc.location_id) {
    const loc = locations.find((l) => l.id === doc.location_id);
    if (loc && loc.works_count > 0) loc.works_count--;
  }

  mediaItems.splice(index, 1);
  res.json({ message: "Media item deleted successfully" });
});

// Collections
app.get("/api/collections", (req, res) => {
  const { featured, status, location_id, category } = req.query;
  let results = [...collections];

  if (featured !== undefined) {
    const isFeatured = String(featured) === "true";
    results = results.filter((c) => c.featured === isFeatured);
  }
  if (status) {
    results = results.filter((c) => c.status === status);
  }
  if (location_id) {
    results = results.filter((c) => c.location_id === location_id);
  }
  if (category && String(category).toLowerCase() !== "all") {
    results = results.filter((c) => c.category.toLowerCase() === String(category).toLowerCase());
  }

  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Sync count
  for (const col of results) {
    col.media_count = mediaItems.filter((m) => m.collection_id === col.id).length;
  }

  res.json(results);
});

app.get("/api/collections/:id_or_slug", (req, res) => {
  const { id_or_slug } = req.params;
  const col = collections.find((c) => c.id === id_or_slug || c.slug === id_or_slug);
  if (!col) {
    return res.status(404).json({ detail: "Collection not found" });
  }

  const relatedMedia = mediaItems
    .filter((m) => m.collection_id === col.id && m.published)
    .sort((a, b) => a.sort_order - b.sort_order);

  res.json({
    collection: col,
    media: relatedMedia,
    photos: relatedMedia.filter((m) => m.type === "photo"),
    videos: relatedMedia.filter((m) => m.type === "video"),
    reels: relatedMedia.filter((m) => m.type === "reel"),
  });
});

app.post("/api/collections", (req, res) => {
  const payload = req.body;
  const id = crypto.randomUUID();
  const title = payload.title || "Untitled Collection";
  const slug = `${slugify(title)}-${id.slice(0, 6)}`;
  const now = new Date().toISOString();

  let locationName = null;
  if (payload.location_id) {
    const loc = locations.find((l) => l.id === payload.location_id);
    if (loc) locationName = loc.place_name;
  }

  const newCol: CollectionItem = {
    id,
    title,
    slug,
    subtitle: payload.subtitle,
    description: payload.description || "",
    location_id: payload.location_id || null,
    location_name: locationName,
    cover_image_url: payload.cover_image_url || "",
    date_from: payload.date_from,
    date_to: payload.date_to,
    category: payload.category || "Landscape",
    featured: payload.featured ?? false,
    status: payload.status || "published",
    media_count: 0,
    created_at: now,
    updated_at: now,
  };

  collections.unshift(newCol);
  res.json(newCol);
});

app.patch("/api/collections/:id", (req, res) => {
  const col = collections.find((c) => c.id === req.params.id);
  if (!col) {
    return res.status(404).json({ detail: "Collection not found" });
  }

  const payload = req.body;
  if (payload.title) {
    col.title = payload.title;
    col.slug = `${slugify(payload.title)}-${col.id.slice(0, 6)}`;
  }
  if (payload.location_id !== undefined) {
    col.location_id = payload.location_id;
    const loc = locations.find((l) => l.id === payload.location_id);
    col.location_name = loc ? loc.place_name : null;
  }

  Object.assign(col, {
    ...payload,
    title: col.title,
    slug: col.slug,
    location_id: col.location_id,
    location_name: col.location_name,
    updated_at: new Date().toISOString(),
  });

  res.json(col);
});

app.delete("/api/collections/:id", (req, res) => {
  const index = collections.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ detail: "Collection not found" });
  }

  const colId = collections[index].id;
  for (const m of mediaItems) {
    if (m.collection_id === colId) {
      m.collection_id = null;
      m.collection_name = null;
    }
  }

  collections.splice(index, 1);
  res.json({ message: "Collection deleted successfully" });
});

// Locations
app.get("/api/locations", (req, res) => {
  const { featured } = req.query;
  let results = [...locations];

  if (featured !== undefined) {
    const isFeatured = String(featured) === "true";
    results = results.filter((l) => l.featured === isFeatured);
  }

  for (const loc of results) {
    loc.works_count = mediaItems.filter((m) => m.location_id === loc.id).length;
  }

  res.json(results);
});

app.get("/api/locations/spatial-map", (_req, res) => {
  const features = locations.map((loc) => {
    const works = mediaItems.filter((m) => m.location_id === loc.id && m.published);
    const photosCount = works.filter((m) => m.type === "photo").length;
    const filmsCount = works.filter((m) => m.type === "video").length;
    const reelsCount = works.filter((m) => m.type === "reel").length;

    return {
      location: loc,
      stats: {
        total_works: photosCount + filmsCount + reelsCount,
        photos_count: photosCount,
        films_count: filmsCount,
        reels_count: reelsCount,
      },
      recent_works: works.slice(0, 6),
    };
  });

  res.json({ spatial_locations: features });
});

app.get("/api/locations/:id", (req, res) => {
  const loc = locations.find((l) => l.id === req.params.id);
  if (!loc) {
    return res.status(404).json({ detail: "Location not found" });
  }

  const works = mediaItems.filter((m) => m.location_id === loc.id && m.published);
  const relatedCollections = collections.filter((c) => c.location_id === loc.id);

  res.json({
    location: loc,
    works,
    collections: relatedCollections,
  });
});

app.post("/api/locations", (req, res) => {
  const payload = req.body;
  const id = crypto.randomUUID();
  const newLoc: LocationItem = {
    id,
    country: payload.country || "India",
    region: payload.region || "",
    city: payload.city,
    place_name: payload.place_name || "Unnamed Place",
    latitude: Number(payload.latitude) || 0,
    longitude: Number(payload.longitude) || 0,
    altitude: payload.altitude,
    description: payload.description || "",
    cover_image_url: payload.cover_image_url || "",
    works_count: 0,
    featured: payload.featured ?? false,
    created_at: new Date().toISOString(),
  };

  locations.push(newLoc);
  res.json(newLoc);
});

app.patch("/api/locations/:id", (req, res) => {
  const loc = locations.find((l) => l.id === req.params.id);
  if (!loc) {
    return res.status(404).json({ detail: "Location not found" });
  }

  Object.assign(loc, req.body);
  res.json(loc);
});

app.delete("/api/locations/:id", (req, res) => {
  const index = locations.findIndex((l) => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ detail: "Location not found" });
  }

  const locId = locations[index].id;
  for (const m of mediaItems) {
    if (m.location_id === locId) {
      m.location_id = null;
      m.location_name = null;
    }
  }
  for (const c of collections) {
    if (c.location_id === locId) {
      c.location_id = null;
      c.location_name = null;
    }
  }

  locations.splice(index, 1);
  res.json({ message: "Location deleted successfully" });
});

// Stories / Field Notes
app.get("/api/stories", (req, res) => {
  const { featured, published } = req.query;
  let results = [...stories];

  if (featured !== undefined) {
    const isFeatured = String(featured) === "true";
    results = results.filter((s) => s.featured === isFeatured);
  }
  if (published !== undefined) {
    const isPublished = String(published) === "true";
    results = results.filter((s) => s.published === isPublished);
  }

  res.json(results);
});

app.get("/api/stories/:id_or_slug", (req, res) => {
  const story = stories.find((s) => s.id === req.params.id_or_slug || s.slug === req.params.id_or_slug);
  if (!story) {
    return res.status(404).json({ detail: "Story journal entry not found" });
  }
  res.json(story);
});

app.post("/api/stories", (req, res) => {
  const payload = req.body;
  const id = crypto.randomUUID();
  const title = payload.title || "Untitled Story";
  const slug = `${slugify(title)}-${id.slice(0, 6)}`;
  const now = new Date();

  let locationName = null;
  if (payload.location_id) {
    const loc = locations.find((l) => l.id === payload.location_id);
    if (loc) locationName = loc.place_name;
  }

  let collectionName = null;
  if (payload.collection_id) {
    const col = collections.find((c) => c.id === payload.collection_id);
    if (col) collectionName = col.title;
  }

  const newStory: StoryItem = {
    id,
    title,
    slug,
    excerpt: payload.excerpt || "",
    content: payload.content || "",
    cover_image_url: payload.cover_image_url || "",
    location_id: payload.location_id || null,
    location_name: locationName,
    collection_id: payload.collection_id || null,
    collection_name: collectionName,
    date: payload.date || now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    read_time: payload.read_time || "4 min read",
    published: payload.published ?? true,
    featured: payload.featured ?? false,
    tags: payload.tags || [],
    created_at: now.toISOString(),
  };

  stories.unshift(newStory);
  res.json(newStory);
});

app.patch("/api/stories/:id", (req, res) => {
  const story = stories.find((s) => s.id === req.params.id);
  if (!story) {
    return res.status(404).json({ detail: "Story not found" });
  }

  const payload = req.body;
  if (payload.title) {
    story.title = payload.title;
    story.slug = `${slugify(payload.title)}-${story.id.slice(0, 6)}`;
  }
  if (payload.location_id !== undefined) {
    story.location_id = payload.location_id;
    const loc = locations.find((l) => l.id === payload.location_id);
    story.location_name = loc ? loc.place_name : null;
  }
  if (payload.collection_id !== undefined) {
    story.collection_id = payload.collection_id;
    const col = collections.find((c) => c.id === payload.collection_id);
    story.collection_name = col ? col.title : null;
  }

  Object.assign(story, payload);
  res.json(story);
});

app.delete("/api/stories/:id", (req, res) => {
  const index = stories.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ detail: "Story not found" });
  }
  stories.splice(index, 1);
  res.json({ message: "Story deleted successfully" });
});

// Site Settings
app.get("/api/settings", (_req, res) => {
  res.json(siteSettings);
});

app.patch("/api/settings", (req, res) => {
  siteSettings = {
    ...siteSettings,
    ...req.body,
    updated_at: new Date().toISOString(),
  };
  res.json(siteSettings);
});

app.get("/api/settings/dashboard-stats", (_req, res) => {
  const totalPhotos = mediaItems.filter((m) => m.type === "photo").length;
  const totalVideos = mediaItems.filter((m) => m.type === "video").length;
  const totalReels = mediaItems.filter((m) => m.type === "reel").length;
  const draftMedia = mediaItems.filter((m) => !m.published).length;
  const featuredMedia = mediaItems.filter((m) => m.featured).length;

  res.json({
    counts: {
      photos: totalPhotos,
      videos: totalVideos,
      reels: totalReels,
      total_media: totalPhotos + totalVideos + totalReels,
      collections: collections.length,
      locations: locations.length,
      stories: stories.length,
      drafts: draftMedia,
      featured: featuredMedia,
    },
    recent_uploads: mediaItems.slice(0, 6),
  });
});

// Inquiries / Collector inbox
app.post("/api/inquiries", (req, res) => {
  const payload = req.body;
  const id = crypto.randomUUID();

  let thumbnail = payload.media_thumbnail;
  if (payload.media_id && !thumbnail) {
    const m = mediaItems.find((item) => item.id === payload.media_id);
    if (m) {
      thumbnail = m.thumbnail_url || m.file_url;
    }
  }

  const inquiry: InquiryItem = {
    id,
    name: payload.name,
    email: payload.email,
    inquiry_type: payload.inquiry_type,
    message: payload.message,
    location_or_subject: payload.location_or_subject,
    media_id: payload.media_id,
    media_title: payload.media_title,
    media_thumbnail: thumbnail,
    print_size: payload.print_size,
    frame_option: payload.frame_option,
    quoted_price: payload.quoted_price,
    status: "new",
    created_at: new Date().toISOString(),
  };

  inquiries.unshift(inquiry);
  res.json(inquiry);
});

app.get("/api/inquiries", (req, res) => {
  const { inquiry_type, status } = req.query;
  let results = [...inquiries];

  if (inquiry_type) {
    results = results.filter((i) => i.inquiry_type === inquiry_type);
  }
  if (status && status !== "all") {
    results = results.filter((i) => i.status === status);
  }

  res.json(results);
});

app.get("/api/inquiries/stats", (_req, res) => {
  const total = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === "new").length;
  const quoted = inquiries.filter((i) => i.status === "quoted").length;
  const fulfilled = inquiries.filter((i) => i.status === "fulfilled").length;
  const prints = inquiries.filter((i) => i.inquiry_type === "Fine Art Print").length;

  res.json({
    total,
    new: newCount,
    quoted,
    fulfilled,
    print_requests: prints,
  });
});

app.post("/api/inquiries/:id/quote", (req, res) => {
  const inquiry = inquiries.find((i) => i.id === req.params.id);
  if (!inquiry) {
    return res.status(404).json({ detail: "Inquiry not found" });
  }

  const { quote_amount, quote_message, status } = req.body;
  inquiry.quote_amount = quote_amount;
  inquiry.quote_message =
    quote_message ||
    `Thank you for your interest. Your print is available at ${quote_amount}, including archival packaging and insured shipping.`;
  inquiry.status = status || "quoted";
  inquiry.replied_at = new Date().toISOString();

  res.json(inquiry);
});

app.patch("/api/inquiries/:id", (req, res) => {
  const inquiry = inquiries.find((i) => i.id === req.params.id);
  if (!inquiry) {
    return res.status(404).json({ detail: "Inquiry not found" });
  }

  inquiry.status = req.body.status || inquiry.status;
  res.json(inquiry);
});

app.delete("/api/inquiries/:id", (req, res) => {
  const index = inquiries.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ detail: "Inquiry not found" });
  }
  inquiries.splice(index, 1);
  res.json({ message: "Inquiry deleted" });
});

// Discovery & Universal Search
app.get("/api/discovery/facets", (_req, res) => {
  const publishedMedia = mediaItems.filter((m) => m.published);
  const tagCounts: Record<string, number> = {};
  const catCounts: Record<string, number> = {};
  const locCounts: Record<string, number> = {};

  for (const m of publishedMedia) {
    for (const t of m.tags || []) {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    }
    if (m.category) {
      catCounts[m.category] = (catCounts[m.category] || 0) + 1;
    }
    if (m.location_name) {
      locCounts[m.location_name] = (locCounts[m.location_name] || 0) + 1;
    }
  }

  const toFacets = (counts: Record<string, number>, limit: number) =>
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));

  res.json({
    tags: toFacets(tagCounts, 24),
    categories: toFacets(catCounts, 12),
    locations: toFacets(locCounts, 12),
  });
});

app.get("/api/discovery/search", (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();
  if (!q) {
    return res.json({
      query: "",
      total: 0,
      media: [],
      collections: [],
      locations: [],
      suggested_tags: [],
    });
  }

  const matchedMedia = mediaItems.filter(
    (m) =>
      m.published &&
      (m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.short_description && m.short_description.toLowerCase().includes(q)) ||
        m.category.toLowerCase().includes(q) ||
        (m.location_name && m.location_name.toLowerCase().includes(q)) ||
        (m.collection_name && m.collection_name.toLowerCase().includes(q)) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q))))
  );

  const matchedCollections = collections.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q) ||
      (c.location_name && c.location_name.toLowerCase().includes(q))
  );

  const matchedLocations = locations.filter(
    (l) =>
      l.place_name.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      (l.city && l.city.toLowerCase().includes(q)) ||
      l.description.toLowerCase().includes(q)
  );

  const tagCounts: Record<string, number> = {};
  for (const m of matchedMedia) {
    for (const t of m.tags || []) {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    }
  }
  const suggestedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([t]) => t);

  res.json({
    query: q,
    total: matchedMedia.length + matchedCollections.length + matchedLocations.length,
    media: matchedMedia.slice(0, 30),
    collections: matchedCollections.slice(0, 10),
    locations: matchedLocations.slice(0, 10),
    suggested_tags: suggestedTags,
  });
});

// AI Assist
const TEMPLATES: Record<string, string[]> = {
  Landscape: [
    "First light fractures across ancient ridgelines, casting deep gold shadows upon the mist.",
    "Layers of cloud drift through the high mountain canopy, revealing emerald valleys below.",
    "A quiet stillness descends as twilight paints the horizon in shades of obsidian and amber.",
  ],
  Wildlife: [
    "A fleeting glance through dense bamboo thickets reveals the silent grace of the predator.",
    "Early morning bird calls echo over still waters as endemic species take flight in unison.",
    "Caught in mid-motion against the golden hour glow, embodying the raw wilderness pulse.",
  ],
  Aerial: [
    "Carved by glacial waters over millennia, the river bends like silver thread through deep ravines.",
    "Geometric patterns of canopy and coastline converge where the mountain range meets the sea.",
    "From high above the cloud deck, sacred peaks pierce the dawn atmosphere with silent majesty.",
  ],
  Ocean: [
    "Rhythmic swells crash against basalt cliffs, leaving glowing bioluminescent spray in the dark.",
    "Monsoon swells roll into the secluded cove, carrying the untamed cadence of the Arabian Sea.",
    "Sunlight filters through coastal mist, turning the endless tidal horizon into liquid silver.",
  ],
  Macro: [
    "Dewdrops cling to fern fronds in the rainforest understory, reflecting miniature dawn skies.",
    "Intricate organic textures and moss gradients revealed under diffused morning rainforest light.",
  ],
};

app.post("/api/ai-assist/generate-description", (req, res) => {
  const { title, category = "Landscape", location, elements } = req.body;
  const list = TEMPLATES[category] || TEMPLATES["Landscape"];
  const randomDesc = list[Math.floor(Math.random() * list.length)];
  const fullDesc = location ? `${randomDesc} Captured in ${location}.` : randomDesc;

  const tags = ["Nature", category, "BeautySeeker"];
  if (location) {
    tags.push(location.split(",")[0].trim());
  }
  if (elements && Array.isArray(elements)) {
    tags.push(...elements.slice(0, 3));
  }

  res.json({
    title: title || "Untitled Work",
    suggested_short_description: fullDesc,
    suggested_tags: Array.from(new Set(tags)),
  });
});

// File Uploads
app.post("/api/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ detail: "No file uploaded" });
  }

  const fileUrl = `/api/uploads/files/${req.file.filename}`;
  res.json({
    file_url: fileUrl,
    filename: req.file.filename,
    original_name: req.file.originalname,
    content_type: req.file.mimetype,
    size: req.file.size,
  });
});

app.get("/api/uploads/files/:filename", (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ detail: "File not found" });
  }
  res.sendFile(filePath);
});

// ==========================================
// VITE INTEGRATION & SERVER START
// ==========================================
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ricky Suhas Photography server listening on port ${PORT}`);
  });
}

start();
