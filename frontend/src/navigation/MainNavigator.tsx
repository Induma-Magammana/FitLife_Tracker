import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { FavouritesScreen } from '../screens/FavouritesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { lightTheme } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Exercise Details' }}
      />
    </Stack.Navigator>
  );
};

const FavouritesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavouritesMain"
        component={FavouritesScreen}
        options={{ title: 'Favourites' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Exercise Details' }}
      />
    </Stack.Navigator>
  );
};

export const MainNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: lightTheme.primary,
        tabBarInactiveTintColor: lightTheme.textSecondary,
        tabBarStyle: {
          backgroundColor: lightTheme.cardBackground,
          borderTopColor: lightTheme.border,
          paddingBottom: insets.bottom + 5,
          paddingTop: 8,
          height: 60 + insets.bottom,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesStack}
        options={{
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ color }) => <TabIcon icon="❤️" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
          headerShown: true,
          title: 'Profile',
          headerStyle: {
            backgroundColor: lightTheme.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Tab.Navigator>
  );
};

const TabIcon = ({ icon }: { icon: string; color: string }) => {
  return <Text style={{ fontSize: 24 }}>{icon}</Text>;
};
