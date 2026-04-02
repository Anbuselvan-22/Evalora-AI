const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4M5 3H3v5a4 4 0 004 4h.5M19 3h2v5a4 4 0 01-4 4h-.5M5 3h14v6a5 5 0 01-10 0V3z" />
  </svg>
);

const MedalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="14" r="5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3l1.5 4h3L15 3" />
  </svg>
);

const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="9" r="6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l-2 6 5-3 5 3-2-6" />
  </svg>
);

const BADGE_CONFIG = {
  gold: {
    gradient: 'from-yellow-400 to-amber-500',
    text: 'text-yellow-900',
    Icon: TrophyIcon,
    label: 'Gold',
  },
  silver: {
    gradient: 'from-slate-300 to-gray-400',
    text: 'text-slate-900',
    Icon: MedalIcon,
    label: 'Silver',
  },
  bronze: {
    gradient: 'from-orange-400 to-amber-700',
    text: 'text-orange-900',
    Icon: AwardIcon,
    label: 'Bronze',
  },
};

const Badge = ({ level }) => {
  const config = BADGE_CONFIG[level] ?? BADGE_CONFIG.bronze;
  const { Icon } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${config.gradient} ${config.text}`}
    >
      <Icon />
      {config.label}
    </span>
  );
};

export default Badge;
