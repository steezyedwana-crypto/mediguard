// ============================================================================
// HEATMAP + WORKFLOW INTERACTIONS
//   cell()   — opens the cell-detail modal from a heatmap click
//   wfStep() — expands a workflow step on the audit detail page
// ============================================================================

function cell(item,prov,pct,detail){
  document.getElementById('cell-title').textContent=item+' \u2014 '+prov+' \u00b7 '+pct;
  document.getElementById('cell-detail').innerHTML=detail;
  var provId=prov.toLowerCase().replace('dr ','').replace('.','').trim().split(' ')[0];
  document.getElementById('cell-drillbtn').onclick=function(){closeMo('cell-modal');provDrill(provId)};
  document.getElementById('cell-modal').classList.add('open');
}

function wfStep(n){
  var details={
    1:'Scope: Choose audit type \u2014 Provider Review (single provider, specific item), Item Exception (all providers, one item), After-Hours Sample, CDM Plan Review, or Full Network quarterly audit. Filter by clinic, date range, and provider. Each type pre-configures the sampling strategy.',
    2:'Sample: MedicalGuard uses risk-weighted sampling \u2014 flagged consultations are over-represented, with a statistically valid control set included. For a 30-consultation Item 36 sample: typically 22 flagged records + 8 control records. All sampling parameters documented in the audit record for evidence purposes.',
    3:'Review: Currently active. Reviewer assesses each consultation against the specific MBS criteria \u2014 duration, item descriptor, co-claim rules, appointment type, and clinical context cues from Pracsoft metadata. Mark each: Compliant / Clarification Required / Non-Compliant. Notes recorded against each decision and retained in the tamper-evident audit log.',
    4:'Remediate: All findings auto-routed to the relevant provider via in-platform notification. Clinician receives a structured request for clinical justification. Response tracked. Corrective actions assigned (rebilling, booking-type fix, training). Repeat-offence tracking begins automatically.',
    5:'Sign-off: Practice principal or medical director reviews consolidated findings. Board/audit committee report auto-generated: total consultations reviewed, findings breakdown, provider responses, corrective actions, trend vs prior cycles. PDF export, version-controlled. Stored in tamper-evident audit ledger with 7-year retention.'
  };
  var det=document.getElementById('wf-det');
  det.classList.add('on');
  document.getElementById('wf-det-title').textContent='Step '+n+' \u2014 '+['','Scope','Sample','Review','Remediate','Sign-off'][n];
  document.getElementById('wf-det-desc').textContent=details[n];
  document.querySelectorAll('.wf-c').forEach(function(c,i){
    c.classList.remove('done','active');
    if(i<n-1)c.classList.add('done');
    else if(i===n-1)c.classList.add('active');
  });
}

// Close modals on overlay click
document.querySelectorAll('.mo').forEach(function(o){
  o.addEventListener('click',function(e){if(e.target===o)o.classList.remove('open')});
});

// Animate progress bars on load
setTimeout(function(){
  document.querySelectorAll('.pf').forEach(function(el){
    var w=el.style.width;el.style.width='0';
    setTimeout(function(){el.style.width=w},150);
  });
},400);
// ── Billing Optimiser AI Chat ──────────────────────────────────────────────
