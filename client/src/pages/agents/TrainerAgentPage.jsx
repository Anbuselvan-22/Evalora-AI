import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Clock,
  Target,
  BookOpen,
  Zap,
  Award,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Lightbulb
} from 'lucide-react';

const TECHNIQUES = [
  {
    title: 'Active Recall',
    description: 'Test yourself on material without looking at notes. This strengthens memory retrieval.',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Intermediate',
    timeRequired: '15-20 min',
    effectiveness: 95,
    steps: [
      'Cover your notes or close the textbook',
      'Try to recall key concepts from memory',
      'Check your answers against the source material',
      'Review what you forgot or misremembered',
      'Repeat the process with different topics'
    ],
    benefits: [
      'Improves long-term retention',
      'Identifies knowledge gaps quickly',
      'Builds confidence in understanding',
      'Reduces study time in the long run'
    ],
    tips: 'Start with easier concepts and gradually increase difficulty. Use flashcards or practice questions.'
  },
  {
    title: 'Spaced Repetition',
    description: 'Review material at increasing intervals to fight the forgetting curve.',
    icon: Clock,
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'Beginner',
    timeRequired: '5-10 min daily',
    effectiveness: 90,
    steps: [
      'Learn a concept initially',
      'Review after 1 day',
      'Review after 3 days',
      'Review after 1 week',
      'Review after 2 weeks',
      'Continue spacing reviews further apart'
    ],
    benefits: [
      'Optimizes memory consolidation',
      'Prevents forgetting curve',
      'Efficient use of study time',
      'Builds strong neural pathways'
    ],
    tips: 'Use apps like Anki or create your own system. Be consistent with daily reviews.'
  },
  {
    title: 'Pomodoro Technique',
    description: 'Study in focused 25-minute intervals with short breaks to maintain concentration.',
    icon: Target,
    color: 'from-red-500 to-orange-500',
    difficulty: 'Beginner',
    timeRequired: '25 min sessions',
    effectiveness: 85,
    steps: [
      'Set a timer for 25 minutes',
      'Study with full focus on one task',
      'Take a 5-minute break when timer ends',
      'After 4 cycles, take a longer 15-30 minute break',
      'Return to studying refreshed'
    ],
    benefits: [
      'Prevents burnout and fatigue',
      'Improves focus and concentration',
      'Manages time effectively',
      'Reduces procrastination'
    ],
    tips: 'Eliminate distractions during focus time. Use breaks to stretch or get fresh air.'
  },
  {
    title: 'Blurting',
    description: 'Explain concepts aloud from memory without looking at notes.',
    icon: Zap,
    color: 'from-yellow-500 to-green-500',
    difficulty: 'Intermediate',
    timeRequired: '10-15 min',
    effectiveness: 88,
    steps: [
      'Read a section of material',
      'Put the material away completely',
      'Say everything you remember aloud in your own words',
      'Check what you missed or got wrong',
      'Repeat with different material sections'
    ],
    benefits: [
      'Reveals true understanding',
      'Improves verbal communication',
      'Strengthens memory recall',
      'Builds confidence in knowledge'
    ],
    tips: 'Record yourself explaining concepts and listen back. This helps identify areas needing improvement.'
  },
  {
    title: 'Feynman Technique',
    description: 'Explain a concept as if teaching it to a complete beginner to identify gaps.',
    icon: Lightbulb,
    color: 'from-indigo-500 to-purple-500',
    difficulty: 'Advanced',
    timeRequired: '20-30 min',
    effectiveness: 92,
    steps: [
      'Pick a concept to learn',
      'Explain it in simple language as if teaching a child',
      'Identify areas where your explanation breaks down',
      'Go back to the source material on those areas',
      'Simplify your explanation further and repeat'
    ],
    benefits: [
      'Deep understanding of concepts',
      'Simplifies complex information',
      'Identifies knowledge gaps',
      'Improves teaching skills'
    ],
    tips: 'Use analogies and real-world examples. If you can\'t explain it simply, you don\'t understand it well enough.'
  }
];

