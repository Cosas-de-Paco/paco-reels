import numpy as np, wave
SR=44100; DUR=56.0
rng=np.random.default_rng(5)
out=np.zeros(int(SR*DUR))
def add(sig,t0,g=1.0):
    i=int(t0*SR); j=min(len(out),i+len(sig))
    if j>i: out[i:j]+=sig[:j-i]*g
def tt(d): return np.arange(int(d*SR))/SR
def lp(x,k):
    y=np.zeros_like(x); a=0.0
    for i in range(len(x)): a+=k*(x[i]-a); y[i]=a
    return y
def saw(f,t): return 2*((f*t)%1)-1
def fade(t,d,a=0.01,r=0.05): return np.clip(np.minimum(t/a,(d-t)/r),0,1)
def pluck(f,d=0.6,r=0.25,h=0.3):
    t=tt(d); return (np.sin(2*np.pi*f*t)+h*np.sin(4*np.pi*f*t)+0.1*np.sin(6*np.pi*f*t))*np.minimum(1,t/0.003)*np.exp(-t/r)
def piano(f,d=1.6): return pluck(f,d,0.6,0.5)
def thud(d=0.25,f=110): t=tt(d); return np.sin(2*np.pi*f*t)*np.exp(-t/0.06)+rng.normal(0,1,len(t))*np.exp(-t/0.01)*0.5
def noise_burst(d,k,decay): t=tt(d); return lp(rng.normal(0,1,len(t)),k)*np.exp(-t/decay)*3
def choir(freqs,d,bright=0.06):
    t=tt(d); s=np.zeros(len(t))
    for f in freqs:
        for det in (-0.4,0,0.5): s+=saw(f*(1+det/100)*(1+0.004*np.sin(2*np.pi*5*t+f)),t)
    return lp(s,bright)*fade(t,d,0.25,0.5)*0.6
def whistle(notes):
    sig=[]
    for f,d in notes:
        t=tt(d); vib=1+0.012*np.sin(2*np.pi*6*t)
        sig.append(np.sin(2*np.pi*np.cumsum(f*vib*np.ones(len(t)))/SR)*fade(t,d,0.03,0.06))
    return np.concatenate(sig)
def heartbeat(): return np.concatenate([thud(0.15,60),np.zeros(int(0.08*SR)),thud(0.2,55)])
def swoosh(d=0.3):
    t=tt(d); n=rng.normal(0,1,len(t)); y=np.zeros_like(n); a=0
    for i in range(len(n)): k=0.03+0.4*(t[i]/d); a+=k*(n[i]-a); y[i]=a
    return y*np.sin(np.pi*t/d)*2.5
def chirp(f0,f1,d):
    t=tt(d); f=np.linspace(f0,f1,len(t)); return np.sin(2*np.pi*np.cumsum(f)/SR)*fade(t,d,0.01,0.03)
def bell(f,d=1.5):
    t=tt(d); return sum(np.sin(2*np.pi*f*k*t)*np.exp(-t/(0.6/k)) for k in (1,2.76,5.4))/2
C=261.63
def n(semi,base=C): return base*2**(semi/12)
