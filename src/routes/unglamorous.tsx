import { createFileRoute, Link } from "@tanstack/react-router";
import m1 from "@/assets/mundane-1.jpg";
import m2 from "@/assets/mundane-2.jpg";
import m3 from "@/assets/mundane-3.jpg";
import m4 from "@/assets/mundane-4.jpg";
import m5 from "@/assets/mundane-5.jpg";
import m6 from "@/assets/mundane-6.jpg";
import m7 from "@/assets/mundane-7.jpg";
import m8 from "@/assets/mundane-8.jpg";
import m9 from "@/assets/mundane-9.jpg";
import m10 from "@/assets/mundane-10.jpg";
import m11 from "@/assets/mundane-11.jpg";
import m12 from "@/assets/mundane-12.jpg";
import m13 from "@/assets/mundane-13.jpg";
import m14 from "@/assets/mundane-14.jpg";
import m15 from "@/assets/mundane-15.jpg";
import m16 from "@/assets/mundane-16.jpg";
import m17 from "@/assets/mundane-17.jpg";
import m18 from "@/assets/mundane-18.jpg";
import m20 from "@/assets/mundane-20.jpg";

export const Route = createFileRoute("/unglamorous")({
  head: () => ({
    meta: [
      { title: "Unglamorous Mundane — Kat Espinosa" },
      { name: "description", content: "A small archive of unglamorous, ordinary moments." },
      { property: "og:title", content: "Unglamorous Mundane — Kat Espinosa" },
      { property: "og:description", content: "A small archive of unglamorous, ordinary moments." },
    ],
  }),
  component: UnglamorousPage,
});

type Tile = {
  src: string;
  alt: string;
  caption: string;
  col: string;
  row: string;
  hasText?: boolean;
};

// ─── Collage layout ────────────────────────────────────────────
// 20 photos + 3 poems on a 12-column grid (72px row units).
// 5 portrait photos get tall 3×4 or 3×5 slots; the 16:9 photo gets
// a wide 5×3 slot; landscapes range from 2×2 tiny accents to a
// huge 6×6 anchor and a 5×5 closer.
//
// Size legend (cells / approx px):
//   TINY      2×2  (~210 × 170)   accent
//   SMALL     3×3  (~300 × 260)   regular landscape
//   MED-TALL  3×4  (~300 × 360)   normal portrait
//   TALL      3×5  (~300 × 460)   very-portrait
//   WIDE      5×3  (~490 × 260)   16:9 slot
//   BIG-WIDE  5×4  (~490 × 360)   wider landscape
//   BIG       5×5  (~490 × 460)   secondary anchor (landscape)
//   HUGE      6×6  (~580 × 530)   primary anchor (landscape)
const tiles: Tile[] = [
  // ─── Band 1 — Top ─────────────────────────────────────────────
  { src: m1,  alt: "", caption: "a small visitor, cebu",   col: "10 / span 2", row: "1 / span 2"  },
  { src: m14, alt: "", caption: "only cloud, el nido",           col: "6 / span 3",  row: "3 / span 4"  },
  { src: m3,  alt: "", caption: "bloom where you are planted (edsa)",       col: "1 / span 3",  row: "5 / span 3"  },
  { src: m12, alt: "", caption: "a cloud without u is just a clod",           col: "10 / span 2", row: "6 / span 2"  },
  { src: m4,  alt: "", caption: "not even solomon in all his hustle was dressed as this",  col: "9 / span 3",  row: "10 / span 3" },

  // ─── Band 2 — HUGE anchor + tech meme ─────────────────────────
  { src: m9,  alt: "", caption: "life at the edges",             col: "1 / span 6",  row: "15 / span 6" },
  { src: m17, alt: "", caption: "tech support",      col: "9 / span 3",  row: "18 / span 4", hasText: true },

  // ─── Band 3 — Middle: one tall portrait alone ─────────────────
  { src: m20, alt: "", caption: "soft landing on you",   col: "5 / span 3",  row: "25 / span 5" },

  // ─── Band 4 — Two anchors offset ──────────────────────────────
  { src: m5,  alt: "", caption: "old house from carcar, cebu",           col: "1 / span 3",  row: "32 / span 4" },
  { src: m18, alt: "", caption: "rice is life. cabiao, nueva ecija",           col: "7 / span 5",  row: "34 / span 4" },

  // ─── Band 5 — Tinies + small + wide ───────────────────────────
  { src: m13, alt: "", caption: "mango trees from casa san miguel, zambales",     col: "1 / span 2",  row: "41 / span 2" },
  { src: m6,  alt: "", caption: "anahaw leaf, batangas",        col: "10 / span 2", row: "41 / span 2" },
  { src: m15, alt: "", caption: "birdy steps, danjugan island",       col: "5 / span 3",  row: "42 / span 3" },
  { src: m11, alt: "", caption: "reef water sun glitter, davao",          col: "1 / span 5",  row: "46 / span 3" },

  // ─── Band 6 — Three staggered tinies + BIG anchor ─────────────
  { src: m7,  alt: "", caption: "moth meditations, baguio",          col: "1 / span 2",  row: "52 / span 2" },
  { src: m10, alt: "", caption: "light eater, qc",      col: "6 / span 2",  row: "53 / span 2" },
  { src: m8,  alt: "", caption: "cat naps in the flowershop, cebu",            col: "10 / span 2", row: "54 / span 2" },
  { src: m2,  alt: "", caption: "grass kintsugi, up diliman", col: "4 / span 5",  row: "58 / span 5" },

  // ─── Band 7 — "The Walker" alone as the close ─────────────────
  { src: m16, alt: "", caption: "",        col: "5 / span 4",  row: "66 / span 4", hasText: true },
];

function UnglamorousPage() {
  return (
    <div className="kat-body">
      <Link to="/" className="kat-back kat-back--floating">
        <span className="arrow">←</span>
        <span className="label">back</span>
      </Link>
      <div className="mundane-page">
        <h1 className="kat-name kat-name--centered">Unglamorous Mundane</h1>
        <p className="kat-subtitle--centered">pics from my phone</p>
        <div className="mundane-grid">
          {tiles.map((t, i) => (
            <figure
              key={i}
              className={`mundane-tile${t.hasText ? " mundane-tile--text" : ""}`}
              style={{ gridColumn: t.col, gridRow: t.row }}
              tabIndex={0}
            >
              <img src={t.src} alt={t.alt} loading="lazy" />
              {t.caption && <figcaption className="mundane-caption">{t.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
