import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CryptoSymbol,
  InvestmentPlan,
  UserActiveInvestment,
  CryptoTransaction,
  UserProfile,
  AdminAuditAction,
  SystemAnnouncement,
  ReferralProgramState,
  InvitedReferral,
  AdminUserRecord
} from '../types/crypto';
import { OFFICIAL_INVESTMENT_PLANS } from '../data/plans';
import { SUPPORTED_NETWORKS } from '../data/cryptoNetworks';

interface CryptoContextType {
  user: UserProfile;
  activeInvestments: UserActiveInvestment[];
  transactions: CryptoTransaction[];
  announcements: SystemAnnouncement[];
  adminActions: AdminAuditAction[];
  referralState: ReferralProgramState;
  customAddresses: Record<string, string>;
  allUsers: AdminUserRecord[];
  isAdminMode: boolean;
  selectedNav: string;
  systemNoticeOpen: boolean;
  bloggerModalOpen: boolean;
  installModalOpen: boolean;
  toastMessage: string | null;
  
  // Actions
  setSelectedNav: (nav: string) => void;
  toggleAdminMode: () => void;
  setSystemNoticeOpen: (open: boolean) => void;
  setBloggerModalOpen: (open: boolean) => void;
  setInstallModalOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
  
  // Custom Deposit Address Action
  updateCustomDepositAddress: (networkCode: string, newAddress: string) => void;

  // Referral Actions
  claimReferralCommission: () => boolean;
  simulateReferralInvite: () => void;

  // Investment Actions
  investInPlan: (plan: InvestmentPlan) => boolean;
  claimDailyYield: (investmentId: string) => boolean;
  fastForwardClaimTime: (investmentId: string) => void;
  
  // Deposit Actions
  submitDeposit: (crypto: CryptoSymbol, network: string, amount: number, txHash: string) => void;
  
  // Withdrawal Actions
  submitWithdrawal: (crypto: CryptoSymbol, network: string, address: string, amount: number, fee: number) => boolean;
  
  // Admin Actions
  approveDeposit: (txId: string) => void;
  rejectDeposit: (txId: string, reason?: string) => void;
  approveWithdrawal: (txId: string) => void;
  rejectWithdrawal: (txId: string, reason?: string) => void;
  addAnnouncement: (title: string, content: string, category: 'NOTICE' | 'UPDATE' | 'SECURITY') => void;
  toggleUserStatus: (uid: string) => void;
  adjustUserBalance: (uid: string, delta: number, reason: string) => void;
  adminAddUser: (phone: string, email: string, initialBalance: number) => void;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial user state matching screenshots
  const [user, setUser] = useState<UserProfile>({
    uid: 'U20261002YJYK',
    email: 'cryptobountyess@gmail.com',
    phone: '+880 0164010060',
    availableBalanceUSDT: 150.00,
    frozenBalanceUSDT: 50.00,
    totalDepositedUSDT: 200.00,
    totalInvestedUSDT: 50.00,
    totalClaimedUSDT: 9.00,
    totalWithdrawnUSDT: 0.00,
    registrationDate: '2026-10-02',
    twoFactorEnabled: true,
    withdrawalPinSet: true,
    savedWallets: [
      {
        symbol: 'USDT',
        network: 'TRC20',
        address: 'TNVs9gK8JzXv2qR7mL5aB8eD1uF4yH9pW3'
      }
    ]
  });

