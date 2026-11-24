// Kit de peças para os reels animados (motion): ícones, ilustrações de produto e telas de app com cara de
// aplicativo de verdade (bloqueio do iPhone, Central de Controle, Safari, perfil do Instagram, link da bio,
// WhatsApp). Tudo desenhado aqui em SVG/CSS, sem imagem de terceiros. As telas medem 468 x 998 (área útil do
// celular) e recebem o "anim" da cena para marcar os tempos.

export const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// ---------- ícones (traço próprio, estilo iOS) ----------
export const ic = {
  wifi: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 18.6a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zm0-5.1c2 0 3.8.8 5.1 2.1l-1.5 1.5a5 5 0 0 0-7.2 0l-1.5-1.5A7.2 7.2 0 0 1 12 13.5zm0-4.7c3.3 0 6.3 1.3 8.5 3.5L19 13.8a10 10 0 0 0-14 0l-1.5-1.5C5.7 10.1 8.7 8.8 12 8.8zM12 4c4.6 0 8.8 1.8 11.9 4.8l-1.5 1.5A14.6 14.6 0 0 0 12 6.1c-4 0-7.7 1.6-10.4 4.2L.1 8.8C3.2 5.8 7.4 4 12 4z"/></svg>`,
  sig: `<svg viewBox="0 0 20 14"><rect x="0" y="9" width="3.6" height="5" rx="1" fill="currentColor"/><rect x="5.4" y="6.2" width="3.6" height="7.8" rx="1" fill="currentColor"/><rect x="10.8" y="3.2" width="3.6" height="10.8" rx="1" fill="currentColor"/><rect x="16.2" y="0" width="3.6" height="14" rx="1" fill="currentColor"/></svg>`,
  bat: `<svg viewBox="0 0 30 14"><rect x=".8" y=".8" width="24" height="12.4" rx="3.8" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".45"/><rect x="2.8" y="2.8" width="17" height="8.4" rx="2.2" fill="currentColor"/><path d="M26.6 4.8v4.4c.9-.3 1.6-1.2 1.6-2.2s-.7-1.9-1.6-2.2z" fill="currentColor" opacity=".45"/></svg>`,
  aviao: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 15.5v-1.8L13.5 9V3.8a1.5 1.5 0 0 0-3 0V9L3 13.7v1.8l7.5-2.3v5.2L8.5 20v1.3l3.5-1 3.5 1V20l-2-1.6v-5.2z"/></svg>`,
  antena: `<svg viewBox="0 0 24 24"><g fill="currentColor"><circle cx="12" cy="11" r="2"/><path d="M11 13h2l1.6 9h-5.2z"/><path d="M7.8 6.8a6 6 0 0 0 0 8.4l-1.4 1.4a8 8 0 0 1 0-11.2zm8.4 0 1.4-1.4a8 8 0 0 1 0 11.2l-1.4-1.4a6 6 0 0 0 0-8.4z" opacity=".9"/></g></svg>`,
  bt: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6.5 7.5 11 9-5.5 4.5V3l5.5 4.5-11 9"/></svg>`,
  lanterna: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 2h8v4l-2 3v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9L8 6z"/><circle cx="12" cy="13" r="1.3" fill="#000" opacity=".5"/></svg>`,
  timer: `<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 13V9M10 2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  calc: `<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="8" y="6" width="8" height="3" rx="1" fill="currentColor"/><g fill="currentColor"><circle cx="9" cy="13" r="1.1"/><circle cx="12" cy="13" r="1.1"/><circle cx="15" cy="13" r="1.1"/><circle cx="9" cy="17" r="1.1"/><circle cx="12" cy="17" r="1.1"/><circle cx="15" cy="17" r="1.1"/></g></svg>`,
  camera: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 4h6l1.5 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5z"/><circle cx="12" cy="13" r="4" fill="#000" opacity=".45"/></svg>`,
  rotacao: `<svg viewBox="0 0 24 24"><rect x="9" y="8" width="6" height="8" rx="1.5" fill="currentColor"/><path d="M5 12a7 7 0 0 1 12-5m2 5a7 7 0 0 1-12 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m17 3.5.2 3.8-3.7.2M7 20.5l-.2-3.8 3.7-.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  espelhar: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="11" y="10" width="11" height="10" rx="2" fill="currentColor"/></svg>`,
  sol: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g></svg>`,
  lua: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>`,
  som: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  play: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 4.5v15l12-7.5z"/></svg>`,
  prev: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 6v12L3.5 12zm9 0v12L12.5 12z"/></svg>`,
  next: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 6v12l8.5-6zm9 0v12l8.5-6z"/></svg>`,
  cadeado: `<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  voltar: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M15 4 7 12l8 8"/></svg>`,
  avancar: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="m9 4 8 8-8 8"/></svg>`,
  share: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12M8 7l4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>`,
  livro: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zm0 0v13"/></svg>`,
  abas: `<svg viewBox="0 0 24 24"><rect x="3" y="7" width="13" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 4h10a3 3 0 0 1 3 3v10" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  recarregar: `<svg viewBox="0 0 24 24"><path d="M19 12a7 7 0 1 1-2-4.9M19 4v4h-4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sino: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4"/></svg>`,
  pontos: `<svg viewBox="0 0 24 24"><g fill="currentColor"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></g></svg>`,
  addpessoa: `<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 20c.6-3.6 3.5-6 7-6s6.4 2.4 7 6M19 8v6M16 11h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  grade: `<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></g></svg>`,
  reels: `<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8.5h18M8 3l3 5.5M14 3l3 5.5"/></g><path fill="currentColor" d="M10 11.5v6l5-3z"/></svg>`,
  marcado: `<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 4h16v13h-5l-3 3-3-3H4z"/><circle cx="12" cy="9.5" r="2.5"/><path d="M7.5 15.5c.8-1.8 2.5-2.8 4.5-2.8s3.7 1 4.5 2.8"/></g></svg>`,
  casa: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/></svg>`,
  lupa: `<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  mais: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  carrossel: `<svg viewBox="0 0 24 24"><rect x="7" y="3" width="14" height="14" rx="2.5" fill="currentColor"/><path d="M4 7v12a2 2 0 0 0 2 2h12" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  video: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm14 3.2 4-2.7v9l-4-2.7z"/></svg>`,
  fone: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1z"/></svg>`,
  emoji: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="10" r="1.2" fill="currentColor"/><circle cx="15" cy="10" r="1.2" fill="currentColor"/><path d="M8 14.5a4.5 4.5 0 0 0 8 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  clipe: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="m20 11.5-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.6 1.6 0 0 1-2.3-2.3L15 7"/></svg>`,
  mic: `<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  figurinha: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M20 12.5V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h5.5zM12.5 20c0-4.1 3.4-7.5 7.5-7.5"/></svg>`,
  tique2: `<svg viewBox="0 0 18 11"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="m1 6 3.5 3.5L12 1.5M7.5 8.5l1 1L16 1.5"/></svg>`,
  globo: `<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/></g></svg>`,
  etiqueta: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.8" fill="currentColor"/></svg>`,
  alerta: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2 1 21h22z"/><path d="M12 9v5M12 17.2v.3" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7.5"/></svg>`,
  xis: `<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M7 7l10 10M17 7 7 17"/></svg>`,
  // logo do WhatsApp (balão com fone), para o botão de contato
  whatsapp: `<svg viewBox="0 0 32 32"><path fill="currentColor" d="M16 3.2C8.9 3.2 3.2 8.9 3.2 15.9c0 2.4.7 4.7 1.9 6.7L3 29l6.6-2.1c1.9 1.1 4.1 1.6 6.4 1.6 7.1 0 12.8-5.7 12.8-12.7S23.1 3.2 16 3.2zm0 23.1c-2.1 0-4.1-.6-5.8-1.7l-.4-.2-3.9 1.2 1.3-3.8-.3-.4a10.3 10.3 0 0 1-1.6-5.5C5.3 10.1 10.1 5.4 16 5.4s10.7 4.7 10.7 10.5S21.9 26.3 16 26.3zm5.9-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.6c.1-.2.1-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.3 3.6 5.7 5 2.8 1.1 3.4.9 4 .8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`,
};

