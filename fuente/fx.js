// Modern finishing pass for the Paco reels: camera, depth of field, rim light,
// soft shadows, bloom, colour grade, grain, kinetic captions and transitions.
const FONT = '"Fredoka", "DejaVu Sans", sans-serif';
const MAINCTX = ctx;
function mkCanvas(w = W, h = H) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; }
const LY = { bg: mkCanvas(), ch: mkCanvas(), fg: mkCanvas(), tmp: mkCanvas(), half: mkCanvas(W / 2, H / 2), q: mkCanvas(W / 4, H / 4), q2: mkCanvas(W / 4, H / 4) };

// ---------- easing
const easeOutBack = (p, s = 1.7) => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);
const spring = p => p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.exp(-6 * p) * Math.cos(p * 11);
const smooth = p => p * p * (3 - 2 * p);

// ---------- camera: CAM = {x, y, z, r} (look-at point, zoom, roll)
let CAM = { x: 540, y: 960, z: 1, r: 0 };
function setCam(c) { CAM = Object.assign({ x: 540, y: 960, z: 1, r: 0 }, c); }
function camLerp(a, b, p) { return { x: lerp(a.x ?? 540, b.x ?? 540, p), y: lerp(a.y ?? 960, b.y ?? 960, p), z: lerp(a.z ?? 1, b.z ?? 1, p), r: lerp(a.r ?? 0, b.r ?? 0, p) }; }
function applyCam(par = 1) {
  const z = 1 + (CAM.z - 1) * par;
  ctx.translate(W / 2, H / 2); ctx.rotate(CAM.r * par); ctx.scale(z, z);
  ctx.translate(-(540 + (CAM.x - 540) * par), -(960 + (CAM.y - 960) * par));
}
function shakeCam(t, amt) { CAM.x += Math.sin(t * 61) * amt; CAM.y += Math.cos(t * 47) * amt; CAM.r += Math.sin(t * 33) * amt * 0.0012; }

function onLayer(cv, fn, par = 1) {
  const prev = ctx; ctx = cv.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.save(); applyCam(par); fn(); ctx.restore();
  ctx = prev;
}
function blurInto(dst, src, px, scale = 0.5) {
  // cheap blur: draw at reduced size with a blur filter, then scale back up
  const sm = scale === 0.5 ? LY.half : LY.q; const sc = sm.getContext('2d');
  sc.setTransform(1, 0, 0, 1, 0, 0); sc.clearRect(0, 0, sm.width, sm.height);
  sc.filter = px > 0 ? `blur(${px * scale}px)` : 'none'; sc.drawImage(src, 0, 0, sm.width, sm.height); sc.filter = 'none';
  dst.drawImage(sm, 0, 0, W, H);
}

// rim light: a coloured crescent on the edges facing the light (dir = [dx, dy] towards the light)
function rimLight(cv, col, a, dir = [-1, -1], width = 7) {
  const tc = LY.tmp.getContext('2d');
  tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalCompositeOperation = 'source-over'; tc.clearRect(0, 0, W, H);
  tc.drawImage(cv, 0, 0); tc.globalCompositeOperation = 'source-in'; tc.fillStyle = col; tc.fillRect(0, 0, W, H);
  tc.globalCompositeOperation = 'destination-out'; tc.drawImage(cv, -dir[0] * width, -dir[1] * width);
  tc.globalCompositeOperation = 'source-over';
  const c2 = cv.getContext('2d'); c2.save(); c2.setTransform(1, 0, 0, 1, 0, 0); c2.globalCompositeOperation = 'source-atop'; c2.globalAlpha = a; c2.drawImage(LY.tmp, 0, 0); c2.restore();
}

