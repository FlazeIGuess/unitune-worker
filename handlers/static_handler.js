import { addSecurityHeaders } from '../security/headers.js';
import { addCacheHeaders, generateETag, checkETag, createNotModifiedResponse, CACHE_CONFIG } from '../security/cache_headers.js';
import { getPrivacyPolicy, getAppPrivacyPolicy, getAssetLinks, getAppleAppSiteAssociation } from '../templates/static_content.js';
import { getHomePage } from '../templates/home_page.js';
import { getAboutPage, getContactPage, getFaqPage, getHowItWorksPage, getFeaturesPage } from '../templates/content_pages.js';

/**
 * Handle static routes like health, privacy, ads.txt, etc.
 */

export async function handleHealth() {
    return addSecurityHeaders(new Response('OK', { status: 200 }));
}

export async function handlePrivacy(request) {
    const content = getPrivacyPolicy();

    // Generate ETag for content
    const etag = await generateETag(content);

    // Check if client has cached version
    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.PRIVACY_POLICY));
    }

    const response = new Response(content, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.PRIVACY_POLICY, content));
}

export async function handleAppPrivacy(request) {
    const content = getAppPrivacyPolicy();

    // Generate ETag for content
    const etag = await generateETag(content);

    // Check if client has cached version
    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.PRIVACY_POLICY));
    }

    const response = new Response(content, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.PRIVACY_POLICY, content));
}

export async function handleAdsTxt(request, config) {
    // Read AdSense publisher ID from environment variable
    const pubId = config.adsensePublisherId.replace('ca-', '');
    const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;

    // Generate ETag for content
    const etag = await generateETag(content);

    // Check if client has cached version
    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
    }

    const response = new Response(content, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
}

export async function handleAppAdsTxt(request, config) {
    // app-ads.txt for AdMob (mobile apps)
    // Format: google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
    const pubId = config.adsensePublisherId.replace('ca-', '');
    const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;

    // Generate ETag for content
    const etag = await generateETag(content);

    // Check if client has cached version
    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
    }

    const response = new Response(content, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
}

export async function handleAssetLinks(request) {
    const content = getAssetLinks();

    // Generate ETag for content
    const etag = await generateETag(content);

    // Check if client has cached version
    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
    }

    const response = new Response(content, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
}

export async function handleAppleAppSiteAssociation(request) {
    const content = getAppleAppSiteAssociation();

    // Generate ETag for content
    const etag = await generateETag(content);

    // Check if client has cached version
    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
    }

    const response = new Response(content, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
}

export async function handleHomepage(request, config) {
    const content = getHomePage(config.adsensePublisherId);

    // Generate ETag for content
    const etag = await generateETag(content);

    // Check if client has cached version
    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.HOMEPAGE));
    }

    const response = new Response(content, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.HOMEPAGE, content));
}

export async function handleOptionsRequest() {
    return addSecurityHeaders(new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': 'https://unitune.art',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    }));
}

export async function handleAbout(request, config) {
    const content = getAboutPage(config.adsensePublisherId);
    const etag = await generateETag(content);

    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
    }

    const response = new Response(content, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
}

export async function handleContact(request, config) {
    const content = getContactPage(config.adsensePublisherId);
    const etag = await generateETag(content);

    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
    }

    const response = new Response(content, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
}

export async function handleFaq(request, config) {
    const content = getFaqPage(config.adsensePublisherId);
    const etag = await generateETag(content);

    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
    }

    const response = new Response(content, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
}

export async function handleHowItWorks(request, config) {
    const content = getHowItWorksPage(config.adsensePublisherId);
    const etag = await generateETag(content);

    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
    }

    const response = new Response(content, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
}

export async function handleFeatures(request, config) {
    const content = getFeaturesPage(config.adsensePublisherId);
    const etag = await generateETag(content);

    if (checkETag(request, etag)) {
        return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
    }

    const response = new Response(content, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

    return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
}
