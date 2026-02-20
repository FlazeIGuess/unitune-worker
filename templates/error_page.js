import { escapeHtml } from '../security/html_escaper.js';
import { getCommonStyles } from './styles.js';

export function getErrorPage(message) {
    // Escape error message to prevent XSS
    const escapedMessage = escapeHtml(message);

    return `<!DOCTYPE html>
<html>
<head>
    <title>Error - UniTune</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0D1117">
    <style>
        ${getCommonStyles()}
        body { 
            justify-content: center; 
            text-align: center; 
            padding: 40px;
            min-height: 100vh;
        }
        .error-container {
            max-width: 400px;
            padding: 40px;
            animation: scaleIn 0.5s ease-out;
        }
        .error-icon {
            font-size: 64px;
            margin-bottom: 24px;
            animation: fadeIn 0.5s ease-out;
        }
        h1 { 
            font-size: 24px; 
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--text-primary);
        }
        p { 
            color: var(--text-secondary);
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.2s;
        }
        .back-link:hover {
            opacity: 0.8;
        }
    </style>
</head>
<body>
  <div class="error-container glass-card">
    <h1>Something went wrong</h1>
    <p>${escapedMessage}</p>
    <a href="/" class="back-link">← Back to Home</a>
  </div>
</body>
</html>`;
}
