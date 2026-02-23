import { escapeHtml } from '../security/html_escaper.js';
import { isValidThumbnailUrl } from '../utils/url_validator.js';
import { getCommonStyles } from '../templates/styles.js';
import { SERVICES } from '../constants/services.js';
import { addSecurityHeaders } from '../security/headers.js';
import { getHorizontalDonationBanner, getDonationsStyles, getDonationsScript } from '../templates/donations.js';

/**
 * Client-Side loading page for normal users
 * JavaScript will fetch data via our API proxy
 * Now includes actual metadata in Open Graph tags for messaging app previews
 */
export function getClientSideLoadingPage(musicUrl, metadata, config) {
    const escapedMusicUrl = escapeHtml(musicUrl);
    const encodedMusicUrl = encodeURIComponent(musicUrl);
    
    // Extract metadata for Open Graph tags
    const entities = Object.values(metadata?.entitiesByUniqueId || {});
    const firstEntity = entities[0] || {};
    const entityType = firstEntity.type || 'song';
    
    // Handle different content types
    let title, artist;
    if (entityType === 'artist') {
        // For artists, use name as title and "Artist" as subtitle
        title = firstEntity.name || firstEntity.artistName || 'Unknown Artist';
        artist = 'Artist';
    } else if (entityType === 'album') {
        // For albums, use album title and artist name
        title = firstEntity.title || 'Unknown Album';
        artist = firstEntity.artistName || 'Unknown Artist';
    } else {
        // For tracks (songs)
        title = firstEntity.title || 'Unknown Song';
        artist = firstEntity.artistName || 'Unknown Artist';
    }
    
    const thumbnail = firstEntity.thumbnailUrl || 'https://unitune.art/logo.png';
    
    // Validate and escape
    const escapedTitle = escapeHtml(title);
    const escapedArtist = escapeHtml(artist);
    const validatedThumbnail = isValidThumbnailUrl(thumbnail) ? escapeHtml(thumbnail) : 'https://unitune.art/logo.png';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="google-adsense-account" content="${config.adsensePublisherId}">
  <title>${escapedTitle} - ${escapedArtist}</title>
  
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedArtist}">
  <meta property="og:image" content="${validatedThumbnail}">
  <meta property="og:url" content="https://unitune.art/s/${encodedMusicUrl}">
  <meta property="og:type" content="music.song">
  <meta name="theme-color" content="#0D1117">
  
  <!-- AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsensePublisherId}" crossorigin="anonymous"></script>
  
  <style>
    ${getCommonStyles()}
    ${getDonationsStyles()}
    
    .main-wrapper {
        width: 100%;
        max-width: min(480px, 100vw - 32px);
        padding: clamp(16px, 4vw, 24px);
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        justify-content: flex-start;
    }

    #loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        text-align: center;
        animation: fadeIn 0.5s ease-out;
    }

    .spinner {
        border: 4px solid rgba(255,255,255,0.1);
        border-top: 4px solid var(--primary);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite;
        margin-bottom: 24px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading-text {
        font-size: 18px;
        color: var(--text-secondary);
        margin-bottom: 12px;
    }

    .loading-subtext {
        font-size: 14px;
        color: var(--text-muted);
    }

    #content-state {
        display: none;
        width: 100%;
        animation: fadeIn 0.5s ease-out;
    }

    #error-state {
        display: none;
        text-align: center;
        animation: fadeIn 0.5s ease-out;
    }

    .error-icon {
        font-size: 64px;
        margin-bottom: 24px;
    }

    .error-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--text-primary);
    }

    .error-message {
        font-size: 16px;
        color: var(--text-secondary);
        margin-bottom: 24px;
        line-height: 1.5;
    }

    .retry-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .retry-button:hover {
        background: var(--primary-light);
        transform: translateY(-2px);
    }

    .original-link {
        margin-top: 16px;
    }

    .original-link a {
        color: var(--primary);
        text-decoration: none;
        font-size: 14px;
    }

    .original-link a:hover {
        text-decoration: underline;
    }

    /* Content styles (same as landing page) */
    .hero {
        margin-top: 20px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
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

    .album-glow {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        background-size: cover;
        filter: blur(40px) saturate(180%);
        opacity: 0.5;
        z-index: 1;
        border-radius: 50%;
    }

    .song-info {
        width: 100%;
        padding: 0 10px;
    }

    .song-title {
        font-size: 32px;
        font-weight: 800;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
        line-height: 1.1;
        background: linear-gradient(to right, #fff, #e0e0e0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .artist-name {
        font-size: 18px;
        font-weight: 500;
        color: var(--text-secondary);
        letter-spacing: -0.2px;
    }

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
        background: var(--glass-base);
        border: 0.5px solid var(--glass-border);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 0 var(--glass-highlight);
        text-decoration: none;
        color: white;
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .service-row:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                    0 0 20px var(--accent-glow);
        border-color: var(--primary);
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

    .service-icon img {
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
    }

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
    
    /* Ad Container */
    .ad-container {
        width: 100%;
        padding: 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        margin: 24px 0;
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
  </style>
</head>
<body>
  ${getHorizontalDonationBanner()}
  
  <div class="main-wrapper">
    <!-- Loading State -->
    <div id="loading-state">
      <div class="spinner"></div>
      <div class="loading-text">Loading song information...</div>
      <div class="loading-subtext">Fetching from music platforms</div>
    </div>

    <!-- Content State (filled by JavaScript) -->
    <div id="content-state"></div>

    <!-- Error State -->
    <div id="error-state">
      <h1 class="error-title">Unable to Load</h1>
      <p class="error-message" id="error-message"></p>
      <button class="retry-button" onclick="location.reload()">
        <span>Try Again</span>
      </button>
      <div class="original-link">
        <a href="${escapedMusicUrl}" target="_blank">Open Original Link →</a>
      </div>
    </div>

    <div class="footer">
      <a href="/">UniTune</a>
      <span>•</span>
      <a href="/privacy">Privacy</a>
    </div>
  </div>

  <script>
    const MUSIC_URL = ${JSON.stringify(musicUrl)};
    const API_PROXY = '/api/song';
    const SERVICES = ${JSON.stringify(SERVICES)};

    // UniTune Logo SVG (dynamically colored)
    const UNITUNE_LOGO_SVG = \`
      <svg viewBox="0 0 842.13 985.84" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <path class="logo-path" d="M27.4,66.27c47.21-1.28,89.07,6.86,126.48,38.09,66.15,55.21,60.95,144.27,61.18,221.93l.08,181.23c-.06,37.69-.86,74.85,1.61,112.49,6.97,106.45,93.55,175.65,199.23,165.87,42.47-3.55,83.05-19.14,116.97-44.95,92.36-69.31,92.93-166.31,91.37-269.59-.81-53.71-.31-108.8-.54-162.62.54-8.04-1.42-37.8,5.3-42.69,16.26-11.84,61.03,23.88,70.98,33.39,40.76,38.96,42.64,101.83,43.46,154.32.27,25.33.36,50.67.3,76-.11,28.44.91,59.71-.19,87.72-3.47,84.27-23.66,162.29-76.5,229.62-127.43,162.4-369.95,181.63-532.07,60.97C60.91,852.85,16.04,761.04,3.14,670.93c-4.6-32.15-2.79-71.35-2.76-104.35l.03-154.11.05-198.05c-.06-37.93-.93-76.13.76-114,.82-18.45,6-31.92,26.19-34.14Z"/>
        <path class="logo-path" d="M548.39.27c32.61-1.76,32.41,4.66,45.8,30.51,13.33,25.75,39.38,45.82,63.55,61.14,59.59,38.01,123.95,60.45,161.72,125.48,35.17,60.55,31.75,164.75-26.84,211.97-1.84,1.48-4.59.74-6.61.17-2.7-2.29-5.04-5.81-5.16-9.34-1.14-34.32-4.14-64.88-16.53-97.5-17.4-45.81-55.32-75.56-99.64-93.86-20.16-8.32-45.76-16.27-67.19-7.41l-1.19.51c-3.33,4.16-8.05,10.61-8.7,15.95-3.52,28.74-2.76,61.05-2.78,89.91l.27,153.28c-.02,33.57,1.23,59.36-1.59,93.15-11.16,83.39-58.86,146.18-141.48,168.21-126.33,33.67-234.19-80.57-162.98-199.56,36.36-60.76,103.18-96.85,173.8-90.85,17.49,1.38,59.93,24.05,67.19-4.54,3.74-26.18,2.01-61.22,1.97-88.52l-.05-205.92c-.01-37.68-.88-75.74.72-113.35.98-23.07,1.95-33.98,25.72-39.44Z"/>
      </svg>
    \`;

    async function loadSongData() {
      try {
        const response = await fetch(
          API_PROXY + '?url=' + encodeURIComponent(MUSIC_URL)
        );

        if (response.status === 429) {
          showError(
            'Too Many Requests',
            'The music service is currently rate-limited. Please wait a moment and try again.\\n\\nRate limit: 10 requests per minute'
          );
          return;
        }

        if (!response.ok) {
          showError(
            'Song Not Found',
            'This song could not be found on streaming platforms. The link might be invalid or the song might not be available.'
          );
          return;
        }

        const data = await response.json();
        renderSongPage(data);

      } catch (error) {
        console.error('Error loading song:', error);
        showError(
          'Connection Error',
          'Unable to connect to the music service. Please check your internet connection and try again.'
        );
      }
    }

    function renderSongPage(data) {
      const entities = Object.values(data.entitiesByUniqueId || {});
      const firstEntity = entities[0] || {};
      const entityType = firstEntity.type || 'song';
      
      // Handle different content types
      let title, artist;
      if (entityType === 'artist') {
        // For artists, use name as title and "Artist" as subtitle
        title = firstEntity.name || firstEntity.artistName || 'Unknown Artist';
        artist = 'Artist';
      } else if (entityType === 'album') {
        // For albums, use album title and artist name
        title = firstEntity.title || 'Unknown Album';
        artist = firstEntity.artistName || 'Unknown Artist';
      } else {
        // For tracks (songs)
        title = firstEntity.title || 'Unknown Song';
        artist = firstEntity.artistName || 'Unknown Artist';
      }
      
      const thumbnail = firstEntity.thumbnailUrl || '';
      const links = data.linksByPlatform || {};

      // Update page title
      document.title = title + ' - ' + artist;

      // Build service buttons
      let serviceButtons = '';
      for (const [key, service] of Object.entries(SERVICES)) {
        const link = links[key]?.url;
        if (link) {
          serviceButtons += \`
            <a href="\${link}" class="service-row">
              <div class="service-left">
                <div class="service-icon">
                  <img src="\${service.logo}" alt="\${service.name}" loading="lazy">
                </div>
                <span class="service-name">\${service.name}</span>
              </div>
              <div class="service-action">Play</div>
            </a>
          \`;
        }
      }

      // Render content
      document.getElementById('content-state').innerHTML = \`
        <div class="hero">
          <div class="album-art-container">
            <div class="album-glow" style="background-image: url('\${thumbnail}')"></div>
            \${thumbnail ? \`<img src="\${thumbnail}" alt="Album Art" class="album-art" crossorigin="anonymous" id="album-art-img">\` : ''}
          </div>
          <div class="song-info">
            <h1 class="song-title">\${escapeHtml(title)}</h1>
            <p class="artist-name">\${escapeHtml(artist)}</p>
          </div>
        </div>
        <a href="unitune://open?url=\${encodeURIComponent(MUSIC_URL)}&title=\${encodeURIComponent(title)}&artist=\${encodeURIComponent(artist)}" class="get-app-btn glass-card">
          <div class="app-logo">\${UNITUNE_LOGO_SVG}</div>
          <span>Open in UniTune</span>
        </a>
        <div class="links-container">
          \${serviceButtons}
        </div>
        
        <!-- Google AdSense -->
        <div class="ad-container" id="ad-container-bottom">
            <div class="ad-label">Advertisement</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${config.adsensePublisherId}"
                 data-ad-slot="1801419133"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
      \`;

      // Show content, hide loading
      document.getElementById('loading-state').style.display = 'none';
      document.getElementById('content-state').style.display = 'block';

      // Initialize AdSense
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense initialization failed:', e);
      }

      // Extract colors from album art
      if (thumbnail) {
        extractColorsFromImage(thumbnail);
      }
    }

    // Color extraction function
    function extractColorsFromImage(imageUrl) {
      const img = document.getElementById('album-art-img');
      if (!img) return;

      img.addEventListener('load', function() {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          // Sample pixels and find dominant color
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
            const key = \`\${qr},\${qg},\${qb}\`;
            
            colorMap[key] = (colorMap[key] || 0) + 1;
          }
          
          let dominantColor = null;
          let maxCount = 0;
          
          for (const [color, count] of Object.entries(colorMap)) {
            if (count > maxCount) {
              maxCount = count;
              dominantColor = color;
            }
          }
          
          if (dominantColor) {
            const [r, g, b] = dominantColor.split(',').map(Number);
            applyDynamicColors(r, g, b);
          }
        } catch (e) {
          console.error('Color extraction failed:', e);
        }
      });
    }

    function applyDynamicColors(r, g, b) {
      const root = document.documentElement;
      
      root.style.setProperty('--primary', \`rgb(\${r}, \${g}, \${b})\`);
      root.style.setProperty('--primary-light', \`rgb(\${Math.min(r + 30, 255)}, \${Math.min(g + 30, 255)}, \${Math.min(b + 30, 255)})\`);
      root.style.setProperty('--primary-dark', \`rgb(\${Math.max(r - 30, 0)}, \${Math.max(g - 30, 0)}, \${Math.max(b - 30, 0)})\`);
      root.style.setProperty('--accent-glow', \`rgba(\${r}, \${g}, \${b}, 0.4)\`);
      
      document.body.style.backgroundImage = \`radial-gradient(ellipse 150% 80% at 50% -10%, rgba(\${r}, \${g}, \${b}, 0.15) 0%, rgba(13, 17, 23, 0.95) 50%, #0D1117 100%)\`;
    }

    function showError(title, message) {
      document.getElementById('error-message').textContent = message;
      document.querySelector('.error-title').textContent = title;
      document.getElementById('loading-state').style.display = 'none';
      document.getElementById('error-state').style.display = 'block';
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Start loading
    loadSongData();

    // Automatic app redirect
    (function() {
      const appUrl = 'unitune://open?url=' + encodeURIComponent(MUSIC_URL);
      let appOpened = false;
      let redirectAttempted = false;

      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          appOpened = true;
        }
      });

      function tryOpenApp() {
        if (redirectAttempted) return;
        redirectAttempted = true;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);

        setTimeout(function() {
          if (!appOpened) {
            window.location.href = appUrl;
          }
        }, 100);

        setTimeout(function() {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 2000);

        setTimeout(function() {
          if (!appOpened) {
            const btn = document.querySelector('.get-app-btn');
            if (btn) {
              btn.innerHTML = '<div class="app-logo">' + UNITUNE_LOGO_SVG + '</div><span>Get UniTune App</span>';
              btn.href = 'https://github.com/FlazeIGuess/unitune';
            }
          }
        }, 2500);
      }

      const checkContent = setInterval(function() {
        if (document.getElementById('content-state').style.display === 'block') {
          clearInterval(checkContent);
          setTimeout(tryOpenApp, 500);
        }
      }, 100);
    })();
  </script>
  
  ${getDonationsScript()}
</body>
</html>`;

    return addSecurityHeaders(new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }));
}


