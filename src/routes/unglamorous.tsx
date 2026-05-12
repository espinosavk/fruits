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

const items = [
  { src: m1, title: "Morning Cup" },
  { src: m2, title: "Laundry" },
  { src: m3, title: "Leftovers" },
  { src: m4, title: "Cables" },
  { src: m5, title: "Houseplant" },
  { src: m6, title: "Slippers" },
];

function UnglamorousPage() {
  return (
    <div className="kat-body">
      <div className="kat-column kat-column-wide">
        <Link to="/" className="kat-back">← back</Link>
        <h1 className="kat-name">Unglamorous Mundane</h1>
        <ol className="mundane-list">
          {items.map((it, i) => (
            <li key={it.title} className="mundane-row">
              <span className="mundane-num">{i + 1}.</span>
              <span className="mundane-thumb">
                <img src={it.src} alt={it.title} loading="lazy" width={512} height={512} />
              </span>
              <span className="mundane-rule" aria-hidden="true" />
              <span className="mundane-title">{it.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}