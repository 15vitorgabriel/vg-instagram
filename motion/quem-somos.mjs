// Reel "Quem é a VG": apresentação da empresa com o texto do site (Sobre Nós), valores, objetivo, como trabalhamos e o
// versículo de Colossenses 3:23 que está no site. Tipografia animada, sem celular nem notebook (isso é o reel de lançamento).
import { rodar } from "./motor.mjs";
import { ic } from "./kit.mjs";

const svg = (d, extra = "") => `<svg viewBox="0 0 24 24" ${extra}><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;
const i = {
  alvo: svg(`<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="m15 9 5.5-5.5M17 3.5h3.5V7"/>`),
  codigo: svg(`<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>`),
  engrenagem: svg(`<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/><circle cx="12" cy="12" r="6.5"/>`),
  aperto: svg(`<path d="M2.5 11.5 6 8l3.5 1.5L12 8l4 1 5.5 2.5"/><path d="m6 8 6.5 7a1.6 1.6 0 0 0 2.3-2.2M10.5 15.2a1.6 1.6 0 0 0 2.3-.1M8.4 13a1.6 1.6 0 0 0 2.2 2.2M16 9.5l3 4.5-4.3 2"/><path d="M2.5 11.5 8 17"/>`),
  escudo: svg(`<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>`),
  olho: svg(`<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`),
  conversa: svg(`<path d="M4 5h16v10H9l-5 4z"/><path d="M8 9h8M8 12h5"/>`),
  regua: svg(`<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>`),
  foguete: svg(`<path d="M12 3c3.5 2 5 5.5 5 9l-2.5 3h-5L7 12c0-3.5 1.5-7 5-9z"/><circle cx="12" cy="9.5" r="1.6"/><path d="M9.5 15 8 20l4-2 4 2-1.5-5"/>`),
  suporte: svg(`<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M20 19c0 1.5-2 2.5-5 2.5h-2"/>`),
};

