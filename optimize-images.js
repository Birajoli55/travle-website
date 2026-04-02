const fs = require('fs');
const path = require('path');

const root = __dirname;

function optimizeSrc(src) {
    if (!src) return src;
    const trimmed = src.trim();
    if (/^(https?:|\/\/|data:|#)/i.test(trimmed) || trimmed.startsWith('mailto:')) return trimmed;
    if (!/\.(png|jpe?g|webp|gif)$/i.test(trimmed)) return trimmed;

    const clean = trimmed.replace(/^\.\//, '').replace(/^\//, '');
    const encoded = encodeURIComponent(clean);
    return `https://images.weserv.nl/?url=besttreksnepal.com/${encoded}&w=1200&fit=inside&output=webp&q=80`;
}

function transformSrcset(srcset) {
    if (!srcset) return srcset;
    return srcset.split(',').map(item => {
        const parts = item.trim().split(/\s+/);
        const url = parts[0];
        const descriptor = parts.slice(1).join(' ');
        const optimized = optimizeSrc(url);
        return descriptor ? `${optimized} ${descriptor}` : optimized;
    }).join(', ');
}

const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
    const filePath = path.join(root, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // src attributes
    html = html.replace(/src\s*=\s*"([^"]+)"/gi, (full, src) => {
        const newSrc = optimizeSrc(src);
        // keep existing src unchanged if non-image
        if (newSrc === src) return full;
        return `src="${newSrc}"`;
    });

    // srcset attributes
    html = html.replace(/srcset\s*=\s*"([^"]+)"/gi, (full, ss) => {
        return `srcset="${transformSrcset(ss)}"`;
    });

    // ensure lazy loading for all <img> tags
    html = html.replace(/<img([^>]*?)>/gi, (full, attrs) => {
        if (/\bloading\s*=\s*"(lazy|eager|auto)"/i.test(attrs)) return full;
        const hasClosing = full.endsWith('/>');
        return `<img${attrs} loading="lazy" decoding="async">`;
    });

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`optimized images in ${file}`);
}
