import React, { useState, useEffect } from 'react';
import { useCrypto } from '../context/CryptoContext';
import {
  Zap,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingUp,
  FastForward,
  Award
} from 'lucide-react';

export const DailyClaimView: React.FC = () => {
  const {
    activeInvestments,
    claimDailyYield,
    fastForwardClaimTime,
    setSelectedNav,
    user
  } = useCrypto();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Filter investments belonging to this user
  const userInvestments = activeInvestments.filter(i => !i.userUid || i.userUid === user.uid);

  // Keep a local tick every 10 seconds for countdowns
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const totalDailyEarningPotential = userInvestments
    .filter(i => i.status === 'ACTIVE')
    .reduce((sum, i) => sum + i.dailyClaimAmount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Daily Staking Yield Claim</span>
            <Zap className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Claim your accrued 24-hour yields directly into your available balance.
          </p>
        </div>

        {/* Global Claim Potential */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0F172A] border border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Daily Yield Rate
            </span>
            <span className="text-base font-extrabold text-emerald-400 tabular-nums">
              +{totalDailyEarningPotential.toFixed(2)} USDT / day
            </span>
          </div>
        </div>
      </div>

      {/* Information Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">24-Hour Distribution Rule</span>
            <span className="text-slate-400 leading-relaxed block mt-0.5">
              Each active 40-day contract allows exactly one claim every 24 hours. Duplicate claims are prevented by the smart contract daemon until the timer expires.
            </span>
          </div>
        </div>
      </div>

      {/* Active Investments Claim List */}
      {userInvestments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E172A] border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Active Staking Contracts</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              You do not have any active investment plans generating daily yield. Choose a plan to begin claiming daily returns.
            </p>
          </div>
          <button
            onClick={() => setSelectedNav('plans')}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            Explore 40-Day Plans
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userInvestments.map(inv => {
            const nextClaimTime = new Date(inv.nextClaimAvailableAt);
            const isClaimReady = currentTime >= nextClaimTime && inv.status === 'ACTIVE';
            const daysRemaining = Math.max(0, inv.durationDays - inv.daysClaimed);
            const remainingPayout = Math.max(0, +(inv.totalPayout - inv.totalClaimed).toFixed(2));
            const progressPercent = Math.min(100, Math.round((inv.daysClaimed / inv.durationDays) * 100));

            // Format remaining time
            const diffMs = nextClaimTime.getTime() - currentTime.getTime();
            const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
            const diffMinutes = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));

            return (
              <div
                key={inv.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-all space-y-5"
              >
                {/* Top Row: Plan Name, Status & Claim Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{inv.planName}</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          inv.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Staked: {inv.depositAmount} USDT &bull; Started:{' '}
                      {inv.startedAt.substring(0, 10)}
                    </span>
                  </div>

                  {/* Claim Button & Testing Fast Forward */}
                  <div className="flex items-center gap-2">
                    {/* Demo Helper: Fast-forward claim window */}
                    {!isClaimReady && inv.status === 'ACTIVE' && (
                      <button
                        onClick={() => fastForwardClaimTime(inv.id)}
                        className="px-2.5 py-2 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        title="Fast-forward countdown for testing"
                      >
                        <FastForward className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Unlock Timer</span>
                      </button>
                    )}

                    {/* Strict requirement: Must have "Claim Now" button */}
                    <button
                      onClick={() => claimDailyYield(inv.id)}
                      disabled={!isClaimReady}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        isClaimReady
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02]'
                          : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>
                        {isClaimReady
                          ? `Claim Now (+${inv.dailyClaimAmount} USDT)`
                          : inv.status === 'COMPLETED'
                          ? 'Contract Matured'
                          : `Next in ${diffHours}h ${diffMinutes}m`}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-400 block">Total Claimed</span>
                    <span className="text-sm font-bold text-emerald-400 mt-0.5 block tabular-nums">
                      {inv.totalClaimed.toFixed(2)} USDT
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Remaining Amount</span>
                    <span className="text-sm font-bold text-white mt-0.5 block tabular-nums">
                      {remainingPayout.toFixed(2)} USDT
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Days Claimed</span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5 block tabular-nums">
                      {inv.daysClaimed} / {inv.durationDays}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Days Remaining</span>
                    <span className="text-sm font-bold text-amber-400 mt-0.5 block tabular-nums">
                      {daysRemaining} Days
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>40-Day Maturity Progress: {progressPercent}%</span>
                    <span>Max Payout: {inv.totalPayout} USDT</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
