import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Typography } from '@/src/components/ui';
import { colors, spacing } from '@/src/theme';
import { useFavoritesStore } from '@/src/stores/favoritesStore';
import { FavoriteLine } from '@/src/types/bus';
import { formatRelativeTime } from '@/src/utils/formatters';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, removeFavorite, toggleNotifications, clearAllFavorites } = useFavoritesStore();

  const handleRemoveFavorite = (favorite: FavoriteLine) => {
    Alert.alert(
      'Remover Favorito',
      `Deseja remover a linha ${favorite.lineCode} dos favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => removeFavorite(favorite.id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (favorites.length === 0) return;
    
    Alert.alert(
      'Limpar Favoritos',
      'Deseja remover todos os favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: clearAllFavorites,
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteLine }) => (
    <Card variant="outlined" style={styles.favoriteCard}>
      <View style={styles.favoriteHeader}>
        <View style={styles.favoriteInfo}>
          <Typography variant="heading4" color={colors.primary[500]}>
            {item.lineCode}
          </Typography>
          <Typography variant="body1">{item.lineName}</Typography>
          {item.nickname && (
            <Typography variant="caption" color={colors.secondary[500]}>
              &quot;{item.nickname}&quot;
            </Typography>
          )}
        </View>
        
        <TouchableOpacity
          onPress={() => handleRemoveFavorite(item)}
          style={styles.removeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Typography variant="body1" color={colors.error}>
            🗑️
          </Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.favoriteFooter}>
        <Typography variant="caption" color={colors.gray[600]}>
          Adicionado {formatRelativeTime(item.addedAt)}
        </Typography>
        
        <TouchableOpacity
          onPress={() => toggleNotifications(item.id)}
          style={styles.notificationToggle}
        >
          <Typography variant="caption" color={item.notifications ? colors.primary[500] : colors.gray[500]}>
            {item.notifications ? '🔔 Ativo' : '🔕 Inativo'}
          </Typography>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Typography variant="heading3" color={colors.gray[600]} textAlign="center">
        ⭐ Nenhum Favorito
      </Typography>
      <Typography variant="body1" color={colors.gray[600]} textAlign="center">
        Adicione linhas aos favoritos para acessá-las rapidamente
      </Typography>
      <Typography variant="caption" color={colors.gray[500]} textAlign="center">
        Toque na estrela ao lado de qualquer linha para favoritar
      </Typography>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Typography variant="heading2" color={colors.primary[500]}>
          Favoritos
        </Typography>
        <Typography variant="body2" color={colors.gray[600]}>
          Suas linhas salvas para acesso rápido
        </Typography>
      </View>

      <View style={styles.content}>
        {favorites.length > 0 && (
          <View style={styles.actions}>
            <Button
              title="Limpar Todos"
              variant="outline"
              onPress={handleClearAll}
              style={styles.clearButton}
            />
            <Typography variant="caption" color={colors.gray[600]}>
              {favorites.length} {favorites.length === 1 ? 'favorito' : 'favoritos'}
            </Typography>
          </View>
        )}

        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  
  header: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  clearButton: {
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  
  listContent: {
    paddingBottom: spacing.lg,
  },
  
  favoriteCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  
  favoriteInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  
  removeButton: {
    padding: spacing.xs,
  },
  
  favoriteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  notificationToggle: {
    padding: spacing.xs,
  },
  
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
});