# Finance Motion Studio

Narrative finance motion graphics built on Remotion (React + TypeScript, GSAP and Three.js where useful).
The owner supplies the final voiceover; everything else is produced in the cloud container.

## Permanent rules (apply to every video unless the owner explicitly says otherwise)

1. **Aspect ratio**: 4:3 master. A 9:16 TikTok version is made only on request, re-laid out (never stretched or squashed).
2. **Resolution**: 1440 × 1080.
3. **Frame rate**: 60 fps.
4. **Bitrate**: 20 Mbps for final MP4 exports (`--video-bitrate=20M`).
5. **Typography**: no unnecessary text, captions, subtitles or decorative words. Let visuals tell the story.
   Text only when genuinely useful: numbers spoken in the narration, important dates / percentages / financial figures,
   essential chart and diagram labels, short key phrases that significantly improve understanding.
6. **Visual storytelling first**: cinematic animation, motion graphics, financial visualisations, objects, environments,
   charts, camera movement and creative transitions.
7. **Sound design**: synchronised whooshes, clicks, impacts and subtle SFX triggered by visual elements
   (technique from Football Motion Studio: synthesised SFX library + `<Sfx at={W.word ± offset}>` cues).
   Narration untouched and dominant. Music only when it genuinely helps, never by default.
8. **Efficiency**: avoid unnecessary animations, text elements, dependencies and production steps. High quality, low cost.

## Creative direction — the owner's TikTok reference video is the main visual reference

Follow its creative direction, editing, pacing, composition, typography, transitions and animation style.
Do not re-analyse it and do not replace it with a generic finance template.

- **Colour**: strictly black, white and grayscale. No gold, no colour accents, ever.
- **World**: near-black canvas with a faint dot grid, heavy vignette, soft grain, overhead spotlight cones,
  bloom on bright elements; secondary elements dimmed/defocused. Brightness = importance.
- **Characters**: faceless solid-white figures (circle head, pill body), emotion through pose only
  (work, stand, arms up, shrug, slump, point, phone, present). Dashed floor line + dashed ellipse shadow.
- **Props**: thin glowing white outline line-art (desk, monitor with swappable screen, window, phone, charts, tiles, cash bricks).
- **Typography**: tiny tracked uppercase label above a heavy geometric number (Inter, tabular figures).
  Numbers always move: accelerating count-ups, ticking counters, time-skip jumps. One bold uppercase thesis line at most.
- **Motion**: overshoot pops with stagger, lightweight physics (falling/stacking), check/✕/★/spinner/battery/clock status icons,
  draw-on charts with a rider figure, placeholder-then-resolve bars, glow highlight on the key element. Depth is faked (blur, light, scale).
- **Camera**: constant slow push-ins, lateral reveals, detail push-ins into screens.
- **Transitions**: blur/ghost dissolves (~0.3 s), match cuts on recurring props, push-through into screens.
- **Pacing**: scene change every ~5–8 s, a micro-event every 0.5–1.5 s; nothing static for > ~1 s.
  Payoff-first hooks, contrast pairs, visual metaphors for abstract ideas.

## Timing — the voiceover is the master timeline

1. Owner's audio → `public/audio/`. Run `npm run analyze -- public/audio/<file>` (speech segments, pauses, loudness envelope).
2. Word timestamps from the owner's audio (speech-to-text used only to *read* timing; never generate voices or audio).
   ASR model: `models/sherpa-onnx-zipformer-en-2023-06-26` (git-ignored; re-download from k2-fsa sherpa-onnx GitHub releases).
   Python venv `.venv` (git-ignored). Use the owner's script text to correct words/numbers.
3. Key every scene, animation, transition and SFX to those absolute word times. No fixed beat sheets.

## Remotion rules

- Animate only with `useCurrentFrame()` + `interpolate`/`spring`; no CSS animations, no R3F `useFrame()`.
- GSAP only via a paused timeline seeked to the current frame. Three.js only inside `ThreeCanvas`.
- Deterministic: `random(seed)` from remotion, never `Math.random()` / `Date.now()`.
- Audio via `<Audio>` from `@remotion/media`. Fonts self-hosted in `public/fonts`.
- Preview with stills before full renders (`npm run stills`); render with `npm run render -- <Id> --video-bitrate=20M`.
- Official Remotion agent skills live in `.agents/skills` (linked in `.claude/skills`).

## Pipeline (commands)

1. `npm run analyze -- public/audio/<name>.mp3 --noise -38 --min-silence 0.2` → `public/data/<name>.timing.json`
2. `.venv/bin/python scripts/transcribe.py public/audio/<name>.mp3` → `public/data/<name>.transcript.json`
   (setup if missing: `python3 -m venv .venv && .venv/bin/pip install numpy scipy soundfile sherpa-onnx`, model as above)
3. Copy word times into `src/compositions/<project>/words.ts`; key scenes (`Scene from/to`), animations (`useT().p/pop/kf`) and `<Sfx>` cues to them.
4. SFX library: `.venv/bin/python scripts/make-sfx.py` (whoosh-soft/fast/low/out, click, tick, pop, coin, thud, impact, impact-soft).
5. Preview: `node scripts/stills.mjs <Id> <dir> 0.5 "s1,s2,…"`, tile with ffmpeg, inspect.
6. Final: `npm run render -- <Id> --video-bitrate=20M --x264-preset=slow --audio-bitrate=320k` → `out/<Id>.mp4`.

## Project map

```
src/design/tokens.ts   format (1440×1080 @ 60), FLOOR, mono palette, easings
src/lib/time.tsx       useT (absolute-time progress, pop, keyframes), Scene (blur-ghost dissolve), Sfx
src/kit/stage.tsx      Defs (glow filters), Backdrop (dot grid), Finish (vignette + grain), World (camera), floorCam, Spot, Floor, Halo
src/kit/shapes.tsx     Pop, Drop, Figure + poses, Label, Icon set, Badge, CoinStack, Coin, Pack, Basket, Jar
src/kit/title.tsx      Title (key phrase, HUD layer)
src/compositions/      one folder per production (words.ts, scenes.tsx, <Project>.tsx)
```

## Delivery (every final render)

Push the exact, untouched MP4 (no re-encode, no compression) to the separate `renders` branch with Git LFS (`*.mp4` tracked),
then give the owner the download link `https://github.com/silencator/finance-motion-studio/raw/renders/<file>.mp4`.
Uploads need the `finance-motion-studio` cloud environment (allows lfs.github.com). Verify the link returns the full byte size.
