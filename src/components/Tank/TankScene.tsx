// The scene — the Appendix B composition, ported from
// planted-tank-v2.html. Layer order is load-bearing: curtain behind the
// shafts, tetras behind the betta's plane, foodLayer behind the fish,
// fxLayer in front, substrate + carpet in front of the fish, then
// vignette/grain/frame.
//
// THE TRANSFORM RULE (TANK_PLAN Appendix C): placement transforms live
// on wrapper <g>s; sway classes live on the inner element. A CSS
// transform animation REPLACES the transform attribute on the same node
// (see TANK_NOTES: the vanishing-forest bug).

import type { CSSProperties } from 'react';
import type { TankRefs } from './useFishBrain';
import { TankDefs } from './TankDefs';
import { VARIANTS, VIEWBOX, type TankVariant } from './tank.config';

/** A placed, swaying stamp instance — wrapper positions, inner sways. */
function Stamp({
  href,
  sway,
  at,
  fill,
  opacity,
  style,
}: {
  href: string;
  sway: string;
  at: string;
  fill: string;
  opacity?: number | string;
  style?: CSSProperties;
}) {
  return (
    <g transform={at}>
      <use href={href} className={sway} fill={fill} opacity={opacity} style={style} />
    </g>
  );
}

/** The betta rig — position driven by JS, fins by CSS. */
function BettaFish({ setEl }: { setEl: (el: SVGGElement | null) => void }) {
  return (
    <g ref={setEl} className="fish">
      <g className="fish-inner" filter="url(#soft)">
        <path
          className="tail"
          d="M-6 0 C-38 -34 -74 -30 -88 -6 C-96 8 -88 30 -70 36 C-46 44 -20 26 -6 8 Z"
          fill="var(--betta-fin)"
          opacity=".85"
        />
        <path
          className="tail"
          d="M-4 2 C-28 -20 -56 -18 -66 -2 C-72 8 -64 22 -50 26 C-32 31 -14 18 -4 8 Z"
          fill="var(--betta-body)"
          opacity=".45"
          style={{ animationDelay: '-.4s' }}
        />
        <path className="fin-top" d="M4 -10 C10 -34 38 -40 56 -30 C44 -24 34 -14 30 -8 Z" fill="var(--betta-fin)" opacity=".9" />
        <path className="fin-bottom" d="M8 10 C12 34 42 42 60 30 C46 26 34 18 30 10 Z" fill="var(--betta-fin)" opacity=".9" />
        <path d="M-8 0 C4 -14 34 -16 52 -6 C62 -1 62 3 54 7 C36 16 6 14 -8 6 Z" fill="var(--betta-body)" />
        <path className="pectoral" d="M34 3 C42 8 44 16 38 20 C34 14 32 8 34 3 Z" fill="var(--betta-fin)" />
        <circle cx="49" cy="-2" r="2.4" fill="#2c2226" />
      </g>
    </g>
  );
}

/**
 * A guppy — female-guppy proportions (ref: Kat's anatomy diagram):
 * slim torpedo body, narrow caudal peduncle, MODEST rounded fan tail,
 * small swept dorsal, fan anal fin, tiny pelvic, gravid spot. The
 * caudal is three overlapping washes riding the same wave cycle at
 * staggered phases (w1/w2/w3) — folds slide over each other like
 * cloth in the wind. Palette per fish via guppy-a/b/c.
 */
