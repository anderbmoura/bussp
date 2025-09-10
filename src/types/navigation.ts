import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  '(tabs)': NavigatorScreenParams<TabParamList>;
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  BusDetail: { lineCode: number };
  RouteDetail: { lineCode: number; direction: 'outbound' | 'return' };
  StopDetail: { stopCode: number };
  SearchResults: { query: string };
  '+not-found': undefined;
};

export type TabParamList = {
  index: undefined;
  search: undefined;
  map: undefined;
  favorites: undefined;
  profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  BiometricSetup: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  SearchResults: { query: string };
  History: undefined;
  NearbyStops: undefined;
};

export type MapStackParamList = {
  Map: undefined;
  BusDetail: { lineCode: number };
  RouteDetail: { lineCode: number; direction: 'outbound' | 'return' };
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  ManageFavorites: undefined;
  FavoriteDetail: { favoriteId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  ThemeSettings: undefined;
  NotificationSettings: undefined;
  About: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}