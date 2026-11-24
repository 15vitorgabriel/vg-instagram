// Motor dos reels animados: linha do tempo pela duração da voz, legenda padrão, trilha + locução, captura quadro a
// quadro no Chrome e capa. Cada roteiro (motion/NOME.mjs) só monta o HTML das cenas.
//   rodar({ id, minimo: [s, s, ...], capa: s_na_cena0, montar: (t) => ({ cenas, css }) })
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { narrate, soundtrack, chrome, falas } from "../reel.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = 1080, H = 1920, FPS = 30;
export const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

export async function rodar({ id, minimo, capa = 2.8, montar }) {
  const post = JSON.parse(readFileSync(path.join(root, "posts", `${id}.json`), "utf8"));
  const out = process.env.MOTION_OUT || path.join(root, "out", `${id}-motion`);
  mkdirSync(out, { recursive: true });
  const ffmpeg = process.env.FFMPEG || "ffmpeg";

  // cada cena dura a fala dela + folga para ler e olhar (nunca menos que o mínimo do roteiro)
  const voz = narrate(post, out, ffmpeg, id);
  if (voz.length !== minimo.length) throw new Error(`o roteiro tem ${minimo.length} cenas e as falas são ${voz.length}`);
  const dur = voz.map((v, i) => Math.max(minimo[i], v ? v.length / 44100 + 2.4 : 0));
  const start = []; dur.reduce((t, d, i) => (start[i] = t, t + d), 0);
  const total = dur.reduce((a, b) => a + b, 0);
  console.log("cenas:", dur.map((d) => d.toFixed(1)).join(" "), "total", total.toFixed(1));

  const A = (name, d, at, ease = "var(--ease)", extra = "both") => `${name} ${d}s ${ease} ${at.toFixed(3)}s ${extra}`;
  const S = (i, x) => start[i] + x;
  // cena: aparece no início e sai (desfocando) no fim, menos a última
  const cena = (i, inner, cls = "") => `<section class="cena ${cls}" style="animation:${A("show", 0.01, start[i], "linear")}${i < dur.length - 1 ? `, ${A("cenaout", 0.5, start[i] + dur[i] - 0.5, "ease-in")}` : ""}">${inner}</section>`;
  // legenda padrão embaixo: chamada pequena + traço + frase com *amarelo*
  const legenda = (i, kicker, text, { em = 0.35 } = {}) => {
    const t0 = start[i] + em;
    let k = 0, html = "";
    for (const part of text.split(/(\*[^*]+\*)/)) {
      if (!part) continue;
      const y = part.startsWith("*");
      for (const w of (y ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean))
        html += `<span class="w${y ? " y" : ""}" style="animation:${A("word", 0.6, t0 + 0.25 + k++ * 0.09)}">${esc(w)}</span> `;
    }
    return `<div class="cap">${kicker ? `<div class="kick" style="animation:${A("rise", 0.5, t0)}">${esc(kicker)}</div><div class="dash" style="animation:${A("grow", 0.5, t0 + 0.1)}"></div>` : ""}<div class="head">${html}</div></div>`;
  };
  const palavras = (text, t0, passo = 0.09) => { let k = 0; return text.split(/(\*[^*]+\*)/).filter(Boolean).map((part) => { const y = part.startsWith("*"); return (y ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean).map((w) => `<span class="w${y ? " y" : ""}" style="animation:${A("word", 0.7, t0 + k++ * passo)}">${esc(w)}</span>`).join(" "); }).join(" "); };

  const { cenas, css = "" } = montar({ A, S, start, dur, total, cena, legenda, palavras, esc });
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face { font-family: "Inter Tight"; font-weight: 100 900; src: url("${root}/fonts/inter-tight-latin-wght-normal.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F, U+2212; }
@font-face { font-family: "Inter Tight"; font-weight: 100 900; src: url("${root}/fonts/inter-tight-latin-ext-wght-normal.woff2") format("woff2"); unicode-range: U+0100-02BA, U+1E00-1EFF; }
@font-face { font-family: "Playfair"; font-style: italic; font-weight: 400 900; src: url("${root}/fonts/playfair-display-italic-latin.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }
@font-face { font-family: "Playfair"; font-style: italic; font-weight: 400 900; src: url("${root}/fonts/playfair-display-italic-latin-ext.woff2") format("woff2"); unicode-range: U+0100-02BA, U+1E00-1EFF; }
@property --n { syntax: "<integer>"; inherits: false; initial-value: 0; }
:root { --y: #ffcc00; --ease: cubic-bezier(.16,1,.3,1); }
* { margin: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #0b0b0c; }
body { font-family: "Inter Tight", sans-serif; color: #f2f2f2; -webkit-font-smoothing: antialiased; position: relative; background: radial-gradient(120% 70% at 50% 38%, #1d1d20 0%, #0b0b0c 70%); }
@keyframes show { from { visibility: hidden } to { visibility: visible } }
@keyframes hide { to { visibility: hidden; opacity: 0 } }
@keyframes rise { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: none } }
@keyframes word { from { opacity: 0; transform: translateY(46px); filter: blur(8px) } to { opacity: 1; transform: none; filter: none } }
@keyframes grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes pop { from { opacity: 0; transform: scale(.6) } to { opacity: 1; transform: none } }
@keyframes cenaout { to { opacity: 0; transform: translateY(-30px) scale(.98); filter: blur(10px) } }
.cena { position: absolute; inset: 0; visibility: hidden; }
.cap { position: absolute; left: 90px; right: 150px; top: 1350px; text-align: center; }
.kick { font-size: 30px; font-weight: 600; color: #9b9b9b; letter-spacing: .04em; }
.dash { width: 46px; height: 4px; border-radius: 2px; background: var(--y); margin: 22px auto 24px; }
.head { font-size: 64px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; text-wrap: balance; }
.w { display: inline-block; } .y { color: var(--y); }
${css}
</style></head><body>
${cenas}
<script>window.seek = (ms) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = ms; } };</script>
</body></html>`;
  const htmlFile = path.join(out, "motion.html");
  writeFileSync(htmlFile, html);

  const voices = voz.map((pcm, i) => pcm && { at: start[i] + 0.35, pcm }).filter(Boolean);
  const wav = path.join(out, "motion.wav");
  writeFileSync(wav, soundtrack(total, [], [...id].reduce((a, c) => a + c.charCodeAt(0), 0), voices));

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
    if (process.env.QUADROS) { // só alguns instantes, para conferir
      for (const t of process.env.QUADROS.split(",").map(Number)) {
        await C("Runtime.evaluate", { expression: `seek(${t * 1000})` });
        const { data } = await C("Page.captureScreenshot", { format: "jpeg", quality: 85 });
        writeFileSync(path.join(out, `q-${t}.jpg`), Buffer.from(data, "base64"));
      }
      return;
    }
    const enc = spawn(ffmpeg, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", "-i", wav,
      "-c:v", "libx264", "-profile:v", "high", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", String(FPS),
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", path.join(out, "reel.mp4")], { stdio: ["pipe", "inherit", "pipe"] });
    let err = ""; enc.stderr.on("data", (d) => (err += d));
    const done = new Promise((ok, fail) => enc.on("exit", (c) => (c === 0 ? ok() : fail(new Error(err)))));
    for (let k = 0; k < Math.round(total * FPS); k++) {
      await C("Runtime.evaluate", { expression: `seek(${((k / FPS) * 1000).toFixed(2)})` });
      const { data } = await C("Page.captureScreenshot", { format: "jpeg", quality: 92 });
      if (!enc.stdin.write(Buffer.from(data, "base64"))) await new Promise((r) => enc.stdin.once("drain", r));
    }
    enc.stdin.end(); await done;
    if (process.env.MOTION_OUT) {
      const c = spawnSync(ffmpeg, ["-y", "-loglevel", "error", "-ss", String(start[0] + capa), "-i", path.join(out, "reel.mp4"), "-frames:v", "1", "-q:v", "2", path.join(out, "1.jpg")]);
      if (c.status !== 0) throw new Error(`capa: ${c.stderr}`);
    }
    console.log(`motion em ${path.relative(process.cwd(), out)}/reel.mp4`);
  } finally { close(); rmSync(wav, { force: true }); }
}
export { falas };
