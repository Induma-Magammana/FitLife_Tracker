import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setFavourites } from '../store/slices/favouritesSlice';
import { StorageService } from '../services/storageService';
import { lightTheme } from '../constants/theme';
import { Exercise } from '../store/slices/exercisesSlice';

export const FavouritesScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites.favourites);

  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    try {
      const savedFavourites = await StorageService.getFavourites();
      dispatch(setFavourites(savedFavourites));
    } catch (error) {
      console.error('Error loading favourites:', error);
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
        <Text style={styles.heartIcon}>❤️</Text>
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

  if (favourites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💔</Text>
        <Text style={styles.emptyTitle}>No Favourites Yet</Text>
        <Text style={styles.emptyText}>
          Start adding exercises to your favourites to see them here!
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.browseButtonText}>Browse Exercises</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favourites</Text>
        <Text style={styles.headerSubtitle}>
          {favourites.length} {favourites.length === 1 ? 'exercise' : 'exercises'}
        </Text>
      </View>
      <FlatList
        data={favourites}
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
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
    alignItems: 'center',
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
  heartIcon: {
    fontSize: 24,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: lightTheme.background,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: lightTheme.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: lightTheme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
