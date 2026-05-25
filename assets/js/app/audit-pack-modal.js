// ============================================================================
// AUDIT PACK VIEWER — renders an AUDIT_PACKS entry inside the modal.
// ============================================================================

function openAuditPackModal(packId){var pack=AUDIT_PACKS[packId];if(!pack)return;document.getElementById('apm-title').innerHTML=pack.title;document.getElementById('apm-sub').innerHTML=pack.sub;document.getElementById('apm-body').innerHTML=pack.html;openMo('auditpack-modal');}

// HELP SYSTEM
