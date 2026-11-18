// Props and sets for reels 20-23 (termostato, estoy llegando, aparcamiento, Black Friday). Loaded after anim.js.
OUTFITS.abuelaManta = OUTFITS.abuela;
OUTFITS.pacoCalor = { top: '#F2F0E6', legs: '#3D5A86', shoe: { top: '#F6F6F2', sole: '#E2473A' }, kind: 'polo', short: true };
OUTFITS.amigo1 = { top: '#E8473A', legs: '#2E3A55', shoe: { top: '#F6F6F2', sole: '#2F8FD6' }, kind: 'polo' };
OUTFITS.amiga = { top: '#8A5CF6', legs: '#2A2235', shoe: { top: '#F6F6F2', sole: '#FF5D73' }, kind: 'polo' };
OUTFITS.camarero = { top: '#F4F4F0', legs: '#22222A', shoe: { top: '#2A1E1A', sole: '#111' }, kind: 'shirt' };
OUTFITS.ducha = { top: STYLES.paco.skin, legs: STYLES.paco.skin, shoe: { top: STYLES.paco.skin, sole: STYLES.paco.skin }, kind: 'skin', short: true };
OUTFITS.pacoCalle = { top: '#E2722B', legs: '#3D5A86', shoe: { top: '#F6F6F2', sole: '#E2473A' }, kind: 'hoodie' };
STYLES.amigo = Object.assign({}, STYLES.monitor);

// ---------- thermostat on the wall. temp shown; locked: tape + padlock; cold: frost bag on it
function thermostat(x, y, s, temp, o = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  roundRect(-150, -190, 300, 380, 40); fillLine(lgrad(-150, 150, '#F4F4F0'), 9);
  roundRect(-110, -150, 220, 130, 18); ctx.fillStyle = '#16202C'; ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 6; ctx.stroke();
  const col = o.col || (temp >= 23 ? '#FF8A4A' : temp <= 15 ? '#7AD0FF' : '#7CFFB2');
  ctx.font = fontPx(96, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.fillStyle = col; ctx.fillText(Math.round(temp) + '°', 0, -82); ctx.shadowBlur = 0;
  for (const [bx, sym] of [[-60, '–'], [60, '+']]) { const pr = o.press === sym ? 1 : 0; ell(bx, 80 + pr * 6, 46, 46); fillLine(rgrad(bx, 80, 46, pr ? '#D8D8D0' : '#FFFFFF'), 7); lab(sym, bx, 78 + pr * 6, 70, '#16100F'); }
  if (o.flame) { ctx.save(); ctx.translate(100, -20); ctx.scale(0.6, 0.6); flameIcon(0, 0); ctx.restore(); }
  ctx.restore();
  if (o.locked) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const L = o.locked;
    ctx.globalAlpha = Math.min(1, L * 1.5);
    for (const [yy, r] of [[30, -0.18], [110, 0.12], [-10, 0.32]]) { if (L < 0.2 && yy !== 30) continue; ctx.save(); ctx.rotate(r); roundRect(-200, yy - 30, 400, 60, 6); fillLine('rgba(170,175,185,0.95)', 5); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; for (let k = -180; k < 200; k += 26) { ctx.beginPath(); ctx.moveTo(k, yy - 26); ctx.lineTo(k + 10, yy + 26); ctx.stroke(); } ctx.restore(); }
    ctx.globalAlpha = 1; if (L >= 0.9) padlock(70, 190, 1.1, o.lockSwing || 0); ctx.restore(); }
  if (o.bag) { const b = o.bag; peasBag(x + (b.dx || 0), y + (b.dy ?? 137) * s, s * (b.s || 1.0), b.rot || -0.08); }
}
function flameIcon(x, y) { ctx.beginPath(); ctx.moveTo(x, y - 60); ctx.bezierCurveTo(x + 50, y - 10, x + 45, y + 45, x, y + 50); ctx.bezierCurveTo(x - 45, y + 45, x - 50, y - 10, x, y - 60); fillLine(lgrad(x - 45, x + 45, '#FF7A2E'), 5); ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.bezierCurveTo(x + 22, y + 15, x + 20, y + 40, x, y + 42); ctx.bezierCurveTo(x - 20, y + 40, x - 22, y + 15, x, y - 10); ctx.fillStyle = '#FFE14D'; ctx.fill(); }
function padlock(x, y, s, swing = 0) { ctx.save(); ctx.translate(x, y - 120 * s); ctx.rotate(swing); ctx.translate(0, 120 * s); ctx.scale(s, s);
  ctx.strokeStyle = LINE; ctx.lineWidth = 34; ctx.beginPath(); ctx.arc(0, -70, 48, Math.PI, 0); ctx.lineTo(48, -40); ctx.moveTo(-48, -40); ctx.lineTo(-48, -70); ctx.stroke();
  ctx.strokeStyle = '#C9CED6'; ctx.lineWidth = 20; ctx.stroke();
  roundRect(-80, -50, 160, 130, 22); fillLine(lgrad(-80, 80, '#F2C23A'), 8); ell(0, 0, 14, 14); ctx.fillStyle = LINE; ctx.fill(); ctx.fillRect(-6, 0, 12, 34); ctx.restore(); }
