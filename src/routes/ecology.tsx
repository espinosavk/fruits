import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/ecology")({
  head: () => ({
    meta: [
      { title: "Ecology of Ideas — Kat Espinosa" },
      { name: "description", content: "Notes on the ecology of ideas." },
      { property: "og:title", content: "Ecology of Ideas — Kat Espinosa" },
      { property: "og:description", content: "Notes on the ecology of ideas." },
    ],
  }),
  component: EcologyPage,
});

function EcologyPage() {
  return (
    <div className="kat-body">
      <div className="kat-column">
        <Link to="/" className="kat-back">← back</Link>
        <h1 className="kat-name">Ecology of Ideas</h1>
        <div className="kat-prose">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nullam ac erat ante. Nulla facilisi.</p>
          <p>Donec sed odio dui. Nulla vitae elit libero, a pharetra augue. Cras mattis consectetur purus sit amet fermentum. Vestibulum id ligula porta felis euismod semper. Maecenas faucibus mollis interdum.</p>
          <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Donec ullamcorper nulla non metus auctor fringilla.</p>
          <p>Curabitur blandit tempus porttitor. Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        </div>
      </div>
    </div>
  );
}