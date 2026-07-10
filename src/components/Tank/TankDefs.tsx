// All <defs>: the painterly filter stack, lighting gradients, and the
// gesture-built plant stamps. Ported from planted-tank-v2.html.
//
// FIGMA HANDSHAKE (TANK_PLAN Appendix C): each stamp section below
// corresponds to one Figma frame Kat will design (vallisneria,
// limnophila, rotala, javafern, carpet, moss, lilypads, betta). When an
// export lands: replace the geometry inside that section, keep the ids,
// map hex fills to the CSS variables, apply NO transforms here —
// placement stays in TankScene, texture stays in the filters.

export function TankDefs() {
  return (
    <defs>
      {/* ===== painterly filter stack, three seeds — attach per wash
          group so neighbouring plants never share texture ===== */}
      <filter id="paintA" x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="4" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="8" result="shape" />
        <feTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves="2" seed="9" result="gr" />
        <feColorMatrix in="gr" type="luminanceToAlpha" result="grA" />
        <feComponentTransfer in="grA" result="grB">
          <feFuncA type="table" tableValues="0.45 1 0.8 1" />
        </feComponentTransfer>
        <feComposite in="shape" in2="grB" operator="in" result="textured" />
        <feMorphology in="shape" operator="erode" radius="1.8" result="inner" />
        <feComposite in="shape" in2="inner" operator="out" result="rim" />
        <feColorMatrix in="rim" type="matrix" values="0.55 0 0 0 0 0 0.55 0 0 0 0 0 0.55 0 0 0 0 0 0.7 0" result="rimD" />
        <feGaussianBlur in="rimD" stdDeviation="1" result="rimS" />
        <feMerge>
          <feMergeNode in="textured" />
          <feMergeNode in="rimS" />
        </feMerge>
      </filter>
      <filter id="paintB" x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="13" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="9" result="shape" />
        <feTurbulence type="fractalNoise" baseFrequency="0.34" numOctaves="2" seed="21" result="gr" />
        <feColorMatrix in="gr" type="luminanceToAlpha" result="grA" />
        <feComponentTransfer in="grA" result="grB">
          <feFuncA type="table" tableValues="0.5 1 0.75 1" />
        </feComponentTransfer>
        <feComposite in="shape" in2="grB" operator="in" result="textured" />
        <feMorphology in="shape" operator="erode" radius="1.6" result="inner" />
        <feComposite in="shape" in2="inner" operator="out" result="rim" />
        <feColorMatrix in="rim" type="matrix" values="0.55 0 0 0 0 0 0.55 0 0 0 0 0 0.55 0 0 0 0 0 0.65 0" result="rimD" />
        <feGaussianBlur in="rimD" stdDeviation="1.1" result="rimS" />
        <feMerge>
          <feMergeNode in="textured" />
          <feMergeNode in="rimS" />
        </feMerge>
      </filter>
      <filter id="paintC" x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="31" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="7" result="shape" />
        <feTurbulence type="fractalNoise" baseFrequency="0.28" numOctaves="2" seed="17" result="gr" />
        <feColorMatrix in="gr" type="luminanceToAlpha" result="grA" />
        <feComponentTransfer in="grA" result="grB">
          <feFuncA type="table" tableValues="0.42 1 0.85 1" />
        </feComponentTransfer>
        <feComposite in="shape" in2="grB" operator="in" result="textured" />
        <feMorphology in="shape" operator="erode" radius="2" result="inner" />
        <feComposite in="shape" in2="inner" operator="out" result="rim" />
        <feColorMatrix in="rim" type="matrix" values="0.55 0 0 0 0 0 0.55 0 0 0 0 0 0.55 0 0 0 0 0 0.7 0" result="rimD" />
        <feGaussianBlur in="rimD" stdDeviation="0.9" result="rimS" />
        <feMerge>
          <feMergeNode in="textured" />
          <feMergeNode in="rimS" />
        </feMerge>
      </filter>
      <filter id="wobble" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="7" />
      </filter>
      <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="3" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
        <feGaussianBlur stdDeviation="0.5" />
      </filter>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.22 0 0 0 0 0.25 0 0 0 0 0.18 0 0 0 0.55 0" />
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      {/* haze: distant plant masses — heavier displacement + real blur
          so they read as out-of-focus foliage filling the back wall */}
      <filter id="haze" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="19" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="14" />
        <feGaussianBlur stdDeviation="2.4" />
      </filter>
      {/* ripples: blur the ring into a soft band, then let static fine
          grain eat into it — the ring expands THROUGH the (unscaled)
          grain because this filter sits on the un-animated wrapper,
          matching the grain-in-the-water feel of the reference scapes */}
      <filter id="ripplegrain" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="soft" />
        <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="23" result="n" />
        <feColorMatrix in="n" type="luminanceToAlpha" result="na" />
        <feComponentTransfer in="na" result="nb">
          <feFuncA type="table" tableValues="0.2 1 0.55 1" />
        </feComponentTransfer>
        <feComposite in="soft" in2="nb" operator="in" />
      </filter>

      {/* ===== lighting: asymmetric dark valley (Appendix B) ===== */}
      <linearGradient id="waterbase" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--void)" />
        <stop offset=".55" stopColor="var(--murk)" />
        <stop offset="1" stopColor="var(--void)" />
      </linearGradient>
      <radialGradient id="massglow" cx="0.42" cy="0.62" r="0.62">
        <stop offset="0" stopColor="var(--glow)" stopOpacity=".5" />
        <stop offset="1" stopColor="var(--glow)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lilyglow" cx="0.29" cy="0.2" r="0.28">
        <stop offset="0" stopColor="var(--gold)" stopOpacity=".4" />
        <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="shaftg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f0ecc4" stopOpacity=".95" />
        <stop offset="1" stopColor="#f0ecc4" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141f13" stopOpacity="0" />
        <stop offset="1" stopColor="#141f13" stopOpacity=".6" />
      </linearGradient>

      {/* ===== GESTURE-BUILT STAMPS ===== */}

      {/* --- stamp: vallisneria — single ribbon blade, two bends --- */}
      <path id="val-l" d="M0 0 C5 -55 16 -115 -10 -195 C-13 -202 -6 -205 -3 -198 C20 -118 11 -56 7 0 Z" />
      <path id="val-r" d="M0 0 C-5 -55 -16 -115 10 -198 C13 -205 6 -208 3 -200 C-20 -120 -11 -56 -7 0 Z" />

      {/* --- stamp: limnophila — burst of flicks, stacked into a whorl column --- */}
      <g id="burst">
        <path d="M0 0 C6 -8 14 -12 22 -12 C15 -6 8 -2 2 1 Z" />
        <path d="M0 0 C8 -3 16 -3 23 1 C15 2 7 2 1 2 Z" />
        <path d="M0 0 C-6 -8 -14 -12 -22 -12 C-15 -6 -8 -2 -2 1 Z" />
        <path d="M0 0 C-8 -3 -16 -3 -23 1 C-15 2 -7 2 -1 2 Z" />
        <path d="M0 0 C3 -9 9 -16 16 -19 C11 -11 6 -5 2 0 Z" />
        <path d="M0 0 C-3 -9 -9 -16 -16 -19 C-11 -11 -6 -5 -2 0 Z" />
        <path d="M0 0 C1 -10 4 -18 9 -23 C6 -14 3 -7 1 -1 Z" />
        <path d="M0 0 C-1 -10 -4 -18 -9 -23 C-6 -14 -3 -7 -1 -1 Z" />
      </g>
      <g id="whorlstem">
        <path d="M0 0 C-2 -30 1 -60 -1 -88 C0 -89 1 -89 1.5 -87 C3 -59 1 -30 3 0 Z" />
        <use href="#burst" transform="translate(0 -30) scale(.8)" />
        <use href="#burst" transform="translate(1 -58) scale(.95)" />
        <use href="#burst" transform="translate(-1 -86) scale(1.05)" />
      </g>

      {/* --- stamp: rotala — round-leaf stem, gesture leaves --- */}
      <g id="rotala">
        <path d="M0 0 C-3 -30 2 -60 -2 -90 C-1 -91 1 -91 1.5 -89 C4 -59 0 -30 3 0 Z" />
        <path d="M-1 -18 C-9 -20 -15 -25 -17 -31 C-10 -28 -4 -23 0 -15 Z" />
        <path d="M2 -28 C10 -30 16 -35 18 -41 C11 -38 5 -33 1 -25 Z" />
        <path d="M-2 -42 C-10 -44 -16 -49 -18 -55 C-11 -52 -5 -47 -1 -39 Z" />
        <path d="M2 -54 C9 -56 15 -61 17 -67 C10 -64 5 -59 1 -51 Z" />
        <path d="M-2 -68 C-9 -70 -14 -74 -16 -80 C-10 -77 -4 -72 -1 -65 Z" />
        <path d="M1 -80 C7 -82 12 -86 14 -91 C8 -88 3 -84 0 -77 Z" />
      </g>

      {/* --- stamp: javafern — broad tapering blade; group of 4 --- */}
      <path id="fernblade" d="M0 0 C-7 -35 -6 -75 5 -108 C8 -113 13 -111 12 -104 C6 -70 8 -33 9 0 Z" />
      <g id="fern">
        <use href="#fernblade" transform="rotate(-24)" />
        <use href="#fernblade" transform="rotate(-8) scale(1.08)" />
        <use href="#fernblade" transform="rotate(9) scale(.95)" />
        <use href="#fernblade" transform="rotate(26) scale(.85)" />
      </g>

      {/* --- stamp: carpet — scalloped hummock --- */}
      <path id="mound" d="M-44 0 C-42 -9 -34 -13 -27 -9 C-25 -17 -14 -19 -9 -12 C-5 -21 7 -21 10 -13 C15 -19 26 -17 28 -9 C35 -13 42 -7 44 0 Z" />

      {/* --- stamp: moss — irregular soft clump --- */}
      <path id="moss" d="M-24 0 C-25 -7 -19 -12 -13 -10 C-13 -16 -4 -18 0 -13 C3 -18 12 -16 13 -10 C19 -13 25 -7 24 0 C16 3 -16 3 -24 0 Z" />

      {/* --- stamp: lilypads — round leaf with a notch (pad only; stems
          are drawn per-instance in the scene) --- */}
      <path id="pad" d="M4 0 L28 -7 A27 15 0 1 0 28 7 Z" />

      {/* --- stamp: carpet accents (ref scapes: hydrocotyle clover dots
          + fine hairgrass threading through the groundcover) --- */}
      <g id="clover">
        <circle cx="-4" cy="-10" r="3.4" />
        <circle cx="1.5" cy="-13" r="3" />
        <circle cx="5.5" cy="-8.5" r="2.6" />
        <circle cx="0" cy="-7" r="2.4" />
      </g>
      <g id="hairgrass">
        <path d="M0 0 C-2 -10 -5 -18 -9 -24 C-5 -17 -2 -9 -0.5 -2 Z" />
        <path d="M0 0 C0 -12 1 -20 3 -27 C2 -19 1 -10 1 -2 Z" />
        <path d="M1 0 C4 -9 7 -15 11 -20 C7 -13 4 -7 2 -1 Z" />
        <path d="M-1 0 C-4 -8 -7 -13 -11 -16 C-7 -11 -4 -6 -2 -1 Z" />
      </g>
    </defs>
  );
}
