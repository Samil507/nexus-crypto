import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { generateSvgQrPath } from '../utils/qr';
import {
  Users,
  Copy,
  Check,
  Share2,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  Gift,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Send,
  Sparkles
} from 'lucide-react';

export const ReferralView: React.FC = () => {
  const { referralState, claimReferralCommission, simulateReferralInvite, showToast } = useCrypto();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralState.referralLink);
    setCopiedLink(true);
    showToast('Referral link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralState.referralCode);
    setCopiedCode(true);
    showToast('Referral code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join NexusCrypto automated 40-day staking protocol with my referral code ${referralState.referralCode} and get 150 USDT welcome credit: ${referralState.referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `Join NexusCrypto automated 40-day staking protocol with my referral code ${referralState.referralCode} and claim daily yields: ${referralState.referralLink}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralState.referralLink)}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Referral & Affiliate Program</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Invite friends to stake in 40-day yield plans and earn up to 10% multi-tier commissions in USDT.
          </p>
        </div>

        {/* Gamify Test Trigger */}
        <button
          onClick={simulateReferralInvite}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          title="Simulate a new friend joining and staking to see commission credit"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulate Invite (+1.50 USDT)</span>
        </button>
      </div>

      {/* 1. Main Referral Link & QR Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F1B38] via-[#0D1830] to-[#0A1224] border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Partner Link
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs text-slate-300 font-mono">Code: {referralState.referralCode}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Share Your Link & Earn Passive Yields
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Earn <strong className="text-emerald-400">10% Tier-1</strong> on direct invites, <strong className="text-emerald-400">5% Tier-2</strong>, and <strong className="text-emerald-400">2% Tier-3</strong> commissions automatically whenever your network stakes in 40-day contracts.
            </p>

            {/* Link Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <div className="flex-1 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-emerald-400 truncate select-all">
                {referralState.referralLink}
              </div>
              <button
                onClick={handleCopyLink}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handleCopyCode}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Code</span>
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <span className="text-[11px] text-slate-400">Quick Share:</span>
              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleShareTelegram}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>
            </div>
          </div>

          {/* Right: QR Code for in-person scans */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center">
            <div className="bg-white p-2.5 rounded-xl shadow-md mb-2">
              <svg width="130" height="130" viewBox="0 0 200 200" className="w-28 h-28">
                <path d={generateSvgQrPath(referralState.referralLink, 200)} fill="#080E1E" />
              </svg>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Scan to Register with UID</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{referralState.referralCode}</span>
          </div>
        </div>
      </div>

      {/* 2. Gamified Referral Metrics & Claim Reward Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Invited */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Network Size</span>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {referralState.totalInvited}{' '}
            <span className="text-xs text-slate-400 font-normal">Friends</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">
            {referralState.activeStakers} Active Stakers
          </span>
        </div>

        {/* Metric 2: Total Commission Harvested */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Commission Paid</span>
          <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
            {referralState.totalCommissionEarned.toFixed(2)}{' '}
            <span className="text-xs text-emerald-500 font-normal">USDT</span>
          </div>
          <span className="text-[11px] text-slate-400">Credited to wallet</span>
        </div>

        {/* Metric 3: Pending Commission (Claimable) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#15233E] border border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">Claimable Rewards</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 tabular-nums">
            {referralState.pendingCommission.toFixed(2)}{' '}
            <span className="text-xs text-amber-400/80 font-normal">USDT</span>
          </div>
          <button
            onClick={claimReferralCommission}
            disabled={referralState.pendingCommission <= 0}
            className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-400/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Claim Commission</span>
          </button>
        </div>

        {/* Metric 4: Affiliate Rank & Level Progression */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Affiliate Tier Rank</span>
            <Award className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white truncate">
            {referralState.affiliateRank}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Next: Gold Ambassador</span>
              <span>{referralState.rankProgress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${referralState.rankProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Multi-Tier Commission Scheme Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white">3-Tier Commission Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0E172A] border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Tier 1: Direct Invites</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                10% Rebate
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn an instant 10% USDT commission whenever friends who register with your referral link deposit and stake.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0E172A] border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Tier 2: Sub-Network</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                5% Rebate
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive 5% passive yields whenever your direct referrals invite their friends to start staking contracts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0E172A] border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Tier 3: Extended Circle</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                2% Rebate
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Continuous 2% community rewards on 3rd-generation stakers to incentivize viral platform expansion.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Invited Referrals Audit Table */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-white">Invited Network Members</h2>
          <span className="text-xs text-slate-400">
            {referralState.invitedList.length} Network records tracked
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0F172A]">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Tier Level</th>
                <th className="py-3 px-4">Staked Plan</th>
                <th className="py-3 px-4">Staked Amount</th>
                <th className="py-3 px-4">Commission Earned</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {referralState.invitedList.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-semibold text-white">
                    {item.identifier}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.tier === 1
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.tier === 2
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      Tier {item.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300">{item.planStaked}</td>
                  <td className="py-3 px-4 font-bold text-white tabular-nums">
                    {item.depositAmount} USDT
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400 tabular-nums">
                    +{item.commissionEarned.toFixed(2)} USDT
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {item.joinedDate}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
