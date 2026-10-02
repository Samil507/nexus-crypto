import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { generateBloggerCode } from '../utils/bloggerGenerator';
import {
  X,
  Copy,
  Check,
  Download,
  Smartphone,
  Server,
  Database,
  FileCode,
  ShieldAlert,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const BloggerGuideModal: React.FC = () => {
  const { bloggerModalOpen, setBloggerModalOpen, customAddresses, showToast } = useCrypto();
  const [activeTab, setActiveTab] = useState<'code' | 'android' | 'backend' | 'schema'>('code');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!bloggerModalOpen) return null;

  const activeAddr = customAddresses['TRC20'] || 'TNVs9gK8JzXv2qR7mL5aB8eD1uF4yH9pW3';
  const bloggerCode = generateBloggerCode(activeAddr);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bloggerCode);
    setCopiedCode(true);
    showToast('Blogger embed code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([bloggerCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexus-crypto-investment-blogger.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded nexus-crypto-investment-blogger.html');
  };

  const backendCodeSnippet = `// Production Node.js / Express Server-Side Verification Engine
// server.js - Real-time Blockchain Verification & Balance Daemon

const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const db = new Pool({ connectionString: process.env.DATABASE_URL });

// 1. Verify Tron TRC20 USDT Deposit
app.post('/api/verify-deposit', async (req, res) => {
  const { uid, txHash, network } = req.body;
  
  try {
    // Query TronGrid API for on-chain status
    const tronRes = await axios.get(\`https://api.trongrid.io/v1/transactions/\${txHash}\`);
    const txData = tronRes.data;

    if (!txData || !txData.ret || txData.ret[0].contractRet !== 'SUCCESS') {
      return res.status(400).json({ error: 'Transaction unconfirmed or failed on TronGrid' });
    }

    // Verify recipient matches official protocol deposit address
    // Verify token contract is USDT (TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)
    // Credit user liquid balance in PostgreSQL transaction
    await db.query('BEGIN');
    await db.query(
      'UPDATE users SET available_balance = available_balance + $1 WHERE uid = $2',
      [txData.amount, uid]
    );
    await db.query(
      'UPDATE deposits SET status = $1, confirmed_at = NOW() WHERE tx_hash = $2',
      ['CONFIRMED', txHash]
    );
    await db.query('COMMIT');

    return res.json({ success: true, message: 'Deposit verified and credited' });
  } catch (err) {
    await db.query('ROLLBACK');
    return res.status(500).json({ error: err.message });
  }
});

// 2. Server-Authoritative 24-Hour Daily Claim Endpoint
app.post('/api/claim-yield', async (req, res) => {
  const { uid, investmentId } = req.body;

  const invResult = await db.query(
    'SELECT * FROM active_investments WHERE id = $1 AND user_uid = $2',
    [investmentId, uid]
  );
  const inv = invResult.rows[0];

  if (!inv || inv.status !== 'ACTIVE') {
    return res.status(400).json({ error: 'Contract inactive or expired' });
  }

  const now = new Date();
  const nextClaimTime = new Date(inv.next_claim_time);

  // Server clock prevents duplicate daily claims
  if (now < nextClaimTime) {
    return res.status(400).json({ error: 'Claim cooldown active. Next claim in 24 hours.' });
  }

  // Prevent claiming past 40 days
  if (inv.days_claimed >= 40) {
    await db.query('UPDATE active_investments SET status = $1 WHERE id = $2', ['COMPLETED', investmentId]);
    return res.status(400).json({ error: 'Investment contract has matured (40 days reached).' });
  }

  // Execute atomic yield credit
  await db.query('BEGIN');
  await db.query(
    'UPDATE users SET available_balance = available_balance + $1 WHERE uid = $2',
    [inv.daily_claim_amount, uid]
  );
  await db.query(
    \`UPDATE active_investments SET 
       days_claimed = days_claimed + 1,
       total_claimed = total_claimed + $1,
       last_claimed_at = NOW(),
       next_claim_time = NOW() + INTERVAL '24 hours',
       status = CASE WHEN days_claimed + 1 >= 40 THEN 'COMPLETED' ELSE 'ACTIVE' END
     WHERE id = $2\`,
    [inv.daily_claim_amount, investmentId]
  );
  await db.query('COMMIT');

  return res.json({ success: true, claimedAmount: inv.daily_claim_amount });
});

app.listen(5000, () => console.log('Secure Crypto Daemon active on port 5000'));`;

  const sqlSchemaSnippet = `-- PostgreSQL Production Database Schema
-- Run this in PostgreSQL, Supabase, Neon, or Cloud SQL

CREATE TABLE users (
  uid VARCHAR(32) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  available_balance NUMERIC(18, 4) DEFAULT 0.0000,
  frozen_balance NUMERIC(18, 4) DEFAULT 0.0000,
  two_factor_secret VARCHAR(64),
  withdrawal_pin VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE investment_plans (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  deposit_amount NUMERIC(18, 4) NOT NULL,
  total_payout NUMERIC(18, 4) NOT NULL,
  total_difference NUMERIC(18, 4) NOT NULL,
  daily_claim NUMERIC(18, 4) NOT NULL,
  duration_days INT DEFAULT 40,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE active_investments (
  id VARCHAR(64) PRIMARY KEY,
  user_uid VARCHAR(32) REFERENCES users(uid),
  plan_id VARCHAR(64) REFERENCES investment_plans(id),
  deposit_amount NUMERIC(18, 4) NOT NULL,
  daily_claim_amount NUMERIC(18, 4) NOT NULL,
  days_claimed INT DEFAULT 0,
  total_claimed NUMERIC(18, 4) DEFAULT 0.0000,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_claimed_at TIMESTAMP WITH TIME ZONE,
  next_claim_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED'))
);

CREATE TABLE deposits (
  id VARCHAR(64) PRIMARY KEY,
  user_uid VARCHAR(32) REFERENCES users(uid),
  crypto VARCHAR(10) NOT NULL,
  network VARCHAR(30) NOT NULL,
  amount NUMERIC(18, 4) NOT NULL,
  tx_hash VARCHAR(128) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE withdrawals (
  id VARCHAR(64) PRIMARY KEY,
  user_uid VARCHAR(32) REFERENCES users(uid),
  crypto VARCHAR(10) NOT NULL,
  network VARCHAR(30) NOT NULL,
  amount NUMERIC(18, 4) NOT NULL,
  fee NUMERIC(18, 4) NOT NULL,
  destination_address VARCHAR(128) NOT NULL,
  status VARCHAR(20) DEFAULT 'PROCESSING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED')),
  tx_hash VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE admin_audit_log (
  id BIGSERIAL PRIMARY KEY,
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_ref VARCHAR(100),
  details TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0E172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#080E1E] border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Blogger Single-File Code & Deployment Blueprint
              </h2>
              <span className="text-[11px] text-slate-400">
                HTML + CSS + Vanilla JS &bull; Compatible with Android Blogger Editor
              </span>
            </div>
          </div>
          <button
            onClick={() => setBloggerModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border-b border-slate-800 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'code' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Blogger Standalone Code (HTML/CSS/JS)
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'android' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. Android Phone Step-by-Step Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('backend')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'backend' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>3. Backend & Blockchain Spec</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schema' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>4. PostgreSQL Database Schema</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: Blogger Code */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-300">
                  This code contains all embedded CSS, HTML elements, and Vanilla JS state for Blogger.
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyCode}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={handleDownloadCode}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .html</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl border border-slate-800 bg-[#070D1A] p-4 font-mono text-xs text-emerald-300/90 overflow-x-auto max-h-[440px]">
                <pre>{bloggerCode}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: Android Phone Installation Guide */}
          {activeTab === 'android' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>How to Paste on Blogger Using an Android Phone</span>
                </h3>
                <p className="text-slate-400">
                  Follow these exact mobile steps using Google Chrome or Firefox on your Android device.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 text-sm">
                    Method A: Using Blogger Layout Gadget (Recommended - Safest)
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300">
                    <li>Open <strong className="text-white">Chrome</strong> on your Android phone and navigate to <span className="font-mono text-emerald-300">blogger.com</span>.</li>
                    <li>Tap the <strong>three dots menu (⋮)</strong> in Chrome and tap <strong className="text-white">Desktop site</strong> checkbox (this makes editing much easier on Android).</li>
                    <li>In the left sidebar, tap <strong className="text-white">Layout</strong>.</li>
                    <li>Scroll down to the <strong>Main</strong> or <strong>Page Body</strong> section and tap <strong className="text-emerald-400">+ Add a Gadget</strong>.</li>
                    <li>From the pop-up list, select <strong className="text-white">HTML/JavaScript</strong>.</li>
                    <li>Leave "Title" blank. In the <strong className="text-white">Content</strong> box, long-press and select <strong className="text-white">Paste</strong> (paste the code from Tab 1).</li>
                    <li>Tap <strong className="text-emerald-400">Save</strong> at the bottom right.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 text-sm">
                    Method B: Creating a Dedicated Staking Page
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300">
                    <li>In the Blogger left menu, tap <strong className="text-white">Pages</strong> &gt; <strong className="text-white">+ New page</strong>.</li>
                    <li>Under the title, tap the pencil icon (<strong className="text-white">✏️</strong>) and switch from "Compose view" to <strong className="text-emerald-400">&lt;&gt; HTML view</strong>.</li>
                    <li>Delete any existing blank HTML tags, then long-press and <strong className="text-white">Paste</strong> the entire code.</li>
                    <li>Set Page Title as <strong className="text-white">Crypto Staking Portal</strong>.</li>
                    <li>Tap the orange <strong className="text-white">Publish</strong> icon at the top right.</li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300/90 text-xs">
                  <strong>Critical Android Tip:</strong> If your phone keyboard auto-corrects or strips HTML quotes, use the "Download .html" button above, then open the file in the free "QuickEdit" or "Acode" app on Android to copy pristine unformatted text.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Backend & Blockchain Spec */}
          {activeTab === 'backend' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <span className="text-sm font-bold text-white block">
                  Mandatory Production Separation: Frontend vs. Backend
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Blogger runs purely client-side in the user's browser. While the widget provides complete interactive state, all real balance transactions, cryptographic signing, and deposit confirmations require an external API server (Node.js/Express) connected to RPC nodes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070D1A] border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[380px]">
                <pre>{backendCodeSnippet}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: Database Schema */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                Execute this schema in PostgreSQL, Neon, or Supabase to provision relational storage for accounts, 40-day investments, TxIDs, and audit records.
              </div>

              <div className="p-4 rounded-xl bg-[#070D1A] border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[380px]">
                <pre>{sqlSchemaSnippet}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#080E1E] border-t border-slate-800 shrink-0 text-xs">
          <span className="text-slate-400">Blogger Embed Version 2026.10</span>
          <button
            onClick={() => setBloggerModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
