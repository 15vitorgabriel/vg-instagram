// Reel animado a partir das lâminas de um post (campo "reel": true). Chamado pelo render.mjs.
//
// Vídeo: uma página HTML com todas as cenas e animações CSS na mesma linha do tempo. O Chrome headless é
// controlado pelo protocolo DevTools (WebSocket nativo do Node 22): a cada quadro todas as animações são
// pausadas no instante exato e a tela é capturada, então o resultado é idêntico em qualquer máquina.
// Áudio: trilha eletrônica sintetizada aqui mesmo (bumbo, chimbal, baixo, pad, arpejo e "whoosh" em cada
// transição). Nada de música de terceiros, sem risco de direito autoral.
import { writeFileSync, readFileSync, rmSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const W = 1080, H = 1920, FPS = 30;
const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const plain = (s = "") => s.replace(/\[\[|\]\]/g, "");
const words = (s = "") => plain(s).split(/\s+/).filter(Boolean).length;

// Texto com cada palavra num <span class="w"> (entra uma a uma) e [[destaque]] como <mark> (pinta depois)
function animText(s, t0, step = 0.075) {
  let i = 0, html = "", markAt = null;
  for (const part of esc(s).split(/(\[\[.+?\]\])/)) {
    if (!part) continue;
    const isMark = part.startsWith("[[");
    const ws = (isMark ? part.slice(2, -2) : part).split(/(\s+|\n)/);
    let chunk = "";
    for (const w of ws) {
      if (w === "\n") { chunk += "<br>"; continue; }
      if (/^\s+$/.test(w) || !w) { chunk += w ? " " : ""; continue; }
      chunk += `<span class="w" style="animation-delay:${(t0 + i++ * step).toFixed(3)}s">${w}</span>`;
    }
    if (isMark) { markAt ??= t0 + i * step + 0.15; html += `<mark style="--d:${markAt.toFixed(3)}s">${chunk}</mark>`; }
    else html += chunk;
  }
  return { html, end: t0 + i * step + 0.5, markEnd: markAt ? markAt + 0.5 : 0 };
}

const fit = (s, sizes) => { const n = plain(s).length; return sizes.find(([max]) => n <= max)?.[1] ?? sizes.at(-1)[1]; };

// Duração de cada cena: tempo de leitura, com folga para a animação de entrada
function timeline(slides, minDur = []) {
  const dur = slides.map((s, i) => Math.max(minDur[i] ?? 0, Math.min(7, Math.max(3.2, 1.8 + words([s.title, s.sub, s.body].filter(Boolean).join(" ")) / 3))));
  dur[dur.length - 1] += 1.5; // CTA fica mais um pouco
  const start = [];
  dur.reduce((t, d, i) => (start[i] = t, t + d), 0);
  return { dur, start, total: dur.reduce((a, b) => a + b, 0) };
}

function scene(s, i, t, d, last, total) {
  const T = (x) => (t + x).toFixed(3);
  const enter = `animation: in .01s linear ${T(0)}s both${last ? "" : `, out .4s cubic-bezier(.6,0,.8,.4) ${(t + d - 0.4).toFixed(3)}s both`};`;
  let inner = "";
  if (s.t === "point") {
    const ti = animText(s.title, t + 0.45);
    inner = `
      <div class="num" style="animation-delay:${T(0.05)}s">${esc(s.n)}</div>
      <div class="rule" style="animation-delay:${T(0.3)}s"></div>
      <h2 style="font-size:${fit(s.title, [[22, 96], [40, 82], [999, 70]])}px">${ti.html}</h2>
      ${s.body ? `<p class="body" style="animation-delay:${(ti.end - 0.1).toFixed(3)}s">${esc(plain(s.body))}</p>` : ""}`;
  } else if (s.t === "cta") {
    const ti = animText(s.title, t + 0.55, 0.09);
    inner = `
      <div class="wipe" style="animation-delay:${T(0)}s"></div>
      <h1 style="font-size:${fit(s.title, [[40, 132], [70, 112], [999, 96]])}px">${ti.html}</h1>
      <div class="btn" style="animation-delay:${(ti.end).toFixed(3)}s, ${(ti.end + 0.6).toFixed(3)}s">
        <svg viewBox="0 0 24 24" width="46" height="46"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.6-.5-1-1.1-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5.3-.5v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1 1.9-.8 2.9.3 1.2.9 2.3 1.7 3.2 1.4 1.7 3.2 2.9 5.3 3.4.7.2 1.5.2 2.2 0 .6-.2 1.2-.6 1.5-1.2.2-.4.2-.9.1-1.3l-.4-.3z"/></svg>
        <span>${esc(plain(s.sub ?? "Orçamento pelo WhatsApp")).split("\n")[0]}</span>
      </div>
      <p class="hint" style="animation-delay:${(ti.end + 0.35).toFixed(3)}s">O link está na bio</p>`;
  } else {
    // cover, statement e qualquer outro: título grande + linha de apoio
    const ti = animText(s.title, t + 0.12, s.t === "cover" ? 0.08 : 0.09);
    const big = s.t === "cover" ? [[24, 150], [40, 132], [64, 112], [999, 96]] : [[40, 136], [70, 114], [110, 96], [999, 82]];
    inner = `
      ${s.t === "cover" ? `<div class="kicker" style="animation-delay:${T(0)}s">VG Tecnologia</div>` : ""}
      <h1 style="font-size:${fit(s.title, big)}px">${ti.html}</h1>
      ${s.sub ? `<p class="sub" style="animation-delay:${(Math.max(ti.end, ti.markEnd) - 0.1).toFixed(3)}s">${esc(plain(s.sub)).replace(/\n/g, "<br>")}</p>` : ""}`;
  }
  return `<section class="scene ${s.t}" style="${enter}">${inner}</section>`;
}

function page(post, tl) {
  const n = post.slides.length;
  const segs = tl.dur.map((d, i) => `<i><b style="animation-delay:${tl.start[i].toFixed(3)}s;animation-duration:${d.toFixed(3)}s"></b></i>`).join("");
  const ctaStart = tl.start[n - 1];
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face { font-family: "Inter Tight"; font-weight: 100 900; src: url("../../fonts/inter-tight-latin-wght-normal.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: "Inter Tight"; font-weight: 100 900; src: url("../../fonts/inter-tight-latin-ext-wght-normal.woff2") format("woff2");
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
:root { --bg: #141414; --ink: #f0f0f0; --soft: #a8a8a8; --y: #ffcc00; --on-y: #121212; --ease: cubic-bezier(.16,1,.3,1); }
* { margin: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: var(--bg); }
body { color: var(--ink); font-family: "Inter Tight", sans-serif; -webkit-font-smoothing: antialiased; position: relative; }

/* Fundo vivo: grade que desliza, brilho amarelo que passeia, granulação */
.grid { position: absolute; inset: -200px; background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
  background-size: 120px 120px; animation: drift ${tl.total.toFixed(2)}s linear 0s both;
  -webkit-mask-image: radial-gradient(ellipse 70% 55% at 50% 45%, #000 20%, transparent 75%); }
@keyframes drift { from { transform: translate(0,0) } to { transform: translate(-120px, -${Math.round(tl.total * 18)}px) } }
.grain { position: absolute; inset: 0; opacity: .06; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`)}"); }

/* Barra de progresso no estilo stories: mostra que tem mais coisa vindo e segura até o fim */
.bar { position: absolute; left: 84px; right: 84px; top: 232px; display: flex; gap: 10px; z-index: 5; }
.bar i { flex: 1; height: 7px; border-radius: 4px; background: rgba(255,255,255,.16); overflow: hidden; }
.bar b { display: block; height: 100%; background: var(--y); transform-origin: left; animation-name: fill; animation-timing-function: linear; animation-fill-mode: both; }
@keyframes fill { from { transform: scaleX(0) } to { transform: scaleX(1) } }
.bar.dark { animation: bardark .3s ease ${(ctaStart + 0.35).toFixed(3)}s both; }
@keyframes bardark { to { filter: brightness(0) } }

footer { position: absolute; left: 84px; right: 150px; bottom: 330px; display: flex; justify-content: space-between; align-items: center;
  font-size: 27px; font-weight: 600; color: var(--soft); z-index: 5; animation: footdark .3s ease ${(ctaStart + 0.35).toFixed(3)}s both; }
footer .brand { display: flex; align-items: center; gap: 16px; color: var(--ink); }
footer img { width: 48px; height: 48px; object-fit: contain; }
@keyframes footdark { to { color: #3d3300 } }
footer .brand { animation: branddark .3s ease ${(ctaStart + 0.35).toFixed(3)}s both; }
@keyframes branddark { to { color: var(--on-y) } }
footer img { animation: logodark .3s ease ${(ctaStart + 0.35).toFixed(3)}s both; }
@keyframes logodark { to { filter: brightness(0) } }

.scene { position: absolute; inset: 0; z-index: 1; isolation: isolate; padding: 330px 150px 470px 84px; display: flex; flex-direction: column; justify-content: center; }
@keyframes in { from { visibility: hidden } to { visibility: visible } }
@keyframes out { to { opacity: 0; transform: translateY(-70px) scale(.98); filter: blur(6px) } }

h1, h2 { font-weight: 800; letter-spacing: -0.035em; line-height: 1.17; text-wrap: balance; position: relative; }
.w { display: inline-block; animation: word .7s var(--ease) both; }
@keyframes word { from { opacity: 0; transform: translateY(60px) rotate(2deg); filter: blur(10px) } to { opacity: 1; transform: none; filter: blur(0) } }
mark { color: inherit; background: linear-gradient(var(--y), var(--y)) no-repeat 0 100% / 0% calc(100% - .12em);
  padding: 0 .1em; margin: 0 .03em; border-radius: .06em; box-decoration-break: clone; -webkit-box-decoration-break: clone;
  animation: paint .5s cubic-bezier(.65,0,.35,1) var(--d) both; }
@keyframes paint { to { background-size: 100% calc(100% - .12em); color: var(--on-y) } }
.kicker { font-size: 30px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--y); margin-bottom: 44px;
  animation: rise .6s var(--ease) both; }
.sub { font-size: 42px; line-height: 1.3; color: var(--soft); font-weight: 450; max-width: 22ch; margin-top: 44px; animation: rise .7s var(--ease) both; }
@keyframes rise { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: none } }

.point .num { font-size: 330px; font-weight: 900; letter-spacing: -0.05em; line-height: .8; color: var(--y); transform-origin: left bottom;
  animation: pop .8s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes pop { from { opacity: 0; transform: scale(.3) rotate(-8deg) } to { opacity: 1; transform: none } }
.point .rule { height: 8px; width: 160px; background: var(--y); border-radius: 4px; margin: 46px 0 48px; transform-origin: left; animation: grow .6s var(--ease) both; }
@keyframes grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
.point .body { font-size: 44px; line-height: 1.34; color: #cfcfcf; font-weight: 430; margin-top: 40px; max-width: 26ch; animation: rise .7s var(--ease) both; }

.cta { color: var(--on-y); }
.cta .wipe { position: absolute; inset: 0; background: var(--y); z-index: -1; animation: wipe .55s cubic-bezier(.7,0,.2,1) both; }
@keyframes wipe { from { clip-path: inset(100% 0 0 0) } to { clip-path: inset(0 0 0 0) } }
.cta mark { background-image: linear-gradient(var(--on-y), var(--on-y)); }
@keyframes paintcta { to { background-size: 100% calc(100% - .12em); color: var(--y) } }
.cta mark { animation-name: paintcta; }
.cta .btn { display: inline-flex; align-self: flex-start; align-items: center; gap: 22px; margin-top: 64px; padding: 30px 46px; border-radius: 100px;
  background: var(--on-y); color: var(--y); font-size: 40px; font-weight: 750; letter-spacing: -0.01em;
  animation: rise .6s var(--ease) both, pulse 1.2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(18,18,18,.35) } 50% { box-shadow: 0 0 0 22px rgba(18,18,18,0) } }
.cta .hint { font-size: 34px; font-weight: 600; color: #3d3300; margin-top: 30px; animation: rise .6s var(--ease) both; }
</style></head><body>
<div class="grid"></div><div class="grain"></div>
<div class="bar dark">${segs}</div>
${post.slides.map((s, i) => scene(s, i, tl.start[i], tl.dur[i], i === n - 1, tl.total)).join("\n")}
<footer><div class="brand"><img src="../../assets/logo.png" alt=""><span>@_vgtecnologia</span></div><span>vgtecnologia.com</span></footer>
<script>
  window.seek = (ms) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = ms; } };
</script>
</body></html>`;
}

// ---------- Chrome via DevTools Protocol ----------
export async function chrome(browser) {
  const dir = path.join(process.env.RUNNER_TEMP || "/tmp", `reel-chrome-${process.pid}`);
  const proc = spawn(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
    "--allow-file-access-from-files", "--remote-debugging-port=0", `--user-data-dir=${dir}`, `--window-size=${W},${H}`, "about:blank"],
    { stdio: ["ignore", "ignore", "pipe"] });
  const wsUrl = await new Promise((ok, fail) => {
    let buf = "";
    const t = setTimeout(() => fail(new Error("Chrome não abriu o DevTools")), 30000);
    proc.stderr.on("data", (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); ok(m[1]); } });
    proc.on("exit", (c) => fail(new Error(`Chrome saiu (${c}): ${buf.slice(-400)}`)));
  });
  const ws = new WebSocket(wsUrl);
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = fail; });
  let id = 0; const wait = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { const [ok, fail] = wait.get(m.id); wait.delete(m.id); m.error ? fail(new Error(m.error.message)) : ok(m.result); } };
  const send = (method, params = {}, sessionId) => new Promise((ok, fail) => { const i = ++id; wait.set(i, [ok, fail]); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
  const close = () => { try { ws.close(); } catch {} proc.kill("SIGKILL");
    // o Chrome ainda pode estar gravando o perfil quando morre: limpeza nunca derruba o render
    setTimeout(() => { try { rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {} }, 500).unref(); };
  return { send, close };
}

// ---------- Trilha sintetizada ----------
export function soundtrack(total, cuts, seed, voices = []) {
  const SR = 44100, N = Math.ceil(total * SR);
  const L = new Float32Array(N), R = new Float32Array(N);
  let s = seed >>> 0 || 1; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
  const bpm = 108 + (seed % 3) * 4, beat = 60 / bpm, bar = beat * 4;
  const hz = (m) => 440 * 2 ** ((m - 69) / 12);
  // Am - F - C - G (ou começando em outro ponto do ciclo, para variar de um reel para outro)
  const prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
  const rot = seed % 4, chord = (t) => prog[(Math.floor(t / bar) + rot) % 4];
  const add = (i, v, pan = 0) => { if (i >= 0 && i < N) { L[i] += v * (1 - pan) ; R[i] += v * (1 + pan); } };

  // sidechain: o pad "respira" a cada batida
  const duck = (t) => { const p = (t % beat) / beat; return 0.45 + 0.55 * Math.min(1, p * 3.2); };

  // pad: tríade com vozes levemente desafinadas, harmônicos somados (som de serra suave) e filtro passa-baixa
  let lpL = 0, lpR = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR, c = chord(t);
    let vl = 0, vr = 0;
    for (let k = 0; k < 3; k++) {
      const f = hz(c[k] + 12);
      for (let h = 1; h <= 6; h++) {
        vl += Math.sin(2 * Math.PI * f * 1.003 * h * t + k) / h;
        vr += Math.sin(2 * Math.PI * f * 0.997 * h * t + k * 2) / h;
      }
    }
    const fade = Math.min(1, t / 1.5);
    lpL += 0.06 * (vl - lpL); lpR += 0.06 * (vr - lpR);
    L[i] += lpL * 0.045 * duck(t) * fade; R[i] += lpR * 0.045 * duck(t) * fade;
  }
  const beats = Math.floor(total / beat);
  for (let b = 0; b < beats; b++) {
    const t0 = b * beat, i0 = Math.floor(t0 * SR);
    // bumbo (entra depois de 2 compassos para o começo respirar)
    if (t0 >= bar * 2 - 0.001) for (let j = 0; j < SR * 0.32; j++) {
      const t = j / SR, f = 48 + 110 * Math.exp(-t * 32);
      add(i0 + j, Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 9) * 0.55);
    }
    // chimbal no contratempo
    const ih = Math.floor((t0 + beat / 2) * SR); let prev = 0;
    for (let j = 0; j < SR * 0.05; j++) { const n = rnd(), hp = n - prev; prev = n; add(ih + j, hp * Math.exp(-j / SR * 90) * 0.07, 0.3); }
    // baixo em colcheias
    for (const off of [0, beat / 2]) {
      const ib = Math.floor((t0 + off) * SR), f = hz(chord(t0)[0] - 12);
      for (let j = 0; j < SR * beat * 0.45; j++) { const t = j / SR; add(ib + j, Math.tanh(Math.sin(2 * Math.PI * f * t) * 1.8) * Math.exp(-t * 7) * 0.16); }
    }
    // arpejo agudo, em semicolcheias, a partir do 3º compasso
    if (t0 >= bar * 2 - 0.001) for (let q = 0; q < 4; q++) {
      const c = chord(t0), note = c[(b * 4 + q) % 3] + 24 + (q === 3 ? 12 : 0);
      const ia = Math.floor((t0 + q * beat / 4) * SR), f = hz(note), pan = q % 2 ? 0.35 : -0.35;
      for (let j = 0; j < SR * 0.18; j++) { const t = j / SR; add(ia + j, (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t)) * Math.exp(-t * 22) * 0.05, pan); }
    }
  }
  // troca de cena: sem efeito sonoro (pedido do dono). Só música e voz.
  // locução: entra por cima, e a música abaixa enquanto alguém fala (com subida e descida suaves)
  const V = new Float32Array(N), talk = new Float32Array(N);
  for (const { at, pcm } of voices) {
    const i0 = Math.floor(at * SR);
    for (let j = 0; j < pcm.length && i0 + j < N; j++) { V[i0 + j] += pcm[j]; talk[i0 + j] = 1; }
  }
  const hasVoice = voices.length > 0;
  let env = 0;
  // master: fade in/out, saturação suave, normalização
  let peak = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR, g = Math.min(1, t / 0.25) * Math.min(1, (total - t) / 1.8);
    env += (talk[i] - env) * (talk[i] > env ? 0.0015 : 0.00012);
    // com locução: voz abaixo do limite e sem "drive" na saturação, para os "s" não estourarem em chiado
    const m = hasVoice ? 0.42 * (1 - 0.6 * env) : 1, vg = 0.6, drive = hasVoice ? 1 : 1.3;
    L[i] = Math.tanh((L[i] * m + V[i] * vg) * drive) * g; R[i] = Math.tanh((R[i] * m + V[i] * vg) * drive) * g;
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  }
  const norm = 0.89 / (peak || 1);
  const buf = Buffer.alloc(44 + N * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
  }
  return buf;
}

