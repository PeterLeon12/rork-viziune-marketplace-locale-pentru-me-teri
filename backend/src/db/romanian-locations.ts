/**
 * Comprehensive Romanian Locations Database
 * All 41 counties + major cities and neighborhoods
 */

export interface Location {
  id: string;
  name: string;
  city: string;
  county: string;
  type: 'county_capital' | 'major_city' | 'city' | 'town' | 'neighborhood' | 'sector';
  population?: number;
}

export const romanianLocations: Location[] = [
  // ALBA County
  { id: 'alba_001', name: 'Alba Iulia', city: 'Alba Iulia', county: 'Alba', type: 'county_capital', population: 64227 },
  { id: 'alba_002', name: 'Blaj', city: 'Blaj', county: 'Alba', type: 'city', population: 18784 },
  { id: 'alba_003', name: 'Sebeș', city: 'Sebeș', county: 'Alba', type: 'city', population: 27019 },
  { id: 'alba_004', name: 'Aiud', city: 'Aiud', county: 'Alba', type: 'city', population: 22876 },
  
  // ARAD County
  { id: 'arad_001', name: 'Arad', city: 'Arad', county: 'Arad', type: 'county_capital', population: 159704 },
  { id: 'arad_002', name: 'Ineu', city: 'Ineu', county: 'Arad', type: 'city', population: 9129 },
  { id: 'arad_003', name: 'Lipova', city: 'Lipova', county: 'Arad', type: 'city', population: 10313 },
  { id: 'arad_004', name: 'Pecica', city: 'Pecica', county: 'Arad', type: 'city', population: 12762 },
  
  // ARGEȘ County
  { id: 'arges_001', name: 'Pitești', city: 'Pitești', county: 'Argeș', type: 'county_capital', population: 155383 },
  { id: 'arges_002', name: 'Curtea de Argeș', city: 'Curtea de Argeș', county: 'Argeș', type: 'city', population: 29708 },
  { id: 'arges_003', name: 'Câmpulung', city: 'Câmpulung', county: 'Argeș', type: 'city', population: 32935 },
  { id: 'arges_004', name: 'Mioveni', city: 'Mioveni', county: 'Argeș', type: 'city', population: 35849 },
  
  // BACĂU County
  { id: 'bacau_001', name: 'Bacău', city: 'Bacău', county: 'Bacău', type: 'county_capital', population: 176087 },
  { id: 'bacau_002', name: 'Onești', city: 'Onești', county: 'Bacău', type: 'city', population: 51681 },
  { id: 'bacau_003', name: 'Moinești', city: 'Moinești', county: 'Bacău', type: 'city', population: 24210 },
  
  // BIHOR County
  { id: 'bihor_001', name: 'Oradea', city: 'Oradea', county: 'Bihor', type: 'county_capital', population: 196367 },
  { id: 'bihor_002', name: 'Salonta', city: 'Salonta', county: 'Bihor', type: 'city', population: 18074 },
  { id: 'bihor_003', name: 'Marghita', city: 'Marghita', county: 'Bihor', type: 'city', population: 15104 },
  
  // BISTRIȚA-NĂSĂUD County
  { id: 'bistrita_001', name: 'Bistrița', city: 'Bistrița', county: 'Bistrița-Năsăud', type: 'county_capital', population: 75076 },
  { id: 'bistrita_002', name: 'Năsăud', city: 'Năsăud', county: 'Bistrița-Năsăud', type: 'city', population: 10725 },
  
  // BOTOȘANI County
  { id: 'botosani_001', name: 'Botoșani', city: 'Botoșani', county: 'Botoșani', type: 'county_capital', population: 106847 },
  { id: 'botosani_002', name: 'Dorohoi', city: 'Dorohoi', county: 'Botoșani', type: 'city', population: 27004 },
  
  // BRAȘOV County
  { id: 'brasov_001', name: 'Brașov', city: 'Brașov', county: 'Brașov', type: 'county_capital', population: 253200 },
  { id: 'brasov_002', name: 'Râșnov', city: 'Râșnov', county: 'Brașov', type: 'city', population: 15022 },
  { id: 'brasov_003', name: 'Săcele', city: 'Săcele', county: 'Brașov', type: 'city', population: 30798 },
  { id: 'brasov_004', name: 'Codlea', city: 'Codlea', county: 'Brașov', type: 'city', population: 24256 },
  { id: 'brasov_005', name: 'Zărnești', city: 'Zărnești', county: 'Brașov', type: 'city', population: 21624 },
  
  // BRĂILA County
  { id: 'braila_001', name: 'Brăila', city: 'Brăila', county: 'Brăila', type: 'county_capital', population: 180302 },
  
  // BUCUREȘTI (Capital City + Sectors)
  { id: 'bucuresti_001', name: 'Sector 1', city: 'București', county: 'București', type: 'sector', population: 230179 },
  { id: 'bucuresti_002', name: 'Sector 2', city: 'București', county: 'București', type: 'sector', population: 346751 },
  { id: 'bucuresti_003', name: 'Sector 3', city: 'București', county: 'București', type: 'sector', population: 385439 },
  { id: 'bucuresti_004', name: 'Sector 4', city: 'București', county: 'București', type: 'sector', population: 310928 },
  { id: 'bucuresti_005', name: 'Sector 5', city: 'București', county: 'București', type: 'sector', population: 302865 },
  { id: 'bucuresti_006', name: 'Sector 6', city: 'București', county: 'București', type: 'sector', population: 371060 },
  
  // BUZĂU County
  { id: 'buzau_001', name: 'Buzău', city: 'Buzău', county: 'Buzău', type: 'county_capital', population: 134227 },
  { id: 'buzau_002', name: 'Râmnicu Sărat', city: 'Râmnicu Sărat', county: 'Buzău', type: 'city', population: 38805 },
  
  // CARAȘ-SEVERIN County
  { id: 'caras_001', name: 'Reșița', city: 'Reșița', county: 'Caraș-Severin', type: 'county_capital', population: 83985 },
  { id: 'caras_002', name: 'Caransebeș', city: 'Caransebeș', county: 'Caraș-Severin', type: 'city', population: 31199 },
  
  // CĂLĂRAȘI County
  { id: 'calarasi_001', name: 'Călărași', city: 'Călărași', county: 'Călărași', type: 'county_capital', population: 65181 },
  { id: 'calarasi_002', name: 'Oltenița', city: 'Oltenița', county: 'Călărași', type: 'city', population: 24822 },
  
  // CLUJ County (Most detailed since it's a major tech hub)
  { id: 'cluj_001', name: 'Cluj-Napoca', city: 'Cluj-Napoca', county: 'Cluj', type: 'county_capital', population: 324576 },
  { id: 'cluj_002', name: 'Mănăștur', city: 'Cluj-Napoca', county: 'Cluj', type: 'neighborhood', population: 85000 },
  { id: 'cluj_003', name: 'Gheorgheni', city: 'Cluj-Napoca', county: 'Cluj', type: 'neighborhood', population: 45000 },
  { id: 'cluj_004', name: 'Zorilor', city: 'Cluj-Napoca', county: 'Cluj', type: 'neighborhood', population: 35000 },
  { id: 'cluj_005', name: 'Mărăști', city: 'Cluj-Napoca', county: 'Cluj', type: 'neighborhood', population: 30000 },
  { id: 'cluj_006', name: 'Grigorescu', city: 'Cluj-Napoca', county: 'Cluj', type: 'neighborhood', population: 25000 },
  { id: 'cluj_007', name: 'Centru', city: 'Cluj-Napoca', county: 'Cluj', type: 'neighborhood', population: 20000 },
  { id: 'cluj_008', name: 'Florești', city: 'Florești', county: 'Cluj', type: 'city', population: 22692 },
  { id: 'cluj_009', name: 'Turda', city: 'Turda', county: 'Cluj', type: 'city', population: 47744 },
  { id: 'cluj_010', name: 'Dej', city: 'Dej', county: 'Cluj', type: 'city', population: 33497 },
  { id: 'cluj_011', name: 'Gherla', city: 'Gherla', county: 'Cluj', type: 'city', population: 20982 },
  
  // CONSTANȚA County
  { id: 'constanta_001', name: 'Constanța', city: 'Constanța', county: 'Constanța', type: 'county_capital', population: 283872 },
  { id: 'constanta_002', name: 'Mangalia', city: 'Mangalia', county: 'Constanța', type: 'city', population: 39464 },
  { id: 'constanta_003', name: 'Medgidia', city: 'Medgidia', county: 'Constanța', type: 'city', population: 39780 },
  { id: 'constanta_004', name: 'Năvodari', city: 'Năvodari', county: 'Constanța', type: 'city', population: 36492 },
  
  // COVASNA County
  { id: 'covasna_001', name: 'Sfântu Gheorghe', city: 'Sfântu Gheorghe', county: 'Covasna', type: 'county_capital', population: 56006 },
  { id: 'covasna_002', name: 'Târgu Secuiesc', city: 'Târgu Secuiesc', county: 'Covasna', type: 'city', population: 18713 },
  
  // DÂMBOVIȚA County
  { id: 'dambovita_001', name: 'Târgoviște', city: 'Târgoviște', county: 'Dâmbovița', type: 'county_capital', population: 73123 },
  { id: 'dambovita_002', name: 'Moreni', city: 'Moreni', county: 'Dâmbovița', type: 'city', population: 20316 },
  
  // DOLJ County
  { id: 'dolj_001', name: 'Craiova', city: 'Craiova', county: 'Dolj', type: 'county_capital', population: 269506 },
  { id: 'dolj_002', name: 'Băilești', city: 'Băilești', county: 'Dolj', type: 'city', population: 18164 },
  
  // GALAȚI County
  { id: 'galati_001', name: 'Galați', city: 'Galați', county: 'Galați', type: 'county_capital', population: 249432 },
  { id: 'galati_002', name: 'Tecuci', city: 'Tecuci', county: 'Galați', type: 'city', population: 34871 },
  
  // GIURGIU County
  { id: 'giurgiu_001', name: 'Giurgiu', city: 'Giurgiu', county: 'Giurgiu', type: 'county_capital', population: 61353 },
  
  // GORJ County
  { id: 'gorj_001', name: 'Târgu Jiu', city: 'Târgu Jiu', county: 'Gorj', type: 'county_capital', population: 82504 },
  { id: 'gorj_002', name: 'Motru', city: 'Motru', county: 'Gorj', type: 'city', population: 21626 },
  
  // HARGHITA County
  { id: 'harghita_001', name: 'Miercurea Ciuc', city: 'Miercurea Ciuc', county: 'Harghita', type: 'county_capital', population: 38966 },
  { id: 'harghita_002', name: 'Odorheiu Secuiesc', city: 'Odorheiu Secuiesc', county: 'Harghita', type: 'city', population: 34257 },
  
  // HUNEDOARA County
  { id: 'hunedoara_001', name: 'Deva', city: 'Deva', county: 'Hunedoara', type: 'county_capital', population: 56647 },
  { id: 'hunedoara_002', name: 'Hunedoara', city: 'Hunedoara', county: 'Hunedoara', type: 'city', population: 58663 },
  { id: 'hunedoara_003', name: 'Petroșani', city: 'Petroșani', county: 'Hunedoara', type: 'city', population: 34331 },
  
  // IALOMIȚA County
  { id: 'ialomita_001', name: 'Slobozia', city: 'Slobozia', county: 'Ialomița', type: 'county_capital', population: 52677 },
  { id: 'ialomita_002', name: 'Fetești', city: 'Fetești', county: 'Ialomița', type: 'city', population: 32823 },
  
  // IAȘI County
  { id: 'iasi_001', name: 'Iași', city: 'Iași', county: 'Iași', type: 'county_capital', population: 290422 },
  { id: 'iasi_002', name: 'Pașcani', city: 'Pașcani', county: 'Iași', type: 'city', population: 42172 },
  { id: 'iasi_003', name: 'Târgu Frumos', city: 'Târgu Frumos', county: 'Iași', type: 'city', population: 13763 },
  
  // ILFOV County (Bucharest surroundings)
  { id: 'ilfov_001', name: 'Buftea', city: 'Buftea', county: 'Ilfov', type: 'city', population: 22178 },
  { id: 'ilfov_002', name: 'Otopeni', city: 'Otopeni', county: 'Ilfov', type: 'city', population: 13861 },
  { id: 'ilfov_003', name: 'Voluntari', city: 'Voluntari', county: 'Ilfov', type: 'city', population: 45595 },
  { id: 'ilfov_004', name: 'Pantelimon', city: 'Pantelimon', county: 'Ilfov', type: 'city', population: 16019 },
  { id: 'ilfov_005', name: 'Popești-Leordeni', city: 'Popești-Leordeni', county: 'Ilfov', type: 'city', population: 21895 },
  
  // MARAMUREȘ County
  { id: 'maramures_001', name: 'Baia Mare', city: 'Baia Mare', county: 'Maramureș', type: 'county_capital', population: 123738 },
  { id: 'maramures_002', name: 'Sighetu Marmației', city: 'Sighetu Marmației', county: 'Maramureș', type: 'city', population: 37640 },
  
  // MEHEDINȚI County
  { id: 'mehedinti_001', name: 'Drobeta-Turnu Severin', city: 'Drobeta-Turnu Severin', county: 'Mehedinți', type: 'county_capital', population: 92617 },
  { id: 'mehedinti_002', name: 'Orșova', city: 'Orșova', county: 'Mehedinți', type: 'city', population: 10441 },
  
  // MUREȘ County
  { id: 'mures_001', name: 'Târgu Mureș', city: 'Târgu Mureș', county: 'Mureș', type: 'county_capital', population: 134290 },
  { id: 'mures_002', name: 'Reghin', city: 'Reghin', county: 'Mureș', type: 'city', population: 33281 },
  { id: 'mures_003', name: 'Sighișoara', city: 'Sighișoara', county: 'Mureș', type: 'city', population: 28102 },
  
  // NEAMȚ County
  { id: 'neamt_001', name: 'Piatra Neamț', city: 'Piatra Neamț', county: 'Neamț', type: 'county_capital', population: 85055 },
  { id: 'neamt_002', name: 'Roman', city: 'Roman', county: 'Neamț', type: 'city', population: 69483 },
  
  // OLT County
  { id: 'olt_001', name: 'Slatina', city: 'Slatina', county: 'Olt', type: 'county_capital', population: 70293 },
  { id: 'olt_002', name: 'Caracal', city: 'Caracal', county: 'Olt', type: 'city', population: 34603 },
  
  // PRAHOVA County
  { id: 'prahova_001', name: 'Ploiești', city: 'Ploiești', county: 'Prahova', type: 'county_capital', population: 201226 },
  { id: 'prahova_002', name: 'Câmpina', city: 'Câmpina', county: 'Prahova', type: 'city', population: 32935 },
  { id: 'prahova_003', name: 'Buzău', city: 'Buzău', county: 'Prahova', type: 'city', population: 24675 },
  
  // SĂLAJ County
  { id: 'salaj_001', name: 'Zalău', city: 'Zalău', county: 'Sălaj', type: 'county_capital', population: 56202 },
  { id: 'salaj_002', name: 'Șimleu Silvaniei', city: 'Șimleu Silvaniei', county: 'Sălaj', type: 'city', population: 15032 },
  
  // SATU MARE County
  { id: 'satu_mare_001', name: 'Satu Mare', city: 'Satu Mare', county: 'Satu Mare', type: 'county_capital', population: 102441 },
  { id: 'satu_mare_002', name: 'Carei', city: 'Carei', county: 'Satu Mare', type: 'city', population: 21112 },
  
  // SIBIU County
  { id: 'sibiu_001', name: 'Sibiu', city: 'Sibiu', county: 'Sibiu', type: 'county_capital', population: 147245 },
  { id: 'sibiu_002', name: 'Mediaș', city: 'Mediaș', county: 'Sibiu', type: 'city', population: 47204 },
  { id: 'sibiu_003', name: 'Cisnădie', city: 'Cisnădie', county: 'Sibiu', type: 'city', population: 15761 },
  
  // SUCEAVA County
  { id: 'suceava_001', name: 'Suceava', city: 'Suceava', county: 'Suceava', type: 'county_capital', population: 92121 },
  { id: 'suceava_002', name: 'Fălticeni', city: 'Fălticeni', county: 'Suceava', type: 'city', population: 28899 },
  { id: 'suceava_003', name: 'Rădăuți', city: 'Rădăuți', county: 'Suceava', type: 'city', population: 23822 },
  
  // TELEORMAN County
  { id: 'teleorman_001', name: 'Alexandria', city: 'Alexandria', county: 'Teleorman', type: 'county_capital', population: 45434 },
  { id: 'teleorman_002', name: 'Rosiori de Vede', city: 'Rosiori de Vede', county: 'Teleorman', type: 'city', population: 31873 },
  
  // TIMIȘ County
  { id: 'timis_001', name: 'Timișoara', city: 'Timișoara', county: 'Timiș', type: 'county_capital', population: 319279 },
  { id: 'timis_002', name: 'Lugoj', city: 'Lugoj', county: 'Timiș', type: 'city', population: 40361 },
  { id: 'timis_003', name: 'Sânnicolau Mare', city: 'Sânnicolau Mare', county: 'Timiș', type: 'city', population: 12312 },
  { id: 'timis_004', name: 'Jimbolia', city: 'Jimbolia', county: 'Timiș', type: 'city', population: 10497 },
  
  // TULCEA County
  { id: 'tulcea_001', name: 'Tulcea', city: 'Tulcea', county: 'Tulcea', type: 'county_capital', population: 73707 },
  { id: 'tulcea_002', name: 'Babadag', city: 'Babadag', county: 'Tulcea', type: 'city', population: 9247 },
  
  // VASLUI County
  { id: 'vaslui_001', name: 'Vaslui', city: 'Vaslui', county: 'Vaslui', type: 'county_capital', population: 55407 },
  { id: 'vaslui_002', name: 'Bârlad', city: 'Bârlad', county: 'Vaslui', type: 'city', population: 69183 },
  
  // VÂLCEA County
  { id: 'valcea_001', name: 'Râmnicu Vâlcea', city: 'Râmnicu Vâlcea', county: 'Vâlcea', type: 'county_capital', population: 98776 },
  { id: 'valcea_002', name: 'Drăgășani', city: 'Drăgășani', county: 'Vâlcea', type: 'city', population: 16626 },
  
  // VRANCEA County
  { id: 'vrancea_001', name: 'Focșani', city: 'Focșani', county: 'Vrancea', type: 'county_capital', population: 79315 },
  { id: 'vrancea_002', name: 'Adjud', city: 'Adjud', county: 'Vrancea', type: 'city', population: 16045 },
];

