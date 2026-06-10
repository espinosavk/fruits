import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
    links: [{ rel: "canonical", href: "https://katespinosa.com" }],
  }),
  component: Index,
});

const LOCATION = { lat: 14.5995, lon: 120.9842, tz: "Asia/Manila" };

// The bubble cycles through these — one step per hover or tap on the
// name row. The last line closes the bit before the loop restarts.
const BUBBLE_PHRASES = [
  "what’s up??",
  "you hovered. bold.",
  "greetings, earthling!",
  "lovely to see you here",
  "kamusta??",
  "have you eaten?",
  "ok, back to work",
];

// Hovering a bio line makes the photo say its whisper.
const BIO: [string, string][] = [
  ["ux designer", "the rectangles obey (mostly)"],
  ["walker", "beloved by the sun and birds"],
  ["houseplant", "thrives in bright indirect sunlight"],
];

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
function manilaHour(d: Date) {
  return parseInt(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric", hour12: false, timeZone: LOCATION.tz,
    }).format(d),
    10,
  );
}
function manilaDay(d: Date) {
  return parseInt(
    new Intl.DateTimeFormat("en-US", {
      day: "numeric", timeZone: LOCATION.tz,
    }).format(d),
    10,
  );
}
// What the sky is doing, reduced to what matters for the Kat line.
type Sky = "storm" | "rain" | "drizzle" | "snow" | "fog" | "clear" | null;

function skyKind(code: number): Sky {
  if (code >= 95) return "storm";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code === 45 || code === 48) return "fog";
  return "clear";
}

// The weather report itself stays factual — the jokes live in the
// "Kat is probably" line, which reacts to clock, sky, and heat index.
// Lines carry their own end punctuation (the sleeping one trails off
// instead of ending in a period).
//
// Structure: the four work lines are the default state, rotating by
// day of month. Sleep, roosters, and lunch are the only scheduled
// exceptions; weather and heat can override any waking hour.
const KAT_AT_WORK = [
  "marinating in Figma.",
  "beep-bopping somebody’s website into the right place.",
  "caramelizing some design ideas.",
  "razzle dazzling a logo (and making it bigger).",
  "looking for the perfect font pairing.",
  "alchemizing words and aesthetics.",
  "adding more whitespace.",
  "fermenting a big idea (it needs another week).",
];

function describeKat(hour: number, day: number, sky: Sky, feels: number | null) {
  const awake = hour >= 6 && hour < 22;
  if (!awake) return "asleep.......zzzZ";
  if (sky === "storm") return "unplugging the router and narrating the thunder.";
  if (sky === "snow") return "double-checking that this is really Manila.";
  if ((sky === "rain" || sky === "drizzle") && hour >= 7 && hour < 9)
    return "walking anyway — the umbrella is mostly decorative.";
  if ((sky === "rain" || sky === "drizzle") && hour >= 18 && hour < 20)
    return "watching the rain like it’s prestige television.";
  if (feels != null && sky !== "rain" && sky !== "drizzle") {
    if (feels >= 40) return "standing directly in front of the electric fan, being dramatic.";
    if (feels >= 37) return "moving exclusively between air-conditioned locations.";
  }
  if (hour < 7) return "up before the roosters, allegedly.";
  if (hour >= 12 && hour < 13) return "thinking about lunch: adobo, sinigang, lumpia, etc.";
  return KAT_AT_WORK[day % KAT_AT_WORK.length];
}
// Each condition: a leading emoji, the factual report, and a small
// pool of dry asides — rotated by day of month so repeat visitors in
// a "mostly cloudy" climate get fresh lines. `suffixable` controls
// whether the rain-chance suffix attaches — when it's already
// raining, "with rain likely" is silly.
// An aside can be plain text, an external link, or a `say` trigger —
// hovering it makes the avatar's bubble speak the given line.
type Aside = { text: string; href?: string; say?: string };
type WeatherDesc = { emoji: string; fact: string; asides: Aside[]; suffixable: boolean };
type WeatherLine = { emoji: string; fact: string; suffix: string; aside?: Aside };

