import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, trend, color = 'from-indigo-500 to-purple-500' }) => {
  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getProgressColor = (value) => {
    if (typeof value === 'string' && value.includes('%')) {
      const num = parseInt(value);
      if (num >= 80) return 'from-green-500 to-emerald-500';
      if (num >= 60) return 'from-yellow-500 to-orange-500';
      return 'from-red-500 to-pink-500';
    }
    return color;
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border border-slate-600/50 rounded-2xl p-6 hover:from-slate-700 hover:via-slate-800 hover:to-slate-700 transition-all duration-500 cursor-pointer h-36 flex flex-col justify-between overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: '0 25px 50px 0 rgba(99, 102, 241, 0.4)' 
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-spin-slow" style={{ animationDuration: '20s' }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      </div>

      <div className="relative z-10 flex items-start justify-between mb-4">
        {icon && (
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-2xl group-hover:scale-110 transition-all duration-500 ring-4 ring-indigo-500/30">
            <div className="text-3xl filter drop-shadow-lg">{icon}</div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white/90 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        {trend && (
          <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl ${getTrendColor(trend)} bg-slate-900/80 backdrop-blur-sm border border-current/20`}>
            <span className="flex items-center gap-1">
              {trend === 'up' && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V3m0 0l-9.2 9.2M15 7h6a2 2 0 002 2v8a2 2 0 002-2h-6a2 2 0 00-2-2V9a2 2 0 002-2z" />
                </svg>
              )}
              {trend === 'down' && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M17 17V3m0 0l9.2 9.2M15 7h6a2 2 0 002 2v8a2 2 0 002-2h-6a2 2 0 00-2-2V9a2 2 0 002-2z" />
                </svg>
              )}
              <span>{trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{typeof value === 'string' && value.includes('%') ? value.match(/\d+/)?.[0] : '0'}%</span>
            </span>
          </div>
        )}
      </div>
      
      <div className="relative z-10 space-y-2">
        <p className="text-4xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
          {value}
        </p>
        <p className="text-sm text-slate-300 font-bold uppercase tracking-wider drop-shadow">
          {label}
        </p>
      </div>

      {/* Enhanced progress indicator */}
      {typeof value === 'string' && value.includes('%') && (
        <div className="relative z-10 mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <motion.div 
                className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(value)} shadow-2xl`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(parseInt(value), 100)}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="text-xs font-bold text-slate-400">
              {Math.min(parseInt(value), 100)}%
            </div>
          </div>
          
          {/* Progress dots */}
          <div className="flex justify-between mt-2">
            <div className="flex gap-1">
              <div className={`w-2 h-2 rounded-full ${parseInt(value) >= 25 ? 'bg-white/80' : 'bg-slate-600/50'}`}></div>
              <div className={`w-2 h-2 rounded-full ${parseInt(value) >= 50 ? 'bg-white/80' : 'bg-slate-600/50'}`}></div>
              <div className={`w-2 h-2 rounded-full ${parseInt(value) >= 75 ? 'bg-white/80' : 'bg-slate-600/50'}`}></div>
              <div className={`w-2 h-2 rounded-full ${parseInt(value) >= 100 ? 'bg-white/80' : 'bg-slate-600/50'}`}></div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
