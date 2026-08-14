# Wolf Club — Search and Navigation A/B Test

Two static reproductions of the same real "how do I make a character" content,
each laid out the way its source platform actually structures it, for
comparing findability. `index.html` is a moderator dashboard: version-chooser
cards up top, and a session log below for tracking who tested, what they were
doing, and how it went..

- **`weebly-style/`** — mirrors the group's Weebly site: nav bar (Home /
  Joining / Member Guides / Shop / Packs / Resources / Contact / Members),
  and the character-creation rules/design guide split onto their own page,
  separate from the general "Joining" page.
- **`deviantart-style/`** — mirrors the group's DeviantArt journal: joining
  process and character-creation rules bundled into a single long scrolling
  page with jump-link pills at the top.

All rule text (species limits, age brackets, height/weight ratios, design
guidelines, bones/cooldown rules, etc.) is the real content from the group's
actual pages, just re-labeled from "Domain of the Wolf / DotW" to "Wolf
Club" per this project's rebrand. Non-functional chrome (top nav items,
template download buttons, pack-name pills) is visibly inert/disabled rather
than linking to pages that don't exist in this prototype.

## The dashboard (`index.html`)

The root page is a moderator tool, not something to send testers to directly:

- **Version A / Version B cards** — click through to open either variant
  (`deviantart-style/index.html`, `weebly-style/index.html`) in the platform's
  real layout.
- **Search Sessions log** — enter a participant's name and task, pick which
  version they're on (optional), and hit **Start** to begin a live timer.
  When they finish, click **Satisfied** or **Dissatisfied**; that button
  fills in with its color and shows the elapsed time, the other button fades
  out. Sessions persist in the browser's `localStorage`, so they survive a
  reload.
- **Reset to seed** clears any sessions you've logged and restores the three
  example participants (Misty Artimire, Frankie Finkle, Nicholas Braun — all
  logged as Satisfied, since the version isn't recorded for these three
  historical entries, their badge reads "Not recorded").

## Running locally

No build step — it's plain HTML/CSS/JS. Either:

```bash
npx serve .
```

or, with the Vercel CLI installed:

```bash
vercel dev
```

Then open `http://localhost:<port>/` for the landing page, or jump straight
to `/weebly-style/index.html` or `/deviantart-style/index.html`.

## Deploying to Vercel

1. Push this folder to GitHub (already done if you're reading this from the
   repo).
2. In Vercel, **New Project** → import this repo. If the repo has other
   content at its root, set **Root Directory** to `character-creation-ab-test`
   in the project settings.
3. No framework preset needed — leave it as "Other" / static. No build
   command or output directory required.
4. Deploy. You'll get one URL; the three routes are
   `/`, `/weebly-style/index.html`, and `/deviantart-style/index.html`.
5. **Optional — enable feedback capture:** turn on **Web Analytics** for the
   project in the Vercel dashboard (Analytics tab → Enable). Each variant has
   a small "did you find what you needed?" widget in the bottom-right corner
   that logs a `character_creation_feedback` custom event (with `variant` and
   `foundIt`) once Analytics is on, and every submission is also logged
   (visible via `vercel logs` or the dashboard's Functions/Logs tab) by the
   `api/feedback.js` serverless function — no database needed.

## Running the test

For a real comparison, don't send testers to the dashboard — send half of
them the `weebly-style` link and half the `deviantart-style` link directly,
and ask them to find out how to make a character. Use the dashboard yourself
(as moderator) to log each session's name, task, version, and result, or
have the tester submit the in-page "did you find what you needed?" widget on
whichever variant they land on.
