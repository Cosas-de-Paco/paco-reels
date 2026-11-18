// usage: node render2.js scene.html seconds fps outdir [from to] | --at t1 t2 ...
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [,, scene, secs, fps, outdir, ...rest] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('ERR', e.message));
  p.on('console', m => console.log('LOG', m.text()));
  await p.goto('file://' + path.resolve(scene));
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => document.fonts.load('600 40px Fredoka'));
  const n = Math.round(Number(secs) * Number(fps));
  let list;
  if (rest[0] === '--at') list = rest.slice(1).map(Number).map(t => [t, `t${String(Math.round(t * 100)).padStart(4, '0')}`]);
  else { const a = rest.length ? Number(rest[0]) : 0, z = rest.length ? Number(rest[1]) : n; list = []; for (let i = a; i < Math.min(z, n); i++) list.push([i / Number(fps), `f${String(i).padStart(4, '0')}`]); }
  const el = await p.$('#c');
  if (rest[0] !== '--at' && list.length) { const f0 = Math.round(list[0][0] * Number(fps)); for (let i = Math.max(0, f0 - 20); i < f0; i++) await p.evaluate(t => window.draw(t), i / Number(fps)); }
  for (const [t, name] of list) {
    await p.evaluate(t => window.draw(t), t);
    await el.screenshot({ path: `${outdir}/${name}.${rest[0] === '--at' ? 'png' : 'jpg'}`, type: rest[0] === '--at' ? 'png' : 'jpeg', quality: rest[0] === '--at' ? undefined : 94 });
  }
  await b.close();
})();
