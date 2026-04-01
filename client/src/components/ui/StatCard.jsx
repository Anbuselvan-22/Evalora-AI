import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon }) => (
  <motion.div
    className="glass rounded-xl p-5"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {icon && (
      <div className="mb-3 text-indigo-400 text-2xl">{icon}</div>
    )}
    <p className="text-2xl font-bold text-indigo-400">{value}</p>
    <p className="text-sm text-slate-400 mt-1">{label}</p>
  </motion.div>
);

export default StatCard;
