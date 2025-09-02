import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from './create-context';
import { db } from '../db/adapter';
import { 
  proProfiles, 
  services, 
  reviews, 
  categories, 
  areas
} from '../db/schema';
import { eq, inArray, gte, lte, desc, asc, and, or, like, sql, count } from 'drizzle-orm';

// Enhanced search schema with filters available in current schema
const advancedSearchSchema = z.object({
  // Basic search
  query: z.string().optional(),
  category: z.string().optional(),
  area: z.string().optional(),
  
  // Price filters
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  priceRange: z.enum(['0-100', '100-300', '300-500', '500-1000', '1000+']).optional(),
  
  // Quality filters - using existing schema fields
  minRating: z.number().min(1).max(5).optional(),
  verified: z.boolean().optional(),
  
  // Availability filters - using existing schema fields
  availableNow: z.boolean().optional(),
  responseTimeMax: z.number().optional(), // in minutes
  
  // Sorting
  sortBy: z.enum([
    'recommended',
    'rating', 
    'price_low_to_high',
    'price_high_to_low',
    'response_time',
    'newest'
  ]).optional().default('recommended'),
  
  // Pagination
  limit: z.number().min(1).max(100).optional().default(20),
  offset: z.number().min(0).optional().default(0),
});

// Simplified search suggestions schema
const searchSuggestionsSchema = z.object({
  query: z.string().min(1),
  type: z.enum(['services', 'professionals', 'categories']).optional(),
  limit: z.number().min(1).max(20).default(10),
});

