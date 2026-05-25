// ============================================================================
// NAV — clock, panel switching, generic modal helpers, dashboard date range.
// Loaded after data files and before feature modules.
// ============================================================================

// ── Clock (Sydney time, shown in top bar) ─────────────────────────────────
function tick(){document.getElementById('clk').textContent=new Date().toLocaleTimeString('en-AU',{hour:'2-digit',minute:'2-digit',timeZone:'Australia/Sydney'})+' AEST'}
tick();setInterval(tick,1000);


// DATE RANGE SELECTOR

// ── Date range dropdown on the Dashboard ──────────────────────────────────
function setDateRange(val){var d=DATE_DATA[val];if(!d)return;['claims','score','risk','findings'].forEach(function(k){var el=document.getElementById('kpi-'+k);if(el)el.innerHTML=d[k];var s=document.getElementById('kpi-'+k+'-sub');if(s)s.innerHTML=d[k+'Sub'];var t=document.getElementById('kpi-'+k+'-tag');if(t)t.innerHTML=d[k+'Tag'];});}

// AUDIT WIZARD

// ── Panel switching (sidebar + top tabs) ──────────────────────────────────
function show(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.si,.ntab').forEach(i=>i.classList.remove('on'));
  var el=document.getElementById('panel-'+id);
  if(el)el.classList.add('on');
  document.querySelectorAll('.si,.ntab').forEach(function(item){
    var fn=item.getAttribute('onclick')||'';
    if(fn.indexOf("'"+id+"'")>-1)item.classList.add('on');
  });
  window.scrollTo(0,0);
}

// ── Provider data ──

// ── Generic modal helpers (used by all *modal divs) ───────────────────────
function openMo(id){ var el=document.getElementById(id); if(el) el.classList.add("open"); }
function closeMo(id){ var el=document.getElementById(id); if(el) el.classList.remove("open"); }

// ── Floating chat button → jump to Billing Optimiser ──────────────────────
function openGlobalChat(){show('optimise');setTimeout(function(){var p=document.getElementById('panel-optimise');if(p)p.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){var inp=document.getElementById('opt-input');if(inp)inp.focus();},300);},100);}
