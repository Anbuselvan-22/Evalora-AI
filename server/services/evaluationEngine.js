// Evaluation Engine - Score answers against rubric using AI/LLM

import { extractTextFromFile } from './ocrService.js';

// Language detection
const detectLanguage = (text) => {
  // Simple language detection based on character patterns
  const tamilPattern = /[\u0B80-\u0BFF]/; // Tamil Unicode range
  const hindiPattern = /[\u0900-\u097F]/; // Hindi Unicode range
  const arabicPattern = /[\u0600-\u06FF]/; // Arabic Unicode range
  const chinesePattern = /[\u4E00-\u9FFF]/; // Chinese Unicode range
  
  if (tamilPattern.test(text)) return 'tamil';
  if (hindiPattern.test(text)) return 'hindi';
  if (arabicPattern.test(text)) return 'arabic';
  if (chinesePattern.test(text)) return 'chinese';
  return 'english'; // Default to English
};

// Language-specific evaluation criteria
const getLanguageCriteria = (language) => {
  const criteria = {
    english: {
      depthIndicators: [
        'because', 'therefore', 'however', 'although', 'since', 'due to',
        'first', 'second', 'finally', 'in conclusion', 'for example',
        'such as', 'moreover', 'furthermore', 'additionally'
      ],
      sentenceSeparators: /[.!?]+/,
      wordSeparators: /\s+/,
      minLength: 10
    },
    tamil: {
      depthIndicators: [
        '\u0b8f\u0ba9\u0bcd\u0ba9\u0ba4\u0bc1', '\u0b86\u0b95\u0bc8\u0baf\u0bbe\u0bb2\u0bcd', '\u0b86\u0ba9\u0bbe\u0bb2\u0bcd', '\u0b8e\u0ba9\u0bcd\u0bb1\u0bbe\u0bb2\u0bcd', '\u0b95\u0bbe\u0bb0\u0ba3\u0bae\u0bbe\u0b95',
        '\u0bae\u0bc1\u0ba4\u0bb2\u0bbf\u0bb2\u0bcd', '\u0b87\u0bb0\u0ba3\u0bcd\u0b9f\u0bbe\u0bb5\u0ba4\u0bbe\u0b95', '\u0b87\u0bb1\u0bc1\u0ba4\u0bbf\u0baf\u0bbf\u0bb2\u0bcd', '\u0b8e\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bcd\u0b95\u0bbe\u0b9f\u0bcd\u0b9f\u0bbe\u0b95',
        '\u0baa\u0bcb\u0ba9\u0bcd\u0bb1\u0bc1', '\u0bae\u0bc7\u0bb2\u0bc1\u0bae\u0bcd', '\u0b95\u0bc2\u0b9f', '\u0b85\u0ba4\u0ba9\u0bbe\u0bb2\u0bcd'
      ],
      sentenceSeparators: /[.!?।]+/,
      wordSeparators: /\s+/,
      minLength: 5
    },
    hindi: {
      depthIndicators: [
        '\u0915\u094d\u092f\u094b\u0902\u0915\u093f', '\u0907\u0938\u0932\u093f\u090f', '\u092a\u0930\u0928\u094d\u0924\u0941', '\u0939\u093e\u0932\u093e\u0902\u0915\u093f', '\u091a\u0942\u0902\u0915\u093f', '\u0915\u094d\u092f\u094b\u0902\u0915\u093f',
        '\u092a\u0939\u0932\u0947', '\u0926\u0942\u0938\u0930\u093e', '\u0905\u0902\u0924 \u092e\u0947\u0902', '\u0909\u0926\u093e\u0939\u0930\u0923 \u0915\u0947 \u0932\u093f\u090f',
        '\u091c\u0948\u0938\u0947', '\u0907\u0938\u0915\u0947 \u0905\u0932\u093e\u0935\u093e', '\u0914\u0930', '\u0938\u093e\u0925 \u0939\u0940'
      ],
      sentenceSeparators: /[.!?।]+/,
      wordSeparators: /\s+/,
      minLength: 5
    },
    default: {
      depthIndicators: [
        'because', 'therefore', 'however', 'although', 'since', 'due to',
        'first', 'second', 'finally', 'in conclusion', 'for example',
        'such as', 'moreover', 'furthermore', 'additionally'
      ],
      sentenceSeparators: /[.!?।]+/,
      wordSeparators: /\s+/,
      minLength: 5
    }
  };
  
  return criteria[language] || criteria.default;
};

