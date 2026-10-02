import { CryptoSymbol, UsdtNetwork, CryptoNetworkInfo } from '../types/crypto';

export interface NetworkOption {
  id: string;
  crypto: CryptoSymbol;
  network: string;
  networkCode: UsdtNetwork | 'BSC' | 'TRON' | 'ETHEREUM';
  depositAddress: string;
  minDeposit: number;
  minWithdraw: number;
  withdrawalFee: number;
  confirmationsNeeded: number;
  explorerUrl: string;
  color: string;
  memoRequired?: boolean;
}

export const SUPPORTED_NETWORKS: NetworkOption[] = [
  {
    id: 'usdt-trc20',
    crypto: 'USDT',
    network: 'TRON (TRC20)',
    networkCode: 'TRC20',
    depositAddress: 'TNVs9gK8JzXv2qR7mL5aB8eD1uF4yH9pW3',
    minDeposit: 5,
    minWithdraw: 10,
    withdrawalFee: 1.0,
    confirmationsNeeded: 1,
    explorerUrl: 'https://tronscan.org/#/transaction/',
    color: '#FF0018',
  },
  {
    id: 'usdt-bep20',
    crypto: 'USDT',
    network: 'BNB Smart Chain (BEP20)',
    networkCode: 'BEP20',
    depositAddress: '0x84D1f623e9F7C2a543B8d6291C7D5f25E2eC80A2',
    minDeposit: 5,
    minWithdraw: 10,
    withdrawalFee: 0.8,
    confirmationsNeeded: 15,
    explorerUrl: 'https://bscscan.com/tx/',
    color: '#F0B90B',
  },
  {
    id: 'usdt-erc20',
    crypto: 'USDT',
    network: 'Ethereum (ERC20)',
    networkCode: 'ERC20',
    depositAddress: '0x84D1f623e9F7C2a543B8d6291C7D5f25E2eC80A2',
    minDeposit: 20,
    minWithdraw: 20,
    withdrawalFee: 4.5,
    confirmationsNeeded: 12,
    explorerUrl: 'https://etherscan.io/tx/',
    color: '#627EEA',
  },
  {
    id: 'bnb-bep20',
    crypto: 'BNB',
    network: 'BNB Smart Chain (BEP20)',
    networkCode: 'BSC',
    depositAddress: '0x84D1f623e9F7C2a543B8d6291C7D5f25E2eC80A2',
    minDeposit: 0.02,
    minWithdraw: 0.05,
    withdrawalFee: 0.001,
    confirmationsNeeded: 15,
    explorerUrl: 'https://bscscan.com/tx/',
    color: '#F0B90B',
  },
  {
    id: 'trx-trc20',
    crypto: 'TRX',
    network: 'TRON (TRC20)',
    networkCode: 'TRON',
    depositAddress: 'TNVs9gK8JzXv2qR7mL5aB8eD1uF4yH9pW3',
    minDeposit: 30,
    minWithdraw: 50,
    withdrawalFee: 2.0,
    confirmationsNeeded: 1,
    explorerUrl: 'https://tronscan.org/#/transaction/',
    color: '#EB0029',
  },
  {
    id: 'eth-erc20',
    crypto: 'ETH',
    network: 'Ethereum (ERC20)',
    networkCode: 'ETHEREUM',
    depositAddress: '0x84D1f623e9F7C2a543B8d6291C7D5f25E2eC80A2',
    minDeposit: 0.008,
    minWithdraw: 0.015,
    withdrawalFee: 0.002,
    confirmationsNeeded: 12,
    explorerUrl: 'https://etherscan.io/tx/',
    color: '#627EEA',
  },
];
