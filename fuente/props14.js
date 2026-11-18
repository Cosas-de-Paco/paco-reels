function wallClock(x, y, r, h, m) { ctx.save(); ctx.translate(x, y);
  ell(0, 0, r + 14, r + 14); fillLine(lgrad(-r, r, '#E8473A'), 8); ell(0, 0, r, r); fillLine(rgrad(0, 0, r, '#FFFDF4'), 5);
  ctx.fillStyle = LINE; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.save(); ctx.rotate(a); ctx.fillRect(-4, -r + 10, 8, i % 3 ? 14 : 26); ctx.restore(); }
  ctx.strokeStyle = LINE; ctx.lineCap = 'round';
  const ha = ((h % 12) + m / 60) / 12 * Math.PI * 2, ma = m / 60 * Math.PI * 2;
  ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(ha) * r * 0.5, -Math.cos(ha) * r * 0.5); ctx.stroke();
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(ma) * r * 0.78, -Math.cos(ma) * r * 0.78); ctx.stroke();
  ell(0, 0, 12, 12); ctx.fillStyle = '#E8473A'; ctx.fill(); ctx.restore(); }
function digi(x, y, w, text, col = '#5CFF8A', show = true) { ctx.save(); ctx.translate(x, y); roundRect(-w / 2, -w * 0.22, w, w * 0.44, 12); fillLine('#15161E', 6);
  if (show) { ctx.font = fontPx(w * 0.3, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = col; ctx.shadowBlur = 18; ctx.fillStyle = col; ctx.fillText(text, 0, 4); }
  ctx.restore(); }
function hhmm(minutes) { minutes = ((Math.round(minutes) % 1440) + 1440) % 1440; return String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0'); }
function qmarks(t, x, y, n = 4) { for (let i = 0; i < n; i++) { const a = t * 1.8 + i * Math.PI * 2 / n; ctx.save(); ctx.translate(x + Math.cos(a) * 200, y + Math.sin(a) * 50 - 40); ctx.rotate(Math.sin(t * 3 + i) * 0.3);
  ctx.font = fontPx(80, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 14; ctx.strokeStyle = LINE; ctx.strokeText('?', 0, 0); ctx.fillStyle = '#FFD23F'; ctx.fillText('?', 0, 0); ctx.restore(); } }
function zzz(t, x, y) { for (let i = 0; i < 3; i++) { const p = (t * 0.5 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI); ctx.translate(x + p * 90 + Math.sin(t * 2 + i) * 14, y - p * 200); ctx.font = fontPx(50 + p * 40, 700); ctx.fillStyle = '#fff'; ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.textAlign = 'center'; ctx.strokeText('z', 0, 0); ctx.fillText('z', 0, 0); ctx.restore(); } }
// ---------- shared props for reels 14-16 (cel style)
const BREAD = '#F4C77A', CRUST = '#B8692E', BUTTER = '#FFE45C';
// bread slice seen face-on; phi = flip angle (cos>0 shows the top/buttered side), butter 0..1, both = buttered on both sides
function toast(x, y, s, rot = 0, phi = 0, butter = 1, both = false) {
  const c = Math.cos(phi); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s * (Math.abs(c) < 0.08 ? 0.08 * Math.sign(c || 1) : c));
  const slice = (r) => { ctx.beginPath(); ctx.moveTo(-70 * r, 70 * r); ctx.lineTo(-70 * r, -10 * r); ctx.bezierCurveTo(-112 * r, -20 * r, -105 * r, -95 * r, -40 * r, -88 * r);
    ctx.quadraticCurveTo(0, -110 * r, 40 * r, -88 * r); ctx.bezierCurveTo(105 * r, -95 * r, 112 * r, -20 * r, 70 * r, -10 * r); ctx.lineTo(70 * r, 70 * r); ctx.closePath(); };
  slice(1); fillLine(CRUST, 8); slice(0.84); ctx.fillStyle = c >= 0 ? BREAD : shade(BREAD, -0.12); ctx.fill();
  ctx.fillStyle = 'rgba(160,90,30,0.25)'; for (let i = 0; i < 9; i++) { ell((hash(i) - 0.5) * 100, (hash(i + 4) - 0.5) * 110, 5, 3); ctx.fill(); }
  if (butter > 0 && (c >= 0 || both)) { ctx.save(); ctx.globalAlpha = Math.min(1, butter * 1.5);
    ctx.beginPath(); const n = 12; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, r = (40 + 22 * butter) * (1 + 0.12 * Math.sin(i * 2.7)); ctx.lineTo(Math.cos(a) * r * 1.1, Math.sin(a) * r * 0.9 - 8); }
    ctx.closePath(); fillLine(BUTTER, 5); ctx.fillStyle = '#FFF6B8'; ell(-20, -26, 16, 8, -0.4); ctx.fill(); ctx.restore(); }
  ctx.restore();
}
// toast lying flat on the floor, seen from the side, with butter squashed out underneath
function toastFloor(x, y, s, splat = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.ellipse(0, 4, 120 * splat + 40, 16, 0, 0, Math.PI * 2); fillLine(BUTTER, 5);
  roundRect(-90, -26, 180, 26, 8); fillLine(lgrad(-90, 90, CRUST), 6); ctx.fillStyle = BREAD; ctx.fillRect(-80, -20, 160, 10);
  ctx.restore();
}
// toast standing on its edge (side view)
function toastEdge(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  roundRect(-14, -170, 28, 170, 8); fillLine(lgrad(-14, 14, CRUST), 6); ctx.fillStyle = BUTTER; ctx.fillRect(-18, -150, 6, 130); ctx.fillRect(12, -150, 6, 130); ctx.restore(); }
function knife(x, y, s, rot, butter = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  roundRect(-10, -16, 90, 32, 12); fillLine(lgrad(-10, 80, '#3A3A4A'), 6);
  ctx.beginPath(); ctx.moveTo(-10, -12); ctx.lineTo(-150, -14); ctx.quadraticCurveTo(-178, 0, -150, 14); ctx.lineTo(-10, 12); ctx.closePath(); fillLine(lgrad(-170, 0, '#DDE2EA'), 6);
  if (butter) { ctx.fillStyle = BUTTER; ell(-130, 0, 30, 14); ctx.fill(); }
  ctx.restore(); }
function plate(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ell(0, 0, 150, 34); fillLine('#FFFFFF', 7); ell(0, -4, 100, 20); ctx.strokeStyle = 'rgba(80,90,120,0.25)'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }
function toaster(x, y, s, pop = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const dx of [-45, 45]) if (pop > 0) { ctx.save(); toast(dx, -170 - pop * 70, 0.55, 0, 1.45, 0); ctx.restore(); }
  roundRect(-130, -190, 260, 190, 50); fillLine(lgrad(-130, 130, '#E8473A'), 8);
  for (const dx of [-45, 45]) { roundRect(dx - 40, -196, 80, 18, 8); fillLine('#2A1E1C', 5); }
  roundRect(115, -110, 40, 20, 8); fillLine('#2A1E1C', 5); ctx.fillStyle = 'rgba(255,255,255,0.55)'; roundRect(-100, -160, 26, 110, 12); ctx.fill();
  ctx.restore(); }
