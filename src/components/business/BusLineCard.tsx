import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Typography } from '../ui';
import { colors, spacing } from '../../theme';
import { ProcessedBusLine } from '../../types/bus';
import { useFavoritesStore } from '../../stores/favoritesStore';

interface BusLineCardProps {
  busLine: ProcessedBusLine;
  onPress?: () => void;
  onFavoritePress?: () => void;
  showFavoriteButton?: boolean;
}

export const BusLineCard: React.FC<BusLineCardProps> = ({
  busLine,
  onPress,
  onFavoritePress,
  showFavoriteButton = true,
}) => {
  const { isFavorite, addFavorite, removeFavorite, getFavoriteByLineCode } = useFavoritesStore();
  const isLineFavorite = isFavorite(busLine.cl);

  const handleFavoriteToggle = () => {
    if (isLineFavorite) {
      const favorite = getFavoriteByLineCode(busLine.cl);
      if (favorite) {
        removeFavorite(favorite.id);
      }
    } else {
      addFavorite(busLine.cl, busLine.name);
    }
    
    onFavoritePress?.();
  };

  return (
    <Card
      variant="outlined"
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.lineInfo}>
          <Typography variant="heading4" color={colors.primary[500]}>
            {busLine.cl}
          </Typography>
          <View style={styles.badges}>
            {busLine.isCircular && (
              <View style={styles.badge}>
                <Typography variant="caption" color={colors.secondary[500]}>
                  Circular
                </Typography>
              </View>
            )}
          </View>
        </View>
        
        {showFavoriteButton && (
          <TouchableOpacity
            onPress={handleFavoriteToggle}
            style={styles.favoriteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Typography variant="body1">
              {isLineFavorite ? '⭐' : '☆'}
            </Typography>
          </TouchableOpacity>
        )}
      </View>
      
      <Typography variant="body1" style={styles.description}>
        {busLine.description}
      </Typography>
      
      <View style={styles.footer}>
        <Typography variant="caption" color={colors.gray[600]}>
          Terminal: {busLine.ts}
        </Typography>
        <Typography variant="caption" color={colors.gray[500]}>
          Tipo: {busLine.type}
        </Typography>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  
  lineInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  
  badge: {
    backgroundColor: colors.secondary[50],
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  favoriteButton: {
    padding: spacing.xs,
  },
  
  description: {
    marginBottom: spacing.sm,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});