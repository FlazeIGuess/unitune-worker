import { getCommonStyles } from './styles.js';
import { getNavigationBar, getFooter } from './navigation.js';

export function getPrivacyPolicy() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - UniTune</title>
  <style>
    ${getCommonStyles()}
    .content { max-width: 700px; padding: 40px 24px; width: 100%; align-self: center; }
    h1 { font-size: 32px; margin-bottom: 16px; letter-spacing: -0.5px; }
    h2 { font-size: 20px; color: white; margin-top: 40px; margin-bottom: 16px; }
    h3 { font-size: 16px; color: white; margin-top: 24px; margin-bottom: 12px; }
    p, li { color: #A0AEC0; line-height: 1.6; font-size: 16px; margin-bottom: 12px; }
    ul { padding-left: 20px; margin-bottom: 20px; }
    a { color: #4c3bf9; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .last-updated { color: #6B7280; font-size: 14px; margin-bottom: 32px; }
    .section { margin-bottom: 32px; }
  </style>
</head>
<body>
  ${getNavigationBar()}
  <div class="content">
    <h1>Privacy Policy</h1>
    <p class="last-updated">Last Updated: February 12, 2026</p>
    
    <div class="section">
      <p>UniTune is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information in compliance with the General Data Protection Regulation (GDPR) and other applicable privacy laws.</p>
    </div>

    <div class="section">
      <h2>1. Data Controller</h2>
      <p>The data controller responsible for your personal data is:</p>
      <p><strong>UniTune</strong><br>
      Website: unitune.art<br>
      Contact: victor.boiting@gmail.com</p>
    </div>

    <div class="section">
      <h2>2. Data We Collect</h2>
      
      <h3>2.1 Data We DO NOT Collect</h3>
      <p>We believe in privacy by design. UniTune does NOT collect or store:</p>
      <ul>
        <li>Personal identification information (name, email, phone number)</li>
        <li>IP addresses</li>
        <li>Device identifiers or fingerprints</li>
        <li>Listening history or music preferences</li>
        <li>Location data</li>
        <li>Cookies for tracking purposes</li>
      </ul>

      <h3>2.2 Data We Process to Provide the Service</h3>
      <p>We process the minimum data required to provide UniTune features:</p>
      <ul>
        <li><strong>Music URLs:</strong> When you share a music link, we process it through our UniTune API to generate universal links. The URL is processed for conversion and is not stored long-term.</li>
        <li><strong>Playlist Data:</strong> If you create or import a playlist, we store the playlist content needed to provide sharing and import (title, description, track URLs, optional thumbnails, and timestamps).</li>
        <li><strong>Song Metadata Caching:</strong> To improve performance and reduce server load, we temporarily cache public song information (titles, artists, cover images) for up to 24 hours.</li>
        <li><strong>No Tracking:</strong> We do not run analytics or behavioral tracking.</li>
        <li><strong>Cloudflare:</strong> Cloudflare may temporarily process requests for security and performance purposes.</li>
      </ul>
    </div>

    <div class="section">
      <h2>3. Support UniTune</h2>
      <p>UniTune is funded by voluntary support. We do not show advertising on this service.</p>
    </div>

    <div class="section">
      <h2>4. Service Infrastructure</h2>
      
      <h3>4.1 UniTune API</h3>
      <p>We operate our own music link conversion API, hosted in Germany (EU). When you use our service:</p>
      <ul>
        <li>The music URL is processed by our API servers in the EU</li>
        <li>No personal data is collected or stored</li>
        <li>Data is processed in compliance with GDPR</li>
      </ul>

      <h3>4.2 Playlist Storage</h3>
      <p>When you create or import playlists, we store playlist content on our servers in Germany (EU) so that share links can be opened and imported.</p>
      <ul>
        <li>Stored data is limited to playlist content and metadata</li>
        <li>No user accounts are required</li>
        <li>No analytics or tracking is performed</li>
      </ul>

      <h3>4.3 Music Streaming Services</h3>
      <p>When you click on a music service link (Spotify, Apple Music, etc.), you are redirected to that service. Their respective privacy policies apply:</p>
      <ul>
        <li><a href="https://www.spotify.com/privacy" target="_blank" rel="noopener">Spotify Privacy Policy</a></li>
        <li><a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener">Apple Privacy Policy</a></li>
        <li><a href="https://tidal.com/privacy" target="_blank" rel="noopener">TIDAL Privacy Policy</a></li>
        <li><a href="https://www.youtube.com/privacy" target="_blank" rel="noopener">YouTube Privacy Policy</a></li>
        <li><a href="https://www.deezer.com/legal/personal-datas" target="_blank" rel="noopener">Deezer Privacy Policy</a></li>
        <li><a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496" target="_blank" rel="noopener">Amazon Privacy Policy</a></li>
      </ul>

      <h3>4.4 Cloudflare</h3>
      <p>Our service is hosted on Cloudflare Workers. Cloudflare may process technical data for security and performance. Learn more: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare Privacy Policy</a></p>
    </div>

    <div class="section">
      <h2>5. Your Rights Under GDPR</h2>
      <p>As a user in the European Economic Area (EEA), you have the following rights:</p>
      <ul>
        <li><strong>Right to Access:</strong> Request information about data we process (we process none)</li>
        <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
        <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
        <li><strong>Right to Restriction:</strong> Request limitation of data processing</li>
        <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
        <li><strong>Right to Object:</strong> Object to data processing, including for advertising</li>
        <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
        <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
      </ul>
      <p>Since we do not collect or store personal data, most of these rights are automatically fulfilled. For advertising-related requests, please use Google's opt-out tools.</p>
    </div>

    <div class="section">
      <h2>6. Legal Basis for Processing</h2>
      <p>Under GDPR, we process data based on:</p>
      <ul>
        <li><strong>Contractual Necessity (Art. 6(1)(b) GDPR):</strong> To provide playlist sharing and import functionality</li>
        <li><strong>Legitimate Interest (Art. 6(1)(f) GDPR):</strong> To operate and secure the service</li>
      </ul>
    </div>

    <div class="section">
      <h2>7. Data Retention</h2>
      <p>Playlist data is stored only as long as needed to provide sharing and import. Playlists may be deleted upon request and may be automatically removed after a period of inactivity.</p>
    </div>

    <div class="section">
      <h2>8. International Data Transfers</h2>
      <p>Our service uses Cloudflare's global network. Data may be processed in countries outside the EEA. Cloudflare complies with GDPR through Standard Contractual Clauses (SCCs).</p>
    </div>

    <div class="section">
      <h2>9. Children's Privacy</h2>
      <p>Our service is not directed to children under 16. We do not knowingly collect data from children.</p>
    </div>

    <div class="section">
      <h2>10. Changes to This Policy</h2>
      <p>We may update this Privacy Policy. Changes will be posted on this page with an updated "Last Updated" date.</p>
    </div>

    <div class="section">
      <h2>11. Contact Us</h2>
      <p>For privacy-related questions or to exercise your rights, contact us at:</p>
      <p><strong>Email:</strong> victor.boiting@gmail.com<br>
      <strong>Website:</strong> <a href="https://unitune.art">unitune.art</a></p>
    </div>

    <div class="section">
      <h2>12. Data Protection Authority</h2>
      <p>If you are in the EEA and have concerns about our data practices, you can contact your local data protection authority. Find your authority: <a href="https://edpb.europa.eu/about-edpb/board/members_en" target="_blank" rel="noopener">EDPB Member List</a></p>
    </div>
    
    <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
        <a href="/">&larr; Back to Home</a>
    </div>
  </div>
  ${getFooter()}
</body>
</html>`;
}

export function getAppPrivacyPolicy() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Privacy Policy - UniTune</title>
  <style>
    ${getCommonStyles()}
    .content { max-width: 700px; padding: 40px 24px; width: 100%; align-self: center; }
    h1 { font-size: 32px; margin-bottom: 16px; letter-spacing: -0.5px; }
    h2 { font-size: 20px; color: white; margin-top: 40px; margin-bottom: 16px; }
    h3 { font-size: 16px; color: white; margin-top: 24px; margin-bottom: 12px; }
    p, li { color: #A0AEC0; line-height: 1.6; font-size: 16px; margin-bottom: 12px; }
    ul { padding-left: 20px; margin-bottom: 20px; }
    a { color: #4c3bf9; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .last-updated { color: #6B7280; font-size: 14px; margin-bottom: 32px; }
    .section { margin-bottom: 32px; }
    .highlight { background: rgba(76, 59, 249, 0.1); border-left: 3px solid #4c3bf9; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0; }
  </style>
</head>
<body>
  ${getNavigationBar()}
  <div class="content">
    <h1>UniTune App Privacy Policy</h1>
    <p class="last-updated">Last Updated: February 12, 2026</p>
    
    <div class="highlight">
      <strong>Privacy by Design:</strong> No accounts, no tracking. Playlist data is stored on our servers only when you choose to share or import playlists.
    </div>

    <div class="section">
      <h2>1. What Data We Collect</h2>
      <p>UniTune is designed with privacy as a core principle. We collect only the minimum data needed to provide playlist sharing and import:</p>
      <ul>
        <li>No user accounts required</li>
        <li>No personal information required</li>
        <li>No analytics or tracking</li>
        <li>No advertising in the app</li>
        <li><strong>Playlist data:</strong> Title, description, track URLs, optional thumbnails, and timestamps when you create or import playlists</li>
      </ul>
    </div>

    <div class="section">
      <h2>2. How the App Works</h2>
      <p>When you share a music link or create a playlist through UniTune:</p>
      <ul>
        <li>The link is processed locally or via our privacy-respecting API</li>
        <li>No personal data is attached to the request</li>
        <li>Your music preferences are never stored or analyzed</li>
        <li>Playlists you choose to share or import are stored on our servers to enable access</li>
        <li>Share history is stored locally on your device</li>
      </ul>
    </div>

    <div class="section">
      <h2>3. Permissions Used</h2>
      <h3>Android</h3>
      <ul>
        <li><strong>Internet:</strong> To convert music links between platforms</li>
        <li><strong>Receive Share Intent:</strong> To receive music links from other apps</li>
      </ul>
      <h3>iOS</h3>
      <ul>
        <li><strong>Network Access:</strong> To convert music links between platforms</li>
        <li><strong>Share Extension:</strong> To receive music links from other apps</li>
      </ul>
    </div>

    <div class="section">
      <h2>4. Service Infrastructure</h2>
      
      <h3>4.1 UniTune API</h3>
      <p>We operate our own music link conversion API, hosted in Germany (EU). When you use our service:</p>
      <ul>
        <li>The music URL is processed by our API servers in the EU</li>
        <li>No personal data is collected or stored</li>
        <li>Data is processed in compliance with GDPR</li>
      </ul>

      <h3>4.2 Playlist Storage</h3>
      <p>When you create or import playlists, we store playlist content on our servers in Germany (EU) so that share links can be opened and imported.</p>
      <ul>
        <li>Stored data is limited to playlist content and metadata</li>
        <li>No user accounts are required</li>
        <li>No analytics or tracking is performed</li>
      </ul>

      <h3>4.3 Music Streaming Services</h3>
      <p>When you click on a music service link (Spotify, Apple Music, etc.), you are redirected to that service. Their respective privacy policies apply:</p>
      <ul>
        <li><a href="https://www.spotify.com/privacy" target="_blank" rel="noopener">Spotify Privacy Policy</a></li>
        <li><a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener">Apple Privacy Policy</a></li>
        <li><a href="https://tidal.com/privacy" target="_blank" rel="noopener">TIDAL Privacy Policy</a></li>
        <li><a href="https://www.youtube.com/privacy" target="_blank" rel="noopener">YouTube Privacy Policy</a></li>
        <li><a href="https://www.deezer.com/legal/personal-datas" target="_blank" rel="noopener">Deezer Privacy Policy</a></li>
        <li><a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496" target="_blank" rel="noopener">Amazon Privacy Policy</a></li>
      </ul>
    </div>

    <div class="section">
      <h2>5. Data Storage</h2>
      <ul>
        <li><strong>On-Device:</strong> Share history and preferences are stored locally on your device</li>
        <li><strong>Server Storage:</strong> Playlists you choose to share or import are stored on our servers</li>
        <li><strong>Deletion:</strong> You can request deletion of server-stored playlists at any time</li>
      </ul>
    </div>

    <div class="section">
      <h2>6. Children's Privacy</h2>
      <p>Our app does not collect any personal information from anyone, including children under 13.</p>
    </div>

    <div class="section">
      <h2>7. Your Rights</h2>
      <p>You can request access to or deletion of server-stored playlists. Contact us to exercise your rights.</p>
    </div>

    <div class="section">
      <h2>8. Contact</h2>
      <p>Questions about this policy? Contact us at:<br>
      <strong>Email:</strong> victor.boiting@gmail.com<br>
      <strong>Website:</strong> <a href="https://unitune.art">unitune.art</a></p>
    </div>
    
    <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
        <a href="/">&larr; Back to Home</a>
        <span style="margin: 0 10px; color: rgba(255,255,255,0.3);">•</span>
        <a href="/privacy">Website Privacy Policy</a>
    </div>
  </div>
  ${getFooter()}
</body>
</html>`;
}

export function getAssetLinks() {
    return JSON.stringify([
        {
            "relation": [
                "delegate_permission/common.handle_all_urls",
                "delegate_permission/common.get_login_creds"
            ],
            "target": {
                "namespace": "android_app",
                "package_name": "de.unitune.unitune",
                "sha256_cert_fingerprints": [
                    "00:A8:4E:3C:EB:8F:86:43:F4:3A:0C:2D:47:53:E8:F0:5E:A1:03:9A:3C:F6:E1:67:F9:0E:6B:8D:96:B0:CC:C6",
                    "BA:83:7A:A1:73:E4:ED:D9:62:54:A9:2C:36:36:63:AD:37:D4:DC:4B:3D:1F:DC:EF:59:24:49:7D:EF:15:43:47"
                ]
            }
        }
    ], null, 2);
}

export function getAppleAppSiteAssociation() {
    // TODO: Replace TEAM_ID with your actual Apple Developer Team ID before iOS release
    // You can find your Team ID at: https://developer.apple.com/account -> Membership
    return JSON.stringify({
        "applinks": {
            "apps": [],
            "details": [
                {
                    "appID": "TEAM_ID.de.unitune.unitune",
                    "paths": ["/s/*", "/p/*"]
                }
            ]
        },
        "webcredentials": {
            "apps": ["TEAM_ID.de.unitune.unitune"]
        }
    }, null, 2);
}
