// Renderiza as lâminas de um post (posts/AAAA-MM-DD.json) em JPEG 1080x1350, prontas para a Graph API.
//
//   node render.mjs 2026-11-16   -> out/2026-11-16/1.jpg, 2.jpg...
//
// Cada lâmina vira um HTML, o navegador headless tira o print e o ffmpeg converte para JPEG
// (a API do Instagram não aceita PNG). Sem dependências: Node 22+, ffmpeg e Edge/Chrome.
// No Linux (GitHub Actions) passe BROWSER=google-chrome.
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const BROWSER = process.env.BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const W = 1080;

// Vários posts no mesmo dia levam sufixo: 2026-11-16-1, 2026-11-16-2...
const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}(-[a-z0-9]+)?$/.test(date ?? "")) throw new Error("uso: node render.mjs AAAA-MM-DD[-N]");
const post = JSON.parse(readFileSync(path.join(here, "posts", `${date}.json`), "utf8"));
const out = path.join(here, "out", date);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Reel: o vídeo já vem pronto, só vai junto com as imagens para a URL pública
if (post.video) {
  copyFileSync(path.join(here, "assets", post.video), path.join(out, "reel.mp4"));
  console.log(`reel em ${path.relative(process.cwd(), out)}`);
  process.exit(0);
}

const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// [[palavra]] vira o marca-texto amarelo; \n quebra linha onde o texto pedir
const rich = (s = "") => esc(s).replace(/\[\[(.+?)\]\]/g, "<mark>$1</mark>").replace(/\n/g, "<br>");
// Título longo encolhe para caber sem quebrar palavra
const fit = (s, sizes) => { const n = s.replace(/\[\[|\]\]/g, "").length; return sizes.find(([max]) => n <= max)?.[1] ?? sizes.at(-1)[1]; };

const total = post.slides.length;
// story: true → cada lâmina vira um story 1080x1920 (com margem para a interface do Instagram em cima e embaixo)
// reel: true → as mesmas lâminas viram um vídeo vertical 1080x1920 (out/ID/reel.mp4), com as margens que a interface do Reels cobre
const H = post.story || post.reel ? 1920 : 1350;
const asset = (f) => `../../assets/${f}`;

// O logo já diz "VG": ao lado vai o @ do perfil, que ajuda quem vê o post compartilhado a achar a conta
const footer = (i) => `
  <footer>
    <div class="brand"><img src="${asset("logo.png")}" alt=""><span>@_vgtecnologia</span></div>
    <span class="count">${total > 1 && !post.story && !post.reel ? `${i + 1}<i>/</i>${total}` : "vgtecnologia.com"}</span>
  </footer>`;

const arrow = `<svg width="88" height="24" viewBox="0 0 88 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h82M72 2l12 10-12 10"/></svg>`;

const slides = {
  cover: (s) => `
    <main class="cover">
      <h1 style="font-size:${fit(s.title, [[24, 150], [40, 128], [64, 108], [999, 92]])}px">${rich(s.title)}</h1>
      ${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ""}
      ${total > 1 && !post.reel ? `<div class="swipe"><span>arraste</span>${arrow}</div>` : ""}
    </main>`,
  point: (s) => `
    <main class="point">
      <span class="num">${s.n}</span>
      <h2 style="font-size:${fit(s.title, [[22, 92], [40, 78], [999, 66]])}px">${rich(s.title)}</h2>
      <p>${rich(s.body)}</p>
      ${s.price ? `<div class="price">${s.price[0] ? `<s>${esc(s.price[0])}</s>` : ""}<mark>${esc(s.price[1])}</mark></div>` : ""}
    </main>`,
  shot: (s) => `
    <main class="shot">
      <figure>
        <div class="bar"><i></i><i></i><i></i><span>${esc(new URL(s.url).hostname.replace(/^www\./, ""))}</span></div>
        <img src="${s.capture}" alt="">
      </figure>
      <h2>${rich(s.title)}</h2>
      ${s.body ? `<p>${rich(s.body)}</p>` : ""}
    </main>`,
  statement: (s) => `
    <main class="statement">
      <h1 style="font-size:${fit(s.title, [[40, 132], [70, 112], [110, 94], [999, 80]])}px">${rich(s.title)}</h1>
      ${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ""}
    </main>`,
  // Contagem regressiva de campanha: número gigante + faixa de alerta no topo (mesma linguagem da página da Black no PDF)
  count: (s) => `
    <main class="count">
      <div class="n"><span>${esc(s.n)}</span><em>${esc(s.unit ?? "dias")}</em></div>
      <h1 style="font-size:${fit(s.title, [[40, 96], [70, 84], [999, 72]])}px">${rich(s.title)}</h1>
      ${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ""}
    </main>`,
  cta: (s) => `
    <main class="cta">
      <h1 style="font-size:${fit(s.title, [[40, 128], [70, 108], [999, 92]])}px">${rich(s.title)}</h1>
      <p class="sub">${rich(s.sub ?? "Orçamento pelo WhatsApp.\nO link está na bio.")}</p>
    </main>`,
};