// ---------- ícones de app (quadrado arredondado com desenho) ----------
const appBg = { loja: "linear-gradient(160deg,#ff9f43,#ff6b2c)", carrinho: "linear-gradient(160deg,#4f8cff,#2f5fe0)", oferta: "linear-gradient(160deg,#ff5a6e,#e0263f)", whats: "linear-gradient(160deg,#5ef08a,#1fb855)", correio: "linear-gradient(160deg,#ffd54a,#f5b400)" };
const appArt = {
  loja: `<svg viewBox="0 0 24 24"><path fill="#fff" d="M6 8h12l1 12.5a1 1 0 0 1-1 1.1H6a1 1 0 0 1-1-1.1z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="9" cy="11" r="1" fill="#ff7a32"/><circle cx="15" cy="11" r="1" fill="#ff7a32"/></svg>`,
  carrinho: `<svg viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M3 4h2.5l2.2 10.5h10l2-7.5H6.5"/><circle cx="9" cy="18.5" r="1.6" fill="#fff"/><circle cx="16.5" cy="18.5" r="1.6" fill="#fff"/></svg>`,
  oferta: `<svg viewBox="0 0 24 24"><path fill="#fff" d="M3.5 12.3V4.5a1 1 0 0 1 1-1h7.8l8.2 8.2a1 1 0 0 1 0 1.4l-7.8 7.8a1 1 0 0 1-1.4 0z"/><text x="12.6" y="15.2" font-size="7.5" font-weight="900" text-anchor="middle" fill="#e0263f" font-family="Inter Tight, sans-serif">%</text><circle cx="7.3" cy="7.3" r="1.3" fill="#e0263f"/></svg>`,
  whats: ic.whatsapp.replace('fill="currentColor"', 'fill="#fff"'),
  correio: `<svg viewBox="0 0 24 24"><path fill="#7a5a00" d="M4 7h16v11H4z" opacity=".25"/><path fill="none" stroke="#5c4300" stroke-width="1.8" stroke-linejoin="round" d="M3.5 6.5h17v11h-17zM3.5 7l8.5 6 8.5-6"/></svg>`,
};
export const appIcon = (k, size = 54) => `<span class="appic" style="width:${size}px;height:${size}px;border-radius:${size * 0.235}px;background:${appBg[k]}">${appArt[k]}</span>`;

