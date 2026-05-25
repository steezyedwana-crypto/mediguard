// ============================================================================
// HELP DRAWER + FAQ — right-side help panel + accordion toggle.
// Hooks ESC key (also closes the guided tour if running).
// ============================================================================

function openHelpDrawer(panelId){var c=HELP_CONTENT[panelId];if(!c)return;document.getElementById('hd-title').textContent=c.title;document.getElementById('hd-sub').textContent=c.sub;document.getElementById('hd-body').innerHTML=c.html;document.getElementById('help-drawer').classList.add('open');document.getElementById('hd-backdrop').style.display='block';}
function closeHelpDrawer(){document.getElementById('help-drawer').classList.remove('open');document.getElementById('hd-backdrop').style.display='none';}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeHelpDrawer();if(typeof endTour==='function')endTour();}});
function toggleFaq(el){var ans=el.nextElementSibling,chev=el.querySelector('.faq-chevron'),isOpen=ans.classList.contains('open');document.querySelectorAll('.faq-a.open').forEach(function(a){a.classList.remove('open');});document.querySelectorAll('.faq-chevron.open').forEach(function(c){c.classList.remove('open');});if(!isOpen){ans.classList.add('open');chev.classList.add('open');}}
