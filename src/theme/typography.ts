export const typography = {
  heading1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40
  },
  heading2: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36
  },
  heading3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32
  },
  heading4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 18
  }
};

export type Typography = typeof typography;