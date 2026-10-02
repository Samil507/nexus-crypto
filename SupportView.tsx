import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import {
  HelpCircle,
  MessageSquare,
  Send,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Mail,
  ShieldCheck
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const { showToast } = useCrypto();
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('DEPOSIT');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I deposit USDT from Binance?',
      a: 'Go to the Deposit tab, choose USDT, and select TRON (TRC20) or BSC (BEP20). Copy the provided deposit address. In your Binance app, navigate to Wallets > Spot > Withdraw > USDT > Send via Crypto Network. Paste our address, select the matching network, and confirm. Once sent, copy the TxID / TxHash and submit it in the deposit form.'
    },
    {
      q: 'How does the 40-Day Daily Claim work?',
      a: 'Every investment plan has a fixed 40-day duration. Every 24 hours, you can visit the "Daily Claim" tab and click the "Claim Now" button on your active contract. The exact daily rate (e.g. 0.22 USDT for Starter, 3.00 USDT for Gold) credits immediately into your liquid balance. Each contract allows one claim per 24 hours until day 40 is reached.'
    },
    {
      q: 'What are the withdrawal fees and processing times?',
      a: 'Withdrawal fees reflect network gas: TRC20 is 1.0 USDT, BEP20 is 0.8 USDT, and ERC20 is 4.5 USDT. Withdrawals are processed by server-side signing daemons within 5 to 15 minutes after security clearance.'
    },
    {
      q: 'Can I withdraw my deposit before the 40-day contract ends?',
      a: 'In fixed-duration staking contracts, liquidity is locked in high-throughput node pools for the full 40-day term to guarantee scheduled daily payouts. Yields are claimed daily and can be withdrawn anytime once you meet the minimum withdrawal threshold.'
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      showToast('Please fill in both subject and message.');
      return;
    }
    setSubmitted(true);
    showToast('Support ticket #TCK-8823 created! Our 24/7 team will respond via email.');
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Support & Help Center</span>
          <HelpCircle className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          24/7 dedicated assistance for deposit verification, contract staking, and crypto withdrawals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: FAQs & Official Channels */}
        <div className="lg:col-span-7 space-y-6">
          {/* FAQ Accordion */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Frequently Asked Questions</h2>
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-emerald-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Community Channels Card */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Official Protocol Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  showToast('Redirecting to Official Telegram Channel...');
                  window.open('https://telegram.org', '_blank');
                }}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Telegram Channel</span>
                  <span className="text-[11px] text-slate-400">Announcements & news</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                onClick={() => {
                  showToast('Opening Telegram Community Group...');
                  window.open('https://telegram.org', '_blank');
                }}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Community Chat</span>
                  <span className="text-[11px] text-slate-400">Join 15,000+ members</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Submit Support Ticket */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleSubmitTicket}
            className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4"
          >
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Open Support Ticket</span>
            </div>

            {submitted && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ticket #8823 submitted! Our support desk will reply promptly.</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={ticketCategory}
                onChange={e => setTicketCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="DEPOSIT">Deposit Confirmation / TxHash Check</option>
                <option value="WITHDRAW">Withdrawal Status & Tx Broadcast</option>
                <option value="CLAIM">Daily Yield Claim Discrepancy</option>
                <option value="ACCOUNT">2FA & Security Assistance</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Subject
              </label>
              <input
                type="text"
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                placeholder="e.g. Binance TRC20 TxID confirmation status"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Message & Transaction Details
              </label>
              <textarea
                rows={4}
                value={ticketMessage}
                onChange={e => setTicketMessage(e.target.value)}
                placeholder="Please include your TxHash or details..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Support Request</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
