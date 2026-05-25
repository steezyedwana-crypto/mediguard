// ============================================================================
// IntelliSense — Billing Optimiser data
//   OPT_CONTEXT     — system prompt fed to an LLM when wired to one
//   optMessages     — runtime chat history (reset per question in this demo)
//   OPT_RESPONSES   — pre-built deterministic answers keyed by topic
//
// In production: route the user question + OPT_CONTEXT to your LLM endpoint
// and stream the response into the chat. The demo matches keywords from the
// question against OPT_RESPONSES via optMatch() in billing-optimiser.js.
// ============================================================================

var OPT_CONTEXT = `You are IntelliSense, the billing optimisation AI inside MedicalGuard Pracsoft Edition — a compliance and revenue intelligence platform for Australian primary care practices.

PRACTICE CONTEXT (live Pracsoft data):
- Practice group: Southside Health Group
- 6 clinics: Riverside, City North, Eastside, Westfield, Southside, Northgate
- 24 GPs + 8 allied health practitioners (physiotherapist, dietitian/APD, psychologist, OT, podiatrist, exercise physiologist, + 2 more)
- 42,318 Medicare claims this month totalling $3.26M in benefits
- Overall compliance score: 94% (above peer cohort average of 89%)

PROVIDER BILLING PROFILES (from Pracsoft):
- Dr M. Patel (Riverside): 612 claims/month. Item 36 = 61% (peer avg 20%). Item 23 = 22% (peer avg 52%). Item 721 CDM = 8%. HIGH compliance risk on Item 36 but also potential CDM/preventive care gaps.
- Dr A. Whittaker (City North): 247 claims/month. Item 44 after-hours = 14% (peer avg 8%). Item 23 = 54%. Item 2713 mental health = 7%. Timestamp issues on 3 x Item 44 consults.
- Dr S. Khan (Eastside): 418 claims/month. Item 36 = 47%. Item 23 = 31%. Inverted ratio. Item 721 CDM = 7%.
- Dr L. Nguyen (Westfield): 312 claims/month. Item 23 = 58%. Item 36 = 19%. Item 721 CDM = 6% (above network avg). MONITOR only — good profile.
- Dr R. Singh (Southside): 388 claims/month. Item 23 = 62%. Item 36 = 14%. COMPLIANT.
- Dr T. Cole (Northgate): 351 claims/month. Item 23 = 51%. Item 36 = 22%. COMPLIANT.
- Dr E. Park (Riverside): 298 claims/month. Item 23 = 56%. Item 36 = 21%. COMPLIANT.

IDENTIFIED REVENUE OPPORTUNITIES:
1. CDM Plans (Items 721/723): Network creation rate 4.2% vs estimated potential 8-12%. ~$82,000/year uncaptured. 3 overdue annual reviews blocking re-billing of Item 723. 
2. Triple Bulk Billing Incentives (Items 10990, 75870, 75871): Estimated $34,000/year underclaimed. These apply to children under 16, concession card holders, and pensioners. Eligibility not consistently being checked at billing.
3. Telehealth (Items 91890, 92746): ~$18,000/year in eligible phone/video consultations being billed as face-to-face when telehealth items apply and would be more appropriate.
4. Allied Health MBS linkage: 8 allied practitioners generating revenue but Item 723 Team Care Arrangement linkage is incomplete for some patients — ~$27,000/year in allied health MBS billings not being captured because GPs aren't creating TCA referrals.
5. Health assessments underutilisation: Items 701 (75yo+), 703, 705, 707 (aged care), 715 (Aboriginal/TSI), 10004/10006 (heart/stroke risk) — estimated $14,000/year uncaptured.
6. MHTP Better Access: Item 2710/2712/2713 and psychology referrals 80110-80180. Estimated $12,000/year. Some providers creating plans but not billing the GP items.
7. DVA items: If veterans/DVA Gold Card holders in patient panel, potential for DVA-specific items that may not be flagged in Pracsoft billing workflow.

TOTAL ESTIMATED OPPORTUNITY: ~$161,000/year in legitimate, compliant Medicare revenue.

IMPORTANT RULES FOR YOUR RESPONSES:
- ONLY recommend legitimate, compliant MBS billing. Never suggest upcoding, false billing, or inappropriate item use.
- Always link recommendations to specific MBS item numbers.
- Distinguish clearly between compliance risk (things that could get flagged) and revenue opportunity (things being missed).
- Reference specific providers and their data when relevant.
- Be specific, practical, and actionable. Give step-by-step guidance where useful.
- Keep responses concise but thorough — bullet points and structure are helpful.
- Use Australian Medicare/MBS terminology.`;

var optMessages = [];

// ── Pre-built response library (offline-capable) ───────────────────────────

