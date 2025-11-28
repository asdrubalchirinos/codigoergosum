
/**
 * Basic HTML sanitizer to prevent XSS in broadcast emails.
 * Allows common formatting tags but strips scripts, iframes, objects, etc.
 */
export function sanitizeHtml(html: string): string {
    if (!html) return '';

    // 1. Remove script tags and their content
    let sanitized = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");

    // 2. Remove iframe, object, embed, form, input, button
    sanitized = sanitized.replace(/<\/?(iframe|object|embed|form|input|button)\b[^>]*>/gim, "");

    // 3. Remove event handlers (on*) and javascript: protocols
    // This is a simple regex-based approach. For robust sanitization, a library like DOMPurify is better,
    // but in a Worker environment without DOM, we use regex or a lightweight parser.
    // Given the constraints, we'll strip attributes starting with 'on' and 'javascript:' hrefs.

    // Remove on* attributes
    sanitized = sanitized.replace(/\s+on\w+="[^"]*"/gim, "");
    sanitized = sanitized.replace(/\s+on\w+='[^']*'/gim, "");

    // Remove javascript: hrefs
    sanitized = sanitized.replace(/href="javascript:[^"]*"/gim, 'href="#"');
    sanitized = sanitized.replace(/href='javascript:[^']*'/gim, "href='#'");

    return sanitized;
}
