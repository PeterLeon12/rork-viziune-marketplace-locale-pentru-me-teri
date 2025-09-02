// Comprehensive and Inclusive Categories for Meșterul Marketplace
// This covers all types of services people might need in Romania

export interface ComprehensiveCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories?: string[];
  popular: boolean;
  emergency: boolean;
  business: boolean;
}

export const comprehensiveCategories: ComprehensiveCategory[] = [
  // 🏠 HOME MAINTENANCE & REPAIRS
  {
    id: 'plumbing',
    name: 'Instalații Sanitare',
    description: 'Reparații și montaj instalații sanitare, țevi, robinete',
    icon: '🔧',
    color: '#3B82F6',
    subcategories: ['Reparații țevi', 'Montaj WC', 'Reparații robinete', 'Instalații noi'],
    popular: true,
    emergency: true,
    business: true
  },
  {
    id: 'electrical',
    name: 'Lucrări Electrice',
    description: 'Instalații electrice, reparații, montaj prize și întrerupătoare',
    icon: '⚡',
    color: '#F59E0B',
    subcategories: ['Instalații noi', 'Reparații', 'Montaj prize', 'Siguranțe'],
    popular: true,
    emergency: true,
    business: true
  },
  {
    id: 'heating',
    name: 'Încălzire & AC',
    description: 'Montaj și reparatii centrale termice, aer condiționat',
    icon: '🌡️',
    color: '#EF4444',
    subcategories: ['Centrale termice', 'Aer condiționat', 'Radiatoare', 'Termostat'],
    popular: true,
    emergency: false,
    business: true
  },
  {
    id: 'carpentry',
    name: 'Dulgherie',
    description: 'Lucrări din lemn, mobilă, uși, ferestre',
    icon: '🪚',
    color: '#8B5CF6',
    subcategories: ['Mobilă personalizată', 'Reparații uși', 'Montaj ferestre', 'Garde robe'],
    popular: true,
    emergency: false,
    business: true
  },
  {
    id: 'painting',
    name: 'Zugrăveli',
    description: 'Vopsire interioară și exterioară, tapetare',
    icon: '🎨',
    color: '#10B981',
    subcategories: ['Vopsire interioară', 'Vopsire exterioară', 'Tapetare', 'Glet'],
    popular: true,
    emergency: false,
    business: true
  },
  {
    id: 'plastering',
    name: 'Gips & Tencuieli',
    description: 'Lucrări de gips, tencuieli, finisaje',
    icon: '🏗️',
    color: '#06B6D4',
    subcategories: ['Gips carton', 'Tencuieli', 'Finisaje', 'Reparații'],
    popular: true,
    emergency: false,
    business: true
  },
  {
    id: 'flooring',
    name: 'Parchet & Gresie',
    description: 'Montaj parchet, gresie, laminat, mozaic',
    icon: '🪵',
    color: '#84CC16',
    subcategories: ['Parchet', 'Gresie', 'Laminat', 'Mozaic'],
    popular: true,
    emergency: false,
    business: true
  },

  // 🏢 BUSINESS & OFFICE SERVICES
  {
    id: 'office-maintenance',
    name: 'Întreținere Birouri',
    description: 'Servicii de întreținere pentru birouri și spații comerciale',
    icon: '🏢',
    color: '#6366F1',
    subcategories: ['Curățenie birouri', 'Reparații', 'Montaj mobilă', 'Siguranță'],
    popular: false,
    emergency: false,
    business: true
  },
  {
    id: 'retail-services',
    name: 'Servicii Retail',
    description: 'Montaj vitrine, organizare magazine, reparatii',
    icon: '🛍️',
    color: '#EC4899',
    subcategories: ['Vitrine', 'Organizare', 'Reparații', 'Siguranță'],
    popular: false,
    emergency: false,
    business: true
  },

  // 🚗 AUTOMOTIVE & TRANSPORT
  {
    id: 'auto-repair',
    name: 'Reparații Auto',
    description: 'Reparații mecanice, electrice, caroserie',
    icon: '🚗',
    color: '#F97316',
    subcategories: ['Mecanică', 'Electrică', 'Caroserie', 'Vulcanizare'],
    popular: true,
    emergency: true,
    business: true
  },
  {
    id: 'towing',
    name: 'Remorcare',
    description: 'Servicii de remorcare și transport auto',
    icon: '🚛',
    color: '#6B7280',
    subcategories: ['Remorcare', 'Transport', 'Urgențe', 'Asistență rutieră'],
    popular: false,
    emergency: true,
    business: true
  },

  // 🌱 GARDEN & OUTDOOR
  {
    id: 'gardening',
    name: 'Grădinărit',
    description: 'Întreținere grădini, plantare, tăiere gazon',
    icon: '🌱',
    color: '#059669',
    subcategories: ['Întreținere', 'Plantare', 'Tăiere gazon', 'Sistem irigații'],
    popular: true,
    emergency: false,
    business: true
  },
  {
    id: 'landscaping',
    name: 'Amenajări Exterioare',
    description: 'Proiectare și amenajare spații exterioare',
    icon: '🏡',
    color: '#65A30D',
    subcategories: ['Proiectare', 'Construcții', 'Pavaje', 'Gradini'],
    popular: false,
    emergency: false,
    business: true
  },

  // 🧹 CLEANING & MAINTENANCE
  {
    id: 'cleaning',
    name: 'Curățenie',
    description: 'Servicii de curățenie pentru case și birouri',
    icon: '✨',
    color: '#EC4899',
    subcategories: ['Curățenie generală', 'Curățenie după renovare', 'Curățenie birouri', 'Curățenie specială'],
    popular: true,
    emergency: false,
    business: true
  },
  {
    id: 'pest-control',
    name: 'Dezinsectizare',
    description: 'Controlul dăunătorilor și insectelor',
    icon: '🦟',
    color: '#7C3AED',
    subcategories: ['Dezinsectizare', 'Deratizare', 'Dezinfectare', 'Prevenție'],
    popular: false,
    emergency: false,
    business: true
  },

  // 🔒 SECURITY & SAFETY
  {
    id: 'security',
    name: 'Siguranță & Securitate',
    description: 'Sisteme de alarmă, camere video, control acces',
    icon: '🔒',
    color: '#DC2626',
    subcategories: ['Sisteme alarmă', 'Camere video', 'Control acces', 'Siguranță incendiu'],
    popular: false,
    emergency: false,
    business: true
  },
  {
    id: 'locksmith',
    name: 'Lăcătuș',
    description: 'Reparații încuietori, copii chei, deschidere uși',
    icon: '🔑',
    color: '#CA8A04',
    subcategories: ['Reparații încuietori', 'Copii chei', 'Deschidere uși', 'Siguranță'],
    popular: false,
    emergency: true,
    business: true
  },

  // 📱 TECHNOLOGY & IT
  {
    id: 'it-support',
    name: 'Suport IT',
    description: 'Asistență tehnică, reparații calculatoare, rețele',
    icon: '💻',
    color: '#2563EB',
    subcategories: ['Reparații PC', 'Rețele', 'Software', 'Asistență'],
    popular: true,
    emergency: false,
    business: true
  },
  {
    id: 'smart-home',
    name: 'Casă Inteligentă',
    description: 'Instalare sisteme smart home, automatizări',
    icon: '🏠',
    color: '#0891B2',
    subcategories: ['Iluminat inteligent', 'Termostat smart', 'Securitate', 'Entertainment'],
    popular: false,
    emergency: false,
    business: true
  },

  // 🎉 EVENTS & ENTERTAINMENT
  {
    id: 'event-services',
    name: 'Servicii Evenimente',
    description: 'Organizare evenimente, decor, logistică',
    icon: '🎉',
    color: '#DB2777',
    subcategories: ['Organizare', 'Decor', 'Logistică', 'Tehnică'],
    popular: false,
    emergency: false,
    business: true
  },
  {
    id: 'photography',
    name: 'Fotografie & Video',
    description: 'Servicii foto-video pentru evenimente și business',
    icon: '📸',
    color: '#7C2D12',
    subcategories: ['Evenimente', 'Business', 'Portrete', 'Produse'],
    popular: false,
    emergency: false,
    business: true
  },

  // 🚚 MOVING & STORAGE
  {
    id: 'moving',
    name: 'Mutări & Transport',
    description: 'Servicii de mutare, transport, depozitare',
    icon: '🚚',
    color: '#059669',
    subcategories: ['Mutări case', 'Transport mobila', 'Depozitare', 'Ambalare'],
    popular: true,
    emergency: false,
    business: true
  },
  {
    id: 'storage',
    name: 'Depozitare',
    description: 'Soluții de depozitare și organizare',
    icon: '📦',
    color: '#6B7280',
    subcategories: ['Depozite', 'Organizare', 'Siguranță', 'Acces 24/7'],
    popular: false,
    emergency: false,
    business: true
  },

  // 🏥 HEALTH & WELLNESS
  {
    id: 'health-services',
    name: 'Servicii Medicale',
    description: 'Servicii medicale la domiciliu, asistență',
    icon: '🏥',
    color: '#DC2626',
    subcategories: ['Asistență medicală', 'Fizioterapie', 'Îngrijire', 'Consultații'],
    popular: false,
    emergency: true,
    business: true
  },
  {
    id: 'wellness',
    name: 'Bunăstare',
    description: 'Servicii de wellness, masaj, fitness',
    icon: '🧘',
    color: '#059669',
    subcategories: ['Masaj', 'Fitness', 'Yoga', 'Meditație'],
    popular: false,
    emergency: false,
    business: true
  },

  // 🎨 CREATIVE & DESIGN
  {
    id: 'graphic-design',
    name: 'Design Grafic',
    description: 'Servicii de design grafic, branding, marketing',
    icon: '🎨',
    color: '#7C3AED',
    subcategories: ['Logo design', 'Branding', 'Marketing', 'Social media'],
    popular: false,
    emergency: false,
    business: true
  },
  {
    id: 'interior-design',
    name: 'Design Interior',
    description: 'Proiectare și amenajare interioare',
    icon: '🏠',
    color: '#DB2777',
    subcategories: ['Proiectare', 'Amenajare', 'Mobilă', 'Decor'],
    popular: false,
    emergency: false,
    business: true
  },

  // 📚 EDUCATION & TRAINING
  {
    id: 'education',
    name: 'Educație & Training',
    description: 'Servicii educaționale, cursuri, training-uri',
    icon: '📚',
    color: '#2563EB',
    subcategories: ['Cursuri online', 'Training-uri', 'Tutoring', 'Certificări'],
    popular: false,
    emergency: false,
    business: true
  },
  {
    id: 'language-teaching',
    name: 'Predare Limbi',
    description: 'Învățarea limbilor străine',
    icon: '🗣️',
    color: '#0891B2',
    subcategories: ['Engleză', 'Germană', 'Franceză', 'Spaniolă'],
    popular: false,
    emergency: false,
    business: true
  },

  // 🚪 SPECIALIZED SERVICES
  {
    id: 'glass-repair',
    name: 'Reparații Sticlă',
    description: 'Reparații geamuri, oglinzi, vitrine',
    icon: '🪟',
    color: '#0EA5E9',
    subcategories: ['Geamuri', 'Oglinzi', 'Vitrine', 'Reparații'],
    popular: false,
    emergency: true,
    business: true
  },
  {
    id: 'metalwork',
    name: 'Lucrări Metalice',
    description: 'Lucrări din metal, fier forjat, reparații',
    icon: '⚒️',
    color: '#6B7280',
    subcategories: ['Fier forjat', 'Reparații', 'Construcții', 'Decor'],
    popular: false,
    emergency: false,
    business: true
  },
  {
    id: 'roofing',
    name: 'Acoperișuri',
    description: 'Reparații și montaj acoperișuri, izolații',
    icon: '🏠',
    color: '#7C2D12',
    subcategories: ['Reparații', 'Montaj', 'Izolații', 'Gutters'],
    popular: false,
    emergency: true,
    business: true
  },
  {
    id: 'solar-installation',
    name: 'Panouri Solare',
    description: 'Instalare și întreținere sisteme solare',
    icon: '☀️',
    color: '#F59E0B',
    subcategories: ['Instalare', 'Întreținere', 'Reparații', 'Optimizare'],
    popular: false,
    emergency: false,
    business: true
  }
];

