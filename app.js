/* ═══════════════════════════════════════════════════════════
   KOKTEILBARINN — Klapparstígur 28-30, Reykjavík.
   The Jungle motion engine, carried over intact: Lenis + GSAP
   ScrollTrigger, every reveal transform/opacity or clip-path,
   and CSS hides nothing — every initial state is set here, so
   no-JS and reduced-motion render the complete page.
   ═══════════════════════════════════════════════════════════ */
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE    = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* The whole menu lives in index.html as real markup, generated from
   _build/data.mjs. Keeping it in one place means the page and the ticker can
   never disagree — and it is the functional fix this bar actually needs,
   since their real menu ships as nine photographs of a printed sheet. */

/* ═══════════ TICKER ═════════════════════════════════════ */
(() => {
  const track = $('#tickTrack');
  if (!track) return;
  // read the names straight off the rendered list, so there is only ever
  // one copy of the menu and the ticker can never drift out of sync
  const names = $$('.dish__name').map(el => el.textContent.trim());
  if (!names.length) return;
  // two identical halves so the -50% loop is genuinely seamless
  const half = names.map(n => `<span>${n}<b> ✦ </b></span>`).join('');
  track.innerHTML = half + half;
})();

/* ═══════════ HEADER STATE ═══════════════════════════════
   Deliberately empty. The bar is constant: fixed glass from first paint,
   never hides, never reveals, never resizes. See the mobile chrome standard
   (Reynir 42ff65e) — every bar in this workspace that moved on scroll failed
   on a real device. No scroll listener here on purpose. */

/* ═══════════ MOBILE MENU ════════════════════════════════ */
(() => {
  const burger = $('#burger');
  const menu   = $('#menu');
  if (!burger || !menu) return;

  let open = false;

  function set(state) {
    open = state;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => { if (!open) menu.hidden = true; }, 360);
    }
  }

  burger.addEventListener('click', () => set(!open));

  addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { set(false); burger.focus(); }
  });

  // close, then scroll one frame later so the unlock has landed
  $$('a', menu).forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    e.preventDefault();
    set(false);
    requestAnimationFrame(() => {
      const t = $(id);
      if (!t) return;
      if (window.__lenis) window.__lenis.scrollTo(t, { duration: 1.1 });
      else t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    });
  }));

  addEventListener('resize', () => { if (open && innerWidth > 1080) set(false); });
})();

/* ═══════════ THE HERO PLATE ══════════════════════════════
   Same deliberate deviation as Gilligogg: the hero is the
   bar's OWN photograph — their bartenders, their trophies,
   their mirrored cognac arches — because a generated interior
   would be a fabricated picture of a real business's
   premises. The scroll drives the same `--film-s` push-in
   through the same pinned timeline.
   ═══════════════════════════════════════════════════════════ */
const MOTION  = !REDUCED && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Lenis !== 'undefined';
const DESKTOP = FINE && matchMedia('(min-width: 1081px)').matches;   // the rail's pin: its CSS is two-mode at 1080
// The big moments (pinned hero, scrub, full amplitude) were gated on WIDTH, which
// silenced them in any desktop window narrower than 1081px — a 555px preview
// pane showed the quiet touch path. They are gated on the POINTER now: a fine
// pointer gets them from 761px up, where the hero layout is still the desktop one.
const WIDE = FINE && matchMedia('(min-width: 761px)').matches;
const SCRUB_MODE = MOTION && WIDE;

