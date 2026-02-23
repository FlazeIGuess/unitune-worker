export function getNavigationBar() {
    return `
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">
                <svg class="logo-icon" viewBox="0 0 842.13 985.84" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#58A6FF" d="M27.4,66.27c47.21-1.28,89.07,6.86,126.48,38.09,66.15,55.21,60.95,144.27,61.18,221.93l.08,181.23c-.06,37.69-.86,74.85,1.61,112.49,6.97,106.45,93.55,175.65,199.23,165.87,42.47-3.55,83.05-19.14,116.97-44.95,92.36-69.31,92.93-166.31,91.37-269.59-.81-53.71-.31-108.8-.54-162.62.54-8.04-1.42-37.8,5.3-42.69,16.26-11.84,61.03,23.88,70.98,33.39,40.76,38.96,42.64,101.83,43.46,154.32.27,25.33.36,50.67.3,76-.11,28.44.91,59.71-.19,87.72-3.47,84.27-23.66,162.29-76.5,229.62-127.43,162.4-369.95,181.63-532.07,60.97C60.91,852.85,16.04,761.04,3.14,670.93c-4.6-32.15-2.79-71.35-2.76-104.35l.03-154.11.05-198.05c-.06-37.93-.93-76.13.76-114,.82-18.45,6-31.92,26.19-34.14Z"/>
                    <path fill="#58A6FF" d="M548.39.27c32.61-1.76,32.41,4.66,45.8,30.51,13.33,25.75,39.38,45.82,63.55,61.14,59.59,38.01,123.95,60.45,161.72,125.48,35.17,60.55,31.75,164.75-26.84,211.97-1.84,1.48-4.59.74-6.61.17-2.7-2.29-5.04-5.81-5.16-9.34-1.14-34.32-4.14-64.88-16.53-97.5-17.4-45.81-55.32-75.56-99.64-93.86-20.16-8.32-45.76-16.27-67.19-7.41l-1.19.51c-3.33,4.16-8.05,10.61-8.7,15.95-3.52,28.74-2.76,61.05-2.78,89.91l.27,153.28c-.02,33.57,1.23,59.36-1.59,93.15-11.16,83.39-58.86,146.18-141.48,168.21-126.33,33.67-234.19-80.57-162.98-199.56,36.36-60.76,103.18-96.85,173.8-90.85,17.49,1.38,59.93,24.05,67.19-4.54,3.74-26.18,2.01-61.22,1.97-88.52l-.05-205.92c-.01-37.68-.88-75.74.72-113.35.98-23.07,1.95-33.98,25.72-39.44Z"/>
                </svg>
                <span class="logo-text">UniTune</span>
            </a>
            <div class="nav-links-wrapper">
                <div class="nav-links">
                    <a href="/about" class="nav-link">About</a>
                    <a href="/features" class="nav-link">Features</a>
                    <a href="/how-it-works" class="nav-link">How It Works</a>
                    <a href="/faq" class="nav-link">FAQ</a>
                    <a href="/contact" class="nav-link">Contact</a>
                </div>
            </div>
            <button class="nav-toggle" aria-label="Toggle navigation" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
        <div class="mobile-menu" id="mobile-menu">
            <a href="/about" class="mobile-link">About</a>
            <a href="/features" class="mobile-link">Features</a>
            <a href="/how-it-works" class="mobile-link">How It Works</a>
            <a href="/faq" class="mobile-link">FAQ</a>
            <a href="/contact" class="mobile-link">Contact</a>
        </div>
    </nav>
    <style>
        .navbar {
            position: sticky;
            top: 20px;
            z-index: 1000;
            padding: 0 20px;
            margin-bottom: 40px;
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 24px;
            
            /* Liquid Glass Effect */
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }
        
        .nav-logo {
            display: flex;
            align-items: center;
            gap: 16px;
            text-decoration: none;
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            margin-right: 32px;
        }
        
        .nav-logo:hover {
            transform: scale(1.05);
        }
        
        .logo-icon {
            width: 32px;
            height: 32px;
            transition: transform 0.3s;
        }
        
        .logo-icon path {
            transition: fill 0.3s;
        }
        
        .nav-logo:hover .logo-icon {
            transform: scale(1.1);
        }
        
        .logo-text {
            font-size: 22px;
            font-weight: 700;
            color: #FFFFFF;
            letter-spacing: -0.5px;
        }
        
        .nav-links-wrapper {
            flex: 1;
            display: flex;
            justify-content: center;
        }
        
        .nav-links {
            display: flex;
            gap: 8px;
            padding: 6px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .nav-link {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 10px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            position: relative;
        }
        
        .nav-link:hover {
            color: #FFFFFF;
            background: rgba(88, 166, 255, 0.15);
            transform: translateY(-1px);
        }
        
        .nav-link:active {
            transform: scale(0.98);
        }
        
        .nav-toggle {
            display: none;
            flex-direction: column;
            gap: 5px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            cursor: pointer;
            padding: 10px;
            transition: all 0.3s;
        }
        
        .nav-toggle:hover {
            background: rgba(255, 255, 255, 0.08);
        }
        
        .nav-toggle span {
            width: 20px;
            height: 2px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 2px;
            transition: all 0.3s;
        }
        
        .mobile-menu {
            display: none;
            flex-direction: column;
            gap: 8px;
            margin-top: 12px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: slideDown 0.3s ease-out;
        }
        
        .mobile-menu.active {
            display: flex;
        }
        
        .mobile-link {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            padding: 12px 16px;
            border-radius: 10px;
            transition: all 0.3s;
        }
        
        .mobile-link:hover {
            color: #FFFFFF;
            background: rgba(88, 166, 255, 0.15);
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .navbar {
                top: 10px;
                padding: 0 12px;
            }
            
            .nav-container {
                padding: 10px 16px;
            }
            
            .nav-links-wrapper {
                display: none;
            }
            
            .nav-toggle {
                display: flex;
            }
            
            .logo-text {
                font-size: 20px;
            }
        }
        
        @media (max-width: 480px) {
            .logo-icon {
                width: 28px;
                height: 28px;
            }
            
            .logo-text {
                font-size: 18px;
            }
        }
    </style>
    <script>
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('active');
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const navbar = document.querySelector('.navbar');
            const toggle = document.querySelector('.nav-toggle');
            const menu = document.getElementById('mobile-menu');
            
            if (!navbar.contains(event.target) && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', function() {
                document.getElementById('mobile-menu').classList.remove('active');
            });
        });
    </script>
    `;
}

