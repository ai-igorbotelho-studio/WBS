# WBS — Direção Criativa

## 1. Partido estético

Este é o design de quem entrega obra no prazo e no prumo: sóbrio, técnico, sem enfeite que não sustente peso. A superfície é neutra e o material fala — grafite, cobre, papel de projeto — como um caderno de obra bem organizado, não um outdoor. Toda decisão visual responde a uma pergunta prática: isso ajuda o cliente a confiar no orçamento e no prazo?

**Palavras-chave:** Precisão · Sobriedade · Acabamento.

## 2. Paleta

Base neutra em cinza-morno (não azul-frio, não bege quente demais) + brand em cobre queimado/grafite. Contraste calculado por luminância relativa (WCAG), aproximado.

### Light (tema padrão)

| Token | Hex | Uso |
|---|---|---|
| surface-100 | #F6F4F1 | Fundo de página |
| surface-200 | #EDEAE5 | Fundo de seção/alternância |
| surface-raised | #FFFFFF | Cards, modais, elevação |
| ink | #211E1B | Texto principal |
| ink-muted | #5C574F | Texto secundário, legendas |
| line | #DAD5CD | Bordas, hairlines, divisores |
| brand | #8A4A2C | Cobre queimado — CTAs, links, destaque de marca |
| on-brand | #FFFFFF | Texto sobre brand |
| accent | #2B3A33 | Verde-grafite — realces secundários, ícones ativos |
| on-accent | #FFFFFF | Texto sobre accent |
| success | #2E6B47 | Confirmações, status concluído |
| on-success | #FFFFFF | Texto sobre success |
| warning | #8A5A12 | Alertas, pendências |
| on-warning | #FFFFFF | Texto sobre warning |
| danger | #9C3B2E | Erros, exclusões |
| on-danger | #FFFFFF | Texto sobre danger |

Pares testados (aprox.):
- ink #211E1B sobre surface-100 #F6F4F1 → ~15.2:1
- ink-muted #5C574F sobre surface-100 #F6F4F1 → ~5.6:1
- on-brand #FFFFFF sobre brand #8A4A2C → ~4.7:1
- on-accent #FFFFFF sobre accent #2B3A33 → ~10.8:1
- on-success #FFFFFF sobre success #2E6B47 → ~5.1:1
- on-warning #FFFFFF sobre warning #8A5A12 → ~4.6:1
- on-danger #FFFFFF sobre danger #9C3B2E → ~4.9:1

### Dark

| Token | Hex | Uso |
|---|---|---|
| surface-100 | #171512 | Fundo de página |
| surface-200 | #1F1C18 | Fundo de seção/alternância |
| surface-raised | #262320 | Cards, modais, elevação |
| ink | #EFEBE4 | Texto principal |
| ink-muted | #A79E92 | Texto secundário, legendas |
| line | #3A362F | Bordas, hairlines, divisores |
| brand | #C97A4F | Cobre claro — CTAs, links, destaque de marca |
| on-brand | #171512 | Texto sobre brand |
| accent | #7FA593 | Verde-grafite claro — realces secundários |
| on-accent | #171512 | Texto sobre accent |
| success | #6FBE8C | Confirmações, status concluído |
| on-success | #12251A | Texto sobre success |
| warning | #D9A552 | Alertas, pendências |
| on-warning | #241A05 | Texto sobre warning |
| danger | #E38C7C | Erros, exclusões |
| on-danger | #2E0D07 | Texto sobre danger |

Pares testados (aprox.):
- ink #EFEBE4 sobre surface-100 #171512 → ~14.8:1
- ink-muted #A79E92 sobre surface-100 #171512 → ~6.2:1
- on-brand #171512 sobre brand #C97A4F → ~6.9:1
- on-accent #171512 sobre accent #7FA593 → ~8.5:1
- on-success #12251A sobre success #6FBE8C → ~8.1:1
- on-warning #241A05 sobre warning #D9A552 → ~9.4:1
- on-danger #2E0D07 sobre danger #E38C7C → ~7.3:1