(() => {
  // A cached image fires no load event, so ask decode() and refresh only once
  // the real intrinsic size is in layout (else the pin's end distance is measured
  // against a zero-height plate). Same load-race the source build hit on its film.
  const im = $('#heroPlate');
  if (!im || !MOTION) return;
  const settle = () => ScrollTrigger.refresh();
  if (im.complete) { (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(settle); }
  else im.addEventListener('load', settle, { once: true });
})();

/* ═══════════ MOTION ENGINE ══════════════════════════════
   Lenis + GSAP ScrollTrigger, wired the proven way:
   lenis drives ScrollTrigger.update, gsap's ticker drives
   lenis, lagSmoothing off. All tweens are transform/opacity
   plus one clip-path device. CSS hides nothing: every
   initial "hidden" state is set here, so no-JS and
   reduced-motion get the complete page for free.
   ═══════════════════════════════════════════════════════════ */
(() => {
  if (!MOTION) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Heavier glide than the default. lerp (not duration) gives a continuous
  // ease that never "arrives", and a damped wheel multiplier stops the jump
  // a notched mouse wheel otherwise produces.
  // TOUCH NEVER GETS LENIS. iOS Safari only collapses its bottom toolbar for a
  // NATIVELY scrolled document; a JS scroll surface keeps the tall opaque bar,
  // leaves a dead strip at the bottom, and freezes overlays. Desktop keeps the
  // glide (lerp, not duration, so the ease never "arrives"); touch scrolls the
  // real document and ScrollTrigger reads it natively — every scrub, pin and
  // reveal below is identical either way.
  const SMOOTH = window.matchMedia('(pointer: fine)').matches
              && !window.matchMedia('(hover: none)').matches;
  let lenis = null;
  if (SMOOTH) {
    lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.85,
      smoothWheel: true,
      smoothTouch: false,
      syncTouch: false
    });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
  }
  gsap.ticker.lagSmoothing(0);

  // Lenis swallows wheel events for the whole document, so ANY nested scroller
  // it does not know about becomes unscrollable — the rail below 1080px is a
  // native horizontal snap list, and without this it simply refuses to move.
  if (lenis) {
    $$('[data-lenis-prevent]').forEach(el => el.setAttribute('data-lenis-prevent', ''));
    const tagScrollers = () => $$('.crew__track, [data-scroller]').forEach(el => {
      if (el.scrollWidth > el.clientWidth + 4 || el.scrollHeight > el.clientHeight + 4) {
        el.setAttribute('data-lenis-prevent', '');
      }
    });
    tagScrollers();
    window.addEventListener('resize', tagScrollers, { passive: true });
  }

  const AMP  = FINE ? 1 : 0.55;            // halve amplitudes on touch, not on narrow desktop windows
  const EASE = 'expo.out';

  /* ── hero entrance: time-based, never scroll-gated ──────
     The wordmark is NOT hidden here. It is already on screen, sitting exactly
     under the gate's identical copy, so the gate can dissolve straight off it.
     All it does is settle from a hair oversized, which is what makes the room
     read as arriving rather than cutting. */
  gsap.set('.hero__h1', { scale: 1.045 });
  gsap.set('.hero__tag', { y: 14, opacity: 0 });
  // A still needs a deeper travel than the film did to read as motion at all —
  // single-digit drift over a pinned 170% reads as "stale", per the ledger.
  gsap.set('.hero__film',  { '--film-s': 1.05 });
  gsap.set('.hero__eyebrow', { y: -14, opacity: 0 });
  gsap.set('#heroBase', { y: 22, opacity: 0 });
  if ($('#heroHint')) gsap.set('#heroHint', { opacity: 0 });

  /* The entrance is held until the opening scene hands over, so it plays
     for the viewer instead of behind a full-screen loader, and so nothing
     re-renders it half-finished on the refresh that follows. */
  const intro = gsap.timeline({ paused: true });
  intro
    .to('.hero__h1',     { scale: 1, duration: 1.6, ease: 'expo.out' }, 0)
    .to('.hero__tag',    { y: 0, opacity: 1, duration: 0.9, ease: EASE }, 0.18)
    .to('.hero__eyebrow', { y: 0, opacity: 1, duration: 0.7, ease: EASE }, 0.24)
    .to('#heroBase',  { y: 0, opacity: 1, duration: 0.8, ease: EASE }, 0.42)
;
  if ($('#heroHint')) intro.to('#heroHint', { opacity: 1, duration: 0.6, ease: 'none' }, 0.75);
  window.__heroIntro = intro;
  // no gate on this visit (repeat visitor, reduced motion, no JS gate) -> go now
  if (!$('#gate')) intro.play();

  /* ── the signature: pinned hero, scroll pushes into the room ── */
  if (SCRUB_MODE) {
    /* The entrance and this scrub must never touch the SAME PROPERTY on the
       same element. The handover has to refresh before releasing the entrance
       (so the pin measures right), which means any property they share gets
       the entrance's START state recorded as its resting value — the wordmark
       came back from a scroll stuck at scale 1.045. gsap records start values
       per property, so splitting them is enough: the entrance owns the h1's
       SCALE, the scrub owns the h1's OPACITY and the mark's own scale.
       (invalidateOnRefresh is NOT the fix here: it makes gsap re-read
       --film-s, which is an unregistered custom property, as 0.) */
    gsap.timeline({
      scrollTrigger: {
        trigger: '#heropin', start: 'top top', end: '+=170%',
        /* refreshPriority DESCENDS in document order. The hero pin inserts 1530px
           of spacer; anything below it that refreshes FIRST measures a document
           that does not have that spacer yet. The rail pin did exactly that and
           its start landed 1530px early, so it engaged while the paper sheet was
           still on screen and drew straight over it. Hero 2 > rail pin 1 > rail
           travel 0 is the only order in which every start is measured on the
           final layout. */
        pin: true, scrub: 0.55, refreshPriority: 2
      }
    })
      /* fromTo, not to: every tween below shares an element with the entrance,
         and a bare `to` reverses to whatever value happened to be recorded when
         the handover refreshed — which is the entrance's START, not its rest.
         #heroBase came back stuck at opacity 0 that way. Stating the rest value
         explicitly makes reversal independent of when the start was captured. */
      // scrolling walks INTO the room: the mark grows past you and clears
      .fromTo('#heroMark', { scale: 1 },            { scale: 1.34, ease: 'none', duration: 0.78, immediateRender: false }, 0.04)
      .fromTo('.hero__h1', { opacity: 1 },          { opacity: 0, ease: 'none', duration: 0.62, immediateRender: false }, 0.12)
      .fromTo('#heroBase', { y: 0, opacity: 1 },    { y: 40, opacity: 0, ease: 'none', duration: 0.45, immediateRender: false }, 0)
      .to('.hero__film', { '--film-s': 1.30, ease: 'none', duration: 1 }, 0)
      .to('.hero__veil', { opacity: 0.62, ease: 'none', duration: 0.3 }, 0.7);
  } else {
    // no pin on touch: a gentle settle of the film instead
    gsap.to('.hero__film', {
      '--film-s': 1.22, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ── split headings: word masks, aria-safe ────────────── */
  function split(el) {
    // innerText keeps the <br> as a break so words don't fuse across lines
    const label = (el.innerText || el.textContent).replace(/\s+/g, ' ').trim();
    el.setAttribute('aria-label', label);
    const shell = document.createElement('span');
    shell.setAttribute('aria-hidden', 'true');
    while (el.firstChild) shell.appendChild(el.firstChild);
    el.appendChild(shell);
    (function wrap(node) {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span'); w.className = 'jw';
            const i = document.createElement('span'); i.className = 'jwi';
            i.textContent = part; w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') wrap(n);
      });
    })(shell);
    return el.querySelectorAll('.jwi');
  }

  $$('h2.h2:not([data-nosplit])').forEach(el => {
    const words = split(el);
    gsap.set(words, { yPercent: 118, rotate: 5, transformOrigin: '0% 100%' });
    gsap.to(words, {
      yPercent: 0, rotate: 0, duration: 1.15, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  /* ── THE CREW: vertical scroll drives the rail sideways ─
     One tween + one pinned ScrollTrigger. Inner reveals ride
     containerAnimation with LEFT-based starts, because viewport
     triggers never fire for content that travels horizontally. */
  const track = $('#crewTrack'), crewPin = $('#crewPin');
  if (track && crewPin && DESKTOP) {
    const travel = () => Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft));
    const rail = gsap.to(track, { x: () => -travel(), ease: 'none' });
    const cards = $$('.crew__card', track);
    const count = $('#crewCount');

    /* Two triggers, not one, and both aimed at the PINNED element.
       Aimed at '.crew' the pin inherited the 304px offset between the section's
       top and the pin's own top, so the block hung 304px down a 900px viewport
       and the rail's bottom sat 232px below the fold. Triggering crewPin itself
       puts it at top:0, whole.
       Pace: 1311px of scroll across 7 cards was 187px per 340px card, faster
       than a label can be read. HOLD keeps the block still while the heading is
       read, then the rail travels over 2.2x its own width. */
    /* ONE ScrollTrigger, not two. The card reveals below ride
       `containerAnimation: rail`, and GSAP maps their left-based starts through
       the rail tween's OWN ScrollTrigger. Driving the pin from a second trigger
       orphaned that mapping and every card stayed at opacity 0.
       The reading pause is therefore layout, not scroll maths: an empty lead
       cell at the head of the track means the first thing that travels off is
       blank space, so the heading is read before any label leaves. */
    const lead = document.createElement('li');
    lead.className = 'crew__lead';
    lead.setAttribute('aria-hidden', 'true');
    track.insertBefore(lead, track.firstElementChild);

    ScrollTrigger.create({
      /* 0.4, not 0.7: Lenis already smooths the scroll, and a heavy scrub on top of
       it double-lags the rail so it floats behind the wheel rather than tracking it */
      animation: rail, trigger: crewPin, pin: crewPin, scrub: 0.4,
      start: 'top top', end: () => '+=' + Math.round(travel() * 2.2),
      invalidateOnRefresh: true, refreshPriority: 1,
      onUpdate(self) {
        if (!count) return;
        const i = Math.min(cards.length - 1, Math.floor(self.progress * cards.length));
        const y = cards[i] && cards[i].dataset.year;
        if (y && count.textContent !== y) count.textContent = y;
      }
    });

    gsap.set(cards, { y: 46, opacity: 0 });
    cards.forEach(c => {
      gsap.to(c, {
        y: 0, opacity: 1, duration: 0.8, ease: EASE,
        scrollTrigger: { trigger: c, containerAnimation: rail, start: 'left 92%', once: true }
      });
      // the station's pour rides the same left-based trigger
      const bands = $$('.gl__band', c);
      if (bands.length) {
        gsap.set(bands, { y: 108 });
        gsap.to(bands, {
          y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: c, containerAnimation: rail, start: 'left 88%', once: true }
        });
      }
    });
  } else if (track) {
    gsap.set($$('.crew__card', track), { opacity: 1, y: 0 });
  }

  /* ── image pours: clip wipe up + settle; big frames drift ─ */
  const PARALLAX = new Set(['bleed', 'visit__shot', 'room__cell--wide']);
  $$('[data-pour]').forEach(fig => {
    const img = $('img', fig);
    if (!img) return;
    const drifts = [...fig.classList].some(c => PARALLAX.has(c));

    // a hard wipe from the bottom with the photo arriving oversized and
    // skewed, settling square. Much bigger travel than a polite fade.
    gsap.set(img, { clipPath: 'inset(100% 0 0 0)', scale: drifts ? 1.34 : 1.28, skewY: 3.5 });
    gsap.to(img, {
      clipPath: 'inset(0% 0 0 0)', scale: drifts ? 1.22 : 1, skewY: 0,
      duration: 1.5, ease: 'expo.out',
      scrollTrigger: { trigger: fig, start: 'top 92%', once: true }
    });
    if (drifts) {
      // constant over-scale keeps the frame covered while the image drifts
      gsap.fromTo(img, { yPercent: -14 * AMP }, {
        yPercent: 14 * AMP, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: 0.4 }
      });
    }
    // and the FRAME itself widens open as it arrives
    gsap.fromTo(fig, { scaleX: 0.86, scaleY: 0.94 }, {
      scaleX: 1, scaleY: 1, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: fig, start: 'top 92%', once: true }
    });
  });

  /* ── quiet content rises, triggered once ──────────────── */
  const rises = $$('.kicker, .sec-head__note, .lead, .quote, .thesis__gloss, .facts li, .facts li, .method, .cw, .visit__col, .rent__sub, .sheet__note, .crew__note');
  gsap.set(rises, { y: 54, opacity: 0, filter: 'blur(6px)' });
  rises.forEach(el => {
    gsap.to(el, {
      y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.05, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true }
    });
  });
  // failsafe: only what is ALREADY on screen may force-show (never the page)
  setTimeout(() => {
    rises.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && +gsap.getProperty(el, 'opacity') < 1)
        gsap.to(el, { y: 0, opacity: 1, duration: 0.5, ease: EASE });
    });
  }, 1700);

  /* ── each paper sheet lifts into place, dome first ────── */
  $$('.paper').forEach(sec => {
    gsap.fromTo(sec, { yPercent: 6 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 55%', scrub: 0.6 }
    });
  });

  /* ── acid band unrolls over the page ──────────────────── */
  gsap.fromTo('.rent', { clipPath: 'inset(0 0 86% 0)' }, {
    clipPath: 'inset(0 0 0% 0)', ease: 'none',
    scrollTrigger: { trigger: '.rent', start: 'top 88%', end: 'top 32%', scrub: 0.5 }
  });

  /* ── closer breathes in ───────────────────────────────── */
  gsap.fromTo('.closer__logo', { scale: 0.9, opacity: 0.2 }, {
    scale: 1, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '.closer', start: 'top 92%', end: 'top 38%', scrub: 0.5 }
  });

  /* ── the menu pours itself: each glass fills band by band ─ */
  $$('.dish').forEach(dish => {
    const bands = $$('.gl__band', dish);
    if (!bands.length) return;
    gsap.set(bands, { y: 108 });        // parked below the glass silhouette
    gsap.to(bands, {
      y: 0, duration: 1.05, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: dish, start: 'top 88%', once: true }
    });
    // hovering an ingredient dims every other band in that glass
    $$('.dish__spec li', dish).forEach(li => {
      const i = li.dataset.ing;
      li.addEventListener('pointerenter', () => bands.forEach(b => {
        if (b.dataset.band !== i) b.setAttribute('data-dim', '');
      }));
      li.addEventListener('pointerleave', () => bands.forEach(b => b.removeAttribute('data-dim')));
    });
  });

  /* ── ticker leans with scroll velocity ────────────────── */
  const skewEl = $('#tickSkew');
  const skewTo = skewEl ? gsap.quickTo(skewEl, 'skewX', { duration: 0.45, ease: 'power2.out' }) : () => {};
  if (lenis) {
    lenis.on('scroll', e => skewTo(gsap.utils.clamp(-6, 6, e.velocity * 0.32)));
  } else {
    // native scroll: derive velocity per frame instead of reading Lenis
    let last = window.scrollY, vel = 0;
    gsap.ticker.add(() => {
      const y = window.scrollY; vel = y - last; last = y;
      skewTo(gsap.utils.clamp(-6, 6, vel * 0.32));
    });
  }

  /* ── settle triggers after fonts + layout are real ────── */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();

