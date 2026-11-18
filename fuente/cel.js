// Cel style layer for reels 14+: near-black ink with variable weight, hard-edged (cel) shading,
// hair cast shadow, hair strands and shine, and manga action marks. Load after body2.js.
const CEL = { k: 1.5, off: 0.3, pass: false, passCol: '#000' };
const _stroke = CanvasRenderingContext2D.prototype.stroke;
CanvasRenderingContext2D.prototype.stroke = function (...a) {
  if (CEL.pass) return;
  if (this.strokeStyle !== '#16100f') return _stroke.apply(this, a);
  const w = this.lineWidth, m = this.getTransform(), sc = Math.hypot(m.a, m.b);
  this.save();
  this.lineWidth = w * CEL.k;
  this.shadowColor = '#16100F'; this.shadowBlur = 0;
  this.shadowOffsetX = w * CEL.off * sc; this.shadowOffsetY = w * CEL.off * 1.3 * sc;
  _stroke.apply(this, a);
  this.restore();
};
const _fill = CanvasRenderingContext2D.prototype.fill;
CanvasRenderingContext2D.prototype.fill = function (...a) {
  if (CEL.pass) { this.save(); this.fillStyle = CEL.passCol; _fill.apply(this, a); this.restore(); return; }
  return _fill.apply(this, a);
};
// hard-stop gradients: base colour with a crisp shadow crescent (lower right) and a small lit edge
window.rgrad = function (x, y, r, c) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.45, r * 0.05, x, y, r * 1.15);
  g.addColorStop(0, shade(c, 0.12)); g.addColorStop(0.3, shade(c, 0.12)); g.addColorStop(0.302, c);
  g.addColorStop(0.72, c); g.addColorStop(0.724, shade(c, -0.2)); g.addColorStop(1, shade(c, -0.26)); return g;
};
window.lgrad = function (x0, x1, c) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, shade(c, 0.14)); g.addColorStop(0.1, shade(c, 0.14)); g.addColorStop(0.102, c);
  g.addColorStop(0.64, c); g.addColorStop(0.643, shade(c, -0.2)); g.addColorStop(1, shade(c, -0.26)); return g;
};
// Paco's hair: cast shadow on the forehead, strands, crisp shine
const _hdHairCel = window.hdHair;
window.hdHair = function (st, R, t) {
  if (st.hairStyle === 'paco' || st.hairStyle === 'long' || st.hairStyle === 'pony' || st.hairStyle === 'slick') {
    ctx.save(); ell(0, 0, R, R * 1.06); ctx.clip(); ctx.translate(R * 0.06, R * 0.13);
    CEL.pass = true; CEL.passCol = shade(st.skin, -0.2); _hdHairCel(st, R, t); CEL.pass = false; ctx.restore();
  }
  _hdHairCel(st, R, t);
  if (st.hairStyle !== 'paco') return;
  const c = st.hair;
  // shine band
  ctx.save(); ctx.beginPath(); ctx.moveTo(-R * 0.78, -R * 0.62);
  ctx.quadraticCurveTo(-R * 0.35, -R * 1.1, R * 0.3, -R * 1.04); ctx.quadraticCurveTo(-R * 0.25, -R * 1.02, -R * 0.68, -R * 0.6); ctx.closePath();
  ctx.fillStyle = shade(c, 0.22); ctx.fill();
  ctx.fillStyle = shade(c, 0.55); ell(-R * 0.48, -R * 0.86, R * 0.07, R * 0.035, -0.6); ctx.fill(); ell(R * 0.05, -R * 1.0, R * 0.05, R * 0.025, -0.2); ctx.fill();
  ctx.restore();
  // strands
  ctx.strokeStyle = shade(c, -0.45); ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (const [x0, y0, x1, y1, cx, cy] of [[-0.5, -1.05, -0.62, -0.7, -0.62, -0.9], [-0.1, -1.15, -0.15, -0.76, -0.2, -0.95], [0.35, -1.1, 0.3, -0.74, 0.4, -0.9], [0.75, -0.85, 0.7, -0.6, 0.8, -0.7]]) {
    ctx.beginPath(); ctx.moveTo(x0 * R, y0 * R); ctx.quadraticCurveTo(cx * R, cy * R, x1 * R, y1 * R); ctx.stroke();
  }
};

