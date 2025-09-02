import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Building, 
  MapPin, 
  Wrench, 
  DollarSign, 
  Camera,
  Phone,
  CheckCircle
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/contexts/AuthContext';

const steps = [
  { id: 1, title: 'Date personale', icon: User },
  { id: 2, title: 'Compania', icon: Building },
  { id: 3, title: 'Zone & Categorii', icon: MapPin },
  { id: 4, title: 'Servicii & Prețuri', icon: Wrench },
  { id: 5, title: 'Poze & Descriere', icon: Camera },
  { id: 6, title: 'Contact', icon: Phone },
  { id: 7, title: 'Finalizare', icon: CheckCircle },
];

export default function ProOnboardingScreen() {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    description: '',
    minPrice: '',
    categories: [] as string[],
    zones: [] as string[],
    contactPhone: '',
    whatsappLink: '',
    photoUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // tRPC mutation for creating professional profile
  const createProfileMutation = trpc.profiles.createProfile.useMutation({
    onSuccess: (data) => {
      setIsSubmitting(false);
      Alert.alert(
        'Profil creat cu succes! 🎉',
        'Profilul tău a fost trimis spre verificare. Vei primi notificări când va fi aprobat.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    },
    onError: (error) => {
      setIsSubmitting(false);
      Alert.alert('Eroare', `Nu am putut crea profilul: ${error.message}`);
    },
  });

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert('Eroare', 'Trebuie să fii conectat pentru a crea un profil profesional');
      return;
    }

    if (!formData.name || !formData.company || !formData.description || formData.categories.length === 0 || formData.zones.length === 0) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile obligatorii.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createProfileMutation.mutateAsync({
        displayName: formData.name,
        company: formData.company,
        categories: formData.categories,
        zones: formData.zones,
        minPrice: parseFloat(formData.minPrice) || 0,
        about: formData.description,
        contact: {
          phone: formData.contactPhone || formData.phone,
          whatsappLink: formData.whatsappLink || `https://wa.me/${formData.contactPhone || formData.phone}`,
        },
        photoUrl: formData.photoUrl || undefined,
      });
    } catch (error) {
      // Error handling is done in onError callback
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Date personale</Text>
            <Text style={styles.stepDescription}>
              Să începem cu informațiile de bază
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nume complet</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Ex: Ion Popescu"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefon</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Ex: 0721234567"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Informații companie</Text>
            <Text style={styles.stepDescription}>
              Detalii despre firma ta
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nume companie</Text>
              <TextInput
                style={styles.input}
                value={formData.company}
                onChangeText={(text) => setFormData({ ...formData, company: text })}
                placeholder="Ex: Instalații Pro SRL"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preț minim (lei)</Text>
              <TextInput
                style={styles.input}
                value={formData.minPrice}
                onChangeText={(text) => setFormData({ ...formData, minPrice: text })}
                placeholder="Ex: 120"
                keyboardType="numeric"
              />
            </View>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Zone & Categorii</Text>
            <Text style={styles.stepDescription}>
              În ce zone lucrezi și ce servicii oferi?
            </Text>
            <View style={styles.selectionGrid}>
              <Text style={styles.selectionTitle}>Categorii:</Text>
              <View style={styles.chips}>
                {['Instalații', 'Electric', 'Electrocasnice'].map((category) => (
                  <TouchableOpacity key={category} style={styles.chip}>
                    <Text style={styles.chipText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.selectionTitle}>Zone:</Text>
              <View style={styles.chips}>
                {['Mănăștur', 'Gheorgheni', 'Zorilor'].map((zone) => (
                  <TouchableOpacity key={zone} style={styles.chip}>
                    <Text style={styles.chipText}>{zone}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Servicii & Prețuri</Text>
            <Text style={styles.stepDescription}>
              Adaugă serviciile pe care le oferi
            </Text>
            <View style={styles.serviceExample}>
              <Text style={styles.serviceTitle}>Exemplu serviciu:</Text>
              <Text style={styles.serviceText}>Montaj centrală termică - de la 800 lei</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Adaugă serviciu</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Poze & Descriere</Text>
            <Text style={styles.stepDescription}>
              Adaugă poze din lucrările tale și o descriere
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descriere</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Descrie experiența ta și serviciile oferite..."
                multiline
                numberOfLines={4}
              />
            </View>
            <TouchableOpacity style={styles.photoButton}>
              <Camera size={24} color="#6B7280" />
              <Text style={styles.photoButtonText}>Adaugă poze din lucrări</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 6:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Metode de contact</Text>
            <Text style={styles.stepDescription}>
              Cum vor putea clientii să te contacteze?
            </Text>
            <View style={styles.contactOptions}>
              <TouchableOpacity style={styles.contactOption}>
                <Phone size={20} color="#3B82F6" />
                <Text style={styles.contactOptionText}>Telefon</Text>
                <View style={styles.toggle} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactOption}>
                <Text style={styles.whatsappIcon}>📱</Text>
                <Text style={styles.contactOptionText}>WhatsApp</Text>
                <View style={[styles.toggle, styles.toggleActive]} />
              </TouchableOpacity>
            </View>
          </View>
        );
      
      case 7:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Gata!</Text>
            <Text style={styles.stepDescription}>
              Profilul tău este aproape gata. Alege un plan pentru a începe să primești clienți.
            </Text>
            <View style={styles.planCard}>
              <Text style={styles.planTitle}>Plan Basic</Text>
              <Text style={styles.planPrice}>GRATUIT primele 30 zile</Text>
              <Text style={styles.planFeatures}>
                • Profil complet{'\n'}
                • Recenzii de la clienți{'\n'}
                • Contact direct
              </Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Devino meșter',
          headerBackTitle: 'Înapoi'
        }} 
      />
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(currentStep / steps.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Pasul {currentStep} din {steps.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton]}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>
            {currentStep === 1 ? 'Anulează' : 'Înapoi'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length ? 'Finalizează' : 'Continuă'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  progressContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectionGrid: {
    gap: 16,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  serviceExample: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 16,
    color: '#374151',
  },
  addButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  photoButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  contactOptions: {
    gap: 12,
  },
  contactOption: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactOptionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  whatsappIcon: {
    fontSize: 20,
  },
  toggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: 'white',
  },
  toggleActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  planCard: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 12,
    padding: 20,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 12,
  },
  planFeatures: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
  },
  backButtonText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});