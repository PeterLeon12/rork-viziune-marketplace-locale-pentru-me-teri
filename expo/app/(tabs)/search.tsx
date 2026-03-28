import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  X, 
  ChevronDown,
  ArrowLeft,
  Shield,
  Clock
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';



// Romanian focused categories from rebuild instructions
const focusedCategories = [
  { id: 'assembly', name: 'Asamblare', icon: '🔧' },
  { id: 'mounting', name: 'Montare', icon: '📱' },
  { id: 'moving', name: 'Mutare', icon: '📦' },
  { id: 'cleaning', name: 'Curățenie', icon: '🧹' },
  { id: 'outdoor', name: 'Ajutor Exterior', icon: '🌳' },
  { id: 'repairs', name: 'Reparații Casă', icon: '🏠' },
  { id: 'painting', name: 'Vopsire', icon: '🎨' },
  { id: 'trending', name: 'Trending', icon: '🔥' },
];

// Comprehensive Romanian locations - All counties and major cities
const romanianLocations = [
  // București (Capital)
  'București',
  
  // Alba County
  'Alba Iulia', 'Blaj', 'Sebeș', 'Aiud', 'Cugir', 'Ocna Mureș', 'Câmpia Turzii',
  
  // Arad County  
  'Arad', 'Nădlac', 'Ineu', 'Chișineu-Criș', 'Nădlac', 'Pâncota',
  
  // Argeș County
  'Pitești', 'Câmpulung', 'Curtea de Argeș', 'Costești', 'Topoloveni', 'Ștefănești',
  
  // Bacău County
  'Bacău', 'Onești', 'Moinești', 'Comănești', 'Buhuși', 'Dărmănești', 'Târgu Ocna',
  
  // Bihor County
  'Oradea', 'Salonta', 'Marghita', 'Beiuș', 'Aleșd', 'Nucet', 'Valea lui Mihai',
  
  // Bistrița-Năsăud County
  'Bistrița', 'Năsăud', 'Beclean', 'Sângeorz-Băi', 'Prundu Bârgăului',
  
  // Botoșani County
  'Botoșani', 'Dorohoi', 'Săveni', 'Flămânzi', 'Darabani', 'Bucecea',
  
  // Brăila County
  'Brăila', 'Ianca', 'Însurăței', 'Făurei', 'Chiscani', 'Viziru',
  
  // Brașov County
  'Brașov', 'Făgăraș', 'Săcele', 'Codlea', 'Râșnov', 'Zărnești', 'Victoria',
  
  // Buzău County
  'Buzău', 'Râmnicu Sărat', 'Nehoiu', 'Pogoanele', 'Mărăcineni', 'Glodeanu-Sărat',
  
  // Călărași County
  'Călărași', 'Oltenița', 'Lehliu-Gară', 'Borcea', 'Fundulea', 'Ileana',
  
  // Caraș-Severin County
  'Reșița', 'Caransebeș', 'Moldova Nouă', 'Oravița', 'Anina', 'Băile Herculane',
  
  // Cluj County
  'Cluj-Napoca', 'Turda', 'Dej', 'Câmpia Turzii', 'Gherla', 'Huedin', 'Câmpia Turzii',
  
  // Constanța County
  'Constanța', 'Mangalia', 'Medgidia', 'Cernavodă', 'Năvodari', 'Ovidiu', 'Eforie',
  
  // Covasna County
  'Sfântu Gheorghe', 'Târgu Secuiesc', 'Covasna', 'Baraolt', 'Întorsura Buzăului',
  
  // Dâmbovița County
  'Târgoviște', 'Moreni', 'Pucioasa', 'Găești', 'Titu', 'Fieni', 'Răcari',
  
  // Dolj County
  'Craiova', 'Băilești', 'Calafat', 'Filiași', 'Segarcea', 'Dăbuleni',
  
  // Galați County
  'Galați', 'Tecuci', 'Târgu Bujor', 'Berești', 'Pechea', 'Oancea',
  
  // Giurgiu County
  'Giurgiu', 'Bolintin-Vale', 'Mihăilești', 'Bolintin-Deal', 'Comana',
  
  // Gorj County
  'Târgu Jiu', 'Motru', 'Rovinari', 'Bumbești-Jiu', 'Târgu Cărbunești',
  
  // Harghita County
  'Miercurea Ciuc', 'Odorheiu Secuiesc', 'Gheorgheni', 'Toplița', 'Cristuru Secuiesc',
  
  // Hunedoara County
  'Deva', 'Hunedoara', 'Petroșani', 'Lupeni', 'Vulcan', 'Orăștie', 'Brad',
  
  // Ialomița County
  'Slobozia', 'Fetești', 'Urziceni', 'Țăndărei', 'Căzănești', 'Amara',
  
  // Iași County
  'Iași', 'Pașcani', 'Târgu Frumos', 'Hârlău', 'Podu Iloaiei', 'Târgu Neamț',
  
  // Ilfov County
  'Buftea', 'Otopeni', 'Voluntari', 'Pantelimon', 'Bragadiru', 'Chitila',
  
  // Maramureș County
  'Baia Mare', 'Sighetu Marmației', 'Borsa', 'Vișeu de Sus', 'Târgu Lăpuș',
  
  // Mehedinți County
  'Drobeta-Turnu Severin', 'Orșova', 'Strehaia', 'Vânju Mare', 'Baia de Aramă',
  
  // Mureș County
  'Târgu Mureș', 'Reghin', 'Sighișoara', 'Târnăveni', 'Luduș', 'Iernut',
  
  // Neamț County
  'Piatra Neamț', 'Roman', 'Târgu Neamț', 'Bicaz', 'Roznov', 'Hârșova',
  
  // Olt County
  'Slatina', 'Caracal', 'Balș', 'Corabia', 'Drăgănești-Olt', 'Piatra-Olt',
  
  // Prahova County
  'Ploiești', 'Câmpina', 'Mizil', 'Băicoi', 'Vălenii de Munte', 'Sinaia',
  
  // Sălaj County
  'Zalău', 'Șimleu Silvaniei', 'Jibou', 'Cehu Silvaniei', 'Gârbou',
  
  // Satu Mare County
  'Satu Mare', 'Carei', 'Negrești-Oaș', 'Tășnad', 'Livada', 'Acâș',
  
  // Sibiu County
  'Sibiu', 'Mediaș', 'Cisnădie', 'Avrig', 'Agnita', 'Săliște', 'Miercurea Sibiului',
  
  // Suceava County
  'Suceava', 'Fălticeni', 'Rădăuți', 'Câmpulung Moldovenesc', 'Vatra Dornei',
  
  // Teleorman County
  'Alexandria', 'Roșiorii de Vede', 'Turnu Măgurele', 'Zimnicea', 'Videle',
  
  // Timiș County
  'Timișoara', 'Lugoj', 'Sânnicolau Mare', 'Jimbolia', 'Făget', 'Deta',
  
  // Tulcea County
  'Tulcea', 'Măcin', 'Isaccea', 'Babadag', 'Sulina', 'Mihail Kogălniceanu',
  
  // Vâlcea County
  'Râmnicu Vâlcea', 'Drăgășani', 'Băbeni', 'Băile Govora', 'Băile Olănești',
  
  // Vaslui County
  'Vaslui', 'Bârlad', 'Huși', 'Negrești', 'Murgeni', 'Văleni',
  
  // Vrancea County
  'Focșani', 'Adjud', 'Mărășești', 'Odobești', 'Panciu', 'Vidra'
];

