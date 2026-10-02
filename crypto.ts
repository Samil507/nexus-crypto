export type CryptoSymbol = 'USDT' | 'BNB' | 'TRX' | 'ETH';
export type UsdtNetwork = 'TRC20' | 'BEP20' | 'ERC20';

export interface CryptoNetworkInfo {
  symbol: CryptoSymbol;
  name: string;
  networkName: string;
  depositAddress: string;
  minDeposit: number;
  minWithdraw: number;
  withdrawalFee: number;
  confirmationsNeeded: number;
  iconColor: string;
  explorerUrl: string;
}

export interface InvestmentPlan {
  id: string;
  tier: number;
  name: string;
  depositAmount: number; // in USDT
  totalPayout: number; // in USDT
  totalDifference: number; // in USDT (net profit)
  dailyClaim: number; // in USDT
  durationDays: number; // 40 days
  tagline: string;
  popular?: boolean;
}

export interface UserActiveInvestment {
  id: string;
  userUid?: string;
  userPhone?: string;
  planId: string;
  planName: string;
  depositAmount: number;
  totalPayout: number;
  dailyClaimAmount: number;
  durationDays: number;
  daysClaimed: number;
  totalClaimed: number;
  startedAt: string; // ISO string
  lastClaimedAt?: string; // ISO string
  nextClaimAvailableAt: string; // ISO string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'INVESTMENT' | 'DAILY_CLAIM' | 'BONUS';
export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';

export interface CryptoTransaction {
  id: string;
  userUid?: string;
  userPhone?: string;
  type: TransactionType;
  crypto: CryptoSymbol;
  network: string;
  amount: number;
  fee?: number;
  status: TransactionStatus;
  txHash?: string;
  destinationAddress?: string;
  createdAt: string;
  completedAt?: string;
  note?: string;
}

export interface AdminUserRecord {
  uid: string;
  phone: string;
  email: string;
  joinedDate: string;
  balanceUSDT: number;
  totalDepositedUSDT: number;
  totalInvestedUSDT: number;
  totalWithdrawnUSDT: number;
  activeContractsCount: number;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface UserProfile {
  uid: string;
  email: string;
  phone: string;
  availableBalanceUSDT: number;
  frozenBalanceUSDT: number;
  totalDepositedUSDT: number;
  totalInvestedUSDT: number;
  totalClaimedUSDT: number;
  totalWithdrawnUSDT: number;
  registrationDate: string;
  twoFactorEnabled: boolean;
  withdrawalPinSet: boolean;
  savedWallets: {
    symbol: CryptoSymbol;
    network: string;
    address: string;
  }[];
}

export interface AdminAuditAction {
  id: string;
  adminEmail: string;
  action: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'NOTICE' | 'UPDATE' | 'SECURITY';
  active: boolean;
}

export interface InvitedReferral {
  id: string;
  identifier: string; // Phone or obscured email
  tier: 1 | 2 | 3;
  planStaked: string;
  depositAmount: number;
  commissionEarned: number;
  joinedDate: string;
  status: 'ACTIVE' | 'REGISTERED';
}

export interface ReferralProgramState {
  referralCode: string;
  referralLink: string;
  tier1Rate: number; // 10%
  tier2Rate: number; // 5%
  tier3Rate: number; // 2%
  totalInvited: number;
  activeStakers: number;
  totalCommissionEarned: number;
  pendingCommission: number;
  affiliateRank: string;
  rankProgress: number; // 0-100
  nextRankThreshold: number;
  invitedList: InvitedReferral[];
}
