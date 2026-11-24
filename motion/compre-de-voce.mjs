// Versão "motion" (animada do zero) do reel de 26/11, no estilo do reel de lançamento: celular em 3D no
// fundo escuro, a tela de dentro ganhando vida, legenda embaixo com palavras em amarelo e o logo no fim.
// Usa a mesma locução e trilha do reel.mjs. Protótipo para o dono escolher entre esta e a versão de lâminas.
//   REEL_VOZ_DIR=pasta-com-voz-1..6.wav BROWSER=google-chrome node motion/compre-de-voce.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { narrate, soundtrack, chrome } from "../reel.mjs";
import { ic, appIcon, tile, status, homeBar, css, waWallpaper } from "./kit.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const ID = "2026-11-26";
const W = 1080, H = 1920, FPS = 30;
const post = JSON.parse(readFileSync(path.join(root, "posts", `${ID}.json`), "utf8"));
// MOTION_OUT: chamado pelo render.mjs, grava direto em out/ID (reel.mp4 e a capa 1.jpg)
const out = process.env.MOTION_OUT || path.join(root, "out", `${ID}-motion`);
mkdirSync(out, { recursive: true });

// ---------- linha do tempo: cada cena dura a fala dela ----------
const voz = narrate(post, out, process.env.FFMPEG || "ffmpeg", ID);
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

// ---------- as telas (peças do kit) ----------
const A = anim;
const tap = (x, y, at, esc = false) => `<div class="tap${esc ? " esc" : ""}" style="left:${x - 55}px;top:${y - 55}px;animation:${A("tap", 0.6, at, "ease-out")}"></div>`;

// 1. tela de bloqueio com as notificações da Black
const notifs = [
  ["loja", "Sua Loja", "agora", "Black Friday começa amanhã", "Até 50% off na loja toda. Já separe a sua lista."],
  ["carrinho", "Carrinho", "2 min", "Seu carrinho está esperando", "2 itens separados para você · R$ 289,80"],
  ["oferta", "Ofertas", "5 min", "Últimas horas de frete grátis", "Compras acima de R$ 199 até meia-noite."],
];
const t1 = screen(0, `
  <div class="lock">
    ${status({ hora: "", escuro: true, anim: A })}
    <div class="ldate" style="animation:${A("rise", 0.7, 0.5)}">sexta-feira, 27 de novembro</div>
    <div class="lclock" style="animation:${A("rise", 0.7, 0.6)}">9:41</div>
    ${notifs.map(([k, app, q, t, b], n) => `
    <div class="nt" style="animation:${A("drop", 0.6, 1.3 + n * 0.5, "cubic-bezier(.34,1.4,.64,1)")}">${appIcon(k, 56)}
      <div class="tx"><div class="l1"><span>${esc(t)}</span><em>${q}</em></div><div class="l2">${esc(b)}</div></div></div>`).join("")}
    <div class="lbot"><span>${ic.lanterna}</span><span>${ic.camera}</span></div>
    ${homeBar(true)}
  </div>`);