  // Default active investment contracts across users for admin supervision
  const [activeInvestments, setActiveInvestments] = useState<UserActiveInvestment[]>([
    {
      id: 'inv_init_gold_50',
      userUid: 'U20261002YJYK',
      userPhone: '+880 0164010060',
      planId: 'plan_gold',
      planName: 'Gold Plan',
      depositAmount: 50,
      totalPayout: 120,
      dailyClaimAmount: 3.00,
      durationDays: 40,
      daysClaimed: 3,
      totalClaimed: 9.00,
      startedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      lastClaimedAt: new Date(Date.now() - 86400000).toISOString(),
      nextClaimAvailableAt: new Date().toISOString(), // ready to claim now
      status: 'ACTIVE'
    },
    {
      id: 'inv_user_2_prem',
      userUid: 'U20261001AK89',
      userPhone: '+880 1712988892',
      planId: 'plan_premium',
      planName: 'Premium Plan',
      depositAmount: 100,
      totalPayout: 250,
      dailyClaimAmount: 6.30,
      durationDays: 40,
      daysClaimed: 5,
      totalClaimed: 31.50,
      startedAt: '2026-09-27 10:15:00',
      lastClaimedAt: '2026-10-02 08:30:00',
      nextClaimAvailableAt: '2026-10-03 08:30:00',
      status: 'ACTIVE'
    },
    {
      id: 'inv_user_3_gold',
      userUid: 'U20260930TR41',
      userPhone: '+880 1984551114',
      planId: 'plan_gold',
      planName: 'Gold Plan',
      depositAmount: 50,
      totalPayout: 120,
      dailyClaimAmount: 3.00,
      durationDays: 40,
      daysClaimed: 7,
      totalClaimed: 21.00,
      startedAt: '2026-09-25 14:00:00',
      lastClaimedAt: '2026-10-02 12:00:00',
      nextClaimAvailableAt: '2026-10-03 12:00:00',
      status: 'ACTIVE'
    },
    {
      id: 'inv_user_4_stan',
      userUid: 'U20260928SD15',
      userPhone: '+880 1629000501',
      planId: 'plan_standard',
      planName: 'Standard Plan',
      depositAmount: 15,
      totalPayout: 27,
      dailyClaimAmount: 0.67,
      durationDays: 40,
      daysClaimed: 4,
      totalClaimed: 2.68,
      startedAt: '2026-09-28 11:20:00',
      lastClaimedAt: '2026-10-02 09:10:00',
      nextClaimAvailableAt: '2026-10-03 09:10:00',
      status: 'ACTIVE'
    },
    {
      id: 'inv_user_5_silv',
      userUid: 'U20260925GL50',
      userPhone: '+880 1834111772',
      planId: 'plan_silver',
      planName: 'Silver Plan',
      depositAmount: 20,
      totalPayout: 36,
      dailyClaimAmount: 0.90,
      durationDays: 40,
      daysClaimed: 40,
      totalClaimed: 36.00,
      startedAt: '2026-08-20 16:00:00',
      lastClaimedAt: '2026-09-29 16:00:00',
      nextClaimAvailableAt: '2026-09-30 16:00:00',
      status: 'COMPLETED'
    }
  ]);

  const [transactions, setTransactions] = useState<CryptoTransaction[]>([
    {
      id: 'tx_init_reg_bonus',
      type: 'BONUS',
      crypto: 'USDT',
      network: 'SYSTEM',
      amount: 150.00,
      status: 'COMPLETED',
      createdAt: '2026-10-02 14:55:00',
      completedAt: '2026-10-02 14:55:00',
      note: 'Registration Welcome Staking Credit'
    },
    {
      id: 'tx_init_dep_50',
      type: 'DEPOSIT',
      crypto: 'USDT',
      network: 'TRC20',
      amount: 50.00,
      status: 'CONFIRMED',
      txHash: 'e6b4d4512f458129810bb7327823f99052a514d7a7ff258b38965f973347f9da',
      createdAt: '2026-10-02 14:58:12',
      completedAt: '2026-10-02 15:01:20',
      note: 'Binance Direct Transfer'
    },
    {
      id: 'tx_init_inv_50',
      type: 'INVESTMENT',
      crypto: 'USDT',
      network: 'SMART_CONTRACT',
      amount: 50.00,
      status: 'COMPLETED',
      createdAt: '2026-10-02 15:02:00',
      completedAt: '2026-10-02 15:02:00',
      note: '40-Day Gold Staking Contract Initiated'
    },
    {
      id: 'tx_init_claim_3',
      type: 'DAILY_CLAIM',
      crypto: 'USDT',
      network: 'INTERNAL',
      amount: 3.00,
      status: 'COMPLETED',
      createdAt: '2026-10-02 15:03:00',
      completedAt: '2026-10-02 15:03:00',
      note: 'Gold Plan Day 1 Claim'
    }
  ]);

  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>([
    {
      id: 'ann_welcome',
      title: 'X-AI & Nexus Protocol Integration Notice',
      content: 'Welcome to the Next-Gen Automated Yield Protocol. All staking terms are configured for 40-day cycles with daily yield distributions.',
      date: '2026-10-02',
      category: 'NOTICE',
      active: true
    },
    {
      id: 'ann_binance',
      title: 'Binance Pay & TRC20 Low Gas Deposits Active',
      content: 'Binance USDT deposits via TRC20 and BEP20 are processed automatically within 1 to 15 network confirmations.',
      date: '2026-10-02',
      category: 'UPDATE',
      active: true
    }
  ]);