// ---------- Locução ----------
// O que o locutor fala em cada cena: o texto da lâmina, do jeito que se diz em voz alta
const numeros = ["zero", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete"];
export function falas(post) {
  return post.slides.map((s) => {
    const t = (x = "") => plain(x).replace(/\n/g, " ").trim();
    const fim = (x) => (/[.!?]$/.test(x) ? x : x + ".");
    if (s.t === "point") return `${numeros[Number(s.n)] ?? s.n}. ${fim(t(s.title))} ${t(s.body)}`;
    if (s.t === "cta") return `${fim(t(s.title))} Fale com a gente no WhatsApp. O link está na bio.`;
    return [fim(t(s.title)), s.sub ? t(s.sub) : ""].join(" ").trim();
  });
}

// Gera a voz de cada cena com o voz.mjs (Gemini TTS). Sem GEMINI_API_KEY, ou se a API falhar, o reel sai só com
// a trilha: a locução nunca impede a publicação.
// Locução guardada: assets/voz/ID/voz-N.m4a, gerada na véspera pelo locucao.mjs. O plano grátis do Gemini só dá
// 10 falas por dia e cada reel usa ~6, então a voz é feita com antecedência e o dia do post não depende da cota.
export const vozGuardada = (id) => path.join(path.dirname(new URL(import.meta.url).pathname), "assets", "voz", id);
const arquivoVoz = (dir, i) => ["m4a", "wav"].map((e) => path.join(dir, `voz-${i + 1}.${e}`)).find((f) => existsSync(f));

export function narrate(post, out, ffmpeg, id = "") {
  const cache = process.env.REEL_VOZ_DIR || (id && vozGuardada(id));
  const temCache = !process.env.REEL_SEM_CACHE && cache && post.slides.every((_, i) => arquivoVoz(cache, i));
  if (post.voz === false || process.env.REEL_SEM_VOZ || (!process.env.GEMINI_API_KEY && !temCache)) return post.slides.map(() => null);
  if (temCache) console.log(`locução guardada em ${cache}`);
  const here = path.dirname(new URL(import.meta.url).pathname);
  const textos = falas(post);
  const res = [];
  for (let i = 0; i < textos.length; i++) {
    const wav = path.join(out, `voz-${i + 1}.wav`), raw = `${wav}.f32`;
    // O plano grátis do Gemini limita pedidos por minuto: quando ele manda esperar, espera o tempo pedido e tenta de novo
    let r = { status: 0 };
    if (temCache) copyFileSync(arquivoVoz(cache, i), wav); // o ffmpeg lê pelo conteúdo, não pela extensão
    else for (let tentativa = 1; tentativa <= 4; tentativa++) {
      r = spawnSync(process.execPath, [path.join(here, "voz.mjs"), post.locutor || "Alnilam", wav, textos[i]], { encoding: "utf8", timeout: 120000 });
      if (r.status === 0 || !/RESOURCE_EXHAUSTED|"code":\s*429|retryDelay/.test(r.stderr || "")) break;
      const pedido = Number((r.stderr.match(/"retryDelay":"(\d+)/) || [])[1] || 60);
      if (pedido > 300) { console.warn("locução: a cota DIÁRIA do Gemini acabou; não adianta esperar"); break; }
      const espera = Math.min(90, pedido + 3);
      console.log(`locução: limite por minuto do Gemini na cena ${i + 1}, esperando ${espera} s`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, espera * 1000);
    }
    if (r.status !== 0) { console.warn(`locução falhou na cena ${i + 1}, o reel sai só com a trilha: ${(r.stderr || "").slice(-300)}`); return post.slides.map(() => null); }
    // corta o silêncio do começo e converte para float 44,1 kHz mono
    const c = spawnSync(ffmpeg, ["-y", "-loglevel", "error", "-i", wav, "-af", "highpass=f=80,lowpass=f=9500,deesser=i=0.5:m=0.5:f=0.5,silenceremove=start_periods=1:start_threshold=-45dB,loudnorm=I=-18:TP=-4",
      "-ar", "44100", "-ac", "1", "-f", "f32le", raw]);
    if (c.status !== 0) throw new Error(`ffmpeg na locução: ${c.stderr}`);
    const b = readFileSync(raw);
    const v = new Float32Array(b.buffer, b.byteOffset, b.length / 4).slice();
    // fade de 10 ms na entrada e 120 ms na saída: sem estalo quando a fala começa ou termina
    const fi = Math.min(v.length, 441), fo = Math.min(v.length, 5292);
    for (let k = 0; k < fi; k++) v[k] *= k / fi;
    for (let k = 0; k < fo; k++) v[v.length - 1 - k] *= k / fo;
    res.push(v);
    rmSync(raw);
    if (process.env.REEL_GUARDA_VOZ) { mkdirSync(path.join(out, "voz"), { recursive: true }); copyFileSync(wav, path.join(out, "voz", `voz-${i + 1}.wav`)); }
    rmSync(wav);
  }
  return res;
}

export async function buildReel(post, out, { browser, ffmpeg = "ffmpeg", id = "" } = {}) {
  if (post.slides.some((s) => s.t === "shot")) throw new Error("reel não aceita lâmina shot");
  const voice = narrate(post, out, ffmpeg, id);
  const tl = timeline(post.slides, voice.map((v) => v && v.length / 44100 + 0.9));
  const html = path.join(out, "reel.html");
  writeFileSync(html, page(post, tl));
  const seed = [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const wav = path.join(out, "reel.wav");
  const voices = voice.map((pcm, i) => pcm && { at: tl.start[i] + 0.3, pcm }).filter(Boolean);
  writeFileSync(wav, soundtrack(tl.total, tl.start.slice(1), seed, voices));
  if (voices.length) console.log(`locução: ${voices.length} trechos`);

  const { send, close } = await chrome(browser);
  try {
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    const S = (m, p) => send(m, p, sessionId);
    await S("Page.enable");
    await S("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await S("Page.navigate", { url: pathToFileURL(html).href });
    // espera a página e as fontes carregarem
    for (let i = 0; i < 100; i++) {
      const r = await S("Runtime.evaluate", { expression: "document.readyState === 'complete' && document.fonts.status === 'loaded' && typeof seek === 'function'", returnByValue: true });
      if (r.result.value) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    const enc = spawn(ffmpeg, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
      "-i", wav, "-c:v", "libx264", "-profile:v", "high", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", String(FPS),
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", path.join(out, "reel.mp4")], { stdio: ["pipe", "inherit", "pipe"] });
    let err = ""; enc.stderr.on("data", (d) => (err += d));
    const done = new Promise((ok, fail) => enc.on("exit", (c) => (c === 0 ? ok() : fail(new Error(`ffmpeg: ${err}`)))));
    const frames = Math.round(tl.total * FPS);
    for (let f = 0; f < frames; f++) {
      await S("Runtime.evaluate", { expression: `seek(${((f / FPS) * 1000).toFixed(2)})` });
      const { data } = await S("Page.captureScreenshot", { format: "jpeg", quality: 92, captureBeyondViewport: false });
      if (!enc.stdin.write(Buffer.from(data, "base64"))) await new Promise((r) => enc.stdin.once("drain", r));
    }
    enc.stdin.end();
    await done;
  } finally {
    close();
    rmSync(wav, { force: true });
  }
  return tl.total;
}