// 2. Central de Controle (desliga o Wi-Fi) e depois o Safari carregando no 4G
const desliga = S(1, 1.0), abre = S(1, 1.9), dSaf = Math.max(2.2, dur[1] - 2.4);
const t2 = screen(1, `
  ${status({ hora: "9:41", escuro: true, trocaRede: desliga, anim: A })}
  <div class="cc">
    <div class="mod con">
      <span class="bt on-o">${ic.aviao}</span><span class="bt on-g">${ic.antena}</span>
      <span class="bt on-b" style="animation:${A("wifioff", 0.3, desliga, "ease")}">${ic.wifi}</span><span class="bt on-b">${ic.bt}</span>
    </div>
    <div class="mod mus"><div><b>Não está tocando</b><br><span>Música</span></div><div class="ctl">${ic.prev}${ic.play}${ic.next}</div></div>
    <div class="mod sq">${ic.rotacao}</div><div class="mod sq">${ic.espelhar}</div>
    <div class="mod sld" style="--v:62%">${ic.sol}</div><div class="mod sld" style="--v:40%">${ic.som}</div>
    <div class="mod wide">${ic.espelhar}<span>Espelhar Tela</span></div>
    <div class="mod sq">${ic.lanterna}</div><div class="mod sq">${ic.timer}</div><div class="mod sq">${ic.calc}</div><div class="mod sq">${ic.camera}</div>
  </div>
  ${tap(88, 250, desliga - 0.12)}
  <div class="saf" style="opacity:0;animation:${A("subir", 0.6, abre, "cubic-bezier(.2,.9,.25,1)")}">
    ${status({ hora: "9:41", net: "4g", anim: A })}
    <div class="site">
      <div class="shead"><span class="slogo">sua<i>loja</i></span><span class="burger"></span></div>
      <div class="hero"><div class="img" style="animation:${A("focus", dSaf, abre + 0.3, "cubic-bezier(.6,0,.9,.4)")}"></div><div class="spin"></div></div>
      <div class="ln"></div><div class="ln s"></div><div class="ln"></div><div class="ln s"></div>
    </div>
    <div class="bar">
      <div class="addr">${ic.cadeado}<span>sualoja.com.br</span><span class="rl">${ic.recarregar}</span><b class="prog" style="animation:${A("load", dSaf, abre + 0.2, "cubic-bezier(.2,.1,.3,1)")}"></b></div>
      <div class="tools">${ic.voltar}<span class="off">${ic.avancar}</span>${ic.share}${ic.livro}${ic.abas}</div>
    </div>
    <div class="timer" style="opacity:0;animation:${A("pop", 0.5, abre + 0.5, "cubic-bezier(.34,1.56,.64,1)")}">
      <span class="num" style="animation:${A("contaS", dSaf - 0.3, abre + 0.5, "linear")}, ${A("contaD", 1, abre + 0.5, "linear", `${(dSaf - 0.3).toFixed(2)} both`)}"></span><small>até aparecer alguma coisa</small></div>
    ${homeBar(false)}
  </div>`);
const segundosSaf = Math.round((dSaf - 0.3) * 1.7);

// 3. perfil da loja no Instagram, rolando sem achar a oferta
const dIg = Math.max(2.6, dur[2] - 1.3);
const destaques = [["Novidades", "#f6e7d8", "#d0643b", ic.etiqueta], ["Black", "#111", "#ffcc00", ic.etiqueta], ["Provador", "#e4ecf7", "#1f3b73", ic.camera], ["Entregas", "#e8f3ea", "#2f7d4f", ic.casa], ["Avaliações", "#fbf1d9", "#c98a12", ic.emoji]];
const t3 = screen(2, `
  <div class="ig">
    ${status({ hora: "9:42", net: "4g", anim: A })}
    <div class="top">${ic.voltar}<span>sualoja</span><span class="sp"></span>${ic.sino}${ic.pontos}</div>
    <div class="feed" style="animation:${A("rolar", dIg, S(2, 0.6), "cubic-bezier(.45,.05,.25,1)")}">
      <div class="prof"><span class="ring"><b>SL</b></span>
        <div class="stats"><div><b>1.248</b>posts</div><div><b>32,4 mil</b>seguidores</div><div><b>412</b>seguindo</div></div></div>
      <div class="bio"><b>Sua Loja</b><br><span class="cat">Loja de roupas</span><br>Moda feminina e masculina · Curitiba<br>Entregamos para todo o Brasil<br><span class="lk">sualoja.com.br/black</span></div>
      <div class="acts"><span class="seg">Seguir</span><span>Mensagem</span><span class="ad">${ic.addpessoa}</span></div>
      <div class="hl">${destaques.map(([n, bg, c, i]) => `<div><i><span style="background:${bg};color:${c}">${i}</span></i>${n}</div>`).join("")}</div>
      <div class="tabs"><span class="on">${ic.grade}</span><span>${ic.reels}</span><span>${ic.marcado}</span></div>
      <div class="grid">${Array.from({ length: 33 }, (_, k) => tile(k, { oferta: k === 31 })).join("")}</div>
    </div>
    <div class="nav">${ic.casa}${ic.lupa}${ic.mais}${ic.reels}<span class="me"></span></div>
    ${[0, 1, 2, 3].map((n) => `<div class="tap esc" style="left:180px;top:640px;animation:${A("arrasta", 0.55, S(2, 0.55 + n * (dIg / 4.6)), "ease-in-out")}"></div>`).join("")}
    <div class="toast" style="top:400px;opacity:0;animation:${A("pop", 0.5, S(2, dur[2] - 1.45), "cubic-bezier(.34,1.56,.64,1)")}">${ic.xis}<div>O cliente fechou o app<small>e não viu a oferta</small></div></div>
    ${homeBar(false)}
  </div>`);