function smallKey(x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ell(0, 0, 26, 26); fillLine('#F2C23A', 6); ell(0, 0, 9, 9); ctx.fillStyle = LINE; ctx.fill();
  roundRect(20, -8, 80, 16, 4); fillLine('#F2C23A', 5); ctx.fillStyle = '#F2C23A'; ctx.fillRect(80, 6, 10, 14); ctx.fillRect(64, 6, 8, 10); ctx.restore(); }
function peasBag(x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-150, -150); ctx.quadraticCurveTo(0, -170, 150, -150); ctx.lineTo(160, 140); ctx.quadraticCurveTo(0, 175, -160, 140); ctx.closePath(); fillLine(lgrad(-160, 160, '#4FA3E8'), 8);
  ctx.fillStyle = '#5CC25C'; for (let i = 0; i < 9; i++) { ell(-70 + (i % 3) * 70, 30 + Math.floor(i / 3) * 38, 22, 22); ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 4; ctx.stroke(); }
  lab('GUISANTES', 0, -80, 44, '#FFFFFF'); ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 6; i++) { ell(-130 + hash(i) * 260, -150 + hash(i + 7) * 300, 8, 8); ctx.fill(); } ctx.restore(); }
function radiator(x, y, s, hot = 0, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const col = hot > 0.5 ? '#FF9A7A' : '#F4F4F0';
  for (let i = 0; i < 7; i++) { roundRect(-210 + i * 60, -260, 52, 260, 22); fillLine(lgrad(-210 + i * 60, -158 + i * 60, col), 6); }
  ctx.restore();
  if (hot > 0) for (let i = 0; i < 5; i++) { const p = (t * 0.8 + i / 5) % 1; ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI) * hot * 0.8; ctx.strokeStyle = '#FF7A3A'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    const bx = x - 150 * s + i * 75 * s, by = y - 280 * s - p * 220; ctx.beginPath(); ctx.moveTo(bx, by); ctx.bezierCurveTo(bx + 30, by - 30, bx - 30, by - 60, bx, by - 90); ctx.stroke(); ctx.restore(); }
}
function sofa(x, y, s, col = '#C0564A') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  roundRect(-420, -430, 840, 300, 60); fillLine(lgrad(-420, 420, col), 8);
  roundRect(-400, -200, 800, 150, 40); fillLine(lgrad(-400, 400, shade(col, 0.1)), 8);
  for (const sx of [-1, 1]) { roundRect(sx * 400 - 70, -330, 140, 300, 50); fillLine(lgrad(sx * 400 - 70, sx * 400 + 70, shade(col, -0.08)), 8); }
  ctx.fillStyle = LINE; ctx.fillRect(-360, -50, 24, 50); ctx.fillRect(336, -50, 24, 50); ctx.restore(); }
