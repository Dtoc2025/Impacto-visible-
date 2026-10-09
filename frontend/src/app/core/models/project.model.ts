export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  _count?: { projects: number };
}

export interface Organizer {
  id: number;
  name: string;
  organizationName?: string;
  avatarUrl?: string;
  website?: string;
  bio?: string;
}

export interface ProjectDonation {
  id: number;
  amount: number;
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
  user?: { id: number; name: string; avatarUrl?: string } | null;
}

export interface Project {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  impact?: string;
  beneficiaries?: number;
  country: string;
  region?: string;
  urgency: Urgency;
  isForgotten: boolean;
  goal: number;
  raised: number;
  imageUrl?: string;
  gallery?: string[];
  latitude?: number;
  longitude?: number;
  categoryId: number;
  category: Category;
  organizer?: Organizer | null;
  createdAt: string;
  updatedAt: string;
  donations?: ProjectDonation[];
  _count?: { donations: number };
}

export interface ProjectListResponse {
  total: number;
  page: number;
  limit: number;
  items: Project[];
}