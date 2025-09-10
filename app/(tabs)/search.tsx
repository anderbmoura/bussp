import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input, Typography, Button } from '@/src/components/ui';
import { BusLineCard } from '@/src/components/business/BusLineCard';
import { colors, spacing } from '@/src/theme';
import { useSearchBusLines, useAuthenticate } from '@/src/hooks/useBusData';
import { debounce } from '@/src/utils/helpers';
import { ProcessedBusLine } from '@/src/types/bus';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const insets = useSafeAreaInsets();
  
  const authenticateMutation = useAuthenticate();
  
  const {
    data: searchResults = [],
    isLoading,
    error,
    refetch,
    isRefetching
  } = useSearchBusLines(debouncedQuery, debouncedQuery.length >= 2);

  // Debounce search query to avoid too many API calls
  const debouncedSetQuery = useCallback(
    debounce((query: string) => {
      setDebouncedQuery(query);
    }, 500),
    [setDebouncedQuery]
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSetQuery(text);
  };

  const handleRetryAuth = async () => {
    try {
      await authenticateMutation.mutateAsync();
      refetch();
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const renderBusLine = ({ item }: { item: ProcessedBusLine }) => (
    <BusLineCard
      busLine={item}
      onPress={() => {
        console.log('Selected line:', item);
        // TODO: Navigate to line details
      }}
      onFavoritePress={() => {
        console.log('Favorite toggled for line:', item.cl);
      }}
    />
  );

  const renderEmptyState = () => {
    if (debouncedQuery.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Typography variant="body1" color={colors.gray[600]} textAlign="center">
            Digite o número da linha ou destino para buscar
          </Typography>
        </View>
      );
    }

    if (debouncedQuery.length < 2) {
      return (
        <View style={styles.emptyState}>
          <Typography variant="body1" color={colors.gray[600]} textAlign="center">
            Digite pelo menos 2 caracteres para buscar
          </Typography>
        </View>
      );
    }

    if (searchResults.length === 0 && !isLoading) {
      return (
        <View style={styles.emptyState}>
          <Typography variant="body1" color={colors.gray[600]} textAlign="center">
            Nenhuma linha encontrada para &quot;{debouncedQuery}&quot;
          </Typography>
          <Typography variant="caption" color={colors.gray[500]} textAlign="center">
            Tente buscar pelo número da linha ou destino
          </Typography>
        </View>
      );
    }

    return null;
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <View style={styles.errorState}>
        <Typography variant="body1" color={colors.error} textAlign="center">
          Erro ao buscar linhas
        </Typography>
        <Typography variant="caption" color={colors.gray[600]} textAlign="center">
          {error.message.includes('authenticate') 
            ? 'Problema de autenticação com a API'
            : 'Verifique sua conexão e tente novamente'
          }
        </Typography>
        <Button
          title={error.message.includes('authenticate') ? 'Tentar Autenticar' : 'Tentar Novamente'}
          onPress={error.message.includes('authenticate') ? handleRetryAuth : () => refetch()}
          loading={authenticateMutation.isPending}
          style={styles.retryButton}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Typography variant="heading2" color={colors.primary[500]}>
          Buscar Linhas
        </Typography>
        <Typography variant="body2" color={colors.gray[600]}>
          Encontre informações sobre linhas de ônibus
        </Typography>
      </View>

      <View style={styles.searchSection}>
        <Input
          placeholder="Ex: 8000, Lapa, Barra Funda..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          leftIcon={
            <Typography variant="body2">🔍</Typography>
          }
          rightIcon={
            isLoading ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : null
          }
        />
      </View>

      <View style={styles.results}>
        {error ? (
          renderError()
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderBusLine}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => {
                  if (debouncedQuery.length >= 2) {
                    refetch();
                  }
                }}
                colors={[colors.primary[500]]}
                tintColor={colors.primary[500]}
              />
            }
            contentContainerStyle={styles.listContent}
          />
        )}
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
  
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  
  results: {
    flex: 1,
  },
  
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  
  errorState: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  
  retryButton: {
    marginTop: spacing.md,
  },
});