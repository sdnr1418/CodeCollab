// Stored XSS protection for chat (Lecture 24/25): strip every HTML tag before saving,
// so "<script>alert(1)</script>hi" is stored as "hi". React escapes output too, so this is a second layer.
import sanitizeHtml from 'sanitize-html'

export const cleanText = (text) =>
  sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }).trim()