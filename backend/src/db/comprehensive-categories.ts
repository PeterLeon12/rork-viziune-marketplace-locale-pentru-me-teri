// Clean, Focused Categories for Meșterul Marketplace
// Based on the user's preferred approach - 8 main categories with subcategories

export interface FocusedCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories: string[];
}

export const focusedCategories: FocusedCategory[] = [
  {
    id: 'assembly',
    name: 'Assembly',
    description: 'Furniture and item assembly services',
    icon: '🔧',
    color: '#3B82F6',
    subcategories: [
      'General Furniture Assembly',
      'IKEA Assembly',
      'Crib Assembly',
      'PAX Assembly',
      'Bookshelf Assembly',
      'Desk Assembly'
    ]
  },
  {
    id: 'mounting',
    name: 'Mounting',
    description: 'Hanging and installation services',
    icon: '⚡',
    color: '#F59E0B',
    subcategories: [
      'Hang Art, Mirror & Decor',
      'Install Blinds & Window Treatments',
      'Mount & Anchor Furniture',
      'Install Shelves, Rods & Hooks',
      'Other Mounting',
      'TV Mounting'
    ]
  },
  {
    id: 'moving',
    name: 'Moving',
    description: 'Moving and transportation services',
    icon: '🚚',
    color: '#10B981',
    subcategories: [
      'Help Moving',
      'Truck-Assisted Help Moving',
      'Trash & Furniture Removal',
      'Heavy Lifting & Loading',
      'Rearrange Furniture',
      'Junk Haul Away'
    ]
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Cleaning and maintenance services',
    icon: '✨',
    color: '#EC4899',
    subcategories: [
      'Cleaning',
      'Spring Cleaning',
      'Apartment Cleaning',
      'Deep Clean',
      'Garage Cleaning',
      'Move Out Clean'
    ]
  },
  {
    id: 'outdoor-help',
    name: 'Outdoor Help',
    description: 'Garden and outdoor services',
    icon: '🌱',
    color: '#059669',
    subcategories: [
      'Yard Work',
      'Lawn Care',
      'Weed Removal',
      'Mulching',
      'Gardening Services',
      'Landscaping',
      'Lawn Mowing',
      'Branch & Hedge Trimming'
    ]
  },
  {
    id: 'home-repairs',
    name: 'Home Repairs',
    description: 'General home repair services',
    icon: '🔨',
    color: '#8B5CF6',
    subcategories: [
      'Door, Cabinet, & Furniture Repair',
      'Wall Repair',
      'Sealing & Caulking',
      'Appliance Installation & Repairs',
      'Window & Blinds Repair',
      'Flooring & Tiling Help',
      'Electrical Help',
      'Plumbing Help',
      'Light Carpentry'
    ]
  },
  {
    id: 'painting',
    name: 'Painting',
    description: 'Painting and wallpaper services',
    icon: '🎨',
    color: '#EF4444',
    subcategories: [
      'Indoor Painting',
      'Wallpapering',
      'Outdoor Painting',
      'Concrete & Brick Painting',
      'Accent Wall Painting',
      'Wallpaper Removal'
    ]
  },
  {
    id: 'trending',
    name: 'Trending',
    description: 'Popular and trending services',
    icon: '🔥',
    color: '#F97316',
    subcategories: [
      'General Furniture Assembly',
      'General Mounting',
      'TV Mounting',
      'Help Moving',
      'Cleaning',
      'Donation Drop Off',
      'Personal Assistant'
    ]
  }
];

// Helper functions
export function getAllCategories(): FocusedCategory[] {
  return focusedCategories;
}

export function getCategoryById(id: string): FocusedCategory | undefined {
  return focusedCategories.find(cat => cat.id === id);
}

export function searchCategories(query: string): FocusedCategory[] {
  const lowerQuery = query.toLowerCase();
  return focusedCategories.filter(cat => 
    cat.name.toLowerCase().includes(lowerQuery) ||
    cat.description.toLowerCase().includes(lowerQuery) ||
    cat.subcategories.some(sub => sub.toLowerCase().includes(lowerQuery))
  );
}

export function getPopularCategories(): FocusedCategory[] {
  // Return all categories as they're all popular
  return focusedCategories;
}
