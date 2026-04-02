import { motion } from 'framer-motion';

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <motion.div
      className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    />
  </div>
);

export default Loader;