// 4. link da bio: toca em cada botão; um deles dá 404
const botoes = [["#25d366", ic.whatsapp, "Fale no WhatsApp", true], ["#111", ic.globo, "Loja online", true], ["#e0263f", ic.etiqueta, "Ofertas da Black Friday", false], ["#c98a12", ic.livro, "Catálogo 2026", true]];
const passo = Math.max(0.6, (dur[3] - 2.0) / 4);
const at4 = (k) => S(3, 0.8 + k * passo);
const t4 = screen(3, `
  <div class="lb">
    ${status({ hora: "9:43", net: "4g", anim: A })}
    <div class="ub">${ic.cadeado}<span>link.bio/sualoja</span></div>
    <div class="av"><b>SL</b></div>
    <div class="nm">@sualoja</div><div class="ds">Moda feminina e masculina · Curitiba</div>
    ${botoes.map(([c, i, t, ok], k) => `
    <div class="bt" style="animation:${A(ok ? "press" : "shake", 0.5, at4(k), "ease")}"><span class="bi" style="background:${c}">${i}</span>${t}
      <span class="st ${ok ? "ok" : "er"}" style="animation:${A("pop", 0.4, at4(k) + 0.18, "cubic-bezier(.34,1.56,.64,1)")}">${ok ? ic.check : ic.xis}</span></div>`).join("")}
    ${botoes.map((_, k) => tap(234, 428 + k * 108, at4(k) - 0.08, true)).join("")}
    <div class="toast" style="bottom:70px;opacity:0;animation:${A("drop", 0.5, at4(2) + 0.25, "cubic-bezier(.34,1.4,.64,1)")}"><span style="color:#ff453a">${ic.alerta}</span><div>Página não encontrada<small>Erro 404 · o link da oferta está quebrado</small></div></div>
    <div class="ft">Feito com link.bio</div>
    ${homeBar(false)}
  </div>`);