// ---------- ilustrações de produto (para a grade da loja) ----------
const prod = {
  camiseta: (c) => `<path fill="${c}" d="M35 22 47 16c2 6 6 9 13 9s11-3 13-9l12 6 14 14-11 12-8-6v44H43V42l-8 6-11-12z"/><path d="M47 16c2 6 6 9 13 9s11-3 13-9" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2.5"/>`,
  tenis: (c) => `<path fill="${c}" d="M18 74c0-10 3-20 9-26l9 8c7 3 12 1 16-5l14 10c8 6 22 8 36 10 5 1 8 5 8 9v4H22c-2 0-4-2-4-4z"/><path fill="#fff" d="M18 80h101v6H22c-2 0-4-2-4-3z"/><path d="M44 56l6-4M52 62l6-4M60 68l6-4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  bolsa: (c) => `<path d="M45 46c0-14 7-22 15-22s15 8 15 22" fill="none" stroke="${c}" stroke-width="5"/><rect x="28" y="44" width="64" height="52" rx="10" fill="${c}"/><rect x="54" y="58" width="12" height="8" rx="2" fill="#f3d36b"/>`,
  vestido: (c) => `<path fill="${c}" d="M50 18h20l-2 14 6 10-4 8 20 48H30l20-48-4-8 6-10z"/><path d="M50 18c3 4 17 4 20 0" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="2.5"/>`,
  bone: (c) => `<path fill="${c}" d="M28 70c0-22 14-36 32-36s32 14 32 34z"/><path fill="${c}" d="M88 66c10 0 22 3 26 9-8 3-20 2-30 0z" opacity=".85"/><circle cx="60" cy="34" r="4" fill="rgba(0,0,0,.25)"/><path d="M60 36v32" stroke="rgba(0,0,0,.15)" stroke-width="2"/>`,
  oculos: (c) => `<rect x="20" y="48" width="34" height="24" rx="11" fill="${c}"/><rect x="66" y="48" width="34" height="24" rx="11" fill="${c}"/><path d="M54 56c4-3 8-3 12 0M20 54 12 50M100 54l8-4" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="M26 54h12" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`,
  relogio: (c) => `<rect x="48" y="16" width="24" height="22" rx="5" fill="#2b2b2b"/><rect x="48" y="82" width="24" height="22" rx="5" fill="#2b2b2b"/><circle cx="60" cy="60" r="26" fill="${c}"/><circle cx="60" cy="60" r="20" fill="#fff"/><path d="M60 60V48M60 60l9 5" stroke="#222" stroke-width="3" stroke-linecap="round"/>`,
  moletom: (c) => `<path fill="${c}" d="M42 20c4 8 10 11 18 11s14-3 18-11l16 8 12 46-12 4-6-24v58H32V54l-6 24-12-4 12-46z"/><path d="M50 22c2 10 8 14 10 14s8-4 10-14" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="3"/><rect x="46" y="70" width="28" height="14" rx="4" fill="rgba(0,0,0,.12)"/>`,
};
const paleta = [["#f6e7d8", "#d0643b"], ["#e4ecf7", "#1f3b73"], ["#f2e9f4", "#8e4a9c"], ["#e8f3ea", "#2f7d4f"], ["#fbf1d9", "#c98a12"], ["#efe9e3", "#3a3a3a"], ["#e6f2f6", "#167a8f"], ["#f7e3e5", "#b83250"]];
const nomes = Object.keys(prod);
// um quadrinho da grade: fundo de estúdio, produto, preço; alguns com selo de desconto, ícone de reels ou carrossel
export function tile(k, { oferta = false } = {}) {
  const [bg, c] = paleta[k % paleta.length], n = nomes[(k * 3 + 1) % nomes.length];
  const preco = [89, 129, 199, 59, 249, 79, 159, 99][k % 8];
  const canto = k % 5 === 1 ? ic.reels : k % 4 === 2 ? ic.carrossel : "";
  return `<i class="tile${oferta ? " of" : ""}" style="background:radial-gradient(120% 90% at 50% 30%, #fff 0%, ${bg} 70%)">
    <svg viewBox="0 0 120 120" class="prod">${prod[n](c)}<ellipse cx="60" cy="106" rx="34" ry="4" fill="rgba(0,0,0,.08)"/></svg>
    ${canto ? `<span class="corner">${canto}</span>` : ""}
    ${k % 3 === 0 && !oferta ? `<span class="tag">-${[20, 30, 40][k % 3 === 0 ? (k / 3) % 3 : 0]}%</span>` : ""}
    <span class="price">R$ ${preco},90</span>
    ${oferta ? `<span class="bf">BLACK FRIDAY</span>` : ""}
  </i>`;
}

// ---------- barra de status ----------
// net: "wifi" ou "4g"; trocaRede: instante em que o Wi-Fi cai e entra o 4G (opcional)
export function status({ hora = "09:41", escuro = false, net = "wifi", trocaRede = null, anim } = {}) {
  const wifi = `<span class="wf"${trocaRede != null ? ` style="animation:${anim("hide", 0.25, trocaRede, "ease")}"` : ""}>${ic.wifi}</span>`;
  const g4 = `<span class="g4"${trocaRede != null ? ` style="opacity:0;animation:${anim("pop", 0.4, trocaRede + 0.2, "cubic-bezier(.34,1.56,.64,1)")}"` : ""}>4G</span>`;
  return `<div class="sb${escuro ? " dk" : ""}"><span class="hr">${hora}</span><span class="rt">${ic.sig}${net === "4g" ? g4 : trocaRede != null ? g4 + wifi : wifi}${ic.bat}</span></div>`;
}
export const homeBar = (escuro) => `<div class="hb${escuro ? " dk" : ""}"></div>`;

// ---------- CSS de todas as peças ----------
export const css = `
.appic { display: inline-grid; place-items: center; flex: none; box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); }
.appic svg { width: 64%; height: 64%; }
.sb { position: absolute; top: 0; left: 0; right: 0; height: 74px; padding: 22px 34px 0 44px; display: flex; justify-content: space-between; align-items: center; font-size: 25px; font-weight: 650; letter-spacing: -.01em; color: #111; z-index: 25; }
.sb.dk { color: #fff; }
.sb .hr { width: 120px; }
.sb .rt { display: flex; gap: 7px; align-items: center; }
.sb .rt svg { height: 19px; width: auto; }
.sb .rt > svg:last-child { height: 21px; }
.sb .wf svg { height: 20px; }
.sb .g4 { font-size: 20px; font-weight: 750; letter-spacing: 0; }
.hb { position: absolute; bottom: 10px; left: 50%; width: 170px; height: 6px; margin-left: -85px; border-radius: 3px; background: #111; z-index: 25; }
.hb.dk { background: #fff; }

/* bloqueio */
.lock { position: absolute; inset: 0; color: #fff; text-align: center; overflow: hidden;
  background: radial-gradient(70% 45% at 20% 18%, #5b4bd6 0%, transparent 70%), radial-gradient(60% 50% at 90% 70%, #d65b8f 0%, transparent 70%), radial-gradient(80% 60% at 30% 100%, #1d6fa3 0%, transparent 70%), #141026; }
.lock::before { content: ""; position: absolute; inset: 0; backdrop-filter: blur(30px); background: rgba(10,8,20,.15); }
.lock > * { position: relative; }
.lock .ldate { margin-top: 112px; font-size: 25px; font-weight: 600; opacity: .9; }
.lock .lclock { font-size: 150px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; margin: 2px 0 44px; font-feature-settings: "tnum"; }
.lock .lbot { position: absolute; bottom: 52px; left: 54px; right: 54px; display: flex; justify-content: space-between; }
.lock .lbot span { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,.2); display: grid; place-items: center; }
.lock .lbot svg { width: 30px; height: 30px; }
.nt { display: flex; gap: 16px; align-items: flex-start; text-align: left; margin: 0 16px 12px; padding: 18px 18px 18px 16px; border-radius: 30px;
  background: rgba(245,245,250,.62); color: #111; backdrop-filter: blur(16px); box-shadow: 0 6px 20px rgba(0,0,0,.12); }
.nt .tx { flex: 1; min-width: 0; }
.nt .l1 { display: flex; justify-content: space-between; gap: 10px; font-size: 21px; font-weight: 700; line-height: 1.2; }
.nt .l1 em { font-style: normal; font-weight: 500; color: rgba(0,0,0,.45); font-size: 18px; white-space: nowrap; flex: none; }
.nt .l2 { font-size: 19.5px; line-height: 1.28; color: rgba(0,0,0,.78); margin-top: 2px; }
.nt.ban { position: absolute; left: 0; right: 0; top: 64px; background: rgba(250,250,252,.92); z-index: 22; }

/* Central de Controle */
.cc { position: absolute; inset: 0; padding: 104px 28px 0; background: linear-gradient(180deg, rgba(40,40,46,.95), rgba(20,20,24,.98)); color: #fff;
  display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 96px; gap: 18px; }
.cc .mod { border-radius: 34px; background: rgba(120,120,128,.32); }
.cc .con { grid-column: span 2; grid-row: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 22px; align-items: center; justify-items: center; }
.cc .bt { width: 72px; height: 72px; border-radius: 50%; background: rgba(120,120,128,.55); display: grid; place-items: center; color: #fff; }
.cc .bt svg { width: 36px; height: 36px; }
.cc .bt.on-o { background: #ff9500; } .cc .bt.on-g { background: #34c759; } .cc .bt.on-b { background: #0a84ff; }
@keyframes wifioff { to { background: rgba(120,120,128,.55) } }
.cc .mus { grid-column: span 2; grid-row: span 2; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
.cc .mus b { font-size: 22px; } .cc .mus span { font-size: 19px; opacity: .55; }
.cc .mus .ctl { display: flex; justify-content: space-around; } .cc .mus .ctl svg { width: 34px; height: 34px; }
.cc .sq { display: grid; place-items: center; } .cc .sq svg { width: 40px; height: 40px; }
.cc .sld { grid-row: span 2; position: relative; overflow: hidden; display: grid; place-items: end center; padding-bottom: 22px; }
.cc .sld::before { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: var(--v); background: #fff; }
.cc .sld svg { position: relative; width: 38px; height: 38px; color: #8e8e93; }
.cc .wide { grid-column: span 2; display: flex; align-items: center; gap: 16px; padding: 0 24px; font-size: 21px; font-weight: 600; }
.cc .wide svg { width: 34px; height: 34px; }
.tap { position: absolute; width: 110px; height: 110px; border-radius: 50%; background: rgba(255,255,255,.55); opacity: 0; z-index: 30; pointer-events: none; }
.tap.esc { background: rgba(0,0,0,.28); }
@keyframes tap { 0% { opacity: .7; transform: scale(.35) } 100% { opacity: 0; transform: scale(1.5) } }

/* Safari */
.saf { position: absolute; inset: 0; background: #fff; color: #111; overflow: hidden; z-index: 27; }
.saf .site { position: absolute; inset: 74px 0 168px; overflow: hidden; }
.saf .shead { height: 78px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; border-bottom: 1px solid #eee; }
.saf .slogo { font-size: 30px; font-weight: 900; letter-spacing: -.04em; }
.saf .slogo i { font-style: normal; color: #e0263f; }
.saf .burger { width: 34px; height: 4px; background: #111; box-shadow: 0 10px 0 #111, 0 -10px 0 #111; border-radius: 2px; }
.saf .hero { height: 380px; margin: 18px 20px; border-radius: 22px; position: relative; overflow: hidden; background: #e9e4dc; }
.saf .hero .img { position: absolute; inset: 0; background: radial-gradient(60% 70% at 70% 45%, #d0643b 0%, transparent 60%), radial-gradient(50% 60% at 25% 60%, #1f3b73 0%, transparent 65%), #e9d9c6; filter: blur(34px); transform: scale(1.2); }
@keyframes focus { to { filter: blur(6px) } }
.saf .spin { position: absolute; left: 50%; top: 50%; width: 64px; height: 64px; margin: -32px; border-radius: 50%; border: 6px solid rgba(255,255,255,.35); border-top-color: #fff; animation: girar .9s linear infinite; }
@keyframes girar { to { transform: rotate(360deg) } }
.saf .ln { height: 26px; border-radius: 8px; margin: 14px 20px; background: linear-gradient(90deg,#eee 25%,#f8f8f8 50%,#eee 75%) 0 0/300% 100%; animation: shimmer 1.2s linear infinite; }
.saf .ln.s { width: 55%; }
@keyframes shimmer { from { background-position: 100% 0 } to { background-position: -200% 0 } }
.saf .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 168px; background: rgba(248,248,250,.97); border-top: 1px solid #e3e3e6; padding: 16px 18px 0; }
.saf .addr { height: 62px; border-radius: 18px; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,.08); display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 23px; color: #222; position: relative; overflow: hidden; }
.saf .addr svg { width: 20px; height: 20px; color: #666; }
.saf .addr .rl { position: absolute; right: 16px; width: 26px; height: 26px; color: #444; }
.saf .addr .prog { position: absolute; left: 0; bottom: 0; height: 4px; width: 100%; background: #0a84ff; transform-origin: left; transform: scaleX(0); }
@keyframes load { 0% { transform: scaleX(0) } 25% { transform: scaleX(.2) } 70% { transform: scaleX(.36) } 100% { transform: scaleX(.52) } }
.saf .tools { display: flex; justify-content: space-around; padding-top: 18px; color: #0a84ff; }
.saf .tools svg { width: 32px; height: 32px; } .saf .tools .off { color: #c7c7cc; }
.timer { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; top: 500px; background: rgba(20,20,20,.94); color: #fff; border-radius: 34px; padding: 22px 40px 24px;
  text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,.35); white-space: nowrap; z-index: 26; }
.timer .num { font-size: 92px; font-weight: 800; color: #ffcc00; font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.timer .num::after { content: counter(n) "," counter(d) " s"; counter-reset: n var(--n) d var(--d); }
.timer small { display: block; font-size: 22px; font-weight: 600; opacity: .75; margin-top: -4px; }

/* Instagram (perfil de loja) */
.ig { position: absolute; inset: 0; background: #fff; overflow: hidden; color: #111; }
.ig::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 74px; background: #fff; z-index: 6; }
.ig .top { position: absolute; left: 0; right: 0; top: 74px; height: 64px; display: flex; align-items: center; gap: 14px; padding: 0 22px; background: #fff; z-index: 6; font-size: 27px; font-weight: 750; }
.ig .top svg { width: 30px; height: 30px; } .ig .top .sp { flex: 1; }
.ig .feed { position: absolute; left: 0; right: 0; top: 138px; }
.ig .prof { display: flex; align-items: center; gap: 26px; padding: 12px 22px 0; }
.ig .ring { width: 132px; height: 132px; border-radius: 50%; padding: 5px; background: conic-gradient(from 210deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75); flex: none; }
.ig .ring > b, .lb .av > b, .wa .av > b { display: grid; place-items: center; width: 100%; height: 100%; border-radius: 50%; border: 4px solid #fff; background: #141414; color: #ffcc00; font-size: 46px; font-weight: 900; letter-spacing: -.05em; }
.ig .stats { flex: 1; display: flex; justify-content: space-between; text-align: center; font-size: 19px; color: #333; }
.ig .stats b { display: block; font-size: 25px; color: #111; }
.ig .bio { padding: 12px 22px 0; font-size: 20px; line-height: 1.34; }
.ig .bio b { font-size: 21px; } .ig .bio .cat { color: #737373; } .ig .bio .lk { color: #00376b; font-weight: 650; }
.ig .acts { display: flex; gap: 8px; padding: 14px 22px 0; }
.ig .acts span { flex: 1; height: 50px; border-radius: 12px; background: #efefef; display: grid; place-items: center; font-size: 20px; font-weight: 700; }
.ig .acts .seg { background: #0095f6; color: #fff; } .ig .acts .ad { flex: 0 0 50px; } .ig .acts svg { width: 24px; height: 24px; }
.ig .hl { display: flex; gap: 18px; padding: 18px 22px 8px; }
.ig .hl div { width: 86px; text-align: center; font-size: 16px; }
.ig .hl i { display: grid; place-items: center; width: 86px; height: 86px; border-radius: 50%; border: 2px solid #dbdbdb; padding: 4px; }
.ig .hl i span { display: grid; place-items: center; width: 100%; height: 100%; border-radius: 50%; }
.ig .hl svg { width: 34px; height: 34px; }
.ig .tabs { display: flex; border-top: 1px solid #efefef; margin-top: 6px; }
.ig .tabs span { flex: 1; height: 60px; display: grid; place-items: center; color: #8e8e8e; }
.ig .tabs span.on { color: #111; box-shadow: inset 0 -2px 0 #111; } .ig .tabs svg { width: 30px; height: 30px; }
.ig .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; }
.tile { position: relative; aspect-ratio: 4 / 5; overflow: hidden; display: block; }
.tile .prod { position: absolute; left: 10%; top: 8%; width: 80%; height: 72%; }
.tile .corner { position: absolute; right: 8px; top: 8px; width: 24px; height: 24px; color: #fff; filter: drop-shadow(0 1px 2px rgba(0,0,0,.5)); }
.tile .tag { position: absolute; left: 8px; top: 8px; background: #111; color: #ffcc00; font-size: 15px; font-weight: 900; padding: 3px 7px; border-radius: 6px; }
.tile .price { position: absolute; left: 0; right: 0; bottom: 8px; text-align: center; font-size: 16px; font-weight: 800; color: #222; }
.tile.of { background: #111 !important; }
.tile .bf { position: absolute; left: 8px; right: 8px; top: 40%; text-align: center; background: #ffcc00; color: #111; font-size: 15px; font-weight: 900; padding: 6px 0; border-radius: 6px; }
.ig .nav { position: absolute; left: 0; right: 0; bottom: 0; height: 96px; background: #fff; border-top: 1px solid #efefef; display: flex; justify-content: space-around; padding-top: 16px; z-index: 6; }
.ig .nav svg { width: 32px; height: 32px; } .ig .nav .me { width: 34px; height: 34px; border-radius: 50%; background: #c7a27c; border: 2px solid #111; }
.toast { position: absolute; left: 24px; right: 24px; z-index: 28; border-radius: 26px; padding: 22px 24px; display: flex; gap: 16px; align-items: center; font-size: 23px; font-weight: 700;
  background: rgba(28,28,30,.94); color: #fff; box-shadow: 0 20px 50px rgba(0,0,0,.35); }
.toast svg { width: 40px; height: 40px; flex: none; }
.toast small { display: block; font-size: 19px; font-weight: 500; opacity: .7; }

/* link da bio */
.lb { position: absolute; inset: 0; background: linear-gradient(180deg, #f3ead9 0%, #faf7f1 45%, #fff 100%); text-align: center; color: #1b1b1b; overflow: hidden; }
.lb .ub { position: absolute; left: 18px; right: 18px; top: 72px; height: 50px; border-radius: 14px; background: rgba(255,255,255,.8); display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 19px; color: #555; }
.lb .ub svg { width: 16px; height: 16px; }
.lb .av { width: 128px; height: 128px; margin: 150px auto 14px; border-radius: 50%; padding: 4px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.12); }
.lb .nm { font-size: 28px; font-weight: 800; } .lb .ds { font-size: 19px; color: #6b6b6b; margin: 6px 0 26px; }
.lb .bt { position: relative; height: 92px; margin: 0 28px 16px; border-radius: 22px; background: #fff; box-shadow: 0 2px 0 rgba(0,0,0,.06), 0 6px 18px rgba(0,0,0,.06);
  display: flex; align-items: center; padding: 0 18px; gap: 16px; font-size: 22px; font-weight: 700; text-align: left; }
.lb .bt .bi { width: 56px; height: 56px; border-radius: 16px; display: grid; place-items: center; flex: none; color: #fff; }
.lb .bt .bi svg { width: 32px; height: 32px; }
.lb .bt .st { margin-left: auto; width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; color: #fff; opacity: 0; }
.lb .bt .st svg { width: 24px; height: 24px; } .lb .bt .st.ok { background: #22c55e; } .lb .bt .st.er { background: #ef4444; }
@keyframes press { 40% { transform: scale(.96) } 100% { transform: none } }
@keyframes shake { 15% { transform: translateX(-14px) } 30% { transform: translateX(12px) } 45% { transform: translateX(-9px) } 60% { transform: translateX(6px) } 100% { transform: none; box-shadow: 0 0 0 3px #ef4444 } }
.lb .ft { position: absolute; bottom: 40px; left: 0; right: 0; font-size: 17px; color: #9a9a9a; }

/* WhatsApp */
.wa { position: absolute; inset: 0; background: #0b141a; color: #e9edef; overflow: hidden; }
.wa .wall { position: absolute; inset: 0; opacity: .06; background-size: 220px 220px; }
.wa .hd { position: absolute; left: 0; right: 0; top: 0; padding: 74px 18px 14px; background: #1f2c34; display: flex; align-items: center; gap: 12px; z-index: 5; }
.wa .hd .bk { display: flex; align-items: center; color: #e9edef; font-size: 21px; } .wa .hd .bk svg { width: 28px; height: 28px; }
.wa .av { width: 62px; height: 62px; border-radius: 50%; flex: none; }
.wa .av > b { border: 0; font-size: 24px; }
.wa .hd .nm { flex: 1; } .wa .hd .nm b { display: block; font-size: 24px; } .wa .hd .nm span { font-size: 17px; color: #8696a0; }
.wa .hd svg.i { width: 32px; height: 32px; color: #e9edef; margin-left: 14px; }
.wa .chip { position: absolute; top: 196px; left: 50%; transform: translateX(-50%); background: #182229; color: #8696a0; font-size: 17px; font-weight: 600; padding: 8px 16px; border-radius: 10px; letter-spacing: .04em; }
.wa .msg { position: absolute; right: 18px; top: 250px; max-width: 350px; padding: 12px 16px 10px; border-radius: 16px 4px 16px 16px; background: #005c4b; font-size: 23px; line-height: 1.3; }
.wa .msg::after { content: ""; position: absolute; right: -10px; top: 0; border: 10px solid transparent; border-top-color: #005c4b; border-left-color: #005c4b; border-width: 0 0 12px 12px; }
.wa .msg small { display: flex; justify-content: flex-end; align-items: center; gap: 4px; font-size: 16px; color: rgba(233,237,239,.6); margin-top: 4px; }
.wa .msg small svg { width: 20px; height: 12px; color: #8696a0; }
.wa .inp { position: absolute; left: 0; right: 0; bottom: 0; padding: 10px 12px 34px; display: flex; align-items: center; gap: 10px; background: #0b141a; z-index: 5; }
.wa .inp .pl { width: 34px; height: 34px; color: #8696a0; }
.wa .inp .box { flex: 1; height: 56px; border-radius: 28px; background: #1f2c34; display: flex; align-items: center; padding: 0 16px; gap: 12px; color: #8696a0; font-size: 21px; }
.wa .inp .box svg { width: 28px; height: 28px; } .wa .inp .box .gr { flex: 1; }
.wa .inp .mic { width: 56px; height: 56px; border-radius: 50%; background: #00a884; display: grid; place-items: center; color: #0b141a; }
.wa .inp .mic svg { width: 28px; height: 28px; }
.wa .noite { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
@keyframes noite { 0% { background: rgba(0,0,0,0) } 55% { background: rgba(0,0,10,.45) } 100% { background: rgba(255,210,120,.06) } }
.wa .relogio { position: absolute; top: 470px; left: 0; right: 0; text-align: center; z-index: 6; color: #fff; }
.wa .relogio .h { position: relative; height: 120px; font-size: 118px; font-weight: 700; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
.wa .relogio .h span { position: absolute; left: 0; right: 0; visibility: hidden; }
.wa .relogio .ce { position: relative; height: 70px; margin-top: 10px; }
.wa .relogio .ce span { position: absolute; left: 50%; width: 62px; margin-left: -31px; }
.wa .relogio .lua { color: #c7d2fe; } .wa .relogio .sol { color: #ffcc00; opacity: 0; }
.wa .relogio .leg { font-size: 22px; color: #aebac1; letter-spacing: .14em; text-transform: uppercase; margin-top: 6px; }

/* botão de WhatsApp de verdade */
.wabtn { display: inline-flex; align-items: center; gap: 18px; background: #25d366; color: #fff; border-radius: 100px; padding: 24px 46px 24px 30px; font-size: 36px; font-weight: 800;
  letter-spacing: -.01em; box-shadow: 0 16px 40px rgba(37,211,102,.35), inset 0 -4px 0 rgba(0,0,0,.12); white-space: nowrap; }
.wabtn svg { width: 56px; height: 56px; }
`;

// papel de parede do WhatsApp: desenhos de traço pequenos, repetidos
export const waWallpaper = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'>
<circle cx='30' cy='30' r='12'/><path d='M24 30h12M30 24v12'/><path d='M80 20l10 18H70z'/><rect x='140' y='16' width='26' height='20' rx='5'/><path d='M146 22h14'/>
<path d='M190 40c8-10 22-10 22 2s-22 20-22 20-22-8-22-20 14-12 22-2z'/><path d='M20 90c10-12 30-12 40 0'/><circle cx='110' cy='90' r='14'/><path d='M104 86h.1M116 86h.1M104 96c4 4 8 4 12 0'/>
<path d='M160 80l20 20M180 80l-20 20'/><rect x='20' y='140' width='30' height='40' rx='6'/><path d='M30 150h10'/><path d='M80 150q15-20 30 0t30 0'/><circle cx='190' cy='160' r='16'/><path d='M190 150v10l7 5'/>
<path d='M30 205l12-12 12 12'/><path d='M100 200h40M120 190v20'/><path d='M170 200c0-8 16-8 16 0s16 8 16 0'/></svg>`)}")`;
