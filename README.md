# Into the Shivam-Verse

A 3D, Spider-Man-inspired portfolio for **Shivam Vipul Kapadia**. Scroll to swing through seven New York-inspired districts, from Queens and Oscorp to the Daily Bugle and Brooklyn Bridge.

**Project publishing account: `shivam-kapadia`.** The main account remains `shivamvkapadia`. The existing `origin` belongs to the main website; do not push this project there.

## Preview

```sh
node scripts/serve.mjs
```

Open **http://127.0.0.1:4173**. No dependency installation or build step is needed to run the site: Three.js and fonts are included locally. Serve it over HTTP; opening `index.html` through `file://` cannot load JavaScript modules and project data correctly.

## What’s included

- A real WebGL city with procedural buildings, roof tanks, Oscorp, Daily Bugle signage, traffic, and a suspension bridge.
- An articulated red-and-blue character, scroll-driven camera travel, rooftop jump arcs, and a web line during transitions.
- Seven portfolio chapters, a navigable city map, and 11 project case files with category filters.
- Local fonts, responsive layouts, keyboard-accessible dialogs, pause controls, and reduced-motion support.
- Four downloadable résumés and the full original portfolio preserved in `archive.html`.
- [`design.md`](design.md): art direction, route, interaction details, accessibility, and publishing constraints.

## Files

| File | Purpose |
| --- | --- |
| `index.html`, `style.css` | Portfolio content and comic-inspired presentation |
| `app.js` | Navigation, project catalog, dialogs, motion preferences |
| `city.js` | Procedural Three.js scene and animation |
| `projects.json` | All 11 projects extracted from the original portfolio |
| `archive.html` | Complete original portfolio, including coursework and honors |
| `vendor/`, `fonts/` | Local dependencies and licenses |
| `design.md` | Design rationale and implementation guide |
| `scripts/` | Local server, verification, and project extraction |

## Verification

```sh
npm ci
npm run check
# With the preview server running in another terminal:
npm test
```

The browser check uses installed Google Chrome through Playwright. It verifies WebGL rendering, camera travel, project filters, full descriptions, résumé links, modal controls, chapter navigation, mobile overflow, and reduced-motion behavior. It saves review screenshots to ignored `test-results/`.

## GitHub Pages

Publish to a new repository such as `shivam-kapadia/shivam-verse`, then enable GitHub Pages from the repository’s `main` branch and `/ (root)` folder. `.nojekyll` is included, and all runtime asset URLs are relative so the site works under a project subpath.

Creating that repository requires authenticating as `shivam-kapadia`. Do not replace the existing main website remote. Use a separate remote named `spidey` for this project.

The source links and main profile link still point to `shivamvkapadia` by design. This is an unofficial fan portfolio, with original procedural artwork and no movie asset downloads.
