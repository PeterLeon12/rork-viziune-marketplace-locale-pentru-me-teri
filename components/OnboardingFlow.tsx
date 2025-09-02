import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Mail,
  MapPin, 
  Camera,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  Star,
  Shield,
  Award,
  Target,
  Briefcase,
  Phone,
  Globe
} from 'lucide-react-native';
import EnhancedLocationPicker from './EnhancedLocationPicker';

const { width } = Dimensions.get('window');

interface OnboardingFlowProps {
  role: 'client' | 'pro';
  onComplete: (profileData: any) => void;
  onBack?: () => void;
}

interface ProfileData {
  name: string;
  email: string;
  location: string;
  avatar?: string;
  bio?: string;
  company?: string;
  website?: string;
}

const ONBOARDING_STEPS = {
  client: [
    { id: 'basic', title: 'Informații de bază', description: 'Numele și email-ul tău' },
    { id: 'location', title: 'Locația', description: 'Unde te afli?' },
    { id: 'preferences', title: 'Preferințe', description: 'Ce tip de servicii cauți?' },
    { id: 'complete', title: 'Gata!', description: 'Contul tău este pregătit' },
  ],
  pro: [
    { id: 'basic', title: 'Informații personale', description: 'Numele și email-ul tău' },
    { id: 'business', title: 'Informații business', description: 'Compania și site-ul web' },
    { id: 'location', title: 'Zona de servicii', description: 'Unde oferi servicii?' },
    { id: 'services', title: 'Serviciile tale', description: 'Ce oferi clienților?' },
    { id: 'complete', title: 'Profil creat!', description: 'Profilul tău profesional este gata' },
  ],
};

