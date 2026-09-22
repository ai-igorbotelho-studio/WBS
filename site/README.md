# WBS site

Static one-page site for Waiheke Backyards Solutions, built on `design-system/` tokens.

- `index.html` — the page. Assets under `assets/` (tokens.css, components, fonts, logos).
- `thanks.html` — post-submit confirmation.
- Form: Netlify Forms (`data-netlify`), honeypot field `company`, no secrets. Submissions land in the Netlify dashboard; set an email notification to pablo.wbs@gmail.com there. On another host, point the form `action` at that host's form endpoint.
- `netlify.toml` — publish dir and security headers.

Placeholders in square brackets must be replaced before launch (photos, team names, NZBN/GST, social and legal URLs).