function GuppyFish({ setEl, palette }: { setEl: (el: SVGGElement | null) => void; palette: string }) {
  return (
    <g ref={setEl} className={`fish guppy ${palette}`}>
      <g className="fish-inner" filter="url(#soft)">
        {/* caudal fin (4): three phase-lagged washes, root at the peduncle */}
        <path
          className="tail w1"
          d="M-9 -0.5 C-13 -5.5 -18.5 -8.5 -23.5 -8.8 C-25.8 -5.2 -26.6 -1.8 -26.6 0.2
             C-26.6 2.2 -25.6 5.4 -23 8.6 C-18 8.4 -12.8 5.2 -9 0.9 Z"
          fill="var(--guppy-tail)"
          opacity=".55"
        />
        <path
          className="tail w2"
          d="M-8.5 -0.3 C-12 -4.2 -16.5 -6.6 -20.5 -6.8 C-22.3 -4 -23 -1.4 -23 0.2
             C-23 1.8 -22.2 4.2 -20.2 6.6 C-16.2 6.4 -12 4 -8.5 0.8 Z"
          fill="var(--guppy-tail)"
          opacity=".6"
        />
        <path
          className="tail w3"
          d="M-8 -0.2 C-10.5 -2.8 -13.6 -4.4 -16.4 -4.5 C-17.6 -2.6 -18 -1 -18 0.1
             C-18 1.2 -17.5 2.8 -16.2 4.4 C-13.4 4.3 -10.6 2.6 -8 0.6 Z"
          fill="var(--guppy-body)"
          opacity=".5"
        />
        {/* dorsal fin (3): rounded flag on a NARROW base at mid-back,
            leaning ~45° toward the tail — most of the outline floats
            free behind its root, per the anatomy reference */}
        <path
          className="fin-top"
          d="M4.5 -5.2 C4.6 -7.4 3.8 -9.6 2 -11 C0 -12.6 -2.8 -12.4 -4.2 -10.8
             C-4.6 -9.2 -3.6 -7.2 -1.6 -5.4 C-0.6 -4.9 0.4 -4.8 1.2 -4.9 Z"
          fill="var(--guppy-tail)"
          opacity=".85"
        />
        {/* body: slim torpedo, deep belly, narrow peduncle, pointed snout */}
        <path
          d="M-10 -1.6 C-6 -4.6 0 -6.2 6 -5.4 C11.5 -4.7 16 -2.7 18.2 -0.7
             C16 1.5 11.5 3.6 5.5 4.5 C-0.5 5.2 -6.5 3.6 -10 1.8
             C-10.6 0.6 -10.6 -0.6 -10 -1.6 Z"
          fill="var(--guppy-body)"
        />
        {/* gravid spot (2), faint */}
        <ellipse cx="0.5" cy="2.4" rx="2.4" ry="1.7" fill="#46323c" opacity=".3" />
        {/* pectoral fin (5): just behind the gill, swept BACK toward the
            caudal (root at the front edge, tip trailing) */}
        <path className="pectoral" d="M11.2 0.8 C9 2.2 7.4 4.4 8 6.2 C9.9 5 11 3.2 11.5 1.3 Z" fill="var(--guppy-tail)" opacity=".9" />
        <circle cx="15" cy="-1.7" r="1.1" fill="#2c2226" />
      </g>
    </g>
  );
}

const ARIA: Record<TankVariant, string> = {
  betta:
    'A painterly planted aquarium: a dark valley of open water upper-left where a betta swims, surrounded by vallisneria ribbons, feathery limnophila, red rotala, java fern, lily pads and a bright carpet. Tap the water to drop food.',
  guppies:
    'A painterly planted aquarium: a dark valley of open water upper-left where three small warm-colored guppies swim, surrounded by vallisneria ribbons, feathery limnophila, red rotala, java fern, lily pads and a bright carpet. Tap the water to drop food.',
};

/** Warm trio: red, orange, light orange (defined in tank.css). */
const GUPPY_PALETTES = ['guppy-a', 'guppy-b', 'guppy-c'];

