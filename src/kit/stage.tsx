import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {FLOOR, H, W, c} from '../design/tokens';

/** Shared SVG defs (glow filters, spotlight gradients). Render once per composition. */
export const Defs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2" />
        <feColorMatrix in="b2" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.75 0" result="b2a" />
        <feMerge>
          <feMergeNode in="b2a" />
          <feMergeNode in="b1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="glowBig" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
      </filter>
      <filter id="soft" x="-30%" y="-10%" width="160%" height="120%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
      </filter>
      <linearGradient id="spot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
        <stop offset="0.7" stopColor="#fff" stopOpacity="0.06" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.02" />
      </linearGradient>
      <radialGradient id="pool">
        <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="halo">
        <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
      </linearGradient>
    </defs>
  </svg>
);

/** Near-black canvas with a faint dot grid (behind everything). */
export const Backdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: c.bg,
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.075) 1.2px, transparent 1.6px)',
      backgroundSize: '30px 30px',
      backgroundPosition: '15px 15px',
    }}
  />
);

const grainTile = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

/** Vignette + moving film grain (on top of everything). */
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  const gx = Math.floor(random(`gx${f}`) * 240);
  const gy = Math.floor(random(`gy${f}`) * 240);
  return (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 50% 45%, transparent 45%, rgba(0,0,0,0.78) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: grainTile, backgroundPosition: `${gx}px ${gy}px`, opacity: 0.07, mixBlendMode: 'screen'}} />
    </>
  );
};

/** Scene world in 1440×1080 units with a camera (focus point x,y and zoom s). */
export const World: React.FC<{cam?: {x: number; y: number; s: number}; children: React.ReactNode}> = ({cam = {x: W / 2, y: H / 2, s: 1}, children}) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    <g transform={`translate(${W / 2} ${H / 2}) scale(${cam.s}) translate(${-cam.x} ${-cam.y})`}>{children}</g>
  </svg>
);

/** Overhead spotlight cone + floor pool at x. */
export const Spot: React.FC<{x: number; top?: number; bottom?: number; op?: number; y?: number}> = ({x, top = 120, bottom = 520, op = 1, y = FLOOR}) => (
  <g opacity={op}>
    <polygon points={`${x - top / 2},-200 ${x + top / 2},-200 ${x + bottom / 2},${y} ${x - bottom / 2},${y}`} fill="url(#spot)" filter="url(#soft)" />
    <ellipse cx={x} cy={y} rx={bottom * 0.55} ry={46} fill="url(#pool)" />
  </g>
);

/** Dashed floor line. */
export const Floor: React.FC<{x1?: number; x2?: number; y?: number; op?: number}> = ({x1 = -800, x2 = W + 800, y = FLOOR, op = 1}) => (
  <line x1={x1} x2={x2} y1={y} y2={y} stroke={c.dim} strokeWidth={2} strokeDasharray="12 10" opacity={op} />
);

/** Soft white halo behind a highlighted element. */
export const Halo: React.FC<{x: number; y: number; r: number; op?: number}> = ({x, y, r, op = 1}) => (
  <circle cx={x} cy={y} r={r} fill="url(#halo)" opacity={op} />
);

/** Camera that keeps the floor line at `floorAt` of frame height (reference framing: figures large, floor low). */
export const floorCam = (x: number, s: number, floorAt = 0.82) => ({x, y: FLOOR - (H * floorAt - H / 2) / s, s});
