// Trilha instrumental com o Lyria (Google AI Studio, plano grátis), para fundo de Reels.
//
//   node musica.mjs saida "descrição da música"   -> saida.mp3 (ou .wav, conforme o modelo devolve)
//
// Precisa de GEMINI_API_KEY (.env ou ambiente).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.join(here, ".env");
if (existsSync(envFile)) {
  for (const l of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = l.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const MODEL = process.env.MUSIC_MODEL || "lyria-3.5";
const [out, prompt] = process.argv.slice(2);
if (!out || !prompt) throw new Error('uso: node musica.mjs <saida> "descrição"');
if (!process.env.GEMINI_API_KEY) throw new Error("falta GEMINI_API_KEY");

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
  body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
});
const body = await res.json();
if (!res.ok) throw new Error(JSON.stringify(body.error ?? body));
const part = body.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
if (!part) throw new Error(`sem áudio na resposta: ${JSON.stringify(body).slice(0, 300)}`);

const ext = { "audio/mpeg": ".mp3", "audio/mp3": ".mp3", "audio/wav": ".wav", "audio/x-wav": ".wav" }[part.inlineData.mimeType.split(";")[0]] ?? ".bin";
writeFileSync(out + ext, Buffer.from(part.inlineData.data, "base64"));
console.log(`${out}${ext} (${part.inlineData.mimeType})`);
