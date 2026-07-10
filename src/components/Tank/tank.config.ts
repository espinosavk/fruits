// Every tunable in one place (TANK_PLAN.md Appendix A, updated to the
// v2 reference: planted-tank-v2.html).
// JS-side numbers feed tank-sim.ts; the CSS timing strings are applied
// as custom properties on the .tank-scope wrapper and consumed by tank.css.

export const VIEWBOX = { w: 800, h: 460 };

/** World bounds the fish steers within (viewBox coords). */
export const BOUNDS = { left: 90, right: 700, top: 55, bottom: 350 };

/**
 * The dark valley — the betta's idle zone (Appendix B: diagonal band
 * from upper-left toward center; the fish lives IN the void).
 */
export const VALLEY = {
  xMin: 120,
  xMax: 420,
  yMin: 65,
  yMax: 175,
  /** y drifts down by this much across the valley's width (the diagonal). */
  diagDrop: 55,
  /** keep targets this far above yMax. */
  yPad: 20,
};

/** Where pellets come to rest. */
export const FLOOR_Y = 398;

/** Per-species movement + geometry numbers. */
export interface FishParams {
  maxSpeedIdle: number;
  maxSpeedChase: number;
  accelIdle: number;
  accelChase: number;
  drag: number;
  /** |vx| must exceed this before the fish flips its facing. */
  dirFlipThreshold: number;
  /**
   * The visible flip eases toward the facing dir at this rate per step
   * (±1 range → a full turn takes ~2/turnRate frames).
   */
  turnRate: number;
  /** Low-pass factor for the body tilt (1 = raw, smaller = smoother). */
  tiltEase: number;
  /** Approach easing: speed cap = base + dist * perDist while chasing. */
  approachCapBase: number;
  approachCapPerDist: number;
  tiltClampDeg: number;
  tiltFactor: number;
  /** Little satisfied dart after eating. */
  eatDartX: number;
  eatDartY: number;
  /** The mouth sits this far ahead of the body center, in facing direction. */
  mouthOffset: number;
  /** Chase aims the body this far short of the pellet so the mouth lands on it. */
  standoff: number;
  /** Chase target sits this far above the pellet. */
  standoffLift: number;
  eatRadius: number;
  centerEatRadius: number;
  /** Fish can't sink below FLOOR_Y - this. */
  floorMargin: number;
}

/** Phase 2 tuning (slow, deliberate) — see TANK_NOTES 2026-07-09. */
export const BETTA: FishParams = {
  maxSpeedIdle: 0.55,
  maxSpeedChase: 1.9,
  accelIdle: 0.012,
  accelChase: 0.07,
  drag: 0.987,
  dirFlipThreshold: 0.15,
  turnRate: 0.08,
  tiltEase: 0.08,
  approachCapBase: 0.4,
  approachCapPerDist: 0.03,
  tiltClampDeg: 22,
  tiltFactor: 0.6,
  eatDartX: 0.5,
  eatDartY: 0.35,
  mouthOffset: 46,
  standoff: 40,
  standoffLift: 8,
  eatRadius: 28,
  centerEatRadius: 34,
  floorMargin: 14,
};

/** Small fish: same calm pacing, geometry scaled to a ~45-unit body. */
export const GUPPY: FishParams = {
  maxSpeedIdle: 0.5,
  maxSpeedChase: 1.7,
  accelIdle: 0.012,
  accelChase: 0.07,
  drag: 0.987,
  dirFlipThreshold: 0.12,
  turnRate: 0.1, // small fish come about a touch quicker
  tiltEase: 0.1,
  approachCapBase: 0.3,
  approachCapPerDist: 0.03,
  tiltClampDeg: 24,
  tiltFactor: 0.6,
  eatDartX: 0.35,
  eatDartY: 0.25,
  mouthOffset: 18, // female-guppy silhouette: snout at +18.2

  standoff: 14,
  standoffLift: 5,
  eatRadius: 14,
  centerEatRadius: 18,
  floorMargin: 10,
};