// Simple LLM simulation for evaluation (can be replaced with OpenAI/Gemini)
const evaluateWithLLM = async (answer, rubric, questionNumber) => {
  try {
    // Detect language of the answer
    const language = detectLanguage(answer);
    const criteria = getLanguageCriteria(language);
    
    console.log(`Detected language: ${language} for question ${questionNumber}`);
    
    // For now, implement a rule-based evaluation system
    // In production, replace with actual LLM API call
    
    const evaluationCriteria = {
      completeness: calculateCompleteness(answer, criteria),
      correctness: calculateCorrectness(answer, rubric, criteria),
      clarity: calculateClarity(answer, criteria),
      depth: calculateDepth(answer, criteria),
      language: language
    };

    const totalScore = Object.values(evaluationCriteria).reduce((sum, score) => sum + score, 0) / 4;
    const maxScore = 20; // Default max marks per question
    
    const obtainedMarks = Math.round((totalScore / 100) * maxScore);
    
    const mistakes = generateMistakes(evaluationCriteria, language);
    const suggestions = generateSuggestions(evaluationCriteria, language);

    return {
      questionNumber: questionNumber || 1,
      marks: Math.max(0, obtainedMarks) || 0,
      totalMarks: Math.max(0, maxScore) || 20,
      correctPoints: Math.max(0, Math.round(totalScore * 0.8)) || 0,
      missingPoints: Math.max(0, maxScore - obtainedMarks) || 0,
      mistakes: Array.isArray(mistakes) ? mistakes : [],
      suggestions: Array.isArray(suggestions) ? suggestions : [],
      confidence: Math.max(0, Math.min(1, calculateConfidence(evaluationCriteria))) || 0.5,
      language: language || 'english'
    };
  } catch (error) {
    console.error(`LLM evaluation error for Q${questionNumber}:`, error);
    throw new Error(`Failed to evaluate question ${questionNumber}`);
  }
};

const calculateCompleteness = (answer, criteria) => {
  if (!answer || answer.length < criteria.minLength) return 20;
  
  const sentences = answer.split(criteria.sentenceSeparators).filter(s => s.trim().length > 0);
  const wordCount = answer.split(criteria.wordSeparators).length;
  
  let score = 40;
  if (wordCount >= 20) score += 30;
  else if (wordCount >= 10) score += 20;
  else score += 10;
  
  if (sentences.length >= 3) score += 20;
  else if (sentences.length >= 2) score += 10;
  
  return Math.min(score, 100);
};

const calculateCorrectness = (answer, rubric, criteria) => {
  if (!rubric) return 70; // Default if no rubric
  
  const rubricKeywords = rubric.toLowerCase().split(criteria.wordSeparators);
  const answerWords = answer.toLowerCase().split(criteria.wordSeparators);
  
  let matches = 0;
  rubricKeywords.forEach(keyword => {
    if (answerWords.some(word => word.includes(keyword) || keyword.includes(word))) {
      matches++;
    }
  });
  
  const matchPercentage = (matches / rubricKeywords.length) * 100;
  return Math.min(Math.round(matchPercentage * 1.2), 100); // Boost score slightly
};

const calculateClarity = (answer, criteria) => {
  if (!answer) return 30;
  
  const sentences = answer.split(criteria.sentenceSeparators).filter(s => s.trim().length > 0);
  const avgSentenceLength = answer.split(criteria.wordSeparators).length / sentences.length;
  
  let score = 50;
  
  // Penalize very short or very long sentences
  if (avgSentenceLength >= 10 && avgSentenceLength <= 25) score += 30;
  else if (avgSentenceLength >= 8 && avgSentenceLength <= 35) score += 20;
  else score += 10;
  
  // Check for proper structure
  if (answer.includes('.') || answer.includes('!') || answer.includes('?') || answer.includes('।')) score += 20;
  
  return Math.min(score, 100);
};

