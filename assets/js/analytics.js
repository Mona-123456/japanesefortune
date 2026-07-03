/* ==========================================================================
   Analytics — single source of truth for GA4 (Google Analytics 4).
   --------------------------------------------------------------------------
   Loaded on every page. It stays completely OFF (no network calls, no cookies)
   until Mona sets a real Measurement ID below — so it is safe to ship before
   launch. To turn analytics on:
     1. Create a GA4 property → Admin → Data streams → Web → copy the
        "Measurement ID" (looks like G-ABCD1234).
     2. Replace the placeholder below with it. That's the only edit needed;
        every page picks it up automatically.
   ========================================================================== */

// ▼▼ EDIT THIS ONE LINE after creating the GA4 property ▼▼
var GA4_MEASUREMENT_ID = "G-51J3FTG5BR";
// ▲▲ leave as-is to keep analytics disabled ▲▲

(function () {
  var id = GA4_MEASUREMENT_ID;
  // Disabled until a real ID is configured.
  if (!/^G-[A-Z0-9]{6,}$/.test(id) || id.indexOf("XXXX") !== -1) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  // anonymize_ip keeps this light on privacy for an EU/global audience.
  gtag("config", id, { anonymize_ip: true });
})();
