import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";

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
// named Kat Espinosa, a UX designer in Manila working at the intersection of
// web design, content design, and B2B communication".
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kat Espinosa",
  alternateName: "Kat",
  jobTitle: "UX Designer",
  url: SITE_URL,
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}/kat-espinosa.webp`,
    width: 300,
    height: 300,
    caption: "Kat Espinosa, UX designer based in Manila",
  },
  description:
    "Kat Espinosa is a UX designer in Manila working at the intersection of web design, content design, and how B2B firms communicate to their market.",
  // Established profiles — ties the site to the same "Kat Espinosa"
  // entity Google already knows from these platforms.
  sameAs: [
    "https://www.linkedin.com/in/kat-espinosa/",
    "https://twitter.com/_katespinosa",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Manila",
    addressRegion: "Metro Manila",
    addressCountry: "PH",
  },
  knowsAbout: [
    "UX Design",
    "Web Design",
    "Content Design",
    "Information Architecture",
    "B2B Communication",
    "Brand Strategy",
    "Design Systems",
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
          "Kat Espinosa is a UX designer in Manila working at the intersection of web design, content design, and how B2B firms communicate to their market.",
      },
      { name: "author", content: "Kat Espinosa" },
      { name: "robots", content: "index, follow" },
      // Open Graph
      { property: "og:title", content: "Kat Espinosa — UX Designer in Manila" },
      {
        property: "og:description",
        content:
          "UX designer in Manila helping B2B firms communicate. Web design, content design.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: "Kat Espinosa" },
      // OG image — 1200×630 JPEG (FB/Twitter/iMessage standard size).
      // Custom designed preview card; Apple rejected the prior alpha PNG.
      { property: "og:image", content: `${SITE_URL}/og-kat.jpg` },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Kat Espinosa, UX designer in Manila",
      },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kat Espinosa — UX Designer in Manila" },
      {
        name: "twitter:description",
        content: "UX designer in Manila helping B2B firms communicate. Web + content design.",
      },
      { name: "twitter:image", content: `${SITE_URL}/og-kat.jpg` },
      {
        name: "twitter:image:alt",
        content: "Kat Espinosa, UX designer in Manila",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Canonical is per-route (set in each route's head) — a single
      // site-wide canonical told Google the subpages were duplicates
      // of the homepage.
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(personSchema),
      },
      // Umami analytics — privacy-friendly, cookieless page stats.
      {
        defer: true,
        src: "https://cloud.umami.is/script.js",
        "data-website-id": "74a64909-f474-4b98-a566-15ee28931d4e",
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
        <Analytics />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