var OPT_RESPONSES = {

cdm: `## CDM / Chronic Disease Management — $82,000 Annual Opportunity

Your network is creating GP Management Plans (Item 721) at **4.2% of eligible encounters** — the benchmarked potential based on your patient complexity data is **8–12%**. That gap represents approximately **$82,000 in legitimate, uncaptured Medicare revenue per year**.

**Immediate actions — this week:**

- **3 patients have overdue Item 721 annual reviews** (Dr T. Cole × 2, Dr L. Nguyen × 1). These must be completed before Item 723 (Team Care Arrangement) can be re-billed. Each overdue review blocks approximately $150 in Team Care billings per patient.
- Item 723 TCA creation should follow every Item 721 review where allied health is clinically appropriate. With 8 allied practitioners on-site, your TCA linkage rate should be higher.

**Provider-specific opportunity:**

| Provider | Current CDM Rate | Potential | Estimated Gap |
|---|---|---|---|
| Dr R. Singh | 5% | 10–12% | ~$14,200/yr |
| Dr T. Cole | 7% | 10–12% | ~$9,800/yr |
| Dr E. Park | 5% | 9–11% | ~$12,400/yr |
| Dr A. Whittaker | 3% | 8–10% | ~$18,600/yr |

**Action plan:**
1. Run a Pracsoft recall for patients with 2+ chronic conditions not on a current CDM plan
2. Add a CDM plan creation prompt to consult templates for patients with diabetes, hypertension, COPD, cardiac disease, or osteoarthritis
3. Schedule CDM audit review for all overdue annual reviews — target completion within 14 days
4. Ensure Item 723 referrals to your allied health team are created at the time of every new TCA

All of the above is straightforward, legitimate Medicare billing — no compliance risk whatsoever.`,

bulkbilling: `## Triple Bulk Billing Incentives — $34,000 Annual Opportunity

Items **10990, 75870, and 75871** are additional payments made by Medicare on top of the standard bulk-billing benefit when you bulk-bill eligible patients. They are being **systematically underclaimed** across your network.

**Eligible patients (check Pracsoft concession status):**
- Children under 16 years old → Item 10990
- Concession card holders (Pensioner Concession, Health Care Card, Commonwealth Seniors) → Item 10990
- Patients in aged care facilities → Items 75870/75871
- DVA Gold Card holders → DVA-specific enhanced rates apply separately

**Why it's being missed:**
Pracsoft does not automatically flag eligibility at billing — the receptionist or billing staff must check the concession field and manually apply the incentive item. If this isn't part of your front-desk workflow, it's being missed on every eligible consultation.

**Dollar impact by clinic (estimated):**

- Riverside (Dr Patel + Dr Park): ~$9,200/yr uncaptured
- Southside (Dr Singh): ~$8,100/yr
- Northgate (Dr Cole): ~$7,400/yr
- Westfield (Dr Nguyen): ~$5,800/yr
- City North (Dr Whittaker): ~$3,500/yr

**Fix in 3 steps:**
1. **Pracsoft settings** → enable concession status prompt at billing — flag when billing Type B or GP items where patient has a concession card on file
2. **Reception workflow** → confirm concession card status at every visit, update Pracsoft patient record
3. **Billing audit** → run a 3-month lookback on bulk-billed consultations for concession patients where incentive items were not applied — consider retrospective correction where eligible

This is one of the fastest fixes available — revenue improvement within 2–3 weeks of implementing the workflow change.`,

telehealth: `## Telehealth Utilisation — $18,000 Annual Opportunity

Your network has **$18,000/year** in eligible telephone and video consultations being billed under face-to-face items when telehealth-specific items are available and clinically appropriate.

**Key telehealth items you should be using more:**

- **Item 91890** — Standard telephone consultation (equivalent of Item 23), existing patient, $39.75
- **Item 91891** — Long telephone consultation (equivalent of Item 36), existing patient, $73.95
- **Item 92746** — Standard video consultation, existing patient
- **Item 92747** — Long video consultation, existing patient

**Eligibility rules (from MBS):**
- Patient must have attended the practice face-to-face within the prior 12 months (MedicalGuard validates this against Pracsoft visit history — all current patients are eligible)
- No geographical restriction for GP telehealth since March 2023
- The consultation must be clinically appropriate for remote delivery

**Where the gap is:**
Dr Whittaker (City North) has a patient panel with 22% rural/outer-metropolitan postcodes — telehealth uptake at that clinic is 5% vs the network average of 6%. Dr Singh (Southside) has a similar profile.

**Practical implementation:**
1. Update appointment booking options in Pracsoft to include "phone consult" and "video consult" as distinct appointment types linked to the correct MBS items
2. Train reception staff to offer telehealth options for follow-up, script renewal, and results review appointments
3. Ensure the billing workflow applies Item 91890 (not Item 23) when the appointment type is phone consult
4. MedicalGuard will monitor telehealth item usage vs eligible patient visits and alert when face-to-face-only billing is used for patients who could be billed under telehealth

No compliance risk — these are standard MBS items introduced permanently post-COVID.`,

allied: `## Allied Health MBS Linkage — $27,000 Annual Opportunity

You have **8 allied health practitioners** generating significant revenue, but the GP-to-MBS linkage via Team Care Arrangements is incomplete. This means some allied health sessions are being billed privately (or not billed at all under MBS) when they could be partially funded by Medicare.

**How the linkage works:**
1. GP creates Item 721 (GP Management Plan) for a patient with a chronic condition
2. GP creates Item 723 (Team Care Arrangement) referring the patient to allied health
3. Patient attends allied health — practitioner bills MBS under the TCA (up to 5 services per year per allied health type)
4. Each TCA-linked allied health service generates approximately $58–$62 in Medicare benefit

**Current gaps identified in Pracsoft:**

- **Sarah Mitchell (Physio):** 1 active patient with no TCA referral found — billing MBS Item 10960 without a current Item 723. Revenue at risk + compliance flag.
- **Rohini Patel (Dietitian):** 12 patients attended in the last 90 days with a chronic condition where no TCA exists in Pracsoft. Estimated $8,400/yr in Medicare-fundable dietitian sessions currently being billed privately.
- **Luc Dubois (Podiatry):** Diabetic foot care (Item 10962) is correctly linked for 80% of diabetic patients. 6 patients attending without an active CDM plan — opportunity to create Item 721 plans and link under TCA.

**Action plan:**
1. Run monthly Pracsoft report: allied health patients (last 90 days) cross-referenced against Item 721/723 status → refer all gaps to their GP for plan creation
2. Add a TCA creation step to the CDM plan template — whenever Item 721 is created, prompt GP to also create Item 723 if allied health is indicated
3. At allied health intake, ask: "Do you have a chronic disease management plan with your GP?" — if yes, verify TCA exists before billing

**Annual revenue uplift:** ~$27,000 in MBS benefits flowing to patients (reducing out-of-pocket costs) and maintaining billing compliance.`,

assessments: `## Health Assessment Items — $14,000 Annual Opportunity

Several Medicare health assessment items are significantly underutilised across your network. These are **high-value, legitimate preventive care items** with no compliance risk when used appropriately.

## 75+ Health Assessments — Item 701 / 703 / 705 / 707

**Item 701** — 75+ years health assessment: $157.90 per assessment, once per 12 months.

Your Pracsoft patient panel contains an estimated **340 patients aged 75+** based on age band data. Current Item 701 billing rate: approximately 18% of eligible patients per year. Benchmarked rate for comparable practices: 35–45%.

- **Gap:** ~180 patients eligible but not receiving annual health assessments
- **Revenue opportunity:** 180 × $157.90 = **$28,400/year** (Item 701 alone)
- **Concurrent opportunity:** Each Item 701 typically triggers Item 23/36 + allied health referrals + medication reviews (Item 900) — multiplier effect on legitimate billing

## Heart Health Assessment — Items 10004 / 10006

**Item 10004** — Aboriginal and/or Torres Strait Islander patients aged 45+ (or 18+ with chronic disease): $157.90

**Items 699 / 177** — Cardiovascular absolute risk assessment for patients aged 45–74 (not Indigenous): $80.45

Current usage across the network: 2.1% of eligible consultations. Benchmarked rate: 6–8%.

## Mental Health GP Items — 2710 / 2712 / 2713

GP mental health treatment plan items are being created at a reasonable rate but **the GP consultation item is not always being billed at the same visit:**
- Item 2710 (prepare/coordinate MHTP): $154.35
- Item 2713 (review MHTP): $75.25

MedicalGuard has identified 8 instances in the last 90 days where a MHTP was created but the Item 2710 was not billed at the same consultation.

**90-day action plan:**
1. Pracsoft recall → all patients aged 75+ without an Item 701 in the last 12 months → schedule dedicated health assessment appointments
2. Add cardiovascular risk assessment to annual check-up template for 45–74 age group
3. Add Item 2710 to MHTP creation template as a required billing step`,

nguyen: `## Dr L. Nguyen — Revenue Optimisation Analysis

**Current profile:** 312 claims/month · Westfield Clinic · Provider No: 3408291M

Dr Nguyen has the **best compliance profile on the network** (96% score, all items within range) and already above-average CDM plan creation at 6% vs 4.2% network average. This is a genuinely well-managed billing profile — the optimisation opportunities here are additive, not corrective.

## Opportunities Identified

**1. CDM Plan Volume — $8,400/year opportunity**

Dr Nguyen's 6% CDM rate is good but still below the 8–12% benchmarked potential. Based on Pracsoft patient complexity data at Westfield:
- Estimated 18 patients with 2+ chronic conditions currently without a GP Management Plan
- Creating plans for these patients: 18 × Item 721 ($84.85) = **$1,527 immediate**
- Plus Item 723 TCA for each + annual Item 721 review cycle = ~$8,400/year ongoing

**2. Triple Bulk Billing Incentives — $5,800/year**

Westfield clinic has a high concession card rate in its catchment. Item 10990 is not being consistently applied at billing for eligible patients. Recommend:
- Pracsoft billing prompt for concession status on every bulk-billed consult
- Estimated 410 missed incentive billings over 12 months at $14.20 each

**3. 75+ Health Assessments — $4,200/year**

Dr Nguyen's Item 701 billing rate is 22% of eligible patients. Lifting to 40% (achievable with a systematic recall):
- Approximately 27 additional assessments per year
- 27 × $157.90 = **$4,263**

**4. Allied Health TCA Linkage — $3,600/year**

Dr Nguyen refers to physio and dietitian under CDM plans but some referrals are not capturing the Item 723 TCA billing step at time of referral. Approximately 6 patients/year missing TCA creation.

## Summary for Dr Nguyen

| Opportunity | Annual Value | Effort |
|---|---|---|
| CDM plan uplift | $8,400 | Medium |
| Bulk billing incentives | $5,800 | Low |
| 75+ health assessments | $4,200 | Medium |
| Allied health TCA linkage | $3,600 | Low |
| **Total** | **$22,000** | |

All of the above is fully compliant — Dr Nguyen's profile means there is no compliance remediation work to do alongside revenue optimisation.`,

patel: `## Dr M. Patel — Revenue Optimisation Analysis

**Current profile:** 612 claims/month · Riverside Clinic · Provider No: 2847291J · **HIGH compliance risk (Item 36)**

Dr Patel's situation requires careful separation: there is a **compliance issue that needs to be addressed first**, and separately, there are genuine revenue opportunities that can be pursued once the Item 36 pattern is documented and justified.

## Compliance First — Do This Before Revenue Optimisation

The Item 36 pattern (61% vs 20% peer average) is the priority. The clinical justification pack is pre-assembled. Internal review and principal sign-off needed this week. Do not pursue revenue expansion for Dr Patel until the Item 36 review is documented — it would look poor in any Provider Review context.

## Legitimate Revenue Opportunities (post-review)

**1. CDM Plans — $9,200/year**

Dr Patel's CDM rate is 8% — above network average, which is positive. However, with 612 claims/month and a complex patient panel (consistent with the Item 36 rate), the potential is 10–14%.
- Approximately 22 additional CDM plans per year
- Each plan + annual review cycle: ~$420 total over 12 months
- Estimated uplift: **$9,200/year**

**2. Triple Bulk Billing Incentives — $9,200/year**

Riverside clinic has a mixed-socioeconomic catchment. Item 10990 eligibility check should be embedded in the billing workflow.
- High-volume practice means high dollar impact from this systematic fix

**3. Health Assessments — $5,100/year**

At 612 consultations/month, Dr Patel has a large patient panel. Item 701 (75+ health assessment) and Item 10004 (cardiovascular risk) are both underutilised.

## Key Caveat

Dr Patel should **not increase consultation volume or Item 36 billing** while the current compliance review is open. The revenue opportunities above involve different item types (721, 723, 701, 10990) that carry no Item 36 risk.`,

mhtp: `## MHTP Revenue Opportunity — $12,000 Annual Gap

Your network has **31 active Mental Health Treatment Plans** (MHTPs) with solid psychology referral volumes, but there are two specific gaps creating ~$12,000/year in missed legitimate revenue.

## Gap 1 — GP MHTP Items Not Billed at Plan Creation

When a GP creates or reviews an MHTP, specific GP-payable items apply:
- **Item 2710** — Create/coordinate MHTP at a standard consultation: **$154.35**
- **Item 2712** — Create MHTP at a prolonged consultation: **$231.15**
- **Item 2713** — Review MHTP: **$75.25**

MedicalGuard has identified **8 MHTP creation events** in the last 90 days where the GP mental health item was not billed. At $154.35 average, that's **$1,235 already missed this quarter** — annualised: ~$5,000/year.

**Fix:** Add Item 2710 as a required line item in the MHTP consult template in Pracsoft. It cannot be billed without the underlying consultation, so it should appear alongside Item 23 or 36 automatically.

## Gap 2 — Psychology Session Extension Referrals

Dr Okafor has 4 patients currently at sessions 5–6 of their 10-session Better Access entitlement. If their clinical need continues:
- GP must create an extension referral (additional 4 sessions) using Item 2713 (review) before session 7
- Without this, the psychologist cannot bill Medicare for sessions 7–10
- Each failed extension = 4 × $137.30 (Item 80110) = **$549 in Medicare funding lost per patient**
- 4 patients at risk = **$2,196 in funding** that will lapse without GP action this week

**Fix:** MedicalGuard flags patients approaching session 6 automatically. Dr Okafor should be notified to schedule MHTP reviews for these 4 patients within the next 10 days.

## Gap 3 — Allied Health MHTP Linkage

Sola Okonkwo (Psychologist) has 76 sessions billed this month. Cross-referencing against GP records shows **6 patients** whose GP has not billed the Item 2713 MHTP review that triggered the current referral cycle. The psychologist can bill; the GP is missing the associated $75.25.

**Estimated annual opportunity: $12,000** across all three gaps.`,

plan: `## 90-Day Billing Optimisation Action Plan — Southside Health Group

**Total estimated annual opportunity: $161,000**
**Priority: High-impact, low-effort items first**

---

## Month 1 — Quick Wins ($44,000/year impact)

**Week 1–2: Triple Bulk Billing Incentives (Item 10990)**
- Configure Pracsoft to prompt concession card check at billing
- Circulate 1-page guide to reception staff on eligibility and billing steps
- **Impact: $34,000/year** | Effort: Low | Risk: Zero

**Week 2–3: Fix overdue CDM annual reviews**
- Dr Cole has 2 overdue Item 721 reviews, Dr Nguyen has 1
- Complete reviews → re-bill Item 723 Team Care Arrangement
- **Immediate revenue: ~$450** | Ongoing: unlocks $1,200+/year per completed review set

**Week 3–4: GP MHTP item billing**
- Add Item 2710 to MHTP consult template in Pracsoft
- Fix identified 8 missed billings from last 90 days where possible
- Alert Dr Okafor re: 4 patients needing extension referrals (Item 2713) before session 7
- **Impact: $12,000/year** | Effort: Low | Risk: Zero

---

## Month 2 — Systematic Improvements ($68,000/year impact)

**CDM Plan creation uplift**
- Run Pracsoft recall: patients with 2+ chronic conditions, no current Item 721
- Set target: all eligible GPs to CDM rate of 8% minimum within 60 days
- Embed CDM plan prompt into chronic disease consult templates
- **Impact: $82,000/year** (primary opportunity)

**Allied health TCA linkage**
- Monthly report: allied health patients without Item 723 in Pracsoft
- Add TCA creation step to CDM plan template
- Fix identified Sarah Mitchell TCA gap (compliance priority)
- **Impact: $27,000/year**

**Telehealth item alignment**
- Audit appointment booking types — ensure phone/video appointments link to 91890/92746
- Train reception on correct item selection for telehealth appointments
- **Impact: $18,000/year**

---

## Month 3 — Preventive Care Programme ($49,000/year impact)

**75+ Health Assessment programme**
- Pracsoft recall: all patients 75+ without Item 701 in last 12 months
- Dedicated assessment appointment slots (45–60 min) at each clinic
- Target: lift Item 701 rate from 18% to 35% of eligible patients
- **Impact: $28,400/year** (Item 701 alone, before downstream billing)

**Cardiovascular risk assessment rollout**
- Add Items 699/177 to annual check-up template for 45–74 age group
- **Impact: ~$8,200/year**

**DVA patient identification**
- Pracsoft report: patients with DVA card on file — confirm DVA-specific items are being applied
- **Impact: variable — requires patient panel audit**

---

## Compliance Note

Everything in this plan represents **legitimate, fully compliant Medicare billing**. None of these items involve upcoding, creative interpretation, or billing practices that would raise Provider Review flags. The only compliance action running concurrently is the Item 36 internal audit for Dr Patel and Dr Khan — that work should continue independently of this revenue programme.

**Progress tracking:** MedicalGuard will report monthly on CDM creation rate, Item 10990 application rate, telehealth item usage, and allied health TCA linkage — so you can see the revenue impact in real time as each initiative takes effect.`,

whittaker: `## Dr A. Whittaker — Revenue Optimisation Analysis

**Current profile:** 247 claims/month · City North Clinic · Provider No: 3192847K · **ELEVATED risk (Item 44 timestamps)**

Important caveat: **resolve the 3 Item 44 timestamp issues first** (internal review in progress). Revenue optimisation should proceed in parallel for item types unrelated to after-hours billing.

## Revenue Opportunities

**1. CDM Plans — $18,600/year (largest opportunity)**

Dr Whittaker's CDM rate is only **3%** — well below the network average of 4.2% and far below the benchmarked potential of 8–10% for a 247-claim/month practice.

Based on Pracsoft patient data at City North:
- Approximately 31 patients with 2+ chronic conditions and no current GP Management Plan
- 31 × Item 721 ($84.85) = **$2,630 immediate**
- Plus TCA + annual review cycle: ~$18,600/year ongoing

This is the single biggest legitimate revenue gap for Dr Whittaker and carries **zero compliance risk** — CDM plans are straightforward, well-defined items.

**2. Mental Health — $6,200/year**

Dr Whittaker bills Item 2713 (mental health) at 7% — above the network average of 4%. However, MedicalGuard shows that Item 2710 (MHTP creation) is frequently not billed at the same consult. Estimated 22 missed Item 2710 billings in the last 12 months at $154.35 = **$3,396 missed**.

**3. Triple Bulk Billing Incentives — $3,500/year**

City North has a moderate concession card patient rate. Item 10990 not consistently applied.

**4. Telehealth Items — $2,800/year**

City North's patient panel includes 22% rural/outer-metro postcodes — telehealth utilisation at 5% is below potential. Shifting eligible follow-up appointments to Items 91890/91891 adds revenue for the same clinical work.

## Summary

| Opportunity | Annual Value | Timeline |
|---|---|---|
| CDM plan uplift (Item 721/723) | $18,600 | 60 days |
| MHTP billing gap (Item 2710) | $3,400 | Immediate |
| Bulk billing incentives | $3,500 | 2 weeks |
| Telehealth alignment | $2,800 | 30 days |
| **Total** | **$28,300** | |`,

khan: `## Dr S. Khan — Revenue Optimisation Analysis

**Current profile:** 418 claims/month · Eastside Clinic · Provider No: 2710384B · **ELEVATED risk (23/36 ratio)**

Dr Khan's situation is similar to Dr Patel — there is an Item 36 pattern to address, though less severe (47% vs 61%). The internal audit is monitoring this. Revenue opportunities below are for item types unrelated to consultation length items.

## Revenue Opportunities

**1. CDM Plans — $11,400/year**

CDM rate is 7% — slightly above network average but below potential for a 418-claim/month practice.
- Estimated 24 additional CDM plans at current patient complexity
- Each with annual review and TCA: ~$11,400/year
- **Particularly appropriate for Dr Khan:** CDM plan creation demonstrates a practice focused on chronic disease management, which provides clinical context for longer consultations — relevant if the Item 36 pattern comes under review

**2. Telehealth — $4,200/year**

Dr Khan's telehealth usage at 8% (Item 91890 and 92746) is average. Eastside clinic patient panel shows opportunity to shift more follow-up and results consultations to telehealth items.

**3. Triple Bulk Billing Incentives — $8,100/year**

Eastside clinic has a high concession card patient rate. Item 10990 eligibility is not being consistently flagged in the Pracsoft billing workflow.
- High-impact, low-effort fix
- Estimated 570 eligible consultations/year where incentive was not applied

**4. Health Assessment Items — $3,800/year**

Item 701 (75+ assessment) and cardiovascular risk items are underutilised at Eastside relative to the patient panel age profile.

## Summary

| Opportunity | Annual Value | Timeline |
|---|---|---|
| CDM plan uplift | $11,400 | 60 days |
| Bulk billing incentives | $8,100 | 2 weeks |
| Health assessments | $3,800 | 60 days |
| Telehealth alignment | $4,200 | 30 days |
| **Total** | **$27,500** | |`,

dva: `## DVA Billing — What You May Be Missing

DVA (Department of Veterans' Affairs) provides significantly enhanced Medicare-equivalent benefits for eligible veterans and dependants. If you have DVA Gold Card or White Card holders in your patient panel, there are likely uncaptured opportunities.

## DVA Gold Card — All clinically necessary treatment funded

For Gold Card holders, DVA funds all clinically necessary treatment at DVA-determined fees, which are **generally higher than the Medicare Schedule Fee**:

- Standard consultation (equivalent Item 23): **$84.35** vs Medicare $39.75
- Long consultation (equivalent Item 36): **$130.85** vs Medicare $75.75
- Health assessment for veterans 75+: **$218.60** vs Medicare $157.90

**How to capture this correctly in Pracsoft:**
- Patient billing type must be set to "DVA" not "Medicare" or "Bulk Billing"
- Claims submitted to DVA via HPOS, not Medicare Online
- DVA patients cannot be bulk-billed under Medicare for DVA-funded conditions — the DVA rate applies

## DVA White Card — Specific accepted conditions only

White Card covers treatment for specific war-related conditions accepted by DVA. Standard Medicare billing applies for non-accepted conditions.

## Checking your panel

Run a Pracsoft report: patients with "DVA" in the patient type or health fund field. Cross-reference against billing records for the last 12 months. Any DVA patient being billed at standard Medicare rates for DVA-fundable services is leaving money on the table.

**Estimated annual impact:** Variable — depends on DVA patient volume. For a network of your size (6 clinics), if 2–3% of patients hold DVA cards, the opportunity is $15,000–$25,000/year in enhanced rebates.

**Compliance note:** DVA billing has its own compliance framework. MedicalGuard monitors for correct DVA vs Medicare item code selection automatically.`,

  item36: `## Item 36 — Long Consultation Risk Analysis

Item 36 is the highest compliance risk in this network. Here is the full picture.

## Provider Comparison

| Provider | Item 36 Rate | Peer (20%) | Risk Level |
|---|---|---|---|
| Dr M. Patel | 61% | 20% | Critical - 340% above |
| Dr S. Khan | 47% | 20% | High - 235% above |
| Dr A. Whittaker | 18% | 20% | Clear |
| Dr L. Nguyen | 19% | 20% | Clear |
| Dr R. Singh | 14% | 20% | Clear |

Services Australia flags providers above approximately **30% of peer cohort** for Item 36. Both Dr Patel and Dr Khan are significantly above this threshold and are the primary compliance risk for this network.

## Recommended actions

- **This week:** Run the Dr Patel Item 36 internal audit - sample pre-selected, takes 45 minutes. Go to Internal Audit panel and click through the 5-step wizard.
- **Within 30 days:** Same audit for Dr Khan.
- **Ongoing:** Ensure reception books 30-min slots for Item 36 appointments so Pracsoft duration records match the MBS threshold.`,

  item44: `## Item 44 — After-Hours Timestamp Analysis

Item 44 is the most **directly provable** compliance risk in the network.

## The timestamp discrepancies (Dr Whittaker)

MedicalGuard found 3 consultations billed as Item 44 where Pracsoft shows appointment times inside ordinary hours:

- **06 May 2026 - 5:20 PM** - MBS after-hours starts 6:00 PM weekdays. Non-compliant.
- **02 May 2026 - 5:45 PM** - Same issue. Non-compliant.
- **07 May 2026 - 4:55 PM** - Borderline. Review clinical record first.

## Why this matters

Timestamp discrepancies are factual. Services Australia can prove them directly from Pracsoft records. This is the most common finding in Provider Reviews because it requires no clinical judgment to establish - the time is the time.

## Recommended actions

1. Rebill 06 May and 02 May as Item 23 - 10 minutes
2. Review 07 May clinical record before deciding
3. Educate Dr Whittaker on the MBS after-hours window and Pracsoft timestamp recording`,

  singh: `## Dr R. Singh — Billing Profile

Dr Singh is **fully compliant** across all monitored items. No action required.

| Item | Rate | Peer Benchmark | Status |
|---|---|---|---|
| Item 23 | 62% | 52% | Normal |
| Item 36 | 14% | 20% | Clear - below peer |
| Item 44 | 9% | 8% | Normal |
| Item 721 | 5% | 4.2% | Above average (positive) |
| Item 91890 | 4% | 4% | Normal |

## Revenue opportunity for Dr Singh

CDM plan creation (Item 721) at 5% is good but estimated capacity is 8-9% based on the patient panel. Estimated **$6,400/year** in additional legitimate Medicare revenue. Recommend a recall of patients with 2+ chronic conditions who don't yet have an active Item 721 plan.`,

  revenue: `## Network Revenue Summary — May 2026

## Total Medicare Benefits: $3.26M

| Category | Revenue | % of Total | Trend |
|---|---|---|---|
| GP Consultations | $2.18M | 67% | Steady |
| Telehealth | $264K | 8% | Growing |
| CDM / Chronic Disease | $167K | 5% | Improving |
| Health Assessments | $73K | 2% | Flat |
| Bulk Bill Incentives | $387K | 12% | Under capacity |
| Allied Health | $181K | 6% | Stable |

## Top 3 revenue opportunities (zero compliance risk)

**1. Item 10990 Triple Bulk Bill Incentive: $34,000/year**
Only 22% utilisation vs 65% estimated eligible patients. No extra clinical work required - eligible patients just need to be identified at booking.

**2. Item 721/723 CDM Plans: $82,000/year**
Network at 47% of estimated CDM plan capacity. These are patients with 2+ chronic conditions who are entitled to a care plan and not currently receiving it.

**3. Health Assessments (Items 701, 10004): $14,000/year**
Seniors and 75+ assessments significantly underutilised across the network.

**Total identified opportunity: $161,000/year - all legitimate Medicare entitlements**`,

  compliance: `## Network Compliance Status — May 2026

**Overall Score: 94%** (peer cohort average: 89%). Above benchmark but two providers need immediate attention.

## Provider Risk Register

| Provider | Risk Level | Primary Issue | Action Required |
|---|---|---|---|
| Dr M. Patel | High | Item 36 at 340% of peer | Internal audit this week |
| Dr A. Whittaker | Elevated | Item 44 timestamps x3 | Rebill 2 consults - urgent |
| Dr S. Khan | Elevated | 23/36 ratio inverted | Audit within 30 days |
| Dr L. Nguyen | Clear | All items in range | None required |
| Dr R. Singh | Clear | All items in range | None required |

## Rules currently firing

- **MBS-036-DURATION:** 8 consultations below 20-min threshold billed as Item 36
- **MBS-44-TIMESTAMP:** 3 after-hours timestamp discrepancies (Dr Whittaker)
- **MBS-80-20-MONITOR:** Dr Patel approaching PSR threshold - 90-day early warning active

## Next steps

The two most impactful actions this week: (1) Dr Patel Item 36 internal audit - 45 minutes using the wizard in the Internal Audit panel. (2) Rebill two Dr Whittaker Item 44 consultations from May - 10 minutes.`,

  auditpack: `## Audit Packages Status

MedicalGuard has **4 completed audit packages** for this network. All available to view inline in the Audit Packages panel.

| Package | Status | Findings |
|---|---|---|
| Item 36 Review - Dr Patel (Q2 2026) | Signed | 3 findings, all remediated |
| After-Hours - Dr Whittaker (Q1 2026) | Signed | 2 findings, both corrected |
| Full Network Quarterly (Q4 2025) | Board approved | 9 findings, all closed |
| CDM Utilisation Review (Apr 2026) | Pending sign-off | Opportunities identified |

Each pack contains: scope definition, sample methodology, claim-by-claim review findings, remediation actions and completion status, principal sign-off, and a board-ready executive summary. Click **Audit Packages** in the sidebar and then **View** on any completed pack to read the full document.`,

  setup: `## How MedicalGuard Connects to Pracsoft

## Connection method

Read-only SQL connector to your Pracsoft database on the HCNSQL07 server. MedicalGuard **cannot write, modify, or delete** any record in Pracsoft. Your Pracsoft system operates exactly as normal.

## What is collected (every 15 minutes)

MBS item codes billed, appointment timestamps, appointment durations from Pracsoft, provider numbers, clinic location codes, and billing type (bulk bill / private / DVA).

Patient names, Medicare numbers, and dates of birth are **tokenised at ingest** and never transmitted or stored in identifiable form.

## Setup timeline

- **Day 1:** Read-only connection configured (2-4 hours, remote session)
- **Day 2:** Data validation and initial dashboard population
- **Days 3-5:** Practice manager training (45-minute session)
- **Week 2:** First compliance review with Verticert AI

**No software installed on clinical workstations. Pracsoft operates exactly as normal.**`,

summary: `## Network Revenue Summary — All Opportunities

Based on live Pracsoft data for Southside Health Group, here is the complete picture:

## Total Identified Opportunity: $161,000/year

| Category | Annual Opportunity | Effort | Risk |
|---|---|---|---|
| CDM Plans (Item 721/723) | **$82,000** | Medium | None |
| Triple Bulk Billing Incentives | **$34,000** | Low | None |
| Allied Health TCA Linkage | **$27,000** | Low | None |
| Telehealth Item Alignment | **$18,000** | Low | None |
| Health Assessments (701, 10004) | **$14,000** | Medium | None |
| MHTP GP Item Billing | **$12,000** | Low | None |
| DVA Enhanced Rates | **$14,000** | Low | None |

## By Provider

| Provider | Opportunity/Year | Priority |
|---|---|---|
| Dr A. Whittaker | $28,300 | CDM + MHTP |
| Dr R. Singh | $22,800 | CDM + Assessments |
| Dr L. Nguyen | $22,000 | CDM + Assessments |
| Dr S. Khan | $27,500 | CDM + Incentives |
| Dr T. Cole | $19,400 | CDM + Assessments |
| Dr E. Park | $18,600 | CDM + Incentives |
| Dr M. Patel | $23,600 | Post-review: CDM + Incentives |

## What This Is NOT

Every item on this list is:
- ✓ Legitimate Medicare-funded entitlement
- ✓ Clinically appropriate billing
- ✓ Not subject to Provider Review risk
- ✗ Not upcoding, false billing, or gaming

The compliance work (Dr Patel Item 36, Dr Whittaker Item 44 timestamps, Dr Khan ratio) runs **separately** from this revenue programme. The revenue opportunities above are unaffected by and unrelated to those compliance issues.

**Start here:** Triple bulk billing incentives (Item 10990) — the fastest fix, zero compliance risk, $34,000/year impact, implementable in 2 weeks.`
};

// Match question to best response
