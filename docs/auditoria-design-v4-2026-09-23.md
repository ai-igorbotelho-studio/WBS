# Auditoria de design/UX v4 — 2026-09-23 (commit 6cf6c52 → correções em edbd783)

Auditor: `audit-design` (independente, análise estática + cálculo WCAG). Veredito: **APROVADO COM RESSALVAS → ressalva corrigida**.

- **Ressalva (corrigida):** tick aceso do ridgeline em `timber` dava 2.95:1 sobre paper e 2.77:1 sobre bone (WCAG 1.4.11 exige 3:1). Fix: token `ridgeline-lit` passa a `{timber-text}` (5.1:1 paper / 6.2:1 forest), mantendo o stroke forest 1px.
- **Atenção (corrigida):** checkbox de consentimento 20px → 24px (WCAG 2.2 SC 2.5.8).
- **Conforme:** reveal e word-reveal opacity-only, visíveis sem JS e em reduced-motion; crossfade duotone→cor do hero no 1º ridgeline, cor imediata sem JS / reduced-motion; nenhum parallax; tiles da galeria são links focáveis com `aria-label` e `alt=""` (sem dupla leitura), crossfade em `:focus-within`; ícone dos cards com par de foco; FAQ nativa + progressiva; pulso de opacidade no loading em reduced-motion; drawer com semântica de dialog íntegra; alvos ≥44px; todos os pares de texto ≥4.5:1.
- **Preferências, não falhas:** `:focus-within` em vez de `:focus-visible` no crossfade da galeria.
