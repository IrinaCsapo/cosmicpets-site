# Cosmic Pets — project memory

Static site replacing Irina Csapo's Webflow site (cosmicpets.co.uk). Free
hosting on GitHub Pages. Read `HANDOFF.md` for the full picture; this file is
the quick memory a session loads first.

## Rules

- **No em dashes anywhere.** Use a comma, a full stop, or rewrite.
- Colours are `oklch()` throughout — never convert to hex/rgb.
- Photography and portraits are WebP.
- **No build step.** Edit HTML/CSS/JS directly, commit, push to `main`; GitHub
  Actions deploys in ~1 min.
- The stylesheet is cached 10 min. After a CSS change, a page open in a tab can
  look unstyled until a hard-refresh (Cmd/Ctrl+Shift+R). Not a bug.

## Fonts

Aventi (display, self-hosted `assets/fonts/`), Albert Sans (body), Asar (serif).
Aventi is commercial — licence for self-hosting in a public repo is unconfirmed.

## Where it is

- Repo `github.com/IrinaCsapo/cosmicpets-site`, branch `main`.
- Live preview `https://irinacsapo.github.io/cosmicpets-site/`.
- Custom domain cosmicpets.co.uk is still on Webflow, not switched. Launch
  deadline **Mon 10 Aug 2026**; switch DNS Fri 7 Aug. Details + the exact two
  DNS records (and the Zoho mail records to leave alone) are in `HANDOFF.md`.

## Content notes

- 15 portraits. Slug → name mapping matters: `kyoto` = Victor, Garrus & Nahlus;
  `kitties` = Akira & Pandora; `bfg-tango` = BFG & Tango. The rest match.
- Pet stories live in a `#crew-stories` JSON island on index.html and
  gallery.html, keyed by `data-slug`; parsed from the client's Cosmic Crew CSV.
- Contact form posts to FormSubmit (hello@cosmicpets.co.uk) and needs one-time
  activation by clicking the email FormSubmit sends.
