// Text Cleaner Service - Normalize and clean OCR-extracted text

export const cleanText = (rawText) => {
  if (!rawText) return '';

  let cleaned = rawText
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove special OCR artifacts
    .replace(/[^\w\s.,?!-]/g, '')
    // Trim leading/trailing whitespace
    .trim();

  return cleaned;
};

export const normalizeWhitespace = (text) => {
  return text.replace(/\s+/g, ' ').trim();
};

export const removeOCRArtifacts = (text) => {
  // Remove common OCR errors like |, ~, ^, etc.
  return text.replace(/[|~^`]/g, '');
};

export default {
  cleanText,
  normalizeWhitespace,
  removeOCRArtifacts,
};
