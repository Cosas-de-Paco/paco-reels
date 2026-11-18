// Paco 2.0: shaded characters with jointed limbs, eyelids, blinking and costumes.
let LINE = '#16100F';

function shade(hex, a) {
  const n = parseInt(hex.slice(1), 16); const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.round(a < 0 ? v * (1 + a) : v + (255 - v) * a);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function rgrad(x, y, r, c) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.45, r * 0.05, x, y, r * 1.15);
  g.addColorStop(0, shade(c, 0.28)); g.addColorStop(0.55, c); g.addColorStop(1, shade(c, -0.22)); return g;
}
function lgrad(x0, x1, c) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, shade(c, 0.18)); g.addColorStop(0.6, c); g.addColorStop(1, shade(c, -0.25)); return g;
}
function fillLine(fill, w = 6) { ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = w; ctx.strokeStyle = LINE; ctx.lineJoin = 'round'; ctx.stroke(); }
function ell(x, y, rx, ry, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, Math.PI * 2); }

// ---------- styles
const STYLES = {
  paco: { skin: '#F3C6A0', hair: '#5A3523', iris: '#4E8A3C', hairStyle: 'paco', stubble: true, nose: 'big', R: 150 },
  vampiro: { skin: '#EAD9D2', hair: '#1E1A22', iris: '#B3262E', hairStyle: 'slick', nose: 'small', R: 150, fangs: true },
  bruja: { skin: '#F6CFAE', hair: '#E2722B', iris: '#3F6FB5', hairStyle: 'pigtails', nose: 'small', R: 150, freckles: true, hat: 'witch' },
  calabaza: { skin: '#9A6440', hair: '#2A1A12', iris: '#3A2414', hairStyle: 'curly', nose: 'small', R: 150, hat: 'stem' },
  fantasma: { skin: '#F7D3B5', hair: '#7A4A2A', iris: '#4A7FC0', hairStyle: 'hood', nose: 'small', R: 150, lashes: true },
  abuela: { skin: '#F1C4A2', hair: '#DCDAE4', iris: '#5A7FA8', hairStyle: 'bun', nose: 'small', R: 150, glasses: true },
  cajera: { skin: '#E6AE88', hair: '#2B1D17', iris: '#5A3A22', hairStyle: 'pony', nose: 'small', R: 150, lashes: true },
  senor: { skin: '#EDBE9B', hair: '#CFCBD6', iris: '#4E6E8A', hairStyle: 'bald', nose: 'big', R: 150, glasses: true, mustache: true },
  senora: { skin: '#F0C8A8', hair: '#B5452F', iris: '#4E8A3C', hairStyle: 'curly', nose: 'small', R: 150, lashes: true },
  chico: { skin: '#C98E66', hair: '#1E1612', iris: '#3A2414', hairStyle: 'slick', nose: 'small', R: 150 },
};

function autoBlink(t, seed = 0) {
  const p = (t * 0.31 + seed) % 1; return p < 0.035 ? Math.sin(p / 0.035 * Math.PI) : 0;
}

