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
   The bar still never hides, never reveals, never resizes and never moves —
   the mobile chrome standard is about geometry, and none of it changes here.
   The ONLY thing that changes is the ground behind it: nothing over the film,
   the glass once the hero is leaving, cross-faded in CSS.

   An IntersectionObserver on a cue inside the hero, not a scroll listener:
   it fires twice per pass instead of on every frame, it is identical under
   Lenis and native scroll, and it works with GSAP absent or motion reduced —
   which matters, because an illegible header is not a motion nicety.
   Transparent over a photograph needs its own scrim; that lives on .hdr::before
   so it travels with the fixed bar instead of scrolling away with the hero. */
(() => {
  const hdr = $('#hdr'), cue = $('#hdrCue');
  if (!hdr) return;
  if (!cue) { hdr.classList.add('is-ground'); return; }   // no hero on the page
  new IntersectionObserver(([e]) => {
    // above the viewport top => the film is behind us => the bar takes its ground
    hdr.classList.toggle('is-ground', e.boundingClientRect.top < 0);
  }, { threshold: 0 }).observe(cue);
})();

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
    /* Overflowing is NOT the same as scrollable. The rail is a max-content flex
       row, so scrollWidth > clientWidth is true at EVERY width — but on desktop
       it has no overflow at all: GSAP transforms it and the pin drives it. The
       old test tagged it anyway, which told Lenis to ignore the wheel over the
       whole rail. Since the pinned rail fills the viewport, scrolling with the
       pointer anywhere over the cards stalled and then jumped. Only a box that
       actually scrolls itself may opt out. */
    const scrolls = el => {
      const c = getComputedStyle(el);
      return (/(auto|scroll)/.test(c.overflowX) && el.scrollWidth  > el.clientWidth  + 4) ||
             (/(auto|scroll)/.test(c.overflowY) && el.scrollHeight > el.clientHeight + 4);
    };
    const tagScrollers = () => $$('.crew__track, [data-scroller], [data-lenis-prevent]').forEach(el => {
      if (scrolls(el)) el.setAttribute('data-lenis-prevent', '');
      else el.removeAttribute('data-lenis-prevent');
    });
    tagScrollers();
    ScrollTrigger.addEventListener('refresh', tagScrollers);
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
  /* The stack's rest scale is CSS (--film-s), which is what no-JS and reduced
     motion get. gsap animates the TRANSFORM directly instead of the variable:
     an unregistered custom property cannot be read back (gsap reads 0 and the
     stack collapsed to half size mid-scroll the first time this was written),
     and every write to it costs a style recalc of everything that reads it. */
  gsap.set('.hero__stack', { scale: 1.04 });
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

  /* ── the landing film: a sequence, and a scroll that just leaves ──
     The pinned push-in is deliberately gone. It held the page still for 170%
     of a viewport, zoomed the wordmark past the reader and faded the whole
     hero out before the next section could arrive — a long, showy hold that
     Sindri read as the page refusing to scroll. What replaces it is ordinary
     scrolling with the hero LEAVING gracefully: content drifts up a little
     slower than the page and softens as it goes, tied to scroll position (not
     a duration), so it is wherever the reader put it and reverses cleanly.
     No pin means no 1530px spacer, so nothing below has to be measured around
     one and the refreshPriority juggling goes with it. */
  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4 }
  })
    /* fromTo with an explicit rest value: these elements are also touched by
       the entrance, and a bare `to` reverses to whatever was recorded when the
       entrance was mid-flight. */
    .fromTo('.hero__content', { yPercent: 0, opacity: 1 },
                              { yPercent: -14, opacity: 0, ease: 'none', duration: 1, immediateRender: false }, 0)
    .fromTo('.hero__stack', { scale: 1.04 }, { scale: 1.15, ease: 'none', duration: 1, immediateRender: false }, 0);

  /* The film itself is four frames of the room, crossfaded on a slow cadence.
     Only one is in the DOM's flow of attention: the rest carry empty alts.
     It pauses whenever the tab is hidden or the hero is off screen, so a
     backgrounded page is not decoding photographs for nobody. */
  (() => {
    const frames = $$('.hero__film');
    if (frames.length < 2) return;
    let at = 0, timer = 0, onScreen = true;
    const HOLD = 5200, FADE = 1.6;
    const step = () => {
      const next = (at + 1) % frames.length;
      gsap.to(frames[next], { opacity: 1, duration: FADE, ease: 'sine.inOut' });
      gsap.to(frames[at],   { opacity: 0, duration: FADE, ease: 'sine.inOut' });
      frames[at].classList.remove('is-live'); frames[next].classList.add('is-live');
      at = next;
    };
    const run  = () => { stop(); if (onScreen && !document.hidden) timer = setInterval(step, HOLD); };
    const stop = () => { if (timer) { clearInterval(timer); timer = 0; } };
    document.addEventListener('visibilitychange', run);
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; run(); }).observe($('.hero'));
    run();
  })();

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

  /* ── THE RAIL: a real scroller, not a hostage ───────────
     It used to be pinned: the section froze and vertical scroll was remapped
     onto horizontal travel, so the only way through was to keep scrolling down
     and the rail could not be touched directly. It is a native overflow
     scroller now — drag it, trackpad-swipe it, tab through it, flick it on a
     phone — and the page underneath keeps scrolling like a page. The reveals
     therefore observe the TRACK as their root, because a viewport-rooted
     trigger never fires for a card that only ever moves sideways. */
  const track = $('#crewTrack');
  if (track) {
    const cards = $$('.crew__card', track);
    gsap.set(cards, { y: 34, opacity: 0 });
    const show = c => gsap.to(c, { y: 0, opacity: 1, duration: 0.7, ease: EASE, overwrite: 'auto' });
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { root: track, threshold: 0.12 });
    cards.forEach(c => io.observe(c));
    // safety net: if the rail is never scrolled, nothing below the fold of it
    // should stay invisible once the section itself has been read past
    ScrollTrigger.create({
      trigger: '.crew', start: 'bottom 60%',
      onEnter: () => { cards.forEach(show); io.disconnect(); }
    });

    // drag-to-pan on a pointer device; native touch scrolling is left alone
    if (FINE) {
      let down = false, x0 = 0, l0 = 0, id = null;
      const end = () => {
        if (!down) return;
        down = false; track.classList.remove('is-drag');
        if (id !== null && track.hasPointerCapture(id)) track.releasePointerCapture(id);
        id = null;
      };
      track.addEventListener('pointerdown', e => {
        if (e.target.closest('a,button')) return;
        down = true; x0 = e.clientX; l0 = track.scrollLeft; id = e.pointerId;
        // capture, or a drag that leaves the rail stops moving mid-gesture
        track.setPointerCapture(id);
        track.classList.add('is-drag');
      });
      track.addEventListener('pointermove', e => {
        if (!down) return;
        e.preventDefault();
        track.scrollLeft = l0 - (e.clientX - x0);
      });
      track.addEventListener('pointerup', end);
      track.addEventListener('pointercancel', end);
    }

    /* The progress mark: written on the element that reads it (a variable set
       on the parent recalculates the whole subtree), and coalesced to one
       write per frame rather than one per scroll event. */
    const mark = $('#crewBar span');
    if (mark) {
      let queued = false;
      const paint = () => {
        queued = false;
        const max = track.scrollWidth - track.clientWidth;
        mark.style.setProperty('--p', max > 0 ? (track.scrollLeft / max).toFixed(4) : '0');
      };
      const sync = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
      track.addEventListener('scroll', sync, { passive: true });
      addEventListener('resize', sync); paint();
    }
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