export const enhancedSearchRouter = createTRPCRouter({
  // Advanced professional search with available filters
  advancedSearch: publicProcedure
    .input(advancedSearchSchema)
    .query(async ({ input }) => {
      try {
        const {
          query,
          category,
          area,
          minPrice,
          maxPrice,
          priceRange,
          minRating,
          verified,
          availableNow,
          responseTimeMax,
          sortBy = 'recommended',
          limit = 20,
          offset = 0,
        } = input;

        // Use the existing database adapter methods
        const searchResults = await db.getProfiles({
          category,
          area,
          minPrice,
          maxPrice,
          minRating,
          verified,
          availableNow,
          query,
          sortBy,
          limit,
          offset,
        });

        // Apply additional filters that aren't in the adapter
        let filteredResults = searchResults;

        // Price range filter
        if (priceRange) {
          const priceRanges = {
            '0-100': [0, 100],
            '100-300': [100, 300],
            '300-500': [300, 500],
            '500-1000': [500, 1000],
            '1000+': [1000, 999999]
          };
          const [min, max] = priceRanges[priceRange];
          filteredResults = filteredResults.filter(profile => 
            profile.minPrice >= min && profile.minPrice <= max
          );
        }

        // Response time filter
        if (responseTimeMax) {
          filteredResults = filteredResults.filter(profile =>
            profile.responseTimeAvgMins <= responseTimeMax
          );
        }

        // Enhanced sorting
        if (sortBy === 'recommended') {
          // Sort by verified first, then rating, then response time
          filteredResults.sort((a, b) => {
            if (a.verified !== b.verified) return b.verified ? 1 : -1;
            if (a.ratingAvg !== b.ratingAvg) return b.ratingAvg - a.ratingAvg;
            return a.responseTimeAvgMins - b.responseTimeAvgMins;
          });
        } else if (sortBy === 'rating') {
          filteredResults.sort((a, b) => {
            if (a.ratingAvg !== b.ratingAvg) return b.ratingAvg - a.ratingAvg;
            return b.ratingCount - a.ratingCount;
          });
        } else if (sortBy === 'price_low_to_high') {
          filteredResults.sort((a, b) => a.minPrice - b.minPrice);
        } else if (sortBy === 'price_high_to_low') {
          filteredResults.sort((a, b) => b.minPrice - a.minPrice);
        } else if (sortBy === 'response_time') {
          filteredResults.sort((a, b) => a.responseTimeAvgMins - b.responseTimeAvgMins);
        } else if (sortBy === 'newest') {
          filteredResults.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        return {
          profiles: filteredResults,
          pagination: {
            total: filteredResults.length,
            limit,
            offset,
            hasMore: offset + limit < filteredResults.length,
          },
          filters: {
            appliedFilters: Object.keys(input).filter(key => 
              input[key as keyof typeof input] !== undefined && 
              input[key as keyof typeof input] !== null &&
              input[key as keyof typeof input] !== ''
            ),
            totalResults: filteredResults.length,
          }
        };
      } catch (error) {
        console.error('Error in advancedSearch:', error);
        throw new Error('Failed to search profiles');
      }
    }),

  // Get search suggestions
  getSearchSuggestions: publicProcedure
    .input(searchSuggestionsSchema)
    .query(async ({ input }) => {
      try {
        const { query, type, limit } = input;
        const suggestions: any[] = [];

        if (!type || type === 'professionals') {
          // Get professionals matching the query
          const profiles = await db.getProfiles({ query, limit: 5 });
          profiles.forEach(profile => {
            suggestions.push({
              type: 'professional',
              title: profile.displayName,
              description: profile.company,
              category: profile.categories?.join(', ') || '',
            });
          });
        }

        if (!type || type === 'categories') {
          // Get categories matching the query
          const allCategories = await db.getCategories();
          const matchingCategories = allCategories.filter(cat => 
            cat.name.toLowerCase().includes(query.toLowerCase())
          ).slice(0, limit);
          
          matchingCategories.forEach(category => {
            suggestions.push({
              type: 'category',
              title: category.name,
              description: 'Categorie de servicii',
              category: category.id,
            });
          });
        }

        if (!type || type === 'services') {
          // For services, we'll suggest common service types based on categories
          const allCategories = await db.getCategories();
          const matchingServices = allCategories.filter(cat => 
            cat.name.toLowerCase().includes(query.toLowerCase())
          ).slice(0, limit);
          
          matchingServices.forEach(service => {
            suggestions.push({
              type: 'service',
              title: `Servicii ${service.name}`,
              description: `Găsește profesioniști pentru ${service.name.toLowerCase()}`,
              category: service.id,
            });
          });
        }

        return suggestions.slice(0, limit);
      } catch (error) {
        console.error('Error in getSearchSuggestions:', error);
        throw new Error('Failed to get search suggestions');
      }
    }),

  // Get popular searches and trending categories
  getPopularSearches: publicProcedure
    .query(async () => {
      try {
        const categories = await db.getCategories();
        const areas = await db.getAreas();
        
        return {
          trendingCategories: categories.slice(0, 6),
          popularAreas: areas.slice(0, 8),
          popularSearches: [
            'Instalații sanitare',
            'Electrician',
            'Curățenie profesională',
            'Reparații AC',
            'Zugrăveli',
            'Dulgherie',
            'Grădinărit',
            'Reparații electrocasnice'
          ],
          quickFilters: [
            { label: 'Verificați', filter: 'verified', value: true },
            { label: 'Disponibili acum', filter: 'availableNow', value: true },
            { label: 'Răspuns rapid', filter: 'responseTimeMax', value: 60 },
            { label: 'Cel mai bine evaluați', filter: 'minRating', value: 4 },
            { label: 'Preț accesibil', filter: 'priceRange', value: '0-300' },
          ]
        };
      } catch (error) {
        console.error('Error in getPopularSearches:', error);
        throw new Error('Failed to get popular searches');
      }
    }),

  // Get search filters and options
  getSearchFilters: publicProcedure
    .query(async () => {
      try {
        const categories = await db.getCategories();
        const areas = await db.getAreas();
        
        return {
          categories: categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
          })),
          areas: areas.map(area => ({
            id: area.id,
            name: area.name,
            city: area.city,
          })),
          priceRanges: [
            { label: '0-100 RON', value: '0-100', min: 0, max: 100 },
            { label: '100-300 RON', value: '100-300', min: 100, max: 300 },
            { label: '300-500 RON', value: '300-500', min: 300, max: 500 },
            { label: '500-1000 RON', value: '500-1000', min: 500, max: 1000 },
            { label: '1000+ RON', value: '1000+', min: 1000, max: 999999 },
          ],
          sortOptions: [
            { label: 'Recomandat', value: 'recommended', description: 'Cea mai bună potrivire' },
            { label: 'Cel mai bine evaluat', value: 'rating', description: 'Rating și recenzii' },
            { label: 'Preț crescător', value: 'price_low_to_high', description: 'De la cel mai mic preț' },
            { label: 'Preț descrescător', value: 'price_high_to_low', description: 'De la cel mai mare preț' },
            { label: 'Timp de răspuns', value: 'response_time', description: 'Cei mai rapizi' },
            { label: 'Cele mai noi', value: 'newest', description: 'Înregistrați recent' },
          ],
          ratingOptions: [
            { label: 'Orice rating', value: 0 },
            { label: '3+ stele', value: 3 },
            { label: '4+ stele', value: 4 },
            { label: '4.5+ stele', value: 4.5 },
            { label: 'Doar 5 stele', value: 5 },
          ],
          responseTimeOptions: [
            { label: 'Orice timp', value: 0 },
            { label: 'Sub 30 min', value: 30 },
            { label: 'Sub 1 oră', value: 60 },
            { label: 'Sub 2 ore', value: 120 },
            { label: 'Sub 6 ore', value: 360 },
          ],
        };
      } catch (error) {
        console.error('Error in getSearchFilters:', error);
        throw new Error('Failed to get search filters');
      }
    }),

  // Get nearby professionals (simplified without geolocation)
  getNearbyProfessionals: publicProcedure
    .input(z.object({
      area: z.string().optional(),
      category: z.string().optional(),
      limit: z.number().min(1).max(20).default(10),
    }))
    .query(async ({ input }) => {
      try {
        const { area, category, limit } = input;
        
        const profiles = await db.getProfiles({
          area,
          category,
          availableNow: true,
          sortBy: 'recommended',
          limit,
        });

        // Sort by verified status, rating, and response time for "nearby" effect
        const sortedProfiles = profiles.sort((a, b) => {
          if (a.verified !== b.verified) return b.verified ? 1 : -1;
          if (a.ratingAvg !== b.ratingAvg) return b.ratingAvg - a.ratingAvg;
          return a.responseTimeAvgMins - b.responseTimeAvgMins;
        });

        return {
          profiles: sortedProfiles.slice(0, limit),
          searchArea: area,
          totalFound: sortedProfiles.length,
        };
      } catch (error) {
        console.error('Error in getNearbyProfessionals:', error);
        throw new Error('Failed to get nearby professionals');
      }
    }),
});