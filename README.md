# UniTune Worker

Cloudflare Worker for UniTune web interface. Provides fast, globally distributed music link conversion and sharing pages.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com)

## Overview

UniTune Worker is a Cloudflare Workers application that serves as the web frontend for UniTune. It handles music link conversion requests, generates shareable web pages, and provides a fast, globally distributed service through Cloudflare's edge network.

## Features

- **Global Edge Network**: Deployed on Cloudflare's global network for low latency
- **Rate Limiting**: Built-in rate limiting (60 requests/minute per IP)
- **Security Headers**: CSP, HSTS, X-Frame-Options, and more
- **Caching**: KV-based caching for improved performance
- **Privacy-Focused**: GDPR-compliant consent management
- **Static Assets**: Serves music platform logos and branding

## Architecture

```
unitune-worker/
├── worker.js              # Main worker script
├── security/              # Security implementations
│   ├── headers.js         # Security headers
│   ├── rate_limiter.js    # Rate limiting
│   ├── html_escaper.js    # XSS protection
│   └── cache_headers.js   # Cache control
├── privacy/               # Privacy features
│   └── consent_manager.js # GDPR consent
├── public/                # Static assets
│   └── assets/logos/      # Music platform logos
└── .well-known/           # Deep link verification
    ├── assetlinks.json    # Android App Links
    └── apple-app-site-association  # iOS Universal Links
```

## Installation

### Prerequisites
- Node.js 18 or higher
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account

### Setup

```bash
# Clone the repository
git clone https://github.com/FlazeIGuess/unitune-worker.git
cd unitune-worker

# Install Wrangler (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create KV namespaces
wrangler kv:namespace create "RATE_LIMIT"
wrangler kv:namespace create "SONG_CACHE"
```

### Configuration

Create `wrangler.toml` from the example:

```bash
cp wrangler.toml.example wrangler.toml
```

Edit `wrangler.toml` with your configuration:

```toml
name = "unitune-worker"
main = "worker.js"
compatibility_date = "2024-01-01"

# KV Namespaces
[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "YOUR_RATE_LIMIT_KV_ID"
preview_id = "YOUR_RATE_LIMIT_PREVIEW_ID"

[[kv_namespaces]]
binding = "SONG_CACHE"
id = "YOUR_SONG_CACHE_KV_ID"
preview_id = "YOUR_SONG_CACHE_PREVIEW_ID"

# Environment Variables
[vars]
ADSENSE_PUBLISHER_ID = "ca-pub-YOUR_PUBLISHER_ID"
UNITUNE_API_ENDPOINT = "https://api.unitune.art/v1-alpha.1/links"
ENVIRONMENT = "production"
DEBUG_LOGGING = "false"
WORKER_VERSION = "2.2.0"
```

## Deployment

### Development

```bash
# Run locally
wrangler dev

# Test with local API
wrangler dev --var UNITUNE_API_ENDPOINT:http://localhost:10000/v1-alpha.1/links
```

### Production

```bash
# Deploy to Cloudflare
wrangler deploy

# View logs
wrangler tail
```

### GitHub Actions

The repository includes a GitHub Actions workflow for automatic deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Set the following secrets in GitHub:
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

## API Endpoints

### Convert Music Link

```http
GET /?url={music_url}
```

Returns an HTML page with:
- Song metadata (title, artist, artwork)
- Links to all supported platforms
- Open graph meta tags for social sharing
- Automatic redirect to preferred platform

### Health Check

```http
GET /health
```

Returns worker status and version information.

### Static Assets

```http
GET /assets/logos/{platform}.png
```

Serves music platform logos.

## Security Features

### Rate Limiting
- 60 requests per minute per IP address
- Configurable via KV namespace
- Returns 429 Too Many Requests when exceeded

### Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### XSS Protection
- HTML escaping for all user inputs
- Sanitized URL parameters
- Safe error messages

### GDPR Compliance
- Cookie consent banner
- Privacy-focused analytics opt-in
- Clear data usage descriptions

## Caching Strategy

### KV Caching
- Song metadata cached for 24 hours
- Reduces API calls to backend
- Improves response times

### Browser Caching
- Static assets: 1 year
- HTML pages: 5 minutes
- API responses: No cache

## Monitoring

### Cloudflare Analytics
- Request count and bandwidth
- Error rates and status codes
- Geographic distribution

### Custom Logging
- Debug logging (disabled in production)
- Error tracking
- Performance metrics

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `UNITUNE_API_ENDPOINT` | Backend API URL | Yes | - |
| `ADSENSE_PUBLISHER_ID` | Google AdSense ID | No | - |
| `ENVIRONMENT` | Environment name | No | `production` |
| `DEBUG_LOGGING` | Enable debug logs | No | `false` |
| `WORKER_VERSION` | Worker version | No | `2.2.0` |

## Deep Link Configuration

### Android App Links
File: `.well-known/assetlinks.json`

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "de.unitune.unitune",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

### iOS Universal Links
File: `.well-known/apple-app-site-association`

```json
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAM_ID.com.example.unitune",
      "paths": ["/s/*", "/open"]
    }]
  }
}
```

## Testing

```bash
# Test locally
wrangler dev

# Test rate limiting
for i in {1..70}; do curl http://localhost:8787/?url=test; done

# Test caching
curl -I http://localhost:8787/?url=https://open.spotify.com/track/example
```

## Troubleshooting

### Worker not deploying
- Check Wrangler authentication: `wrangler whoami`
- Verify KV namespace IDs in `wrangler.toml`
- Check Cloudflare account limits

### Rate limiting issues
- Clear KV namespace: `wrangler kv:key delete --namespace-id=... "rate:IP"`
- Adjust rate limit in `security/rate_limiter.js`

### Caching problems
- Clear song cache: `wrangler kv:key delete --namespace-id=... "song:URL"`
- Check cache TTL settings

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## Related Projects

- [unitune](https://github.com/FlazeIGuess/unitune) - Flutter mobile application
- [unitune-api](https://github.com/FlazeIGuess/unitune-api) - Backend API service

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

See [LICENSE](LICENSE) for details.

### Attribution Requirement
Any use, modification, or distribution of this software must include proper attribution to the original author and project.

## Support

- **Issues**: [GitHub Issues](https://github.com/FlazeIGuess/unitune-worker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FlazeIGuess/unitune-worker/discussions)

---

Powered by Cloudflare Workers
