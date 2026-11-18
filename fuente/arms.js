// Elbow rule: of the two possible elbow positions, take the one that points away from the
// body (outward), slightly preferring down. Never inward. Each arm keeps its previous side
// unless the other one is clearly better, so elbows don't flip back and forth while moving.
const _hdArmOrig = hdArm, _ik2Orig = ik2;
// when the hand comes close to the shoulder the forearm points at the camera: shorten both
// segments (foreshortening) so the elbow stays near the line instead of swinging inwards
let ARMFORE = 0;
ik2 = function (x0, y0, x1, y1, a, b, bend) {
  if (ARMFORE) { const d = Math.hypot(x1 - x0, y1 - y0), f = clamp(d * 1.3 / (a + b), 0.2, 1); a *= f; b *= f; }
  return _ik2Orig(x0, y0, x1, y1, a, b, bend); };
let ARMI = 0, ARMT = -9; const ARMSTATE = [];
Object.defineProperty(window, 'draw', { configurable: true, get() { return this._drawW; }, set(f) {
  this._drawW = function (t) { if (Math.abs(t - ARMT) > 0.1) ARMSTATE.length = 0; ARMT = t; ARMI = 0; return f(t); }; } });
hdArm = function (sh, hand, bend, o) {
  const side = o.side || (sh[0] < 0 ? -1 : 1), k = o.k || 1, idx = ARMI++;
  if (!o.forceBend) {
    const aa = 158 * k, ab = 146 * k, sc = {};
    for (const b of [1, -1]) { ARMFORE = 1; const [ex, ey] = ik2(sh[0], sh[1], hand[0], hand[1], aa, ab, b); ARMFORE = 0; sc[b] = side * (ex - sh[0]) + 0.3 * (ey - sh[1]); }
    const st = ARMSTATE[idx], prev = st && Math.hypot(st[1] - hand[0], st[2] - hand[1]) < 40 * k ? st[0] : undefined;
    let best = sc[1] >= sc[-1] ? 1 : -1;
    if (prev !== undefined && best !== prev && sc[best] - sc[prev] < 40 * k) best = prev;
    if (window.ARMDBG) window.ARMDBG.push([idx, side, Math.round(sc[1]), Math.round(sc[-1]), prev, best, sh.map(Math.round), hand.map(Math.round)]);
    ARMSTATE[idx] = [best, hand[0], hand[1]]; bend = best;
  }
  ARMFORE = 1; const r = _hdArmOrig(sh, hand, bend, o); ARMFORE = 0;
  if (window.ELBOWLOG) window.ELBOWLOG.push([side, r[3] - sh[0], r[4] - sh[1]]);
  return r;
};
