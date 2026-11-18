// Saga "La entrevista": reference sheet, start frames and covers. draw(n) renders image n.
OUTFITS.pacoEnt = { top: '#CFE3F5', legs: '#3D5A86', shoe: { top: '#F6F6F2', sole: '#E2473A' }, kind: 'shirt' };
OUTFITS.jefe = { top: '#3A3F55', legs: '#3A3F55', shoe: { top: '#2A1E1A', sole: '#111' }, kind: 'suit' };
OUTFITS.pacoPij = OUTFITS.pacoPijama;
STYLES.ramon = Object.assign({}, STYLES.senor);
// shirt + tie (Paco, crooked) and suit + tie (Ramon), drawn on the torso before the arms
function tieOn(crooked, col) { return () => {
  const shY = -570;
  if (crooked) { // shirt collar and placket
    ctx.strokeStyle = shade('#CFE3F5', -0.35); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, shY + 60); ctx.lineTo(4, -270); ctx.stroke();
    for (let i = 0; i < 4; i++) { ell(10, shY + 110 + i * 70, 6, 6); fillLine('#F4F8FC', 3); }
    ctx.beginPath(); ctx.moveTo(-70, shY - 6); ctx.lineTo(-18, shY + 52); ctx.lineTo(-6, shY + 4); ctx.closePath(); fillLine('#E6F0FA', 5);
    ctx.beginPath(); ctx.moveTo(70, shY - 14); ctx.lineTo(30, shY + 36); ctx.lineTo(6, shY + 4); ctx.closePath(); fillLine('#E6F0FA', 5); // one collar tip up
    // shirt tail sticking out
    ctx.beginPath(); ctx.moveTo(40, -270); ctx.quadraticCurveTo(95, -250, 120, -205); ctx.lineTo(60, -215); ctx.closePath(); fillLine('#E6F0FA', 5);
  } else { // suit: white shirt V, lapels
    ctx.beginPath(); ctx.moveTo(-58, shY - 4); ctx.lineTo(0, shY + 170); ctx.lineTo(58, shY - 4); ctx.closePath(); fillLine('#F4F4F0', 5);
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 62, shY - 4); ctx.lineTo(sx * 8, shY + 190); ctx.lineTo(sx * 70, shY + 70); ctx.lineTo(sx * 92, shY + 50); ctx.closePath(); fillLine(shade('#3A3F55', 0.12), 5); }
    ell(-8, -360, 7, 7); fillLine('#22263A', 3); ell(-8, -300, 7, 7); fillLine('#22263A', 3);
    ctx.beginPath(); ctx.moveTo(70, shY + 120); ctx.lineTo(118, shY + 112); ctx.lineTo(116, shY + 132); ctx.lineTo(72, shY + 138); ctx.closePath(); fillLine('#F4F4F0', 4); // pocket square
  }
  ctx.save(); ctx.translate(0, shY + 12); ctx.rotate(crooked ? 0.32 : 0);
  ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.lineTo(13, 32); ctx.lineTo(-13, 32); ctx.closePath(); fillLine(col, 5);
  ctx.beginPath(); ctx.moveTo(-12, 30); ctx.lineTo(12, 30); ctx.lineTo(28, crooked ? 170 : 200); ctx.lineTo(0, crooked ? 200 : 232); ctx.lineTo(-28, crooked ? 170 : 200); ctx.closePath(); fillLine(lgrad(-28, 28, col), 5);
  ctx.strokeStyle = shade(col, -0.3); ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-14, 70 + i * 40); ctx.lineTo(16, 90 + i * 40); ctx.stroke(); }
  ctx.restore();
}; }
// fix: 'shirt'/'suit' kinds draw like 'polo' without the collar
const _hdChar = hdChar;
function person(o) { const r = _hdChar(o); return r; }
function paco(o) { return person(Object.assign({ who: 'paco' }, o)); }
function pacoE(o) { return person(Object.assign({ who: 'paco', outfit: 'pacoEnt', behindArms: tieOn(true, '#D8323A') }, o)); }
function ramon(o) { return person(Object.assign({ who: 'ramon', outfit: 'jefe', behindArms: tieOn(false, '#7A3FA8') }, o)); }
function sunglasses(o) { const [x, y, R] = headPos(o); ctx.save(); ctx.translate(x, y - R * 0.06); ctx.rotate(o.lean || 0);
  for (const sx of [-1, 1]) { roundRect(sx * R * 0.38 - R * 0.36, -R * 0.24, R * 0.72, R * 0.5, R * 0.2); fillLine('#1B1B26', 8); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.moveTo(sx * R * 0.38 - R * 0.22, -R * 0.16); ctx.lineTo(sx * R * 0.38 - R * 0.06, -R * 0.16); ctx.lineTo(sx * R * 0.38 - R * 0.2, R * 0.12); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = LINE; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-R * 0.04, -R * 0.06); ctx.lineTo(R * 0.04, -R * 0.06); ctx.stroke(); ctx.restore(); }

// ---------- backgrounds
function wall(col, y1 = 1500) { ctx.fillStyle = col; ctx.fillRect(-300, -300, W + 600, y1 + 300); halftone(-300, 0, W + 600, y1, 'rgba(60,30,10,0.05)', 28); }
function floorWood(y0 = 1500) { ctx.fillStyle = '#C98E5A'; ctx.fillRect(-300, y0, W + 600, 900); ctx.strokeStyle = 'rgba(90,40,10,0.25)'; ctx.lineWidth = 5;
  for (let y = y0 + 60; y < 2100; y += 90) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); }
  ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-300, y0); ctx.lineTo(W + 300, y0); ctx.stroke(); }
