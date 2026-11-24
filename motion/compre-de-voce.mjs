// Versão "motion" (animada do zero) do reel de 26/11, no estilo do reel de lançamento: celular em 3D no
// fundo escuro, a tela de dentro ganhando vida, legenda embaixo com palavras em amarelo e o logo no fim.
// Usa a mesma locução e trilha do reel.mjs. Protótipo para o dono escolher entre esta e a versão de lâminas.
//   REEL_VOZ_DIR=pasta-com-voz-1..6.wav BROWSER=google-chrome node motion/compre-de-voce.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { narrate, soundtrack, chrome } from "../reel.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const ID = "2026-11-26";
const W = 1080, H = 1920, FPS = 30;
const post = JSON.parse(readFileSync(path.join(root, "posts", `${ID}.json`), "utf8"));
const out = path.join(root, "out", `${ID}-motion`);
mkdirSync(out, { recursive: true });

// ---------- linha do tempo: cada cena dura a fala dela ----------
const voz = narrate(post, out, process.env.FFMPEG || "ffmpeg");
const dur = voz.map((v, i) => Math.max(i === 0 ? 4.2 : 3.6, v ? v.length / 44100 + 1.0 : 4.5));
dur[dur.length - 1] += 1.8;
const start = []; dur.reduce((t, d, i) => (start[i] = t, t + d), 0);
const total = dur.reduce((a, b) => a + b, 0);
console.log("cenas:", dur.map((d) => d.toFixed(1)).join(" "), "total", total.toFixed(1));

const f = (x) => `${x.toFixed(3)}s`;
const anim = (name, d, at, ease = "var(--ease)", extra = "both") => `${name} ${d}s ${ease} ${f(at)} ${extra}`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
// legenda: palavras entram uma a uma; *trecho* fica amarelo
function caption(i, kicker, text) {
  const t0 = start[i] + 0.35, end = start[i] + dur[i];
  let k = 0, html = "";
  for (const part of text.split(/(\*[^*]+\*)/)) {
    if (!part) continue;
    const y = part.startsWith("*");
    for (const w of (y ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean))
      html += `<span class="w${y ? " y" : ""}" style="animation:${anim("word", 0.6, t0 + 0.25 + k++ * 0.06)}">${esc(w)}</span> `;
  }
  const exit = i < dur.length - 1 ? `, ${anim("capout", 0.35, end - 0.35, "ease-in")}` : "";
  return `<div class="cap" style="animation:${anim("show", 0.01, start[i], "linear")}${exit}">
    <div class="kick" style="animation:${anim("rise", 0.5, t0)}">${esc(kicker)}</div>
    <div class="dash" style="animation:${anim("grow", 0.5, t0 + 0.1)}"></div>
    <div class="head">${html}</div></div>`;
}
// tela do celular: entra deslizando da direita e sai pela esquerda
function screen(i, inner, cls = "") {
  const s = start[i], e = s + dur[i];
  const enter = i === 0 ? anim("show", 0.01, 0, "linear") : anim("scrin", 0.55, s - 0.05, "cubic-bezier(.7,0,.2,1)");
  const exit = i < 4 ? `, ${anim("scrout", 0.55, e - 0.05, "cubic-bezier(.7,0,.2,1)")}` : "";
  return `<div class="scr ${cls}" style="animation:${enter}${exit}">${inner}</div>`;
}
const S = (i, x) => start[i] + x; // instante dentro da cena i