// ---------- head. f: {x,y,s,rot,st, eyes:'open'|'happy'|'closed'|'wide'|'teary'|'dizzy'|'half', lid, look:[x,y],
//   brow:{raise,angry}, mouth, cheeks (puff 0..1), blush, sweat, tears, t, seed}
function hdHead(f) {
  const st = typeof f.st === 'string' ? STYLES[f.st] : (f.st || STYLES.paco);
  if (f.frizz && st.hairStyle === 'paco') f.frizzOn = true;
  const R = st.R, t = f.t || 0;
  ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot || 0); ctx.scale(f.s || 1, (f.s || 1) * (f.sy || 1));
  const skin = st.skin, skinD = shade(skin, -0.2);
  // hair behind
  if (st.hairStyle === 'pigtails') {
    for (const sx of [-1, 1]) {
      ctx.save(); ctx.translate(sx * R * 1.0, R * 0.25); ctx.rotate(sx * (0.25 + Math.sin(t * 4) * 0.08));
      ell(sx * 25, 50, 42, 80); fillLine(rgrad(sx * 25, 50, 80, st.hair));
      ell(0, -10, 22, 16); fillLine('#7FC24A', 5);
      ctx.restore();
    }
  }
  if (st.hairStyle === 'bun') { ell(0, -R * 1.12, R * 0.42, R * 0.36); fillLine(rgrad(0, -R * 1.15, R * 0.45, st.hair), 7);
    ctx.strokeStyle = 'rgba(150,145,170,0.6)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, -R * 1.12, R * 0.22, 0.5, 2.6); ctx.stroke(); }
  if (st.hairStyle === 'pony') { ctx.save(); ctx.translate(R * 0.75, -R * 0.55); ctx.rotate(0.5 + Math.sin(t * 5) * 0.12);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(R * 0.7, R * 0.2, R * 0.45, R * 1.1); ctx.quadraticCurveTo(R * 0.15, R * 0.5, 0, 0); fillLine(rgrad(R * 0.3, R * 0.4, R * 0.6, st.hair), 6); ctx.restore(); }
  if (st.hairStyle === 'hood') {
    ctx.beginPath(); ctx.moveTo(-R * 1.25, R * 1.5);
    ctx.bezierCurveTo(-R * 1.5, -R * 1.2, R * 1.5, -R * 1.2, R * 1.25, R * 1.5); ctx.closePath();
    fillLine(rgrad(0, -R * 0.2, R * 1.4, '#F4F4FB'));
  }
  // ears
  if (st.hairStyle !== 'hood') for (const sx of [-1, 1]) {
    ell(sx * R * 0.97, R * 0.08, R * 0.2, R * 0.27); fillLine(rgrad(sx * R, R * 0.08, R * 0.25, skin));
    ctx.strokeStyle = skinD; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(sx * R * 0.99, R * 0.1, R * 0.1, sx > 0 ? -1.4 : 1.7, sx > 0 ? 1.4 : 4.5); ctx.stroke();
  }
  // cheeks puff (chewing)
  const puff = f.cheeks || 0;
  // head
  ell(0, 0, R * (1 + puff * 0.08), R * 1.06); fillLine(rgrad(0, 0, R, skin), 7);
  ctx.save(); ell(0, 0, R * (1 + puff * 0.08), R * 1.06); ctx.clip();
  // soft jaw shade + stubble
  ctx.fillStyle = 'rgba(120,60,40,0.10)'; ell(0, R * 1.05, R * 1.1, R * 0.45); ctx.fill();
  if (st.stubble) { ctx.fillStyle = 'rgba(110,70,55,0.07)'; ell(0, R * 0.8, R * 0.7, R * 0.38); ctx.fill(); }
  ctx.restore();
  // blush
  const bl = 0.28 + (f.blush || 0) * 0.4;
  for (const sx of [-1, 1]) {
    const g = ctx.createRadialGradient(sx * R * 0.58, R * 0.38, 2, sx * R * 0.58, R * 0.38, R * 0.26);
    g.addColorStop(0, `rgba(240,100,95,${bl})`); g.addColorStop(1, 'rgba(240,100,95,0)'); ctx.fillStyle = g; ell(sx * R * 0.58, R * 0.38, R * 0.3, R * 0.22); ctx.fill();
  }
  if (st.freckles) { ctx.fillStyle = 'rgba(160,80,40,0.55)'; for (const [a, b] of [[-0.62, 0.2], [-0.5, 0.28], [-0.68, 0.32], [0.62, 0.2], [0.5, 0.28], [0.68, 0.32]]) { ell(a * R, b * R, 4, 4); ctx.fill(); } }

  // eyes
  const mode = f.eyes || 'open';
  const blink = Math.max(f.lid || 0, (mode === 'open' || mode === 'wide' || mode === 'teary' || mode === 'half') ? autoBlink(t, f.seed || 0) : 0);
  const look = f.look || [0, 0];
  for (const sx of [-1, 1]) {
    const ex = sx * R * 0.36, ey = -R * 0.06;
    const big = mode === 'wide' ? 1.3 : 1, rx = R * 0.24 * big * (f.eyeScale || 1), ry = R * 0.29 * big * (f.eyeScale || 1);
    if (mode === 'happy') {
      ctx.strokeStyle = LINE; ctx.lineWidth = 11; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(ex, ey + R * 0.06, R * 0.17, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); continue;
    }
    if (mode === 'closed') {
      ctx.strokeStyle = LINE; ctx.lineWidth = 10; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(ex, ey - R * 0.05, R * 0.16, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); continue;
    }
    if (mode === 'dizzy') {
      ctx.strokeStyle = LINE; ctx.lineWidth = 7; ctx.beginPath();
      for (let a = 0; a < 14; a += 0.2) { const r = a * 2.6; ctx.lineTo(ex + Math.cos(a + t * 8 * sx) * r, ey + Math.sin(a + t * 8 * sx) * r); }
      ctx.stroke(); continue;
    }
    const g = ctx.createRadialGradient(ex - rx * 0.3, ey - ry * 0.3, 2, ex, ey, ry * 1.1);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#E4E2EE');
    ell(ex, ey, rx, ry); fillLine(g, 6);
    ctx.save(); ell(ex, ey, rx, ry); ctx.clip();
    ctx.fillStyle = 'rgba(80,70,120,0.22)'; ell(ex, ey - ry * 0.95, rx * 1.3, ry * 0.5); ctx.fill();
    const ir = (mode === 'wide' ? R * 0.11 : R * 0.145) * (f.eyeScale || 1);
    const ix = ex + clamp(look[0], -1, 1) * (rx - ir) * 0.75, iy = ey + clamp(look[1], -1, 1) * (ry - ir) * 0.6 + R * 0.02;
    const ig = ctx.createRadialGradient(ix, iy + ir * 0.4, 1, ix, iy, ir);
    ig.addColorStop(0, shade(st.iris, 0.45)); ig.addColorStop(1, shade(st.iris, -0.25));
    ell(ix, iy, ir, ir); ctx.fillStyle = ig; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = LINE; ctx.stroke(); ctx.fillStyle = 'rgba(0,0,0,0.28)'; ell(ix, iy - ir * 0.45, ir * 1.05, ir * 0.6); ctx.fill();
    ell(ix, iy, ir * 0.52, ir * 0.52); ctx.fillStyle = '#16100E'; ctx.fill();
    ctx.fillStyle = '#fff'; ell(ix - ir * 0.36, iy - ir * 0.38, ir * 0.4, ir * 0.36, -0.5); ctx.fill(); ell(ix + ir * 0.4, iy + ir * 0.38, ir * 0.17, ir * 0.17); ctx.fill(); ell(ix + ir * 0.5, iy - ir * 0.45, ir * 0.08, ir * 0.08); ctx.fill();
    if (mode === 'teary') {
      ctx.fillStyle = 'rgba(120,190,255,0.55)'; ctx.fillRect(ex - rx, ey + ry * 0.35, rx * 2, ry);
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ell(ix + ir * 0.1, iy - ir * 0.1, ir * 0.22, ir * 0.22); ctx.fill();
    }
    // upper lid
    let lid = blink;
    if (mode === 'half') lid = Math.max(lid, 0.5);
    if (lid > 0) {
      const ly = ey - ry + lid * ry * 2.05;
      ctx.fillStyle = shade(skin, -0.08); ctx.fillRect(ex - rx - 5, ey - ry - 5, rx * 2 + 10, ly - (ey - ry) + 5);
      ctx.strokeStyle = LINE; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(ex - rx, ly); ctx.quadraticCurveTo(ex, ly + 8, ex + rx, ly); ctx.stroke();
    }
    ctx.restore();
    ell(ex, ey, rx, ry); ctx.strokeStyle = LINE; ctx.lineWidth = 6; ctx.stroke();
    if (st.lashes) { ctx.lineWidth = 6; for (const k of [-0.6, -0.2]) { ctx.beginPath(); ctx.moveTo(ex + sx * rx * 0.8 * (1 + k), ey - ry * 0.75); ctx.lineTo(ex + sx * rx * (1.15 + k * 0.5), ey - ry * 1.05); ctx.stroke(); } }
  }
  // brows
  const br = f.brow || {}; const raise = br.raise || 0, angry = br.angry || 0;
  ctx.strokeStyle = st.hairStyle === 'hood' ? '#7A4A2A' : shade(st.hair, -0.4); ctx.lineWidth = R * 0.115; ctx.lineCap = 'round';
  for (const sx of [-1, 1]) {
    const by = -R * 0.43 - raise * R * 0.13 - (mode === 'wide' ? R * 0.1 : 0);
    ctx.beginPath(); ctx.moveTo(sx * R * 0.14, by + angry * R * 0.12 - raise * R * 0.04);
    ctx.quadraticCurveTo(sx * R * 0.36, by - R * 0.07, sx * R * 0.56, by + R * 0.03 - angry * R * 0.05 + raise * R * 0.03); ctx.stroke();
  }
  // nose
  if (st.nose === 'big') {
    ell(0, R * 0.2, R * 0.2, R * 0.17); fillLine(rgrad(0, R * 0.2, R * 0.2, '#EBA88A'), 6);
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ell(-R * 0.07, R * 0.14, R * 0.055, R * 0.035, -0.4); ctx.fill();
  } else {
    ctx.fillStyle = shade(skin, -0.18); ell(0, R * 0.2, R * 0.09, R * 0.06); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ell(-R * 0.03, R * 0.18, R * 0.03, R * 0.02); ctx.fill();
  }
  if (st.mustache) { ctx.beginPath(); ctx.moveTo(0, R * 0.36); ctx.bezierCurveTo(-R * 0.25, R * 0.28, -R * 0.42, R * 0.42, -R * 0.38, R * 0.5); ctx.quadraticCurveTo(-R * 0.2, R * 0.42, 0, R * 0.46);
    ctx.quadraticCurveTo(R * 0.2, R * 0.42, R * 0.38, R * 0.5); ctx.bezierCurveTo(R * 0.42, R * 0.42, R * 0.25, R * 0.28, 0, R * 0.36); fillLine(rgrad(0, R * 0.4, R * 0.4, st.hair), 5); }
  // mouth
  hdMouth(f.mouth || 'smile', R, t, st, f);
  if (st.glasses) { ctx.strokeStyle = '#4A3A5A'; ctx.lineWidth = 8;
    for (const sx of [-1, 1]) { roundRect(sx * R * 0.36 - R * 0.3, -R * 0.38, R * 0.6, R * 0.58, R * 0.2); ctx.stroke();
      ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(sx * R * 0.36 - R * 0.2, -R * 0.3); ctx.lineTo(sx * R * 0.36 - R * 0.05, -R * 0.3); ctx.lineTo(sx * R * 0.36 - R * 0.22, -R * 0.0); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.beginPath(); ctx.moveTo(-R * 0.06, -R * 0.12); ctx.quadraticCurveTo(0, -R * 0.18, R * 0.06, -R * 0.12); ctx.stroke(); }
  if (puff > 0) for (const sx of [-1, 1]) { ctx.fillStyle = 'rgba(240,120,100,0.25)'; ell(sx * R * 0.72, R * 0.45, R * 0.2 * puff, R * 0.18 * puff); ctx.fill(); }
  if (f.soot) { ctx.save(); ell(0, 0, R, R * 1.06); ctx.clip(); ctx.globalAlpha = f.soot;
    ctx.fillStyle = 'rgba(40,30,30,0.18)'; ctx.fillRect(-R, -R * 1.1, R * 2, R * 2.2);
    ctx.fillStyle = 'rgba(30,22,22,0.45)'; for (const [a, b, r] of [[-0.5, 0.5, 0.35], [0.4, 0.7, 0.3], [0.1, -0.6, 0.4]]) { ell(a * R, b * R, r * R, r * R * 0.7); ctx.fill(); }
    ctx.restore(); }
  // hair front / hats
  if (f.frizzOn) { // blown-up hair
    ctx.beginPath(); const n = 16; for (let i = 0; i <= n; i++) { const a = Math.PI * (1.0 + i / n); const r = R * (i % 2 ? 1.25 : 1.6) * (1 + Math.sin(t * 9 + i) * 0.03);
      ctx.lineTo(Math.cos(a) * r, Math.min(-R * 0.5, Math.sin(a) * r * 0.8 - R * 0.35)); }
    ctx.closePath(); fillLine(rgrad(0, -R, R * 1.4, '#2E241F'), 7);
    ctx.fillStyle = 'rgba(255,200,120,0.25)'; ell(-R * 0.3, -R * 0.9, R * 0.3, R * 0.15); ctx.fill();
  } else hdHair(st, R, t);
  // sweat & tears
  if (f.sweat) {
    const p = (f.sweat % 1);
    ctx.save(); ctx.globalAlpha = 1 - p * 0.6; ctx.translate(R * 0.78, -R * 0.35 + p * R * 0.6);
    ctx.beginPath(); ctx.moveTo(0, -24); ctx.quadraticCurveTo(18, 4, 0, 16); ctx.quadraticCurveTo(-18, 4, 0, -24); fillLine('#9ED8FF', 4); ctx.restore();
  }
  if (f.tears) {
    ctx.fillStyle = 'rgba(120,190,255,0.75)';
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * R * 0.3, R * 0.15); ctx.quadraticCurveTo(sx * R * 0.42, R * 0.6, sx * R * 0.36, R * 0.95); ctx.lineTo(sx * R * 0.26, R * 0.95); ctx.quadraticCurveTo(sx * R * 0.3, R * 0.6, sx * R * 0.22, R * 0.15); ctx.fill(); }
  }
  ctx.restore();
}

