import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setExercises, setLoading, setError } from '../store/slices/exercisesSlice';
import { apiService } from '../services/apiService';
import { lightTheme } from '../constants/theme';
import { Exercise } from '../store/slices/exercisesSlice';

export const HomeScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { exercises, loading, error } = useAppSelector((state) => state.exercises);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    loadExercises();
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

  if (loading && exercises.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.firstName || 'User'}!</Text>
        <Text style={styles.headerSubtitle}>Ready for your workout?</Text>
      </View>
      <FlatList
        data={exercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: lightTheme.textSecondary,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: lightTheme.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: lightTheme.shadowColor,
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
    backgroundColor: lightTheme.surface,
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
    color: lightTheme.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: lightTheme.textSecondary,
    textTransform: 'capitalize',
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
  difficultyBadge: {
    backgroundColor: lightTheme.accent,
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
    color: lightTheme.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: lightTheme.error,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
