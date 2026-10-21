# Windmill — AI needs-assessment questionnaire

Static site (plain HTML/CSS/JS, no build step). Open `index.html` via any static host.

- `index.html` – page shell (header with SVG windmill)
- `style.css` – styles (mobile-first)
- `app.js` – questionnaire engine (picker → groups → business info → review → submit)
- `config.js` – `FORMSPREE_ENDPOINT`
- `industries/index.js` – industry registry (picker tiles, active / coming soon)
- `industries/<id>.js` – one question set per industry

Deep link: `index.html?industry=millwork`. In-progress answers are kept in the browser's localStorage (per industry).

## Run locally
    python3 -m http.server 8000
then open http://localhost:8000/

## Add an industry
1. Copy `industries/millwork.js` to `industries/plumber.js` and change `WINDMILL_SETS.millwork` to `WINDMILL_SETS.plumber`, plus `id`, `name`, `intro`, and the `groups` / `items`. Item `id`s must be unique within the set.
2. In `industries/index.js`, set `active: true` for that id (or add a new entry).
3. Add `<script src="industries/plumber.js"></script>` to `index.html` (before `app.js`).

An industry only shows as clickable when it is `active` **and** its set file is loaded.

## Set the Formspree endpoint
1. Sign up at https://formspree.io, create a form, copy its endpoint (`https://formspree.io/f/xxxxxxx`).
2. Put it in `config.js`: `const FORMSPREE_ENDPOINT = "https://formspree.io/f/xxxxxxx";`
3. In Formspree, add your site's domain to allowed domains if you restrict them.

While the endpoint is empty (or if sending fails / Formspree returns an error), the visitor sees an error and can download their answers as text or JSON. Success is only shown when Formspree replies OK. Each question is sent as its own readable field (`Group — Question: Yes | Priority: High | Notes: …`), with `_subject` containing the company name and `_replyto` set to the email.

## Enable GitHub Pages
1. Create a GitHub repo and push this folder (`git remote add origin …; git push -u origin main`).
2. Repo → Settings → Pages → Source: "Deploy from a branch", Branch `main`, folder `/ (root)`.
3. Site appears at `https://<user>.github.io/<repo>/`. (`.nojekyll` is included.)
