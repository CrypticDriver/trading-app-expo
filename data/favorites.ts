import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'trading_app_favorites';

export async function getFavorites(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function toggleFavorite(symbol: string): Promise<boolean> {
  const favorites = await getFavorites();
  const index = favorites.indexOf(symbol);
  if (index === -1) {
    favorites.push(symbol);
  } else {
    favorites.splice(index, 1);
  }
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return index === -1; // Returns true if now favorited
}

export async function isFavorite(symbol: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(symbol);
}
