const fs = require('fs');

const gosain = fs.readFileSync('gosainkunda-lake-trek.html', 'utf8');
const gokyo = fs.readFileSync('gokyo-lakes.html', 'utf8');

// The CSS from gosainkunda
const styleStart = gosain.indexOf('<style>');
const styleEnd = gosain.indexOf('</style>') + 8;
let newCSS = gosain.substring(styleStart, styleEnd);

// Add requested breakpoints to CSS
newCSS = newCSS.replace('/* Responsive Breakpoints */', `/* Responsive Breakpoints */
        @media (max-width: 1440px) {
            .container {
                max-width: 1200px;
                padding: 0 40px;
            }
        }`);
newCSS = newCSS.replace('</style>', `
        @media (max-width: 320px) {
            .pkg-hero h1 {
                font-size: 1.8rem;
            }
            .nav-main-inner {
                padding: 0 10px;
            }
            .fact-item strong {
                font-size: 1rem;
            }
        }
    </style>`);

let updatedGokyo = gokyo;

// 1. Replace entire <style> block
const gokyoStyleStart = updatedGokyo.indexOf('<style>');
const gokyoStyleEnd = updatedGokyo.indexOf('</style>') + 8;
if(gokyoStyleStart !== -1 && gokyoStyleEnd !== -1) {
    updatedGokyo = updatedGokyo.substring(0, gokyoStyleStart) + newCSS + updatedGokyo.substring(gokyoStyleEnd);
}

// 2. Specific replacements to fix overview section classes
updatedGokyo = updatedGokyo.replace('<div class="section-header" style="text-align: left; max-width: 800px; margin-left: 0;">', '<div class="section-header overview-header">');
updatedGokyo = updatedGokyo.replace('<div class="overview-grid"\\r\\n                style="display: grid; grid-template-columns: 3fr 2fr; gap: 50px; align-items: start;">', '<div class="overview-grid">');
updatedGokyo = updatedGokyo.replace('<div class="overview-grid"\\n                style="display: grid; grid-template-columns: 3fr 2fr; gap: 50px; align-items: start;">', '<div class="overview-grid">');
updatedGokyo = updatedGokyo.replace(/<p style="font-size: 1\\.1rem; line-height: 1\\.8; color: #444; margin-bottom: 20px;">/g, '<p>');
updatedGokyo = updatedGokyo.replace('<p style="font-size: 1.1rem; line-height: 1.8; color: #444;">', '<p>');
updatedGokyo = updatedGokyo.replace('<div class="overview-table"\\r\\n                    style="background: #f8f9fa; padding: 30px; border-radius: 15px; border-left: 5px solid var(--pkg-green);">', '<div class="overview-table-card">');
updatedGokyo = updatedGokyo.replace('<div class="overview-table"\\n                    style="background: #f8f9fa; padding: 30px; border-radius: 15px; border-left: 5px solid var(--pkg-green);">', '<div class="overview-table-card">');
updatedGokyo = updatedGokyo.replace('<h3 style="margin-bottom: 20px; font-size: 1.5rem;">Trip Facts</h3>', '<h3>Trip Facts</h3>');
updatedGokyo = updatedGokyo.replace('<table style="width: 100%; border-collapse: collapse;">', '<table class="trip-facts-table">');

// Clean up table row/col styles within Trip Facts
updatedGokyo = updatedGokyo.replace(/<tr style="border-bottom: 1px solid #ddd;">/g, '<tr>');
updatedGokyo = updatedGokyo.replace(/<td style="padding: 10px 0; color: #666;">/g, '<td>');
updatedGokyo = updatedGokyo.replace(/<td style="padding: 10px 0; text-align: right; font-weight: 600;">/g, '<td>');

// Replace <section class="section" style="background: #fff;">
updatedGokyo = updatedGokyo.replace('<section class="section" style="background: #fff;">', '<section class="section bg-white">');

fs.writeFileSync('gokyo-lakes.html', updatedGokyo);
console.log('done');
