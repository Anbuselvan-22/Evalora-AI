// Question Splitter Service - Split cleaned text into question-wise segments

export const splitByQuestions = (text) => {
  if (!text) return [];

  // Split by common question markers (Q1:, Q2:, Question 1:, etc.)
  const questionPattern = /^(?:Q\d+[\s:.\-]*|Question\s*\d+[\s:.\-]*)/im;
  const lines = text.split('\n');

  const questions = [];
  let currentQuestion = {
    number: 0,
    text: '',
  };
  let questionNum = 1;

  lines.forEach((line) => {
    if (questionPattern.test(line)) {
      if (currentQuestion.text) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        number: questionNum++,
        text: line.replace(questionPattern, '').trim(),
      };
    } else if (currentQuestion.number > 0) {
      currentQuestion.text += ` ${line}`.trim();
    }
  });

  if (currentQuestion.text) {
    questions.push(currentQuestion);
  }

  return questions;
};

export const groupBySection = (text, sectionMarkers = ['A', 'B', 'C']) => {
  const sections = {};

  sectionMarkers.forEach((marker) => {
    const pattern = new RegExp(`Section\\s*${marker}[\\s:]*([\\s\\S]*)(?=Section|$)`, 'i');
    const match = text.match(pattern);
    if (match) {
      sections[marker] = match[1].trim();
    }
  });

  return sections;
};

export default {
  splitByQuestions,
  groupBySection,
};
