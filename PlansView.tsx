import React, { useState } from 'react';
import { OFFICIAL_INVESTMENT_PLANS } from '../data/plans';
import { InvestmentPlan } from '../types/crypto';
import { InvestModal } from '../components/InvestModal';
import { useCrypto } from '../context/CryptoContext';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Clock,
  Sparkles,
  Calculator,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const PlansView: React.FC = () => {
  const { user } = useCrypto();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'entry' | 'pro'>('all');
  const [activePlanForModal, setActivePlanForModal] = useState<InvestmentPlan | null>(null);

  // Filter plans based on category
  const filteredPlans = OFFICIAL_INVESTMENT_PLANS.filter(plan => {
    if (selectedCategory === 'entry') return plan.depositAmount <= 15;
    if (selectedCategory === 'pro') return plan.depositAmount >= 20;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Institutional Staking Plans
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            All 6 official tiers feature an immutable 40-day staking term and 24-hour daily claim distributions.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Plans (6)
          </button>
          <button
            onClick={() => setSelectedCategory('entry')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'entry'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5 - 15 USDT
          </button>
          <button
            onClick={() => setSelectedCategory('pro')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'pro'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            20 - 100 USDT
          </button>
        </div>
      </div>

      {/* Yield Calculator Bar */}
      <div className="p-4 rounded-xl bg-[#0B132B] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Fixed 40-Day Settlement Model</span>
            <span className="text-xs text-slate-400">
              Daily yields accrue every 24 hours. Principal + yield payout completes upon day 40.
            </span>
          </div>
        </div>
        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30 whitespace-nowrap">
          Available Liquid: {user.availableBalanceUSDT.toFixed(2)} USDT
        </div>
      </div>

      {/* 6 Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlans.map(plan => {
          const isAffordable = user.availableBalanceUSDT >= plan.depositAmount;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 bg-[#0E172A] border flex flex-col justify-between transition-all duration-200 group hover:shadow-xl ${
                plan.popular
                  ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  Recommended Tier
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    TIER 0{plan.tier}
                  </span>
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 40 Days
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mt-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>

                {/* Staking Amount */}
                <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    Staking Requirement
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-extrabold text-white tabular-nums">
                      {plan.depositAmount}
                    </span>
                    <span className="text-sm font-bold text-emerald-400">USDT</span>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Daily Claim:</span>
                    <span className="font-bold text-emerald-400 tabular-nums">
                      +{plan.dailyClaim.toFixed(2)} USDT / day
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Contract Duration:</span>
                    <span className="font-semibold text-slate-200">40 Days</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Total Contract Payout:</span>
                    <span className="font-bold text-white tabular-nums">
                      {plan.totalPayout.toFixed(2)} USDT
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Total Net Yield (Diff):</span>
                    <span className="font-bold text-emerald-300 tabular-nums">
                      +{plan.totalDifference.toFixed(2)} USDT
                    </span>
                  </div>
                </div>
              </div>

              {/* Requirement: Invest Now button only! Never Buy Now. */}
              <div className="mt-6">
                <button
                  onClick={() => setActivePlanForModal(plan)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isAffordable
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-[1.02]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span>Invest Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                {!isAffordable && (
                  <span className="text-[10px] text-amber-400/90 text-center block mt-1.5">
                    Requires +{(plan.depositAmount - user.availableBalanceUSDT).toFixed(2)} USDT deposit
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Protocol Disclosure */}
      <div className="p-4 rounded-xl bg-[#091124] border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <AlertCircle className="w-4 h-4 text-emerald-400" />
          <span>Smart Contract Payout Disclosures & Risk Information</span>
        </div>
        <p className="leading-relaxed">
          The stated total payouts and daily claim amounts represent proposed contract distributions based on node performance. Real blockchain withdrawals are governed by network gas fees and server-side transaction signing. No earnings are guaranteed without underlying network validation.
        </p>
      </div>

      {/* Confirmation Modal */}
      {activePlanForModal && (
        <InvestModal
          plan={activePlanForModal}
          onClose={() => setActivePlanForModal(null)}
        />
      )}
    </div>
  );
};
