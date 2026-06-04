export interface Section {
  value: string;
  label: string;
}

export interface AboutProfile {
  id?: number;
  full_name: string;
  age: number | string;
  city: string;
  profession: string;
  linkedin_url?: string;
  github_url?: string;
  description: string;
  photo?: string | null;
  photo_url?: string | null;
  updated_at?: string;
}

export interface Category {
  id?: number;
  section: string;
  section_label?: string;
  name: string;
  slug?: string;
  description?: string;
  post_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id?: number;
  section: string;
  section_label?: string;
  category?: number | null;
  category_name?: string | null;
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  image?: string | null;
  image_url?: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface MeResponse {
  authenticated: boolean;
  username: string;
  is_staff: boolean;
  is_superuser?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
