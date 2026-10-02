import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useCrypto();
  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm bg-slate-900/95 border border-emerald-500/40 text-white px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
      <span className="text-sm font-medium leading-snug">{toastMessage}</span>
    </div>
  );
};
