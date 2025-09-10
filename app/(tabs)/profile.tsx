import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Typography } from '@/src/components/ui';
import { colors, spacing } from '@/src/theme';
import { useFavoritesStore } from '@/src/stores/favoritesStore';
import { useSearchHistoryStore } from '@/src/stores/searchHistoryStore';
import { cacheManager } from '@/src/services/cache/cacheManager';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, clearAllFavorites } = useFavoritesStore();
  const { history, clearHistory } = useSearchHistoryStore();

  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Isso irá remover todos os dados em cache. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await cacheManager.clear();
            Alert.alert('Sucesso', 'Cache limpo com sucesso!');
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Isso irá remover todos os favoritos, histórico e cache. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: async () => {
            clearAllFavorites();
            clearHistory();
            await cacheManager.clear();
            Alert.alert('Sucesso', 'Todos os dados foram removidos!');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Typography variant="heading2" color={colors.primary[500]}>
          Configurações
        </Typography>
        <Typography variant="body2" color={colors.gray[600]}>
          Gerencie seus dados e preferências
        </Typography>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <Card variant="outlined" style={styles.section}>
          <Typography variant="heading3" style={styles.sectionTitle}>
            📱 Sobre o App
          </Typography>
          <View style={styles.infoRow}>
            <Typography variant="body2" color={colors.gray[600]}>
              Versão
            </Typography>
            <Typography variant="body2">
              1.0.0
            </Typography>
          </View>
          <View style={styles.infoRow}>
            <Typography variant="body2" color={colors.gray[600]}>
              Desenvolvido para
            </Typography>
            <Typography variant="body2">
              SPTrans São Paulo
            </Typography>
          </View>
        </Card>

        {/* User Data */}
        <Card variant="outlined" style={styles.section}>
          <Typography variant="heading3" style={styles.sectionTitle}>
            📊 Seus Dados
          </Typography>
          <View style={styles.infoRow}>
            <Typography variant="body2" color={colors.gray[600]}>
              Favoritos salvos
            </Typography>
            <Typography variant="body2" color={colors.primary[500]}>
              {favorites.length}
            </Typography>
          </View>
          <View style={styles.infoRow}>
            <Typography variant="body2" color={colors.gray[600]}>
              Histórico de buscas
            </Typography>
            <Typography variant="body2" color={colors.primary[500]}>
              {history.length}
            </Typography>
          </View>
        </Card>

        {/* Data Management */}
        <Card variant="outlined" style={styles.section}>
          <Typography variant="heading3" style={styles.sectionTitle}>
            🔧 Gerenciar Dados
          </Typography>
          
          <View style={styles.actionButtons}>
            <Button
              title="Limpar Cache"
              variant="outline"
              onPress={handleClearCache}
              fullWidth
            />
            
            <Button
              title="Limpar Histórico"
              variant="outline"
              onPress={() => {
                Alert.alert(
                  'Limpar Histórico',
                  'Remover todo o histórico de buscas?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Limpar', onPress: clearHistory },
                  ]
                );
              }}
              fullWidth
            />
            
            <Button
              title="Limpar Todos os Dados"
              variant="outline"
              onPress={handleClearAllData}
              fullWidth
              style={styles.dangerButton}
            />
          </View>
        </Card>

        {/* Features Info */}
        <Card variant="outlined" style={styles.section}>
          <Typography variant="heading3" style={styles.sectionTitle}>
            ✨ Recursos
          </Typography>
          <View style={styles.featureList}>
            <Typography variant="body2" color={colors.gray[700]}>
              • Busca em tempo real via API SPTrans
            </Typography>
            <Typography variant="body2" color={colors.gray[700]}>
              • Sistema de favoritos com armazenamento local
            </Typography>
            <Typography variant="body2" color={colors.gray[700]}>
              • Localização GPS para pontos próximos
            </Typography>
            <Typography variant="body2" color={colors.gray[700]}>
              • Cache inteligente para melhor performance
            </Typography>
            <Typography variant="body2" color={colors.gray[700]}>
              • Histórico de buscas com sugestões
            </Typography>
          </View>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Typography variant="caption" color={colors.gray[500]} textAlign="center">
            BusSP - Transporte Público de São Paulo
          </Typography>
          <Typography variant="caption" color={colors.gray[500]} textAlign="center">
            Dados fornecidos pela SPTrans Olho Vivo
          </Typography>
        </View>
      </ScrollView>
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
  
  section: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  
  sectionTitle: {
    marginBottom: spacing.md,
    color: colors.gray[800],
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  actionButtons: {
    gap: spacing.md,
  },
  
  dangerButton: {
    borderColor: colors.error,
  },
  
  featureList: {
    gap: spacing.xs,
  },
  
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
});