// Granulação leve: tira o aspecto liso de imagem "gerada" sem aparecer como textura
const grain = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`)}")`;

const css = `
@font-face { font-family: "Inter Tight"; font-weight: 100 900; src: url("../../fonts/inter-tight-latin-wght-normal.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: "Inter Tight"; font-weight: 100 900; src: url("../../fonts/inter-tight-latin-ext-wght-normal.woff2") format("woff2");
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
:root { --bg: #161616; --ink: #ededed; --soft: #a6a6a6; --line: #2b2b2b; --y: #ffcc00; --on-y: #121212; }
* { margin: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
body { background: var(--bg); color: var(--ink); font-family: "Inter Tight", sans-serif; font-feature-settings: "ss01", "cv11";
  -webkit-font-smoothing: antialiased; position: relative; display: flex; flex-direction: column; padding: 84px 84px 64px; }
body::after { content: ""; position: absolute; inset: 0; background-image: ${grain}; opacity: .07; mix-blend-mode: overlay; pointer-events: none; }
body.on-y { background: var(--y); color: var(--on-y); }
body.on-y::after { opacity: .12; mix-blend-mode: multiply; }
main { flex: 1; display: flex; flex-direction: column; min-height: 0; }
h1, h2 { font-weight: 800; letter-spacing: -0.032em; word-spacing: .05em; line-height: 1.02; text-wrap: balance; }
/* Marca-texto: a caixa amarela é mais baixa que a altura da fonte (começa .12em abaixo do topo) e as linhas com
   destaque ganham mais entrelinha, para a caixa nunca encostar nem cobrir as letras da linha de cima */
h1:has(mark), h2:has(mark) { line-height: 1.17; }
mark { --mk: var(--y); background: linear-gradient(var(--mk), var(--mk)) no-repeat 0 100% / 100% calc(100% - .12em);
  color: var(--on-y); padding: 0 .1em; margin: 0 .03em; border-radius: .06em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.sub { font-size: 38px; line-height: 1.3; color: var(--soft); font-weight: 450; letter-spacing: -0.01em; max-width: 24ch; margin-top: 40px; text-wrap: pretty; }

.cover, .statement { justify-content: flex-end; padding-bottom: 72px; }
.cover h1, .statement h1 { max-width: 9.5em; }
.swipe { display: flex; align-items: center; gap: 18px; margin-top: 72px; color: var(--soft); font-size: 28px; font-weight: 500; letter-spacing: .01em; }
.swipe svg { color: var(--y); }

.point { justify-content: center; }
.point .num { font-size: 300px; font-weight: 800; letter-spacing: -0.04em; line-height: .78; color: var(--y); font-variant-numeric: tabular-nums; margin-bottom: 56px; }
.point h2 { max-width: 11em; }
.point p { font-size: 40px; line-height: 1.34; color: #c4c4c4; font-weight: 420; margin-top: 36px; max-width: 29ch; text-wrap: pretty; letter-spacing: -0.005em; }

.point .price { margin-top: 48px; display: flex; align-items: baseline; gap: 22px; font-weight: 800; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.point .price s { font-size: 40px; color: var(--soft); font-weight: 600; text-decoration-thickness: 3px; }
.point .price mark { font-size: 76px; line-height: 1.05; }
.shot { justify-content: flex-start; padding-top: 8px; }
.shot figure { border-radius: 20px; overflow: hidden; border: 1px solid var(--line); background: #0e0e0e;
  box-shadow: 0 34px 70px -20px rgba(0,0,0,.75), 0 8px 18px rgba(0,0,0,.35); }
.shot .bar { height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 22px; border-bottom: 1px solid var(--line); background: #1c1c1c; }
.shot .bar i { width: 13px; height: 13px; border-radius: 50%; background: #3a3a3a; }
.shot .bar span { margin-left: 18px; font-size: 21px; color: #8c8c8c; letter-spacing: .01em; }
.shot img { display: block; width: 100%; height: 600px; object-fit: cover; object-position: top center; }
.shot h2 { font-size: 68px; margin-top: 60px; max-width: 12em; }
.shot p { font-size: 36px; line-height: 1.34; color: #c4c4c4; font-weight: 420; margin-top: 26px; max-width: 30ch; text-wrap: pretty; }

body.story { padding: 260px 84px 330px; }
body.story main { justify-content: center; padding-bottom: 0; }
/* Reels: a interface cobre o topo, a legenda embaixo e os botões à direita; a capa no grid é cortada em 3:4 no centro */
body.reel { padding: 250px 150px 400px 84px; }
body.reel main { justify-content: center; padding-bottom: 0; }
body.reel footer { position: absolute; left: 84px; right: 150px; bottom: 250px; }
body.bf { padding-top: 132px; }
body.story.bf { padding-top: 300px; }
body.bf::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 46px;
  background: repeating-linear-gradient(-45deg, var(--y) 0 34px, var(--bg) 34px 68px); }
.count { justify-content: center; }
.count .n { display: flex; align-items: baseline; gap: 26px; color: var(--y); }
.count .n span { font-size: 430px; font-weight: 900; letter-spacing: -0.06em; line-height: .8; font-variant-numeric: tabular-nums; }
.count .n em { font-style: normal; font-size: 112px; font-weight: 850; letter-spacing: -0.04em; color: var(--ink); }
.count h1 { margin-top: 64px; max-width: 11em; }
.cta { justify-content: flex-end; padding-bottom: 72px; }
.cta h1 { max-width: 9em; }
.cta .sub { color: #3d3300; font-weight: 550; }
.cta mark { --mk: var(--on-y); color: var(--y); }

footer { display: flex; justify-content: space-between; align-items: center; padding-top: 30px; border-top: 1px solid var(--line);
  font-size: 25px; font-weight: 550; letter-spacing: .005em; color: var(--soft); }
.on-y footer { border-color: rgba(0,0,0,.18); color: #3d3300; }
.brand { display: flex; align-items: center; gap: 16px; color: var(--ink); }
.on-y .brand { color: var(--on-y); }
.brand img { width: 46px; height: 46px; object-fit: contain; }
.on-y .brand img { filter: brightness(0); }
.count { font-variant-numeric: tabular-nums; }
.count i { font-style: normal; opacity: .45; margin: 0 .12em; }
`;

