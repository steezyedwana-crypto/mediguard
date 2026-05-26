// ============================================================================
// PROVIDER DRILLDOWN MODAL — opened when any provider row or heatmap row
// is clicked. Populates four tabs (Overview, Item Analysis, Consultations,
// Risk Assessment) from the PD data object.
// Also exposes swTab() (modal tab switcher) and consultReview() (deep-link
// from a flagged consultation into the consultation modal).
// ============================================================================

function provDrill(id){
  var d=PD[id];
  if(!d)return;
  window.currentProviderId=id;          // remembered for Generate Justification / Download Profile
  document.getElementById('pm-name').textContent=d.name;
  document.getElementById('pm-sub').textContent=d.sub;
  document.getElementById('pm-claims').textContent=d.claims;
  document.getElementById('pm-clinic').textContent=d.clinic;
  document.getElementById('pm-risk-v').textContent=d.risk;
  document.getElementById('pm-risk-v').style.color=d.riskColor;
  document.getElementById('pm-top-item').textContent=d.topItem;
  document.getElementById('pm-score').textContent=d.score;
  document.getElementById('pm-score-sub').textContent=d.scoreSub;
  document.getElementById('pm-ai').textContent=d.ai;

  // Bars
  var bHtml='';
  d.bars.forEach(function(b){
    bHtml+='<div class="pb-w"><div class="pb-l"><span>'+b[0]+'</span><span>'+b[1]+'</span></div><div class="pb"><div class="pf '+b[3]+'" style="width:'+b[2]+'"></div></div></div>';
  });
  document.getElementById('pm-bars').innerHTML=bHtml;

  // Items table
  var iHtml='';
  d.items.forEach(function(it){
    iHtml+='<tr><td class="dmo">'+it[0]+'</td><td>'+it[1]+'</td><td>'+it[2]+'</td><td>'+it[3]+'</td><td>'+it[4]+'</td><td>'+it[5]+'</td><td><span class="bdg '+it[6]+'">'+it[5].replace(/<[^>]+>/g,'').substring(0,10)+'</span></td></tr>';
  });
  document.getElementById('pm-items-body').innerHTML=iHtml;

  // Consults
  var cHtml='';
  d.consults.forEach(function(c){
    var clickable=c[7]?'onclick="consultReview()" style="cursor:pointer"':'';
    cHtml+='<div class="cr-row" '+clickable+'><div class="cr-dt">'+c[0]+'</div><div class="cr-it" style="color:var(--'+c[2].replace('pc','cyan2').replace('pg','green2').replace('pa','amber').replace('pr','red')+')" >'+c[1]+'</div><div class="cr-b"><div class="cr-title">'+c[3]+'</div><div class="cr-desc">'+c[4]+'</div></div><div><span class="bdg '+c[5]+'">'+c[6]+'</span></div></div>';
  });
  document.getElementById('pm-consults-list').innerHTML=cHtml;

  // Risk bars
  var rbHtml='';
  d.riskBars.forEach(function(rb){
    rbHtml+='<div class="pb-w"><div class="pb-l"><span>'+rb[0]+'</span><span style="color:var(--'+(rb[2]==='pr'?'red':rb[2]==='pa'?'amber':'green2')+')">'+rb[3]+'</span></div><div class="pb"><div class="pf '+rb[2]+'" style="width:'+rb[1]+'"></div></div></div>';
  });
  document.getElementById('pm-risk-bars').innerHTML=rbHtml;

  // Actions
  document.getElementById('pm-actions').innerHTML=d.actions.join('');

  // Reset tabs
  document.querySelectorAll('#prov-modal .mt').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('#prov-modal .mp').forEach(p=>p.classList.remove('on'));
  document.querySelector('#prov-modal .mt').classList.add('on');
  document.getElementById('pm-ov').classList.add('on');
  document.getElementById('prov-modal').classList.add('open');
}

// closeMo() now provided by nav.js

// ── Continue an active audit cycle (from the Audit Centre summary table) ───
// Jumps to the Audit panel, ensures the wizard is showing the right step.
// The demo's wizard is a single Dr Patel · Item 36 scenario, so every
// "Continue" navigates there at step 3 (Review). When wired to a real
// backend this would load the cycle by id first.
function continueAudit(cycleId){
  show('audit');
  setTimeout(function(){
    if(typeof goAuditStep==='function'){goAuditStep(3);}
    var top=document.getElementById('panel-audit');
    if(top){window.scrollTo({top:top.offsetTop-20,behavior:'smooth'});}
  },80);
}
function swTab(el,paneId){
  var modal=el.closest('.md');
  modal.querySelectorAll('.mt').forEach(t=>t.classList.remove('on'));
  modal.querySelectorAll('.mp').forEach(p=>p.classList.remove('on'));
  el.classList.add('on');
  document.getElementById(paneId).classList.add('on');
}

function consultReview(){document.getElementById('consult-modal').classList.add('open')}

// ── Allied Billing Alert → "Flag for GP Review" inline confirmation ─────────
// Replaces the alert card's button row with a confirmation chip and routes
// the case into the Inbox queue (simulated). Accepts the button itself OR
// null when called from the TCA Pracsoft modal.
function flagTcaForReview(btn){
  var row = btn && btn.closest ? btn.closest('.btn-row') : document.querySelector('.btn-row [onclick*="flagTcaForReview"]');
  var container = row || document.querySelector('.btn-row button[onclick*="flagTcaForReview"]');
  if (container && container.closest) container = container.closest('.btn-row');
  if (!container) return;
  container.innerHTML = '<div style="display:flex;align-items:center;gap:.5rem;font-size:.72rem;color:#166534;font-weight:600">'
    + '<span style="display:inline-flex;width:18px;height:18px;border-radius:50%;background:#22c55e;color:#fff;align-items:center;justify-content:center;font-size:.7rem">&#10003;</span>'
    + 'Flagged — routed to Dr Patel for GP review · SLA 5 business days'
    + '</div>';
}

// ── Provider-modal actions wired to per-provider audit packs ────────────────
// Generate Justification Pack and Download PDF Profile look up
//   AUDIT_PACKS['justification_<providerId>']  /  AUDIT_PACKS['profile_<providerId>']
// Falls back to Dr Patel's pack as a representative sample if a provider
// doesn't yet have its own pack generated (covers the long tail of the
// network without authoring 24 individual packs).
function openPackForProvider(kind){
  var id=window.currentProviderId||'patel';
  var key=kind+'_'+id;
  if(typeof AUDIT_PACKS==='undefined'||!AUDIT_PACKS[key]){
    key=kind+'_patel';                 // safe fallback for demo coverage
  }
  closeMo('prov-modal');
  setTimeout(function(){openAuditPackModal(key);},120);
}
