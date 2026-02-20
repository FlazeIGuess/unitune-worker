import { log } from '../utils/logger.js';

/**
 * Handle donations API requests
 * Returns current donation status and recent donors
 */
export async function handleDonationsAPI(config, env) {
    try {
        // Get donations data from KV
        let donationsData = {
            total: 0,
            goal: 99,
            donations: []
        };

        if (env.DONATIONS_KV) {
            const stored = await env.DONATIONS_KV.get('donations', 'json');
            if (stored) {
                donationsData = stored;
            }
        }

        log(config, 'info', 'Donations API request', {
            total: donationsData.total,
            count: donationsData.donations.length
        });

        return new Response(JSON.stringify(donationsData), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            }
        });

    } catch (error) {
        log(config, 'error', 'Donations API error', {
            error: error.message
        });

        return new Response(JSON.stringify({
            total: 0,
            goal: 99,
            donations: []
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            status: 500
        });
    }
}
