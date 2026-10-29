"""Le même calcul que window.__mesurer (page ElevenLabs), en Python, pour comparer avec des prises connues."""
import sys, subprocess, numpy as np, math
def mesurer(f):
    raw = subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32); sr=16000
    N,H=640,160; lmin,lmax=sr//400, sr//60
    fr=[]
    for s in range(0, len(x)-N-lmax, H):
        a=x[s:s+N]; e=float((a*a).mean()); r0=e*N
        best=0; bl=0
        for l in range(lmin,lmax+1):
            b=x[s+l:s+l+N]; c=float(a@b); e2=float(b@b); r=c/math.sqrt(r0*e2+1e-12)
            if r>best: best=r; bl=l
        fr.append((s/sr, 10*math.log10(e+1e-12), best, sr/bl if bl else 0))
    emax=max(f[1] for f in fr)
    v=[f for f in fr if f[1]>emax-30 and f[2]>.55]
    f0s=sorted(f[3] for f in v); q=lambda p: f0s[int(p*(len(f0s)-1))]
    st=12*math.log2(q(.9)/q(.1))
    hnr=sum(10*math.log10(min(.999,f[2])/(1-min(.999,f[2]))) for f in v)/len(v)
    dj=nj=0
    for a,b in zip(fr,fr[1:]):
        if a[1]>emax-30 and b[1]>emax-30 and a[2]>.55 and b[2]>.55:
            d=abs(12*math.log2(b[3]/a[3]))
            if d<2: dj+=d; nj+=1
    parle=[f for f in fr if f[1]>emax-30]; dp=parle[-1][0]-parle[0][0]
    pics=sum(1 for i in range(2,len(fr)-2) if fr[i][1]>emax-22 and fr[i][2]>.5 and all(fr[i][1]>=fr[j][1] for j in (i-1,i+1,i-2,i+2)))
    return dict(f0=round(q(.5)), etendue=round(st,1), hnr=round(hnr,1), microvar=round(dj/nj,3), syll_s=round(pics/dp,2), parle=round(dp,2))
for f in sys.argv[1:]:
    print(f.split('/')[-1].ljust(24), mesurer(f))
