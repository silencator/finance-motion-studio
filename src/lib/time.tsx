import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, type EasingFunction} from 'remotion';
import {Audio} from '@remotion/media';
import {ease} from '../design/tokens';

/**
 * Narration is the master clock: every scene, animation and SFX is keyed to absolute seconds
 * taken from the voiceover's word timestamps (words.ts).
 */
const Offset = createContext(0);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + useContext(Offset);
  /** 0→1 progress from absolute second `at` over `dur` seconds. */
  const p = (at: number, dur = 0.5, easing: EasingFunction = ease.out) => interpolate(t, [at, at + Math.max(0.001, dur)], [0, 1], {...clamp, easing});
  /** Overshoot pop progress (can exceed 1 briefly). */
  const pop = (at: number, dur = 0.45) => p(at, dur, ease.pop);
  /** Keyframed value: keys [[sec, value], …] with in-out easing between keys. */
  const kf = (keys: [number, number][], easing: EasingFunction = ease.inOut) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t1, v1] = keys[i];
      const [t0, v0] = keys[i - 1];
      if (t <= t1) return v0 + (v1 - v0) * easing((t - t0) / Math.max(0.001, t1 - t0));
    }
    return keys[keys.length - 1][1];
  };
  return {t, p, pop, kf, fps, frame};
};

/** A scene from `from` to `to` (absolute seconds) with a blur/ghost dissolve in and out (reference transition). */
export const Scene: React.FC<{from: number; to: number; children: React.ReactNode; name?: string; fadeIn?: boolean; xfade?: number}> = ({
  from, to, children, name, fadeIn = true, xfade = 0.35,
}) => {
  const {fps} = useVideoConfig();
  const start = Math.round(from * fps);
  const dur = Math.round((to + xfade) * fps) - start;
  return (
    <Sequence from={start} durationInFrames={dur} name={name}>
      <Offset.Provider value={start / fps}>
        <Dissolve from={from} to={to} fadeIn={fadeIn} xfade={xfade}>{children}</Dissolve>
      </Offset.Provider>
    </Sequence>
  );
};

const Dissolve: React.FC<{from: number; to: number; fadeIn: boolean; xfade: number; children: React.ReactNode}> = ({from, to, fadeIn, xfade, children}) => {
  const {p} = useT();
  const kin = fadeIn ? 1 - p(from, xfade, ease.out) : 0;
  const kout = p(to, xfade, ease.in);
  const k = Math.max(kin, kout);
  return (
    <AbsoluteFill style={{opacity: 1 - k, filter: k > 0.001 ? `blur(${k * 18}px)` : undefined, scale: String(1 + kout * 0.04 - kin * 0.02)}}>
      {children}
    </AbsoluteFill>
  );
};

export type SfxName = 'whoosh-soft' | 'whoosh-fast' | 'whoosh-low' | 'whoosh-out' | 'click' | 'tick' | 'pop' | 'coin' | 'thud' | 'impact' | 'impact-soft';

/** One sound effect at an absolute second (place at composition top level). Files: public/sfx (scripts/make-sfx.py). */
export const Sfx: React.FC<{at: number; name: SfxName; volume?: number}> = ({at, name, volume = 0.3}) => {
  const {fps} = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps))} durationInFrames={Math.round(1.2 * fps)} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};
