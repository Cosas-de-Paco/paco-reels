// Shared pieces for the animated saga "La entrevista" (3 reels). Loaded after lib.js and arms.js.
const SK = STYLES.paco.skin;
OUTFITS.pj2 = { top: '#5B7FD0', legs: '#3D5A86', shoe: { top: '#8A5A3A', sole: '#5A3A2A' }, kind: 'pj2' };
OUTFITS.pacoEnt2 = Object.assign({}, OUTFITS.pacoEnt);
OUTFITS.chicoEnt = { top: '#F2E6C8', legs: '#2E3A55', shoe: { top: '#2A1E1A', sole: '#111' }, kind: 'shirt' };
// shirt details without the tie (dressing scene)
function shirtOnly() { const shY = -570;
  ctx.strokeStyle = shade('#CFE3F5', -0.35); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, shY + 60); ctx.lineTo(4, -270); ctx.stroke();
  for (let i = 0; i < 4; i++) { ell(10 + (i % 2) * 14, shY + 110 + i * 70, 6, 6); fillLine('#F4F8FC', 3); }
  ctx.beginPath(); ctx.moveTo(-70, shY - 6); ctx.lineTo(-18, shY + 52); ctx.lineTo(-6, shY + 4); ctx.closePath(); fillLine('#E6F0FA', 5);
  ctx.beginPath(); ctx.moveTo(70, shY - 14); ctx.lineTo(30, shY + 36); ctx.lineTo(6, shY + 4); ctx.closePath(); fillLine('#E6F0FA', 5); }
function chico(o) { return person(Object.assign({ who: 'chico', outfit: 'chicoEnt', behindArms: tieOn(true, '#2F8FD6') }, o)); }
// local hand coords for an absolute point, for a character o (no lean)
function loc(o, ax, ay) { const s = o.s || 1; return [(ax - o.x) / s, (ay - o.y) / s]; }
const wv = (t, f, a, ph = 0) => Math.sin(t * f + ph) * a;
function seg(t, a, b) { return smooth(prog(t, a, b)); }

function cvFolder(x, y, s = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); roundRect(-80, -110, 160, 220, 10); fillLine(lgrad(-80, 80, '#3F6FB5'), 6); lab('CV', 0, -10, 52, '#fff'); ctx.restore(); }
function toothbrush(x, y, s = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); roundRect(0, -9, 150, 18, 9); fillLine('#3FD0C9', 4); roundRect(110, -26, 40, 18, 5); fillLine('#FFFFFF', 4); ctx.restore(); }
function foam(x, y, t, n = 5) { for (let i = 0; i < n; i++) { const a = i * 1.3 + t * 2; ell(x + Math.cos(a) * 26, y + Math.sin(a) * 14, 12 + (i % 3) * 4, 12 + (i % 3) * 4); fillLine('#FFFFFF', 3); } }
function pompom(x, y, r) { ctx.beginPath(); for (let i = 0; i <= 28; i++) { const a = i / 28 * Math.PI * 2, rr = r * (i % 2 ? 0.8 : 1.08); ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); fillLine(rgrad(x, y, r, '#FF8FC8'), 4); }
function carKeys(x, y, s = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.strokeStyle = LINE; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = '#C9CED6'; ctx.lineWidth = 5; ctx.stroke();
  for (const [a, col] of [[0.6, '#E8C86A'], [1.4, '#C9CED6']]) { ctx.save(); ctx.rotate(a); roundRect(22, -16, 46, 32, 10); fillLine(col, 5); roundRect(62, -7, 70, 14, 4); fillLine(col, 4);
    ctx.fillStyle = LINE; for (let i = 0; i < 3; i++) ctx.fillRect(90 + i * 13, 5, 7, 8); ctx.restore(); }
  ctx.strokeStyle = LINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-10, 22); ctx.lineTo(-30, 60); ctx.stroke(); pompom(-36, 82, 30); ctx.restore(); }
function shades(x, y, R, rot = 0) { ctx.save(); ctx.translate(x, y - R * 0.06); ctx.rotate(rot);
  for (const sx of [-1, 1]) { roundRect(sx * R * 0.38 - R * 0.36, -R * 0.24, R * 0.72, R * 0.5, R * 0.2); fillLine('#1B1B26', 8); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.moveTo(sx * R * 0.38 - R * 0.22, -R * 0.16); ctx.lineTo(sx * R * 0.38 - R * 0.06, -R * 0.16); ctx.lineTo(sx * R * 0.38 - R * 0.2, R * 0.12); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = LINE; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-R * 0.04, -R * 0.06); ctx.lineTo(R * 0.04, -R * 0.06); ctx.stroke(); ctx.restore(); }
