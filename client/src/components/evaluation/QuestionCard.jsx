import { motion } from 'framer-motion';

const Section = ({ title, items, colorClass, bulletClass }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-3">
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${colorClass}`}>{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className={`flex items-start gap-2 text-sm text-slate-300`}>
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${bulletClass}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const QuestionCard = ({ questionNumber, marks, correctPoints, missingPoints, mistakes, suggestions }) => (
  <motion.div
    className="glass rounded-xl p-5"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-slate-200 font-semibold">Question {questionNumber}</h4>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        {marks} marks
      </span>
    </div>

    <Section title="Correct Points" items={correctPoints} colorClass="text-green-400" bulletClass="bg-green-400" />
    <Section title="Missing Points" items={missingPoints} colorClass="text-yellow-400" bulletClass="bg-yellow-400" />
    <Section title="Mistakes" items={mistakes} colorClass="text-red-400" bulletClass="bg-red-400" />
    <Section title="Suggestions" items={suggestions} colorClass="text-blue-400" bulletClass="bg-blue-400" />
  </motion.div>
);

export default QuestionCard;
