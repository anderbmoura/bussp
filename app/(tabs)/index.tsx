import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Button, Input, Card, Typography } from '@/src/components/ui';
import { colors, spacing } from '@/src/theme';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push('/(tabs)/search');
    } else {
      router.push('/(tabs)/search');
    }
  };

  const recentSearches = [
    '8000-10 - Lapa - Barra Funda',
    '9500-21 - Terminal Bandeira',
    '177H-10 - Hospital das Clínicas'
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Typography variant="heading1" color={colors.primary[500]}>
          BusSP
        </Typography>
        <Typography variant="body2" color={colors.gray[600]}>
          Encontre seu ônibus em tempo real
        </Typography>
      </View>

      <View style={styles.searchSection}>
        <Input
          placeholder="Digite o número da linha ou destino"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          rightIcon={
            <Typography variant="body2" color={colors.primary[500]}>
              🔍
            </Typography>
          }
          onRightIconPress={handleSearch}
        />
        
        <Button
          title="Buscar Linha"
          onPress={handleSearch}
          fullWidth
          style={styles.searchButton}
        />
      </View>

      <View style={styles.quickActions}>
        <Typography variant="heading3" style={styles.sectionTitle}>
          Acesso Rápido
        </Typography>
        
        <View style={styles.actionGrid}>
          <Card variant="elevated" onPress={() => console.log('Nearby stops')} style={styles.actionCard}>
            <Typography variant="body1" color={colors.primary[500]}>
              📍 Pontos Próximos
            </Typography>
            <Typography variant="caption" color={colors.gray[600]}>
              Encontre paradas perto de você
            </Typography>
          </Card>
          
          <Card variant="elevated" onPress={() => console.log('Favorites')} style={styles.actionCard}>
            <Typography variant="body1" color={colors.secondary[500]}>
              ⭐ Favoritos
            </Typography>
            <Typography variant="caption" color={colors.gray[600]}>
              Suas linhas salvas
            </Typography>
          </Card>
        </View>
      </View>

      {recentSearches.length > 0 && (
        <View style={styles.recentSection}>
          <Typography variant="heading3" style={styles.sectionTitle}>
            Buscas Recentes
          </Typography>
          
          {recentSearches.map((search, index) => (
            <Card
              key={index}
              variant="outlined"
              onPress={() => setSearchQuery(search)}
              style={styles.recentItem}
            >
              <Typography variant="body1">
                {search}
              </Typography>
              <Typography variant="caption" color={colors.gray[500]}>
                Toque para buscar novamente
              </Typography>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  
  searchSection: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  
  searchButton: {
    marginTop: spacing.sm,
  },
  
  quickActions: {
    padding: spacing.lg,
  },
  
  sectionTitle: {
    marginBottom: spacing.md,
    color: colors.gray[800],
  },
  
  actionGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  actionCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  recentSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  
  recentItem: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
});
