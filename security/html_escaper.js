/**
 * HTML Escaper - XSS Protection
 * 
 * Escapes HTML special characters to prevent Cross-Site Scripting (XSS) attacks.
 * This module provides functions to sanitize user-provided data before inserting
 * it into HTML documents.
 * 
 * Requirements: 5.1, 5.2
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * 
 * Converts the following characters to their HTML entity equivalents:
 * - < becomes &lt;
 * - > becomes &gt;
 * - & becomes &amp;
 * - " becomes &quot;
 * - ' becomes &#x27;
 * 
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text safe for HTML insertion
 * 
 * @example
 * escapeHtml('<script>alert("XSS")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 * 
 * @example
 * escapeHtml("Song's Title & Artist")
 * // Returns: 'Song&#x27;s Title &amp; Artist'
 */
export function escapeHtml(text) {
    // Handle null, undefined, or non-string inputs
    if (text == null) {
        return '';
    }
    
    // Convert to string if not already
    const str = String(text);
    
    // Character map for HTML entities
    const map = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;',
    };
    
    // Replace all special characters with their HTML entity equivalents
    return str.replace(/[<>&"']/g, (char) => map[char]);
}
