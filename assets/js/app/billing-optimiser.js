// ============================================================================
// BILLING OPTIMISER — chat-style interface for IntelliSense Q&A.
//   optMatch()       — keyword → OPT_RESPONSES key (deterministic in demo)
//   optAsk()         — fills the input and submits a suggested question
//   optSend()        — handles user submit + typing indicator + response
//   appendOptMsg()   — renders one chat bubble (user or AI, with markdown)
//
// To wire a real LLM: replace optMatch() with a fetch() to your endpoint
// (pass OPT_CONTEXT as system message and the user question as user message),
// stream the markdown back, and call appendOptMsg("ai", chunk) per delta.
// ============================================================================

function optMatch(q) {
  var lower = q.toLowerCase();
  if (/item.?36|long consult|level c|duration/.test(lower)) return OPT_RESPONSES.item36;
  if (/item.?44|after.?hours|timestamp/.test(lower)) return OPT_RESPONSES.item44;
  if (/singh/.test(lower)) return OPT_RESPONSES.singh;
  if (/total revenue|revenue breakdown|all revenue|how much/.test(lower)) return OPT_RESPONSES.revenue;
  if (/compliance status|overall|risk register|how are we/.test(lower)) return OPT_RESPONSES.compliance;
  if (/audit.pack|evidence|packages|services australia/.test(lower)) return OPT_RESPONSES.auditpack;
  if (/setup|connect|pracsoft|how does|integration/.test(lower)) return OPT_RESPONSES.setup;
  if (/cdm|chronic|721|723|management plan/.test(lower)) return OPT_RESPONSES.cdm;
  if (/bulk.?bill|incentive|10990|75870|75871|concession/.test(lower)) return OPT_RESPONSES.bulkbilling;
  if (/telehealth|phone.?consult|91890|92746|video/.test(lower)) return OPT_RESPONSES.telehealth;
  if (/allied|physio|dietitian|tca|team care|linked|linkage/.test(lower)) return OPT_RESPONSES.allied;
  if (/assessment|701|703|705|707|715|preventive|health check|10004|10006/.test(lower)) return OPT_RESPONSES.assessments;
  if (/mbs|analytic|item volume|item breakdown|all items/.test(lower)) return OPT_RESPONSES.mbs;
  if (/nguyen/.test(lower)) return OPT_RESPONSES.nguyen;
  if (/patel/.test(lower)) return OPT_RESPONSES.patel;
  if (/whittaker/.test(lower)) return OPT_RESPONSES.whittaker;
  if (/khan/.test(lower)) return OPT_RESPONSES.khan;
  if (/mhtp|mental health|2710|2712|2713|psychology|80110|better access/.test(lower)) return OPT_RESPONSES.mhtp;
  if (/dva|veteran|defence/.test(lower)) return OPT_RESPONSES.dva;
  if (/90.?day|action plan|plan|priority|roadmap/.test(lower)) return OPT_RESPONSES.plan;
  if (/total|summary|overview|all|everything|how much|161/.test(lower)) return OPT_RESPONSES.summary;
  // Default: return summary with a framing note
  return `## IntelliSense Response\n\nBased on your Pracsoft data for Southside Health Group, here is what I can see:\n\n` + OPT_RESPONSES.summary;
}

function clearOptChat() {
  document.getElementById('opt-messages').innerHTML = '';
  optMessages = [];
}
function optAsk(question) {
  if (!document.getElementById('panel-optimise').classList.contains('active')) { show('optimise'); }
  clearOptChat();
  document.getElementById('opt-input').value = question;
  setTimeout(function() { document.getElementById('panel-optimise').scrollIntoView({behavior:'smooth', block:'start'}); }, 80);
  setTimeout(optSend, 350);
}