  const [adminActions, setAdminActions] = useState<AdminAuditAction[]>([
    {
      id: 'act_init',
      adminEmail: 'security@nexus-crypto.org',
      action: 'SYSTEM_BOOT',
      targetId: 'NODE_CLUSTER_ASIA',
      details: 'Initialized smart contract payout pool and 6 official tiers.',
      timestamp: '2026-10-02 12:00:00'
    }
  ]);

  // Customizable Deposit Addresses (TRC20, BEP20, ERC20, etc.)
  const [customAddresses, setCustomAddresses] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('nexus_crypto_custom_addresses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      TRC20: 'TNVs9gK8JzXv2qR7mL5aB8eD1uF4yH9pW3',
      BEP20: '0x84D1f623e9F7C2a543B8d6291C7D5f25E2eC80A2',
      ERC20: '0x84D1f623e9F7C2a543B8d6291C7D5f25E2eC80A2',
      BSC: '0x84D1f623e9F7C2a543B8d6291C7D5f25E2eC80A2',
      TRON: 'TNVs9gK8JzXv2qR7mL5aB8eD1uF4yH9pW3',
      ETHEREUM: '0x84D1f623e9F7C2a543B8d6291C7D5f25E2eC80A2'
    };
  });

  // Referral Program State
  const [referralState, setReferralState] = useState<ReferralProgramState>({
    referralCode: 'U20261002YJYK',
    referralLink: 'https://nexus-crypto.org/join?ref=U20261002YJYK',
    tier1Rate: 10, // 10% on direct invited friends' deposits
    tier2Rate: 5,  // 5% secondary network
    tier3Rate: 2,  // 2% tier-3 network
    totalInvited: 18,
    activeStakers: 12,
    totalCommissionEarned: 85.50,
    pendingCommission: 24.50,
    affiliateRank: 'Silver Affiliate (Tier 2)',
    rankProgress: 68,
    nextRankThreshold: 25,
    invitedList: [
      {
        id: 'ref_1',
        identifier: '+880 171****892',
        tier: 1,
        planStaked: 'Gold Plan (50 USDT)',
        depositAmount: 50,
        commissionEarned: 5.00,
        joinedDate: '2026-10-01 16:20',
        status: 'ACTIVE'
      },
      {
        id: 'ref_2',
        identifier: '+880 198****114',
        tier: 1,
        planStaked: 'Premium Plan (100 USDT)',
        depositAmount: 100,
        commissionEarned: 10.00,
        joinedDate: '2026-09-30 11:45',
        status: 'ACTIVE'
      },
      {
        id: 'ref_3',
        identifier: '+880 162****501',
        tier: 2,
        planStaked: 'Standard Plan (15 USDT)',
        depositAmount: 15,
        commissionEarned: 0.75,
        joinedDate: '2026-09-28 20:10',
        status: 'ACTIVE'
      },
      {
        id: 'ref_4',
        identifier: 'crypto_trader_bd@gmail.com',
        tier: 1,
        planStaked: 'Gold Plan (50 USDT)',
        depositAmount: 50,
        commissionEarned: 5.00,
        joinedDate: '2026-09-26 14:02',
        status: 'ACTIVE'
      },
      {
        id: 'ref_5',
        identifier: '+880 183****772',
        tier: 3,
        planStaked: 'Basic Plan (10 USDT)',
        depositAmount: 10,
        commissionEarned: 0.20,
        joinedDate: '2026-09-24 09:30',
        status: 'ACTIVE'
      },
      {
        id: 'ref_6',
        identifier: '+880 155****330',
        tier: 1,
        planStaked: 'Silver Plan (20 USDT)',
        depositAmount: 20,
        commissionEarned: 2.00,
        joinedDate: '2026-09-22 18:15',
        status: 'ACTIVE'
      },
      {
        id: 'ref_7',
        identifier: 'investor_rakib@yahoo.com',
        tier: 1,
        planStaked: 'Starter Plan (5 USDT)',
        depositAmount: 5,
        commissionEarned: 0.50,
        joinedDate: '2026-09-20 22:50',
        status: 'REGISTERED'
      }
    ]
  });

  // Master Registered Users Directory for Admin Control
  const [allUsers, setAllUsers] = useState<AdminUserRecord[]>([
    {
      uid: 'U20261002YJYK',
      phone: '+880 0164010060',
      email: 'cryptobountyess@gmail.com',
      joinedDate: '2026-10-02 14:55',
      balanceUSDT: 150.00,
      totalDepositedUSDT: 200.00,
      totalInvestedUSDT: 50.00,
      totalWithdrawnUSDT: 0.00,
      activeContractsCount: 1,
      status: 'ACTIVE'
    },
    {
      uid: 'U20261001AK89',
      phone: '+880 1712988892',
      email: 'fahim_crypto@gmail.com',
      joinedDate: '2026-10-01 16:20',
      balanceUSDT: 45.00,
      totalDepositedUSDT: 100.00,
      totalInvestedUSDT: 100.00,
      totalWithdrawnUSDT: 30.00,
      activeContractsCount: 1,
      status: 'ACTIVE'
    },
    {
      uid: 'U20260930TR41',
      phone: '+880 1984551114',
      email: 'tariqul_trader@yahoo.com',
      joinedDate: '2026-09-30 11:45',
      balanceUSDT: 28.50,
      totalDepositedUSDT: 50.00,
      totalInvestedUSDT: 50.00,
      totalWithdrawnUSDT: 15.00,
      activeContractsCount: 1,
      status: 'ACTIVE'
    },
    {
      uid: 'U20260928SD15',
      phone: '+880 1629000501',
      email: 'shakil_invest@gmail.com',
      joinedDate: '2026-09-28 20:10',
      balanceUSDT: 12.00,
      totalDepositedUSDT: 15.00,
      totalInvestedUSDT: 15.00,
      totalWithdrawnUSDT: 0.00,
      activeContractsCount: 1,
      status: 'ACTIVE'
    },
    {
      uid: 'U20260925GL50',
      phone: '+880 1834111772',
      email: 'hasan_staking@outlook.com',
      joinedDate: '2026-09-25 09:30',
      balanceUSDT: 64.00,
      totalDepositedUSDT: 120.00,
      totalInvestedUSDT: 70.00,
      totalWithdrawnUSDT: 45.00,
      activeContractsCount: 2,
      status: 'ACTIVE'
    },
    {
      uid: 'U20260922SL20',
      phone: '+880 1551222330',
      email: 'mehedi_affiliate@gmail.com',
      joinedDate: '2026-09-22 18:15',
      balanceUSDT: 8.50,
      totalDepositedUSDT: 20.00,
      totalInvestedUSDT: 20.00,
      totalWithdrawnUSDT: 0.00,
      activeContractsCount: 1,
      status: 'ACTIVE'
    },
    {
      uid: 'U20260920RK05',
      phone: '+880 1798334411',
      email: 'investor_rakib@yahoo.com',
      joinedDate: '2026-09-20 22:50',
      balanceUSDT: 0.50,
      totalDepositedUSDT: 5.00,
      totalInvestedUSDT: 5.00,
      totalWithdrawnUSDT: 0.00,
      activeContractsCount: 0,
      status: 'ACTIVE'
    }
  ]);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedNav, setSelectedNav] = useState('home');
  const [systemNoticeOpen, setSystemNoticeOpen] = useState(true);
  const [bloggerModalOpen, setBloggerModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const toggleAdminMode = () => {
    setIsAdminMode(prev => {
      const next = !prev;
      showToast(next ? '👑 Admin Mode Activated' : 'Switched to Investor Dashboard');
      if (next) {
        setSelectedNav('admin');
      } else {
        setSelectedNav('home');
      }
      return next;
    });
  };

  // Invest in Plan
  const investInPlan = (plan: InvestmentPlan): boolean => {
    if (user.availableBalanceUSDT < plan.depositAmount) {
      showToast(`Insufficient balance (${user.availableBalanceUSDT.toFixed(2)} USDT). Please deposit ${plan.depositAmount} USDT.`);
      return false;
    }

    // Deduct balance
    setUser(prev => ({
      ...prev,
      availableBalanceUSDT: prev.availableBalanceUSDT - plan.depositAmount,
      frozenBalanceUSDT: prev.frozenBalanceUSDT + plan.depositAmount,
      totalInvestedUSDT: prev.totalInvestedUSDT + plan.depositAmount
    }));

    // Update user in allUsers list
    setAllUsers(prev =>
      prev.map(u =>
        u.uid === user.uid
          ? {
              ...u,
              balanceUSDT: +(u.balanceUSDT - plan.depositAmount).toFixed(2),
              totalInvestedUSDT: +(u.totalInvestedUSDT + plan.depositAmount).toFixed(2),
              activeContractsCount: u.activeContractsCount + 1
            }
          : u
      )
    );

    // Create active contract
    const newContract: UserActiveInvestment = {
      id: `inv_${Date.now()}`,
      userUid: user.uid,
      userPhone: user.phone,
      planId: plan.id,
      planName: plan.name,
      depositAmount: plan.depositAmount,
      totalPayout: plan.totalPayout,
      dailyClaimAmount: plan.dailyClaim,
      durationDays: plan.durationDays,
      daysClaimed: 0,
      totalClaimed: 0,
      startedAt: new Date().toISOString(),
      nextClaimAvailableAt: new Date().toISOString(), // First claim immediately available
      status: 'ACTIVE'
    };

    setActiveInvestments(prev => [newContract, ...prev]);

    // Record Transaction
    const newTx: CryptoTransaction = {
      id: `tx_inv_${Date.now()}`,
      type: 'INVESTMENT',
      crypto: 'USDT',
      network: 'SMART_CONTRACT',
      amount: plan.depositAmount,
      status: 'COMPLETED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Staked in ${plan.name} (40 Days, ${plan.dailyClaim} USDT/day)`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast(`Successfully invested in ${plan.name}! First daily yield is ready to claim.`);
    return true;
  };

  // Claim Daily Yield
  const claimDailyYield = (investmentId: string): boolean => {
    const inv = activeInvestments.find(i => i.id === investmentId);
    if (!inv) return false;

    if (inv.status !== 'ACTIVE') {
      showToast('This investment contract has matured or ended.');
      return false;
    }

    const now = new Date();
    const nextAllowed = new Date(inv.nextClaimAvailableAt);

    if (now < nextAllowed) {
      const diffMins = Math.ceil((nextAllowed.getTime() - now.getTime()) / (1000 * 60));
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      showToast(`Next claim available in ${hours}h ${mins}m. Duplicate claims prevented.`);
      return false;
    }

    if (inv.daysClaimed >= inv.durationDays || inv.totalClaimed >= inv.totalPayout) {
      showToast('Contract has reached maximum 40-day maturity and full payout limit!');
      return false;
    }

    const claimAmt = inv.dailyClaimAmount;
    const newDays = inv.daysClaimed + 1;
    const newTotalClaimed = +(inv.totalClaimed + claimAmt).toFixed(2);
    const isCompleted = newDays >= inv.durationDays || newTotalClaimed >= inv.totalPayout;

    // Next window 24h from now
    const nextClaimTime = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

    setActiveInvestments(prev =>
      prev.map(item =>
        item.id === investmentId
          ? {
              ...item,
              daysClaimed: newDays,
              totalClaimed: newTotalClaimed,
              lastClaimedAt: now.toISOString(),
              nextClaimAvailableAt: nextClaimTime,
              status: isCompleted ? 'COMPLETED' : 'ACTIVE'
            }
          : item
      )
    );

    // Credit user balance
    setUser(prev => ({
      ...prev,
      availableBalanceUSDT: +(prev.availableBalanceUSDT + claimAmt).toFixed(2),
      totalClaimedUSDT: +(prev.totalClaimedUSDT + claimAmt).toFixed(2)
    }));

    // Record Transaction
    const newTx: CryptoTransaction = {
      id: `tx_claim_${Date.now()}`,
      type: 'DAILY_CLAIM',
      crypto: 'USDT',
      network: 'INTERNAL',
      amount: claimAmt,
      status: 'COMPLETED',
      createdAt: now.toISOString().replace('T', ' ').substring(0, 19),
      completedAt: now.toISOString().replace('T', ' ').substring(0, 19),
      note: `Day ${newDays}/${inv.durationDays} yield claim for ${inv.planName}`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast(`Claimed +${claimAmt} USDT successfully! Credited to available balance.`);
    return true;
  };

  // Helper for demo testing: fast-forward claim timer to make claim ready immediately
  const fastForwardClaimTime = (investmentId: string) => {
    setActiveInvestments(prev =>
      prev.map(item =>
        item.id === investmentId
          ? {
              ...item,
              nextClaimAvailableAt: new Date(Date.now() - 1000).toISOString()
            }
          : item
      )
    );
    showToast('24-Hour claim timer unlocked! You can now test the Claim Now button.');
  };

  // Submit Deposit
  const submitDeposit = (crypto: CryptoSymbol, network: string, amount: number, txHash: string) => {
    const txId = `tx_dep_${Date.now()}`;
    const newTx: CryptoTransaction = {
      id: txId,
      type: 'DEPOSIT',
      crypto,
      network,
      amount,
      status: 'PENDING',
      txHash,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Binance / Web3 Transfer (${network})`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast(`Deposit submitted! TxID queued for verification.`);

    // Record Admin Audit
    const audit: AdminAuditAction = {
      id: `aud_${Date.now()}`,
      adminEmail: 'system_daemon',
      action: 'DEPOSIT_SUBMITTED',
      targetId: txId,
      details: `User submitted ${amount} ${crypto} on ${network}. TxHash: ${txHash.substring(0, 12)}...`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAdminActions(prev => [audit, ...prev]);
  };

  // Submit Withdrawal
  const submitWithdrawal = (
    crypto: CryptoSymbol,
    network: string,
    address: string,
    amount: number,
    fee: number
  ): boolean => {
    const totalDeduction = amount + fee;
    if (user.availableBalanceUSDT < totalDeduction) {
      showToast(`Insufficient balance! Needs ${totalDeduction.toFixed(2)} USDT (incl. ${fee} fee).`);
      return false;
    }

    // Deduct from balance
    setUser(prev => ({
      ...prev,
      availableBalanceUSDT: +(prev.availableBalanceUSDT - totalDeduction).toFixed(2),
      totalWithdrawnUSDT: +(prev.totalWithdrawnUSDT + amount).toFixed(2)
    }));

    const txId = `tx_wth_${Date.now()}`;
    const newTx: CryptoTransaction = {
      id: txId,
      type: 'WITHDRAW',
      crypto,
      network,
      amount,
      fee,
      destinationAddress: address,
      status: 'PROCESSING',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Withdrawal to ${address.substring(0, 8)}...`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast(`Withdrawal of ${amount} ${crypto} submitted. Status: Processing.`);
    return true;
  };

  // Admin Actions
  const approveDeposit = (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'PENDING') return;

    setTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? {
              ...t,
              status: 'CONFIRMED',
              completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
            }
          : t
      )
    );

    // Credit balance
    setUser(prev => ({
      ...prev,
      availableBalanceUSDT: +(prev.availableBalanceUSDT + tx.amount).toFixed(2),
      totalDepositedUSDT: +(prev.totalDepositedUSDT + tx.amount).toFixed(2)
    }));

    const audit: AdminAuditAction = {
      id: `aud_${Date.now()}`,
      adminEmail: 'admin@nexus-crypto.org',
      action: 'DEPOSIT_APPROVED',
      targetId: txId,
      details: `Approved ${tx.amount} ${tx.crypto} deposit for UID ${user.uid}.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAdminActions(prev => [audit, ...prev]);
    showToast(`Deposit ${txId} APPROVED! ${tx.amount} USDT credited to user.`);
  };

  const rejectDeposit = (txId: string, reason: string = 'Invalid TxHash / Unconfirmed') => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? {
              ...t,
              status: 'REJECTED',
              completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              note: `Rejected: ${reason}`
            }
          : t
      )
    );

    const audit: AdminAuditAction = {
      id: `aud_${Date.now()}`,
      adminEmail: 'admin@nexus-crypto.org',
      action: 'DEPOSIT_REJECTED',
      targetId: txId,
      details: `Rejected deposit. Reason: ${reason}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAdminActions(prev => [audit, ...prev]);
    showToast(`Deposit ${txId} rejected.`);
  };

  const approveWithdrawal = (txId: string) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? {
              ...t,
              status: 'COMPLETED',
              completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
            }
          : t
      )
    );

    const audit: AdminAuditAction = {
      id: `aud_${Date.now()}`,
      adminEmail: 'admin@nexus-crypto.org',
      action: 'WITHDRAWAL_APPROVED',
      targetId: txId,
      details: `Dispatched blockchain payout transaction.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAdminActions(prev => [audit, ...prev]);
    showToast(`Withdrawal ${txId} marked COMPLETED.`);
  };

  const rejectWithdrawal = (txId: string, reason: string = 'Security check failed') => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    // Refund user
    setUser(prev => ({
      ...prev,
      availableBalanceUSDT: +(prev.availableBalanceUSDT + tx.amount + (tx.fee || 0)).toFixed(2),
      totalWithdrawnUSDT: Math.max(0, +(prev.totalWithdrawnUSDT - tx.amount).toFixed(2))
    }));

    setTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? {
              ...t,
              status: 'REJECTED',
              completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              note: `Refunded: ${reason}`
            }
          : t
      )
    );

    const audit: AdminAuditAction = {
      id: `aud_${Date.now()}`,
      adminEmail: 'admin@nexus-crypto.org',
      action: 'WITHDRAWAL_REJECTED',
      targetId: txId,
      details: `Rejected withdrawal & refunded funds to user. Reason: ${reason}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAdminActions(prev => [audit, ...prev]);
    showToast(`Withdrawal rejected. Funds refunded to user.`);
  };

  const addAnnouncement = (title: string, content: string, category: 'NOTICE' | 'UPDATE' | 'SECURITY') => {
    const newAnn: SystemAnnouncement = {
      id: `ann_${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().substring(0, 10),
      category,
      active: true
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    showToast(`Announcement "${title}" published.`);
  };

  // Custom Deposit Address Updater (e.g. TRC20, BEP20, ERC20)
  const updateCustomDepositAddress = (networkCode: string, newAddress: string) => {
    const cleanAddr = newAddress.trim();
    if (!cleanAddr || cleanAddr.length < 16) {
      showToast('Please enter a valid crypto wallet address (at least 16 characters).');
      return;
    }

    setCustomAddresses(prev => {
      const updated = { ...prev, [networkCode]: cleanAddr };
      try {
        localStorage.setItem('nexus_crypto_custom_addresses', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    const audit: AdminAuditAction = {
      id: `aud_${Date.now()}`,
      adminEmail: 'user_wallet_admin',
      action: 'DEPOSIT_ADDRESS_UPDATED',
      targetId: networkCode,
      details: `Custom deposit address for ${networkCode} updated to ${cleanAddr.substring(0, 10)}...`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAdminActions(prev => [audit, ...prev]);
    showToast(`${networkCode} custom deposit address updated successfully!`);
  };

  // Claim Referral Commission
  const claimReferralCommission = (): boolean => {
    if (referralState.pendingCommission <= 0) {
      showToast('No pending commission available to claim right now.');
      return false;
    }

    const claimAmt = referralState.pendingCommission;

    // Credit to user liquid available balance
    setUser(prev => ({
      ...prev,
      availableBalanceUSDT: +(prev.availableBalanceUSDT + claimAmt).toFixed(2)
    }));

    // Update referral state
    setReferralState(prev => ({
      ...prev,
      totalCommissionEarned: +(prev.totalCommissionEarned + claimAmt).toFixed(2),
      pendingCommission: 0
    }));

    // Record Transaction
    const newTx: CryptoTransaction = {
      id: `tx_ref_${Date.now()}`,
      type: 'BONUS',
      crypto: 'USDT',
      network: 'AFFILIATE_PROGRAM',
      amount: claimAmt,
      status: 'COMPLETED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Affiliate Commission Harvested (+${claimAmt} USDT)`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast(`Claimed +${claimAmt.toFixed(2)} USDT affiliate commission! Credited to available balance.`);
    return true;
  };

  // Gamify Growth: Simulate a new friend invitation & commission
  const simulateReferralInvite = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newRef: InvitedReferral = {
      id: `ref_${Date.now()}`,
      identifier: `+880 179****${randomSuffix}`,
      tier: 1,
      planStaked: 'Standard Plan (15 USDT)',
      depositAmount: 15,
      commissionEarned: 1.50,
      joinedDate: 'Just now',
      status: 'ACTIVE'
    };

    setReferralState(prev => {
      const nextInvited = prev.totalInvited + 1;
      const nextActive = prev.activeStakers + 1;
      const nextPending = +(prev.pendingCommission + 1.50).toFixed(2);
      const nextProgress = Math.min(100, prev.rankProgress + 5);
      return {
        ...prev,
        totalInvited: nextInvited,
        activeStakers: nextActive,
        pendingCommission: nextPending,
        rankProgress: nextProgress,
        invitedList: [newRef, ...prev.invitedList]
      };
    });

    showToast(`🎉 New referral joined! +1.50 USDT commission added to pending balance!`);
  };

  // Admin User Moderation Actions
  const toggleUserStatus = (uid: string) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.uid === uid) {
          const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          showToast(`User ${uid} status changed to ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );

    const audit: AdminAuditAction = {
      id: `aud_${Date.now()}`,
      adminEmail: 'root_admin@nexus-crypto.org',
      action: 'USER_STATUS_TOGGLED',
      targetId: uid,
      details: `Admin modified active standing for user ${uid}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAdminActions(prev => [audit, ...prev]);
  };

  const adjustUserBalance = (uid: string, delta: number, reason: string) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.uid === uid) {
          const newBal = Math.max(0, +(u.balanceUSDT + delta).toFixed(2));
          return { ...u, balanceUSDT: newBal };
        }
        return u;
      })
    );

    if (uid === user.uid) {
      setUser(prev => ({
        ...prev,
        availableBalanceUSDT: Math.max(0, +(prev.availableBalanceUSDT + delta).toFixed(2))
      }));
    }

    const audit: AdminAuditAction = {
      id: `aud_${Date.now()}`,
      adminEmail: 'root_admin@nexus-crypto.org',
      action: 'BALANCE_MANUALLY_ADJUSTED',
      targetId: uid,
      details: `Admin adjusted balance by ${delta > 0 ? '+' : ''}${delta} USDT. Reason: ${reason}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAdminActions(prev => [audit, ...prev]);
    showToast(`Balance for ${uid} adjusted (${delta > 0 ? '+' : ''}${delta} USDT).`);
  };

  const adminAddUser = (phone: string, email: string, initialBalance: number = 0) => {
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    if (!cleanPhone && !cleanEmail) {
      showToast('Please provide a phone number or email for the new user.');
      return;
    }

    const newUid = `U${new Date().toISOString().substring(0, 10).replace(/-/g, '')}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newUserRecord: AdminUserRecord = {
      uid: newUid,
      phone: cleanPhone || '—',
      email: cleanEmail || `${newUid.toLowerCase()}@nexus-member.com`,
      joinedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      balanceUSDT: Math.max(0, initialBalance),
      totalDepositedUSDT: Math.max(0, initialBalance),
      totalInvestedUSDT: 0,
      totalWithdrawnUSDT: 0,
      activeContractsCount: 0,
      status: 'ACTIVE'
    };

    setAllUsers(prev => [newUserRecord, ...prev]);

    const audit: AdminAuditAction = {
      id: `aud_${Date.now()}`,
      adminEmail: 'root_admin@nexus-crypto.org',
      action: 'USER_REGISTERED_BY_ADMIN',
      targetId: newUid,
      details: `Created new investor profile (${cleanPhone || cleanEmail}) with initial ${initialBalance} USDT.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAdminActions(prev => [audit, ...prev]);
    showToast(`New user profile (${newUid}) successfully created!`);
  };

  return (
    <CryptoContext.Provider
      value={{
        user,
        activeInvestments,
        transactions,
        announcements,
        adminActions,
        referralState,
        customAddresses,
        allUsers,
        isAdminMode,
        selectedNav,
        systemNoticeOpen,
        bloggerModalOpen,
        installModalOpen,
        toastMessage,
        setSelectedNav,
        toggleAdminMode,
        setSystemNoticeOpen,
        setBloggerModalOpen,
        setInstallModalOpen,
        showToast,
        updateCustomDepositAddress,
        claimReferralCommission,
        simulateReferralInvite,
        toggleUserStatus,
        adjustUserBalance,
        adminAddUser,
        investInPlan,
        claimDailyYield,
        fastForwardClaimTime,
        submitDeposit,
        submitWithdrawal,
        approveDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
        addAnnouncement
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) throw new Error('useCrypto must be used within CryptoProvider');
  return context;
};
