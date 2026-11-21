import React from 'react';
import {Composition, Folder} from 'remotion';
import {FPS, H, W} from './design/tokens';
import {fontsReady} from './design/fonts';
import {DURATION_SEC, PovertyPremium} from './compositions/poverty-premium/PovertyPremium';

void fontsReady;

/** Master format: 4:3, 1440×1080, 60 fps (CLAUDE.md). Duration follows the narration. */
export const RemotionRoot: React.FC = () => (
  <Folder name="Productions">
    <Composition id="PovertyPremium" component={PovertyPremium} durationInFrames={Math.round(DURATION_SEC * FPS)} fps={FPS} width={W} height={H} />
  </Folder>
);
