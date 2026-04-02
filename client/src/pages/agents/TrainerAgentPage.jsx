import { motion } from 'framer-motion';

const TECHNIQUES = [
  {
    title: 'Active Recall',
    description: 'Test yourself on material without looking at notes. This strengthens memory retrieval.',
    steps: [
      'Cover your notes or close the textbook',
      'Try to recall key concepts from memory',
      'Check your answers against the source material',
      'Review what you forgot or misremembered',
    ],
  },
  {
    title: 'Spaced Repetition',
    description: 'Review material at increasing intervals to fight the forgetting curve.',
    steps: [
      'Learn a concept initially',
      'Review after 1 day',
      'Review after 3 days',
      'Review after 1 week',
      'Review after 2 weeks',
      'Continue spacing reviews further apart',
    ],
  },
  {
    title: 'Pomodoro Technique',
    description: 'Study in focused 25-minute intervals with short breaks to maintain concentration.',
    steps: [
      'Set a timer for 25 minutes',
      'Study with full focus on one task',
      'Take a 5-minute break when timer ends',
      'After 4 cycles, take a longer 15-30 minute break',
      'Return to studying',
    ],
  },
  {
    title: 'Blurting',
    description: 'Explain concepts aloud from memory without looking at notes.',
    steps: [
      'Read a section of material',
      'Put the material away',
      'Say everything you remember aloud in your own words',
      'Check what you missed or got wrong',
      'Repeat with different material',
    ],
  },
  {
    title: 'Feynman Technique',
    description: 'Explain a concept as if teaching it to a complete beginner to identify gaps.',
    steps: [
      'Pick a concept to learn',
      'Explain it in simple language as if teaching a child',
      'Identify areas where your explanation breaks down',
      'Go back to the source material on those areas',
      'Simplify your explanation further',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const TrainerAgentPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-6 space-y-8"
  >
    <h1 className="text-3xl font-bold text-slate-100">Study Techniques</h1>
    <p className="text-slate-400 text-base max-w-3xl">
      Master these five proven study techniques to enhance your learning efficiency and retention.
    </p>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {TECHNIQUES.map((technique, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="glass rounded-xl p-6 space-y-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
              {index + 1}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100">{technique.title}</h2>
              <p className="text-slate-400 text-sm mt-1">{technique.description}</p>
            </div>
          </div>

          <div className="ml-11 space-y-2">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Steps:</h3>
            <ol className="space-y-2 list-decimal list-inside">
              {technique.steps.map((step, stepIdx) => (
                <li key={stepIdx} className="text-slate-300 text-sm">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

export default TrainerAgentPage;
