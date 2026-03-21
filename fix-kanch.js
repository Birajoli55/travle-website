const fs = require('fs');

const gokyo = fs.readFileSync('gokyo-lakes.html', 'utf8');
const styleStart = gokyo.indexOf('<style>');
const styleEnd = gokyo.indexOf('</style>') + 8;
const bestCSS = gokyo.substring(styleStart, styleEnd);

let kanch = fs.readFileSync('kanchenjunga-base-camp-trek.html', 'utf8');

const kStyleStart = kanch.indexOf('<style>');
const kStyleEnd = kanch.indexOf('</style>') + 8;
if (kStyleStart !== -1 && kStyleEnd !== -1) {
    kanch = kanch.substring(0, kStyleStart) + bestCSS + kanch.substring(kStyleEnd);
}

kanch = kanch.split('<div class="section-header" style="text-align:left; max-width: 860px; margin-left:0;">').join('<div class="section-header overview-header">');
kanch = kanch.split('<div class="overview-grid" style="display:grid; grid-template-columns: 3fr 2fr; gap: 50px; align-items:start;">').join('<div class="overview-grid">');

// We can just use split and join for strings that might have crlf issues by cleaning up newlines first:
function stripStyles(html) {
    return html
        .replace(/style="background:#f8f9fa;padding:30px;border-radius:15px;border-left:5px solid var\\(--pkg-green\\);"/g, '')
        .replace(/<div class="overview-table"\\s*>/g, '<div class="overview-table-card">')
        .replace(/style="font-size: 1\\.1rem; line-height: 1\\.85; color: #444; margin-bottom: 20px;"/g, '')
        .replace(/style="font-size: 1\\.1rem; line-height: 1\\.85; color: #444;"/g, '')
        .replace(/style="margin-bottom: 20px; font-size: 1\\.5rem;"/g, '')
        .replace(/<table style="width: 100%; border-collapse: collapse;">/g, '<table class="trip-facts-table">')
        .replace(/style="border-bottom:1px solid #ddd;"/g, '')
        .replace(/style="padding:10px 0; color:#666;"/g, '')
        .replace(/style="padding:10px 0; text-align:right; font-weight:600;"/g, '')
        .replace(/style="background:transparent;border:none;color:var\\(--pkg-green\\);font-weight:700;cursor:pointer;padding:0;font-size:1rem;margin-top:10px;display:flex;align-items:center;gap:8px;"/g, '')
        .replace(/style="background:#fff;"/g, 'bg-white');
}
kanch = kanch.replace(/<div class="overview-table"\\s+[\\s\\S]*?>/g, '<div class="overview-table-card">');
kanch = stripStyles(kanch);

// Ensure Bg-white replaces section
kanch = kanch.replace(/<section class="section" bg-white>/g, '<section class="section bg-white">');

fs.writeFileSync('kanchenjunga-base-camp-trek.html', kanch);
console.log('Kanchenjunga page adapted successfully.');