/** Tank population variants. */
export interface VariantConfig {
  fish: FishParams;
  /** size scales the rendered fish AND its mouth/eat geometry. */
  spawns: { x: number; y: number; size: number }[];
  /** Below this pairwise distance, fish gently push apart (0 = off). */
  separationRadius: number;
  separationForce: number;
  /** Per-fish speed personality: factor 1 ± jitter. */
  speedJitter: number;
}

export const VARIANTS: Record<'betta' | 'guppies', VariantConfig> = {
  betta: {
    fish: BETTA,
    spawns: [{ x: 250, y: 110, size: 1 }],
    separationRadius: 0,
    separationForce: 0,
    speedJitter: 0,
  },
  guppies: {
    fish: GUPPY,
    spawns: [
      { x: 200, y: 90, size: 1.15 }, // red, the big one
      { x: 305, y: 140, size: 1 }, // orange
      { x: 255, y: 115, size: 0.8 }, // light orange, the little one
    ],
    separationRadius: 44,
    separationForce: 0.02,
    speedJitter: 0.12,
  },
};

export type TankVariant = keyof typeof VARIANTS;

export const PELLETS = {
  countMin: 2,
  countExtra: 3, // count = countMin + floor(rand * countExtra) → 2–4
  scatterX: 26,
  scatterY: 8,
  rMin: 2,
  rExtra: 1.6,
  sinkMin: 0.25,
  sinkExtra: 0.3,
  flutterFreq: 0.08,
  flutterAmp: 0.35,
  /** Frames a settled pellet survives on the floor (~15s at 60fps). */
  floorLifetime: 900,
  fadeDenominator: 950,
  /** Pellets never drop above this y. */
  dropMinY: 40,
};

/** Clicks register as food only inside the water. */
export const TAP_ZONE = { left: 30, right: 770, top: 28, bottom: 432 };

export const IDLE = {
  /** Retarget when this close to the idle target. */
  arriveRadius: 24,
  /** Frames to linger before rerouting: timerMin + rand * timerExtra. */
  timerMin: 200, // Phase 2: 140 → 200, longer linger between moves
  timerExtra: 360,
  /** Chance a retarget is a hover-in-place (bettas hold still 3–5s). */
  hoverChance: 0.3,
  hoverMin: 180, // frames ≈ 3s
  hoverExtra: 150, // + up to ~2.5s
  /** Rare slow drift to the lower third so the whole tank feels inhabited. */
  lowerChance: 0.12,
  lower: { xMin: 160, xMax: 520, yMin: 230, yMax: 310 },
};

/** After the last pellet: return toward home in the valley, then linger. */
export const HOME = {
  x: 250,
  y: 115,
  jitterX: 60,
  jitterY: 25,
  linger: 240, // frames ≈ 4s before normal wandering resumes
};

/**
 * The sim steps at this fixed rate regardless of display refresh —
 * without it the fish swims 2× fast on 120Hz screens.
 */
export const SIM_HZ = 60;

/**
 * Depth: fish drift between the front glass (z=0) and the back (z=1)
 * like real fish. Rendering maps z to scale + dimming; draw order
 * swaps when fish cross in depth. z eases slowly — depth changes read
 * as drift, never darting.
 */
export const DEPTH = {
  /** At z=1 the fish renders at (1 - scaleShrink) of its size. */
  scaleShrink: 0.35,
  /** At z=1 the fish dims to (1 - dim) opacity into the murk. */
  dim: 0.35,
  /** Per-step easing of z toward its target. */
  ease: 0.008,
  /** Pellets live near the front; chasing pulls fish to this plane. */
  pelletZ: 0.3,
};

/**
 * Water ripples: slow concentric rings (flattened ellipses, suggesting
 * the water plane), CSS-animated, rendered through the `ripplegrain`
 * filter — thick low-opacity strokes blurred into soft grainy bands,
 * not crisp lines. `tap` plays where food lands (three rings, then a
 * fainter ECHO generation ~1.3s later from the same center); `eat` is
 * smaller; `ambient` blooms unprompted in open water so the surface
 * feels alive. Ring rx/ry are FINAL radii (keyframes scale 0.15 → 1).
 */