/**
 * Client-Side playlist page for normal users
 * Shows full playlist with tracks and creator info
 */
export function getPlaylistClientPage(playlist, playlistId, config) {
    const title = escapeHtml(playlist.title || 'UniTune Playlist');
    const trackCount = Array.isArray(playlist.tracks) ? playlist.tracks.length : 0;
    const thumbnail = trackCount > 0 ? (isValidThumbnailUrl(playlist.tracks[0]?.thumbnailUrl) ? escapeHtml(playlist.tracks[0].thumbnailUrl) : 'https://unitune.art/logo.png') : 'https://unitune.art/logo.png';
    const creatorNickname = playlist.creatorNickname ? escapeHtml(playlist.creatorNickname) : null;
    const description = playlist.description ? escapeHtml(playlist.description) : null;

    // Build track list HTML
    let tracksHtml = '';
    if (trackCount > 0) {
        for (let i = 0; i < playlist.tracks.length; i++) {
            const track = playlist.tracks[i];
            const trackTitle = escapeHtml(track.title || 'Unknown Track');
            const trackArtist = escapeHtml(track.artist || 'Unknown Artist');
            const trackThumb = isValidThumbnailUrl(track.thumbnailUrl) ? escapeHtml(track.thumbnailUrl) : 'https://unitune.art/logo.png';
            const trackUrl = track.originalUrl ? escapeHtml(track.originalUrl) : '#';

            tracksHtml += `
                <div class="track-item">
                    <div class="track-number">${i + 1}</div>
                    <img src="${trackThumb}" alt="${trackTitle}" class="track-thumbnail" loading="lazy">
                    <div class="track-info">
                        <div class="track-title">${trackTitle}</div>
                        <div class="track-artist">${trackArtist}</div>
                    </div>
                    ${trackUrl !== '#' ? `<a href="${trackUrl}" class="track-play-btn" target="_blank" rel="noopener noreferrer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </a>` : ''}
                </div>
            `;
        }
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="google-adsense-account" content="${config.adsensePublisherId}">
  <title>${title}</title>
  
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${creatorNickname ? `${trackCount} tracks • by ${creatorNickname}` : `${trackCount} tracks`}">
  <meta property="og:image" content="${thumbnail}">
  <meta property="og:url" content="https://unitune.art/p/${playlistId}">
  <meta property="og:type" content="music.playlist">
  <meta name="theme-color" content="#0D1117">
  
  <!-- AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsensePublisherId}" crossorigin="anonymous"></script>
  
  <style>
    ${getCommonStyles()}
    ${getDonationsStyles()}
    
    .main-wrapper {
        width: 100%;
        max-width: min(680px, 100vw - 32px);
        padding: clamp(16px, 4vw, 24px);
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        justify-content: flex-start;
    }

    .hero {
        margin-top: 20px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
    }

    .playlist-art-container {
        position: relative;
        width: clamp(180px, 50vw, 240px);
        height: clamp(180px, 50vw, 240px);
        margin-bottom: clamp(24px, 5vw, 32px);
    }

    .playlist-art {
        width: 100%;
        height: 100%;
        border-radius: 24px;
        object-fit: cover;
        position: relative;
        z-index: 2;
        box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
    }

    .playlist-glow {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        background-size: cover;
        filter: blur(40px) saturate(180%);
        opacity: 0.5;
        z-index: 1;
        border-radius: 50%;
    }

    .playlist-info {
        width: 100%;
        padding: 0 10px;
    }

    .playlist-title {
        font-size: 32px;
        font-weight: 800;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
        line-height: 1.1;
        background: linear-gradient(to right, #fff, #e0e0e0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .playlist-meta {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-secondary);
        letter-spacing: -0.2px;
        margin-bottom: 8px;
    }

    .playlist-description {
        font-size: 14px;
        color: var(--text-muted);
        margin-top: 12px;
        line-height: 1.5;
    }

    .creator-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: rgba(88, 166, 255, 0.15);
        border: 1px solid rgba(88, 166, 255, 0.3);
        border-radius: 100px;
        font-size: 13px;
        font-weight: 600;
        color: rgba(88, 166, 255, 1);
        margin-top: 12px;
    }

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

    .tracks-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 24px;
    }

    .tracks-header {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 12px;
        padding: 0 4px;
    }

    .track-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 12px;
        background: var(--glass-base);
        border: 0.5px solid var(--glass-border);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: all 0.2s;
    }

    .track-item:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(4px);
        border-color: var(--primary);
    }

    .track-number {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-muted);
        min-width: 24px;
        text-align: center;
    }

    .track-thumbnail {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        object-fit: cover;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .track-info {
        flex: 1;
        min-width: 0;
    }

    .track-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .track-artist {
        font-size: 13px;
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .track-play-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(88, 166, 255, 0.2);
        color: rgba(88, 166, 255, 1);
        border: 1px solid rgba(88, 166, 255, 0.3);
        transition: all 0.2s;
        text-decoration: none;
    }

    .track-play-btn:hover {
        background: rgba(88, 166, 255, 0.3);
        transform: scale(1.1);
    }

    .ad-container {
        width: 100%;
        padding: 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        margin: 24px 0;
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
  </style>
</head>
<body>
  ${getHorizontalDonationBanner()}
  
  <div class="main-wrapper">
    <div class="hero">
      <div class="playlist-art-container">
        <div class="playlist-glow" style="background-image: url('${thumbnail}')"></div>
        <img src="${thumbnail}" alt="Playlist Art" class="playlist-art" crossorigin="anonymous" id="playlist-art-img">
      </div>
      <div class="playlist-info">
        <h1 class="playlist-title">${title}</h1>
        <p class="playlist-meta">${trackCount} ${trackCount === 1 ? 'track' : 'tracks'}</p>
        ${creatorNickname ? `<div class="creator-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          by ${creatorNickname}
        </div>` : ''}
        ${description ? `<p class="playlist-description">${description}</p>` : ''}
      </div>
    </div>

    <a href="unitune://playlist?id=${encodeURIComponent(playlistId)}&source=web" class="get-app-btn glass-card">
      <svg viewBox="0 0 842.13 985.84" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
        <path class="logo-path" d="M27.4,66.27c47.21-1.28,89.07,6.86,126.48,38.09,66.15,55.21,60.95,144.27,61.18,221.93l.08,181.23c-.06,37.69-.86,74.85,1.61,112.49,6.97,106.45,93.55,175.65,199.23,165.87,42.47-3.55,83.05-19.14,116.97-44.95,92.36-69.31,92.93-166.31,91.37-269.59-.81-53.71-.31-108.8-.54-162.62.54-8.04-1.42-37.8,5.3-42.69,16.26-11.84,61.03,23.88,70.98,33.39,40.76,38.96,42.64,101.83,43.46,154.32.27,25.33.36,50.67.3,76-.11,28.44.91,59.71-.19,87.72-3.47,84.27-23.66,162.29-76.5,229.62-127.43,162.4-369.95,181.63-532.07,60.97C60.91,852.85,16.04,761.04,3.14,670.93c-4.6-32.15-2.79-71.35-2.76-104.35l.03-154.11.05-198.05c-.06-37.93-.93-76.13.76-114,.82-18.45,6-31.92,26.19-34.14Z" fill="currentColor"/>
        <path class="logo-path" d="M548.39.27c32.61-1.76,32.41,4.66,45.8,30.51,13.33,25.75,39.38,45.82,63.55,61.14,59.59,38.01,123.95,60.45,161.72,125.48,35.17,60.55,31.75,164.75-26.84,211.97-1.84,1.48-4.59.74-6.61.17-2.7-2.29-5.04-5.81-5.16-9.34-1.14-34.32-4.14-64.88-16.53-97.5-17.4-45.81-55.32-75.56-99.64-93.86-20.16-8.32-45.76-16.27-67.19-7.41l-1.19.51c-3.33,4.16-8.05,10.61-8.7,15.95-3.52,28.74-2.76,61.05-2.78,89.91l.27,153.28c-.02,33.57,1.23,59.36-1.59,93.15-11.16,83.39-58.86,146.18-141.48,168.21-126.33,33.67-234.19-80.57-162.98-199.56,36.36-60.76,103.18-96.85,173.8-90.85,17.49,1.38,59.93,24.05,67.19-4.54,3.74-26.18,2.01-61.22,1.97-88.52l-.05-205.92c-.01-37.68-.88-75.74.72-113.35.98-23.07,1.95-33.98,25.72-39.44Z" fill="currentColor"/>
      </svg>
      <span>Open in UniTune</span>
    </a>

    <div class="tracks-container">
      <div class="tracks-header">Tracks</div>
      ${tracksHtml}
    </div>

    <!-- Google AdSense -->
    <div class="ad-container">
        <div class="ad-label">Advertisement</div>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${config.adsensePublisherId}"
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

  <script>
    // Initialize AdSense
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense initialization failed:', e);
    }

    // Extract colors from playlist art
    const img = document.getElementById('playlist-art-img');
    if (img) {
      img.addEventListener('load', function() {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
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
            const key = \`\${qr},\${qg},\${qb}\`;
            
            colorMap[key] = (colorMap[key] || 0) + 1;
          }
          
          let dominantColor = null;
          let maxCount = 0;
          
          for (const [color, count] of Object.entries(colorMap)) {
            if (count > maxCount) {
              maxCount = count;
              dominantColor = color;
            }
          }
          
          if (dominantColor) {
            const [r, g, b] = dominantColor.split(',').map(Number);
            const root = document.documentElement;
            
            root.style.setProperty('--primary', \`rgb(\${r}, \${g}, \${b})\`);
            root.style.setProperty('--primary-light', \`rgb(\${Math.min(r + 30, 255)}, \${Math.min(g + 30, 255)}, \${Math.min(b + 30, 255)})\`);
            root.style.setProperty('--primary-dark', \`rgb(\${Math.max(r - 30, 0)}, \${Math.max(g - 30, 0)}, \${Math.max(b - 30, 0)})\`);
            root.style.setProperty('--accent-glow', \`rgba(\${r}, \${g}, \${b}, 0.4)\`);
            
            document.body.style.backgroundImage = \`radial-gradient(ellipse 150% 80% at 50% -10%, rgba(\${r}, \${g}, \${b}, 0.15) 0%, rgba(13, 17, 23, 0.95) 50%, #0D1117 100%)\`;
          }
        } catch (e) {
          console.error('Color extraction failed:', e);
        }
      });
    }

    // Automatic app redirect
    (function() {
      const appUrl = 'unitune://playlist?id=${encodeURIComponent(playlistId)}&source=web';
      let appOpened = false;
      let redirectAttempted = false;

      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          appOpened = true;
        }
      });

      function tryOpenApp() {
        if (redirectAttempted) return;
        redirectAttempted = true;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);

        setTimeout(function() {
          if (!appOpened) {
            window.location.href = appUrl;
          }
        }, 100);

        setTimeout(function() {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 2000);

        setTimeout(function() {
          if (!appOpened) {
            const btn = document.querySelector('.get-app-btn');
            if (btn) {
              btn.innerHTML = '<svg viewBox="0 0 842.13 985.84" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;"><path class="logo-path" d="M27.4,66.27c47.21-1.28,89.07,6.86,126.48,38.09,66.15,55.21,60.95,144.27,61.18,221.93l.08,181.23c-.06,37.69-.86,74.85,1.61,112.49,6.97,106.45,93.55,175.65,199.23,165.87,42.47-3.55,83.05-19.14,116.97-44.95,92.36-69.31,92.93-166.31,91.37-269.59-.81-53.71-.31-108.8-.54-162.62.54-8.04-1.42-37.8,5.3-42.69,16.26-11.84,61.03,23.88,70.98,33.39,40.76,38.96,42.64,101.83,43.46,154.32.27,25.33.36,50.67.3,76-.11,28.44.91,59.71-.19,87.72-3.47,84.27-23.66,162.29-76.5,229.62-127.43,162.4-369.95,181.63-532.07,60.97C60.91,852.85,16.04,761.04,3.14,670.93c-4.6-32.15-2.79-71.35-2.76-104.35l.03-154.11.05-198.05c-.06-37.93-.93-76.13.76-114,.82-18.45,6-31.92,26.19-34.14Z" fill="currentColor"/><path class="logo-path" d="M548.39.27c32.61-1.76,32.41,4.66,45.8,30.51,13.33,25.75,39.38,45.82,63.55,61.14,59.59,38.01,123.95,60.45,161.72,125.48,35.17,60.55,31.75,164.75-26.84,211.97-1.84,1.48-4.59.74-6.61.17-2.7-2.29-5.04-5.81-5.16-9.34-1.14-34.32-4.14-64.88-16.53-97.5-17.4-45.81-55.32-75.56-99.64-93.86-20.16-8.32-45.76-16.27-67.19-7.41l-1.19.51c-3.33,4.16-8.05,10.61-8.7,15.95-3.52,28.74-2.76,61.05-2.78,89.91l.27,153.28c-.02,33.57,1.23,59.36-1.59,93.15-11.16,83.39-58.86,146.18-141.48,168.21-126.33,33.67-234.19-80.57-162.98-199.56,36.36-60.76,103.18-96.85,173.8-90.85,17.49,1.38,59.93,24.05,67.19-4.54,3.74-26.18,2.01-61.22,1.97-88.52l-.05-205.92c-.01-37.68-.88-75.74.72-113.35.98-23.07,1.95-33.98,25.72-39.44Z" fill="currentColor"/></svg><span>Get UniTune App</span>';
              btn.href = 'https://github.com/FlazeIGuess/unitune';
            }
          }
        }, 2500);
      }

      setTimeout(tryOpenApp, 500);
    })();
  </script>
  
  ${getDonationsScript()}
</body>
</html>`;

    return addSecurityHeaders(new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }));
}