function describeWeather(code: number): WeatherDesc {
  if (code === 0)
    return {
      emoji: "☀️", fact: "Clear and bright", suffixable: true,
      asides: [
        { text: "Sun-maxxing in progress; bring the UV-blocked umbrella" },
        { text: "The sky has nothing to declare" },
      ],
    };
  if (code === 1)
    return {
      emoji: "🌤️", fact: "Mostly clear", suffixable: true,
      asides: [
        { text: "The clouds went minimalist" },
        { text: "Save for one or two clouds, freelancing" },
      ],
    };
  if (code === 2)
    return {
      emoji: "⛅", fact: "Partly cloudy", suffixable: true,
      asides: [
        { text: "Mark Strand would approve", say: "“A cloud without you is only a clod.”" },
        { text: "Sun and clouds in a custody arrangement" },
      ],
    };
  if (code === 3)
    return {
      emoji: "☁️", fact: "Mostly cloudy", suffixable: true,
      asides: [
        { text: "The sun appears occasionally, like a manager" },
        { text: "The sky is wearing layers" },
      ],
    };
  if (code === 45 || code === 48)
    return {
      emoji: "🌫️", fact: "Foggy", suffixable: true,
      asides: [{ text: "It’s Manila, but in soft focus" }],
    };
  if (code >= 51 && code <= 57)
    return {
      emoji: "🌦️", fact: "Drizzling", suffixable: false,
      asides: [
        { text: "Rain, but on a trial basis" },
        { text: "Barely committing to it" },
      ],
    };
  if (code >= 61 && code <= 67)
    return {
      emoji: "🌧️", fact: "Raining", suffixable: false,
      asides: [{ text: "With conviction" }],
    };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return {
      emoji: "❄️", fact: "Snowing, says the API. In Manila. Sure", suffixable: false,
      asides: [],
    };
  if (code >= 80 && code <= 82)
    return {
      emoji: "🌦️", fact: "Rain showers passing through", suffixable: false,
      asides: [{ text: "Brief but sincere" }],
    };
  if (code >= 95 && code <= 99)
    return {
      emoji: "⛈️", fact: "Thunderstorm overhead", suffixable: false,
      asides: [{ text: "The sky has the floor" }],
    };
  return { emoji: "🤷", fact: "Weather out there, of some kind", suffixable: false, asides: [] };
}

