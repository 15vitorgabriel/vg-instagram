// Publica o post do dia também na Página do Facebook da VG (mesmas imagens/vídeo e mesma legenda do Instagram).
//
//   node publish-facebook.mjs 2026-11-28-2
//
// Variáveis: FB_PAGE_ID e FB_PAGE_TOKEN (token da Página, com pages_manage_posts) e MEDIA_BASE_URL (onde as
// imagens/vídeo renderizados estão publicados, o mesmo do Instagram). Sem FB_PAGE_ID/FB_PAGE_TOKEN, não faz nada.
// Registro em facebook.json: o que já saiu não sai de novo. Falha aqui nunca derruba o post do Instagram.
//   imagem única -> foto da Página · carrossel -> post com várias fotos · reel -> Reel da Página · story -> story da Página
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const API = "https://graph.facebook.com/v21.0";
const { FB_PAGE_ID, FB_PAGE_TOKEN, MEDIA_BASE_URL } = process.env;
const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}(-[a-z0-9]+)?$/.test(date ?? "")) throw new Error("uso: node publish-facebook.mjs AAAA-MM-DD[-N]");
if (!FB_PAGE_TOKEN) { console.log("Facebook: sem FB_PAGE_TOKEN, pulando"); process.exit(0); }
if (!MEDIA_BASE_URL) throw new Error("falta MEDIA_BASE_URL");

const logFile = path.join(here, "facebook.json");
const log = existsSync(logFile) ? JSON.parse(readFileSync(logFile, "utf8")) : {};
if (log[date]) { console.log(`Facebook: ${date} já publicado`); process.exit(0); }

const post = JSON.parse(readFileSync(path.join(here, "posts", `${date}.json`), "utf8"));
const base = MEDIA_BASE_URL.replace(/\/$/, "");
const images = (post.slides ?? []).map((_, i) => `${base}/${date}/${i + 1}.jpg`);
const video = (post.video || post.reel) && `${base}/${date}/reel.mp4`;

async function call(endpoint, params = {}, { url } = {}) {
  const res = await fetch(url ?? `${API}/${endpoint}`, { method: "POST", headers: { Authorization: `Bearer ${FB_PAGE_TOKEN}` }, body: new URLSearchParams(params) });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) throw new Error(`${endpoint}: ${JSON.stringify(body.error ?? body)}`);
  return body;
}
// o ID da Página vem do próprio token (token de Página responde /me com a Página); FB_PAGE_ID só confere
const eu = await (await fetch(`${API}/me?fields=id,name&metadata=1`, { headers: { Authorization: `Bearer ${FB_PAGE_TOKEN}` } })).json();
if (eu.error) throw new Error(`token do Facebook: ${JSON.stringify(eu.error)}`);
if (eu.metadata?.type !== "page") throw new Error(`FB_PAGE_TOKEN não é token de Página (é ${eu.metadata?.type} ${eu.name})`);
const PAGE = eu.id;
if (FB_PAGE_ID && FB_PAGE_ID !== PAGE) console.warn(`Facebook: FB_PAGE_ID não bate com a Página do token (${eu.name}); usando a do token`);
const fotoOculta = async (url) => (await call(`${PAGE}/photos`, { url, published: "false" })).id;

let id;
if (post.story) {
  const ids = [];
  for (const url of images) ids.push((await call(`${PAGE}/photo_stories`, { photo_id: await fotoOculta(url) })).post_id);
  id = ids.join(",");
} else if (video) {
  // Reels da Página: abre o envio, manda o vídeo pela URL pública e publica com a legenda
  const { video_id } = await call(`${PAGE}/video_reels`, { upload_phase: "start" });
  const up = await fetch(`https://rupload.facebook.com/video-upload/v21.0/${video_id}`, { method: "POST", headers: { Authorization: `OAuth ${FB_PAGE_TOKEN}`, file_url: video } });
  if (!up.ok) throw new Error(`envio do vídeo: ${await up.text()}`);
  await call(`${PAGE}/video_reels`, { video_id, upload_phase: "finish", video_state: "PUBLISHED", description: post.caption });
  id = video_id;
} else if (images.length === 1) {
  id = (await call(`${PAGE}/photos`, { url: images[0], message: post.caption })).post_id;
} else {
  const params = { message: post.caption };
  (await Promise.all(images.map(fotoOculta))).forEach((m, i) => (params[`attached_media[${i}]`] = JSON.stringify({ media_fbid: m })));
  id = (await call(`${PAGE}/feed`, params)).id;
}
log[date] = { id, at: new Date().toISOString() };
writeFileSync(logFile, JSON.stringify(log, null, 2) + "\n");
console.log(`Facebook: publicado ${date}: ${id}`);
