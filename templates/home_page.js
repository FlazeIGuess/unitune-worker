import { getCommonStyles, getCookieBannerStyles } from './styles.js';
import { getCookieBannerHTML, getCookieBannerScript } from './cookie_banner.js';
import { getNavigationBar, getFooter } from './navigation.js';
import { getHorizontalDonationBanner, getDonationsStyles, getDonationsScript } from './donations.js';

export function getHomePage(adsensePublisherId) {
    // UniTune Logo SVG
    const unituneLogoSvg = `
      <svg viewBox="0 0 842.13 985.84" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <path class="logo-path" d="M27.4,66.27c47.21-1.28,89.07,6.86,126.48,38.09,66.15,55.21,60.95,144.27,61.18,221.93l.08,181.23c-.06,37.69-.86,74.85,1.61,112.49,6.97,106.45,93.55,175.65,199.23,165.87,42.47-3.55,83.05-19.14,116.97-44.95,92.36-69.31,92.93-166.31,91.37-269.59-.81-53.71-.31-108.8-.54-162.62.54-8.04-1.42-37.8,5.3-42.69,16.26-11.84,61.03,23.88,70.98,33.39,40.76,38.96,42.64,101.83,43.46,154.32.27,25.33.36,50.67.3,76-.11,28.44.91,59.71-.19,87.72-3.47,84.27-23.66,162.29-76.5,229.62-127.43,162.4-369.95,181.63-532.07,60.97C60.91,852.85,16.04,761.04,3.14,670.93c-4.6-32.15-2.79-71.35-2.76-104.35l.03-154.11.05-198.05c-.06-37.93-.93-76.13.76-114,.82-18.45,6-31.92,26.19-34.14Z"/>
        <path class="logo-path" d="M548.39.27c32.61-1.76,32.41,4.66,45.8,30.51,13.33,25.75,39.38,45.82,63.55,61.14,59.59,38.01,123.95,60.45,161.72,125.48,35.17,60.55,31.75,164.75-26.84,211.97-1.84,1.48-4.59.74-6.61.17-2.7-2.29-5.04-5.81-5.16-9.34-1.14-34.32-4.14-64.88-16.53-97.5-17.4-45.81-55.32-75.56-99.64-93.86-20.16-8.32-45.76-16.27-67.19-7.41l-1.19.51c-3.33,4.16-8.05,10.61-8.7,15.95-3.52,28.74-2.76,61.05-2.78,89.91l.27,153.28c-.02,33.57,1.23,59.36-1.59,93.15-11.16,83.39-58.86,146.18-141.48,168.21-126.33,33.67-234.19-80.57-162.98-199.56,36.36-60.76,103.18-96.85,173.8-90.85,17.49,1.38,59.93,24.05,67.19-4.54,3.74-26.18,2.01-61.22,1.97-88.52l-.05-205.92c-.01-37.68-.88-75.74.72-113.35.98-23.07,1.95-33.98,25.72-39.44Z"/>
      </svg>
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="google-adsense-account" content="${adsensePublisherId}">
  <title>UniTune - Universal Music Link Sharing</title>
  <meta name="description" content="Share your favorite music across all streaming platforms with a single tap. Convert links between Spotify, Apple Music, YouTube Music, Deezer, TIDAL, and Amazon Music.">
  <meta name="keywords" content="music sharing, spotify, apple music, youtube music, universal music links, song converter">
  
  <!-- Open Graph -->
  <meta property="og:title" content="UniTune - Universal Music Link Sharing">
  <meta property="og:description" content="Share music across all streaming platforms">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://unitune.art">
  
  <style>
    ${getCommonStyles()}
    ${getCookieBannerStyles()}
    
    body {
        background-attachment: fixed;
        overflow-x: hidden;
    }
    
    .page-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    /* Hero Section */
    .hero-section {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 60px 20px;
        position: relative;
    }
    
    .hero-logo {
        width: 120px;
        height: 120px;
        margin-bottom: 32px;
        animation: scaleIn 0.6s ease-out;
        color: var(--primary);
    }
    
    .hero-title {
        font-family: var(--font-heading);
        font-size: clamp(40px, 8vw, 64px);
        font-weight: 800;
        letter-spacing: -2px;
        margin-bottom: 16px;
        background: linear-gradient(to bottom, #fff, #a0a0a0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: fadeIn 0.6s ease-out 0.2s backwards;
    }
    
    .hero-subtitle {
        font-size: clamp(18px, 3vw, 24px);
        color: var(--text-secondary);
        max-width: 600px;
        line-height: 1.5;
        margin-bottom: 40px;
        animation: fadeIn 0.6s ease-out 0.4s backwards;
    }
    
    .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 16px 32px;
        background: var(--primary);
        color: #0D1117;
        text-decoration: none;
        border-radius: 16px;
        font-size: 18px;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        animation: fadeIn 0.6s ease-out 0.6s backwards;
        box-shadow: 0 4px 24px rgba(88, 166, 255, 0.3);
    }
    
    .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(88, 166, 255, 0.4);
        background: var(--primary-light);
        color: #0D1117;
    }
    
    .cta-button:active {
        transform: scale(0.98);
    }
    
    /* Ad Container */
    .ad-container {
        width: 100%;
        max-width: 970px;
        margin: 40px auto;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 90px;
    }
    
    /* Section Styles */
    .section {
        padding: 80px 20px;
        width: 100%;
    }
    
    .section-title {
        font-family: var(--font-heading);
        font-size: clamp(32px, 5vw, 48px);
        font-weight: 800;
        text-align: center;
        margin-bottom: 16px;
        letter-spacing: -1px;
        background: linear-gradient(to bottom, #fff, #ccc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .section-description {
        text-align: center;
        color: var(--text-secondary);
        font-size: 18px;
        max-width: 700px;
        margin: 0 auto 60px;
        line-height: 1.6;
    }
    
    /* Features Grid */
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .feature-card {
        background: var(--glass-base);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 0.5px solid var(--glass-border);
        border-radius: 20px;
        padding: 32px;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 0 var(--glass-highlight);
    }
    
    .feature-card:hover {
        transform: translateY(-4px);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
    }
    
    .feature-icon {
        width: 48px;
        height: 48px;
        margin-bottom: 20px;
        display: block;
        color: var(--primary);
    }
    
    .feature-title {
        font-family: var(--font-heading);
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--text-primary);
    }
    
    .feature-description {
        color: var(--text-secondary);
        line-height: 1.6;
        font-size: 15px;
    }
    
    /* Services Grid */
    .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 20px;
        max-width: 1000px;
        margin: 0 auto 60px;
    }
    
    .service-card {
        background: var(--glass-base);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 0.5px solid var(--glass-border);
        border-radius: 16px;
        padding: 24px;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
    }
    
    .service-card:hover {
        transform: translateY(-4px);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
    }
    
    .service-logo {
        width: 64px;
        height: 64px;
        margin: 0 auto 16px;
        border-radius: 12px;
        object-fit: contain;
    }
    
    .service-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    /* How It Works */
    .steps-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 32px;
        max-width: 1000px;
        margin: 0 auto;
    }
    
    .step-card {
        text-align: center;
        padding: 32px;
    }
    
    .step-number {
        width: 64px;
        height: 64px;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        font-weight: 800;
        margin: 0 auto 24px;
        box-shadow: 0 4px 24px rgba(88, 166, 255, 0.3);
    }
    
    .step-title {
        font-family: var(--font-heading);
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--text-primary);
    }
    
    .step-description {
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    /* Footer */
    .footer {
        padding: 60px 20px 40px;
        text-align: center;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin-top: 80px;
    }
    
    .footer-links {
        display: flex;
        justify-content: center;
        gap: 32px;
        margin-bottom: 24px;
        flex-wrap: wrap;
    }
    
    .footer-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 15px;
        transition: color 0.2s;
    }
    
    .footer-link:hover {
        color: var(--primary);
    }
    
    .footer-text {
        color: var(--text-muted);
        font-size: 14px;
    }
    
    ${getDonationsStyles()}
  </style>
  <!--
    AdSense: NPA flag must be set BEFORE adsbygoogle.js loads so the library starts
    in non-personalized mode. No personalization cookies are written at load time.
    Actual ad slots are only pushed after explicit user consent (see cookie_banner.js).
    The static script tag is required for Google's site verification crawler.
  -->
  <script>window.adsbygoogle = window.adsbygoogle || []; window.adsbygoogle.requestNonPersonalizedAds = 1;</script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}" crossorigin="anonymous"></script>
  <style>
    /* iOS Banner */
    .ios-banner {
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.15), rgba(88, 166, 255, 0.05));
        border: 1px solid rgba(88, 166, 255, 0.3);
        border-radius: 20px;
        padding: 32px;
        margin: 40px auto;
        max-width: 800px;
        text-align: center;
        animation: fadeIn 0.6s ease-out 0.8s backwards;
    }
    
    .ios-banner-title {
        font-family: var(--font-heading);
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--text-primary);
    }
    
    .ios-banner-text {
        color: var(--text-secondary);
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 24px;
    }
    
    .ios-banner-buttons {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .ios-banner-button {
        padding: 12px 24px;
        background: var(--primary);
        color: #0D1117;
        text-decoration: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        transition: all 0.3s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    .ios-banner-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(88, 166, 255, 0.4);
    }
    
    .ios-banner-button.secondary {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }
    
    /* Hide sidebar on mobile, show mobile banner instead */
    @media (max-width: 1399px) {
        .page-container {
            padding: 0 20px;
        }
        
        .ios-banner {
            margin: 20px auto;
            padding: 24px;
        }
        
        .ios-banner-title {
            font-size: 22px;
        }
        
        .ios-banner-text {
            font-size: 14px;
        }
        
        .ios-banner-buttons {
            flex-direction: column;
        }
        
        .ios-banner-button {
            width: 100%;
            justify-content: center;
        }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .hero-section {
            min-height: 90vh;
            padding: 40px 20px;
        }
        
        .section {
            padding: 60px 20px;
        }
        
        .features-grid,
        .services-grid,
        .steps-container {
            grid-template-columns: 1fr;
        }
        
        .ad-container {
            padding: 10px;
        }
    }
  </style>
</head>
<body>
  ${getNavigationBar()}
  ${getHorizontalDonationBanner()}
  
  <!-- Hero Section -->
  <div class="hero-section">
    <div class="hero-logo">${unituneLogoSvg}</div>
    <h1 class="hero-title">UniTune</h1>
    <p class="hero-subtitle">Convert and share music links across Spotify, Apple Music, YouTube Music, Deezer, TIDAL, and Amazon Music. No account needed.</p>
    <a href="https://github.com/FlazeIGuess/unitune/releases" class="cta-button" target="_blank" rel="noopener">
      <span>Download App</span>
      <span>→</span>
    </a>
    
    <!-- iOS Banner -->
    <div class="ios-banner">
      <h3 class="ios-banner-title">Coming Soon: iOS Version</h3>
      <p class="ios-banner-text">
        We're working on bringing UniTune to iPhone and iPad! The Apple Developer Program costs 99€/year. 
        Your support will help us publish the app on the App Store and make it available to millions of iOS users.
      </p>
      <div class="ios-banner-buttons">
        <a href="https://ko-fi.com/unitune/goal?g=15" target="_blank" rel="noopener" class="ios-banner-button">
          <span>Support on Ko-fi</span>
          <span>→</span>
        </a>
        <a href="/about" class="ios-banner-button secondary">
          <span>Learn More</span>
        </a>
      </div>
    </div>
  </div>
  
  <!-- Top Ad (unitune-homepage-top) -->
  <div class="ad-container">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="${adsensePublisherId}"
         data-ad-slot="6983656105"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
  
  <div class="page-container">
    <!-- Features Section -->
    <section class="section">
      <h2 class="section-title">Key Features</h2>
      <p class="section-description">Everything you need for seamless cross-platform music sharing</p>
      
      <div class="features-grid">
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <h3 class="feature-title">Universal Link Conversion</h3>
          <p class="feature-description">Convert music links seamlessly between all major streaming platforms. Supports tracks, albums, and artists. Paste any music link and get instant access across Spotify, Apple Music, YouTube Music, Deezer, TIDAL, and Amazon Music.</p>
        </div>
        
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h3 class="feature-title">Privacy-First Architecture</h3>
          <p class="feature-description">Your data stays on your device. No accounts, no tracking, no cloud storage. UniTune operates entirely locally with zero data collection or external analytics. GDPR compliant.</p>
        </div>
        
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          <h3 class="feature-title">Share Directly from Any Music App</h3>
          <p class="feature-description">Hit share inside Spotify, Tidal, or any other streaming app, pick UniTune from the share sheet, and it converts the link and sends it to your contact in one flow. No copy-pasting, no app switching. Works with WhatsApp, Telegram, Signal, SMS, and system share.</p>
        </div>
        
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
          <h3 class="feature-title">Dynamic Visual Experience</h3>
          <p class="feature-description">Watch the app transform with every song. Album artwork automatically influences the color scheme, creating a unique visual experience that adapts to your music taste.</p>
        </div>
        
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <h3 class="feature-title">Open Source</h3>
          <p class="feature-description">Fully open source on GitHub. Transparent development, community-driven features, and no hidden code. Contribute, report issues, or fork the project.</p>
        </div>
        
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h3 class="feature-title">Mini Playlists</h3>
          <p class="feature-description">Build cross-platform playlists of up to 10 tracks from any streaming service. Share them as a single UniTune link or as a QR code with a visual share card. Recipients can open each track on whichever platform they use.</p>
        </div>
        
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <h3 class="feature-title">Offline Link Caching</h3>
          <p class="feature-description">Recently converted links are cached locally for instant access. No internet required for previously converted songs. Fast, efficient, and data-friendly.</p>
        </div>
        
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <h3 class="feature-title">Music Link Interception</h3>
          <p class="feature-description">On Android you can set UniTune as the default handler for music links. Tap a Spotify link in WhatsApp or your browser and UniTune opens the song directly in your preferred music app. No extra steps required.</p>
        </div>
        
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <h3 class="feature-title">History & Statistics</h3>
          <p class="feature-description">Track your shared and received music with detailed history. View statistics, analyze your music sharing patterns, and revisit your favorite discoveries.</p>
        </div>
      </div>
    </section>
    
    <!-- In-Content Ad (unitune-homepage-incontent) -->
    <div class="ad-container">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="${adsensePublisherId}"
           data-ad-slot="1483771620"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
    
    <!-- Supported Services -->
    <section class="section">
      <h2 class="section-title">Supported Platforms</h2>
      <p class="section-description">Connect your favorite music streaming services</p>
      
      <div class="services-grid">
        <div class="service-card">
          <img src="/assets/logos/spotify.png" alt="Spotify" class="service-logo" loading="lazy">
          <div class="service-name">Spotify</div>
        </div>
        
        <div class="service-card">
          <img src="/assets/logos/apple_music.png" alt="Apple Music" class="service-logo" loading="lazy">
          <div class="service-name">Apple Music</div>
        </div>
        
        <div class="service-card">
          <img src="/assets/logos/youtube_music.png" alt="YouTube Music" class="service-logo" loading="lazy">
          <div class="service-name">YouTube Music</div>
        </div>
        
        <div class="service-card">
          <img src="/assets/logos/deezer.png" alt="Deezer" class="service-logo" loading="lazy">
          <div class="service-name">Deezer</div>
        </div>
        
        <div class="service-card">
          <img src="/assets/logos/tidal.png" alt="TIDAL" class="service-logo" loading="lazy">
          <div class="service-name">TIDAL</div>
        </div>
        
        <div class="service-card">
          <img src="/assets/logos/amazon_music.png" alt="Amazon Music" class="service-logo" loading="lazy">
          <div class="service-name">Amazon Music</div>
        </div>
      </div>
    </section>
    
    <!-- How It Works -->
    <section class="section">
      <h2 class="section-title">How It Works</h2>
      <p class="section-description">Get started in three simple steps</p>
      
      <div class="steps-container">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3 class="step-title">Get a Music Link</h3>
          <p class="step-description">Paste any link into UniTune, or hit share inside Spotify, Tidal, Apple Music, or any other streaming app and pick UniTune directly from the share sheet.</p>
        </div>
        
        <div class="step-card">
          <div class="step-number">2</div>
          <h3 class="step-title">UniTune Converts It</h3>
          <p class="step-description">UniTune finds the same song across all 6 supported platforms instantly and builds a universal link anyone can open.</p>
        </div>
        
        <div class="step-card">
          <div class="step-number">3</div>
          <h3 class="step-title">Share or Open</h3>
          <p class="step-description">Send the link to a friend in WhatsApp, Telegram, Signal, or SMS. They tap it and it opens in whatever music app they use. Or enable Link Interception so incoming links always open in your preferred app automatically.</p>
        </div>
      </div>
    </section>
    
    <!-- Bottom Ad (unitune-homepage-bottom) -->
    <div class="ad-container">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="${adsensePublisherId}"
           data-ad-slot="6503805223"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
    
    <!-- Footer -->
    ${getFooter()}
  </div>
  
  ${getCookieBannerHTML()}
  ${getCookieBannerScript(adsensePublisherId)}
  
  <!-- Load Donation Data -->
  
  ${getDonationsScript()}
</body>
</html>`;
}
