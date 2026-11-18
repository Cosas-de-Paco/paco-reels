// Paco 3.0 body: arms and legs built from tapered segments (shoulder, elbow, wrist / hip, knee, ankle),
// set-in shoulders, hands with fingers and thumb, short sleeves, new outfits and an HD cat.
// Loaded after hd.js: it replaces hdChar and keeps the same options.

Object.assign(STYLES, {
  chica: { skin: '#F1C3A0', hair: '#6B3A22', iris: '#5A8A3C', hairStyle: 'long', nose: 'small', R: 150, lashes: true },
  monitor: { skin: '#D9A07A', hair: '#1E1612', iris: '#3A2414', hairStyle: 'slick', nose: 'small', R: 150 },
});
Object.assign(OUTFITS, {
  pacoGym: { top: '#E8473A', legs: '#2E3A55', shoe: { top: '#F6F6F2', sole: '#2F8FD6' }, kind: 'tee', short: true },
  chica: { top: '#8A5CF6', legs: '#2A2235', shoe: { top: '#F6F6F2', sole: '#FF5D73' }, kind: 'sport', short: true },
  monitor: { top: '#222033', legs: '#222033', shoe: { top: '#F6F6F2', sole: '#111' }, kind: 'tee', short: true },
  pacoPijama: { top: '#5B7FD0', legs: '#5B7FD0', shoe: { top: '#8A5A3A', sole: '#5A3A2A' }, kind: 'pijama' },
  pacoCasa: { top: '#2E8B7A', legs: '#3D5A86', shoe: { top: '#F6F6F2', sole: '#E2473A' }, kind: 'hoodie' },
});

const _hdHairOld = window.hdHair;
window.hdHair = function (st, R, t) {
  if (st.hairStyle !== 'long') return _hdHairOld(st, R, t);
  ctx.beginPath(); ctx.moveTo(-R * 1.04, R * 0.35); ctx.bezierCurveTo(-R * 1.25, -R * 1.5, R * 1.25, -R * 1.5, R * 1.04, R * 0.35);
  ctx.quadraticCurveTo(R * 0.95, -R * 0.3, R * 0.55, -R * 0.55); ctx.quadraticCurveTo(R * 0.1, -R * 0.35, -R * 0.2, -R * 0.62);
  ctx.quadraticCurveTo(-R * 0.75, -R * 0.45, -R * 0.88, -R * 0.1); ctx.quadraticCurveTo(-R * 0.98, R * 0.1, -R * 1.04, R * 0.35); ctx.closePath();
  fillLine(rgrad(0, -R * 0.8, R * 1.1, st.hair), 7);
  ctx.strokeStyle = 'rgba(255,230,200,0.3)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, -R * 0.15, R * 0.8, -2.4, -1.7); ctx.stroke();
  ctx.fillStyle = '#FF5D73'; ell(R * 0.7, -R * 0.75, R * 0.14, R * 0.09, 0.5); ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 5; ctx.stroke();
};
// tapered capsule between two circles
function capsule(x0, y0, r0, x1, y1, r1) {
  const d = Math.max(0.01, Math.hypot(x1 - x0, y1 - y0)), th = Math.atan2(y1 - y0, x1 - x0);
  const ph = Math.acos(clamp((r0 - r1) / d, -1, 1));
  ctx.beginPath(); ctx.arc(x0, y0, r0, th + ph, th - ph + Math.PI * 2); ctx.arc(x1, y1, r1, th - ph, th + ph); ctx.closePath();
}
function ik2(x0, y0, x1, y1, a, b, bend) {
  const dx = x1 - x0, dy = y1 - y0; let d = Math.hypot(dx, dy);
  d = clamp(d, Math.abs(a - b) + 1, a + b - 0.5);
  const th = Math.atan2(dy, dx), al = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
  const s = bend >= 0 ? 1 : -1;
  return [x0 + Math.cos(th + s * al) * a, y0 + Math.sin(th + s * al) * a, x0 + Math.cos(th) * d, y0 + Math.sin(th) * d];
}
// segs: [[x0,y0,r0,x1,y1,r1,color], ...] drawn as one merged shape with soft shading
function segLimb(segs, lw = 11) {
  ctx.lineJoin = 'round';
  for (const s of segs) { capsule(...s.slice(0, 6)); ctx.lineWidth = lw; ctx.strokeStyle = LINE; ctx.stroke(); }
  for (const s of segs) {
    capsule(...s.slice(0, 6)); ctx.fillStyle = shade(s[6], -0.16); ctx.fill();
    // lit side: same capsule nudged towards the light (upper left), clipped
    ctx.save(); capsule(...s.slice(0, 6)); ctx.clip();
    const r = (s[2] + s[5]) / 2; capsule(s[0] - r * 0.32, s[1] - r * 0.22, s[2] * 0.92, s[3] - r * 0.32, s[4] - r * 0.22, s[5] * 0.92); ctx.fillStyle = s[6]; ctx.fill();
    capsule(s[0] - r * 0.5, s[1] - r * 0.3, s[2] * 0.25, s[3] - r * 0.5, s[4] - r * 0.3, s[5] * 0.25); ctx.fillStyle = 'rgba(255,255,255,0.13)'; ctx.fill();
    ctx.restore();
  }
}
// crease on the inner side of a joint
function crease(jx, jy, ax, ay, bx, by, r, col) {
  const a1 = Math.atan2(ay - jy, ax - jx), a2 = Math.atan2(by - jy, bx - jx);
  let mid = (a1 + a2) / 2; if (Math.abs(a1 - a2) > Math.PI) mid += Math.PI;
  const cx = jx + Math.cos(mid) * r * 0.55, cy = jy + Math.sin(mid) * r * 0.55;
  ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx + Math.cos(mid + 1.9) * r * 0.45, cy + Math.sin(mid + 1.9) * r * 0.45);
  ctx.quadraticCurveTo(cx - Math.cos(mid) * r * 0.15, cy - Math.sin(mid) * r * 0.15, cx + Math.cos(mid - 1.9) * r * 0.45, cy + Math.sin(mid - 1.9) * r * 0.45); ctx.stroke();
}

