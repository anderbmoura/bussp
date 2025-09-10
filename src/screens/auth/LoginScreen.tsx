import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Button, Input, Typography } from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuthStore } from '../../stores/authStore';
import { validateEmail, validatePassword } from '../../utils/validators';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, clearError } = useAuthStore();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError('');
    clearError();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError('');
    clearError();
  };

  const handleLogin = async () => {
    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      return;
    }

    try {
      await login({ email, password });
      // Navigation will be handled by the auth state change
      router.replace('/(tabs)');
    } catch {
      // Error is handled by the store
    }
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography variant="heading1" color={colors.primary[500]}>
            BusSP
          </Typography>
          <Typography variant="body1" color={colors.gray[600]} textAlign="center">
            Entre na sua conta para acessar suas linhas favoritas e histórico
          </Typography>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={handleEmailChange}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={handlePasswordChange}
            error={passwordError}
            secureTextEntry={!showPassword}
            rightIcon={
              <Typography variant="body2" color={colors.primary[500]}>
                {showPassword ? '🙈' : '👁️'}
              </Typography>
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          {error && (
            <Typography variant="body2" color={colors.error} textAlign="center">
              {error}
            </Typography>
          )}

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Typography variant="body2" color={colors.gray[600]} textAlign="center">
            Não tem uma conta?
          </Typography>
          <Button
            title="Criar conta"
            variant="text"
            onPress={navigateToRegister}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  form: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },

  loginButton: {
    marginTop: spacing.md,
  },

  footer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
});