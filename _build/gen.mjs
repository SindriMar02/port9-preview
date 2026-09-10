/* Emits index.html from _build/data.mjs.   Run:  node _build/gen.mjs
   The site stays build-free; this writes the file once, so every wine on the page
   is DERIVED from the transcribed list rather than hand-typed. */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as D from './data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const n2 = i => String(i + 1).padStart(2, '0');
const P = D.P;

/* ── glassware ──────────────────────────────────────────────────────────────
   The glass is DERIVED from the wine's own colour line on their sheet: Rautt
   pours into the wide bowl, Hvítt / Rósavín / Appelsínuvín into the narrower
   bowl, Freyðivín and Kampavín into the flute, Sterkt into the small port glass.
   Cocktails keep the donor's coupe and rocks; spritzes take the wine glass. */
const GLASS = {
  red:   { top: 32, bot: 82,  d: 'M20 28 Q20 78 44 85 L44 110 L30 116 L30 122 L70 122 L70 116 L56 110 L56 85 Q80 78 80 28 Z' },
  white: { top: 28, bot: 82,  d: 'M27 24 Q27 76 45 83 L45 110 L31 116 L31 122 L69 122 L69 116 L55 110 L55 83 Q73 76 73 24 Z' },
  flute: { top: 16, bot: 88,  d: 'M38 12 Q35 82 46 89 L46 110 L33 116 L33 122 L67 122 L67 116 L54 110 L54 89 Q65 82 62 12 Z' },
  port:  { top: 50, bot: 90,  d: 'M33 46 Q33 86 45 91 L45 110 L34 116 L34 122 L66 122 L66 116 L55 110 L55 91 Q67 86 67 46 Z' },
  coupe: { top: 36, bot: 83,  d: 'M14 34 Q14 78 46 84 L46 112 L30 118 L30 124 L70 124 L70 118 L54 112 L54 84 Q86 78 86 34 Z' },
  rocks: { top: 59, bot: 122, d: 'M20 56 L24 118 Q24 124 31 124 L69 124 Q76 124 76 118 L80 56 Z' }
};
const WINE = { red: D.W.red, white: D.W.white, rose: D.W.rose, orange: D.W.orange, flute: D.W.spark, port: D.W.port };

/* one grape = one band; a blend shows as tonal steps of the wine's own colour */
const mix = (hex, t) => {
  const c = hex.replace('#',''); const n = parseInt(c,16);
  const r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  const m = v => Math.round(v + (255 - v) * t).toString(16).padStart(2,'0');
  return `#${m(r)}${m(g)}${m(b)}`;
};
const bandsFor = (base, grapes) => grapes.map((g, i) => [g, mix(base, Math.min(0.38, i * 0.13))]);

function glassSvg(kind, id, ing, opts = {}) {
  const g = GLASS[kind];
  const weights = opts.weights || ing.map(() => 1);
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const span = g.bot - g.top;
  let acc = 0;
  const bands = ing.map(([, colour], i) => {
    const h = span * weights[i] / total; acc += h;
    return `<rect class="gl__band" data-band="${i}" x="0" y="${(g.bot - acc).toFixed(1)}" width="100" height="${(h + 0.6).toFixed(1)}" fill="${colour}"/>`;
  }).join('');
  return `<svg viewBox="0 0 100 130" class="gl gl--${kind}" data-fill>
                <defs><clipPath id="cp-${id}"><path d="${g.d}"/></clipPath></defs>
                <g clip-path="url(#cp-${id})">${bands}</g>
                <path class="gl__out" d="${g.d}"/>
              </svg>`;
}

/* ── one wine row on the sheet - producer, cuvée, appellation, region, grapes ─ */
function wineRow(w, kind, id, i, opts = {}) {
  const base = w.rose ? D.W.rose : (opts.colour || WINE[kind] || D.W.red);
  const ing = bandsFor(base, w.grapes);
  const spec = ing.map(([label, colour], k) => `<li data-ing="${k}"><i style="--c:${colour}" aria-hidden="true"></i>${esc(label)}</li>`).join('');
  const price = w.b ? `${esc(w.g)} <span class="dish__slash">//</span> ${esc(w.b)}` : esc(w.g || w.p);
  return `          <li class="dish${w.pick ? ' dish--pick' : ''}">
            <div class="dish__glass" aria-hidden="true">${glassSvg(kind, id, ing)}</div>
            <div class="dish__body">
              <p class="dish__top"><span class="dish__n mono">${n2(i)}</span><span class="dish__name">${esc(w.prod)}<span class="dish__cuv">, ${esc(w.cuv)}</span></span><span class="dish__rule" aria-hidden="true"></span><span class="dish__p mono">${price}</span></p>
              <p class="dish__tags mono">${esc(w.app)}${w.reg || w.place ? ` &middot; ${esc(w.reg || w.place)}` : ''}</p>
              <ul class="dish__spec">${spec}</ul>
              ${w.pick ? `<p class="dish__pick mono">GRÆNT Á SEÐLINUM</p>` : ''}
            </div>
          </li>`;
}

