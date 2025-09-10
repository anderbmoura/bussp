import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, typography, spacing } from '../../../theme';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  ...props
}) => {
  const buttonStyle: ViewStyle = {
    ...styles.base,
    ...styles[variant],
    ...styles[`size_${size}`],
    ...(fullWidth && styles.fullWidth),
    ...(disabled && styles.disabled),
  };

  const textStyle: TextStyle = {
    ...styles.textBase,
    ...styles[`text_${variant}`],
    ...styles[`text_${size}`],
    ...(disabled && styles.textDisabled),
  };

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {leftIcon && !loading && leftIcon}
      {loading ? (
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'small'}
          color={variant === 'primary' ? colors.gray[50] : colors.primary[500]}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
      {rightIcon && !loading && rightIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: spacing.sm,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.secondary[500],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  text: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  size_small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 32,
  },
  size_medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  size_large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
  text_primary: {
    color: colors.gray[50],
  },
  text_secondary: {
    color: colors.gray[50],
  },
  text_outline: {
    color: colors.primary[500],
  },
  text_text: {
    color: colors.primary[500],
  },
  text_small: {
    fontSize: typography.body2.fontSize,
  },
  text_medium: {
    fontSize: typography.button.fontSize,
  },
  text_large: {
    fontSize: typography.body1.fontSize,
  },
  textDisabled: {
    opacity: 0.7,
  },
});