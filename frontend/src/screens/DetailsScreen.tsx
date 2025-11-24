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
import { lightTheme } from '../constants/theme';
import { Exercise } from '../store/slices/exercisesSlice';

export const DetailsScreen = ({ route, navigation }: any) => {
  const { exercise } = route.params as { exercise: Exercise };
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites.favourites);
  
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
          {isFavourite ? '❤️ Remove from Favourites' : '🤍 Add to Favourites'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: lightTheme.surface,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: lightTheme.primary,
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
    color: lightTheme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: lightTheme.textSecondary,
    textTransform: 'capitalize',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: lightTheme.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: lightTheme.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: lightTheme.text,
    textTransform: 'capitalize',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: lightTheme.text,
  },
  tipContainer: {
    backgroundColor: lightTheme.surface,
    padding: 16,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
    color: lightTheme.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  favouriteButton: {
    backgroundColor: lightTheme.primary,
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  favouriteButtonActive: {
    backgroundColor: lightTheme.error,
  },
  favouriteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
