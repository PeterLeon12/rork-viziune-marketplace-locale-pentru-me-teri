// Mock database for development when PostgreSQL is not available
// Mock data for development
const categories = [
  { id: '1', name: 'Instalații', icon: 'wrench', color: '#3B82F6' },
  { id: '2', name: 'Electric', icon: 'zap', color: '#F59E0B' },
  { id: '3', name: 'Electrocasnice', icon: 'tv', color: '#10B981' },
  { id: '4', name: 'Montaj AC', icon: 'wind', color: '#06B6D4' },
  { id: '5', name: 'Zugraveli', icon: 'paintbrush', color: '#8B5CF6' },
  { id: '6', name: 'Dulgherie', icon: 'hammer', color: '#F97316' },
  { id: '7', name: 'Curățenie', icon: 'sparkles', color: '#EC4899' },
];

const areas = [
  { id: '1', name: 'Mănăștur', city: 'Cluj-Napoca' },
  { id: '2', name: 'Gheorgheni', city: 'Cluj-Napoca' },
  { id: '3', name: 'Zorilor', city: 'Cluj-Napoca' },
  { id: '4', name: 'Mărăști', city: 'Cluj-Napoca' },
  { id: '5', name: 'Grigorescu', city: 'Cluj-Napoca' },
  { id: '6', name: 'Florești', city: 'Cluj-Napoca' },
  { id: '7', name: 'Centru', city: 'Cluj-Napoca' },
];

const mockProfiles = [
  {
    id: '1',
    userId: 'user1',
    displayName: 'Instalații Pro SRL',
    company: 'Instalații Pro SRL',
    categories: ['1'],
    zones: ['1', '2', '3'],
    minPrice: 120,
    about: 'Echipă cu experiență de peste 10 ani în instalații sanitare și termice. Lucrăm cu materiale de calitate și oferim garanție.',
    verified: true,
    responseTimeAvgMins: 12,
    ratingAvg: 4.8,
    ratingCount: 123,
    isActive: true,
    contact: {
      phone: '+40721234567',
      whatsappLink: 'https://wa.me/40721234567'
    },
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    displayName: 'ElectricMaster',
    company: 'ElectricMaster PFA',
    categories: ['2'],
    zones: ['2', '4', '5'],
    minPrice: 80,
    about: 'Electrician autorizat ANRE cu experiență în instalații electrice rezidențiale și comerciale. Intervenții rapide 24/7.',
    verified: true,
    responseTimeAvgMins: 8,
    ratingAvg: 4.9,
    ratingCount: 87,
    isActive: true,
    contact: {
      phone: '+40722345678',
      whatsappLink: 'https://wa.me/40722345678'
    },
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-02-01T14:30:00Z'
  },
  {
    id: '3',
    userId: 'user3',
    displayName: 'Service Electrocasnice Cluj',
    company: 'Service Electrocasnice Cluj',
    categories: ['3'],
    zones: ['1', '3', '6'],
    minPrice: 60,
    about: 'Reparații și service pentru toate tipurile de electrocasnice. Piese originale și garanție extinsă.',
    verified: false,
    responseTimeAvgMins: 25,
    ratingAvg: 4.6,
    ratingCount: 45,
    isActive: true,
    contact: {
      phone: '+40723456789',
      whatsappLink: 'https://wa.me/40723456789'
    },
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-03-10T09:15:00Z'
  },
  {
    id: '4',
    userId: 'user4',
    displayName: 'AC Solutions',
    company: 'AC Solutions SRL',
    categories: ['4'],
    zones: ['2', '3', '4', '7'],
    minPrice: 200,
    about: 'Specialiști în montaj, service și întreținere sisteme de climatizare. Parteneri autorizați Daikin, Mitsubishi.',
    verified: true,
    responseTimeAvgMins: 15,
    ratingAvg: 4.7,
    ratingCount: 92,
    isActive: true,
    contact: {
      phone: '+40724567890',
      whatsappLink: 'https://wa.me/40724567890'
    },
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-20T16:45:00Z'
  },
  {
    id: '5',
    userId: 'user5',
    displayName: 'Zugravi Profesional',
    company: 'Zugravi Profesional PFA',
    categories: ['5'],
    zones: ['1', '2', '5', '6'],
    minPrice: 15,
    about: 'Zugraveli interioare și exterioare cu materiale premium. Consultanță gratuită pentru alegerea culorilor.',
    verified: true,
    responseTimeAvgMins: 30,
    ratingAvg: 4.5,
    ratingCount: 156,
    isActive: true,
    contact: {
      phone: '+40725678901',
      whatsappLink: 'https://wa.me/40725678901'
    },
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-02-15T11:20:00Z'
  }
];

const mockServices = [
  {
    id: '1',
    proId: '1',
    title: 'Montaj centrală termică',
    description: 'Montaj centrală termică cu garanție 2 ani',
    priceFrom: 800,
    unit: 'lucrare',
    visible: true
  },
  {
    id: '2',
    proId: '1',
    title: 'Reparații instalații sanitare',
    description: 'Reparații țevi, robinete, WC',
    priceFrom: 120,
    unit: 'oră',
    visible: true
  },
  {
    id: '3',
    proId: '2',
    title: 'Instalații electrice',
    description: 'Instalații electrice complete pentru apartamente',
    priceFrom: 25,
    unit: 'mp',
    visible: true
  },
  {
    id: '4',
    proId: '4',
    title: 'Montaj aer condiționat',
    description: 'Montaj AC split cu garanție',
    priceFrom: 200,
    unit: 'unitate',
    visible: true
  }
];

