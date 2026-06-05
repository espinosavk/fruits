import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import mangoImg from "@/assets/fruit-mango.webp";
import santolImg from "@/assets/fruit-santol.webp";
import watermelonImg from "@/assets/fruit-watermelon.webp";
import sinigwelasImg from "@/assets/fruit-sinigwelas.webp";
import flowerGif from "@/assets/flower.gif";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kat Espinosa — UX Designer in Manila" },
      {
        name: "description",
        content:
          "Kat Espinosa is a UX designer in Manila working at the intersection of web design, content design, and how B2B firms communicate to their market.",
      },
    ],
  }),
  component: Index,
});

const LOCATION = { lat: 14.5995, lon: 120.9842, tz: "Asia/Manila" };

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric", day: "numeric", year: "2-digit", timeZone: LOCATION.tz,
  }).format(d);
}
function fmtTime(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true, timeZone: LOCATION.tz,
  }).format(d);
}
function describeWeather(code: number) {
  if (code === 0) return "It’s clear and bright";
  if (code === 1) return "It’s mostly clear";
  if (code === 2) return "It’s partly cloudy";
  if (code === 3) return "It’s mostly cloudy";
  if (code === 45 || code === 48) return "It’s foggy";
  if (code >= 51 && code <= 57) return "It’s drizzling";
  if (code >= 61 && code <= 67) return "It’s raining";
  if (code >= 71 && code <= 77) return "It’s snowing";
  if (code >= 80 && code <= 82) return "There are rain showers";
  if (code >= 85 && code <= 86) return "There’s snow falling";
  if (code >= 95 && code <= 99) return "There’s a thunderstorm";
  return "It’s weather out there";
}
function describeRain(prob: number | null | undefined) {
  if (prob == null) return "";
  if (prob < 20) return "with little chance of rain";
  if (prob < 50) return "with a fair chance of rain";
  if (prob < 80) return "with rain likely";
  return "with rain expected";
}
function fmtSunTime(iso: string) {
  const [h, m] = iso.split("T")[1].split(":").map((s) => parseInt(s, 10));
  const period = h >= 12 ? "pm" : "am";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function Index() {
  const [now, setNow] = useState<Date | null>(null);
  const [weather, setWeather] = useState("Checking the sky…");
  const [sunrise, setSunrise] = useState("—");
  const [sunset, setSunset] = useState("—");
  // One-time welcome: after a 1s pause for the page to settle, the
  // avatar enters its hover state for ~2.4s, then returns to default.
  // Like a small wave at the viewer once they've arrived.
  const [isGreeting, setIsGreeting] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const start = setTimeout(() => setIsGreeting(true), 1000);
    const end = setTimeout(() => setIsGreeting(false), 1000 + 2400);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const url =
          "https://api.open-meteo.com/v1/forecast" +
          `?latitude=${LOCATION.lat}&longitude=${LOCATION.lon}` +
          "&current=weather_code" +
          "&daily=sunrise,sunset,precipitation_probability_max" +
          `&timezone=${encodeURIComponent(LOCATION.tz)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const code = data.current?.weather_code;
        const rainProb = data.daily?.precipitation_probability_max?.[0];
        const sunriseISO = data.daily?.sunrise?.[0];
        const sunsetISO = data.daily?.sunset?.[0];
        if (code != null) {
          setWeather(`${describeWeather(code)} ${describeRain(rainProb)}.`.replace(/\s+\./, ".").trim());
        }
        if (sunriseISO) setSunrise(fmtSunTime(sunriseISO));
        if (sunsetISO) setSunset(fmtSunTime(sunsetISO));
      } catch {
        /* keep placeholders */
      }
    })();
  }, []);

  return (
    <div className="kat-body">
      <div className="kat-column">
        <div className={`kat-name-row${isGreeting ? " is-greeting" : ""}`}>
          <h1 className="kat-name">Kat Espinosa</h1>
          <span className="kat-avatar-wrap">
            <img
              src="/kat-espinosa.webp"
              alt="Kat Espinosa, UX designer in Manila"
              className="kat-avatar"
              width={88}
              height={88}
              loading="lazy"
              tabIndex={0}
            />
            <span className="kat-bubble" aria-hidden="true">
              <span className="kat-bubble-text">what’s up??</span>
            </span>
          </span>
        </div>

        <ul className="kat-bio">
          <li>ux designer</li>
          <li>walker</li>
          <li>houseplant</li>
        </ul>

        <div className="kat-section">
          <h2>Today, <span>{now ? fmtDate(now) : "—"}</span></h2>
          <p>
            It’s <span>{now ? fmtTime(now) : "—"}</span> in Metro Manila, Philippines.<br />
            <span>{weather}</span><br />
            🌅 Sunrise: <span>{sunrise}</span> &nbsp;🌇 Sunset: <span>{sunset}</span>
          </p>
        </div>

        <div className="kat-section">
          <h2>Favorite fruits in season</h2>
          <ul className="kat-fruits">
            <li className="fruit-item" tabIndex={0}>
              <span className="fruit-name">mango</span>
              <span className="fruit-img" aria-hidden="true">
                <img src={mangoImg} alt="mango" loading="lazy" width={320} height={240} />
              </span>
            </li>

            <li className="fruit-item" tabIndex={0}>
              <span className="fruit-name">santol</span>
              <span className="fruit-img" aria-hidden="true">
                <img src={santolImg} alt="santol" loading="lazy" width={320} height={290} />
              </span>
            </li>

            <li className="fruit-item" tabIndex={0}>
              <span className="fruit-name">watermelon</span>
              <span className="fruit-img" aria-hidden="true">
                <img src={watermelonImg} alt="watermelon" loading="lazy" width={320} height={213} />
              </span>
            </li>

            <li className="fruit-item" tabIndex={0}>
              <span className="fruit-name">sinigwelas</span>
              <span className="fruit-img" aria-hidden="true">
                <img src={sinigwelasImg} alt="sinigwelas" loading="lazy" width={320} height={213} />
              </span>
            </li>
          </ul>
        </div>

        <div className="kat-section">
          <h2>Day job</h2>
          <p>Web and content design for B2B firms: <a className="kat-link" href="https://moonfrank.com" target="_blank" rel="noopener noreferrer">moonfrank.com</a></p>
        </div>

        <div className="kat-section">
          <h2>Introverted but willing to talk about</h2>
          <p>Design as sense-making, typography: times new romans, comic sans, transformative experiences, architecture, fermentation, UX design, permaculture, meditation, birds, moss, memory, musicking, clouds</p>
        </div>

        <div className="kat-section">
          <h2>Links</h2>
          <nav className="kat-links">
            <Link to="/ecology"><span className="label">Ecology of Ideas </span><span className="arrow">→</span></Link>
            <Link to="/unglamorous"><span className="label">Unglamorous mundane </span><span className="arrow">→</span></Link>
            <a href="mailto:kat@moonfrank.com"><span className="label">Contact: kat@moonfrank.com </span><span className="arrow">→</span></a>
          </nav>
        </div>

        <img src={flowerGif} alt="" className="kat-flower" width={75} height={75} loading="lazy" />

        <p className="kat-quote">
          ★★★☆
          <br />
          “pretty good at design but pretty bad at cooking”
          <br />
          — <em>Doris, my mother</em>
        </p>
      </div>
    </div>
  );
}
