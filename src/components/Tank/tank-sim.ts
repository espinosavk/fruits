// Pure fish-brain simulation — no DOM. One sim drives N fish (betta or
// a shoal of guppies) over a shared pellet pool; useFishBrain.ts adapts
// it to SVG. Kept pure so it can be verified headlessly (node/tsx)
// where rAF never fires.

import {
  BOUNDS,
  VALLEY,
  DEPTH,
  FLOOR_Y,
  PELLETS,
  IDLE,
  HOME,
  VARIANTS,
  type FishParams,
  type VariantConfig,
} from './tank.config';

export interface Pellet {
  id: number;
  x: number;
  y: number;
  r: number;
  vy: number;
  phase: number;
  settled: number;
}

interface Target {
  x: number;
  y: number;
  food: boolean;
  /** Hover-in-place: no steering force, no arrival retarget — glide to a stop. */
  hover?: boolean;
  ref?: Pellet;
}

export interface FishState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dir: number; // 1 faces right, -1 faces left (steering/mouth logic)
  turn: number; // eased visual facing — the fish turns, it doesn't snap
  tilt: number; // low-passed body tilt
  target: Target | null;
  idleTimer: number;
  wasChasing: boolean;
  /** Personality: multiplies speeds/accels so shoal-mates desync. */
  speedFactor: number;
  /** Render + geometry scale (mouth/eat distances follow the body). */
  size: number;
  /** Depth: 0 = front glass, 1 = back of the tank. */
  z: number;
  zTarget: number;
}

export interface FishFrame {
  x: number;
  y: number;
  dir: number;
  turn: number;
  tilt: number;
  size: number;
  /** Depth 0..1 — adapter maps to scale/dimming/draw order. */
  z: number;
  hungry: boolean;
}

export interface StepResult {
  fishes: FishFrame[];
  /** Pellets eaten this frame (ripple + remove). */
  eaten: Pellet[];
  /** Pellet ids that timed out on the floor (remove). */
  expired: number[];
  /** Position/opacity for every surviving pellet. */
  pellets: { id: number; x: number; y: number; opacity: number }[];
}

