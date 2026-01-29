/**
 * Rate Limiter using Token Bucket Algorithm
 * 
 * Implements rate limiting to prevent abuse and excessive API usage.
 * Uses Cloudflare KV for distributed state storage.
 * 
 * Configuration:
 * - Max requests: 60 per minute
 * - Bucket size: 60 tokens
 * - Refill rate: 1 token per second
 * - Storage: Cloudflare KV (key: `ratelimit:${ip}`, TTL: 60 seconds)
 * 
 * Requirements: 6.1, 6.2, 6.3
 */

const MAX_TOKENS = 60;           // Maximum tokens in bucket
const REFILL_RATE = 1;            // Tokens added per second
const WINDOW_SIZE = 60;           // Time window in seconds

/**
 * Rate limiter class using token bucket algorithm
 */
export class RateLimiter {
    /**
     * Checks if a request should be allowed and updates the rate limit state
     * 
     * @param {string} clientIp - The client's IP address
     * @param {KVNamespace} kv - Cloudflare KV namespace for storage
     * @returns {Promise<{allowed: boolean, retryAfter?: number}>}
     */
    async checkLimit(clientIp, kv) {
        if (!clientIp || !kv) {
            // If no IP or KV available, allow the request (fail open)
            return { allowed: true };
        }

        const key = `ratelimit:${clientIp}`;
        const now = Date.now();

        try {
            // Get current state from KV
            const stateJson = await kv.get(key);
            let state;

            if (stateJson) {
                state = JSON.parse(stateJson);
            } else {
                // First request from this IP - initialize with full bucket
                state = {
                    tokens: MAX_TOKENS,
                    lastRefill: now,
                    requestCount: 0
                };
            }

            // Calculate tokens to add based on time elapsed
            const timeSinceLastRefill = (now - state.lastRefill) / 1000; // Convert to seconds
            const tokensToAdd = Math.floor(timeSinceLastRefill * REFILL_RATE);

            // Refill tokens (up to max)
            if (tokensToAdd > 0) {
                state.tokens = Math.min(MAX_TOKENS, state.tokens + tokensToAdd);
                state.lastRefill = now;
            }

            // Check if we have tokens available
            if (state.tokens >= 1) {
                // Allow request and consume one token
                state.tokens -= 1;
                state.requestCount += 1;

                // Save updated state to KV with TTL
                await kv.put(key, JSON.stringify(state), {
                    expirationTtl: WINDOW_SIZE * 2 // Keep state for 2 minutes
                });

                return { allowed: true };
            } else {
                // Rate limit exceeded - calculate retry after time
                const tokensNeeded = 1;
                const secondsUntilToken = tokensNeeded / REFILL_RATE;
                const retryAfter = Math.ceil(secondsUntilToken);

                // Save state (don't increment request count for rejected requests)
                await kv.put(key, JSON.stringify(state), {
                    expirationTtl: WINDOW_SIZE * 2
                });

                return {
                    allowed: false,
                    retryAfter: retryAfter
                };
            }
        } catch (error) {
            // If KV fails, fail open (allow request) to prevent service disruption
            // In production, you might want to log this error
            return { allowed: true };
        }
    }

    /**
     * Records a request for rate limiting (legacy method for compatibility)
     * This is now handled by checkLimit, but kept for API compatibility
     * 
     * @param {string} clientIp - The client's IP address
     * @param {KVNamespace} kv - Cloudflare KV namespace for storage
     */
    async recordRequest(clientIp, kv) {
        // This method is now a no-op since checkLimit handles both checking and recording
        // Kept for backward compatibility
        return;
    }
}

/**
 * Helper function to get client IP from request
 * Handles various proxy headers and Cloudflare-specific headers
 * 
 * @param {Request} request - The incoming request
 * @returns {string} - The client's IP address
 */
export function getClientIp(request) {
    // Try Cloudflare-specific header first
    const cfConnectingIp = request.headers.get('CF-Connecting-IP');
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // Try standard proxy headers
    const xForwardedFor = request.headers.get('X-Forwarded-For');
    if (xForwardedFor) {
        // X-Forwarded-For can contain multiple IPs, take the first one
        return xForwardedFor.split(',')[0].trim();
    }

    const xRealIp = request.headers.get('X-Real-IP');
    if (xRealIp) {
        return xRealIp;
    }

    // Fallback to 'unknown' if no IP found
    return 'unknown';
}

/**
 * Creates a rate limit exceeded response (HTTP 429)
 * 
 * @param {number} retryAfter - Seconds until the client can retry
 * @returns {Response} - HTTP 429 response with Retry-After header
 */
export function createRateLimitResponse(retryAfter) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rate Limit Exceeded - UniTune</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 28px;
            color: #1a202c;
            margin-bottom: 12px;
        }
        p {
            color: #4a5568;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .retry-info {
            background: #f7fafc;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
        }
        .retry-time {
            font-size: 32px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 4px;
        }
        .retry-label {
            font-size: 14px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .back-link {
            display: inline-block;
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: opacity 0.2s;
        }
        .back-link:hover {
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">⏱️</div>
        <h1>Too Many Requests</h1>
        <p>You've exceeded the rate limit. Please wait a moment before trying again.</p>
        <div class="retry-info">
            <div class="retry-time">${retryAfter}s</div>
            <div class="retry-label">Retry After</div>
        </div>
        <p style="font-size: 14px; color: #718096;">
            We limit requests to 60 per minute to ensure fair usage for everyone.
        </p>
        <a href="/" class="back-link">← Back to Home</a>
    </div>
</body>
</html>`;

    return new Response(html, {
        status: 429,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Retry-After': retryAfter.toString(),
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-RateLimit-Limit': MAX_TOKENS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + retryAfter * 1000).toISOString()
        }
    });
}
