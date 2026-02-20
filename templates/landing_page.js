import { escapeHtml } from '../security/html_escaper.js';
import { isValidThumbnailUrl } from '../utils/url_validator.js';
import { getCommonStyles, getCookieBannerStyles } from './styles.js';
import { getCookieBannerHTML, getCookieBannerScript } from './cookie_banner.js';
import { getNavigationBar, getFooter } from './navigation.js';
import { SERVICES } from '../constants/services.js';
import { getDonationCard, getHorizontalDonationBanner, getDonationsStyles, getDonationsScript } from './donations.js';

export function getLandingPage({ title, artist, thumbnail, links, musicUrl, adsensePublisherId }) {
    const encodedMusicUrl = encodeURIComponent(musicUrl);

    // Escape user-provided data to prevent XSS attacks
    const escapedTitle = escapeHtml(title);
    const escapedArtist = escapeHtml(artist);

    // Validate and sanitize thumbnail URL
    // Only use thumbnail if it's from a trusted HTTPS source
    const validatedThumbnail = isValidThumbnailUrl(thumbnail) ? escapeHtml(thumbnail) : '';
    const escapedThumbnail = validatedThumbnail;

    // UniTune Logo SVG
    const unituneLogoSvg = `
      <svg viewBox="0 0 842.13 985.84" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <path class="logo-path" d="M27.4,66.27c47.21-1.28,89.07,6.86,126.48,38.09,66.15,55.21,60.95,144.27,61.18,221.93l.08,181.23c-.06,37.69-.86,74.85,1.61,112.49,6.97,106.45,93.55,175.65,199.23,165.87,42.47-3.55,83.05-19.14,116.97-44.95,92.36-69.31,92.93-166.31,91.37-269.59-.81-53.71-.31-108.8-.54-162.62.54-8.04-1.42-37.8,5.3-42.69,16.26-11.84,61.03,23.88,70.98,33.39,40.76,38.96,42.64,101.83,43.46,154.32.27,25.33.36,50.67.3,76-.11,28.44.91,59.71-.19,87.72-3.47,84.27-23.66,162.29-76.5,229.62-127.43,162.4-369.95,181.63-532.07,60.97C60.91,852.85,16.04,761.04,3.14,670.93c-4.6-32.15-2.79-71.35-2.76-104.35l.03-154.11.05-198.05c-.06-37.93-.93-76.13.76-114,.82-18.45,6-31.92,26.19-34.14Z"/>
        <path class="logo-path" d="M548.39.27c32.61-1.76,32.41,4.66,45.8,30.51,13.33,25.75,39.38,45.82,63.55,61.14,59.59,38.01,123.95,60.45,161.72,125.48,35.17,60.55,31.75,164.75-26.84,211.97-1.84,1.48-4.59.74-6.61.17-2.7-2.29-5.04-5.81-5.16-9.34-1.14-34.32-4.14-64.88-16.53-97.5-17.4-45.81-55.32-75.56-99.64-93.86-20.16-8.32-45.76-16.27-67.19-7.41l-1.19.51c-3.33,4.16-8.05,10.61-8.7,15.95-3.52,28.74-2.76,61.05-2.78,89.91l.27,153.28c-.02,33.57,1.23,59.36-1.59,93.15-11.16,83.39-58.86,146.18-141.48,168.21-126.33,33.67-234.19-80.57-162.98-199.56,36.36-60.76,103.18-96.85,173.8-90.85,17.49,1.38,59.93,24.05,67.19-4.54,3.74-26.18,2.01-61.22,1.97-88.52l-.05-205.92c-.01-37.68-.88-75.74.72-113.35.98-23.07,1.95-33.98,25.72-39.44Z"/>
      </svg>
    `;

    let serviceButtons = '';
    for (const [key, service] of Object.entries(SERVICES)) {
        const link = links[key]?.url;
        if (link) {
            serviceButtons += `
            <a href="${link}" class="service-row">
                <div class="service-left">
                    <div class="service-icon">
                        <img src="${service.logo}" alt="${service.name}" width="24" height="24" loading="lazy">
                    </div>
                    <span class="service-name">${service.name}</span>
                </div>
                <div class="service-action">Play</div>
            </a>
            `;
        }
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="google-adsense-account" content="${adsensePublisherId}">
  <title>${escapedTitle} - ${escapedArtist}</title>
  
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedArtist}">
  <meta property="og:image" content="${escapedThumbnail}">
  <meta property="og:url" content="https://unitune.art/s/${encodedMusicUrl}">
  <meta property="og:type" content="music.song">
  <meta property="og:site_name" content="UniTune">
  <meta name="theme-color" content="#0D1117">
  <meta name="apple-itunes-app" content="app-id=YOUR_APP_ID, app-argument=unitune://open?url=${encodedMusicUrl}">
  
  <style>
    ${getCommonStyles()}
    ${getCookieBannerStyles()}
    ${getDonationsStyles()}

    .main-wrapper {
        width: 100%;
        max-width: min(480px, 100vw - 32px);
        padding: clamp(16px, 4vw, 24px);
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
    }

    /* Hero Section with Album Art */
    .hero {
        margin-top: 20px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
        animation: fadeIn 0.6s ease-out;
    }

    /* Get UniTune App Button */
    .get-app-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 16px 24px;
        margin-bottom: 24px;
        text-decoration: none;
        color: var(--text-primary);
        font-size: 16px;
        font-weight: 600;
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.2), rgba(88, 166, 255, 0.1));
        border: 1px solid rgba(88, 166, 255, 0.3);
        animation: scaleIn 0.5s ease-out;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .get-app-btn:hover {
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.3), rgba(88, 166, 255, 0.15));
        box-shadow: 0 0 30px var(--accent-glow);
        transform: translateY(-2px);
    }
    
    .get-app-btn:active {
        transform: scale(0.98);
    }
    
    .app-icon {
        font-size: 20px;
    }

    .album-art-container {
        position: relative;
        width: clamp(180px, 50vw, 240px);
        height: clamp(180px, 50vw, 240px);
        margin-bottom: clamp(24px, 5vw, 32px);
    }

    .album-art {
        width: 100%;
        height: 100%;
        border-radius: 24px;
        object-fit: cover;
        position: relative;
        z-index: 2;
        box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
    }

    /* The glowing effect behind the album art */
    .album-glow {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        background-image: url('${thumbnail}');
        background-size: cover;
        filter: blur(50px) saturate(200%) brightness(1.2);
        opacity: 0.6;
        z-index: 1;
        border-radius: 50%;
        animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
    }

    .song-info {
        width: 100%;
        padding: 0 10px;
    }

    .song-title {
        font-family: var(--font-heading);
        font-size: 32px;
        font-weight: 800;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
        line-height: 1.1;
        background: linear-gradient(to right, #fff, #e0e0e0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .artist-name {
        font-size: 18px;
        font-weight: 500;
        color: var(--text-secondary);
        letter-spacing: -0.2px;
    }

    /* Ad Container */
    .ad-container {
        width: 100%;
        padding: 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        margin-top: 16px;
        margin-bottom: 24px;
        text-align: center;
    }

    .ad-label {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.3);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        font-weight: 600;
    }

    .adsbygoogle {
        background: transparent !important;
        min-height: 50px;
        max-height: 100px;
        display: block;
        border-radius: 8px;
        overflow: hidden;
    }
    
    @media (min-width: 640px) {
        .adsbygoogle {
            min-height: 90px;
            max-height: 120px;
        }
    }
    
    /* Open in App Button */
    .open-app-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 16px 24px;
        margin-bottom: 24px;
        text-decoration: none;
        color: var(--text-primary);
        font-size: 16px;
        font-weight: 600;
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.2), rgba(88, 166, 255, 0.1));
        border-color: rgba(88, 166, 255, 0.3);
        animation: scaleIn 0.5s ease-out;
    }
    
    .open-app-btn:hover {
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.3), rgba(88, 166, 255, 0.15));
        box-shadow: 0 0 30px rgba(88, 166, 255, 0.3);
    }
    
    .app-icon {
        font-size: 20px;
    }

    /* List Container */
    .links-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-bottom: 20px;
    }

    .service-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 14px 18px;
        border-radius: 16px;
        
        /* Liquid Glass Effect */
        background: var(--glass-base);
        border: 0.5px solid var(--glass-border);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 0 var(--glass-highlight);
        
        text-decoration: none;
        color: white;
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .service-row:nth-child(1) { animation: slideUp 0.4s ease-out 0.1s backwards; }
    .service-row:nth-child(2) { animation: slideUp 0.4s ease-out 0.15s backwards; }
    .service-row:nth-child(3) { animation: slideUp 0.4s ease-out 0.2s backwards; }
    .service-row:nth-child(4) { animation: slideUp 0.4s ease-out 0.25s backwards; }
    .service-row:nth-child(5) { animation: slideUp 0.4s ease-out 0.3s backwards; }
    .service-row:nth-child(6) { animation: slideUp 0.4s ease-out 0.35s backwards; }


    .service-row:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                    0 0 20px var(--accent-glow);
        border-color: var(--primary);
    }

    .service-row:active {
        transform: scale(0.98);
        background: rgba(255,255,255,0.06);
    }

    .service-left {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .service-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .service-icon img,
    .service-icon svg {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 6px;
    }

    .service-name {
        font-size: 17px;
        font-weight: 600;
        letter-spacing: -0.3px;
    }

    .service-action {
        font-size: 13px;
        font-weight: 600;
        color: rgba(255,255,255,0.6);
        background: rgba(255,255,255,0.1);
        padding: 6px 14px;
        border-radius: 100px;
        transition: background 0.2s;
    }
    
    .service-row:hover .service-action {
        background: rgba(255,255,255,0.2);
        color: white;
    }

    /* Footer */
    .footer {
        margin-top: auto;
        padding-top: 20px;
        text-align: center;
        font-size: 13px;
        color: rgba(255,255,255,0.3);
        display: flex;
        gap: 15px;
        justify-content: center;
    }

    .footer a {
        color: inherit;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }

    .footer a:hover {
        color: rgba(255,255,255,0.6);
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  ${getNavigationBar()}
  ${getHorizontalDonationBanner()}
  <div class="main-wrapper">
    <div class="hero">
        <div class="album-art-container">
            <div class="album-glow"></div>
            ${thumbnail ? `<img src="${escapedThumbnail}" alt="Album Art" class="album-art" crossorigin="anonymous" id="album-art-img">` : ''}
        </div>
        <div class="song-info">
            <h1 class="song-title">${escapedTitle}</h1>
            <p class="artist-name">${escapedArtist}</p>
        </div>
    </div>
    <a href="unitune://open?url=${encodedMusicUrl}&title=${encodeURIComponent(escapedTitle)}&artist=${encodeURIComponent(escapedArtist)}&source=web" id="open-app-btn" class="get-app-btn glass-card">
        <div class="app-logo">${unituneLogoSvg}</div>
        <span>Open in UniTune</span>
    </a>
    
    <div class="links-container">
        ${serviceButtons}
    </div>
    
    <!-- Google AdSense (GDPR-compliant, loaded only with consent) -->
    <div class="ad-container" id="ad-container-bottom">
        <div class="ad-label">Advertisement</div>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${adsensePublisherId}"
             data-ad-slot="1801419133"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
    </div>
    
    <div class="footer">
        <a href="/">UniTune</a>
        <span>•</span>
        <a href="/privacy">Privacy</a>
    </div>
  </div>
  
  ${getFooter()}
  
  ${getCookieBannerHTML()}
  
  ${getCookieBannerScript(adsensePublisherId)}
  
  <script>
    (function() {
        const appUrl = 'unitune://open?url=${encodedMusicUrl}&title=${encodeURIComponent(escapedTitle)}&artist=${encodeURIComponent(escapedArtist)}&source=web';
        const appStoreUrl = 'https://apps.apple.com/app/unitune';
        const playStoreUrl = 'https://play.google.com/store/apps/details?id=de.unitune.unitune';
        
        let appOpened = false;
        let hiddenTime = null;
        
        // Detect if user left the page (app opened)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                hiddenTime = Date.now();
                appOpened = true;
            }
        });
        
        // Try to open app automatically
        function tryOpenApp() {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = appUrl;
            document.body.appendChild(iframe);
            
            // Also try direct navigation after short delay
            setTimeout(function() {
                if (!appOpened) {
                    window.location.href = appUrl;
                }
            }, 100);
            
            // Check if app opened after timeout
            setTimeout(function() {
                if (iframe.parentNode) {
                    document.body.removeChild(iframe);
                }
                if (!appOpened) {
                    // App not installed - show the "Open in App" button as download
                    const openAppBtn = document.getElementById('open-app-btn');
                    if (openAppBtn) {
                        openAppBtn.innerHTML = '<div class="app-logo">${unituneLogoSvg.replace(/'/g, "\\'")}</div><span>Get UniTune App</span>';
                        openAppBtn.href = 'https://github.com/FlazeIGuess/unitune';
                    }
                }
            }, 2000);
        }
        
        // Try opening app on page load
        setTimeout(tryOpenApp, 500);

        // Color extraction for dynamic theming
        const img = document.getElementById('album-art-img');
        if (img && img.complete) {
            extractColors();
        } else if (img) {
            img.addEventListener('load', extractColors);
        }

        function extractColors() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = document.getElementById('album-art-img');
                
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                
                const colorMap = {};
                const sampleRate = 10;
                
                for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const a = pixels[i + 3];
                    
                    if (a < 125 || (r + g + b) < 50 || (r + g + b) > 700) continue;
                    
                    const qr = Math.round(r / 10) * 10;
                    const qg = Math.round(g / 10) * 10;
                    const qb = Math.round(b / 10) * 10;
                    const key = qr + ',' + qg + ',' + qb;
                    
                    colorMap[key] = (colorMap[key] || 0) + 1;
                }
                
                let dominantColor = null;
                let maxCount = 0;
                
                for (const color in colorMap) {
                    if (colorMap[color] > maxCount) {
                        maxCount = colorMap[color];
                        dominantColor = color;
                    }
                }
                
                if (dominantColor) {
                    const parts = dominantColor.split(',');
                    const r = parseInt(parts[0]);
                    const g = parseInt(parts[1]);
                    const b = parseInt(parts[2]);
                    
                    const root = document.documentElement;
                    root.style.setProperty('--primary', 'rgb(' + r + ', ' + g + ', ' + b + ')');
                    root.style.setProperty('--primary-light', 'rgb(' + Math.min(r + 30, 255) + ', ' + Math.min(g + 30, 255) + ', ' + Math.min(b + 30, 255) + ')');
                    root.style.setProperty('--primary-dark', 'rgb(' + Math.max(r - 30, 0) + ', ' + Math.max(g - 30, 0) + ', ' + Math.max(b - 30, 0) + ')');
                    root.style.setProperty('--accent-glow', 'rgba(' + r + ', ' + g + ', ' + b + ', 0.4)');
                    
                    document.body.style.backgroundImage = 'radial-gradient(ellipse 150% 80% at 50% -10%, rgba(' + r + ', ' + g + ', ' + b + ', 0.15) 0%, rgba(13, 17, 23, 0.95) 50%, #0D1117 100%)';
                }
            } catch (e) {
                console.error('Color extraction failed:', e);
            }
        }
    })();
  </script>
  
  ${getDonationsScript()}
</body>
</html>`;
}
