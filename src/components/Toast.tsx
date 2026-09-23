import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, Info, Award, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            toast.type === 'badge'
              ? 'bg-amber-500/95 text-white border-amber-400 shadow-amber-500/25'
              : toast.type === 'success'
              ? 'bg-emerald-600/95 text-white border-emerald-500 shadow-emerald-600/25'
              : 'bg-indigo-600/95 text-white border-indigo-500 shadow-indigo-600/25'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'badge' ? (
              <Award className="w-5 h-5 flex-shrink-0 animate-bounce text-amber-200" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-200" />
            ) : (
              <Info className="w-5 h-5 flex-shrink-0 text-indigo-200" />
            )}
            <p className="text-sm font-medium leading-snug">{toast.text}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white ml-2 flex-shrink-0"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