function hdMouth(m, R, t, st, f) {
  const y = R * 0.55; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const dark = '#5A1A1E', tongue = '#E8737A';
  const inside = (pathFn) => { pathFn(); fillLine(dark, 7); ctx.save(); pathFn(); ctx.clip(); ctx.fillStyle = tongue; ell(0, y + R * 0.3, R * 0.25, R * 0.17); ctx.fill(); ctx.restore(); pathFn(); ctx.strokeStyle = LINE; ctx.lineWidth = 7; ctx.stroke(); };
  ctx.strokeStyle = LINE; ctx.lineWidth = 8;
  if (m === 'smile') { ctx.beginPath(); ctx.arc(0, y - R * 0.22, R * 0.3, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); }
  else if (m === 'flat') { ctx.beginPath(); ctx.moveTo(-R * 0.2, y); ctx.lineTo(R * 0.2, y); ctx.stroke(); }
  else if (m === 'frown') { ctx.beginPath(); ctx.arc(0, y + R * 0.2, R * 0.22, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
  else if (m === 'smirk') { ctx.beginPath(); ctx.moveTo(-R * 0.18, y + R * 0.02); ctx.quadraticCurveTo(R * 0.05, y + R * 0.08, R * 0.25, y - R * 0.08); ctx.stroke(); }
  else if (m === 'wobble') { ctx.beginPath(); for (let i = 0; i <= 20; i++) { const x = -R * 0.25 + i * R * 0.025; ctx.lineTo(x, y + Math.sin(i * 1.4 + t * 20) * 6); } ctx.stroke(); }
  else if (m === 'chew') { const c = Math.sin(t * 16); ctx.beginPath(); ctx.moveTo(-R * 0.18, y); ctx.quadraticCurveTo(0, y + c * 12, R * 0.18, y); ctx.stroke(); }
  else if (m === 'sour') {
    ell(0, y, R * 0.07, R * 0.06); fillLine(dark, 6);
    ctx.lineWidth = 4; for (let a = 0; a < 6.28; a += 0.9) { ctx.beginPath(); ctx.moveTo(Math.cos(a) * R * 0.1, y + Math.sin(a) * R * 0.09); ctx.lineTo(Math.cos(a) * R * 0.17, y + Math.sin(a) * R * 0.15); ctx.stroke(); }
  }
  else if (m === 'o') inside(() => ell(0, y + R * 0.05, R * 0.11, R * 0.14));
  else if (m === 'open') inside(() => { ctx.beginPath(); ctx.moveTo(-R * 0.25, y - R * 0.05); ctx.quadraticCurveTo(0, y + R * 0.45, R * 0.25, y - R * 0.05); ctx.quadraticCurveTo(0, y + R * 0.02, -R * 0.25, y - R * 0.05); });
  else if (m === 'grin') {
    const p = () => { ctx.beginPath(); ctx.moveTo(-R * 0.34, y - R * 0.1); ctx.quadraticCurveTo(0, y - R * 0.02, R * 0.34, y - R * 0.1); ctx.quadraticCurveTo(R * 0.3, y + R * 0.38, 0, y + R * 0.38); ctx.quadraticCurveTo(-R * 0.3, y + R * 0.38, -R * 0.34, y - R * 0.1); };
    p(); fillLine(dark, 7); ctx.save(); p(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-R * 0.4, y - R * 0.12, R * 0.8, R * 0.13); ctx.fillStyle = tongue; ell(0, y + R * 0.36, R * 0.2, R * 0.13); ctx.fill(); ctx.restore(); p(); ctx.strokeStyle = LINE; ctx.lineWidth = 7; ctx.stroke();
  }
  else if (m === 'scream') {
    const p = () => { ell(0, y + R * 0.08, R * 0.24, R * 0.3 + Math.sin(t * 30) * 4); };
    p(); fillLine(dark, 7); ctx.save(); p(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-R * 0.3, y - R * 0.26, R * 0.6, R * 0.09); ctx.fillStyle = tongue; ell(0, y + R * 0.36, R * 0.2, R * 0.14); ctx.fill(); ctx.restore(); p(); ctx.strokeStyle = LINE; ctx.lineWidth = 7; ctx.stroke();
  }
  if (st.fangs && m !== 'scream' && m !== 'grin' && m !== 'open') { ctx.fillStyle = '#fff'; ctx.lineWidth = 3; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * R * 0.12 - 8, y + 2); ctx.lineTo(sx * R * 0.12 + 8, y + 2); ctx.lineTo(sx * R * 0.12, y + 26); ctx.closePath(); ctx.fill(); ctx.stroke(); } }
}

