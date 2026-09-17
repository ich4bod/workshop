const escapeHtml = (value) => String(value || 'Not recorded').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);

const statusFor = (items) => new Set(items.map((item) => item.claim || '')).size === 1 ? 'Agreement' : 'Conflicting readings';

export const renderComparisonReport = (annotations, exportedAt = new Date().toISOString()) => {
  const groups = new Map();
  for (const item of annotations) groups.set(item.record, [...(groups.get(item.record) || []), item]);
  const sections = [...groups].map(([record, items]) => {
    const status = statusFor(items);
    const rows = items.map((item) => `<tr><td>${escapeHtml(item.claim)}</td><td>${escapeHtml(item.source)}</td><td>${escapeHtml(item.confidence)}</td><td>${escapeHtml(item.observed)}</td><td>${escapeHtml(item.note)}</td></tr>`).join('');
    return `<section><h2>${escapeHtml(record)}</h2><p class="status"><strong>Comparison status:</strong> ${status}</p><table><thead><tr><th>Claim</th><th>Source</th><th>Confidence</th><th>Evidence date</th><th>Uncertainty / annotation</th></tr></thead><tbody>${rows}</tbody></table></section>`;
  }).join('');
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Evidence comparison report</title><style>body{max-width:72rem;margin:2rem auto;padding:0 1rem;font:16px/1.5 system-ui,sans-serif;color:#20251f;background:#fafaf5}header,section{border:1px solid #b7c0ad;background:#fff;padding:1rem 1.25rem;margin:1rem 0}h1,h2{line-height:1.2}table{border-collapse:collapse;width:100%;min-width:44rem}th,td{border:1px solid #b7c0ad;padding:.6rem;text-align:left;vertical-align:top}.status{color:#3d522f}@media print{body{max-width:none;margin:0}section{break-inside:avoid}}</style></head>
<body><main><header><p>LOCAL INSTRUMENTS / PORTABLE REPORT</p><h1>Evidence comparison report</h1><p>Exported ${escapeHtml(exportedAt)}. This report preserves conflicting readings; it does not rank them.</p></header>${sections}</main></body></html>
`;
};
