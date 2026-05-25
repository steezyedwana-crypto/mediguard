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
function swTab(el,paneId){
  var modal=el.closest('.md');
  modal.querySelectorAll('.mt').forEach(t=>t.classList.remove('on'));
  modal.querySelectorAll('.mp').forEach(p=>p.classList.remove('on'));
  el.classList.add('on');
  document.getElementById(paneId).classList.add('on');
}

function consultReview(){document.getElementById('consult-modal').classList.add('open')}
