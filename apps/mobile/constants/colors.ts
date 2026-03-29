/**
 * Cantina Oscura — ENOTECA OS Design System
 * Dark luxury palette for collectible bottle dealers.
 */

export const Colors = {
  // ── Backgrounds ──────────────────────────────────────
  bg: {
    primary: '#0A0A0C',
    secondary: '#111114',
    tertiary: '#18181C',
    elevated: '#1E1E24',
    card: '#1A1A20',
    input: '#14141A',
  },

  // ── Surfaces (glass / blur layers) ───────────────────
  surface: {
    glass: 'rgba(255, 255, 255, 0.04)',
    glassHover: 'rgba(255, 255, 255, 0.07)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    overlay: 'rgba(10, 10, 12, 0.85)',
    scrim: 'rgba(10, 10, 12, 0.6)',
  },

  // ── Text ─────────────────────────────────────────────
  text: {
    primary: '#F5F0EB',
    secondary: '#9B978F',
    tertiary: '#6B675F',
    disabled: '#4A4740',
    inverse: '#0A0A0C',
  },

  // ── Accent — Copper / Gold ───────────────────────────
  accent: {
    copper: '#C2703E',
    copperLight: '#D4945F',
    copperDark: '#9A562F',
    copperMuted: 'rgba(194, 112, 62, 0.15)',
    gold: '#C9A84C',
    goldLight: '#DBBF6E',
    goldMuted: 'rgba(201, 168, 76, 0.15)',
  },

  // ── Semantic ─────────────────────────────────────────
  semantic: {
    success: '#3D9970',
    successLight: '#4DB382',
    successMuted: 'rgba(61, 153, 112, 0.15)',
    warning: '#D4A843',
    warningLight: '#E0BD60',
    warningMuted: 'rgba(212, 168, 67, 0.15)',
    danger: '#C0392B',
    dangerLight: '#D94F42',
    dangerMuted: 'rgba(192, 57, 43, 0.15)',
    info: '#5B8DBE',
    infoLight: '#74A5D0',
    infoMuted: 'rgba(91, 141, 190, 0.15)',
  },

  // ── Premium tiers ────────────────────────────────────
  premium: {
    platinum: '#B0B0B8',
    burgundy: '#722F37',
    champagne: '#F7E7CE',
  },

  // ── Borders ──────────────────────────────────────────
  border: {
    default: 'rgba(255, 255, 255, 0.06)',
    subtle: 'rgba(255, 255, 255, 0.04)',
    strong: 'rgba(255, 255, 255, 0.12)',
    accent: 'rgba(194, 112, 62, 0.35)',
  },

  // ── Misc ─────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = typeof Colors;