function mug(x, y, s, col = '#3FA7A0') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(62, -60, 30, -1.4, 1.4); ctx.strokeStyle = '#16100F'; ctx.lineWidth = 26; ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.stroke();
  roundRect(-60, -120, 120, 120, 22); fillLine(lgrad(-60, 60, col), 7); ctx.restore(); }
function tapeRoll(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ell(0, 0, 50, 50); fillLine('#E8E2C8', 7); ell(0, 0, 26, 26); fillLine('#C9B98A', 5); ctx.restore(); }
function bulb(x, y, s, t, on = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (on) { glow(0, -20, 220, 'rgba(255,240,140,A)', 0.7 * on); ctx.strokeStyle = '#FFE14D'; ctx.lineWidth = 12; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + Math.sin(t * 6) * 0.05; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 120, -20 + Math.sin(a) * 120); ctx.lineTo(Math.cos(a) * 160, -20 + Math.sin(a) * 160); ctx.stroke(); } }
  ctx.beginPath(); ctx.arc(0, -30, 75, Math.PI * 0.8, Math.PI * 2.2); ctx.lineTo(30, 60); ctx.lineTo(-30, 60); ctx.closePath(); fillLine(on ? '#FFF27A' : '#E8E8EE', 8);
  roundRect(-34, 60, 68, 50, 10); fillLine('#9A9AAA', 6); ctx.restore(); }
// manga speed streaks behind a falling/moving object (direction dx,dy)
function streaks(x, y, dx, dy, len = 220, n = 5, a = 0.8, spread = 60) {
  const L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#16100F'; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * spread / (n - 1) * 2, l = len * (0.6 + hash(i) * 0.4); ctx.lineWidth = 7 - Math.abs(i - (n - 1) / 2);
    ctx.beginPath(); ctx.moveTo(x + nx * o - ux * 40, y + ny * o - uy * 40); ctx.lineTo(x + nx * o - ux * (40 + l), y + ny * o - uy * (40 + l)); ctx.stroke(); }
  ctx.restore(); }
function lab(text, x, y, size, col = '#16100F', rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = fontPx(size, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, 0, 0); ctx.restore(); }
// world position of the head centre of a hdChar call (adult, no squash), with lean
function headPos(o) { const s = o.s || 1, lean = o.lean || 0, k = o.kid ? 0.62 : 1; const hipY = -262 * k, dy = (-730 * k) - hipY;
  return [o.x + (-dy * Math.sin(lean)) * s, o.y + (hipY + dy * Math.cos(lean)) * s, 150 * s]; }
function headband(o, t) { const [x, y, R] = headPos(o); ctx.save(); ctx.translate(x, y); ctx.rotate(o.lean || 0);
  ctx.beginPath(); ctx.moveTo(-R * 1.02, -R * 0.42); ctx.quadraticCurveTo(0, -R * 0.62, R * 1.02, -R * 0.42); ctx.lineTo(R * 1.0, -R * 0.24); ctx.quadraticCurveTo(0, -R * 0.44, -R * 1.0, -R * 0.24); ctx.closePath(); fillLine('#E8233A', 7);
  for (const k of [0, 1]) { ctx.beginPath(); ctx.moveTo(-R * 0.98, -R * 0.33); ctx.quadraticCurveTo(-R * 1.4, -R * (0.3 - k * 0.1) + Math.sin(t * 9 + k) * 18, -R * 1.75, -R * (0.15 - k * 0.25) + Math.sin(t * 9 + k + 1) * 26);
    ctx.lineTo(-R * 1.7, -R * (0.02 - k * 0.25) + Math.sin(t * 9 + k + 1) * 26); ctx.quadraticCurveTo(-R * 1.35, -R * (0.18 - k * 0.1), -R * 0.98, -R * 0.24); fillLine('#E8233A', 6); }
  ctx.restore(); }
function phone(x, y, s, txt, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); roundRect(-55, -100, 110, 200, 20); fillLine('#22232E', 6);
  ctx.fillStyle = '#7AB8FF'; roundRect(-44, -86, 88, 172, 12); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = fontPx(34, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, -30); ctx.restore(); }