function optSend() {
  var input = document.getElementById('opt-input');
  var question = input.value.trim();
  if (!question) return;

  var btn = document.getElementById('opt-send-btn');
  btn.disabled = true;
  btn.style.opacity = '0.5';
  btn.textContent = '...';

  optMessages.push({role: 'user', content: question});
  appendOptMsg('user', question);
  input.value = '';
  input.style.height = '52px';

  // Typing indicator
  var typingId = 'opt-typing-' + Date.now();
  var msgs = document.getElementById('opt-messages');
  msgs.insertAdjacentHTML('beforeend',
    '<div id="' + typingId + '" class="opt-msg-ai">' +
    '<div class="opt-avt">&#9672;</div>' +
    '<div class="opt-bubble"><div class="opt-typing"><span></span><span></span><span></span></div></div>' +
    '</div>'
  );
  msgs.scrollTop = msgs.scrollHeight;

  // Simulate a realistic response delay (800–1600ms)
  var delay = 800 + Math.random() * 800;
  setTimeout(function() {
    var typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    var response = optMatch(question);
    optMessages.push({role: 'assistant', content: response});
    appendOptMsg('ai', response);
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = 'Send \u2192';
  }, delay);
}

function appendOptMsg(role, text) {
  var msgs = document.getElementById('opt-messages');
  var div = document.createElement('div');

  if (role === 'user') {
    div.className = 'opt-msg-user';
    div.innerHTML = '<div class="opt-bubble">' + escHtml(text) + '</div>';
  } else {
    div.className = 'opt-msg-ai';
    // Format AI response: convert markdown-ish to HTML
    var formatted = text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/`(.*?)`/g,'<span style="font-family:var(--mono);font-size:.7rem;background:rgba(13,122,108,.08);padding:1px 4px;color:#0f9b8a">$1</span>')
      .replace(/### (.*?)(\n|$)/g,'<div style="font-family:var(--cond);font-size:.9rem;font-weight:700;color:#1a2535;margin:.55rem 0 .2rem;text-transform:uppercase;letter-spacing:.03em">$1</div>')
      .replace(/## (.*?)(\n|$)/g,'<div style="font-family:var(--cond);font-size:1rem;font-weight:700;color:#f59e0b;margin:.6rem 0 .25rem;text-transform:uppercase;letter-spacing:.03em">$1</div>')
      .replace(/^- (.*?)(\n|$)/gm,'<div style="display:flex;gap:.5rem;margin:.15rem 0"><span style="color:#f59e0b;flex-shrink:0;margin-top:.1rem">&#8250;</span><span>$1</span></div>')
      .replace(/^\d+\. (.*?)(\n|$)/gm,'<div style="display:flex;gap:.5rem;margin:.15rem 0"><span style="font-family:var(--mono);font-size:.58rem;color:#0f9b8a;flex-shrink:0;margin-top:.18rem;width:14px">&#8226;</span><span>$1</span></div>')
      .replace(/\n\n/g,'<div style="height:.5rem"></div>')
      .replace(/\n/g,'<br>');

    div.innerHTML =
      '<div class="opt-avt">&#9672;</div>' +
      '<div><div style="font-family:var(--mono);font-size:.44rem;color:#f59e0b;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.2rem">IntelliSense &middot; Billing Optimiser</div>' +
      '<div class="opt-bubble">' + formatted + '</div></div>';
  }

  msgs.appendChild(div);
  if (role === 'ai') { setTimeout(function(){ div.scrollIntoView({behavior:'smooth', block:'nearest'}); }, 60); }
  else { msgs.scrollTop = msgs.scrollHeight; }
}

function escHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

// ── Update show() to handle optimise tab colour ─────────────────────────────
var _origShow = show;
show = function(id) {
  _origShow(id);
  // Fix amber tab colour for optimise
  document.querySelectorAll('.ntab').forEach(function(t) {
    var fn = t.getAttribute('onclick') || '';
    if (fn.indexOf("'optimise'") > -1) {
      t.style.color = t.classList.contains('on') ? 'var(--amber2)' : '';
    }
  });
};