function course(id, title, sub, rowsHtml) {
  return `      <section class="course" aria-labelledby="course-${id}">
        <header class="course__head">
          <h3 class="course__title" id="course-${id}">${title}</h3>
          ${sub ? `<p class="course__price mono">${sub}</p>` : ''}
        </header>
        <ul class="course__list">
${rowsHtml}
        </ul>
      </section>`;
}

/* ── Á GLASI ─────────────────────────────────────────────────────────────── */
let nGlass = 0;
const glassCourses = Object.entries(D.byGlass).map(([key, c]) => {
  const colour = key === 'rose' ? D.W.rose : key === 'orange' ? D.W.orange : undefined;
  const rows = c.items.map((w, i) => { nGlass++; return wineRow(w, c.v, `g-${key}-${i}`, i, { colour }); }).join('\n');
  return course(`g-${key}`, `${esc(c.title)} <em class="course__en">á glasi</em>`, 'GLAS // FLASKA', rows);
}).join('\n');

/* ── KOKTEILAR - their six, on the same sheet ────────────────────────────── */
const cocktailRows = D.cocktails.map((c, i) => {
  const spec = c.ing.map(([label, colour], k) => `<li data-ing="${k}"><i style="--c:${colour}" aria-hidden="true"></i>${esc(label)}</li>`).join('');
  return `          <li class="dish">
            <div class="dish__glass" aria-hidden="true">${glassSvg(c.v, `ck-${i}`, c.ing)}</div>
            <div class="dish__body">
              <p class="dish__top"><span class="dish__n mono">${n2(i)}</span><span class="dish__name">${esc(c.n)}</span><span class="dish__rule" aria-hidden="true"></span><span class="dish__p mono">${esc(c.p)}</span></p>
              <ul class="dish__spec">${spec}</ul>
            </div>
          </li>`;
}).join('\n');

/* ── THE RAIL - countries, each card a station ───────────────────────────── */
const countryCount = D.bottles.length;
const bottleCount = D.bottles.reduce((a, c) => a + c.groups.reduce((b, g) => b + g.items.length, 0), 0);
const grapeSet = new Set();
D.bottles.forEach(c => c.groups.forEach(g => g.items.forEach(w => w.grapes.forEach(x => grapeSet.add(x)))));
Object.values(D.byGlass).forEach(c => c.items.forEach(w => w.grapes.forEach(x => grapeSet.add(x))));
const regionSet = new Set();
D.bottles.forEach(c => c.groups.forEach(g => g.items.forEach(w => regionSet.add(w.reg))));

/* ── FÓLKIÐ - six empty plates, ready for their portraits ─────────────────
   No stock faces and no placeholder names: a made-up "Anna, barþjónn" reads as
   real to anyone who does not know better, and the first thing it would do is
   go out in an email as if it were their staff. An empty plate cannot lie, and
   dropping the photographs in later changes nothing but the src. */
const STAFF_SLOTS = 6;
const staffBlock = Array.from({ length: STAFF_SLOTS }, (_, i) => `        <li class="crew__card crew__card--slot">
          <div class="crew__plate" aria-hidden="true">
            <img class="crew__ghost" src="assets/img/roundel-white.png" alt="" width="600" height="600" loading="lazy" decoding="async" />
            <span class="crew__slot-n mono">${n2(i)}</span>
          </div>
          <div class="crew__body">
            <h3>Nafn</h3>
            <p class="crew__await mono">STARF &middot; PORT 9</p>
          </div>
        </li>`).join('\n');

/* ── FLÖSKUR - every bottle, on the dark ground, by country ───────────────
   9,150px of unbroken list was the problem: one flat sheet, forty-four rows,
   nothing to mark where you were or to rest the eye. Each country is a chapter
   now — its own number, its name held at the top of the screen while you read
   it, its regions and count stated once — and two of them open onto a
   photograph, so the scroll breathes twice on the way down. */
const CHAPTER_PLATES = { 1: ['tasting', 'VÍNSMÖKKUN Í SALNUM'], 4: ['bucket', 'Á BARNUM · FLASKAN Í KLAKANUM'] };

