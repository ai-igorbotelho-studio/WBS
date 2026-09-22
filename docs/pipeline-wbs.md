# Pipeline WBS — Design System "WBS" + site one-page (Pablo Baldo)

**Data:** 2026-09-22 · **Recomendação do:** `digital-product-team-head` · **Aprovação de cada gate:** usuário.

## 0. Contexto e premissas (assumidas por ausência de assets)
Fato verificado: o repositório **não contém nenhum asset de marca** (sem imagens, logos, fontes, cores) — só definições de agentes e docs. Logo, o projeto começa por **criação de marca**, não por aplicação de marca.

| # | Premissa assumida | Risco se errada | Como é derrubada |
|---|---|---|---|
| P1 | **WBS** = marca de Pablo Baldo (fundador) para **construção, design e reforma** | Reescrita de copy e naming | Resposta Q1/Q2 do cliente |
| P2 | Paleta e tipografia **a definir pela direção criativa** (sem brand book existente) | Retrabalho de tokens | Cliente enviar manual de marca |
| P3 | **Fotos placeholder** (blocos neutros/silhuetas, sem stock licenciado) até o cliente enviar portfólio real | Site não pode ir a produção com placeholder | Q3 (portfólio) |
| P4 | Site **estático one-page, scroll down**, PT-BR, foco em captar contato (WhatsApp/form) | Se houver necessidade de CMS/área logada, muda a stack | Q4/Q6 |
| P5 | Sem dado sensível além de nome/telefone/e-mail no formulário (LGPD básica) | Exige DPA e política formal | Q7 |
| P6 | Escopo **desktop + mobile 320–1920**, sem app nativo, sem 3D, sem IA | — | — |

**North Star provisória:** contatos qualificados/mês via site. **Métrica de saúde:** LCP < 2,5s em 4G.

## 1. Plano de pipeline (00 → 07)

| # | Estágio | Dono / líder de pod | Entregável do gate | Trade-off sacrificado |
|---|---|---|---|---|
| 00 | **Intake do briefing** | Head | Este documento: premissas P1–P6, critérios de sucesso, lista de perguntas ao cliente, escopo congelado (one-page + DS) | **Certeza** — arrancamos com premissas em vez de esperar o brief completo do cliente; aceitamos retrabalho localizado em troca de não travar o projeto |
| 01 | **Descoberta & arquitetura** | `digital-product-team-ux-architect` (+ `ux-research` leve) | Sitemap da página única (ordem das seções: hero → serviços → como trabalhamos → portfólio → sobre Pablo/equipe → prova social → contato), inventário de conteúdo com placeholders marcados, matriz DACI da decisão | **Profundidade de pesquisa** — sem entrevistas com clientes reais; usamos benchmark de construtoras/reformas e heurística, assumindo risco de posicionamento |
| 02 | **Design + Design System "WBS"** | `digital-product-team-creative-direction` (líder) + `ui-designer`, `ux-architect`, `motion-designer`; `design-system-engineer` para tokens | 3 rotas de conceito → 1 escolhida; **tokens WBS** (cor, tipo, espaço, raio, sombra, breakpoints), componentes base (botão, card de serviço, card de projeto, form, nav, footer), protótipo navegável, estados (vazio/erro/loading do form), notas de a11y (contraste AA) | **Amplitude do DS** — construímos um DS *enxuto para este site*, não uma biblioteca multiproduto; escalabilidade futura sacrificada em favor de entrega |
| 02b | **Conceito interativo** (paralelo) | `digital-product-team-experience-director` (+ `scroll-motion`, `micro-interaction` — condicionais) | Spec de scroll reveal e micro-interações, com fallback `prefers-reduced-motion` | **Ousadia visual** — scrollytelling pesado fica fora; movimento discreto para proteger performance e a11y |
| 02c | **Conteúdo & SEO** (paralelo 02–07) | `digital-product-team-growth-lead` → `content-seo` | Copy PT-BR por seção, metatags, `LocalBusiness` schema, CTA WhatsApp | **Volume de conteúdo** — sem blog nesta fase; SEO local primeiro |
| 03 | **Implementação** | `digital-product-team-engineering-lead` → `frontend-multistack` (+ `design-system-engineer`, `motion-designer`) | Site one-page funcional a partir dos tokens, responsivo 320–1920, testes dos componentes e do formulário, imagens placeholder isoladas atrás de um único módulo de assets | **Flexibilidade de stack** — escolha única (site estático, sem CMS); trocar por CMS depois custa uma migração |
| 04 | **Integração & dados** | `digital-product-team-backend-integration` | Envio do formulário (serviço de e-mail/form endpoint) com validação, anti-spam, consentimento LGPD, **sem segredo no diff**; link WhatsApp | **Autonomia** — dependemos de serviço externo de formulário em vez de backend próprio; menos controle, muito menos custo |
| 05 | **Auditoria** (nunca pulada) | `digital-product-team-quality-lead` → `audit-code`, `audit-design`, `security-privacy`, `qa-cross-browser` | **Veredito APROVADO** + relatório; bloqueante explícito: *não subir a produção com foto placeholder ou dado de contato fictício* | **Velocidade** — aceitamos 1 ciclo extra de correção antes do deploy |
| 06 | **Deploy** | `digital-product-team-devops-deploy` | Site no ar (host estático + CDN), domínio/HTTPS, rollback testado, monitoramento de uptime — **só após 05** | **Sofisticação de infra** — host estático simples; sem pipeline multi-ambiente |
| 07 | **Pós-lançamento** | Head + `analytics-growth` | Analytics privacy-first, eventos de CTA/form, leitura em 30 dias, plano de iteração, entrada em `DECISIONS.md` | **Precisão de atribuição** — sem cookies de terceiros/remarketing na v1 |

