const fs = require('fs');
const path = require('path');

// Convert local image filename to an Unsplash source query string
const keywordForSrc = (src, alt) => {
  if (alt && alt.trim()) {
    return encodeURIComponent(alt.trim().slice(0, 50).replace(/\s+/g, ','));
  }
  const name = path.basename(src, path.extname(src)).replace(/[^0-9a-zA-Z]+/g, ' ');
  if (!name || name.toLowerCase() === 'image') return 'trekking,himalaya';
  return encodeURIComponent(name.trim().split(' ').slice(0, 3).join(',') + ',trekking,himalaya');
};

// Build Unsplash source URL with optional width (defaults 1200)
const buildUnsplashSrc = (key, width = 1200) => {
  const height = Math.round(width * 0.66);
  return `https://source.unsplash.com/featured/${width}x${height}?${key}`;
};

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
for (const file of files) {
  const filePath = path.join(__dirname, file);
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(/<img\s+([^>]*?)src\s*=\s*"([^"]+)"([^>]*?)>/gi, (match, before, src, after) => {
    // preserve existing remote URLs
    if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) return match;

    // calculate keyword from alt or file name
    const altMatch = (match.match(/alt\s*=\s*"([^"]*)"/) || ['',''])[1];
    const keyword = keywordForSrc(src, altMatch);
    const newSrc = buildUnsplashSrc(keyword, 1200);

    // attach lazy and decoding attributes
    let replaced = match.replace(src, newSrc);
    if (!/loading\s*=/.test(replaced)) replaced = replaced.replace(/^<img/, '<img loading="lazy"');
    if (!/decoding\s*=/.test(replaced)) replaced = replaced.replace(/^<img/, '<img decoding="async"');

    // remove srcset from old sources and re-add with image generator if needed
    replaced = replaced.replace(/srcset\s*=\s*"[^"]*"/gi, '');

    // add a default srcset by width variants
    const srcset = `${buildUnsplashSrc(keyword, 400)} 400w, ${buildUnsplashSrc(keyword, 800)} 800w, ${buildUnsplashSrc(keyword, 1200)} 1200w`;
    if (!/srcset\s*=/.test(replaced)) {
      replaced = replaced.replace(/<img/i, `<img srcset="${srcset}" sizes="(max-width: 768px) 100vw, 50vw"`);
    }
    return replaced;
  });

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated images in ${file}`);
}
