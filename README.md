# MedicalGuard — Pracsoft Edition (Demo)

> **Billing oversight, internal audit, AHPRA monitoring and AI-powered billing optimisation for Australian primary-care networks.**
> Read-only over Pracsoft. Built by [Verticert AI](mailto:hello@verticertai.com.au).

This repository is a **self-contained, frontend-only demo** of the MedicalGuard Pracsoft Edition dashboard. It runs from any static web server — no build step, no dependencies, no backend required. All data is loaded from JavaScript files in [`assets/js/data/`](./assets/js/data) and can be swapped for live API calls when wiring to a real backend (see [`DEVELOPER.md`](./DEVELOPER.md)).

---

## Quick start

### Option 1 — Just open it

The demo runs straight from the filesystem in any modern browser:

```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

### Option 2 — Serve it (recommended)

Any static server works. Examples:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (no install)
npx serve .

# PHP
php -S localhost:8000
```

Then visit <http://localhost:8000>.

### Option 3 — Deploy it

Drop the folder into any static host:

| Host | How |
|------|-----|
| **GitHub Pages** | Push to a repo, enable Pages on the `main` branch |
| **Netlify** | Drag-and-drop the folder onto `app.netlify.com/drop` |
| **Vercel** | `vercel deploy` from this directory |
| **Cloudflare Pages** | Connect the repo, no build command, output dir = `/` |
| **AWS S3 + CloudFront** | `aws s3 sync . s3://your-bucket/` |
| **Azure Static Web Apps** | Connect the repo, `app_location: "/"` |

---

## What's in here

```
medicalguard-pracsoft-demo/
├── index.html                          # Markup + script/style references
├── README.md                           # This file
├── DEVELOPER.md                        # Architecture + how to wire a backend
├── LICENSE
├── .gitignore
│
├── assets/
│   ├── css/
│   │   └── medicalguard.css            # All styles (light theme + optimiser)
│   └── js/
│       ├── data/                       # ── PURE DATA — swap for API calls ──
│       │   ├── date-ranges.js          # Dashboard KPI snapshots by date range
│       │   ├── audit-packs.js          # Pre-built audit package documents
│       │   ├── help-content.js         # Help drawer copy per panel
│       │   ├── tour-steps.js           # Guided product tour
│       │   ├── providers.js            # Provider drilldown data (PD)
│       │   └── intellisense-responses.js  # AI optimiser system prompt + responses
│       │
│       └── app/                        # ── APPLICATION LOGIC ──
│           ├── nav.js                  # Clock, panel switching, modal helpers
│           ├── audit-wizard.js         # 5-step internal audit workflow
│           ├── audit-pack-modal.js     # Audit pack viewer
│           ├── help-drawer.js          # Right-side help drawer + FAQ
│           ├── tour.js                 # Guided tour (spotlight + bubble)
│           ├── provider-modal.js       # Provider drilldown modal
│           ├── heatmap.js              # Item heatmap + workflow detail
│           └── billing-optimiser.js    # AI chat (IntelliSense)
│
└── sample-data/                        # Clean JSON for backend hand-off
    ├── providers.json
    ├── rules.json
    ├── kpis.json
    └── README.md
```

---

## What the demo covers

| Module | What it shows |
|---|---|
| **Dashboard** | Network-wide KPIs, priority alerts, Pracsoft feed status, provider risk register |
| **Item Heatmap** | Every provider × every MBS item, colour-coded vs national peer benchmark |
| **Providers** | All GPs + allied health practitioners, filterable, drilldown to consultation level |
| **Internal Audit** | 5-step audit wizard: scope → sample → review → remediate → sign-off |
| **Allied Health** | AHPRA / DAA / ESSA register, TCA referral verification, MBS co-claim audit |
| **Rule Library** | 240+ MBS compliance rules with active flag counts and source citations |
| **CDM / MHTP** | Chronic disease management & mental health treatment plan utilisation |
| **MBS Analytics** | Item-level volume trends, peer benchmarks, top items, 6-month trend table |
| **Reports / Audit Packages** | Board-ready signed PDF audit packages (inline document viewer) |
| **Billing Optimiser** | AI chat for legitimate revenue opportunities (CDM, BB incentives, telehealth) |
| **AHPRA, Privacy, 80/20** | Compliance modules covering registration, Privacy Act, PSR risk |
| **Help, FAQ, Glossary, Tour** | Built-in onboarding and reference |

---

## Browser support

Tested in Chrome, Edge, Firefox, and Safari (latest). Uses no transpilation, no polyfills, no bundler. ES5-compatible JS where possible.

---

## Wiring it to a real backend

See [`DEVELOPER.md`](./DEVELOPER.md) for:

- How each data file maps to a REST endpoint
- The data contracts (JSON shapes) in [`sample-data/`](./sample-data/)
- How to swap the `OPT_RESPONSES` keyword matcher for a real LLM call
- How to add authentication, multi-tenancy, and real-time updates
- Privacy & security notes (Pracsoft connector, patient tokenisation)

---

## License

See [`LICENSE`](./LICENSE). This demo is shared with permission for evaluation purposes.
Contact <hello@verticertai.com.au> for commercial licensing of the production MedicalGuard platform.
