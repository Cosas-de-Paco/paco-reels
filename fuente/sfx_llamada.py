import sys; sys.argv=['x','38']; exec(open('sfx_saga.py').read())
# 0-7 s: intro aprobada (igual que sfx_llamada-intro.py)
bouncy(0.0,1.5,0.14,0,0.24)
add(thud(0.04,1800),0.85,0.35)
for k in np.arange(1.5,7.0,0.9): buzz(k,0.45,0.32)
add(chirp(500,1500,0.35),1.75,0.25); add(thud(0.3,90),1.8,0.45)
add(swoosh(0.25),3.3,0.3)
suspense(3.5,7.0,0.14)
# 7 s: descuelga
add(thud(0.04,1800),7.2,0.4); add(chirp(900,1400,0.12),7.22,0.2)
for c in [7.7,12.4,19.0,24.6,27.0,31.0,33.9]: add(swoosh(0.25),c-0.1,0.25)
# llamada: charla de mamá (pitiditos tipo voz)
def blabla(a,b,g=0.08,base=900):
    tp=a; k=0
    while tp<b:
        f=base*(1+0.25*hash_(k)); d=0.07+0.05*hash_(k+3); add(chirp(f,f*(1.1 if k%3 else 0.85),d),tp,g); tp+=d+0.03; k+=1
blabla(7.9,24.4); blabla(34.0,38.0)
bouncy(7.7,12.4,0.1,0,0.26)
add(thud(0.1,400),10.1,0.2); add(chirp(1200,600,0.3),10.2,0.15)
# una hora después: reloj acelerado
for k in np.arange(12.6,17.0,0.12): tick(k,0.18)
suspense(12.4,19.0,0.1)
# te dejo: alegría
fanfare(19.4,0.3); bouncy(19.2,22.0,0.14,5,0.2); jingle(20.0,0.12)
# spoiler
bouncy(24.6,27.0,0.12,7,0.18)
add(thud(0.4,70),27.0,0.6); add(noise_burst(0.4,0.6,0.08),27.0,0.4); horn(27.05,0.5,0.3)
add(noise_burst(0.5,0.4,0.05),27.4,0.15)
sadtrombone(28.2,0.35)
# vuelve a sonar
for k in np.arange(31.3,33.9,0.9): buzz(k,0.45,0.32)
add(chirp(500,1500,0.35),31.4,0.25); add(thud(0.3,90),31.45,0.45)
add(thud(0.04,1800),33.9,0.35)
save('audio.wav')
