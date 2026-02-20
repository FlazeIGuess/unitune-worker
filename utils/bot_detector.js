/**
 * Detects if the request is from a social media bot/crawler
 * These bots don't execute JavaScript, so they need server-side rendered content
 * 
 * @param {string} userAgent - The User-Agent header from the request
 * @returns {boolean} - True if the request is from a bot
 */
export function isSocialMediaBot(userAgent) {
    if (!userAgent) return false;

    const botPatterns = [
        'facebookexternalhit',      // Facebook
        'WhatsApp',                 // WhatsApp
        'Twitterbot',               // Twitter/X
        'TelegramBot',              // Telegram
        'Slackbot',                 // Slack
        'LinkedInBot',              // LinkedIn
        'Discordbot',               // Discord
        'SkypeUriPreview',          // Skype
        'Snapchat',                 // Snapchat
        'Pinterest',                // Pinterest
        'Googlebot',                // Google (for SEO)
        'bingbot',                  // Bing (for SEO)
    ];

    const lowerUserAgent = userAgent.toLowerCase();
    return botPatterns.some(pattern => lowerUserAgent.includes(pattern.toLowerCase()));
}
