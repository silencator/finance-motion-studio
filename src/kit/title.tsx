import React from 'react';
import {c, font} from '../design/tokens';
import {useT} from '../lib/time';

/** Bold uppercase key phrase (HUD layer, outside the camera). Letters de-blur and settle in a fast stagger. */
export const Title: React.FC<{text: string; at: number; out?: number; y?: number; size?: number; stagger?: number}> = ({text, at, out, y = 140, size = 76, stagger = 0.025}) => {
  const {p} = useT();
  const o = out === undefined ? 0 : p(out, 0.35);
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', fontFamily: font, fontWeight: 900, fontSize: size, letterSpacing: '0.04em', color: c.white, opacity: 1 - o, filter: `blur(${o * 12}px)`, textShadow: '0 0 18px rgba(255,255,255,0.45), 0 0 48px rgba(255,255,255,0.18)'}}>
      {[...text].map((ch, i) => {
        const k = p(at + i * stagger, 0.45);
        return (
          <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: k, transform: `translateY(${(1 - k) * 18}px) scale(${1.25 - 0.25 * k})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined}}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};
