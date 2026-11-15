// Publica o post do dia na conta do Instagram pela Graph API (carrossel ou imagem única).
//
//   node publish.mjs 2026-11-16            -> publica posts/2026-11-16.json
//   node publish.mjs 2026-11-16 --dry-run  -> só mostra o que enviaria
//
// Variáveis: IG_USER_ID, IG_ACCESS_TOKEN (.env local ou secrets do GitHub) e MEDIA_BASE_URL,
// a URL pública onde as imagens renderizadas ficam (a API só aceita JPEG em URL pública).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const API = "https://graph.facebook.com/v21.0";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// .env local (no GitHub Actions as variáveis já vêm do ambiente)
const envFile = path.join(here, ".env");
if (existsSync(envFile)) {
  for (const l of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = l.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const [date, flag] = process.argv.slice(2);
const dry = flag === "--dry-run";
// --check monta o post no Instagram (containers) e para antes de publicar: testa token, URL e mídia sem postar
const check = flag === "--check";
if (!/^\d{4}-\d{2}-\d{2}(-\d+)?$/.test(date ?? "")) throw new Error("uso: node publish.mjs AAAA-MM-DD[-N] [--dry-run]");

const { IG_USER_ID, IG_ACCESS_TOKEN, MEDIA_BASE_URL } = process.env;
if (!dry && !(IG_USER_ID && IG_ACCESS_TOKEN && MEDIA_BASE_URL)) throw new Error("faltam IG_USER_ID, IG_ACCESS_TOKEN ou MEDIA_BASE_URL");

const post = JSON.parse(readFileSync(path.join(here, "posts", `${date}.json`), "utf8"));
const caption = post.caption;
const images = (post.slides ?? []).map((_, i) => `${MEDIA_BASE_URL}/${date}/${i + 1}.jpg`);
const video = post.video && `${MEDIA_BASE_URL}/${date}/reel.mp4`;

// Registro do que já saiu: se o workflow rodar duas vezes no mesmo dia, o segundo não posta de novo
const logFile = path.join(here, "published.json");
const log = existsSync(logFile) ? JSON.parse(readFileSync(logFile, "utf8")) : {};
if (log[date]) { console.log(`${date} já publicado (${log[date].id}), nada a fazer`); process.exit(0); }

if (dry) { console.log({ caption, images, video }); process.exit(0); }

async function call(endpoint, params = {}, method = "POST") {
  const url = new URL(`${API}/${endpoint}`);
  const init = { method, headers: { Authorization: `Bearer ${IG_ACCESS_TOKEN}` } };
  if (method === "GET") for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  else { init.body = new URLSearchParams(params); }
  const res = await fetch(url, init);
  const body = await res.json();
  if (!res.ok) throw new Error(`${endpoint}: ${JSON.stringify(body.error ?? body)}`);
  return body;
}

// O container de mídia leva alguns segundos para ficar FINISHED; publicar antes disso falha
async function ready(id) {
  for (let i = 0; i < 75; i++) {
    const { status_code } = await call(id, { fields: "status_code" }, "GET");
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR" || status_code === "EXPIRED") throw new Error(`container ${id}: ${status_code}`);
    await sleep(4000);
  }
  throw new Error(`container ${id}: tempo esgotado`);
}

let creation;
if (video) {
  // thumb_offset (ms) escolhe o quadro da capa; vídeo demora mais para processar, ready() espera
  creation = (await call(`${IG_USER_ID}/media`, { media_type: "REELS", video_url: video, caption,
    share_to_feed: "true", ...(post.thumb_offset ? { thumb_offset: String(post.thumb_offset) } : {}) })).id;
} else if (images.length === 1) {
  creation = (await call(`${IG_USER_ID}/media`, { image_url: images[0], caption })).id;
} else {
  const kids = [];
  for (const image_url of images) {
    const { id } = await call(`${IG_USER_ID}/media`, { image_url, is_carousel_item: "true" });
    await ready(id);
    kids.push(id);
  }
  creation = (await call(`${IG_USER_ID}/media`, { media_type: "CAROUSEL", children: kids.join(","), caption })).id;
}
await ready(creation);
if (check) { console.log(`${date}: container ${creation} pronto, NÃO publicado (--check)`); process.exit(0); }
const { id } = await call(`${IG_USER_ID}/media_publish`, { creation_id: creation });

log[date] = { id, at: new Date().toISOString() };
writeFileSync(logFile, JSON.stringify(log, null, 2) + "\n");
console.log(`publicado ${date}: ${id}`);
