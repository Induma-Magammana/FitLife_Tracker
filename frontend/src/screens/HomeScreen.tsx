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
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [calorieModalVisible, setCalorieModalVisible] = useState(false);
  const [meditationModalVisible, setMeditationModalVisible] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal] = useState(8); // 8 glasses per day
  const [customWaterAmount, setCustomWaterAmount] = useState('');
  const [foodSearch, setFoodSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Personal calorie calculator states
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [calculatedCalories, setCalculatedCalories] = useState<number | null>(null);
  const [calculatedBMI, setCalculatedBMI] = useState<number | null>(null);
  const [showCalculator, setShowCalculator] = useState(true);

  // Motivational quotes
  const motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Take care of your body. It's the only place you have to live.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The difference between who you are and who you want to be is what you do.",
    "Don't limit your challenges. Challenge your limits.",
    "Strive for progress, not perfection.",
    "Small steps every day lead to big results.",
    "Believe in yourself and all that you are.",
    "Your health is an investment, not an expense.",
    "Start where you are. Use what you have. Do what you can.",
    "The body achieves what the mind believes.",
    "Make yourself a priority once in a while. It's not selfish, it's necessary.",
    "Every accomplishment starts with the decision to try.",
    "You are stronger than you think."
  ];

  const [dailyQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  });

  useEffect(() => {
    loadExercises();
    loadHealthData();
    
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

  const loadHealthData = async () => {
    try {
      const userId = user?.id || user?.email;
      if (!userId) return;

      const healthDataKey = `health_data_${userId}`;
      const savedData = await AsyncStorage.getItem(healthDataKey);
      
      if (savedData) {
        const { age, gender, weight, height, activityLevel, calculatedCalories, calculatedBMI } = JSON.parse(savedData);
        
        // Restore all saved values
        if (age) setAge(age);
        if (gender) setGender(gender);
        if (weight) setWeight(weight);
        if (height) setHeight(height);
        if (activityLevel) setActivityLevel(activityLevel);
        if (calculatedCalories) setCalculatedCalories(calculatedCalories);
        if (calculatedBMI) setCalculatedBMI(calculatedBMI);
        
        // If we have calculated values, hide the calculator form
        if (calculatedCalories && calculatedBMI) {
          setShowCalculator(false);
        }
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const saveHealthData = async (data: any) => {
    try {
      const userId = user?.id || user?.email;
      if (!userId) return;

      const healthDataKey = `health_data_${userId}`;
      await AsyncStorage.setItem(healthDataKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving health data:', error);
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

  // Food calorie database (per 100g)
  const foodDatabase = [
    // Vegetables
    { name: 'Broccoli', calories: 34, type: 'Vegetable', serving: '100g' },
    { name: 'Carrot', calories: 41, type: 'Vegetable', serving: '100g' },
    { name: 'Spinach', calories: 23, type: 'Vegetable', serving: '100g' },
    { name: 'Tomato', calories: 18, type: 'Vegetable', serving: '100g' },
    { name: 'Cucumber', calories: 16, type: 'Vegetable', serving: '100g' },
    { name: 'Bell Pepper', calories: 31, type: 'Vegetable', serving: '100g' },
    { name: 'Lettuce', calories: 15, type: 'Vegetable', serving: '100g' },
    { name: 'Cauliflower', calories: 25, type: 'Vegetable', serving: '100g' },
    { name: 'Cabbage', calories: 25, type: 'Vegetable', serving: '100g' },
    { name: 'Zucchini', calories: 17, type: 'Vegetable', serving: '100g' },
    { name: 'Eggplant', calories: 25, type: 'Vegetable', serving: '100g' },
    { name: 'Onion', calories: 40, type: 'Vegetable', serving: '100g' },
    { name: 'Garlic', calories: 149, type: 'Vegetable', serving: '100g' },
    { name: 'Mushroom', calories: 22, type: 'Vegetable', serving: '100g' },
    { name: 'Asparagus', calories: 20, type: 'Vegetable', serving: '100g' },
    { name: 'Green Beans', calories: 31, type: 'Vegetable', serving: '100g' },
    { name: 'Peas', calories: 81, type: 'Vegetable', serving: '100g' },
    { name: 'Corn', calories: 86, type: 'Vegetable', serving: '100g' },
    { name: 'Potato', calories: 77, type: 'Vegetable', serving: '100g' },
    { name: 'Sweet Potato', calories: 86, type: 'Vegetable', serving: '100g' },
    { name: 'Pumpkin', calories: 26, type: 'Vegetable', serving: '100g' },
    { name: 'Beetroot', calories: 43, type: 'Vegetable', serving: '100g' },
    { name: 'Radish', calories: 16, type: 'Vegetable', serving: '100g' },
    { name: 'Celery', calories: 14, type: 'Vegetable', serving: '100g' },
    // Fruits
    { name: 'Apple', calories: 52, type: 'Fruit', serving: '100g' },
    { name: 'Banana', calories: 89, type: 'Fruit', serving: '100g' },
    { name: 'Orange', calories: 47, type: 'Fruit', serving: '100g' },
    { name: 'Strawberry', calories: 32, type: 'Fruit', serving: '100g' },
    { name: 'Blueberry', calories: 57, type: 'Fruit', serving: '100g' },
    { name: 'Grape', calories: 69, type: 'Fruit', serving: '100g' },
    { name: 'Watermelon', calories: 30, type: 'Fruit', serving: '100g' },
    { name: 'Mango', calories: 60, type: 'Fruit', serving: '100g' },
    { name: 'Pineapple', calories: 50, type: 'Fruit', serving: '100g' },
    { name: 'Papaya', calories: 43, type: 'Fruit', serving: '100g' },
    { name: 'Peach', calories: 39, type: 'Fruit', serving: '100g' },
    { name: 'Pear', calories: 57, type: 'Fruit', serving: '100g' },
    { name: 'Cherry', calories: 63, type: 'Fruit', serving: '100g' },
    { name: 'Kiwi', calories: 61, type: 'Fruit', serving: '100g' },
    { name: 'Avocado', calories: 160, type: 'Fruit', serving: '100g' },
    { name: 'Lemon', calories: 29, type: 'Fruit', serving: '100g' },
    { name: 'Lime', calories: 30, type: 'Fruit', serving: '100g' },
    { name: 'Grapefruit', calories: 42, type: 'Fruit', serving: '100g' },
    { name: 'Pomegranate', calories: 83, type: 'Fruit', serving: '100g' },
    { name: 'Raspberry', calories: 52, type: 'Fruit', serving: '100g' },
    { name: 'Blackberry', calories: 43, type: 'Fruit', serving: '100g' },
    { name: 'Cranberry', calories: 46, type: 'Fruit', serving: '100g' },
    { name: 'Plum', calories: 46, type: 'Fruit', serving: '100g' },
    { name: 'Apricot', calories: 48, type: 'Fruit', serving: '100g' },
    { name: 'Cantaloupe', calories: 34, type: 'Fruit', serving: '100g' },
    { name: 'Honeydew', calories: 36, type: 'Fruit', serving: '100g' },
    { name: 'Dragon Fruit', calories: 60, type: 'Fruit', serving: '100g' },
    { name: 'Passion Fruit', calories: 97, type: 'Fruit', serving: '100g' },
    { name: 'Coconut', calories: 354, type: 'Fruit', serving: '100g' },
    { name: 'Date', calories: 277, type: 'Fruit', serving: '100g' },
    { name: 'Fig', calories: 74, type: 'Fruit', serving: '100g' },
  ];

  const handleFoodSearch = (text: string) => {
    setFoodSearch(text);
    if (text.trim().length > 0) {
      const filtered = foodDatabase.filter(food => 
        food.name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const calculateCalories = () => {
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (!ageNum || !weightNum || !heightNum || ageNum <= 0 || weightNum <= 0 || heightNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid age, weight, and height values.');
      return;
    }

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);
    
    // Calculate BMI: weight (kg) / (height (m))^2
    const heightInMeters = heightNum / 100;
    const bmi = parseFloat((weightNum / (heightInMeters * heightInMeters)).toFixed(1));
    
    setCalculatedCalories(tdee);
    setCalculatedBMI(bmi);
    setShowCalculator(false);

    // Save health data to AsyncStorage
    saveHealthData({
      age,
      gender,
      weight,
      height,
      activityLevel,
      calculatedCalories: tdee,
      calculatedBMI: bmi
    });
  };

  const resetCalculator = async () => {
    setAge('');
    setWeight('');
    setHeight('');
    setGender('male');
    setActivityLevel('moderate');
    setCalculatedCalories(null);
    setCalculatedBMI(null);
    setShowCalculator(true);

    // Clear saved health data
    try {
      const userId = user?.id || user?.email;
      if (userId) {
        const healthDataKey = `health_data_${userId}`;
        await AsyncStorage.removeItem(healthDataKey);
      }
    } catch (error) {
      console.error('Error clearing health data:', error);
    }
  };

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Date and Time Header */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.firstName || 'User'}!</Text>
          <Text style={styles.headerSubtitle}>Ready for your workout?</Text>
        </View>

        {/* Health Stats */}
        {calculatedBMI !== null && calculatedCalories !== null && (
          <View style={styles.healthStatsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Your BMI</Text>
              <Text style={styles.statValue}>{calculatedBMI}</Text>
              <Text style={styles.statCategory}>
                {calculatedBMI < 18.5 ? 'Underweight' :
                 calculatedBMI < 25 ? 'Normal' :
                 calculatedBMI < 30 ? 'Overweight' : 'Obese'}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Daily Calories</Text>
              <Text style={styles.statValue}>{calculatedCalories}</Text>
              <Text style={styles.statCategory}>cal/day</Text>
            </View>
          </View>
        )}

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

        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setCalorieModalVisible(true)}
          >
            <Text style={styles.actionIcon}>🍽️</Text>
            <Text style={styles.actionText}>Calorie Guide</Text>
            <Text style={styles.actionSubtext}>Daily recommendations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setMeditationModalVisible(true)}
          >
            <Text style={styles.actionIcon}>🧘</Text>
            <Text style={styles.actionText}>Meditation</Text>
            <Text style={styles.actionSubtext}>Daily mindfulness</Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteContainer}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>"{dailyQuote}"</Text>
          </View>
        </View>
      </View>

      {/* Meditation Modal */}
      <Modal
        visible={meditationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMeditationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🧘 Daily Meditation Guide</Text>
              <TouchableOpacity onPress={() => setMeditationModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
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
                  Start with 5 minutes daily and gradually increase.{'\n'}Consistency is more important than duration.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>

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

      {/* Calorie Recommendations Modal */}
      <Modal
        visible={calorieModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCalorieModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🍽️ Daily Calorie Guide</Text>
              <TouchableOpacity onPress={() => setCalorieModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.calorieContainer}>
                <Text style={styles.calorieIntro}>
                  Your daily calorie needs depend on your age, gender, weight, height, and activity level.
                </Text>

                {/* Food Calorie Lookup */}
                <View style={styles.calorieSection}>
                  <Text style={styles.calorieSectionTitle}>🔍 Food Calorie Lookup</Text>
                  <Text style={styles.foodSearchSubtitle}>
                    Search for vegetables and fruits to see their calorie content
                  </Text>
                  
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={styles.foodSearchInput}
                      value={foodSearch}
                      onChangeText={handleFoodSearch}
                      placeholder="Search for a fruit or vegetable..."
                      placeholderTextColor={theme.textSecondary}
                    />
                    {foodSearch.length > 0 && (
                      <TouchableOpacity 
                        onPress={() => {
                          setFoodSearch('');
                          setSearchResults([]);
                        }}
                        style={styles.clearSearchButton}
                      >
                        <Text style={styles.clearSearchText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {searchResults.length > 0 && (
                    <View style={styles.searchResultsContainer}>
                      {searchResults.map((food, index) => (
                        <View key={index} style={styles.foodResultCard}>
                          <View style={styles.foodResultHeader}>
                            <Text style={styles.foodResultName}>{food.name}</Text>
                            <Text style={styles.foodResultType}>{food.type}</Text>
                          </View>
                          <View style={styles.foodResultCalories}>
                            <Text style={styles.calorieNumber}>{food.calories}</Text>
                            <Text style={styles.calorieUnit}>calories</Text>
                          </View>
                          <Text style={styles.foodResultServing}>per {food.serving}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {foodSearch.length > 0 && searchResults.length === 0 && (
                    <View style={styles.noResultsContainer}>
                      <Text style={styles.noResultsText}>
                        No results found for "{foodSearch}"
                      </Text>
                    </View>
                  )}
                </View>

                {/* Personal Calorie Calculator */}
                <View style={styles.calorieSection}>
                  <Text style={styles.calorieSectionTitle}>🧮 Personal Calorie Calculator</Text>
                  <Text style={styles.foodSearchSubtitle}>
                    Calculate your personalized daily calorie needs
                  </Text>

                  {showCalculator ? (
                    <View style={styles.calculatorContainer}>
                      <TextInput
                        style={styles.calculatorInput}
                        value={age}
                        onChangeText={setAge}
                        placeholder="Age (years)"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="numeric"
                      />

                      <View style={styles.genderContainer}>
                        <Text style={styles.genderLabel}>Gender:</Text>
                        <View style={styles.genderButtons}>
                          <TouchableOpacity
                            style={[
                              styles.genderButton,
                              gender === 'male' && styles.genderButtonActive
                            ]}
                            onPress={() => setGender('male')}
                          >
                            <Text style={[
                              styles.genderButtonText,
                              gender === 'male' && styles.genderButtonTextActive
                            ]}>👨 Male</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.genderButton,
                              gender === 'female' && styles.genderButtonActive
                            ]}
                            onPress={() => setGender('female')}
                          >
                            <Text style={[
                              styles.genderButtonText,
                              gender === 'female' && styles.genderButtonTextActive
                            ]}>👩 Female</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <TextInput
                        style={styles.calculatorInput}
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="Weight (kg)"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="numeric"
                      />

                      <TextInput
                        style={styles.calculatorInput}
                        value={height}
                        onChangeText={setHeight}
                        placeholder="Height (cm)"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="numeric"
                      />

                      <View style={styles.activityContainer}>
                        <Text style={styles.activityLabel}>Activity Level:</Text>
                        <View style={styles.activityButtons}>
                          <TouchableOpacity
                            style={[
                              styles.activityButton,
                              activityLevel === 'sedentary' && styles.activityButtonActive
                            ]}
                            onPress={() => setActivityLevel('sedentary')}
                          >
                            <Text style={[
                              styles.activityButtonText,
                              activityLevel === 'sedentary' && styles.activityButtonTextActive
                            ]}>Sedentary</Text>
                            <Text style={styles.activityButtonSubtext}>Little/no exercise</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.activityButton,
                              activityLevel === 'light' && styles.activityButtonActive
                            ]}
                            onPress={() => setActivityLevel('light')}
                          >
                            <Text style={[
                              styles.activityButtonText,
                              activityLevel === 'light' && styles.activityButtonTextActive
                            ]}>Light</Text>
                            <Text style={styles.activityButtonSubtext}>1-3 days/week</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.activityButton,
                              activityLevel === 'moderate' && styles.activityButtonActive
                            ]}
                            onPress={() => setActivityLevel('moderate')}
                          >
                            <Text style={[
                              styles.activityButtonText,
                              activityLevel === 'moderate' && styles.activityButtonTextActive
                            ]}>Moderate</Text>
                            <Text style={styles.activityButtonSubtext}>3-5 days/week</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.activityButton,
                              activityLevel === 'active' && styles.activityButtonActive
                            ]}
                            onPress={() => setActivityLevel('active')}
                          >
                            <Text style={[
                              styles.activityButtonText,
                              activityLevel === 'active' && styles.activityButtonTextActive
                            ]}>Active</Text>
                            <Text style={styles.activityButtonSubtext}>6-7 days/week</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.activityButton,
                              activityLevel === 'veryActive' && styles.activityButtonActive
                            ]}
                            onPress={() => setActivityLevel('veryActive')}
                          >
                            <Text style={[
                              styles.activityButtonText,
                              activityLevel === 'veryActive' && styles.activityButtonTextActive
                            ]}>Very Active</Text>
                            <Text style={styles.activityButtonSubtext}>Intense daily</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.calculateButton}
                        onPress={calculateCalories}
                      >
                        <Text style={styles.calculateButtonText}>Calculate My Calories</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.resultsContainer}>
                      <Text style={styles.resultsTitle}>Your Daily Calorie Need</Text>
                      <View style={styles.resultsCalorieBox}>
                        <Text style={styles.resultsCalorieNumber}>{calculatedCalories}</Text>
                        <Text style={styles.resultsCalorieUnit}>calories/day</Text>
                      </View>
                      <Text style={styles.resultsSubtext}>
                        Based on your age ({age}), gender ({gender}), weight ({weight}kg), height ({height}cm), and {activityLevel} activity level
                      </Text>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={resetCalculator}
                      >
                        <Text style={styles.editButtonText}>Edit Details</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* General Guidelines */}
                <View style={styles.calorieSection}>
                  <Text style={styles.calorieSectionTitle}>General Guidelines</Text>
                  
                  <View style={styles.calorieCard}>
                    <Text style={styles.calorieCardTitle}>Men</Text>
                    <View style={styles.calorieRow}>
                      <Text style={styles.calorieLabel}>Sedentary:</Text>
                      <Text style={styles.calorieValue}>2,000-2,400 cal/day</Text>
                    </View>
                    <View style={styles.calorieRow}>
                      <Text style={styles.calorieLabel}>Moderate:</Text>
                      <Text style={styles.calorieValue}>2,400-2,800 cal/day</Text>
                    </View>
                    <View style={styles.calorieRow}>
                      <Text style={styles.calorieLabel}>Active:</Text>
                      <Text style={styles.calorieValue}>2,800-3,200 cal/day</Text>
                    </View>
                  </View>

                  <View style={styles.calorieCard}>
                    <Text style={styles.calorieCardTitle}>Women</Text>
                    <View style={styles.calorieRow}>
                      <Text style={styles.calorieLabel}>Sedentary:</Text>
                      <Text style={styles.calorieValue}>1,600-2,000 cal/day</Text>
                    </View>
                    <View style={styles.calorieRow}>
                      <Text style={styles.calorieLabel}>Moderate:</Text>
                      <Text style={styles.calorieValue}>2,000-2,200 cal/day</Text>
                    </View>
                    <View style={styles.calorieRow}>
                      <Text style={styles.calorieLabel}>Active:</Text>
                      <Text style={styles.calorieValue}>2,200-2,400 cal/day</Text>
                    </View>
                  </View>
                </View>

                {/* Goals */}
                <View style={styles.calorieSection}>
                  <Text style={styles.calorieSectionTitle}>Based on Goals</Text>
                  
                  <View style={styles.goalCard}>
                    <Text style={styles.goalIcon}>⬇️</Text>
                    <Text style={styles.goalTitle}>Weight Loss</Text>
                    <Text style={styles.goalDescription}>
                      Reduce daily intake by 500-750 calories for safe 1-1.5 lbs/week loss
                    </Text>
                  </View>

                  <View style={styles.goalCard}>
                    <Text style={styles.goalIcon}>➡️</Text>
                    <Text style={styles.goalTitle}>Maintenance</Text>
                    <Text style={styles.goalDescription}>
                      Match your calorie intake to your daily energy expenditure
                    </Text>
                  </View>

                  <View style={styles.goalCard}>
                    <Text style={styles.goalIcon}>⬆️</Text>
                    <Text style={styles.goalTitle}>Muscle Gain</Text>
                    <Text style={styles.goalDescription}>
                      Increase daily intake by 300-500 calories with focus on protein
                    </Text>
                  </View>
                </View>

                {/* Macronutrient Breakdown */}
                <View style={styles.calorieSection}>
                  <Text style={styles.calorieSectionTitle}>🥗 Macronutrient Balance</Text>
                  
                  <View style={styles.macroCard}>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroPercentage}>45-65%</Text>
                      <Text style={styles.macroLabel}>Carbohydrates</Text>
                      <Text style={styles.macroDetail}>Primary energy source</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroPercentage}>10-35%</Text>
                      <Text style={styles.macroLabel}>Protein</Text>
                      <Text style={styles.macroDetail}>Muscle repair & growth</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroPercentage}>20-35%</Text>
                      <Text style={styles.macroLabel}>Healthy Fats</Text>
                      <Text style={styles.macroDetail}>Hormone production</Text>
                    </View>
                  </View>
                </View>

                {/* Tips */}
                <View style={styles.meditationTip}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <View style={styles.tipContent}>
                    <Text style={styles.meditationTipText}>
                      <Text style={styles.tipBold}>Pro Tips:{'\n'}</Text>
                      • Track your food intake for accuracy{'\n'}
                      • Eat protein with every meal{'\n'}
                      • Stay hydrated throughout the day{'\n'}
                      • Don't skip meals{'\n'}
                      • Adjust based on your progress
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
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
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 0,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    paddingTop: 16,
    paddingBottom: 8,
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
  calorieContainer: {
    padding: 20,
  },
  calorieIntro: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  calorieSection: {
    marginBottom: 24,
  },
  calorieSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
  },
  calorieCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  calorieCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  calorieLabel: {
    fontSize: 15,
    color: theme.textSecondary,
  },
  calorieValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.primary,
  },
  goalCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  goalIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  macroCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
  },
  macroItem: {
    marginBottom: 16,
    alignItems: 'center',
  },
  macroPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  macroDetail: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  tipContent: {
    flex: 1,
  },
  tipBold: {
    fontWeight: 'bold',
    color: theme.text,
  },
  foodSearchSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 16,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  foodSearchInput: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
  },
  clearSearchButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  clearSearchText: {
    fontSize: 18,
    color: theme.textSecondary,
    fontWeight: 'bold',
  },
  searchResultsContainer: {
    marginTop: 8,
  },
  foodResultCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.secondary,
  },
  foodResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodResultName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  foodResultType: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.secondary,
    textTransform: 'uppercase',
    backgroundColor: theme.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  foodResultCalories: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  calorieNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.primary,
    marginRight: 8,
  },
  calorieUnit: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  foodResultServing: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 15,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  calculatorContainer: {
    marginTop: 16,
  },
  calculatorInput: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  genderContainer: {
    marginBottom: 12,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.border,
  },
  genderButtonActive: {
    backgroundColor: theme.primary + '20',
    borderColor: theme.primary,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  genderButtonTextActive: {
    color: theme.primary,
  },
  activityContainer: {
    marginBottom: 12,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  activityButtons: {
    gap: 8,
  },
  activityButton: {
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.border,
  },
  activityButtonActive: {
    backgroundColor: theme.primary + '20',
    borderColor: theme.primary,
  },
  activityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  activityButtonTextActive: {
    color: theme.primary,
  },
  activityButtonSubtext: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  calculateButton: {
    backgroundColor: theme.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 16,
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.primary,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  resultsCalorieBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsCalorieNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 4,
  },
  resultsCalorieUnit: {
    fontSize: 18,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  resultsSubtext: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: theme.primary + '20',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.primary,
  },
  editButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  healthStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.primary + '10',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.primary,
    borderStyle: 'solid',
  },
  statLabel: {
    fontSize: 12,
    color: theme.primary,
    marginBottom: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 6,
  },
  statCategory: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '600',
  },
  quoteContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quoteCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteText: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
