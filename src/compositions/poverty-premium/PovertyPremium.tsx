import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {font} from '../../design/tokens';
import {Scene, Sfx} from '../../lib/time';
import {Backdrop, Defs, Finish} from '../../kit/stage';
import {S1, S2, S3, S4, S5, S6, S7, S8, S9} from './scenes';
import {w} from './words';

/** "The Poverty Premium" — 4:3 master, 1440×1080 @ 60 fps. The narration is the master clock. */
export const DURATION_SEC = w.end + 1.0;

const FadeOut: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const o = interpolate(f, [durationInFrames - 0.6 * fps, durationInFrames - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#000', opacity: o}} />;
};

export const PovertyPremium: React.FC = () => (
  <AbsoluteFill style={{fontFamily: font}}>
    <Defs />
    <Backdrop />
    <Scene from={0} to={4.95} fadeIn={false} name="S1 same groceries"><S1 /></Scene>
    <Scene from={4.95} to={17.55} name="S2 big vs small pack"><S2 /></Scene>
    <Scene from={17.55} to={20.5} name="S3 beyond the supermarket"><S3 /></Scene>
    <Scene from={20.5} to={24.1} name="S4 monthly vs upfront"><S4 /></Scene>
    <Scene from={24.1} to={28.15} name="S5 replacing sooner"><S5 /></Scene>
    <Scene from={28.15} to={34.75} name="S6 emergency + borrowing"><S6 /></Scene>
    <Scene from={34.75} to={42.85} name="S7 poverty premium"><S7 /></Scene>
    <Scene from={42.85} to={55.85} name="S8 choices"><S8 /></Scene>
    <Scene from={55.85} to={DURATION_SEC} name="S9 paying more"><S9 /></Scene>
    <Finish />
    <FadeOut />

    {/* Narration: untouched master track */}
    <Audio src={staticFile('audio/poverty-premium.mp3')} />

    {/* Sound design — no music. Each cue sits on the visual it accompanies; narration stays dominant. */}
    <Sfx at={0.05} name="whoosh-soft" volume={0.18} />
    {[0, 1, 2, 3].map((i) => <Sfx key={`g${i}`} at={w.groceries + i * 0.12} name="pop" volume={0.2} />)}
    <Sfx at={w.someone} name="whoosh-fast" volume={0.16} />
    {[0, 1, 2, 3].map((i) => <Sfx key={`c${i}`} at={w.paying + 0.2 + i * 0.09} name="tick" volume={0.22} />)}
    <Sfx at={w.more + 0.2} name="coin" volume={0.3} />
    <Sfx at={w.more + 0.25} name="impact-soft" volume={0.3} />

    <Sfx at={4.85} name="whoosh-soft" volume={0.2} />
    <Sfx at={w.big + 0.33} name="thud" volume={0.4} />
    <Sfx at={7.6} name="click" volume={0.24} />
    <Sfx at={w.per} name="whoosh-fast" volume={0.14} />
    {[0, 1, 2, 3].map((i) => <Sfx key={`j${i}`} at={w.save + i * 0.3 + 0.28} name="coin" volume={0.18} />)}
    <Sfx at={10.6} name="whoosh-low" volume={0.28} />
    <Sfx at={w.other + 0.05} name="pop" volume={0.2} />
    <Sfx at={w.smaller + 0.38} name="thud" volume={0.36} />
    <Sfx at={12.9} name="whoosh-fast" volume={0.16} />
    <Sfx at={13.55} name="impact-soft" volume={0.32} />
    <Sfx at={w.better} name="pop" volume={0.2} />
    <Sfx at={w.deal + 0.1} name="click" volume={0.32} />
    <Sfx at={w.because2 + 0.15} name="pop" volume={0.2} />
    <Sfx at={w.afford2 - 0.1} name="coin" volume={0.2} />
    <Sfx at={w.afford2 + 0.05} name="whoosh-fast" volume={0.12} />
    <Sfx at={w.today + 0.05} name="click" volume={0.28} />

    <Sfx at={17.45} name="whoosh-soft" volume={0.2} />
    <Sfx at={18.4} name="whoosh-low" volume={0.3} />
    {[0, 1, 2, 3].map((i) => <Sfx key={`b${i}`} at={w.beyond + 0.05 + i * 0.13} name="pop" volume={0.2} />)}

    <Sfx at={20.4} name="whoosh-soft" volume={0.2} />
    <Sfx at={w.bill - 0.05} name="pop" volume={0.22} />
    {Array.from({length: 12}, (_, i) => <Sfx key={`m${i}`} at={w.monthly + i * 0.13 + 0.18} name="tick" volume={0.2} />)}
    <Sfx at={w.monthly} name="click" volume={0.2} />
    <Sfx at={w.upfront + 0.3} name="thud" volume={0.42} />
    <Sfx at={w.upfront + 0.5} name="impact-soft" volume={0.3} />

    <Sfx at={24.0} name="whoosh-soft" volume={0.2} />
    <Sfx at={w.product} name="pop" volume={0.2} />
    <Sfx at={w.cheaper + 0.05} name="pop" volume={0.18} />
    <Sfx at={w.wears + 0.2} name="click" volume={0.3} />
    <Sfx at={w.replacing} name="pop" volume={0.22} />
    <Sfx at={w.replacing + 0.12} name="coin" volume={0.18} />
    <Sfx at={w.sooner - 0.2} name="click" volume={0.3} />
    <Sfx at={w.sooner} name="pop" volume={0.22} />
    <Sfx at={w.sooner + 0.12} name="coin" volume={0.18} />

    <Sfx at={28.05} name="whoosh-soft" volume={0.2} />
    <Sfx at={w.expense - 0.05} name="whoosh-fast" volume={0.24} />
    <Sfx at={w.expense + 0.33} name="impact" volume={0.5} />
    <Sfx at={w.savings - 0.05} name="pop" volume={0.2} />
    <Sfx at={w.savings + 0.3} name="click" volume={0.28} />
    <Sfx at={w.borrow - 0.35} name="pop" volume={0.22} />
    <Sfx at={w.borrow} name="whoosh-fast" volume={0.18} />
    <Sfx at={w.interest - 0.1} name="click" volume={0.3} />
    {Array.from({length: 14}, (_, i) => <Sfx key={`d${i}`} at={w.high + i * 0.07 + 0.25} name="tick" volume={0.18} />)}
    <Sfx at={w.rate + 0.05} name="impact-soft" volume={0.32} />

    <Sfx at={34.65} name="whoosh-low" volume={0.26} />
    <Sfx at={w.poverty} name="whoosh-fast" volume={0.2} />
    <Sfx at={w.premium + 0.15} name="impact" volume={0.48} />
    <Sfx at={w.costs2} name="impact-soft" volume={0.3} />
    <Sfx at={w.people} name="pop" volume={0.18} />
    <Sfx at={w.enough + 0.2} name="coin" volume={0.2} />
    {[0, 1, 2].map((i) => <Sfx key={`o${i}`} at={w.access + i * 0.14} name="pop" volume={0.2} />)}
    <Sfx at={w.options - 0.05} name="click" volume={0.24} />
    <Sfx at={w.options + 0.1} name="click" volume={0.3} />

    <Sfx at={42.75} name="whoosh-soft" volume={0.2} />
    <Sfx at={42.95} name="coin" volume={0.26} />
    {[0, 1, 2, 3].map((i) => <Sfx key={`t${i}`} at={w.things - 0.15 + i * 0.08} name="pop" volume={0.18} />)}
    <Sfx at={w.choices - 0.05} name="whoosh-soft" volume={0.26} />
    {[w.bulk, w.sale, w.upfront2, w.emergency].map((at, i) => <Sfx key={`n${i}`} at={at} name="click" volume={0.3} />)}
    <Sfx at={w.tight - 0.05} name="thud" volume={0.4} />
    <Sfx at={w.choices2 + 0.1} name="whoosh-out" volume={0.3} />

    <Sfx at={55.75} name="whoosh-soft" volume={0.2} />
    <Sfx at={w.only + 0.2} name="coin" volume={0.2} />
    <Sfx at={w.less2 + 0.2} name="tick" volume={0.22} />
    <Sfx at={w.sometimes + 0.2} name="pop" volume={0.18} />
    <Sfx at={w.paying4 + 0.2} name="coin" volume={0.2} />
    <Sfx at={w.more3 + 0.2} name="coin" volume={0.28} />
    <Sfx at={w.more3 + 0.25} name="impact" volume={0.42} />
  </AbsoluteFill>
);
