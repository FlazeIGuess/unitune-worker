/**
 * GDPR Consent Manager
 * 
 * Manages user consent for advertising cookies in compliance with GDPR.
 * Provides functions to check consent status, set consent cookies, and generate
 * consent banner HTML and JavaScript.
 * 
 * Requirements: 10.1, 10.2, 10.5
 */

const COOKIE_NAME = 'unitune_cookie_consent';
const COOKIE_EXPIRY_DAYS = 365;

/**
 * Checks if user has given consent for advertising
 * 
 * @param {Request} request - The incoming request
 * @returns {string|null} - 'accepted', 'rejected', or null if no consent given yet
 */
export function getConsentStatus(request) {
    const cookieHeader = request.headers.get('Cookie');
    
    if (!cookieHeader) {
        return null;
    }
    
    // Parse cookies
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {});
    
    const consentValue = cookies[COOKIE_NAME];
    
    if (consentValue === 'accepted') {
        return 'accepted';
    } else if (consentValue === 'rejected') {
        return 'rejected';
    }
    
    return null;
}

/**
 * Sets consent cookie
 * 
 * @param {Response} response - The response to add cookie to
 * @param {string} status - 'accepted' or 'rejected'
 * @returns {Response} - Response with consent cookie
 */
export function setConsentCookie(response, status) {
    if (status !== 'accepted' && status !== 'rejected') {
        throw new Error('Invalid consent status. Must be "accepted" or "rejected".');
    }
    
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
    
    const cookieValue = `${COOKIE_NAME}=${status}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax; Secure`;
    
    // Create new response with cookie header
    const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers)
    });
    
    newResponse.headers.append('Set-Cookie', cookieValue);
    
    return newResponse;
}

/**
 * Generates consent banner HTML
 * 
 * @returns {string} - HTML for consent banner
 */
export function getConsentBannerHtml() {
    return `
    <div id="privacy-notice">
        <div class="notice-content">
            <div class="notice-text">
                We use technologies to improve your experience and show relevant content. 
                By clicking "Accept", you consent to our use. 
                <a href="/privacy">Learn more</a>
            </div>
            <div class="notice-actions">
                <button id="notice-accept" class="action-btn action-btn-primary">Accept</button>
                <button id="notice-decline" class="action-btn action-btn-secondary">Decline</button>
                <button id="notice-more" class="action-btn action-btn-tertiary">More Info</button>
            </div>
        </div>
    </div>
    `;
}

/**
 * Generates consent banner JavaScript
 * 
 * @returns {string} - JavaScript for consent handling
 */
export function getConsentBannerScript() {
    return `
    <script>
    (function() {
        const COOKIE_NAME = 'unitune_cookie_consent';
        const COOKIE_EXPIRY_DAYS = 365;

        function setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
        }

        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function loadAds() {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8547021258440704';
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);

            script.onload = function() {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    // Silent fail - no logging for privacy
                }
            };
        }

        function acceptConsent() {
            setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
            const notice = document.getElementById('privacy-notice');
            if (notice) {
                notice.classList.remove('visible');
            }
            loadAds();
        }

        function declineConsent() {
            setCookie(COOKIE_NAME, 'rejected', COOKIE_EXPIRY_DAYS);
            const notice = document.getElementById('privacy-notice');
            if (notice) {
                notice.classList.remove('visible');
            }
        }

        function showMoreInfo() {
            window.location.href = '/privacy';
        }

        function withdrawConsent() {
            // Delete consent cookie by setting expiry in the past
            document.cookie = COOKIE_NAME + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure';
            // Show banner again so user can re-choose
            const notice = document.getElementById('privacy-notice');
            if (notice) {
                notice.classList.add('visible');
            }
        }

        function init() {
            const consent = getCookie(COOKIE_NAME);
            
            if (consent === 'accepted') {
                loadAds();
            } else if (consent !== 'rejected') {
                // Show notice for new users
                const notice = document.getElementById('privacy-notice');
                if (notice) {
                    notice.classList.add('visible');
                }
            }

            // Attach event listeners
            const acceptBtn = document.getElementById('notice-accept');
            const declineBtn = document.getElementById('notice-decline');
            const moreBtn = document.getElementById('notice-more');
            
            if (acceptBtn) acceptBtn.addEventListener('click', acceptConsent);
            if (declineBtn) declineBtn.addEventListener('click', declineConsent);
            if (moreBtn) moreBtn.addEventListener('click', showMoreInfo);

            // Wire up all "Withdraw Ad Consent" links in the footer and policy page
            const withdrawLinks = document.querySelectorAll(
                '#footer-withdraw-consent, #footer-withdraw-link'
            );
            withdrawLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    withdrawConsent();
                });
            });
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();
    </script>
    `;
}

/**
 * Generates CSS styles for the consent banner
 * 
 * @returns {string} - CSS for consent banner
 */
export function getConsentBannerStyles() {
    return `
    /* Privacy Notice */
    #privacy-notice {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px;
        padding-bottom: max(20px, env(safe-area-inset-bottom));
        z-index: 10000;
        display: none;
    }

    #privacy-notice.visible {
        display: block !important;
        animation: slideUpBanner 0.3s ease-out forwards;
    }
    
    @keyframes slideUpBanner {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .notice-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .notice-text {
        color: #E5E7EB;
        font-size: 14px;
        line-height: 1.6;
    }

    .notice-text a {
        color: #4c3bf9;
        text-decoration: none;
    }

    .notice-text a:hover {
        text-decoration: underline;
    }

    .notice-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .action-btn {
        padding: 12px 24px;
        border-radius: 12px;
        border: none;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: var(--font-stack);
    }

    .action-btn-primary {
        background: #4c3bf9;
        color: white;
    }

    .action-btn-primary:hover {
        background: #3d2fd9;
        transform: translateY(-1px);
    }

    .action-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .action-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    .action-btn-tertiary {
        background: transparent;
        color: #9CA3AF;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .action-btn-tertiary:hover {
        background: rgba(255, 255, 255, 0.05);
        color: white;
    }

    @media (min-width: 640px) {
        .notice-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }

        .notice-actions {
            flex-shrink: 0;
        }
    }
    `;
}
