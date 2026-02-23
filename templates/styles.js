/**
 * Returns the CSS variables and base styles for the "Clean Dark" Theme
 */
export function getCommonStyles() {
    return `
    @font-face {
        font-family: 'ZalandoSansExpanded';
        src: url('/fonts/ZalandoSansExpanded-VariableFont_wght.ttf') format('truetype');
        font-weight: 100 900;
        font-display: swap;
    }
    
    /* Montserrat loaded from local worker assets — no external font requests (GDPR: no IP sent to Google Fonts) */
    @font-face {
        font-family: 'Montserrat';
        src: url('/fonts/Montserrat-Regular.ttf') format('truetype');
        font-weight: 400;
        font-display: swap;
    }
    @font-face {
        font-family: 'Montserrat';
        src: url('/fonts/Montserrat-Medium.ttf') format('truetype');
        font-weight: 500;
        font-display: swap;
    }
    @font-face {
        font-family: 'Montserrat';
        src: url('/fonts/Montserrat-SemiBold.ttf') format('truetype');
        font-weight: 600;
        font-display: swap;
    }
    @font-face {
        font-family: 'Montserrat';
        src: url('/fonts/Montserrat-Bold.ttf') format('truetype');
        font-weight: 700;
        font-display: swap;
    }
    
    :root {
        /* UniTune App Theme Colors (from app_theme.dart) */
        --bg-deep: #0D1117;
        --bg-medium: #161B22;
        --bg-card: #21262D;
        --primary: #58A6FF;
        --primary-light: #79C0FF;
        --primary-dark: #1F6FEB;
        --text-primary: #F0F6FC;
        --text-secondary: #8B949E;
        --text-muted: #6E7681;
        
        /* Liquid Glass Variables */
        --glass-base: rgba(255, 255, 255, 0.05);
        --glass-border: rgba(255, 255, 255, 0.1);
        --glass-highlight: rgba(255, 255, 255, 0.15);
        --glass-blur: 12px;
        
        /* Legacy compatibility */
        --card-bg: var(--glass-base);
        --card-border: var(--glass-border);
        --accent-glow: rgba(88, 166, 255, 0.4);
        --btn-hover: rgba(255, 255, 255, 0.1);
        
        /* Font Stacks */
        --font-heading: 'ZalandoSansExpanded', -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
        --font-body: 'Montserrat', -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    
    body {
        font-family: var(--font-body);
        background-color: var(--bg-deep);
        background-image: radial-gradient(ellipse 150% 80% at 50% -10%, rgba(88, 166, 255, 0.15) 0%, rgba(13, 17, 23, 0.95) 50%, #0D1117 100%);
        min-height: 100vh;
        color: var(--text-primary);
        display: flex;
        flex-direction: column;
        align-items: center;
        background-attachment: fixed;
    }
    
    /* Headings use ZalandoSansExpanded */
    h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading);
        font-weight: 700;
        letter-spacing: -0.02em;
    }

    ::-webkit-scrollbar { width: 0px; background: transparent; }
    
    /* Liquid Glass Card Base */
    .glass-card {
        background: var(--glass-base);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 0.5px solid var(--glass-border);
        border-radius: 20px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 0 var(--glass-highlight);
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .glass-card:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
    }
    
    .glass-card:active {
        transform: scale(0.98);
    }
    
    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Dynamic Logo Styling */
    .logo-path {
        fill: currentColor;
        stroke-width: 0px;
        transition: fill 0.3s ease;
    }

    .app-logo {
        width: 24px;
        height: 24px;
        color: var(--primary);
        transition: color 0.3s ease;
        flex-shrink: 0;
    }

    .get-app-btn:hover .app-logo {
        color: var(--primary-light);
    }

    .hero-logo {
        width: 80px;
        height: 80px;
        color: var(--primary);
        margin-bottom: 24px;
        filter: drop-shadow(0 10px 30px var(--accent-glow));
        animation: scaleIn 0.6s ease-out;
    }
    `;
}

export function getCookieBannerStyles() {
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
        font-family: var(--font-body);
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
