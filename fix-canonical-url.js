const fs = require('fs');
const path = require('path');

const root = __dirname;
const domain = 'https://besttreksnepal.com';

const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(root, file);
    let html = fs.readFileSync(filePath, 'utf8');

    const canonicalHref = file === 'index.html' ? `${domain}/` : `${domain}/${file}`;

    const canonicalTag = `<link rel="canonical" href="${canonicalHref}" />`;

    // If canonical already exists, replace it (robust if there is one)
    if (/\<link[^>]*rel=['"]canonical['"][^>]*\>/i.test(html)) {
        html = html.replace(/\<link[^>]*rel=['"]canonical['"][^>]*\>/i, canonicalTag);
    } else {
        // inject after title if exists, otherwise after meta viewport
        if (/\<title>.*<\/title>/i.test(html)) {
            html = html.replace(/(\<title>.*<\/title>)/i, `$1\n    ${canonicalTag}`);
        } else if (/\<meta[^>]*name=['"]viewport['"][^>]*>/i.test(html)) {
            html = html.replace(/(\<meta[^>]*name=['"]viewport['"][^>]*>)/i, `$1\n    ${canonicalTag}`);
        } else {
            // fallback insert after opening head tag
            html = html.replace(/(\<head>)/i, `$1\n    ${canonicalTag}`);
        }
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`updated ${file}`);
});
