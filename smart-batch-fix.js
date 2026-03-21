const fs = require('fs');
const path = require('path');

// --- Reference CSS (Gokyo) ---
const gokyo = fs.readFileSync('gokyo-lakes.html', 'utf8');
const styleStartStr = '<style>';
const styleEndStr = '</style>';
const sStart = gokyo.indexOf(styleStartStr);
const sEnd = gokyo.indexOf(styleEndStr) + styleEndStr.length;
const referenceStyle = gokyo.substring(sStart, sEnd);

const heroBgRegex = /\.pkg-hero-bg\s*{\s*[^}]*background-image:\s*url\(['"]?([^'")]*)['"]?\)/;
const ctaBgRegex = /\.cta-bg\s*{\s*[^}]*background-image:\s*url\(['"]?([^'")]*)['"]?\)/;

const targets = [
  'abc-trek.html',
  'annapurna-circuit.html',
  'annapurna-region.html',
  'dolpa-region.html',
  'everest-base-camp.html',
  'everest-region.html',
  'ghorepani-poon-hill.html',
  'kanchenjunga-circuit-trek.html',
  'kanchenjunga-region.html',
  'langtang-region.html',
  'langtang-valley.html',
  'lower-mustang-jomsom.html',
  'makalu-base-camp-trek.html',
  'makalu-region.html',
  'manaslu-circuit.html',
  'manaslu-region.html',
  'mustang-region.html',
  'north-ridge-trek.html',
  'tamang-heritage-trail.html',
  'tsum-valley-trek.html',
  'upper-mustang-trek.html'
];

targets.forEach(filename => {
  const filepath = path.join(__dirname, filename);
  if (!fs.existsSync(filepath)) return;

  let html = fs.readFileSync(filepath, 'utf8');

  // 1. Extract original background images
  let originalHeroBg = 'hero.png';
  let originalCtaBg = 'cta.png';
  const heroMatch = html.match(heroBgRegex);
  if (heroMatch) originalHeroBg = heroMatch[1];
  const ctaMatch = html.match(ctaBgRegex);
  if (ctaMatch) originalCtaBg = ctaMatch[1];

  // 2. Replace style block
  const kStart = html.indexOf(styleStartStr);
  const kEnd = html.indexOf(styleEndStr) + styleEndStr.length;
  if (kStart !== -1 && kEnd !== -1) {
    let newStyle = referenceStyle;
    newStyle = newStyle.replace(/background-image:\s*url\(['"]hero\.png['"]\)/g, `background-image: url('${originalHeroBg}')`);
    newStyle = newStyle.replace(/background-image:\s*url\(['"]cta\.png['"]\)/g, `background-image: url('${originalCtaBg}')`);
    html = html.substring(0, kStart) + newStyle + html.substring(kEnd);
  }

  // 3. Merge classes if style is being replaced
  // Case 1: element has both class and style
  html = html.replace(/<div class="([^"]*)"[^>]*style="display:\s*grid;\s*grid-template-columns:\s*1fr\s*1fr;[^"]*"/g, '<div class="$1 overview-grid"');
  html = html.replace(/<div class="([^"]*)"[^>]*style="display:\s*grid;\s*grid-template-columns:\s*repeat\(auto-fit,[^"]*"/g, '<div class="$1 treks-grid"');
  
  // Case 2: element has only style
  html = html.replace(/<div style="display:\s*grid;\s*grid-template-columns:\s*1fr\s*1fr;[^"]*"/g, '<div class="overview-grid"');
  html = html.replace(/<div style="display:\s*grid;\s*grid-template-columns:\s*repeat\(auto-fit,[^"]*"/g, '<div class="treks-grid"');

  // 4. Normalize structural classes
  html = html.replace(/<div class="section-header"[^>]*>/g, '<div class="section-header overview-header">');
  html = html.replace(/<div class="overview-grid"[^>|class]*>/g, '<div class="overview-grid">'); // Be careful not to replace already classed ones
  html = html.replace(/<div class="overview-table"[^>]*>/g, '<div class="overview-table-card">');
  html = html.replace(/<button id="overviewReadMore"[^>]*>/g, '<button id="overviewReadMore" class="btn-read-more">');

  // Clean double classes from previous failed run
  html = html.replace(/class="([^"]*)"\s+class="([^"]*)"/g, 'class="$1 $2"');

  // 5. Clean structural inline styles
  html = html.replace(/<p style="[^"]*">/g, '<p>');
  html = html.replace(/<h3 style="[^"]*">Trip Facts<\/h3>/g, '<h3>Trip Facts</h3>');
  html = html.replace(/<table style="[^"]*">/g, '<table class="trip-facts-table">');
  html = html.replace(/<tr style="[^"]*">/g, '<tr>');
  html = html.replace(/<td style="[^"]*">/g, '<td>');

  // 6. Fix background white sections
  html = html.replace(/<section class="section" style="background:#fff;">/g, '<section class="section bg-white">');
  html = html.replace(/<section class="section" style="background:\s*#f1f5f3;">/g, '<section class="section bg-light">');

  // 7. Fix common encoding junk
  html = html.replace(/\uFFFDs /g, "'s ");
  html = html.replace(/\uFFFDs</g, "'s<");
  html = html.replace(/\uFFFDll /g, "'ll ");
  html = html.replace(/\uFFFD /g, " - ");
  html = html.replace(/ \uFFFD/g, " - ");
  html = html.replace(/\uFFFD/g, "-");

  fs.writeFileSync(filepath, html);
  console.log(`FIXED: ${filename}`);
});
