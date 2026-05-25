# Developer Guide

This document explains the architecture of the MedicalGuard Pracsoft Edition demo and shows how to evolve it from a static prototype into a production-grade app backed by a real API.

---

## 1. Architecture overview

The demo is intentionally **frontend-only** and uses **zero build tooling**. Every file is plain HTML, CSS, or ES5-compatible JavaScript. The split between **data files** and **app files** is the most important convention to understand:

```
┌──────────────────────────────────────────────────────────────┐
│                       index.html                              │
│  (HTML markup only — every panel, modal, drawer, and tour)    │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│              assets/css/medicalguard.css                      │
│  Tokens · layout · components · light theme · optimiser       │
└──────────────────────────────────────────────────────────────┘

         DATA (load first — pure declarations, no DOM access)
┌─────────────────────────┬───────────────────────────────────┐
│ date-ranges.js          │ Dashboard KPI snapshots (30/90/365)│
│ audit-packs.js          │ Pre-built audit document HTML      │
│ help-content.js         │ Help drawer copy per panel id      │
│ tour-steps.js           │ Guided tour step definitions       │
│ providers.js            │ Provider drilldown data (`PD`)     │
│ intellisense-responses.js │ AI optimiser prompts + answers   │
└─────────────────────────┴───────────────────────────────────┘

         APP (DOM event handlers, depends on data above)
┌─────────────────────────┬───────────────────────────────────┐
│ nav.js                  │ Clock, `show()`, modal helpers     │
│ audit-wizard.js         │ 5-step audit workflow              │
│ audit-pack-modal.js     │ Audit pack viewer                  │
│ help-drawer.js          │ Right-side help drawer + FAQ       │
│ tour.js                 │ Guided tour spotlight              │
│ provider-modal.js       │ Provider drilldown modal           │
│ heatmap.js              │ Heatmap cell + workflow detail     │
│ billing-optimiser.js    │ IntelliSense chat (wraps `show()`) │
└─────────────────────────┴───────────────────────────────────┘
```

**Load order matters** for two pairs:

1. `nav.js` defines `show()`, `openMo()`, and `closeMo()` and must load before any module that calls them.
2. `billing-optimiser.js` **wraps** `show()` to repaint the amber Billing-Optimiser tab — it must load **after** `nav.js`.

`index.html` already includes all scripts in the correct order at the bottom of `<body>`.

---

## 2. State model

The app uses **plain globals** — no framework, no store. State lives on a handful of named variables:

| Variable | Where | Holds |
|---|---|---|
| `auditState` | `audit-wizard.js` | `{ step, verdicts, remediations }` for the active audit |
| `optMessages` | `intellisense-responses.js` | Current optimiser chat history (cleared per question) |
| `tourStep` | `tour.js` | Index into `TOUR_STEPS` for the guided tour |

DOM is the source of truth for everything else (panel visibility via `.on` class, modal open via `.open` class, etc.). To persist state across reloads, write these globals to `localStorage` in their setters and hydrate them on page load.

---

## 3. Wiring to a real backend

Each data file maps to one or more REST endpoints. The recommended pattern is to replace each `var X = {…}` with an async loader that hits your API and exposes the same shape on `window`:

### 3.1 Recommended endpoint contract

| File | Suggested endpoint | Shape (see `sample-data/`) |
|---|---|---|
| `date-ranges.js`           | `GET /api/dashboard/kpis?range=30|90|365` | `kpis.json` |
| `audit-packs.js`           | `GET /api/audit-packs` (index)<br>`GET /api/audit-packs/:id` (one) | Each entry: `{ title, sub, html }` |
| `help-content.js`          | static (copy is in-app)                   | — |
| `tour-steps.js`            | static                                    | — |
| `providers.js`             | `GET /api/providers`<br>`GET /api/providers/:id` (drilldown) | `providers.json` |
| `intellisense-responses.js`| `POST /api/intellisense/ask` (LLM)        | `{ question }` → `{ markdown }` |

### 3.2 Example swap — providers

**Before** (demo / static):

```js
// data/providers.js
var PD = { patel: { name: 'Dr M. Patel', ... }, whittaker: { ... } };
```

**After** (backend):

```js
// data/providers.js
window.PD = {};
async function loadProvider(id) {
  if (PD[id]) return PD[id];
  const r = await fetch(`/api/providers/${id}`, { credentials: 'include' });
  PD[id] = await r.json();
  return PD[id];
}
```

