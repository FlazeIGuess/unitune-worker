/**
 * Reusable Donations Component
 * Used across all pages (homepage, song pages, content pages)
 */

/**
 * Horizontal Donation Banner (below navigation)
 * For content pages like About, Features, FAQ, etc.
 */
export function getHorizontalDonationBanner() {
    return `
    <div class="horizontal-donation-banner" id="horizontal-donation-banner">
        <div class="horizontal-banner-container">
            <div class="horizontal-banner-left">
                <div class="horizontal-banner-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
                <div class="horizontal-banner-content">
                    <span class="horizontal-banner-title">Support iOS Development</span>
                    <div class="horizontal-banner-progress-row">
                        <div class="horizontal-banner-progress-bg">
                            <div class="horizontal-banner-progress-fill" id="horizontal-banner-progress-fill" style="width: 0%"></div>
                        </div>
                        <span class="horizontal-banner-amount" id="horizontal-banner-amount">0€ / 99€</span>
                    </div>
                </div>
            </div>
            <a href="https://ko-fi.com/unitune/goal?g=15" target="_blank" rel="noopener" class="horizontal-banner-button">
                Support
            </a>
        </div>
    </div>
    `;
}

/**
 * Donation Card for Song Page Links List
 * Matches the service-row format
 */
export function getDonationCard() {
    return `
    <div class="service-row donation-card" id="donation-card">
        <div class="service-left">
            <div class="service-icon donation-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </div>
            <div class="donation-card-info">
                <span class="service-name">Support iOS Development</span>
                <div class="donation-card-progress-row">
                    <div class="donation-card-progress-bg">
                        <div class="donation-card-progress-fill" id="donation-card-progress-fill" style="width: 0%"></div>
                    </div>
                    <span class="donation-card-amount" id="donation-card-amount">0€ / 99€</span>
                </div>
            </div>
        </div>
        <a href="https://ko-fi.com/unitune/goal?g=15" target="_blank" rel="noopener" class="service-action donation-card-action">
            Support
        </a>
    </div>
    `;
}

export function getDonationsSidebar() {
    return `
    <!-- Desktop Donation Sidebar -->
    <div class="donation-sidebar" id="donation-sidebar">
        <h3 class="donation-title">Support iOS Development</h3>
        <p class="donation-subtitle">Help us bring UniTune to iPhone & iPad</p>
        
        <div class="progress-container">
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" id="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text">
                <span class="progress-current" id="current-amount">0€</span>
                <span class="progress-goal">/ 99€</span>
            </div>
        </div>
        
        <div class="recent-donations" id="recent-donations">
            <div class="recent-donations-title">Recent Supporters</div>
            <div id="donations-list">
                <div class="donation-item">
                    <span class="donation-name">Be the first!</span>
                    <span class="donation-amount">-</span>
                </div>
            </div>
        </div>
        
        <a href="https://ko-fi.com/unitune/goal?g=15" target="_blank" rel="noopener" class="donate-button">
            Support on Ko-fi
        </a>
    </div>
    `;
}

export function getMobileDonationBanner() {
    return `
    <!-- Mobile Donation Banner (Tablet) -->
    <div class="mobile-donation-banner" id="mobile-donation-banner">
        <div class="mobile-donation-content">
            <div class="mobile-donation-header">
                <span class="mobile-donation-title">Support iOS Development</span>
                <span class="mobile-donation-amount" id="mobile-amount">0€ / 99€</span>
            </div>
            <div class="mobile-progress-bar">
                <div class="mobile-progress-fill" id="mobile-progress-fill" style="width: 0%"></div>
            </div>
            <a href="https://ko-fi.com/unitune/goal?g=15" target="_blank" rel="noopener" class="mobile-donate-button">
                Support on Ko-fi
            </a>
        </div>
    </div>
    `;
}

