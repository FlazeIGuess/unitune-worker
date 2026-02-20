/**
 * Privacy-safe logger that only logs when DEBUG_LOGGING is enabled
 * Sanitizes URLs and sensitive data before logging
 * 
 * @param {Object} config - Configuration object with debugLogging flag
 * @param {string} level - Log level (info, warn, error, debug)
 * @param {string} message - Log message
 * @param {Object} data - Additional data to log (will be sanitized)
 */
export function log(config, level, message, data = {}) {
    if (!config.debugLogging) {
        return; // Logging disabled
    }

    // Sanitize data to remove sensitive information
    const sanitizedData = {};
    for (const [key, value] of Object.entries(data)) {
        if (key === 'url' || key === 'musicUrl' || key === 'decodedUrl') {
            // Only log domain and path structure, not full URL
            try {
                const urlObj = new URL(value);
                sanitizedData[key] = `${urlObj.hostname}${urlObj.pathname.substring(0, 20)}...`;
            } catch {
                sanitizedData[key] = '[invalid-url]';
            }
        } else if (key === 'ip' || key === 'clientIp') {
            // Hash IP addresses for privacy
            sanitizedData[key] = '[ip-hidden]';
        } else if (typeof value === 'string' && value.length > 100) {
            // Truncate long strings
            sanitizedData[key] = value.substring(0, 100) + '...';
        } else {
            sanitizedData[key] = value;
        }
    }

    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        version: config.workerVersion,
        environment: config.environment,
        ...sanitizedData
    };

    // Use appropriate console method based on level
    switch (level) {
        case 'error':
            console.error(JSON.stringify(logEntry));
            break;
        case 'warn':
            console.warn(JSON.stringify(logEntry));
            break;
        case 'debug':
            console.debug(JSON.stringify(logEntry));
            break;
        default:
            console.log(JSON.stringify(logEntry));
    }
}
