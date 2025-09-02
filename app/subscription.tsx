import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Check, 
  Star, 
  Crown, 
  Building, 
  ArrowLeft,
  CreditCard,
  Shield,
  Zap
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/contexts/AuthContext';

export default function SubscriptionScreen() {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Get subscription plans from backend
  const { data: plans, isLoading } = trpc.monetization.getSubscriptionPlans.useQuery();

  // Subscribe to plan mutation
  const subscribeMutation = trpc.monetization.subscribeToPlan.useMutation({
    onSuccess: (data) => {
      setIsSubscribing(false);
      Alert.alert(
        'Abonare Reușită! 🎉',
        data.message,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    },
    onError: (error) => {
      setIsSubscribing(false);
      Alert.alert('Eroare', `Nu am putut procesa abonarea: ${error.message}`);
    },
  });

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      Alert.alert('Eroare', 'Trebuie să fii conectat pentru a te abona');
      return;
    }

    if (!selectedPlan) {
      Alert.alert('Eroare', 'Te rugăm să selectezi un plan');
      return;
    }

    setIsSubscribing(true);

    try {
      await subscribeMutation.mutateAsync({
        planId: selectedPlan as 'basic' | 'premium' | 'enterprise',
        paymentMethod: 'card',
        autoRenew: true,
      });
    } catch (error) {
      // Error handling is done in onError callback
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Shield size={24} color="#6B7280" />;
      case 'basic':
        return <Star size={24} color="#F59E0B" />;
      case 'premium':
        return <Crown size={24} color="#8B5CF6" />;
      case 'enterprise':
        return <Building size={24} color="#10B981" />;
      default:
        return <Shield size={24} color="#6B7280" />;
    }
  };

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case 'free':
        return ['#F3F4F6', '#E5E7EB'];
      case 'basic':
        return ['#FEF3C7', '#FDE68A'];
      case 'premium':
        return ['#E0E7FF', '#C7D2FE'];
      case 'enterprise':
        return ['#D1FAE5', '#A7F3D0'];
      default:
        return ['#F3F4F6', '#E5E7EB'];
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Se încarcă planurile...</Text>
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
        <Text style={styles.headerTitle}>Planuri de Abonare</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Alege Planul Perfect pentru Afacerea Ta</Text>
          <Text style={styles.heroSubtitle}>
            Deblochează toate funcționalitățile și crește-ți veniturile cu Meșterul
          </Text>
        </View>

        {/* Plans Grid */}
        <View style={styles.plansContainer}>
          {plans?.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlanCard
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <LinearGradient
                colors={getPlanGradient(plan.id)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.planHeader}
              >
                <View style={styles.planIconContainer}>
                  {getPlanIcon(plan.id)}
                </View>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{plan.price}</Text>
                  {plan.price > 0 && (
                    <Text style={styles.currency}>RON</Text>
                  )}
                  {plan.period && (
                    <Text style={styles.period}>/{plan.period}</Text>
                  )}
                </View>
                {plan.price === 0 && (
                  <Text style={styles.freeText}>Gratuit</Text>
                )}
              </LinearGradient>

              <View style={styles.planContent}>
                <Text style={styles.featuresTitle}>Inclus în plan:</Text>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Check size={16} color="#10B981" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}

                {plan.limitations && plan.limitations.length > 0 && (
                  <>
                    <Text style={styles.limitationsTitle}>Limitări:</Text>
                    {plan.limitations.map((limitation, index) => (
                      <View key={index} style={styles.limitationRow}>
                        <Text style={styles.limitationText}>• {limitation}</Text>
                      </View>
                    ))}
                  </>
                )}

                {plan.commission && (
                  <View style={styles.commissionContainer}>
                    <Text style={styles.commissionText}>
                      Comision: {plan.commission}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subscribe Button */}
        {selectedPlan && selectedPlan !== 'free' && (
          <View style={styles.subscribeContainer}>
            <TouchableOpacity
              style={[styles.subscribeButton, isSubscribing && styles.subscribeButtonDisabled]}
              onPress={handleSubscribe}
              disabled={isSubscribing}
            >
              <CreditCard size={20} color="#FFFFFF" />
              <Text style={styles.subscribeButtonText}>
                {isSubscribing ? 'Se procesează...' : 'Abonează-te Acum'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.subscribeNote}>
              * Abonamentul se reînnoiește automat lunar
            </Text>
          </View>
        )}

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>De ce să te abonezi?</Text>
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitItem}>
              <Zap size={24} color="#F59E0B" />
              <Text style={styles.benefitTitle}>Răspuns Rapid</Text>
              <Text style={styles.benefitText}>
                Primești notificări prioritare pentru job-uri noi
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Shield size={24} color="#10B981" />
              <Text style={styles.benefitTitle}>Verificare Prioritară</Text>
              <Text style={styles.benefitText}>
                Profilul tău este verificat înaintea celorlalți
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Star size={24} color="#8B5CF6" />
              <Text style={styles.benefitTitle}>Promovare</Text>
              <Text style={styles.benefitText}>
                Apari mai sus în rezultatele de căutare
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
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
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  plansContainer: {
    padding: 20,
    gap: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  selectedPlanCard: {
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
  },
  planHeader: {
    padding: 24,
    alignItems: 'center',
  },
  planIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  period: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  freeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  planContent: {
    padding: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  limitationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 16,
  },
  limitationRow: {
    marginBottom: 8,
  },
  limitationText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 16,
  },
  commissionContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  commissionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    textAlign: 'center',
  },
  subscribeContainer: {
    padding: 20,
    alignItems: 'center',
  },
  subscribeButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
  },
  subscribeButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  subscribeNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  benefitsSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  benefitsGrid: {
    gap: 20,
  },
  benefitItem: {
    alignItems: 'center',
    padding: 16,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
