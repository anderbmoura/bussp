import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';
import { colors, typography } from '../../../theme';

export interface TypographyProps extends TextProps {
  variant?: keyof typeof typography;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = colors.text.primary.light,
  textAlign = 'left',
  style,
  children,
  ...props
}) => {
  const textStyle: TextStyle = {
    ...styles.base,
    ...typography[variant],
    color,
    textAlign,
  };

  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});