export default function OnboardingFlow({ role, onComplete, onBack }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    location: '',
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = ONBOARDING_STEPS[role];
  const step = steps[currentStep];

  const updateProfileData = (updates: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const handleComplete = async () => {
    if (!profileData.name.trim()) {
      Alert.alert('Eroare', 'Te rugăm să introduci numele');
      return;
    }

    try {
      setIsSubmitting(true);
      await onComplete(profileData);
    } catch (error: any) {
      Alert.alert('Eroare', error.message || 'Nu am putut finaliza configurarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (location: any) => {
    updateProfileData({ location: location.name });
  };

  const canProceed = () => {
    switch (step.id) {
      case 'basic':
        return profileData.name.trim().length > 0;
      case 'business':
        return role === 'client' || profileData.company?.trim();
      case 'location':
        return profileData.location.trim().length > 0;
      default:
        return true;
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${((currentStep + 1) / steps.length) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        {currentStep + 1} din {steps.length}
      </Text>
    </View>
  );

  const renderBasicStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <User size={32} color="#3B82F6" />
        </View>
        <Text style={styles.stepTitle}>Să ne cunoaștem!</Text>
        <Text style={styles.stepDescription}>
          {role === 'pro' 
            ? 'Spune-ne cum te numești și cum te pot contacta clienții'
            : 'Spune-ne cum te numești pentru a personaliza experiența'
          }
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Numele complet</Text>
          <TextInput
            style={styles.input}
            value={profileData.name}
            onChangeText={(name) => updateProfileData({ name })}
            placeholder="Ion Popescu"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            autoFocus
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email (opțional)</Text>
          <TextInput
            style={styles.input}
            value={profileData.email}
            onChangeText={(email) => updateProfileData({ email })}
            placeholder="ion@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  );

  const renderBusinessStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <Briefcase size={32} color="#3B82F6" />
        </View>
        <Text style={styles.stepTitle}>Informații business</Text>
        <Text style={styles.stepDescription}>
          Ajută clienții să te găsească și să aibă încredere în serviciile tale
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Numele companiei</Text>
          <TextInput
            style={styles.input}
            value={profileData.company}
            onChangeText={(company) => updateProfileData({ company })}
            placeholder="SRL Popescu & Associates"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Site web (opțional)</Text>
          <TextInput
            style={styles.input}
            value={profileData.website}
            onChangeText={(website) => updateProfileData({ website })}
            placeholder="https://www.example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Descriere scurtă (opțional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={profileData.bio}
            onChangeText={(bio) => updateProfileData({ bio })}
            placeholder="Scrie câteva cuvinte despre experiența ta..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );

  const renderLocationStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <MapPin size={32} color="#3B82F6" />
        </View>
        <Text style={styles.stepTitle}>
          {role === 'pro' ? 'Zona de servicii' : 'Locația ta'}
        </Text>
        <Text style={styles.stepDescription}>
          {role === 'pro' 
            ? 'În ce zona oferi servicii? Clienții te vor găsi mai ușor.'
            : 'Unde te afli? Te vom ajuta să găsești profesioniști din zona ta.'
          }
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={() => setShowLocationPicker(true)}
        >
          <View style={styles.locationContent}>
            <MapPin size={20} color="#3B82F6" />
            <Text style={[
              styles.locationText,
              !profileData.location && styles.locationPlaceholder
            ]}>
              {profileData.location || 'Selectează locația'}
            </Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {profileData.location && (
          <View style={styles.locationConfirm}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.locationConfirmText}>
              Locația selectată: {profileData.location}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderServicesStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <Award size={32} color="#3B82F6" />
        </View>
        <Text style={styles.stepTitle}>Serviciile tale</Text>
        <Text style={styles.stepDescription}>
          Poți adăuga serviciile specifice mai târziu din profilul tău
        </Text>
      </View>

      <View style={styles.servicesPreview}>
        <Text style={styles.servicesTitle}>Categorii populare:</Text>
        <View style={styles.servicesList}>
          {['Instalații', 'Electric', 'Zugraveli', 'Curățenie', 'Grădinărit'].map((service) => (
            <View key={service} style={styles.serviceItem}>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.servicesNote}>
          Vei putea configura serviciile detaliate după ce îți creezi profilul
        </Text>
      </View>
    </View>
  );

  const renderPreferencesStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <Target size={32} color="#3B82F6" />
        </View>
        <Text style={styles.stepTitle}>Preferințele tale</Text>
        <Text style={styles.stepDescription}>
          Ce tip de servicii cauți cel mai des?
        </Text>
      </View>

      <View style={styles.preferencesContainer}>
        <Text style={styles.preferencesTitle}>Categorii de interes:</Text>
        <View style={styles.preferencesList}>
          {['Instalații', 'Electric', 'Electrocasnice', 'Montaj AC', 'Zugraveli', 'Dulgherie', 'Curățenie'].map((category) => (
            <TouchableOpacity key={category} style={styles.preferenceItem}>
              <Text style={styles.preferenceText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.preferencesNote}>
          Vei primi notificări pentru profesioniști din aceste categorii
        </Text>
      </View>
    </View>
  );

  const renderCompleteStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.completeContainer}>
        <LinearGradient colors={['#10B981', '#059669']} style={styles.completeIcon}>
          <CheckCircle size={48} color="#FFFFFF" />
        </LinearGradient>
        
        <Text style={styles.completeTitle}>
          {role === 'pro' ? 'Profilul tău este gata!' : 'Bun venit pe Meșterul!'}
        </Text>
        
        <Text style={styles.completeDescription}>
          {role === 'pro' 
            ? 'Acum poți începe să primești cereri de la clienți și să îți dezvolți business-ul'
            : 'Acum poți căuta profesioniști și posta job-uri pentru serviciile de care ai nevoie'
          }
        </Text>

        <View style={styles.completeFeatures}>
          {role === 'pro' ? (
            <>
              <View style={styles.completeFeature}>
                <Star size={20} color="#10B981" />
                <Text style={styles.completeFeatureText}>Primește recenzii de la clienți</Text>
              </View>
              <View style={styles.completeFeature}>
                <Shield size={20} color="#10B981" />
                <Text style={styles.completeFeatureText}>Verificare identitate disponibilă</Text>
              </View>
              <View style={styles.completeFeature}>
                <Award size={20} color="#10B981" />
                <Text style={styles.completeFeatureText}>Certificări și portofoliu</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.completeFeature}>
                <Shield size={20} color="#10B981" />
                <Text style={styles.completeFeatureText}>Profesioniști verificați</Text>
              </View>
              <View style={styles.completeFeature}>
                <Star size={20} color="#10B981" />
                <Text style={styles.completeFeatureText}>Recenzii reale de la clienți</Text>
              </View>
              <View style={styles.completeFeature}>
                <CheckCircle size={20} color="#10B981" />
                <Text style={styles.completeFeatureText}>Plăți securizate</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (step.id) {
      case 'basic':
        return renderBasicStep();
      case 'business':
        return renderBusinessStep();
      case 'location':
        return renderLocationStep();
      case 'services':
        return renderServicesStep();
      case 'preferences':
        return renderPreferencesStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderBasicStep();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {currentStep > 0 && step.id !== 'complete' && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#3B82F6" />
          </TouchableOpacity>
        )}
        
        {step.id !== 'complete' && renderProgressBar()}
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      {step.id !== 'complete' && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.nextButton, !canProceed() && styles.disabledButton]}
            onPress={handleNext}
            disabled={!canProceed() || isSubmitting}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Finalizează' : 'Continuă'}
            </Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      <EnhancedLocationPicker
        isVisible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
        title="Selectează locația"
        placeholder="Caută orașul tău..."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 24,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
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
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#1F2937',
  },
  locationPlaceholder: {
    color: '#9CA3AF',
  },
  locationConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  locationConfirmText: {
    fontSize: 14,
    color: '#10B981',
  },
  servicesPreview: {
    alignItems: 'center',
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  serviceItem: {
    backgroundColor: '#EBF5FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  serviceText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  servicesNote: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  preferencesContainer: {
    alignItems: 'center',
  },
  preferencesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  preferencesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  preferenceItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  preferenceText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  preferencesNote: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  completeContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  completeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  completeDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  completeFeatures: {
    gap: 16,
    alignItems: 'flex-start',
  },
  completeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completeFeatureText: {
    fontSize: 16,
    color: '#374151',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
