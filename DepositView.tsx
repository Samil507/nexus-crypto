import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { CryptoSymbol, UsdtNetwork } from '../types/crypto';
import { SUPPORTED_NETWORKS, NetworkOption } from '../data/cryptoNetworks';
import { generateSvgQrPath } from '../utils/qr';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Info,
  Edit3,
  CheckCircle2,
  Wallet,
  Sparkles
} from 'lucide-react';

export const DepositView: React.FC = () => {
  const {
    submitDeposit,
    transactions,
    customAddresses,
    updateCustomDepositAddress,
    showToast
  } = useCrypto();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoSymbol>('USDT');
  const [selectedNetworkCode, setSelectedNetworkCode] = useState<string>('TRC20');
  const [depositAmount, setDepositAmount] = useState<string>('50');
  const [txHashInput, setTxHashInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Custom address editor state
  const [editAddressModalOpen, setEditAddressModalOpen] = useState(false);
  const [customAddressInput, setCustomAddressInput] = useState('');

  // Available networks for selected crypto
  const availableNetworks = SUPPORTED_NETWORKS.filter(n => n.crypto === selectedCrypto);

  // Active network configuration
  const currentNetwork: NetworkOption =
    availableNetworks.find(n => n.networkCode === selectedNetworkCode) || availableNetworks[0];

  // Effective deposit address (uses user custom address if set)
  const activeDepositAddress =
    customAddresses[currentNetwork.networkCode] || currentNetwork.depositAddress;

  const isCustomActive = !!customAddresses[currentNetwork.networkCode];

  const handleCryptoChange = (crypto: CryptoSymbol) => {
    setSelectedCrypto(crypto);
    const nets = SUPPORTED_NETWORKS.filter(n => n.crypto === crypto);
    if (nets.length > 0) {
      setSelectedNetworkCode(nets[0].networkCode);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(activeDepositAddress);
    setCopied(true);
    showToast('Deposit address copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenEditAddress = () => {
    setCustomAddressInput(activeDepositAddress);
    setEditAddressModalOpen(true);
  };

  const handleSaveCustomAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddressInput.trim()) {
      showToast('Please enter your crypto wallet address.');
      return;
    }
    updateCustomDepositAddress(currentNetwork.networkCode, customAddressInput.trim());
    setEditAddressModalOpen(false);
  };

  const handleSubmitTx = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHash = txHashInput.trim();
    if (!cleanHash) {
      showToast('Please enter the transaction hash (TxID) from Binance or your wallet.');
      return;
    }
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt < currentNetwork.minDeposit) {
      showToast(`Minimum deposit for ${currentNetwork.network} is ${currentNetwork.minDeposit} ${selectedCrypto}.`);
      return;
    }

    submitDeposit(selectedCrypto, currentNetwork.network, amt, cleanHash);
    setTxHashInput('');
  };

  // Filter deposit history
  const depositHistory = transactions.filter(t => t.type === 'DEPOSIT');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Deposit Cryptocurrency</span>
          <Download className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Deposit USDT, BNB, TRX, or ETH from Binance, OKX, Trust Wallet, or any Web3 wallet.
        </p>
      </div>

      {/* Set My Address Quick Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Want to attach your personal wallet address?</span>
              {isCustomActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Set your personal Binance or Trust Wallet USDT ({currentNetwork.network}) receiving address so all user deposits route directly to you.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenEditAddress}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all shrink-0 self-start sm:self-auto"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Set My Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Address Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-5">
            {/* Step 1: Select Crypto */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                1. Select Cryptocurrency
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

            {/* Step 2: Select Network */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                2. Select Deposit Network
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
                        Confirmations: {net.confirmationsNeeded} &bull; Min: {net.minDeposit} {net.crypto}
                      </span>
                    </div>
                    {selectedNetworkCode === net.networkCode && (
                      <span className="text-emerald-400 font-bold text-xs">Selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Deposit Address & QR Code */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Vector SVG QR */}
                <div className="bg-white p-2.5 rounded-xl shrink-0 shadow-lg">
                  <svg
                    width="140"
                    height="140"
                    viewBox="0 0 200 200"
                    className="w-28 h-28 sm:w-32 sm:h-32"
                  >
                    <path
                      d={generateSvgQrPath(activeDepositAddress, 200)}
                      fill="#080E1E"
                    />
                  </svg>
                </div>

                {/* Address string & Copy button */}
                <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Deposit Address ({currentNetwork.network})
                    </span>
                    {isCustomActive && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Custom Address Active
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
                    {activeDepositAddress}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Address Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenEditAddress}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-colors cursor-pointer"
                      title="Attach your personal crypto deposit address"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Set My Address</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Helper Notice */}
              <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-300/90 flex items-center justify-between gap-2">
                <span>
                  💡 <strong>Tip:</strong> Click <span className="underline">"Set My Address"</span> above to paste your Binance or Trust Wallet address. The QR code and copy button will immediately use your personal receiving address.
                </span>
              </div>
            </div>

            {/* Step 4: Submission Form */}
            <form onSubmit={handleSubmitTx} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Deposit Amount ({selectedCrypto})
                </label>
                <input
                  type="number"
                  step="any"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  placeholder={`Min ${currentNetwork.minDeposit}`}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none tabular-nums"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Binance / Wallet Transaction Hash (TxID)
                </label>
                <input
                  type="text"
                  value={txHashInput}
                  onChange={e => setTxHashInput(e.target.value)}
                  placeholder="Paste 64-character hash (e.g. 0x... or 64 hex chars)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Find this in Binance under: Wallets &gt; Transaction History &gt; TxID.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <span>Submit Deposit for Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Binance Step-by-Step Instructions & Node Verification */}
        <div className="lg:col-span-5 space-y-6">
          {/* Binance Step-by-Step Guide Card */}
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 text-xs flex items-center justify-center font-bold">
                B
              </span>
              <span>How to Deposit from Binance</span>
            </div>

            <ol className="space-y-3 text-xs text-slate-300 leading-relaxed list-decimal list-inside">
              <li>
                Open the <strong className="text-white">Binance App</strong> on your phone.
              </li>
              <li>
                Tap <strong className="text-white">Wallets</strong> &gt; <strong className="text-white">Spot</strong> &gt; <strong className="text-white">Withdraw</strong>.
              </li>
              <li>
                Search and select <strong className="text-emerald-400">{selectedCrypto}</strong>, then select <strong className="text-white">Send via Crypto Network</strong>.
              </li>
              <li>
                Paste our address or scan the QR code above.
              </li>
              <li>
                Select Network: <strong className="text-white">{currentNetwork.network}</strong>. (Ensure network matches exactly).
              </li>
              <li>
                Enter amount (&ge; {currentNetwork.minDeposit} {selectedCrypto}) and confirm withdrawal.
              </li>
              <li>
                Copy the <strong className="text-white">TxID / TxHash</strong> from your withdrawal details and paste it into the form on the left.
              </li>
            </ol>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-normal flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> Always send on the exact matching network ({currentNetwork.network}). Assets sent via wrong networks cannot be recovered.
              </span>
            </div>
          </div>

          {/* Backend Verification Architecture Note */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Backend Verification Pipeline</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              When submitted, the daemon listens for {currentNetwork.confirmationsNeeded} block confirmations on {currentNetwork.network}. Once validated by server-side RPC nodes, funds automatically credit to your available balance. You can also view/approve in the Admin Panel.
            </p>
          </div>
        </div>
      </div>

      {/* Deposit History Table */}
      <div className="space-y-3 pt-4">
        <h2 className="text-lg font-bold text-white">Deposit History</h2>
        {depositHistory.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-slate-400">
            No deposits recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0F172A]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Asset & Network</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">TxHash</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {depositHistory.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{tx.createdAt}</td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {tx.crypto} <span className="text-slate-400 font-normal">({tx.network})</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400 tabular-nums">
                      +{tx.amount.toFixed(2)} {tx.crypto}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 max-w-[160px] truncate">
                      {tx.txHash || '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          tx.status === 'CONFIRMED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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
      {/* Edit / Set Custom Address Modal */}
      {editAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Set Custom Deposit Address
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditAddressModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Paste your personal <strong>{currentNetwork.network}</strong> wallet address (e.g. from Binance, Trust Wallet, OKX) below. When saved, the deposit QR code and copy button will directly use your address.
            </p>

            <form onSubmit={handleSaveCustomAddress} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {currentNetwork.network} Wallet Address
                </label>
                <input
                  type="text"
                  value={customAddressInput}
                  onChange={e => setCustomAddressInput(e.target.value)}
                  placeholder={`Paste your ${currentNetwork.network} receiving address`}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
                ✓ Once saved, the on-screen deposit QR code and Copy button will instantly switch to your address.
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditAddressModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
