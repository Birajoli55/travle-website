const fs = require('fs');

let gokyo = fs.readFileSync('gokyo-lakes.html', 'utf8');

gokyo = gokyo.replace('<div class="overview-grid"\\r\\n                style="display: grid; grid-template-columns: 3fr 2fr; gap: 50px; align-items: start;">', '<div class="overview-grid">');
gokyo = gokyo.replace('<div class="overview-table"\\r\\n                    style="background: #f8f9fa; padding: 30px; border-radius: 15px; border-left: 5px solid var(--pkg-green);">', '<div class="overview-table-card">');

fs.writeFileSync('gokyo-lakes.html', gokyo);
console.log('done');
