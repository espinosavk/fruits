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
      { property: "og:url", content: "https://katespinosa.com/ecology" },
    ],
    links: [{ rel: "canonical", href: "https://katespinosa.com/ecology" }],
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

        <div className="kat-prose kat-prose--centered">
          {/* <img src={ecologyImg} alt="" className="kat-prose-img" /> */}

          <p>
            Work in progress. Eventually a place for ideas that have been
            fermenting on my mind: design, nature, writing, books I have been
            reading, and possibly the occasional good meme. Sign up if you
            want to be in the loop.
          </p>

          <form
            action="https://buttondown.com/api/emails/embed-subscribe/katespinosa"
            method="post"
            className="embeddable-buttondown-form kat-newsletter"
          >
            <label htmlFor="bd-email" className="kat-newsletter-title">
              Where do I send the messenger pigeon?
            </label>
            <input
              type="email"
              name="email"
              id="bd-email"
              placeholder="Enter your favorite email"
            />
            <input type="submit" value="Subscribe" />
            <p>
              <a
                href="https://buttondown.com/refer/katespinosa"
                target="_blank"
                rel="noopener noreferrer"
              >
                Powered by Buttondown.
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
