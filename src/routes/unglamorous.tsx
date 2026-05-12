import { createFileRoute, Link } from "@tanstack/react-router";
import m1 from "@/assets/mundane-1.jpg";
import m2 from "@/assets/mundane-2.jpg";
import m3 from "@/assets/mundane-3.jpg";
import m4 from "@/assets/mundane-4.jpg";
import m5 from "@/assets/mundane-5.jpg";
import m6 from "@/assets/mundane-6.jpg";

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

type Tile =
  | { kind: "img"; src: string; alt: string; col: string; row: string }
  | { kind: "text"; text: string; col: string; row: string };

const tiles: Tile[] = [
  { kind: "img", src: m1, alt: "morning cup",  col: "9 / span 3",  row: "1 / span 2" },
  { kind: "img", src: m2, alt: "laundry",      col: "1 / span 3",  row: "3 / span 3" },
  { kind: "text", text: "i washed my eyes a young girl\nlooked at me from a few feet away.\nshe smiled to ask if i was okay.\ni gave the thumbs up.", col: "1 / span 3", row: "6 / span 2" },
  { kind: "img", src: m3, alt: "leftovers",    col: "5 / span 3",  row: "5 / span 3" },
  { kind: "text", text: "my first day on the trail.\nliterally no one in the world\nknew exactly where i was.\n\ni could feel loneliness\nin every cell of my body.", col: "9 / span 3", row: "5 / span 2" },
  { kind: "img", src: m4, alt: "cables",       col: "9 / span 3",  row: "8 / span 3" },
  { kind: "img", src: m5, alt: "houseplant",   col: "1 / span 5",  row: "9 / span 4" },
  { kind: "img", src: m6, alt: "slippers",     col: "7 / span 3",  row: "13 / span 3" },
  { kind: "text", text: "i washed my clothes in the bathroom sink\nand hung them around my hotel room\nto dry. taking deep breaths\ni made my way to the communal baths.\n\nsitting naked in a warm tub with other women\ni leaned my head against the cold tiles\nand wept quietly.", col: "10 / span 3", row: "13 / span 3" },
];

function UnglamorousPage() {
  return (
    <div className="kat-body">
      <div className="mundane-page">
        <header className="mundane-header">
          <Link to="/" className="kat-back">← back</Link>
          <h1 className="kat-name">Unglamorous Mundane</h1>
        </header>
        <div className="mundane-grid">
          {tiles.map((t, i) => (
            <div
              key={i}
              className={t.kind === "img" ? "mundane-tile" : "mundane-note"}
              style={{ gridColumn: t.col, gridRow: t.row }}
            >
              {t.kind === "img" ? (
                <img src={t.src} alt={t.alt} loading="lazy" />
              ) : (
                <pre>{t.text}</pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}