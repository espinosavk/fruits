import { createFileRoute, Link } from "@tanstack/react-router";

// TODO: drop the image at src/assets/ecology.webp, then uncomment the import
// and the <img> tag below. (Convert to WebP via: cwebp -q 80 src.jpg -o ecology.webp)
// import ecologyImg from "@/assets/ecology.webp";

export const Route = createFileRoute("/ecology")({
  head: () => ({
    meta: [
      { title: "Ecology of Ideas — Kat Espinosa, UX Designer Manila" },
      {
        name: "description",
        content:
          "Notes on web design, content design, and how B2B firms communicate — writing by Kat Espinosa, UX designer in Manila.",
      },
      { property: "og:title", content: "Ecology of Ideas — Kat Espinosa" },
      {
        property: "og:description",
        content:
          "Notes on web design, content design, and B2B communication. By Kat Espinosa.",
      },
    ],
  }),
  component: EcologyPage,
});

function EcologyPage() {
  return (
    <div className="kat-body">
      <Link to="/" className="kat-back kat-back--floating">
        <span className="arrow">←</span>
        <span className="label">back</span>
      </Link>
      <div className="kat-column">
        <h1 className="kat-name kat-name--centered">Ecology of Ideas</h1>

        <div className="kat-prose">
          {/* <img src={ecologyImg} alt="" className="kat-prose-img" /> */}

          <p><em>Notes still finding their shape. Come back soon.</em></p>
        </div>
      </div>
    </div>
  );
}
