import { log } from '../utils/logger.js';
import { isSocialMediaBot } from '../utils/bot_detector.js';
import { getErrorPage } from '../templates/error_page.js';
import { addSecurityHeaders } from '../security/headers.js';

export async function handlePlaylistLink(pathname, request, config) {
    const playlistId = pathname.substring(3);
    if (!playlistId) {
        const errorContent = getErrorPage('Invalid playlist link.');
        return addSecurityHeaders(new Response(errorContent, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 400,
        }));
    }

    const apiUrl = `${config.unitunePlaylistEndpoint}/${playlistId}`;
    let playlist = null;

    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            playlist = await response.json();
        } else {
            const errorContent = getErrorPage('Playlist not found.');
            return addSecurityHeaders(new Response(errorContent, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
                status: 404,
            }));
        }
    } catch (error) {
        log(config, 'error', 'Playlist fetch failed', { error: error.message });
        const errorContent = getErrorPage('Failed to load playlist.');
        return addSecurityHeaders(new Response(errorContent, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 500,
        }));
    }

    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = isSocialMediaBot(userAgent);

    if (!isBot) {
        const redirectUrl = `unitune://playlist?id=${encodeURIComponent(playlistId)}&source=web`;
        return addSecurityHeaders(new Response(null, {
            status: 302,
            headers: { Location: redirectUrl },
        }));
    }

    const title = playlist.title || 'UniTune Playlist';
    const trackCount = Array.isArray(playlist.tracks) ? playlist.tracks.length : 0;
    const thumbnail = trackCount > 0 ? playlist.tracks[0]?.thumbnailUrl : null;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${trackCount} tracks">
  ${thumbnail ? `<meta property="og:image" content="${thumbnail}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
</head>
<body></body>
</html>`;

    return addSecurityHeaders(new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }));
}
