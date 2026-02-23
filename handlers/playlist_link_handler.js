import { log } from '../utils/logger.js';
import { isSocialMediaBot } from '../utils/bot_detector.js';
import { getErrorPage } from '../templates/error_page.js';
import { addSecurityHeaders } from '../security/headers.js';
import { getPlaylistClientPage } from '../renderers/client_renderer.js';
import { getPlaylistBotPage } from '../renderers/bot_renderer.js';

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

    log(config, 'info', 'Playlist request type detected', {
        isBot,
        playlistId: playlistId.substring(0, 20)
    });

    if (isBot) {
        // Bot request: Server-side rendering with Open Graph tags
        return getPlaylistBotPage(playlist, playlistId, config);
    } else {
        // Normal user: Client-side rendering with full playlist display
        return getPlaylistClientPage(playlist, playlistId, config);
    }
}
