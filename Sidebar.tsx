import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Home,
  TrendingUp,
  Download,
  Upload,
  Briefcase,
  Zap,
  Receipt,
  User,
  HelpCircle,
  Shield,
  FileCode2,
  ExternalLink,
  Users
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    selectedNav,
    setSelectedNav,
    user,
    activeInvestments,
    referralState,
    isAdminMode,
    toggleAdminMode,
    setBloggerModalOpen,
    setInstallModalOpen
  } = useCrypto();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plans', label: 'Investment Plans', icon: TrendingUp },
    { id: 'claim', label: 'Daily Claim', icon: Zap, badge: `${activeInvestments.length}` },
    { id: 'referral', label: 'Referral Program', icon: Users, badge: `+${referralState.pendingCommission} USDT` },
    { id: 'deposit', label: 'Deposit', icon: Download },
    { id: 'withdraw', label: 'Withdraw', icon: Upload },
    { id: 'my-investments', label: 'My Investments', icon: Briefcase },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0B132B]/80 border-r border-slate-800/80 p-5 shrink-0 min-h-[calc(100vh-65px)] justify-between select-none">
      <div className="space-y-6">
        {/* Navigation List */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = selectedNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Navigation Option */}
        <div className="pt-2 border-t border-slate-800/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Management
          </div>
          <button
            onClick={() => {
              if (!isAdminMode) toggleAdminMode();
              setSelectedNav('admin');
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              selectedNav === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Admin Control Panel</span>
          </button>
        </div>
      </div>

      {/* Bottom Compact Card: Balance & App Install / Blogger Tool */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
        {/* App Install Button */}
        <PWAInstallButton onOpenModal={() => setInstallModalOpen(true)} variant="sidebar" />

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-xs text-slate-400">Available USDT</div>
          <div className="text-lg font-bold text-emerald-400 tabular-nums">
            {user.availableBalanceUSDT.toFixed(2)} <span className="text-xs font-normal text-slate-400">USDT</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Staked:</span>
            <span className="text-slate-300 font-semibold tabular-nums">{user.frozenBalanceUSDT.toFixed(2)} USDT</span>
          </div>
        </div>

        <button
          onClick={() => setBloggerModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Blogger Embed Code</span>
        </button>
      </div>
    </aside>
  );
};
