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
- **Portfólio real** (conferido no ar em 15/11/2026; os sites mudam, então **antes de afirmar qualquer coisa sobre um deles, abra o site no ar e confira**; o site é carregado por JavaScript, então leia com o navegador headless, por exemplo `google-chrome --headless=new --virtual-time-budget=12000 --dump-dom URL`):
  - Estação Fitness (https://estacao-fitness.com/): academia em Curitiba desde 2015; musculação, lutas e ritmos (5 modalidades); estrutura em 2 andares; horários da academia e de cada aula no site; botão "Matricule-se" e contato pelo WhatsApp.
  - Randi Barbearia Visagista (https://randibarbearia.com/): barbearia premium em Curitiba; serviços com preço à vista, planos mensais com valores, avaliações do Google no próprio site, agendamento online, workshop "Barbeiro Prime" para barbeiros.
  - Hudema Race Store (https://www.hudemaoficial.com.br/): loja oficial de drag race; hoje o site mostra página "EM BREVE" (lançamento em breve).
- Pagamento: Pix (50% para iniciar, 50% na entrega) ou cartão (integral, parcelado pela operadora). Prazos: sob orçamento (nunca publique prazo).
- **Preço**: a tabela completa nunca vai para o feed (ela é enviada no WhatsApp, em PDF). Preço só aparece em post de **oferta ativa** listada abaixo, no formato de/por. Fora disso, nenhum valor.

## Ofertas ativas

- **Black November VG, válida até 30/11/2026** (projetos fechados até essa data). Sites: 20% off no projeto (Landing Page de R$ 1.497 por R$ 1.197; Institucional de R$ 2.497 por R$ 1.997; Multipáginas de R$ 3.997 por R$ 3.197; Premium a partir de R$ 4.797). Robôs: implantação pela metade (Atendente de R$ 797 por R$ 397; Agendador de R$ 1.497 por R$ 747; IA Avançado de R$ 2.997 por R$ 1.497). Mensalidades sem alteração. Os posts da campanha já estão na fila (16-0 com contagem de 15 dias; sufixo -2 em 19, 21, 24, 27 e 29/11); depois de 30/11 não mencione mais a Black.
- Nenhuma outra. Não invente desconto, brinde ou condição da VG.

## Regras que não se quebram

1. **Nunca** diga que a VG atende "pequenas empresas", "negócio pequeno" ou similar. Use "a sua empresa", "o seu negócio", "empresas". O dono reprovou isso.
2. **Português do Brasil** sempre. Nada de termos de Portugal.
3. **Nada inventado**: sem números de clientes, resultados, depoimentos, estatísticas ou cases que não estejam aqui. Dado de mercado só com fonte confiável que você leu na pesquisa da semana, e mesmo assim prefira não usar número.
4. Sem cara de IA: proibido "no mundo digital de hoje", "revolucione", "alavanque", "potencialize", "transforme seu negócio", "não é só X, é Y", "descubra", emoji em excesso (no máximo 1 por legenda, de preferência zero), listas de hashtags gigantes, perguntas-isca no fim ("e você, o que acha?").
5. Uma ideia por post. Fale com o dono de negócio, direto, frases curtas, concreto. Tom de agência séria, não de vendedor.
6. Toda legenda termina com o CTA: "Orçamento pelo WhatsApp, link na bio." (ou variação curta) e 3 a 5 hashtags em minúsculas, incluindo #vgtecnologia.

Os posts também saem na **Página do Facebook** da VG (mesma imagem/vídeo e legenda), pelo `publish-facebook.mjs`, quando os secrets `FB_PAGE_ID` e `FB_PAGE_TOKEN` estão cadastrados.

## Ritmo da semana (4 posts, 12h)

**Decisão do dono (25/11): não postamos mais todo dia.** São 4 posts por semana. Mesmo que o pedido da rotina fale em "7 dias", escreva só estes 4 arquivos por semana:

| Dia | Formato | Linha |
|---|---|---|
| Seg | **reel** animado | erro comum / o que o cliente procura |
| Qua | carrossel (5–7 lâminas) | serviço explicado (site, sistema, automação, consultoria, suporte) ou portfólio por dentro |
| Qui | **reel** animado | passo a passo / checklist prático |
| Sáb | imagem única (statement) | dica rápida |

Contagem regressiva, "último dia" e lembretes de campanha vão em **story** (`"story": true`), não no feed. Dois posts no mesmo dia só em data comercial forte (ex.: o dia da Black Friday), o segundo às 18h.

**Banco de conteúdo (`banco/`)**: posts bons que saíram da fila ou que já foram ao ar para ninguém (a conta começou com 0 seguidores). Antes de criar um tema do zero, veja se algum do banco vira reel animado. Ao usar um, mova o arquivo para `posts/` com a data nova e refaça no formato atual. Também valem para reaproveitar como reel os posts já publicados e arquivados pelo dono: 17/11 (o cliente decide antes de abrir o WhatsApp), 18/11 (Instagram é vitrine, site é a loja), 19/11 (o WhatsApp pode atender sozinho), 20/11 (sua empresa ainda roda no caderno?), 21/11 (site lento no celular perde o cliente) e 22/11 (por dentro do site da Randi; conferir no ar, agora tem app de agendamento com pontos).

**Reels (alcance para quem ainda não segue)**: a conta começou do zero, e post de feed só chega em quem segue; Reels chega em quem não segue. Toda semana, **segunda** e **quinta** são reel: JSON de carrossel com `"reel": true` e `"motion": "NOME"` (o roteiro animado em `motion/NOME.mjs`, feito com o motor `motion/motor.mjs` e o kit `motion/kit.mjs`; veja `motion/compre-de-voce.mjs` e `motion/quem-somos.mjs` como modelo). O render (`reel.mjs`) gera `out/ID/reel.mp4` animado: palavras entrando uma a uma, marca-texto pintando, número com impacto, barra de progresso, fundo em movimento, transições, CTA com fundo amarelo e botão de WhatsApp, e trilha eletrônica própria sincronizada com as trocas de cena. Com o secret `GEMINI_API_KEY` no GitHub, cada cena ganha locução (o texto da lâmina lido em voz alta) e a música abaixa por baixo da fala; por isso escreva as lâminas de reel para serem ditas em voz alta também. A locução é gerada com antecedência (o post.yml, depois de publicar, prepara a do próximo reel da fila e guarda em `assets/voz/ID/`): o plano grátis do Gemini só dá 10 falas por dia e cada reel usa ~6, então **não mude o texto de um reel depois que a locução dele foi guardada** (se mudar, apague a pasta `assets/voz/ID` para ela ser refeita). Campo opcional `voz: false` desliga a locução de um reel; `locutor` troca a voz (padrão Alnilam, a mesma do reel de lançamento). A primeira lâmina estática vira a capa. Num reel, capa com título curto e forte (é o que segura o dedo nos primeiros segundos), 3 a 5 lâminas de conteúdo com texto enxuto, CTA no fim. Sem lâmina `shot` em reel.

**Visual dos reels (pedido do dono):** estilo animado do zero (`motion/`), com telas de app detalhadas (kit em `motion/kit.mjs`), cerca de 1 minuto, ritmo calmo para dar tempo de ler e olhar. **Fundo sempre liso**: nada de degradê redondo, brilho circular ou anéis (no vídeo eles viram círculos visíveis). Sem som na troca de cena. O final não pode parecer botão (vídeo não tem clique): "Fale com a gente no WhatsApp" + "O link está na bio". Todo reel fecha com o logo, "TECNOLOGIA" embaixo e o slogan "Sua empresa no próximo nível." escrito na tela.

Varie os temas: não repita o ângulo de nenhum post das últimas 4 semanas (veja `posts/`).

**Temas obrigatórios** (pedido do dono):
- **SEO e Google, pelo menos 2 posts por semana**: aparecer na busca do Google e no Google Maps, Perfil da Empresa no Google (horários, fotos, avaliações, categorias), busca local ("perto de mim"), site rápido e bem feito no celular, o que faz um site ser encontrado. Sempre prático: algo que o dono entende e faz ou percebe no próprio negócio. Sem promessa de "primeiro lugar no Google".
- **Datas comerciais**: trabalhe cada data com 1 a 3 semanas de antecedência e durante a data. Em novembro, **Black November / Black Friday** atravessa o mês inteiro; depois Natal, Ano-Novo, volta às aulas, Carnaval, Dia das Mães, Dia dos Pais, Dia do Cliente etc. O ângulo é como a empresa do cliente vende mais nessas datas com site, Google e WhatsApp, e onde a VG entra. A VG não tem promoção própria definida: não invente desconto, brinde ou condição especial da VG.

## Pesquisa da semana (antes de escrever)

Pesquise na web, em português:
- **Concorrentes**: agências e estúdios brasileiros de criação de sites, sistemas e automação de WhatsApp (ex.: buscas "criação de sites Curitiba", "automação WhatsApp para empresas", "agência de sites"). Veja o que postam, quais ângulos funcionam e onde eles são genéricos, para a VG ser diferente.
- **Tendências**: o que está em alta no Instagram de negócios e no assunto (IA no atendimento, WhatsApp Business, Google, sites, novidades da Meta), datas comerciais da semana (Black Friday, Natal, volta às aulas etc.).
- Use a pesquisa para escolher **ângulos**, não para copiar texto. Registre em `pesquisa/AAAA-MM-DD.md` (data da segunda da semana) um resumo curto: concorrentes vistos, tendências, ângulos escolhidos e links.

## Formato dos arquivos

Um arquivo por dia: `posts/AAAA-MM-DD.json` (dois no mesmo dia: `AAAA-MM-DD-1.json`, `-2`). Campo opcional `hora` (9, 12 ou 18; padrão 12): o post sai nesse horário de Brasília. O Instagram não pune mais de um post por dia, mas posts no mesmo dia devem sair espaçados (o segundo às 18h) e nunca ser parecidos entre si.

```json
{
  "caption": "Legenda com \n para quebras de linha.",
  "slides": [ { "t": "cover", "title": "Título com [[marca-texto]] amarelo.", "sub": "Linha de apoio." } ]
}
```

Tipos de lâmina (`t`):
- `cover`: capa do carrossel. `title` (até ~60 caracteres), `sub` opcional.
- `point`: item numerado. `n` ("1", "2"...), `title` (até ~30), `body` (até ~140). `price` opcional: `["R$ 1.497", "R$ 1.197"]` (de, por) mostra o antigo riscado e o novo em destaque; use só em post de oferta.
- `shot`: print do portfólio. `url` (endereço do site; o print é tirado do site no ar na hora do render), `title`, `body`. O texto precisa bater com o que o site mostra hoje.
- `statement`: frase forte (imagem única ou no meio do carrossel). `title` (até ~80), `sub` opcional.
- `count`: contagem regressiva de campanha. `n` (número), `unit` opcional (padrão "dias"), `title`, `sub`. Número gigante com faixa de alerta no topo; só para campanhas com prazo.
- `cta`: lâmina final amarela. `title`, `sub` opcional (padrão: "Orçamento pelo WhatsApp. O link está na bio.").

`[[palavra]]` vira o marca-texto amarelo: no máximo uma ou duas palavras por título. Carrossel: cover, 3–5 lâminas de conteúdo, cta no fim. Imagem única: um `statement`.

Campo opcional `reel: true` num carrossel: publica como Reels em vez de carrossel (veja "Reels" no ritmo da semana).

## Antes de publicar na fila

1. `node render.mjs AAAA-MM-DD` para cada post (precisa de Chrome e ffmpeg; no Linux use `BROWSER=google-chrome`).
2. Abra os JPEGs em `out/` e confira: nada cortado, título sem palavra sozinha numa linha, marca-texto bem colocado. Ajuste o texto se precisar.
3. Commit só de `posts/` e `pesquisa/` com a mensagem "Semana DD/MM a DD/MM" e push em `main`. O resumo para o dono abre sozinho.
