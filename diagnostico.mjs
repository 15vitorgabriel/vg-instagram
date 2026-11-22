// Diagnóstico só de leitura da conta do Instagram pela Graph API: qual conta o token publica,
// seguidores, e alcance/visualizações dos últimos posts. Não publica nem altera nada.
//   node diagnostico.mjs   (precisa de IG_USER_ID e IG_ACCESS_TOKEN)
const API = "https://graph.facebook.com/v21.0";
const { IG_USER_ID, IG_ACCESS_TOKEN } = process.env;
if (!(IG_USER_ID && IG_ACCESS_TOKEN)) throw new Error("faltam IG_USER_ID ou IG_ACCESS_TOKEN");

async function get(endpoint, params = {}) {
  const url = new URL(`${API}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${IG_ACCESS_TOKEN}` } });
  const body = await res.json();
  return res.ok ? body : { erro: body.error?.message ?? JSON.stringify(body) };
}

const conta = await get(IG_USER_ID, { fields: "username,name,followers_count,follows_count,media_count" });
console.log("CONTA", JSON.stringify(conta));

const media = await get(`${IG_USER_ID}/media`, { fields: "id,timestamp,media_type,media_product_type,permalink,like_count,comments_count", limit: "30" });
if (media.erro) console.log("MEDIA erro:", media.erro);
for (const m of media.data ?? []) {
  const linha = { quando: m.timestamp, tipo: m.media_type, link: m.permalink, curtidas: m.like_count, comentarios: m.comments_count };
  for (const metric of ["views", "reach", "saved", "shares"]) {
    const r = await get(`${m.id}/insights`, { metric });
    linha[metric] = r.erro ? `erro: ${r.erro.slice(0, 80)}` : r.data?.[0]?.values?.[0]?.value ?? r.data?.[0]?.total_value?.value;
  }
  console.log("POST", JSON.stringify(linha));
}

const ins = await get(`${IG_USER_ID}/insights`, { metric: "reach,views,profile_views,follower_count", period: "day", metric_type: "total_value" });
console.log("CONTA_INSIGHTS", JSON.stringify(ins.erro ? ins : ins.data?.map(d => [d.name, d.total_value?.value])));