function fmtSunTime(iso: string) {
  const [h, m] = iso.split("T")[1].split(":").map((s) => parseInt(s, 10));
  const period = h >= 12 ? "pm" : "am";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${String(m).padStart(2, "0")}${period}`;
}
function describeRain(prob: number | null | undefined) {
  if (prob == null) return "";
  if (prob < 20) return "with little chance of rain";
  if (prob < 50) return "with a fair chance of rain";
  if (prob < 80) return "with rain likely";
  return "with rain practically scheduled";
}
const FRUITS = [
  { name: "mango", img: mangoImg, w: 320, h: 240, stars: "★★★★★", note: "the committee was unanimous" },
  { name: "santol", img: santolImg, w: 320, h: 290, stars: "★★★★", note: "high effort, high reward" },
  { name: "watermelon", img: watermelonImg, w: 320, h: 213, stars: "★★★★", note: "95% water, 100% correct" },
  { name: "sinigwelas", img: sinigwelasImg, w: 320, h: 213, stars: "★★★★★", note: "tiny fruit, major lore" },
];

const REVIEWS = [
  { stars: "★★☆☆", quote: "pretty good at design but pretty bad at cooking", by: "Doris, my mother" },
  { stars: "★☆☆☆", quote: "waters me on a schedule known only to her", by: "the houseplant" },
  { stars: "★★★☆", quote: "grows on you", by: "a moss" },
  { stars: "★★★★", quote: "made our website make sense. unsettling", by: "a client" },
  { stars: "★★★★★★", quote: "tangkilikin ang sariling atin", by: "Kat, reviewing herself" },
];

const MAX_FLOWERS = 9;

// The garden narrates its own growth, one note per planting, then
// politely cuts you off.
const GARDEN_NOTES = [
  "(click to propagate)",
  "propagating…",
  "photosynthesizing…",
  "add another one?",
  "plant-maxxing…",
  "the world is abundant…",
  "growing…",
  "greening…",
];

function gardenNote(n: number) {
  if (n >= MAX_FLOWERS) return "okay buddy, that’s enough garden for today.";
  return GARDEN_NOTES[n - 1];
}

function Index() {
  const [now, setNow] = useState<Date | null>(null);
  const [weatherLine, setWeatherLine] = useState<WeatherLine | null>(null);
  // `temps` no longer renders its own line, but the feels-like number
  // still steers the "Kat is probably" heat variants.
  const [temps, setTemps] = useState<{ actual: number; feels: number } | null>(null);
  const [sky, setSky] = useState<Sky>(null);
  const [sunrise, setSunrise] = useState("—");
  const [sunset, setSunset] = useState("—");
  // Welcome wave: after a 1s pause, the avatar enters its hover state
  // for ~2.4s, then returns to default. Re-triggerable on tap so mobile
  // users (who can't hover) still get to see the bubble after the
  // initial greeting. Each trigger advances to the next phrase.
  const [isGreeting, setIsGreeting] = useState(false);
  // While a bio line is hovered/focused, the bubble shows its whisper
  // instead of the greeting phrase.
  const [bioMsg, setBioMsg] = useState<string | null>(null);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [flowers, setFlowers] = useState(1);
  // 🎲 — null shows the scheduled line; rolling cycles the work pool
  // ("alternate timeline Kat", even during lunch or sleep).
  const [roll, setRoll] = useState<number | null>(null);
  const greetingEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bioMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstGreeting = useRef(true);

  const speakNote = useCallback((note: string) => {
    if (bioMsgTimer.current) clearTimeout(bioMsgTimer.current);
    setBioMsg(note);
  }, []);
  const quietNote = useCallback(() => {
    if (bioMsgTimer.current) clearTimeout(bioMsgTimer.current);
    setBioMsg(null);
  }, []);
  // Tap path (touch devices never fire mouseleave) — say it, then let go.
  const tapNote = useCallback((note: string) => {
    if (bioMsgTimer.current) clearTimeout(bioMsgTimer.current);
    setBioMsg(note);
    bioMsgTimer.current = setTimeout(() => setBioMsg(null), 2400);
  }, []);

  // Keep "what's up??" for the automatic wave; every hover or tap
  // after that steps through the rotation, so each visit to the
  // avatar gets a fresh line.
  const advanceGreeting = useCallback(() => {
    if (firstGreeting.current) {
      firstGreeting.current = false;
      return;
    }
    setPhraseIdx((i) => (i + 1) % BUBBLE_PHRASES.length);
  }, []);

  const triggerGreeting = useCallback(() => {
    if (greetingEndTimer.current) clearTimeout(greetingEndTimer.current);
    advanceGreeting();
    setIsGreeting(true);
    greetingEndTimer.current = setTimeout(() => setIsGreeting(false), 2400);
  }, [advanceGreeting]);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const start = setTimeout(triggerGreeting, 1000);
    return () => {
      clearTimeout(start);
      if (greetingEndTimer.current) clearTimeout(greetingEndTimer.current);
    };
  }, [triggerGreeting]);

  useEffect(() => {
    (async () => {
      try {
        const url =
          "https://api.open-meteo.com/v1/forecast" +
          `?latitude=${LOCATION.lat}&longitude=${LOCATION.lon}` +
          "&current=weather_code,temperature_2m,apparent_temperature" +
          "&daily=sunrise,sunset,precipitation_probability_max" +
          `&timezone=${encodeURIComponent(LOCATION.tz)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const code = data.current?.weather_code;
        const actual = data.current?.temperature_2m;
        const feels = data.current?.apparent_temperature;
        const rainProb = data.daily?.precipitation_probability_max?.[0];
        if (code != null) {
          const w = describeWeather(code);
          // Same line all day, fresh line tomorrow.
          const day = parseInt(
            new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: LOCATION.tz }).format(new Date()),
            10,
          );
          setWeatherLine({
            emoji: w.emoji,
            fact: w.fact,
            suffix: w.suffixable ? describeRain(rainProb) : "",
            aside: w.asides.length ? w.asides[day % w.asides.length] : undefined,
          });
          setSky(skyKind(code));
        }
        if (typeof actual === "number" && typeof feels === "number") {
          setTemps({ actual, feels });
        }
        const sunriseISO = data.daily?.sunrise?.[0];
        const sunsetISO = data.daily?.sunset?.[0];
        if (sunriseISO) setSunrise(fmtSunTime(sunriseISO));
        if (sunsetISO) setSunset(fmtSunTime(sunsetISO));
      } catch {
        /* keep placeholders */
      }
    })();
  }, []);

  const phrase = BUBBLE_PHRASES[phraseIdx];
  const bubbleText = bioMsg ?? phrase;
  const review = REVIEWS[reviewIdx];

  const scheduledKat = now
    ? describeKat(manilaHour(now), manilaDay(now), sky, temps?.feels ?? null)
    : "somewhere.";
  const katLine = roll == null ? scheduledKat : KAT_AT_WORK[roll % KAT_AT_WORK.length];
  const rollKat = () =>
    // First roll starts one past today's scheduled work line so the
    // text visibly changes; later rolls just step through the pool.
    setRoll((r) => (r == null ? (now ? manilaDay(now) : 0) + 1 : r + 1));

  return (
    <div className="kat-body">
      <div className="kat-column">
        <div
          className={`kat-name-row${isGreeting ? " is-greeting" : ""}${bioMsg ? " is-speaking" : ""}`}
          onClick={triggerGreeting}
          onMouseEnter={advanceGreeting}
        >
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
              <span
                className="kat-bubble-text"
                // Typewriter target width scales with phrase length.
                style={{ "--bubble-w": `${bubbleText.length * 0.56 + 0.4}em` } as React.CSSProperties}
                key={bubbleText}
              >
                {bubbleText}
              </span>
            </span>
          </span>
        </div>

        <ul className="kat-bio">
          {BIO.map(([term, note]) => (
            <li
              key={term}
              tabIndex={0}
              aria-label={`${term} — ${note}`}
              onMouseEnter={() => speakNote(note)}
              onMouseLeave={quietNote}
              onFocus={() => speakNote(note)}
              onBlur={quietNote}
              onClick={() => tapNote(note)}
            >
              <span className="kat-bio-term">{term}</span>
            </li>
          ))}
        </ul>

        <div className="kat-section">
          <h2>Today, <span>{now ? fmtDate(now) : "—"}</span></h2>
          <div className="kat-today">
            <p>It’s <span>{now ? fmtTime(now) : "—"}</span> in Metro Manila, Philippines.</p>
            <p>
              {weatherLine ? (
                <>
                  {weatherLine.emoji} {weatherLine.fact}
                  {weatherLine.suffix ? ` ${weatherLine.suffix}` : ""}.
                  {weatherLine.aside ? (
                    <>
                      {" "}
                      {weatherLine.aside.say ? (
                        <span
                          className="kat-say"
                          tabIndex={0}
                          aria-label={`${weatherLine.aside.text} — ${weatherLine.aside.say}`}
                          onMouseEnter={() => speakNote(weatherLine.aside!.say!)}
                          onMouseLeave={quietNote}
                          onFocus={() => speakNote(weatherLine.aside!.say!)}
                          onBlur={quietNote}
                          onClick={() => tapNote(weatherLine.aside!.say!)}
                        >
                          {weatherLine.aside.text}
                        </span>
                      ) : weatherLine.aside.href ? (
                        <a
                          className="kat-link"
                          href={weatherLine.aside.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {weatherLine.aside.text}
                        </a>
                      ) : (
                        weatherLine.aside.text
                      )}
                      .
                    </>
                  ) : null}
                  {" "}Sunrise <span>{sunrise}</span>, Sunset <span>{sunset}</span>.
                </>
              ) : (
                "Checking the sky…"
              )}
            </p>
            <p className="kat-roll" onClick={rollKat} title="roll an alternate Kat">
              {/* The whole line rerolls; the button carries keyboard +
                  screen-reader access and its click bubbles up to the
                  line's handler (no own onClick — it would double-fire). */}
              <button
                type="button"
                className="kat-dice"
                aria-label="Roll an alternate Kat"
              >
                <span className="kat-dice-face" key={roll ?? -1}>🎲</span>
              </button>{" "}
              <span className="kat-roll-text">Kat is probably....</span> <span>{katLine}</span>
            </p>
          </div>
        </div>

        <div className="kat-section">
          <h2>Favorite fruits in season <span className="kat-hint">(rigorously reviewed)</span></h2>
          <ul className="kat-fruits">
            {FRUITS.map((f) => (
              <li className="fruit-item" tabIndex={0} key={f.name}>
                <span className="fruit-name">{f.name}</span>
                <span className="fruit-img" aria-hidden="true">
                  <img src={f.img} alt={f.name} loading="lazy" width={f.w} height={f.h} />
                  <span className="fruit-note">
                    <span className="fruit-stars">{f.stars}</span>
                    “{f.note}”
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="kat-section">
          <h2>Day job</h2>
          <p>Web and content design for B2B firms: <a className="kat-link" href="https://moonfrank.com" target="_blank" rel="noopener noreferrer">moonfrank.com</a></p>
        </div>

        <div className="kat-section">
          <h2>Introverted but willing to talk about</h2>
          <p>Design as sense-making, typography: times new romans, comic sans, transformative experiences, architecture, fermentation, UX design, permaculture, meditation, birds, moss, memory, rachmaninoff, musicking, clouds</p>
        </div>

        <div className="kat-section">
          <h2>Links</h2>
          <nav className="kat-links">
            <Link to="/ecology"><span className="label">Ecology of Ideas </span><span className="arrow">→</span></Link>
            <Link to="/unglamorous"><span className="label">Unglamorous mundane </span><span className="arrow">→</span></Link>
            <a href="mailto:kat@moonfrank.com"><span className="label">Contact: kat@moonfrank.com </span><span className="arrow">→</span></a>
          </nav>
        </div>

        {/* Permaculture in practice: clicking anywhere in the garden
            strip (flowers, caption, gaps) propagates a cutting. */}
        <div
          className={`kat-garden${flowers >= MAX_FLOWERS ? " kat-garden--full" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Propagate a flower"
          onClick={() => setFlowers((n) => Math.min(n + 1, MAX_FLOWERS))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlowers((n) => Math.min(n + 1, MAX_FLOWERS));
            }
          }}
        >
          {Array.from({ length: flowers }, (_, i) => (
            <img
              key={i}
              src={flowerGif}
              alt=""
              className="kat-flower"
              width={75}
              height={75}
              loading="lazy"
            />
          ))}
          <span className="kat-garden-note" aria-hidden="true">
            {gardenNote(flowers)}
            {flowers >= MAX_FLOWERS && (
              <button
                type="button"
                className="kat-garden-reset"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlowers(1);
                }}
              >
                (start over)
              </button>
            )}
          </span>
        </div>

        <p
          className="kat-quote"
          onClick={() => setReviewIdx((i) => (i + 1) % REVIEWS.length)}
          title="click for a second opinion"
        >
          {review.stars}
          <br />
          “{review.quote}”
          <br />
          — <em>{review.by}</em>
          <br />
          <span className="kat-hint">(click for a second opinion)</span>
        </p>
      </div>
    </div>
  );
}
