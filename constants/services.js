/**
 * Music service configurations
 * Logos are served as static assets via Cloudflare Workers Assets
 */
export const SERVICES = {
    spotify: {
        name: 'Spotify',
        color: '#1DB954',
        logo: '/assets/logos/spotify.png'
    },
    appleMusic: {
        name: 'Apple Music',
        color: '#FA243C',
        logo: '/assets/logos/apple_music.png'
    },
    tidal: {
        name: 'TIDAL',
        color: '#000000',
        logo: '/assets/logos/tidal.png'
    },
    youtubeMusic: {
        name: 'YouTube Music',
        color: '#FF0000',
        logo: '/assets/logos/youtube_music.png'
    },
    deezer: {
        name: 'Deezer',
        color: '#a238ff',
        logo: '/assets/logos/deezer.png'
    },
    amazonMusic: {
        name: 'Amazon Music',
        color: '#00A8E1',
        logo: '/assets/logos/amazon_music.png'
    },
};

/**
 * Trusted domains for thumbnail URLs (music service CDNs)
 */
export const TRUSTED_THUMBNAIL_DOMAINS = [
    'i.scdn.co',                    // Spotify CDN
    'is1-ssl.mzstatic.com',         // Apple Music CDN
    'is2-ssl.mzstatic.com',         // Apple Music CDN
    'is3-ssl.mzstatic.com',         // Apple Music CDN
    'is4-ssl.mzstatic.com',         // Apple Music CDN
    'is5-ssl.mzstatic.com',         // Apple Music CDN
    'resources.tidal.com',          // TIDAL CDN
    'i.ytimg.com',                  // YouTube CDN
    'lh3.googleusercontent.com',    // YouTube/Google CDN
    'e-cdns-images.dzcdn.net',      // Deezer CDN
    'm.media-amazon.com',           // Amazon Music CDN
    'images-na.ssl-images-amazon.com', // Amazon CDN
];