// 5. WhatsApp às 23h: mensagem sem resposta até de manhã
const horas = [["23:04", 0], ["23:51", 0.38], ["01:27", 0.5], ["04:10", 0.6], ["08:12", 0.7]];
const dWa = Math.max(2.4, dur[4] - 1.0), h0 = S(4, 1.4);
const hAt = (p) => h0 + p * dWa;
const t5 = screen(4, `
  <div class="wa">
    <div class="wall" style="background-image:${waWallpaper}"></div>
    ${status({ hora: "23:04", escuro: true, anim: A }).replace('<span class="hr">23:04</span>', `<span class="hr" style="animation:${A("hide", 0.3, h0, "ease")}">23:04</span>`)}
    <div class="hd"><span class="bk">${ic.voltar}12</span><span class="av"><b>SL</b></span>
      <div class="nm"><b>Sua Loja</b><span>visto por último hoje às 18:02</span></div><svg class="i" viewBox="0 0 24 24">${ic.video.slice(ic.video.indexOf(">") + 1, -6)}</svg><svg class="i" viewBox="0 0 24 24">${ic.fone.slice(ic.fone.indexOf(">") + 1, -6)}</svg></div>
    <div class="chip">HOJE</div>
    <div class="msg" style="opacity:0;animation:${A("drop", 0.5, S(4, 0.6), "cubic-bezier(.34,1.4,.64,1)")}">Oi! A promoção da Black Friday ainda está valendo? Queria fechar hoje.<small>23:04 ${ic.tique2}</small></div>
    <div class="inp"><span class="pl">${ic.mais.replace('rx="5"', 'rx="12"')}</span><div class="box"><span class="gr">Mensagem</span>${ic.figurinha}${ic.camera}</div><span class="mic">${ic.mic}</span></div>
    <div class="noite" style="animation:${A("noite", dWa, h0, "linear")}"></div>
    <div class="relogio" style="opacity:0;animation:${A("rise", 0.5, h0 - 0.2)}">
      <div class="h">${horas.map(([h, p], k) => `<span style="animation:${A("show", 0.01, hAt(p), "linear")}${k < horas.length - 1 ? `, ${A("hide", 0.01, hAt(horas[k + 1][1]), "linear")}` : ""}">${h}</span>`).join("")}</div>
      <div class="ce"><span class="lua" style="animation:${A("hide", 0.5, hAt(0.66), "ease")}">${ic.lua}</span><span class="sol" style="animation:${A("pop", 0.6, hAt(0.7), "ease")}">${ic.sol}</span></div>
      <div class="leg">sem resposta</div>
    </div>
    <div class="nt ban" style="opacity:0;animation:${A("drop", 0.6, S(4, dur[4] - 1.5), "cubic-bezier(.34,1.4,.64,1)")}">${appIcon("carrinho", 56)}
      <div class="tx"><div class="l1"><span>Pedido confirmado</span><em>08:12</em></div><div class="l2">Sua compra na Loja Concorrente foi aprovada.</div></div></div>
    ${homeBar(true)}
  </div>`);

