import React from 'react';
import { InvestmentPlan } from '../types/crypto';
import { useCrypto } from '../context/CryptoContext';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface InvestModalProps {
  plan: InvestmentPlan | null;
  onClose: () => void;
}

export const InvestModal: React.FC<InvestModalProps> = ({ plan, onClose }) => {
  const { user, investInPlan, setSelectedNav } = useCrypto();

  if (!plan) return null;

  const hasSufficientBalance = user.availableBalanceUSDT >= plan.depositAmount;

  const handleConfirm = () => {
    const success = investInPlan(plan);
    if (success) {
      onClose();
      setSelectedNav('claim');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#080E1E] border-b border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block">
              Investment Contract
            </span>
            <h3 className="text-lg font-bold text-white leading-tight">
              {plan.name} Confirmation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Plan Summary Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
              <span className="text-xs text-slate-400">Required Deposit</span>
              <span className="text-lg font-bold text-white tabular-nums">
                {plan.depositAmount.toFixed(2)} USDT
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Term Duration</span>
                <span className="text-sm font-semibold text-slate-200 mt-0.5 block">
                  {plan.durationDays} Days Fixed
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Daily Claim Rate</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block tabular-nums">
                  +{plan.dailyClaim.toFixed(2)} USDT / day
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Payout</span>
                <span className="text-sm font-bold text-white mt-0.5 block tabular-nums">
                  {plan.totalPayout.toFixed(2)} USDT
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Net Profit</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block tabular-nums">
                  +{plan.totalDifference.toFixed(2)} USDT
                </span>
              </div>
            </div>
          </div>

          {/* User Balance Check */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
            <span className="text-slate-400">Your Available Balance:</span>
            <span
              className={`font-bold tabular-nums ${
                hasSufficientBalance ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {user.availableBalanceUSDT.toFixed(2)} USDT
            </span>
          </div>

          {!hasSufficientBalance && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span>Insufficient funds to stake this tier. Please deposit crypto first.</span>
                <button
                  onClick={() => {
                    onClose();
                    setSelectedNav('deposit');
                  }}
                  className="mt-1.5 text-red-200 font-semibold underline block cursor-pointer"
                >
                  Go to Deposit page &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Terms & Conditions Disclosure */}
          <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Contract Terms & Risk Disclosure:
            </div>
            <p>
              • Daily yield claims unlock once every 24 hours in the "Daily Claim" tab.
            </p>
            <p>
              • Contract expires strictly upon completing 40 daily claim distributions or achieving full payout limit ({plan.totalPayout} USDT).
            </p>
            <p>
              • Plan yield values represent proposed contract schedules. Always evaluate risk before staking capital.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!hasSufficientBalance}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Invest Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
