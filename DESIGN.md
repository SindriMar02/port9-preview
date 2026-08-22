# Design System: Port 9 winebar (Jungle engine, 6th home)

## 1. Visual Theme & Atmosphere
The Jungle engine, truly: a liquid opening scene, a constant ink bar with an awning, arch
frames on every big photograph, self-pouring glasses on cream paper sheets laid over a
dark room, a pinned horizontal rail, a cut-out cursor trail. Gallery-airy density (3),
asymmetric offset variance (8), choreographed motion (7). Every VALUE below is Port 9's
own: a candlelit concrete room, a black-and-white roundel, a watercolour vine, and a wine
list printed on white paper where the house picks are set in green.

## 2. Color Palette & Roles (measured, not chosen)
Their room is *cool* concrete lit by candles, not a warm brown bar. The palette is
neutral-cold on the dark side so the one warm thing on the page is the wine itself.
- **Void** `#0C0C0D` — page ground; the dominant bucket of their photographs
- **Deep** `#141416` / **Moss** `#1C1C1F` — section steps, card grounds
- **Line** `#2E2E33` — hairlines on the dark ground
- **Ink** `#F2EFEA` — primary text on dark (16:1)
- **Dim** `#BDB8B0` / **Faint** `#958F88` — secondary text (9.4:1 / 6.2:1)
- **Claret** `#8E2A3E` — THE accent, sampled from the pour in their own photographs;
  on dark it lifts to **`#D0758A`** (6.6:1), on paper it deepens to **`#6E1B2E`**;
  **`#7A1E2F`** is the pour band itself
- **Menu green** `#3E7E5C` / `#2F6A4C` — reserved, NOT chrome. Their printed list sets
  the house picks in green, so green marks a pick and nothing else
- **Sheet white** `#F7F5F0` — their menu paper, used as-is, not warmed into cream
- **Sheet ink** `#121010` / **Sheet dim** `#5A5550` / **Sheet line** `#DCD6CC`
- **Pours (illustrative, stated as such):** red `#7A1E2F`, white `#E9D98C`, rosé `#E8A4A8`,
  orange `#D68A3B`, sparkling `#EEE4B5`, port `#4A1423`, spirit tints for cocktails
- **Vine** `#8C9A6C` and **grape** `#6E4F7E` — from their watercolour; pour bands and
  one illustration only, never chrome
- Banned here: bronze, gold, beige, purple glow, pure `#000`/`#fff`

## 3. Typography Rules
- **Display: Young Serif** — a high-contrast printed serif, the face their own paper
  wine list is set in. A stencil display face was tried first and rejected: the roundel
  is stencil-cut, the LIST is not, and the list is what this page mostly is.
  Never above 9vw, tight tracking
- **Body: Switzer** 400/500/600 — the engine's body face, unchanged
- **Utility: JetBrains Mono** 400/500 — prices, labels, the rail counter, the gate count
- Their menu's own category words (Rautt, Hvítt, Freyðivín, Rósavín, Appelsínuvín) are
  set huge, the way their printed sheet sets them

## 4. Component Stylings
- **Glasses:** one SVG path per vessel — red bowl, white bowl, flute, port, coupe, rocks —
  clipped fill, one band per GRAPE VARIETY, colour by wine type. Bands pour on arrival.
  Hovering a grape chip dims every other band in that glass. Outline stroke: claret on
  paper, claret-lift on dark
- **Arch:** `polygon(0% 22%, 18% 9%, 44% 2%, 72% 5%, 100% 20%, 100% 100%, 0% 100%)` on
  every big frame; `var(--r-arch) var(--r-arch) var(--r-card) var(--r-card)` on every
  domed card, so rail cards and method cards curve identically; sheets enter on a dome

## 4b. Border & Radius Scale (locked, audited both widths)
One border weight and four radii, nothing else:
- **Every border is `1px`.** The only exceptions are the round cursor-trail crops, where
  a hairline disappears at that diameter
- `--r-chip:2px` — grape chips, spec ticks, small stamps
- `--r-card:14px` — every rectangular card, sheet and frame corner
- `999px` — pills only (buttons, culture tags, status)
- `50%` — round things only (roundel, trail crops)
- `--r-arch:clamp(96px,14vw,200px)` — the shared dome top
- `--card-pad:clamp(20px,2.6vw,32px)` — every card's inner padding, one value
- Section rhythm is `130px` top and bottom on desktop, `48px` on mobile, uniform. Two
  adjacent sections never both draw a hairline: the second suppresses its `border-top`
- Every section heading's left edge is exactly `--pad` (72px desktop / 20px mobile)
- **Buttons:** pill, claret fill with ink text (primary), hairline ghost (secondary);
  `:active` translates 1px
- **Pull quotes:** their own sentences, in Young Serif, attributed to the page they
  were lifted from

## 5. Layout Principles
Hero full-bleed photograph under the roundel. Thesis splits text / stats. Paper sheets
carry the lists in two columns at 1100px+. The rail pins and travels sideways. The bottle
list sits on the dark ground in the same dish grammar. Single column under 768px, the
rail becomes a native snap list with `data-lenis-prevent`.

## 6. Motion & Interaction
Gate: liquid rises in red wine behind the WHITE roundel under `mix-blend-mode:
difference`, counter 00→100, label flips, the level drains through `inset(0 0 100% 0)`.
Hero: pinned, scroll pushes into the room (`--film-s` 1.05→1.30). Word-mask headings,
clip-wipe image pours, ±14% parallax, stagger pours. Lenis on fine pointers only.
Reduced motion: every initial state is `gsap.set`, so no-JS renders complete.

## 7. Anti-Patterns (banned)
No em or en dashes. No bronze/gold. No invented wines, vintages, prices or staff. No
photo of a dish we do not have. No section numbering beyond the engine's kicker. No
scroll cue text. No locale strip. No stock imagery: the thirteen photographs are theirs.
