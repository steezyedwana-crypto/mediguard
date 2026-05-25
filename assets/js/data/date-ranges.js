// ============================================================================
//    Dashboard KPI data per time range
//    MedicalGuard · Pracsoft Edition  ·  © Verticert AI
//    ============================================================================ //
//

// DATE_DATA — keyed by number of days. Each key holds the KPI strings shown
// on the Dashboard when the user picks a date range from the dropdown.
// Swap to a backend by replacing setDateRange() to fetch JSON instead.

var DATE_DATA={'30':{claims:'42,318',claimsSub:'Across 6 clinics · all providers',claimsTag:'▲ 3.2% vs same period last month',score:'94<span style="font-size:1.3rem">%</span>',scoreSub:'vs MBS rules & national peer benchmark',scoreTag:'▲ Above peer cohort avg of 89%',risk:'2',riskSub:'Providers above peer threshold',riskTag:'Action recommended this week',findings:'7',findingsSub:'5 in remediation · 2 pending sign-off',findingsTag:'3 new since Monday'},'90':{claims:'124,847',claimsSub:'Across 6 clinics · Feb–May 2026',claimsTag:'▲ 4.1% vs prior 90-day period',score:'93<span style="font-size:1.3rem">%</span>',scoreSub:'vs MBS rules & national peer benchmark',scoreTag:'▲ Steady · above peer avg of 89%',risk:'3',riskSub:'Providers above peer threshold (90d)',riskTag:'Patel, Whittaker, Khan',findings:'18',findingsSub:'11 remediated · 4 in progress · 3 pending',findingsTag:'7 new in last 30 days'},'365':{claims:'498,214',claimsSub:'Across 6 clinics · full 12 months',claimsTag:'▲ 6.8% growth year-on-year',score:'92<span style="font-size:1.3rem">%</span>',scoreSub:'vs MBS rules & national peer benchmark',scoreTag:'▲ Improving · was 89% prior year',risk:'2',riskSub:'Providers above peer threshold (12m)',riskTag:'Item 36 trend — network-wide',findings:'47',findingsSub:'39 remediated · 8 closed · 0 outstanding',findingsTag:'All prior findings resolved'}};