const mockProfessionals = [
  {
    id: '1',
    name: 'Ion Popescu',
    profession: 'Instalator',
    rating: 4.9,
    reviews: 127,
    location: 'București',
    price: '50-80 RON/ora',
    avatar: 'https://via.placeholder.com/60',
    verified: true,
    responseTime: '< 2 ore',
    completedJobs: 89,
    category: 'Reparații Casă',
  },
  {
    id: '2',
    name: 'Maria Ionescu',
    profession: 'Curățenie',
    rating: 4.8,
    reviews: 89,
    location: 'Cluj-Napoca',
    price: '30-50 RON/ora',
    avatar: 'https://via.placeholder.com/60',
    verified: true,
    responseTime: '< 1 oră',
    completedJobs: 156,
    category: 'Curățenie',
  },
  {
    id: '3',
    name: 'Alexandru Dumitrescu',
    profession: 'Constructor',
    rating: 4.7,
    reviews: 156,
    location: 'Timișoara',
    price: '80-120 RON/ora',
    avatar: 'https://via.placeholder.com/60',
    verified: false,
    responseTime: '< 3 ore',
    completedJobs: 67,
    category: 'Asamblare',
  },
  {
    id: '4',
    name: 'Elena Vasile',
    profession: 'Vopsitor',
    rating: 4.6,
    reviews: 78,
    location: 'București',
    price: '60-90 RON/ora',
    avatar: 'https://via.placeholder.com/60',
    verified: true,
    responseTime: '< 4 ore',
    completedJobs: 45,
    category: 'Vopsire',
  },
];