const caps = [
  caption(0, "Teste rápido · só com o celular", "Antes de sexta, *compre de você mesmo.*"),
  caption(1, "1 · Desligue o Wi-Fi", "Abra o seu site no *4G,* como o cliente na rua."),
  caption(2, "2 · Ache a oferta", "Se você demora para achar, o cliente *desiste antes.*"),
  caption(3, "3 · Clique em todo botão", "Link quebrado custa venda *em silêncio.*"),
  caption(4, "4 · Mande mensagem às 23h", "Silêncio até de manhã é cliente *indo embora.*"),
];
const c6 = start[5];
const finale = `
  <div class="final" style="animation:${A("show", 0.01, c6, "linear")}">
    ${Array.from({ length: 90 }, (_, k) => { const a = (k * 137.5) % 360, r = 260 + (k * 53) % 420; return `<i class="pt" style="--x:${(Math.cos(a) * r).toFixed(0)}px;--y:${(Math.sin(a) * r).toFixed(0)}px;animation:${A("converge", 1.0, c6 + 0.2 + (k % 10) * 0.025, "cubic-bezier(.6,0,.2,1)")}"></i>`; }).join("")}
    <img class="logo" src="../../assets/logo.png" style="animation:${A("logoin", 0.9, c6 + 1.0, "cubic-bezier(.2,1.3,.4,1)")}">
    <div class="tec" style="animation:${A("rise", 0.6, c6 + 1.4)}">TECNOLOGIA</div>
    <div class="fh">${"Travou em algum".split(" ").map((w, k) => `<span class="w" style="animation:${A("word", 0.6, c6 + 1.7 + k * 0.07)}">${w}</span>`).join(" ")} <span class="w y" style="animation:${A("word", 0.6, c6 + 1.95)}">passo?</span></div>
    <div class="ctaw" style="animation:${A("rise", 0.6, c6 + 2.4)}"><span class="wabtn" style="animation:${A("pulso", 1.4, c6 + 3.0, "ease-in-out", "infinite")}">${ic.whatsapp}Chamar no WhatsApp</span><small>O link está na bio</small></div>
  </div>`;

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face { font-family: "Inter Tight"; font-weight: 100 900; src: url("../../fonts/inter-tight-latin-wght-normal.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F, U+2212; }
@font-face { font-family: "Inter Tight"; font-weight: 100 900; src: url("../../fonts/inter-tight-latin-ext-wght-normal.woff2") format("woff2"); unicode-range: U+0100-02BA, U+1E00-1EFF; }
@property --n { syntax: "<integer>"; inherits: false; initial-value: 0; }
@property --d { syntax: "<integer>"; inherits: false; initial-value: 0; }
:root { --y: #ffcc00; --ease: cubic-bezier(.16,1,.3,1); }
* { margin: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #0b0b0c; }
body { font-family: "Inter Tight", sans-serif; color: #f2f2f2; -webkit-font-smoothing: antialiased; position: relative;
  background: radial-gradient(120% 70% at 50% 38%, #1d1d20 0%, #0b0b0c 70%); }
.floor { position: absolute; left: 160px; right: 160px; top: 1240px; height: 70px; border-radius: 50%; background: rgba(0,0,0,.8); filter: blur(28px); }
@keyframes show { from { visibility: hidden } to { visibility: visible } }
@keyframes hide { to { visibility: hidden; opacity: 0 } }
@keyframes rise { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: none } }
@keyframes word { from { opacity: 0; transform: translateY(46px); filter: blur(8px) } to { opacity: 1; transform: none; filter: none } }
@keyframes grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes pop { from { opacity: 0; transform: scale(.6) } to { opacity: 1; transform: none } }
@keyframes drop { from { opacity: 0; transform: translateY(-40px) scale(.96) } to { opacity: 1; transform: none } }
@keyframes subir { from { opacity: 1; transform: translateY(100%) } to { opacity: 1; transform: none } }
@keyframes capout { to { opacity: 0; transform: translateY(-24px); filter: blur(6px) } }
@keyframes contaS { from { --n: 0 } to { --n: ${segundosSaf} } }
@keyframes contaD { from { --d: 0 } to { --d: 9 } }
@keyframes rolar { 0% { transform: translateY(0) } 100% { transform: translateY(-1650px) } }
@keyframes arrasta { 0% { opacity: 0; transform: translateY(160px) scale(.7) } 25% { opacity: .55 } 100% { opacity: 0; transform: translateY(-220px) scale(.7) } }
${css}

/* celular em 3D, sempre se mexendo um pouco */
.stage { position: absolute; left: 0; right: 0; top: 0; height: 1320px; perspective: 2600px; }
.phone { position: absolute; left: 290px; top: 215px; width: 500px; height: 1030px; border-radius: 82px; transform-style: preserve-3d;
  background: linear-gradient(145deg, #4a4a50, #17171a 40%, #2c2c30 75%, #4a4a50); padding: 16px;
  box-shadow: inset 0 0 0 2px #5a5a60, inset 0 0 0 6px #0d0d0e, 0 60px 120px -30px rgba(0,0,0,.9);
  animation: ${A("enter", 1.1, 0, "cubic-bezier(.2,.9,.25,1)")}, ${A("float", total, 1.1, "ease-in-out")}, ${A("leave", 0.9, c6, "cubic-bezier(.7,0,.3,1)")}; }
.phone .side { position: absolute; width: 6px; border-radius: 3px; background: linear-gradient(90deg, #2a2a2e, #55555b); }
@keyframes enter { from { transform: translateY(700px) rotateX(35deg) rotateY(-25deg) } to { transform: rotateX(8deg) rotateY(-16deg) } }
@keyframes float { 0% { transform: rotateX(8deg) rotateY(-16deg) } 25% { transform: rotateX(4deg) rotateY(-6deg) translateY(-14px) }
  50% { transform: rotateX(7deg) rotateY(10deg) } 75% { transform: rotateX(3deg) rotateY(-2deg) translateY(-10px) } 100% { transform: rotateX(6deg) rotateY(-12deg) } }
@keyframes leave { to { transform: translateY(-180px) rotateX(10deg) scale(.55); opacity: 0; filter: blur(10px) } }
.glass { position: absolute; inset: 16px; border-radius: 66px; overflow: hidden; background: #000; }
.glass::after { content: ""; position: absolute; inset: 0; background: linear-gradient(115deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 36%); pointer-events: none; z-index: 40; }
.island { position: absolute; top: 16px; left: 50%; width: 140px; height: 40px; margin-left: -70px; border-radius: 30px; background: #000; z-index: 45; }
.scr { position: absolute; inset: 0; visibility: hidden; overflow: hidden; }
@keyframes scrin { from { visibility: visible; transform: translateX(105%) } to { visibility: visible; transform: none } }
@keyframes scrout { from { visibility: visible } to { visibility: visible; transform: translateX(-105%) } }

/* legenda */
.cap { position: absolute; left: 90px; right: 150px; top: 1350px; text-align: center; visibility: hidden; }
.kick { font-size: 30px; font-weight: 600; color: #9b9b9b; letter-spacing: .04em; }
.dash { width: 46px; height: 4px; border-radius: 2px; background: var(--y); margin: 22px auto 24px; }
.head { font-size: 66px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; text-wrap: balance; }
.w { display: inline-block; } .y { color: var(--y); }

/* final: partículas viram o logo, e o botão de WhatsApp */
.final { position: absolute; inset: 0; visibility: hidden; }
.pt { position: absolute; left: 540px; top: 690px; width: 7px; height: 7px; border-radius: 50%; background: var(--y); opacity: 0; }
@keyframes converge { 0% { opacity: 0; transform: translate(var(--x), var(--y)) } 30% { opacity: .9 } 100% { opacity: 0; transform: translate(0, 0) scale(.3) } }
.logo { position: absolute; left: 50%; top: 500px; width: 380px; margin-left: -190px; opacity: 0; filter: drop-shadow(0 18px 40px rgba(255,204,0,.25)); }
@keyframes logoin { from { opacity: 0; transform: scale(.4) rotateY(70deg) } to { opacity: 1; transform: none } }
.tec { position: absolute; left: 0; right: 0; top: 870px; text-align: center; font-size: 30px; letter-spacing: .55em; color: var(--y); font-weight: 600; opacity: 0; }
.fh { position: absolute; left: 90px; right: 150px; top: 1020px; text-align: center; font-size: 84px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
.ctaw { position: absolute; left: 90px; right: 150px; top: 1270px; display: flex; flex-direction: column; align-items: center; gap: 22px; opacity: 0; }
.ctaw small { font-size: 28px; font-weight: 600; color: #9b9b9b; }
@keyframes pulso { 0%, 100% { box-shadow: 0 16px 40px rgba(37,211,102,.35), 0 0 0 0 rgba(37,211,102,.5), inset 0 -4px 0 rgba(0,0,0,.12) } 50% { box-shadow: 0 16px 40px rgba(37,211,102,.35), 0 0 0 22px rgba(37,211,102,0), inset 0 -4px 0 rgba(0,0,0,.12) } }
.handle { position: absolute; left: 0; right: 60px; bottom: 300px; text-align: center; font-size: 28px; font-weight: 600; color: #8d8d8d; }
</style></head><body>
<div class="floor"></div>
<div class="stage"><div class="phone">
  <span class="side" style="left:-4px;top:200px;height:60px"></span><span class="side" style="left:-4px;top:290px;height:100px"></span><span class="side" style="left:-4px;top:410px;height:100px"></span><span class="side" style="right:-4px;top:300px;height:150px"></span>
  <div class="glass"><div class="island"></div>
  ${t1}${t2}${t3}${t4}${t5}
</div></div></div>
${caps.join("")}
${finale}

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
    // capa do reel no perfil: o quadro com o título da primeira cena já escrito
    if (process.env.MOTION_OUT) {
      const c = (await import("node:child_process")).spawnSync(process.env.FFMPEG || "ffmpeg", ["-y", "-loglevel", "error", "-ss", String(start[0] + 2.8), "-i", path.join(out, "reel.mp4"), "-frames:v", "1", "-q:v", "2", path.join(out, "1.jpg")]);
      if (c.status !== 0) throw new Error(`capa: ${c.stderr}`);
    }
    console.log(`motion em ${path.relative(process.cwd(), out)}/reel.mp4`);
  }
} finally { close(); rmSync(wav, { force: true }); }
