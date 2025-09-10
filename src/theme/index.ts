export { colors, type Colors } from './colors';
export { typography, type Typography } from './typography';
export { spacing, type Spacing } from './spacing';
export { animations, type Animations } from './animations';

export const theme = {
  colors,
  typography,
  spacing,
  animations
};

export type Theme = typeof theme;