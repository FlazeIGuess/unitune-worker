import { getCommonStyles } from './styles.js';
import { getNavigationBar, getFooter } from './navigation.js';
import { getHorizontalDonationBanner, getDonationsStyles, getDonationsScript } from './donations.js';

export function getAboutPage(adsensePublisherId) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-adsense-account" content="${adsensePublisherId}">
    <title>About UniTune - Universal Music Link Sharing</title>
    <meta name="description" content="Learn about UniTune, the universal music link converter that makes sharing music across streaming platforms effortless.">
    
    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}" crossorigin="anonymous"></script>
    
    <style>
        ${getCommonStyles()}
        ${getDonationsStyles()}
    </style>
</head>
<body>
    ${getNavigationBar()}
    ${getHorizontalDonationBanner()}
    <div class="content-wrapper">
        <h1>About UniTune</h1>
        <p class="lead">UniTune is a universal music link converter that makes sharing music across different streaming platforms effortless.</p>
        
        <!-- Top Ad -->
        <div style="margin: 32px 0; text-align: center;">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${adsensePublisherId}"
                 data-ad-slot="1801419133"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
        
        <h2>Our Mission</h2>
        <p>We believe music should be accessible to everyone, regardless of which streaming service they use. UniTune bridges the gap between platforms, making it easy to share your favorite songs with friends who use different music services.</p>
        
        <h2>How It Started</h2>
        <p>UniTune was created to solve a simple problem: sharing music links that work for everyone. Whether you use Spotify, Apple Music, YouTube Music, TIDAL, Deezer, or Amazon Music, UniTune ensures your friends can listen on their preferred platform.</p>
        
        <h2>Privacy First</h2>
        <p>We take your privacy seriously. UniTune does not require accounts, does not track your listening habits, and stores all data locally on your device. Your music sharing is completely private.</p>
        
        <h2>Open Source</h2>
        <p>UniTune is open source and available on GitHub. We believe in transparency and community-driven development.</p>
        
        <div class="cta-section">
            <a href="/" class="button-primary">Try UniTune</a>
            <a href="https://github.com/FlazeIGuess/unitune" class="button-secondary" target="_blank">View on GitHub</a>
        </div>
    </div>
    ${getFooter()}
    
    ${getDonationsScript()}
    
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</body>
</html>`;
}

export function getContactPage(adsensePublisherId) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-adsense-account" content="${adsensePublisherId}">
    <title>Contact UniTune - Get in Touch</title>
    <meta name="description" content="Contact UniTune for support, feedback, or partnership inquiries.">
    
    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}" crossorigin="anonymous"></script>
    
    <style>
        ${getCommonStyles()}
        ${getDonationsStyles()}
    </style>
</head>
<body>
    ${getNavigationBar()}
    ${getHorizontalDonationBanner()}
    <div class="content-wrapper">
        <h1>Contact Us</h1>
        <p class="lead">Have questions, feedback, or need support? We would love to hear from you!</p>
        
        <!-- Top Ad -->
        <div style="margin: 32px 0; text-align: center;">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${adsensePublisherId}"
                 data-ad-slot="1801419133"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
        
        <h2>Support</h2>
        <p>For technical support or bug reports, please visit our GitHub repository:</p>
        <p><a href="https://github.com/FlazeIGuess/unitune/issues" target="_blank" rel="noopener">GitHub Issues</a></p>
        
        <h2>General Inquiries</h2>
        <p>For general questions or partnership inquiries, reach out via:</p>
        <ul>
            <li>GitHub Discussions: <a href="https://github.com/FlazeIGuess/unitune/discussions" target="_blank" rel="noopener">Join the conversation</a></li>
            <li>Email: victor.boiting@gmail.com</li>
        </ul>
        
        <h2>Social Media</h2>
        <p>Stay updated with the latest news and features:</p>
        <ul>
            <li>GitHub: <a href="https://github.com/FlazeIGuess/unitune" target="_blank" rel="noopener">@FlazeIGuess/unitune</a></li>
        </ul>
        
        <div class="cta-section">
            <a href="/" class="button-primary">Back to Home</a>
        </div>
    </div>
    ${getFooter()}
    
    ${getDonationsScript()}
    
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</body>
</html>`;
}


