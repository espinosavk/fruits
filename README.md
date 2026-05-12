# katespinosa.com

Kat Espinosa's personal site. Brutalist HTML aesthetic, TanStack Start + Vite under the hood.

## Stack

- **TanStack Start** (file-based routing, SSR)
- **Vite** + **Tailwind v4** (`@tailwindcss/vite`)
- **React 19**
- No component library, no design tokens — just plain CSS in `src/styles.css`

## Pages

| Route | File | Notes |
|---|---|---|
| `/` | `src/routes/index.tsx` | Landing. Pulls live date / time / weather / sunrise / sunset from [Open-Meteo](https://open-meteo.com) (no API key). |
| `/ecology` | `src/routes/ecology.tsx` | Placeholder copy. Image slot is wired but commented out — drop the image at `src/assets/ecology.jpg` and uncomment the two marked lines. |
| `/unglamorous` | `src/routes/unglamorous.tsx` | Collage of `mundane-1.jpg` through `mundane-6.jpg` in `src/assets/`. Swap those files to update the images. The `tiles` array controls position; change `col` / `row` strings to move tiles around. |

## Dev

```bash
bun install
bun run dev          # http://localhost:3000
bun run build        # production build
bun run preview      # preview the build locally
```

## Deploy to Vercel

1. Push to GitHub.
2. In Vercel, import the repo. Vercel auto-detects Vite — no build config needed.
3. Default settings (`bun install` / `bun run build` / output `dist/`) work out of the box.

## Asset swap workflow

**Fruit images** (`/`): `src/assets/fruit-{mango,santol,watermelon,sinigwelas}.jpg`.
Replace the file with same name. ~512×768px works well.

**Mundane page images**: `src/assets/mundane-{1..6}.jpg`. Same idea — replace by name.

**Ecology image**: drop at `src/assets/ecology.jpg`, then in `src/routes/ecology.tsx`:

1. Uncomment `// import ecologyImg from "@/assets/ecology.jpg";`
2. Uncomment `{/* <img src={ecologyImg} alt="" className="kat-prose-img" /> */}`

## Changing location

The landing page time / weather / sunrise are pinned to Metro Manila. To change:

Edit `LOCATION` at the top of `src/routes/index.tsx`:

```ts
const LOCATION = { lat: 14.5995, lon: 120.9842, tz: "Asia/Manila" };
```

Update the "in Metro Manila, Philippines" string in the same file if needed.
