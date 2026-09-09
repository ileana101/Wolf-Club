# Wolf Club — Site

A static implementation of the Wolf Club website, built from the Figma
prototype screenshots. Plain HTML/CSS/JS — no build step, no framework — so
it deploys to Vercel as a static site, plus one small serverless function
for the AI chatbot.

## Pages

- **`index.html`** — Home. Hero banner, About Us, News + Character of the
  Season, Featured Gallery.
- **`joining.html`** — Joining Wolf Club: requirements, what to do while
  waiting for an opening, what to know when applying, returning-applicant
  rules, and post-acceptance next steps.
- **`staff.html`** — Staff & Leadership (nested under the Joining nav
  item): Council, Moderators, Pack Leaders, Scribes, the Staff Code of
  Conduct, and the Staff Strike System.
- **`group-rules.html`** — Group Rules (also nested under Joining): member
  Code of Conduct, general group rules, the Member Strike System,
  submission guidelines, mature content guidelines, and Discord rules.
- **`member-guides.html`** — Member Guides landing page (Getting Started,
  Community Rules, Roleplay Tips), with a dropdown to the five guides
  below.
- **`bones.html`** — the full Bones Currency System: how to earn bones
  (illustrations, comics, RP/lit, animations/PMVs, MSEs), bonuses, what's
  not eligible, how to cash them, and FAQ.
- **`activity-check.html`** — monthly member activity, seasonal character
  activity, force-retirement consequences, and retirement/character death.
- **`character-creation.html`** — general character rules, first/other
  character limits, Other Creatures, application art requirements and
  templates, required biography fields, names/age/gender/height/weight, and
  the full design guide (markings, fur, eyes, scarring) with the reference
  images.
- **`pack-creation.html`** — who can apply to lead a pack, drafting a pack's
  culture/hierarchy, the tryout/voting process, and pack costs.
- **`mates-and-pups.html`** — bonded vs. temporary mates, pregnancy, litters
  and pup adoption, guardians, and the mates & pups masterlist.
- **`shop.html`** — every bone cost on the site in one place: accessories,
  familiars, rank/task, faction changes, mutations, mates, pregnancy,
  pups/litters, additional characters, and creating a pack.
- **`packs.html`** — the eight active packs, Loners/Loner Bands, Other
  Creatures, and the disbanded-packs lore.
- **`chandor.html`**, **`fellfang.html`**, **`allruh.html`**,
  **`riverfell.html`**, **`xassa.html`**, **`grayard.html`**,
  **`virtus.html`**, **`telcoyu.html`** — the full per-pack culture pages:
  history, foreign relations, culture/religion/customs, laws, tasks, and
  the pack ranks table, each themed with its own accent palette (sampled
  from the source doc) via CSS custom properties on `.wc-pack-theme` rather
  than the site's default warm tan/gold. "View Pack" buttons on
  `packs.html` and the Packs nav dropdown link straight to these.
- **`contact.html`** — Email/Discord/Support cards plus a "Send Us a
  Message" form. There's no backend wired up, so submitting opens the
  visitor's own email client via a `mailto:` link (see the note in the
  file) — swap that for a real form-submission endpoint when one exists.

The **Resources** tab has been removed per request.

## Navigation behavior

The nav markup lives in exactly one place — `js/nav.js` — and is rendered
into a `<div id="wc-nav-root" data-current="..." data-current-href="...">`
placeholder on every page, so adding or renaming a dropdown item only
requires editing one file instead of eleven.

- The top nav bar uses `position: sticky` (see `css/styles.css`,
  `.wc-nav`), so it stays pinned to the top of the viewport as the page
  scrolls — no need to scroll back up to reach another link.
- On desktop, **Joining**, **Member Guides**, **Shop**, **Packs**, and
  **Contact** each open a dropdown (hover or click) to their sub-pages.
