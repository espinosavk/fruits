import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kat Espinosa" },
      { name: "description", content: "Kat Espinosa — designer, walker, houseplant." },
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
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState("It’s mostly cloudy with little chance of rain.");
  const [sunrise, setSunrise] = useState("5:13 am");
  const [sunset, setSunset] = useState("6:18 pm");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
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
        <h1 className="kat-name">Kat Espinosa</h1>

        <ul className="kat-bio">
          <li>designer</li>
          <li>walker</li>
          <li>houseplant</li>
        </ul>

        <div className="kat-section">
          <h3>Today, <span>{fmtDate(now)}</span></h3>
          <p>
            It’s <span>{fmtTime(now)}</span> in Metro Manila, Philippines.<br />
            <span>{weather}</span><br />
            🌅 Sunrise: <span>{sunrise}</span> &nbsp;🌇 Sunset: <span>{sunset}</span>
          </p>
        </div>

        <div className="kat-section">
          <h3>Fruits in season</h3>
          <ul className="kat-fruits">
            <li className="fruit-item" tabIndex={0}>
              <span className="fruit-name">mango</span>
              <span className="fruit-img" aria-hidden="true">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60 25 C 35 28, 22 50, 25 75 C 28 100, 50 110, 65 105 C 88 100, 96 78, 92 55 C 89 38, 78 25, 60 25 Z" fill="#F5A623" stroke="#1a1a1a" strokeWidth="2"/>
                  <ellipse cx="48" cy="52" rx="10" ry="14" fill="#FFD580" opacity="0.55"/>
                  <path d="M70 36 C 80 36, 88 42, 90 50 C 84 47, 78 45, 72 47 Z" fill="#E85A2C" opacity="0.55"/>
                  <path d="M58 26 L 60 16 L 68 13" stroke="#4a2c1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M65 14 C 73 8, 84 8, 87 14 C 82 21, 71 21, 65 14 Z" fill="#5a8a3f" stroke="#1a1a1a" strokeWidth="1.5"/>
                  <path d="M70 14 L 84 14" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.6"/>
                </svg>
              </span>
            </li>

            <li className="fruit-item" tabIndex={0}>
              <span className="fruit-name">santol</span>
              <span className="fruit-img" aria-hidden="true">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="68" r="36" fill="#D6924A" stroke="#1a1a1a" strokeWidth="2"/>
                  <path d="M40 50 Q 60 55 80 50" stroke="#a06a30" strokeWidth="0.8" fill="none" opacity="0.5"/>
                  <path d="M38 88 Q 60 82 82 88" stroke="#a06a30" strokeWidth="0.8" fill="none" opacity="0.5"/>
                  <ellipse cx="48" cy="58" rx="9" ry="13" fill="#F2BE78" opacity="0.6"/>
                  <circle cx="72" cy="74" r="1.5" fill="#8a5a2e" opacity="0.5"/>
                  <circle cx="50" cy="82" r="1" fill="#8a5a2e" opacity="0.5"/>
                  <circle cx="78" cy="60" r="1.2" fill="#8a5a2e" opacity="0.5"/>
                  <circle cx="62" cy="92" r="1" fill="#8a5a2e" opacity="0.5"/>
                  <path d="M58 33 L 56 20 L 62 15" stroke="#4a2c1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M62 15 Q 73 9, 81 16 Q 73 24, 62 19 Z" fill="#5a8a3f" stroke="#1a1a1a" strokeWidth="1.5"/>
                </svg>
              </span>
            </li>

            <li className="fruit-item" tabIndex={0}>
              <span className="fruit-name">watermelon</span>
              <span className="fruit-img" aria-hidden="true">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 45 Q 60 22, 102 45 L 102 52 L 18 52 Z" fill="#3d7a2e" stroke="#1a1a1a" strokeWidth="2"/>
                  <path d="M30 30 Q 32 38, 30 48" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity="0.4"/>
                  <path d="M50 26 Q 52 34, 50 48" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity="0.4"/>
                  <path d="M70 26 Q 72 34, 70 48" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity="0.4"/>
                  <path d="M90 30 Q 92 38, 90 48" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity="0.4"/>
                  <path d="M18 52 Q 60 47, 102 52 L 102 56 L 18 56 Z" fill="#f1efd9" stroke="#1a1a1a" strokeWidth="1.4"/>
                  <path d="M18 56 Q 60 53, 102 56 Q 92 102, 60 102 Q 28 102, 18 56 Z" fill="#e84545" stroke="#1a1a1a" strokeWidth="2"/>
                  <ellipse cx="40" cy="70" rx="1.6" ry="3.2" fill="#1a1a1a" transform="rotate(20 40 70)"/>
                  <ellipse cx="55" cy="76" rx="1.6" ry="3.2" fill="#1a1a1a" transform="rotate(-10 55 76)"/>
                  <ellipse cx="72" cy="70" rx="1.6" ry="3.2" fill="#1a1a1a" transform="rotate(15 72 70)"/>
                  <ellipse cx="83" cy="76" rx="1.6" ry="3.2" fill="#1a1a1a" transform="rotate(-20 83 76)"/>
                  <ellipse cx="48" cy="86" rx="1.6" ry="3.2" fill="#1a1a1a" transform="rotate(5 48 86)"/>
                  <ellipse cx="64" cy="90" rx="1.6" ry="3.2" fill="#1a1a1a" transform="rotate(-15 64 90)"/>
                  <ellipse cx="78" cy="88" rx="1.6" ry="3.2" fill="#1a1a1a" transform="rotate(25 78 88)"/>
                </svg>
              </span>
            </li>

            <li className="fruit-item" tabIndex={0}>
              <span className="fruit-name">sinigwelas</span>
              <span className="fruit-img" aria-hidden="true">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60 24 L 60 38" stroke="#4a2c1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M60 26 Q 72 18, 82 22 Q 75 32, 60 30 Z" fill="#5a8a3f" stroke="#1a1a1a" strokeWidth="1.5"/>
                  <circle cx="46" cy="55" r="18" fill="#6a1a30" stroke="#1a1a1a" strokeWidth="2"/>
                  <circle cx="72" cy="62" r="22" fill="#a02240" stroke="#1a1a1a" strokeWidth="2"/>
                  <circle cx="52" cy="86" r="20" fill="#8a1a35" stroke="#1a1a1a" strokeWidth="2"/>
                  <ellipse cx="40" cy="48" rx="5" ry="8" fill="#c44060" opacity="0.55" transform="rotate(-20 40 48)"/>
                  <ellipse cx="66" cy="55" rx="6" ry="10" fill="#d04060" opacity="0.55" transform="rotate(-20 66 55)"/>
                  <ellipse cx="46" cy="79" rx="5" ry="8" fill="#c44060" opacity="0.55" transform="rotate(-20 46 79)"/>
                </svg>
              </span>
            </li>
          </ul>
        </div>

        <div className="kat-section">
          <h3>Interests</h3>
          <p>Design as sense-making, typography: Times new romans, comic sans, transformative experiences, architecture, fermentation, UX design, permaculture, meditation, birds, moss, memory, musicking, clouds</p>
        </div>

        <nav className="kat-links">
          <a href="#"><span className="label">Ecology of Ideas </span><span className="arrow">→</span></a>
          <a href="#"><span className="label">Unglamorous mundane </span><span className="arrow">→</span></a>
          <a href="#"><span className="label">Say hello </span><span className="arrow">→</span></a>
        </nav>
      </div>
    </div>
  );
}
