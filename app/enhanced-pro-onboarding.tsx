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
  Image,
  Switch,
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
  CheckCircle,
  Award,
  Clock,
  Shield,
  Star,
  FileText,
  Calendar,
  Map,
  Settings,
  Briefcase,
  Plus,
  X,
  Upload
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/contexts/AuthContext';

const enhancedSteps = [
  { id: 1, title: 'Date personale', icon: User, description: 'Informații de bază' },
  { id: 2, title: 'Experiență', icon: Briefcase, description: 'Experiența ta profesională' },
  { id: 3, title: 'Servicii & Prețuri', icon: DollarSign, description: 'Ce servicii oferi și la ce prețuri' },
  { id: 4, title: 'Competențe', icon: Wrench, description: 'Abilitățile și specializările tale' },
  { id: 5, title: 'Portfolio', icon: Camera, description: 'Proiectele tale anterioare' },
  { id: 6, title: 'Certificări', icon: Award, description: 'Certificatele și licențele tale' },
  { id: 7, title: 'Disponibilitate', icon: Calendar, description: 'Când ești disponibil' },
  { id: 8, title: 'Zona de acoperire', icon: Map, description: 'Unde lucrezi' },
  { id: 9, title: 'Verificări', icon: Shield, description: 'Verificări de siguranță' },
  { id: 10, title: 'Finalizare', icon: CheckCircle, description: 'Ultimele detalii' },
];

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience: number;
}

interface Service {
  title: string;
  description: string;
  priceFrom: number;
  unit: string;
  packages: {
    basic: { price: number; description: string; includes: string[] };
    standard: { price: number; description: string; includes: string[] };
    premium: { price: number; description: string; includes: string[] };
  };
}

interface PortfolioItem {
  title: string;
  description: string;
  images: string[];
  projectDate: string;
  projectValue: number;
  durationDays: number;
  tags: string[];
}

interface Certification {
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl?: string;
}

