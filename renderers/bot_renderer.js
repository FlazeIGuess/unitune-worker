import { log } from '../utils/logger.js';
import { getLandingPage } from '../templates/landing_page.js';
import { getErrorPage } from '../templates/error_page.js';
import { addSecurityHeaders } from '../security/headers.js';
import { escapeHtml } from '../security/html_escaper.js';

/**
 * Server-Side rendering for bots with pre-fetched metadata
 * Metadata is already fetched and cached by the main handler
 */
export function getServerSideRenderedPage(musicUrl, metadata, config, sharedByNickname = null) {
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
            hasThumbnail: !!thumbnail,
            nickname: sharedByNickname || 'none'
        });

        // Return full HTML with Open Graph tags
        const html = getLandingPage({
            title,
            artist,
            thumbnail,
            links,
            musicUrl,
            adsensePublisherId: config.adsensePublisherId,
            sharedByNickname,
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

/**
 * Server-Side rendering for playlist bots with Open Graph tags
 */
export function getPlaylistBotPage(playlist, playlistId, config) {
    try {
        const title = escapeHtml(playlist.title || 'UniTune Playlist');
        const trackCount = Array.isArray(playlist.tracks) ? playlist.tracks.length : 0;
        const thumbnail = trackCount > 0 ? escapeHtml(playlist.tracks[0]?.thumbnailUrl || '') : '';
        const creatorNickname = playlist.creatorNickname ? escapeHtml(playlist.creatorNickname) : null;
        const description = playlist.description ? escapeHtml(playlist.description) : null;

        // Build track list for description
        let trackList = '';
        if (trackCount > 0) {
            const maxTracks = Math.min(5, trackCount);
            for (let i = 0; i < maxTracks; i++) {
                const track = playlist.tracks[i];
                trackList += `${i + 1}. ${escapeHtml(track.title || 'Unknown')} - ${escapeHtml(track.artist || 'Unknown')}\\n`;
            }
            if (trackCount > 5) {
                trackList += `... and ${trackCount - 5} more tracks`;
            }
        }

        const ogDescription = creatorNickname 
            ? `${trackCount} tracks • by ${creatorNickname}${description ? ` • ${description}` : ''}`
            : `${trackCount} tracks${description ? ` • ${description}` : ''}`;

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${ogDescription}">
  ${thumbnail ? `<meta property="og:image" content="${thumbnail}">` : ''}
  <meta property="og:type" content="music.playlist">
  <meta property="og:url" content="https://unitune.art/p/${playlistId}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${ogDescription}">
  ${thumbnail ? `<meta name="twitter:image" content="${thumbnail}">` : ''}
  <meta name="theme-color" content="#0D1117">
</head>
<body>
  <h1>${title}</h1>
  ${creatorNickname ? `<p>Created by ${creatorNickname}</p>` : ''}
  ${description ? `<p>${description}</p>` : ''}
  <p>${trackCount} tracks</p>
  ${trackList ? `<pre>${trackList}</pre>` : ''}
</body>
</html>`;

        return addSecurityHeaders(new Response(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }));

    } catch (error) {
        log(config, 'error', 'Error in getPlaylistBotPage', {
            error: error.message
        });

        const errorContent = getErrorPage('Unable to load playlist. Please try again later.');
        return addSecurityHeaders(new Response(errorContent, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 500,
        }));
    }
}