export function getMobileVerticalDonationBar() {
    return `
    <!-- Mobile Vertical Donation Bar (Collapsible) -->
    <div class="mobile-vertical-donation-bar" id="mobile-vertical-bar">
        <button class="vertical-bar-toggle" id="vertical-bar-toggle" aria-label="Toggle donations">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <div class="vertical-progress-indicator" id="vertical-progress-indicator" style="height: 0%"></div>
        </button>
        
        <div class="vertical-bar-panel" id="vertical-bar-panel">
            <div class="vertical-panel-header">
                <h3 class="vertical-panel-title">Support iOS</h3>
                <button class="vertical-panel-close" id="vertical-panel-close" aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <p class="vertical-panel-subtitle">Help us bring UniTune to iPhone & iPad</p>
            
            <div class="vertical-panel-progress">
                <div class="vertical-progress-bar-bg">
                    <div class="vertical-progress-bar-fill" id="vertical-panel-progress-fill" style="width: 0%"></div>
                </div>
                <div class="vertical-progress-text">
                    <span class="vertical-progress-current" id="vertical-panel-amount">0€</span>
                    <span class="vertical-progress-goal">/ 99€</span>
                </div>
            </div>
            
            <div class="vertical-panel-donations" id="vertical-panel-donations">
                <div class="vertical-donations-title">Recent Supporters</div>
                <div id="vertical-donations-list">
                    <div class="vertical-donation-item">
                        <span class="vertical-donation-name">Be the first!</span>
                        <span class="vertical-donation-amount">-</span>
                    </div>
                </div>
            </div>
            
            <a href="https://ko-fi.com/unitune/goal?g=15" target="_blank" rel="noopener" class="vertical-donate-button">
                Support on Ko-fi
            </a>
        </div>
    </div>
    `;
}

