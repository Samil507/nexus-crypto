import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import {
  User,
  Copy,
  Check,
  Shield,
  Key,
  Lock,
  Smartphone,
  ChevronRight,
  CreditCard,
  History,
  AlertTriangle,
  LogOut
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, setSelectedNav, showToast } = useCrypto();
  const [copiedUid, setCopiedUid] = useState(false);
  const [twoFaActive, setTwoFaActive] = useState(user.twoFactorEnabled);

  const handleCopyUid = () => {
    navigator.clipboard.writeText(user.uid);
    setCopiedUid(true);
    showToast('UID copied to clipboard!');
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleToggle2Fa = () => {
    setTwoFaActive(prev => {
      const next = !prev;
      showToast(next ? 'Google Authenticator 2FA Enabled' : '2FA Temporarily Disabled');
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* 1. Profile Header Card (Inspired by User Screenshot 2) */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full rounded-full bg-[#080E1E] flex items-center justify-center text-2xl font-extrabold text-white">
                U
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">Investor Account</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified Tier 1
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{user.phone}</span>
                <span>&bull;</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {/* UID Box with Copy button */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
            <span className="text-xs text-slate-400 font-mono">UID: {user.uid}</span>
            <button
              onClick={handleCopyUid}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy UID"
            >
              {copiedUid ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Wallet Balances Row */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Available USDT</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block tabular-nums">
              {user.availableBalanceUSDT.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Staked Contracts</span>
            <span className="text-lg font-bold text-white mt-0.5 block tabular-nums">
              {user.frozenBalanceUSDT.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Total Claimed</span>
            <span className="text-lg font-bold text-emerald-300 mt-0.5 block tabular-nums">
              {user.totalClaimedUSDT.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Security Suite Settings */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Security & Authentication Center</span>
        </h2>

        <div className="space-y-3">
          {/* 2FA Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Google Authenticator (2FA)</span>
                <span className="text-[11px] text-slate-400">Protects withdrawals and contract authorizations</span>
              </div>
            </div>
            <button
              onClick={handleToggle2Fa}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                twoFaActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {twoFaActive ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Withdrawal PIN */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Withdrawal Security PIN</span>
                <span className="text-[11px] text-slate-400">6-digit PIN required for crypto dispatch</span>
              </div>
            </div>
            <button
              onClick={() => showToast('Withdrawal PIN is currently configured and active.')}
              className="text-xs text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Manage PIN
            </button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Account Password</span>
                <span className="text-[11px] text-slate-400">Last updated 12 days ago</span>
              </div>
            </div>
            <button
              onClick={() => showToast('Password change verification link sent to your email.')}
              className="text-xs text-slate-300 font-semibold hover:text-white cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* 3. Whitelisted Payout Wallets */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>Saved Payout Accounts</span>
        </h2>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">Default USDT (TRC20) Address</span>
            <span className="font-mono text-xs text-emerald-400 mt-1 block">
              TNVs9gK8JzXv2qR7mL5aB8eD1uF4yH9pW3
            </span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Whitelisted
          </span>
        </div>
      </div>

      {/* 4. Legal Compliance & Risk Warning */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Terms of Service & Staking Agreement</span>
        </div>
        <p className="leading-relaxed">
          Staking contract rates and 40-day distributions represent algorithmic yield targets. Never share your 2FA keys, seeds, or login credentials. All real transfers must be settled on genuine decentralized networks (TronGrid, BSC, Ethereum).
        </p>
      </div>
    </div>
  );
};
