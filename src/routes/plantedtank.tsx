import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import Tank from "@/components/Tank/Tank";
import "./plantedtank.css";

export const Route = createFileRoute("/plantedtank")({
  head: () => ({
    meta: [
      { title: "The Planted Tank — Kat Espinosa" },
      {
        name: "description",
        content:
          "A hand-textured, interactive planted aquarium. Tap the water to feed the guppies.",
      },
      { property: "og:title", content: "The Planted Tank — Kat Espinosa" },
      {
        property: "og:description",
        content:
          "A hand-textured, interactive planted aquarium. Tap the water to feed the guppies.",
      },
      { property: "og:url", content: "https://katespinosa.com/plantedtank" },
    ],
    links: [{ rel: "canonical", href: "https://katespinosa.com/plantedtank" }],
  }),
  component: PlantedTankPage,
});

function PlantedTankPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <div className={`pt-page ${theme}`}>
      <header className="pt-header">
        <Link to="/" className="pt-back">
          <span className="arrow">←</span> <span className="label">back</span>
        </Link>
        <button
          className="pt-theme-switch"
          role="switch"
          aria-checked={theme === "dark"}
          aria-label="Toggle dark mode"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <span className="glyph" aria-hidden="true">
            ☀
          </span>
          <span className="glyph" aria-hidden="true">
            ☾
          </span>
          <span className="knob" aria-hidden="true" />
        </button>
      </header>
      <div className="pt-stage">
        <Tank variant="guppies" />
      </div>
    </div>
  );
}