- Below 880px wide, the bar collapses behind a hamburger button; tapping an
  item with children expands it in place as an accordion instead of a
  hover flyout.

## AI chatbot ("Ask Wolf Club")

A floating chat launcher (bottom-right, every page) opens a panel backed by
the `/api/chat` serverless function (`api/chat.js`). It's built in two
layers:

1. **Synonym-aware search** (`lib/synonyms.js` + `lib/search.js` +
   `lib/content-index.js`) — a hand-maintained index of every page's actual
   content, matched against the visitor's question after expanding niche
   in-group terms and their plain-language synonyms (e.g. "currency" ↔
   "bones", "puppy" ↔ "pup", "leader" ↔ "alpha"). This runs with **zero
   configuration** and always works.
2. **Claude, grounded in that search** — if an `ANTHROPIC_API_KEY` is set
   in the Vercel project's environment variables, the top matches are
   handed to Claude (`claude-opus-5`) as context, and it writes a real,
   conversational answer strictly from that context (with a source link
   back to the relevant page). Without a key, the widget still works — it
   falls back to showing the raw matched excerpts as a keyword-search
   result, and says so.

**To enable the full AI-generated answers:** in the Vercel project →
Settings → Environment Variables, add `ANTHROPIC_API_KEY` with a key from
[console.anthropic.com](https://console.anthropic.com), then redeploy.

**Keeping the chatbot's knowledge in sync:** there's no build-time scraper
— `lib/content-index.js` is the source of truth for what the bot can
answer. When you add or change a page's content, add or update the
matching chunk(s) in that file. Add new niche terms/synonyms to
`lib/synonyms.js` as they come up (e.g. once Shop/Packs get more detail, or
new slang appears in the community).

## Images

The Character of the Season headshot and the three Featured Gallery
images, and the character-creation design-guide reference images, are
hot-linked to their original DeviantArt/wixmp/Weebly URLs, as given for
this build. The wixmp URLs carry signed tokens that may eventually
expire — if an image stops loading, download a fresh copy and swap in a
local file under an `assets/` folder instead.

The hero background is a CSS gradient placeholder standing in for the
painted forest illustration from Figma — export that artwork as an image
and drop it into the `.wc-hero` background rule in `css/styles.css` when
it's available.

The "About Us" paragraph on the home page was cut off at the bottom of the
original screenshot; the ending has been written to match the surrounding
tone but should be checked against the original Figma copy.

Pack crest/sigil artwork wasn't provided as linkable image files (they're
embedded drawings in the source docs, not URLs), so each pack page uses a
themed emoji in the hero instead — swap those for the real crest images
under an `assets/` folder when available. Where a pack's Resources /
Character Folder / Pack Journal / Map / App Template / Past Events links
had a real URL in the source document, they're wired up as live links;
where the source document itself only had placeholder text (no link), the
button renders inert with a "Coming soon" title, same convention as the
rest of the site — e.g. Chandor's and Telcoyu's Timeline/Playlist are
still placeholders because the source docs never linked them either.

## Running locally

Install the one dependency (the Anthropic SDK, used only by the chatbot's
serverless function):

```bash
npm install
```

Then, with the Vercel CLI (needed so `/api/chat` actually runs locally):

```bash
npx vercel dev
```

Static-only preview (chatbot will fail to reach `/api/chat` this way):

```bash
npx serve .
```

## Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this from the
   repo).
2. In Vercel, **New Project** → import this repo. If the repo has other
   content at its root (it does — this lives alongside
   `character-creation-ab-test/`), set **Root Directory** to
   `wolf-club-site` in the project settings.
3. Framework preset: **Other** / static. No build command or output
   directory needed — Vercel auto-installs `package.json` and picks up
   `api/chat.js` as a serverless function.
4. (Optional but recommended) Add the `ANTHROPIC_API_KEY` environment
   variable so the chatbot gives real AI-generated answers instead of
   falling back to raw keyword search.
5. Deploy.
