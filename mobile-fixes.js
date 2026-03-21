const fs = require('fs');
let html = fs.readFileSync('gokyo-lakes.html', 'utf8');

const extraCSS = `
    /* Extra Mobile Fixes */
    @media (max-width: 992px) {
        .overview-grid, .cost-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
        }
        .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
        }
    }
    @media (max-width: 768px) {
        .nav-links { display: none !important; }
        .nav-actions { width: auto !important; justify-content: flex-end; }
        .nav-main-inner { padding: 0 15px !important; gap: 10px !important; }
        .nav-cta span { display: none !important; }
        .nav-cta i { display: block !important; }
        .nav-cta { padding: 10px 14px !important; min-width: auto !important; }
        
        /* Ensure no horizontal scroll */
        html, body { overflow-x: hidden !important; width: 100% !important; max-width: 100% !important; margin:0; padding:0;}
        
        .gallery-grid {
            grid-template-columns: 1fr !important;
        }
        
        /* Fix hamburger and cta alignment */
        .nav-logo { flex-shrink: 1; overflow: hidden; }
        .logo-text { font-size: 1.2rem; }
    }
</style>
`;

html = html.replace('</style>', extraCSS);
fs.writeFileSync('gokyo-lakes.html', html);
console.log('done');
