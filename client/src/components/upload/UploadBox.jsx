import { useRef, useState } from 'react';

const UploadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const UploadBox = ({ label, onFileSelect, accept }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const borderClass = selectedFile
    ? 'border-green-500 bg-green-500/5'
    : isDragOver
    ? 'border-indigo-500 bg-indigo-500/10'
    : 'border-slate-600 hover:border-slate-500';

  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 cursor-pointer transition-colors duration-200 ${borderClass}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <UploadIcon className={`w-6 h-6 ${selectedFile ? 'text-green-400' : 'text-slate-400'}`} />
      {selectedFile ? (
        <p className="text-xs text-green-400 font-medium text-center break-all">{selectedFile.name}</p>
      ) : (
        <>
          <p className="text-xs font-medium text-slate-300">{label}</p>
          <p className="text-xs text-slate-500">Drag & drop or click to browse</p>
        </>
      )}
    </div>
  );
};

export default UploadBox;
