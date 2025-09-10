import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing } from '../../../theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onRightIconPress?: () => void;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  variant = 'outlined',
  size = 'medium',
  disabled = false,
  onRightIconPress,
  style,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = {
    ...styles.container,
    ...styles[`container_${variant}`],
    ...styles[`container_${size}`],
    ...(isFocused && styles.containerFocused),
    ...(error && styles.containerError),
    ...(disabled && styles.containerDisabled),
  };

  const inputStyle = {
    ...styles.input,
    ...styles[`input_${size}`],
    ...(disabled && styles.inputDisabled),
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}
      
      <View style={containerStyle}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={[inputStyle, style]}
          placeholderTextColor={colors.gray[400]}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  
  labelError: {
    color: colors.error,
  },
  
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  
  // Variants
  container_default: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  
  container_filled: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.md,
  },
  
  container_outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray[300],
    paddingHorizontal: spacing.md,
  },
  
  // Sizes
  container_small: {
    minHeight: 36,
  },
  
  container_medium: {
    minHeight: 44,
  },
  
  container_large: {
    minHeight: 52,
  },
  
  // States
  containerFocused: {
    borderColor: colors.primary[500],
  },
  
  containerError: {
    borderColor: colors.error,
  },
  
  containerDisabled: {
    backgroundColor: colors.gray[100],
    opacity: 0.6,
  },
  
  input: {
    flex: 1,
    fontSize: typography.body1.fontSize,
    color: colors.gray[900],
    padding: 0,
  },
  
  input_small: {
    fontSize: typography.body2.fontSize,
  },
  
  input_medium: {
    fontSize: typography.body1.fontSize,
  },
  
  input_large: {
    fontSize: typography.heading4.fontSize,
  },
  
  inputDisabled: {
    color: colors.gray[500],
  },
  
  iconContainer: {
    paddingHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  helperText: {
    fontSize: typography.caption.fontSize,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  
  errorText: {
    color: colors.error,
  },
});