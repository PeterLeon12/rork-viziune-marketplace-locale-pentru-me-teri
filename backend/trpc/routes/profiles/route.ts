import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { mockProfiles, mockServices, mockReviews } from '@/constants/data';

export const getProfiles = publicProcedure
  .input(z.object({
    category: z.string().optional(),
    area: z.string().optional(),
    search: z.string().optional(),
    verified: z.boolean().optional(),
    minRating: z.number().optional(),
    maxPrice: z.number().optional(),
  }))
  .query(({ input }: { input: any }) => {
    let results = mockProfiles.filter((profile) => {
      if (input.category && !profile.categories.includes(input.category)) {
        return false;
      }
      
      if (input.area && !profile.zones.includes(input.area)) {
        return false;
      }
      
      if (input.search) {
        const query = input.search.toLowerCase();
        return (
          profile.displayName.toLowerCase().includes(query) ||
          profile.about.toLowerCase().includes(query) ||
          profile.company.toLowerCase().includes(query)
        );
      }
      
      if (input.verified && !profile.verified) {
        return false;
      }
      
      if (input.minRating && profile.ratingAvg < input.minRating) {
        return false;
      }
      
      if (input.maxPrice && profile.minPrice > input.maxPrice) {
        return false;
      }
      
      return true;
    });
    
    return results;
  });

export const getProfileById = publicProcedure
  .input(z.string())
  .query(({ input }: { input: any }) => {
    return mockProfiles.find(p => p.id === input);
  });

export const getServicesByProId = publicProcedure
  .input(z.string())
  .query(({ input }: { input: any }) => {
    return mockServices.filter(s => s.proId === input);
  });

export const getReviewsByProId = publicProcedure
  .input(z.string())
  .query(({ input }: { input: any }) => {
    return mockReviews.filter(r => r.proId === input);
  });