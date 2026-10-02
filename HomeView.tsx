import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { OFFICIAL_INVESTMENT_PLANS } from '../data/plans';
import { InvestmentPlan } from '../types/crypto';
import { InvestModal } from '../components/InvestModal';
import {
  TrendingUp,
  Download,
  Upload,
  Receipt,
  Zap,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Info,
  Clock,
  Smartphone
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    user,
    activeInvestments,
    transactions,
    setSelectedNav,
    setSystemNoticeOpen,
    setBloggerModalOpen,
    setInstallModalOpen
  } = useCrypto();

  const [selectedPlanForModal, setSelectedPlanForModal] = useState<InvestmentPlan | null>(null);

  // Calculate today's claims from transactions
  const todayStr = new Date().toISOString().substring(0, 10);
  const todayEarned = transactions
    .filter(t => t.type === 'DAILY_CLAIM' && t.createdAt.startsWith(todayStr))
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Account Summary Card (Inspired by the Bangladesh app screenshots) */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#0F1B38] via-[#0D1830] to-[#0A1224] border border-slate-800 p-6 shadow-xl overflow-hidden">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Live Liquidity Node Account
              </span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-xs text-slate-400 font-mono">UID: {user.uid}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
                {user.availableBalanceUSDT.toFixed(2)}
              </span>
              <span className="text-lg font-bold text-emerald-400">USDT</span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Available liquid balance for staking & withdrawals
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedNav('deposit')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Deposit</span>
            </button>
            <button
              onClick={() => setSelectedNav('withdraw')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-300" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* 3-column stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-5 text-center sm:text-left">
          <div>
            <span className="text-xs text-slate-400 block">Today Claimed</span>
            <span className="text-lg sm:text-xl font-bold text-emerald-400 mt-1 block tabular-nums">
              +{todayEarned.toFixed(2)} USDT
            </span>
          </div>
          <div className="border-x border-slate-800/80 px-2 sm:px-4">
            <span className="text-xs text-slate-400 block">Active Contracts</span>
            <span className="text-lg sm:text-xl font-bold text-white mt-1 block tabular-nums">
              {activeInvestments.length} <span className="text-xs font-normal text-slate-400">Active</span>
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Total Claimed</span>
            <span className="text-lg sm:text-xl font-bold text-emerald-300 mt-1 block tabular-nums">
              {user.totalClaimedUSDT.toFixed(2)} USDT
            </span>
          </div>
        </div>
      </div>

      {/* 2. Four-Grid Action Hub (Matching screenshot layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setSelectedNav('deposit')}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Download className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-white">Deposit Crypto</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Binance & Web3</span>
        </button>

        <button
          onClick={() => setSelectedNav('withdraw')}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-white">Withdrawal</span>
          <span className="text-[11px] text-slate-400 mt-0.5">TRC20 / BEP20</span>
        </button>

        <button
          onClick={() => setSelectedNav('claim')}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-white">Daily Claim</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Collect Staking</span>
        </button>

        <button
          onClick={() => setSelectedNav('transactions')}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Receipt className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-white">Transactions</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Audit History</span>
        </button>
      </div>

      {/* PWA Free Mobile App Install Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0D182E] to-[#0A1224] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/30 shrink-0">
            <div className="w-full h-full rounded-2xl bg-[#080E1E] flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold text-white">Want to use NexusCrypto as a Mobile App?</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Free
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Install directly from Chrome browser in 1-click without Google Play Store for a clean, full-screen experience.
            </p>
          </div>
        </div>

        <button
          onClick={() => setInstallModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Install App (Free Download)</span>
        </button>
      </div>

      {/* Referral Program Growth Banner */}
      <div
        onClick={() => setSelectedNav('referral')}
        className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0F172A] to-[#0F172A] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-emerald-500/60 transition-all group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Gamified Referral Program</span>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                10% Commission
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">
              Share your link with friends. Track invitations, active stakers, and harvest commission rewards!
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View Referral Hub</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* 3. Terminal / Ledger Stream Box (Inspired by screenshot 3) */}
      <div className="rounded-xl bg-[#070D1B] border border-slate-800 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <span className="font-mono text-slate-400 ml-2 font-semibold">LEDGER.STREAM</span>
          </div>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Node Synchronized
          </span>
        </div>

        <div className="pt-3 space-y-2 font-mono text-xs">
          {transactions.slice(0, 3).map(tx => (
            <div key={tx.id} className="flex items-center justify-between py-1 text-slate-300">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">&gt;</span>
                <span>{tx.note || tx.type}</span>
              </span>
              <span className={`font-bold tabular-nums ${tx.type === 'WITHDRAW' ? 'text-red-400' : 'text-emerald-400'}`}>
                {tx.type === 'WITHDRAW' ? '-' : '+'}{tx.amount.toFixed(2)} USDT
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Featured Investment Plans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Official 40-Day Investment Plans</h2>
            <p className="text-xs text-slate-400">
              Fixed 40-day staking terms with automated daily yield claims.
            </p>
          </div>
          <button
            onClick={() => setSelectedNav('plans')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All 6 Plans</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OFFICIAL_INVESTMENT_PLANS.slice(0, 3).map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-xl p-5 bg-[#0F172A] border transition-all duration-200 flex flex-col justify-between ${
                plan.popular
                  ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-base font-bold text-white">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                    {plan.depositAmount}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">USDT Required</span>
                </div>

                <div className="mt-4 space-y-2 py-3 border-y border-slate-800/80 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Claim:</span>
                    <span className="font-bold text-emerald-400 tabular-nums">
                      +{plan.dailyClaim} USDT / day
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-semibold text-slate-200">
                      {plan.durationDays} Days Fixed
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Payout:</span>
                    <span className="font-bold text-white tabular-nums">
                      {plan.totalPayout} USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Net Difference:</span>
                    <span className="font-bold text-emerald-300 tabular-nums">
                      +{plan.totalDifference} USDT
                    </span>
                  </div>
                </div>
              </div>

              {/* Strict Requirement: Must have Invest Now button. Never Buy Now. */}
              <button
                onClick={() => setSelectedPlanForModal(plan)}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                <span>Invest Now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Risk & Transparency Disclosure */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Mandatory Protocol Risk & Capacity Notice</span>
        </div>
        <p className="leading-relaxed">
          The plan amounts are proposed payout terms, not proof of actual earnings or guaranteed returns. Staking operations carry digital asset market risk. Always review network gas fees and legal regulations before deploying funds.
        </p>
      </div>

      {/* Invest Modal */}
      {selectedPlanForModal && (
        <InvestModal
          plan={selectedPlanForModal}
          onClose={() => setSelectedPlanForModal(null)}
        />
      )}
    </div>
  );
};
