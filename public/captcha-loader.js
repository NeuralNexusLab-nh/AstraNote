"use strict";

// Tor preserves this hostname for the web server while routing the connection
// through the shared NXLabTW onion service. Load CAPTCHA from its onion vhost
// so a Tor visit never asks the browser to fetch the clearnet CAPTCHA script.
const CAPTCHA_ONION_HOST = "astranote.nxlabtwhcegzi5f65qb6ri4iv72rtdp5q7s4w457pahcohtmegjregqd.onion";
const CAPTCHA_ORIGIN =
  location.hostname.toLowerCase() === CAPTCHA_ONION_HOST
    ? "http://nexacaptcha.nxlabtwhcegzi5f65qb6ri4iv72rtdp5q7s4w457pahcohtmegjregqd.onion"
    : "https://nexacaptcha.nxlabtw.com";

document.write(`<script src="${CAPTCHA_ORIGIN}/captcha/gravity.js" defer></script>`);
