# Plano técnico — Implementação (gate 03/04) · WBS
**Data:** 2026-09-22 · **Dono:** `digital-product-team-engineering-lead` · **Aprovação:** usuário (Head)

Pré-condição: este plano assume que o Design & UX v2 e a camada de Interação &
Motion em `/design` **ainda não estão aprovados**. O que segue cobre a base já
implementada (`site/index.html`) e como absorver v2/motion sem re-arquitetar.

## 1. Stack — recomendação

| | **A — Vanilla + build de tokens Python** | **B — Astro/Eleventy + otimização de imagem** |
|---|---|---|
| Estado | Já implementado (`site/index.html`, `tools/build-tokens.py`, `design-system/tokens.json`) | Reescrita: componentização, pipeline de imagem, build step |
| Complexidade operacional | Nenhuma (arquivo estático, sem `npm install`/build no deploy) | Node toolchain, lockfile, CI de build |
| Adequado ao escopo (1 página, sem CMS, sem rota) | Sim — site cabe inteiro num só HTML | Excesso de ferramenta para 1 página |
| Ganho real de B | `<Image>` otimizado automaticamente, componentes reusáveis se a página crescer | — |
| Risco de A | Duplicação manual se a página virar multi-página; sem otimização automática de imagem | — |

**Recomendação: manter A (vanilla).** É a solução mais simples que resolve —
uma página, sem estado de servidor, sem necessidade de componentização real.
**Trade-off nomeado:** sacrificamos otimização automática de imagem e
componentização — se o site crescer para 3+ páginas ou o cliente pedir blog,
migrar para B (Astro) nesse momento, não agora. Enquanto isso, otimização de
imagem é feita manualmente (WebP/AVIF + `srcset`, já com fontes em WOFF2 desde
a auditoria) e o build de tokens continua via `tools/build-tokens.py` (JSON →
CSS custom properties), sem framework de UI.

Se o Design v2/motion exigir muitas variantes de componente (ex.: scrollytelling
com estado complexo), reavaliar B nesse gate — não antes.

## 2. Contrato do formulário de orçamento

Campos (já implementados em `site/index.html:340-351`): `name` (obrigatório),
`phone` (obrigatório, regex NZ), `email` (opcional), `service` (select),
`message` (obrigatório), `consent` (checkbox obrigatório, texto Privacy Act
2020), honeypot `company` (campo oculto `tabindex="-1"`).

- **Validação:** client-side (`required`, regex de telefone, checkbox de
  consentimento) + `netlify-honeypot="company"` no lado do host. Sem validação
  server-side própria — delegada ao Netlify Forms.
- **Anti-spam:** honeypot (implementado). Se spam persistir pós-lançamento,
  adicionar reCAPTCHA v3 invisível (`data-netlify-recaptcha`) — não incluir
  agora para não adicionar dependência de terceiro sem necessidade comprovada.
- **Destino:** Netlify Forms → notificação por e-mail para
  `pablo.wbs@gmail.com` (configurada no painel Netlify, não no código —
  **sem segredo no diff**). Nenhuma chave de API no repositório.
- **Opcional (fora do escopo desta fase):** Netlify Function para encaminhar a
  submissão a WhatsApp Business API ou CRM. Não há CRM definido pelo cliente;
  não construir até haver esse requisito confirmado — regra das cinco rotas:
  "eliminar" por enquanto.
- **Projeto para falha:** se o endpoint Netlify Forms cair, o `submit` do
  formulário falha silenciosamente do ponto de vista do usuário (a página
  segue redirecionando para `/thanks.html` mesmo com erro de rede, porque é
  um POST padrão de navegador, não fetch). **Gap identificado:** hoje não há
  feedback de erro real ao usuário nesse cenário. Recomendação: manter
  `action="/thanks.html"` (funciona sem JS) mas adicionar fallback visível —
  se `thanks.html` não carregar (offline), mostrar link direto `mailto:` e
  `tel:`/WhatsApp já presentes no rodapé como canal alternativo. Não há retry
  automático (formulário sem JS de submissão assíncrona) — decisão consciente
  para manter o form funcional sem JavaScript.

## 3. Teste das cinco rotas — API/auth/IA nesta fase

**Não há API, autenticação nem feature de IA a construir nesta fase.**
Aplicando as cinco rotas:
- **Construir:** rejeitado — não há necessidade de backend próprio; site é
  estático, contato é captado por serviço já contratado (Netlify Forms).
- **Comprar:** já "comprado" — Netlify Forms é o serviço terceirizado que
  substitui a rota de construir uma API de formulário.
