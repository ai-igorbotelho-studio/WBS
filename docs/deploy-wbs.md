# Deploy WBS — runbook (gate 06)

**Projeto Netlify criado:** `waiheke-backyards-solutions` (team ai-igorbotelho), Forms habilitado.
URL: https://waiheke-backyards-solutions.netlify.app · Painel: https://app.netlify.com/projects/waiheke-backyards-solutions

**Estado em 2026-09-22:** projeto criado, **sem deploy**. O upload a partir desta sessão foi recusado pela política de rede (403 para `netlify-mcp.netlify.app`, `api.netlify.com` e `*.netlify.app`).

## Opção A — ligar o repositório GitHub (recomendada)
No painel do projeto: Site configuration → Build & deploy → Link repository → `ai-igorbotelho-studio/wbs`, branch `main` (após merge) ou `claude/friendly-cerf-qhld6e`. Base directory `site`, publish directory `site` (o `netlify.toml` está em `site/`, então use base = `site` e publish = `.`). Sem comando de build. Cada push passa a publicar.

## Opção B — deploy manual da sua máquina
```
npx netlify-cli login
npx netlify-cli deploy --prod --dir=site --site=de0add44-225a-488c-951e-48815fee308c
```

## Depois do primeiro deploy
1. Forms → Notifications → e-mail para pablo.wbs@gmail.com (formulário `quote`).
2. Domain management → adicionar o domínio do cliente e HTTPS automático.
3. Rollback: Deploys → deploy anterior → "Publish deploy". Testar uma vez.
4. Substituir placeholders (foto, obras, NZBN/GST, redes) e revalidar `privacy.html` com jurídico NZ.