**Ordem de precedência:** 00 → 01 → 02 (+02b/02c) → 03 → 04 → 05 → 06 → 07. Nada avança sem aprovação do usuário no gate.

## 2. Matriz DACI resumida

| Decisão | Recomenda (Driver) | Consultado | Aprova | Decide (Head) | Executa |
|---|---|---|---|---|---|
| Naming/posicionamento da marca WBS | `creative-direction` | `content-seo`, `ux-architect` | Usuário | Head | `ui-designer` |
| Paleta + tipografia (tokens WBS) | `ui-designer` | `creative-direction`, `audit-design` | Usuário | Head | `design-system-engineer` |
| Escopo do Design System (enxuto vs. biblioteca) | `design-system-engineer` | `engineering-lead` | Usuário | Head | pod Engineering |
| Stack do site (estático vs. CMS) | `frontend-multistack` | `backend-integration`, pod auditoria | Usuário | Head | pod Engineering |
| Intensidade de motion/scroll | `experience-director` | `audit-design`, `system-performance` (cond.) | Usuário | Head | `scroll-motion` |
| Tratamento de placeholder de imagem | `creative-direction` | `audit-design` | Usuário | Head | `frontend-multistack` |
| Captura de dado pessoal no form (LGPD) | `security-privacy` | `analytics-growth` | Usuário | Head | `backend-integration` |
| Aprovação de cada gate | pod de auditoria / dono do estágio | — | **Usuário** | Head recomenda | Head libera o próximo estágio |

## 3. Perguntas ao cliente (bloqueiam 02 e, algumas, o gate 05)

**Assets e marca**
1. Existe logo, manual de marca, fontes ou paleta já em uso? Em que formato (AI/SVG/PDF)?
2. "WBS" é sigla de quê? Deve aparecer por extenso? Há razão social associada?
3. Há fotos próprias de obras/projetos? Quantas, com que qualidade, e há autorização de uso do cliente final? *(bloqueia produção — P3)*

**Negócio e serviços**
4. Quais serviços entram no site e em que ordem de prioridade (construção, design de interiores, reforma, gerenciamento de obra, projeto)?
5. Ticket/porte típico e público-alvo (residencial, comercial, alto padrão?).
6. Há orçamento online, calculadora ou só contato? Deseja área de cliente/CMS para editar conteúdo?

**Contato e conversão**
7. Telefone/WhatsApp oficial, e-mail, horário de atendimento — e para onde os leads devem chegar?
8. Redes sociais (Instagram principalmente) para link e prova social?

**Região**
9. Cidade(s)/região atendida e endereço público (define SEO local, Google Business, schema `LocalBusiness`).

**Portfólio e prova social**
10. 3 a 6 projetos para destacar: nome, local, escopo, ano, antes/depois? Depoimentos de clientes com autorização?

**Formal**
11. CNPJ, razão social, e registro **CREA/CAU** (número e responsável técnico) para o rodapé — exigência de credibilidade e, em muitos casos, legal.
12. Domínio já registrado? Quem controla o DNS e a hospedagem?

**Prazo/orçamento**
13. Data-alvo de publicação e teto de orçamento (define o que cai do escopo primeiro: motion, portfólio rico, CMS).

## 4. Trade-off global desta recomendação
Escolhemos **avançar com marca inventada e conteúdo placeholder** para entregar DS + site navegável rápido. O sacrificado é a **fidelidade ao negócio real**: nada do que for produzido até as respostas 1–3, 7, 9–11 pode ir a produção. É um protótipo de alta fidelidade primeiro, produto depois.

## 5. Próximo passo
Aprovação do **gate 00** pelo usuário → Head aciona `digital-product-team-ux-architect` (estágio 01) e registra a decisão em `DECISIONS.md`.