// a blanket wrapped around a seated/standing person: draw after the character, covering the body
function manta(x, y, w, h, col = '#E8798F', t = 0) { ctx.beginPath(); ctx.moveTo(x - w * 0.45, y - h); ctx.quadraticCurveTo(x, y - h - 40, x + w * 0.45, y - h);
  ctx.quadraticCurveTo(x + w * 0.62, y - h * 0.4, x + w * 0.55 + Math.sin(t * 2) * 6, y); ctx.lineTo(x - w * 0.55 + Math.sin(t * 2 + 1) * 6, y); ctx.quadraticCurveTo(x - w * 0.62, y - h * 0.4, x - w * 0.45, y - h); ctx.closePath();
  fillLine(lgrad(x - w * 0.6, x + w * 0.6, col), 8);
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 14; for (let i = -6; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x - w, y - h + i * 70); ctx.lineTo(x + w, y - h + i * 70 + 200); ctx.stroke(); } ctx.restore();
  ctx.beginPath(); ctx.moveTo(x - 30, y - h * 0.95); ctx.quadraticCurveTo(x + 10, y - h * 0.5, x - 10, y - h * 0.1); ctx.strokeStyle = shade(col, -0.3); ctx.lineWidth = 6; ctx.stroke(); }
function livingBG(hot = 0) { wall(hot > 0.5 ? '#F7C99A' : '#CFE0D8', 1500);
  roundRect(560, 380, 400, 460, 10); fillLine(hot > 0.5 ? '#FFE0A0' : '#BFE6FF', 10); ctx.strokeStyle = LINE; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(760, 380); ctx.lineTo(760, 840); ctx.moveTo(560, 610); ctx.lineTo(960, 610); ctx.stroke();
  if (hot < 0.5) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 14; i++) ell(580 + hash(i) * 360, 400 + hash(i + 3) * 420, 6, 6); ctx.fill(); }
  frame(120, 420, 260, 320, () => { ctx.fillStyle = '#F2D06A'; ctx.fillRect(120, 420, 260, 320); ell(250, 560, 70, 80); fillLine('#F1C4A2', 5); lab('ABU', 250, 690, 40, '#16100F'); });
  floorWood(1500); ctx.fillStyle = '#E8798F'; ell(540, 1690, 520, 90); ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 6; ctx.stroke(); }
function billPaper(x, y, s, rot, amount = '180 €') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); roundRect(-100, -140, 200, 280, 8); fillLine('#FFFFFF', 6);
  lab('LUZ', 0, -100, 40, '#E8473A'); ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 4; i++) ctx.fillRect(-70, -60 + i * 26, 140 - (i % 2) * 40, 10); lab(amount, 0, 90, 46, '#16100F'); ctx.restore(); }
function fridge(x, y, s, open = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  roundRect(-170, -820, 340, 820, 30); fillLine(lgrad(-170, 170, '#E8EEF4'), 9);
  if (open > 0) { ctx.fillStyle = '#DFF4FF'; roundRect(-150, -800, 300, 300, 10); ctx.fill(); ctx.fillStyle = 'rgba(180,230,255,0.6)'; for (let i = 0; i < 5; i++) ell(-100 + i * 50, -650 + Math.sin(i) * 30, 30, 20); ctx.fill(); }
  ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-170, -500); ctx.lineTo(170, -500); ctx.stroke();
  if (open > 0) { ctx.save(); ctx.translate(170, -500); ctx.scale(1 - open * 0.8, 1); roundRect(0, -300, 40 + 300 * (1 - open), 300, 10); fillLine('#D8E2EC', 7); ctx.restore(); }
  roundRect(120, -460, 20, 120, 8); fillLine('#B8C2CC', 4); if (!open) { roundRect(120, -660, 20, 100, 8); fillLine('#B8C2CC', 4); }
  ctx.restore(); }