function hdHair(st, R, t) {
  const c = st.hair;
  if (st.hairStyle === 'paco') {
    const sway = Math.sin(t * 3) * 0.12;
    ctx.beginPath(); ctx.moveTo(-R * 1.0, -R * 0.05);
    ctx.bezierCurveTo(-R * 1.15, -R * 0.9, -R * 0.55, -R * 1.35, R * 0.05, -R * 1.22);
    ctx.bezierCurveTo(R * 0.7, -R * 1.35, R * 1.2, -R * 0.85, R * 1.0, -R * 0.05);
    ctx.quadraticCurveTo(R * 0.92, -R * 0.45, R * 0.7, -R * 0.62);
    ctx.quadraticCurveTo(R * 0.5, -R * 0.48, R * 0.3, -R * 0.7);
    ctx.quadraticCurveTo(R * 0.05, -R * 0.5, -R * 0.15, -R * 0.72);
    ctx.quadraticCurveTo(-R * 0.4, -R * 0.5, -R * 0.62, -R * 0.66);
    ctx.quadraticCurveTo(-R * 0.9, -R * 0.45, -R * 1.0, -R * 0.05);
    ctx.closePath(); fillLine(rgrad(0, -R * 0.9, R * 1.1, c), 7);
    // cowlick
    ctx.save(); ctx.translate(R * 0.1, -R * 1.2); ctx.rotate(sway);
    ctx.beginPath(); ctx.moveTo(-20, 10); ctx.quadraticCurveTo(-10, -70, 50, -80); ctx.quadraticCurveTo(10, -40, 22, 10); ctx.closePath(); fillLine(rgrad(0, -30, 50, c), 6);
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,220,180,0.35)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-R * 0.15, -R * 0.55, R * 0.55, -2.5, -1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(R * 0.1, -R * 0.5, R * 0.6, -1.6, -1.2); ctx.stroke();
  } else if (st.hairStyle === 'slick') {
    ctx.beginPath(); ctx.moveTo(-R * 1.0, R * 0.05); ctx.bezierCurveTo(-R * 1.1, -R * 1.2, R * 1.1, -R * 1.2, R * 1.0, R * 0.05);
    ctx.quadraticCurveTo(R * 0.85, -R * 0.55, R * 0.1, -R * 0.62); ctx.lineTo(0, -R * 0.4); ctx.lineTo(-R * 0.1, -R * 0.62);
    ctx.quadraticCurveTo(-R * 0.85, -R * 0.55, -R * 1.0, R * 0.05); ctx.closePath(); fillLine(rgrad(0, -R * 0.8, R, c), 7);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(0, -R * 0.2, R * 0.75, -2.4, -1.9); ctx.stroke();
  } else if (st.hairStyle === 'pigtails') {
    ctx.beginPath(); ctx.moveTo(-R * 1.0, R * 0.1); ctx.bezierCurveTo(-R * 1.1, -R * 1.15, R * 1.1, -R * 1.15, R * 1.0, R * 0.1);
    for (let i = 0; i <= 6; i++) { const x = R * 0.85 - i * R * 0.283; ctx.quadraticCurveTo(x + R * 0.14, -R * 0.38, x - R * 0.0, -R * (i % 2 ? 0.5 : 0.56)); }
    ctx.closePath(); fillLine(rgrad(0, -R * 0.8, R, c), 7);
  } else if (st.hairStyle === 'curly') {
    for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * 0.112); ell(Math.cos(a) * R * 0.92, Math.sin(a) * R * 0.92, R * 0.28, R * 0.25); fillLine(rgrad(0, -R, R * 1.2, c), 6); }
  } else if (st.hairStyle === 'bun') {
    ctx.beginPath(); ctx.moveTo(-R * 1.02, R * 0.15); ctx.bezierCurveTo(-R * 1.15, -R * 1.15, R * 1.15, -R * 1.15, R * 1.02, R * 0.15);
    ctx.quadraticCurveTo(R * 0.9, -R * 0.45, R * 0.35, -R * 0.62); ctx.quadraticCurveTo(0, -R * 0.5, -R * 0.35, -R * 0.62); ctx.quadraticCurveTo(-R * 0.9, -R * 0.45, -R * 1.02, R * 0.15);
    ctx.closePath(); fillLine(rgrad(0, -R * 0.8, R * 1.1, c), 7);
    ctx.strokeStyle = 'rgba(140,135,160,0.55)'; ctx.lineWidth = 5; for (const k of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.arc(k * R, -R * 0.55, R * 0.28, -2.6, -0.6); ctx.stroke(); }
  } else if (st.hairStyle === 'pony') {
    ctx.beginPath(); ctx.moveTo(-R * 1.0, R * 0.1); ctx.bezierCurveTo(-R * 1.12, -R * 1.18, R * 1.12, -R * 1.18, R * 1.0, R * 0.1);
    ctx.quadraticCurveTo(R * 0.8, -R * 0.5, R * 0.1, -R * 0.55); ctx.quadraticCurveTo(-R * 0.5, -R * 0.62, -R * 0.75, -R * 0.2); ctx.quadraticCurveTo(-R * 0.9, -R * 0.1, -R * 1.0, R * 0.1);
    ctx.closePath(); fillLine(rgrad(0, -R * 0.8, R * 1.1, c), 7);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, -R * 0.2, R * 0.78, -2.3, -1.6); ctx.stroke();
  } else if (st.hairStyle === 'bald') {
    for (const sx of [-1, 1]) { ell(sx * R * 0.92, -R * 0.15, R * 0.2, R * 0.32, sx * 0.3); fillLine(rgrad(sx * R * 0.9, -R * 0.2, R * 0.3, c), 6); }
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ell(-R * 0.3, -R * 0.75, R * 0.22, R * 0.1, -0.4); ctx.fill();
  } else if (st.hairStyle === 'hood') {
    // sheet hood edge over the forehead
    ctx.beginPath(); ctx.moveTo(-R * 1.1, R * 0.2); ctx.bezierCurveTo(-R * 1.05, -R * 1.0, R * 1.05, -R * 1.0, R * 1.1, R * 0.2);
    ctx.lineTo(R * 1.5, R * 0.2); ctx.lineTo(R * 1.5, -R * 1.6); ctx.lineTo(-R * 1.5, -R * 1.6); ctx.lineTo(-R * 1.5, R * 0.2); ctx.closePath();
    ctx.save(); ctx.clip(); ell(0, -R * 0.2, R * 1.35, R * 1.25); ctx.fillStyle = rgrad(0, -R * 0.4, R * 1.3, '#F4F4FB'); ctx.fill(); ctx.restore();
    ctx.strokeStyle = LINE; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-R * 1.1, R * 0.2); ctx.bezierCurveTo(-R * 1.05, -R * 1.0, R * 1.05, -R * 1.0, R * 1.1, R * 0.2); ctx.stroke();
    ctx.beginPath(); ell(0, -R * 0.2, R * 1.35, R * 1.25); ctx.stroke();
    ctx.fillStyle = '#2B2B3A'; for (const sx of [-1, 1]) { ell(sx * R * 0.45, -R * 0.95, R * 0.1, R * 0.14); ctx.fill(); }
  }
  if (st.hat === 'witch') {
    ell(0, -R * 0.75, R * 1.5, R * 0.28); fillLine(rgrad(0, -R * 0.75, R * 1.5, '#4B2475'), 7);
    ctx.beginPath(); ctx.moveTo(-R * 0.75, -R * 0.8); ctx.quadraticCurveTo(-R * 0.3, -R * 1.8, R * 0.45, -R * 2.35 + Math.sin(t * 3) * 10); ctx.quadraticCurveTo(R * 0.25, -R * 1.6, R * 0.75, -R * 0.8); ctx.closePath();
    fillLine(rgrad(0, -R * 1.4, R, '#5B2C8C'), 7);
    ctx.fillStyle = '#F2A33A'; ctx.fillRect(-R * 0.72, -R * 1.0, R * 1.44, R * 0.16); ctx.strokeRect(-R * 0.72, -R * 1.0, R * 1.44, R * 0.16);
  }
  if (st.hat === 'stem') {
    ctx.fillStyle = '#4C8A2E'; roundRect(-R * 0.12, -R * 1.45, R * 0.24, R * 0.4, 10); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = LINE; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(R * 0.1, -R * 1.25); ctx.quadraticCurveTo(R * 0.6, -R * 1.6, R * 0.7, -R * 1.2); ctx.quadraticCurveTo(R * 0.4, -R * 1.05, R * 0.1, -R * 1.25); fillLine('#6DB33F', 5);
  }
}

