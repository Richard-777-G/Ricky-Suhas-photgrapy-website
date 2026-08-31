export interface ExifData {
  camera?: string;
  lens?: string;
  shutter_speed?: string;
  aperture?: string;
  iso?: string;
  focal_length?: string;
}

export interface Media {
  id: string;
  type: 'photo' | 'video' | 'reel';
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
  location_id?: string;
  location_name?: string;
  collection_id?: string;
  collection_name?: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  exif?: ExifData;
  source_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaCreate {
  type: 'photo' | 'video' | 'reel';
  title: string;
  description?: string;
  short_description: string;
  file_url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  duration?: string;
  capture_date?: string;
  location_id?: string;
  collection_id?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  exif?: ExifData;
  source_url?: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  subtitle?: string;
  location_id?: string;
  location_name?: string;
  cover_image_url: string;
  date_from?: string;
  date_to?: string;
  category: string;
  featured: boolean;
  status: 'published' | 'draft';
  media_count: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionDetailResponse {
  collection: Collection;
  media: Media[];
  photos: Media[];
  videos: Media[];
  reels: Media[];
}

export interface CollectionCreate {
  title: string;
  description: string;
  subtitle?: string;
  location_id?: string;
  cover_image_url: string;
  date_from?: string;
  date_to?: string;
  category?: string;
  featured?: boolean;
  status?: string;
}

export interface Location {
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

export interface SpatialMapFeature {
  location: Location;
  stats: {
    total_works: number;
    photos_count: number;
    films_count: number;
    reels_count: number;
  };
  recent_works: Media[];
}

export interface SpatialMapResponse {
  spatial_locations: SpatialMapFeature[];
}

export interface LocationDetailResponse {
  location: Location;
  works: Media[];
  collections: Collection[];
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  location_id?: string;
  location_name?: string;
  collection_id?: string;
  collection_name?: string;
  date: string;
  read_time: string;
  published: boolean;
  featured: boolean;
  tags: string[];
  created_at: string;
}

export interface StoryCreate {
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  location_id?: string;
  collection_id?: string;
  date?: string;
  read_time?: string;
  published?: boolean;
  featured?: boolean;
  tags?: string[];
}

export interface SiteSettings {
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface LoginResponse {
  user: User;
  message: string;
}

export interface DashboardStats {
  counts: {
    photos: number;
    videos: number;
    reels: number;
    total_media: number;
    collections: number;
    locations: number;
    stories: number;
    drafts: number;
    featured: number;
  };
  recent_uploads: Media[];
}

export interface InquiryCreate {
  name: string;
  email: string;
  inquiry_type: string;
  message: string;
  location_or_subject?: string;
}
