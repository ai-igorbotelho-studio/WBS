# Design System v2 — plano de versionamento (para aprovação)

Status: **plano, não implementação**. Baseado em `design/09-ui-spec-v3.md` (§6, §4, §5), `design/06-navigation-spec.md` e `design/08-experience-v3.md`. Consumido por `tokens.json` → `tools/build-tokens.py` → `tokens.css` (design-system e site) e `components/bundle.css`.

## 1. `tokens.json` → v2 (`"version": 2`)

**Novos tokens** (adicionar em `color.tokens` salvo indicação de família):

| Token | Light | Dark | Usage | Contraste |
|---|---|---|---|---|
| `scrim` | `rgba(31,58,46,0.45)` | mesmo (forest fixo, não varia por tema) | fundo do drawer/overlay | n/a, não carrega texto; conteúdo por trás fica `inert` |
| `ridgeline-lit` | `{timber}` | `{timber}` | ticks acesos da ridgeline (3 pontos) | 3.8:1 forest / 2.8:1 bone — **em bone exige outline 1px forest** (ver §2) |
| `drawer-current-marker` | `{accent}` (3px) | `{accent}` | borda esquerda do item ativo no drawer | decorativo, texto adjacente segue `ink` |
| `paper-stock-rule` | `{line}` 2px stroke | `{line}` 2px stroke | hairline superior de `#contact` | decorativo, sem exigência de contraste |

Em `spacing`/layout (não são cores, ficam fora de `color.tokens`, mas precisam de nome versionado — sugiro família nova `layout.tokens`):

| Token | Valor | Usage |
|---|---|---|
| `drawer-width` | `min(86vw, 360px)` | largura do painel do drawer |
| `nav-condensed-gap` | `16px` (= `space-4`, referenciar por `{space-4}` para não duplicar valor) | gap dos links 900–1099 |
| `nav-condensed-fontsize` | `15px` | tamanho dos links 900–1099 |
| `header-height-compact` | `52px` | **já existe desde v2 (04-ui-spec-v2), confirmar como shipped** — sem mudança de valor, só formalizar entrada no tokens.json se ainda não estiver lá (checar; hoje não aparece em tokens.css gerado) |

**Alterado:** nenhum valor de cor existente muda. `timber-text` é **reaproveitado**, não alterado — o que muda é o CSS consumidor (ver §5).

**Removido:** nenhum token sai do tokens.json nesta rodada. `09-ui-spec-v3.md` §4 remove *markup/JS* (marquee, tilt, magnetic, ripple, contadores), não tokens — nenhum token fica órfão como resultado direto.

**Família nova fora do tokens.json: `motion`.** `tokens.json` hoje não tem seção `motion`, e `site/assets/motion.css` já define `--motion-*`/`--ease-*` manualmente, fora do pipeline de build. Duas opções:

- **(A) — recomendada:** trazer `motion` para `tokens.json` como nova família (`motion.durations`, `motion.easings`), e `build-tokens.py` passa a emitir essas variáveis em `tokens.css`. `motion.css` deixa de declarar `--motion-*`/`--ease-*` e passa a *consumir* as do tokens.css (ordem de `<link>` já garante isso, `tokens.css` carrega antes). README do design-system passa a documentar motion como token de primeira classe, ao lado de cor/tipografia/spacing.
- **(B):** manter motion só em `motion.css`, e o README apenas documenta a convenção e os valores como "tokens de fato, arquivo separado por serem específicos de efeito, não de layout/marca". Mais rápido, mas quebra a promessa de "tokens versionados" pedida no scope do agente — motion não seria auditável pelo mesmo pipeline.

Recomendo (A): motion é tão parte da identidade quanto cor (durations por semântica: fast/base/slow/slower; easings: steady/firm/linear/out-soft) e hoje é invisível para quem só olha tokens.json/tokens.css.

## 2. Build — motion + utilitário de foco único