// ---------- body
function ik(x0, y0, x1, y1, a, b, bend) {
  const dx = x1 - x0, dy = y1 - y0; let d = Math.hypot(dx, dy);
  d = clamp(d, Math.abs(a - b) + 1, a + b - 0.5);
  const th = Math.atan2(dy, dx), al = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
  return [x0 + Math.cos(th + bend * al) * a, y0 + Math.sin(th + bend * al) * a, x0 + Math.cos(th) * d, y0 + Math.sin(th) * d];
}
function limbDraw(x0, y0, ex, ey, x1, y1, color, w) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(ex, ey, x1, y1);
  ctx.strokeStyle = LINE; ctx.lineWidth = w + 12; ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = w * 0.3; ctx.beginPath(); ctx.moveTo(x0 - w * 0.2, y0); ctx.quadraticCurveTo(ex - w * 0.2, ey, x1 - w * 0.2, y1); ctx.stroke();
}
function hdHand(x, y, ang, skin, r, fist) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ell(r * 0.2, 0, r, r * 0.9); fillLine(rgrad(r * 0.2, 0, r, skin), 6);
  if (!fist) { ctx.strokeStyle = shade(skin, -0.3); ctx.lineWidth = 4; for (const k of [-0.3, 0.15]) { ctx.beginPath(); ctx.moveTo(r * 0.7, k * r); ctx.lineTo(r * 1.1, k * r * 1.2); ctx.stroke(); } }
  ell(r * 0.1, -r * 0.8, r * 0.35, r * 0.25, -0.6); fillLine(rgrad(0, -r * 0.8, r * 0.35, skin), 5);
  ctx.restore();
}
function hdShoe(x, y, dir, c, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-30, -38); ctx.quadraticCurveTo(-10, -55, 30, -40); ctx.quadraticCurveTo(80, -30, 82, -6); ctx.lineTo(82, 0); ctx.closePath();
  fillLine(lgrad(-30, 80, c.top), 6);
  ctx.fillStyle = c.sole; ctx.fillRect(-32, -10, 116, 12); ctx.strokeRect(-32, -10, 116, 12);
  ctx.restore();
}

