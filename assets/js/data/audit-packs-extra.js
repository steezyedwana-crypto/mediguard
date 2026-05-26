// ============================================================================
// AUDIT_PACKS_EXTRA — additional pre-built audit package documents.
//
// Merged into AUDIT_PACKS at load. Same shape: { title, sub, html }.
// In production these would be fetched from your backend per pack id.
//
// Pack ids:
//   whittaker_remediation       — After-hours remediation pack (active cycle)
//   psr_response                — Provider Review (PSR) response pack
//   racgp_accreditation         — RACGP Standards 1–5 evidence
//   privacy_act                 — Privacy Act / APP / NDB evidence pack
//   allied_health               — Allied health compliance report
//   justification_<providerId>  — Per-provider justification pack
//   profile_<providerId>        — Per-provider PDF profile
// ============================================================================

(function(){
  // ── HTML template helpers ─────────────────────────────────────────────────
  // Lets every new pack share the same cover + section markup so the file
  // reads cleanly. The CSS classes (ap-cover / ap-section / ap-finding / etc.)
  // are already defined in assets/css/medicalguard.css.

  function cover(o){
    var badges = (o.badges || []).map(function(b){
      return '<div><div style="color:#6b7a8d;font-size:.5rem;font-family:var(--mono);letter-spacing:.08em">'
        + b[0] + '</div><div style="color:' + (b[2] || '#fff') + ';font-weight:' + (b[3] || 600) + '">'
        + b[1] + '</div></div>';
    }).join('');
    return ''
      + '<div class="ap-cover">'
      +   '<div style="font-family:var(--mono);font-size:.48rem;color:#6b7a8d;letter-spacing:.1em;margin-bottom:.5rem">'
      +     (o.banner || 'MEDICALGUARD PRACSOFT EDITION · CONFIDENTIAL')
      +   '</div>'
      +   '<div class="ap-cover-title">' + o.title + '</div>'
      +   '<div style="font-size:.85rem;color:rgba(255,255,255,.75);margin-bottom:.8rem">' + (o.subline || '') + '</div>'
      +   '<div style="display:grid;grid-template-columns:repeat(' + (o.badges ? o.badges.length : 4) + ',1fr);gap:.8rem;font-size:.72rem">' + badges + '</div>'
      + '</div>';
  }

  function section(title, body){
    return '<div class="ap-section"><div class="ap-section-title">' + title + '</div>' + body + '</div>';
  }

  function p(text){ return '<div style="font-size:.77rem;color:#475569;line-height:1.75;margin-bottom:.7rem">' + text + '</div>'; }

  // key/value grid used in evidence packs
  function kvGrid(rows){
    return '<div class="ap-grid">' + rows.map(function(r){
      return '<div class="ap-k">' + r[0] + '</div><div class="ap-v">' + r[1] + '</div>';
    }).join('') + '</div>';
  }

  function finding(opts){
    var cls = opts.kind === 'ok' ? 'ap-finding ok' : opts.kind === 'warn' ? 'ap-finding warn' : 'ap-finding';
    return '<div class="' + cls + '">'
      + '<div class="ap-finding-title">' + opts.title + '</div>'
      + '<div class="ap-finding-body">' + opts.body + '</div>'
      + '</div>';
  }

  function signoff(o){
    return '<div class="ap-signoff">'
      + '<div><div style="font-weight:700;color:#166534;font-size:.85rem">&#10003; ' + o.label + '</div>'
      + '<div style="font-size:.7rem;color:#475569;margin-top:.15rem">Signed by ' + o.signer + ' on ' + o.date + ' &middot; ' + o.context + '</div></div>'
      + '<div style="font-family:var(--mono);font-size:.6rem;color:#6b7a8d">' + (o.ref || '') + '</div>'
      + '</div>';
  }

  // ── 1. After-hours remediation pack (active cycle row 2) ──────────────────
  var whittakerRemediation = {
    title: 'Q1 2026 — After-Hours Remediation · Dr A. Whittaker',
    sub: 'City North Clinic · Provider No: 3192847K · Remediation phase · Reference: MG-REM-2026-031',
    html: cover({
      banner: 'MEDICALGUARD PRACSOFT EDITION · REMEDIATION TRACKING · ACTIVE',
      title: 'After-Hours Item 44 — Remediation in Progress',
      subline: 'Dr A. Whittaker · City North Clinic · Provider No: 3192847K · Findings: 2 · Open since 15 Feb 2026',
      badges: [
        ['INITIATED', '15 Feb 2026'],
        ['STATUS', '&#9201; In Remediation', '#fcd34d', 700],
        ['FINDINGS', '2 of 18 reviewed'],
        ['NEXT REVIEW', '15 Jun 2026']
      ]
    })
    + section('Audit Outcome', p('Of 18 Item 44 (after-hours) consultations reviewed for the period 1 Nov 2025 – 31 Jan 2026, two were found to have timestamps that fall inside the MBS ordinary-hours window per Pracsoft appointment records. Dr Whittaker has acknowledged both findings; the consultations were standard-time slots that overran into the evening. The dispute is not the clinical work performed but the item code applied.'))
    + section('Active Remediation Actions', ''
      + finding({ kind:'warn', title:'Action R-1 — Rebill 2 Item 44 consultations as Item 36',
          body:'Pracsoft batch rebill prepared and sent to Dr Whittaker for review. Status: awaiting clinician sign-off (assigned 16 Feb 2026, response due within 14 days). Estimated net adjustment: -$32.45.' })
      + finding({ kind:'warn', title:'Action R-2 — Booking-type fix in Pracsoft',
          body:'After-hours appointment type configured to require explicit start-time selection rather than defaulting to the previous slot. Implemented 18 Feb 2026 by Riverside IT.' })
      + finding({ kind:'ok', title:'Action R-3 — Compliance refresher (completed)',
          body:'Dr Whittaker completed the MedicalGuard 12-minute MBS after-hours refresher on 22 Feb 2026. Certificate filed against provider record.' })
    )
    + section('Compliance Trajectory — Last 90 Days', ''
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem;margin-bottom:.5rem">'
      + '<div style="background:#f0fdf4;border:1px solid #86efac;padding:.6rem .75rem;border-radius:4px"><div style="font-size:.55rem;color:#166534;font-family:var(--mono)">ITEM 44 RATE</div><div style="font-size:1.05rem;color:#166534;font-weight:700">5%</div><div style="font-size:.65rem;color:#475569">down from 14% pre-remediation</div></div>'
      + '<div style="background:#f0fdf4;border:1px solid #86efac;padding:.6rem .75rem;border-radius:4px"><div style="font-size:.55rem;color:#166534;font-family:var(--mono)">FALSE FLAGS</div><div style="font-size:1.05rem;color:#166534;font-weight:700">0</div><div style="font-size:.65rem;color:#475569">No further timestamp issues detected</div></div>'
      + '<div style="background:#fffbeb;border:1px solid #fcd34d;padding:.6rem .75rem;border-radius:4px"><div style="font-size:.55rem;color:#92400e;font-family:var(--mono)">RISK LEVEL</div><div style="font-size:1.05rem;color:#92400e;font-weight:700">Elevated</div><div style="font-size:.65rem;color:#475569">Will downgrade after 90 days clear</div></div>'
      + '</div>')
    + section('Next Steps', p('Pack auto-closes once both rebills are confirmed in Pracsoft AND Dr Whittaker\'s Item 44 rate has remained within peer cohort range for 90 consecutive days. Anticipated closure: 15 Jun 2026. Practice principal will be notified for final sign-off.'))
    + signoff({ label:'Remediation Plan Acknowledged', signer:'Dr A. Whittaker', date:'16 Feb 2026', context:'Pracsoft acknowledgement timestamp recorded', ref:'MG-REM-2026-031' })
  };

  // ── 2. Provider Review (PSR) response pack ────────────────────────────────
  var psrResponse = {
    title: 'Provider Review Response Pack — PSR-Format Justification',
    sub: 'Pre-built for Dr M. Patel · Item 36 · Reference: MG-PSR-TPL-2026',
    html: cover({
      banner: 'MEDICALGUARD PRACSOFT EDITION · PSR RESPONSE PACK · CONFIDENTIAL',
      title: 'Provider Review Response — Item 36 Long Consultation',
      subline: 'Dr M. Patel · Riverside Clinic · Provider No: 2847291J · Section 89B request response',
      badges: [
        ['PREPARED', '22 May 2026'],
        ['FORMAT', 'PSR / s.89B compliant'],
        ['STATUS', '&#9733; Draft — awaiting review', '#fcd34d', 700],
        ['REFERENCE', 'MG-PSR-2026-047']
      ]
    })
    + section('Cover Letter — to Director of PSR', p('This response pack is provided in answer to a Section 89B request for documentation regarding Dr M. Patel\'s billing of Item 36 (long consultation, ≥20 min) during the period 1 February 2026 – 31 May 2026. The pack contains: (1) full consultation log with Pracsoft appointment durations; (2) peer comparison statistics; (3) clinical justification for the established patient cohort; (4) corrective action evidence; and (5) attestation by the practice principal.'))
    + section('1 · Consultation Records', kvGrid([
        ['Period', '1 Feb 2026 – 31 May 2026 (120 days)'],
        ['Total consultations', '612'],
        ['Item 36 consultations', '373 (61%)'],
        ['Peer cohort average', '20% (national GP, MBS Online)'],
        ['Item 36 ≥20 min (Pracsoft duration)', '347 (93%)'],
        ['Item 36 &lt;20 min (Pracsoft duration)', '26 (7%)'],
        ['Mean consultation duration (Item 36)', '23.1 min'],
        ['Patient cohort', '88% established, 12% new']
      ]))
    + section('2 · Clinical Justification', p('Dr Patel\'s practice is concentrated on complex chronic disease management — 78% of the patient panel is over 65, and 64% are CDM plan-active. The peer average reflects a generalist mix; like-for-like comparison against the national CDM-heavy GP sub-cohort places Dr Patel\'s Item 36 rate at 1.6× peer rather than 3.4×. Detailed cohort analysis is appended (Annexure A).'))
    + section('3 · Acknowledged Findings & Corrective Actions',
        finding({ kind:'warn', title:'7% of Item 36 claims (26 consultations) under 20 minutes',
          body:'These have been identified, rebilled as Item 23, and the net adjustment ($1,247) has been refunded. Refund receipt MR-2026-1148 attached.' })
      + finding({ kind:'ok', title:'Practice-wide compliance training completed',
          body:'All Riverside Clinic GPs completed MedicalGuard\'s MBS consultation-item refresher on 12 May 2026. Certificates filed.' })
      + finding({ kind:'ok', title:'Booking-template change — Riverside Clinic',
          body:'Default appointment slot extended to 20 min for the established-patient cohort. Implementation date 15 May 2026.' })
    )
    + section('4 · Peer Comparison — Like-for-Like Sub-Cohort',
        '<div style="font-size:.74rem;color:#475569;margin-bottom:.5rem">National GP peer reference set restricted to providers whose patient panel matches Dr Patel\'s on age (≥65 &gt; 60%), CDM-active (&gt; 50%), and metropolitan location:</div>'
      + kvGrid([
        ['Item 36 / 23 ratio — Dr Patel', '2.76'],
        ['Item 36 / 23 ratio — matched peer cohort', '1.71'],
        ['Variance vs matched peer', '+61% (within RACGP-published normal range for high-CDM panels)']
      ]))
    + section('5 · Practice Principal Attestation', p('I have reviewed the Pracsoft consultation logs, the Pracsoft appointment-duration records, and Dr Patel\'s clinical notes for the 373 Item 36 consultations referenced above. I attest that the consultation durations recorded in Pracsoft are an accurate reflection of the time spent with each patient. Corrective actions for the 26 anomalous claims have been completed. — Dr Sarah Chen, Practice Principal, 22 May 2026.'))
    + signoff({ label:'Pack Prepared for Submission', signer:'Dr Sarah Chen', date:'22 May 2026', context:'Section 89B response · Ready for submission', ref:'MG-PSR-2026-047' })
  };

  // ── 3. RACGP Accreditation Evidence Pack ──────────────────────────────────
  var racgpAccreditation = {
    title: 'RACGP Accreditation Evidence Pack — Standards 1–5',
    sub: 'Southside Health Group · All 6 clinics · Cycle 2026 · Reference: MG-RACGP-2026-Q2',
    html: cover({
      banner: 'MEDICALGUARD PRACSOFT EDITION · RACGP STANDARDS EVIDENCE',
      title: 'RACGP Practice Standards (5th Edition) — Evidence Bundle',
      subline: 'Southside Health Group · 6 clinics · 24 GPs · Prepared for next accreditation cycle',
      badges: [
        ['GENERATED', '22 May 2026'],
        ['STANDARDS', '1, 2, 3, 4, 5'],
        ['STATUS', '&#10003; Ready for surveyor', '#22c55e', 700],
        ['REFERENCE', 'MG-RACGP-2026-Q2']
      ]
    })
    + section('Standard 1 — Communication and Patient Participation',
        kvGrid([
          ['Patient feedback (Pracsoft survey integration)', '218 responses in last 12 months'],
          ['Mean overall satisfaction', '4.6 / 5'],
          ['Complaints register entries', '4 (all closed)'],
          ['Communication-related items', '2 of 4 — both resolved within SLA']
        ]))
    + section('Standard 2 — Comprehensive Care', p('Pracsoft CDM utilisation metrics evidence comprehensive care for chronic-disease patients across the network. 78% of eligible patients have an active GPMP (Item 721) and 64% have a current Team Care Arrangement (Item 723). Detailed patient-level evidence is held against Pracsoft records and available to the surveyor on request.'))
    + section('Standard 3 — Practice Governance and Quality Improvement', ''
      + kvGrid([
        ['Clinical governance committee', 'Meets monthly · 11 meetings in last 12 months'],
        ['Internal billing audits', '4 quarterly audits completed (this platform)'],
        ['Findings actioned', '47 of 47 (100% closure rate)'],
        ['CPD compliance — all providers', '24 of 24 GPs current'],
        ['Significant event audits', '3 completed and documented']
      ]))
    + section('Standard 4 — The Practice Team',
        kvGrid([
          ['AHPRA registration — currency (all clinicians)', '24 of 24 GPs current'],
          ['Allied health AHPRA / DAA / ESSA — currency', '14 of 14 practitioners current'],
          ['Provider numbers — validation', 'All validated against Services Australia'],
          ['Mandatory reporting compliance', 'No outstanding obligations']
        ]))
    + section('Standard 5 — Physical Factors',
        p('Standard 5 evidence is held outside this platform. Premises, equipment maintenance, and infection-control documentation are managed in the practice operations log. A summary index is available in the Practice Manager\'s SharePoint folder (link in this pack\'s appendix).'))
    + section('Auditor Notes', p('This pack draws on Pracsoft data and MedicalGuard\'s internal compliance ledger. Pracsoft remains the source of truth for clinical records; MedicalGuard is read-only over Pracsoft. No patient identifiers leave the clinic network — only tokenised aggregates are reflected in the metrics above.'))
    + signoff({ label:'Accreditation Bundle Ready', signer:'Practice Manager · M. Howell', date:'22 May 2026', context:'Ready for RACGP surveyor review', ref:'MG-RACGP-2026-Q2' })
  };

  // ── 4. Privacy Act Evidence Pack ──────────────────────────────────────────
  var privacyAct = {
    title: 'Privacy Act Evidence Pack — APP Compliance & NDB Readiness',
    sub: 'Southside Health Group · APP 1–13 · NDB scheme readiness · Reference: MG-PRIV-2026-Q2',
    html: cover({
      banner: 'MEDICALGUARD PRACSOFT EDITION · PRIVACY GOVERNANCE EVIDENCE',
      title: 'Privacy Act 1988 Compliance Evidence — APP 1–13 + NDB',
      subline: 'Southside Health Group · 6 clinics · Prepared 22 May 2026',
      badges: [
        ['GENERATED', '22 May 2026'],
        ['COVERAGE', 'APP 1–13 + NDB'],
        ['STATUS', '&#10003; Audit-ready', '#22c55e', 700],
        ['REFERENCE', 'MG-PRIV-2026-Q2']
      ]
    })
    + section('1 · Australian Privacy Principles — APP 1, 5, 11 Evidence',
        kvGrid([
          ['Privacy Policy version', 'v3.2 · published 12 Feb 2026'],
          ['Collection notice (APP 5) in Pracsoft new-patient flow', 'Active'],
          ['Open and transparent management (APP 1)', 'Annual privacy review minutes 14 Mar 2026 attached'],
          ['Security of personal information (APP 11)', 'See sections 3–5 below'],
          ['Access and correction (APP 12, 13)', 'Requests log: 7 in last 12 months, 7 closed within SLA']
        ]))
    + section('2 · Data Access Logs — MedicalGuard Read-Only Boundary',
        p('MedicalGuard connects to Pracsoft via a read-only SQL connector on HCNSQL07. Every read of patient-token-mapped data is logged with: user identity, timestamp, query type, and clinical justification. Logs are tamper-evident (append-only ledger) with 7-year retention.')
      + '<div style="background:#f8fafc;border:1px solid #dde2ea;border-radius:4px;padding:.6rem .75rem;font-family:var(--mono);font-size:.66rem;color:#475569;white-space:pre">'
      + 'LAST 30 DAYS · MedicalGuard read activity (sample)\n'
      + '----------------------------------------------------\n'
      + '21 May 2026 14:22  user:sarah.chen   query:provider_kpi    justification:internal_audit\n'
      + '21 May 2026 11:08  user:m.howell     query:cdm_eligibility justification:utilisation_review\n'
      + '20 May 2026 09:51  user:sarah.chen   query:patient_token   justification:audit_evidence (Patel/Item 36)\n'
      + '19 May 2026 16:44  user:r.collins    query:billing_export  justification:board_report_prep\n'
      + '...  Full log: 2,847 entries · all entries indexed against AUD-LOG-2026'
      + '</div>')
    + section('3 · Tokenisation Records',
        p('Patient identifiers (name, DOB, Medicare number) are tokenised at the Pracsoft connector boundary. The token map is held in a separate audit-logged keystore (T1) and only re-joined for clinical-record review by an authenticated practice user with an associated audit trail entry. No tokenised identifiers leave Australian-hosted infrastructure (AWS ap-southeast-2).'))
    + section('4 · NDB Scheme Readiness',
        kvGrid([
          ['Breach response runbook version', 'v2.1 · last revision 03 Mar 2026'],
          ['30-day OAIC notification clock', 'Documented · drill conducted 18 Apr 2026'],
          ['Breach drill outcome', '&#10003; Met target — 4-hour internal detection, 6-day OAIC notification window'],
          ['Internal incident response team', '5 trained members (PM + IT + 2 GP partners + privacy officer)'],
          ['Eligible breaches reported in last 12m', '0']
        ]))
    + section('5 · Statutory Tort Risk (June 2025)',
        p('The statutory tort for serious invasion of privacy commenced in June 2025. Health data is the highest-risk category. The practice has reviewed insurance cover (PII + cyber liability) in light of the new direct-cause-of-action, and confirmed coverage with broker on 22 Apr 2026. All MedicalGuard data flows have been mapped against the tort\'s "serious invasion" tests and assessed as low-residual-risk due to the tokenisation boundary and read-only constraint.'))
    + signoff({ label:'Privacy Pack Audit-Ready', signer:'M. Howell · Privacy Officer', date:'22 May 2026', context:'For internal audit, board review, or OAIC engagement', ref:'MG-PRIV-2026-Q2' })
  };

  // ── 5. Allied Health Compliance Report ────────────────────────────────────
  var alliedHealth = {
    title: 'Allied Health Compliance Report — AHPRA, TCA, MBS Co-Claim',
    sub: 'Southside Health Group · 14 allied health practitioners · Reference: MG-ALH-2026-Q2',
    html: cover({
      banner: 'MEDICALGUARD PRACSOFT EDITION · ALLIED HEALTH COMPLIANCE',
      title: 'Allied Health Compliance Status — May 2026',
      subline: 'Southside Health Group · 14 allied health practitioners across 6 clinics',
      badges: [
        ['GENERATED', '22 May 2026'],
        ['PRACTITIONERS', '14'],
        ['STATUS', '&#10003; Compliant overall', '#22c55e', 700],
        ['REFERENCE', 'MG-ALH-2026-Q2']
      ]
    })
    + section('Registration & CPD Status', ''
      + '<table style="width:100%;border-collapse:collapse;font-size:.72rem;margin-bottom:.5rem">'
      + '<thead><tr style="background:#f8fafc"><th style="text-align:left;padding:.4rem .6rem;border-bottom:1px solid #dde2ea">Practitioner</th><th style="text-align:left;padding:.4rem .6rem;border-bottom:1px solid #dde2ea">Discipline</th><th style="text-align:left;padding:.4rem .6rem;border-bottom:1px solid #dde2ea">Registration</th><th style="text-align:left;padding:.4rem .6rem;border-bottom:1px solid #dde2ea">CPD</th><th style="text-align:left;padding:.4rem .6rem;border-bottom:1px solid #dde2ea">Status</th></tr></thead>'
      + '<tbody>'
      + ['<tr><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Sarah Mitchell</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Physiotherapist</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">AHPRA · 30 Nov 2026</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Current</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7;color:#166534">&#10003; Compliant</td></tr>',
         '<tr><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Rohini Patel</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Dietitian (APD)</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">DAA · 31 Dec 2026</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Current</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7;color:#166534">&#10003; Compliant</td></tr>',
         '<tr><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Sola Okonkwo</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Psychologist</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">AHPRA · 30 Nov 2026</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7;color:#d97706">Due 30 Jun</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7;color:#d97706">&#9888; Action — CPD due</td></tr>',
         '<tr><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Thomas Crawford</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Occupational Therapist</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">AHPRA · 28 Feb 2027</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Current</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7;color:#166534">&#10003; Compliant</td></tr>',
         '<tr><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Luc Dubois</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Podiatrist</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">AHPRA · 31 Jan 2027</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Current</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7;color:#166534">&#10003; Compliant</td></tr>',
         '<tr><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">James Baxter</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Exercise Physiologist</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">ESSA · 31 Dec 2026</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7">Current</td><td style="padding:.35rem .6rem;border-bottom:1px solid #eef2f7;color:#166534">&#10003; Compliant</td></tr>',
         '<tr><td style="padding:.35rem .6rem">+ 8 more</td><td style="padding:.35rem .6rem">Mixed allied health</td><td style="padding:.35rem .6rem">All current</td><td style="padding:.35rem .6rem">All current</td><td style="padding:.35rem .6rem;color:#166534">&#10003; Compliant</td></tr>'
        ].join('')
      + '</tbody></table>')
    + section('TCA Referral Verification — MBS Co-Claim Audit',
        p('Every allied health MBS claim under a Team Care Arrangement (Items 10950–10970 series and equivalents) is cross-referenced against the referring GP\'s Pracsoft record for an in-date Item 721 (GPMP) AND Item 723 (TCA). The check runs at the time of allied billing.'))
    + section('Last 90 Days — Co-Claim Audit Results',
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.55rem;margin-bottom:.6rem">'
        + '<div style="background:#f0fdf4;border:1px solid #86efac;padding:.65rem .75rem;border-radius:4px;text-align:center"><div style="font-size:1.4rem;font-weight:800;color:#166534">284</div><div style="font-size:.62rem;color:#475569">Allied claims verified</div></div>'
        + '<div style="background:#f0fdf4;border:1px solid #86efac;padding:.65rem .75rem;border-radius:4px;text-align:center"><div style="font-size:1.4rem;font-weight:800;color:#166534">281</div><div style="font-size:.62rem;color:#475569">Valid TCA on file (99%)</div></div>'
        + '<div style="background:#fffbeb;border:1px solid #fcd34d;padding:.65rem .75rem;border-radius:4px;text-align:center"><div style="font-size:1.4rem;font-weight:800;color:#92400e">3</div><div style="font-size:.62rem;color:#475569">Missing / expired TCA — blocked pre-submit</div></div>'
        + '<div style="background:#f0fdf4;border:1px solid #86efac;padding:.65rem .75rem;border-radius:4px;text-align:center"><div style="font-size:1.4rem;font-weight:800;color:#166534">0</div><div style="font-size:.62rem;color:#475569">Co-claim violations reaching Medicare</div></div>'
        + '</div>')
    + section('Action Items',
        finding({ kind:'warn', title:'CPD due — Sola Okonkwo (Psychologist)',
          body:'30 hours required by 30 Jun 2026; 18 logged. Auto-reminders set for weekly cadence until close-out.' })
      + finding({ kind:'ok', title:'TCA documentation refresh — all referring GPs',
          body:'Every GP completed the 6-minute TCA documentation refresher in March 2026. Linked to a 40% reduction in missing-TCA flags vs prior quarter.' }))
    + signoff({ label:'Allied Health Report Ready', signer:'M. Howell · Practice Manager', date:'22 May 2026', context:'For board report / RACGP standards / allied health committee', ref:'MG-ALH-2026-Q2' })
  };

  // ── 6. Per-provider justification packs (referenced by provider modal) ────
  function justificationFor(name, role, item, itemDesc, rate, peerRate, providerNo, clinic){
    return {
      title: 'Clinical Justification Pack — ' + name + ' · Item ' + item,
      sub: clinic + ' · Provider No: ' + providerNo + ' · Prepared for internal review',
      html: cover({
        banner: 'MEDICALGUARD PRACSOFT EDITION · CLINICAL JUSTIFICATION PACK',
        title: 'Clinical Justification — Item ' + item + ' (' + itemDesc + ')',
        subline: name + ' · ' + clinic + ' · Provider No: ' + providerNo,
        badges: [
          ['GENERATED', '22 May 2026'],
          ['ITEM', item + ' · ' + itemDesc],
          ['RATE', rate + '% (peer ' + peerRate + '%)'],
          ['STATUS', '&#9733; Draft for clinician review', '#fcd34d', 700]
        ]
      })
      + section('Purpose', p('This pack assembles the clinical and statistical evidence supporting ' + name + '\'s use of Item ' + item + ' over the last 90 days. It can be used: (1) for internal peer review; (2) as the basis of a Section 89B response if a Provider Review request is received; or (3) to support a remediation plan if an internal audit finds anomalous billing.'))
      + section('Statistical Profile',
          kvGrid([
            ['Period', 'Feb – May 2026 (90 days)'],
            ['Total consultations', '612'],
            ['Item ' + item + ' rate', rate + '%'],
            ['National peer average', peerRate + '%'],
            ['Variance vs peer', '+' + Math.round((rate / peerRate - 1) * 100) + '%'],
            ['Patient panel — established', '88%'],
            ['Patient panel — chronic / CDM-active', '64%'],
            ['Patient panel — age ≥65', '78%']
          ]))
      + section('Clinical Justification Narrative',
          p(name + '\'s patient panel sits towards the high-acuity, high-CDM end of the national GP distribution. Item ' + item + ' (' + itemDesc + ') is the appropriate item code for the consultation type performed for the majority of this panel: complex multi-morbidity reviews, medication reconciliation, and care-plan adjustment, each of which routinely exceeds the time threshold for Item ' + item + '.')
        + p('Pracsoft appointment-duration logs confirm that 93% of the Item ' + item + ' consultations in the audit period met or exceeded the relevant time threshold. The remaining 7% have been reviewed and rebilled where appropriate.'))
      + section('Evidence Held in Pracsoft',
          finding({ kind:'ok', title:'Consultation notes',
            body:'Detailed clinical notes are held against every consultation. Available to internal reviewers and (if required) to Services Australia under the standard subpoena process.' })
        + finding({ kind:'ok', title:'Appointment-duration logs',
            body:'Pracsoft records the booked and actual duration of every appointment. Logs are immutable and timestamp-verified.' })
        + finding({ kind:'ok', title:'Patient cohort metadata',
            body:'CDM plan status, age, and chronic condition flags are held against every patient. Used to construct the like-for-like peer comparison in this pack.' }))
      + section('Recommended Next Steps',
          finding({ kind:'warn', title:'1 · Clinician review of 7% sub-threshold claims',
            body:'Rebill or refund as appropriate. Estimated net adjustment: under $1,500 across the 90-day window.' })
        + finding({ kind:'warn', title:'2 · Like-for-like peer comparison annexe',
            body:'Include the matched-cohort peer comparison (high-CDM, age ≥65, metro) in any external response to materially reduce the apparent variance.' })
        + finding({ kind:'ok', title:'3 · Booking-template review',
            body:'Confirm Pracsoft appointment template defaults are aligned with the actual duration of complex consultations to remove future ambiguity.' }))
      + signoff({ label:'Pack Ready for Clinician Review', signer:'M. Howell · Practice Manager', date:'22 May 2026', context:'Draft — to be reviewed and attested by ' + name + ' before any external use', ref:'MG-JUST-2026-' + (providerNo.slice(-3)) })
    };
  }

  // ── 7. Per-provider PDF profile cards ─────────────────────────────────────
  function profileFor(name, role, providerNo, clinic, ahpra, claims, topItem, risk, score){
    return {
      title: 'Provider Profile — ' + name,
      sub: clinic + ' · Provider No: ' + providerNo + ' · PDF profile · Last 30 days',
      html: cover({
        banner: 'MEDICALGUARD PRACSOFT EDITION · PROVIDER PDF PROFILE',
        title: 'Provider Profile — ' + name,
        subline: role + ' · ' + clinic + ' · Provider No: ' + providerNo,
        badges: [
          ['GENERATED', '22 May 2026'],
          ['30D CLAIMS', String(claims)],
          ['COMPLIANCE', score + '%'],
          ['RISK', risk]
        ]
      })
      + section('Identity & Credentialing',
          kvGrid([
            ['Full name', name],
            ['Role', role],
            ['Primary clinic', clinic],
            ['Provider number', providerNo],
            ['AHPRA registration', ahpra],
            ['AHPRA expiry', '30 Nov 2026'],
            ['Last credentialing review', '12 Feb 2026 (passed)']
          ]))
      + section('Billing Activity — Last 30 Days',
          kvGrid([
            ['Total claims', String(claims)],
            ['Top item by volume', topItem],
            ['Compliance score (vs MBS rules + peer)', score + '%'],
            ['Risk classification', risk],
            ['Active findings', risk === 'Clear' ? '0' : risk === 'Monitor' ? '0' : '2'],
            ['Outstanding remediations', risk === 'Clear' ? 'None' : risk === 'Monitor' ? 'None' : '1 in progress']
          ]))
      + section('Internal Audit History',
          finding({ kind:'ok', title:'Q4 2025 — Full Network',
            body:'Reviewed as part of the quarterly network audit. No provider-specific findings.' })
        + (risk !== 'Clear' ? finding({ kind:'warn', title:'Q1 2026 — Provider Review',
            body:'Targeted internal audit completed. See linked audit pack for findings, remediation plan, and current trajectory.' }) : ''))
      + section('Privacy Notes',
          p('This profile contains no patient identifiers. All billing metrics are derived from tokenised aggregates against Pracsoft. The provider may request access to or correction of any data in this profile under APP 12 / 13.'))
      + signoff({ label:'PDF Profile Generated', signer:'MedicalGuard Auto-Generation', date:'22 May 2026', context:'Read-only · Snapshot · Re-generates on every download', ref:'MG-PROF-' + providerNo.slice(-3) })
    };
  }

  // ── Register everything onto AUDIT_PACKS ──────────────────────────────────
  var extras = {
    whittaker_remediation: whittakerRemediation,
    psr_response: psrResponse,
    racgp_accreditation: racgpAccreditation,
    privacy_act: privacyAct,
    allied_health: alliedHealth,

    // Per-provider justifications & profiles (referenced by provider modal)
    justification_patel:      justificationFor('Dr M. Patel',       'GP', '36', 'long ≥20m',     61, 20, '2847291J', 'Riverside Clinic'),
    justification_whittaker:  justificationFor('Dr A. Whittaker',   'GP', '44', 'after-hours',   14,  8, '3192847K', 'City North Clinic'),
    justification_khan:       justificationFor('Dr S. Khan',        'GP', '36', 'long ≥20m',     47, 20, '2710384B', 'Eastside Clinic'),
    justification_nguyen:     justificationFor('Dr L. Nguyen',      'GP', '23', 'standard',      58, 52, '3408291M', 'Westfield Clinic'),

    profile_patel:     profileFor('Dr M. Patel',     'GP', '2847291J', 'Riverside Clinic',   'MED0001847291', 612, 'Item 36 (61%)', 'High',     76),
    profile_whittaker: profileFor('Dr A. Whittaker', 'GP', '3192847K', 'City North Clinic',  'MED0003192847', 247, 'Item 44 (14%)', 'Elevated', 82),
    profile_khan:      profileFor('Dr S. Khan',      'GP', '2710384B', 'Eastside Clinic',    'MED0002710384', 418, 'Item 36 (47%)', 'Elevated', 84),
    profile_nguyen:    profileFor('Dr L. Nguyen',    'GP', '3408291M', 'Westfield Clinic',   'MED0003408291', 312, 'Item 23 (58%)', 'Monitor',  96),
    profile_singh:     profileFor('Dr R. Singh',     'GP', '2916487P', 'Southside Clinic',   'MED0002916487', 388, 'Item 23 (62%)', 'Clear',    97),
    profile_cole:      profileFor('Dr T. Cole',      'GP', '3182847P', 'Northgate Clinic',   'MED0003182847', 351, 'Item 23 (51%)', 'Clear',    95),
    profile_park:      profileFor('Dr E. Park',      'GP', '2918374K', 'Riverside Clinic',   'MED0002918374', 298, 'Item 23 (56%)', 'Clear',    96)
  };

  if (typeof AUDIT_PACKS === 'undefined') { window.AUDIT_PACKS = {}; }
  for (var k in extras){ AUDIT_PACKS[k] = extras[k]; }
})();
