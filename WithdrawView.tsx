import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { CryptoSymbol } from '../types/crypto';
import { SUPPORTED_NETWORKS, NetworkOption } from '../data/cryptoNetworks';
import {
  Upload,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Wallet
} from 'lucide-react';

export const WithdrawView: React.FC = () => {
  const { user, submitWithdrawal, transactions, showToast } = useCrypto();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoSymbol>('USDT');
  const [selectedNetworkCode, setSelectedNetworkCode] = useState<string>('TRC20');
  const [addressInput, setAddressInput] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('20');
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  const availableNetworks = SUPPORTED_NETWORKS.filter(n => n.crypto === selectedCrypto);
  const currentNetwork: NetworkOption =
    availableNetworks.find(n => n.networkCode === selectedNetworkCode) || availableNetworks[0];

  const handleCryptoChange = (crypto: CryptoSymbol) => {
    setSelectedCrypto(crypto);
    const nets = SUPPORTED_NETWORKS.filter(n => n.crypto === crypto);
    if (nets.length > 0) {
      setSelectedNetworkCode(nets[0].networkCode);
    }
  };

  const parsedAmount = parseFloat(amountInput) || 0;
  const networkFee = currentNetwork.withdrawalFee;
  const netReceiveAmount = Math.max(0, +(parsedAmount - networkFee).toFixed(4));
  const totalDeduction = parsedAmount;

  const handleQuickPercent = (pct: number) => {
    const val = (user.availableBalanceUSDT * (pct / 100)).toFixed(2);
    setAmountInput(val);
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAddress = addressInput.trim();
    if (!cleanAddress || cleanAddress.length < 16) {
      showToast('Please enter a valid destination wallet address.');
      return;
    }
    if (parsedAmount < currentNetwork.minWithdraw) {
      showToast(`Minimum withdrawal is ${currentNetwork.minWithdraw} ${selectedCrypto}.`);
      return;
    }
    if (totalDeduction > user.availableBalanceUSDT) {
      showToast(`Insufficient balance. You have ${user.availableBalanceUSDT.toFixed(2)} USDT available.`);
      return;
    }

    setConfirmModalOpen(true);
  };

  const handleExecuteWithdrawal = () => {
    const success = submitWithdrawal(
      selectedCrypto,
      currentNetwork.network,
      addressInput.trim(),
      parsedAmount,
      networkFee
    );
    if (success) {
      setConfirmModalOpen(false);
      setAddressInput('');
      setAmountInput('');
    }
  };

  const withdrawalHistory = transactions.filter(t => t.type === 'WITHDRAW');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Withdraw Cryptocurrency</span>
          <Upload className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Withdraw funds to Binance, KuCoin, Trust Wallet, MetaMask, or any self-custody wallet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Withdrawal Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleOpenConfirm} className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-5">
            {/* Asset Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                1. Select Asset
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['USDT', 'BNB', 'TRX', 'ETH'] as CryptoSymbol[]).map(sym => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => handleCryptoChange(sym)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCrypto === sym
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Network Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                2. Select Withdrawal Network
              </label>
              <div className="space-y-2">
                {availableNetworks.map(net => (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setSelectedNetworkCode(net.networkCode)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                      selectedNetworkCode === net.networkCode
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-white block">{net.network}</span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Estimated Fee: {net.withdrawalFee} {net.crypto} &bull; Min: {net.minWithdraw} {net.crypto}
                      </span>
                    </div>
                    {selectedNetworkCode === net.networkCode && (
                      <span className="text-emerald-400 font-bold text-xs">Selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Address */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Recipient Wallet Address ({currentNetwork.network})
              </label>
              <input
                type="text"
                value={addressInput}
                onChange={e => setAddressInput(e.target.value)}
                placeholder={`Enter recipient ${currentNetwork.network} address`}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Withdrawal Amount ({selectedCrypto})
                </label>
                <span className="text-xs text-slate-400">
                  Available: <strong className="text-emerald-400 font-mono">{user.availableBalanceUSDT.toFixed(2)} USDT</strong>
                </span>
              </div>
              <input
                type="number"
                step="any"
                value={amountInput}
                onChange={e => setAmountInput(e.target.value)}
                placeholder={`Min ${currentNetwork.minWithdraw}`}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none tabular-nums"
                required
              />

              {/* Percentage shortcuts */}
              <div className="flex gap-2 mt-2">
                {[25, 50, 75, 100].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleQuickPercent(pct)}
                    className="flex-1 py-1 text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Fee & Net Receive summary */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Network Processing Fee:</span>
                <span className="text-slate-200 font-mono tabular-nums">
                  {networkFee} {selectedCrypto}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Deducted:</span>
                <span className="text-slate-200 font-mono tabular-nums">
                  {parsedAmount.toFixed(2)} {selectedCrypto}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                <span className="text-white">You Will Receive:</span>
                <span className="text-emerald-400 font-mono tabular-nums">
                  {netReceiveAmount.toFixed(2)} {selectedCrypto}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Review Withdrawal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Security Checks & Policies */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Security & Payout Rules</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li>
                Minimum withdrawal for <strong className="text-white">{currentNetwork.network}</strong> is <strong className="text-white">{currentNetwork.minWithdraw} {selectedCrypto}</strong>.
              </li>
              <li>
                Automated security sweeps check for 2FA validation and valid address checksums.
              </li>
              <li>
                Estimated settlement time is <strong className="text-emerald-400">5 to 15 minutes</strong> after backend transaction broadcast.
              </li>
              <li>
                Network fees are burned as protocol gas and are non-refundable once signed.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <span className="text-slate-300 font-semibold block">Need to change payout address?</span>
            <p className="leading-relaxed">
              You can save and manage verified whitelisted withdrawal addresses in your Profile tab under Payout Accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Confirm Withdrawal Request</h3>
            
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Asset:</span>
                <span className="font-bold text-white">{selectedCrypto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Network:</span>
                <span className="font-semibold text-slate-200">{currentNetwork.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination:</span>
                <span className="font-mono text-emerald-400 break-all">{addressInput}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Withdraw Amount:</span>
                <span className="font-bold text-white tabular-nums">{parsedAmount.toFixed(2)} {selectedCrypto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Network Fee:</span>
                <span className="font-mono text-slate-300 tabular-nums">{networkFee} {selectedCrypto}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                <span className="text-white">Net Receive:</span>
                <span className="text-emerald-400 tabular-nums">{netReceiveAmount.toFixed(2)} {selectedCrypto}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteWithdrawal}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal History Table */}
      <div className="space-y-3 pt-4">
        <h2 className="text-lg font-bold text-white">Withdrawal History</h2>
        {withdrawalHistory.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-slate-400">
            No withdrawals recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0F172A]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {withdrawalHistory.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{tx.createdAt}</td>
                    <td className="py-3 px-4 font-mono text-slate-300 max-w-[160px] truncate">
                      {tx.destinationAddress || '—'}
                    </td>
                    <td className="py-3 px-4 font-bold text-white tabular-nums">
                      -{tx.amount.toFixed(2)} {tx.crypto}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono tabular-nums">
                      {tx.fee ? `${tx.fee} ${tx.crypto}` : '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          tx.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : tx.status === 'PROCESSING'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : tx.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
