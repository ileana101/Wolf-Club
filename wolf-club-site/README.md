# Wolf Club — Site

A static implementation of the Wolf Club home page and joining flow, built
from the Figma prototype screenshots. Plain HTML/CSS/JS — no build step,
no framework — so it deploys to Vercel as-is.

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

Content for **Member Guides, Shop, Packs, Resources, and Contact** hasn't
been provided yet — those nav items are wired up with dropdown menus per
the design note, but each currently shows an inert "Coming soon" entry.
Once screenshots for those pages arrive, add the real links into that
item's `.wc-dropdown` block (same pattern as the Joining dropdown) and
build the corresponding page.

## Navigation behavior

- The top nav bar uses `position: sticky` (see `css/styles.css`,
  `.wc-nav`), so it stays pinned to the top of the viewport as the page
  scrolls — no need to scroll back up to reach another link.
- On desktop, **Joining**, **Member Guides**, **Shop**, **Packs**,
  **Resources**, and **Contact** each open a dropdown (hover or click) to
  their sub-pages.
- Below 880px wide, the bar collapses behind a hamburger button
  (`js/nav.js` handles the toggle); tapping an item with children expands
  it in place as an accordion instead of a hover flyout.

## Images

The Character of the Season headshot and the three Featured Gallery
images are hot-linked to their original DeviantArt/wixmp URLs, as given
for this build. Those URLs carry signed tokens that may eventually
expire — if an image stops loading, download a fresh copy from DeviantArt
and swap in a local file under an `assets/` folder instead.

The hero background is a CSS gradient placeholder standing in for the
painted forest illustration from Figma — export that artwork as an image
and drop it into the `.wc-hero` background rule in `css/styles.css` when
it's available.

The "About Us" paragraph on the home page was cut off at the bottom of
the screenshot; the ending has been written to match the surrounding tone
but should be checked against the original Figma copy.

## Running locally

No build step required:

```bash
npx serve .
```

or, with the Vercel CLI:

```bash
vercel dev
```

## Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this from the
   repo).
2. In Vercel, **New Project** → import this repo. If the repo has other
   content at its root (it does — this lives alongside
   `character-creation-ab-test/`), set **Root Directory** to
   `wolf-club-site` in the project settings.
3. Framework preset: **Other** / static. No build command or output
   directory needed.
4. Deploy.
