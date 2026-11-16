// Despertador: o cron do GitHub atrasa ou pula; a Cloudflare dispara no horário e manda o GitHub rodar o post.yml.
// Segredo GH_TOKEN: token fine-grained só com Actions (read/write) no vg-instagram.
export default {
  async scheduled(_event, env) {
    const res = await fetch("https://api.github.com/repos/15vitorgabriel/vg-instagram/actions/workflows/post.yml/dispatches", {
      method: "POST",
      // o segredo pode chegar com BOM/quebra de linha (colado pelo PowerShell); o token só tem ASCII visível
      headers: { Authorization: `Bearer ${env.GH_TOKEN.replace(/[^\x21-\x7e]/g, "")}`, Accept: "application/vnd.github+json", "User-Agent": "vg-despertador" },
      body: JSON.stringify({ ref: "main" }),
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  },
};