export function getDonationsStyles() {
    return `
    /* Horizontal Donation Banner (below navigation) */
    .horizontal-donation-banner {
        position: relative;
        z-index: 10;
        padding: 0 20px;
        margin-top: 24px;
        margin-bottom: 24px;
        animation: slideDown 0.5s ease-out;
    }
    
    .horizontal-banner-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 24px;
        gap: 20px;
        
        /* Liquid Glass Effect */
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.15), rgba(88, 166, 255, 0.08));
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(88, 166, 255, 0.3);
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
    }
    
    .horizontal-banner-left {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
        min-width: 0;
    }
    
    .horizontal-banner-icon {
        width: 40px;
        height: 40px;
        min-width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(88, 166, 255, 0.2);
        border-radius: 12px;
        flex-shrink: 0;
    }
    
    .horizontal-banner-icon svg {
        width: 22px;
        height: 22px;
        color: var(--primary);
    }
    
    .horizontal-banner-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
    }
    
    .horizontal-banner-title {
        font-size: 17px;
        font-weight: 700;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .horizontal-banner-progress-row {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
    }
    
    .horizontal-banner-progress-bg {
        flex: 1;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 100px;
        overflow: hidden;
        min-width: 0;
    }
    
    .horizontal-banner-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--primary-light));
        border-radius: 100px;
        transition: width 1s ease-out;
        box-shadow: 0 0 10px rgba(88, 166, 255, 0.5);
    }
    
    .horizontal-banner-amount {
        font-size: 13px;
        font-weight: 600;
        color: var(--primary);
        white-space: nowrap;
        flex-shrink: 0;
    }
    
    .horizontal-banner-button {
        padding: 10px 24px;
        background: var(--primary);
        color: #0D1117;
        text-decoration: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        transition: all 0.3s;
        white-space: nowrap;
        flex-shrink: 0;
    }
    
    .horizontal-banner-button:hover {
        background: var(--primary-light);
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(88, 166, 255, 0.4);
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .horizontal-donation-banner {
            padding: 0 12px;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        
        .horizontal-banner-container {
            padding: 12px 16px;
            gap: 12px;
        }
        
        .horizontal-banner-icon {
            width: 36px;
            height: 36px;
            min-width: 36px;
        }
        
        .horizontal-banner-icon svg {
            width: 20px;
            height: 20px;
        }
        
        .horizontal-banner-title {
            font-size: 15px;
        }
        
        .horizontal-banner-amount {
            font-size: 12px;
        }
        
        .horizontal-banner-button {
            padding: 8px 18px;
            font-size: 14px;
        }
    }
    
    @media (max-width: 480px) {
        .horizontal-donation-banner {
            margin-top: 16px;
            margin-bottom: 16px;
        }
        
        .horizontal-banner-content {
            gap: 6px;
        }
        
        .horizontal-banner-title {
            font-size: 14px;
        }
        
        .horizontal-banner-progress-bg {
            height: 5px;
        }
        
        .horizontal-banner-amount {
            font-size: 11px;
        }
        
        .horizontal-banner-button {
            padding: 7px 16px;
            font-size: 13px;
        }
    }
    
    /* Donation Card for Song Page Links List */
    .donation-card {
        cursor: default;
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.15), rgba(88, 166, 255, 0.08));
        border: 1px solid rgba(88, 166, 255, 0.3);
        position: relative;
        overflow: hidden;
        padding: 12px 18px;
    }
    
    .donation-card:hover {
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.2), rgba(88, 166, 255, 0.12));
        border-color: rgba(88, 166, 255, 0.5);
    }
    
    .donation-card .service-left {
        flex: 1;
        gap: 14px;
        align-items: center;
        min-width: 0;
    }
    
    .donation-icon {
        width: 32px;
        height: 32px;
        min-width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(88, 166, 255, 0.2);
        border-radius: 8px;
        flex-shrink: 0;
    }
    
    .donation-icon svg {
        width: 18px;
        height: 18px;
        color: var(--primary);
    }
    
    .donation-card-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
        width: 100%;
    }
    
    .donation-card-info .service-name {
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }
    
    .donation-card-progress-row {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
    }
    
    .donation-card-progress-bg {
        flex: 1;
        height: 5px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 100px;
        overflow: hidden;
        min-width: 0;
    }
    
    .donation-card-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--primary-light));
        border-radius: 100px;
        transition: width 1s ease-out;
        box-shadow: 0 0 8px rgba(88, 166, 255, 0.4);
    }
    
    .donation-card-amount {
        font-size: 12px;
        font-weight: 600;
        color: var(--primary);
        white-space: nowrap;
        opacity: 0.9;
        flex-shrink: 0;
    }
    
    .donation-card-action {
        background: var(--primary);
        color: #0D1117;
        padding: 7px 18px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.2s;
        cursor: pointer;
        white-space: nowrap;
        flex-shrink: 0;
    }
    
    .donation-card-action:hover {
        background: var(--primary-light);
        transform: scale(1.05);
    }
    
    @media (max-width: 480px) {
        .donation-card-info .service-name {
            font-size: 15px;
        }
        
        .donation-card-amount {
            font-size: 11px;
        }
        
        .donation-card-action {
            padding: 6px 14px;
            font-size: 13px;
        }
    }
    
    /* Desktop Donation Sidebar */
    .donation-sidebar {
        position: fixed;
        left: max(20px, calc(50% - 640px - 300px));
        top: 50%;
        transform: translateY(-50%);
        width: 280px;
        background: var(--glass-base);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 0.5px solid var(--glass-border);
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 var(--glass-highlight);
        z-index: 100;
        animation: slideInLeft 0.6s ease-out;
        display: none;
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateY(-50%) translateX(-100px);
        }
        to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
        }
    }
    
    .donation-title {
        font-family: var(--font-heading);
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
    }
    
    .donation-subtitle {
        font-size: 13px;
        color: var(--text-secondary);
        margin-bottom: 20px;
        line-height: 1.4;
    }
    
    .progress-container {
        margin-bottom: 16px;
    }
    
    .progress-bar-bg {
        width: 100%;
        height: 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 100px;
        overflow: hidden;
        position: relative;
    }
    
    .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--primary-light));
        border-radius: 100px;
        transition: width 1s ease-out;
        box-shadow: 0 0 20px rgba(88, 166, 255, 0.5);
    }
    
    .progress-text {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 600;
    }
    
    .progress-current {
        color: var(--primary);
    }
    
    .progress-goal {
        color: var(--text-muted);
    }
    
    .recent-donations {
        margin: 20px 0;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .recent-donations-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .donation-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        font-size: 13px;
    }
    
    .donation-name {
        color: var(--text-primary);
        font-weight: 500;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .donation-amount {
        color: var(--primary);
        font-weight: 600;
        margin-left: 8px;
    }
    
    .donate-button {
        width: 100%;
        padding: 12px;
        background: var(--primary);
        color: #0D1117;
        text-align: center;
        text-decoration: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        display: block;
        transition: all 0.3s;
        box-shadow: 0 4px 16px rgba(88, 166, 255, 0.3);
    }
    
    .donate-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(88, 166, 255, 0.4);
        background: var(--primary-light);
    }
    
    /* Mobile Donation Banner (Tablet: 768px-1200px) */
    .mobile-donation-banner {
        display: none;
        background: var(--glass-base);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 0.5px solid var(--glass-border);
        border-radius: 16px;
        padding: 16px;
        margin: 16px 20px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
    }
    
    .mobile-donation-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .mobile-donation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .mobile-donation-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--text-primary);
    }
    
    .mobile-donation-amount {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary);
    }
    
    .mobile-progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .mobile-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--primary-light));
        border-radius: 4px;
        transition: width 0.5s ease;
    }
    
    .mobile-donate-button {
        padding: 10px 16px;
        background: var(--primary);
        color: #0D1117;
        text-align: center;
        text-decoration: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        display: block;
        transition: all 0.3s;
    }
    
    .mobile-donate-button:hover {
        background: var(--primary-light);
    }
    
    /* Mobile Vertical Donation Bar (<768px) */
    .mobile-vertical-donation-bar {
        display: none;
        position: fixed;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
    }
    
    .vertical-bar-toggle {
        width: 48px;
        height: 120px;
        background: var(--glass-base);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 0.5px solid var(--glass-border);
        border-left: none;
        border-radius: 0 16px 16px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px 8px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 4px 0 16px rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;
    }
    
    .vertical-bar-toggle:active {
        transform: scale(0.95);
    }
    
    .vertical-bar-toggle svg {
        width: 24px;
        height: 24px;
        color: var(--primary);
        z-index: 2;
    }
    
    .vertical-progress-indicator {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(180deg, var(--primary-light), var(--primary));
        transition: height 1s ease-out;
        opacity: 0.3;
        z-index: 1;
    }
    
    .vertical-bar-panel {
        position: fixed;
        left: -100%;
        top: 0;
        bottom: 0;
        width: 280px;
        max-width: 85vw;
        background: var(--glass-base);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border-right: 0.5px solid var(--glass-border);
        padding: 24px;
        overflow-y: auto;
        transition: left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 4px 0 32px rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
    
    .vertical-bar-panel.active {
        left: 0;
    }
    
    .vertical-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    
    .vertical-panel-title {
        font-family: var(--font-heading);
        font-size: 20px;
        font-weight: 700;
        color: var(--text-primary);
    }
    
    .vertical-panel-close {
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .vertical-panel-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .vertical-panel-close svg {
        width: 18px;
        height: 18px;
        color: var(--text-secondary);
    }
    
    .vertical-panel-subtitle {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 20px;
        line-height: 1.4;
    }
    
    .vertical-panel-progress {
        margin-bottom: 20px;
    }
    
    .vertical-progress-bar-bg {
        width: 100%;
        height: 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 100px;
        overflow: hidden;
    }
    
    .vertical-progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--primary-light));
        border-radius: 100px;
        transition: width 1s ease-out;
    }
    
    .vertical-progress-text {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 600;
    }
    
    .vertical-progress-current {
        color: var(--primary);
    }
    
    .vertical-progress-goal {
        color: var(--text-muted);
    }
    
    .vertical-panel-donations {
        margin: 20px 0;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .vertical-donations-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .vertical-donation-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        font-size: 13px;
    }
    
    .vertical-donation-name {
        color: var(--text-primary);
        font-weight: 500;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .vertical-donation-amount {
        color: var(--primary);
        font-weight: 600;
        margin-left: 8px;
    }
    
    .vertical-donate-button {
        width: 100%;
        padding: 12px;
        background: var(--primary);
        color: #0D1117;
        text-align: center;
        text-decoration: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        display: block;
        transition: all 0.3s;
    }
    
    .vertical-donate-button:hover {
        background: var(--primary-light);
    }
    
    /* Responsive Breakpoints */
    @media (min-width: 1400px) {
        .donation-sidebar {
            display: block;
        }
    }
    
    @media (min-width: 768px) and (max-width: 1399px) {
        .mobile-donation-banner {
            display: block;
        }
    }
    
    @media (max-width: 767px) {
        .mobile-vertical-donation-bar {
            display: block;
        }
    }
    `;
}

