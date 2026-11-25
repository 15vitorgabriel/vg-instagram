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

// Facebook: que permissões o token tem e quais Páginas ele enxerga (só id e nome; nunca o token da Página)
const perms = await get("me/permissions");
console.log("PERMISSOES", JSON.stringify(perms.erro ? perms : perms.data?.filter((p) => p.status === "granted").map((p) => p.permission)));
const quem = await get("me", { fields: "id,name" });
console.log("TOKEN_DE", JSON.stringify(quem.erro ? quem : { tipo: quem.name ? "usuário ou página" : "?", nome: quem.name }));
const contas = await get("me/accounts", { fields: "id,name,tasks,instagram_business_account" });
console.log("PAGINAS", JSON.stringify(contas.erro ? contas : contas.data?.map((p) => ({ id: p.id, nome: p.name, tarefas: p.tasks, ig: p.instagram_business_account?.id === IG_USER_ID ? "é a @_vgtecnologia" : p.instagram_business_account?.id ? "outra conta" : "sem IG" }))));

// de qual app é o token (para gerar o token novo no mesmo app)
const dbg = await get("debug_token", { input_token: IG_ACCESS_TOKEN });
console.log("APP_DO_TOKEN", JSON.stringify(dbg.erro ? dbg : { app: dbg.data?.application, app_id: dbg.data?.app_id, tipo: dbg.data?.type, expira: dbg.data?.expires_at ? new Date(dbg.data.expires_at * 1000).toISOString() : "não expira" }));

// Página do Facebook (secrets FB_PAGE_ID e FB_PAGE_TOKEN): confere acesso sem publicar nada
const { FB_PAGE_ID, FB_PAGE_TOKEN } = process.env;
if (FB_PAGE_ID && FB_PAGE_TOKEN) {
  const pg = async (endpoint, params = {}) => {
    const url = new URL(`${API}/${endpoint}`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${FB_PAGE_TOKEN}` } });
    const body = await res.json();
    return res.ok ? body : { erro: body.error?.message ?? JSON.stringify(body) };
  };
  const p = await pg(FB_PAGE_ID, { fields: "id,name,followers_count,link,instagram_business_account" });
  console.log("FB_PAGINA", JSON.stringify(p.erro ? p : { nome: p.name, seguidores: p.followers_count, link: p.link, ig_ligado: p.instagram_business_account?.id === IG_USER_ID ? "sim, @_vgtecnologia" : p.instagram_business_account?.id ? "outra conta" : "não" }));
  const eu = await pg("me", { fields: "id,name", metadata: "1" });
  console.log("FB_TOKEN", JSON.stringify(eu.erro ? eu : { de: eu.name, tipo: eu.metadata?.type, id_bate_com_FB_PAGE_ID: eu.id === FB_PAGE_ID }));
  if (!eu.erro && eu.metadata?.type === "page") {
    const p2 = await pg(eu.id, { fields: "name,followers_count,link,instagram_business_account" });
    console.log("FB_PAGINA_DO_TOKEN", JSON.stringify(p2.erro ? p2 : { nome: p2.name, seguidores: p2.followers_count, link: p2.link, ig_ligado: p2.instagram_business_account?.id === IG_USER_ID ? "sim, @_vgtecnologia" : p2.instagram_business_account?.id ? "outra conta" : "não" }));
    const perm = await pg(`${eu.id}/feed`, { limit: "1", fields: "id" });
    console.log("FB_LE_O_FEED", JSON.stringify(perm.erro ? perm : "sim"));
  }
  // com o token da Página, os números de visualização do Instagram também ficam acessíveis
  const m = await get(`${IG_USER_ID}/media`, { fields: "id,timestamp", limit: "3" });
  for (const x of m.data ?? []) {
    const v = await pg(`${x.id}/insights`, { metric: "views,reach" });
    console.log("IG_NUMEROS", x.timestamp, JSON.stringify(v.erro ? v : v.data?.map((d) => [d.name, d.values?.[0]?.value ?? d.total_value?.value])));
  }
} else console.log("FB: secrets FB_PAGE_ID/FB_PAGE_TOKEN não cadastrados");
