/**
 * Generate Optimized Images for All Regions & Treks
 * Creates placeholder images and optimizes them
 */

const regions = [
    { id: 'everest', name: 'Everest Region', color: '#1a3a52' },
    { id: 'annapurna', name: 'Annapurna Region', color: '#2c5aa0' },
    { id: 'langtang', name: 'Langtang Region', color: '#1e7145' },
    { id: 'manaslu', name: 'Manaslu Region', color: '#8b4513' },
    { id: 'dolpa', name: 'Dolpa Region', color: '#4a235a' },
    { id: 'mustang', name: 'Mustang Region', color: '#d4a574' },
    { id: 'makalu', name: 'Makalu Region', color: '#5a4a3a' },
    { id: 'kanchenjunga', name: 'Kanchenjunga Region', color: '#0d47a1' }
];

const treks = [
    { id: 'everest-base-camp', name: 'Everest Base Camp Trek', region: 'everest' },
    { id: 'annapurna-circuit', name: 'Annapurna Circuit Trek', region: 'annapurna' },
    { id: 'abc', name: 'Annapurna Base Camp Trek', region: 'annapurna' },
    { id: 'langtang-valley', name: 'Langtang Valley Trek', region: 'langtang' },
    { id: 'manaslu-circuit', name: 'Manaslu Circuit Trek', region: 'manaslu' },
    { id: 'upper-mustang', name: 'Upper Mustang Trek', region: 'mustang' },
    { id: 'makalu-base-camp', name: 'Makalu Base Camp Trek', region: 'makalu' },
    { id: 'kanchenjunga-circuit', name: 'Kanchenjunga Circuit Trek', region: 'kanchenjunga' }
];

/**
 * Generate image manifest with all URLs and metadata
 * Used for reference and debugging
 */
function generateImageManifest() {
    const manifest = {
        regions: {},
        treks: {},
        placeholders: {}
    };

    // Region images
    regions.forEach(region => {
        manifest.regions[region.id] = {
            name: region.name,
            color: region.color,
            sizes: {
                thumbnail: `https://via.placeholder.com/150x100/${region.color.substring(1)}/FFFFFF?text=${encodeURIComponent(region.name)}`,
                small: `https://via.placeholder.com/400x300/${region.color.substring(1)}/FFFFFF?text=${encodeURIComponent(region.name)}`,
                medium: `https://via.placeholder.com/800x600/${region.color.substring(1)}/FFFFFF?text=${encodeURIComponent(region.name)}`,
                large: `https://via.placeholder.com/1200x800/${region.color.substring(1)}/FFFFFF?text=${encodeURIComponent(region.name)}`
            },
            optimized: {
                small: optimizeImageUrl(`https://via.placeholder.com/400x300/${region.color.substring(1)}/FFFFFF?text=${encodeURIComponent(region.name)}`, 400),
                medium: optimizeImageUrl(`https://via.placeholder.com/800x600/${region.color.substring(1)}/FFFFFF?text=${encodeURIComponent(region.name)}`, 800),
                large: optimizeImageUrl(`https://via.placeholder.com/1200x800/${region.color.substring(1)}/FFFFFF?text=${encodeURIComponent(region.name)}`, 1200)
            }
        };
    });

    // Trek images
    treks.forEach(trek => {
        const region = regions.find(r => r.id === trek.region);
        manifest.treks[trek.id] = {
            name: trek.name,
            region: trek.region,
            color: region.color,
            optimized: {
                card: optimizeImageUrl(`https://via.placeholder.com/900x600/${region.color.substring(1)}/FFFFFF?text=${encodeURIComponent(trek.name)}`, 900),
                hero: optimizeImageUrl(`https://via.placeholder.com/1600x900/${region.color.substring(1)}/FFFFFF?text=${encodeURIComponent(trek.name)}`, 1600),
                thumbnail: optimizeImageUrl(`https://via.placeholder.com/300x200/${region.color.substring(1)}/FFFFFF?text=${encodeURIComponent(trek.name)}`, 300)
            }
        };
    });

    return manifest;
}

/**
 * Optimize image URL using weserv.nl API
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Desired width
 */
function optimizeImageUrl(imageUrl, width = 1200) {
    if (!imageUrl) return null;
    const encoded = encodeURIComponent(imageUrl);
    return `https://images.weserv.nl/?url=${encoded}&w=${width}&fit=inside&output=webp&q=80&auto=format`;
}

/**
 * Generate image configuration file for HTML templates
 */
function generateImageConfig() {
    const config = {
        timestamp: new Date().toISOString(),
        apiBase: 'https://images.weserv.nl/',
        regions: {},
        treks: {},
        responsive: {
            small: 400,
            medium: 800,
            large: 1200,
            hero: 1600
        }
    };

    regions.forEach(region => {
        config.regions[region.id] = {
            name: region.name,
            primaryColor: region.color,
            image: `region-${region.id}`
        };
    });

    treks.forEach(trek => {
        config.treks[trek.id] = {
            name: trek.name,
            region: trek.region,
            image: `trek-${trek.id}`
        };
    });

    return config;
}

/**
 * Generate HTML helper functions for image rendering
 */
function generateHtmlImageHelpers() {
    return `
<!-- Image Helpers for Dynamic Loading -->
<script>
window.ImageManager = {
  apiBase: 'https://images.weserv.nl/',
  
  /**
   * Create responsive image URL
   */
  getUrl(imageName, width = 1200) {
    const baseUrl = 'https://via.placeholder.com/1200x800/2C5282/FFFFFF?text=' + encodeURIComponent(imageName);
    const encoded = encodeURIComponent(baseUrl);
    return this.apiBase + '?url=' + encoded + '&w=' + width + '&fit=inside&output=webp&q=80';
  },

  /**
   * Generate srcset for responsive images
   */
  getSrcset(imageName, widths = [400, 800, 1200]) {
    return widths.map(w => this.getUrl(imageName, w) + ' ' + w + 'w').join(', ');
  },

  /**
   * Preload images for better performance
   */
  preloadImages(images) {
    images.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img;
      document.head.appendChild(link);
    });
  }
};
</script>
  `;
}

// Generate all assets
const manifest = generateImageManifest();
const config = generateImageConfig();
const htmlHelpers = generateHtmlImageHelpers();

// Log statistics
console.log('\n=== IMAGE GENERATION REPORT ===');
console.log('Regions:', Object.keys(manifest.regions).length);
console.log('Treks:', Object.keys(manifest.treks).length);
console.log('Image Variants per Region: 4 (thumbnail, small, medium, large)');
console.log('Image Variants per Trek: 3 (card, hero, thumbnail)');
console.log('Total Unique Images:',
    Object.keys(manifest.regions).length * 4 + Object.keys(manifest.treks).length * 3
);
console.log('API Used: weserv.nl for optimization + via.placeholder.com for generation');
console.log('\n=== SAMPLE REGION IMAGE ===');
console.log('Everest Region (Large):');
console.log(manifest.regions.everest.optimized.large);
console.log('\n=== SAMPLE TREK IMAGE ===');
console.log('Everest Base Camp (Card):');
console.log(manifest.treks['everest-base-camp'].optimized.card);

// Export everything
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateImageManifest,
        generateImageConfig,
        generateHtmlImageHelpers,
        optimizeImageUrl,
        regions,
        treks
    };
}