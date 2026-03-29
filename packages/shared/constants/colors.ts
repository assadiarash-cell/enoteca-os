// ==============================================
// ENOTECA OS — "Cantina Oscura" Design System Colors
// ==============================================

export const colors = {
  bg: {
    primary: '#07070D',
    secondary: '#0D0D15',
    tertiary: '#14141F',
    quaternary: '#1C1C2A',
    glass: 'rgba(13,13,21,0.72)',
  },
  accent: {
    primary: '#C9843A',
    secondary: '#D4A05A',
    wine: '#8B1A32',
    wineLight: '#B83250',
  },
  semantic: {
    success: '#22C68A',
    warning: '#E5A832',
    danger: '#DC4545',
    info: '#3B7FD9',
  },
  text: {
    primary: '#EEECE7',
    secondary: '#A09E96',
    tertiary: '#6B6963',
    disabled: '#3D3B37',
  },
  border: {
    subtle: 'rgba(255,255,255,0.06)',
    medium: 'rgba(255,255,255,0.12)',
    strong: 'rgba(255,255,255,0.20)',
  },
} as const;

// Semantic color mappings for status badges
export const statusColors = {
  success: { bg: 'rgba(34,198,138,0.12)', text: colors.semantic.success },
  warning: { bg: 'rgba(229,168,50,0.12)', text: colors.semantic.warning },
  danger: { bg: 'rgba(220,69,69,0.12)', text: colors.semantic.danger },
  info: { bg: 'rgba(59,127,217,0.12)', text: colors.semantic.info },
  neutral: { bg: 'rgba(255,255,255,0.06)', text: colors.text.secondary },
  premium: { bg: 'rgba(201,132,58,0.12)', text: colors.accent.primary },
} as const;

// Agent domain colors
export const agentDomainColors = {
  acquisition: colors.accent.primary,
  inventory: colors.semantic.info,
  sales: colors.semantic.success,
  content: colors.accent.secondary,
  intelligence: '#9B7FE8',
  operations: colors.text.secondary,
} as const;