// ---------- the frame composer
// opt: {bg(fn), ch(fn), fg(fn), dof (px blur on bg), fgBlur, rim:{col,a,dir}, shadow, grade:{top,bot,a}, bloom, vig, grain, light:[{x,y,r,col,a}]}
function compose(t, opt) {
  ctx = MAINCTX; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  // background (slight parallax and depth of field)
  if (opt.bg) {
    onLayer(LY.bg, () => opt.bg(t), opt.bgPar ?? 0.85);
    if (opt.dof) blurInto(ctx, LY.bg, opt.dof); else ctx.drawImage(LY.bg, 0, 0);
  }
  if (opt.mid) { ctx.save(); applyCam(1); opt.mid(t); ctx.restore(); }
  // characters with rim light and a soft drop shadow
  if (opt.ch) {
    onLayer(LY.ch, () => opt.ch(t), 1);
    const rim = opt.rim === undefined ? { col: '#FFE9C2', a: 0.75 } : opt.rim;
    if (rim) rimLight(LY.ch, rim.col, rim.a, rim.dir || [-1, -1], rim.w || 7);
    const sh = opt.shadow ?? 0.32;
    if (sh > 0) {
      const sc = LY.q.getContext('2d'); sc.setTransform(1, 0, 0, 1, 0, 0); sc.clearRect(0, 0, W / 4, H / 4);
      sc.filter = 'blur(5px) brightness(0)'; sc.drawImage(LY.ch, 4, 6, W / 4, H / 4); sc.filter = 'none';
      ctx.save(); ctx.globalAlpha = sh; ctx.drawImage(LY.q, 0, 0, W, H); ctx.restore();
    }
    ctx.drawImage(LY.ch, 0, 0);
  }
  // foreground (closer to camera, a bit blurred)
  if (opt.fg) {
    onLayer(LY.fg, () => opt.fg(t), opt.fgPar ?? 1.12);
    if (opt.fgBlur) blurInto(ctx, LY.fg, opt.fgBlur); else ctx.drawImage(LY.fg, 0, 0);
  }
  if (opt.over) { ctx.save(); applyCam(1); opt.over(t); ctx.restore(); }
  // lights (additive)
  if (opt.light) for (const L of opt.light) {
    ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r);
    g.addColorStop(0, L.col.replace('A', L.a)); g.addColorStop(1, L.col.replace('A', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  // colour grade (soft-light gradient)
  const gr = opt.grade || { top: '#FFD7A8', bot: '#5B6FD0', a: 0.35 };
  if (gr) {
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = gr.a;
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, gr.top); g.addColorStop(1, gr.bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  // bloom
  const bl = opt.bloom ?? 0.28;
  if (bl > 0) {
    const sc = LY.q.getContext('2d'); sc.setTransform(1, 0, 0, 1, 0, 0); sc.clearRect(0, 0, W / 4, H / 4);
    sc.filter = 'brightness(0.75) contrast(2.2) blur(7px)'; sc.drawImage(ctx.canvas, 0, 0, W / 4, H / 4); sc.filter = 'none';
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = bl; ctx.drawImage(LY.q, 0, 0, W, H); ctx.restore();
  }
  vignette2(opt.vig ?? 0.42);
}
function vignette2(a) {
  const g = ctx.createRadialGradient(540, 900, 380, 540, 960, 1200); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(12,6,24,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
// film grain: a small noise tile, offset every frame
const GRAIN = (() => { const cv = mkCanvas(256, 256), g = cv.getContext('2d'), id = g.createImageData(256, 256);
  let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() - 0.5) * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
  g.putImageData(id, 0, 0); return cv; })();
function grain(t, a = 0.07) {
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a;
  const ox = Math.floor((Math.sin(t * 97) * 0.5 + 0.5) * 256), oy = Math.floor((Math.cos(t * 71) * 0.5 + 0.5) * 256);
  ctx.translate(-ox, -oy); ctx.fillStyle = ctx.createPattern(GRAIN, 'repeat'); ctx.fillRect(0, 0, W + 512, H + 512); ctx.restore();
}

// ---------- transitions (call after compose, on the main canvas)
function flash(t, t0, d = 0.25, col = '255,255,255') { const p = prog(t, t0, t0 + d); if (p <= 0 || p >= 1) return; ctx.fillStyle = `rgba(${col},${(1 - p) * 0.8})`; ctx.fillRect(0, 0, W, H); }
function irisIn(t, t0, d = 0.5, x = 540, y = 960) { // black circle opening
  const p = prog(t, t0, t0 + d); if (p >= 1) return;
  ctx.save(); ctx.fillStyle = '#120A1E'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(x, y, Math.max(1, easeIn(p) * 1400), 0, Math.PI * 2, true); ctx.fill('evenodd'); ctx.restore();
}
function irisOut(t, t0, d = 0.5, x = 540, y = 960) {
  const p = prog(t, t0, t0 + d); if (p <= 0) return;
  ctx.save(); ctx.fillStyle = '#120A1E'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(x, y, Math.max(1, (1 - easeOut(p)) * 1400), 0, Math.PI * 2, true); ctx.fill('evenodd'); ctx.restore();
}
// whip pan: horizontal smear around a cut at tc (draw after compose)
function whip(t, tc, d = 0.18) {
  const p = 1 - Math.abs(t - tc) / d; if (p <= 0) return;
  const tc2 = LY.tmp.getContext('2d'); tc2.setTransform(1, 0, 0, 1, 0, 0); tc2.globalCompositeOperation = 'copy'; tc2.drawImage(ctx.canvas, 0, 0); tc2.globalCompositeOperation = 'source-over';
  ctx.save(); for (let i = 1; i <= 6; i++) { ctx.globalAlpha = 0.22; ctx.drawImage(LY.tmp, (t < tc ? -1 : 1) * i * 40 * p, 0); } ctx.restore();
}

// ---------- typography
function fontPx(px, w = 600) { return `${w} ${px}px ${FONT}`; }
// kinetic caption: words pop in one by one; *word* gets the accent highlight
function caption2(text, t, t0, t1, y = 270, acc = '#FFD23F') {
  if (t < t0 || t > t1) return;
  const out = 1 - prog(t, t1 - 0.25, t1);
  const lines = text.split('\n');
  ctx.save(); ctx.font = fontPx(70, 600); ctx.textBaseline = 'middle';
  const lh = 90; const words = [];
  let wi = 0; const sp = ctx.measureText(' ').width;
  lines.forEach((ln, li) => {
    const ws = ln.split(' ').map(w => ({ w: w.replace(/\*/g, ''), hl: /^\*.*\*$/.test(w) }));
    const tw = ws.reduce((s, x) => s + ctx.measureText(x.w).width, 0) + sp * (ws.length - 1);
    let x = 540 - tw / 2;
    ws.forEach(x0 => { const mw = ctx.measureText(x0.w).width; words.push({ ...x0, x: x + mw / 2, y: y + li * lh, mw, i: wi++ }); x += mw + sp; });
  });
  // backing card
  const maxW = Math.max(...lines.map(l => ctx.measureText(l.replace(/\*/g, '')).width));
  const cardP = easeOutBack(prog(t, t0, t0 + 0.3));
  ctx.globalAlpha = out;
  ctx.save(); ctx.translate(540, y + (lines.length - 1) * lh / 2); ctx.scale(cardP, cardP);
  ctx.shadowColor = 'rgba(10,5,30,0.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  roundRect(-maxW / 2 - 46, -lines.length * lh / 2 - 22, maxW + 92, lines.length * lh + 44, 40); ctx.fillStyle = 'rgba(255,255,255,0.96)'; ctx.fill();
  ctx.restore();
  for (const wd of words) {
    const p = prog(t, t0 + 0.12 + wd.i * 0.07, t0 + 0.42 + wd.i * 0.07); if (p <= 0) continue;
    const s = easeOutBack(p, 2.4);
    ctx.save(); ctx.translate(wd.x, wd.y + (1 - p) * 20); ctx.scale(s, s);
    if (wd.hl) { ctx.fillStyle = acc; roundRect(-wd.mw / 2 - 12, -38, wd.mw + 24, 74, 18); ctx.fill(); }
    ctx.fillStyle = '#231A2E'; ctx.textAlign = 'center'; ctx.fillText(wd.w, 0, 3); ctx.restore();
  }
  ctx.restore();
}
// big onomatopoeia with gradient, thick outline and pop
function boom(text, x, y, size, c1, c2, t, t0, rot = 0, life = 1.2) {
  if (t < t0 || t > t0 + life) return;
  const p = prog(t, t0, t0 + 0.35), out = 1 - prog(t, t0 + life - 0.2, t0 + life);
  const s = spring(p) * (1 + Math.sin(t * 22) * 0.02);
  ctx.save(); ctx.globalAlpha = out; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.font = fontPx(size, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(20,10,40,0.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12;
  ctx.lineWidth = size * 0.26; ctx.strokeStyle = '#231A2E'; ctx.strokeText(text, 0, 0); ctx.shadowColor = 'transparent';
  ctx.lineWidth = size * 0.1; ctx.strokeStyle = '#fff'; ctx.strokeText(text, 0, 0);
  const g = ctx.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillText(text, 0, 0);
  ctx.restore();
}
// speech bubble with tail pointing to (tx, ty)
function bubble2(x, y, text, t, t0, t1, tx, ty, size = 54) {
  if (t < t0 || t > t1) return;
  const p = easeOutBack(prog(t, t0, t0 + 0.3), 2), out = 1 - prog(t, t1 - 0.15, t1);
  ctx.save(); ctx.globalAlpha = out; ctx.font = fontPx(size, 600);
  const lines = text.split('\n'); const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 70, h = lines.length * size * 1.25 + 44;
  ctx.translate(x, y); ctx.scale(p, p);
  ctx.shadowColor = 'rgba(10,5,30,0.3)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#fff'; ctx.beginPath(); roundRect(-w / 2, -h / 2, w, h, 36); ctx.fill();
  if (tx !== undefined) { const dx = (tx - x), dy = (ty - y); ctx.beginPath(); ctx.moveTo(-26, h / 2 - 6); ctx.lineTo(dx * 0.45 / p, dy * 0.45 / p); ctx.lineTo(26, h / 2 - 6); ctx.closePath(); ctx.fill(); }
  ctx.shadowColor = 'transparent'; ctx.fillStyle = '#231A2E'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * size * 1.25 + 3));
  ctx.restore();
}
// title card with blurred frame behind
function titleCard(t, t0, d, big, small, acc = '#FF9A3C') {
  const p = prog(t, t0, t0 + 0.45), q = 1 - prog(t, t0 + d - 0.35, t0 + d); const a = Math.min(p, q); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const tc = LY.tmp.getContext('2d'); tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalCompositeOperation = 'copy'; tc.drawImage(ctx.canvas, 0, 0); tc.globalCompositeOperation = 'source-over';
  blurInto(ctx, LY.tmp, 18, 0.25); ctx.fillStyle = 'rgba(25,12,45,0.35)'; ctx.fillRect(0, 0, W, H);
  const s = easeOutBack(p, 2);
  ctx.translate(540, 900); ctx.scale(s, s); ctx.rotate(-0.04);
  ctx.font = fontPx(126, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(10,5,30,0.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14;
  ctx.lineWidth = 30; ctx.strokeStyle = '#231A2E'; ctx.strokeText(big, 0, 0); ctx.shadowColor = 'transparent';
  const g = ctx.createLinearGradient(0, -60, 0, 60); g.addColorStop(0, '#FFF3B0'); g.addColorStop(1, acc); ctx.fillStyle = g; ctx.fillText(big, 0, 0);
  ctx.rotate(0.04); ctx.font = fontPx(66, 600); ctx.fillStyle = '#fff'; ctx.fillText(small, 0, 130);
  ctx.restore();
}

// ---------- particles
function hash(i) { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); }
function dust(t, n = 30, col = '255,240,210', area = [0, 0, W, H]) {
  for (let i = 0; i < n; i++) {
    const x = area[0] + ((hash(i) * area[2] + t * 12 * (hash(i + 9) - 0.5) + Math.sin(t * 0.7 + i) * 20) % area[2] + area[2]) % area[2];
    const y = area[1] + ((hash(i + 3) * area[3] - t * 18 * hash(i + 5)) % area[3] + area[3]) % area[3];
    const r = 2 + hash(i + 7) * 5, a = 0.25 + 0.35 * Math.sin(t * 2 + i);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  }
}
function puff(x, y, r, a, col = '230,230,235') { // soft smoke ball
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(0.6, `rgba(${col},${a * 0.7})`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
function smoke(t, x, y, amount = 1, col = '120,115,125', spread = 1) {
  for (let i = 0; i < 14 * amount; i++) {
    const life = ((t * 0.6 + hash(i) ) % 1);
    const px = x + (hash(i + 1) - 0.5) * 80 * spread + Math.sin(t * 2 + i) * 30 * life;
    const py = y - life * 520;
    puff(px, py, 40 + life * 140, 0.45 * (1 - life) * Math.min(1, life * 5), col);
  }
}
function confetti(t, t0, n = 60) {
  if (t < t0) return; const dt = t - t0;
  const cols = ['#FFD23F', '#FF5D73', '#3FC1C9', '#8A5CF6', '#5CD65C'];
  for (let i = 0; i < n; i++) {
    const x = 540 + (hash(i) - 0.5) * 1200 + Math.sin(dt * 3 + i) * 30, y = -50 + dt * (300 + hash(i + 2) * 300) - 200 * hash(i + 4);
    if (y > H + 40) continue;
    ctx.save(); ctx.translate(x, y); ctx.rotate(dt * 5 * (hash(i + 6) - 0.5) * 2 + i); ctx.scale(1, Math.cos(dt * 8 + i));
    ctx.fillStyle = cols[i % 5]; ctx.fillRect(-10, -6, 20, 12); ctx.restore();
  }
}
function speedLines(t, cx, cy, a = 0.5, n = 28) { // radial anime lines
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff';
  for (let i = 0; i < n; i++) { const an = i / n * Math.PI * 2 + hash(i) * 0.2, r0 = 380 + hash(i + Math.floor(t * 12)) * 160, w = 0.012 + hash(i + 3) * 0.015;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(an - w) * r0, cy + Math.sin(an - w) * r0); ctx.lineTo(cx + Math.cos(an) * 1600, cy + Math.sin(an) * 1600); ctx.lineTo(cx + Math.cos(an + w) * r0, cy + Math.sin(an + w) * r0); ctx.fill(); }
  ctx.restore();
}
function heartsPop(x, y, t, t0, n = 6) {
  if (t < t0) return;
  for (let i = 0; i < n; i++) { const p = ((t - t0) * 0.7 + i / n) % 1; const hx = x + Math.sin(i * 2.1 + t * 2) * 120, hy = y - p * 400, s = (1 - p) * 1.1 * easeOutBack(Math.min(1, p * 5));
    ctx.save(); ctx.globalAlpha = 1 - p; ctx.translate(hx, hy); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, 18);
    ctx.bezierCurveTo(-40, -10, -22, -42, 0, -20); ctx.bezierCurveTo(22, -42, 40, -10, 0, 18); fillLine('#FF5D73', 5); ctx.restore(); }
}
// generic soft ground contact shadow
function contact(x, y, rx, a = 0.3) { const g = ctx.createRadialGradient(x, y, 0, x, y, rx); g.addColorStop(0, `rgba(20,10,30,${a})`); g.addColorStop(1, 'rgba(20,10,30,0)'); ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.18); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.fillRect(x - rx, y - rx, rx * 2, rx * 2); ctx.restore(); }
function walkCycle(t, sp, amp, k = 1) {
  const p = Math.sin(t * sp);
  return { footL: [-55 * k + p * amp, -Math.max(0, p) * amp * 0.5], footR: [55 * k - p * amp, -Math.max(0, -p) * amp * 0.5], bob: Math.abs(p) * amp * 0.3 };
}
