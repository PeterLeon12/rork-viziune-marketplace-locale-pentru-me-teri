import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import { ArrowLeft, Plus, Calendar, Clock, AlertCircle, X, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';

// Romanian focused categories from rebuild instructions
const focusedCategories = [
  { id: 'assembly', name: 'Asamblare', icon: '🔧', color: '#3B82F6' },
  { id: 'mounting', name: 'Montare', icon: '📱', color: '#F59E0B' },
  { id: 'moving', name: 'Mutare', icon: '📦', color: '#8B5CF6' },
  { id: 'cleaning', name: 'Curățenie', icon: '🧹', color: '#10B981' },
  { id: 'outdoor', name: 'Ajutor Exterior', icon: '🌳', color: '#059669' },
  { id: 'repairs', name: 'Reparații Casă', icon: '🏠', color: '#DC2626' },
  { id: 'painting', name: 'Vopsire', icon: '🎨', color: '#EC4899' },
  { id: 'trending', name: 'Trending', icon: '🔥', color: '#F97316' },
];

// Comprehensive Romanian locations for job posting
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
  'Ploiești', 'Câmpina', 'Mizil', 'Băilești', 'Vălenii de Munte', 'Sinaia',
  
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

export default function PostJobScreen() {
  const { user } = useSimpleAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    urgency: 'normal' as 'low' | 'normal' | 'high',
    contactPhone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const urgencyOptions = [
    { value: 'low', label: 'Nu e urgent', icon: Clock, color: '#10B981' },
    { value: 'normal', label: 'În următoarele zile', icon: Calendar, color: '#3B82F6' },
    { value: 'high', label: 'Urgent (azi/mâine)', icon: AlertCircle, color: '#EF4444' },
  ];

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Eroare', 'Trebuie să fii conectat pentru a posta un job');
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile obligatorii.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate job posting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitting(false);
      Alert.alert(
        'Job Postat cu Succes! 🎉',
        'Job-ul tău a fost publicat și profesioniștii vor începe să trimită oferte în câteva minute.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Eroare', 'Nu am putut posta job-ul. Încearcă din nou.');
    }
  };

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
        <Text style={styles.headerTitle}>Postează un Job</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Descrie Job-ul Tău</Text>
            <Text style={styles.heroSubtitle}>
              Oferă cât mai multe detalii pentru a găsi profesioniștii potriviți
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Titlul job-ului *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="ex: Vreau să-mi fac o gardă nouă"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrierea job-ului *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Descrie în detaliu ce vrei să se facă..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoria *</Text>
              <View style={styles.categoryGrid}>
                {focusedCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      formData.category === category.name && styles.categoryOptionSelected
                    ]}
                    onPress={() => setFormData({ ...formData, category: category.name })}
                  >
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryOptionText,
                      formData.category === category.name && styles.categoryOptionTextSelected
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Locația *</Text>
              <View style={styles.locationContainer}>
                <TextInput
                  style={[styles.input, styles.locationInput]}
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                  placeholder="Caută orașul..."
                  placeholderTextColor="#9CA3AF"
                />
                {formData.location && (
                  <TouchableOpacity
                    style={styles.clearLocationButton}
                    onPress={() => setFormData({ ...formData, location: '' })}
                  >
                    <X size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Location Suggestions */}
              {formData.location.length > 0 && (
                <View style={styles.locationSuggestions}>
                  <ScrollView 
                    style={styles.suggestionsList}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {romanianLocations
                      .filter(location => 
                        location.toLowerCase().includes(formData.location.toLowerCase())
                      )
                      .slice(0, 8)
                      .map((location, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.locationSuggestion}
                          onPress={() => setFormData({ ...formData, location })}
                        >
                          <MapPin size={16} color="#667eea" />
                          <Text style={styles.locationSuggestionText}>{location}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Budget */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Buget (opțional)</Text>
              <TextInput
                style={styles.input}
                value={formData.budget}
                onChangeText={(text) => setFormData({ ...formData, budget: text })}
                placeholder="ex: 500 RON"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            {/* Urgency */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Urgența</Text>
              <View style={styles.urgencyContainer}>
                {urgencyOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = formData.urgency === option.value;
                  
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.urgencyButton,
                        isSelected && styles.urgencyButtonActive
                      ]}
                                             onPress={() => setFormData({ ...formData, urgency: option.value as 'low' | 'normal' | 'high' })}
                    >
                      <IconComponent 
                        size={20} 
                        color={isSelected ? '#FFFFFF' : option.color} 
                      />
                      <Text style={[
                        styles.urgencyButtonText,
                        isSelected && styles.urgencyButtonTextActive
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Contact Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefon de contact (opțional)</Text>
              <TextInput
                style={styles.input}
                value={formData.contactPhone}
                onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
                placeholder="ex: 0722 123 456"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!formData.title || !formData.description || !formData.category || !formData.location || isSubmitting) && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={!formData.title || !formData.description || !formData.category || !formData.location || isSubmitting}
            >
              {isSubmitting ? (
                <Text style={styles.submitButtonText}>Se postează...</Text>
              ) : (
                <>
                  <Plus size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Postează Job-ul</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  placeholder: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  urgencyButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  urgencyButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  urgencyButtonTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  categoryOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  categoryOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  locationContainer: {
    position: 'relative',
  },
  locationInput: {
    paddingRight: 40,
  },
  clearLocationButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -8,
    padding: 4,
  },
  locationSuggestions: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
  },
  suggestionsList: {
    padding: 8,
  },
  locationSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  locationSuggestionText: {
    fontSize: 14,
    color: '#374151',
  },
});
