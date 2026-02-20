import { TRUSTED_THUMBNAIL_DOMAINS } from '../constants/services.js';

/**
 * Validates that a thumbnail URL is safe to display
 * - Must use HTTPS protocol
 * - Must be from a trusted music service domain
 * 
 * @param {string} url - The thumbnail URL to validate
 * @returns {boolean} - True if the URL is safe, false otherwise
 */
export function isValidThumbnailUrl(url) {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const parsedUrl = new URL(url);

        // Must use HTTPS protocol
        if (parsedUrl.protocol !== 'https:') {
            return false;
        }

        // Must be from a trusted domain
        const hostname = parsedUrl.hostname.toLowerCase();
        return TRUSTED_THUMBNAIL_DOMAINS.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );
    } catch (e) {
        // Invalid URL format
        return false;
    }
}

/**
 * Reconstructs a music URL from platform, type, and ID
 * 
 * @param {string} platform - Platform identifier (spotify, tidal, etc.)
 * @param {string} type - Content type (track, album, etc.)
 * @param {string} id - Track/content ID
 * @returns {string|null} - Reconstructed URL or null if platform unsupported
 */
export function reconstructMusicUrl(platform, type, id) {
    const urls = {
        'spotify': `https://open.spotify.com/${type}/${id}`,
        'tidal': `https://tidal.com/browse/${type}/${id}`,
        'applemusic': `https://music.apple.com/us/song/${id}`,
        'youtubemusic': `https://music.youtube.com/watch?v=${id}`,
        'youtube': `https://youtube.com/watch?v=${id}`,
        'deezer': `https://www.deezer.com/${type}/${id}`,
        'amazonmusic': `https://music.amazon.com/tracks/${id}`
    };
    
    return urls[platform.toLowerCase()] || null;
}
