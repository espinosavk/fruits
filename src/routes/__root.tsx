import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="kat-body">
      <div className="kat-column">
        <h1 className="kat-name">404</h1>
        <div className="kat-prose">
          <p>This page doesn&rsquo;t exist (or it moved).</p>
        </div>
        <nav className="kat-links">
          <Link to="/">
            <span className="label">Go home </span>
            <span className="arrow">&rarr;</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="kat-body">
      <div className="kat-column">
        <h1 className="kat-name">Something broke</h1>
        <div className="kat-prose">
          <p>Refresh, or head home. Try the link below.</p>
        </div>
        <nav className="kat-links">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.invalidate();
              reset();
            }}
          >
            <span className="label">Try again </span>
            <span className="arrow">&rarr;</span>
          </a>
          <Link to="/">
            <span className="label">Go home </span>
            <span className="arrow">&rarr;</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

// Canonical site URL — used for OG tags, canonical link, and structured data.
// Update this when you point a custom domain at the Vercel deploy.
const SITE_URL = "https://katespinosa.com";

// JSON-LD Person schema — tells Google "this site is about a specific person
// named Kat Espinosa, a UX designer in Manila". Targets branded queries like
// "kat espinosa ux designer", "kat espinosa designer", "kat espinosa manila".
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kat Espinosa",
  alternateName: "Kat",
  jobTitle: "UX Designer",
  url: SITE_URL,
  description:
    "Kat Espinosa is a UX designer based in Manila, Philippines. UX design, product design, design systems, and notes on the ecology of ideas.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Manila",
    addressRegion: "Metro Manila",
    addressCountry: "PH",
  },
  knowsAbout: [
    "UX Design",
    "User Experience Design",
    "Product Design",
    "Web Design",
    "Design Systems",
    "Typography",
  ],
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kat Espinosa — UX Designer in Manila" },
      {
        name: "description",
        content:
          "Kat Espinosa is a UX designer based in Manila, Philippines — product design, design systems, and notes on the ecology of ideas. Designer, walker, houseplant.",
      },
      { name: "author", content: "Kat Espinosa" },
      { name: "robots", content: "index, follow" },
      // Open Graph
      { property: "og:title", content: "Kat Espinosa — UX Designer in Manila" },
      {
        property: "og:description",
        content:
          "Kat Espinosa, UX designer in Manila. Product design, design systems, walker, houseplant.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: "Kat Espinosa" },
      // OG image — ASCII houseplant with integrated name (1800 × 945)
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { property: "og:image:width", content: "1800" },
      { property: "og:image:height", content: "945" },
      {
        property: "og:image:alt",
        content: "ASCII art of a houseplant with the name Kat Espinosa",
      },
      // Twitter — uses the larger card now that we have a proper image
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kat Espinosa — UX Designer in Manila" },
      {
        name: "twitter:description",
        content: "UX designer in Manila, Philippines. Product design, design systems.",
      },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
      {
        name: "twitter:image:alt",
        content: "ASCII art of a houseplant with the name Kat Espinosa",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(personSchema),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