- `build-tokens.py` ganha um bloco `for fam in ('motion',...)` análogo ao de spacing/radius, emitindo `--motion-fast`, `--ease-steady` etc. em `:root` de `tokens.css`.
- **"Bone-surface outline" como classe única:** hoje o padrão "dobrar o elemento com um contorno forest de 1px em bone" aparece 3x nomeado no próprio 09-ui-spec-v3 (focus ring, `ridgeline-lit` tick, e implicitamente qualquer novo caso futuro) — 09 §7 já sinaliza isso como "utility, not three one-offs". Proposta: `.bone-outline` em `bundle.css`/`tokens.css`:
  ```css
  .bone-outline{ box-shadow: 0 0 0 1px var(--forest); }
  [data-theme="dark"] .bone-outline{ box-shadow: none; }
  ```
  Aplicada em: (1) foco do burger/inputs em tema bone (já documentado no README como `box-shadow` ao lado do `outline`), (2) tick da ridgeline em bone, (3) qualquer chip/marker futuro sobre timber sólido em bone. Documentar no README do design-system com os 3 usos como exemplo, para não reintroduzir um 4º caso ad-hoc sem revisar esta classe primeiro.

## 3. Componentes a adicionar/atualizar no bundle

Todos seguem o padrão existente (`components/<Nome>/README.md` + `index.js`/`.d.ts`, sem framework, função que devolve DOM):

- **Nav/Drawer** (novo) — consumidor fornece: array de links `{label, href, current}`, CTA `{label, href}`, WhatsApp `{label, href}`, breakpoint atual (ou o componente lê via matchMedia). Devolve `{trigger, drawer, scrim}` com ARIA (`role="dialog"`, `aria-modal`, focus trap) já embutida — **comportamento vem de 06-navigation-spec, não redecidido aqui**. Estados visuais (hover/active/focus/current/open) batem com 09 §1.
- **Chip** (novo, hoje só existe como classe CSS solta no site) — formalizar como componente: consumidor fornece `{label, active, onToggle}`; sem mudança visual (09 §5 diz "no change" no chip), só empacotamento.
- **Ridgeline divider** (novo) — consumidor fornece `{lit: boolean[3]}` (estado cumulativo por posição de página) e o componente desenha o SVG + 3 ticks (`unlit` = `line` 40% opacidade, `lit` = `ridgeline-lit` + `.bone-outline` em tema bone). Reduced-motion / no-JS: todos os ticks renderizam no estado final, sem JS.
- **Quote** (novo) — consumidor fornece `{text, attribution}`; markup `<blockquote class="quote">`; sem placeholder — o componente recusa render (retorna `null`/comentário) se `text` vier vazio, para impedir que uma citação fake suba em produção sem querer (09 §4.6).

README de cada componente segue o padrão já usado (o que o consumidor fornece, o que o componente decide). Preview: adicionar uma página Storybook-like simples (`components/preview.html`, já que não há Storybook instalado) listando os 4 novos + os 5 existentes lado a lado nos dois temas — supre a ausência de Storybook sem introduzir nova dependência agora; migração para Storybook real fica como trade-off em §6.

## 4. Regra de coerência por código

**`tools/check-tokens.py`** (novo): varre `site/**/*.html` e `site/assets/*.css` procurando hex literais (`#[0-9a-fA-F]{3,6}`) fora de `site/assets/tokens.css`, falha (`exit 1`) se encontrar. Grep feito agora mostra os hex fora dos tokens hoje:

- `site/index.html`: linha 10 `#1f3a2e` (forest inline), linhas 123/149/158 `#d8b08c` (= `timber-text` dark — exatamente o caso citado em 09 §3), linhas 124/138/196/199 `#a8b5af` (= `ink-muted` dark), linha 136/199 `#3f5c4f` (= `line` dark).
- `site/assets/motion.css`: nenhum hex (limpo).
- `site/assets/components.css`: nenhum hex (limpo) — os casos problemáticos citados em 09 §3 (`.reverse .eyebrow`, `.tile--photo span`, `.tile--duo span`) estão inline em `index.html`, não em `components.css`.

Todos os hex encontrados já **são** valores de token existentes (timber-text, ink-muted, line) — a correção é trocar por `var(--timber-text)` etc., não criar tokens novos, confirmando a recomendação de 09 §3.