const OUTFITS = {
  paco: { top: '#2E8B7A', legs: '#3D5A86', shoe: { top: '#F6F6F2', sole: '#E2473A' }, kind: 'hoodie' },
  vampiro: { top: '#222033', legs: '#222033', shoe: { top: '#2C2C2C', sole: '#111' }, kind: 'cape' },
  bruja: { top: '#6A3399', legs: '#2A2235', shoe: { top: '#2C2C2C', sole: '#111' }, kind: 'dress' },
  calabaza: { top: '#F28A26', legs: '#2F5E28', shoe: { top: '#3A2A20', sole: '#111' }, kind: 'pumpkin' },
  abuela: { top: '#9B6FB8', legs: '#4E4060', shoe: { top: '#6A4A3A', sole: '#2A1A12' }, kind: 'cardigan' },
  cajera: { top: '#E0503A', legs: '#2E3A55', shoe: { top: '#2C2C2C', sole: '#111' }, kind: 'polo' },
  senor: { top: '#B89A6A', legs: '#6A6A72', shoe: { top: '#5A3A2A', sole: '#2A1A12' }, kind: 'cardigan' },
  senora: { top: '#3FA7A0', legs: '#3A3550', shoe: { top: '#C2185B', sole: '#5A1030' }, kind: 'polo' },
  chico: { top: '#F2B33A', legs: '#2E3A55', shoe: { top: '#F6F6F2', sole: '#2F8FD6' }, kind: 'polo' },
  fantasma: { top: '#F4F4FB', legs: '#F4F4FB', shoe: { top: '#F48FB1', sole: '#C2185B' }, kind: 'sheet' },
};

