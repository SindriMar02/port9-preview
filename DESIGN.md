# Design System: Port 9 winebar (Jungle engine, 6th home)

## 1. Visual Theme & Atmosphere
The Jungle engine, truly: a liquid opening scene, a constant ink bar with an awning, arch
frames on every big photograph, self-pouring glasses on cream paper sheets laid over a
dark room, a pinned horizontal rail, a cut-out cursor trail. Gallery-airy density (3),
asymmetric offset variance (8), choreographed motion (7). Every VALUE below is Port 9's
own: a candlelit concrete room, a black-and-white roundel, a watercolour vine, and a wine
list printed on white paper where the house picks are set in green.

## 2. Color Palette & Roles (measured, not chosen)
- **Room black** `#0F0C0B` — page ground; the dominant bucket of their photographs
- **Concrete** `#171311` / **Concrete lift** `#221C19` — section steps, card grounds
- **Line** `#332A25` — hairlines on the dark ground
- **Candle ink** `#F2EEE6` — primary text on dark (16:1)
- **Dim** `#BFB5AA` / **Faint** `#9A8F84` — secondary text (9.4:1 / 6.2:1)
- **Menu green** `#2F7A56` — THE accent. Their printed list sets featured wines in green;
  on dark it lifts to **`#5FA87E`** (6.9:1), on paper it deepens to **`#1F5C3E`** (8.6:1)
- **Sheet white** `#F7F5F0` — their menu paper, used as-is, not warmed into cream
- **Sheet ink** `#121010` / **Sheet dim** `#5A5550` / **Sheet line** `#DCD6CC`
- **Pours (illustrative, stated as such):** red `#7A1E2F`, white `#E9D98C`, rosé `#E8A4A8`,
  orange `#D68A3B`, sparkling `#EEE4B5`, port `#4A1423`, spirit tints for cocktails
- **Vine** `#8C9A6C` and **grape** `#6E4F7E` — from their watercolour; pour bands and
  one illustration only, never chrome
- Banned here: bronze, gold, beige, purple glow, pure `#000`/`#fff`

## 3. Typography Rules
- **Display: Bespoke Stencil** (Fontshare, self-hosted) — the roundel's letters are
  stencil-cut; the display face carries that cut into every heading. Weights 500–800,
  tight tracking, never above 9vw
- **Body: Switzer** 400/500/600 — the engine's body face, unchanged
- **Utility: JetBrains Mono** 400/500 — prices, labels, the rail counter, the gate count
- Their menu's own category words (Rautt, Hvítt, Freyðivín, Rósavín, Appelsínuvín) are
  set huge, the way their printed sheet sets them

## 4. Component Stylings
- **Glasses:** one SVG path per vessel — red bowl, white bowl, flute, port, coupe, rocks —
  clipped fill, one band per GRAPE VARIETY, colour by wine type. Bands pour on arrival.
  Hovering a grape chip dims every other band in that glass. Outline stroke: menu green
  on paper, candle ink on dark
- **Arch:** `polygon(0% 22%, 18% 9%, 44% 2%, 72% 5%, 100% 20%, 100% 100%, 0% 100%)` on
  every big frame; `200px 200px 14px 14px` on rail cards; paper sheets enter on a dome
- **Buttons:** pill, menu-green fill with candle ink text (primary), hairline ghost
  (secondary); `:active` translates 1px
- **Pull quotes:** their own sentences, in Bespoke Stencil, attributed to the page they
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
