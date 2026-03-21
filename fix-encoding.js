const fs = require('fs');
let kanch = fs.readFileSync('kanchenjunga-base-camp-trek.html', 'utf8');

// The replacement logic for \ufffd (the unknown character)
kanch = kanch.replace(/\\ufffds/g, "'s");
kanch = kanch.replace(/ \\ufffd /g, " - ");
kanch = kanch.replace(/\\ufffd/g, "-");

fs.writeFileSync('kanchenjunga-base-camp-trek.html', kanch);
console.log('Encoding fixed.');
