# Sample data — backend contract

These files are **not consumed by the demo** — the demo reads from `assets/js/data/*.js` instead. These JSON files exist as a **clean schema reference** for the developer wiring this frontend to a real backend.

Each file represents one resource an API would expose. Use them as the canonical shape when designing your endpoints.

## Files

| File | Maps to (frontend) | Suggested endpoint(s) |
|---|---|---|
| `providers.json` | `PD` in `assets/js/data/providers.js` | `GET /api/providers` (index)<br>`GET /api/providers/:id` (drilldown) |
| `rules.json`     | (informational — rule library panel)  | `GET /api/rules` |
| `kpis.json`      | `DATE_DATA` in `assets/js/data/date-ranges.js` | `GET /api/dashboard/kpis?range=30\|90\|365` |

## Conventions

- All dates are ISO-8601 (`YYYY-MM-DD`).
- All monetary values are **AUD** as integer cents in production endpoints — the demo's display strings are formatted on the frontend.
- All percentages are **0–100 numbers** (not 0–1 floats).
- Provider `risk` is one of: `clear · monitor · elevated · high · critical`.
- Rule `severity` is one of: `low · medium · high · critical`.

## Privacy

These samples contain only **demo provider data** — every name, AHPRA number, and provider number is fabricated and matches no real individual. In production:

- Patient identifiers (name, DOB, Medicare number) must be tokenised at the Pracsoft connector and **never** appear in any JSON payload to the frontend.
- AHPRA numbers and provider numbers are clinician identifiers and may be displayed to authenticated practice users.
- All data must remain in Australian-hosted infrastructure (APP 8).

## Audit packages

Audit package documents are large HTML blobs and are not included here as JSON — see `assets/js/data/audit-packs.js` for the in-demo shape. Suggested production endpoint:

```
GET  /api/audit-packs            → [{ id, title, sub, status, signedBy, signedAt }]
GET  /api/audit-packs/:id        → { id, title, sub, html, status, signedBy, signedAt }
POST /api/audit-packs            → create
POST /api/audit-packs/:id/sign   → sign-off (requires principal role)
```