export default function SearchScreen() {
  const { user } = useSimpleAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price' | 'responseTime'>('recommended');
  const [filteredProfessionals, setFilteredProfessionals] = useState(mockProfessionals);

  const handleSearch = () => {
    let filtered = mockProfessionals;

    if (searchQuery) {
      filtered = filtered.filter(pro => 
        pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(pro => pro.category === selectedCategory);
    }

    if (selectedLocation) {
      filtered = filtered.filter(pro => pro.location === selectedLocation);
    }

    // Sort results
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        filtered.sort((a, b) => {
          const aPrice = parseInt(a.price.split('-')[0]);
          const bPrice = parseInt(b.price.split('-')[0]);
          return aPrice - bPrice;
        });
        break;
      case 'responseTime':
        filtered.sort((a, b) => {
          const aTime = parseInt(a.responseTime.match(/\d+/)?.[0] || '0');
          const bTime = parseInt(b.responseTime.match(/\d+/)?.[0] || '0');
          return aTime - bTime;
        });
        break;
      default:
        // Keep recommended order
        break;
    }

    setFilteredProfessionals(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedLocation(null);
    setSortBy('recommended');
    setFilteredProfessionals(mockProfessionals);
  };

  const renderProfessionalCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.professionalCard}
      onPress={() => router.push(`/pro/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.professionalInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Shield size={12} color="#10B981" />
              </View>
            )}
          </View>
          <Text style={styles.profession}>{item.profession}</Text>
          <View style={styles.ratingRow}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews} recenzii)</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
        <View style={styles.metaItem}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.metaText}>{item.responseTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.completedText}>{item.completedJobs} job-uri</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactButtonText}>Contactează</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  React.useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedCategory, selectedLocation, sortBy]);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Se încarcă...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Căutare Profesioniști</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Caută profesioniști, servicii..."
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterChips}>
              {/* Category Filter */}
              <TouchableOpacity 
                style={[styles.filterChip, selectedCategory && styles.filterChipActive]}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <Text style={[styles.filterChipText, selectedCategory && styles.filterChipTextActive]}>
                  {selectedCategory || 'Categorie'}
                </Text>
                <ChevronDown size={16} color={selectedCategory ? "#FFFFFF" : "#6B7280"} />
              </TouchableOpacity>

              {/* Location Filter */}
              <TouchableOpacity 
                style={[styles.filterChip, selectedLocation && styles.filterChipActive]}
                onPress={() => setShowLocationPicker(!showLocationPicker)}
              >
                <Text style={[styles.filterChipText, selectedLocation && styles.filterChipTextActive]}>
                  {selectedLocation || 'Locație'}
                </Text>
                <ChevronDown size={16} color={selectedLocation ? "#FFFFFF" : "#6B7280"} />
              </TouchableOpacity>

              {/* Sort Filter */}
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  {sortBy === 'recommended' ? 'Recomandate' : 
                   sortBy === 'rating' ? 'Rating' : 
                   sortBy === 'price' ? 'Preț' : 'Timp răspuns'}
                </Text>
                <ChevronDown size={16} color="#6B7280" />
              </TouchableOpacity>

              {/* Clear Filters */}
              {(selectedCategory || selectedLocation || sortBy !== 'recommended') && (
                <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                  <Text style={styles.clearButtonText}>Șterge filtrele</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {/* Category Picker */}
          {showCategoryPicker && (
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pickerItems}>
                  {focusedCategories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.pickerItem,
                        selectedCategory === category.name && styles.pickerItemActive
                      ]}
                      onPress={() => {
                        setSelectedCategory(category.name);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemEmoji}>{category.icon}</Text>
                      <Text style={[
                        styles.pickerItemText,
                        selectedCategory === category.name && styles.pickerItemTextActive
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Location Picker */}
          {showLocationPicker && (
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pickerItems}>
                  {romanianLocations.map((location) => (
                    <TouchableOpacity
                      key={location}
                      style={[
                        styles.pickerItem,
                        selectedLocation === location && styles.pickerItemActive
                      ]}
                      onPress={() => {
                        setSelectedLocation(location);
                        setShowLocationPicker(false);
                      }}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        selectedLocation === location && styles.pickerItemTextActive
                      ]}>
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {/* Results */}
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredProfessionals.length} profesioniști găsiți
          </Text>
        </View>

        <FlatList
          data={filteredProfessionals}
          renderItem={renderProfessionalCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterButton: {
    padding: 8,
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterChips: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterChipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  resultsList: {
    padding: 20,
  },
  professionalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  professionalInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profession: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  completedText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  contactButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
  },
  pickerItems: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  pickerItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    gap: 6,
  },
  pickerItemActive: {
    backgroundColor: '#667eea',
  },
  pickerItemEmoji: {
    fontSize: 20,
  },
  pickerItemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  pickerItemTextActive: {
    color: '#FFFFFF',
  },
});