export function TankScene({ refs, variant = 'betta' }: { refs: TankRefs; variant?: TankVariant }) {
  const setFishEl = (i: number) => (el: SVGGElement | null) => {
    if (refs.fishEls.current) refs.fishEls.current[i] = el;
  };
  return (
    <svg
      ref={refs.svg}
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ARIA[variant]}
    >
      <TankDefs />

      {/* the vessel is straight glass with softly rounded corners —
          the painterly wobble belongs to the contents, not the tank.
          Everything inside is clipped so no plant escapes the water. */}
      <clipPath id="tankclip">
        <rect x="20" y="18" width="760" height="424" rx="14" />
      </clipPath>

      <g clipPath="url(#tankclip)">
      {/* water: dark void base + glows behind the plant masses / lily pads */}
      <rect x="20" y="18" width="760" height="424" rx="14" fill="url(#waterbase)" />

      {/* haze under-masses: out-of-focus foliage silhouettes that fill
          the back wall behind every planted zone (the inspiration
          scapes have almost no bare water behind the bushes). Drawn
          BEFORE the glows so the light washes over them. The valley
          diagonal stays open. */}
      <g filter="url(#haze)">
        <path
          d="M30 442 L30 260 C60 200 90 172 120 176 C150 180 170 210 200 232 C230 252 255 272 270 302 L270 442 Z"
          fill="#24371f"
          opacity=".55"
        />
        <path
          d="M240 442 L240 332 C280 302 330 292 370 302 C400 310 420 322 430 342 L430 442 Z"
          fill="#1f2f1c"
          opacity=".5"
        />
        <path
          d="M430 442 L430 282 C460 222 500 192 540 202 C580 212 600 242 640 232 C680 222 710 192 750 182 L770 192 L770 442 Z"
          fill="#26391f"
          opacity=".55"
        />
      </g>

      <rect x="20" y="18" width="760" height="424" rx="14" fill="url(#massglow)" />
      <rect x="20" y="18" width="760" height="424" rx="14" fill="url(#lilyglow)" />

      {/* vallisneria curtain: back right, tips bending left toward the valley */}
      <g filter="url(#paintB)">
        <g opacity=".5">
          <Stamp href="#val-l" sway="valsway v2" at="translate(480 420) scale(1.9)" fill="var(--green-dark)" />
          <Stamp href="#val-l" sway="valsway v3" at="translate(505 422) scale(2)" fill="#2e4229" />
          <Stamp href="#val-l" sway="valsway v4" at="translate(530 424) scale(2.05)" fill="#33492e" />
          <Stamp href="#val-l" sway="valsway v5" at="translate(558 421) scale(1.9)" fill="#2e4229" />
          <Stamp href="#val-l" sway="valsway v1" at="translate(585 420) scale(1.95)" fill="var(--green-dark)" />
          <Stamp href="#val-l" sway="valsway v2" at="translate(612 423) scale(2)" fill="#2e4229" />
          <Stamp href="#val-l" sway="valsway v5" at="translate(640 424) scale(2.1)" fill="#33492e" />
          <Stamp href="#val-l" sway="valsway v1" at="translate(668 421) scale(1.95)" fill="#2e4229" />
          <Stamp href="#val-l" sway="valsway v3" at="translate(695 420) scale(1.9)" fill="var(--green-dark)" />
          <Stamp href="#val-l" sway="valsway v4" at="translate(720 422) scale(1.9)" fill="#2e4229" />
          <Stamp href="#val-r" sway="valsway v2" at="translate(745 424) scale(1.85)" fill="#33492e" />
        </g>
        <g opacity=".85">
          <Stamp href="#val-l" sway="valsway v3" at="translate(455 422) scale(1.75)" fill="var(--green-mid)" />
          <Stamp href="#val-l" sway="valsway v2" at="translate(482 425) scale(1.8)" fill="var(--green-mid)" opacity=".8" />
          <Stamp href="#val-l" sway="valsway v1" at="translate(510 426) scale(1.9)" fill="var(--green-light)" opacity=".8" />
          <Stamp href="#val-l" sway="valsway v4" at="translate(538 423) scale(1.85)" fill="var(--green-mid)" opacity=".85" />
          <Stamp href="#val-l" sway="valsway v5" at="translate(565 422) scale(1.8)" fill="var(--green-mid)" />
          <Stamp href="#val-l" sway="valsway v4" at="translate(620 426) scale(1.95)" fill="var(--green-light)" opacity=".75" />
          <Stamp href="#val-l" sway="valsway v3" at="translate(648 424) scale(1.85)" fill="var(--green-mid)" opacity=".85" />
          <Stamp href="#val-l" sway="valsway v2" at="translate(675 422) scale(1.85)" fill="var(--green-mid)" />
          <Stamp href="#val-l" sway="valsway v5" at="translate(700 425) scale(1.75)" fill="var(--green-mid)" opacity=".8" />
          <Stamp href="#val-r" sway="valsway v1" at="translate(725 426) scale(1.7)" fill="var(--green-light)" opacity=".7" />
        </g>
      </g>

      {/* the light shaft: upper-left, entering the valley */}
      <polygon className="shaft" points="150,18 240,18 330,442 230,442" fill="url(#shaftg)" />
      <polygon className="shaft sh2" points="90,18 140,18 200,442 130,442" fill="url(#shaftg)" />

      {/* tetras: drifting in the valley, behind the betta's plane */}
      <g opacity=".5">
        <g className="tetra t1">
          <path d="M0 0 C5 -4 14 -4 18 0 C14 4 5 4 0 0 Z M18 0 L24 -4 L24 4 Z" fill="#243421" />
        </g>
        <g className="tetra t2" style={{ transform: 'translateY(24px)' }}>
          <path d="M0 0 C4 -3 12 -3 15 0 C12 3 4 3 0 0 Z M15 0 L20 -3 L20 3 Z" fill="#2b3d27" />
        </g>
        <g className="tetra t3" style={{ transform: 'translateY(-14px)' }}>
          <path d="M0 0 C4 -3 12 -3 15 0 C12 3 4 3 0 0 Z M15 0 L20 -3 L20 3 Z" fill="#213020" />
        </g>
      </g>

      {/* lily pads: signature, upper-left in the shaft; stems rooted at substrate */}
      <g filter="url(#paintC)">
        <g className="lilysway">
          <path d="M232 408 C226 320 238 210 208 96" fill="none" stroke="#54683a" strokeWidth="2.6" opacity=".8" />
          <use href="#pad" transform="translate(206 92) rotate(-8)" fill="var(--gold)" opacity=".9" />
        </g>
        <g className="lilysway l2">
          <path d="M240 408 C246 316 232 200 258 82" fill="none" stroke="#54683a" strokeWidth="2.4" opacity=".75" />
          <use href="#pad" transform="translate(260 78) rotate(6) scale(.9)" fill="var(--green-pale)" opacity=".9" />
        </g>
        <g className="lilysway l3">
          <path d="M226 408 C218 330 230 230 178 130" fill="none" stroke="#54683a" strokeWidth="2.2" opacity=".7" />
          <use href="#pad" transform="translate(174 126) rotate(-14) scale(.78)" fill="var(--green-light)" opacity=".85" />
        </g>
      </g>

      {/* driftwood: a substantial gnarled trunk — rooted lower-left,
          climbing to the top third with a long right branch and an
          upper fork (ref: Kat's sample scape). Still the one diagonal
          that breaks the carpet→bush→curtain height gradient. */}
      <g filter="url(#wobble)">
        {/* main trunk, thick base tapering to a knobbed tip (stroke
            fattens the whole limb so it reads through the foliage) */}
        <path
          d="M150 404 C185 350 225 300 285 255 C345 210 395 175 415 128
             C418 118 428 112 436 116 C432 126 428 138 420 152
             C398 196 350 236 300 272 C255 305 210 350 186 404 Z"
          fill="var(--wood)"
          stroke="var(--wood)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* long branch reaching right, sagging then lifting at the tip */}
        <path
          d="M318 252 C380 224 450 212 515 222 C545 227 566 239 578 254
             C570 248 546 240 512 238 C452 235 386 248 332 272 Z"
          fill="var(--wood)"
        />
        {/* small upper fork */}
        <path
          d="M398 165 C425 150 455 143 482 148 C462 156 438 160 418 170
             C410 173 402 171 398 165 Z"
          fill="var(--wood)"
        />
        {/* root flares at the substrate */}
        <path d="M150 404 C136 382 118 368 96 362 C116 378 130 392 138 404 Z" fill="var(--wood)" />
        <path d="M186 404 C198 382 216 370 236 366 C218 381 206 393 202 404 Z" fill="var(--wood)" />
        {/* shading: inner trunk edge, branch underside, knot at the fork */}
        <path d="M296 270 C350 230 396 190 416 146 C402 192 356 232 306 272 Z" fill="var(--wood-dark)" />
        <path d="M340 258 C420 236 500 230 560 244 C500 240 424 246 352 270 Z" fill="var(--wood-dark)" />
        <path d="M380 200 C390 190 402 184 412 182 C402 190 394 198 388 206 Z" fill="var(--wood-dark)" />
        {/* moss in the crooks */}
        <Stamp href="#moss" sway="sway still d2" at="translate(325 250) scale(1.3)" fill="var(--green-mid)" opacity=".85" />
        <Stamp href="#moss" sway="sway still d4" at="translate(400 168) scale(1)" fill="var(--green-dark)" opacity=".8" />
        <Stamp href="#moss" sway="sway still d1" at="translate(480 230) scale(1.2)" fill="var(--green-dark)" opacity=".85" />
        <Stamp href="#moss" sway="sway still d5" at="translate(555 240) scale(.9)" fill="var(--green-mid)" opacity=".8" />
        <Stamp href="#moss" sway="sway still d3" at="translate(240 310) scale(1.1)" fill="var(--green-dark)" opacity=".8" />
      </g>

      {/* java fern: the shadow mass nestled under the wood's arch —
          shifted left/down so the trunk's rise stays readable */}
      <g filter="url(#paintA)">
        <Stamp href="#fern" sway="sway gentle d3" at="translate(244 390) scale(1.25)" fill="#2f4229" opacity=".9" />
        <Stamp href="#fern" sway="sway gentle d5" at="translate(288 396) scale(1.4)" fill="var(--green-dark)" opacity=".85" />
        <Stamp href="#fern" sway="sway gentle d1" at="translate(324 392) scale(1.1)" fill="#2f4229" opacity=".9" />
        <Stamp href="#fern" sway="sway gentle d4" at="translate(360 394) scale(1.2)" fill="var(--green-dark)" opacity=".8" />
      </g>

      {/* limnophila: a bushy MOUNTAIN on the left (ref: the Nyman
          scape) — dark stems behind, mid tones, lit tips in front;
          tallest at the glass, descending toward the valley */}
      <g filter="url(#paintB)">
        <Stamp href="#whorlstem" sway="sway gentle d5" at="translate(66 414) scale(2.2)" fill="#2c4026" opacity=".85" />
        <Stamp href="#whorlstem" sway="sway gentle d2" at="translate(98 412) scale(2)" fill="#33482c" opacity=".85" />
        <Stamp href="#whorlstem" sway="sway gentle d6" at="translate(134 414) scale(1.75)" fill="#2c4026" opacity=".8" />
        <Stamp href="#whorlstem" sway="sway gentle d4" at="translate(168 412) scale(1.5)" fill="#33482c" opacity=".8" />
        <Stamp href="#whorlstem" sway="sway d2" at="translate(76 400) scale(1.35)" fill="#374f31" opacity=".7" />
        <Stamp href="#whorlstem" sway="sway d4" at="translate(105 404) scale(1.6)" fill="var(--green-mid)" opacity=".9" />
        <Stamp href="#whorlstem" sway="sway d1" at="translate(140 400) scale(1.45)" fill="var(--green-light)" opacity=".85" />
        <Stamp href="#whorlstem" sway="sway d6" at="translate(172 404) scale(1.7)" fill="var(--green-mid)" opacity=".9" />
        <Stamp href="#whorlstem" sway="sway d3" at="translate(205 400) scale(1.4)" fill="#374f31" opacity=".8" />
        <Stamp href="#whorlstem" sway="sway d5" at="translate(90 398) scale(1.2)" fill="var(--green-light)" opacity=".8" />
        <Stamp href="#whorlstem" sway="sway d3" at="translate(124 396) scale(1.3)" fill="var(--green-pale)" opacity=".7" />
        <Stamp href="#whorlstem" sway="sway d1" at="translate(158 398) scale(1.15)" fill="var(--green-light)" opacity=".75" />
        <Stamp href="#whorlstem" sway="sway d6" at="translate(190 400) scale(1.05)" fill="var(--green-pale)" opacity=".65" />
      </g>

      {/* rotala: THE red accent — now a proper rounded BUSH (ref: the
          red-wall scape): dark red silhouettes behind, brighter stems
          and lit tips in front. Still the single warm zone. */}
      <g filter="url(#paintC)">
        <Stamp href="#rotala" sway="sway gentle d1" at="translate(524 394) scale(1.45)" fill="#5e2f26" opacity=".85" />
        <Stamp href="#rotala" sway="sway gentle d3" at="translate(549 391) scale(1.7)" fill="#6b352a" opacity=".85" />
        <Stamp href="#rotala" sway="sway gentle d5" at="translate(576 393) scale(1.6)" fill="#5e2f26" opacity=".8" />
        <Stamp href="#rotala" sway="sway gentle d2" at="translate(600 395) scale(1.4)" fill="#6b352a" opacity=".8" />
        <Stamp href="#rotala" sway="sway d5" at="translate(536 390) scale(1.3)" fill="var(--red-deep)" opacity=".9" />
        <Stamp href="#rotala" sway="sway d2" at="translate(560 390) scale(1.5)" fill="var(--red-stem)" opacity=".95" />
        <Stamp href="#rotala" sway="sway d4" at="translate(584 388) scale(1.35)" fill="var(--red-stem)" opacity=".9" />
        <Stamp href="#rotala" sway="sway d6" at="translate(548 386) scale(1.1)" fill="#a86347" opacity=".85" />
        <Stamp href="#rotala" sway="sway d1" at="translate(572 384) scale(1.05)" fill="#b96a4a" opacity=".8" />
      </g>

      {/* food pellets get injected here (behind the fish) */}
      <g ref={refs.foodLayer} filter="url(#soft)" />

      {/* fish live in the valley; position driven by JS, fins by CSS */}
      {variant === 'betta' ? (
        <BettaFish setEl={setFishEl(0)} />
      ) : (
        VARIANTS.guppies.spawns.map((_, i) => (
          <GuppyFish key={i} setEl={setFishEl(i)} palette={GUPPY_PALETTES[i % GUPPY_PALETTES.length]} />
        ))
      )}

      {/* eat ripples appear here (in front of the fish) */}
      <g ref={refs.fxLayer} />

      {/* substrate */}
      <path
        d="M20 408 C120 396 260 416 400 404 C540 394 660 414 780 402 L780 442 L20 442 Z"
        fill="var(--soil)"
        filter="url(#wobble)"
      />

      {/* carpet: bright, near-still, full width — continuous mound
          line with hydrocotyle clover dots + fine hairgrass threading
          through it (the two extra groundcover textures every
          inspiration scape has) */}
      <g filter="url(#paintA)">
        <Stamp href="#mound" sway="sway still d1" at="translate(80 414) scale(1.3)" fill="var(--carpet-lo)" />
        <Stamp href="#mound" sway="sway still d4" at="translate(120 409) scale(1.15)" fill="var(--carpet-hi)" />
        <Stamp href="#mound" sway="sway still d3" at="translate(160 410) scale(1.5)" fill="var(--carpet-hi)" />
        <Stamp href="#mound" sway="sway still d6" at="translate(205 415) scale(1.25)" fill="var(--carpet-lo)" />
        <Stamp href="#mound" sway="sway still d5" at="translate(250 414) scale(1.2)" fill="var(--carpet-lo)" />
        <Stamp href="#mound" sway="sway still d1" at="translate(295 409) scale(1.35)" fill="var(--carpet-hi)" />
        <Stamp href="#mound" sway="sway still d2" at="translate(340 408) scale(1.6)" fill="var(--carpet-hi)" />
        <Stamp href="#mound" sway="sway still d3" at="translate(385 414) scale(1.2)" fill="var(--carpet-lo)" />
        <Stamp href="#mound" sway="sway still d4" at="translate(430 414) scale(1.3)" fill="var(--carpet-lo)" />
        <Stamp href="#mound" sway="sway still d5" at="translate(475 409) scale(1.3)" fill="var(--carpet-hi)" />
        <Stamp href="#mound" sway="sway still d6" at="translate(520 410) scale(1.5)" fill="var(--carpet-hi)" />
        <Stamp href="#mound" sway="sway still d2" at="translate(565 415) scale(1.2)" fill="var(--carpet-lo)" />
        <Stamp href="#mound" sway="sway still d1" at="translate(610 414) scale(1.25)" fill="var(--carpet-lo)" />
        <Stamp href="#mound" sway="sway still d4" at="translate(655 409) scale(1.3)" fill="var(--carpet-hi)" />
        <Stamp href="#mound" sway="sway still d3" at="translate(700 410) scale(1.45)" fill="var(--carpet-hi)" />
        <Stamp href="#mound" sway="sway still d5" at="translate(760 414) scale(1.1)" fill="var(--carpet-lo)" />
        {/* hydrocotyle clover dots */}
        <Stamp href="#clover" sway="sway still d2" at="translate(100 413) scale(1.1)" fill="var(--green-pale)" opacity=".9" />
        <Stamp href="#clover" sway="sway still d5" at="translate(185 409) scale(.9)" fill="var(--carpet-hi)" opacity=".9" />
        <Stamp href="#clover" sway="sway still d1" at="translate(270 414) scale(1.2)" fill="var(--green-pale)" opacity=".85" />
        <Stamp href="#clover" sway="sway still d4" at="translate(355 408) scale(1)" fill="var(--carpet-hi)" opacity=".9" />
        <Stamp href="#clover" sway="sway still d6" at="translate(445 412) scale(1.15)" fill="var(--green-pale)" opacity=".85" />
        <Stamp href="#clover" sway="sway still d3" at="translate(535 410) scale(.95)" fill="var(--carpet-hi)" opacity=".9" />
        <Stamp href="#clover" sway="sway still d2" at="translate(625 413) scale(1.1)" fill="var(--green-pale)" opacity=".85" />
        <Stamp href="#clover" sway="sway still d5" at="translate(715 410) scale(.9)" fill="var(--carpet-hi)" opacity=".9" />
        {/* hairgrass threads */}
        <Stamp href="#hairgrass" sway="sway d3" at="translate(145 411) scale(1.2)" fill="var(--green-mid)" opacity=".8" />
        <Stamp href="#hairgrass" sway="sway d1" at="translate(240 413) scale(1)" fill="var(--carpet-lo)" opacity=".8" />
        <Stamp href="#hairgrass" sway="sway d5" at="translate(330 412) scale(1.1)" fill="var(--green-mid)" opacity=".75" />
        <Stamp href="#hairgrass" sway="sway d2" at="translate(500 411) scale(1.3)" fill="var(--green-mid)" opacity=".8" />
        <Stamp href="#hairgrass" sway="sway d6" at="translate(590 413) scale(1)" fill="var(--carpet-lo)" opacity=".75" />
        <Stamp href="#hairgrass" sway="sway d4" at="translate(680 412) scale(1.15)" fill="var(--green-mid)" opacity=".8" />
      </g>

      {/* bottom vignette */}
      <rect x="20" y="340" width="760" height="102" fill="url(#vignette)" />

      {/* bubbles from the right bank */}
      <g fill="#dfe8c8" filter="url(#soft)">
        <circle className="bubble b1" cx="712" cy="396" r="4" />
        <circle className="bubble b2" cx="704" cy="396" r="2.6" />
        <circle className="bubble b3" cx="720" cy="396" r="3.2" />
        <circle className="bubble b4" cx="710" cy="396" r="2" />
      </g>

      {/* grain */}
      <rect x="20" y="18" width="760" height="424" rx="14" fill="#ffffff" filter="url(#grain)" opacity=".45" pointerEvents="none" />
      </g>

      {/* frame: straight lines, softly rounded corners, unclipped */}
      <rect x="20" y="18" width="760" height="424" rx="14" fill="none" stroke="var(--ink)" strokeWidth="2.5" opacity=".65" />
    </svg>
  );
}
