# Relatório de auditoria — gate 05 · 2026-09-22

Pod de auditoria (independente): `audit-code`, `audit-design`, `security-privacy`, `qa-cross-browser`. Consolidado pelo Head.

## Veredito consolidado: **APROVADO** para deploy em staging, após as correções abaixo aplicadas no mesmo dia.

| Auditor | Veredito original | Bloqueantes | Estado |
|---|---|---|---|
| Código | REPROVADO | 7 blocos de placeholder visíveis (links `[...]`, NZBN/GST, nomes, anos, depoimentos, legenda do hero); JSON-LD com URL placeholder | **Corrigido**: links removidos ou apontando a páginas reais (`terms.html` do pack, `privacy.html`), NZBN/GST e depoimentos removidos até haver dado real, equipe descrita por função, anos removidos da galeria |
| Design/A11y | APROVADO com ressalvas | nenhum | Cor `#c9d3cd` fora dos tokens → `#a8b5af` (ink-muted dark); hover `#a8754d` virou token `accent-hover` |
| Segurança/Privacidade | 1 bloqueante | Privacy notice inexistente | **Corrigido**: `site/privacy.html` (Privacy Act 2020, Netlify nomeado como processador, retenção e direitos). **Redação precisa de validação jurídica NZ** antes do go-live |
| QA responsivo | sem bloqueante | 3 importantes: 404 de fonte, `-webkit-backdrop-filter`, `color-mix` sem fallback | **Corrigido**: fontes em WOFF2 (407 KB → 205 KB), prefixo e fallback rgba adicionados; re-teste em 390/1440 sem erros de console e sem scroll horizontal |

## Itens aceitos como estão (com justificativa)
- CSP com `'unsafe-inline'`: reflete estilo/script inline da página estática; sem terceiros hoje. Revisitar com nonce se entrar analytics.
- Eyebrows a 11px em DM Mono: preferência de marca documentada, sempre redundantes ao título.
- Retrato do fundador: placeholder oficial do pack (Hnry), com alt honesto. Substituir pela foto real antes do lançamento.
- Galeria sem fotos: tiles neutros com legenda, sem afirmação de obra específica.

## Pendências para o gate 06 (deploy) — decisão do usuário
1. Validar `privacy.html` com jurídico NZ.
2. Fornecer: foto do Pablo, fotos de obras com autorização, NZBN/GST, Instagram/Google Business.
3. Confirmar host (Netlify) e domínio; ativar notificação de formulário para pablo.wbs@gmail.com.
