"""Synthesises the studio's restrained SFX palette (48 kHz, 24-bit WAV) into public/sfx/.
Technique adapted from Football Motion Studio. Run: .venv/bin/python scripts/make-sfx.py"""
import numpy as np, soundfile as sf, os
from scipy.signal import butter, sosfilt
SR = 48000
rng = np.random.default_rng(7)
out = 'public/sfx'; os.makedirs(out, exist_ok=True)
t = lambda d: np.arange(int(d * SR)) / SR
bp = lambda lo, hi: butter(2, [lo, hi], 'band', fs=SR, output='sos')
hp = lambda f: butter(2, f, 'high', fs=SR, output='sos')

def bp_sweep(noise, f0, f1, q=1.2, steps=48):
    """Band-pass noise with a centre frequency sweeping f0→f1 (overlap-add blocks)."""
    n = len(noise); y = np.zeros(n); blk = n // steps; win = np.hanning(blk * 2)
    for i in range(steps):
        fc = f0 * (f1 / f0) ** (i / (steps - 1)); bw = fc / q
        sos = butter(2, [max(30, fc - bw / 2), min(SR / 2 - 100, fc + bw / 2)], 'band', fs=SR, output='sos')
        a = max(0, i * blk - blk // 2); seg = noise[a:a + blk * 2]
        y[a:a + len(seg)] += sosfilt(sos, seg) * win[:len(seg)]
    return y

def env(n, attack, release_curve=3.0):
    k = int(n * attack); e = np.ones(n)
    e[:k] = np.sin(np.linspace(0, np.pi / 2, k)) ** 2
    e[k:] = (1 - np.linspace(0, 1, n - k)) ** release_curve
    return e

norm = lambda x, db: x / (np.max(np.abs(x)) + 1e-9) * 10 ** (db / 20)

def fade(x, in_ms=0.3, out_ms=4):
    a = max(2, int(SR * in_ms / 1000)); b = int(SR * out_ms / 1000)
    x[:a] *= np.linspace(0, 1, a); x[-b:] *= np.linspace(1, 0, b); return x

def save(name, x): sf.write(f'{out}/{name}.wav', fade(x.astype(np.float64)), SR, subtype='PCM_24'); print('✔', name, f'{len(x)/SR:.2f}s')

# Whooshes (scene transitions, camera moves): airy swept noise that sits under the voice.
for name, d, f0, f1, att, pk in [('whoosh-soft', .55, 350, 2600, .62, -9), ('whoosh-fast', .32, 500, 3800, .55, -9), ('whoosh-low', .7, 180, 900, .6, -8)]:
    n = rng.standard_normal(int(d * SR)); y = bp_sweep(n, f0, f1) * env(len(n), att, 2.2)
    save(name, norm(y, pk))
# Reverse whoosh: things disappearing / being sucked away.
n = rng.standard_normal(int(.6 * SR)); y = bp_sweep(n, 2400, 300) * env(len(n), .85, 1.2)
save('whoosh-out', norm(y, -10))

# UI click (labels, chart text appearing).
x = t(.05); y = np.sin(2 * np.pi * 2300 * x) * np.exp(-x * 220) + 0.5 * np.sin(2 * np.pi * 5200 * x) * np.exp(-x * 600)
y += sosfilt(hp(3000), rng.standard_normal(len(x))) * np.exp(-x * 900) * 0.6
save('click', norm(y, -6))

# Tick (rapid repeated elements: stacking blocks, counters).
x = t(.025); y = np.sin(2 * np.pi * 3400 * x) * np.exp(-x * 500) + sosfilt(hp(4000), rng.standard_normal(len(x))) * np.exp(-x * 1400) * .5
save('tick', norm(y, -8))

# Pop (objects / icons popping in).
x = t(.09); f = 520 + 520 * (1 - np.exp(-x * 60)); ph = 2 * np.pi * np.cumsum(f) / SR
save('pop', norm(np.sin(ph) * np.exp(-x * 45) * (1 - np.exp(-x * 2000)), -7))

# Coin: short bright metallic ring (inharmonic partials).
x = t(.35); y = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * d) for f, a, d in [(2637, 1, 14), (3951, .6, 18), (5274, .35, 24), (7040, .2, 30)])
y += sosfilt(hp(5000), rng.standard_normal(len(x))) * np.exp(-x * 800) * .4
save('coin', norm(y, -10))

# Thud: soft low landing (objects dropping on the floor / stacking).
x = t(.3); f = 60 + 90 * np.exp(-x * 40); ph = 2 * np.pi * np.cumsum(f) / SR
y = np.sin(ph) * np.exp(-x * 18) + sosfilt(bp(300, 1800), rng.standard_normal(len(x))) * np.exp(-x * 90) * .5
save('thud', norm(np.tanh(y * 1.3), -7))

# Impact (key reveals): sub drop + soft body + filtered transient, gently saturated.
x = t(1.1); f = 38 + 50 * np.exp(-x * 18); ph = 2 * np.pi * np.cumsum(f) / SR
y = np.sin(ph) * np.exp(-x * 4.2) + 0.35 * np.sin(2 * np.pi * 140 * x) * np.exp(-x * 14)
y += sosfilt(bp(200, 2500), rng.standard_normal(len(x))) * np.exp(-x * 45) * .9
save('impact', norm(np.tanh(y * 1.6), -3))
save('impact-soft', norm(np.tanh(y[: int(.6 * SR)] * np.exp(-t(.6) * 3) * 1.2), -7))
