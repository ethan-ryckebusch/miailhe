"""Mesure chaque prise : durée parlée, hauteur (F0 médiane, étendue en demi-tons), débit, HNR (souffle/grain), jitter."""
import sys, glob, subprocess, os, math
import parselmouth
from parselmouth.praat import call
for f in sys.argv[1:]:
    wav = '/tmp/_m.wav'
    subprocess.run(['ffmpeg','-v','error','-y','-i',f,'-ac','1','-ar','44100',wav], check=True)
    s = parselmouth.Sound(wav)
    # parole : intensité > max-30 dB
    inten = s.to_intensity()
    vals = [(inten.xs()[i], inten.values[0][i]) for i in range(len(inten.xs()))]
    mx = max(v for _, v in vals)
    parle = [t for t, v in vals if v > mx - 30]
    debut, fin = (min(parle), max(parle)) if parle else (0, s.duration)
    p = s.to_pitch_ac(time_step=0.01, pitch_floor=60, pitch_ceiling=350)
    f0 = [x for x in p.selected_array['frequency'] if x > 0]
    f0.sort()
    med = f0[len(f0)//2] if f0 else 0
    lo, hi = (f0[int(len(f0)*.1)], f0[int(len(f0)*.9)]) if f0 else (0, 0)
    etendue = 12*math.log2(hi/lo) if lo else 0
    hnr = call(s.to_harmonicity_cc(), 'Get mean', 0, 0)
    pp = call(s, 'To PointProcess (periodic, cc)', 60, 350)
    jit = call(pp, 'Get jitter (local)', 0, 0, 0.0001, 0.02, 1.3) * 100
    d = fin - debut
    print(f'{os.path.basename(f)[:60]:62s} parlé {d:4.2f}s  F0 {med:5.0f} Hz  étendue {etendue:4.1f} dt  débit {8/d:4.1f} syll/s  HNR {hnr:4.1f} dB  jitter {jit:4.2f}%  (début {debut:.2f}s, total {s.duration:.2f}s)')
