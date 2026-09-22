# Registro de Decisões (DACI)

Toda decisão de trade-off final é do **Head** (sessão principal). Subagentes
recomendam; o Head decide e registra aqui.

Formato de cada entrada: **data · dono · decisão · trade-off sacrificado**.

| Data | Dono | Decisão | Trade-off sacrificado |
|------|------|---------|-----------------------|
| 2026-09-22 | Head (sessão principal) | **Gates 04 e 05 aprovados pelo usuário.** 04: formulário via Netlify Forms + honeypot, sem segredo. 05: pod de auditoria rodado (relatório em `docs/auditoria-wbs-2026-09-22.md`); todos os bloqueantes corrigidos no dia: placeholders públicos removidos, depoimentos removidos até haver reais, `privacy.html` e `terms.html` (T&C v1.0 do pack) publicados, fontes WOFF2, fallbacks Safari, token `accent-hover`. Veredito APROVADO. Gate 06 aguarda validação jurídica da privacy notice e dados reais do cliente. | **Prova social** (depoimentos) e **NZBN/GST no rodapé** sacrificados até existirem dados reais |
| 2026-09-22 | Head (sessão principal) | **WBS = Waiheke Backyards Solutions** (Pablo Baldo, Waiheke Island, NZ), conforme brand pack enviado pelo cliente. Design System construído a partir do pack (Forest/Timber/Bone, Bricolage Grotesque + DM Mono, lockups do logo). Site one-page em **inglês NZ** com serviços Build · Design · Renovation, publicado como Design artifact e código em `site/`. Adição intencional de `timber-text` para cumprir 4.5:1 em labels pequenos. Direção criativa e copy PT-BR anteriores (`design/`, `content/`) ficam como histórico, superadas pelo pack. Agentes `digital-agency-*` tinham `tools: all` inválido; linha removida em 148 arquivos. Gates 00–03 executados; 04 (endpoint do formulário), 05 (auditoria) e 06 (deploy) aguardam aprovação do usuário. | **Fidelidade à premissa PT-BR/Brasil** sacrificada em favor da marca real; **auditoria independente** ainda não rodada |
| 2026-09-16 | Head | **Ativar estrutura completa (18 papéis)** a pedido explícito do usuário, com perfis de senioridade verbatim; apagados os 6 subagentes fundidos do Estágio Enxuto e refeitos como especialistas individuais. Head permanece como sessão principal (não subagente). | Menor custo de coordenação do Estágio Enxuto — trocado por granularidade 1-para-1 com o organograma |
| _(anterior)_ 2026-09-16 | Head | Estrutura em Estágio Enxuto (6 papéis fundidos) — **substituída** | Granularidade de 18 papéis, em troca de menor custo de coordenação |

<!-- Adicione novas decisões acima desta linha, a mais recente no topo. -->