`check-tokens.py` allowlist: os hex dentro do próprio `tokens.css`/`tokens.json` (fonte da verdade) e dentro de `rgba()` explicitamente marcados como decorativos com um comentário `/* check-tokens: allow */` (ex.: `scrim`, `shadow-*`), para não brigar com valores que legitimamente não são cor sólida de token.

**Check de contraste automatizado** (novo, mesmo script ou `tools/check-contrast.py`): lê `tokens.json`, calcula WCAG contrast ratio para os pares já anotados em `usage`/README (ex. ink/surface, on-accent/accent, timber-text/surface) por tema, falha se cair abaixo do mínimo declarado no próprio token (a `usage` string já contém o número — parsear com regex `(\d\.\d):1` como piso). Roda em CI/pre-commit junto de `build-tokens.py`.

## 5. Changelog v1 → v2

- **Novo:** `scrim`, `ridgeline-lit`, `drawer-current-marker`, `paper-stock-rule`, `drawer-width`, `nav-condensed-gap`, `nav-condensed-fontsize`, família `motion` (durations/easings) migrada para tokens.json, classe utilitária `.bone-outline`, componentes `Nav/Drawer`, `Chip`, `RidgelineDivider`, `Quote`.
- **Confirmado sem mudança de valor:** `header-height-compact` (formalizado no tokens.json se ausente).
- **Alterado no consumo (não no valor):** `#d8b08c` hardcoded em `index.html` → `var(--timber-text)`; `#a8b5af`/`#3f5c4f` hardcoded → `var(--ink-muted)`/`var(--line)`.
- **Removido:** nenhum token; `.marquee`, tilt, magnetic, ripple-JS, contador removidos do *site* (markup/JS), não do design system.
- **Artefatos a republicar:** `design-system/tokens.json` (version 2), `design-system/tokens.css` (regenerado), `site/assets/tokens.css` (regenerado, mesmo conteúdo do de cima), `design-system/components/bundle.css`/`bundle.js`/`index.d.ts` (+4 componentes), `design-system/README.md` (seção motion, seção `.bone-outline`, componentes novos), `tools/build-tokens.py` (emite motion), `tools/check-tokens.py` e `tools/check-contrast.py` (novos).

## 6. Sequência de implementação e trade-offs

1. Mover motion para `tokens.json` + atualizar `build-tokens.py` (risco baixo, mecânico) — pré-requisito para tudo mais que toca motion.
2. Adicionar tokens novos de cor/layout ao `tokens.json`, regenerar CSS, adicionar `.bone-outline`.
3. Trocar hex hardcoded em `index.html` por `var(--token)` (correção pura, zero risco visual).
4. Escrever `check-tokens.py` e `check-contrast.py`, rodar contra o estado atual, só então travar CI (evita quebrar build em cima de dívida não endereçada).
5. Implementar os 4 componentes novos no bundle, com README + preview.html.
6. Bump `tokens.json` para `version: 2`, republicar artefatos, atualizar README.

**Trade-offs:**
- Trazer motion para o pipeline de tokens (opção A) exige tocar `build-tokens.py` e reordenar levemente a leitura de `motion.css` (que passa a ser só regras, não declarações) — custo pequeno, mas é uma mudança de contrato que `frontend-multistack` precisa saber antes de mexer em `motion.css` em paralelo.
- `check-tokens.py` com grep de hex pode gerar falso-positivo em valores `rgba()` legítimos fora de token (ex. `scrim`) — mitigado com allowlist por comentário, mas exige disciplina de comentar toda exceção nova.
- Não adotar Storybook real agora (usar `preview.html` estático) é mais rápido porém mais pobre para "componente funciona igual em 3 contextos" — se o volume de componentes crescer, vale migrar para Storybook de verdade; decisão adiada, não descartada.
- Check de contraste automatizado depende de `usage` strings manterem o formato `"X.X:1"` — é frágil a mudanças de redação; alternativa mais robusta seria mover o número mínimo para um campo estruturado (`minContrast`) no schema do tokens.json, mas isso é uma mudança de schema maior, fora deste plano — sinalizo para decisão do Head se quiser essa robustez agora ou depois.
