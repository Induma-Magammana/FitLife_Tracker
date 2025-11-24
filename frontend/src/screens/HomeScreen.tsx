import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setExercises, setLoading, setError } from '../store/slices/exercisesSlice';
import { apiService } from '../services/apiService';
import { useTheme } from '../contexts/ThemeContext';
import { Exercise } from '../store/slices/exercisesSlice';

export const HomeScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { exercises, loading, error } = useAppSelector((state) => state.exercises);
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useTheme();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [waterModalVisible, setWaterModalVisible] = useState(false);
  const [exercisesModalVisible, setExercisesModalVisible] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal] = useState(8); // 8 glasses per day
  const [customWaterAmount, setCustomWaterAmount] = useState('');

  useEffect(() => {
    loadExercises();
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const loadExercises = async () => {
    dispatch(setLoading(true));
    try {
      const data = await apiService.getExercises();
      dispatch(setExercises(data));
    } catch (err) {
      dispatch(setError('Failed to load exercises'));
    }
  };

  const formatDateTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = currentDateTime.toLocaleDateString('en-US', options);
    const time = currentDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { date, time };
  };

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, waterGoal));
  };

  const removeWater = () => {
    setWaterIntake(prev => Math.max(prev - 1, 0));
  };

  const addCustomWater = () => {
    const amount = parseFloat(customWaterAmount);
    if (!isNaN(amount) && amount > 0) {
      setWaterIntake(prev => Math.min(prev + amount, waterGoal));
      setCustomWaterAmount('');
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid number');
    }
  };

  const resetWater = () => {
    setWaterIntake(0);
  };

  const waterPercentage = (waterIntake / waterGoal) * 100;

  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { exercise: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>💪</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.muscle}</Text>
        </View>
        <View style={[styles.badge, styles.difficultyBadge]}>
          <Text style={styles.badgeText}>{item.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = createStyles(theme);

  if (loading && exercises.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading exercises...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadExercises}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { date, time } = formatDateTime();

  return (
    <View style={styles.container}>
      {/* Date and Time Header */}
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setWaterModalVisible(true)}
        >
          <Text style={styles.actionIcon}>💧</Text>
          <Text style={styles.actionText}>Water Tracker</Text>
          <Text style={styles.actionSubtext}>{waterIntake}/{waterGoal} glasses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setExercisesModalVisible(true)}
        >
          <Text style={styles.actionIcon}>🏋️</Text>
          <Text style={styles.actionText}>Exercises</Text>
          <Text style={styles.actionSubtext}>{exercises.length} available</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.firstName || 'User'}!</Text>
        <Text style={styles.headerSubtitle}>Ready for your workout?</Text>
      </View>

      {/* Meditation Steps */}
      <ScrollView 
        style={styles.meditationContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.meditationCard}>
          <Text style={styles.meditationTitle}>🧘 Daily Meditation Guide</Text>
          <Text style={styles.meditationSubtitle}>Take a moment to center yourself</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Find a Quiet Space</Text>
              <Text style={styles.stepDescription}>
                Choose a peaceful location where you won't be disturbed. Sit comfortably with your back straight.
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Focus on Your Breath</Text>
              <Text style={styles.stepDescription}>
                Close your eyes and take deep, slow breaths. Inhale through your nose for 4 counts, hold for 4, exhale for 4.
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Body Scan</Text>
              <Text style={styles.stepDescription}>
                Slowly scan your body from head to toe. Notice any tension and consciously relax those areas.
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Clear Your Mind</Text>
              <Text style={styles.stepDescription}>
                Let thoughts come and go without judgment. If your mind wanders, gently bring focus back to your breath.
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>5</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Set an Intention</Text>
              <Text style={styles.stepDescription}>
                Think about what you want to achieve today. Set a positive intention for your workout and day ahead.
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>6</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Gradually Return</Text>
              <Text style={styles.stepDescription}>
                Slowly open your eyes. Take a moment to appreciate the calmness before starting your workout.
              </Text>
            </View>
          </View>

          <View style={styles.meditationTip}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.meditationTipText}>
              Start with 5 minutes daily and gradually increase. Consistency is more important than duration.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Water Tracker Modal */}
      <Modal
        visible={waterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setWaterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💧 Water Tracker</Text>
              <TouchableOpacity onPress={() => setWaterModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Water Progress */}
              <View style={styles.waterProgressContainer}>
                <Text style={styles.waterProgressText}>
                  {waterIntake} / {waterGoal} glasses
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${waterPercentage}%` }]} />
                </View>
                <Text style={styles.progressPercentage}>{Math.round(waterPercentage)}%</Text>
              </View>

              {/* Quick Add Buttons */}
              <View style={styles.quickAddContainer}>
                <TouchableOpacity
                  style={styles.waterButton}
                  onPress={() => addWater(1)}
                >
                  <Text style={styles.waterButtonText}>+ 1 Glass</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.waterButton}
                  onPress={() => addWater(0.5)}
                >
                  <Text style={styles.waterButtonText}>+ 0.5 Glass</Text>
                </TouchableOpacity>
              </View>

              {/* Custom Amount */}
              <View style={styles.customAmountContainer}>
                <Text style={styles.sectionLabel}>Custom Amount</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.waterInput}
                    value={customWaterAmount}
                    onChangeText={setCustomWaterAmount}
                    placeholder="Enter glasses"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="decimal-pad"
                  />
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={addCustomWater}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={removeWater}
                >
                  <Text style={styles.removeButtonText}>- Remove 1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetWater}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>

              {/* Daily Tips */}
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>💡 Hydration Tips</Text>
                <Text style={styles.tipText}>• Drink water before, during, and after workouts</Text>
                <Text style={styles.tipText}>• Start your day with a glass of water</Text>
                <Text style={styles.tipText}>• Keep a water bottle with you</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Exercises Modal */}
      <Modal
        visible={exercisesModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setExercisesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🏋️ All Exercises</Text>
              <TouchableOpacity onPress={() => setExercisesModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={exercises}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.exerciseModalCard}
                  onPress={() => {
                    setExercisesModalVisible(false);
                    navigation.navigate('Details', { exercise: item });
                  }}
                >
                  <View style={styles.exerciseModalHeader}>
                    <Text style={styles.exerciseModalIcon}>💪</Text>
                    <View style={styles.exerciseModalContent}>
                      <Text style={styles.exerciseModalTitle}>{item.name}</Text>
                      <Text style={styles.exerciseModalSubtitle}>{item.type}</Text>
                    </View>
                  </View>
                  <View style={styles.exerciseModalFooter}>
                    <View style={styles.exerciseModalBadge}>
                      <Text style={styles.exerciseModalBadgeText}>{item.muscle}</Text>
                    </View>
                    <View style={[styles.exerciseModalBadge, styles.difficultyBadge]}>
                      <Text style={styles.exerciseModalBadgeText}>{item.difficulty}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  dateTimeContainer: {
    backgroundColor: theme.primary,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  meditationContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  meditationCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meditationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  meditationSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  meditationTip: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.secondary,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  meditationTipText: {
    flex: 1,
    fontSize: 14,
    color: theme.text,
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    textTransform: 'capitalize',
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
  difficultyBadge: {
    backgroundColor: theme.accent,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: theme.error,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
  },
  closeButton: {
    fontSize: 28,
    color: theme.textSecondary,
    fontWeight: '300',
  },
  waterProgressContainer: {
    padding: 20,
    alignItems: 'center',
  },
  waterProgressText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: theme.surface,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 10,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  quickAddContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  waterButton: {
    flex: 1,
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  waterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  customAmountContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  waterInput: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
  },
  addButton: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  removeButton: {
    flex: 1,
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  removeButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.error,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  exerciseModalCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseModalHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  exerciseModalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  exerciseModalContent: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  exerciseModalSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    textTransform: 'capitalize',
  },
  exerciseModalFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  exerciseModalBadge: {
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
  exerciseModalBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