export function createSim(
  rand: () => number = Math.random,
  variant: VariantConfig = VARIANTS.betta,
) {
  const P: FishParams = variant.fish;

  const fishes: FishState[] = variant.spawns.map((s) => ({
    x: s.x,
    y: s.y,
    vx: 0.5,
    vy: 0,
    dir: 1,
    turn: 1,
    tilt: 0,
    target: null,
    idleTimer: 0,
    wasChasing: false,
    speedFactor: 1 + (rand() - 0.5) * 2 * variant.speedJitter,
    size: s.size,
    z: rand() * 0.8,
    zTarget: rand() * 0.8,
  }));

  const pellets: Pellet[] = [];
  let pelletId = 0;

  function newIdleTarget(f: FishState) {
    const roll = rand();
    // no back-to-back hovers — chained rolls stack into 15s+ of dead stillness
    if (roll < IDLE.hoverChance && !f.target?.hover) {
      // hover in place — fish hold still (the CSS bob keeps it alive)
      f.target = { x: f.x, y: f.y, food: false, hover: true };
      f.zTarget = f.z; // hold depth too
      f.idleTimer = IDLE.hoverMin + rand() * IDLE.hoverExtra;
      return;
    }
    if (roll < IDLE.hoverChance + IDLE.lowerChance) {
      // rare slow drift to the lower third so the whole tank feels inhabited
      const L = IDLE.lower;
      f.target = {
        x: L.xMin + rand() * (L.xMax - L.xMin),
        y: L.yMin + rand() * (L.yMax - L.yMin),
        food: false,
      };
      f.zTarget = rand();
      f.idleTimer = IDLE.timerMin + rand() * IDLE.timerExtra;
      return;
    }
    // idle zone = the dark valley: bias y downward as x increases so the
    // wander follows the valley's diagonal (Appendix B)
    const x = VALLEY.xMin + rand() * (VALLEY.xMax - VALLEY.xMin);
    const diag = (x - VALLEY.xMin) / (VALLEY.xMax - VALLEY.xMin); // 0..1
    const yBase = VALLEY.yMin + diag * VALLEY.diagDrop;
    f.target = {
      x,
      y: yBase + rand() * (VALLEY.yMax - yBase - VALLEY.yPad),
      food: false,
    };
    f.zTarget = rand(); // wander in depth too — real fish use the whole tank
    f.idleTimer = IDLE.timerMin + rand() * IDLE.timerExtra;
  }
  fishes.forEach(newIdleTarget);

  function newHomeTarget(f: FishState) {
    // post-meal: settle back toward home in the valley, then linger —
    // resuming random wander immediately reads as twitchy
    f.target = {
      x: HOME.x + (rand() - 0.5) * 2 * HOME.jitterX,
      y: HOME.y + (rand() - 0.5) * 2 * HOME.jitterY,
      food: false,
    };
    f.zTarget = 0.3 + rand() * 0.3; // settle mid-depth
    f.idleTimer = HOME.linger;
  }

  /** A pinch of 2–4 pellets, scattered slightly. Returns the new pellets. */
  function dropFood(x: number, y: number): Pellet[] {
    const count = PELLETS.countMin + Math.floor(rand() * PELLETS.countExtra);
    const dropped: Pellet[] = [];
    for (let i = 0; i < count; i++) {
      const p: Pellet = {
        id: pelletId++,
        x: x + (rand() - 0.5) * PELLETS.scatterX,
        y: y + (rand() - 0.5) * PELLETS.scatterY,
        r: PELLETS.rMin + rand() * PELLETS.rExtra,
        vy: PELLETS.sinkMin + rand() * PELLETS.sinkExtra,
        phase: rand() * Math.PI * 2,
        settled: 0,
      };
      pellets.push(p);
      dropped.push(p);
    }
    return dropped;
  }

  function nearestPellet(f: FishState): Pellet | null {
    let best: Pellet | null = null;
    let bestD = Infinity;
    for (const p of pellets) {
      const d = (p.x - f.x) ** 2 + (p.y - f.y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return best;
  }

  function stepFish(f: FishState, chasing: boolean, eaten: Pellet[]) {
    // ---- choose target ----
    if (chasing) {
      const p = nearestPellet(f)!;
      // stand-off: aim the body so the mouth lands on the pellet
      f.target = {
        x: p.x - f.dir * P.standoff * f.size,
        y: p.y - P.standoffLift * f.size,
        food: true,
        ref: p,
      };
      f.zTarget = DEPTH.pelletZ; // come forward to the food plane
    } else if (f.wasChasing) {
      newHomeTarget(f);
    } else {
      f.idleTimer--;
      const dIdle = Math.hypot(f.target!.x - f.x, f.target!.y - f.y);
      // a hover ends only by timer — the arrival check would fire
      // instantly (the target IS the fish's position)
      if (f.idleTimer <= 0 || (!f.target!.hover && dIdle < IDLE.arriveRadius)) newIdleTarget(f);
    }
    f.wasChasing = chasing;

    // ---- steer ----
    const hovering = !chasing && f.target!.hover === true;
    const accel = (chasing ? P.accelChase : P.accelIdle) * f.speedFactor;
    const maxSpeed = (chasing ? P.maxSpeedChase : P.maxSpeedIdle) * f.speedFactor;
    const dx = f.target!.x - f.x;
    const dy = f.target!.y - f.y;
    const dist = Math.hypot(dx, dy) || 1;

    // no steering force while hovering: the fish glides to a stop under
    // drag (steering toward a zero-distance target makes it jitter-orbit)
    if (!hovering) {
      f.vx += (dx / dist) * accel;
      f.vy += (dy / dist) * accel;
    }

    // shoal-mates gently push apart so they never stack
    if (variant.separationRadius > 0) {
      for (const o of fishes) {
        if (o === f) continue;
        const sx = f.x - o.x;
        const sy = f.y - o.y;
        const d = Math.hypot(sx, sy);
        if (d > 0 && d < variant.separationRadius) {
          const push = variant.separationForce * (1 - d / variant.separationRadius);
          f.vx += (sx / d) * push;
          f.vy += (sy / d) * push;
        }
      }
    }

    // gentle drag + speed cap (ease in near the target so it doesn't overshoot)
    const speed = Math.hypot(f.vx, f.vy);
    const cap = chasing
      ? Math.min(maxSpeed, P.approachCapBase + dist * P.approachCapPerDist)
      : maxSpeed;
    if (speed > cap) {
      f.vx = (f.vx / speed) * cap;
      f.vy = (f.vy / speed) * cap;
    }
    f.vx *= P.drag;
    f.vy *= P.drag;

    f.x += f.vx;
    f.y += f.vy;

    // keep inside the water
    f.x = Math.max(BOUNDS.left, Math.min(BOUNDS.right, f.x));
    f.y = Math.max(BOUNDS.top, Math.min(FLOOR_Y - P.floorMargin, f.y));

    // drift in depth — slow ease so it reads as wandering, not darting
    f.z += (f.zTarget - f.z) * DEPTH.ease;
    f.z = Math.max(0, Math.min(1, f.z));

    // ---- facing & tilt ----
    if (Math.abs(f.vx) > P.dirFlipThreshold) f.dir = f.vx > 0 ? 1 : -1;
    // the visible flip eases toward dir — the fish turns instead of snapping
    const turnDelta = f.dir - f.turn;
    f.turn += Math.max(-P.turnRate, Math.min(P.turnRate, turnDelta));
    const tiltRaw = Math.max(
      -P.tiltClampDeg,
      Math.min(P.tiltClampDeg, Math.atan2(f.vy, Math.abs(f.vx) + 0.6) * 57.3 * P.tiltFactor),
    );
    // low-pass the tilt so it doesn't jitter with every velocity change
    f.tilt += (tiltRaw - f.tilt) * P.tiltEase;

    // ---- eat ----
    if (chasing && f.target!.ref) {
      const p = f.target!.ref;
      // a shoal-mate may have eaten it earlier this same step
      if (pellets.includes(p)) {
        // mouth sits ahead of center in facing direction
        const mouthX = f.x + f.dir * P.mouthOffset * f.size;
        const mouthY = f.y;
        const mouthHit = Math.hypot(p.x - mouthX, p.y - mouthY) < P.eatRadius * f.size;
        // failsafe: if the body is basically on the pellet, count it as eaten
        const centerHit = Math.hypot(p.x - f.x, p.y - f.y) < P.centerEatRadius * f.size;
        if (mouthHit || centerHit) {
          eaten.push(p);
          pellets.splice(pellets.indexOf(p), 1);
          // little satisfied dart
          f.vx += f.dir * P.eatDartX;
          f.vy -= P.eatDartY;
        }
      }
    }
  }

  function step(): StepResult {
    const expired: number[] = [];
    const eaten: Pellet[] = [];

    // ---- pellets sink, flutter, settle, dissolve ----
    for (let i = pellets.length - 1; i >= 0; i--) {
      const p = pellets[i];
      if (p.y < FLOOR_Y) {
        p.y += p.vy;
        p.phase += PELLETS.flutterFreq;
        p.x += Math.sin(p.phase) * PELLETS.flutterAmp; // flutter as it sinks
      } else {
        p.settled++;
        if (p.settled > PELLETS.floorLifetime) {
          expired.push(p.id);
          pellets.splice(i, 1);
        }
      }
    }

    // hungry is decided per-fish BEFORE any eating this step (a fish that
    // just emptied the pool stays hungry-finned until next frame)
    const results: FishFrame[] = [];
    for (const f of fishes) {
      const chasing = pellets.length > 0;
      stepFish(f, chasing, eaten);
      results.push({
        x: f.x,
        y: f.y,
        dir: f.dir,
        turn: f.turn,
        tilt: f.tilt,
        size: f.size,
        z: f.z,
        hungry: chasing,
      });
    }

    return {
      fishes: results,
      eaten,
      expired,
      pellets: pellets.map((p) => ({
        id: p.id,
        x: p.x,
        y: p.y,
        opacity: p.settled > 0 ? Math.max(0.95 - p.settled / PELLETS.fadeDenominator, 0) : 0.95,
      })),
    };
  }

  return { fishes, pellets, dropFood, step };
}

export type TankSim = ReturnType<typeof createSim>;