export function getFaqPage(adsensePublisherId) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-adsense-account" content="${adsensePublisherId}">
    <title>FAQ - UniTune Frequently Asked Questions</title>
    <meta name="description" content="Find answers to common questions about UniTune, the universal music link converter.">
    
    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}" crossorigin="anonymous"></script>
    
    <style>
        ${getCommonStyles()}
        ${getDonationsStyles()}
    </style>
</head>
<body>
    ${getNavigationBar()}
    ${getHorizontalDonationBanner()}
    <div class="content-wrapper">
        <h1>Frequently Asked Questions</h1>
        
        <!-- Top Ad -->
        <div style="margin: 32px 0; text-align: center;">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${adsensePublisherId}"
                 data-ad-slot="1801419133"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
        
        <div class="faq-item">
            <h3>What is UniTune?</h3>
            <p>UniTune is a universal music link converter that allows you to share songs across different streaming platforms. When you share a Spotify link, your friends can open it in Apple Music, YouTube Music, or any other supported platform.</p>
        </div>
        
        <div class="faq-item">
            <h3>Which platforms are supported?</h3>
            <p>UniTune supports Spotify, Apple Music, YouTube Music, TIDAL, Deezer, and Amazon Music.</p>
        </div>
        
        <div class="faq-item">
            <h3>Is UniTune free?</h3>
            <p>Yes! UniTune is completely free to use. We may introduce premium features in the future, but the core functionality will always remain free.</p>
        </div>
        
        <div class="faq-item">
            <h3>Do I need to create an account?</h3>
            <p>No! UniTune works without any account registration. Your privacy is important to us.</p>
        </div>
        
        <div class="faq-item">
            <h3>How does UniTune protect my privacy?</h3>
            <p>UniTune does not track your listening habits, does not require accounts, and stores all data locally on your device. We do not collect or sell your personal information.</p>
        </div>
        
        <div class="faq-item">
            <h3>Can I use UniTune on mobile?</h3>
            <p>Yes! UniTune has native apps for Android and iOS. Download from GitHub Releases or wait for the App Store and Play Store release.</p>
        </div>
        
        <div class="faq-item">
            <h3>What if a song is not available on my platform?</h3>
            <p>UniTune will show you which platforms have the song available. If it is not on your preferred platform, you can choose an alternative.</p>
        </div>
        
        <div class="faq-item">
            <h3>Is UniTune open source?</h3>
            <p>Yes! UniTune is open source under the AGPL-3.0 license. Check out our code on GitHub.</p>
        </div>
        
        <div class="cta-section">
            <a href="/" class="button-primary">Try UniTune</a>
        </div>
    </div>
    ${getFooter()}
    
    ${getDonationsScript()}
    
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</body>
</html>`;
}


export function getHowItWorksPage(adsensePublisherId) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-adsense-account" content="${adsensePublisherId}">
    <title>How UniTune Works - Universal Music Sharing</title>
    <meta name="description" content="Learn how UniTune converts music links between streaming platforms in three simple steps.">
    
    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}" crossorigin="anonymous"></script>
    
    <style>
        ${getCommonStyles()}
        ${getDonationsStyles()}
    </style>
</head>
<body>
    ${getNavigationBar()}
    ${getHorizontalDonationBanner()}
    <div class="content-wrapper">
        <h1>How UniTune Works</h1>
        
        <!-- Top Ad -->
        <div style="margin: 32px 0; text-align: center;">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${adsensePublisherId}"
                 data-ad-slot="1801419133"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
        
        <div class="step-section">
            <h2>Step 1: Share a Song</h2>
            <p>Open your favorite music app (Spotify, Apple Music, etc.) and share a song link. Choose UniTune from the share menu.</p>
        </div>
        
        <div class="step-section">
            <h2>Step 2: Automatic Conversion</h2>
            <p>UniTune automatically converts the link to work on all major streaming platforms. We search for the same song across Spotify, Apple Music, YouTube Music, TIDAL, Deezer, and Amazon Music.</p>
        </div>
        
        <div class="step-section">
            <h2>Step 3: Share with Friends</h2>
            <p>Send the UniTune link to your friends via WhatsApp, Telegram, SMS, or any messaging app. They can open it in their preferred music service.</p>
        </div>
        
        <div class="step-section">
            <h2>Step 4: Listen Anywhere</h2>
            <p>Your friends click the link and choose their preferred platform. The song opens directly in their music app, ready to play.</p>
        </div>
        
        <h2>Technical Details</h2>
        <p>UniTune uses official APIs and web scraping to find songs across platforms. We match songs by ISRC codes, artist names, and track titles to ensure accuracy.</p>
        
        <h2>Privacy and Security</h2>
        <p>All conversions happen on our servers, but we do not store your personal data. Links are cached for 24 hours to improve performance, then automatically deleted.</p>
        
        <div class="cta-section">
            <a href="/" class="button-primary">Try UniTune Now</a>
        </div>
    </div>
    ${getFooter()}
    
    ${getDonationsScript()}
    
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</body>
</html>`;
}

