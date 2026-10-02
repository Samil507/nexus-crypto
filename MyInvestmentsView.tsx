import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { Briefcase, Zap, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export const MyInvestmentsView: React.FC = () => {
  const { activeInvestments, user, setSelectedNav } = useCrypto();

  const myInvestments = activeInvestments.filter(i => !i.userUid || i.userUid === user.uid);
  const activePlansCount = myInvestments.filter(i => i.status === 'ACTIVE').length;
  const completedPlansCount = myInvestments.filter(i => i.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>My Staking Portfolio</span>
            <Briefcase className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track all your active, maturing, and completed 40-day crypto investment contracts.
          </p>
        </div>

        <button
          onClick={() => setSelectedNav('plans')}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer transition-all self-start sm:self-auto"
        >
          Stake In New Plan
        </button>
      </div>

      {/* Portfolio Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Invested Principal</span>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {user.totalInvestedUSDT.toFixed(2)} <span className="text-xs text-slate-400">USDT</span>
          </div>
          <span className="text-[11px] text-slate-400">Across {myInvestments.length} contracts</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Yield Harvested</span>
          <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
            {user.totalClaimedUSDT.toFixed(2)} <span className="text-xs text-emerald-500">USDT</span>
          </div>
          <span className="text-[11px] text-slate-400">Liquid payouts received</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Contract Lifecycle</span>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {activePlansCount} <span className="text-sm font-semibold text-emerald-400">Active</span>
            <span className="text-slate-600 mx-2">/</span>
            {completedPlansCount} <span className="text-xs text-slate-400">Finished</span>
          </div>
          <span className="text-[11px] text-slate-400">40-day maturity model</span>
        </div>
      </div>

      {/* Contract Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Investment Contract Ledger</h2>

        {myInvestments.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-[#0F172A] border border-slate-800 text-xs text-slate-400">
            No investment contracts initiated yet.
          </div>
        ) : (
          <div className="space-y-4">
            {myInvestments.map(inv => {
              const daysLeft = Math.max(0, inv.durationDays - inv.daysClaimed);
              const progressPct = Math.min(100, Math.round((inv.daysClaimed / inv.durationDays) * 100));
              const remainingPayout = Math.max(0, +(inv.totalPayout - inv.totalClaimed).toFixed(2));

              return (
                <div
                  key={inv.id}
                  className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{inv.planName}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            inv.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        Contract ID: <span className="font-mono text-slate-300">{inv.id}</span> &bull; Started:{' '}
                        {inv.startedAt.substring(0, 10)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedNav('claim')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Go to Daily Claim</span>
                      </button>
                    </div>
                  </div>

                  {/* 4-col stat breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Staked Amount</span>
                      <span className="text-sm font-bold text-white mt-0.5 block tabular-nums">
                        {inv.depositAmount} USDT
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Daily Distribution</span>
                      <span className="text-sm font-bold text-emerald-400 mt-0.5 block tabular-nums">
                        +{inv.dailyClaimAmount} USDT / day
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Total Claimed</span>
                      <span className="text-sm font-bold text-emerald-300 mt-0.5 block tabular-nums">
                        {inv.totalClaimed.toFixed(2)} USDT
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Remaining Balance</span>
                      <span className="text-sm font-bold text-amber-400 mt-0.5 block tabular-nums">
                        {remainingPayout.toFixed(2)} USDT ({daysLeft} days)
                      </span>
                    </div>
                  </div>

                  {/* Progress visual */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Term Progress: {inv.daysClaimed} / {inv.durationDays} Days</span>
                      <span>Target: {inv.totalPayout} USDT</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
