// ============================================================================
// AUDIT WIZARD — 5-step internal-audit workflow on the Internal Audit panel.
//   Steps: Scope → Sample → Review → Remediate → Sign-off
// ============================================================================

var auditState={step:1,verdicts:{},remediations:{}};
function goAuditStep(n){auditState.step=n;for(var i=1;i<=5;i++){var tab=document.getElementById('atab-'+i);if(!tab)continue;tab.classList.remove('on','done');if(i===n)tab.classList.add('on');else if(i<n)tab.classList.add('done');}for(var i=1;i<=5;i++){var sc=document.getElementById('audit-step-'+i);if(sc)sc.style.display=(i===n)?'':'none';}var p=document.getElementById('panel-audit');if(p)p.scrollIntoView({behavior:'smooth',block:'start'});}
function selectAuditType(el){document.querySelectorAll('[id^="atype-"]').forEach(function(c){c.style.border='1px solid #dde2ea';});el.style.border='2px solid #0d7a6c';}
function startNewAudit(){auditState={step:1,verdicts:{},remediations:{}};var cb=document.getElementById('audit-complete-block');if(cb)cb.style.display='none';var s4=document.getElementById('audit-step4-next');if(s4)s4.style.display='none';var s3=document.getElementById('audit-step3-next');if(s3)s3.style.display='none';updateAuditProgress();for(var i=0;i<6;i++){var v=document.getElementById('aclaim-'+i+'-verdict');if(v)v.innerHTML='<span class="bdg">Pending</span>';var row=document.getElementById('aclaim-'+i);if(row){var ob=row.querySelector('.verdict-btns');if(ob)ob.remove();row.style.cursor='pointer';(function(idx){row.onclick=function(){reviewClaim(idx);};})(i);}};[1,2,3].forEach(function(n){var done=document.getElementById('rem'+n+'-done');if(done)done.style.display='none';['rebill','justify','education','monitor','review'].forEach(function(a){var btn=document.getElementById('rem'+n+'-'+a);if(btn){btn.style.background='';btn.style.borderColor='';btn.style.color='';}});});var sb=document.getElementById('signoff-btn');if(sb){sb.disabled=false;sb.textContent='✓ Sign & Complete Audit';sb.style.background='';}goAuditStep(1);}
function reviewClaim(idx){
  var row=document.getElementById('aclaim-'+idx);
  if(!row)return;
  var ex=row.querySelector('.verdict-btns');
  if(ex)ex.remove();
  var btns=document.createElement('div');
  btns.className='verdict-btns';
  var mkBtn=function(verdict,icon){
    var b=document.createElement('button');
    b.className='verdict-btn';
    b.textContent=icon;
    b.onclick=function(){setVerdict(idx,verdict,btns);};
    return b;
  };
  btns.appendChild(mkBtn('compliant','✓ Compliant'));
  btns.appendChild(mkBtn('finding','⚠ Finding'));
  btns.appendChild(mkBtn('watch','▲ Watch'));
  var bodyEl=row.querySelector('.cr-b');
  if(bodyEl)bodyEl.appendChild(btns);
  row.style.cursor='default';
  row.onclick=null;
}
function setVerdict(idx,verdict,btnsEl){auditState.verdicts[idx]=verdict;if(btnsEl){btnsEl.querySelectorAll('.verdict-btn').forEach(function(b){b.classList.remove('selected-compliant','selected-finding','selected-watch');});var map={compliant:'selected-compliant',finding:'selected-finding',watch:'selected-watch'};var i=verdict==='compliant'?0:verdict==='finding'?1:2;var bt=btnsEl.querySelectorAll('.verdict-btn');if(bt[i])bt[i].classList.add(map[verdict]);}var badges={compliant:'<span class="bdg bg">Compliant</span>',finding:'<span class="bdg br">Finding</span>',watch:'<span class="bdg ba">Watch</span>'};var v=document.getElementById('aclaim-'+idx+'-verdict');if(v)v.innerHTML=badges[verdict]||'';updateAuditProgress();}
function updateAuditProgress(){var total=6,done=Object.keys(auditState.verdicts).length,pct=Math.round(done/total*100);var bar=document.getElementById('audit-progress-bar');if(bar)bar.style.width=pct+'%';var txt=document.getElementById('audit-progress-text');if(txt)txt.textContent=done+' of '+total+' reviewed';var pe=document.getElementById('audit-progress-pct');if(pe)pe.textContent=pct+'%';if(done===total){var n=document.getElementById('audit-step3-next');if(n)n.style.display='';}}
function setRemediation(num,action){auditState.remediations[num]=action;var done=document.getElementById('rem'+num+'-done');if(done)done.style.display='block';['rebill','justify','education','monitor','review'].forEach(function(a){var btn=document.getElementById('rem'+num+'-'+a);if(!btn)return;if(a===action){btn.style.background='#f0fdf4';btn.style.borderColor='#22c55e';btn.style.color='#166534';}else{btn.style.background='';btn.style.borderColor='';btn.style.color='';}});if(Object.keys(auditState.remediations).length>=3){var n=document.getElementById('audit-step4-next');if(n)n.style.display='';}}
function completeAudit(){var name=document.getElementById('signoff-name').value||'Dr Sarah Chen';var date=document.getElementById('signoff-date').value||'2026-05-22';document.getElementById('signoff-name-display').textContent=name;document.getElementById('signoff-date-display').textContent=date;document.getElementById('audit-complete-block').style.display='';var sb=document.getElementById('signoff-btn');sb.disabled=true;sb.textContent='✓ Signed';sb.style.background='#22c55e';var t5=document.getElementById('atab-5');if(t5){t5.classList.remove('on');t5.classList.add('done');}}
function viewAuditPack(){show('auditpack');setTimeout(function(){openAuditPackModal('patel_q2');},200);}

// AUDIT PACK MODAL DATA
