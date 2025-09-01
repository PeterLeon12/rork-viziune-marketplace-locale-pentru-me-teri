export interface User {
  id: string;
  role: 'client' | 'pro' | 'admin';
  phone: string;
  email?: string;
  name: string;
  photoUrl?: string;
  createdAt: string;
}

export interface ProProfile {
  id: string;
  userId: string;
  displayName: string;
  company: string;
  categories: string[];
  zones: string[];
  minPrice: number;
  about: string;
  verified: boolean;
  responseTimeAvgMins: number;
  ratingAvg: number;
  ratingCount: number;
  isActive: boolean;
  contact: {
    phone: string;
    whatsappLink: string;
  };
  photoUrl?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  proId: string;
  title: string;
  description: string;
  priceFrom: number;
  unit: string;
  visible: boolean;
}

export interface Review {
  id: string;
  proId: string;
  clientId: string;
  clientName: string;
  rating: number;
  recommend: boolean;
  comment: string;
  photos: string[];
  createdAt: string;
  verifiedContact: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Area {
  id: string;
  name: string;
  city: string;
}

export interface SearchFilters {
  category?: string;
  area?: string;
  minRating?: number;
  verified?: boolean;
  availableNow?: boolean;
  maxPrice?: number;
}

export interface SortOption {
  key: 'recommended' | 'rating' | 'price' | 'distance' | 'responseTime';
  label: string;
}