// hand. pose: open | fist | point | thumb | wave | grab ; side: -1 left, +1 right (thumb towards the body)
function hdHand2(x, y, ang, skin, r, pose = 'open', side = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(1, side);
  const parts = [];
  const palm = () => { ell(r * 0.55, 0, r * 0.78, r * 0.7); };
  const fing = [];
  if (pose === 'open' || pose === 'wave') {
    const spread = pose === 'wave' ? 0.22 : 0.1;
    [[-0.48, 0.62], [-0.16, 0.78], [0.16, 0.74], [0.46, 0.6]].forEach(([oy, L], i) => {
      const a = (oy) * spread * 3; fing.push([r * 1.05, oy * r, r * 0.2, r * 1.05 + Math.cos(a) * L * r, oy * r + Math.sin(a) * L * r, r * 0.17]); });
  } else if (pose === 'point') {
    fing.push([r * 1.0, -r * 0.42, r * 0.2, r * 2.0, -r * 0.5, r * 0.17]);
  }
  // thumb (on the -y side after the side flip so it sits towards the body)
  let thumb;
  if (pose === 'thumb') thumb = [r * 0.6, -r * 0.55, r * 0.24, r * 0.55, -r * 1.45, r * 0.2];
  else if (pose === 'fist' || pose === 'point' || pose === 'grab') thumb = [r * 0.35, -r * 0.6, r * 0.22, r * 0.95, -r * 0.35, r * 0.2];
  else thumb = [r * 0.35, -r * 0.62, r * 0.23, r * 0.85, -r * 1.05, r * 0.19];
  // outlines first, then fills, so the parts merge
  ctx.lineJoin = 'round'; ctx.lineWidth = 7; ctx.strokeStyle = LINE;
  for (const f of fing) { capsule(...f); ctx.stroke(); }
  palm(); ctx.stroke();
  capsule(...thumb); ctx.stroke();
  const g = rgrad(r * 0.4, -r * 0.1, r * 1.1, skin);
  for (const f of fing) { capsule(...f); ctx.fillStyle = g; ctx.fill(); }
  palm(); ctx.fillStyle = g; ctx.fill();
  // knuckles for closed hands
  ctx.strokeStyle = shade(skin, -0.3); ctx.lineWidth = 4; ctx.lineCap = 'round';
  if (pose !== 'open' && pose !== 'wave') {
    for (const k of [-0.05, 0.3]) { ctx.beginPath(); ctx.moveTo(r * 1.0, k * r); ctx.lineTo(r * 1.25, k * r + r * 0.05); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(r * 0.95, r * 0.1, r * 0.35, -1.2, 1.2); ctx.stroke();
  } else {
    for (const k of [-0.32, 0, 0.31]) { ctx.beginPath(); ctx.moveTo(r * 1.05, k * r); ctx.lineTo(r * 1.25, k * r); ctx.stroke(); }
  }
  capsule(...thumb); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 7; ctx.stroke();
  // little nail highlight
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  if (pose === 'thumb') { ell(thumb[3] + r * 0.02, thumb[4] + r * 0.05, r * 0.09, r * 0.12); ctx.fill(); }
  ctx.restore();
}

// arm from shoulder to hand. opts: sleeve colour, skin, short (bool), cuff (bool), pose, side, k
function hdArm(sh, hand, bend, o) {
  const k = o.k, aa = 158 * k, ab = 146 * k;
  const [ex, ey, hx0, hy0] = ik2(sh[0], sh[1], hand[0], hand[1], aa, ab, bend);
  const ang = Math.atan2(hy0 - ey, hx0 - ex);
  const wx = hx0 - Math.cos(ang) * 8 * k, wy = hy0 - Math.sin(ang) * 8 * k;
  const rS = 36 * k, rE = 25 * k, rW = 19 * k;
  if (o.short) {
    // bare arm, then the short sleeve over the shoulder
    segLimb([[sh[0], sh[1], rS * 0.86, ex, ey, rE * 0.95, o.skin], [ex, ey, rE * 0.92, wx, wy, rW, o.skin]], 10);
    crease(ex, ey, sh[0], sh[1], wx, wy, rE, shade(o.skin, -0.32));
    const mx = lerp(sh[0], ex, 0.4), my = lerp(sh[1], ey, 0.4);
    segLimb([[sh[0], sh[1], rS - 1 * k, mx, my, rE + 7 * k, o.sleeve]], 10);
    ctx.strokeStyle = shade(o.sleeve, -0.3); ctx.lineWidth = 4; const na = Math.atan2(ey - sh[1], ex - sh[0]) + Math.PI / 2, hr = rE + 2 * k, bx = mx - Math.cos(na - Math.PI / 2) * 9 * k, by = my - Math.sin(na - Math.PI / 2) * 9 * k;
    ctx.beginPath(); ctx.moveTo(bx + Math.cos(na) * hr, by + Math.sin(na) * hr); ctx.lineTo(bx - Math.cos(na) * hr, by - Math.sin(na) * hr); ctx.stroke();
  } else {
    segLimb([[sh[0], sh[1], rS, ex, ey, rE + 3 * k, o.sleeve], [ex, ey, rE + 2 * k, wx, wy, rW + 4 * k, o.sleeve]], 11);
    crease(ex, ey, sh[0], sh[1], wx, wy, rE, shade(o.sleeve, -0.35));
    // sleeve folds on the upper arm
    ctx.strokeStyle = shade(o.sleeve, -0.28); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (const f of [0.55, 0.72]) { const px = lerp(sh[0], ex, f), py = lerp(sh[1], ey, f); const n = Math.atan2(ey - sh[1], ex - sh[0]) + Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(px + Math.cos(n) * rE * 0.2, py + Math.sin(n) * rE * 0.2); ctx.quadraticCurveTo(px + Math.cos(n) * rE * 0.55 + Math.cos(n - 1.57) * 6, py + Math.sin(n) * rE * 0.55 + Math.sin(n - 1.57) * 6, px + Math.cos(n) * rE * 0.85, py + Math.sin(n) * rE * 0.85); ctx.stroke(); }
    if (o.cuff) {
      const cx = wx - Math.cos(ang) * 28 * k, cy = wy - Math.sin(ang) * 28 * k;
      segLimb([[cx, cy, rW + 5 * k, wx, wy, rW + 4 * k, shade(o.sleeve, 0.04)]], 7);
      ctx.strokeStyle = shade(o.sleeve, -0.35); ctx.lineWidth = 3;
      for (const f of [0.3, 0.7]) { const px = lerp(cx, wx, f), py = lerp(cy, wy, f), n = ang + Math.PI / 2; ctx.beginPath(); ctx.moveTo(px + Math.cos(n) * (rW + 2), py + Math.sin(n) * (rW + 2)); ctx.lineTo(px - Math.cos(n) * (rW + 2), py - Math.sin(n) * (rW + 2)); ctx.stroke(); }
    }
  }
  // set-in shoulder: hide the outline inside the torso and draw a seam
  if (!o.noSeam && !o.short) {
    ctx.save(); ctx.beginPath(); ctx.arc(sh[0], sh[1], rS - 5.5 * k, 0, Math.PI * 2); ctx.fillStyle = o.short ? o.sleeve : shade(o.sleeve, -0.02); ctx.fill(); ctx.restore();
    const out = Math.atan2(ey - sh[1], ex - sh[0]);
    ctx.strokeStyle = shade(o.sleeve, -0.3); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(sh[0], sh[1], rS - 8 * k, out + 1.3, out + Math.PI * 2 - 1.3); ctx.stroke();
  }
  hdHand2(hx0, hy0, ang, o.skin, 37 * k, o.pose, o.side);
  return [hx0, hy0, ang, ex, ey];
}

function hdLeg(hip, foot, bend, o) {
  const k = o.k, la = 124 * k, lb = 122 * k;
  const [kx, ky, ax, ay] = ik2(hip[0], hip[1], foot[0], foot[1] - 22 * k, la, lb, bend);
  const col = o.bare ? o.skin : o.legs;
  segLimb([[hip[0], hip[1], 40 * k, kx, ky, 31 * k, col], [kx, ky, 30 * k, ax, ay, 26 * k, col]], 11);
  crease(kx, ky, hip[0], hip[1], ax, ay, 30 * k, shade(col, -0.3));
  if (o.kind === 'pijama') { ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 5; capsule(hip[0], hip[1], 40 * k, kx, ky, 31 * k); ctx.save(); ctx.clip(); for (let i = -4; i < 6; i++) { ctx.beginPath(); ctx.moveTo(hip[0] - 80, hip[1] + i * 40); ctx.lineTo(hip[0] + 80, hip[1] + i * 40 + 30); ctx.stroke(); } ctx.restore(); }
  hdShoe(ax, ay + 22 * k, foot[0] < 0 ? -1 : 1, o.shoe, k * 1.1);
}

// o: {x,y,s, who, outfit, kid, lean, sq, belly, handL, handR, footL, footR, face, t, holdL, holdR, fistL, fistR, poseL, poseR, bendL, bendR, chest}
function hdChar(o) {
  const who = o.who || 'paco', st = STYLES[who], of = o.outfit ? (typeof o.outfit === 'string' ? OUTFITS[o.outfit] : o.outfit) : OUTFITS[who], t = o.t || 0;
  const k = o.kid ? 0.62 : 1;
  const s = o.s || 1;
  ctx.fillStyle = 'rgba(20,10,30,0.25)'; ell(o.x, o.y + 4, 200 * s * k * 1.2, 30 * s, 0); ctx.fill();
  ctx.save(); ctx.translate(o.x, o.y);
  const sq = o.sq || 0; ctx.scale(s * (1 + sq), s * (1 - sq));
  const breathe = Math.sin(t * 2.2) * 4 + (o.chest || 0) * -14;
  const hipY = -262 * k, shY = -570 * k + breathe, shX = 112 * k + (o.chest || 0) * 10;
  const lean = o.lean || 0;
  const belly = o.belly || 0;
  const skin = st.skin;
  const handL = o.handL || [-182 * k, -262 * k], handR = o.handR || [182 * k, -262 * k];
  const footL = o.footL || [-58 * k, 0], footR = o.footR || [58 * k, 0];
  if (of.kind === 'cape') {
    ctx.beginPath(); ctx.moveTo(-shX * 1.1, shY + 10); ctx.quadraticCurveTo(-shX * 2.4, hipY * 0.4, -shX * 2.3 + Math.sin(t * 3) * 10, -10);
    ctx.lineTo(shX * 2.3 + Math.sin(t * 3 + 1) * 10, -10); ctx.quadraticCurveTo(shX * 2.4, hipY * 0.4, shX * 1.1, shY + 10); ctx.closePath(); fillLine('#B3202C', 6);
  }
  // legs
  const hipL = [-58 * k, hipY], hipR = [58 * k, hipY];
  if (of.kind !== 'sheet') {
    hdLeg(hipR, footR, o.kneeR ?? -1, { k, legs: of.legs, shoe: of.shoe, skin, kind: of.kind });
    hdLeg(hipL, footL, o.kneeL ?? 1, { k, legs: of.legs, shoe: of.shoe, skin, kind: of.kind });
  }
  ctx.save(); ctx.translate(0, hipY); ctx.rotate(lean); ctx.translate(0, -hipY);
  const rS = 36 * k;
  const shL = [-shX, shY + rS + 2], shR = [shX, shY + rS + 2];
  const bw = belly * 72 * k;
  // torso with real shoulders: neckline, rounded shoulder caps, sides down to the hips
  const torso = () => {
    ctx.beginPath(); ctx.moveTo(-shX, shY);
    ctx.quadraticCurveTo(0, shY - 16 * k, shX, shY);
    ctx.arc(shX, shY + rS, rS, -Math.PI / 2, 0);
    ctx.bezierCurveTo(shX + rS + bw * 0.7, shY + 160 * k, shX + 18 * k + bw * 1.1, hipY - 70 * k, shX - 8 * k + bw * 0.7, hipY + 18 * k);
    ctx.quadraticCurveTo(0, hipY + 30 * k + bw * 0.15, -shX + 8 * k - bw * 0.7, hipY + 18 * k);
    ctx.bezierCurveTo(-shX - 18 * k - bw * 1.1, hipY - 70 * k, -shX - rS - bw * 0.7, shY + 160 * k, -shX - rS, shY + rS);
    ctx.arc(-shX, shY + rS, rS, Math.PI, Math.PI * 1.5); ctx.closePath();
  };
  if (st.hairStyle === 'long') { const hyL = shY - 6 * k - st.R * (o.kid ? 0.82 : 1) + Math.sin(t * 2.2 + 0.6) * 3, R = st.R, hs = o.kid ? 0.82 : 1;
  { ctx.save(); ctx.translate(0, hyL); const Rr = R * hs, sw = Math.sin(t * 2) * 6;
    ctx.beginPath(); ctx.moveTo(-Rr * 0.9, -Rr * 0.5); ctx.bezierCurveTo(-Rr * 1.35, Rr * 0.4, -Rr * 1.25 + sw, Rr * 1.0, -Rr * 0.95 + sw, Rr * 1.3);
    ctx.quadraticCurveTo(0, Rr * 1.1, Rr * 0.95 + sw, Rr * 1.3); ctx.bezierCurveTo(Rr * 1.25 + sw, Rr * 1.0, Rr * 1.35, Rr * 0.4, Rr * 0.9, -Rr * 0.5); ctx.closePath();
    fillLine(rgrad(0, Rr * 0.3, Rr * 1.6, st.hair), 7); ctx.restore(); }
  }
  if (of.kind === 'sheet') {
    ctx.beginPath(); ctx.moveTo(-shX * 1.2, shY);
    ctx.quadraticCurveTo(-shX * 1.9, hipY * 0.5, -shX * 1.8, 0);
    for (let i = 0; i <= 6; i++) { const x = -shX * 1.8 + i * shX * 0.6; ctx.quadraticCurveTo(x + shX * 0.3, 18 + Math.sin(t * 4 + i) * 6, x + shX * 0.6, 0); }
    ctx.quadraticCurveTo(shX * 1.9, hipY * 0.5, shX * 1.2, shY); ctx.closePath();
    fillLine(lgrad(-shX * 2, shX * 2, '#F4F4FB'), 6);
    hdShoe(-45 * k, 0, -1, of.shoe, k); hdShoe(45 * k, 0, 1, of.shoe, k);
  } else {
    torso(); fillLine(lgrad(-shX - rS - bw, shX + rS + bw, of.top), 7);
    ctx.save(); torso(); ctx.clip();
    // side shading and chest highlight
    const sg = ctx.createLinearGradient(-shX - rS - bw, 0, shX + rS + bw, 0); sg.addColorStop(0, 'rgba(255,255,255,0.10)'); sg.addColorStop(0.5, 'rgba(255,255,255,0)'); sg.addColorStop(0.85, 'rgba(20,10,30,0.10)'); sg.addColorStop(1, 'rgba(20,10,30,0.22)');
    ctx.fillStyle = sg; ctx.fillRect(-400, shY - 50, 800, hipY - shY + 120);
    ctx.fillStyle = shade(of.top, -0.15); ctx.fillRect(-400, hipY - 6, 800, 40);
    if (belly > 0) { ctx.fillStyle = 'rgba(255,255,255,0.12)'; ell(-20, (shY + hipY) / 2 + 40, 60 + bw * 0.6, 70 + bw * 0.5); ctx.fill(); }
    if (of.kind === 'pijama') { ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 6; for (let i = -6; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-300, shY + i * 50); ctx.lineTo(300, shY + i * 50 + 120); ctx.stroke(); } }
    ctx.restore();
    if (of.kind === 'hoodie') {
      ctx.save(); torso(); ctx.clip();
      ctx.strokeStyle = shade(of.top, -0.3); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-72 - bw * 0.5, hipY - 15); ctx.quadraticCurveTo(-60, hipY - 104, 0, hipY - 108); ctx.quadraticCurveTo(60, hipY - 104, 72 + bw * 0.5, hipY - 15); ctx.stroke();
      ctx.restore();
      ctx.beginPath(); ctx.moveTo(-shX * 0.8, shY + 2); ctx.quadraticCurveTo(0, shY + 74, shX * 0.8, shY + 2); ctx.quadraticCurveTo(0, shY - 40, -shX * 0.8, shY + 2); fillLine(shade(of.top, -0.12), 6);
      ctx.strokeStyle = '#F2F0E6'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 25, shY + 42); ctx.quadraticCurveTo(sx * 32, shY + 92, sx * 28 + Math.sin(t * 3 + sx) * 5, shY + 132); ctx.stroke(); ell(sx * 28 + Math.sin(t * 3 + sx) * 5, shY + 136, 6, 8); ctx.fillStyle = '#F2F0E6'; ctx.fill(); }
    }
    if (of.kind === 'tee' || of.kind === 'sport' || of.kind === 'pijama') {
      ctx.beginPath(); ctx.moveTo(-48 * k, shY - 6); ctx.quadraticCurveTo(0, shY + 46 * k, 48 * k, shY - 6); ctx.strokeStyle = shade(of.top, -0.3); ctx.lineWidth = 9; ctx.stroke();
      ctx.fillStyle = shade(skin, -0.1); ctx.beginPath(); ctx.moveTo(-44 * k, shY - 4); ctx.quadraticCurveTo(0, shY + 40 * k, 44 * k, shY - 4); ctx.closePath(); ctx.fill();
      if (of.kind === 'sport') { ctx.strokeStyle = '#FFD23F'; ctx.lineWidth = 8; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * (shX + 20), shY + 60); ctx.quadraticCurveTo(sx * (shX + 8), (shY + hipY) / 2, sx * (shX - 10), hipY + 10); ctx.stroke(); } }
      if (of.kind === 'tee' && who === 'paco') { ctx.fillStyle = '#FFF3E0'; ctx.font = fontPx(54, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('GYM', 0, shY + 150 * k); }
      if (who === 'monitor') { ctx.fillStyle = '#FFD23F'; ctx.font = fontPx(40, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('STAFF', 0, shY + 140 * k); }
      if (of.kind === 'pijama') for (let i = 0; i < 3; i++) { ell(0, shY + 80 * k + i * 70 * k, 9, 9); fillLine('#F2F0E6', 3); }
    }
    if (of.kind === 'cardigan') {
      ctx.fillStyle = '#F2EEE4'; ctx.beginPath(); ctx.moveTo(-45 * k, shY - 5); ctx.lineTo(0, shY + 120 * k); ctx.lineTo(45 * k, shY - 5); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = shade(of.top, -0.35); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, shY + 120 * k); ctx.lineTo(0, hipY + 10); ctx.stroke();
      for (let i = 0; i < 3; i++) { ell(14, shY + 160 * k + i * 70 * k, 9, 9); fillLine('#F2D58A', 3); }
    }
    if (of.kind === 'polo') {
      ctx.beginPath(); ctx.moveTo(-60 * k, shY - 8); ctx.lineTo(-20 * k, shY + 40 * k); ctx.lineTo(0, shY + 10 * k); ctx.lineTo(20 * k, shY + 40 * k); ctx.lineTo(60 * k, shY - 8); ctx.closePath(); fillLine(shade(of.top, 0.25), 5);
    }
  }
  if (o.behindArms) o.behindArms();
  const sleeve = of.kind === 'cape' ? '#222033' : of.top;
  const res = {};
  for (const [sh, hd, bend, side] of [[shL, handL, o.bendL ?? -1, 'L'], [shR, handR, o.bendR ?? 1, 'R']]) {
    const pose = (side === 'L' ? o.poseL : o.poseR) || ((side === 'L' ? o.fistL : o.fistR) ? 'fist' : ((side === 'L' ? o.holdL : o.holdR) ? 'grab' : 'open'));
    const r = hdArm(sh, hd, bend, { k, sleeve, skin, short: of.short, cuff: of.kind === 'hoodie', pose, side: side === 'L' ? -1 : 1 });
    res[side] = r;
    const hold = side === 'L' ? o.holdL : o.holdR; if (hold) hold(r[0], r[1], r[2]);
  }
  const R = st.R;
  const hs = o.kid ? 0.82 : 1;
  const neckY = shY - 6 * k;
  const hy = neckY - R * 1.0 * hs;
  if (!o.kid) { // neck with a soft shadow under the jaw
    roundRect(-36, neckY - 60, 72, 70, 20); ctx.fillStyle = shade(skin, -0.1); ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-36, neckY - 50); ctx.lineTo(-36, neckY + 4); ctx.moveTo(36, neckY - 50); ctx.lineTo(36, neckY + 4); ctx.stroke();
    ctx.fillStyle = 'rgba(90,40,30,0.22)'; ell(0, neckY - 46, 40, 16); ctx.fill();
  }
  const headBob = Math.sin(t * 2.2 + 0.6) * 3;
  hdHead(Object.assign({ x: 0, y: hy + headBob, s: hs, st, t, seed: who.length * 0.13 }, o.face || {}));
  if (o.face && o.face.flush) { const fl = o.face.flush; ctx.save(); ctx.translate(0, hy + headBob); ctx.scale(hs, hs); ell(0, 0, R, R * 1.06); ctx.clip();
    const g = ctx.createLinearGradient(0, R * 1.1, 0, -R * (0.2 + fl)); const col = fl > 0.8 ? '150,60,190' : '225,45,60';
    g.addColorStop(0, `rgba(${col},${0.45 * Math.min(1, fl)})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(-R * 1.2, -R * 1.2, R * 2.4, R * 2.4); ctx.restore(); }
  if (o.front) o.front(hy);
  ctx.restore();
  ctx.restore();
  return res;
}

// ---------- HD cat. o: {x,y,s,t, pose:'sit'|'walk'|'loaf'|'sleep'|'stand', dir, look, eyes:'open'|'half'|'closed'|'wide'|'happy', mouth:'w'|'open'|'smug', tail, ears, puff}
const CAT = { fur: '#F2A04A', dark: '#C9702A', light: '#FFF4E4', nose: '#F27A8A', iris: '#7BC043' };
function catHead(x, y, s, o) {
  const t = o.t || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.tilt || 0);
  const R = 110, ear = o.ears ?? 0; // ears: 0 up, 1 flat
  for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * R * 0.6, -R * 0.62); ctx.rotate(sx * (0.25 + ear * 0.9 + Math.max(0, Math.sin(t * 3 + sx) - 0.97) * 4));
    ctx.beginPath(); ctx.moveTo(-R * 0.36, R * 0.15); ctx.quadraticCurveTo(-R * 0.15, -R * 0.75, R * 0.05, -R * 0.62); ctx.quadraticCurveTo(R * 0.36, -R * 0.3, R * 0.36, R * 0.15); ctx.closePath(); fillLine(rgrad(0, -R * 0.2, R * 0.6, CAT.fur), 6);
    ctx.beginPath(); ctx.moveTo(-R * 0.2, R * 0.08); ctx.quadraticCurveTo(-R * 0.08, -R * 0.45, R * 0.04, -R * 0.42); ctx.quadraticCurveTo(R * 0.22, -R * 0.2, R * 0.2, R * 0.08); ctx.closePath(); ctx.fillStyle = '#F7B6B9'; ctx.fill(); ctx.restore(); }
  ell(0, 0, R * 1.08, R * 0.92); fillLine(rgrad(0, 0, R * 1.05, CAT.fur), 7);
  ctx.save(); ell(0, 0, R * 1.08, R * 0.92); ctx.clip();
  ctx.fillStyle = CAT.dark; for (const [a, w] of [[-0.25, 0.08], [0, 0.1], [0.25, 0.08]]) { ctx.beginPath(); ctx.moveTo(a * R - w * R, -R); ctx.quadraticCurveTo(a * R, -R * 0.45, a * R + w * R, -R); ctx.fill(); }
  for (const sx of [-1, 1]) for (const yy of [0.05, 0.3]) { ctx.beginPath(); ctx.moveTo(sx * R * 1.1, yy * R - 8); ctx.quadraticCurveTo(sx * R * 0.75, yy * R, sx * R * 1.1, yy * R + 12); ctx.fill(); }
  ctx.fillStyle = CAT.light; ell(0, R * 0.48, R * 0.6, R * 0.45); ctx.fill();
  ctx.restore();
  // eyes
  const look = o.look || [0, 0], mode = o.eyes || 'open';
  const blink = mode === 'open' || mode === 'wide' ? autoBlink(t, 0.5) : 0;
  for (const sx of [-1, 1]) {
    const ex = sx * R * 0.42, ey = -R * 0.08, rx = R * 0.25 * (mode === 'wide' ? 1.2 : 1), ry = R * 0.27 * (mode === 'wide' ? 1.25 : 1);
    if (mode === 'closed' || mode === 'happy') { ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath();
      if (mode === 'closed') ctx.arc(ex, ey - 6, R * 0.17, 0.2 * Math.PI, 0.8 * Math.PI); else ctx.arc(ex, ey + 10, R * 0.17, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); continue; }
    ell(ex, ey, rx, ry); fillLine(rgrad(ex, ey, ry, '#E8F5C8'), 5);
    ctx.save(); ell(ex, ey, rx, ry); ctx.clip();
    const ig = ctx.createRadialGradient(ex, ey + 6, 2, ex, ey, ry); ig.addColorStop(0, '#D8F08A'); ig.addColorStop(1, CAT.iris); ctx.fillStyle = ig; ell(ex, ey, rx, ry); ctx.fill();
    const pw = mode === 'wide' ? R * 0.15 : R * 0.06;
    ctx.fillStyle = '#15100E'; ell(ex + look[0] * rx * 0.4, ey + look[1] * ry * 0.3, pw, ry * 0.8); ctx.fill();
    ctx.fillStyle = '#fff'; ell(ex - rx * 0.35, ey - ry * 0.4, rx * 0.22, rx * 0.22); ctx.fill();
    let lid = Math.max(blink, mode === 'half' ? 0.48 : 0, mode === 'smug' ? 0.55 : 0);
    if (lid > 0) { const ly = ey - ry + lid * ry * 2.05; ctx.fillStyle = shade(CAT.fur, -0.05); ctx.fillRect(ex - rx - 4, ey - ry - 4, rx * 2 + 8, ly - (ey - ry) + 4);
      ctx.strokeStyle = LINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex - rx, ly + (mode === 'smug' ? sx * 6 : 0)); ctx.lineTo(ex + rx, ly - (mode === 'smug' ? sx * 6 : 0)); ctx.stroke(); }
    ctx.restore(); ell(ex, ey, rx, ry); ctx.strokeStyle = LINE; ctx.lineWidth = 5; ctx.stroke();
  }
  // nose + mouth
  ctx.beginPath(); ctx.moveTo(-R * 0.1, R * 0.2); ctx.lineTo(R * 0.1, R * 0.2); ctx.lineTo(0, R * 0.32); ctx.closePath(); fillLine(CAT.nose, 4);
  ctx.strokeStyle = LINE; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const m = o.mouth || 'w';
  if (m === 'open') { ell(0, R * 0.48, R * 0.12, R * 0.14); fillLine('#7A2A30', 5); ctx.fillStyle = '#F27A8A'; ell(0, R * 0.55, R * 0.08, R * 0.05); ctx.fill(); }
  else if (m === 'hiss') { ctx.beginPath(); ctx.moveTo(-R * 0.25, R * 0.42); ctx.quadraticCurveTo(0, R * 0.75, R * 0.25, R * 0.42); ctx.quadraticCurveTo(0, R * 0.36, -R * 0.25, R * 0.42); fillLine('#7A2A30', 5);
    ctx.fillStyle = '#fff'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * R * 0.17, R * 0.42); ctx.lineTo(sx * R * 0.12, R * 0.56); ctx.lineTo(sx * R * 0.07, R * 0.41); ctx.fill(); } }
  else { ctx.beginPath(); ctx.moveTo(0, R * 0.32); ctx.lineTo(0, R * 0.4); ctx.moveTo(-R * 0.18, R * 0.38); ctx.quadraticCurveTo(-R * 0.09, R * 0.5, 0, R * 0.4); ctx.quadraticCurveTo(R * 0.09, R * 0.5, R * 0.18, R * 0.38); if (m === 'smug') { ctx.moveTo(R * 0.18, R * 0.38); ctx.lineTo(R * 0.26, R * 0.3); } ctx.stroke(); }
  // whiskers
  ctx.strokeStyle = 'rgba(58,38,32,0.7)'; ctx.lineWidth = 3;
  for (const sx of [-1, 1]) for (const a of [-0.12, 0.05, 0.2]) { ctx.beginPath(); ctx.moveTo(sx * R * 0.35, R * 0.35); ctx.quadraticCurveTo(sx * R * 0.8, R * 0.3 + a * R, sx * R * 1.3, R * 0.22 + a * R * 2.2 + Math.sin(t * 2 + a * 9) * 3); ctx.stroke(); }
  // blush
  for (const sx of [-1, 1]) { const g = ctx.createRadialGradient(sx * R * 0.62, R * 0.28, 2, sx * R * 0.62, R * 0.28, R * 0.2); g.addColorStop(0, 'rgba(240,110,110,0.35)'); g.addColorStop(1, 'rgba(240,110,110,0)'); ctx.fillStyle = g; ell(sx * R * 0.62, R * 0.28, R * 0.22, R * 0.16); ctx.fill(); }
  ctx.restore();
}
function catTail(x, y, s, t, wave = 1, len = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const pts = []; for (let i = 0; i <= 10; i++) { const p = i / 10; pts.push([p * 60 * len + Math.sin(t * 2.5 + p * 3) * 30 * p * wave, -p * 230 * len + Math.cos(t * 2.5 + p * 2.5) * 20 * p * p * wave]); }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); ctx.lineTo(pts[10][0], pts[10][1]); };
  path(); ctx.strokeStyle = LINE; ctx.lineWidth = 50; ctx.stroke(); path(); ctx.strokeStyle = CAT.fur; ctx.lineWidth = 38; ctx.stroke();
  ctx.strokeStyle = CAT.dark; ctx.lineWidth = 38; ctx.setLineDash([14, 30]); path(); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
}
function hdCat(o) {
  const t = o.t || 0, s = o.s || 1, dir = o.dir || 1, pose = o.pose || 'sit';
  ctx.save(); ctx.translate(o.x, o.y);
  if (!o.noShadow) { ctx.fillStyle = 'rgba(20,10,30,0.25)'; ell(0, 4, 150 * s, 22 * s); ctx.fill(); }
  ctx.scale(dir, 1);
  const breathe = Math.sin(t * 2.4) * 3;
  if (pose === 'sit') {
    catTail(70 * s, -20 * s, s, t, o.tail ?? 1);
    ctx.save(); ctx.scale(s, s);
    // body
    ctx.beginPath(); ctx.moveTo(-70, -250); ctx.bezierCurveTo(-150, -150, -150, -10, -90, 0); ctx.lineTo(90, 0); ctx.bezierCurveTo(150, -10, 150, -150, 70, -250); ctx.closePath(); fillLine(rgrad(0, -130, 160, CAT.fur), 7);
    ctx.save(); ctx.clip(); ctx.fillStyle = CAT.dark; for (const yy of [-150, -95]) for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 150, yy - 14); ctx.quadraticCurveTo(sx * 90, yy, sx * 150, yy + 18); ctx.fill(); } ctx.restore();
    ell(0, -120 + breathe, 58, 100); ctx.fillStyle = CAT.light; ctx.fill();
    // haunches + front paws
    for (const sx of [-1, 1]) { ell(sx * 95, -55, 60, 60); fillLine(rgrad(sx * 95, -55, 60, CAT.fur), 6); }
    for (const sx of [-1, 1]) { capsule(sx * 35, -120, 24, sx * 38, -18, 24); fillLine(rgrad(sx * 35, -60, 40, CAT.fur), 6); ell(sx * 40, -10, 32, 20); fillLine(CAT.light, 5);
      ctx.strokeStyle = 'rgba(58,38,32,0.5)'; ctx.lineWidth = 3; for (const d of [-9, 9]) { ctx.beginPath(); ctx.moveTo(sx * 40 + d, -20); ctx.lineTo(sx * 40 + d, -6); ctx.stroke(); } }
    ctx.restore();
    catHead(0, -290 * s + breathe * 0.5, s, o);
  } else if (pose === 'walk' || pose === 'stand') {
    const w = pose === 'walk' ? t * 9 : 0;
    catTail(-150 * s, -170 * s, s, t, o.tail ?? 1, 0.9);
    ctx.save(); ctx.scale(s, s);
    const leg = (x, ph, back) => { const a = Math.sin(w + ph) * 0.45; ctx.save(); ctx.translate(x, -120); ctx.rotate(a); capsule(0, 0, 26, 0, 105, 20); fillLine(back ? shade(CAT.fur, -0.12) : CAT.fur, 6); ell(6, 112, 26, 15); fillLine(CAT.light, 5); ctx.restore(); };
    leg(-100, Math.PI, true); leg(90, 0, true);
    ell(0, -160 + Math.abs(Math.sin(w)) * -6, 170, 85); fillLine(rgrad(0, -170, 170, CAT.fur), 7);
    ctx.save(); ell(0, -160, 170, 85); ctx.clip(); ctx.fillStyle = CAT.dark; for (const x of [-90, -40, 10]) { ctx.beginPath(); ctx.moveTo(x - 20, -250); ctx.quadraticCurveTo(x + 8, -190, x + 14, -250); ctx.fill(); }
    ctx.fillStyle = CAT.light; ell(60, -110, 90, 40); ctx.fill(); ctx.restore();
    leg(-70, 0, false); leg(120, Math.PI, false);
    ctx.restore();
    catHead(150 * s, -250 * s, s * 0.95, o);
  } else if (pose === 'hang') { // held under the front legs: long dangling body
    const L = 230 * (o.stretch || 1), sw = Math.sin(t * 3) * 0.06;
    ctx.save(); ctx.scale(s, s); ctx.rotate(sw);
    ctx.save(); ctx.translate(40, L - 10); ctx.rotate(0.6 + Math.sin(t * 2.5) * 0.3); catTail(0, 0, 1, t, 0.6, 0.8); ctx.restore();
    for (const sx of [-1, 1]) { capsule(sx * 50, L - 40, 28, sx * 55 + Math.sin(t * 3 + sx) * 6, L + 90, 22); fillLine(rgrad(sx * 50, L, 40, CAT.fur), 6); ell(sx * 58, L + 100, 28, 17); fillLine(CAT.light, 5); }
    capsule(0, -10, 80, 0, L, 95); fillLine(rgrad(0, L * 0.4, L * 0.8, CAT.fur), 7);
    ctx.save(); capsule(0, -10, 80, 0, L, 95); ctx.clip(); ctx.fillStyle = CAT.dark; for (let i = 1; i < 6; i++) { const yy = i * L / 6; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 100, yy - 14); ctx.quadraticCurveTo(sx * 55, yy, sx * 100, yy + 16); ctx.fill(); } }
    ctx.fillStyle = CAT.light; ell(0, L * 0.45, 45, L * 0.45); ctx.fill(); ctx.restore();
    for (const sx of [-1, 1]) { capsule(sx * 70, 10, 24, sx * 115, -70, 20); fillLine(rgrad(sx * 80, -30, 40, CAT.fur), 6); }
    ctx.restore();
    catHead(0, -110 * s, s, o);
  } else if (pose === 'loaf') { // sitting tucked, as seen inside a box
    ctx.save(); ctx.scale(s, s);
    ell(0, -80 + breathe, 170, 100); fillLine(rgrad(0, -90, 170, CAT.fur), 7);
    ctx.save(); ell(0, -80, 170, 100); ctx.clip(); ctx.fillStyle = CAT.dark; for (const x of [-110, -60, 60, 110]) { ctx.beginPath(); ctx.moveTo(x - 18, -190); ctx.quadraticCurveTo(x + 6, -120, x + 14, -190); ctx.fill(); } ctx.restore();
    ctx.restore();
    catHead(0, -170 * s + breathe, s, o);
  } else if (pose === 'sleep') { // curled ball
    ctx.save(); ctx.scale(s, s);
    ell(0, -70 + breathe, 160, 80); fillLine(rgrad(0, -80, 160, CAT.fur), 7);
    ctx.save(); ell(0, -70, 160, 80); ctx.clip(); ctx.fillStyle = CAT.dark; for (const x of [-100, -50, 0, 50, 100]) { ctx.beginPath(); ctx.moveTo(x - 16, -160); ctx.quadraticCurveTo(x + 6, -100, x + 12, -160); ctx.fill(); } ctx.restore();
    ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(150, -40); ctx.quadraticCurveTo(100, 10, -40, -10); ctx.strokeStyle = LINE; ctx.lineWidth = 46; ctx.stroke(); ctx.strokeStyle = CAT.fur; ctx.lineWidth = 34; ctx.stroke();
    ctx.restore();
    catHead(-90 * s, -95 * s + breathe, s * 0.8, Object.assign({}, o, { eyes: o.eyes || 'closed', tilt: -0.25 }));
  }
  ctx.restore();
}

function sparkles(t, x, y, n = 6, r = 160) { for (let i = 0; i < n; i++) { const a = t * 1.5 + i * Math.PI * 2 / n, p = (Math.sin(t * 5 + i * 2) + 1) / 2; const sx = x + Math.cos(a) * r, sy = y + Math.sin(a) * r * 0.7;
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(a); ctx.scale(0.4 + p * 0.6, 0.4 + p * 0.6); ctx.fillStyle = '#FFF3B0'; ctx.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? 8 : 28; ctx.lineTo(Math.cos(k * Math.PI / 4) * rr, Math.sin(k * Math.PI / 4) * rr); } ctx.fill(); ctx.restore(); } }