export const RIPPLE = {
  stroke: '#dfe8c8',
  tap: {
    dur: 3.2,
    rings: [
      { rx: 30, ry: 12, delay: 0, width: 4.5, opacity: 0.32 },
      { rx: 22, ry: 9, delay: 0.4, width: 3.5, opacity: 0.26 },
      { rx: 14, ry: 6, delay: 0.8, width: 3, opacity: 0.2 },
      // the echo — the water remembering the touch
      { rx: 26, ry: 10, delay: 1.35, width: 3.5, opacity: 0.18 },
      { rx: 17, ry: 7, delay: 1.75, width: 3, opacity: 0.13 },
    ],
  },
  eat: {
    dur: 2,
    rings: [
      { rx: 18, ry: 8, delay: 0, width: 3.5, opacity: 0.35 },
      { rx: 11, ry: 5, delay: 0.35, width: 3, opacity: 0.25 },
    ],
  },
  ambient: {
    dur: 4.5,
    rings: [
      { rx: 26, ry: 10, delay: 0, width: 4, opacity: 0.14 },
      { rx: 16, ry: 6.5, delay: 0.6, width: 3.5, opacity: 0.1 },
    ],
  },
};

/**
 * Ambient ripple scheduling: every intervalMin–intervalMax sim steps
 * (~6–13s) one blooms at a random spot in the open water. Skipped
 * entirely under prefers-reduced-motion.
 */
export const AMBIENT_RIPPLES = {
  intervalMin: 360,
  intervalMax: 780,
  zone: { xMin: 110, xMax: 690, yMin: 60, yMax: 230 },
};

/** CSS timing tunables, applied as custom properties on .tank-scope. */
export const CSS_TIMINGS: Record<string, string> = {
  // general sway (background/mid plants)
  '--tank-sway-d1': '7s',
  '--tank-sway-d2': '9s',
  '--tank-sway-d3': '11s',
  '--tank-sway-d4': '8.5s',
  '--tank-sway-d5': '10s',
  '--tank-sway-d6': '12s',
  '--tank-sway-delay2': '-3s',
  '--tank-sway-delay3': '-5.5s',
  '--tank-sway-delay4': '-1.4s',
  '--tank-sway-delay5': '-7.2s',
  '--tank-sway-delay6': '-4.1s',
  // vallisneria whip (rotate + skew, tips lag)
  '--tank-val-v1': '9s',
  '--tank-val-v2': '12s',
  '--tank-val-v3': '10.5s',
  '--tank-val-v4': '13s',
  '--tank-val-v5': '11s',
  '--tank-val-delay2': '-4s',
  '--tank-val-delay3': '-7s',
  '--tank-val-delay4': '-2s',
  '--tank-val-delay5': '-8.6s',
  // lily stems: slow big drift
  '--tank-lily-l1': '14s',
  '--tank-lily-l2': '17s',
  '--tank-lily-l3': '15s',
  '--tank-lily-delay2': '-6s',
  '--tank-lily-delay3': '-10s',
  // carpet/moss near-still
  '--tank-still': '14s',
  // guppy fins (small fish flick faster; slowed for grace — fins should
  // read as fabric in water, not paper on a pin)
  '--tank-guppy-tail': '2.2s',
  '--tank-guppy-tail-hungry': '1.1s',
  '--tank-guppy-dorsal': '1.9s',
  '--tank-guppy-dorsal-hungry': '.9s',
  '--tank-guppy-anal': '2s',
  '--tank-guppy-anal-hungry': '1s',
  '--tank-guppy-pectoral': '1.1s',
  '--tank-guppy-pectoral-hungry': '.55s',
  // betta fins (slowed alongside the softness pass)
  '--tank-fin-bob': '3.4s',
  '--tank-fin-tail': '3.2s',
  '--tank-fin-tail-hungry': '1.4s',
  '--tank-fin-dorsal': '2.8s',
  '--tank-fin-dorsal-hungry': '1.2s',
  '--tank-fin-anal': '3s',
  '--tank-fin-anal-hungry': '1.3s',
  '--tank-fin-pectoral': '1.6s',
  '--tank-fin-pectoral-hungry': '.7s',
};