// ---------- phone chat UI, big (close-up). msgs: [{me, text, time, a}] a = appear 0..1
function chatScreen(x, y, s, title, msgs, o = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  roundRect(-330, -620, 660, 1240, 70); fillLine('#1C1C26', 10);
  ctx.save(); roundRect(-300, -590, 600, 1180, 46); ctx.clip();
  ctx.fillStyle = '#ECE5DD'; ctx.fillRect(-300, -590, 600, 1180);
  ctx.fillStyle = 'rgba(0,0,0,0.04)'; for (let i = 0; i < 40; i++) { ell(-280 + hash(i) * 560, -560 + hash(i + 2) * 1120, 14, 14); ctx.fill(); }
  ctx.fillStyle = '#128C7E'; ctx.fillRect(-300, -590, 600, 150);
  ell(-220, -505, 40, 40); fillLine('#FFD23F', 4); lab(o.ini || 'A', -220, -503, 40, '#16100F');
  ctx.fillStyle = '#fff'; ctx.font = fontPx(44, 700); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(title, -160, -520);
  ctx.font = fontPx(28, 600); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillText(o.sub || 'Tú, Laura, Javi', -160, -475);
  let yy = -400;
  for (const m of msgs) { const a = m.a === undefined ? 1 : m.a; if (a <= 0) continue;
    const fs = m.big ? 64 : 52, lh = m.big ? 76 : 64; ctx.font = fontPx(fs, 600); const lines = m.text.split('\n'); const w = Math.min(560, Math.max(...lines.map(l => ctx.measureText(l).width)) + 60), h = lines.length * lh + 80 + (m.who ? 18 : 0);
    const bx = m.me ? 270 - w : -270; ctx.save(); ctx.globalAlpha = Math.min(1, a * 2); const sc = easeOutBack(Math.min(1, a), 2); ctx.translate(bx + (m.me ? w : 0), yy); ctx.scale(sc, sc); ctx.translate(-(m.me ? w : 0), 0);
    roundRect(0, 0, w, h, 22); ctx.fillStyle = m.me ? '#DCF8C6' : '#FFFFFF'; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 3; ctx.stroke();
    if (!m.me && m.who) { ctx.fillStyle = m.whoCol || '#E8473A'; ctx.font = fontPx(32, 700); ctx.textAlign = 'left'; ctx.fillText(m.who, 28, 30); }
    ctx.fillStyle = '#16100F'; ctx.font = fontPx(fs, 600); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, 30, 26 + (m.who ? 26 : 0) + (i + 0.5) * lh));
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.font = fontPx(28, 600); ctx.textAlign = 'right'; ctx.fillText(m.time + (m.me ? '  ✓✓' : ''), w - 20, h - 18);
    ctx.restore(); yy += h * Math.min(1, a * 1.5) + 28; }
  if (o.typing) { ctx.fillStyle = '#fff'; roundRect(-300, 470, 600, 120, 0); ctx.fill(); roundRect(-270, 495, 440, 70, 35); ctx.fillStyle = '#F2F2F2'; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#16100F'; ctx.font = fontPx(36, 600); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(o.typing, -240, 532); ell(230, 530, 42, 42); ctx.fillStyle = '#128C7E'; ctx.fill(); lab('➤', 232, 530, 40, '#fff'); }
  ctx.restore(); ctx.restore(); }
function bathroomBG() { wall('#BFE3EA', 1560); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 5; for (let y = 120; y < 1560; y += 120) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); } for (let x = -240; x < W + 300; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1560); ctx.stroke(); }
  ctx.fillStyle = '#E8F2F4'; ctx.fillRect(-300, 1560, W + 600, 700); ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-300, 1560); ctx.lineTo(W + 300, 1560); ctx.stroke(); }
function showerHead(x, y, t, on = 1) { ctx.strokeStyle = LINE; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(x + 260, y - 220); ctx.lineTo(x + 260, y - 60); ctx.quadraticCurveTo(x + 260, y - 10, x + 180, y - 10); ctx.stroke(); ctx.strokeStyle = '#C9CED6'; ctx.lineWidth = 12; ctx.stroke();
  ctx.save(); ctx.translate(x + 120, y); ctx.rotate(0.3); roundRect(-80, -30, 160, 60, 24); fillLine(lgrad(-80, 80, '#DDE2EA'), 7); ctx.restore();
  if (on) { ctx.strokeStyle = 'rgba(120,200,255,0.7)'; ctx.lineWidth = 5; for (let i = 0; i < 18; i++) { const p = (t * 3 + hash(i)) % 1, xx = x + 60 + i * 9 - p * 40, yy = y + 40 + p * 700; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx - 6, yy + 50); ctx.stroke(); } } }
function shampoo(x, y, R, t) { for (let i = 0; i < 9; i++) { const a = -Math.PI + i / 8 * Math.PI; const r = 34 + (i % 3) * 10; ell(x + Math.cos(a) * R * 0.85, y + Math.sin(a) * R * 0.75 - R * 0.35, r, r * 0.9); fillLine('#FFFFFF', 5); }
  for (let i = 0; i < 4; i++) { const p = (t * 0.5 + i / 4) % 1; ctx.save(); ctx.globalAlpha = 1 - p; ell(x - 80 + i * 60, y - R * 1.2 - p * 160, 18, 18); ctx.strokeStyle = 'rgba(120,180,220,0.9)'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); } }
