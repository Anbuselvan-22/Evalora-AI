// AI Pipeline Service - Orchestrates OCR, cleaning, splitting, and evaluation

import { extractTextFromFile } from './ocrService.js';
import { cleanText } from './textCleanService.js';
import { splitByQuestions } from './questionSplitter.js';
import { evaluateAnswers, calculateOverallConfidence } from './evaluationEngine.js';
import Evaluation from '../models/Evaluation.js';
import Result from '../models/Result.js';

export const runEvaluationPipeline = async (
  questionPaperPath,
  rubricsPath,
  answerSheetPath,
) => {
  try {
    console.log('🚀 Starting AI Evaluation Pipeline...');
    
    // Step 1: Extract text from answer sheet using OCR
    console.log('📄 Step 1: Extracting text from answer sheet...');
    const rawText = await extractTextFromFile(answerSheetPath);
    console.log(`✅ Text extracted: ${rawText.length} characters`);
    
    // Step 2: Clean the extracted text
    console.log('🧹 Step 2: Cleaning extracted text...');
    const cleanedText = cleanText(rawText);
    console.log(`✅ Text cleaned: ${cleanedText.length} characters`);
    
    // Step 3: Split into question-wise segments
    console.log('🔪 Step 3: Splitting text into questions...');
    const segments = splitByQuestions(cleanedText);
    console.log(`✅ Found ${segments.length} question segments`);
    
    if (segments.length === 0) {
      throw new Error('No questions could be identified in the answer sheet');
    }
    
    // Step 4: Evaluate each segment against rubric
    console.log('🤖 Step 4: Evaluating answers against rubric...');
    const questionWiseData = await evaluateAnswers(segments, rubricsPath);
    console.log(`✅ Evaluation completed for ${questionWiseData.length} questions`);
    
    // Step 5: Calculate overall metrics
    console.log('📊 Step 5: Calculating overall metrics...');
    const totalMarks = questionWiseData.reduce((sum, q) => sum + q.totalMarks, 0);
    const obtainedMarks = questionWiseData.reduce((sum, q) => sum + q.marks, 0);
    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const confidence = calculateOverallConfidence(questionWiseData);
    
    // Step 6: Generate overall feedback
    console.log('💬 Step 6: Generating overall feedback...');
    const overallMistakes = [];
    const overallSuggestions = [];
    
    questionWiseData.forEach(q => {
      overallMistakes.push(...q.mistakes);
      overallSuggestions.push(...q.suggestions);
    });
    
    // Remove duplicates
    const uniqueMistakes = [...new Set(overallMistakes)];
    const uniqueSuggestions = [...new Set(overallSuggestions)];
    
    const result = {
      totalMarks,
      obtainedMarks,
      percentage,
      questionWiseData,
      overallMistakes: uniqueMistakes,
      overallSuggestions: uniqueSuggestions,
      confidence,
    };
    
    console.log('✅ AI Evaluation Pipeline completed successfully!');
    console.log(`📈 Final Score: ${obtainedMarks}/${totalMarks} (${percentage}%)`);
    console.log(`🎯 Confidence: ${Math.round(confidence * 100)}%`);
    
    return result;
  } catch (error) {
    console.error('❌ Evaluation pipeline error:', error);
    throw error;
  }
};

// Async wrapper for background processing
export const runEvaluationPipelineAsync = async (evaluationId, questionPaperPath, rubricsPath, answerSheetPath) => {
  try {
    console.log(`🔄 Starting async pipeline for evaluation ${evaluationId}`);
    
    // Update evaluation status to processing
    await updateEvaluationStatus(evaluationId, 'processing');
    
    // Run the pipeline
    const result = await runEvaluationPipeline(questionPaperPath, rubricsPath, answerSheetPath);
    
    // Create result document
    await createResultDocument(evaluationId, result);
    
    // Update evaluation status to completed
    await updateEvaluationStatus(evaluationId, 'completed');
    
    console.log(`✅ Pipeline completed for evaluation ${evaluationId}`);
    return result;
  } catch (error) {
    console.error(`❌ Pipeline failed for evaluation ${evaluationId}:`, error);
    
    // Update evaluation status to failed
    await updateEvaluationStatus(evaluationId, 'failed');
    
    throw error;
  }
};

// Helper functions with actual database operations
const updateEvaluationStatus = async (evaluationId, status) => {
  try {
    await Evaluation.findByIdAndUpdate(evaluationId, { status });
    console.log(`📝 Updated evaluation ${evaluationId} status to: ${status}`);
  } catch (error) {
    console.error('Failed to update evaluation status:', error);
    throw error;
  }
};

const createResultDocument = async (evaluationId, result) => {
  try {
    // Get the evaluation to extract required fields
    const evaluation = await Evaluation.findById(evaluationId);
    if (!evaluation) {
      throw new Error(`Evaluation not found: ${evaluationId}`);
    }

    const resultDoc = new Result({
      evaluationId: evaluation._id,
      studentId: evaluation.studentId,
      teacherId: evaluation.teacherId,
      subject: evaluation.subject,
      totalMarks: result.totalMarks,
      obtainedMarks: result.obtainedMarks,
      percentage: result.percentage,
      questionWiseData: result.questionWiseData,
      overallMistakes: result.overallMistakes,
      overallSuggestions: result.overallSuggestions,
      confidence: result.confidence,
    });

    await resultDoc.save();
    console.log(`📄 Created result document for evaluation ${evaluationId}`);
    return resultDoc;
  } catch (error) {
    console.error('Failed to create result document:', error);
    throw error;
  }
};

export default { 
  runEvaluationPipeline, 
  runEvaluationPipelineAsync 
};
