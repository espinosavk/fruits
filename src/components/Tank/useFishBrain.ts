// DOM adapter for tank-sim.ts: owns the rAF loop lifecycle, converts
// pointer taps to viewBox coords, injects/removes pellet circles,
// spawns water ripples, and applies the fish transform + hungry class.
//
// The sim advances on a FIXED 60Hz timestep (accumulator) — without it
// the fish swims twice as fast on 120Hz displays.

import { useEffect, useRef, type RefObject } from 'react';
import { createSim, type StepResult, type TankSim } from './tank-sim';
import {
  AMBIENT_RIPPLES,
  DEPTH,
  PELLETS,
  RIPPLE,
  SIM_HZ,
  TAP_ZONE,
  VARIANTS,
  type TankVariant,
} from './tank.config';

const NS = 'http://www.w3.org/2000/svg';
const STEP_MS = 1000 / SIM_HZ;
/** Cap on catch-up steps per frame so a long stall can't cause a spiral. */
const MAX_STEPS_PER_FRAME = 3;

export interface TankRefs {
  svg: RefObject<SVGSVGElement | null>;
  /** One <g class="fish"> element per fish, scene-populated in spawn order. */
  fishEls: RefObject<(SVGGElement | null)[]>;
  foodLayer: RefObject<SVGGElement | null>;
  fxLayer: RefObject<SVGGElement | null>;
}

function applyFishTransform(
  el: SVGGElement,
  f: { x: number; y: number; turn: number; tilt: number; size: number; z: number },
) {
  // depth: shrink and dim toward the back of the tank
  const depthScale = 1 - f.z * DEPTH.scaleShrink;
  const s = f.size * depthScale;
  el.setAttribute(
    'transform',
    `translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) scale(${(f.turn * s).toFixed(3)} ${s.toFixed(3)}) rotate(${f.tilt.toFixed(1)})`,
  );
  el.style.opacity = (1 - f.z * DEPTH.dim).toFixed(3);
}

/**
 * Slow concentric water rings (see RIPPLE in tank.config). Outer
 * wrapper <g> holds placement (the transform rule); an inner grain
 * wrapper carries the ripplegrain filter so the rings expand THROUGH
 * stationary grain instead of stretching it; the tank-ripple animation
 * lives on the ellipses. Rings clean themselves up on animationend
 * (which survives pause: the animation resumes and then finishes).
 */
function spawnRipple(fxLayer: SVGGElement, x: number, y: number, kind: 'tap' | 'eat' | 'ambient') {
  const cfg = RIPPLE[kind];
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('transform', `translate(${x} ${y})`);
  const grain = document.createElementNS(NS, 'g');
  grain.setAttribute('filter', 'url(#ripplegrain)');
  g.appendChild(grain);
  const last = cfg.rings.length - 1;
  cfg.rings.forEach((ring, i) => {
    const el = document.createElementNS(NS, 'ellipse');
    el.setAttribute('class', 'ripple');
    el.setAttribute('rx', String(ring.rx));
    el.setAttribute('ry', String(ring.ry));
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', RIPPLE.stroke);
    el.setAttribute('stroke-width', String(ring.width));
    el.style.animationDuration = `${cfg.dur}s`;
    el.style.animationDelay = `${ring.delay}s`;
    el.style.setProperty('--ripple-op', String(ring.opacity));
    if (i === last) el.addEventListener('animationend', () => g.remove(), { once: true });
    grain.appendChild(el);
  });
  // fallback: reduced-motion (animation: none) never fires animationend
  setTimeout(() => g.remove(), (cfg.dur + cfg.rings[last].delay) * 3000);
  fxLayer.appendChild(g);
}

/**
 * Drives the tank. `active` gates the rAF loop — pass false when the
 * tank is off-screen or the document is hidden and the fish freeze
 * in place (CSS animations are paused separately by Tank.tsx).
 */