// o: {x,y,s, who, kid, lean, sq, belly, handL:[x,y], handR:[x,y], footL, footR, face:{...}, t, holdR(fn(x,y,ang)), holdL, fistL, fistR, bendL, bendR}
function hdChar(o) {
  const who = o.who || 'paco', st = STYLES[who], of = o.outfit || OUTFITS[who], t = o.t || 0;
  const k = o.kid ? 0.62 : 1;
  const s = o.s || 1;
  // ground shadow
  ctx.fillStyle = 'rgba(20,10,30,0.25)'; ell(o.x, o.y + 4, 200 * s * k * 1.2, 30 * s, 0); ctx.fill();
  ctx.save(); ctx.translate(o.x, o.y);
  const sq = o.sq || 0; ctx.scale(s * (1 + sq), s * (1 - sq));
  const breathe = Math.sin(t * 2.2) * 4;
  const hipY = -250 * k, shY = -560 * k + breathe, shX = 105 * k;
  const lean = o.lean || 0;
  const belly = o.belly || 0;
  const skin = st.skin;
  const handL = o.handL || [-150 * k, -270 * k], handR = o.handR || [150 * k, -270 * k];
  const footL = o.footL || [-55 * k, 0], footR = o.footR || [55 * k, 0];
  // cape / sheet behind
  if (of.kind === 'cape') {
    ctx.beginPath(); ctx.moveTo(-shX * 1.1, shY + 10); ctx.quadraticCurveTo(-shX * 2.4, hipY * 0.4, -shX * 2.3 + Math.sin(t * 3) * 10, -10);
    ctx.lineTo(shX * 2.3 + Math.sin(t * 3 + 1) * 10, -10); ctx.quadraticCurveTo(shX * 2.4, hipY * 0.4, shX * 1.1, shY + 10); ctx.closePath();
    fillLine('#B3202C', 6);
  }
  // legs
  const hipL = [-55 * k, hipY], hipR = [55 * k, hipY];
  const la = 130 * k, lb = 128 * k, lw = 62 * k;
  if (of.kind !== 'sheet') {
    for (const [hp, ft, bend] of [[hipL, footL, 1], [hipR, footR, -1]]) {
      const [kx, ky, fx, fy] = ik(hp[0], hp[1], ft[0], ft[1] - 20 * k, la, lb, bend * 0.6);
      limbDraw(hp[0], hp[1], kx, ky, fx, fy, of.legs, lw);
      hdShoe(fx, fy + 20 * k, hp[0] < 0 ? -1 : 1, of.shoe, k * 1.1);
    }
  }
  // upper body (leans around hip)
  ctx.save(); ctx.translate(0, hipY); ctx.rotate(lean); ctx.translate(0, -hipY);
  const shL = [-shX, shY + 15 * k], shR = [shX, shY + 15 * k];
  // torso
  const bw = belly * 70 * k;
  const torso = () => {
    ctx.beginPath(); ctx.moveTo(-shX - 8 * k, shY);
    ctx.quadraticCurveTo(-shX - 40 * k - bw, (shY + hipY) / 2, -shX + 5 * k - bw * 0.8, hipY + 15 * k);
    ctx.lineTo(shX - 5 * k + bw * 0.8, hipY + 15 * k);
    ctx.quadraticCurveTo(shX + 40 * k + bw, (shY + hipY) / 2, shX + 8 * k, shY);
    ctx.quadraticCurveTo(0, shY - 30 * k, -shX - 8 * k, shY); ctx.closePath();
  };
  if (of.kind === 'sheet') {
    ctx.beginPath(); ctx.moveTo(-shX * 1.2, shY);
    ctx.quadraticCurveTo(-shX * 1.9, hipY * 0.5, -shX * 1.8, 0);
    for (let i = 0; i <= 6; i++) { const x = -shX * 1.8 + i * shX * 0.6; ctx.quadraticCurveTo(x + shX * 0.3, 18 + Math.sin(t * 4 + i) * 6, x + shX * 0.6, 0); }
    ctx.quadraticCurveTo(shX * 1.9, hipY * 0.5, shX * 1.2, shY); ctx.closePath();
    fillLine(lgrad(-shX * 2, shX * 2, '#F4F4FB'), 6);
    hdShoe(-45 * k, 0, -1, of.shoe, k); hdShoe(45 * k, 0, 1, of.shoe, k);
  } else if (of.kind === 'pumpkin') {
    const pr = 175 * k;
    ell(0, (shY + hipY) / 2 + 10 * k, pr * 1.15, pr); fillLine(rgrad(0, (shY + hipY) / 2, pr, of.top), 7);
    ctx.strokeStyle = shade(of.top, -0.3); ctx.lineWidth = 6;
    for (const rx of [0.4, 0.8]) { ell(0, (shY + hipY) / 2 + 10 * k, pr * 1.15 * rx, pr * 0.98); ctx.stroke(); }
    ctx.fillStyle = '#2A1A10'; const cy = (shY + hipY) / 2 + 10 * k;
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 60 * k, cy - 40 * k); ctx.lineTo(sx * 95 * k, cy); ctx.lineTo(sx * 25 * k, cy); ctx.closePath(); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-80 * k, cy + 40 * k); ctx.quadraticCurveTo(0, cy + 110 * k, 80 * k, cy + 40 * k); ctx.lineTo(40 * k, cy + 55 * k); ctx.lineTo(20 * k, cy + 42 * k); ctx.lineTo(-20 * k, cy + 55 * k); ctx.closePath(); ctx.fill();
  } else if (of.kind === 'dress') {
    ctx.beginPath(); ctx.moveTo(-shX, shY); ctx.lineTo(-shX * 2.1, -70 * k); ctx.quadraticCurveTo(0, -40 * k, shX * 2.1, -70 * k); ctx.lineTo(shX, shY); ctx.quadraticCurveTo(0, shY - 25 * k, -shX, shY); ctx.closePath();
    fillLine(lgrad(-shX * 2, shX * 2, of.top), 7);
    ctx.strokeStyle = '#F2A33A'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-shX * 2.0, -78 * k); ctx.quadraticCurveTo(0, -48 * k, shX * 2.0, -78 * k); ctx.stroke();
  } else {
    torso(); fillLine(lgrad(-shX - 40 * k - bw, shX + 40 * k + bw, of.top), 7);
    if (of.kind === 'hoodie') {
      ctx.save(); torso(); ctx.clip();
      ctx.fillStyle = shade(of.top, -0.15); roundRect(-shX - 60, hipY - 5, shX * 2 + 120, 30, 10); ctx.fill();
      ctx.strokeStyle = shade(of.top, -0.3); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-70 - bw * 0.5, hipY - 15); ctx.quadraticCurveTo(-60, hipY - 100, 0, hipY - 105); ctx.quadraticCurveTo(60, hipY - 100, 70 + bw * 0.5, hipY - 15); ctx.stroke();
      if (belly > 0) { ctx.fillStyle = 'rgba(255,255,255,0.12)'; ell(-20, (shY + hipY) / 2 + 30, 60 + bw * 0.6, 70 + bw * 0.5); ctx.fill(); }
      ctx.restore();
      // hood collar
      ctx.beginPath(); ctx.moveTo(-shX * 0.85, shY + 5); ctx.quadraticCurveTo(0, shY + 70, shX * 0.85, shY + 5); ctx.quadraticCurveTo(0, shY - 40, -shX * 0.85, shY + 5); fillLine(shade(of.top, -0.12), 6);
      ctx.strokeStyle = '#F2F0E6'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 25, shY + 40); ctx.quadraticCurveTo(sx * 32, shY + 90, sx * 28 + Math.sin(t * 3 + sx) * 5, shY + 130); ctx.stroke(); }
    }
    if (of.kind === 'cardigan') {
      ctx.fillStyle = '#F2EEE4'; ctx.beginPath(); ctx.moveTo(-45 * k, shY - 5); ctx.lineTo(0, shY + 120 * k); ctx.lineTo(45 * k, shY - 5); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = shade(of.top, -0.35); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, shY + 120 * k); ctx.lineTo(0, hipY + 10); ctx.stroke();
      for (let i = 0; i < 3; i++) { ell(14, shY + 160 * k + i * 70 * k, 9, 9); fillLine('#F2D58A', 3); }
      ctx.save(); torso(); ctx.clip(); ctx.fillStyle = shade(of.top, -0.12); ctx.fillRect(-300, hipY - 10, 600, 40); ctx.restore();
    }
    if (of.kind === 'polo') {
      ctx.beginPath(); ctx.moveTo(-60 * k, shY - 8); ctx.lineTo(-20 * k, shY + 40 * k); ctx.lineTo(0, shY + 10 * k); ctx.lineTo(20 * k, shY + 40 * k); ctx.lineTo(60 * k, shY - 8); ctx.closePath(); fillLine(shade(of.top, 0.25), 5);
      if (who === 'cajera') { roundRect(30 * k, shY + 80 * k, 70 * k, 34 * k, 6); fillLine('#F7F2E6', 4); ctx.fillStyle = LINE; ctx.fillRect(40 * k, shY + 92 * k, 46 * k, 5); }
    }
    if (of.kind === 'cape') { // vampire shirt + bow
      ctx.fillStyle = '#F2F0E6'; ctx.beginPath(); ctx.moveTo(-35 * k, shY); ctx.lineTo(0, hipY); ctx.lineTo(35 * k, shY); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#B3202C'; ctx.beginPath(); ctx.moveTo(0, shY + 20 * k); ctx.lineTo(-30 * k, shY + 5 * k); ctx.lineTo(-30 * k, shY + 35 * k); ctx.closePath(); ctx.moveTo(0, shY + 20 * k); ctx.lineTo(30 * k, shY + 5 * k); ctx.lineTo(30 * k, shY + 35 * k); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-shX, shY); ctx.lineTo(-shX * 1.5, shY - 70 * k); ctx.lineTo(-shX * 0.6, shY - 10 * k); ctx.closePath(); ctx.moveTo(shX, shY); ctx.lineTo(shX * 1.5, shY - 70 * k); ctx.lineTo(shX * 0.6, shY - 10 * k); ctx.closePath(); fillLine('#B3202C', 5);
    }
  }
  if (o.behindArms) o.behindArms();
  // arms
  const aa = 150 * k, ab = 140 * k, aw = (of.kind === 'sheet' ? 52 : 56) * k;
  const sleeve = of.kind === 'pumpkin' ? '#2F5E28' : of.kind === 'cape' ? '#222033' : of.top;
  for (const [sh, hd, bend, side] of [[shL, handL, o.bendL ?? -1, 'L'], [shR, handR, o.bendR ?? 1, 'R']]) {
    const [ex, ey, hx, hy] = ik(sh[0], sh[1], hd[0], hd[1], aa, ab, bend * 0.7);
    limbDraw(sh[0], sh[1], ex, ey, hx, hy, sleeve, aw);
    const ang = Math.atan2(hy - ey, hx - ex);
    if (of.kind === 'hoodie') { ctx.fillStyle = shade(of.top, -0.15); ell(hx - Math.cos(ang) * 22, hy - Math.sin(ang) * 22, 34, 34); fillLine(shade(of.top, -0.15), 5); }
    hdHand(hx, hy, ang, skin, 32 * k * 1.1, side === 'L' ? o.fistL : o.fistR);
    const hold = side === 'L' ? o.holdL : o.holdR; if (hold) hold(hx, hy, ang);
  }
  // head
  const R = st.R;
  const hs = o.kid ? 0.82 : 1;
  const neckY = shY - 10 * k;
  const hy = neckY - R * 1.0 * hs;
  if (o.kid) { /* no neck */ } else { ctx.fillStyle = shade(skin, -0.12); ctx.fillRect(-35, neckY - 50, 70, 60); }
  const headBob = Math.sin(t * 2.2 + 0.6) * 3;
  hdHead(Object.assign({ x: 0, y: hy + headBob, s: hs, st, t, seed: who.length * 0.13 }, o.face || {}));
  ctx.restore();
  ctx.restore();
}

