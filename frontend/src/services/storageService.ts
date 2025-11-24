import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  FAVOURITES: '@favourites',
  THEME: '@theme',
};

export const StorageService = {
  // Auth
  async saveAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async saveUserData(userData: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  },

  async getUserData(): Promise<any> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  // Favourites
  async saveFavourites(favourites: any[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favourites));
  },

  async getFavourites(): Promise<any[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVOURITES);
    return data ? JSON.parse(data) : [];
  },

  // Theme
  async saveTheme(theme: 'light' | 'dark'): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  async getTheme(): Promise<'light' | 'dark' | null> {
    return (await AsyncStorage.getItem(STORAGE_KEYS.THEME)) as 'light' | 'dark' | null;
  },

  // Clear all
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  },
};
