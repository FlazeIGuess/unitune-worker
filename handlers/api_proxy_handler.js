import { log } from '../utils/logger.js';
import { addSecurityHeaders } from '../security/headers.js';

/**
 * API Proxy for UniTune API (to avoid CORS issues)
 * Proxies requests to the UniTune API with proper CORS headers
 */
export async function handleApiProxy(url, config) {
    const musicUrl = url.searchParams.get('url');

    if (!musicUrl) {
        return addSecurityHeaders(new Response(
            JSON.stringify({ error: 'Missing url parameter' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            }
        ));
    }

    log(config, 'info', 'API proxy request', {
        musicUrl: musicUrl.substring(0, 50)
    });

    try {
        const apiUrl = `${config.unituneApiEndpoint}?url=${encodeURIComponent(musicUrl)}`;

        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'UniTune-Worker/2.2.0 (https://unitune.art)',
            },
        });

        const data = await response.text();

        log(config, 'info', 'API proxy response', {
            status: response.status
        });

        // Return with CORS headers
        return addSecurityHeaders(new Response(data, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://unitune.art',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        }));

    } catch (error) {
        log(config, 'error', 'API proxy error', {
            error: error.message
        });

        return addSecurityHeaders(new Response(
            JSON.stringify({ error: 'Failed to fetch song data' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://unitune.art',
                }
            }
        ));
    }
}