await rodar({
  id: "2026-11-28-2",
  minimo: [5.5, 8.5, 9, 8.5, 7.5, 9.5, 10, 9],
  capa: 3.2,
  montar: ({ A, S, start, dur, total, cena, legenda, palavras }) => {
    const pts = (n, cx, cy, at) => Array.from({ length: n }, (_, k) => { const a = (k * 137.5) % 360, r = 240 + (k * 53) % 420; return `<i class="pt" style="left:${cx}px;top:${cy}px;--x:${(Math.cos(a) * r).toFixed(0)}px;--y:${(Math.sin(a) * r).toFixed(0)}px;animation:${A("converge", 1.0, at + (k % 10) * 0.025, "cubic-bezier(.6,0,.2,1)")}"></i>`; }).join("");
    // poeira dourada flutuando no fundo, o vídeo todo (pontos pequenos, sem círculo grande)
    const poeira = Array.from({ length: 34 }, (_, k) => `<i class="pd" style="left:${(k * 211) % 1080}px;top:${(k * 389) % 1700}px;--s:${2 + (k % 3)}px;animation:${A("flutua", total, 0, "linear")};animation-delay:-${(k * 1.7) % 20}s"></i>`).join("");

    // 0. Prazer, VG Tecnologia
    const c0 = cena(0, `${pts(90, 540, 640, 0.15)}
      <img class="logo" src="../../assets/logo.png" style="animation:${A("logoin", 1.0, 0.9, "cubic-bezier(.2,1.3,.4,1)")}">
      <div class="tec" style="animation:${A("rise", 0.7, 1.4)}">TECNOLOGIA</div>
      ${legenda(0, "Quem é a VG", "Prazer, *VG Tecnologia.*", { em: 1.6 })}`);

    // 1. Quem somos: gráfico subindo + chips do que fazemos
    const c1 = cena(1, `
      <div class="painel" style="animation:${A("rise", 0.8, S(1, 0.1))}">
        <svg class="graf" viewBox="0 0 760 520">
          ${[0, 1, 2, 3, 4].map((k) => `<path d="M40 ${60 + k * 100}H720" stroke="rgba(255,255,255,.07)" stroke-width="2"/>`).join("")}
          <path class="area" d="M40 470 C150 450 210 400 290 380 S430 300 500 250 S640 120 720 70 V480 H40Z" fill="url(#g)" style="animation:${A("aparece", 1.2, S(1, 1.4), "ease")}"/>
          <path class="linha" d="M40 470 C150 450 210 400 290 380 S430 300 500 250 S640 120 720 70" fill="none" stroke="#ffcc00" stroke-width="7" stroke-linecap="round" pathLength="1" style="animation:${A("desenha", 2.2, S(1, 0.6), "cubic-bezier(.6,.1,.2,1)")}"/>
          ${[[290, 380, 1.4], [500, 250, 2.0], [720, 70, 2.7]].map(([x, y, t]) => `<circle cx="${x}" cy="${y}" r="12" fill="#141414" stroke="#ffcc00" stroke-width="6" style="transform-origin:${x}px ${y}px;animation:${A("pop", 0.5, S(1, t), "cubic-bezier(.34,1.56,.64,1)")}"/>`).join("")}
          <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcc00" stop-opacity=".28"/><stop offset="1" stop-color="#ffcc00" stop-opacity="0"/></linearGradient></defs>
        </svg>
        ${[["Sites", 60, 1.6], ["Sistemas", 290, 2.2], ["Automações", 470, 2.8]].map(([t, x, at]) => `<span class="chip" style="left:${x}px;animation:${A("pop", 0.5, S(1, at), "cubic-bezier(.34,1.56,.64,1)")}">${t}</span>`).join("")}
      </div>
      ${legenda(1, "Quem somos", "Soluções digitais profissionais que geram *resultados reais.*")}`);

    // 2. Estratégia + tecnologia + automação: três peças que se encaixam
    const pecas = [["Estratégia", i.alvo, -1], ["Tecnologia", i.codigo, 0], ["Automação", i.engrenagem, 1]];
    const c2 = cena(2, `
      <div class="pecas">
        ${pecas.map(([t, ico, lado], k) => `<div class="peca" style="--lado:${lado};animation:${A("encaixa", 0.9, S(2, 0.5 + k * 0.55), "cubic-bezier(.2,.9,.25,1)")}">
          <span class="pi">${ico}</span><b>${t}</b></div>`).join("")}
        <svg class="liga" viewBox="0 0 760 40"><path d="M130 20H630" stroke="#ffcc00" stroke-width="4" stroke-dasharray="10 12" pathLength="1" style="animation:${A("desenha", 1.0, S(2, 2.3), "ease")}"/></svg>
        <div class="soma" style="animation:${A("pop", 0.6, S(2, 2.9), "cubic-bezier(.34,1.56,.64,1)")}">${ic.check}<span>Negócios crescendo de forma moderna e eficiente</span></div>
      </div>
      ${legenda(2, "Como trabalhamos", "*Estratégia, tecnologia e automação* juntas.")}`);

    // 3. Valores
    const valores = [["Honestidade", i.aperto], ["Seriedade", i.escudo], ["Transparência", i.olho]];
    const c3 = cena(3, `
      <div class="valores">
        ${valores.map(([v, ico], k) => { const at = S(3, 0.6 + k * 0.9); return `<div class="val" style="animation:${A("valin", 0.8, at, "cubic-bezier(.2,.9,.25,1)")}">
          <span class="vi">${ico}</span><span class="vt">${v}</span><i style="animation:${A("grow", 0.6, at + 0.4)}"></i></div>`; }).join("")}
      </div>
      ${legenda(3, "Nossos valores", "O que guia *cada projeto.*", { em: 0.4 })}`);

    // 4. 100% dedicados ao seu sucesso
    const c4 = cena(4, `
      <div class="anel">
        <svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="170" stroke="rgba(255,255,255,.08)" stroke-width="22" fill="none"/>
          <circle cx="200" cy="200" r="170" stroke="#ffcc00" stroke-width="22" fill="none" stroke-linecap="round" pathLength="1" transform="rotate(-90 200 200)" style="animation:${A("desenha", 2.4, S(4, 0.6), "cubic-bezier(.5,0,.2,1)")}"/></svg>
        <div class="pct"><span class="num" style="animation:${A("cem", 2.4, S(4, 0.6), "cubic-bezier(.5,0,.2,1)")}"></span><small>%</small></div>
      </div>
      ${legenda(4, "Nosso objetivo com cada empresa", "Dedicados ao *seu sucesso.*")}`);

    // 5. Do zero e depois da entrega: caminho com 4 etapas
    const etapas = [["Conversa", "Entendemos como o seu negócio funciona", i.conversa], ["Projeto do zero", "Nada de modelo pronto", i.regua], ["Entrega", "Rápido, bonito e funcionando", i.foguete], ["Depois da entrega", "Ajustes e evoluções com você", i.suporte]];
    const passo = Math.max(0.9, (dur[5] - 3.5) / 4);
    const c5 = cena(5, `
      <div class="caminho">
        <svg class="trilho" viewBox="0 0 20 760"><path d="M10 10V750" stroke="#ffcc00" stroke-width="5" stroke-linecap="round" pathLength="1" style="animation:${A("desenha", passo * 3.6, S(5, 0.6), "linear")}"/></svg>
        ${etapas.map(([t, d, ico], k) => { const at = S(5, 0.6 + k * passo); return `<div class="et" style="top:${k * 230}px;animation:${A("rise", 0.6, at)}">
          <span class="no" style="animation:${A("acende", 0.5, at, "ease")}">${ico}</span><div><b>${t}</b><small>${d}</small></div></div>`; }).join("")}
      </div>
      ${legenda(5, "Feito do zero", "E a gente continua junto *depois da entrega.*")}`);

    // 6. Versículo do site
    const c6 = cena(6, `
      <div class="verso">
        <span class="aspas" style="animation:${A("pop", 0.8, S(6, 0.3), "ease")}">“</span>
        <p>${palavras("Tudo o que fizerem, façam de *todo o coração,* como para o Senhor, e não para os homens.", S(6, 0.6), 0.16)}</p>
        <div class="ref" style="animation:${A("rise", 0.8, S(6, 3.8))}"><i></i>Colossenses 3:23<i></i></div>
      </div>`, "cverso");

    // 7. Contato
    const t7 = start[7];
    const c7 = cena(7, `${pts(70, 540, 560, t7 + 0.1)}
      <img class="logo fim" src="../../assets/logo.png" style="animation:${A("logoin", 0.9, t7 + 0.8, "cubic-bezier(.2,1.3,.4,1)")}">
      <div class="fh">${palavras("Vamos conversar sobre *o seu projeto?*", t7 + 1.4, 0.08)}</div>
      <div class="ctaw" style="animation:${A("rise", 0.7, t7 + 2.6)}"><div class="walinha"><span class="walogo">${ic.whatsapp}</span><span>Fale com a gente<br>no <b>WhatsApp</b></span></div>
        <div class="bio" style="animation:${A("rise", 0.6, t7 + 3.4)}"><svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>O link está na bio</div></div>`);

    const css = `
@property --c { syntax: "<integer>"; inherits: false; initial-value: 0; }
.pd { position: absolute; width: var(--s); height: var(--s); border-radius: 50%; background: #ffcc00; opacity: .35; }
@keyframes flutua { from { transform: translateY(0) } to { transform: translateY(-${Math.round(total * 14)}px) } }
.pt { position: absolute; width: 7px; height: 7px; border-radius: 50%; background: var(--y); opacity: 0; }
@keyframes converge { 0% { opacity: 0; transform: translate(var(--x), var(--y)) } 30% { opacity: .9 } 100% { opacity: 0; transform: translate(0, 0) scale(.3) } }
.logo { position: absolute; left: 50%; top: 440px; width: 440px; margin-left: -220px; opacity: 0; filter: drop-shadow(0 18px 40px rgba(255,204,0,.25)); }
.logo.fim { top: 380px; width: 360px; margin-left: -180px; }
@keyframes logoin { from { opacity: 0; transform: scale(.4) rotateY(70deg) } to { opacity: 1; transform: none } }
.tec { position: absolute; left: 0; right: 0; top: 860px; text-align: center; font-size: 34px; letter-spacing: .55em; color: var(--y); font-weight: 600; opacity: 0; }

.painel { position: absolute; left: 140px; right: 180px; top: 330px; height: 760px; border-radius: 44px; background: linear-gradient(160deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  border: 1px solid rgba(255,255,255,.08); box-shadow: 0 40px 100px rgba(0,0,0,.5); padding: 40px; opacity: 0; }
.graf { width: 100%; height: 560px; margin-top: 60px; }
.linha { stroke-dasharray: 1; stroke-dashoffset: 1; }
@keyframes desenha { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
.area { opacity: 0; } @keyframes aparece { to { opacity: 1 } }
.chip { position: absolute; top: 44px; padding: 14px 26px; border-radius: 100px; background: rgba(255,204,0,.12); border: 1px solid rgba(255,204,0,.45); color: #ffdd55; font-size: 28px; font-weight: 700; opacity: 0; }

.pecas { position: absolute; left: 90px; right: 150px; top: 380px; }
.peca { position: relative; display: flex; align-items: center; gap: 30px; height: 170px; margin-bottom: 26px; padding: 0 40px; border-radius: 36px;
  background: linear-gradient(120deg, rgba(255,255,255,.08), rgba(255,255,255,.02)); border: 1px solid rgba(255,255,255,.1); font-size: 52px; opacity: 0; }
.peca b { font-weight: 800; letter-spacing: -.02em; }
.pi { width: 104px; height: 104px; border-radius: 30px; background: #ffcc00; color: #111; display: grid; place-items: center; flex: none; }
.pi svg { width: 62px; height: 62px; }
@keyframes encaixa { from { opacity: 0; transform: translateX(calc(var(--lado) * 340px + 80px)) rotate(calc(var(--lado) * 4deg)) } to { opacity: 1; transform: none } }
.liga { display: none; }
.soma { display: flex; align-items: center; gap: 18px; margin-top: 18px; font-size: 32px; font-weight: 650; color: #d8d8d8; opacity: 0; }
.soma svg { width: 46px; height: 46px; color: #111; background: #ffcc00; border-radius: 50%; padding: 8px; flex: none; }

.valores { position: absolute; left: 110px; right: 160px; top: 400px; }
.val { position: relative; display: flex; align-items: center; gap: 34px; height: 200px; opacity: 0; }
.vi { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #ffcc00; color: #ffcc00; display: grid; place-items: center; flex: none; }
.vi svg { width: 64px; height: 64px; }
.vt { font-size: 84px; font-weight: 800; letter-spacing: -.035em; }
.val i { position: absolute; left: 154px; right: 0; bottom: 30px; height: 3px; background: linear-gradient(90deg, #ffcc00, transparent); transform-origin: left; }
@keyframes valin { from { opacity: 0; transform: translateX(-60px); filter: blur(8px) } to { opacity: 1; transform: none; filter: none } }

.anel { position: absolute; left: 50%; top: 380px; width: 640px; height: 640px; margin-left: -350px; }
.anel svg { width: 100%; height: 100%; }
.anel circle[pathLength] { stroke-dasharray: 1; stroke-dashoffset: 1; }
.pct { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; }
.pct .num { font-size: 190px; font-weight: 900; letter-spacing: -.05em; font-variant-numeric: tabular-nums; counter-reset: c var(--c); }
.pct .num::after { content: counter(c); }
.pct small { font-size: 100px; font-weight: 800; color: #ffcc00; margin-left: 6px; }
@keyframes cem { from { --c: 0 } to { --c: 100 } }

.caminho { position: absolute; left: 140px; right: 150px; top: 330px; height: 780px; }
.trilho { position: absolute; left: 50px; top: 50px; width: 20px; height: 700px; }
.trilho path { stroke-dasharray: 1; stroke-dashoffset: 1; }
.et { position: absolute; left: 0; right: 0; display: flex; align-items: center; gap: 34px; opacity: 0; }
.no { width: 120px; height: 120px; border-radius: 50%; background: #1c1c1f; border: 3px solid #3a3a3e; color: #777; display: grid; place-items: center; flex: none; }
.no svg { width: 60px; height: 60px; }
@keyframes acende { to { background: #ffcc00; border-color: #ffcc00; color: #111; box-shadow: 0 0 0 12px rgba(255,204,0,.12) } }
.et b { display: block; font-size: 50px; font-weight: 800; letter-spacing: -.02em; }
.et small { display: block; font-size: 30px; color: #a5a5a5; margin-top: 4px; }

.cverso { background: radial-gradient(80% 50% at 50% 45%, rgba(255,204,0,.05), transparent 70%); }
.verso { position: absolute; left: 110px; right: 170px; top: 380px; text-align: center; }
.aspas { display: block; font-family: "Playfair", serif; font-style: italic; font-size: 260px; line-height: .6; color: #ffcc00; opacity: 0; height: 130px; }
.verso p { font-family: "Playfair", serif; font-style: italic; font-weight: 500; font-size: 72px; line-height: 1.22; color: #f4efe2; letter-spacing: -.005em; }
.ref { display: flex; align-items: center; justify-content: center; gap: 22px; margin-top: 56px; font-size: 34px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #ffcc00; opacity: 0; }
.ref i { width: 60px; height: 2px; background: #ffcc00; opacity: .6; }

.fh { position: absolute; left: 90px; right: 150px; top: 860px; text-align: center; font-size: 80px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
.ctaw { position: absolute; left: 90px; right: 150px; top: 1170px; display: flex; flex-direction: column; align-items: center; gap: 34px; opacity: 0; }
.walinha { display: flex; align-items: center; gap: 26px; font-size: 46px; font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: #f2f2f2; }
.walinha b { color: #25d366; font-weight: 800; }
.walogo { width: 104px; height: 104px; border-radius: 50%; background: #25d366; color: #fff; display: grid; place-items: center; flex: none; box-shadow: 0 14px 36px rgba(37,211,102,.3); }
.walogo svg { width: 64px; height: 64px; }
.ctaw .bio { display: flex; align-items: center; gap: 12px; font-size: 32px; font-weight: 600; color: #b5b5b5; opacity: 0; }
.ctaw .bio svg { width: 34px; height: 34px; color: var(--y); }
`;
    return { cenas: `<div class="fundo">${poeira}</div>${c0}${c1}${c2}${c3}${c4}${c5}${c6}${c7}`, css };
  },
});
