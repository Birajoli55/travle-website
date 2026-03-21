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

// Ensure the section classes are simplified correctly
kanch = kanch.replace(/<div class="section-header" style="text-align:left; max-width: 860px; margin-left:0;">/g, '<div class="section-header overview-header">');
kanch = kanch.replace(/<div class="overview-grid" style="display:grid; grid-template-columns: 3fr 2fr; gap: 50px; align-items:start;">/g, '<div class="overview-grid">');

// Simple multi-line replacements
const oldTableBlock = `<div class="overview-table"\r
          style="background:#f8f9fa;padding:30px;border-radius:15px;border-left:5px solid var(--pkg-green);">`;
const newTableBlock = `<div class="overview-table-card">`;
kanch = kanch.split(oldTableBlock).join(newTableBlock);

const oldTableBlockLF = `<div class="overview-table"\n          style="background:#f8f9fa;padding:30px;border-radius:15px;border-left:5px solid var(--pkg-green);">`;
kanch = kanch.split(oldTableBlockLF).join(newTableBlock);

const oldButton = `<button id="overviewReadMore" class="btn-read-more"\r
            style="background:transparent;border:none;color:var(--pkg-green);font-weight:700;cursor:pointer;padding:0;font-size:1rem;margin-top:10px;display:flex;align-items:center;gap:8px;">`;
const newButton = `<button id="overviewReadMore" class="btn-read-more">`;
kanch = kanch.split(oldButton).join(newButton);

const oldButtonLF = `<button id="overviewReadMore" class="btn-read-more"\n            style="background:transparent;border:none;color:var(--pkg-green);font-weight:700;cursor:pointer;padding:0;font-size:1rem;margin-top:10px;display:flex;align-items:center;gap:8px;">`;
kanch = kanch.split(oldButtonLF).join(newButton);

// Strip inline styles from standard tags
kanch = kanch.replace(/ style="font-size: 1\\.1rem; line-height: 1\\.85; color: #444; margin-bottom: 20px;"/g, '');
kanch = kanch.replace(/ style="font-size: 1\\.1rem; line-height: 1\\.85; color: #444;"/g, '');
kanch = kanch.replace(/ style="margin-bottom: 20px; font-size: 1\\.5rem;"/g, '');
kanch = kanch.replace(/ style="width: 100%; border-collapse: collapse;"/g, '');
kanch = kanch.replace(/ style="border-bottom:1px solid #ddd;"/g, '');
kanch = kanch.replace(/ style="padding:10px 0; color:#666;"/g, '');
kanch = kanch.replace(/ style="padding:10px 0; text-align:right; font-weight:600;"/g, '');
kanch = kanch.replace(/ style="background:#fff;"/g, '');
kanch = kanch.replace(/<table[^>]*>/g, function(match){
    if(match.indexOf('class="trip-facts-table"') === -1) {
        return '<table class="trip-facts-table">';
    }
    return match;
});

// Convert section tags correctly for the bg-white section
kanch = kanch.replace(/<section class="section" >/g, '<section class="section bg-white">');

fs.writeFileSync('kanchenjunga-base-camp-trek.html', kanch);
console.log('Done!');