export default function EnhancedProOnboardingScreen() {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic info
    displayName: '',
    company: '',
    about: '',
    phone: '',
    whatsappLink: '',
    photoUrl: '',
    
    // Experience
    experienceYears: 0,
    totalJobsCompleted: 0,
    previousWork: '',
    
    // Business details
    businessLicense: '',
    businessHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '16:00' },
      sunday: { closed: true },
    },
    
    // Service area
    serviceRadius: 10,
    zones: [] as string[],
    travelCostPerKm: 0,
    
    // Availability preferences
    emergencyAvailable: false,
    weekendAvailable: true,
    minimumJobValue: 0,
    
    // Features
    warrantyProvided: false,
    insuranceVerified: false,
    backgroundChecked: false,
    languages: ['ro'],
    
    // Categories and specializations
    categories: [] as string[],
    specializations: [] as string[],
    toolsEquipment: [] as string[],
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  // tRPC mutations
  const createProfileMutation = trpc.profiles.createProfile.useMutation({
    onSuccess: () => {
      Alert.alert(
        'Succes! 🎉',
        'Profilul tău de profesionist a fost creat cu succes! Acum poți primi cereri de la clienți.',
        [
          {
            text: 'Mergi la profil',
            onPress: () => router.push('/profile'),
          },
        ]
      );
    },
    onError: (error: any) => {
      Alert.alert('Eroare', `Nu am putut crea profilul: ${error.message}`);
    },
  });

  const { data: categories } = trpc.profiles.getCategories.useQuery();
  const { data: areas } = trpc.profiles.getAreas.useQuery();

  const handleNext = () => {
    if (currentStep < enhancedSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert('Eroare', 'Trebuie să fii conectat pentru a crea un profil de profesionist');
      return;
    }

    try {
      await createProfileMutation.mutateAsync({
        displayName: formData.displayName,
        company: formData.company,
        categories: formData.categories,
        zones: formData.zones,
        minPrice: parseInt(formData.minimumJobValue.toString()) || 50,
        about: formData.about,
        contact: {
          phone: formData.phone,
          whatsappLink: formData.whatsappLink,
        },
        photoUrl: formData.photoUrl,
      });
    } catch (error) {
      console.error('Error creating enhanced profile:', error);
    }
  };

  const addSkill = () => {
    setSkills([...skills, { name: '', level: 'intermediate', yearsExperience: 1 }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addService = () => {
    setServices([...services, {
      title: '',
      description: '',
      priceFrom: 0,
      unit: 'oră',
      packages: {
        basic: { price: 0, description: '', includes: [] },
        standard: { price: 0, description: '', includes: [] },
        premium: { price: 0, description: '', includes: [] },
      }
    }]);
  };

  const addPortfolioItem = () => {
    setPortfolio([...portfolio, {
      title: '',
      description: '',
      images: [],
      projectDate: new Date().toISOString().split('T')[0],
      projectValue: 0,
      durationDays: 1,
      tags: [],
    }]);
  };

  const addCertification = () => {
    setCertifications([...certifications, {
      name: '',
      organization: '',
      issueDate: new Date().toISOString().split('T')[0],
    }]);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(currentStep / enhancedSteps.length) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        Pasul {currentStep} din {enhancedSteps.length}
      </Text>
    </View>
  );

  const renderStepHeader = () => {
    const step = enhancedSteps[currentStep - 1];
    const IconComponent = step.icon;
    
    return (
      <View style={styles.stepHeader}>
        <View style={styles.stepIconContainer}>
          <IconComponent size={32} color="#3B82F6" />
        </View>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDescription}>{step.description}</Text>
      </View>
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Informații de bază</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Numele afișat *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex: Instalații Pro SRL"
          value={formData.displayName}
          onChangeText={(text) => setFormData({ ...formData, displayName: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Compania *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex: SC Instalații Pro SRL"
          value={formData.company}
          onChangeText={(text) => setFormData({ ...formData, company: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Descriere *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Descrie experiența ta, serviciile oferite și ce te diferențiază de competiție..."
          value={formData.about}
          onChangeText={(text) => setFormData({ ...formData, about: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Telefon pentru contact *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex: 0722 123 456"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Link WhatsApp (opțional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="https://wa.me/40722123456"
          value={formData.whatsappLink}
          onChangeText={(text) => setFormData({ ...formData, whatsappLink: text })}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Experiența ta profesională</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Ani de experiență *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex: 5"
          value={formData.experienceYears.toString()}
          onChangeText={(text) => setFormData({ ...formData, experienceYears: parseInt(text) || 0 })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Job-uri completate (estimativ)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex: 150"
          value={formData.totalJobsCompleted.toString()}
          onChangeText={(text) => setFormData({ ...formData, totalJobsCompleted: parseInt(text) || 0 })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Experiență anterioară</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Descrie experiența ta anterioară, locurile de muncă importante, proiecte mari..."
          value={formData.previousWork}
          onChangeText={(text) => setFormData({ ...formData, previousWork: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Licență de afaceri</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Numărul licenței (opțional)"
          value={formData.businessLicense}
          onChangeText={(text) => setFormData({ ...formData, businessLicense: text })}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Serviciile tale</Text>
      
      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <View key={index} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceTitle}>Serviciul {index + 1}</Text>
              <TouchableOpacity 
                onPress={() => setServices(services.filter((_, i) => i !== index))}
                style={styles.removeButton}
              >
                <X size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.textInput}
              placeholder="Titlul serviciului"
              value={service.title}
              onChangeText={(text) => {
                const updatedServices = [...services];
                updatedServices[index].title = text;
                setServices(updatedServices);
              }}
            />
            
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Descriere detaliată"
              value={service.description}
              onChangeText={(text) => {
                const updatedServices = [...services];
                updatedServices[index].description = text;
                setServices(updatedServices);
              }}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.priceRow}>
              <View style={styles.priceInput}>
                <Text style={styles.inputLabel}>Preț de la</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="100"
                  value={service.priceFrom.toString()}
                  onChangeText={(text) => {
                    const updatedServices = [...services];
                    updatedServices[index].priceFrom = parseInt(text) || 0;
                    setServices(updatedServices);
                  }}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.unitInput}>
                <Text style={styles.inputLabel}>Unitate</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="RON/oră"
                  value={service.unit}
                  onChangeText={(text) => {
                    const updatedServices = [...services];
                    updatedServices[index].unit = text;
                    setServices(updatedServices);
                  }}
                />
              </View>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.addButton} onPress={addService}>
          <Plus size={20} color="#3B82F6" />
          <Text style={styles.addButtonText}>Adaugă serviciu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Competențele tale</Text>
      
      <View style={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <View key={index} style={styles.skillCard}>
            <View style={styles.skillHeader}>
              <Text style={styles.skillTitle}>Competența {index + 1}</Text>
              <TouchableOpacity 
                onPress={() => removeSkill(index)}
                style={styles.removeButton}
              >
                <X size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.textInput}
              placeholder="Numele competenței"
              value={skill.name}
              onChangeText={(text) => {
                const updatedSkills = [...skills];
                updatedSkills[index].name = text;
                setSkills(updatedSkills);
              }}
            />
            
            <View style={styles.skillRow}>
              <View style={styles.skillLevel}>
                <Text style={styles.inputLabel}>Nivel</Text>
                <View style={styles.levelButtons}>
                  {(['beginner', 'intermediate', 'advanced', 'expert'] as const).map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.levelButton,
                        skill.level === level && styles.levelButtonActive
                      ]}
                      onPress={() => {
                        const updatedSkills = [...skills];
                        updatedSkills[index].level = level;
                        setSkills(updatedSkills);
                      }}
                    >
                      <Text style={[
                        styles.levelButtonText,
                        skill.level === level && styles.levelButtonTextActive
                      ]}>
                        {level === 'beginner' ? 'Începător' :
                         level === 'intermediate' ? 'Mediu' :
                         level === 'advanced' ? 'Avansat' : 'Expert'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.experienceInput}>
                <Text style={styles.inputLabel}>Ani experiență</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="2"
                  value={skill.yearsExperience.toString()}
                  onChangeText={(text) => {
                    const updatedSkills = [...skills];
                    updatedSkills[index].yearsExperience = parseInt(text) || 0;
                    setSkills(updatedSkills);
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.addButton} onPress={addSkill}>
          <Plus size={20} color="#3B82F6" />
          <Text style={styles.addButtonText}>Adaugă competență</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      {currentStep > 1 && (
        <TouchableOpacity style={styles.secondaryButton} onPress={handlePrevious}>
          <Text style={styles.secondaryButtonText}>Înapoi</Text>
        </TouchableOpacity>
      )}
      
      {currentStep < enhancedSteps.length ? (
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>Următorul</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.primaryButton, createProfileMutation.isPending && styles.primaryButtonDisabled]} 
          onPress={handleSubmit}
          disabled={createProfileMutation.isPending}
        >
          <Text style={styles.primaryButtonText}>
            {createProfileMutation.isPending ? 'Se creează...' : 'Finalizează profilul'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      // Add more steps here...
      default: return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {renderProgressBar()}
      {renderStepHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderCurrentStep()}
      </ScrollView>
      
      {renderNavigationButtons()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  stepHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  stepContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  servicesContainer: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  removeButton: {
    padding: 4,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  priceInput: {
    flex: 2,
  },
  unitInput: {
    flex: 1,
  },
  skillsContainer: {
    gap: 16,
  },
  skillCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  skillRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  skillLevel: {
    flex: 2,
  },
  experienceInput: {
    flex: 1,
  },
  levelButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  levelButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  levelButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  levelButtonTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
