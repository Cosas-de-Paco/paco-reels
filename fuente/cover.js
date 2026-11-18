const { chromium } = require('playwright'); const path=require('path');
(async()=>{const [,,scene,t,text,n,out]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.error('ERR',e.message));
await p.goto('file://'+path.resolve(scene));await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>document.fonts.load('600 40px Fredoka'));
await p.evaluate(([t,text,n])=>{for(let i=20;i>=0;i--) window.draw(t-i/30); ctx=MAINCTX;ctx.setTransform(1,0,0,1,0,0);caption2(text,3,0,9,240);partBadge(n);},[Number(t),text,Number(n)]);
await (await p.$('#c')).screenshot({path:out,type:'jpeg',quality:92});await b.close();})();