export function useFishBrain(refs: TankRefs, active: boolean, variant: TankVariant = 'betta') {
  const simRef = useRef<TankSim | null>(null);
  const circlesRef = useRef(new Map<number, SVGCircleElement>());
  /** Last depth draw-order signature, to skip needless DOM reorders. */
  const zOrderRef = useRef('');

  // one sim per mounted tank; first frame applied immediately so the
  // fish never render at the SVG origin
  useEffect(() => {
    simRef.current = createSim(Math.random, VARIANTS[variant]);
    simRef.current.fishes.forEach((f, i) => {
      const el = refs.fishEls.current?.[i];
      if (el)
        applyFishTransform(el, { x: f.x, y: f.y, turn: f.turn, tilt: 0, size: f.size, z: f.z });
    });
    return () => {
      simRef.current = null;
      circlesRef.current.forEach((c) => c.remove());
      circlesRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  // tap → drop food + surface ripple where it lands
  useEffect(() => {
    const svg = refs.svg.current;
    if (!svg) return;

    const onPointerDown = (evt: PointerEvent) => {
      const sim = simRef.current;
      const foodLayer = refs.foodLayer.current;
      if (!sim || !foodLayer) return;
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const p = pt.matrixTransform(ctm.inverse());
      // only inside the water
      if (p.x < TAP_ZONE.left || p.x > TAP_ZONE.right || p.y < TAP_ZONE.top || p.y > TAP_ZONE.bottom)
        return;
      const dropY = Math.max(p.y, PELLETS.dropMinY);
      for (const pellet of sim.dropFood(p.x, dropY)) {
        const el = document.createElementNS(NS, 'circle');
        el.setAttribute('r', String(pellet.r));
        el.setAttribute('fill', 'var(--pellet)');
        el.setAttribute('opacity', '0.95');
        el.setAttribute('cx', String(pellet.x));
        el.setAttribute('cy', String(pellet.y));
        foodLayer.appendChild(el);
        circlesRef.current.set(pellet.id, el);
      }
      if (refs.fxLayer.current) spawnRipple(refs.fxLayer.current, p.x, dropY, 'tap');
    };

    svg.addEventListener('pointerdown', onPointerDown);
    return () => svg.removeEventListener('pointerdown', onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the rAF loop — fixed-timestep sim, DOM applied per completed step
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last: number | null = null;
    let acc = 0;

    // ambient ripples: the water breathes on its own every ~6–13s.
    // Pure ambience, so reduced-motion turns it off entirely.
    const reducedMotion =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nextAmbient = () =>
      AMBIENT_RIPPLES.intervalMin +
      Math.random() * (AMBIENT_RIPPLES.intervalMax - AMBIENT_RIPPLES.intervalMin);
    let ambientCountdown = nextAmbient();
    const maybeAmbient = () => {
      if (reducedMotion || --ambientCountdown > 0) return;
      ambientCountdown = nextAmbient();
      const fx = refs.fxLayer.current;
      if (!fx) return;
      const z = AMBIENT_RIPPLES.zone;
      spawnRipple(
        fx,
        z.xMin + Math.random() * (z.xMax - z.xMin),
        z.yMin + Math.random() * (z.yMax - z.yMin),
        'ambient',
      );
    };

    const applyResult = (result: StepResult, fxLayer: SVGGElement | null) => {
      for (const p of result.eaten) {
        if (fxLayer) spawnRipple(fxLayer, p.x, p.y, 'eat');
        circlesRef.current.get(p.id)?.remove();
        circlesRef.current.delete(p.id);
      }
      for (const id of result.expired) {
        circlesRef.current.get(id)?.remove();
        circlesRef.current.delete(id);
      }
      for (const p of result.pellets) {
        const el = circlesRef.current.get(p.id);
        if (!el) continue;
        el.setAttribute('cx', String(p.x));
        el.setAttribute('cy', String(p.y));
        el.setAttribute('opacity', String(p.opacity));
      }
      result.fishes.forEach((f, i) => {
        const el = refs.fishEls.current?.[i];
        if (!el) return;
        el.classList.toggle('hungry', f.hungry);
        applyFishTransform(el, f);
      });

      // depth draw order: furthest fish paints first. Only touch the
      // DOM when the ranking actually changes (crossings are rare).
      if (result.fishes.length > 1) {
        const order = result.fishes
          .map((f, i) => ({ z: f.z, i }))
          .sort((a, b) => b.z - a.z)
          .map((o) => o.i);
        const sig = order.join(',');
        if (sig !== zOrderRef.current) {
          zOrderRef.current = sig;
          const anchor = refs.fxLayer.current;
          const parent = anchor?.parentNode;
          if (parent) {
            for (const i of order) {
              const el = refs.fishEls.current?.[i];
              if (el) parent.insertBefore(el, anchor);
            }
          }
        }
      }
    };

    const tick = (now: number) => {
      const sim = simRef.current;
      if (!sim || !refs.fishEls.current?.length) return;

      if (last === null) last = now - STEP_MS;
      acc += Math.min(now - last, STEP_MS * MAX_STEPS_PER_FRAME);
      last = now;

      while (acc >= STEP_MS) {
        applyResult(sim.step(), refs.fxLayer.current);
        maybeAmbient();
        acc -= STEP_MS;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
