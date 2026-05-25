// ============================================================================
// GUIDED TOUR — drives TOUR_STEPS, spotlights the target element.
// ============================================================================

var tourStep=0;
function startTour(){tourStep=0;document.getElementById('tour-overlay').classList.add('active');renderTourStep();}
function endTour(){document.getElementById('tour-overlay').classList.remove('active');}
function tourNext(){if(tourStep<TOUR_STEPS.length-1){tourStep++;renderTourStep();}else{endTour();}}
function renderTourStep(){var step=TOUR_STEPS[tourStep];show(step.panel);document.getElementById('tour-title').textContent=step.title;document.getElementById('tour-body').textContent=step.body;document.getElementById('tour-steps').textContent=(tourStep+1)+' of '+TOUR_STEPS.length;document.getElementById('tour-next-btn').textContent=tourStep===TOUR_STEPS.length-1?'Finish ✓':'Next →';setTimeout(function(){var target=document.querySelector(step.el),bubble=document.getElementById('tour-bubble'),spotlight=document.getElementById('tour-spotlight');if(target){var r=target.getBoundingClientRect();spotlight.style.left=(r.left-6)+'px';spotlight.style.top=(r.top-6)+'px';spotlight.style.width=(r.width+12)+'px';spotlight.style.height=(r.height+12)+'px';var bTop=r.bottom+14;if(bTop+220>window.innerHeight)bTop=r.top-230;bubble.style.top=Math.max(10,bTop)+'px';bubble.style.left=Math.min(r.left,window.innerWidth-320)+'px';}},120);}
function showHelp(id){show(id||'help');}
