/* Cosmic Pets analytics.

   Privacy-friendly, cookieless page analytics via the self-hosted Umami
   instance at https://irina-umami.vercel.app. No cookie banner needed.

   TO ACTIVATE (about one minute, once):
     1. Open https://irina-umami.vercel.app and sign in.
     2. Settings > Websites > Add website. Name it "Cosmic Pets", domain
        "cosmicpets.co.uk".
     3. Open that website, copy its "Website ID" (a long id like
        xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
     4. Paste it as WEBSITE_ID below and push. That is it, every page is
        tracked because every page loads this one file.

   Do NOT reuse the irina.love website ID here, or the two sites' stats mix.
   Until an ID is set this file does nothing, so it is safe to ship as-is. */
(function () {
  var WEBSITE_ID = ''; // <-- paste the Cosmic Pets Umami website ID here
  var SRC = 'https://irina-umami.vercel.app/script.js';

  if (!WEBSITE_ID) { return; } // dormant until an ID is set

  var s = document.createElement('script');
  s.defer = true;
  s.src = SRC;
  s.setAttribute('data-website-id', WEBSITE_ID);
  document.head.appendChild(s);
})();