const icons = {
  wifi: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 18.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 13c2 0 3.8.8 5.1 2.1l-1.4 1.4A5.2 5.2 0 0 0 12 15c-1.4 0-2.8.6-3.7 1.5l-1.4-1.4A7.2 7.2 0 0 1 12 13zm0-4.5c3.2 0 6.1 1.3 8.3 3.4l-1.4 1.4A9.7 9.7 0 0 0 12 10.5c-2.7 0-5.1 1.1-6.9 2.8l-1.4-1.4C5.9 9.8 8.8 8.5 12 8.5zM12 4c4.4 0 8.4 1.8 11.3 4.7l-1.4 1.4A13.9 13.9 0 0 0 12 6c-3.9 0-7.4 1.6-9.9 4.1L.7 8.7C3.6 5.8 7.6 4 12 4z"/></svg>`,
  bat: `<svg viewBox="0 0 28 14"><rect x="1" y="1" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".5"/><rect x="3" y="3" width="16" height="8" rx="2" fill="currentColor"/><rect x="24.5" y="4.5" width="2" height="5" rx="1" fill="currentColor" opacity=".5"/></svg>`,
  sig: `<svg viewBox="0 0 20 14"><rect x="0" y="9" width="3.5" height="5" rx="1" fill="currentColor"/><rect x="5.5" y="6" width="3.5" height="8" rx="1" fill="currentColor"/><rect x="11" y="3" width="3.5" height="11" rx="1" fill="currentColor"/><rect x="16.5" y="0" width="3.5" height="14" rx="1" fill="currentColor"/></svg>`,
  lupa: `<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  zap: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>`,
  lua: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>`,
  sol: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g></svg>`,
};

// ---------- as telas ----------
const t1 = screen(0, `
  <div class="lock">
    <div class="ldate" style="animation:${anim("rise", 0.7, 0.5)}">sexta-feira, 27 de novembro</div>
    <div class="lclock" style="animation:${anim("rise", 0.7, 0.6)}">09:41</div>
    ${["Black Friday começa amanhã", "Seu carrinho está esperando", "Últimas horas de oferta"].map((n, k) => `
    <div class="notif" style="animation:${anim("drop", 0.6, 1.3 + k * 0.45, "cubic-bezier(.34,1.4,.64,1)")}">
      <i></i><div><b>${n}</b><span>agora</span></div></div>`).join("")}
  </div>`);

const t2 = screen(1, `
  <div class="cc" style="animation:${anim("show", 0.01, S(1, 0), "linear")}, ${anim("fadeout", 0.35, S(1, 1.7), "ease")}">
    <div class="tile wifi" style="animation:${anim("wifioff", 0.3, S(1, 1.0), "ease")}">${icons.wifi}<span>Wi-Fi</span></div>
    <div class="tile">${icons.sig}<span>Dados móveis</span></div>
    <div class="tap" style="animation:${anim("tap", 0.6, S(1, 0.85), "ease-out")}"></div>
  </div>
  <div class="browser" style="animation:${anim("rise", 0.5, S(1, 1.8))}">
    <div class="url">${icons.lupa}<span>seusite.com.br</span></div>
    <div class="prog"><b style="animation:${anim("load", Math.max(2, dur[1] - 2.6), S(1, 2.0), "cubic-bezier(.2,.1,.3,1)")}"></b></div>
    <div class="skel"><i></i><i></i><i class="s"></i><i></i><i class="s"></i><i></i></div>
    <div class="timer" style="animation:${anim("pop", 0.5, S(1, 2.2), "cubic-bezier(.34,1.56,.64,1)")}">
      <span class="num" style="animation:${anim("count", Math.max(2, dur[1] - 2.8), S(1, 2.2), "linear")}"></span><small>s esperando</small></div>
  </div>`);

const tiles = Array.from({ length: 36 }, (_, k) => `<i style="--h:${(k * 47) % 360}"${k === 31 ? ' class="of"' : ""}>${k === 31 ? "<b>OFERTA</b>" : ""}</i>`).join("");
const t3 = screen(2, `
  <div class="ig">
    <div class="igtop"><div class="av"></div><div><b>sualoja</b><span>Moda · Curitiba</span></div></div>
    <div class="grid" style="animation:${anim("scrollgrid", Math.max(2.5, dur[2] - 1.4), S(2, 0.5), "cubic-bezier(.45,.05,.2,1)")}">${tiles}</div>
    <div class="swipe" style="animation:${anim("swipe", 0.7, S(2, 0.6), "ease-in-out", "4 both")}"></div>
    <div class="giveup" style="animation:${anim("pop", 0.5, S(2, dur[2] - 1.5), "cubic-bezier(.34,1.56,.64,1)")}">Cliente fechou o app</div>
  </div>`);

