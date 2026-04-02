/**
 * Image Generator & Manager
 * Uses Unsplash API for high-quality trekking images
 * Falls back to placeholder API if needed
 */

// Unsplash API configuration
const UNSPLASH_API_KEY = 'demo'; // Replace with your Unsplash API key from https://unsplash.com/developers
const UNSPLASH_BASE_URL = 'https://api.unsplash.com/photos/random';

// Unsplash demo photo object (preloaded test case)
const UNSPLASH_DEMO_PHOTO = {
    id: 'pFqrYbhIAXs',
    urls: {
        raw: 'https://images.unsplash.com/5/unsplash-kitsune-4.jpg?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bc01c83c3da0425e9baa6c7a9204af81',
        full: 'https://images.unsplash.com/5/unsplash-kitsune-4.jpg?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjEyMDd9&s=ce40ce8b8ba365e5e6d06401e5485390',
        regular: 'https://images.unsplash.com/5/unsplash-kitsune-4.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9&s=fb86e2e09fceac9b363af536b93a1275',
        small: 'https://images.unsplash.com/5/unsplash-kitsune-4.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9&s=dd060fe209b4a56733a1dcc9b5aea53a',
        thumb: 'https://images.unsplash.com/5/unsplash-kitsune-4.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9&s=50827fd8476bfdffe6e04bc9ae0b8c02'
    }
};

// Image mapping for each trek/region with search terms
const imageMapping = {
    everest: {
        searchTerms: ['everest base camp mountain', 'himalaya trek', 'mount everest'],
        defaultSize: '1200x800',
        description: 'Everest Region'
    },
    annapurna: {
        searchTerms: ['annapurna circuit', 'annapurna mountain range', 'himalaya annapurna'],
        defaultSize: '1200x800',
        description: 'Annapurna Region'
    },
    langtang: {
        searchTerms: ['langtang valley trek', 'langtang mountains', 'himalaya forest'],
        defaultSize: '1200x800',
        description: 'Langtang Region'
    },
    manaslu: {
        searchTerms: ['manaslu circuit trek', 'manaslu mountain', 'nepal trek'],
        defaultSize: '1200x800',
        description: 'Manaslu Region'
    },
    dolpa: {
        searchTerms: ['dolpa region nepal', 'shey phoksundo lake', 'remote nepal trek'],
        defaultSize: '1200x800',
        description: 'Dolpa Region'
    },
    mustang: {
        searchTerms: ['upper mustang trek', 'mustang nepal', 'dry mountain range'],
        defaultSize: '1200x800',
        description: 'Mustang Region'
    },
    makalu: {
        searchTerms: ['makalu base camp', 'makalu mountain', 'high altitude trek'],
        defaultSize: '1200x800',
        description: 'Makalu Region'
    },
    kanchenjunga: {
        searchTerms: ['kanchenjunga trek', 'kanchenjunga base camp', 'third highest mountain'],
        defaultSize: '1200x800',
        description: 'Kanchenjunga Region'
    }
};

/**
 * Generate optimized image URL with smart sizing
 * @param {string} imageType - Type of image (region/trek/blog)
 * @param {number} width - Desired width
 * @param {string} region - Region identifier
 */
function generateImageUrl(imageType, width = 1200, region = 'everest') {
    // Placeholder API URL - generates solid color placeholder with text
    const placeholder = `https://via.placeholder.com/${width}x800/2C5282/FFFFFF?text=${encodeURIComponent(region.toUpperCase())}`;

    // Optimize with weserv.nl API
    const encoded = encodeURIComponent(placeholder);
    return `https://images.weserv.nl/?url=${encoded}&w=${width}&fit=inside&output=webp&q=80`;
}

/**
 * Fetch image from Unsplash API with fallback
 * @param {string} region - Region identifier
 * @param {number} width - Image width
 */
async function fetchUnsplashImage(region, width = 1200) {
    try {
        if (UNSPLASH_API_KEY === 'demo') {
            console.info('Unsplash API key not configured. Using demo Unsplash image.');
            // use the sample record from the provided API response
            const demoUrl = UNSPLASH_DEMO_PHOTO.urls.regular;
            const encodedUrl = encodeURIComponent(demoUrl);
            return `https://images.weserv.nl/?url=${encodedUrl}&w=${width}&fit=inside&output=webp&q=80&auto=format`;
        }

        const mapping = imageMapping[region] || imageMapping.everest;
        const searchTerm = mapping.searchTerms[Math.floor(Math.random() * mapping.searchTerms.length)];

        const response = await fetch(
            `${UNSPLASH_BASE_URL}?query=${encodeURIComponent(searchTerm)}&orientation=landscape&client_id=${UNSPLASH_API_KEY}`
        );

        if (!response.ok) throw new Error('Unsplash API error');

        const data = await response.json();
        const imageUrl = data.urls.regular;

        // Optimize with weserv.nl
        const encoded = encodeURIComponent(imageUrl);
        return `https://images.weserv.nl/?url=${encoded}&w=${width}&fit=inside&output=webp&q=80&auto=format`;
    } catch (error) {
        console.warn('Failed to fetch Unsplash image, using placeholder:', error);
        return generateImageUrl('trek', width, region);
    }
}

/**
 * Generate multiple sized responsive images
 * @param {string} region - Region identifier
 * @param {object} sizes - Object with size configurations {small: 400, medium: 800, large: 1200}
 */
function generateResponsiveImages(region, sizes = { small: 400, medium: 800, large: 1200 }) {
    const images = {};
    for (const [key, width] of Object.entries(sizes)) {
        images[key] = generateImageUrl('trek', width, region);
    }
    return images;
}

/**
 * Generate srcset string for responsive images
 * @param {string} region - Region identifier
 * @param {array} widths - Array of widths e.g. [400, 800, 1200]
 */
function generateSrcset(region, widths = [400, 800, 1200]) {
    return widths
        .map(width => `${generateImageUrl('trek', width, region)} ${width}w`)
        .join(', ');
}

// Export for use in HTML/JS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateImageUrl,
        fetchUnsplashImage,
        generateResponsiveImages,
        generateSrcset,
        imageMapping
    };
}