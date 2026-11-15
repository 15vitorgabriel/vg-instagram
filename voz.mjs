// Locução com o Gemini TTS (plano grátis do Google AI Studio). Saída em WAV.
//
//   node voz.mjs Charon saida.wav "Texto da fala"
//
// A direção de voz (sotaque brasileiro, tom de locutor) vai em speechMetadata.style, no formato que o
// AI Studio usa: posta no texto, o modelo a leria em voz alta. Precisa de GEMINI_API_KEY e ffmpeg.
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
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

const MODEL = process.env.TTS_MODEL || "gemini-3.8-flash-tts";
const DIRECAO = "Locutor profissional de comercial de TV brasileiro. Português do Brasil, sotaque neutro de São Paulo, nunca de Portugal. " +
  "Voz masculina, grave e confiante, dicção limpa, ritmo calmo e marcante, com um leve sorriso na voz. Sem exageros, sem tom de vendedor.";

const [voice, out, text] = process.argv.slice(2);
if (!voice || !out || !text) throw new Error('uso: node voz.mjs <Voz> <saida.wav> "texto"');
if (!process.env.GEMINI_API_KEY) throw new Error("falta GEMINI_API_KEY");

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
  body: JSON.stringify({
    contents: [{ role: "user", parts: [{ text: `## Transcript:\n${text}`, speechMetadata: { style: `Style: ${DIRECAO}` } }] }],
    generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
  }),
});
const body = await res.json();
if (!res.ok) throw new Error(JSON.stringify(body.error ?? body));
const part = body.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
if (!part) throw new Error(`sem áudio na resposta: ${JSON.stringify(body).slice(0, 300)}`);

// A API devolve PCM 16 bits mono 24 kHz cru; o ffmpeg empacota em WAV
const pcm = `${out}.pcm`;
writeFileSync(pcm, Buffer.from(part.inlineData.data, "base64"));
const r = spawnSync(process.env.FFMPEG || "ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", pcm, out]);
rmSync(pcm);
if (r.status !== 0) throw new Error(`ffmpeg: ${r.stderr}`);
console.log(`${voice} -> ${out}`);