const calculateDepth = (answer, criteria) => {
  if (!answer) return 30;
  
  let depthScore = 40;
  const words = answer.toLowerCase().split(criteria.wordSeparators);
  
  criteria.depthIndicators.forEach(indicator => {
    if (words.includes(indicator)) {
      depthScore += 10;
    }
  });
  
  return Math.min(depthScore, 100);
};

const generateMistakes = (criteria, language) => {
  const mistakes = [];
  
  if (criteria.completeness < 60) {
    mistakes.push(language === 'tamil' ? '\u0baa\u0ba4\u0bbf\u0bb2\u0bcd \u0bae\u0bbf\u0b95\u0bb5\u0bc1\u0bae\u0bcd \u0b9a\u0bc1\u0bb0\u0bc1\u0b95\u0bcd\u0bae\u0bbe\u0b95 \u0b89\u0bb3\u0bcd\u0bb3\u0ba4\u0bc1 \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0bae\u0bc1\u0bb4\u0bc1\u0bae\u0bc8\u0bbe\u0ba9\u0ba4\u0bc1 \u0b85\u0bb2\u0bcd\u0bb2' : 'Answer is too brief or incomplete');
  }
  if (criteria.correctness < 60) {
    mistakes.push(language === 'tamil' ? '\u0baa\u0ba4\u0bbf\u0bb2\u0bcd \u0b95\u0bc7\u0bb3\u0bcd\u0bb5\u0bbf\u0b95\u0bcd\u0b95\u0bc1 \u0bae\u0bc1\u0bb4\u0bc1\u0bae\u0bc8\u0bbe\u0b95 \u0baa\u0ba4\u0bbf\u0bb2\u0bbf\u0b95\u0bcd\u0b95\u0bb5\u0bbf\u0bb2\u0bcd\u0bb2\u0bc8' : 'Answer does not fully address the question');
  }
  if (criteria.clarity < 60) {
    mistakes.push(language === 'tamil' ? '\u0baa\u0ba4\u0bbf\u0bb2\u0bbf\u0bb2\u0bcd \u0ba4\u0bc6\u0bb3\u0bbf\u0bb5\u0bc1 \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0b9a\u0bb0\u0bbf\u0baf\u0bbe\u0ba9\u0bcd \u0b85\u0bae\u0bc8\u0baa\u0bcd\u0baa\u0bc1 \u0b87\u0bb2\u0bcd\u0bb2\u0bc8' : 'Answer lacks clarity or proper structure');
  }
  if (criteria.depth < 60) {
    mistakes.push(language === 'tamil' ? '\u0baa\u0ba4\u0bbf\u0bb2\u0bbf\u0bb2\u0bcd \u0b86\u0bb4\u0bae\u0bcd \u0b87\u0bb2\u0bcd\u0bb2\u0bc8 \u0b86\u0ba4\u0bb0\u0bb5\u0bbe\u0ba9\u0bcd \u0bb5\u0bbf\u0bb5\u0bb0\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b87\u0bb2\u0bcd\u0bb2\u0bc8' : 'Answer lacks depth or supporting details');
  }
  
  return mistakes;
};

