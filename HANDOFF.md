# Cosmic Pets — project handoff

A snapshot of the project so a new session (or a new person) can pick it up.
Last updated at commit that added this file.

## What this is

Irina Csapo's Cosmic Pets website (cosmicpets.co.uk): handmade collage pet
portraits, a portfolio plus ordering. This repo **replaces the old Webflow
site** (which cost £29/month) with a free static site on GitHub Pages.

**Deadline: the site must be live on cosmicpets.co.uk by Monday 10 August 2026.**

## Where everything lives

- **Repo:** github.com/IrinaCsapo/cosmicpets-site (public), branch `main`.
- **Live preview:** https://irinacsapo.github.io/cosmicpets-site/
- **Custom domain cosmicpets.co.uk is NOT switched yet.** Webflow still serves
  it, untouched. Switching it is the last launch step (see below).
- Every push to `main` auto-deploys via GitHub Actions (`.github/workflows/pages.yml`)
  in about a minute.
- **Cache gotcha:** the stylesheet is served with `max-age=600` (10 min). After
  a CSS change the page can look broken (unstyled) on a tab you already had open,
  because the browser is pairing new HTML with the old cached CSS. Hard-refresh
  (Cmd/Ctrl+Shift+R) or wait 10 minutes. This is not a bug.

## Tech

- Plain HTML, one CSS file, one JS file. **No build step.** Edit files directly,
  commit, push.
- Colours are `oklch()` throughout — do not convert to hex/rgb.
- Photography and portraits are WebP.
- Fonts: **Aventi** (display, self-hosted in `assets/fonts/`), **Albert Sans**
  (body, Google Fonts), **Asar** (secondary serif, Google Fonts).
- **Writing rule: no em dashes anywhere.** Use a comma, full stop, or rewrite.

## Structure

```
index.html          Home: hero + 3D carousel + trust row + gallery taster +
                    "Beautiful unique artworks" cards + How it works + reviews +
                    Instagram + CTA
gallery.html        The Cosmic Crew, all 15 portraits
prices.html         Three packages (Cosmic Magic £149 / Print £99 / Download £59)
                    + gift vouchers + How it works
photo-guide.html    What makes a good photo
about.html          Irina's story + the making of
faqs.html           FAQs (with FAQPage structured data)
contact.html        Order form + email
404.html            Self-contained not-found page (inline styles, works at any path)
<slug>/index.html   Redirect stubs for the old Webflow URLs (/about, /order,
                    /cosmic-crew, /faqs, /gift-vouchers, /cosmic-magic, ...)

assets/css/site.css   All styling
assets/js/site.js     Nav, scroll reveals, 3D hero carousel, story modal, form
assets/portraits/     15 portraits: <slug>.webp (full), -thumb.webp (grid),
                      -card.webp (carousel). Slugs: kyoto (=Victor,Garrus&Nahlus),
                      kitties (=Akira&Pandora), bfg-tango, griutz, jasper-oscar,
                      snowbell, skip, candy, crush, mina, mochi, felix, gracie,
                      polly, otis
assets/img/           Everything else, incl. cosmic-pets-logo-white.svg (footer)
assets/fonts/         Aventi Bold
CNAME.disabled        The custom domain, parked until launch
```

## Key features (how they work)

- **Hero carousel** (`.marquee` in index + the "hero cinema carousel" block in
  site.js): a seamless marquee (portraits duplicated, track travels exactly
  -50%) that JS curves into 3D per-frame. Decorative only — no names, no links.
  Pauses on hover; disabled under prefers-reduced-motion.
- **Story modal** (`.portrait` buttons + "portrait story modal" in site.js):
  clicking a portrait opens image-left / story-right (stacked on mobile). Names
  and stories come from a `<script type="application/json" id="crew-stories">`
  island keyed by each portrait's `data-slug`. Content was parsed from the
  client's CSV export (Cosmic Crew Pets), sanitised to p/strong/em/ul/li.
- **Contact form**: posts to FormSubmit (free), address hello@cosmicpets.co.uk.
  On failure it rebuilds the answers into a pre-filled mailto so nothing is lost.

## Still open (do these before / at launch)

1. **Activate the contact form.** FormSubmit needs a one-time confirmation:
   Irina clicks the "Activate Form" email sent to hello@cosmicpets.co.uk.
   Until then submissions don't forward. The endpoint is already correct.
2. **Aventi font licence.** Aventi is a commercial font committed to a public
   repo. Confirm the licence allows self-hosting, or swap `--display` in
   site.css for a free display serif (Playfair Display or Bodoni Moda).
3. **Go live — recommended Friday 7 August, not the 10th** (DNS + HTTPS cert
   need 24–48h of headroom). Checked against live DNS:
   - Nameservers are Google Domains, mail is Zoho — neither is at Webflow, so
     cancelling Webflow cannot take the domain or email.
   - Change only two records: apex `A` (198.202.211.1 → GitHub's four IPs
     185.199.108–111.153) and `www` CNAME (cdn.webflow.com → irinacsapo.github.io).
   - **Do not touch the Zoho MX / SPF / `_dmarc` records** or email breaks.
   - No CAA record, so the Let's Encrypt cert issues fine.
   - Rename `CNAME.disabled` → `CNAME`, tick Enforce HTTPS once the cert issues.
   - **Cancel Webflow last**, after testing pages + a real email + one form submit.
4. **Analytics (optional).** Umami is self-hosted at irina-umami.vercel.app for
   irina.love. If wanted here, add a NEW website there and use its new ID — do
   not reuse the irina.love ID.

## Not done yet (ideas)

- The CSV's `Overlay Image` column (decorative butterflies, a van for BFG &
  Tango) is not used in the story modal. Could be layered in.
- Cache-busting on the CSS link (version query) so deploys always load fresh.
