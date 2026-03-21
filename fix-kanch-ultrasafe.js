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

// Convert classes to standard responsive ones
kanch = kanch.replace(/<div class="section-header"[^>]*>/g, '<div class="section-header overview-header">');
kanch = kanch.replace(/<div class="overview-grid"[^>]*>/g, '<div class="overview-grid">');
kanch = kanch.replace(/<div class="overview-table"[^>]*>/g, '<div class="overview-table-card">');
kanch = kanch.replace(/<button id="overviewReadMore"[^>]*>/g, '<button id="overviewReadMore" class="btn-read-more">');

// Strip styles from structural elements only
kanch = kanch.replace(/<p style="[^"]*">/g, '<p>');
kanch = kanch.replace(/<h3 style="[^"]*">Trip Facts<\/h3>/g, '<h3>Trip Facts</h3>');
kanch = kanch.replace(/<table style="[^"]*">/g, '<table class="trip-facts-table">');
kanch = kanch.replace(/<tr style="[^"]*">/g, '<tr>');
kanch = kanch.replace(/<td style="[^"]*">/g, '<td>');

// Convert section tags correctly for the bg-white section
kanch = kanch.replace(/<section class="section" style="background:#fff;">/g, '<section class="section bg-white">');

// Fix Unicode characters directly
kanch = kanch.replace(/\uFFFDs /g, "'s ");
kanch = kanch.replace(/\uFFFD /g, " - ");
kanch = kanch.replace(/ \uFFFD/g, " - ");
kanch = kanch.replace(/\uFFFD/g, "-");

fs.writeFileSync('kanchenjunga-base-camp-trek.html', kanch);
console.log('Done!');