## 3. Tipografia

- **Display:** Fraunces (serifada editorial, com peso e caráter de projeto impresso).
- **Texto:** Archivo (grotesca sóbria, boa em UI, sem personalidade genérica de "IA").

| Estilo | Fonte | Size/Line | Weight | Tracking |
|---|---|---|---|---|
| display-xl | Fraunces | 56/60px | 600 | -0.5px |
| display-l | Fraunces | 40/46px | 600 | -0.3px |
| h1 | Fraunces | 32/38px | 500 | 0px |
| h2 | Archivo | 24/30px | 600 | 0px |
| h3 | Archivo | 18/24px | 600 | 0px |
| body | Archivo | 16/24px | 400 | 0px |
| small | Archivo | 13/18px | 400 | 0.1px |
| eyebrow | Archivo | 12/16px | 600 | 1.6px (uppercase) |

## 4. Espaçamento, raios, sombras

**Espaçamento (base 4px):**
space-1: 4px · space-2: 8px · space-3: 12px · space-4: 16px · space-5: 20px · space-6: 24px · space-7: 32px · space-8: 40px · space-9: 48px · space-10: 64px · space-11: 80px · space-12: 96px

**Raios:** radius-sm: 4px (inputs, chips) · radius-md: 8px (cards, botões) · radius-lg: 16px (modais, seções destacadas)

**Sombras:** shadow-sm: 0 1px 2px rgba(33,30,27,0.08) — elevação sutil de card · shadow-md: 0 8px 24px rgba(33,30,27,0.12) — modais, popovers

**Hairline:** 1px solid var(line) — usado sempre no lugar de sombra para separar seções; nunca borda esquerda colorida em card.

## 5. Voice & tone

1. **Direto, sem hipérbole.** Nada de "revolucionário" ou "incrível". Ex.: "Orçamento fechado em 3 dias úteis."
2. **Precisão numérica sempre que possível.** Prefira números a adjetivos. Ex.: "Fundação com laudo de solo antes da concretagem."
3. **Trate o cliente como quem decide, não como quem precisa ser convencido.** Ex.: "Veja o cronograma e aprove por etapa."
4. **Assuma o vocabulário técnico da obra, mas explique o que impacta o cliente.** Ex.: "Contrapiso (a base antes do piso final) leva 7 dias para curar."
5. **Nunca prometa o que o cronograma não sustenta.** Ex. evitar: "Pronto em poucas semanas!" → usar: "Prazo estimado: 6 a 8 semanas, sujeito a vistoria."
6. **Erros e atrasos são comunicados antes de perguntados.** Ex.: "A entrega da esquadria atrasou 4 dias; novo prazo: 12/10."

## 6. Motivo gráfico

**Cover:** grade modular inspirada em fiada de tijolo/bloco — retângulos 2:1 dispostos em offset de metade do módulo por linha, traçados apenas em hairline (var(line)) sobre surface-200, sem preenchimento; um único elemento em brand marca o "ponto de intervenção" (como uma marcação de nível no canteiro).

**Página (fundo/apoio):** linhas de cota (measurement lines) — traços finos horizontais com pequenos ticks perpendiculares a cada space-6 (24px), simulando desenho técnico de planta baixa; usadas apenas em áreas de baixa densidade (hero, estados vazios), nunca atrás de texto corrido, opacidade máxima 8% sobre surface-100.

Tokens de geometria: grid-module: 24px · grid-offset: 12px (metade do módulo) · dimension-tick-length: 6px · dimension-line-opacity: 0.08 · motif-stroke: 1px solid var(line).


---

> **Superado (2026-09-22):** direção criativa substituída pelo brand pack real (Forest #1F3A2E · Timber #B8845A · Bone #F2EDE3; Bricolage Grotesque + DM Mono). Tokens vigentes em `design-system/tokens.json`.