const mockReviews = [
  {
    id: '1',
    proId: '1',
    clientId: 'client1',
    clientName: 'Maria P.',
    rating: 5,
    recommend: true,
    comment: 'Foarte profesionali! Au montat centrala termică rapid și curat. Recomand cu încredere!',
    photos: [],
    createdAt: '2024-03-01T10:30:00Z',
    verifiedContact: true
  },
  {
    id: '2',
    proId: '1',
    clientId: 'client2',
    clientName: 'Ion M.',
    rating: 4,
    recommend: true,
    comment: 'Lucrare de calitate, au venit la timp. Prețul a fost corect.',
    photos: [],
    createdAt: '2024-02-28T14:15:00Z',
    verifiedContact: true
  },
  {
    id: '3',
    proId: '2',
    clientId: 'client3',
    clientName: 'Ana D.',
    rating: 5,
    recommend: true,
    comment: 'Electrician foarte competent! A rezolvat problema rapid și a explicat tot ce a făcut.',
    photos: [],
    createdAt: '2024-03-05T16:20:00Z',
    verifiedContact: true
  }
];

export const mockDb = {
  users: new Map(),
  proProfiles: new Map(),
  services: new Map(),
  reviews: new Map(),
  categories: new Map(),
  areas: new Map(),
  otpVerifications: new Map(),
};

// Initialize mock data
export function initializeMockDb() {
  // Initialize categories
  categories.forEach(category => {
    mockDb.categories.set(category.id, category);
  });

  // Initialize areas
  areas.forEach(area => {
    mockDb.areas.set(area.id, area);
  });

  // Initialize mock profiles
  mockProfiles.forEach(profile => {
    mockDb.proProfiles.set(profile.id, profile);
  });

  // Initialize mock services
  mockServices.forEach(service => {
    mockDb.services.set(service.id, service);
  });

  // Initialize mock reviews
  mockReviews.forEach(review => {
    mockDb.reviews.set(review.id, review);
  });

  console.log('✅ Mock database initialized with sample data');
}

// Mock database operations
export const mockDbOperations = {
  // Users
  createUser: (user: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newUser = { ...user, id, createdAt: new Date().toISOString() };
    mockDb.users.set(id, newUser);
    return newUser;
  },

  getUserByPhone: (phone: string) => {
    for (const user of mockDb.users.values()) {
      if (user.phone === phone) return user;
    }
    return null;
  },

  getUserById: (id: string) => {
    return mockDb.users.get(id) || null;
  },

  updateUser: (id: string, updates: any) => {
    const user = mockDb.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      mockDb.users.set(id, updatedUser);
      return updatedUser;
    }
    return null;
  },

  // OTP Verifications
  createOTP: (phone: string, otp: string, expiresAt: Date) => {
    const id = Math.random().toString(36).substr(2, 9);
    const otpRecord = { id, phone, otp, expiresAt, verified: false, createdAt: new Date() };
    mockDb.otpVerifications.set(id, otpRecord);
    return otpRecord;
  },

  verifyOTP: (phone: string, otp: string) => {
    for (const record of mockDb.otpVerifications.values()) {
      if (record.phone === phone && record.otp === otp && record.expiresAt > new Date() && !record.verified) {
        record.verified = true;
        return record;
      }
    }
    return null;
  },

  // Profiles
  getProfiles: (filters: any = {}) => {
    let profiles = Array.from(mockDb.proProfiles.values());
    
    // Apply filters
    if (filters.category) {
      profiles = profiles.filter(p => p.categories.includes(filters.category));
    }
    if (filters.area) {
      profiles = profiles.filter(p => p.zones.includes(filters.area));
    }
    if (filters.minRating) {
      profiles = profiles.filter(p => p.ratingAvg >= filters.minRating);
    }
    if (filters.verified !== undefined) {
      profiles = profiles.filter(p => p.verified === filters.verified);
    }
    if (filters.availableNow !== undefined) {
      profiles = profiles.filter(p => p.isActive === filters.availableNow);
    }
    if (filters.maxPrice) {
      profiles = profiles.filter(p => p.minPrice <= filters.maxPrice);
    }
    if (filters.query) {
      const query = filters.query.toLowerCase();
      profiles = profiles.filter(p => 
        p.displayName.toLowerCase().includes(query) ||
        p.company.toLowerCase().includes(query) ||
        p.about.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (filters.sortBy === 'rating') {
      profiles.sort((a, b) => b.ratingAvg - a.ratingAvg);
    } else if (filters.sortBy === 'price') {
      profiles.sort((a, b) => a.minPrice - b.minPrice);
    } else if (filters.sortBy === 'responseTime') {
      profiles.sort((a, b) => a.responseTimeAvgMins - b.responseTimeAvgMins);
    } else {
      // Default: recommended sorting
      profiles.sort((a, b) => {
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
    }

    return profiles;
  },

  getProfileById: (id: string) => {
    return mockDb.proProfiles.get(id) || null;
  },

  createProfile: (profile: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newProfile = { ...profile, id, createdAt: new Date().toISOString() };
    mockDb.proProfiles.set(id, newProfile);
    return newProfile;
  },

  updateProfile: (id: string, updates: any) => {
    const profile = mockDb.proProfiles.get(id);
    if (profile) {
      const updatedProfile = { ...profile, ...updates, updatedAt: new Date().toISOString() };
      mockDb.proProfiles.set(id, updatedProfile);
      return updatedProfile;
    }
    return null;
  },

  // Services
  getServicesByProId: (proId: string) => {
    return Array.from(mockDb.services.values()).filter(s => s.proId === proId);
  },

  // Reviews
  getReviewsByProId: (proId: string) => {
    return Array.from(mockDb.reviews.values()).filter(r => r.proId === proId);
  },

  // Categories and Areas
  getCategories: () => Array.from(mockDb.categories.values()),
  getAreas: () => Array.from(mockDb.areas.values()),
};
