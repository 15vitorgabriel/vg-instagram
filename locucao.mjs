// Gera só a locução de um post de reel (Gemini TTS) e guarda os WAVs em out/ID/voz/.
// Serve para testar versões de vídeo com a mesma voz sem gastar a cota do Gemini de novo
// (o reel.mjs reaproveita esses arquivos quando REEL_VOZ_DIR aponta para a pasta).
//   node locucao.mjs 2026-11-26
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { narrate, falas } from "./reel.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const id = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}(-[a-z0-9]+)?$/.test(id ?? "")) throw new Error("uso: node locucao.mjs AAAA-MM-DD[-N]");
const post = JSON.parse(readFileSync(path.join(here, "posts", `${id}.json`), "utf8"));
const out = path.join(here, "out", id);
mkdirSync(out, { recursive: true });
process.env.REEL_GUARDA_VOZ = "1";
falas(post).forEach((t, i) => console.log(`cena ${i + 1}: ${t}`));
const v = narrate(post, out, process.env.FFMPEG || "ffmpeg");
if (v.some((x) => !x)) throw new Error("a locução não saiu completa");
console.log(`locução em ${path.relative(process.cwd(), path.join(out, "voz"))}`);