// ---------- props
function candy(x, y, s, col, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(-50, -18); ctx.lineTo(-50, 18); ctx.closePath(); fillLine(shade(col, 0.2), 4);
  ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(50, -18); ctx.lineTo(50, 18); ctx.closePath(); fillLine(shade(col, 0.2), 4);
  ell(0, 0, 32, 22); fillLine(rgrad(0, 0, 30, col), 5);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 14, -2.6, -1.6); ctx.stroke();
  ctx.restore();
}
const CANDY_COLS = ['#E8473A', '#F2B33A', '#3E9E5B', '#8A4FC9', '#2F8FD6', '#F27AA8'];
function bowl(x, y, s, fill) { // fill 0..1
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const n = Math.round(fill * 22);
  for (let i = 0; i < n; i++) { const r = i * 2.39996; const rr = 20 + (i % 7) * 18; candy(Math.cos(r) * rr * 1.6, -30 - Math.abs(Math.sin(r)) * 30 * fill - (i > 12 ? 30 : 0), 0.8, CANDY_COLS[i % 6], r); }
  ctx.beginPath(); ctx.moveTo(-170, -40); ctx.quadraticCurveTo(-160, 70, 0, 75); ctx.quadraticCurveTo(160, 70, 170, -40); ctx.closePath();
  fillLine(lgrad(-170, 170, '#F07E1E'), 7);
  ell(0, -40, 170, 26); ctx.strokeStyle = LINE; ctx.lineWidth = 7; ctx.stroke();
  ctx.fillStyle = '#2A1A10'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 70, -5); ctx.lineTo(sx * 100, 25); ctx.lineTo(sx * 40, 25); ctx.closePath(); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(-60, 40); ctx.quadraticCurveTo(0, 60, 60, 40); ctx.lineTo(30, 46); ctx.lineTo(0, 38); ctx.lineTo(-30, 46); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function wrapper(x, y, s, col, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-40, -10); ctx.lineTo(-10, -18); ctx.lineTo(5, -6); ctx.lineTo(35, -16); ctx.lineTo(42, 8); ctx.lineTo(10, 14); ctx.lineTo(-8, 4); ctx.lineTo(-36, 14); ctx.closePath();
  fillLine(shade(col, 0.25), 4); ctx.restore();
}
function broccoli(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-12, 90); ctx.lineTo(14, 90); ctx.lineTo(18, 0); ctx.closePath(); fillLine('#9CCB6B', 5);
  for (const [a, b, r] of [[-40, -10, 38], [40, -10, 38], [0, -40, 44], [-25, -55, 30], [28, -55, 30]]) { ell(a, b, r, r); fillLine(rgrad(a, b, r, '#3E8E3A'), 5); }
  ctx.restore();
}
function lemon(x, y, s, rot = 0, bitten = false) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-62, 0); ctx.quadraticCurveTo(-50, -45, 0, -45); ctx.quadraticCurveTo(50, -45, 62, 0); ctx.quadraticCurveTo(50, 45, 0, 45); ctx.quadraticCurveTo(-50, 45, -62, 0); ctx.closePath();
  fillLine(rgrad(0, 0, 55, '#F7D93A'), 6);
  if (bitten) { ctx.fillStyle = '#FFF6B0'; ctx.strokeStyle = LINE; ctx.lineWidth = 5; for (const k of [0, 1, 2]) { ell(40, -30 + k * 22, 16, 16); ctx.fill(); } }
  ctx.restore();
}
function sardines(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  roundRect(-80, -40, 160, 80, 30); fillLine(lgrad(-80, 80, '#B9C2CC'), 6);
  roundRect(-60, -24, 120, 48, 18); fillLine('#2F6FB0', 4);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 26px "DejaVu Sans"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SARDINAS', 0, 2);
  ctx.restore();
}
function vignette(a = 0.45) {
  const g = ctx.createRadialGradient(540, 960, 500, 540, 960, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(10,5,20,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function glow(x, y, r, col, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
function sfxText(text, x, y, size, fill, rot = 0, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px "DejaVu Sans", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.2; ctx.strokeStyle = LINE; ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0);
  ctx.restore();
}
function title2(t, t0, d, big, small) {
  const p = prog(t, t0, t0 + 0.4), q = 1 - prog(t, t0 + d - 0.4, t0 + d); const a = Math.min(p, q); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(20,10,35,0.55)'; ctx.fillRect(0, 0, W, H);
  sfxText(big, 540, 900, 110, '#F7A23A', 0, lerp(0.7, 1, easeOut(p)));
  ctx.font = 'bold 52px "DejaVu Sans"'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(small, 540, 1010);
  ctx.restore();
}