// Helper functions
export function getPopularCategories(): ComprehensiveCategory[] {
  return comprehensiveCategories.filter(cat => cat.popular);
}

export function getEmergencyCategories(): ComprehensiveCategory[] {
  return comprehensiveCategories.filter(cat => cat.emergency);
}

export function getBusinessCategories(): ComprehensiveCategory[] {
  return comprehensiveCategories.filter(cat => cat.business);
}

export function getCategoryById(id: string): ComprehensiveCategory | undefined {
  return comprehensiveCategories.find(cat => cat.id === id);
}

export function searchCategories(query: string): ComprehensiveCategory[] {
  const lowerQuery = query.toLowerCase();
  return comprehensiveCategories.filter(cat => 
    cat.name.toLowerCase().includes(lowerQuery) ||
    cat.description.toLowerCase().includes(lowerQuery) ||
    cat.subcategories?.some(sub => sub.toLowerCase().includes(lowerQuery))
  );
}

export function getCategoriesByType(type: 'popular' | 'emergency' | 'business'): ComprehensiveCategory[] {
  switch (type) {
    case 'popular':
      return getPopularCategories();
    case 'emergency':
      return getEmergencyCategories();
    case 'business':
      return getBusinessCategories();
    default:
      return comprehensiveCategories;
  }
}