const bottleCourses = D.bottles.map((c, ci) => {
  const n = c.groups.reduce((a, g) => a + g.items.length, 0);
  const regions = [...new Set(c.groups.flatMap(g => g.items.map(w => w.reg)))];
  const rows = c.groups.map((g, gi) => {
    const head = `          <li class="dish dish--head"><p class="dish__grp"><span class="dish__grp-t">${esc(g.head)}</span><span class="mono">${g.items.map(w => w.reg).filter((v, i, a) => a.indexOf(v) === i).map(esc).join(' &middot; ')}</span></p></li>`;
    const items = g.items.map((w, i) => {
      const kind = (w.c || g.c) === 'orange' ? 'white' : (w.c || g.c);
      const colour = (w.c || g.c) === 'orange' ? D.W.orange : undefined;
      const ww = { ...w, reg: w.place, g: w.p };
      return wineRow(ww, kind, `b-${ci}-${gi}-${i}`, i, { colour });
    }).join('\n');
    return head + '\n' + items;
  }).join('\n');

  const pl = CHAPTER_PLATES[ci];
  const plate = pl ? `    <figure class="chapter__plate" data-pour>
      <img src="${P[pl[0]].src}" alt="${esc(P[pl[0]].alt)}" width="${P[pl[0]].w}" height="${P[pl[0]].h}" loading="lazy" decoding="async" />
      <figcaption class="mono">${esc(pl[1])}</figcaption>
    </figure>` : '';

  return `  <article class="chapter${pl ? ' chapter--plated' : ''}" id="land-${ci}" aria-labelledby="chapter-${ci}">
    <header class="chapter__head">
      <p class="chapter__n mono">${n2(ci)} / ${n2(D.bottles.length - 1)}</p>
      <h3 class="chapter__t" id="chapter-${ci}">${esc(c.country)} <em>${esc(c.en)}</em></h3>
      <p class="chapter__meta mono">${n} ${n === 1 ? 'FLASKA' : 'FLÖSKUR'} &middot; ${regions.map(esc).join(' &middot; ')}</p>
    </header>
${plate}
    <div class="chapter__sheet">
      <ul class="course__list">
${rows}
      </ul>
    </div>
  </article>`;
}).join('\n');

/* the jump strip: seven countries, so the list can be entered anywhere */
const chapterNav = `  <nav class="chapter-nav" aria-label="Lönd á flöskulistanum">
${D.bottles.map((c, ci) => `    <a href="#land-${ci}">${esc(c.country)}<i class="mono" aria-hidden="true">${c.groups.reduce((a, g) => a + g.items.length, 0)}</i></a>`).join('\n')}
  </nav>`;

/* ── tasting packages ───────────────────────────────────────────────────── */
const tastingBlock = D.tasting.packages.map((p, i) => {
  const ing = Array.from({ length: p.wines }, (_, k) => [`Vín ${k + 1}`, mix(D.W.red, Math.min(0.4, k * 0.08))]);
  return `      <section class="method">
        <div class="method__head">
          ${glassSvg('red', `t-${i}`, ing)}
          <div><h3 class="method__title">${esc(p.n)}</h3><p class="method__price mono">${esc(p.p)}</p></div>
        </div>
        <ul class="method__list">
          <li>${esc(p.line)}</li>
          ${p.dur ? `<li>${esc(p.dur)}</li>` : ''}
        </ul>
      </section>`;
}).join('\n');

/* ── food with their pairings ───────────────────────────────────────────── */
const foodRows = D.food.map(f => `<li class="hh">
        <span class="hh__n">${esc(f.n)}${f.served ? `<span class="hh__sub">${esc(f.served)}${f.what ? `. ${esc(f.what)}` : ''}</span>` : ''}${f.pair ? `<span class="hh__pair mono">BEST PAIRED WITH ${esc(f.pair).toUpperCase()}</span>` : ''}</span>
        <span class="hh__rule" aria-hidden="true"></span><span class="hh__p mono">${esc(f.p)},-</span></li>`).join('\n');

const zeroRows = [
  ...D.zero.cocktails.map(z => `<li class="cw${z.pick ? ' cw--pick' : ''}"><span class="cw__n">${esc(z.n)}${z.note ? `<span class="cw__note mono">${esc(z.note).toUpperCase()}</span>` : ''}</span><span class="cw__rule" aria-hidden="true"></span><span class="cw__p mono">${esc(z.p)}</span></li>`)
].join('');
const zeroSpark = D.zero.spark.map(z => `<li class="cw"><span class="cw__n">${esc(z.n)}</span><span class="cw__rule" aria-hidden="true"></span><span class="cw__p mono">${esc(z.p)}</span></li>`).join('');
const zeroBeer = D.zero.beer.map(z => `<li class="cw"><span class="cw__n">${esc(z.n)}</span><span class="cw__rule" aria-hidden="true"></span><span class="cw__p mono">${esc(z.p)}</span></li>`).join('');
const zeroSoft = D.zero.soft.map(([n, p]) => `<li class="cw"><span class="cw__n">${esc(n)}</span><span class="cw__rule" aria-hidden="true"></span><span class="cw__p mono">${esc(p)}</span></li>`).join('');

