import { create } from 'zustand';
import { User, ProProfile, SearchFilters, SortOption } from '@/types';
import { mockProfiles } from '@/constants/data';

interface AppState {
  user: User | null;
  searchQuery: string;
  selectedCategory: string | null;
  selectedArea: string | null;
  filters: SearchFilters;
  sortBy: SortOption['key'];
  searchResults: ProProfile[];
  
  // Actions
  setUser: (user: User | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedArea: (area: string | null) => void;
  setFilters: (filters: SearchFilters) => void;
  setSortBy: (sortBy: SortOption['key']) => void;
  performSearch: () => void;
  clearSearch: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  searchQuery: '',
  selectedCategory: null,
  selectedArea: null,
  filters: {},
  sortBy: 'recommended',
  searchResults: [],

  setUser: (user) => set({ user }),
  
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  
  setSelectedArea: (selectedArea) => set({ selectedArea }),
  
  setFilters: (filters) => set({ filters }),
  
  setSortBy: (sortBy) => set({ sortBy }),
  
  performSearch: () => {
    const { selectedCategory, selectedArea, filters, sortBy } = get();
    let results = [...mockProfiles];

    // Filter by category
    if (selectedCategory) {
      results = results.filter(profile => 
        profile.categories.includes(selectedCategory)
      );
    }

    // Filter by area
    if (selectedArea) {
      results = results.filter(profile => 
        profile.zones.includes(selectedArea)
      );
    }

    // Apply filters
    if (filters.minRating) {
      results = results.filter(profile => profile.ratingAvg >= filters.minRating!);
    }

    if (filters.verified) {
      results = results.filter(profile => profile.verified);
    }

    if (filters.availableNow) {
      results = results.filter(profile => profile.isActive);
    }

    if (filters.maxPrice) {
      results = results.filter(profile => profile.minPrice <= filters.maxPrice!);
    }

    // Sort results
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.ratingAvg - a.ratingAvg);
        break;
      case 'price':
        results.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case 'responseTime':
        results.sort((a, b) => a.responseTimeAvgMins - b.responseTimeAvgMins);
        break;
      case 'recommended':
      default:
        // Composite score: 40% rating + 20% response time + 15% review count + 25% verified
        results.sort((a, b) => {
          const scoreA = (a.ratingAvg * 0.4) + 
                        ((60 - Math.min(a.responseTimeAvgMins, 60)) / 60 * 0.2) + 
                        (Math.min(a.ratingCount, 100) / 100 * 0.15) + 
                        (a.verified ? 0.25 : 0);
          const scoreB = (b.ratingAvg * 0.4) + 
                        ((60 - Math.min(b.responseTimeAvgMins, 60)) / 60 * 0.2) + 
                        (Math.min(b.ratingCount, 100) / 100 * 0.15) + 
                        (b.verified ? 0.25 : 0);
          return scoreB - scoreA;
        });
        break;
    }

    set({ searchResults: results });
  },
  
  clearSearch: () => set({ 
    searchQuery: '', 
    selectedCategory: null, 
    selectedArea: null, 
    filters: {}, 
    searchResults: [] 
  }),
}));