const shoot = (url, png, w, h, wait) => {
  const r = spawnSync(BROWSER, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--allow-file-access-from-files", `--virtual-time-budget=${wait}`, `--window-size=${w},${h}`, `--screenshot=${png}`, url]);
  if (r.status !== 0) throw new Error(`navegador falhou em ${url}: ${r.stderr}`);
};

post.slides.forEach((s, i) => {
  if (!slides[s.t]) throw new Error(`lâmina ${i + 1}: tipo "${s.t}" não existe (use ${Object.keys(slides).join(", ")})`);
  // Print do portfólio sempre tirado do site no ar na hora do render, nunca de imagem guardada
  if (s.t === "shot") {
    if (!s.url) throw new Error(`lâmina ${i + 1}: "shot" precisa de "url" (o site é capturado ao vivo)`);
    s.capture = `site-${i + 1}.png`;
    shoot(s.url, path.join(out, s.capture), 1440, 900, 12000);
  }
  const dark = s.t === "cta";
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${css}</style></head>
    <body class="${dark ? "on-y" : s.t === "count" ? "bf" : ""}${post.story ? " story" : ""}${post.reel ? " reel" : ""}">${slides[s.t](s)}${footer(i)}</body></html>`;
  const file = path.join(out, `${i + 1}.html`);
  writeFileSync(file, html);
  const png = path.join(out, `${i + 1}.png`);
  shoot(pathToFileURL(file).href, png, W, H, 4000);
  const j = spawnSync(process.env.FFMPEG || "ffmpeg", ["-y", "-loglevel", "error", "-i", png, "-q:v", "2", path.join(out, `${i + 1}.jpg`)]);
  if (j.status !== 0) throw new Error(`ffmpeg falhou na lâmina ${i + 1}: ${j.stderr}`);
  rmSync(png);
});
console.log(`${total} lâmina(s) em ${path.relative(process.cwd(), out)}`);

// Reel: vídeo animado (reel.mjs) com as mesmas lâminas; a primeira lâmina estática (1.jpg) vira a capa
if (post.reel) {
  const { buildReel } = await import("./reel.mjs");
  const secs = await buildReel(post, out, { browser: BROWSER, ffmpeg: process.env.FFMPEG || "ffmpeg", id: date });
  console.log(`reel em ${path.relative(process.cwd(), out)}/reel.mp4 (${secs.toFixed(1)} s)`);
}