/* ═══════════ OPENING SCENE ══════════════════════════════
   The viewport is an empty glass. A live wobbling liquid surface
   rises behind their wordmark while a counter runs to 100, then
   the whole level drains away through an arch. Runs once per
   session, is skippable, and never blocks: if anything at all
   goes wrong the gate removes itself on a hard timeout.
   ═══════════════════════════════════════════════════════════ */
(() => {
  const gate = $('#gate');
  if (!gate) return;

  const seen = (() => { try { return sessionStorage.getItem('p9-gate') === '1'; } catch { return false; } })();

  /* Handover is split from teardown so the hero can start settling WHILE the
     gate is still dissolving. That overlap is the whole effect: the room fades
     up behind a wordmark that is already easing into place, instead of the
     page cutting to a new screen. Idempotent — skip and the failsafe both
     route through it. */
  let handed = false;
  const handover = () => {
    if (handed) return;
    handed = true;
    document.body.classList.remove('gate-on');
    if (window.__lenis) window.__lenis.start();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    // refresh first, THEN release the entrance, so the scrub records the
    // hero's true resting values and never a mid-entrance frame
    if (window.__heroIntro) window.__heroIntro.play(0);
  };
  const kill = () => { handover(); gate.remove(); };

  if (seen || REDUCED || typeof gsap === 'undefined') { kill(); return; }

  document.body.classList.add('gate-on');
  try { sessionStorage.setItem('p9-gate', '1'); } catch {}

  const wave  = $('#gateWave');
  const count = $('#gateCount');
  const line  = $('#gateLine');
  const state = { level: 0, phase: 0 };
  let done = false;

  // one path rebuilt per frame: two crests riding on a rising level
  function draw() {
    const y = 1000 - state.level * 1000;
    const a = 26 * (1 - state.level * 0.55);      // crest calms as the glass fills
    const p = state.phase;
    const c = (i) => (y + Math.sin(p + i) * a).toFixed(1);
    wave.setAttribute('d',
      `M0,${c(0)} C200,${c(1.1)} 400,${c(2.3)} 600,${c(3.1)} S1000,${c(4.4)} 1200,${c(5.2)} L1200,1000 L0,1000 Z`);
  }
  const ticker = () => { state.phase += 0.055; draw(); };
  gsap.ticker.add(ticker);

  const tl = gsap.timeline({
    onComplete: () => { if (!done) { done = true; gsap.ticker.remove(ticker); kill(); } }
  });
  tl.to(state, {
      level: 1, duration: 2.5, ease: 'power1.inOut',
      onUpdate: () => { count.textContent = String(Math.round(state.level * 100)).padStart(2, '0'); }
    })
    .to(line, { opacity: 0, duration: 0.3, ease: 'none' }, '-=0.5')
    .set(line, { textContent: 'SKÁL' })
    .to(line, { opacity: 1, duration: 0.35, ease: 'none' })
    // the classic exit: the whole level drains away up through the arch
    .to(gate, {
      clipPath: 'inset(0% 0 100% 0)', duration: 1.0, ease: 'expo.inOut',
      onStart: handover
    }, '+=0.1')
    .to(['.gate__logo', '.gate__count', '#gateSkip', '.gate__line'],
      { opacity: 0, duration: 0.4, ease: 'none' }, '<');

  $('#gateSkip')?.addEventListener('click', () => {
    if (done) return;
    done = true; tl.kill(); gsap.ticker.remove(ticker); kill();
  });

  // hard failsafe: the gate can never trap anyone
  setTimeout(() => { if (!done) { done = true; try { tl.kill(); gsap.ticker.remove(ticker); } catch {} kill(); } }, 7000);
})();


/* ═══════════ SMOOTH IN-PAGE LINKS ═══════════════════════ */
$$('a[href^="#"]').forEach(a => {
  if (a.closest('#menu')) return;   // the overlay handles its own
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(t, { duration: 1.25 });
    else t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  });
});
