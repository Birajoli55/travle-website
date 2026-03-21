const fs = require('fs');

// Read the perfectly styled source
const gokyo = fs.readFileSync('gokyo-lakes.html', 'utf8');
const styleStart = gokyo.indexOf('<style>');
const styleEnd = gokyo.indexOf('</style>') + 8;
const bestCSS = gokyo.substring(styleStart, styleEnd);

// Read the target
let dolpa = fs.readFileSync('lower-dolpa-phoksundo.html', 'utf8');

// Replace styles
const kStyleStart = dolpa.indexOf('<style>');
const kStyleEnd = dolpa.indexOf('</style>') + 8;
if (kStyleStart !== -1 && kStyleEnd !== -1) {
    dolpa = dolpa.substring(0, kStyleStart) + bestCSS + dolpa.substring(kStyleEnd);
}

// Convert classes to standard responsive ones
dolpa = dolpa.replace(/<div class="section-header"[^>]*>/g, '<div class="section-header overview-header">');
dolpa = dolpa.replace(/<div class="overview-grid"[^>]*>/g, '<div class="overview-grid">');
dolpa = dolpa.replace(/<div class="overview-table"[^>]*>/g, '<div class="overview-table-card">');
dolpa = dolpa.replace(/<button id="overviewReadMore"[^>]*>/g, '<button id="overviewReadMore" class="btn-read-more">');

// Strip styles from structural elements only
dolpa = dolpa.replace(/<p style="[^"]*">/g, '<p>');
dolpa = dolpa.replace(/<h3 style="[^"]*">Trip Facts<\/h3>/g, '<h3>Trip Facts</h3>');
dolpa = dolpa.replace(/<table style="[^"]*">/g, '<table class="trip-facts-table">');
dolpa = dolpa.replace(/<tr style="[^"]*">/g, '<tr>');
dolpa = dolpa.replace(/<td style="[^"]*">/g, '<td>');

// Convert section tags correctly for the bg-white section
dolpa = dolpa.replace(/<section class="section" style="background:#fff;">/g, '<section class="section bg-white">');

// Fix Unicode characters directly (the replacement characters)
dolpa = dolpa.replace(/\uFFFDs /g, "'s ");
dolpa = dolpa.replace(/\uFFFDs</g, "'s<");
dolpa = dolpa.replace(/\uFFFDll /g, "'ll ");
dolpa = dolpa.replace(/\uFFFD /g, " - ");
dolpa = dolpa.replace(/ \uFFFD/g, " - ");
dolpa = dolpa.replace(/\uFFFD/g, "-");

fs.writeFileSync('lower-dolpa-phoksundo.html', dolpa);
console.log('Done!');