const fig = (k, cap, cls = '') => `  <figure class="bleed ${cls}" data-pour>
    <img src="${P[k].src}" alt="${esc(P[k].alt)}" width="${P[k].w}" height="${P[k].h}" loading="lazy" decoding="async" />
    <figcaption class="mono">${esc(cap)}</figcaption>
  </figure>`;

/* ── the landing film: four frames of the room, crossfaded ────────────────
   The still was the bar with its back to us. These are the frames with people
   in them, in the order they read best: a laugh, a toast, the room, the pair
   in black and white. Frame one is the LCP image and the only eager load; the
   rest are lazy and carry empty alts, because they say the same thing. */
const HERO_FRAMES = ['laugh', 'twoMen', 'sofa', 'coupleBw'];
const heroStack = HERO_FRAMES.map((k, i) => {
  const f = P[k];
  return `    <img class="hero__film${i ? '' : ' is-live'}" src="${f.src}" ` +
         `alt="${i ? '' : esc(f.alt)}"${i ? ' aria-hidden="true"' : ''} ` +
         `width="${f.w}" height="${f.h}" ` +
         `${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" />`;
}).join('\n');

const html = `<!doctype html>
<html lang="is">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Port 9 winebar &middot; Veghúsastígur 9, Reykjavík</title>
<meta name="description" content="Port 9 er elsti vínbar Íslands, opnaður 2016. Vín á glasi sem skiptast út á tveggja vikna fresti, flöskulisti frá Bordeaux að Bekaa, vínsmökkun fyrir hópa og happy hour 16-18." />
<meta name="robots" content="noindex" />
<meta name="theme-color" content="#0C0C0D" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Port 9 winebar &middot; Veghúsastígur 9, Reykjavík" />
<meta property="og:description" content="Elsti vínbar Íslands. Vín frá öllum heimshornum, á glasi og í flösku." />
<meta property="og:image" content="https://sindrimar02.github.io/port9-preview/${P.hero.src}" />
<meta property="og:locale" content="is_IS" />
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="assets/favicon-48.png" type="image/png" sizes="48x48" />
<link rel="icon" href="assets/favicon-32.png" type="image/png" sizes="32x32" />
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png" />
<link rel="preload" href="assets/fonts/YoungSerif-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="assets/fonts/Switzer-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" as="image" href="${P[HERO_FRAMES[0]].src}" fetchpriority="high" />
<link rel="stylesheet" href="styles.css" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  "name": "Port 9 winebar",
  "url": "https://www.port9.is/",
  "email": "${D.biz.email}",
  "telephone": "+354 ${D.biz.phone}",
  "servesCuisine": "Wine bar",
  "foundingDate": "2016",
  "address": { "@type": "PostalAddress", "streetAddress": "${D.biz.street}", "postalCode": "${D.biz.postal}", "addressLocality": "${D.biz.city}", "addressCountry": "IS" },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "16:00", "closes": "23:00" }
  ]
}
</script>
</head>
<body>

<a class="skip" href="#main">Beint í efnið</a>

<!-- ══════════ opening scene ══════════
     The Jungle pour: a live liquid surface rises behind the wordmark, which is
     knocked out of it by blend-difference; the counter runs to 100, the label
     flips, and the whole level drains away through the arch. Here the liquid
     is the red on their sheet, and the mark is their own roundel. -->
<div class="gate" id="gate">
  <svg class="gate__liquid" id="gateLiquid" viewBox="0 0 1200 1000" preserveAspectRatio="none" aria-hidden="true">
    <path id="gateWave" fill="#7A1E2F" d="M0,1000 L0,1000 Q300,1000 600,1000 T1200,1000 L1200,1000 Z"/>
  </svg>
  <div class="gate__inner">
    <img class="gate__logo" src="assets/img/roundel-white.png" alt="" width="600" height="600" />
    <p class="gate__line mono" id="gateLine">HELLT Í</p>
  </div>
  <p class="gate__count mono" id="gateCount">00</p>
  <button class="gate__skip mono" id="gateSkip" type="button">Sleppa</button>
</div>

<!-- ══════════ header ══════════ -->
<header class="hdr" id="hdr">
  <p class="hdr__side hdr__side--l mono">VEGHÚSASTÍGUR 7-9 &middot; 101 REYKJAVÍK</p>
  <a class="hdr__mark" href="#top" aria-label="Port 9, efst á síðu">
    <img src="assets/img/roundel-white.png" alt="Port 9 winebar" width="112" height="112" />
  </a>
  <div class="hdr__side hdr__side--r">
    <p class="mono hdr__open">HAPPY HOUR 16-18</p>
    <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Opna valmynd">
      <span class="burger__box" aria-hidden="true"><i></i><i></i></span>
      <span class="burger__word mono" aria-hidden="true">VALMYND</span>
    </button>
  </div>
</header>

<div class="menu" id="menu" hidden>
  <div class="menu__inner">
    <nav class="menu__nav" aria-label="Síðan">
      <a href="#glasi"><span><i class="mono" aria-hidden="true">01</i>Á glasi</span></a>
      <a href="#folkid"><span><i class="mono" aria-hidden="true">02</i>Fólkið</span></a>
      <a href="#floskur"><span><i class="mono" aria-hidden="true">03</i>Flöskur</span></a>
      <a href="#salurinn"><span><i class="mono" aria-hidden="true">04</i>Salurinn</span></a>
      <a href="#smokkun"><span><i class="mono" aria-hidden="true">05</i>Vínsmökkun</span></a>
      <a href="#happy"><span><i class="mono" aria-hidden="true">06</i>Happy hour &amp; matur</span></a>
      <a href="#menning"><span><i class="mono" aria-hidden="true">07</i>Menning</span></a>
      <a href="#visit"><span><i class="mono" aria-hidden="true">08</i>Heimsókn</span></a>
    </nav>
    <div class="menu__foot">
      <p class="mono">${esc(D.biz.street)} &middot; ${esc(D.biz.postal)} ${esc(D.biz.city)} &middot; ${esc(D.biz.phone)}</p>
      <a class="btn btn--main" href="${D.biz.booking}" rel="noopener">Bóka borð á Dineout</a>
    </div>
  </div>
</div>

<main id="main">

<!-- ══════════ 1. hero ══════════ -->
<section class="hero" id="top">
  <div class="hero__stack">
${heroStack}
  </div>
  <div class="hero__scrim" aria-hidden="true"></div>
  <div class="hero__veil" aria-hidden="true"></div>
  <!-- the header watches this: above the fold line, the bar has no ground -->
  <div class="hero__cue" id="hdrCue" aria-hidden="true"></div>

  <div class="hero__content">
    <p class="hero__eyebrow mono">VÍNBAR &middot; SÍÐAN ${esc(D.biz.since)} &middot; REYKJAVÍK</p>
    <h1 class="hero__h1">
      <img class="hero__mark" id="heroMark" src="assets/img/roundel-white.png" alt="Port 9 winebar" width="600" height="600" fetchpriority="high" />
      <span class="hero__tag">${esc(D.biz.tagIs)}</span>
    </h1>
    <div class="hero__base" id="heroBase">
      <p class="hero__blurb">Elsti vínbar landsins. Vín frá öllum heimshornum, á glasi og í flösku.</p>
      <div class="hero__acts">
        <a class="btn btn--main" href="#glasi">Skoða vínseðilinn</a>
        <a class="btn btn--ghost" href="${D.biz.booking}" rel="noopener">Bóka borð</a>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ 2. thesis ══════════ -->
<!-- Was: a headline, a three-sentence lede, a pull quote, a gloss paragraph and
     four stacked facts whose labels ran to twenty words each — an essay standing
     between the film and the wine. Now it is the front door: one line of who we
     are, the way in, and three numbers held to two words apiece, with the house
     itself carrying the right-hand side of the screen. -->
<section class="thesis" id="about">
  <div class="thesis__grid">
    <div class="thesis__text">
      <p class="kicker mono">01 / HÚSIÐ</p>
      <h2 class="h2">Ef þú ratar einu sinni,<br /><em>þá ratarðu aftur</em></h2>
      <p class="lead">Elsti vínbar landsins, opinn síðan ${esc(D.biz.since)}. Kertaljós, vín frá öllum heimshornum og seðill sem breytist á tveggja vikna fresti.</p>
      <div class="thesis__acts">
        <a class="btn btn--main" href="#glasi">Vínin á glasi núna</a>
        <a class="btn btn--ghost" href="${D.biz.booking}" rel="noopener">Bóka borð</a>
      </div>
      <ul class="ledger">
        <li><span class="ledger__n">${nGlass}</span><span class="ledger__l mono">Á GLASI</span></li>
        <li><span class="ledger__n">${bottleCount}</span><span class="ledger__l mono">FLÖSKUR</span></li>
        <li><span class="ledger__n">${countryCount}</span><span class="ledger__l mono">LÖND</span></li>
      </ul>
    </div>

    <figure class="thesis__plate" data-pour>
      <img src="${P.facade.src}" alt="${esc(P.facade.alt)}" width="${P.facade.w}" height="${P.facade.h}" loading="lazy" decoding="async" />
      <figcaption class="mono">VEGHÚSASTÍGUR 7-9 &middot; SVARTA HÚSIÐ MEÐ LJÓSUNUM</figcaption>
    </figure>
  </div>
</section>

<!-- ══════════ 3. Á GLASI ══════════ -->
<section class="drinks paper" id="glasi">
  <header class="sec-head">
    <p class="kicker mono">02 / Á GLASI</p>
    <h2 class="h2">Hvert vín hellir sér<br />í sitt eigið glas</h2>
    <p class="sec-head__note">Liturinn á seðlinum velur glasið: rautt í víðu skálina, hvítt, rósa og appelsínu í þá mjórri, freyðivín í flautuna, sterkt í litla glasið. Ein rönd á hverja þrúgu sem við skrifum undir vínið. Vínin á glasi skiptast út á tveggja vikna fresti, svo það borgar sig að kíkja reglulega.</p>
  </header>

  <div class="sheet">
${glassCourses}
  </div>

  <aside class="mystery" aria-labelledby="mystery-h">
    <div class="mystery__glass" aria-hidden="true">
      <svg viewBox="0 0 100 130" class="gl gl--red gl--empty"><path class="gl__out" d="${GLASS.red.d}"/><text class="gl__q" x="50" y="64" text-anchor="middle">?</text></svg>
    </div>
    <div>
      <p class="kicker mono">Á SEÐLINUM OKKAR</p>
      <h3 class="mystery__h" id="mystery-h">${esc(D.mystery.name)}</h3>
      <p class="mystery__p mono">${esc(D.mystery.price)}</p>
      <p class="mystery__note">Leikurinn okkar, eins og hann stendur á seðlinum: glasið kostar 2.500 krónur, eða ekkert. Spyrjið okkur við barinn hvernig maður vinnur hann.</p>
    </div>
  </aside>

${fig('redglass', 'VIÐ BARINN · GLASI LYFT YFIR LJÓSIN', 'bleed--port')}

  <div class="sheet">
${course('ck', 'Kokteilar', 'ÞEIRRA EIGIN SEÐILL', cocktailRows)}
  </div>

  <p class="sheet__note">Vín, þrúgur, upprunahéruð og verð eins og þau standa á seðlinum okkar í ágúst 2026. Vínin á glasi skiptast út á tveggja vikna fresti, svo þetta er einn tiltekinn seðill. Randalitir eru til skýringar, ekki smakknótur.</p>
</section>

<!-- ══════════ 4. FÓLKIÐ: the rail, waiting for their portraits ══════════ -->
<!-- The countries used to live here, which said the same thing as the bottle
     list below it twice. The rail is the one place on the page shaped like
     people, so it holds them: empty plates until Port 9 send portraits, with
     no invented names or borrowed faces standing in. -->
<section class="crew" id="folkid">
  <div class="crew__pin" id="crewPin">
    <header class="crew__head">
      <p class="kicker mono">03 / FÓLKIÐ</p>
      <h2 class="h2">Fólkið<br /><em>á bak við barinn</em></h2>
      <p class="crew__note">Öll vaktin okkar kann að tala um það sem hún hellir í glasið. Hér koma myndirnar af hópnum, ein fyrir hvern.</p>
    </header>
    <!-- tabindex: a scroll container with no focusable children cannot be
         reached or scrolled by keyboard at all without it -->
    <ul class="crew__track" id="crewTrack"
        tabindex="0" role="group" aria-label="Starfsfólk, skrunið til hliðar">
${staffBlock}
    </ul>
    <div class="crew__rail-foot">
      <p class="crew__hint mono">DRAGIÐ TIL HLIÐAR</p>
      <div class="crew__bar" id="crewBar" aria-hidden="true"><span></span></div>
    </div>
  </div>
</section>

<!-- ══════════ 5. FLÖSKUR - the whole bottle list, on the dark ground ══════════ -->
<section class="drinks drinks--dark" id="floskur">
  <div class="archive__trail" id="trail" aria-hidden="true"></div>
  <header class="sec-head sec-head--mid">
    <p class="kicker mono">04 / FLÖSKUR</p>
    <h2 class="h2">Frá Bordeaux<br />að Bekaa</h2>
    <p class="sec-head__note">Allur flöskulistinn okkar, land fyrir land og hérað fyrir hérað, hver flaska með framleiðanda, árgangi, upprunavottun og þrúgum.</p>
  </header>
${chapterNav}
  <div class="chapters">
${bottleCourses}
  </div>
  <p class="sheet__note">Flöskuverð eins og þau standa á seðlinum. Tvær flöskur bera grænan lit hjá okkur, Famille Hugel 1998 og Llopart Reserva Brut, og eru merktar þannig hér.</p>
</section>

<!-- ══════════ 6. the room ══════════ -->
<section class="room" id="salurinn">
  <header class="sec-head">
    <p class="kicker mono">05 / SALURINN</p>
    <h2 class="h2">Steinsteypa,<br /><em>kertaljós og grænir sófar</em></h2>
    <p class="sec-head__note">Finnið okkur, segið hæ og njótið vínglass umvafin kertaljósum í afslöppuðu andrúmslofti.</p>
  </header>
  <div class="room__mosaic">
    <figure class="room__cell room__cell--wide" data-pour>
      <img src="${P.sofa.src}" alt="${esc(P.sofa.alt)}" width="${P.sofa.w}" height="${P.sofa.h}" loading="lazy" decoding="async" />
      <figcaption class="mono">GRÆNU SÓFARNIR</figcaption>
    </figure>
    <figure class="room__cell" data-pour>
      <img src="${P.barWomen.src}" alt="${esc(P.barWomen.alt)}" width="${P.barWomen.w}" height="${P.barWomen.h}" loading="lazy" decoding="async" />
      <figcaption class="mono">FLÖSKUVEGGURINN</figcaption>
    </figure>
    <figure class="room__cell" data-pour>
      <img src="${P.twoMen.src}" alt="${esc(P.twoMen.alt)}" width="${P.twoMen.w}" height="${P.twoMen.h}" loading="lazy" decoding="async" />
      <figcaption class="mono">STEINSTEYPAN</figcaption>
    </figure>
    <figure class="room__cell" data-pour>
      <img src="${P.laugh.src}" alt="${esc(P.laugh.alt)}" width="${P.laugh.w}" height="${P.laugh.h}" loading="lazy" decoding="async" />
      <figcaption class="mono">Í LAMPALJÓSI</figcaption>
    </figure>
    <figure class="room__cell" data-pour>
      <img src="${P.coupleBw.src}" alt="${esc(P.coupleBw.alt)}" width="${P.coupleBw.w}" height="${P.coupleBw.h}" loading="lazy" decoding="async" />
      <figcaption class="mono">LITLA BORÐIÐ</figcaption>
    </figure>
  </div>
</section>

<!-- ══════════ 7. VÍNSMÖKKUN ══════════ -->
<section class="classics" id="smokkun">
  <header class="sec-head sec-head--mid">
    <p class="kicker mono">06 / VÍNSMÖKKUN</p>
    <h2 class="h2">Sex vín, fjögur vín,<br />eða tvö fyrir tvo</h2>
    <p class="sec-head__note">${esc(D.tasting.intro)}</p>
  </header>
  <div class="classics__grid">
${tastingBlock}
  </div>
  <p class="classics__foot"><a class="btn btn--ghost" href="mailto:${D.biz.email}?subject=V%C3%ADnsm%C3%B6kkun">Bóka vínsmökkun fyrir hóp</a></p>
</section>

<!-- ══════════ 8. HAPPY HOUR + MATUR ══════════ -->
<section class="rent paper" id="happy" aria-labelledby="happy-h">
  <div class="rent__inner">
    <p class="kicker mono">07 / HAPPY HOUR &amp; MATUR</p>
    <h2 class="h2" id="happy-h">Happy hour<br />${esc(D.happy.time)}</h2>
    <div class="rent__cols">
      <p class="lead">Þriðjudaga til sunnudaga, fyrstu tvo tímana. Verðin eru af happy hour-seðlinum okkar.</p>
      <ul class="rent__nums">
        <li><strong>${esc(D.happy.gl)}</strong><span>${esc(D.happy.house).toUpperCase()} · GLAS</span></li>
        <li><strong>${esc(D.happy.fl)}</strong><span>${esc(D.happy.house).toUpperCase()} · FLASKA</span></li>
        <li><strong>${esc(D.happy.beerP)}</strong><span>${esc(D.happy.beer).toUpperCase()}</span></li>
      </ul>
    </div>
    <h3 class="rent__h">Matur</h3>
    <ul class="hh-list">
${foodRows}
    </ul>
    <p class="rent__alt">Vegan útgáfa af platta í boði sé þess óskað. Látið vita af ofnæmi.</p>
  </div>
</section>

<!-- ══════════ 9. MENNING ══════════ -->
<section class="culture" id="menning">
  <header class="sec-head">
    <p class="kicker mono">08 / MENNING</p>
    <h2 class="h2">Sýningar á veggjunum,<br /><em>tónleikar við barinn</em></h2>
    <p class="sec-head__note">Við höldum reglulega sýningar á veggjunum og tónleika við barinn. Hér eru nokkur nöfnin sem hafa komið við.</p>
  </header>
  <div class="culture__grid">
    <figure class="culture__fig" data-pour>
      <img src="${P.exhib.src}" alt="${esc(P.exhib.alt)}" width="${P.exhib.w}" height="${P.exhib.h}" loading="lazy" decoding="async" />
      <figcaption class="mono">${esc(D.culture.captions[0]).toUpperCase()}</figcaption>
    </figure>
    <div class="culture__col">
      <h3 class="culture__h">Sýningar</h3>
      <ul class="culture__list">${D.culture.exhibitions.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
      <p class="culture__call">${esc(D.culture.callExhib)}</p>
    </div>
    <div class="culture__col">
      <h3 class="culture__h">Tónleikar</h3>
      <ul class="culture__list">${D.culture.concerts.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
      <p class="culture__call">${esc(D.culture.callConcert)}</p>
    </div>
    <figure class="culture__fig" data-pour>
      <img src="${P.concert.src}" alt="${esc(P.concert.alt)}" width="${P.concert.w}" height="${P.concert.h}" loading="lazy" decoding="async" />
      <figcaption class="mono">${esc(D.culture.captions[1]).toUpperCase()}</figcaption>
    </figure>
  </div>
  <p class="culture__mail">Sendið möppu eða upptöku á <a href="mailto:${D.biz.email}">${D.biz.email}</a></p>
</section>

<!-- ══════════ 10. ÁFENGISLAUST + visit ══════════ -->
<section class="visit" id="visit">
  <header class="sec-head">
    <p class="kicker mono">09 / HEIMSÓKN</p>
    <h2 class="h2">Veghúsastígur 7-9,<br />frá klukkan fjögur</h2>
  </header>
  <div class="visit__grid">
    <div class="visit__col">
      <h3 class="visit__h">Opnunartími</h3>
      <ul class="hrs">${D.hours.rows.map(r => `<li><span class="hrs__d mono">${esc(r.k).toUpperCase()}</span><span class="hrs__t mono${r.shut ? ' hrs__t--shut' : ''}">${esc(r.v)}</span></li>`).join('')}</ul>
      <p class="visit__blurb">${esc(D.biz.bookingLine)} Hópar og vínsmökkun bókast í tölvupósti.</p>
    </div>
    <div class="visit__col">
      <h3 class="visit__h">Hvar</h3>
      <p class="visit__addr">${esc(D.biz.street)}<br />${esc(D.biz.postal)} ${esc(D.biz.city)}</p>
      <p class="visit__phone"><a href="tel:${D.biz.phoneHref}">${esc(D.biz.phone)}</a></p>
      <a class="btn btn--main" href="${D.biz.booking}" rel="noopener">Bóka borð á Dineout</a>
      <a class="btn btn--ghost" href="mailto:${D.biz.email}">${D.biz.email}</a>
      <a class="btn btn--ghost" href="https://www.instagram.com/${D.biz.instagram}" rel="noopener">@${D.biz.instagram}</a>
    </div>
    <div class="visit__col visit__col--zero">
      <h3 class="visit__h">Áfengislaust</h3>
      <ul class="cellar__list">${zeroRows}</ul>
      <h4 class="cellar__cat">Freyðivín 0%</h4><ul class="cellar__list">${zeroSpark}</ul>
      <h4 class="cellar__cat">Bjór 0%</h4><ul class="cellar__list">${zeroBeer}</ul>
      <h4 class="cellar__cat">Gos</h4><ul class="cellar__list cellar__list--two">${zeroSoft}</ul>
    </div>
  </div>
${fig('night', 'HÚSIÐ AÐ KVÖLDI', 'bleed--port')}
</section>

<!-- ══════════ 11. closer ══════════ -->
<section class="closer">
  <img class="closer__logo" src="assets/img/roundel-white.png" alt="Port 9 winebar" width="600" height="600" />
  <p class="closer__line">${esc(D.biz.tagEn)}.</p>
  <a class="btn btn--main" href="#glasi">Skoða vínseðilinn</a>
</section>

<footer class="foot">
  <p class="mono">${esc(D.biz.street)} &middot; ${esc(D.biz.postal)} ${esc(D.biz.city)} &middot; ${esc(D.biz.phone)}</p>
  <p class="mono"><a href="mailto:${D.biz.email}">${D.biz.email}</a> &middot; ${esc(D.biz.company)}</p>
  <p class="mono foot__note">Hugmyndaútfærsla frá SNDR. Ótengd staðnum. Vín, verð, tímar og myndir skrifuð upp af port9.is 21.8.2026, vínseðillinn af myndunum þrettán á vinseill-síðunni.</p>
</footer>

</main>

<script src="assets/vendor/lenis.min.js" defer></script>
<script src="assets/vendor/gsap.min.js" defer></script>
<script src="assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="app.js" defer></script>
</body>
</html>
`;

writeFileSync(join(ROOT, 'index.html'), html);
console.log(`index.html written - ${nGlass} by the glass, ${D.cocktails.length} cocktails, ${bottleCount} bottles in ${countryCount} countries, ${grapeSet.size} grapes, ${regionSet.size} regions`);
