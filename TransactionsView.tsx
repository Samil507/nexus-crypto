import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { TransactionType } from '../types/crypto';
import { Receipt, Filter, Download, ExternalLink, ArrowDownLeft, ArrowUpRight, Zap, Gift } from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { transactions } = useCrypto();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'WITHDRAW':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'INVESTMENT':
        return <Receipt className="w-4 h-4 text-blue-400" />;
      case 'DAILY_CLAIM':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'BONUS':
        return <Gift className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Transaction Ledger</span>
            <Receipt className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit log of all deposits, daily yield claims, contract stakes, and withdrawals.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'DEPOSIT', label: 'Deposits' },
            { id: 'DAILY_CLAIM', label: 'Yield Claims' },
            { id: 'INVESTMENT', label: 'Investments' },
            { id: 'WITHDRAW', label: 'Withdrawals' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === f.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F172A] overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No transactions found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Details / Network</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.map(tx => {
                  const isPositive = tx.type === 'DEPOSIT' || tx.type === 'DAILY_CLAIM' || tx.type === 'BONUS';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                            {getTypeIcon(tx.type)}
                          </div>
                          <div>
                            <span className="font-bold text-white block">
                              {tx.type.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {tx.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-200 block">{tx.note || tx.network}</span>
                        {tx.txHash && (
                          <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[180px]">
                            Hash: {tx.txHash}
                          </span>
                        )}
                        {tx.destinationAddress && (
                          <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[180px]">
                            To: {tx.destinationAddress}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`font-extrabold text-sm tabular-nums ${
                            isPositive ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {isPositive ? '+' : '-'}{tx.amount.toFixed(2)} {tx.crypto}
                        </span>
                        {tx.fee ? (
                          <span className="text-[10px] text-slate-400 block">Fee: {tx.fee} {tx.crypto}</span>
                        ) : null}
                      </td>

                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {tx.createdAt}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            tx.status === 'CONFIRMED' || tx.status === 'COMPLETED'
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