And in `app/provider-modal.js`, change the top of `provDrill()` to be async:

```js
async function provDrill(id) {
  const d = await loadProvider(id);
  // ... existing code uses `d` exactly as before
}
```

The DOM rendering code does not change.

### 3.3 Example swap — Billing Optimiser (LLM)

Replace the keyword matcher in `app/billing-optimiser.js`:

**Before:**

```js
function optMatch(q) { /* if-chain returning OPT_RESPONSES[…] */ }
```

**After (streaming LLM):**

```js
async function optMatch(q) {
  const resp = await fetch('/api/intellisense/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: OPT_CONTEXT,        // already defined in intellisense-responses.js
      question: q,
      history: optMessages
    }),
    credentials: 'include'
  });
  const { markdown } = await resp.json();
  return markdown;
}
```

Make `optSend()` `await optMatch(...)`. The rest of the chat UI is unchanged.

### 3.4 Pracsoft connector

The production product reads from Pracsoft via a **read-only SQL connector** on `HCNSQL07`. The connector polls every 15 minutes and tokenises patient identifiers (name, DOB, Medicare number) at the ingest boundary before any data leaves the clinic network. The demo simulates this with the data in `assets/js/data/` — no actual Pracsoft connection is made.

To build a production connector, the recommended architecture is:

1. **Edge agent** running inside each clinic — read-only SQL access to Pracsoft, tokenises identifiers, sends deltas to the cloud over TLS 1.3.
2. **Cloud ingest** — receives tokenised events, dedupes, applies the MBS rule library, persists to time-series store.
3. **API layer** — serves the JSON shapes documented in `sample-data/` to this frontend.
4. **Token map** — held in a separate, audit-logged keystore, only re-joined for clinical-record review by an authenticated practice user.

All data must remain in Australia (AWS `ap-southeast-2`, Azure `australiaeast`, or equivalent) to satisfy APP 8.

---

## 4. Authentication & multi-tenancy

The demo has no auth. To add it:

1. Wrap the page in your auth provider's redirect flow (Cognito, Auth0, Azure AD).
2. Stamp every `fetch()` with the user's session cookie or bearer token (`credentials: 'include'`).
3. Add a tenant id to every endpoint, derived server-side from the session — never trust client input.
4. Role-gate the **Internal Audit** sign-off step: only users with `role: 'principal'` should be able to call `completeAudit()`.

---

## 5. Privacy & compliance notes

Items to address before any production rollout:

- **Privacy Act 1988 + APPs** — Data Processing Agreement with each practice; APP 11 security controls; tokenisation at edge.
- **NDB scheme** — 30-day OAIC notification clock; breach runbook in `Privacy Governance` panel.
- **Statutory tort (June 2025)** — direct patient cause of action for serious privacy invasion; health data is the highest-risk category.
- **My Health Records Act 2012** — relevant if you extend to MyHR-integrated workflows.
- **Audit logs** — every read of a token-mapped patient identifier must be logged with user, time, and clinical justification.
- **Retention** — 7-year retention for clinical records (state legislation varies); separate retention for billing telemetry.

---

## 6. Performance budget

The demo loads ~190 KB of JS and ~47 KB of CSS uncompressed, mostly demo data. In production with API-loaded data, the JS shrinks to ~30 KB. Consider:

- Gzip / Brotli at the edge (typical ~70 % reduction)
- Lazy-loading `audit-packs.js` only when the Audit Packages panel is opened
- Lazy-loading `intellisense-responses.js` only when the Billing Optimiser panel is opened
- Code-splitting per route if you migrate to a framework

---

## 7. Migration to a framework (optional)

If you choose to port this to React / Vue / Svelte:

1. The HTML in `index.html` becomes one component per `<section class="panel">`.
2. The data files (`assets/js/data/`) become async loaders returning typed shapes (TypeScript recommended — see `sample-data/*.json` for the shapes).
3. The app files become hooks/composables driven by the active panel.
4. Keep the design tokens at the top of `medicalguard.css` (the `:root` block) — they are the source of truth for the brand.

The split between *data* and *app* in this demo was chosen specifically to make this port straightforward.

---

## 8. Contact

Questions about the production platform, the Pracsoft connector spec, or the LLM integration:
<hello@verticertai.com.au>