export function getDonationsScript() {
    return `
    <script>
    // Donations Data Loading and UI Update
    async function loadDonationsData() {
        try {
            const response = await fetch('/api/donations');
            if (response.ok) {
                const data = await response.json();
                updateAllDonationUIs(data);
            }
        } catch (error) {
            console.error('Failed to load donations:', error);
        }
    }
    
    function updateAllDonationUIs(data) {
        const current = data.total || 0;
        const goal = data.goal || 99;
        const percentage = Math.min((current / goal) * 100, 100);
        
        // Update horizontal banner (content pages)
        updateElement('horizontal-banner-progress-fill', el => el.style.width = percentage + '%');
        updateElement('horizontal-banner-amount', el => el.textContent = current.toFixed(2) + '€ / ' + goal + '€');
        
        // Update donation card (song page)
        updateElement('donation-card-progress-fill', el => el.style.width = percentage + '%');
        updateElement('donation-card-amount', el => el.textContent = current.toFixed(2) + '€ / ' + goal + '€');
        
        // Update desktop sidebar
        updateElement('progress-fill', el => el.style.width = percentage + '%');
        updateElement('current-amount', el => el.textContent = current.toFixed(2) + '€');
        
        // Update mobile banner
        updateElement('mobile-progress-fill', el => el.style.width = percentage + '%');
        updateElement('mobile-amount', el => el.textContent = current.toFixed(2) + '€ / ' + goal + '€');
        
        // Update vertical bar
        updateElement('vertical-progress-indicator', el => el.style.height = percentage + '%');
        updateElement('vertical-panel-progress-fill', el => el.style.width = percentage + '%');
        updateElement('vertical-panel-amount', el => el.textContent = current.toFixed(2) + '€');
        
        // Update donations lists
        if (data.donations && data.donations.length > 0) {
            const donationsHTML = data.donations
                .slice(0, 5)
                .map(d => \`
                    <div class="donation-item">
                        <span class="donation-name">\${escapeHtml(d.name || 'Anonymous')}</span>
                        <span class="donation-amount">\${d.amount}€</span>
                    </div>
                \`)
                .join('');
            
            updateElement('donations-list', el => el.innerHTML = donationsHTML);
            
            const verticalDonationsHTML = data.donations
                .slice(0, 5)
                .map(d => \`
                    <div class="vertical-donation-item">
                        <span class="vertical-donation-name">\${escapeHtml(d.name || 'Anonymous')}</span>
                        <span class="vertical-donation-amount">\${d.amount}€</span>
                    </div>
                \`)
                .join('');
            
            updateElement('vertical-donations-list', el => el.innerHTML = verticalDonationsHTML);
        }
    }
    
    function updateElement(id, callback) {
        const element = document.getElementById(id);
        if (element) callback(element);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Mobile Vertical Bar Toggle
    function initVerticalBarToggle() {
        const toggle = document.getElementById('vertical-bar-toggle');
        const panel = document.getElementById('vertical-bar-panel');
        const close = document.getElementById('vertical-panel-close');
        
        if (toggle && panel) {
            toggle.addEventListener('click', () => {
                panel.classList.add('active');
            });
        }
        
        if (close && panel) {
            close.addEventListener('click', () => {
                panel.classList.remove('active');
            });
        }
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (panel && panel.classList.contains('active')) {
                if (!panel.contains(e.target) && !toggle.contains(e.target)) {
                    panel.classList.remove('active');
                }
            }
        });
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadDonationsData();
            initVerticalBarToggle();
        });
    } else {
        loadDonationsData();
        initVerticalBarToggle();
    }
    
    // Refresh every 5 minutes
    setInterval(loadDonationsData, 5 * 60 * 1000);
    </script>
    `;
}
