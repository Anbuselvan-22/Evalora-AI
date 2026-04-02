const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-4 4 4 4-6" />
  </svg>
);

const ChartCard = ({ title, children, isEmpty }) => {
  const showEmpty = isEmpty || children == null;

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
      {showEmpty ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-2">
          <ChartIcon />
          <p className="text-sm">No data available</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ChartCard;
