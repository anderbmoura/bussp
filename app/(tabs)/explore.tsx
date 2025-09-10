import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Typography } from '@/src/components/ui';
import { colors, spacing } from '@/src/theme';
import { useLocation } from '@/src/hooks/useLocation';
import { useNearbyStops } from '@/src/hooks/useBusData';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [showNearbyStops, setShowNearbyStops] = useState(false);

  const {
    location,
    isLoading: locationLoading,
    error: locationError,
    hasPermission,
    requestPermission,
    getCurrentLocation,
  } = useLocation();

  const {
    data: nearbyStops = [],
    isLoading: stopsLoading,
    error: stopsError,
  } = useNearbyStops(
    location?.latitude || 0,
    location?.longitude || 0,
    showNearbyStops && !!location
  );

  useEffect(() => {
    if (hasPermission) {
      getCurrentLocation();
    }
  }, [hasPermission, getCurrentLocation]);

  const handleLocationRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      getCurrentLocation();
    } else {
      Alert.alert(
        'Permissão Negada',
        'Para encontrar pontos próximos, é necessário permitir o acesso à localização.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleFindNearbyStops = () => {
    if (!location) {
      handleLocationRequest();
      return;
    }
    setShowNearbyStops(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Typography variant="heading2" color={colors.primary[500]}>
          Mapa e Pontos
        </Typography>
        <Typography variant="body2" color={colors.gray[600]}>
          Encontre pontos de ônibus próximos a você
        </Typography>
      </View>

      <View style={styles.content}>
        {/* Location Status Card */}
        <Card variant="outlined" style={styles.statusCard}>
          <Typography variant="heading4" style={styles.cardTitle}>
            📍 Sua Localização
          </Typography>
          
          {locationLoading ? (
            <Typography variant="body2" color={colors.gray[600]}>
              Obtendo localização...
            </Typography>
          ) : location ? (
            <View>
              <Typography variant="body2" color={colors.success}>
                ✅ Localização obtida
              </Typography>
              <Typography variant="caption" color={colors.gray[600]}>
                Lat: {location.latitude.toFixed(6)}
              </Typography>
              <Typography variant="caption" color={colors.gray[600]}>
                Lng: {location.longitude.toFixed(6)}
              </Typography>
            </View>
          ) : locationError ? (
            <View>
              <Typography variant="body2" color={colors.error}>
                ❌ Erro ao obter localização
              </Typography>
              <Typography variant="caption" color={colors.gray[600]}>
                {locationError}
              </Typography>
            </View>
          ) : !hasPermission ? (
            <Typography variant="body2" color={colors.warning}>
              ⚠️ Permissão de localização necessária
            </Typography>
          ) : (
            <Typography variant="body2" color={colors.gray[600]}>
              Localização não disponível
            </Typography>
          )}
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          {!hasPermission ? (
            <Button
              title="Permitir Localização"
              onPress={handleLocationRequest}
              loading={locationLoading}
              fullWidth
            />
          ) : (
            <View style={styles.buttonGroup}>
              <Button
                title="Atualizar Localização"
                onPress={getCurrentLocation}
                loading={locationLoading}
                variant="outline"
                style={styles.halfButton}
              />
              <Button
                title="Pontos Próximos"
                onPress={handleFindNearbyStops}
                loading={stopsLoading}
                disabled={!location}
                style={styles.halfButton}
              />
            </View>
          )}
        </View>

        {/* Nearby Stops */}
        {showNearbyStops && (
          <View style={styles.nearbyStops}>
            <Typography variant="heading3" style={styles.sectionTitle}>
              🚏 Pontos Próximos
            </Typography>
            
            {stopsLoading ? (
              <Card variant="outlined" padding="lg">
                <Typography variant="body2" color={colors.gray[600]} textAlign="center">
                  Buscando pontos próximos...
                </Typography>
              </Card>
            ) : stopsError ? (
              <Card variant="outlined" padding="lg">
                <Typography variant="body2" color={colors.error} textAlign="center">
                  Erro ao buscar pontos próximos
                </Typography>
                <Typography variant="caption" color={colors.gray[600]} textAlign="center">
                  Verifique sua conexão e tente novamente
                </Typography>
              </Card>
            ) : nearbyStops.length > 0 ? (
              nearbyStops.slice(0, 5).map((stop, index) => (
                <Card key={stop.id} variant="outlined" style={styles.stopCard}>
                  <Typography variant="body1">{stop.name}</Typography>
                  <Typography variant="caption" color={colors.gray[600]}>
                    {stop.address}
                  </Typography>
                  {stop.distance && (
                    <Typography variant="caption" color={colors.primary[500]}>
                      📍 {Math.round(stop.distance)}m de distância
                    </Typography>
                  )}
                </Card>
              ))
            ) : (
              <Card variant="outlined" padding="lg">
                <Typography variant="body2" color={colors.gray[600]} textAlign="center">
                  Nenhum ponto encontrado nas proximidades
                </Typography>
              </Card>
            )}
          </View>
        )}

        {/* Future Map Placeholder */}
        <Card variant="outlined" style={styles.mapPlaceholder}>
          <Typography variant="body1" color={colors.gray[600]} textAlign="center">
            🗺️ Mapa Interativo
          </Typography>
          <Typography variant="caption" color={colors.gray[500]} textAlign="center">
            Em breve: mapa com localização em tempo real dos ônibus
          </Typography>
        </Card>
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
    padding: spacing.lg,
    gap: spacing.lg,
  },
  
  statusCard: {
    padding: spacing.md,
  },
  
  cardTitle: {
    marginBottom: spacing.sm,
  },
  
  actions: {
    gap: spacing.md,
  },
  
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  halfButton: {
    flex: 1,
  },
  
  nearbyStops: {
    gap: spacing.md,
  },
  
  sectionTitle: {
    color: colors.gray[800],
  },
  
  stopCard: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  
  mapPlaceholder: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    minHeight: 200,
    justifyContent: 'center',
  },
});
