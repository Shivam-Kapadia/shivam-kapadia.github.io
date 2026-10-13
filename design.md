# Into the Shivam-Verse

A Spider-Man-inspired, scroll-driven 3D portfolio for Shivam Vipul Kapadia. The website is a comic issue you travel through: each chapter lands on a different rooftop and reveals another side of the engineer.

## Identity and publishing

- This project's intended GitHub owner is **shivam-kapadia**.
- Shivam's main GitHub account remains **shivamvkapadia**. Existing project and profile links intentionally point there.
- Do not push this redesign to the existing `origin`, which points at the main website repository.
- The full original portfolio is retained in `archive.html`; all 11 projects, source links, and four résumé PDFs remain accessible.

## Art direction

New York as an illustrated architectural model. Warm newsprint, ink outlines, red accents, desaturated teal windows, and yellow comic captions. The city uses real perspective geometry, visible roof surfaces, water tanks, fire escapes, traffic, tower setbacks, and suspension cables. It is deliberately a stylized comic environment rather than a photorealistic Manhattan recreation.

The page combines condensed editorial headlines with restrained neo-brutalist controls: square corners, 2px ink borders, hard offset shadows, and high-contrast calls to action. A light paper-grain overlay ties the HTML and WebGL together.

| Token | Value | Purpose |
| --- | --- | --- |
| Paper | `#f4f0e5` | Reading surface and billboards |
| Ink | `#1b2024` | Text, borders, outlines |
| Hero red | `#e63032` | Key words, actions, suit, progress |
| Caption yellow | `#f7d34b` | Comic annotations and tags |
| Display type | Barlow Condensed 800 | Tall, punchy panel headlines |
| Body type | Space Grotesk 400–700 | Descriptions, labels, navigation |

## The seven panels

1. **Queens / Origin story.** Brick apartments, rooftop tank, introductory headline, entry into the city.
2. **Midtown / The big leap.** Meter headquarters; autonomous spending infrastructure and the featured engineering case file.
3. **Oscorp / Controlled chaos.** A tiered green research tower; analog dishwasher, BeatBot, and published ML work.
4. **Daily Bugle / The daily build.** Rooftop newspaper sign; PalmSlash, myHR, Applywise, and all-project access.
5. **Brooklyn Bridge / Connecting worlds.** Modeled suspension bridge over water; real work across software, embedded systems, and teaching.
6. **The rooftop / Under the mask.** Personal identity card, portrait, studies, and interests.
7. **Next chapter / Team-up.** Radio mast, contact, main GitHub, LinkedIn, and four résumé downloads.

Film and comic references include Queens, Oscorp, the Daily Bugle, a red-and-blue web-slinger, mask imagery, a great-power/reliability riff, and short caption allusions. Original engineering copy is not presented as verbatim movie dialogue. No movie stills, scraped logos, soundtrack, or downloaded character models are used. Footer identifies this as an unofficial fan portfolio.

## Interaction and motion

- Native page scrolling is preserved; there is no wheel interception or scroll trap.
- Chapter offsets determine a continuous route coordinate. The camera travels between modeled districts, with a brief landing plateau at each end.
- The character follows an elevated jump arc, reaching toward a web anchor while the arms and legs articulate.
- Gentle idle motion and pointer parallax add life without moving the text.
- A brief “THWIP!” caption marks the peak of each swing. It disappears in paused or reduced-motion mode.
- Mobile route stops have taller touch targets; intermediate tablet widths use a tighter headline scale.
- The bottom route is both a progress indicator and direct navigation; a city-map dialog provides larger links.
- Project case files are real accessible dialogs with category filters, full descriptions, technology tags, and original project links.
- A pause control freezes idle movement and substitutes discrete chapter views for camera flights. Reduced-motion preferences start in this mode.

## Responsive and accessible behavior

Desktop: text occupies the left reading column; the camera's off-axis projection places the city in the right half. Mobile: the city occupies the upper visual field and the paper reading surface fades in below it. All portfolio content remains HTML, independent of WebGL.

Native buttons, links, and modal dialogs support keyboard navigation. Dialogs trap focus and close with Escape. Navigation has descriptive accessible labels and an active chapter indicator. A skip link bypasses the persistent header. The canvas is decorative to assistive technology. WebGL failure leaves the readable portfolio and project controls available; a no-JavaScript link opens the complete archive.

## Technical implementation

- Buildless static HTML/CSS/JavaScript. Compatible with a GitHub Pages project subpath; asset references are relative.
- Three.js 0.180.0 is vendored locally with its MIT license. The live site requires no npm packages or external 3D asset host.
- Facade and sign textures are drawn into canvases. Character and architecture are generated from geometry.
- Distant buildings use `InstancedMesh`; districts outside the current camera neighborhood are hidden. Pixel ratio is capped at 1.5. The paused scene draws only when needed; hidden tabs skip renders.
- Font files are bundled locally with their licenses and system fallbacks. The redesign makes no external asset requests.
- Three.js references: [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html), [responsive rendering](https://threejs.org/manual/pages/responsive.html).

## Verification

`npm run check` validates local asset paths, section anchors, project IDs, and all 11 project records. `npm test`, with the local server running, exercises the 3D renderer and camera travel, chapter navigation, case-file filters, modal dismissal, résumé links, motion controls, reduced-motion behavior, and mobile overflow. Screenshots are written to the ignored `test-results/` folder for visual review.
