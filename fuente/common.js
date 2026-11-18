// Shared drawing helpers for the Calce reels (1080x1920 canvas).
const c = document.getElementById('c');
let ctx = c.getContext('2d');
const INK = '#2B2B2B';
const W = 1080, H = 1920;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function sockPath() {
  ctx.beginPath();
  ctx.moveTo(-58, -250);
  ctx.lineTo(-58, -34);
  ctx.quadraticCurveTo(-58, 0, -24, 0);
  ctx.lineTo(98, 0);
  ctx.quadraticCurveTo(142, 0, 142, -42);
  ctx.quadraticCurveTo(142, -86, 98, -86);
  ctx.lineTo(58, -86);
  ctx.lineTo(58, -250);
  ctx.closePath();
}

// o: {x, y (baseline), s, flip, rot, squash, wet, look, lookY, mouth, eyes, blush}
// eyes: 'open' (default) | 'closed' | 'blink' | 'wide' | 'one'
// mouth: 'smile' | 'flat' | 'o' | 'big' | 'wobble'
function sock(o) {
  const main = o.wet ? '#3F7FB0' : '#5FA8E0';
  const stripe = o.wet ? '#B04A3A' : '#F06A55';
  const cuff = o.wet ? '#C9CED3' : '#FFFFFF';
  const dark = o.wet ? '#2D5F86' : '#3E86BF';
  const rot = o.rot || 0;
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.rotate(rot);
  const sq = o.squash || 0;
  ctx.scale(o.s * (1 + sq), o.s * (1 - sq));
  ctx.save();
  ctx.scale(o.flip || 1, 1);
  sockPath(); ctx.fillStyle = main; ctx.fill();
  ctx.save(); sockPath(); ctx.clip();
  ctx.fillStyle = stripe; ctx.fillRect(-70, -205, 140, 26); ctx.fillRect(-70, -110, 140, 14);
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.arc(-58, -4, 52, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(142, -43, 50, 0, Math.PI * 2); ctx.fill();
  if (o.wet) { ctx.fillStyle = 'rgba(0,0,40,0.18)'; ctx.fillRect(-70, -60, 220, 60); }
  ctx.restore();
  sockPath(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.stroke();
  roundRect(-66, -282, 132, 42, 14); ctx.fillStyle = cuff; ctx.fill(); ctx.stroke();
  ctx.lineWidth = 4;
  for (let i = -44; i <= 44; i += 22) { ctx.beginPath(); ctx.moveTo(i, -276); ctx.lineTo(i, -246); ctx.stroke(); }
  ctx.restore();
  // face stays upright even if the body is rotated
  ctx.translate(0, -150); ctx.rotate(-rot); ctx.translate(0, 150);
  const lx = (o.look || 0) * 12, ly = (o.lookY || 0) * 8;
  const ey = -160;
  const eyes = o.eyes || (o.blink ? 'blink' : 'open');
  ctx.strokeStyle = INK; ctx.lineCap = 'round';
  [-20, 20].forEach((ex, idx) => {
    let mode = eyes;
    if (eyes === 'one') mode = idx === 0 ? 'blink' : 'wide';
    if (mode === 'blink') {
      ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex + lx - 10, ey); ctx.lineTo(ex + lx + 10, ey); ctx.stroke();
    } else if (mode === 'closed') {
      ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(ex, ey - 4, 11, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    } else {
      const r = mode === 'wide' ? 21 : 15, pr = mode === 'wide' ? 6 : 8;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex, ey, r, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + lx * 0.6, ey + 1 + ly, pr, 0, Math.PI * 2); ctx.fill();
    }
  });
  ctx.lineWidth = 6;
  const my = -128, mx = lx * 0.4;
  if (o.mouth === 'smile') { ctx.beginPath(); ctx.arc(mx, my - 10, 16, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); }
  else if (o.mouth === 'flat') { ctx.beginPath(); ctx.moveTo(mx - 12, my); ctx.lineTo(mx + 12, my); ctx.stroke(); }
  else if (o.mouth === 'o') { ctx.beginPath(); ctx.ellipse(mx, my, 7, 10, 0, 0, Math.PI * 2); ctx.stroke(); }
  else if (o.mouth === 'big') { ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(mx, my + 2, 13, 17, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (o.mouth === 'wobble') {
    ctx.beginPath(); ctx.moveTo(mx - 16, my);
    for (let i = 1; i <= 4; i++) ctx.lineTo(mx - 16 + i * 8, my + (i % 2 ? -5 : 4));
    ctx.stroke();
  }
  if (o.blush) {
    ctx.fillStyle = 'rgba(240,106,85,0.45)';
    ctx.beginPath(); ctx.ellipse(-36, -138, 12, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(36, -138, 12, 7, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (o.sweat) {
    ctx.fillStyle = '#9ED3F7'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    const dx = 50, dy = -200 + (o.sweat % 1) * 30;
    ctx.beginPath(); ctx.moveTo(dx, dy - 16); ctx.quadraticCurveTo(dx + 11, dy, dx, dy + 7);
    ctx.quadraticCurveTo(dx - 11, dy, dx, dy - 16); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// caption: one or more lines in a white pill near the top (inside Reels safe zone)
function caption(lines, y0 = 230) {
  if (typeof lines === 'string') lines = [lines];
  ctx.font = 'bold 56px "DejaVu Sans", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 80;
  const lh = 70, h = lines.length * lh + 34;
  ctx.fillStyle = '#FFFFFF';
  roundRect(540 - w / 2, y0, w, h, Math.min(55, h / 2)); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
  ctx.fillStyle = INK;
  lines.forEach((l, i) => ctx.fillText(l, 540, y0 + 17 + lh / 2 + i * lh));
}

function hop(p, x0, y0, x1, y1, h) {
  return { x: lerp(x0, x1, p), y: lerp(y0, y1, p) - Math.sin(p * Math.PI) * h };
}

function arm(x0, y0, x1, y1, bend = 30) {
  ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + bend, x1, y1); ctx.stroke();
}

function wallAndFloor(wall, floor, floorY) {
  ctx.fillStyle = wall; ctx.fillRect(0, 0, W, floorY);
  ctx.fillStyle = floor; ctx.fillRect(0, floorY, W, H - floorY);
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 4;
  for (let y = floorY + 90; y < H; y += 130) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = INK; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();
}

function shakeLines(x, y, t, a = 1, spread = 90) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (const side of [-1, 1]) for (let i = -1; i <= 1; i++) {
    const yy = y + i * 34 + Math.sin(t * 50 + i) * 4;
    const xx = x + side * spread;
    ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + side * 36, yy - i * 14); ctx.stroke();
  }
  ctx.restore();
}
