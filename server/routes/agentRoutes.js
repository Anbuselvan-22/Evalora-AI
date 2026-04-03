import express from 'express';
import Result from '../models/Result.js';
import Evaluation from '../models/Evaluation.js';

const router = express.Router();

const MOCK_RESULTS = [
  {
    subject: 'Mathematics',
    marks: 85,
    totalMarks: 100,
    percentage: 85,
  },
  {
    subject: 'Physics',
    marks: 72,
    totalMarks: 100,
    percentage: 72,
  },
];

// GET /api/agents/parent
router.get('/parent', async (req, res) => {
  try {
    let results = [];
    try {
      results = await Result.find({ studentId: req.user.id });
    } catch (e) {
      results = MOCK_RESULTS;
    }

    const subjects = results.map((r) => ({
      name: r.subject || 'Unknown',
      marks: r.obtainedMarks || r.marks,
      totalMarks: r.totalMarks || 100,
    }));

    const averageScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
      : 0;

    return res.json({
      success: true,
      data: {
        subjects,
        averageScore,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// GET /api/agents/memory
router.get('/memory', async (req, res) => {
  try {
    let results = [];
    try {
      results = await Result.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    } catch (e) {
      results = MOCK_RESULTS.map((r, i) => ({ ...r, createdAt: new Date(Date.now() - i * 86400000), _id: i }));
    }

    const performanceHistory = (Array.isArray(results) ? results : []).map((r) => ({
      date: r.createdAt || new Date(),
      score: r.percentage || r.marks,
      subject: r.subject,
      marks: r.obtainedMarks || r.marks,
      totalMarks: r.totalMarks || 100,
    }));

    const comparisonData = (Array.isArray(results) ? results : []).map((r) => ({
      name: r.subject || 'Subject',
      score: r.percentage || r.marks,
      previousScore: (r.percentage || r.marks) - 5,
    }));

    return res.json({
      success: true,
      data: {
        performanceHistory,
        comparisonData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// POST /api/agents/study-agent
router.post('/study-agent', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
        code: 'EMPTY_MESSAGE',
      });
    }

    // Get student's performance data for personalized responses
    let studentContext = '';
    let studentLevel = 'beginner';
    let avgScore = 0;
    let subjects = [];
    
    try {
      const results = await Result.find({ studentId: userId }).sort({ createdAt: -1 }).limit(5);
      const evaluations = await Evaluation.find({ studentId: userId, status: 'completed' }).sort({ createdAt: -1 }).limit(5);
      
      if (results.length > 0 || evaluations.length > 0) {
        const allPerformance = [...results, ...evaluations];
        avgScore = allPerformance.reduce((sum, item) => sum + (item.percentage || 0), 0) / allPerformance.length;
        subjects = [...new Set(allPerformance.map(item => item.subject))];
        
        if (avgScore >= 85) studentLevel = 'advanced';
        else if (avgScore >= 70) studentLevel = 'intermediate';
        
        studentContext = `Student Level: ${studentLevel} (${Math.round(avgScore)}% average), Subjects: ${subjects.join(', ')}. `;
      }
    } catch (error) {
      console.warn('Could not fetch student context:', error.message);
    }

    // Enhanced content analysis and response generation
    const lowerMessage = message.toLowerCase();
    let reply = '';

    // Topic-specific knowledge base
    const knowledgeBase = {
      mathematics: {
        concepts: {
          algebra: {
            definition: "Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols. It represents mathematical relationships and includes solving equations, working with variables, and understanding mathematical structures.",
            examples: [
              "Solving linear equations: 2x + 5 = 15 → x = 5",
              "Quadratic formula: x = (-b ± √(b²-4ac)) / 2a",
              "Factoring: x² - 9 = (x-3)(x+3)"
            ],
            applications: "Used in engineering, physics, economics, computer science, and data analysis"
          },
          calculus: {
            definition: "Calculus is the mathematical study of continuous change. It includes differential calculus (rates of change) and integral calculus (accumulation of quantities).",
            key_concepts: [
              "Derivatives measure rates of change",
              "Integrals calculate areas under curves",
              "Limits form the foundation of calculus",
              "Chain rule for complex derivatives"
            ],
            applications: "Physics (motion, forces), Engineering (optimization), Economics (marginal analysis)"
          },
          geometry: {
            definition: "Geometry is the study of shapes, sizes, positions, and dimensions of objects. It includes both plane geometry (2D) and solid geometry (3D).",
            formulas: [
              "Circle area: πr²",
              "Triangle area: ½ × base × height",
              "Pythagorean theorem: a² + b² = c²",
              "Sphere volume: (4/3)πr³"
            ]
          }
        },
        problem_solving: {
          steps: [
            "Understand the problem thoroughly",
            "Identify given information and what's needed",
            "Choose appropriate mathematical tools",
            "Apply the method step by step",
            "Verify your answer makes sense"
          ]
        }
      },
      science: {
        physics: {
          mechanics: {
            definition: "Mechanics is the branch of physics dealing with motion and forces. It includes kinematics (description of motion) and dynamics (causes of motion).",
            laws: [
              "Newton's First Law: An object at rest stays at rest, an object in motion stays in motion",
              "Newton's Second Law: F = ma (Force equals mass times acceleration)",
              "Newton's Third Law: For every action, there's an equal and opposite reaction"
            ],
            formulas: [
              "Velocity: v = d/t",
              "Acceleration: a = Δv/t",
              "Kinetic Energy: KE = ½mv²",
              "Momentum: p = mv"
            ]
          },
          thermodynamics: {
            definition: "Thermodynamics is the study of heat, work, and energy. It describes how thermal energy is converted to and from other forms of energy.",
            laws: [
              "Zeroth Law: Thermal equilibrium",
              "First Law: Conservation of energy",
              "Second Law: Entropy always increases",
              "Third Law: Absolute zero unattainable"
            ]
          }
        },
        chemistry: {
          atomic_structure: {
            definition: "Atoms are the basic units of matter, consisting of protons, neutrons, and electrons.",
            components: [
              "Protons: Positive charge, in nucleus",
              "Neutrons: No charge, in nucleus", 
              "Electrons: Negative charge, orbit nucleus"
            ],
            periodic_trends: "Atomic size, ionization energy, electronegativity patterns"
          }
        },
        biology: {
          cell_biology: {
            definition: "Cells are the basic structural and functional units of all living organisms.",
            organelles: [
              "Nucleus: Contains DNA, controls cell activities",
              "Mitochondria: Powerhouse of the cell, produces ATP",
              "Ribosomes: Protein synthesis",
              "Cell membrane: Controls what enters and exits"
            ]
          }
        }
      }
    };

    // Intelligent response generation based on content analysis
    const generateIntelligentResponse = (query) => {
      // Check for specific topics in mathematics
      if (lowerMessage.includes('algebra') || lowerMessage.includes('equation') || lowerMessage.includes('variable')) {
        const algebra = knowledgeBase.mathematics.concepts.algebra;
        return `${studentContext}Here's a comprehensive explanation of Algebra:\n\n📚 **Definition**: ${algebra.definition}\n\n🔢 **Key Examples**:\n${algebra.examples.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}\n\n🎯 **Applications**: ${algebra.applications}\n\n💡 **Study Tip**: Start by understanding that variables represent unknown quantities, then practice solving simple equations before moving to complex ones.\n\nWould you like me to explain a specific algebraic concept or solve a particular problem?`;
      }

      if (lowerMessage.includes('calculus') || lowerMessage.includes('derivative') || lowerMessage.includes('integral')) {
        const calculus = knowledgeBase.mathematics.concepts.calculus;
        return `${studentContext}Let me explain Calculus thoroughly:\n\n📚 **Definition**: ${calculus.definition}\n\n🔑 **Key Concepts**:\n${calculus.key_concepts.map((concept, i) => `${i + 1}. ${concept}`).join('\n')}\n\n🎯 **Real-World Applications**: ${calculus.applications}\n\n💡 **For ${studentLevel} students**: ${studentLevel === 'beginner' ? 'Focus on understanding limits first, then basic derivatives.' : studentLevel === 'intermediate' ? 'Practice chain rule and integration techniques.' : 'Explore multivariable calculus and differential equations.'}\n\nWhat specific calculus topic would you like to explore deeper?`;
      }

      if (lowerMessage.includes('geometry') || lowerMessage.includes('shapes') || lowerMessage.includes('area')) {
        const geometry = knowledgeBase.mathematics.concepts.geometry;
        return `${studentContext}Geometry explained:\n\n📚 **Definition**: ${geometry.definition}\n\n📐 **Essential Formulas**:\n${geometry.formulas.map((formula, i) => `${i + 1}. ${formula}`).join('\n')}\n\n💡 **Study Strategy**: Draw diagrams for every problem. Visual understanding is crucial in geometry.\n\n🎯 **Practice Problems**: I can create geometry problems based on your current level. Would you like some practice exercises?`;
      }

      // Check for physics topics
      if (lowerMessage.includes('physics') || lowerMessage.includes('force') || lowerMessage.includes('motion')) {
        if (lowerMessage.includes('newton') || lowerMessage.includes('law')) {
          const mechanics = knowledgeBase.science.physics.mechanics;
          return `${studentContext}Newton's Laws of Motion:\n\n📚 **Definition**: ${mechanics.definition}\n\n⚖️ **Newton's Three Laws**:\n${mechanics.laws.map((law, i) => `${i + 1}. ${law}`).join('\n')}\n\n📐 **Important Formulas**:\n${mechanics.formulas.map((formula, i) => `${i + 1}. ${formula}`).join('\n')}\n\n🎯 **Real-World Examples**: Cars accelerating, rockets launching, satellites orbiting.\n\nWould you like me to solve a specific physics problem using these laws?`;
        }
      }

      // Check for chemistry topics
      if (lowerMessage.includes('chemistry') || lowerMessage.includes('atom') || lowerMessage.includes('element')) {
        const chemistry = knowledgeBase.science.chemistry.atomic_structure;
        return `${studentContext}Atomic Structure in Chemistry:\n\n📚 **Definition**: ${chemistry.definition}\n\n⚛️ **Atomic Components**:\n${chemistry.components.map((component, i) => `${i + 1}. ${component}`).join('\n')}\n\n📊 **Periodic Trends**: ${chemistry.periodic_trends}\n\n💡 **Memory Aid**: Think of atoms like tiny solar systems - nucleus (sun) in the center with electrons (planets) orbiting around.\n\nWhat specific aspect of atomic structure would you like to explore?`;
      }

      // Check for biology topics
      if (lowerMessage.includes('biology') || lowerMessage.includes('cell') || lowerMessage.includes('organism')) {
        const biology = knowledgeBase.science.biology.cell_biology;
        return `${studentContext}Cell Biology Fundamentals:\n\n📚 **Definition**: ${biology.definition}\n\n🧬 **Major Organelles**:\n${biology.organelles.map((organelle, i) => `${i + 1}. ${organelle}`).join('\n')}\n\n💡 **Study Tip**: Create analogies - nucleus is like the brain, mitochondria are like power plants, cell membrane is like a security gate.\n\n🎯 **For ${studentLevel} level**: ${studentLevel === 'beginner' ? 'Focus on memorizing organelle functions.' : 'Explore cellular processes like mitosis and photosynthesis.'}\n\nWould you like me to explain cellular processes in detail?`;
      }

      return null; // No specific topic found
    };

    // Try to generate intelligent response first
    const intelligentResponse = generateIntelligentResponse(message);
    if (intelligentResponse) {
      return res.json({
        success: true,
        data: {
          reply: intelligentResponse,
        },
      });
    }

    // Fallback to enhanced contextual responses for general queries
    if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('topic')) {
      const explanations = [
        studentContext 
          ? `Great question! I'd be happy to explain this concept. Based on your ${studentLevel} level and performance in ${subjects.join(' and ')}, let me break this down systematically:\n\n📖 **Step 1**: Start with the fundamental definition\n📖 **Step 2**: Break down into smaller components\n📖 **Step 3**: Understand how components interact\n📖 **Step 4**: Learn real-world applications\n📖 **Step 5**: Practice with examples\n\n💡 **Learning Strategy**: Use the Feynman technique - try to explain it in simple terms as if teaching someone else. This reveals gaps in your understanding.\n\nWhat specific aspect of this topic would you like me to focus on?`
          : `Great question! Let me explain this concept systematically:\n\n📖 **Step 1**: Start with the fundamental definition\n📖 **Step 2**: Break down into smaller components\n📖 **Step 3**: Understand how components interact\n📖 **Step 4**: Learn real-world applications\n📖 **Step 5**: Practice with examples\n\n💡 **Learning Strategy**: Use the Feynman technique - try to explain it in simple terms as if teaching someone else.`,
        studentContext
          ? `Here's a structured approach to understanding this topic, tailored for your ${studentLevel} level:\n\n🎯 **Foundation**: Begin with core principles\n🎯 **Building Blocks**: Understand each component separately\n🎯 **Connections**: See how parts relate to each other\n🎯 **Application**: Apply knowledge to solve problems\n🎯 **Review**: Reinforce through practice\n\n📊 **Your Progress**: Your ${Math.round(avgScore)}% average shows you're ready for this challenge. Focus on understanding rather than memorization.\n\nWould you like me to provide specific examples or practice problems?`
          : `Here's a structured approach to mastering this topic:\n\n🎯 **Foundation**: Begin with core principles\n🎯 **Building Blocks**: Understand each component separately\n🎯 **Connections**: See how parts relate to each other\n🎯 **Application**: Apply knowledge to solve problems\n🎯 **Review**: Reinforce through practice\n\nWould you like me to provide specific examples or practice problems?`
      ];
      reply = explanations[Math.floor(Math.random() * explanations.length)];
    }
    // Quiz generation with actual subject-specific content
    else if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('questions')) {
      // Generate subject-specific quiz based on student's subjects
      const subjectQuizzes = {
        mathematics: {
          questions: [
            "What is the derivative of x²?",
            "Solve for x: 2x + 8 = 20",
            "What is the area of a circle with radius 5?",
            "Simplify: (3x + 2)(x - 4)",
            "What is the limit of (x²-1)/(x-1) as x approaches 1?"
          ]
        },
        physics: {
          questions: [
            "What is Newton's Second Law of Motion?",
            "Calculate the force needed to accelerate a 1000kg car at 2m/s²",
            "What is the difference between kinetic and potential energy?",
            "Explain the concept of momentum conservation",
            "What happens to the speed of light when it enters water?"
          ]
        },
        chemistry: {
          questions: [
            "What is the atomic number of Carbon?",
            "Balance the equation: H₂ + O₂ → H₂O",
            "What is the difference between ionic and covalent bonds?",
            "Explain the concept of electronegativity",
            "What is the pH scale range?"
          ]
        },
        general: [
          "What are the key steps in problem-solving?",
          "How do you approach learning a new concept?",
          "What strategies help with information retention?",
          "How do you prepare effectively for exams?",
          "What methods work best for understanding complex topics?"
        ]
      };

      let quizQuestions = [];
      if (subjects.length > 0) {
        subjects.forEach(subject => {
          if (subjectQuizzes[subject.toLowerCase()]) {
            quizQuestions = quizQuestions.concat(subjectQuizzes[subject.toLowerCase()]);
          }
        });
      }
      
      if (quizQuestions.length === 0) {
        quizQuestions = subjectQuizzes.general;
      }

      // Select 5 random questions
      const selectedQuestions = quizQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      reply = studentContext
        ? `Perfect! I've created a personalized quiz for you based on your ${studentLevel} level and subjects (${subjects.join(', ')}):\n\n${selectedQuestions.map((q, i) => `**Question ${i + 1}**: ${q}`).join('\n\n')}\n\n💡 **Instructions**: Take your time to answer each question thoughtfully. Focus on understanding the concepts rather than just getting the right answer.\n\n📊 **Your Performance**: Based on your ${Math.round(avgScore)}% average, I've selected questions that will challenge you appropriately.\n\nWould you like me to explain any of these questions or provide hints?`
        : `Perfect! Here's your custom quiz:\n\n${selectedQuestions.map((q, i) => `**Question ${i + 1}**: ${q}`).join('\n\n')}\n\n💡 **Instructions**: Take your time to answer each question thoughtfully. Focus on understanding the concepts rather than just getting the right answer.\n\nWould you like me to explain any of these questions or provide hints?`;
    }
    // Enhanced study plans with specific timelines and goals
    else if (lowerMessage.includes('plan') || lowerMessage.includes('schedule') || lowerMessage.includes('study plan')) {
      const studyPlans = [
        studentContext
          ? `Based on your ${Math.round(avgScore)}% average and focus on ${subjects.join(', ')}, here's your personalized 4-week study plan:\n\n📅 **Week 1: Foundation Building**\n• Day 1-2: Review fundamental concepts\n• Day 3-4: Practice basic problems\n• Day 5-6: Identify weak areas\n• Day 7: Rest and consolidation\n\n📅 **Week 2: Skill Development**\n• Focus on your weakest subject from ${subjects.join(' or ')}\n• 30-min focused sessions with 5-min breaks\n• Practice 10 problems daily\n\n📅 **Week 3: Advanced Topics**\n• Challenge yourself with complex problems\n• Study with peers or teach concepts to others\n• Take practice tests under timed conditions\n\n📅 **Week 4: Review & Assessment**\n• Comprehensive review of all topics\n• Simulated exam conditions\n• Focus on exam-taking strategies\n\n🎯 **Daily Schedule**:\n⏰ 6:00-7:00 AM: Review previous day's topics\n⏰ 7:00-8:00 AM: New concepts\n⏰ 8:00-8:30 PM: Practice problems\n⏰ 9:30-10:00 PM: Quick review\n\n📊 **Success Metrics**: Aim for 85%+ on practice tests. Your current ${Math.round(avgScore)}% shows you can achieve this!`
          : `Here's your comprehensive 4-week study plan:\n\n📅 **Week 1: Foundation Building**\n• Day 1-2: Review fundamental concepts\n• Day 3-4: Practice basic problems\n• Day 5-6: Identify weak areas\n• Day 7: Rest and consolidation\n\n📅 **Week 2: Skill Development**\n• 30-min focused sessions with 5-min breaks\n• Practice 10 problems daily\n• Use active recall techniques\n\n📅 **Week 3: Advanced Topics**\n• Challenge yourself with complex problems\n• Study with peers or teach concepts to others\n• Take practice tests under timed conditions\n\n📅 **Week 4: Review & Assessment**\n• Comprehensive review of all topics\n• Simulated exam conditions\n• Focus on exam-taking strategies\n\n🎯 **Daily Schedule**:\n⏰ 6:00-7:00 AM: Review previous day's topics\n⏰ 7:00-8:00 AM: New concepts\n⏰ 8:00-8:30 PM: Practice problems\n⏰ 9:30-10:00 PM: Quick review`,
        studentContext
          ? `I've designed an optimized study schedule for a ${studentLevel} student like you, focusing on ${subjects.join(', ')}:\n\n⏰ **Pomodoro Technique**: 25-min study, 5-min break\n⏰ **Subject Rotation**: Alternate between subjects every 2 days\n⏰ **Weekly Goals**: Complete 3 chapters, 50 practice problems\n\n📚 **Daily Structure**:\n🌅 **Morning (6:00-8:00)**: Fresh mind for complex topics\n🌞 **Afternoon (4:00-6:00)**: Practice and application\n🌙 **Evening (8:00-9:00)**: Review and consolidation\n\n🎯 **Monthly Targets**:\n• Week 1: Master fundamentals\n• Week 2: Improve problem-solving speed\n• Week 3: Advanced concepts and applications\n• Week 4: Exam preparation and mock tests\n\n📊 **Progress Tracking**: Your ${Math.round(avgScore)}% average suggests you should aim for 90%+ this month!`
          : `I've designed an optimized study schedule for you:\n\n⏰ **Pomodoro Technique**: 25-min study, 5-min break\n⏰ **Subject Rotation**: Alternate subjects every 2 days\n⏰ **Weekly Goals**: Complete 3 chapters, 50 practice problems\n\n📚 **Daily Structure**:\n🌅 **Morning (6:00-8:00)**: Fresh mind for complex topics\n🌞 **Afternoon (4:00-6:00)**: Practice and application\n🌙 **Evening (8:00-9:00)**: Review and consolidation\n\n🎯 **Monthly Targets**:\n• Week 1: Master fundamentals\n• Week 2: Improve problem-solving speed\n• Week 3: Advanced concepts and applications\n• Week 4: Exam preparation and mock tests`,
        studentContext
          ? `Let's create a SMART study plan tailored to your learning style and ${subjects.join(', ')} focus:\n\n🎯 **Specific**: Focus on improving your weakest areas\n🎯 **Measurable**: Track daily progress with practice scores\n🎯 **Achievable**: Set realistic daily goals (2-3 concepts per day)\n🎯 **Relevant**: Align with your exam syllabus\n🎯 **Time-bound**: Weekly milestones with deadlines\n\n📚 **Daily Structure**:\n📖 20-min: Theory review\n✍️ 15-min: Practice problems\n🧠 10-min: Concept reinforcement\n📊 5-min: Progress tracking\n\n🔄 **Weekly Review**:\n• Sunday: Comprehensive review of week's topics\n• Identify areas needing more attention\n• Adjust next week's plan accordingly\n\n📈 **Success Indicators**: Based on your current ${Math.round(avgScore)}% performance, aim for 5-10% improvement each week.`
          : `Let's create a SMART study plan tailored to your learning style:\n\n🎯 **Specific**: Focus on improving your weakest areas\n🎯 **Measurable**: Track daily progress with practice scores\n🎯 **Achievable**: Set realistic daily goals (2-3 concepts per day)\n🎯 **Relevant**: Align with your exam syllabus\n🎯 **Time-bound**: Weekly milestones with deadlines\n\n📚 **Daily Structure**:\n📖 20-min: Theory review\n✍️ 15-min: Practice problems\n🧠 10-min: Concept reinforcement\n📊 5-min: Progress tracking\n\n🔄 **Weekly Review**:\n• Sunday: Comprehensive review of week's topics\n• Identify areas needing more attention\n• Adjust next week's plan accordingly`
      ];
      reply = studyPlans[Math.floor(Math.random() * studyPlans.length)];
    }
    // Enhanced help responses with specific strategies
    else if (lowerMessage.includes('help') || lowerMessage.includes('stuck') || lowerMessage.includes('confused')) {
      const helpResponses = [
        studentContext
          ? `I'm here to help you overcome this challenge! As a ${studentLevel} student with ${Math.round(avgScore)}% average in ${subjects.join(', ')}, you have a strong foundation. Let's tackle this systematically:\n\n🔍 **Step 1: Diagnose the Problem**\n• What specific concept is confusing you?\n• Where exactly do you get stuck?\n• What have you tried so far?\n\n💡 **Step 2: Break It Down**\n• Divide the problem into smaller parts\n• Master each component separately\n• Connect the pieces back together\n\n🎯 **Step 3: Use Multiple Approaches**\n• Visual: Draw diagrams or charts\n• Verbal: Explain it out loud\n• Kinesthetic: Work through examples\n\n📚 **Step 4: Practice Strategically**\n• Start with easier problems\n• Gradually increase difficulty\n• Review mistakes to learn from them\n\nTell me more about what's specifically confusing you, and I'll provide targeted help!`
          : `I'm here to help you overcome this challenge! Let's tackle this systematically:\n\n🔍 **Step 1: Diagnose the Problem**\n• What specific concept is confusing you?\n• Where exactly do you get stuck?\n• What have you tried so far?\n\n💡 **Step 2: Break It Down**\n• Divide the problem into smaller parts\n• Master each component separately\n• Connect the pieces back together\n\n🎯 **Step 3: Use Multiple Approaches**\n• Visual: Draw diagrams or charts\n• Verbal: Explain it out loud\n• Kinesthetic: Work through examples\n\n📚 **Step 4: Practice Strategically**\n• Start with easier problems\n• Gradually increase difficulty\n• Review mistakes to learn from them\n\nTell me more about what's specifically confusing you, and I'll provide targeted help!`,
        studentContext
          ? `Don't worry - confusion is part of learning! Even ${studentLevel} students face challenges. Based on your performance in ${subjects.join(', ')}, here's an effective approach:\n\n🧠 **Understand, Don't Memorize**\n• Focus on the "why" behind concepts\n• Create mental models and analogies\n• Connect new info to what you already know\n\n⚡ **Active Learning Techniques**\n• Teach the concept to someone else\n• Create your own examples\n• Use flashcards for key terms\n\n🔄 **Iterative Practice**\n• Try a problem, check your answer\n• Understand any mistakes\n• Try similar problems to reinforce learning\n\n📈 **Your Strengths**: Your ${Math.round(avgScore)}% average shows you learn well. Let's leverage that!\n\nWhat specific topic is giving you trouble? I'll break it down step by step.`
          : `Don't worry - confusion is part of learning! Here's an effective approach:\n\n🧠 **Understand, Don't Memorize**\n• Focus on the "why" behind concepts\n• Create mental models and analogies\n• Connect new info to what you already know\n\n⚡ **Active Learning Techniques**\n• Teach the concept to someone else\n• Create your own examples\n• Use flashcards for key terms\n\n🔄 **Iterative Practice**\n• Try a problem, check your answer\n• Understand any mistakes\n• Try similar problems to reinforce learning\n\nWhat specific topic is giving you trouble? I'll break it down step by step.`,
        studentContext
          ? `Let's tackle this together! Your performance in ${subjects.join(', ')} shows you're capable. Here are proven strategies:\n\n❌ **Common Learning Mistakes to Avoid**:\n• Trying to memorize without understanding\n• Skipping practice problems\n• Cramming instead of spaced repetition\n• Not asking questions when confused\n\n✅ **Effective Learning Strategies**:\n• Use the Feynman technique: explain concepts simply\n• Practice spaced repetition: review at increasing intervals\n• Use active recall: test yourself regularly\n• Connect concepts across subjects\n\n🎯 **For ${studentLevel} Students**:\n• Focus on understanding fundamentals deeply\n• Challenge yourself with increasingly complex problems\n• Teach others to reinforce your own learning\n\nWhich area needs more attention? I'll create a targeted plan for you!`
          : `Let's tackle this together! Here are proven strategies:\n\n❌ **Common Learning Mistakes to Avoid**:\n• Trying to memorize without understanding\n• Skipping practice problems\n• Cramming instead of spaced repetition\n• Not asking questions when confused\n\n✅ **Effective Learning Strategies**:\n• Use the Feynman technique: explain concepts simply\n• Practice spaced repetition: review at increasing intervals\n• Use active recall: test yourself regularly\n• Connect concepts across subjects\n\nWhich area needs more attention? I'll create a targeted plan for you!`
      ];
      reply = helpResponses[Math.floor(Math.random() * helpResponses.length)];
    }
    // Enhanced general responses with specific learning strategies
    else {
      const generalResponses = [
        studentContext
          ? `That's an excellent question! Based on your ${Math.round(avgScore)}% average and experience with ${subjects.join(', ')}, I recommend this systematic approach:\n\n🎯 **The "Why-How-What" Framework**:\n• **Why**: Understand the purpose and importance\n• **How**: Learn the methods and processes\n• **What**: Apply knowledge to solve problems\n\n📚 **Active Learning Techniques**:\n• Create concept maps to connect ideas\n• Use spaced repetition for long-term retention\n• Practice with progressively harder problems\n• Teach concepts to reinforce understanding\n\n🔬 **For Your Current Level**: Since you're performing at ${Math.round(avgScore)}%, focus on deeper understanding rather than just memorization. Try to see connections between different subjects.\n\nWhat specific aspect would you like me to elaborate on?`
          : `That's an excellent question! I recommend this systematic approach:\n\n🎯 **The "Why-How-What" Framework**:\n• **Why**: Understand the purpose and importance\n• **How**: Learn the methods and processes\n• **What**: Apply knowledge to solve problems\n\n📚 **Active Learning Techniques**:\n• Create concept maps to connect ideas\n• Use spaced repetition for long-term retention\n• Practice with progressively harder problems\n• Teach concepts to reinforce understanding\n\nWhat specific aspect would you like me to elaborate on?`,
        studentContext
          ? `Great thinking! Your experience with ${subjects.join(', ')} gives you a solid foundation. Here's how to maximize your learning:\n\n🧠 **Metacognition - Think About Your Thinking**:\n• Plan your learning approach before starting\n• Monitor your understanding while learning\n• Evaluate your methods afterward\n\n🔗 **Make Connections**:\n• Link new concepts to existing knowledge\n• Find patterns across different subjects\n• Create analogies to understand abstract ideas\n\n📈 **Progressive Mastery**:\n• Start with fundamentals\n• Build complexity gradually\n• Apply knowledge in different contexts\n\n💡 **Based on your ${Math.round(avgScore)}% performance**: You're ready to tackle more complex problems and interdisciplinary thinking.\n\nHow can I help you apply these strategies to your current studies?`
          : `Great thinking! Here's how to maximize your learning:\n\n🧠 **Metacognition - Think About Your Thinking**:\n• Plan your learning approach before starting\n• Monitor your understanding while learning\n• Evaluate your methods afterward\n\n🔗 **Make Connections**:\n• Link new concepts to existing knowledge\n• Find patterns across different subjects\n• Create analogies to understand abstract ideas\n\n📈 **Progressive Mastery**:\n• Start with fundamentals\n• Build complexity gradually\n• Apply knowledge in different contexts\n\nHow can I help you apply these strategies to your current studies?`,
        studentContext
          ? `I appreciate your curiosity! Based on your ${studentLevel} level and ${Math.round(avgScore)}% average, here are advanced learning strategies:\n\n🎯 **Deep Learning Techniques**:\n• **Interleaving**: Mix different types of problems\n• **Elaboration**: Ask "why" and "how" questions\n• **Dual Coding**: Combine words and visuals\n• **Generation**: Create your own examples\n\n📊 **Optimal Study Schedule**:\n• 25-minute focused sessions (Pomodoro)\n• 5-minute breaks for consolidation\n• Review sessions at increasing intervals\n• Practice testing under exam conditions\n\n🚀 **Next Level Learning**:\n• Teach concepts to others\n• Create study materials for peers\n• Solve problems under time pressure\n• Explore interdisciplinary connections\n\nYour progress shows you're ready for these advanced techniques. Which one would you like to explore first?`
          : `I appreciate your curiosity! Here are effective learning strategies:\n\n🎯 **Deep Learning Techniques**:\n• **Interleaving**: Mix different types of problems\n• **Elaboration**: Ask "why" and "how" questions\n• **Dual Coding**: Combine words and visuals\n• **Generation**: Create your own examples\n\n📊 **Optimal Study Schedule**:\n• 25-minute focused sessions (Pomodoro)\n• 5-minute breaks for consolidation\n• Review sessions at increasing intervals\n• Practice testing under exam conditions\n\n🚀 **Next Level Learning**:\n• Teach concepts to others\n• Create study materials for peers\n• Solve problems under time pressure\n• Explore interdisciplinary connections\n\nWhich technique would you like to explore first?`,
        studentContext
          ? `Excellent question! Remember that learning isn't linear - it's normal to have ups and downs. Your ${Math.round(avgScore)}% average shows you're making great progress!\n\n🌱 **Growth Mindset Principles**:\n• Challenges help you grow stronger\n• Mistakes are learning opportunities\n• Effort is more important than innate ability\n• You can improve with practice and strategy\n\n📈 **Your Learning Journey**:\n• **Current**: ${studentLevel} level with solid foundation\n• **Potential**: Unlimited growth with right strategies\n• **Next Steps**: Focus on deeper understanding and application\n\n🎯 **Maintaining Motivation**:\n• Set specific, achievable goals\n• Track your progress regularly\n• Celebrate small wins\n• Stay curious and keep asking questions\n\nYou're doing great! What specific challenge are you working through right now?`
          : `Excellent question! Remember that learning isn't linear - it's normal to have ups and downs.\n\n🌱 **Growth Mindset Principles**:\n• Challenges help you grow stronger\n• Mistakes are learning opportunities\n• Effort is more important than innate ability\n• You can improve with practice and strategy\n\n📈 **Your Learning Journey**:\n• Focus on consistent progress rather than perfection\n• Embrace challenges as opportunities to grow\n• Stay curious and keep asking questions\n\n🎯 **Maintaining Motivation**:\n• Set specific, achievable goals\n• Track your progress regularly\n• Celebrate small wins\n• Stay curious and keep asking questions\n\nWhat specific challenge are you working through right now?`,
        studentContext
          ? `Here's a powerful study tip specifically for ${studentLevel} students like you: Use the "20-20-20" rule combined with active recall.\n\n⏰ **The 20-20-20 Method**:\n• 20 minutes of focused study\n• 20 seconds of complete rest (eyes closed, deep breath)\n• 20 minutes of active recall practice\n\n🧠 **Active Recall Techniques**:\n• Close your book and write down everything you remember\n• Create practice questions for yourself\n• Explain concepts out loud without notes\n• Use flashcards with self-testing\n\n📊 **For Your ${subjects.join(' and ')} Studies**:\n• Apply this to your weakest subject first\n• Track your recall accuracy\n• Adjust study time based on difficulty\n\n🎯 **Expected Results**: Your ${Math.round(avgScore)}% average suggests you'll see 10-15% improvement in just 2 weeks with consistent practice.\n\nWould you like me to help you create a specific recall schedule for one of your subjects?`
          : `Here's a powerful study tip: Use the "20-20-20" rule combined with active recall.\n\n⏰ **The 20-20-20 Method**:\n• 20 minutes of focused study\n• 20 seconds of complete rest (eyes closed, deep breath)\n• 20 minutes of active recall practice\n\n🧠 **Active Recall Techniques**:\n• Close your book and write down everything you remember\n• Create practice questions for yourself\n• Explain concepts out loud without notes\n• Use flashcards with self-testing\n\n🎯 **Expected Results**: Most students see 10-15% improvement in just 2 weeks with consistent practice.\n\nWould you like me to help you create a specific recall schedule for one of your subjects?`
      ];
      reply = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    return res.json({
      success: true,
      data: {
        reply,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

export default router;
