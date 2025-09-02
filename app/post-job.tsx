import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { useAppStore } from '@/store/useAppStore';

export default function PostJobScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  
  const { selectedCategory, selectedArea } = useAppStore();

  const createJobMutation = trpc.jobs.createJob.useMutation({
    onSuccess: () => {
      Alert.alert('Succes', 'Job-ul a fost postat cu succes!');
      router.back();
    },
    onError: (error) => {
      Alert.alert('Eroare', error.message);
    },
  });

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile obligatorii');
      return;
    }

    if (!selectedCategory || !selectedArea) {
      Alert.alert('Eroare', 'Te rugăm să selectezi categoria și zona');
      return;
    }

    createJobMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      category: selectedCategory,
      area: selectedArea,
      budget: budget ? parseInt(budget) : undefined,
      urgency,
    });
  };

  const urgencyOptions = [
    { value: 'low', label: 'Scăzută', color: '#10B981' },
    { value: 'medium', label: 'Medie', color: '#F59E0B' },
    { value: 'high', label: 'Ridicată', color: '#EF4444' },
    { value: 'urgent', label: 'Urgent', color: '#DC2626' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Înapoi</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Postează un Job</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalii Job</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Titlu *</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: Reparație robinet bucătărie"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descriere *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrie în detaliu ce trebuie făcut..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Buget (RON)</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: 200"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Urgență</Text>
          <View style={styles.urgencyContainer}>
            {urgencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.urgencyButton,
                  urgency === option.value && styles.urgencyButtonSelected,
                  { borderColor: option.color }
                ]}
                onPress={() => setUrgency(option.value as any)}
              >
                <Text style={[
                  styles.urgencyButtonText,
                  urgency === option.value && { color: option.color }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorie și Zonă</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Categorie: {selectedCategory || 'Nu este selectată'}
            </Text>
            <Text style={styles.infoText}>
              Zonă: {selectedArea || 'Nu este selectată'}
            </Text>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.changeButtonText}>Schimbă</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, createJobMutation.isPending && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={createJobMutation.isPending}
        >
          <Text style={styles.submitButtonText}>
            {createJobMutation.isPending ? 'Se postează...' : 'Postează Job-ul'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3B82F6',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  urgencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  urgencyButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  urgencyButtonSelected: {
    backgroundColor: '#FEF2F2',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  infoContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  changeButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
