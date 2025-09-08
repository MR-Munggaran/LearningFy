// utils/sanitizeComment.js
export function sanitizeComment(text) {
  if (!text) return "";
  // Hapus hanya tag <p> kalau mau spesifik:
  // return text.replace(/<\/?p>/g, "").trim();

  // Atau hapus semua tag HTML:
  return text.replace(/<[^>]*>?/gm, "").trim();
}