// ---------- manga action marks
// three wedge "!" marks radiating from a point (like the reference drawing)
function alertMarks(x, y, s, rot, t, t0, col = '#FF5A1F') {
  if (t < t0) return; const p = spring(prog(t, t0, t0 + 0.3)) * (1 + Math.sin(t * 18) * 0.04);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * p, s * p);
  for (const a of [-0.55, 0, 0.55]) { ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(40, -10); ctx.lineTo(130, -24); ctx.lineTo(126, 22); ctx.lineTo(40, 8); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  ctx.restore();
}
// curved motion arcs (head turn, swing)
function motionArcs(x, y, r, a0, a1, a = 1, n = 3) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#16100F'; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { ctx.lineWidth = 6 - i * 1.2; ctx.beginPath(); ctx.arc(x, y, r + i * 26, a0 + i * 0.06, a1 - i * 0.06); ctx.stroke(); }
  ctx.restore();
}
// anger vein (red cross)
function angerVein(x, y, s, t) {
  const p = 1 + Math.sin(t * 14) * 0.08; ctx.save(); ctx.translate(x, y); ctx.scale(s * p, s * p);
  ctx.strokeStyle = '#E8233A'; ctx.lineWidth = 12; ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.rotate(i * Math.PI / 2 + 0.785); ctx.beginPath(); ctx.moveTo(8, -18); ctx.quadraticCurveTo(14, -8, 30, -8); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
// short radial "surprise" dashes around a point
function surprise(x, y, r, t, t0, n = 10) {
  if (t < t0) return; const p = easeOut(prog(t, t0, t0 + 0.25)), out = 1 - prog(t, t0 + 0.9, t0 + 1.3);
  if (out <= 0) return;
  ctx.save(); ctx.globalAlpha = out; ctx.strokeStyle = '#16100F'; ctx.lineCap = 'round'; ctx.lineWidth = 9;
  for (let i = 0; i < n; i++) { const a = -Math.PI + (i + 0.5) / n * Math.PI; const r0 = r * (0.9 + p * 0.2), r1 = r0 + 40 + (i % 2) * 25;
    ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
  ctx.restore();
}
// gloom: vertical lines over the forehead (head centre x,y, radius R in screen px)
function gloom(x, y, R, a = 1) {
  ctx.save(); ctx.globalAlpha = a * 0.7; ctx.beginPath(); ell(x, y, R, R * 1.06); ctx.clip();
  ctx.fillStyle = 'rgba(70,40,140,0.35)'; ctx.fillRect(x - R, y - R * 1.1, R * 2, R * 0.7);
  ctx.strokeStyle = '#3A2A7A'; ctx.lineWidth = 5;
  for (let i = -6; i <= 6; i++) { const xx = x + i * R * 0.13; ctx.beginPath(); ctx.moveTo(xx, y - R * 1.1); ctx.lineTo(xx, y - R * (0.45 + (i % 3 === 0 ? 0.15 : 0))); ctx.stroke(); }
  ctx.restore();
}
// shock zigzag behind a character (manga lightning background)
function shockBurst(x, y, r, t, col = '#FFE14D', a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(t * 0.4); ctx.beginPath();
  const n = 18; for (let i = 0; i <= n * 2; i++) { const ang = i / (n * 2) * Math.PI * 2, rr = i % 2 ? r * 0.62 : r * (1 + hash(i) * 0.25); ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr); }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#16100F'; ctx.stroke(); ctx.restore();
}
// halftone dots fill (comic shading on backgrounds)
function halftone(x, y, w, h, col = 'rgba(0,0,0,0.08)', step = 26) {
  ctx.save(); ctx.fillStyle = col; for (let yy = y; yy < y + h; yy += step) for (let xx = x + ((yy / step) % 2) * step / 2; xx < x + w; xx += step) { const r = step * 0.28 * (yy - y) / h + 1; ctx.beginPath(); ctx.arc(xx, yy, r, 0, 6.283); _fill.call(ctx); }
  ctx.restore();
}

// extra face marks drawn in head space: face.gloom (0..1), face.vein, face.hatch (blush lines)
const _hdHeadCel = window.hdHead;
window.hdHead = function (f) {
  _hdHeadCel(f);
  if (!f.gloom && !f.vein && !f.hatch) return;
  const st = typeof f.st === 'string' ? STYLES[f.st] : (f.st || STYLES.paco), R = st.R;
  ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot || 0); ctx.scale(f.s || 1, (f.s || 1) * (f.sy || 1));
  if (f.hatch) { ctx.strokeStyle = 'rgba(200,60,60,' + (0.7 * f.hatch) + ')'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) { const x = sx * R * 0.58 + (i - 1) * R * 0.1; ctx.beginPath(); ctx.moveTo(x + R * 0.04, R * 0.3); ctx.lineTo(x - R * 0.04, R * 0.46); ctx.stroke(); } }
  if (f.gloom) { ctx.save(); ctx.globalAlpha = f.gloom; ell(0, 0, R, R * 1.06); ctx.clip();
    const g = ctx.createLinearGradient(0, -R, 0, -R * 0.1); g.addColorStop(0, 'rgba(60,30,140,0.55)'); g.addColorStop(1, 'rgba(60,30,140,0)'); ctx.fillStyle = g; ctx.fillRect(-R, -R * 1.1, R * 2, R);
    ctx.strokeStyle = 'rgba(40,20,100,0.75)'; ctx.lineWidth = 6; for (let i = -5; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(i * R * 0.16, -R * 0.62); ctx.lineTo(i * R * 0.16, -R * (0.25 + (Math.abs(i) % 3) * 0.08)); ctx.stroke(); }
    ctx.restore(); }
  if (f.vein) angerVein(R * 0.62, -R * 0.72, 1.2, f.t || 0);
  ctx.restore();
};
