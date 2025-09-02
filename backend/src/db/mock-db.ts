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
  // Cluj County
  { id: '1', name: 'Cluj-Napoca', city: 'Cluj-Napoca', county: 'Cluj' },
  { id: '2', name: 'Turda', city: 'Turda', county: 'Cluj' },
  { id: '3', name: 'Dej', city: 'Dej', county: 'Cluj' },
  { id: '4', name: 'Gherla', city: 'Gherla', county: 'Cluj' },
  
  // Bucharest
  { id: '5', name: 'Sector 1', city: 'București', county: 'București' },
  { id: '6', name: 'Sector 2', city: 'București', county: 'București' },
  { id: '7', name: 'Sector 3', city: 'București', county: 'București' },
  { id: '8', name: 'Sector 4', city: 'București', county: 'București' },
  { id: '9', name: 'Sector 5', city: 'București', county: 'București' },
  { id: '10', name: 'Sector 6', city: 'București', county: 'București' },
  
  // Timiș County
  { id: '11', name: 'Timișoara', city: 'Timișoara', county: 'Timiș' },
  { id: '12', name: 'Lugoj', city: 'Lugoj', county: 'Timiș' },
  { id: '13', name: 'Sânnicolau Mare', city: 'Sânnicolau Mare', county: 'Timiș' },
  
  // Constanța County
  { id: '14', name: 'Constanța', city: 'Constanța', county: 'Constanța' },
  { id: '15', name: 'Mangalia', city: 'Mangalia', county: 'Constanța' },
  { id: '16', name: 'Medgidia', city: 'Medgidia', county: 'Constanța' },
  
  // Iași County
  { id: '17', name: 'Iași', city: 'Iași', county: 'Iași' },
  { id: '18', name: 'Pașcani', city: 'Pașcani', county: 'Iași' },
  { id: '19', name: 'Târgu Frumos', city: 'Târgu Frumos', county: 'Iași' },
  
  // Brașov County
  { id: '20', name: 'Brașov', city: 'Brașov', county: 'Brașov' },
  { id: '21', name: 'Făgăraș', city: 'Făgăraș', county: 'Brașov' },
  { id: '22', name: 'Săcele', city: 'Săcele', county: 'Brașov' },
  
  // Dolj County
  { id: '23', name: 'Craiova', city: 'Craiova', county: 'Dolj' },
  { id: '24', name: 'Băilești', city: 'Băilești', county: 'Dolj' },
  { id: '25', name: 'Calafat', city: 'Calafat', county: 'Dolj' },
  
  // Galați County
  { id: '26', name: 'Galați', city: 'Galați', county: 'Galați' },
  { id: '27', name: 'Tecuci', city: 'Tecuci', county: 'Galați' },
  
  // Mureș County
  { id: '28', name: 'Târgu Mureș', city: 'Târgu Mureș', county: 'Mureș' },
  { id: '29', name: 'Reghin', city: 'Reghin', county: 'Mureș' },
  { id: '30', name: 'Sighișoara', city: 'Sighișoara', county: 'Mureș' },
  
  // Argeș County
  { id: '31', name: 'Pitești', city: 'Pitești', county: 'Argeș' },
  { id: '32', name: 'Câmpulung', city: 'Câmpulung', county: 'Argeș' },
  { id: '33', name: 'Curtea de Argeș', city: 'Curtea de Argeș', county: 'Argeș' },
  
  // Prahova County
  { id: '34', name: 'Ploiești', city: 'Ploiești', county: 'Prahova' },
  { id: '35', name: 'Câmpina', city: 'Câmpina', county: 'Prahova' },
  { id: '36', name: 'Azuga', city: 'Azuga', county: 'Prahova' },
  
  // Bihor County
  { id: '37', name: 'Oradea', city: 'Oradea', county: 'Bihor' },
  { id: '38', name: 'Salonta', city: 'Salonta', county: 'Bihor' },
  { id: '39', name: 'Marghita', city: 'Marghita', county: 'Bihor' },
  
  // Arad County
  { id: '40', name: 'Arad', city: 'Arad', county: 'Arad' },
  { id: '41', name: 'Lipova', city: 'Lipova', county: 'Arad' },
  { id: '42', name: 'Ineu', city: 'Ineu', county: 'Arad' },
  
  // Sibiu County
  { id: '43', name: 'Sibiu', city: 'Sibiu', county: 'Sibiu' },
  { id: '44', name: 'Mediaș', city: 'Mediaș', county: 'Sibiu' },
  { id: '45', name: 'Agnita', city: 'Agnita', county: 'Sibiu' },
  
  // Bacău County
  { id: '46', name: 'Bacău', city: 'Bacău', county: 'Bacău' },
  { id: '47', name: 'Onești', city: 'Onești', county: 'Bacău' },
  { id: '48', name: 'Comănești', city: 'Comănești', county: 'Bacău' },
  
  // Buzău County
  { id: '49', name: 'Buzău', city: 'Buzău', county: 'Buzău' },
  { id: '50', name: 'Râmnicu Sărat', city: 'Râmnicu Sărat', county: 'Buzău' },
  
  // Suceava County
  { id: '51', name: 'Suceava', city: 'Suceava', county: 'Suceava' },
  { id: '52', name: 'Fălticeni', city: 'Fălticeni', county: 'Suceava' },
  { id: '53', name: 'Rădăuți', city: 'Rădăuți', county: 'Suceava' },
  
  // Neamț County
  { id: '54', name: 'Piatra Neamț', city: 'Piatra Neamț', county: 'Neamț' },
  { id: '55', name: 'Roman', city: 'Roman', county: 'Neamț' },
  { id: '56', name: 'Bicaz', city: 'Bicaz', county: 'Neamț' },
  
  // Vâlcea County
  { id: '57', name: 'Râmnicu Vâlcea', city: 'Râmnicu Vâlcea', county: 'Vâlcea' },
  { id: '58', name: 'Drăgășani', city: 'Drăgășani', county: 'Vâlcea' },
  
  // Hunedoara County
  { id: '59', name: 'Deva', city: 'Deva', county: 'Hunedoara' },
  { id: '60', name: 'Hunedoara', city: 'Hunedoara', county: 'Hunedoara' },
  { id: '61', name: 'Petroșani', city: 'Petroșani', county: 'Hunedoara' },
  
  // Alba County
  { id: '62', name: 'Alba Iulia', city: 'Alba Iulia', county: 'Alba' },
  { id: '63', name: 'Aiud', city: 'Aiud', county: 'Alba' },
  { id: '64', name: 'Blaj', city: 'Blaj', county: 'Alba' },
  
  // Bistrița-Năsăud County
  { id: '65', name: 'Bistrița', city: 'Bistrița', county: 'Bistrița-Năsăud' },
  { id: '66', name: 'Năsăud', city: 'Năsăud', county: 'Bistrița-Năsăud' },
  
  // Sălaj County
  { id: '67', name: 'Zalău', city: 'Zalău', county: 'Sălaj' },
  { id: '68', name: 'Șimleu Silvaniei', city: 'Șimleu Silvaniei', county: 'Sălaj' },
  
  // Maramureș County
  { id: '69', name: 'Baia Mare', city: 'Baia Mare', county: 'Maramureș' },
  { id: '70', name: 'Sighetu Marmației', city: 'Sighetu Marmației', county: 'Maramureș' },
  { id: '71', name: 'Borșa', city: 'Borșa', county: 'Maramureș' },
  
  // Satu Mare County
  { id: '72', name: 'Satu Mare', city: 'Satu Mare', county: 'Satu Mare' },
  { id: '73', name: 'Carei', city: 'Carei', county: 'Satu Mare' },
  
  // Botoșani County
  { id: '74', name: 'Botoșani', city: 'Botoșani', county: 'Botoșani' },
  { id: '75', name: 'Dorohoi', city: 'Dorohoi', county: 'Botoșani' },
  
  // Vaslui County
  { id: '76', name: 'Vaslui', city: 'Vaslui', county: 'Vaslui' },
  { id: '77', name: 'Bârlad', city: 'Bârlad', county: 'Vaslui' },
  
  // Vrancea County
  { id: '78', name: 'Focșani', city: 'Focșani', county: 'Vrancea' },
  { id: '79', name: 'Adjud', city: 'Adjud', county: 'Vrancea' },
  
  // Teleorman County
  { id: '80', name: 'Alexandria', city: 'Alexandria', county: 'Teleorman' },
  { id: '81', name: 'Roșiori de Vede', city: 'Roșiori de Vede', county: 'Teleorman' },
  
  // Giurgiu County
  { id: '82', name: 'Giurgiu', city: 'Giurgiu', county: 'Giurgiu' },
  
  // Călărași County
  { id: '83', name: 'Călărași', city: 'Călărași', county: 'Călărași' },
  
  // Ialomița County
  { id: '84', name: 'Slobozia', city: 'Slobozia', county: 'Ialomița' },
  { id: '85', name: 'Fetești', city: 'Fetești', county: 'Ialomița' },
  
  // Brăila County
  { id: '86', name: 'Brăila', city: 'Brăila', county: 'Brăila' },
  { id: '87', name: 'Ianca', city: 'Ianca', county: 'Brăila' },
  
  // Tulcea County
  { id: '88', name: 'Tulcea', city: 'Tulcea', county: 'Tulcea' },
  { id: '89', name: 'Măcin', city: 'Măcin', county: 'Tulcea' },
  
  // Covasna County
  { id: '90', name: 'Sfântu Gheorghe', city: 'Sfântu Gheorghe', county: 'Covasna' },
  { id: '91', name: 'Târgu Secuiesc', city: 'Târgu Secuiesc', county: 'Covasna' },
  
  // Harghita County
  { id: '92', name: 'Miercurea Ciuc', city: 'Miercurea Ciuc', county: 'Harghita' },
  { id: '93', name: 'Odorheiu Secuiesc', city: 'Odorheiu Secuiesc', county: 'Harghita' },
  
  // Mehedinți County
  { id: '94', name: 'Drobeta-Turnu Severin', city: 'Drobeta-Turnu Severin', county: 'Mehedinți' },
  { id: '95', name: 'Orșova', city: 'Orșova', county: 'Mehedinți' },
  
  // Gorj County
  { id: '96', name: 'Târgu Jiu', city: 'Târgu Jiu', county: 'Gorj' },
  { id: '97', name: 'Motru', city: 'Motru', county: 'Gorj' },
  
  // Olt County
  { id: '98', name: 'Slatina', city: 'Slatina', county: 'Olt' },
  { id: '99', name: 'Caracal', city: 'Caracal', county: 'Olt' },
  
  // Dâmbovița County
  { id: '100', name: 'Târgoviște', city: 'Târgoviște', county: 'Dâmbovița' },
  { id: '101', name: 'Moreni', city: 'Moreni', county: 'Dâmbovița' },
  
  // Ilfov County
  { id: '102', name: 'Voluntari', city: 'Voluntari', county: 'Ilfov' },
  { id: '103', name: 'Buftea', city: 'Buftea', county: 'Ilfov' },
  { id: '104', name: 'Otopeni', city: 'Otopeni', county: 'Ilfov' },
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
    displayName: 'ElectricMaster București',
    company: 'ElectricMaster PFA',
    categories: ['2'],
    zones: ['5', '6', '7'],
    minPrice: 150,
    about: 'Electrician autorizat cu experiență de 15 ani. Specializat în instalații electrice rezidențiale și comerciale.',
    verified: true,
    responseTimeAvgMins: 8,
    ratingAvg: 4.9,
    ratingCount: 89,
    isActive: true,
    contact: {
      phone: '+40721234568',
      whatsappLink: 'https://wa.me/40721234568'
    },
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    userId: 'user3',
    displayName: 'Timișoara Instalații',
    company: 'Timișoara Instalații SRL',
    categories: ['1', '4'],
    zones: ['11', '12'],
    minPrice: 100,
    about: 'Servicii complete de instalații și montaj AC în Timișoara și împrejurimi. Răspundem rapid la solicitări.',
    verified: true,
    responseTimeAvgMins: 15,
    ratingAvg: 4.7,
    ratingCount: 156,
    isActive: true,
    contact: {
      phone: '+40721234569',
      whatsappLink: 'https://wa.me/40721234569'
    },
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-02-01T09:15:00Z'
  },
  {
    id: '4',
    userId: 'user4',
    displayName: 'Constanța Electric',
    company: 'Constanța Electric PFA',
    categories: ['2', '3'],
    zones: ['14', '15'],
    minPrice: 130,
    about: 'Electrician cu experiență în zona Constanța. Reparații electrocasnice și instalații electrice.',
    verified: false,
    responseTimeAvgMins: 25,
    ratingAvg: 4.5,
    ratingCount: 67,
    isActive: true,
    contact: {
      phone: '+40721234570',
      whatsappLink: 'https://wa.me/40721234570'
    },
    photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-02-10T16:45:00Z'
  },
  {
    id: '5',
    userId: 'user5',
    displayName: 'Iași Dulgherie',
    company: 'Iași Dulgherie SRL',
    categories: ['6'],
    zones: ['17', '18'],
    minPrice: 80,
    about: 'Dulgher cu experiență de 20 de ani. Mobilier la comandă, reparații și montaje.',
    verified: true,
    responseTimeAvgMins: 30,
    ratingAvg: 4.8,
    ratingCount: 234,
    isActive: true,
    contact: {
      phone: '+40721234571',
      whatsappLink: 'https://wa.me/40721234571'
    },
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-02-15T11:20:00Z'
  },
  {
    id: '6',
    userId: 'user6',
    displayName: 'Brașov Zugraveli',
    company: 'Brașov Zugraveli PFA',
    categories: ['5'],
    zones: ['20', '21'],
    minPrice: 60,
    about: 'Zugrav cu experiență în vopsitorii interioare și exterioare. Materiale de calitate.',
    verified: true,
    responseTimeAvgMins: 20,
    ratingAvg: 4.6,
    ratingCount: 145,
    isActive: true,
    contact: {
      phone: '+40721234572',
      whatsappLink: 'https://wa.me/40721234572'
    },
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-02-20T13:10:00Z'
  },
  {
    id: '7',
    userId: 'user7',
    displayName: 'Craiova Curățenie',
    company: 'Craiova Curățenie SRL',
    categories: ['7'],
    zones: ['23', '24'],
    minPrice: 40,
    about: 'Servicii de curățenie profesională pentru case și birouri. Echipă dedicată și materiale eco.',
    verified: false,
    responseTimeAvgMins: 45,
    ratingAvg: 4.4,
    ratingCount: 78,
    isActive: true,
    contact: {
      phone: '+40721234573',
      whatsappLink: 'https://wa.me/40721234573'
    },
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-02-25T08:30:00Z'
  },
  {
    id: '8',
    userId: 'user8',
    displayName: 'Galați Instalații',
    company: 'Galați Instalații PFA',
    categories: ['1', '2'],
    zones: ['26', '27'],
    minPrice: 110,
    about: 'Instalații sanitare și electrice în Galați. Răspundem rapid și oferim garanție.',
    verified: true,
    responseTimeAvgMins: 18,
    ratingAvg: 4.7,
    ratingCount: 112,
    isActive: true,
    contact: {
      phone: '+40721234574',
      whatsappLink: 'https://wa.me/40721234574'
    },
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-03-01T12:00:00Z'
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
