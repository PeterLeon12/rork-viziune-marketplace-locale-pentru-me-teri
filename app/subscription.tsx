import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Dimensions,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';
import { 
  ArrowLeft,
  Check,
  X,
  Crown,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Users,
  MessageSquare,
  Camera,
  Award,
  Clock,
  CreditCard,
  Gift
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Subscription plans
const subscriptionPlans = {
  client: [
    {
      id: 'client_basic',
      name: 'Basic',
      price: 0,
      period: 'Gratuit',
      color: ['#6B7280', '#9CA3AF'],
      features: [
        { name: 'Postează până la 3 job-uri/lună', included: true },
        { name: 'Mesaje cu profesioniștii', included: true },
        { name: 'Suport prin email', included: true },
        { name: 'Postări prioritare', included: false },
        { name: 'Suport prin telefon', included: false },
        { name: 'Manager dedicat', included: false },
      ],
      recommended: false,
    },
    {
      id: 'client_premium',
      name: 'Premium',
      price: 29,
      period: '/lună',
      color: ['#3B82F6', '#1E40AF'],
      features: [
        { name: 'Job-uri nelimitate', included: true },
        { name: 'Postări prioritare', included: true },
        { name: 'Mesaje nelimitate', included: true },
        { name: 'Suport prin telefon', included: true },
        { name: 'Analiză detaliată', included: true },
        { name: 'Manager dedicat', included: false },
      ],
      recommended: true,
    },
    {
      id: 'client_business',
      name: 'Business',
      price: 79,
      period: '/lună',
      color: ['#7C3AED', '#5B21B6'],
      features: [
        { name: 'Tot din Premium +', included: true },
        { name: 'Manager dedicat', included: true },
        { name: 'Cont multi-utilizator', included: true },
        { name: 'Integrări API', included: true },
        { name: 'Rapoarte personalizate', included: true },
        { name: 'SLA garantat', included: true },
      ],
      recommended: false,
    },
  ],
  professional: [
    {
      id: 'pro_starter',
      name: 'Starter',
      price: 0,
      period: 'Gratuit',
      color: ['#6B7280', '#9CA3AF'],
      features: [
        { name: 'Profil de bază', included: true },
        { name: 'Până la 5 aplicări/lună', included: true },
        { name: '3 imagini în portofoliu', included: true },
        { name: 'Statistici avansate', included: false },
        { name: 'Insigna "Verificat"', included: false },
        { name: 'Suport prioritar', included: false },
      ],
      recommended: false,
    },
    {
      id: 'pro_professional',
      name: 'Professional',
      price: 49,
      period: '/lună',
      color: ['#10B981', '#059669'],
      features: [
        { name: 'Profil premium', included: true },
        { name: 'Aplicări nelimitate', included: true },
        { name: 'Portofoliu nelimitat', included: true },
        { name: 'Insigna "Verificat"', included: true },
        { name: 'Statistici avansate', included: true },
        { name: 'Promovare în căutări', included: true },
      ],
      recommended: true,
    },
    {
      id: 'pro_expert',
      name: 'Expert',
      price: 99,
      period: '/lună',
      color: ['#F59E0B', '#D97706'],
      features: [
        { name: 'Tot din Professional +', included: true },
        { name: 'Insigna "Expert"', included: true },
        { name: 'Primul în rezultate', included: true },
        { name: 'Suport prioritar', included: true },
        { name: 'Manager dedicat', included: true },
        { name: 'Marketing personalizat', included: true },
      ],
      recommended: false,
    },
  ],
};

export default function SubscriptionScreen() {
  const { user } = useSimpleAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const userPlans = user?.role === 'pro' ? subscriptionPlans.professional : subscriptionPlans.client;
  const currentUserType = user?.role === 'pro' ? 'Profesionist' : 'Client';

  const getDiscountedPrice = (price: number) => {
    return isYearly ? Math.round(price * 10) : price; // ~17% discount for yearly
  };

  const handleSubscribe = async (planId: string, price: number) => {
    if (price === 0) {
      Alert.alert('Plan Gratuit', 'Planul gratuit este deja activ!');
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Abonament Activat! 🎉',
        `Abonamentul tău a fost activat cu succes. Poți începe să folosești toate funcționalitățile premium!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut procesa plata. Încearcă din nou.');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const renderPlanCard = (plan: any) => {
    const finalPrice = getDiscountedPrice(plan.price);
    const isSelected = selectedPlan === plan.id;
    const isProcessingThis = isProcessing && isSelected;

    return (
      <View key={plan.id} style={[styles.planCard, plan.recommended && styles.recommendedCard]}>
        {plan.recommended && (
          <View style={styles.recommendedBadge}>
            <Crown size={16} color="#FFFFFF" />
            <Text style={styles.recommendedText}>Recomandat</Text>
          </View>
        )}

        <LinearGradient colors={plan.color} style={styles.planHeader}>
          <View style={styles.planTitleContainer}>
            <Text style={styles.planName}>{plan.name}</Text>
            {plan.price > 0 && (
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{finalPrice}</Text>
                <Text style={styles.currency}>RON</Text>
                <Text style={styles.period}>
                  {isYearly ? '/an' : plan.period}
                </Text>
              </View>
            )}
            {plan.price === 0 && (
              <Text style={styles.freePrice}>Gratuit</Text>
            )}
          </View>
        </LinearGradient>

        <View style={styles.planContent}>
          <View style={styles.featuresContainer}>
            {plan.features.map((feature: any, index: number) => (
              <View key={index} style={styles.featureItem}>
                <View style={[
                  styles.featureIcon,
                  { backgroundColor: feature.included ? '#D1FAE5' : '#FEE2E2' }
                ]}>
                  {feature.included ? (
                    <Check size={14} color="#10B981" />
                  ) : (
                    <X size={14} color="#EF4444" />
                  )}
                </View>
                <Text style={[
                  styles.featureText,
                  { color: feature.included ? '#374151' : '#9CA3AF' }
                ]}>
                  {feature.name}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.subscribeButton,
              plan.recommended && styles.recommendedButton,
              isProcessingThis && styles.processingButton
            ]}
            onPress={() => handleSubscribe(plan.id, finalPrice)}
            disabled={isProcessingThis}
          >
            {isProcessingThis ? (
              <Text style={styles.subscribeButtonText}>Se procesează...</Text>
            ) : (
              <>
                {plan.price === 0 ? (
                  <Text style={styles.subscribeButtonText}>Plan Activ</Text>
                ) : (
                  <>
                    <CreditCard size={18} color="#FFFFFF" />
                    <Text style={styles.subscribeButtonText}>
                      Alege {plan.name}
                    </Text>
                  </>
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
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
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Abonamente</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Planuri pentru {currentUserType}
          </Text>
          <Text style={styles.heroSubtitle}>
            {user.role === 'pro' 
              ? 'Dezvoltă-ți afacerea și câștigă mai mult cu planurile noastre premium'
              : 'Găsește cei mai buni profesioniști cu planurile noastre premium'
            }
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Billing Toggle */}
        <View style={styles.billingToggleContainer}>
          <View style={styles.billingToggle}>
            <Text style={[styles.billingOption, !isYearly && styles.billingOptionActive]}>
              Lunar
            </Text>
            <Switch
              value={isYearly}
              onValueChange={setIsYearly}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
            <Text style={[styles.billingOption, isYearly && styles.billingOptionActive]}>
              Anual
            </Text>
            {isYearly && (
              <View style={styles.discountBadge}>
                <Gift size={12} color="#10B981" />
                <Text style={styles.discountText}>~17% reducere</Text>
              </View>
            )}
          </View>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {userPlans.map(renderPlanCard)}
        </View>

        {/* Features Comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonTitle}>De ce să alegi Premium?</Text>
          
          <View style={styles.benefitsContainer}>
            {user.role === 'pro' ? (
              <>
                <View style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>
                    <TrendingUp size={24} color="#10B981" />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Mai multe oportunități</Text>
                    <Text style={styles.benefitDescription}>
                      Aplică la job-uri nelimitate și crește-ți veniturile
                    </Text>
                  </View>
                </View>

                <View style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>
                    <Star size={24} color="#F59E0B" />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Vizibilitate maximă</Text>
                    <Text style={styles.benefitDescription}>
                      Apari primul în rezultatele de căutare
                    </Text>
                  </View>
                </View>

                <View style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>
                    <Shield size={24} color="#3B82F6" />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Insigna verificat</Text>
                    <Text style={styles.benefitDescription}>
                      Crește încrederea clienților în serviciile tale
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>
                    <Zap size={24} color="#F59E0B" />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Răspunsuri mai rapide</Text>
                    <Text style={styles.benefitDescription}>
                      Job-urile tale apar prioritar în feed-ul profesioniștilor
                    </Text>
                  </View>
                </View>

                <View style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>
                    <Users size={24} color="#10B981" />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Acces la cei mai buni</Text>
                    <Text style={styles.benefitDescription}>
                      Contactează profesioniștii premium verificați
                    </Text>
                  </View>
                </View>

                <View style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>
                    <Clock size={24} color="#3B82F6" />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Suport prioritar</Text>
                    <Text style={styles.benefitDescription}>
                      Răspuns în maxim 2 ore la toate întrebările
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Întrebări frecvente</Text>
          
          <View style={styles.faqContainer}>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Pot să îmi schimb planul oricând?</Text>
              <Text style={styles.faqAnswer}>
                Da, poți să îți schimbi planul oricând din aplicație. Modificările se aplică imediat.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Ce se întâmplă dacă anulez abonamentul?</Text>
              <Text style={styles.faqAnswer}>
                Poți folosi funcționalitățile premium până la sfârșitul perioadei plătite, apoi contul revine la planul gratuit.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Sunt taxe ascunse?</Text>
              <Text style={styles.faqAnswer}>
                Nu, prețurile afișate includ toate taxele. Nu există taxe ascunse sau costuri suplimentare.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
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
  header: {
    paddingTop: height * 0.02,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
  billingToggleContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  billingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    gap: 16,
  },
  billingOption: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  billingOptionActive: {
    color: '#1F2937',
    fontWeight: '600',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
  },
  plansContainer: {
    padding: 20,
    gap: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  recommendedCard: {
    borderWidth: 2,
    borderColor: '#3B82F6',
    transform: [{ scale: 1.02 }],
  },
  recommendedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    zIndex: 1,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planHeader: {
    padding: 24,
    alignItems: 'center',
  },
  planTitleContainer: {
    alignItems: 'center',
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  period: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  freePrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planContent: {
    padding: 24,
  },
  featuresContainer: {
    marginBottom: 24,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: '#6B7280',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recommendedButton: {
    backgroundColor: '#3B82F6',
  },
  processingButton: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  comparisonSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  benefitsContainer: {
    gap: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  faqSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  faqContainer: {
    gap: 16,
  },
  faqItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});