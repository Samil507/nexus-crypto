import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { Home, TrendingUp, Zap, Users, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { selectedNav, setSelectedNav, activeInvestments, referralState } = useCrypto();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plans', label: 'Plans', icon: TrendingUp },
    { id: 'claim', label: 'Claim', icon: Zap, centerAction: true },
    { id: 'referral', label: 'Referral', icon: Users, badge: referralState.pendingCommission > 0 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#091124]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto relative">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = selectedNav === tab.id;

          if (tab.centerAction) {
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedNav(tab.id)}
                className="relative -top-4 flex flex-col items-center group cursor-pointer"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-transform flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#080E1E] flex items-center justify-center">
                    <Zap className="w-6 h-6 text-emerald-400 animate-pulse" />
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 tracking-tight mt-0.5">
                  Claim
                </span>
                {activeInvestments.length > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#080E1E]" />
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedNav(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] cursor-pointer transition-colors ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-emerald-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
