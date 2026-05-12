## Goal

Wire up the three footer links on the home page:
1. **Say hello** → `mailto:kat@moonfrank.com`
2. **Ecology of Ideas** → new `/ecology` page with lorem ipsum placeholder
3. **Unglamorous Mundane** → new `/unglamorous` page with a numbered list of mundane-life photos, styled like the reference (numbered rows, small thumbnail, dotted rule, right-aligned title in small caps)

## Files

- `src/routes/index.tsx` — replace the three `href="#"` anchors with: a real `mailto:` for "Say hello", and TanStack `<Link>` to `/ecology` and `/unglamorous` for the other two.
- `src/routes/ecology.tsx` — new route. Same brutalist column shell as the home page. Title "Ecology of Ideas", a back link to "/", and 3–4 lorem ipsum paragraphs in Times New Roman. `head()` set with route-specific title/description/og.
- `src/routes/unglamorous.tsx` — new route. Same column shell. Title "Unglamorous Mundane", back link, then a 6-row numbered list matching the attached reference: `N.` on the left, ~80px square thumbnail, dotted rule across the row, right-aligned ALL-CAPS title. `head()` set with route-specific metadata.
- `src/styles.css` — append small additions:
  - `.kat-back` link style (small, underlined, sits above the page title)
  - `.kat-prose` paragraph spacing for the ecology page
  - `.mundane-list` table-like layout for the numbered rows: number column, thumb column, dotted bottom border row, right-aligned title in small caps with letter-spacing
- `src/assets/mundane-1.jpg` … `mundane-6.jpg` — six generated photos of unglamorous everyday scenes (see image list below). Generated at 512×512 via the image tool, square thumbnails.

## Generated images and titles (mundane page)

1. `mundane-1.jpg` — A single unwashed coffee mug on a kitchen counter, soft daylight, candid photo → **MORNING CUP**
2. `mundane-2.jpg` — A pile of folded but slightly rumpled laundry on a bed → **LAUNDRY**
3. `mundane-3.jpg` — A half-eaten bowl of rice on a wooden table, overhead view → **LEFTOVERS**
4. `mundane-4.jpg` — Tangled charging cables on a nightstand, close-up → **CABLES**
5. `mundane-5.jpg` — A potted houseplant with one yellowing leaf, window light → **HOUSEPLANT**
6. `mundane-6.jpg` — A pair of worn slippers by a doorway, tile floor → **SLIPPERS**

## Behavior

- Both new pages reuse `.kat-body` / `.kat-column` so they match the home aesthetic.
- "Back" link at top-left returns to `/`.
- Mundane list: pure CSS, no hover effects (matches the print reference's calm).
- No backend changes, no new dependencies.

## Out of scope

- A shared layout/header — the column shell is duplicated inline since each page has different content density.
- Real content for the Ecology page — lorem ipsum only.
- Image lightbox / detail pages for the mundane items.
