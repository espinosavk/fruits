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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kat Espinosa" },
      { name: "description", content: "Kat Espinosa — designer, walker, houseplant." },
      { name: "author", content: "Kat Espinosa" },
      { property: "og:title", content: "Kat Espinosa" },
      { property: "og:description", content: "Designer, walker, houseplant. Based in Metro Manila." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
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
