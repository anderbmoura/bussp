import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, spacing } from '../../../theme';

export interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'flat' | 'elevated' | 'outlined';
  padding?: keyof typeof spacing;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  onPress,
  style,
  ...props
}) => {
  const cardStyle: ViewStyle = {
    ...styles.base,
    ...styles[variant],
    padding: spacing[padding],
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    backgroundColor: colors.background.light,
  },
  
  flat: {
    backgroundColor: 'transparent',
  },
  
  elevated: {
    shadowColor: colors.gray[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  outlined: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.background.light,
  },
});