function curtain(x0, x1, y0, y1, open = 0, col = '#FFD23F') { const w = (x1 - x0) * (1 - open * 0.75); ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 0; i <= 8; i++) { const xx = x0 + w * i / 8; ctx.lineTo(xx, y0); } ctx.lineTo(x0 + w, y1); for (let i = 8; i >= 0; i--) ctx.quadraticCurveTo(x0 + w * (i + 0.5) / 8, y1 + 20, x0 + w * i / 8, y1); ctx.closePath();
  fillLine(lgrad(x0, x0 + w, col), 7); ctx.strokeStyle = shade(col, -0.25); ctx.lineWidth = 5; for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(x0 + w * i / 8, y0 + 10); ctx.lineTo(x0 + w * i / 8, y1 - 10); ctx.stroke(); }
  ctx.strokeStyle = LINE; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x0 - 40, y0); ctx.lineTo(x1 + 40, y0); ctx.stroke(); }
function barBG(closed = 0, clockH = 20, clockM = 15) { wall('#7A4A3A', 1450); halftone(-300, 0, W + 600, 1450, 'rgba(0,0,0,0.12)', 30);
  roundRect(80, 380, 560, 220, 20); fillLine('#2A1A16', 8); lab('BAR MANOLO', 360, 490, 64, '#FFB84D');
  for (let i = 0; i < 6; i++) { roundRect(110 + i * 85, 700, 50, 150, 14); fillLine(['#3FA7A0', '#E8473A', '#F2D06A', '#5B7FD0', '#5CC25C', '#B98AD8'][i], 5); }
  ctx.strokeStyle = LINE; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(60, 860); ctx.lineTo(680, 860); ctx.stroke();
  wallClock(860, 520, 90, clockH, clockM);
  for (const lx of [300, 780]) { ctx.strokeStyle = LINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(lx, -300); ctx.lineTo(lx, 120); ctx.stroke(); ctx.beginPath(); ctx.moveTo(lx - 70, 200); ctx.quadraticCurveTo(lx, 80, lx + 70, 200); ctx.closePath(); fillLine(closed ? '#5A4A3A' : '#FFD27A', 6); }
  ctx.fillStyle = '#B07A4A'; ctx.fillRect(-300, 1450, W + 600, 800); ctx.strokeStyle = 'rgba(60,30,10,0.3)'; ctx.lineWidth = 5; for (let x = -280; x < W + 300; x += 130) { ctx.beginPath(); ctx.moveTo(x, 1450); ctx.lineTo(x - 80, 2000); ctx.stroke(); }
  ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-300, 1450); ctx.lineTo(W + 300, 1450); ctx.stroke(); }
function barTable(x, y, w = 760) { roundRect(x - w / 2, y, w, 50, 14); fillLine(lgrad(x - w / 2, x + w / 2, '#5A3A2A'), 8); ctx.fillStyle = LINE; ctx.fillRect(x - 14, y + 50, 28, 380); }
function beer(x, y, s, level = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-40, -150); ctx.lineTo(40, -150); ctx.lineTo(32, 0); ctx.lineTo(-32, 0); ctx.closePath(); ctx.fillStyle = 'rgba(230,240,255,0.5)'; ctx.fill();
  if (level > 0) { const ty = -140 * level; ctx.beginPath(); ctx.moveTo(-32 - 8 * level, ty); ctx.lineTo(32 + 8 * level, ty); ctx.lineTo(32, 0); ctx.lineTo(-32, 0); ctx.closePath(); ctx.fillStyle = '#F2B33A'; ctx.fill(); ell(0, ty, 38 * (0.8 + level * 0.2), 16); ctx.fillStyle = '#FFF8E8'; ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(-40, -150); ctx.lineTo(40, -150); ctx.lineTo(32, 0); ctx.lineTo(-32, 0); ctx.closePath(); ctx.strokeStyle = LINE; ctx.lineWidth = 6; ctx.stroke(); ctx.restore(); }
