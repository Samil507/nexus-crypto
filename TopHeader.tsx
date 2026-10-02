import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { ShieldCheck, Code, Bell, User } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const TopHeader: React.FC = () => {
  const {
    user,
    isAdminMode,
    toggleAdminMode,
    setSystemNoticeOpen,
    setBloggerModalOpen,
    setInstallModalOpen,
    setSelectedNav
  } = useCrypto();

  return (
    <header className="sticky top-0 z-40 bg-[#080E1E]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedNav('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-slate-950 font-extrabold text-lg">N</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">
                NexusCrypto
              </span>
              <span className="text-[11px] font-medium text-emerald-400 tracking-wider uppercase mt-1 block">
                Staking Protocol
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setSelectedNav('home')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap"
          >
            Dashboard
          </button>
          <button
            onClick={() => setSelectedNav('plans')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap"
          >
            Investment Plans
          </button>
          <button
            onClick={() => setSelectedNav('claim')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap text-emerald-400 font-semibold"
          >
            Daily Claim
          </button>
          <button
            onClick={() => setSelectedNav('deposit')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap"
          >
            Deposit
          </button>
          <button
            onClick={() => setSelectedNav('withdraw')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap"
          >
            Withdraw
          </button>
        </div>

        {/* Zone 3: Primary Actions (App Install, Blogger Code, Admin Toggle, Notice, Profile) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* PWA App Install Button */}
          <PWAInstallButton onOpenModal={() => setInstallModalOpen(true)} variant="header" />

          {/* Blogger Code & Phone Guide Modal Button */}
          <button
            onClick={() => setBloggerModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
            title="Get Blogger Embed Code & Android Setup Guide"
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Blogger Code & Guide</span>
            <span className="sm:hidden">Blogger</span>
          </button>

          {/* Admin Mode Switcher */}
          <button
            onClick={toggleAdminMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
              isAdminMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isAdminMode ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{isAdminMode ? 'Admin Active' : 'Admin Panel'}</span>
          </button>

          {/* System Notice Bell */}
          <button
            onClick={() => setSystemNoticeOpen(true)}
            className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="System Notice & Announcements"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#080E1E]" />
          </button>

          {/* Balance & Profile pill */}
          <button
            onClick={() => setSelectedNav('profile')}
            className="flex items-center gap-2 pl-3 pr-2 py-1 bg-slate-900 border border-slate-800 rounded-full hover:border-emerald-500/50 transition-colors cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 block leading-tight">Available</span>
              <span className="text-xs font-bold text-emerald-400 tabular-nums leading-tight">
                {user.availableBalanceUSDT.toFixed(2)} USDT
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
              <User className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
