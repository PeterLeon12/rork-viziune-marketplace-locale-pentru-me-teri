import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react-native';
import { useOptimalAuth } from '@/contexts/OptimalAuthContext';
import EnhancedLocationPicker from '@/components/EnhancedLocationPicker';

export default function ClientPostJobScreen() {
  const { user } = useOptimalAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    timeframe: '',
  });

  const categories = [
    { id: '1', name: 'Instalații', icon: '🔧' },
    { id: '2', name: 'Electric', icon: '⚡' },
    { id: '3', name: 'Electrocasnice', icon: '📱' },
    { id: '4', name: 'Montaj AC', icon: '❄️' },
    { id: '5', name: 'Zugraveli', icon: '🎨' },
    { id: '6', name: 'Dulgherie', icon: '🔨' },
    { id: '7', name: 'Curățenie', icon: '✨' },
    { id: '8', name: 'Grădinărit', icon: '🌱' },
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Nu e urgent', description: 'Într-o săptămână', color: '#10B981' },
    { value: 'medium', label: 'Moderat', description: 'În câteva zile', color: '#F59E0B' },
    { value: 'high', label: 'Urgent', description: 'Astăzi/mâine', color: '#EF4444' },
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: any) => {
    updateFormData('location', location.name);
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) {
          Alert.alert('Eroare', 'Te rugăm să introduci titlul job-ului');
          return false;
        }
        if (!formData.category) {
          Alert.alert('Eroare', 'Te rugăm să selectezi o categorie');
          return false;
        }
        return true;
      case 2:
        if (!formData.description.trim()) {
          Alert.alert('Eroare', 'Te rugăm să descrii ce ai nevoie');
          return false;
        }
        return true;
      case 3:
        if (!formData.location.trim()) {
          Alert.alert('Eroare', 'Te rugăm să selectezi locația');
          return false;
        }
        if (!formData.budget.trim()) {
          Alert.alert('Eroare', 'Te rugăm să introduci bugetul');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'Job Postat cu Succes! 🎉',
      'Job-ul tău a fost publicat și profesioniștii vor începe să trimită oferte în câteva minute.',
      [
        {
          text: 'Vezi Job-urile',
          onPress: () => router.push('/(tabs)/client/my-jobs'),
        },
        {
          text: 'Postează Altul',
          onPress: () => {
            setFormData({
              title: '',
              description: '',
              category: '',
              location: '',
              budget: '',
              urgency: 'medium',
              timeframe: '',
            });
            setCurrentStep(1);
          },
        },
      ]
    );
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${(currentStep / 4) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        Pasul {currentStep} din 4
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Ce servicii ai nevoie?</Text>
      <Text style={styles.stepDescription}>
        Descrie pe scurt job-ul și selectează categoria potrivită
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Titlul job-ului</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(title) => updateFormData('title', title)}
          placeholder="ex: Reparare robinet bucătărie"
          placeholderTextColor="#9CA3AF"
          autoFocus
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Categoria</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                formData.category === category.id && styles.categoryCardActive
              ]}
              onPress={() => updateFormData('category', category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryName,
                formData.category === category.id && styles.categoryNameActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Descrie în detaliu</Text>
      <Text style={styles.stepDescription}>
        Cu cât oferi mai multe detalii, cu atât primești oferte mai precise
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Descrierea job-ului</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(description) => updateFormData('description', description)}
          placeholder="Descrie ce trebuie făcut, materiale necesare, accesibilitate etc."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          autoFocus
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Când ai nevoie de serviciu?</Text>
        <TextInput
          style={styles.input}
          value={formData.timeframe}
          onChangeText={(timeframe) => updateFormData('timeframe', timeframe)}
          placeholder="ex: În următoarele 3 zile, Weekend-ul viitor"
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Locația și bugetul</Text>
      <Text style={styles.stepDescription}>
        Unde trebuie realizat serviciul și ce buget ai disponibil?
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Locația</Text>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={() => setShowLocationPicker(true)}
        >
          <MapPin size={20} color="#3B82F6" />
          <Text style={[
            styles.locationText,
            !formData.location && styles.locationPlaceholder
          ]}>
            {formData.location || 'Selectează locația'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bugetul estimat</Text>
        <TextInput
          style={styles.input}
          value={formData.budget}
          onChangeText={(budget) => updateFormData('budget', budget)}
          placeholder="ex: 200-300 LEI"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Urgența</Text>
        <View style={styles.urgencyOptions}>
          {urgencyOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.urgencyCard,
                formData.urgency === option.value && styles.urgencyCardActive
              ]}
              onPress={() => updateFormData('urgency', option.value)}
            >
              <View style={[styles.urgencyIndicator, { backgroundColor: option.color }]} />
              <View style={styles.urgencyText}>
                <Text style={[
                  styles.urgencyLabel,
                  formData.urgency === option.value && styles.urgencyLabelActive
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.urgencyDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirmă job-ul</Text>
      <Text style={styles.stepDescription}>
        Verifică informațiile și publică job-ul
      </Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <FileText size={24} color="#3B82F6" />
          <Text style={styles.summaryTitle}>{formData.title}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Categorie:</Text>
          <Text style={styles.summaryValue}>
            {categories.find(c => c.id === formData.category)?.name}
          </Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Descriere:</Text>
          <Text style={styles.summaryValue}>{formData.description}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Locația:</Text>
          <Text style={styles.summaryValue}>{formData.location}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Buget:</Text>
          <Text style={styles.summaryValue}>{formData.budget}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Urgența:</Text>
          <Text style={styles.summaryValue}>
            {urgencyOptions.find(u => u.value === formData.urgency)?.label}
          </Text>
        </View>
      </View>

      <View style={styles.nextStepsCard}>
        <Text style={styles.nextStepsTitle}>Ce se întâmplă după publicare?</Text>
        <View style={styles.nextStepsList}>
          <View style={styles.nextStepItem}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.nextStepText}>Profesioniștii vor vedea job-ul tău</Text>
          </View>
          <View style={styles.nextStepItem}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.nextStepText}>Vei primi oferte în câteva ore</Text>
          </View>
          <View style={styles.nextStepItem}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.nextStepText}>Poți compara și alege oferta optimă</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#3B82F6" />
          </TouchableOpacity>
          {renderProgressBar()}
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 4 ? 'Publică Job-ul' : 'Continuă'}
            </Text>
            {currentStep === 4 ? (
              <Plus size={20} color="#FFFFFF" />
            ) : (
              <ArrowLeft size={20} color="#FFFFFF" style={{ transform: [{ rotate: '180deg' }] }} />
            )}
          </TouchableOpacity>
        </View>

        {/* Location Picker Modal */}
        <EnhancedLocationPicker
          isVisible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onLocationSelect={handleLocationSelect}
          title="Unde trebuie realizat serviciul?"
          placeholder="Caută orașul sau cartierul..."
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardContainer: {
    flex: 1,
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
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
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
    height: 120,
    textAlignVertical: 'top',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  categoryCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF5FF',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryNameActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#1F2937',
  },
  locationPlaceholder: {
    color: '#9CA3AF',
  },
  urgencyOptions: {
    gap: 12,
  },
  urgencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  urgencyCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF5FF',
  },
  urgencyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  urgencyText: {
    flex: 1,
  },
  urgencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  urgencyLabelActive: {
    color: '#3B82F6',
  },
  urgencyDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  summarySection: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    color: '#1F2937',
  },
  nextStepsCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 20,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 16,
  },
  nextStepsList: {
    gap: 12,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextStepText: {
    fontSize: 14,
    color: '#166534',
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
});