function cobweb(x, y, r) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 3; for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI / 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.stroke(); }
  for (let k = 1; k <= 4; k++) { ctx.beginPath(); for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI / 2, rr = r * k / 4; const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; if (i === 0) ctx.moveTo(px, py); else ctx.quadraticCurveTo(x + Math.cos(a - 0.13) * rr * 0.85, y + Math.sin(a - 0.13) * rr * 0.85, px, py); } ctx.stroke(); } ctx.restore(); }
function beard(o, len) { if (len <= 0) return; const [x, y, R] = headPos(o); ctx.beginPath(); ctx.moveTo(x - R * 0.85, y + R * 0.1); ctx.quadraticCurveTo(x - R * 0.9, y + R * (0.9 + len), x, y + R * (1.05 + len * 1.6)); ctx.quadraticCurveTo(x + R * 0.9, y + R * (0.9 + len), x + R * 0.85, y + R * 0.1);
  ctx.quadraticCurveTo(x + R * 0.5, y + R * 0.75, x + R * 0.25, y + R * 0.62); ctx.quadraticCurveTo(x, y + R * 0.5, x - R * 0.25, y + R * 0.62); ctx.quadraticCurveTo(x - R * 0.5, y + R * 0.75, x - R * 0.85, y + R * 0.1); ctx.closePath(); fillLine(lgrad(x - R, x + R, '#4A3020'), 6); }
function chairUp(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); roundRect(-80, -20, 160, 26, 8); fillLine('#8A5A3A', 5); ctx.fillStyle = LINE; for (const lx of [-70, 56]) ctx.fillRect(lx, -170, 14, 150); roundRect(-80, 6, 160, 120, 10); fillLine('#8A5A3A', 5); ctx.restore(); }
function mop(x, y, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#8A5A3A'; roundRect(-8, -420, 16, 420, 6); fillLine('#8A5A3A', 4); for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(i * 10, 0); ctx.quadraticCurveTo(i * 18, 50, i * 22, 90); ctx.strokeStyle = '#E8E2D4'; ctx.lineWidth = 12; ctx.stroke(); } ctx.restore(); }
function homeBG() { wall('#E8D5F0', 1500); frame(140, 400, 280, 340, () => { ctx.fillStyle = '#7FC8A9'; ctx.fillRect(140, 400, 280, 340); lab('HOME', 280, 570, 54, '#16100F'); });
  roundRect(600, 360, 300, 600, 14); fillLine('#BFE6FF', 9); ctx.save(); roundRect(600, 360, 300, 600, 14); ctx.clip(); ctx.fillStyle = '#E8F6FF'; ctx.fillRect(600, 360, 300, 600); ctx.restore(); ctx.strokeStyle = LINE; ctx.lineWidth = 8; roundRect(600, 360, 300, 600, 14); ctx.stroke();
  floorWood(1500); }
function sandwich(x, y, s, bite = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const [yy, c, h] of [[30, '#E8B46A', 26], [10, '#5CC25C', 14], [-6, '#E8473A', 14], [-26, '#E8B46A', 26]]) { roundRect(-90 + (bite ? 0 : 0), yy - h / 2, 180 - bite * 60, h, 10); fillLine(c, 5); } ctx.restore(); }
function sneaker(x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-90, -60); ctx.quadraticCurveTo(-40, -80, 0, -50); ctx.quadraticCurveTo(60, -40, 100, -10); ctx.lineTo(100, 0); ctx.closePath(); fillLine('#F6F6F2', 6); roundRect(-96, -10, 200, 22, 8); fillLine('#E2473A', 5); ctx.restore(); }
function doorSign(x, y, txt, col = '#E8473A', rot = 0.05) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); roundRect(-150, -60, 300, 120, 16); fillLine('#FFFFFF', 7); lab(txt, 0, 4, 58, col); ctx.restore(); }

