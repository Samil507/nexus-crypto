import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  onOpenModal: () => void;
  variant?: 'header' | 'sidebar' | 'banner' | 'mobile';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenModal,
  variant = 'header'
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (!res) {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  if (variant === 'sidebar') {
    return (
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.01] cursor-pointer"
        title="Install app directly to your phone without Google Play Store"
      >
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Install Web App</span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
          Free
        </span>
      </button>
    );
  }

  if (variant === 'banner') {
    return (
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App (Free APK/PWA)</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg hover:bg-emerald-500/30 transition-all cursor-pointer shadow-sm hover:scale-105"
      title="Download and install app for free directly from Chrome"
    >
      <Download className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
      <span className="hidden sm:inline">Install App</span>
      <span className="sm:hidden">App</span>
    </button>
  );
};