export function getFooter() {
    return `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-section">
                <div class="footer-logo">
                    <svg class="footer-logo-icon" viewBox="0 0 842.13 985.84" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#58A6FF" d="M27.4,66.27c47.21-1.28,89.07,6.86,126.48,38.09,66.15,55.21,60.95,144.27,61.18,221.93l.08,181.23c-.06,37.69-.86,74.85,1.61,112.49,6.97,106.45,93.55,175.65,199.23,165.87,42.47-3.55,83.05-19.14,116.97-44.95,92.36-69.31,92.93-166.31,91.37-269.59-.81-53.71-.31-108.8-.54-162.62.54-8.04-1.42-37.8,5.3-42.69,16.26-11.84,61.03,23.88,70.98,33.39,40.76,38.96,42.64,101.83,43.46,154.32.27,25.33.36,50.67.3,76-.11,28.44.91,59.71-.19,87.72-3.47,84.27-23.66,162.29-76.5,229.62-127.43,162.4-369.95,181.63-532.07,60.97C60.91,852.85,16.04,761.04,3.14,670.93c-4.6-32.15-2.79-71.35-2.76-104.35l.03-154.11.05-198.05c-.06-37.93-.93-76.13.76-114,.82-18.45,6-31.92,26.19-34.14Z"/>
                        <path fill="#58A6FF" d="M548.39.27c32.61-1.76,32.41,4.66,45.8,30.51,13.33,25.75,39.38,45.82,63.55,61.14,59.59,38.01,123.95,60.45,161.72,125.48,35.17,60.55,31.75,164.75-26.84,211.97-1.84,1.48-4.59.74-6.61.17-2.7-2.29-5.04-5.81-5.16-9.34-1.14-34.32-4.14-64.88-16.53-97.5-17.4-45.81-55.32-75.56-99.64-93.86-20.16-8.32-45.76-16.27-67.19-7.41l-1.19.51c-3.33,4.16-8.05,10.61-8.7,15.95-3.52,28.74-2.76,61.05-2.78,89.91l.27,153.28c-.02,33.57,1.23,59.36-1.59,93.15-11.16,83.39-58.86,146.18-141.48,168.21-126.33,33.67-234.19-80.57-162.98-199.56,36.36-60.76,103.18-96.85,173.8-90.85,17.49,1.38,59.93,24.05,67.19-4.54,3.74-26.18,2.01-61.22,1.97-88.52l-.05-205.92c-.01-37.68-.88-75.74.72-113.35.98-23.07,1.95-33.98,25.72-39.44Z"/>
                    </svg>
                    <h4>UniTune</h4>
                </div>
                <p>Universal music link sharing across all platforms.</p>
            </div>
            <div class="footer-section">
                <h4>Product</h4>
                <a href="/features">Features</a>
                <a href="/how-it-works">How It Works</a>
                <a href="/faq">FAQ</a>
            </div>
            <div class="footer-section">
                <h4>Company</h4>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/privacy-app">App Privacy Policy</a>
                <a href="#" id="footer-withdraw-consent" style="color:rgba(255,255,255,0.35);font-size:12px;">Withdraw Ad Consent</a>
            </div>
            <div class="footer-section">
                <h4>Open Source</h4>
                <a href="https://github.com/FlazeIGuess/unitune" target="_blank" rel="noopener">GitHub</a>
                <a href="https://github.com/FlazeIGuess/unitune/blob/main/LICENSE" target="_blank" rel="noopener">License</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>2026 UniTune. Open source under AGPL-3.0 license.</p>
        </div>
    </footer>
    <style>
        .footer {
            margin-top: 80px;
            padding: 60px 20px 40px;
        }
        
        .footer-container {
            max-width: 1200px;
            margin: 0 auto 40px;
            padding: 40px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
            
            /* Liquid Glass Effect */
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
        }
        
        .footer-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .footer-logo-icon {
            width: 32px;
            height: 32px;
        }
        
        .footer-section h4 {
            color: #FFFFFF;
            margin-bottom: 16px;
            font-size: 16px;
            font-weight: 600;
        }
        
        .footer-section p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            line-height: 1.6;
        }
        
        .footer-section a {
            display: block;
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            font-size: 14px;
            margin-bottom: 10px;
            transition: all 0.3s;
            padding: 4px 0;
        }
        
        .footer-section a:hover {
            color: #58A6FF;
            transform: translateX(4px);
        }
        
        .footer-bottom {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px 40px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            text-align: center;
        }

        #footer-withdraw-consent:hover {
            color: rgba(255,255,255,0.6) !important;
            transform: none !important;
        }
        
        .footer-bottom p {
            color: rgba(255, 255, 255, 0.4);
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .footer-container {
                grid-template-columns: 1fr;
                gap: 32px;
                padding: 32px 24px;
            }
        }
        
        .content-wrapper {
            max-width: 800px;
            margin: 0 auto;
            padding: 60px 24px;
        }
        .content-wrapper h1 {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 16px;
            letter-spacing: -1px;
            background: linear-gradient(to bottom, #fff, #ccc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .content-wrapper h2 {
            font-size: 32px;
            color: white;
            margin-top: 40px;
            margin-bottom: 16px;
        }
        .content-wrapper h3 {
            font-size: 24px;
            color: white;
            margin-top: 24px;
            margin-bottom: 12px;
        }
        .content-wrapper p, .content-wrapper li {
            color: #A0AEC0;
            line-height: 1.8;
            font-size: 16px;
            margin-bottom: 16px;
        }
        .content-wrapper ul {
            padding-left: 24px;
            margin-bottom: 24px;
        }
        .content-wrapper a {
            color: #58A6FF;
            text-decoration: none;
        }
        .content-wrapper a:hover {
            text-decoration: underline;
        }
        .lead {
            font-size: 20px !important;
            color: #C9D1D9 !important;
            margin-bottom: 32px !important;
        }
        .faq-item, .feature-section, .step-section {
            margin-bottom: 32px;
            padding: 24px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .cta-section {
            margin-top: 48px;
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
        }
        .button-primary, .button-secondary {
            display: inline-block;
            padding: 14px 28px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s;
        }
        .button-primary {
            background: #58A6FF;
            color: #0D1117;
        }
        .button-primary:hover {
            background: #4a8fd9;
            color: #0D1117;
            transform: translateY(-2px);
        }
        .button-secondary {
            background: rgba(255, 255, 255, 0.05);
            color: #C9D1D9;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .button-secondary:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateY(-2px);
        }
    </style>
    `;
}
