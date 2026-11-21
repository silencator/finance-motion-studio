import {Easing} from 'remotion';

/** Master format (CLAUDE.md): 4:3, 1440×1080, 60 fps. */
export const W = 1440;
export const H = 1080;
export const FPS = 60;
/** Floor line (y) of the stage. */
export const FLOOR = 880;

/** Strictly monochrome. */
export const c = {
  bg: '#060606',
  white: '#F5F5F5',
  line: 'rgba(245,245,245,0.92)',
  soft: 'rgba(245,245,245,0.55)',
  dim: 'rgba(245,245,245,0.28)',
  faint: 'rgba(245,245,245,0.12)',
  label: '#B4B4B4',
  fill: '#141414',
  fill2: '#1E1E1E',
} as const;

export const font = 'Inter';

export const ease = {
  /** Overshoot pop for objects/icons arriving (reference style). */
  pop: Easing.bezier(0.34, 1.56, 0.64, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  /** Accelerating growth (counters, bars filling). */
  grow: Easing.bezier(0.55, 0, 0.9, 0.6),
  linear: Easing.linear,
} as const;

export const stroke = {hair: 2, line: 3, bold: 5} as const;