export function getFeaturesPage(adsensePublisherId) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-adsense-account" content="${adsensePublisherId}">
    <title>Features - UniTune Universal Music Sharing</title>
    <meta name="description" content="Discover all features of UniTune: universal link conversion, privacy-first architecture, smart sharing, and more.">
    
    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}" crossorigin="anonymous"></script>
    
    <style>
        ${getCommonStyles()}
        ${getDonationsStyles()}
    </style>
</head>
<body>
    ${getNavigationBar()}
    ${getHorizontalDonationBanner()}
    <div class="content-wrapper">
        <h1>UniTune Features</h1>
        <p class="lead">Everything you need for seamless cross-platform music sharing</p>
        
        <!-- Top Ad -->
        <div style="margin: 32px 0; text-align: center;">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${adsensePublisherId}"
                 data-ad-slot="1801419133"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
        
        <div class="feature-section">
            <h2>Universal Link Conversion</h2>
            <p>Convert music links seamlessly between all major streaming platforms. Paste any music link and get instant access across Spotify, Apple Music, YouTube Music, Deezer, TIDAL, and Amazon Music.</p>
        </div>
        
        <div class="feature-section">
            <h2>Privacy-First Architecture</h2>
            <p>Your data stays on your device. No accounts, no tracking, no cloud storage. UniTune operates entirely locally with zero data collection or external analytics.</p>
        </div>
        
        <div class="feature-section">
            <h2>Smart Sharing Integration</h2>
            <p>Share directly to your favorite messaging apps with intelligent platform detection. Integrates with WhatsApp, Telegram, Signal, SMS, and system share functionality.</p>
        </div>
        
        <div class="feature-section">
            <h2>Dynamic Visual Experience</h2>
            <p>Watch the app transform with every song. Album artwork automatically influences the color scheme, creating a unique visual experience that adapts to your music taste.</p>
        </div>
        
        <div class="feature-section">
            <h2>Comprehensive History</h2>
            <p>Track your sharing patterns with detailed statistics and trend graphs. View your most shared songs, favorite platforms, and sharing frequency over customizable time periods.</p>
        </div>
        
        <div class="feature-section">
            <h2>Modern Liquid Glass Design</h2>
            <p>Experience a premium interface with smooth animations and glassmorphism effects. The fluid design language creates an immersive, Apple-inspired aesthetic across every screen.</p>
        </div>
        
        <div class="cta-section">
            <a href="/" class="button-primary">Get Started</a>
            <a href="/how-it-works" class="button-secondary">Learn More</a>
        </div>
    </div>
    ${getFooter()}
    
    ${getDonationsScript()}
    
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</body>
</html>`;
}
