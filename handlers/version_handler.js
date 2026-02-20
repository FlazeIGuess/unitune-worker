/**
 * Version Handler — returns current app version info and What's New content.
 *
 * Version data is loaded from `generated-version.js`, which is:
 *  - Committed to the repo as the baseline (current release).
 *  - Overwritten automatically by the CI pipeline on every app release
 *    BEFORE `wrangler deploy` runs (see .github/workflows/deploy.yml).
 *
 * To update manually (without CI):
 *   node ../unitune-app/scripts/parse-changelog.js > /tmp/v.json
 *   node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync('/tmp/v.json'));fs.writeFileSync('generated-version.js','export default '+JSON.stringify(d,null,2)+';\\n');"
 *   wrangler deploy
 *
 * Privacy: No user data collected, no cookies set.
 * CORS: Open to all origins — public, read-only endpoint.
 */

import VERSION_DATA from '../generated-version.js';

/**
 * Handle GET /api/version
 *
 * Returns JSON cached by the CDN for 5 minutes.
 * No user data is read, stored, or returned.
 *
 * @param {Request} request
 * @returns {Response}
 */
export function handleVersion(request) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    // 5-minute CDN cache — short enough for releases to propagate quickly.
    'Cache-Control': 'public, max-age=300',
    'Vary': 'Accept-Encoding',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers,
    });
  }

  return new Response(JSON.stringify(VERSION_DATA), {
    status: 200,
    headers,
  });
}
