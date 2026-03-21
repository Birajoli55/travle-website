/**
 * Batch fixer – applies the responsive CSS from gokyo-lakes.html to all trek pages
 * that still have the old inline-style overview grid.
 *
 * Run:  node batch-fix-treks.js
 */
const fs = require('fs');
const path = require('path');

// ---- Source of truth for CSS ----
const gokyo = fs.readFileSync('gokyo-lakes.html', 'utf8');
const styleStart = gokyo.indexOf('<style>');
const styleEnd   = gokyo.indexOf('</style>') + 8;
const bestCSS    = gokyo.substring(styleStart, styleEnd);

// ---- Pages to process ----
// Pages that already use overview-table-card but might still have old inline styles
// or encoding problems.
const targets = [
  'upper-dolpa-expedition.html',
];

targets.forEach(filename => {
  const filepath = path.join(__dirname, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`SKIP (not found): ${filename}`);
    return;
  }

  let html = fs.readFileSync(filepath, 'utf8');

  // 1. Replace <style> block
  const kStart = html.indexOf('<style>');
  const kEnd   = html.indexOf('</style>') + 8;
  if (kStart !== -1 && kEnd !== -1) {
    html = html.substring(0, kStart) + bestCSS + html.substring(kEnd);
  }

  // 2. Normalise class names
  html = html.replace(/<div class="section-header"[^>]*>/g,  '<div class="section-header overview-header">');
  html = html.replace(/<div class="overview-grid"[^>]*>/g,   '<div class="overview-grid">');
  html = html.replace(/<div class="overview-table"[^>]*>/g,  '<div class="overview-table-card">');
  html = html.replace(/<button id="overviewReadMore"[^>]*>/g, '<button id="overviewReadMore" class="btn-read-more">');

  // 3. Strip inline styles from structural elements
  html = html.replace(/<p style="[^"]*">/g,                  '<p>');
  html = html.replace(/<h3 style="[^"]*">Trip Facts<\/h3>/g, '<h3>Trip Facts</h3>');
  html = html.replace(/<table style="[^"]*">/g,              '<table class="trip-facts-table">');
  html = html.replace(/<tr style="[^"]*">/g,                 '<tr>');
  html = html.replace(/<td style="[^"]*">/g,                 '<td>');

  // 4. Convert bg-white sections
  html = html.replace(/<section class="section" style="background:#fff;">/g, '<section class="section bg-white">');

  // 5. Fix Windows-1252 / encoding replacement characters (U+FFFD)
  html = html.replace(/\uFFFDs /g,  "'s ");
  html = html.replace(/\uFFFDs</g,  "'s<");
  html = html.replace(/\uFFFDll /g, "'ll ");
  html = html.replace(/\uFFFD /g,   " - ");
  html = html.replace(/ \uFFFD/g,   " - ");
  html = html.replace(/\uFFFD/g,    "-");

  fs.writeFileSync(filepath, html);
  console.log(`DONE: ${filename}`);
});

console.log('\nAll targets processed.');
