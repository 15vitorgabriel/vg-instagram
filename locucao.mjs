// Gera a locução de um reel (Gemini TTS) e guarda em assets/voz/ID/voz-N.m4a, para o dia do post não depender da
// cota do Gemini (10 falas por dia no plano grátis; cada reel usa ~6).
//   node locucao.mjs 2026-11-26      -> gera a locução desse post
//   node locucao.mjs --proximo       -> gera a do próximo reel da fila que ainda não tem voz guardada
//   node locucao.mjs --precisa       -> só diz (código de saída 0) se algum reel da fila precisa de locução
import { readFileSync, readdirSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { narrate, falas, vozGuardada } from "./reel.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const ler = (id) => JSON.parse(readFileSync(path.join(here, "posts", `${id}.json`), "utf8"));
const hoje = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });

let id = process.argv[2];
if (id === "--proximo" || id === "--precisa") {
  id = readdirSync(path.join(here, "posts")).map((f) => f.slice(0, -5)).sort()
    .find((p) => p.slice(0, 10) >= hoje && ler(p).reel && ler(p).voz !== false && !existsSync(path.join(vozGuardada(p), "voz-1.m4a")));
  if (!id) { console.log("nenhum reel na fila precisando de locução"); process.exit(process.argv[2] === "--precisa" ? 1 : 0); }
  if (process.argv[2] === "--precisa") { console.log(`${id} precisa de locução`); process.exit(0); }
}
if (!/^\d{4}-\d{2}-\d{2}(-[a-z0-9]+)?$/.test(id ?? "")) throw new Error("uso: node locucao.mjs AAAA-MM-DD[-N] | --proximo");
const post = ler(id);
const tmp = path.join(here, "out", `${id}-voz`);
mkdirSync(tmp, { recursive: true });
process.env.REEL_GUARDA_VOZ = "1";
process.env.REEL_SEM_CACHE = "1";
console.log(`locução de ${id}:`);
falas(post).forEach((t, i) => console.log(`  cena ${i + 1}: ${t}`));
const v = narrate(post, tmp, ffmpeg);
if (v.some((x) => !x)) { console.warn("a locução não saiu completa; tenta de novo no próximo dia"); process.exit(0); }
// guarda em AAC mono (leve para o git) a fala original, antes do tratamento, que é refeito no render
const dest = vozGuardada(id);
mkdirSync(dest, { recursive: true });
for (let i = 0; i < v.length; i++) {
  const r = spawnSync(ffmpeg, ["-y", "-loglevel", "error", "-i", path.join(tmp, "voz", `voz-${i + 1}.wav`), "-c:a", "aac", "-b:a", "96k", "-ac", "1", path.join(dest, `voz-${i + 1}.m4a`)]);
  if (r.status !== 0) throw new Error(`ffmpeg: ${r.stderr}`);
}
rmSync(tmp, { recursive: true, force: true });
console.log(`locução guardada em ${path.relative(here, dest)}`);
