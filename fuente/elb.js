const { chromium } = require('playwright'); const path=require('path');
(async()=>{const [,,scene,secs]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.resolve(scene));await p.evaluate(()=>document.fonts.ready);
const res=await p.evaluate((secs)=>{const out=[];let prev=null;for(let i=0;i<secs*30;i+=1){const t=i/30;window.ELBOWLOG=[];window.draw(t);const cur=window.ELBOWLOG.slice();
 if(prev&&prev.length===cur.length){cur.forEach((e,k)=>{const q=prev[k];const d=Math.hypot(e[1]-q[1],e[2]-q[2]);if(d>60)out.push(t.toFixed(2)+' arm'+k+' jump '+d.toFixed(0));});}prev=cur;}return out;},Number(secs));
console.log(res.join('\n'));await b.close();})();