// Helper functions for location management
export const getLocationsByCounty = (county: string): Location[] => {
  return romanianLocations.filter(location => location.county === county);
};

export const getLocationsByType = (type: Location['type']): Location[] => {
  return romanianLocations.filter(location => location.type === type);
};

export const getMajorCities = (): Location[] => {
  return romanianLocations.filter(location => 
    location.type === 'county_capital' || location.type === 'major_city'
  ).sort((a, b) => (b.population || 0) - (a.population || 0));
};

export const searchLocations = (query: string, limit: number = 10): Location[] => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];
  
  return romanianLocations
    .filter(location => 
      location.name.toLowerCase().includes(normalizedQuery) ||
      location.city.toLowerCase().includes(normalizedQuery) ||
      location.county.toLowerCase().includes(normalizedQuery)
    )
    .sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.name.toLowerCase() === normalizedQuery ? 1 : 0;
      const bExact = b.name.toLowerCase() === normalizedQuery ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      
      // Then by population (bigger cities first)
      return (b.population || 0) - (a.population || 0);
    })
    .slice(0, limit);
};

export const getAllCounties = (): string[] => {
  const counties = new Set(romanianLocations.map(location => location.county));
  return Array.from(counties).sort();
};

export const getLocationById = (id: string): Location | undefined => {
  return romanianLocations.find(location => location.id === id);
};
