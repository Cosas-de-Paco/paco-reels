const { chromium } = require('playwright'); const path=require('path');
(async()=>{const [,,url,out]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.error('ERR',e.message));
await p.goto(url);await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>window.draw(1));await (await p.$('#c')).screenshot({path:out});await b.close();})();
