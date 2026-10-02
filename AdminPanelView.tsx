import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { OFFICIAL_INVESTMENT_PLANS } from '../data/plans';
import { SUPPORTED_NETWORKS } from '../data/cryptoNetworks';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Radio,
  Bell,
  Activity,
  Server,
  Lock,
  ArrowRight,
  Users,
  Search,
  UserPlus,
  TrendingUp,
  Clock,
  Briefcase,
  Zap,
  Edit3,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Filter,
  Check,
  Copy
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const {
    transactions,
    adminActions,
    announcements,
    customAddresses,
    allUsers,
    activeInvestments,
    updateCustomDepositAddress,
    toggleUserStatus,
    adjustUserBalance,
    adminAddUser,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    addAnnouncement,
    showToast
  } = useCrypto();

  const [activeTab, setActiveTab] = useState<
    'users' | 'investments' | 'deposits' | 'withdrawals' | 'networks' | 'plans' | 'announcements' | 'audit' | 'security'
  >('users');

  // Search queries
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [investmentSearchQuery, setInvestmentSearchQuery] = useState('');
  const [investmentFilter, setInvestmentFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  // Adjust balance modal state
  const [adjustModalUser, setAdjustModalUser] = useState<string | null>(null);
  const [adjustAmountInput, setAdjustAmountInput] = useState<string>('10');
  const [adjustReasonInput, setAdjustReasonInput] = useState<string>('Promotional bonus reward');
  const [adjustType, setAdjustType] = useState<'ADD' | 'DEDUCT'>('ADD');

  // Add User modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserPhone, setNewUserPhone] = useState('+880 ');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserInitialBalance, setNewUserInitialBalance] = useState('0');

  // Network address edit state
  const [editingNetworkCode, setEditingNetworkCode] = useState<string | null>(null);
  const [editingAddressVal, setEditingAddressVal] = useState<string>('');

  // Announcement form state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<'NOTICE' | 'UPDATE' | 'SECURITY'>('NOTICE');

  // Filters
  const pendingDeposits = transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'PENDING');
  const completedDeposits = transactions.filter(t => t.type === 'DEPOSIT' && t.status !== 'PENDING');
  const pendingWithdrawals = transactions.filter(t => t.type === 'WITHDRAW' && (t.status === 'PROCESSING' || t.status === 'PENDING'));
  const completedWithdrawals = transactions.filter(t => t.type === 'WITHDRAW' && t.status !== 'PROCESSING' && t.status !== 'PENDING');

  const filteredUsers = allUsers.filter(u => {
    if (!userSearchQuery) return true;
    const q = userSearchQuery.toLowerCase();
    return u.uid.toLowerCase().includes(q) || u.phone.includes(q) || u.email.toLowerCase().includes(q);
  });

  const filteredInvestments = activeInvestments.filter(inv => {
    const matchesFilter =
      investmentFilter === 'ALL' ||
      (investmentFilter === 'ACTIVE' && inv.status === 'ACTIVE') ||
      (investmentFilter === 'COMPLETED' && inv.status === 'COMPLETED');

    if (!matchesFilter) return false;
    if (!investmentSearchQuery) return true;

    const q = investmentSearchQuery.toLowerCase();
    return (
      inv.planName.toLowerCase().includes(q) ||
      (inv.userPhone && inv.userPhone.includes(q)) ||
      (inv.userUid && inv.userUid.toLowerCase().includes(q)) ||
      inv.id.toLowerCase().includes(q)
    );
  });

  const totalPlatformInvested = allUsers.reduce((s, u) => s + (u.totalInvestedUSDT || 0), 0);
  const totalPlatformWithdrawn = allUsers.reduce((s, u) => s + (u.totalWithdrawnUSDT || 0), 0);
  const activeContractsCount = activeInvestments.filter(i => i.status === 'ACTIVE').length;

  // Handlers
  const handleExecuteAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalUser) return;
    const num = Math.abs(parseFloat(adjustAmountInput));
    if (isNaN(num) || num === 0) {
      showToast('Please enter a valid amount');
      return;
    }
    const delta = adjustType === 'ADD' ? num : -num;
    adjustUserBalance(adjustModalUser, delta, adjustReasonInput);
    setAdjustModalUser(null);
    setAdjustAmountInput('10');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFloat(newUserInitialBalance) || 0;
    adminAddUser(newUserPhone, newUserEmail, bal);
    setShowAddUserModal(false);
    setNewUserPhone('+880 ');
    setNewUserEmail('');
    setNewUserInitialBalance('0');
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    addAnnouncement(annTitle, annContent, annCategory);
    setAnnTitle('');
    setAnnContent('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header & Platform Statistics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Admin Command & Protocol Dashboard
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Owner / Root Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supervise user onboarding, active 40-day staking contracts, verify incoming deposits, and dispatch withdrawals.
          </p>
        </div>

        {/* Action Counters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            {allUsers.length} Registered Users
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            {pendingDeposits.length} Deposits Pending
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            {pendingWithdrawals.length} Withdrawal Requests
          </div>
        </div>
      </div>

      {/* Control Highlights Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Registered Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white tabular-nums">{allUsers.length}</div>
          <span className="text-[10px] text-emerald-400">Active protocol accounts</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Total Platform Staked</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300 tabular-nums">
            {totalPlatformInvested.toFixed(2)} <span className="text-xs text-slate-400">USDT</span>
          </div>
          <span className="text-[10px] text-slate-400">{activeContractsCount} active contracts</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Pending Deposits</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 tabular-nums">{pendingDeposits.length}</div>
          <span className="text-[10px] text-slate-400">Awaiting operator sign-off</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Total Dispatched Payouts</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-blue-400 tabular-nums">
            {totalPlatformWithdrawn.toFixed(2)} <span className="text-xs text-slate-400">USDT</span>
          </div>
          <span className="text-[10px] text-slate-400">Completed withdrawals</span>
        </div>
      </div>

      {/* Admin Operations Guide Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0F172A] to-[#0F172A] border border-amber-500/30 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <span>👑 Admin Control & Operations Guide</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
          <div className="space-y-1">
            <p>• <strong>Users Directory:</strong> View all registered member profiles, phone numbers, and balances. Credit or debit balances manually and manage account access.</p>
            <p>• <strong>All Investments:</strong> Real-time tracking of all 40-day staking plans (Starter, Bronze, Silver, Gold, Platinum, VIP) with daily claim rates and days elapsed.</p>
          </div>
          <div className="space-y-1">
            <p>• <strong>Pending Deposits:</strong> Review investor submitted blockchain TxIDs and click "Approve & Credit" in 1-click to instantly fund their balance.</p>
            <p>• <strong>Withdrawal Requests:</strong> Inspect destination wallet addresses and click "Sign & Dispatch" to execute payouts.</p>
            <p>• <strong>Deposit Addresses:</strong> Set your personal Binance or Trust Wallet TRC20/BEP20 addresses in the "Deposit Addresses" tab.</p>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        {[
          { id: 'users', label: `Users Directory (${allUsers.length})` },
          { id: 'investments', label: `All Investments (${activeInvestments.length})` },
          { id: 'deposits', label: `Pending Deposits (${pendingDeposits.length})` },
          { id: 'withdrawals', label: `Withdrawal Requests (${pendingWithdrawals.length})` },
          { id: 'networks', label: 'Deposit Addresses' },
          { id: 'plans', label: 'Investment Plans' },
          { id: 'announcements', label: 'Announcements' },
          { id: 'audit', label: 'Audit Log' },
          { id: 'security', label: 'Security Specs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. USERS DIRECTORY TAB */}
      {/* ============================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Registered Users Directory</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                  {filteredUsers.length} Users
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Directory of registered member profiles, wallet balances, and active staking contracts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  placeholder="Search by phone or UID..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs w-48 sm:w-64 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Add User Button */}
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0F172A]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User / UID</th>
                  <th className="py-3 px-4">Phone & Email</th>
                  <th className="py-3 px-4">Balance (USDT)</th>
                  <th className="py-3 px-4">Total Deposited</th>
                  <th className="py-3 px-4">Active Contracts</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.uid} className="hover:bg-slate-800/40 transition-colors">
                      {/* User UID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[11px] text-amber-400">
                            {u.phone.slice(-2) || 'U'}
                          </div>
                          <div>
                            <span className="font-mono text-white font-bold block">{u.uid}</span>
                            <span className="text-[10px] text-slate-400">{u.joinedDate}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-emerald-400 block font-mono">{u.phone}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[160px] block">{u.email}</span>
                      </td>

                      {/* Balances */}
                      <td className="py-3 px-4 font-bold text-white tabular-nums">
                        {u.balanceUSDT.toFixed(2)} USDT
                      </td>

                      {/* Total Deposited */}
                      <td className="py-3 px-4 text-emerald-400 tabular-nums font-semibold">
                        +{u.totalDepositedUSDT.toFixed(2)} USDT
                      </td>

                      {/* Active Investments */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            {u.activeContractsCount} Contracts
                          </span>
                          <span className="text-slate-400 tabular-nums">
                            ({u.totalInvestedUSDT} USDT)
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Adjust Balance Button */}
                          <button
                            onClick={() => {
                              setAdjustModalUser(u.uid);
                              setAdjustAmountInput('10');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer transition-colors"
                            title="Credit or debit balance from this user account"
                          >
                            💰 Balance
                          </button>

                          {/* Suspend / Unsuspend */}
                          <button
                            onClick={() => toggleUserStatus(u.uid)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ALL INVESTMENTS TAB */}
      {/* ============================================================== */}
      {activeTab === 'investments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>All 40-Day Staking Contracts</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                  {filteredInvestments.length} Contracts
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Real-time tracking of active capital commitments, duration progress, and daily yield claims.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setInvestmentFilter(f)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] ${
                      investmentFilter === f
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f === 'ALL' ? 'All' : f === 'ACTIVE' ? 'Active' : 'Completed'}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={investmentSearchQuery}
                  onChange={e => setInvestmentSearchQuery(e.target.value)}
                  placeholder="Search by phone or plan name..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs w-48 sm:w-56 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Investments Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0F172A]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Investor (User)</th>
                  <th className="py-3 px-4">Plan & Duration</th>
                  <th className="py-3 px-4">Principal Staked</th>
                  <th className="py-3 px-4">Daily Yield Rate</th>
                  <th className="py-3 px-4">Progress (40 Days)</th>
                  <th className="py-3 px-4">Claimed / Max Payout</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No staking contracts found.
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map(inv => {
                    const progressPct = Math.min(100, Math.round((inv.daysClaimed / inv.durationDays) * 100));
                    return (
                      <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Investor */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-emerald-400 block font-mono">
                            {inv.userPhone || '+880 0164010060'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            UID: {inv.userUid || 'U20261002YJYK'}
                          </span>
                        </td>

                        {/* Plan */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{inv.planName}</span>
                          <span className="text-[10px] text-slate-400">Duration: {inv.durationDays} Days</span>
                        </td>

                        {/* Deposit Amount */}
                        <td className="py-3 px-4 font-bold text-white tabular-nums">
                          {inv.depositAmount} USDT
                        </td>

                        {/* Daily Rate */}
                        <td className="py-3 px-4 font-bold text-emerald-400 tabular-nums">
                          +{inv.dailyClaimAmount} USDT / day
                        </td>

                        {/* Progress Bar (40 Days) */}
                        <td className="py-3 px-4">
                          <div className="space-y-1 min-w-[130px]">
                            <div className="flex justify-between text-[10px] text-slate-300">
                              <span>Day: {inv.daysClaimed}/{inv.durationDays}</span>
                              <span className="font-semibold text-emerald-400">{progressPct}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Payout Totals */}
                        <td className="py-3 px-4 tabular-nums">
                          <span className="font-bold text-emerald-300">{inv.totalClaimed.toFixed(2)}</span>
                          <span className="text-slate-500 text-[10px] mx-1">/</span>
                          <span className="text-slate-400 font-semibold">{inv.totalPayout} USDT</span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                              inv.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {inv.status === 'ACTIVE' ? '🟢 Active' : '🔵 Completed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. PENDING DEPOSITS TAB */}
      {/* ============================================================== */}
      {activeTab === 'deposits' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white">Deposit Verification Queue</h2>
              <p className="text-xs text-slate-400">
                Audit user-submitted blockchain TxIDs and credit their wallet balance in 1-click.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              {pendingDeposits.length} Pending
            </span>
          </div>

          {pendingDeposits.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0F172A] border border-slate-800 text-xs text-slate-400">
              ✅ All deposits have been verified and credited. No pending transactions.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0F172A]">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">TxID / Timestamp</th>
                    <th className="py-3 px-4">Asset & Network</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">TxHash (Explorer)</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pendingDeposits.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <span className="font-mono text-amber-400 font-bold block">{tx.id}</span>
                        <span className="text-[10px] text-slate-400">{tx.createdAt}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {tx.crypto} <span className="text-slate-400 font-normal">({tx.network})</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400 text-sm tabular-nums">
                        +{tx.amount.toFixed(2)} {tx.crypto}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 max-w-[200px] truncate select-all">
                        {tx.txHash || '—'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approveDeposit(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Credit</span>
                          </button>
                          <button
                            onClick={() => rejectDeposit(tx.id, 'Unconfirmed TxID on blockchain')}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Past Verified Deposits */}
          {completedDeposits.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Verified & Completed Deposit History
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0F172A]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-4">TxID</th>
                      <th className="py-2 px-4">Asset</th>
                      <th className="py-2 px-4">Amount</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {completedDeposits.map(t => (
                      <tr key={t.id}>
                        <td className="py-2 px-4 font-mono text-slate-400">{t.id}</td>
                        <td className="py-2 px-4">{t.crypto} ({t.network})</td>
                        <td className="py-2 px-4 font-bold text-emerald-400">+{t.amount} {t.crypto}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right text-slate-400 font-mono text-[10px]">
                          {t.completedAt || t.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. WITHDRAWAL REQUESTS TAB */}
      {/* ============================================================== */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white">Pending Withdrawal Requests</h2>
              <p className="text-xs text-slate-400">
                Dispatch payouts to user destination addresses and sign transactions.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold">
              {pendingWithdrawals.length} Pending
            </span>
          </div>

          {pendingWithdrawals.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0F172A] border border-slate-800 text-xs text-slate-400">
              ✅ All withdrawal requests have been processed. Queue is clear.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0F172A]">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">TxID</th>
                    <th className="py-3 px-4">Destination Wallet Address</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Fee</th>
                    <th className="py-3 px-4 text-right">Dispatch Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pendingWithdrawals.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <span className="font-mono text-blue-400 font-bold block">{tx.id}</span>
                        <span className="text-[10px] text-slate-400">{tx.createdAt}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 max-w-[200px] truncate select-all">
                        {tx.destinationAddress || '—'}
                      </td>
                      <td className="py-3 px-4 font-bold text-white text-sm tabular-nums">
                        {tx.amount.toFixed(2)} {tx.crypto}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono tabular-nums">
                        {tx.fee ? `${tx.fee} ${tx.crypto}` : '0.00'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approveWithdrawal(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Sign & Dispatch</span>
                          </button>
                          <button
                            onClick={() => rejectWithdrawal(tx.id, 'Destination flagged or invalid')}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject & Refund</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Completed Withdrawals */}
          {completedWithdrawals.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Completed Payouts & Dispatches
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0F172A]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-4">TxID</th>
                      <th className="py-2 px-4">Asset</th>
                      <th className="py-2 px-4">Amount</th>
                      <th className="py-2 px-4">Destination Address</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {completedWithdrawals.map(t => (
                      <tr key={t.id}>
                        <td className="py-2 px-4 font-mono text-slate-400">{t.id}</td>
                        <td className="py-2 px-4">{t.crypto} ({t.network})</td>
                        <td className="py-2 px-4 font-bold text-white">{t.amount} {t.crypto}</td>
                        <td className="py-2 px-4 font-mono text-slate-400 truncate max-w-[150px]">{t.destinationAddress}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right text-slate-400 font-mono text-[10px]">
                          {t.completedAt || t.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. DEPOSIT ADDRESSES & NETWORKS TAB */}
      {/* ============================================================== */}
      {activeTab === 'networks' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0F172A] to-[#0F172A] border border-emerald-500/30 space-y-2">
            <h2 className="text-base font-bold text-emerald-300 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-emerald-400" />
              <span>Configure Personal Receiving Addresses</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your personal Binance, Trust Wallet, or exchange <strong>USDT (TRC20)</strong>, <strong>USDT (BEP20)</strong>, and crypto receiving addresses below. Once saved, all users visiting the Deposit page will immediately see your receiving address and QR code!
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0F172A]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">Network</th>
                  <th className="py-3 px-4">Active Receiving Address</th>
                  <th className="py-3 px-4">Min Deposit</th>
                  <th className="py-3 px-4">Withdrawal Fee</th>
                  <th className="py-3 px-4 text-right">Modify Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {SUPPORTED_NETWORKS.map(net => {
                  const currentAddr = customAddresses[net.networkCode] || net.depositAddress;
                  const isEditing = editingNetworkCode === net.networkCode;

                  return (
                    <tr key={net.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white">{net.crypto}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{net.network}</td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 min-w-[280px]">
                            <input
                              type="text"
                              value={editingAddressVal}
                              onChange={e => setEditingAddressVal(e.target.value)}
                              className="px-2 py-1 bg-slate-950 border border-emerald-500 rounded font-mono text-[11px] text-emerald-400 w-full focus:outline-none"
                              placeholder="Paste your receiving wallet address"
                            />
                            <button
                              onClick={() => {
                                updateCustomDepositAddress(net.networkCode, editingAddressVal);
                                setEditingNetworkCode(null);
                              }}
                              className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded text-[11px] cursor-pointer whitespace-nowrap"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNetworkCode(null)}
                              className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-emerald-400 max-w-[240px] truncate block select-all">
                              {currentAddr}
                            </span>
                            {customAddresses[net.networkCode] && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Custom
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 tabular-nums text-slate-300">{net.minDeposit} {net.crypto}</td>
                      <td className="py-3 px-4 font-bold text-amber-400 tabular-nums">{net.withdrawalFee} {net.crypto}</td>
                      <td className="py-3 px-4 text-right">
                        {!isEditing && (
                          <button
                            onClick={() => {
                              setEditingNetworkCode(net.networkCode);
                              setEditingAddressVal(currentAddr);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors cursor-pointer"
                          >
                            Edit Address
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. INVESTMENT PLANS TAB */}
      {/* ============================================================== */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Active 40-Day Investment Plan Parameters</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0F172A]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4">Required Deposit</th>
                  <th className="py-3 px-4">Daily Claim Rate</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Total Payout</th>
                  <th className="py-3 px-4">Net Difference</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {OFFICIAL_INVESTMENT_PLANS.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">{p.name}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400 tabular-nums">{p.depositAmount} USDT</td>
                    <td className="py-3 px-4 text-emerald-300 font-bold tabular-nums">+{p.dailyClaim} USDT / day</td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{p.durationDays} Days</td>
                    <td className="py-3 px-4 font-bold text-white tabular-nums">{p.totalPayout} USDT</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold tabular-nums">+{p.totalDifference} USDT</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. ANNOUNCEMENTS TAB */}
      {/* ============================================================== */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-base font-bold text-white">Broadcast Protocol Notice or Announcement</h2>
            <form onSubmit={handlePostAnnouncement} className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={annCategory}
                  onChange={e => setAnnCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="NOTICE">System Notice</option>
                  <option value="UPDATE">Protocol Update</option>
                  <option value="SECURITY">Security Advisory</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notice Title</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  placeholder="e.g. TRC20 Fast Deposit Verification Active"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Announcement Details</label>
                <textarea
                  rows={3}
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  placeholder="Details for platform members and investors..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Broadcast Announcement
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-base font-bold text-white">Active Announcements</h2>
            <div className="space-y-3">
              {announcements.map(ann => (
                <div key={ann.id} className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ann.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. ACTION AUDIT LOG TAB */}
      {/* ============================================================== */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Immutable Administrative Action Logs</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0F172A]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Ref</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {adminActions.map(act => (
                  <tr key={act.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{act.timestamp}</td>
                    <td className="py-3 px-4 text-amber-300 font-semibold">{act.adminEmail}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{act.action}</td>
                    <td className="py-3 px-4 text-slate-300">{act.targetId}</td>
                    <td className="py-3 px-4 text-slate-400 font-sans">{act.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. SECURITY & BACKEND SPEC TAB */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>Production Security Constitution & Verification Rules</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In strict compliance with financial security standards, frontend code must never store private keys, master seed phrases, or database administrator credentials.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">1. Server-Side Transaction Signing</span>
                <p className="text-slate-400 leading-relaxed">
                  Withdrawals are initiated through a backend microservice using Hardware Security Modules (HSM) or GCP Cloud KMS. Private keys are never exposed in browser JavaScript.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">2. Blockchain Explorer Webhooks</span>
                <p className="text-slate-400 leading-relaxed">
                  Deposits are verified using TronGrid / BscScan / Etherscan websocket webhooks that poll block confirmations directly on-chain before crediting balances.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">3. 24-Hour Rate Limiting & Anti-Duplicate Claims</span>
                <p className="text-slate-400 leading-relaxed">
                  Daily claim timers are verified with server-authoritative timestamps in PostgreSQL to prevent clock tampering or double-spending.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">4. Multi-Signature Cold Storage</span>
                <p className="text-slate-400 leading-relaxed">
                  95% of deposited crypto assets reside in 3-of-5 multisig cold wallets. Only daily payout buffers are maintained in warm hot-wallets.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADJUST BALANCE MODAL */}
      {/* ============================================================== */}
      {adjustModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Adjust User Balance</span>
              </h3>
              <button
                onClick={() => setAdjustModalUser(null)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteAdjustBalance} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400">Target User UID:</span>
                <span className="font-mono text-amber-400 font-bold block">{adjustModalUser}</span>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Action Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('ADD')}
                    className={`py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                      adjustType === 'ADD'
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    + Credit Balance
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('DEDUCT')}
                    className={`py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                      adjustType === 'DEDUCT'
                        ? 'bg-red-500 text-white shadow'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    - Debit Balance
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Amount (USDT)</label>
                <input
                  type="number"
                  step="any"
                  value={adjustAmountInput}
                  onChange={e => setAdjustAmountInput(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none tabular-nums font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Reason / Operator Note</label>
                <input
                  type="text"
                  value={adjustReasonInput}
                  onChange={e => setAdjustReasonInput(e.target.value)}
                  placeholder="e.g. Promotional bonus or manual cash deposit adjustment"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer shadow-md"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD USER MODAL */}
      {/* ============================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Register New User Profile</span>
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newUserPhone}
                  onChange={e => setNewUserPhone(e.target.value)}
                  placeholder="+880 1712345678"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="member@nexus-crypto.org"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Initial Starting Balance (USDT)</label>
                <input
                  type="number"
                  step="any"
                  value={newUserInitialBalance}
                  onChange={e => setNewUserInitialBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none tabular-nums font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer shadow-md"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