function continued(t, t0, n) { titleCard(t, t0, 3.4, 'Continuará…', `Parte ${n} en dos días`, '#FFD23F'); }
function badge(t, txt, t0, t1, x = 210, y = 467) { if (t < t0 || t > t1) return; ctx.save(); ctx.globalAlpha = 0.92; ctx.font = fontPx(50, 700); const w = ctx.measureText(txt).width + 60; roundRect(x - w / 2, y - 45, w, 90, 30); ctx.fillStyle = 'rgba(20,10,30,0.72)'; ctx.fill(); lab(txt, x, y, 50, '#fff'); ctx.restore(); }

// ---------- bedroom
function bedroomBG() { wall('#9FB7E0', 1450);
  roundRect(120, 380, 420, 520, 10); fillLine('#FFE9B8', 10); ctx.strokeStyle = LINE; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(330, 380); ctx.lineTo(330, 900); ctx.moveTo(120, 640); ctx.lineTo(540, 640); ctx.stroke();
  ctx.fillStyle = 'rgba(255,240,200,0.35)'; ctx.beginPath(); ctx.moveTo(120, 900); ctx.lineTo(540, 900); ctx.lineTo(900, 1500); ctx.lineTo(300, 1500); ctx.closePath(); ctx.fill();
  for (const [x, d] of [[90, 1], [570, -1]]) { ctx.beginPath(); ctx.moveTo(x - 60 * d, 340); ctx.lineTo(x + 60 * d, 340); ctx.quadraticCurveTo(x + 20 * d, 650, x + 50 * d, 960); ctx.lineTo(x - 60 * d, 960); ctx.closePath(); fillLine(lgrad(x - 60, x + 60, '#E8798F'), 7); }
  ctx.fillStyle = '#C98E5A'; ctx.fillRect(-300, 1450, W + 600, 700); ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-300, 1450); ctx.lineTo(W + 300, 1450); ctx.stroke();
  frame(640, 420, 300, 380, () => { ctx.fillStyle = '#7FC8A9'; ctx.fillRect(640, 420, 300, 380); lab('¡TÚ', 790, 560, 60, '#16100F'); lab('PUEDES!', 790, 640, 60, '#16100F'); }); }
function nightPhone(x, y, rot, txt = '8:47', glow = 1) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); roundRect(-60, -34, 120, 68, 14); fillLine('#22232E', 6); roundRect(-50, -26, 100, 52, 8); ctx.fillStyle = glow ? '#7AB8FF' : '#3A4A6A'; ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = fontPx(36, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 2); ctx.restore(); }

// ---------- waiting room. door 0..1 open
function waitingBG(door, clockM = 0) { wall('#EFE3CF', 1560);
  frame(90, 520, 320, 260, () => { ctx.fillStyle = '#3F6FB5'; ctx.fillRect(90, 520, 320, 260); lab('RAMÓN S.A.', 250, 650, 40, '#FFE14D'); });
  wallClock(250, 1000, 80, 8 + Math.floor((59 + clockM) / 60), (59 + clockM) % 60);
  ctx.fillStyle = '#FFF4D6'; ctx.fillRect(560, 560, 470, 1010); ctx.fillStyle = '#D9C7A8'; ctx.fillRect(560, 1300, 470, 270);
  ctx.strokeStyle = LINE; ctx.lineWidth = 26; ctx.strokeRect(560, 560, 470, 1010); ctx.strokeStyle = '#B07A4A'; ctx.lineWidth = 14; ctx.strokeRect(560, 560, 470, 1010);
  floorWood(1560); }
function waitingDoor(door) { // door panel hinged on the right edge
  const w = 470 * (1 - door * 0.9); ctx.save(); ctx.translate(1030, 560);
  if (door > 0.05) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(50 * door, -40 * door); ctx.lineTo(50 * door, 1050 + 40 * door); ctx.lineTo(0, 1010); ctx.closePath(); fillLine(lgrad(0, 50, '#8A5A3A'), 8); }
  if (w > 30) { roundRect(-w, 0, w, 1010, 4); fillLine(lgrad(-w, 0, '#B5534A'), 8);
    for (const [y, h] of [[50, 400], [520, 430]]) { roundRect(-w + w * 0.12, y, w * 0.76, h, 8); ctx.strokeStyle = shade('#B5534A', -0.35); ctx.lineWidth = 6; ctx.stroke(); }
    ell(-w + w * 0.1, 520, 18, 18); fillLine('#F2D58A', 5); roundRect(-w + w * 0.3, 140, w * 0.4, 60, 6); fillLine('#F2D06A', 4); ctx.fillStyle = '#16100F'; ctx.font = fontPx(Math.max(10, 30 * w / 470), 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('DIRECCIÓN', -w / 2, 170); }
  ctx.restore(); }
function chair(x, y) { roundRect(x - 140, y - 520, 280, 330, 30); fillLine(lgrad(x - 140, x + 140, '#3FA7A0'), 7); ctx.fillStyle = LINE; ctx.fillRect(x - 130, y - 180, 14, 180); ctx.fillRect(x + 116, y - 180, 14, 180); roundRect(x - 160, y - 200, 320, 46, 14); fillLine(lgrad(x - 160, x + 160, shade('#3FA7A0', -0.1)), 7); }

