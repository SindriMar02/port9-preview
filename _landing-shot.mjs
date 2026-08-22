/* landing shot for the outreach draft — LIVE url, gated on a settled page.
   Every build here opens with a reveal; firing early yields a black field with
   an outlined wordmark. So: skip the gate, wait for the hero to actually be
   painted, ASSERT it, and exit non-zero rather than write a bad frame. */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const URL = process.argv[2] || 'https://sindrimar02.github.io/port9-preview/';
const OUT = process.argv[3] || `${process.env.HOME}/Downloads/frumgerd-port9.jpg`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PORT = 9300 + Math.floor(Math.random() * 90);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  [`--remote-debugging-port=${PORT}`,'--headless=new','--use-gl=swiftshader','--enable-unsafe-swiftshader',
   '--no-first-run',`--user-data-dir=/tmp/p9shot-${PORT}`,'--hide-scrollbars','about:blank'], { stdio:'ignore' });
let ws, id = 0; const pend = new Map();
const send = (m,p={}) => new Promise(res => { const i=++id; pend.set(i,{res}); ws.send(JSON.stringify({id:i,method:m,params:p})) });
const ev = async e => (await send('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true})).result?.value;
let code = 0;
try {
  let tab; for (let i=0;i<60;i++){ try { tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`,{method:'PUT'})).json(); break } catch { await sleep(250) } }
  ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise(r => { ws.onopen = r });
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id).res(m.result); pend.delete(m.id) } });
  await send('Page.enable'); await send('Runtime.enable');
    // deviceScaleFactor 1, deliberately. At 2 the software rasteriser has to
  // build a 2880x1800 frame of a page carrying a pinned rail and 37 live SVG
  // glasses, and Page.captureScreenshot never returns (measured: 279ms at 1,
  // hard timeout at 2, with and without a clip). 1440x900 is what Mail shows.
  await send('Emulation.setDeviceMetricsOverride',{ width:1440, height:900, deviceScaleFactor:1, mobile:false });
  await send('Page.navigate',{ url:URL + '?cb=' + Date.now() });
  await sleep(3500);
  await ev(`document.querySelector('#gateSkip')?.click()`);
  await sleep(2500);                        // let the hero entrance finish
  const state = JSON.parse(await ev(`(() => {
    const gate = document.querySelector('#gate');
    const mark = document.querySelector('.hero__mark');
    const img  = document.querySelector('.hero__film, .hero img, .hero__media img');
    return JSON.stringify({
      gateGone: !gate,
      markOpacity: mark ? +getComputedStyle(mark).opacity : -1,
      markW: mark ? Math.round(mark.getBoundingClientRect().width) : 0,
      imgComplete: img ? (img.complete !== false) : 'no-img',
      bodyText: document.body.innerText.trim().length
    });
  })()`));
  console.log('state', JSON.stringify(state));
  const bad = [];
  if (!state.gateGone) bad.push('opening gate still up');
  if (!(state.markOpacity > 0.9)) bad.push(`hero wordmark opacity ${state.markOpacity}`);
  if (!(state.markW > 100)) bad.push('hero wordmark not laid out');
  if (!(state.bodyText > 400)) bad.push(`body text only ${state.bodyText} chars`);
  if (bad.length) { console.error('REFUSING to write a bad frame:', bad.join('; ')); code = 1; }
  else {
    // force a full paint pass before capturing: an unpainted lazy hero can
    // stall captureScreenshot indefinitely on a long document
    await ev('window.scrollTo(0,0)'); await sleep(800);
    const shot = await send('Page.captureScreenshot',{ format:'png' });
    writeFileSync('/tmp/p9-landing.png', Buffer.from(shot.data,'base64'));
    execFileSync('/usr/bin/sips', ['-s','format','jpeg','-s','formatOptions','88','/tmp/p9-landing.png','--out',OUT], { stdio:'ignore' });
    console.log('wrote', OUT);
  }
} finally { try{ws?.close()}catch{}; chrome.kill(); process.exitCode = code; }