const botoes = [["WhatsApp", "ok"], ["Nosso site", "ok"], ["Ofertas da Black Friday", "erro"], ["Catálogo", "ok"]];
const t4 = screen(3, `
  <div class="bio">
    <div class="av big"></div><b class="nm">@sualoja</b>
    ${botoes.map(([b, r], k) => {
      const at = S(3, 0.9 + k * Math.max(0.55, (dur[3] - 2.2) / 4));
      return `<div class="btn ${r}" style="animation:${anim(r === "erro" ? "shake" : "press", 0.5, at, "ease")}">${b}
        <em style="animation:${anim("pop", 0.4, at + 0.15, "cubic-bezier(.34,1.56,.64,1)")}">${r === "ok" ? "✓" : "!"}</em></div>
        <div class="tap at" style="top:${300 + k * 128}px;animation:${anim("tap", 0.6, at - 0.1, "ease-out")}"></div>`;
    }).join("")}
    <div class="toast" style="animation:${anim("drop", 0.5, S(3, 0.9 + 2 * Math.max(0.55, (dur[3] - 2.2) / 4) + 0.2), "cubic-bezier(.34,1.4,.64,1)")}">Página não encontrada · 404</div>
  </div>`);

const h5 = [["23:04", 0], ["23:47", 0.42], ["01:15", 0.52], ["04:30", 0.62], ["08:12", 0.72]];
const t5 = screen(4, `
  <div class="wa">
    <div class="wahead"><div class="av sm"></div><div><b>Sua Empresa</b><span>visto por último ontem</span></div></div>
    <div class="clock">${h5.map(([h, p], k) => `<span style="animation:${anim("show", 0.01, S(4, 0.2 + p * (dur[4] - 1)), "linear")}${k < h5.length - 1 ? `, ${anim("hide", 0.01, S(4, 0.2 + h5[k + 1][1] * (dur[4] - 1)), "linear")}` : ""}">${h}</span>`).join("")}</div>
    <div class="sky"><span class="lua" style="animation:${anim("hide", 0.6, S(4, 0.2 + 0.7 * (dur[4] - 1)), "ease")}">${icons.lua}</span><span class="sol" style="animation:${anim("pop", 0.6, S(4, 0.2 + 0.72 * (dur[4] - 1)), "ease")}">${icons.sol}</span></div>
    <div class="msg me" style="animation:${anim("drop", 0.5, S(4, 0.7), "cubic-bezier(.34,1.4,.64,1)")}">Oi! A promoção ainda está valendo?<small>23:04 ✓✓</small></div>
    <div class="nada" style="animation:${anim("rise", 0.5, S(4, 1.6))}">sem resposta</div>
    <div class="dim" style="animation:${anim("night", Math.max(2, dur[4] - 1.2), S(4, 0.2), "linear")}"></div>
    <div class="notif lost" style="animation:${anim("drop", 0.6, S(4, dur[4] - 1.6), "cubic-bezier(.34,1.4,.64,1)")}"><i></i><div><b>Compra confirmada em outra loja</b><span>08:12</span></div></div>
  </div>`, "dark");