function plant(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const a of [-0.7, -0.35, 0, 0.35, 0.7]) { ctx.save(); ctx.translate(0, -150); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-36, -120, 0, -210); ctx.quadraticCurveTo(36, -120, 0, 0); fillLine(lgrad(-36, 36, '#4FA35A'), 6); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(-80, -160); ctx.lineTo(80, -160); ctx.lineTo(60, 0); ctx.lineTo(-60, 0); ctx.closePath(); fillLine(lgrad(-80, 80, '#F2F0E6'), 7); ctx.restore(); }
function frame(x, y, w, h, fn) { roundRect(x, y, w, h, 8); fillLine('#7A4A2A', 8); roundRect(x + 18, y + 18, w - 36, h - 36, 4); fillLine('#F7F1E3', 5); ctx.save(); roundRect(x + 18, y + 18, w - 36, h - 36, 4); ctx.clip(); fn(); ctx.restore(); }
function car(x, y, s, col, o = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  const body = () => { ctx.beginPath(); ctx.moveTo(-430, -40); ctx.quadraticCurveTo(-440, -190, -330, -200); ctx.lineTo(-210, -210); ctx.quadraticCurveTo(-150, -370, -20, -380); ctx.lineTo(150, -380); ctx.quadraticCurveTo(260, -370, 310, -220); ctx.lineTo(380, -205); ctx.quadraticCurveTo(450, -190, 445, -40); ctx.closePath(); };
  const win = () => { ctx.moveTo(-170, -215); ctx.quadraticCurveTo(-120, -340, -20, -345); ctx.lineTo(70, -345); ctx.lineTo(70, -215); ctx.closePath(); ctx.moveTo(100, -215); ctx.lineTo(100, -345); ctx.lineTo(150, -345); ctx.quadraticCurveTo(240, -335, 280, -215); ctx.closePath(); };
  if (o.inside) { ctx.save(); ctx.beginPath(); win(); ctx.fillStyle = '#2A3550'; ctx.fill(); ctx.clip(); o.inside(); ctx.restore(); }
  body(); win(); ctx.fillStyle = lgrad(-440, 450, col); ctx.fill('evenodd'); ctx.lineWidth = 9; ctx.strokeStyle = LINE; ctx.stroke();
  ctx.save(); ctx.beginPath(); win(); ctx.clip(); ctx.fillStyle = 'rgba(200,230,255,0.22)'; ctx.beginPath(); ctx.moveTo(-160, -340); ctx.lineTo(-100, -340); ctx.lineTo(-170, -210); ctx.lineTo(-230, -210); ctx.fill(); ctx.restore();
  ctx.strokeStyle = shade(col, -0.35); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(85, -200); ctx.lineTo(85, -60); ctx.stroke(); roundRect(20, -175, 50, 14, 6); fillLine('#DDD', 4);
  roundRect(400, -150, 50, 40, 12); fillLine('#FFF2B0', 5); roundRect(-445, -150, 36, 36, 10); fillLine('#FF5D5D', 5);
  for (const wx of [-260, 260]) { ell(wx, -30, 92, 92); fillLine('#22222A', 8); ell(wx, -30, 48, 48); fillLine('#C9CCD6', 6); ell(wx, -30, 14, 14); fillLine('#8A8E9A', 4); }
  ctx.restore(); }

function partBadge(n) { ctx.save(); ctx.translate(540, 470 + 30); ctx.rotate(-0.04); roundRect(-170, -48, 340, 96, 28); ctx.fillStyle = '#16100F'; ctx.fill(); lab(`Parte ${n}/3`, 0, 4, 56, '#FFE14D'); ctx.restore(); }

// ---------- 4/5: office with desk
function officeBG() { wall('#E4EEF2', 1500);
  // big window looking at the parking lot
  roundRect(160, 330, 760, 640, 10); fillLine('#BFE6FF', 10);
  ctx.save(); roundRect(160, 330, 760, 640, 10); ctx.clip(); ctx.fillStyle = '#9AA0AE'; ctx.fillRect(160, 760, 760, 220); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; for (let x = 200; x < 920; x += 150) { ctx.beginPath(); ctx.moveTo(x, 790); ctx.lineTo(x - 30, 980); ctx.stroke(); }
  car(330, 900, 0.22, '#3FA7A0'); car(640, 900, 0.22, '#E8233A'); car(810, 900, 0.22, '#F2D06A'); ctx.restore();
  ctx.strokeStyle = LINE; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(540, 330); ctx.lineTo(540, 970); ctx.stroke();
  frame(870, 1040, 170, 200, () => { ctx.fillStyle = '#F2D06A'; ctx.fillRect(870, 1040, 170, 200); lab('Nº1', 955, 1140, 44, '#16100F'); });
  ctx.fillStyle = '#9AA6B2'; ctx.fillRect(-300, 1500, W + 600, 700); ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-300, 1500); ctx.lineTo(W + 300, 1500); ctx.stroke(); }
function desk(y = 1380) { roundRect(-60, y, 1200, 70, 14); fillLine(lgrad(-60, 1140, '#9A5E36'), 9); ctx.fillStyle = shade('#9A5E36', -0.25); ctx.fillRect(-60, y + 70, 1200, 600); ctx.strokeStyle = LINE; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-60, y + 70); ctx.lineTo(1140, y + 70); ctx.stroke(); halftone(-60, y + 80, 1200, 500, 'rgba(0,0,0,0.08)', 22);
  // desk props: name plate, mug
  ctx.save(); ctx.translate(820, y - 10); roundRect(-110, -50, 220, 60, 8); fillLine('#2A2A36', 6); lab('D. RAMÓN', 0, -20, 30, '#F2D06A'); ctx.restore(); }