- **Emprestar:** não aplicável — não há sistema de terceiro a integrar além do
  próprio host.
- **Automatizar:** não aplicável nesta fase.
- **Eliminar:** rota escolhida para WhatsApp/CRM automatizado e para qualquer
  feature de IA — nenhum requisito de negócio os justifica hoje.

Logo, `digital-product-team-ai-engineer` e
`digital-product-team-backend-integration` **não são acionados** neste ciclo.
O gate 04 (Integração & dados) se resume a: configurar notificação de e-mail
no painel Netlify (ação humana, fora do diff) e validar o contrato acima —
sem API, sem OpenAPI a escrever, sem autenticação.

## 4. Budget de performance

Métrica de saúde já registrada: **LCP < 2,5s em 4G** (`docs/pipeline-wbs.md`).
Budget concreto:
- Página total (HTML+CSS+JS+fontes) < 500 KB sem imagens de portfólio.
- Fontes: WOFF2 já aplicado (207 KB após correção da auditoria); sem carregar
  peso adicional (`font-display: swap`, sem terceiros via `<link>` externo —
  CSP já restringe `font-src 'self'`).
- Imagens: quando o cliente enviar fotos reais (pendência do gate 06), exigir
  WebP/AVIF + `srcset` responsivo, sem imagem > 200 KB acima da dobra.
- JS: manter vanilla, sem bundler, sem terceiros de analytics bloqueantes de
  render (se `analytics-growth` pedir analytics, carregar `defer`/`async`).

**Gatilho para acionar `digital-product-team-system-performance`:** só se o
budget acima for estourado após imagens reais entrarem (LCP > 2,5s em teste
Lighthouse) — hoje o site é leve o suficiente para não justificar esse papel
condicional. Verificação recomendada: rodar Lighthouse CI (ou
`npx lighthouse` manual) no `netlify.toml` como smoke test antes do deploy
final, sem exigir pipeline CI dedicado nesta fase (custo de coordenação vs.
página única).

## 5. Sequência de implementação

| # | Passo | Dono | Gate |
|---|---|---|---|
| 1 | Congelar contrato do formulário acima (campos, anti-spam, destino) | `engineering-lead` | Aprovação do usuário neste documento |
| 2 | Se Design v2/motion for aprovado em `/design`: portar markup/CSS para `site/index.html` mantendo tokens de `design-system/tokens.json` | `frontend-multistack` | Revisão visual contra protótipo aprovado |
| 3 | Micro-interações/scroll (se aprovadas) com `prefers-reduced-motion` obrigatório | `frontend-multistack` (+ pod Experience, se acionado pelo Head) | Testado em 320–1920px |
| 4 | Configurar notificação de e-mail do Netlify Forms no painel (fora do diff) | usuário/`devops-deploy` | Confirmação manual, sem segredo commitado |
| 5 | Rodar Lighthouse local/CI e checar budget da seção 4 | `frontend-multistack` | Budget dentro do alvo ou risco nomeado |
| 6 | Revisão de contrato do formulário e ausência de segredo no diff | `backend-integration` (revisão leve, sem construir API) | Gate de Integração: "sem segredo no diff" |
| 7 | Auditoria final | `audit-code` + `security-privacy` (+ `audit-design`, `qa-cross-browser` se houve mudança visual) | Veredito APROVADO, sem bloqueante aberto |
| 8 | Deploy | `devops-deploy` | Só após passo 7 |

## 6. Riscos e rollback

- **Risco:** Design v2 introduzir motion pesado que estoura o budget de
  performance → mitigação: `prefers-reduced-motion` obrigatório desde o
  início (já é prática documentada em `docs/pipeline-wbs.md`, seção 02b).
- **Risco:** cliente pedir CRM/WhatsApp automatizado depois do lançamento →
  aceito como débito técnico consciente (rota "eliminar" hoje); replanejar via
  Netlify Function quando o requisito for real, não antecipar.
- **Risco:** formulário sem feedback claro em falha de rede (gap nomeado na
  seção 2) → mitigar com canais alternativos já visíveis (tel/e-mail/WhatsApp
  no rodapé); não bloqueante para este gate, mas registrado como dívida.
- **Rollback:** site estático sem build step — rollback é reverter o deploy
  Netlify para a versão anterior publicada (um clique no painel Netlify) ou
  `git revert` do commit correspondente; sem migração de dado a desfazer
  porque não há banco de dados nesta fase.

---
**Trade-off sacrificado nesta recomendação:** otimização automática de imagem
e componentização (rota B) trocadas por simplicidade operacional agora; se o
site crescer além de uma página, essa troca deve ser revisitada.
