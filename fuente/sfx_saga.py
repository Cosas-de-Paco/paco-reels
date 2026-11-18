import sys
DURV=float(sys.argv[1]) if len(sys.argv)>1 else 46.0
exec(open('sfx_base.py').read().replace('DUR=56.0','DUR=%f'%DURV))
def bouncy(a,b,g=0.16,base=0,step=0.24):
    chs=[[0,4,7],[5,9,12],[2,5,9],[7,11,14]]; tp=a; k=0
    while tp<b:
        ch=chs[(k//8)%4]
        if k%2==0: add(pluck(n(ch[0]-12+base),0.35,0.15,0.9),tp,g*1.1)
        add(pluck(n(ch[k%3]+12+base),0.2,0.07,0.3),tp+step/2,g*0.4)
        tp+=step; k+=1
def suspense(a,b,g=0.12):
    tp=a
    while tp<b: add(pluck(n(-12),0.5,0.3,0.6),tp,g); add(pluck(n(-11),0.5,0.3,0.6),tp+0.5,g*0.8); tp+=1.0
def tick(t0,g=0.12): add(thud(0.03,2200),t0,g)
def sadtrombone(t0,g=0.3):
    for i,(s,d) in enumerate([(-5,0.4),(-6,0.4),(-7,0.4),(-8,1.0)]):
        t=tt(d); f=n(s,130.8)*2*(1+0.01*np.sin(2*np.pi*6*t)); add(lp(saw(f,t),0.1)*fade(t,d,0.03,0.1),t0+i*0.42,g)
def horn(t0,d=0.5,g=0.35):
    t=tt(d); s=np.sign(np.sin(2*np.pi*415*t))+np.sign(np.sin(2*np.pi*523*t)); add(lp(s,0.25)*fade(t,d,0.01,0.05),t0,g)
def screech(t0,d=0.7,g=0.3):
    t=tt(d); f=np.linspace(2600,1800,len(t))*(1+0.03*np.sin(2*np.pi*30*t)); add((np.sin(2*np.pi*np.cumsum(f)/SR)*0.6+lp(rng.normal(0,1,len(t)),0.3)*0.5)*fade(t,d,0.02,0.2),t0,g)
def engine(a,b,g=0.12,f0=55,f1=70):
    d=b-a; t=tt(d); f=np.linspace(f0,f1,len(t)); add(lp(saw(f,t)+0.5*saw(f*1.01,t),0.06)*fade(t,d,0.2,0.3),a,g)
def buzz(t0,d=0.35,g=0.25):
    t=tt(d); add(lp(np.sign(np.sin(2*np.pi*140*t)),0.15)*fade(t,d,0.01,0.03),t0,g)
def ring(t0,d=1.6,g=0.25):
    for k in np.arange(0,d,0.12): add(chirp(1300,1300,0.05),t0+k,g); add(chirp(1650,1650,0.05),t0+k+0.06,g)
def hiss(t0,d,g=0.15):
    t=tt(d); x=rng.normal(0,1,len(t)); add((x-lp(x,0.2))*fade(t,d,0.05,0.3),t0,g)
def jingle(t0,g=0.12):
    for i in range(8): add(bell(n(31+int(hash_(i)*7)),0.4),t0+i*0.04,g)
def hash_(i): return (np.sin(i*91.7)*43758.5)%1
def dundun(t0,g=0.5):
    for i,s in enumerate([0,-1,-4]):
        add(piano(n(s-24),1.8),t0+i*0.55,g); add(piano(n(s-12),1.8),t0+i*0.55,g*0.6); add(thud(0.4,60),t0+i*0.55,g*0.7)
def fanfare(t0,g=0.3):
    for i,s in enumerate([0,4,7,12,7,12]): add(pluck(n(s+12),0.4,0.2,0.6),t0+i*0.11,g)
def creak(t0,d=0.8,g=0.15):
    t=tt(d); f=np.linspace(220,380,len(t))*(1+0.1*np.sin(2*np.pi*23*t)); add(lp(saw(f,t),0.2)*fade(t,d,0.05,0.2),t0,g)
def steps(a,b,step=0.12,g=0.3,f=180):
    for k in np.arange(a,b,step): add(thud(0.08,f),k,g)
def save(name):
    global out
    out/=np.max(np.abs(out))*1.1
    w=wave.open(name,'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