const TechniqueCard = ({ technique, index, isExpanded, onToggle }) => {
  const Icon = technique.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-dark rounded-2xl overflow-hidden border border-indigo-500/20 backdrop-blur-xl"
    >
      {/* Header */}
      <motion.div
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        className="p-6 cursor-pointer"
      >
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${technique.color} flex items-center justify-center flex-shrink-0`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">{technique.title}</h2>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </motion.div>
            </div>
            
            <p className="text-slate-300 text-sm mb-3">{technique.description}</p>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  technique.difficulty === 'Beginner' ? 'bg-green-400' :
                  technique.difficulty === 'Intermediate' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <span className="text-slate-400">{technique.difficulty}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">{technique.timeRequired}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">{technique.effectiveness}% effective</span>
              </div>
            </div>
            
            {/* Effectiveness Bar */}
            <div className="mt-3">
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${technique.effectiveness}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full bg-gradient-to-r ${technique.color}`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-700/50"
          >
            <div className="p-6 space-y-6">
              {/* Steps */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  How to Implement
                </h3>
                <ol className="space-y-2">
                  {technique.steps.map((step, stepIdx) => (
                    <motion.li
                      key={stepIdx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: stepIdx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${technique.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
                        {stepIdx + 1}
                      </div>
                      <span className="text-slate-300 text-sm leading-relaxed">{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-400" />
                  Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {technique.benefits.map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Pro Tips
                </h3>
                <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                  <p className="text-slate-300 text-sm leading-relaxed">{technique.tips}</p>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 bg-gradient-to-r ${technique.color} text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg`}
              >
                <Play className="w-4 h-4" />
                Start Practice Session
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TrainerAgentPage = () => {
  const [expandedTechnique, setExpandedTechnique] = useState(null);
  const [filter, setFilter] = useState('all'); // all, beginner, intermediate, advanced

  const filteredTechniques = filter === 'all' 
    ? TECHNIQUES 
    : TECHNIQUES.filter(t => t.difficulty.toLowerCase() === filter);

  const toggleTechnique = (index) => {
    setExpandedTechnique(expandedTechnique === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, -100, 100, 0, -100],
            scale: [1, 1.2, 1, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            x: [0, -100, 0, 100, 0],
            y: [0, 100, -100, 0, 100],
            scale: [1, 0.8, 1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark border-b border-indigo-500/20 backdrop-blur-xl flex-shrink-0"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Study Techniques
                  </h1>
                  <p className="text-slate-400 text-sm">Master proven learning methods</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{TECHNIQUES.length} Techniques</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Avg 90% Effective</span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 glass-dark border-r border-indigo-500/20 backdrop-blur-xl p-6 flex-shrink-0"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Filter by Difficulty
              </h2>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Techniques', count: TECHNIQUES.length },
                  { value: 'beginner', label: 'Beginner', count: TECHNIQUES.filter(t => t.difficulty === 'Beginner').length },
                  { value: 'intermediate', label: 'Intermediate', count: TECHNIQUES.filter(t => t.difficulty === 'Intermediate').length },
                  { value: 'advanced', label: 'Advanced', count: TECHNIQUES.filter(t => t.difficulty === 'Advanced').length }
                ].map((item) => (
                  <motion.button
                    key={item.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilter(item.value)}
                    className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between ${
                      filter === item.value
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent'
                        : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      filter === item.value
                        ? 'bg-white/20'
                        : 'bg-slate-700/50'
                    }`}>
                      {item.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Learning Tips */}
            <div className="border-t border-slate-700/50 pt-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Quick Tips
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-300">
                    💡 Combine techniques for better results
                  </p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-300">
                    🎯 Start with easier techniques first
                  </p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-300">
                    ⚡ Be consistent with your practice
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Techniques List */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Master Your Learning
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  These scientifically-proven study techniques will transform how you learn and retain information. 
                  Click on any technique to learn how to implement it.
                </p>
              </motion.div>

              {/* Techniques Grid */}
              <div className="space-y-6">
                {filteredTechniques.map((technique, index) => (
                  <TechniqueCard
                    key={technique.title}
                    technique={technique}
                    index={index}
                    isExpanded={expandedTechnique === index}
                    onToggle={() => toggleTechnique(index)}
                  />
                ))}
              </div>

              {filteredTechniques.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                    <Target className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-lg">No techniques found for this filter</p>
                  <button
                    onClick={() => setFilter('all')}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition-colors"
                  >
                    Show All Techniques
                  </button>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TrainerAgentPage;
