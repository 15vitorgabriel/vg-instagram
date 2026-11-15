# Guia de conteúdo do Instagram da VG Tecnologia

Este guia é a fonte da verdade para quem escreve os posts (a rotina semanal do Claude). Leia inteiro antes de escrever.

## A empresa (só estes fatos; não invente outros)

- **VG Tecnologia** · site: vgtecnologia.com · Instagram: @_vgtecnologia · contato: WhatsApp (link na bio).
- Slogan do site: "Sua empresa no próximo nível." Promessa: "sites que vendem 24 horas, sistemas sob medida e atendimento automático no WhatsApp".
- **Serviços** (texto do site):
  - **Desenvolvimento Web**: sites modernos, rápidos e 100% personalizados. Feitos do zero, sem templates prontos. Perfeitos no celular, tablet e computador. Pensados para performance e SEO.
  - **Sistemas Personalizados**: feitos do zero a partir da rotina e dos processos do negócio, sem adaptar a empresa a um software pronto. Funcionam no computador e no celular. Evoluem conforme o negócio cresce.
  - **Automações Inteligentes**: robôs que atendem, agendam e confirmam clientes pelo WhatsApp, 24 horas por dia (feitos com N8N). Atendimento automático, agendamentos e confirmações, respostas instantâneas todos os dias.
  - **Consultoria**: diagnóstico do negócio digital, indicação das tecnologias ideais, plano de melhorias reais.
  - **Suporte e Manutenção**: do planejamento à entrega, e depois dela. Ajustes e evoluções conforme o cliente cresce.
- **Portfólio real** (imagens em `assets/`):
  - Estação Fitness (estacao-fitness.com, `estacao-fitness.jpg`): academia; modalidades, estrutura, horários e matrícula direto pelo WhatsApp.
  - Randi Barbearia Visagista (randibarbearia.com, `randi-barbearia.jpg`): barbearia premium em Curitiba; cortes, planos, avaliações de clientes e agendamento online.
  - Hudema Race Store (hudemaoficial.com.br, `hudema.jpg`): loja de drag race; catálogo e carrinho; em fase final de lançamento.
- Pagamento: transferência, Pix e cartão. Valores e prazos: sob orçamento (nunca publique preço ou prazo).

## Regras que não se quebram

1. **Nunca** diga que a VG atende "pequenas empresas", "negócio pequeno" ou similar. Use "a sua empresa", "o seu negócio", "empresas". O dono reprovou isso.
2. **Português do Brasil** sempre. Nada de termos de Portugal.
3. **Nada inventado**: sem números de clientes, resultados, depoimentos, estatísticas ou cases que não estejam aqui. Dado de mercado só com fonte confiável que você leu na pesquisa da semana, e mesmo assim prefira não usar número.
4. Sem cara de IA: proibido "no mundo digital de hoje", "revolucione", "alavanque", "potencialize", "transforme seu negócio", "não é só X, é Y", "descubra", emoji em excesso (no máximo 1 por legenda, de preferência zero), listas de hashtags gigantes, perguntas-isca no fim ("e você, o que acha?").
5. Uma ideia por post. Fale com o dono de negócio, direto, frases curtas, concreto. Tom de agência séria, não de vendedor.
6. Toda legenda termina com o CTA: "Orçamento pelo WhatsApp, link na bio." (ou variação curta) e 3 a 5 hashtags em minúsculas, incluindo #vgtecnologia.

## Ritmo da semana (12h, todos os dias)

| Dia | Formato | Linha |
|---|---|---|
| Seg | carrossel (5–7 lâminas) | erro comum / o que o cliente procura |
| Ter | imagem única (statement) | uma afirmação forte |
| Qua | carrossel | serviço explicado (site, sistema, automação, consultoria) |
| Qui | carrossel | passo a passo / checklist prático |
| Sex | imagem única | bastidor, diferencial ou mito |
| Sáb | imagem única | dica rápida |
| Dom | carrossel | portfólio por dentro (alternar Estação Fitness, Randi, Hudema) |

Varie os temas: não repita o ângulo de nenhum post das últimas 4 semanas (veja `posts/`).

## Pesquisa da semana (antes de escrever)

Pesquise na web, em português:
- **Concorrentes**: agências e estúdios brasileiros de criação de sites, sistemas e automação de WhatsApp (ex.: buscas "criação de sites Curitiba", "automação WhatsApp para empresas", "agência de sites"). Veja o que postam, quais ângulos funcionam e onde eles são genéricos, para a VG ser diferente.
- **Tendências**: o que está em alta no Instagram de negócios e no assunto (IA no atendimento, WhatsApp Business, Google, sites, novidades da Meta), datas comerciais da semana (Black Friday, Natal, volta às aulas etc.).
- Use a pesquisa para escolher **ângulos**, não para copiar texto. Registre em `pesquisa/AAAA-MM-DD.md` (data da segunda da semana) um resumo curto: concorrentes vistos, tendências, ângulos escolhidos e links.

## Formato dos arquivos

Um arquivo por dia: `posts/AAAA-MM-DD.json` (dois no mesmo dia: `AAAA-MM-DD-1.json`, `-2`).

```json
{
  "caption": "Legenda com \n para quebras de linha.",
  "slides": [ { "t": "cover", "title": "Título com [[marca-texto]] amarelo.", "sub": "Linha de apoio." } ]
}
```

Tipos de lâmina (`t`):
- `cover`: capa do carrossel. `title` (até ~60 caracteres), `sub` opcional.
- `point`: item numerado. `n` ("1", "2"...), `title` (até ~30), `body` (até ~140).
- `shot`: print do portfólio. `image` (arquivo em `assets/`), `domain`, `title`, `body`.
- `statement`: frase forte (imagem única ou no meio do carrossel). `title` (até ~80), `sub` opcional.
- `cta`: lâmina final amarela. `title`, `sub` opcional (padrão: "Orçamento pelo WhatsApp. O link está na bio.").

`[[palavra]]` vira o marca-texto amarelo: no máximo uma ou duas palavras por título. Carrossel: cover, 3–5 lâminas de conteúdo, cta no fim. Imagem única: um `statement`.

## Antes de publicar na fila

1. `node render.mjs AAAA-MM-DD` para cada post (precisa de Chrome e ffmpeg; no Linux use `BROWSER=google-chrome`).
2. Abra os JPEGs em `out/` e confira: nada cortado, título sem palavra sozinha numa linha, marca-texto bem colocado. Ajuste o texto se precisar.
3. Commit só de `posts/` e `pesquisa/` com a mensagem "Semana DD/MM a DD/MM" e push em `main`. O resumo para o dono abre sozinho.
