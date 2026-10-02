import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Sparkles,
  Share2,
  PlusSquare,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  MoreVertical
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full rounded-2xl bg-[#080E1E] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Install Application</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Free
                </span>
              </h3>
              <span className="text-xs text-slate-400">Direct install from Chrome without Google Play Store</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {installSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">App Installed Successfully!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                NexusCrypto has been added to your phone's home screen. You can now launch it directly in full-screen mode like a native app.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Free PWA Advantages */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <Zap className="w-4 h-4 text-amber-400 mx-auto" />
                <span className="font-bold text-white block">Full-Screen</span>
                <span className="text-[10px] text-slate-400 block">No browser URL bars</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="font-bold text-white block">100% Free</span>
                <span className="text-[10px] text-slate-400 block">No Play Store charges</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <Sparkles className="w-4 h-4 text-blue-400 mx-auto" />
                <span className="font-bold text-white block">Instant & Light</span>
                <span className="text-[10px] text-slate-400 block">Only 2 MB storage</span>
              </div>
            </div>

            {/* Direct 1-Click Install Button if supported by Chrome */}
            {isInstallable ? (
              <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Install App Now (1-Click Download)</span>
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  After clicking, confirm <strong>"Install"</strong> in your Chrome prompt.
                </p>
              </div>
            ) : null}

            {/* Step-by-Step Chrome Installation Guide */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                📱 Manual Chrome Installation Steps:
              </span>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-white block">Open Chrome's Three-Dot (⋮) Menu</span>
                    <span className="text-slate-400 text-[11px]">
                      Tap the three vertical dots <MoreVertical className="w-3.5 h-3.5 inline text-amber-400" /> in the top-right corner of your browser.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-white block">Select "Install app" or "Add to Home screen"</span>
                    <span className="text-slate-400 text-[11px]">
                      From the menu list, choose <strong>"Install app"</strong> (or <strong>"Add to Home screen"</strong>).
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-white block">Tap "Install" to Complete</span>
                    <span className="text-slate-400 text-[11px]">
                      Chrome will automatically generate the app icon on your home screen for quick launch.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* iOS Safari Alternate Guide */}
            {isIOS && (
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>For iPhone (iOS Safari) Users:</span>
                </span>
                <p className="text-[11px] text-blue-200/90 leading-relaxed">
                  Tap the Safari Share button (<Share2 className="w-3 h-3 inline" />) at the bottom, scroll down and tap <strong>"Add to Home Screen"</strong> (<PlusSquare className="w-3 h-3 inline" />).
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
              <span>NexusCrypto WebAPK PWA v2.4</span>
              <button
                onClick={onClose}
                className="text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
