// OCR Service - Extract text from PDF/image files using Tesseract.js

import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';

export const extractOCRFromImage = async (imagePath) => {
  try {
    console.log(`Starting OCR for image: ${imagePath}`);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }

    const { data: { text, confidence } } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );

    console.log(`OCR completed with confidence: ${confidence}`);
    return text;
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error(`Failed to extract text from image: ${error.message}`);
  }
};

export const extractOCRFromPDF = async (pdfPath) => {
  try {
    console.log(`Starting OCR for PDF: ${pdfPath}`);
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`File not found: ${pdfPath}`);
    }

    // For PDF files, we'll use Tesseract's PDF capability
    const { data: { text, confidence } } = await Tesseract.recognize(
      pdfPath,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`PDF OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );

    console.log(`PDF OCR completed with confidence: ${confidence}`);
    return text;
  } catch (error) {
    console.error('PDF OCR extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

export const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  console.log(`Processing file: ${filePath} with extension: ${ext}`);
  
  if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'].includes(ext)) {
    return await extractOCRFromImage(filePath);
  } else if (ext === '.pdf') {
    return await extractOCRFromPDF(filePath);
  } else if (ext === '.txt') {
    // For text files, read directly
    try {
      const text = fs.readFileSync(filePath, 'utf8');
      console.log(`Text extracted from .txt file: ${text.length} characters`);
      return text;
    } catch (error) {
      throw new Error(`Failed to read text file: ${error.message}`);
    }
  } else {
    throw new Error(`Unsupported file type: ${ext}. Supported types: PDF, Images (JPG, PNG), Text`);
  }
};

export default {
  extractOCRFromImage,
  extractOCRFromPDF,
  extractTextFromFile,
};
