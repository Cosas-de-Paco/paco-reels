import sys,glob
from PIL import Image
fs=sorted(glob.glob(sys.argv[1]+'/t*.png')); cols=int(sys.argv[3]) if len(sys.argv)>3 else 4
w,h=360,640; rows=(len(fs)+cols-1)//cols
im=Image.new('RGB',(w*cols,h*rows),'white')
for i,f in enumerate(fs): im.paste(Image.open(f).convert('RGB').resize((w,h)),((i%cols)*w,(i//cols)*h))
im.save(sys.argv[2])
