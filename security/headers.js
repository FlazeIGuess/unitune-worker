/**
 * Security Headers Component
 * 
 * Adds security headers to HTTP responses to protect against common web vulnerabilities.
 * 
 * Requirements:
 * - 11.1: Content-Security-Policy header to restrict script sources
 * - 11.2: CSP allows scripts from 'self', pagead2.googlesyndication.com, and 'unsafe-inline'
 * - 11.3: X-Frame-Options header set to DENY to prevent clickjacking
 * - 11.4: X-Content-Type-Options header set to nosniff to prevent MIME type sniffing
 * - 11.5: Referrer-Policy header set to strict-origin-when-cross-origin
 * - 11.6: Permissions-Policy header to restrict access to sensitive browser features
 * - 11.7: Strict-Transport-Security header with max-age of at least 31536000 seconds
 */

/**
 * Adds security headers to a response
 * 
 * @param {Response} response - The response to add headers to
 * @returns {Response} - Response with security headers added
 */
export function addSecurityHeaders(response) {
  // Create a new Headers object from the existing response headers
  const headers = new Headers(response.headers);

  // Content-Security-Policy (Requirement 11.1, 11.2)
  // Restricts script sources to prevent XSS attacks
  // Allows scripts from:
  // - 'self': Same origin
  // - 'unsafe-inline': Inline scripts (required for AdSense and client-side loading)
  // - pagead2.googlesyndication.com: Google AdSense
  // Allows connections to:
  // - 'self': Same origin
  // - pagead2.googlesyndication.com: Google AdSense
  // - unitune-api.onrender.com: UniTune API (hosted in Frankfurt, EU)
  headers.set('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' " +
      "pagead2.googlesyndication.com " +
      "tpc.googlesyndication.com " +
      "googletagservices.com " +
      "www.googletagmanager.com; " +
    "frame-src " +
      "googleads.g.doubleclick.net " +
      "tpc.googlesyndication.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' " +
      "https://pagead2.googlesyndication.com " +
      "https://googleads.g.doubleclick.net " +
      "https://adservice.google.com " +
      "https://www.google.com " +
      "https://api.unitune.art;"
  );

  // X-Frame-Options (Requirement 11.3)
  // Prevents the page from being embedded in iframes to prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options (Requirement 11.4)
  // Prevents browsers from MIME-sniffing a response away from the declared content-type
  headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy (Requirement 11.5)
  // Controls how much referrer information is sent with requests
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy (Requirement 11.6)
  // Restricts access to sensitive browser features
  headers.set('Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );

  // Strict-Transport-Security (Requirement 11.7)
  // Forces browsers to use HTTPS for all future requests
  // max-age=31536000 = 1 year in seconds
  headers.set('Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // Return a new Response with the updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}
