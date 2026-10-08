import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-amber-50 border-amber-200'
  }[type];

  const textColor = {
    success: 'text-emerald-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    warning: 'text-amber-800'
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  }[type];

  const iconBg = {
    success: 'bg-emerald-100 text-emerald-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
    warning: 'bg-amber-100 text-amber-600'
  }[type];

  return (
    <div className={`fixed top-6 right-6 z-[9999] ${bgColor} ${textColor} border rounded-2xl p-4 shadow-lg flex items-center gap-3 max-w-md animate-in fade-in slide-in-from-top duration-300`}>
      <div className={`${iconBg} w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm`}>
        {icon}
      </div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-lg font-bold opacity-50 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