const caps = [
  caption(0, "Teste rápido · só com o celular", "Antes de sexta, *compre de você mesmo.*"),
  caption(1, "1 · Desligue o Wi-Fi", "Abra o seu site no *4G,* como o cliente na rua."),
  caption(2, "2 · Ache a oferta", "Se você demora para achar, o cliente *desiste antes.*"),
  caption(3, "3 · Clique em todo botão", "Link quebrado custa venda *em silêncio.*"),
  caption(4, "4 · Mande mensagem às 23h", "Silêncio até de manhã é cliente *indo embora.*"),
];
const c6 = start[5];
const finale = `
  <div class="final" style="animation:${anim("show", 0.01, c6, "linear")}">
    ${Array.from({ length: 70 }, (_, k) => { const a = (k * 137.5) % 360, r = 260 + (k * 53) % 380; return `<i class="pt" style="--x:${(Math.cos(a) * r).toFixed(0)}px;--y:${(Math.sin(a) * r).toFixed(0)}px;animation:${anim("converge", 1.0, c6 + 0.2 + (k % 10) * 0.025, "cubic-bezier(.6,0,.2,1)")}"></i>`; }).join("")}
    <img class="logo" src="../../assets/logo.png" style="animation:${anim("logoin", 0.9, c6 + 1.0, "cubic-bezier(.2,1.3,.4,1)")}">
    <div class="tec" style="animation:${anim("rise", 0.6, c6 + 1.4)}">TECNOLOGIA</div>
    <div class="fh">${"Travou em algum".split(" ").map((w, k) => `<span class="w" style="animation:${anim("word", 0.6, c6 + 1.7 + k * 0.07)}">${w}</span>`).join(" ")} <span class="w y" style="animation:${anim("word", 0.6, c6 + 1.95)}">passo?</span></div>
    <div class="pillwrap"><div class="pill" style="animation:${anim("rise", 0.6, c6 + 2.4)}, ${anim("pulse", 1.4, c6 + 3.0, "ease-in-out", "infinite")}">${icons.zap}<span>Chama no WhatsApp · link na bio</span></div>
  </div>`;

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face { font-family: "Inter Tight"; font-weight: 100 900; src: url("../../fonts/inter-tight-latin-wght-normal.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F, U+2212; }
@font-face { font-family: "Inter Tight"; font-weight: 100 900; src: url("../../fonts/inter-tight-latin-ext-wght-normal.woff2") format("woff2"); unicode-range: U+0100-02BA, U+1E00-1EFF; }
@property --n { syntax: "<integer>"; inherits: false; initial-value: 0; }
:root { --y: #ffcc00; --ease: cubic-bezier(.16,1,.3,1); }
* { margin: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #0b0b0c; }
body { font-family: "Inter Tight", sans-serif; color: #f2f2f2; -webkit-font-smoothing: antialiased; position: relative;
  background: radial-gradient(120% 70% at 50% 38%, #1d1d20 0%, #0b0b0c 70%); }
.floor { position: absolute; left: 140px; right: 140px; top: 1235px; height: 80px; border-radius: 50%; background: rgba(0,0,0,.75); filter: blur(28px); }
@keyframes show { from { visibility: hidden } to { visibility: visible } }
@keyframes hide { to { visibility: hidden; opacity: 0 } }
@keyframes fadeout { to { opacity: 0 } }
@keyframes rise { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: none } }
@keyframes word { from { opacity: 0; transform: translateY(46px); filter: blur(8px) } to { opacity: 1; transform: none; filter: none } }
@keyframes grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes pop { from { opacity: 0; transform: scale(.6) } to { opacity: 1; transform: none } }
@keyframes drop { from { opacity: 0; transform: translateY(-40px) scale(.96) } to { opacity: 1; transform: none } }
@keyframes capout { to { opacity: 0; transform: translateY(-24px); filter: blur(6px) } }

/* celular em 3D, sempre se mexendo um pouco */
.stage { position: absolute; left: 0; right: 0; top: 0; height: 1320px; perspective: 2600px; }
.phone { position: absolute; left: 290px; top: 215px; width: 500px; height: 1030px; border-radius: 82px; transform-style: preserve-3d;
  background: linear-gradient(145deg, #3a3a3e, #121214 45%, #2a2a2d); padding: 16px;
  box-shadow: inset 0 0 0 2px #4a4a4f, inset 0 0 0 7px #0d0d0e, 0 60px 120px -30px rgba(0,0,0,.9);
  animation: ${anim("enter", 1.1, 0, "cubic-bezier(.2,.9,.25,1)")}, ${anim("float", total, 1.1, "ease-in-out")}, ${anim("leave", 0.9, c6, "cubic-bezier(.7,0,.3,1)")}; }
@keyframes enter { from { transform: translateY(700px) rotateX(35deg) rotateY(-25deg) } to { transform: rotateX(8deg) rotateY(-16deg) } }
@keyframes float { 0% { transform: rotateX(8deg) rotateY(-16deg) } 25% { transform: rotateX(4deg) rotateY(-6deg) translateY(-14px) }
  50% { transform: rotateX(7deg) rotateY(10deg) } 75% { transform: rotateX(3deg) rotateY(-2deg) translateY(-10px) } 100% { transform: rotateX(6deg) rotateY(-12deg) } }
@keyframes leave { to { transform: translateY(-180px) rotateX(10deg) scale(.55); opacity: 0; filter: blur(10px) } }
.glass { position: absolute; inset: 16px; border-radius: 66px; overflow: hidden; background: #f4f4f6; color: #141414; }
.glass::after { content: ""; position: absolute; inset: 0; background: linear-gradient(115deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 38%); pointer-events: none; z-index: 20; }
.island { position: absolute; top: 18px; left: 50%; width: 150px; height: 42px; margin-left: -75px; border-radius: 30px; background: #000; z-index: 30; }
.status { position: absolute; top: 22px; left: 0; right: 0; height: 40px; padding: 0 40px 0 46px; display: flex; justify-content: space-between; align-items: center;
  font-size: 25px; font-weight: 700; z-index: 25; }
.status .r { display: flex; gap: 8px; align-items: center; }
.status svg { height: 22px; width: auto; }
.status .g4 { font-size: 21px; font-weight: 800; opacity: 0; animation: ${anim("pop", 0.4, S(1, 1.2), "cubic-bezier(.34,1.56,.64,1)")}; }
.status .wf { animation: ${anim("hide", 0.2, S(1, 1.05), "ease")}; }
.status.night { color: #fff; }
.status .tm { animation: ${anim("hide", 0.01, start[4], "linear")}; }

.scr { position: absolute; inset: 0; padding: 80px 30px 30px; visibility: hidden; }
@keyframes scrin { from { visibility: visible; transform: translateX(105%) } to { visibility: visible; transform: none } }
@keyframes scrout { from { visibility: visible } to { visibility: visible; transform: translateX(-105%) } }

/* 1: tela de bloqueio */
.lock { position: absolute; inset: 0; padding: 120px 28px 0; background: linear-gradient(170deg, #2b2b30, #111114 70%); color: #fff; text-align: center; }
.ldate { font-size: 26px; font-weight: 600; opacity: .85; }
.lclock { font-size: 138px; font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin: 6px 0 56px; }
.notif { display: flex; gap: 16px; align-items: center; text-align: left; background: rgba(255,255,255,.14); backdrop-filter: blur(10px); border-radius: 26px; padding: 20px 22px; margin-bottom: 14px; }
.notif i { width: 52px; height: 52px; border-radius: 13px; background: var(--y); flex: none; }
.notif b { display: block; font-size: 24px; font-weight: 700; }
.notif span { font-size: 19px; opacity: .65; }
/* 2: Wi-Fi e navegador */
.cc { position: absolute; inset: 0; padding: 140px 34px; background: #e9e9ee; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-content: start; visibility: hidden; }
.tile { height: 180px; border-radius: 40px; background: #fff; display: flex; flex-direction: column; justify-content: space-between; padding: 26px; font-size: 23px; font-weight: 700; color: #222; }
.tile svg { width: 54px; height: 54px; }
.tile.wifi { background: #2f7cf6; color: #fff; }
@keyframes wifioff { to { background: #fff; color: #9a9a9a } }
.tap { position: absolute; left: 92px; top: 205px; width: 110px; height: 110px; border-radius: 50%; background: rgba(0,0,0,.25); opacity: 0; }
.tap.at { left: 330px; }
@keyframes tap { 0% { opacity: .55; transform: scale(.4) } 100% { opacity: 0; transform: scale(1.4) } }
.browser { position: absolute; inset: 0; padding: 90px 26px 0; background: #fff; opacity: 0; }
.url { display: flex; align-items: center; gap: 12px; background: #ececf0; border-radius: 22px; padding: 18px 22px; font-size: 24px; color: #444; }
.url svg { width: 26px; color: #888; }
.prog { height: 6px; margin: 14px 4px 34px; border-radius: 3px; background: #e6e6e6; overflow: hidden; }
.prog b { display: block; height: 100%; width: 100%; background: #2f7cf6; transform-origin: left; transform: scaleX(0); }
@keyframes load { 0% { transform: scaleX(0) } 30% { transform: scaleX(.22) } 70% { transform: scaleX(.38) } 100% { transform: scaleX(.55) } }
.skel i { display: block; height: 44px; border-radius: 12px; margin-bottom: 18px;
  background: linear-gradient(90deg, #eee 25%, #f7f7f7 50%, #eee 75%) 0 0 / 300% 100%; animation: shimmer 1.2s linear infinite; }
.skel i:first-child { height: 300px; } .skel i.s { width: 60%; }
@keyframes shimmer { from { background-position: 100% 0 } to { background-position: -200% 0 } }
.timer { position: absolute; left: 50%; top: 560px; transform: translateX(-50%); background: #141414; color: #fff; border-radius: 34px; padding: 26px 40px; text-align: center; opacity: 0;
  box-shadow: 0 20px 50px rgba(0,0,0,.35); white-space: nowrap; }
.timer .num { font-size: 96px; font-weight: 800; color: var(--y); font-variant-numeric: tabular-nums; counter-reset: n var(--n); }
.timer .num::after { content: counter(n); }
.timer small { display: block; font-size: 24px; font-weight: 600; opacity: .8; }
@keyframes count { from { --n: 0 } to { --n: ${Math.round(Math.max(2, dur[1] - 2.8) * 1.6)} } }
/* 3: perfil rolando */
.ig { position: absolute; inset: 0; padding-top: 84px; background: #fff; overflow: hidden; }
.igtop { display: flex; gap: 18px; align-items: center; padding: 10px 26px 22px; font-size: 26px; position: relative; z-index: 2; background: #fff; }
.igtop span { display: block; font-size: 20px; color: #777; }
.av { width: 86px; height: 86px; border-radius: 50%; background: conic-gradient(from 20deg, var(--y), #ff7a00, #e1306c, var(--y)); padding: 5px; flex: none; }
.av.big { width: 130px; height: 130px; margin: 0 auto 14px; }
.av.sm { width: 64px; height: 64px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.grid i { aspect-ratio: 1; background: hsl(var(--h) 18% 80%); position: relative; }
.grid i.of { background: #141414; display: grid; place-items: center; }
.grid i.of b { background: var(--y); color: #141414; font-size: 22px; font-weight: 900; padding: 6px 10px; border-radius: 6px; }
@keyframes scrollgrid { from { transform: translateY(0) } to { transform: translateY(-1380px) } }
.swipe { position: absolute; left: 50%; top: 700px; width: 70px; height: 70px; margin-left: -35px; border-radius: 50%; background: rgba(0,0,0,.28); opacity: 0; }
@keyframes swipe { 0% { opacity: 0; transform: translateY(120px) } 20% { opacity: .7 } 100% { opacity: 0; transform: translateY(-260px) } }
.giveup { position: absolute; left: 40px; right: 40px; top: 430px; padding: 30px; border-radius: 30px; background: rgba(20,20,20,.92); color: #fff; font-size: 34px; font-weight: 800; text-align: center; opacity: 0; }
/* 4: link da bio */
.bio { position: absolute; inset: 0; padding: 110px 34px 0; background: linear-gradient(180deg, #faf6e6, #fff 40%); text-align: center; }
.bio .nm { display: block; font-size: 30px; margin-bottom: 30px; }
.btn { position: relative; height: 104px; margin-bottom: 24px; border-radius: 26px; background: #141414; color: #fff; font-size: 27px; font-weight: 700; display: grid; place-items: center; }
.btn em { position: absolute; right: 18px; top: 50%; margin-top: -24px; width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-weight: 900; opacity: 0; }
.btn.ok em { background: #22c55e; } .btn.erro em { background: #ef4444; }
@keyframes press { 40% { transform: scale(.95) } 100% { transform: none } }
@keyframes shake { 15% { transform: translateX(-14px) } 30% { transform: translateX(12px) } 45% { transform: translateX(-9px) } 60% { transform: translateX(6px); background: #b91c1c } 100% { transform: none; background: #7f1d1d } }
.toast { position: absolute; left: 30px; right: 30px; bottom: 60px; background: #ef4444; color: #fff; font-size: 27px; font-weight: 800; padding: 26px; border-radius: 24px; opacity: 0; }
/* 5: WhatsApp de madrugada */
.wa { position: absolute; inset: 0; padding-top: 80px; background: #0b141a; color: #e9edef; }
.wahead { display: flex; gap: 16px; align-items: center; padding: 14px 24px; background: #1f2c34; font-size: 26px; }
.wahead span { display: block; font-size: 19px; color: #8696a0; }
.clock { position: absolute; top: 210px; left: 0; right: 0; text-align: center; font-size: 110px; font-weight: 800; letter-spacing: -0.04em; color: #fff; }
.clock span { position: absolute; left: 0; right: 0; visibility: hidden; }
.sky { position: absolute; top: 350px; left: 0; right: 0; height: 70px; }
.sky span { position: absolute; left: 50%; width: 64px; margin-left: -32px; }
.sky .lua { color: #c7d2fe; } .sky .sol { color: var(--y); opacity: 0; }
.msg { position: absolute; right: 24px; top: 520px; max-width: 360px; padding: 16px 20px 12px; border-radius: 20px 6px 20px 20px; background: #005c4b; font-size: 26px; line-height: 1.3; opacity: 0; }
.msg small { display: block; text-align: right; font-size: 18px; color: #9fb7b0; margin-top: 6px; }
.nada { position: absolute; left: 0; right: 0; top: 700px; text-align: center; font-size: 22px; color: #8696a0; letter-spacing: .12em; text-transform: uppercase; opacity: 0; }
.dim { position: absolute; inset: 0; pointer-events: none; }
@keyframes night { 0% { background: rgba(0,0,0,0) } 60% { background: rgba(0,0,0,.25) } 100% { background: rgba(255,214,120,.10) } }
.notif.lost { position: absolute; left: 22px; right: 22px; top: 96px; background: rgba(40,40,40,.95); color: #fff; opacity: 0; z-index: 5; }
.notif.lost i { background: #ef4444; }

/* legenda */
.cap { position: absolute; left: 90px; right: 150px; top: 1350px; text-align: center; visibility: hidden; }
.kick { font-size: 30px; font-weight: 600; color: #9b9b9b; letter-spacing: .04em; }
.dash { width: 46px; height: 4px; border-radius: 2px; background: var(--y); margin: 22px auto 24px; }
.head { font-size: 66px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; text-wrap: balance; }
.w { display: inline-block; }
.y { color: var(--y); }

/* final: partículas viram o logo */
.final { position: absolute; inset: 0; visibility: hidden; }
.pt { position: absolute; left: 540px; top: 700px; width: 7px; height: 7px; border-radius: 50%; background: var(--y); opacity: 0; }
@keyframes converge { 0% { opacity: 0; transform: translate(var(--x), var(--y)) } 30% { opacity: .9 } 100% { opacity: 0; transform: translate(0, 0) scale(.3) } }
.logo { position: absolute; left: 50%; top: 520px; width: 360px; margin-left: -180px; opacity: 0; filter: drop-shadow(0 18px 40px rgba(255,204,0,.25)); }
@keyframes logoin { from { opacity: 0; transform: scale(.4) rotateY(70deg) } to { opacity: 1; transform: none } }
.tec { position: absolute; left: 0; right: 0; top: 880px; text-align: center; font-size: 30px; letter-spacing: .55em; color: var(--y); font-weight: 600; opacity: 0; }
.fh { position: absolute; left: 90px; right: 150px; top: 1040px; text-align: center; font-size: 84px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
.pill { display: flex; align-items: center; gap: 18px; white-space: nowrap;
  background: var(--y); color: #111; font-size: 32px; font-weight: 800; padding: 26px 40px; border-radius: 100px; opacity: 0; }
.pillwrap { position: absolute; left: 90px; right: 150px; top: 1290px; display: flex; justify-content: center; }
.pill svg { width: 42px; height: 42px; }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,204,0,.45) } 50% { box-shadow: 0 0 0 22px rgba(255,204,0,0) } }
.handle { position: absolute; left: 0; right: 60px; bottom: 300px; text-align: center; font-size: 28px; font-weight: 600; color: #8d8d8d; }
</style></head><body>
<div class="floor"></div>
<div class="stage"><div class="phone"><div class="glass">
  <div class="island"></div>
  <div class="status"><span class="tm">09:41</span><span class="r">${icons.sig}<span class="g4">4G</span><span class="wf">${icons.wifi}</span>${icons.bat}</span></div>
  ${t1}${t2}${t3}${t4}${t5}
</div></div></div>
${caps.join("")}
${finale}
<div class="handle">@_vgtecnologia</div>
<script>window.seek = (ms) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = ms; } };</script>
</body></html>`;

const htmlFile = path.join(out, "motion.html");
writeFileSync(htmlFile, html);
if (process.env.SO_HTML) process.exit(0);

// ---------- áudio ----------
const voices = voz.map((pcm, i) => pcm && { at: start[i] + 0.35, pcm }).filter(Boolean);
const wav = path.join(out, "motion.wav");
writeFileSync(wav, soundtrack(total, [], 11, voices));

// ---------- captura quadro a quadro ----------
const { send, close } = await chrome(process.env.BROWSER || "google-chrome");
try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const C = (m, p) => send(m, p, sessionId);
  await C("Page.enable");
  await C("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await C("Page.navigate", { url: pathToFileURL(htmlFile).href });
  for (let i = 0; i < 100; i++) {
    const r = await C("Runtime.evaluate", { expression: "document.readyState==='complete'&&document.fonts.status==='loaded'&&typeof seek==='function'", returnByValue: true });
    if (r.result.value) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  const only = process.env.QUADROS; // ex.: "2,7.5,12" tira só esses instantes em PNG, para conferir
  if (only) {
    for (const t of only.split(",").map(Number)) {
      await C("Runtime.evaluate", { expression: `seek(${t * 1000})` });
      const { data } = await C("Page.captureScreenshot", { format: "jpeg", quality: 85 });
      writeFileSync(path.join(out, `q-${t}.jpg`), Buffer.from(data, "base64"));
    }
  } else {
    const enc = spawn(process.env.FFMPEG || "ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
      "-i", wav, "-c:v", "libx264", "-profile:v", "high", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", String(FPS),
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", path.join(out, "reel.mp4")], { stdio: ["pipe", "inherit", "pipe"] });
    let err = ""; enc.stderr.on("data", (d) => (err += d));
    const done = new Promise((ok, fail) => enc.on("exit", (c) => (c === 0 ? ok() : fail(new Error(err)))));
    for (let k = 0; k < Math.round(total * FPS); k++) {
      await C("Runtime.evaluate", { expression: `seek(${((k / FPS) * 1000).toFixed(2)})` });
      const { data } = await C("Page.captureScreenshot", { format: "jpeg", quality: 92 });
      if (!enc.stdin.write(Buffer.from(data, "base64"))) await new Promise((r) => enc.stdin.once("drain", r));
    }
    enc.stdin.end(); await done;
    console.log(`motion em ${path.relative(process.cwd(), out)}/reel.mp4`);
  }
} finally { close(); rmSync(wav, { force: true }); }
