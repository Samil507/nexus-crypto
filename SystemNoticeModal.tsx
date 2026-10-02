import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { X, ExternalLink, Send, ShieldAlert, Sparkles } from 'lucide-react';

export const SystemNoticeModal: React.FC = () => {
  const { systemNoticeOpen, setSystemNoticeOpen, showToast } = useCrypto();

  if (!systemNoticeOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0E172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#080E1E] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 ml-2">
              SYSTEM.NOTICE
            </span>
          </div>
          <button
            onClick={() => setSystemNoticeOpen(false)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
          <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">
            Nexus & X-AI | Next-Gen Automated Yield & Staking Protocol
          </h2>

          {/* Banner Graphic */}
          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-video">
            <img
              src="/src/assets/images/crypto_hero_banner_1790932062746.jpg"
              alt="Nexus Crypto Staking Banner"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E172A] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-emerald-300 font-semibold bg-[#080E1E]/80 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-emerald-500/30">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> 40-Day Yield Contracts Live
              </span>
              <span className="text-slate-300 font-mono">v2026.10</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-slate-300 leading-relaxed space-y-2">
            <p>
              Nexus Protocol is built to deliver automated decentralized yields through liquidity node allocation and algorithmic crypto staking across USDT (TRC20, BEP20, ERC20), BNB, TRX, and ETH.
            </p>
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5 text-xs">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span>①</span> Welcome Credit: 150 USDT initial staking test allocation credited to your dashboard!
              </div>
              <div className="text-slate-300 flex items-center gap-1.5">
                <span>•</span> All investment plans execute on a strict 40-day duration with 24-hour daily claim distributions.
              </div>
              <div className="text-slate-300 flex items-center gap-1.5">
                <span>•</span> Fast Binance direct transfers supported with instant TxID submission & verification.
              </div>
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-normal flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Transparency Disclosure:</strong> Listed rates are proposed payout terms. Blockchain network confirmations are mandatory on backend nodes before real funds are settled.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                showToast('Connecting to Official Telegram Channel...');
                window.open('https://telegram.org', '_blank');
              }}
              className="w-full py-3 px-4 rounded-xl bg-white text-slate-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors cursor-pointer shadow-lg"
            >
              <Send className="w-4 h-4 text-slate-900" />
              <span>Official Announcements Channel</span>
            </button>

            <button
              onClick={() => {
                showToast('Opening Official Community Group...');
                window.open('https://telegram.org', '_blank');
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>Official Community Group</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setSystemNoticeOpen(false)}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              I Understand &bull; Continue to Staking Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
