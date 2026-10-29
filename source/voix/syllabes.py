"""Compte les noyaux syllabiques (pics d'intensité voisés, méthode de De Jong & Wempe simplifiée) et les pauses."""
import sys, subprocess
import numpy as np, parselmouth
for f in sys.argv[1:]:
    subprocess.run(['ffmpeg','-v','error','-y','-i',f,'-ac','1','-ar','44100','/tmp/_s.wav'],check=True)
    s=parselmouth.Sound('/tmp/_s.wav')
    it=s.to_intensity(minimum_pitch=50, time_step=0.005)
    v=it.values[0]; t=it.xs()
    seuil=np.percentile(v,99)-25
    p=s.to_pitch_ac(time_step=0.005,pitch_floor=60,pitch_ceiling=400)
    pics=[]
    for i in range(2,len(v)-2):
        if v[i]>seuil and v[i]>=v[i-1] and v[i]>=v[i+1] and v[i]>=v[i-2] and v[i]>=v[i+2]:
            f0=p.get_value_at_time(t[i])
            if f0==f0 and f0>0:
                if pics:
                    a=np.searchsorted(t,pics[-1]); creux=v[a:i+1].min()
                    if min(v[a],v[i])-creux<2: 
                        if v[i]>v[a]: pics[-1]=t[i]
                        continue
                pics.append(t[i])
    # pauses : intensité sous le seuil plus de 120 ms à l'intérieur de la parole
    sous=v<seuil; idx=np.where(~sous)[0]; pauses=[]
    if len(idx):
        d,fn=idx[0],idx[-1]; run=0
        for i in range(d,fn):
            if sous[i]: run+=1
            else:
                if run*0.005>0.12: pauses.append(round(t[i]-run*0.005,2))
                run=0
    print(f'{f.split("/")[-1]:24s} syllabes {len(pics):2d}  pauses {pauses}  pic {20*np.log10(np.abs(s.values).max()+1e-9):5.1f} dBFS')