// ---------- parking: apartment block with balconies (neighbours), cones, scoreboards
function blockBG(night = 0) { skyFill(night);
  roundRect(-200, -200, 1480, 1600, 0); fillLine(lgrad(-200, 1280, '#F2C29A'), 9);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const x = 60 + c * 340, y = 120 + r * 380; roundRect(x, y, 260, 300, 10); fillLine('#CFEFFF', 7); ctx.strokeStyle = LINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + 130, y); ctx.lineTo(x + 130, y + 300); ctx.stroke(); }
  ctx.fillStyle = '#C9C2B6'; ctx.fillRect(-600, 1380, W + 1200, 90); ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-600, 1380); ctx.lineTo(W + 600, 1380); ctx.moveTo(-600, 1470); ctx.lineTo(W + 600, 1470); ctx.stroke();
  ctx.fillStyle = '#6A6A78'; ctx.fillRect(-600, 1470, W + 1200, 900); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8; ctx.setLineDash([80, 70]); ctx.beginPath(); ctx.moveTo(-600, 1820); ctx.lineTo(W + 600, 1820); ctx.stroke(); ctx.setLineDash([]); }
function balconyRail(x, y, w) { ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke(); ctx.lineWidth = 5; for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(x + i * w / 10, y); ctx.lineTo(x + i * w / 10, y + 120); ctx.stroke(); } ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y + 120); ctx.lineTo(x + w, y + 120); ctx.stroke(); }
function popcorn(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (let i = 0; i < 7; i++) { ell(-40 + i * 13, -78 - (i % 2) * 18, 22, 20); fillLine('#FFF6D8', 4); } ctx.beginPath(); ctx.moveTo(-55, -70); ctx.lineTo(55, -70); ctx.lineTo(42, 40); ctx.lineTo(-42, 40); ctx.closePath(); fillLine('#FFFFFF', 6); ctx.save(); ctx.clip(); ctx.fillStyle = '#E8473A'; for (let i = -3; i < 3; i++) ctx.fillRect(i * 36, -80, 18, 130); ctx.restore(); ctx.beginPath(); ctx.moveTo(-55, -70); ctx.lineTo(55, -70); ctx.lineTo(42, 40); ctx.lineTo(-42, 40); ctx.closePath(); ctx.strokeStyle = LINE; ctx.lineWidth = 6; ctx.stroke(); ctx.restore(); }
function scoreCard(x, y, s, txt, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = LINE; ctx.fillRect(-6, 0, 12, 160); roundRect(-90, -110, 180, 120, 10); fillLine('#FFFFFF', 7); lab(txt, 0, -48, 70, '#E8473A'); ctx.restore(); }
function cone(x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-26, -150); ctx.lineTo(26, -150); ctx.lineTo(70, 0); ctx.lineTo(-70, 0); ctx.closePath(); fillLine(lgrad(-70, 70, '#FF7A2E'), 6); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-46, -90, 92, 26); roundRect(-90, -10, 180, 20, 6); fillLine('#FF7A2E', 5); ctx.restore(); }

// ---------- Black Friday: bed at night, phone shop UI, laptop, cans
function bedNightBG(day = 0) { wall(day ? '#BFD4F2' : '#2E3466', 1450);
  roundRect(110, 360, 400, 480, 10); fillLine(day ? '#FFF0C0' : '#141A40', 10); ctx.save(); roundRect(110, 360, 400, 480, 10); ctx.clip(); if (!day) { ctx.fillStyle = '#FFF6D0'; for (let i = 0; i < 10; i++) ell(130 + hash(i) * 360, 380 + hash(i + 9) * 440, 4, 4); ctx.fill(); ell(400, 470, 50, 50); fillLine('#FFF2B8', 5); } else { ell(380, 480, 70, 70); fillLine('#FFE14D', 5); } ctx.restore();
  ctx.strokeStyle = LINE; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(310, 360); ctx.lineTo(310, 840); ctx.stroke();
  frame(650, 420, 280, 340, () => { ctx.fillStyle = '#E8798F'; ctx.fillRect(650, 420, 280, 340); lab('-70%', 790, 590, 66, '#FFFFFF'); });
  ctx.fillStyle = day ? '#C98E5A' : '#5A3E36'; ctx.fillRect(-300, 1450, W + 600, 800); ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-300, 1450); ctx.lineTo(W + 300, 1450); ctx.stroke(); }
