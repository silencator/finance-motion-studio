import React from 'react';
import {FLOOR, c, font} from '../design/tokens';
import {useT} from '../lib/time';

/* ───────────── motion wrappers ───────────── */

/** Pops a group in at `at` (overshoot) and optionally out at `out`. Origin = (x,y). */
export const Pop: React.FC<{at: number; x?: number; y?: number; out?: number; dur?: number; from?: number; children: React.ReactNode; glow?: boolean}> = ({
  at, x = 0, y = 0, out, dur = 0.45, from = 0, children, glow,
}) => {
  const {pop, p} = useT();
  const k = pop(at, dur);
  const o = out === undefined ? 0 : p(out, 0.3);
  const s = (from + (1 - from) * k) * (1 - o * 0.6);
  if (k <= 0 || o >= 1) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0, s)})`} opacity={Math.min(1, k * 2) * (1 - o)} filter={glow ? 'url(#glow)' : undefined}>
      {children}
    </g>
  );
};

/** Drops a group from above at `at`, landing at (x,y) with a slight settle. */
export const Drop: React.FC<{at: number; x?: number; y?: number; h?: number; dur?: number; children: React.ReactNode}> = ({at, x = 0, y = 0, h = 260, dur = 0.38, children}) => {
  const {p, t} = useT();
  if (t < at) return null;
  const k = p(at, dur, (v) => v * v);
  const bounce = Math.sin(Math.min(1, Math.max(0, (t - at - dur) / 0.18)) * Math.PI) * 6;
  return (
    <g transform={`translate(${x} ${y - (1 - k) * h - bounce})`} opacity={Math.min(1, k * 4)}>
      {children}
    </g>
  );
};

/* ───────────── character ───────────── */

/** Arm angle presets (deg, 0 = hanging down, 90 = horizontal outward, 160 = raised). */
export const pose = {
  idle: [12, 12],
  hold: [55, 12],
  holdR: [12, 55],
  reach: [80, 12],
  reachR: [12, 80],
  cheer: [145, 145],
  shrug: [62, 62],
  slump: [4, 4],
} as const;

/** Faceless glowing figure (circle head, pill body). Stands on y (floor). */
export const Figure: React.FC<{x: number; y?: number; s?: number; arms?: readonly [number, number]; dim?: number; op?: number; lean?: number}> = ({
  x, y = FLOOR, s = 1, arms = pose.idle, dim = 0, op = 1, lean = 0,
}) => {
  const fill = dim ? `rgb(${245 - dim * 150},${245 - dim * 150},${245 - dim * 150})` : c.white;
  const arm = (side: -1 | 1, a: number) => {
    const r = (a * Math.PI) / 180;
    const sx = side * 30;
    const sy = -112;
    return <line x1={sx} y1={sy} x2={sx + side * 82 * Math.sin(r)} y2={sy + 82 * Math.cos(r)} stroke={fill} strokeWidth={22} strokeLinecap="round" />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
      <ellipse cx={0} cy={2} rx={74} ry={13} fill="none" stroke={c.dim} strokeWidth={2} strokeDasharray="7 7" />
      <g transform={`rotate(${lean} 0 0)`} filter={dim > 0.5 ? undefined : 'url(#glow)'}>
        <path d="M-48 0 L-42 -98 Q-40 -132 0 -132 Q40 -132 42 -98 L48 0 Z" fill={fill} />
        <circle cx={0} cy={-170} r={33} fill={fill} />
        {arm(-1, arms[0])}
        {arm(1, arms[1])}
      </g>
    </g>
  );
};

/* ───────────── text ───────────── */

/** Tiny tracked uppercase label (chart / diagram labels only). */
export const Label: React.FC<{x: number; y: number; text: string; size?: number; anchor?: 'start' | 'middle' | 'end'; op?: number; fill?: string}> = ({
  x, y, text, size = 18, anchor = 'middle', op = 1, fill = c.label,
}) => (
  <text x={x} y={y} fontFamily={font} fontSize={size} fontWeight={700} letterSpacing={size * 0.22} textAnchor={anchor} fill={fill} opacity={op}>
    {text}
  </text>
);

/* ───────────── icons (stroke line-art centred on 0,0, ~64px) ───────────── */

export type IconName =
  | 'milk' | 'bread' | 'apple' | 'can' | 'store' | 'house' | 'phone' | 'car' | 'bank' | 'bill' | 'shoe'
  | 'lock' | 'tag' | 'shield' | 'check' | 'cross' | 'percent' | 'warning' | 'wallet' | 'bolt' | 'pack';

const P: Record<IconName, React.ReactNode> = {
  milk: <><path d="M-16 32 V-12 L-10 -24 H10 L16 -12 V32 Z" /><path d="M-16 -12 H16 M-10 -24 V-32 H10 V-24" /><path d="M-8 6 H8" /></>,
  bread: <><path d="M-30 24 V0 Q-34 -22 -14 -22 H14 Q34 -22 30 0 V24 Z" /><path d="M-12 -8 L-4 4 M2 -8 L10 4" /></>,
  apple: <><path d="M0 -14 C-10 -24 -30 -20 -30 2 C-30 22 -14 32 0 26 C14 32 30 22 30 2 C30 -20 10 -24 0 -14 Z" /><path d="M0 -14 Q2 -26 10 -30" /></>,
  can: <><rect x={-18} y={-26} width={36} height={52} rx={5} /><path d="M-18 -16 H18 M-18 16 H18" /></>,
  store: <><path d="M-60 -20 H60 L52 -46 H-52 Z" /><path d="M-36 -20 V-46 M-12 -20 V-46 M12 -20 V-46 M36 -20 V-46" /><path d="M-50 -20 V46 H50 V-20" /><path d="M-14 46 V12 H14 V46" /></>,
  house: <><path d="M-34 32 V-6 L0 -34 L34 -6 V32 Z" /><path d="M-10 32 V10 H10 V32" /></>,
  phone: <><rect x={-20} y={-34} width={40} height={68} rx={7} /><path d="M-6 -26 H6 M-4 26 H4" /></>,
  car: <><path d="M-40 16 V0 L-28 -6 L-18 -24 H18 L28 -6 L40 0 V16 Z" /><circle cx={-22} cy={18} r={8} /><circle cx={22} cy={18} r={8} /></>,
  bank: <><path d="M-38 -12 L0 -34 L38 -12 Z" /><path d="M-30 -6 V24 M-10 -6 V24 M10 -6 V24 M30 -6 V24" /><path d="M-40 30 H40" /></>,
  bill: <><path d="M-24 -34 H14 L24 -24 V34 H-24 Z" /><path d="M-14 -16 H12 M-14 -4 H12 M-14 8 H4 M-14 20 H12" /></>,
  shoe: <><path d="M-36 18 V-22 H-14 Q-12 -6 6 -4 L30 2 Q40 6 40 18 Z" /><path d="M-36 10 H40" /></>,
  lock: <><rect x={-24} y={-6} width={48} height={40} rx={6} /><path d="M-14 -6 V-18 Q-14 -32 0 -32 Q14 -32 14 -18 V-6" /><path d="M0 8 V20" /></>,
  tag: <><path d="M-30 -10 L-10 -30 H28 V8 L8 28 Z" transform="rotate(45)" /><circle cx={0} cy={-18} r={5} /></>,
  shield: <><path d="M0 -34 L28 -24 V2 Q28 24 0 36 Q-28 24 -28 2 V-24 Z" /><path d="M-12 0 L-2 10 L14 -10" /></>,
  check: <path d="M-18 0 L-6 12 L18 -14" />,
  cross: <path d="M-15 -15 L15 15 M15 -15 L-15 15" />,
  percent: <><path d="M-20 26 L20 -26" /><circle cx={-16} cy={-18} r={8} /><circle cx={16} cy={18} r={8} /></>,
  warning: <><path d="M0 -32 L34 28 H-34 Z" /><path d="M0 -10 V8 M0 16 V18" /></>,
  wallet: <><rect x={-34} y={-22} width={68} height={46} rx={7} /><path d="M10 -6 H34 V10 H10 Z" /></>,
  bolt: <path d="M6 -34 L-16 4 H0 L-6 34 L18 -6 H2 Z" />,
  pack: <><rect x={-30} y={-24} width={60} height={48} rx={4} /><path d="M-30 -8 H30 M-10 -24 V24 M10 -24 V24" /></>,
};

export const Icon: React.FC<{name: IconName; x?: number; y?: number; s?: number; sw?: number; color?: string; glow?: boolean; op?: number}> = ({
  name, x = 0, y = 0, s = 1, sw = 3.2, color = c.line, glow = true, op = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={sw / s} strokeLinecap="round" strokeLinejoin="round" filter={glow ? 'url(#glow)' : undefined} opacity={op}>
    {P[name]}
  </g>
);

/** Icon inside a circular badge (status pop-ups: check, cross, lock …). */
export const Badge: React.FC<{name: IconName; x: number; y: number; r?: number; filled?: boolean}> = ({name, x, y, r = 26, filled}) => (
  <g transform={`translate(${x} ${y})`} filter="url(#glow)">
    <circle r={r} fill={filled ? c.white : c.bg} stroke={c.line} strokeWidth={3} />
    <Icon name={name} s={(r / 26) * 0.62} sw={4} color={filled ? c.bg : c.line} glow={false} />
  </g>
);

/* ───────────── money ───────────── */

/** Side-view coin stack; coin i lands at times[i] (absolute s). */
export const CoinStack: React.FC<{x: number; y?: number; times: number[]; w?: number; hl?: number; hlFrom?: number}> = ({x, y = FLOOR, times, w = 72, hl, hlFrom = 0}) => {
  const {t, p} = useT();
  return (
    <g transform={`translate(${x} ${y})`}>
      {times.map((at, i) => {
        if (t < at) return null;
        const k = p(at, 0.28, (v) => v * v);
        const lit = hl !== undefined && i >= hlFrom && t >= hl;
        return (
          <g key={i} transform={`translate(0 ${-(i + 1) * 15 - (1 - k) * 160})`} opacity={Math.min(1, k * 3)} filter={lit ? 'url(#glow)' : undefined}>
            <rect x={-w / 2} y={0} width={w} height={13} rx={6.5} fill={lit ? c.white : c.fill2} stroke={c.line} strokeWidth={2.5} />
          </g>
        );
      })}
    </g>
  );
};

/** Front-view coin with a $ mark. */
export const Coin: React.FC<{x?: number; y?: number; r?: number; filled?: boolean}> = ({x = 0, y = 0, r = 26, filled}) => (
  <g transform={`translate(${x} ${y})`} filter="url(#glow)">
    <circle r={r} fill={filled ? c.white : c.fill} stroke={c.line} strokeWidth={3} />
    <circle r={r * 0.74} fill="none" stroke={filled ? c.bg : c.soft} strokeWidth={1.5} />
    <text y={r * 0.36} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={r * 1.05} fill={filled ? c.bg : c.white}>$</text>
  </g>
);

/** Multipack box: grid of cans (cols×rows), bottom-centre at (x,y). */
export const Pack: React.FC<{x: number; y?: number; cols: number; rows: number; cell?: number; op?: number; dashed?: boolean}> = ({x, y = FLOOR, cols, rows, cell = 36, op = 1, dashed}) => {
  const w = cols * cell + 16;
  const h = rows * cell + 16;
  return (
    <g transform={`translate(${x - w / 2} ${y - h})`} opacity={op} filter={dashed ? undefined : 'url(#glow)'}>
      <rect width={w} height={h} rx={8} fill={c.fill} stroke={dashed ? c.soft : c.line} strokeWidth={3} strokeDasharray={dashed ? '9 8' : undefined} />
      {!dashed &&
        Array.from({length: cols * rows}, (_, i) => (
          <rect key={i} x={8 + (i % cols) * cell + 5} y={8 + Math.floor(i / cols) * cell + 4} width={cell - 10} height={cell - 8} rx={4} fill="none" stroke={c.soft} strokeWidth={2} />
        ))}
    </g>
  );
};

/** Shopping basket (outline), bottom-centre at (x,y). Children render as contents. */
export const Basket: React.FC<{x: number; y?: number; children?: React.ReactNode}> = ({x, y = FLOOR, children}) => (
  <g transform={`translate(${x} ${y})`}>
    <g>{children}</g>
    <g filter="url(#glow)" fill="none" stroke={c.line} strokeWidth={3} strokeLinejoin="round">
      <path d="M-78 -70 H78 L64 0 H-64 Z" fill={c.fill} />
      <path d="M-40 -70 L-30 0 M0 -70 V0 M40 -70 L30 0 M-72 -36 H72" stroke={c.dim} strokeWidth={2} />
      <path d="M-56 -70 Q-56 -122 0 -122 Q56 -122 56 -70" />
    </g>
  </g>
);

/** Glass-like jar (savings), bottom-centre at (x,y); fill 0..1. */
export const Jar: React.FC<{x: number; y?: number; fill: number; dashed?: boolean; op?: number}> = ({x, y = FLOOR, fill, dashed, op = 1}) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <clipPath id={`jar${x}`}>
      <rect x={-46} y={-130} width={92} height={130} rx={14} />
    </clipPath>
    <rect x={-46} y={-130 + 130 * (1 - fill)} width={92} height={130 * fill} fill="url(#barFill)" clipPath={`url(#jar${x})`} />
    <g fill="none" stroke={dashed ? c.soft : c.line} strokeWidth={3} strokeDasharray={dashed ? '9 8' : undefined} filter={dashed ? undefined : 'url(#glow)'}>
      <rect x={-46} y={-130} width={92} height={130} rx={14} />
      <rect x={-36} y={-148} width={72} height={18} rx={4} />
    </g>
  </g>
);
