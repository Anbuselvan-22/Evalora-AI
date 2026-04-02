// Evaluation Engine - Score answers against rubric using AI/LLM

import { extractTextFromFile } from './ocrService.js';

// Simple LLM simulation for evaluation (can be replaced with OpenAI/Gemini)
const evaluateWithLLM = async (answer, rubric, questionNumber) => {
  try {
    // For now, implement a rule-based evaluation system
    // In production, replace with actual LLM API call
    
    const evaluationCriteria = {
      completeness: calculateCompleteness(answer),
      correctness: calculateCorrectness(answer, rubric),
      clarity: calculateClarity(answer),
      depth: calculateDepth(answer)
    };

    const totalScore = Object.values(evaluationCriteria).reduce((sum, score) => sum + score, 0) / 4;
    const maxScore = 20; // Default max marks per question
    
    const obtainedMarks = Math.round((totalScore / 100) * maxScore);
    
    const mistakes = generateMistakes(evaluationCriteria);
    const suggestions = generateSuggestions(evaluationCriteria);

    return {
      questionNumber,
      marks: obtainedMarks,
      totalMarks: maxScore,
      correctPoints: Math.round(totalScore * 0.8),
      missingPoints: maxScore - obtainedMarks,
      mistakes,
      suggestions,
      confidence: calculateConfidence(evaluationCriteria)
    };
  } catch (error) {
    console.error(`LLM evaluation error for Q${questionNumber}:`, error);
    throw new Error(`Failed to evaluate question ${questionNumber}`);
  }
};

const calculateCompleteness = (answer) => {
  if (!answer || answer.length < 10) return 20;
  
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = answer.split(/\s+/).length;
  
  let score = 40;
  if (wordCount >= 20) score += 30;
  else if (wordCount >= 10) score += 20;
  else score += 10;
  
  if (sentences.length >= 3) score += 20;
  else if (sentences.length >= 2) score += 10;
  
  return Math.min(score, 100);
};

const calculateCorrectness = (answer, rubric) => {
  if (!rubric) return 70; // Default if no rubric
  
  const rubricKeywords = rubric.toLowerCase().split(/\s+/);
  const answerWords = answer.toLowerCase().split(/\s+/);
  
  let matches = 0;
  rubricKeywords.forEach(keyword => {
    if (answerWords.some(word => word.includes(keyword) || keyword.includes(word))) {
      matches++;
    }
  });
  
  const matchPercentage = (matches / rubricKeywords.length) * 100;
  return Math.min(Math.round(matchPercentage * 1.2), 100); // Boost score slightly
};

const calculateClarity = (answer) => {
  if (!answer) return 30;
  
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = answer.split(/\s+/).length / sentences.length;
  
  let score = 50;
  
  // Penalize very short or very long sentences
  if (avgSentenceLength >= 10 && avgSentenceLength <= 25) score += 30;
  else if (avgSentenceLength >= 8 && avgSentenceLength <= 35) score += 20;
  else score += 10;
  
  // Check for proper structure
  if (answer.includes('.') || answer.includes('!') || answer.includes('?')) score += 20;
  
  return Math.min(score, 100);
};

const calculateDepth = (answer) => {
  if (!answer) return 30;
  
  const depthIndicators = [
    'because', 'therefore', 'however', 'although', 'since', 'due to',
    'first', 'second', 'finally', 'in conclusion', 'for example',
    'such as', 'moreover', 'furthermore', 'additionally'
  ];
  
  let depthScore = 40;
  const words = answer.toLowerCase().split(/\s+/);
  
  depthIndicators.forEach(indicator => {
    if (words.includes(indicator)) {
      depthScore += 10;
    }
  });
  
  return Math.min(depthScore, 100);
};

const generateMistakes = (criteria) => {
  const mistakes = [];
  
  if (criteria.completeness < 60) mistakes.push('Answer is too brief or incomplete');
  if (criteria.correctness < 60) mistakes.push('Answer does not fully address the question');
  if (criteria.clarity < 60) mistakes.push('Answer lacks clarity or proper structure');
  if (criteria.depth < 60) mistakes.push('Answer lacks depth or supporting details');
  
  return mistakes;
};

const generateSuggestions = (criteria) => {
  const suggestions = [];
  
  if (criteria.completeness < 60) suggestions.push('Provide more comprehensive explanation');
  if (criteria.correctness < 60) suggestions.push('Review the question requirements and key concepts');
  if (criteria.clarity < 60) suggestions.push('Structure your answer with clear sentences and paragraphs');
  if (criteria.depth < 60) suggestions.push('Include supporting examples and reasoning');
  
  return suggestions;
};

const calculateConfidence = (criteria) => {
  const avgScore = Object.values(criteria).reduce((sum, score) => sum + score, 0) / 4;
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