// ---------- street, side view. sky 0..1 (1 = night)
function skyFill(night = 0) { const g = ctx.createLinearGradient(0, -600, 0, 1400); const top = night > 0.5 ? '#141A40' : '#5EC2FF', bot = night > 0.5 ? '#3A3A7A' : '#D8F2FF';
  g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(-600, -1500, W + 1200, 3000);
  if (night > 0.5) { ctx.fillStyle = '#FFF6D0'; for (let i = 0; i < 30; i++) ell((hash(i) * 1800) - 300, hash(i + 40) * 900 - 200, 4, 4); ctx.fill(); ell(850, 200, 70, 70); fillLine('#FFF2B8', 6); }
  else { ell(860, 180, 90, 90); fillLine('#FFE14D', 6); } }
function streetBG(night = 0, sign = 'RAMÓN S.A.') { skyFill(night);
  const B = ['#F2A65A', '#8FA8E8', '#E8798F', '#B98AD8'];
  for (let k = -1; k < 5; k++) { const x = -120 + k * 330, h = 900 + ((k + 4) % 2) * 200; roundRect(x, 1380 - h, 310, h + 10, 6); fillLine(lgrad(x, x + 310, B[(k + 4) % 4]), 8);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++) { roundRect(x + 50 + c * 130, 1380 - h + 60 + r * 160, 90, 110, 8); fillLine(night > 0.5 && hash(k * 10 + r * 2 + c) > 0.4 ? '#FFE9A0' : '#CFEFFF', 5); } }
  ctx.save(); ctx.translate(540, 640); roundRect(-230, -60, 460, 120, 14); fillLine('#3F6FB5', 8); lab(sign, 0, 4, 54, '#FFE14D'); ctx.restore();
  ctx.fillStyle = '#C9C2B6'; ctx.fillRect(-600, 1380, W + 1200, 90); ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-600, 1380); ctx.lineTo(W + 600, 1380); ctx.moveTo(-600, 1470); ctx.lineTo(W + 600, 1470); ctx.stroke();
  ctx.fillStyle = '#6A6A78'; ctx.fillRect(-600, 1470, W + 1200, 900);
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8; for (let x = -500; x < 1600; x += 520) { ctx.beginPath(); ctx.moveTo(x, 1480); ctx.lineTo(x, 1630); ctx.stroke(); }
  ctx.setLineDash([80, 70]); ctx.beginPath(); ctx.moveTo(-600, 1660); ctx.lineTo(W + 600, 1660); ctx.stroke(); ctx.setLineDash([]); }
// close-up of a driver through the side window. inner() draws the driver (window opening ~ x 90..990, y 640..1330)
function carDoorCU(col, sx = 0) { ctx.save(); ctx.translate(sx, 0);
  ctx.beginPath(); ctx.moveTo(-400, 2300); ctx.lineTo(-400, 470); ctx.quadraticCurveTo(-100, 400, 400, 420); ctx.lineTo(980, 430); ctx.quadraticCurveTo(1200, 450, 1500, 900); ctx.lineTo(1500, 2300); ctx.closePath();
  ctx.moveTo(90, 640); ctx.lineTo(90, 1330); ctx.lineTo(1010, 1330); ctx.lineTo(1010, 900); ctx.quadraticCurveTo(960, 650, 760, 640); ctx.closePath();
  ctx.fillStyle = lgrad(-400, 1500, col); ctx.fill('evenodd'); ctx.strokeStyle = LINE; ctx.lineWidth = 12; ctx.stroke();
  ctx.strokeStyle = shade(col, -0.3); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-400, 1500); ctx.quadraticCurveTo(540, 1470, 1500, 1500); ctx.stroke();
  roundRect(620, 1560, 200, 44, 18); fillLine('#DDD', 6);
  ctx.save(); ctx.translate(1060, 1180); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(120, -60); ctx.lineTo(150, 80); ctx.lineTo(10, 90); ctx.closePath(); fillLine(lgrad(0, 150, col), 8); ctx.restore();
  ctx.restore(); }
function cabin() { ctx.fillStyle = '#2A3550'; ctx.fillRect(60, 600, 980, 760); ctx.fillStyle = '#3A4668'; roundRect(140, 760, 220, 600, 40); ctx.fill(); }
function wheelCU(x, y, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ell(0, 0, 60, 170); ctx.lineWidth = 46; ctx.strokeStyle = LINE; ctx.stroke(); ctx.lineWidth = 30; ctx.strokeStyle = '#3A3A44'; ctx.stroke(); ctx.restore(); }
function horn(t, t0) { boom('¡MEEEC!', 760, 760, 110, '#FFFFFF', '#FF5D2E', t, t0, 0.1, 0.8); }
