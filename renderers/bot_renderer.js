import { log } from '../utils/logger.js';
import { getLandingPage } from '../templates/landing_page.js';
import { getErrorPage } from '../templates/error_page.js';
import { addSecurityHeaders } from '../security/headers.js';

/**
 * Server-Side rendering for bots with pre-fetched metadata
 * Metadata is already fetched and cached by the main handler
 */
export function getServerSideRenderedPage(musicUrl, metadata, config) {
    try {
        // Extract metadata
        const entities = Object.values(metadata.entitiesByUniqueId || {});
        const firstEntity = entities[0] || {};
        const entityType = firstEntity.type || 'song';
        
        // Handle different content types
        let title, artist;
        if (entityType === 'artist') {
            // For artists, use name as title and "Artist" as subtitle
            title = firstEntity.name || firstEntity.artistName || 'Unknown Artist';
            artist = 'Artist';
        } else if (entityType === 'album') {
            // For albums, use album title and artist name
            title = firstEntity.title || 'Unknown Album';
            artist = firstEntity.artistName || 'Unknown Artist';
        } else {
            // For tracks (songs)
            title = firstEntity.title || 'Unknown Song';
            artist = firstEntity.artistName || 'Unknown Artist';
        }
        
        const thumbnail = firstEntity.thumbnailUrl || '';
        const links = metadata.linksByPlatform || {};

        log(config, 'info', 'Rendering page for bot', {
            title: title.substring(0, 30),
            hasThumbnail: !!thumbnail
        });

        // Return full HTML with Open Graph tags
        const html = getLandingPage({
            title,
            artist,
            thumbnail,
            links,
            musicUrl,
            adsensePublisherId: config.adsensePublisherId,
        });

        return addSecurityHeaders(new Response(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }));

    } catch (error) {
        log(config, 'error', 'Error in getServerSideRenderedPage', {
            error: error.message
        });

        const errorContent = getErrorPage('Unable to load song. Please try again later.');
        return addSecurityHeaders(new Response(errorContent, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 500,
        }));
    }
}
