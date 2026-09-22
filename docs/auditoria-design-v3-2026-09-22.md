# Auditoria de design/UX v3 — 2026-09-22 (commit af545b2)

Auditor: `audit-design` (independente). Método: Playwright/Chromium, contraste via getComputedStyle + fórmula WCAG, inspeção estática de DOM/CSS/JS. axe-core não disponível no ambiente; leitor de tela real não testado.

## Veredito: APROVADO COM RESSALVAS → blocker corrigido no mesmo dia

### Blocker (corrigido)
- **Cascata anulava `var(--timber-text)` nas legendas da galeria.** `.tile--duo span` e `.tile span` tinham a mesma especificidade e a regra genérica vinha depois; a cor renderizada era `ink-muted`. Fix aplicado: `.tile.tile--duo span` (especificidade maior). O bloco morto `.tile--photo` (mesmo bug latente, sem uso no markup) foi removido.

### Conforme
Marquees removidos; tilt/magnetic/ripple/contadores removidos; `.quote` removido; 3 ridgelines `aria-hidden` com `ridgeline-lit` = fill accent + stroke forest; hero sem texto sobre a foto; `#contact` com regra 2px `paper-stock-rule` (accent); títulos de card e step compartilham `.unit-title`; drawer `role="dialog" aria-modal aria-label`, focus trap, Escape, retorno de foco ao `#burger`, `inert` em `#main`; nomes acessíveis do burger/fechar; alvos 44×44; nav condensada 900–1099 sem hambúrguer, gap 16px; reduced-motion e no-JS renderizam estado final; contraste medido ≥ AA em todos os pares renderizados (hero h1 11.2:1, lead 6.3:1, eyebrow 5.1:1, step num 5.6:1, reverse eyebrow 6.2:1, footer 10.6:1, form 12.3:1).

### Notas não-bloqueantes
- Rodar axe-core em CI quando houver rede para o registry.
- Testar com VoiceOver/NVDA reais antes de um lançamento maior.
