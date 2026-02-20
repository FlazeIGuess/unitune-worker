export function getCookieBannerScript(adsensePublisherId) {
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
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}';
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

export function getCookieBannerHTML() {
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
