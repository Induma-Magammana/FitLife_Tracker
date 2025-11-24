import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addFavourite, removeFavourite } from '../store/slices/favouritesSlice';
import { StorageService } from '../services/storageService';
import { useTheme } from '../contexts/ThemeContext';
import { Exercise } from '../store/slices/exercisesSlice';

export const DetailsScreen = ({ route, navigation }: any) => {
  const { exercise } = route.params as { exercise: Exercise };
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites.favourites);
  const { theme } = useTheme();
  
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const isFav = favourites.some((fav) => fav.name === exercise.name);
    setIsFavourite(isFav);
  }, [favourites, exercise]);

  const handleToggleFavourite = async () => {
    if (isFavourite) {
      dispatch(removeFavourite(exercise.name));
      const updatedFavourites = favourites.filter((fav) => fav.name !== exercise.name);
      await StorageService.saveFavourites(updatedFavourites);
    } else {
      dispatch(addFavourite(exercise));
      const updatedFavourites = [...favourites, exercise];
      await StorageService.saveFavourites(updatedFavourites);
    }
  };

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>💪</Text>
        </View>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.subtitle}>{exercise.type}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Muscle Group:</Text>
          <Text style={styles.detailValue}>{exercise.muscle}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Equipment:</Text>
          <Text style={styles.detailValue}>{exercise.equipment}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Difficulty:</Text>
          <Text style={styles.detailValue}>{exercise.difficulty}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>{exercise.instructions}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tips</Text>
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>• Always warm up before starting</Text>
          <Text style={styles.tipText}>• Focus on proper form over speed</Text>
          <Text style={styles.tipText}>• Stay hydrated throughout your workout</Text>
          <Text style={styles.tipText}>• Listen to your body and rest when needed</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.favouriteButton, isFavourite && styles.favouriteButtonActive]}
        onPress={handleToggleFavourite}
      >
        <Text style={styles.favouriteButtonText}>
          {isFavourite ? 'Remove from Workouts' : 'Add to Workouts'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.surface,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textTransform: 'capitalize',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    textTransform: 'capitalize',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
  },
  tipContainer: {
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  favouriteButton: {
    backgroundColor: theme.primary,
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  favouriteButtonActive: {
    backgroundColor: theme.error,
  },
  favouriteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
