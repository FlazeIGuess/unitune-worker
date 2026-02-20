import { log } from '../utils/logger.js';
import { reconstructMusicUrl } from '../utils/url_validator.js';
import { fetchAndCacheMetadata } from '../utils/metadata_fetcher.js';
import { isSocialMediaBot } from '../utils/bot_detector.js';
import { getServerSideRenderedPage } from '../renderers/bot_renderer.js';
import { getClientSideLoadingPage } from '../renderers/client_renderer.js';
import { getErrorPage } from '../templates/error_page.js';
import { addSecurityHeaders } from '../security/headers.js';

/**
 * Handle share links: /s/{encodedUrl}
 * Decodes Base64 encoded share links and renders appropriate page
 */
export async function handleShareLink(pathname, request, config, env) {
    log(config, 'debug', 'Processing share link', {
        pathname: pathname,
    });

    // Extract everything after /s/ from the pathname
    let pathAfterS = pathname.substring(3); // Remove '/s/'

    log(config, 'debug', 'Path after /s/', { pathAfterS });

    // Decode share link (Base64 format)
    let musicUrl = null;

    try {
        // Try Base64 decode
        let padded = pathAfterS;
        while (padded.length % 4 !== 0) {
            padded += '=';
        }
        
        // Decode Base64 (URL-safe)
        const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
        
        log(config, 'debug', 'Base64 decoded', { decoded: decoded.substring(0, 50) });
        
        // Check if it's platform:type:id format
        if (decoded.includes(':') && !decoded.startsWith('http')) {
            const parts = decoded.split(':');
            if (parts.length >= 3) {
                const platform = parts[0];
                const type = parts[1];
                const id = parts.slice(2).join(':'); // Handle IDs with colons
                
                // Reconstruct music URL
                musicUrl = reconstructMusicUrl(platform, type, id);
                
                if (!musicUrl) {
                    log(config, 'error', 'Unsupported platform', { platform });
                    const errorContent = getErrorPage('Unsupported music platform.');
                    return addSecurityHeaders(new Response(errorContent, {
                        headers: { 'Content-Type': 'text/html; charset=utf-8' },
                        status: 400,
                    }));
                }
                
                log(config, 'info', 'Reconstructed URL', {
                    platform,
                    type,
                    id: id.substring(0, 20)
                });
            }
        }
    } catch (e) {
        log(config, 'error', 'Base64 decode failed', {
            error: e.message,
            pathAfterS: pathAfterS.substring(0, 50)
        });
        
        const errorContent = getErrorPage('Invalid share link format.');
        return addSecurityHeaders(new Response(errorContent, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 400,
        }));
    }

    if (!musicUrl) {
        log(config, 'error', 'Could not decode share link');
        const errorContent = getErrorPage('Invalid share link.');
        return addSecurityHeaders(new Response(errorContent, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 400,
        }));
    }

    // Fetch and cache metadata for all requests (bot and user)
    const metadata = await fetchAndCacheMetadata(musicUrl, pathAfterS, config, env);
    
    if (!metadata) {
        log(config, 'error', 'Failed to fetch metadata');
        const errorContent = getErrorPage('Song not found. Please try again.');
        return addSecurityHeaders(new Response(errorContent, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 404,
        }));
    }

    // Check if request is from a social media bot
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = isSocialMediaBot(userAgent);

    log(config, 'info', 'Request type detected', {
        isBot,
        userAgent: userAgent.substring(0, 50)
    });

    if (isBot) {
        // Bot request: Server-side rendering with metadata
        log(config, 'info', 'Serving bot with server-side rendering');
        return getServerSideRenderedPage(musicUrl, metadata, config);
    } else {
        // Normal user: Client-side loading with metadata for Open Graph
        log(config, 'info', 'Serving user with client-side loading');
        return getClientSideLoadingPage(musicUrl, metadata, config);
    }
}
