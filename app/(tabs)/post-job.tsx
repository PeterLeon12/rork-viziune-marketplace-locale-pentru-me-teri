import React, { useState, useEffect } from 'react';
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
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useOptimalAuth } from '@/contexts/OptimalAuthContext';

export default function PostJobScreen() {
  const { user, isAuthenticated } = useOptimalAuth();
  
  // Get categories and areas from backend
  const { data: categories = [] } = trpc.profiles.getCategories.useQuery();
  const { data: areas = [] } = trpc.profiles.getAreas.useQuery();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    urgency: 'normal' as 'low' | 'normal' | 'high',
    contactPhone: '',
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // tRPC mutation for creating jobs
  const createJobMutation = trpc.jobs.createJob.useMutation({
    onSuccess: (data) => {
      setIsSubmitting(false);
      Alert.alert(
        'Job Postat cu Succes! 🎉',
        'Job-ul tău a fost publicat și profesioniștii vor începe să trimită oferte în câteva minute.',
        [
          {
            text: 'Vezi Job-urile',
            onPress: () => router.push('/jobs'),
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
                urgency: 'normal',
                contactPhone: '',
              });
              setStep(1);
            },
          },
        ]
      );
    },
    onError: (error) => {
      setIsSubmitting(false);
      Alert.alert('Eroare', `Nu am putut posta job-ul: ${error.message}`);
    },
  });

  const urgencyOptions = [
    { value: 'low', label: 'Nu e urgent', icon: Clock, color: '#10B981' },
    { value: 'normal', label: 'În următoarele zile', icon: Calendar, color: '#3B82F6' },
    { value: 'high', label: 'Urgent (azi/mâine)', icon: AlertCircle, color: '#EF4444' },
  ];

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert('Eroare', 'Trebuie să fii conectat pentru a posta un job');
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile obligatorii.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createJobMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        area: formData.location,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        urgency: formData.urgency === 'low' ? 'low' : formData.urgency === 'high' ? 'high' : 'medium',
        location: {
          address: formData.location,
          lat: 0, // Will be updated with real geocoding
          lng: 0,
        },
      });
    } catch (error) {
      // Error handling is done in onError callback
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Ce trebuie să faci?</Text>
      <Text style={styles.stepSubtitle}>Descrie job-ul în detaliu pentru a primi cele mai bune oferte</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Titlul Job-ului *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex: Vreau să îmi repar ușa de la garaj"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Descriere Detaliată *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Descrie exact ce trebuie făcut, când, și orice detalii importante..."
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Categoria *</Text>
        <View style={styles.categoryGrid}>
          {categories.slice(0, 6).map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryOption,
                formData.category === category.name && styles.categoryOptionSelected
              ]}
              onPress={() => setFormData({ ...formData, category: category.name })}
            >
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
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Unde și când?</Text>
      <Text style={styles.stepSubtitle}>Specifică locația și urgența job-ului</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Locația *</Text>
        <View style={styles.locationInput}>
          <MapPin size={20} color="#6B7280" />
          <TextInput
            style={styles.locationTextInput}
            placeholder="ex: Cluj-Napoca, Centru"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cât de urgent este? *</Text>
        <View style={styles.urgencyOptions}>
          {urgencyOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.urgencyOption,
                  formData.urgency === option.value && styles.urgencyOptionSelected
                ]}
                onPress={() => setFormData({ ...formData, urgency: option.value as 'low' | 'normal' | 'high' })}
              >
                <IconComponent size={20} color={formData.urgency === option.value ? '#FFFFFF' : option.color} />
                <Text style={[
                  styles.urgencyOptionText,
                  formData.urgency === option.value && styles.urgencyOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Buget (opțional)</Text>
        <View style={styles.budgetInput}>
          <DollarSign size={20} color="#6B7280" />
          <TextInput
            style={styles.budgetTextInput}
            placeholder="ex: 200-500 RON"
            value={formData.budget}
            onChangeText={(text) => setFormData({ ...formData, budget: text })}
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Contact și Confirmare</Text>
      <Text style={styles.stepSubtitle}>Ultimul pas pentru a posta job-ul</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Telefon pentru contact</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex: 0722 123 456"
          value={formData.contactPhone}
          onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Rezumat Job</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Titlu:</Text>
          <Text style={styles.summaryValue}>{formData.title}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Categorie:</Text>
          <Text style={styles.summaryValue}>{formData.category}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Locație:</Text>
          <Text style={styles.summaryValue}>{formData.location}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Urgență:</Text>
          <Text style={styles.summaryValue}>
            {urgencyOptions.find(o => o.value === formData.urgency)?.label}
          </Text>
        </View>
        {formData.budget && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Buget:</Text>
            <Text style={styles.summaryValue}>{formData.budget}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Text style={styles.submitButtonText}>Se postează...</Text>
        ) : (
          <>
            <Text style={styles.submitButtonText}>Postează Job-ul</Text>
            <CheckCircle size={20} color="#FFFFFF" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        <View style={styles.progressSteps}>
          {[1, 2, 3].map((stepNumber) => (
            <View key={stepNumber} style={styles.progressStep}>
              <View style={[
                styles.progressDot,
                step >= stepNumber ? styles.progressDotActive : styles.progressDotInactive
              ]}>
                {step > stepNumber && <CheckCircle size={16} color="#FFFFFF" />}
                {step === stepNumber && <Text style={styles.progressDotText}>{stepNumber}</Text>}
              </View>
              <Text style={[
                styles.progressStepText,
                step >= stepNumber ? styles.progressStepTextActive : styles.progressStepTextInactive
              ]}>
                {stepNumber === 1 ? 'Detalii' : stepNumber === 2 ? 'Locație' : 'Confirmare'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      {/* Navigation Buttons */}
      {step < 3 && (
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setStep(step + 1)}
          >
            <Text style={styles.nextButtonText}>Următorul Pas</Text>
            <ArrowLeft size={20} color="#FFFFFF" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>
      )}

      {step > 1 && (
        <TouchableOpacity
          style={styles.previousButton}
          onPress={() => setStep(step - 1)}
        >
          <Text style={styles.previousButtonText}>Pasul Anterior</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
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
  progressContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressDotActive: {
    backgroundColor: '#2563EB',
  },
  progressDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  progressDotText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressStepTextActive: {
    color: '#2563EB',
  },
  progressStepTextInactive: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryOptionSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  categoryOptionTextSelected: {
    color: '#2563EB',
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  locationTextInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  urgencyOptions: {
    gap: 12,
  },
  urgencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  urgencyOptionSelected: {
    backgroundColor: '#2563EB',
  },
  urgencyOptionText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  urgencyOptionTextSelected: {
    color: '#FFFFFF',
  },
  budgetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  budgetTextInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  submitButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  navigationContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  previousButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  previousButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});
