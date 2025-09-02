import { create } from 'zustand';
import { User, ProProfile, SearchFilters, SortOption } from '@/types';

interface AppState {
  user: User | null;
  searchQuery: string;
  selectedCategory: string | null;
  selectedArea: string | null;
  filters: SearchFilters;
  sortBy: SortOption['key'];
  searchResults: ProProfile[];
  categories: any[];
  areas: any[];
  
  // Actions
  setUser: (user: User | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedArea: (area: string | null) => void;
  setFilters: (filters: SearchFilters) => void;
  setSortBy: (sortBy: SortOption['key']) => void;
  performSearch: () => void;
  clearSearch: () => void;
  setCategories: (categories: any[]) => void;
  setAreas: (areas: any[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  searchQuery: '',
  selectedCategory: null,
  selectedArea: null,
  filters: {},
  sortBy: 'recommended',
  searchResults: [],
  categories: [],
  areas: [],

  setUser: (user) => set({ user }),
  
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  
  setSelectedArea: (selectedArea) => set({ selectedArea }),
  
  setFilters: (filters) => set({ filters }),
  
  setSortBy: (sortBy) => set({ sortBy }),
  
  performSearch: () => {
    // This function is now handled by the backend API
    // The search results are fetched directly from the API in the search component
    console.log('Search performed with filters:', get());
  },
  
  clearSearch: () => set({ 
    searchQuery: '', 
    selectedCategory: null, 
    selectedArea: null, 
    filters: {}, 
    searchResults: [] 
  }),

  setCategories: (categories) => set({ categories }),
  setAreas: (areas) => set({ areas }),
}));