"""Word timestamps from the owner's narration (reads audio only, never generates any).

  .venv/bin/python scripts/transcribe.py public/audio/<name>.mp3

Decodes each speech segment from public/data/<name>.timing.json (run `npm run analyze` first)
with the sherpa-onnx Zipformer transducer and writes public/data/<name>.transcript.json:
  [{start, end, text, words: [[WORD, startSec], ...]}, ...]
Then correct spellings/numbers against the owner's script and copy the times into the composition's words.ts.
"""
import json, os, subprocess, sys
import numpy as np
import sherpa_onnx

src = sys.argv[1]
name = os.path.splitext(os.path.basename(src))[0]
M = 'models/sherpa-onnx-zipformer-en-2023-06-26'
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f'{M}/encoder-epoch-99-avg-1.onnx', decoder=f'{M}/decoder-epoch-99-avg-1.onnx',
    joiner=f'{M}/joiner-epoch-99-avg-1.onnx', tokens=f'{M}/tokens.txt', num_threads=4, decoding_method='greedy_search')

SR = 16000
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768
segments = json.load(open(f'public/data/{name}.timing.json'))['segments']

out = []
for seg in segments:
    a, b = max(0, seg['start'] - 0.1), seg['end'] + 0.1
    s = rec.create_stream(); s.accept_waveform(SR, audio[int(a * SR):int(b * SR)]); rec.decode_stream(s)
    r = s.result
    words = []
    for tok, ts in zip(r.tokens, r.timestamps):
        if tok[:1] in ('▁', ' ') or not words:
            words.append([tok.lstrip('▁ '), round(a + ts, 2)])
        else:
            words[-1][0] += tok
    out.append({'start': seg['start'], 'end': seg['end'], 'text': r.text.strip(), 'words': words})
    print(f"{seg['start']:6.2f}  {' '.join(f'{w}@{t}' for w, t in words)}")

json.dump(out, open(f'public/data/{name}.transcript.json', 'w'), indent=1)
print(f'✔ public/data/{name}.transcript.json')