function shopScreen(x, y, s, o) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  roundRect(-330, -620, 660, 1240, 70); fillLine('#1C1C26', 10); ctx.save(); roundRect(-300, -590, 600, 1180, 46); ctx.clip(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-300, -590, 600, 1180);
  ctx.fillStyle = o.dark ? '#16100F' : '#FF9A3C'; ctx.fillRect(-300, -590, 600, 130); lab(o.head || 'TIENDAZO', 0, -525, 54, o.dark ? '#FFE14D' : '#FFFFFF');
  airFryer(0, -110, 0.95);
  if (o.tag) { ctx.save(); ctx.translate(170, -320); ctx.rotate(0.2); ell(0, 0, 100, 100); fillLine('#E8233A', 7); lab(o.tag, 0, 4, 60, '#FFFFFF'); ctx.restore(); }
  lab('Freidora de aire XL', 0, 150, 46, '#16100F');
  if (o.old) { lab(o.old, -120, 240, 50, '#9A9AA6'); ctx.strokeStyle = '#E8233A'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-210, 245); ctx.lineTo(-30, 235); ctx.stroke(); }
  lab(o.price, o.old ? 130 : 0, 240, o.old ? 76 : 80, o.priceCol || '#16100F');
  if (o.note) lab(o.note, 0, 330, 36, o.noteCol || '#5A5A66');
  const pr = o.press || 0; roundRect(-240, 400 + pr * 8, 480, 120, 60); ctx.fillStyle = o.bought ? '#3FBF6A' : '#FFD23F'; ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 7; ctx.stroke(); lab(o.bought ? 'COMPRADO ✓' : (o.btn || 'COMPRAR'), 0, 462 + pr * 8, 54, '#16100F');
  ctx.restore(); ctx.restore(); }
function airFryer(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); roundRect(-150, -190, 300, 360, 60); fillLine(lgrad(-150, 150, '#2A2A36'), 8); roundRect(-110, -150, 220, 90, 18); ctx.fillStyle = '#16202C'; ctx.fill(); ctx.font = fontPx(50, 700); ctx.fillStyle = '#7CFFB2'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('200°', 0, -104);
  roundRect(-130, -20, 260, 170, 30); fillLine(lgrad(-130, 130, '#3A3A48'), 7); roundRect(-60, 30, 120, 30, 14); fillLine('#5A5A66', 5); ctx.restore(); }
function energyCan(x, y, s, rot = 0, col = '#3FD0C9') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); roundRect(-34, -110, 68, 110, 12); fillLine(lgrad(-34, 34, col), 5); ctx.fillStyle = '#16100F'; ctx.font = fontPx(30, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.save(); ctx.rotate(-Math.PI / 2); ctx.fillText('ZAS', 55, 2); ctx.restore(); ctx.restore(); }
function bigCount(x, y, txt, col = '#FF4D6D', size = 150) { ctx.save(); ctx.font = fontPx(size, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(txt).width + 80; roundRect(x - w / 2, y - size * 0.7, w, size * 1.4, 30); ctx.fillStyle = 'rgba(16,10,24,0.85)'; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.stroke(); ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.fillStyle = col; ctx.fillText(txt, x, y + 6); ctx.restore(); }
function eyeBags(o, a = 1) { const [x, y, R] = headPos(o); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(110,60,140,0.8)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (const sx of [-1, 1]) { for (const d of [0, 22]) { ctx.beginPath(); ctx.arc(x + sx * R * 0.38, y + R * 0.02 + d * 0.6, R * 0.24 - d * 0.1, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); } } ctx.restore(); }
function box(x, y, s, rot = 0, lbl = 'TIENDAZO') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); roundRect(-170, -150, 340, 300, 10); fillLine(lgrad(-170, 170, '#D6A46A'), 8); ctx.fillStyle = 'rgba(150,100,50,0.5)'; ctx.fillRect(-170, -20, 340, 40); lab(lbl, 0, 80, 40, '#16100F'); ctx.restore(); }
function starEyes(o, t) { const [x, y, R] = headPos(o); for (const sx of [-1, 1]) { ctx.save(); ctx.translate(x + sx * R * 0.38, y - R * 0.12); ctx.rotate(t * 3 * sx); ctx.scale(1 + Math.sin(t * 12) * 0.1, 1 + Math.sin(t * 12) * 0.1); ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 - Math.PI / 2, r = i % 2 ? R * 0.11 : R * 0.27; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); fillLine('#FFD23F', 6); ctx.restore(); } }
