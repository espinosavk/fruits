// Public component. Owns:
//  - the ref wiring the scene shares with the fish brain
//  - the "active" gate: rAF runs only when the tank is on-screen AND
//    the document is visible (IntersectionObserver + visibilitychange)
//  - pausing CSS animations in the same conditions (data-tank-paused)
//  - pushing tank.config CSS timings onto the scope element
// The fish-brain rAF lifecycle itself lives in useFishBrain.

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { TankScene } from './TankScene';
import { useFishBrain, type TankRefs } from './useFishBrain';
import { CSS_TIMINGS, type TankVariant } from './tank.config';
import './tank.css';

export interface TankProps {
  caption?: string;
  className?: string;
  /** Who lives in the tank: one betta, or a pair of small guppies. */
  variant?: TankVariant;
}

export function Tank({
  caption = 'Tap the water to feed \u{1F41F}',
  className,
  variant = 'betta',
}: TankProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const refs: TankRefs = {
    svg: useRef<SVGSVGElement>(null),
    fishEls: useRef<(SVGGElement | null)[]>([]),
    foodLayer: useRef<SVGGElement>(null),
    fxLayer: useRef<SVGGElement>(null),
  };

  const [onScreen, setOnScreen] = useState(true);
  const [docVisible, setDocVisible] = useState(true);
  const active = onScreen && docVisible;

  // pause the fish brain (rAF) via `active`; useFishBrain reads it.
  useFishBrain(refs, active, variant);

  // pause/resume CSS animations by toggling a data attribute the
  // stylesheet keys off of — cheaper than touching every element.
  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (el) el.dataset.tankPaused = String(!active);
  }, [active]);

  // off-screen detection
  useEffect(() => {
    const el = scopeRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // tab visibility
  useEffect(() => {
    const onVis = () => setDocVisible(!document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const style = { ...CSS_TIMINGS } as CSSProperties;

  return (
    <div
      ref={scopeRef}
      className={`tank-scope${className ? ` ${className}` : ''}`}
      style={style}
      data-tank-paused="false"
    >
      {caption ? <div className="tank-caption">{caption}</div> : null}
      <div className="tank-wrap">
        <TankScene refs={refs} variant={variant} />
      </div>
    </div>
  );
}

export default Tank;