const generateSuggestions = (criteria, language) => {
  const suggestions = [];
  
  if (criteria.completeness < 60) {
    suggestions.push(language === 'tamil' ? '\u0bae\u0bbf\u0b95\u0bb5\u0bc1\u0bae\u0bcd \u0bb5\u0bbf\u0bb0\u0bbf\u0bb5\u0bbe\u0ba9\u0bcd \u0bb5\u0bbf\u0bb3\u0b95\u0bcd\u0b95\u0bae\u0bcd \u0ba4\u0baf\u0bb5\u0bc1 \u0b9a\u0bc6\u0baf\u0bcd\u0baf\u0bb5\u0bc1\u0bae\u0bcd' : 'Provide more comprehensive explanation');
  }
  if (criteria.correctness < 60) {
    suggestions.push(language === 'tamil' ? '\u0b95\u0bc7\u0bb3\u0bcd\u0bb5\u0bbf \u0ba4\u0bc7\u0bb5\u0bc8\u0b95\u0bb3\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0bae\u0bc1\u0b95\u0bcd\u0b95\u0bbf\u0baf \u0b95\u0bb0\u0bc1\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bb3\u0bc8 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bbe\u0baf\u0bcd\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd' : 'Review question requirements and key concepts');
  }
  if (criteria.clarity < 60) {
    suggestions.push(language === 'tamil' ? '\u0ba4\u0bc6\u0bb3\u0bbf\u0bb5\u0bbe\u0ba9\u0bcd \u0bb5\u0bbe\u0b95\u0bcd\u0b95\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0baa\u0ba4\u0bcd\u0ba4\u0bbf\u0b95\u0bb3\u0bc1\u0b9f\u0ba9\u0bcd \u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0baa\u0ba4\u0bbf\u0bb2\u0bc8 \u0b85\u0bae\u0bc8\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd' : 'Structure your answer with clear sentences and paragraphs');
  }
  if (criteria.depth < 60) {
    suggestions.push(language === 'tamil' ? '\u0b86\u0ba4\u0bb0\u0bb5\u0bbe\u0ba9\u0bcd \u0b89\u0ba4\u0bbe\u0bb0\u0ba3\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0baa\u0b95\u0bc1\u0baa\u0bbe\u0baf\u0bcd\u0bb5\u0bc1\u0b95\u0bb3\u0bc8 \u0b9a\u0bc7\u0bb0\u0bcd\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd' : 'Include supporting examples and reasoning');
  }
  
  return suggestions;
};

const calculateConfidence = (criteria) => {
  const { completeness, correctness, clarity, depth } = criteria;
  const avgScore = (completeness + correctness + clarity + depth) / 4;
  return Math.min(avgScore / 100, 0.95); // Cap at 95% confidence
};

export const evaluateAnswers = async (questionSegments, rubricPath) => {
  try {
    console.log(`Evaluating ${questionSegments.length} questions...`);
    
    // Extract rubric text if available
    let rubricText = '';
    if (rubricPath) {
      try {
        rubricText = await extractTextFromFile(rubricPath);
        console.log('Rubric extracted successfully');
      } catch (error) {
        console.warn('Could not extract rubric:', error.message);
      }
    }
    
    const evaluations = [];
    
    for (const segment of questionSegments) {
      console.log(`Evaluating Question ${segment.number}...`);
      
      try {
        const evaluation = await evaluateWithLLM(
          segment.text,
          rubricText,
          segment.number
        );
        evaluations.push(evaluation);
      } catch (error) {
        console.error(`Failed to evaluate question ${segment.number}:`, error);
        // Add a fallback evaluation
        evaluations.push({
          questionNumber: segment.number,
          marks: 5,
          totalMarks: 20,
          correctPoints: 5,
          missingPoints: 15,
          mistakes: ['Evaluation failed - manual review needed'],
          suggestions: ['Please review this answer manually'],
          confidence: 0.3
        });
      }
    }
    
    console.log(`Evaluation completed for ${evaluations.length} questions`);
    return evaluations;
  } catch (error) {
    console.error('Evaluation engine error:', error);
    throw new Error('Failed to evaluate answers');
  }
};

export const compareWithRubric = async (answer, rubricCriteria) => {
  try {
    const score = calculateCorrectness(answer, rubricCriteria);
    const isCorrect = score >= 70;
    
    return {
      isCorrect,
      score,
      explanation: isCorrect ? 'Answer meets requirements' : 'Answer needs improvement',
      missingElements: score < 70 ? ['Key concepts', 'Complete explanation'] : []
    };
  } catch (error) {
    console.error('Rubric comparison error:', error);
    throw new Error('Failed to compare with rubric');
  }
};

export const calculateOverallConfidence = (evaluations) => {
  if (!evaluations.length) return 0.5;
  
  const totalConfidence = evaluations.reduce((sum, evaluation) => sum + evaluation.confidence, 0);
  return totalConfidence / evaluations.length;
};

export default {
  evaluateAnswers,
  compareWithRubric,
  calculateOverallConfidence,
};
