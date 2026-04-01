// OCR Service - Extract text from PDF/image files using Tesseract.js

import Tesseract from 'tesseract.js';

export const extractOCRFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    return text;
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to extract text from image/PDF');
  }
};

export const extractOCRFromPDF = async (pdfPath) => {
  try {
    // TODO: Implement PDF to image conversion, then OCR
    // For now, return mock data
    return 'Mock extracted text from PDF. In production, use pdf2img + Tesseract';
  } catch (error) {
    console.error('PDF OCR extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export default {
  extractOCRFromImage,
  extractOCRFromPDF,
};
