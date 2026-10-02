/**
 * Generates production-ready, standalone, Blogger-compatible single-file
 * HTML + CSS + Vanilla JavaScript widget with zero external npm dependencies.
 */
export function generateBloggerCode(customAddress: string = 'TNVs9gK8JzXv2qR7mL5aB8eD1uF4yH9pW3'): string {
  return `<!-- ======================================================== -->
<!-- NEXUS CRYPTO INVESTMENT WIDGET FOR BLOGGER (HTML/CSS/JS)   -->
<!-- Theme: Dark Navy (#080E1E), Crisp White & Emerald (#10B981)-->
<!-- Compatible with Blogger Mobile & Desktop Templates         -->
<!-- ======================================================== -->

<style>
/* CSS Reset & Variables for Blogger Scoping */
#nexus-crypto-app {
  --nc-bg: #080E1E;
  --nc-surface: #0F172A;
  --nc-surface-card: #131F37;
  --nc-surface-hover: #1A2946;
  --nc-border: rgba(255, 255, 255, 0.08);
  --nc-emerald: #10B981;
  --nc-emerald-hover: #059669;
  --nc-emerald-dim: rgba(16, 185, 129, 0.12);
  --nc-text: #F8FAFC;
  --nc-text-muted: #94A3B8;
  --nc-danger: #EF4444;
  --nc-warning: #F59E0B;
  
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--nc-bg);
  color: var(--nc-text);
  max-width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 80px; /* Space for mobile bottom bar */
}

#nexus-crypto-app * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Header & Top Bar */
.nc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--nc-surface);
  border-bottom: 1px solid var(--nc-border);
  position: sticky;
  top: 0;
  z-index: 50;
}
.nc-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
}
.nc-brand-badge {
  background: var(--nc-emerald-dim);
  color: var(--nc-emerald);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}
.nc-wallet-pill {
  background: var(--nc-surface-card);
  border: 1px solid var(--nc-border);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.nc-wallet-amount {
  color: var(--nc-emerald);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* Desktop Sidebar + Main Layout Grid */
.nc-layout {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
}
.nc-sidebar {
  display: none;
  width: 240px;
  padding: 24px 16px;
  border-right: 1px solid var(--nc-border);
  background: var(--nc-surface);
  flex-shrink: 0;
  min-height: calc(100vh - 65px);
}
@media (min-width: 900px) {
  .nc-sidebar { display: block; }
  #nexus-crypto-app { padding-bottom: 0; }
}

.nc-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--nc-text-muted);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}
.nc-nav-item:hover, .nc-nav-item.active {
  background: var(--nc-emerald-dim);
  color: var(--nc-emerald);
}

.nc-content {
  flex: 1;
  padding: 20px;
  max-width: 960px;
}

/* Section Containers */
.nc-view {
  display: none;
}
.nc-view.active {
  display: block;
  animation: ncFadeIn 0.25s ease;
}
@keyframes ncFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hero & Wallet Overview Card */
.nc-balance-card {
  background: linear-gradient(135deg, #111E38 0%, #0D162B 100%);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}
.nc-balance-card::before {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
  pointer-events: none;
}
.nc-balance-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--nc-text-muted);
  margin-bottom: 6px;
}
.nc-balance-val {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  font-variant-numeric: tabular-nums;
  margin-bottom: 16px;
}
.nc-quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--nc-border);
}
.nc-stat-sub {
  font-size: 11px;
  color: var(--nc-text-muted);
}
.nc-stat-num {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  margin-top: 4px;
}

/* 4-Grid Action Hub (Deposit, Withdraw, Transactions, Payout) */
.nc-hub-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}
@media (max-width: 500px) {
  .nc-hub-grid { grid-template-columns: repeat(2, 1fr); }
}
.nc-hub-btn {
  background: var(--nc-surface-card);
  border: 1px solid var(--nc-border);
  padding: 16px 12px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #fff;
}
.nc-hub-btn:hover {
  background: var(--nc-surface-hover);
  border-color: var(--nc-emerald);
  transform: translateY(-2px);
}
.nc-hub-icon {
  font-size: 22px;
  margin-bottom: 8px;
  display: block;
}
.nc-hub-title {
  font-size: 13px;
  font-weight: 600;
}

/* Investment Plans Grid */
.nc-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.nc-plan-card {
  background: var(--nc-surface-card);
  border: 1px solid var(--nc-border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, border-color 0.2s ease;
  position: relative;
}
.nc-plan-card:hover {
  transform: translateY(-3px);
  border-color: var(--nc-emerald);
}
.nc-plan-card.featured {
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
}
.nc-plan-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--nc-emerald-dim);
  color: var(--nc-emerald);
  font-weight: 700;
}
.nc-plan-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}
.nc-plan-deposit {
  font-size: 26px;
  font-weight: 800;
  color: var(--nc-emerald);
  margin-bottom: 12px;
}
.nc-plan-deposit span {
  font-size: 14px;
  color: var(--nc-text-muted);
  font-weight: 400;
}
.nc-plan-meta-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 13px;
}
.nc-plan-meta-label { color: var(--nc-text-muted); }
.nc-plan-meta-val { font-weight: 600; color: #fff; font-variant-numeric: tabular-nums; }
.nc-invest-btn {
  margin-top: 16px;
  width: 100%;
  padding: 12px;
  background: var(--nc-emerald);
  color: #06111E;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}
.nc-invest-btn:hover {
  background: var(--nc-emerald-hover);
}

/* Daily Claim Rows */
.nc-claim-card {
  background: var(--nc-surface-card);
  border: 1px solid var(--nc-border);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 12px;
}
.nc-claim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.nc-claim-btn {
  background: var(--nc-emerald);
  color: #080E1E;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.nc-claim-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: var(--nc-text-muted);
  cursor: not-allowed;
}

/* Modals */
.nc-modal-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 100;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.nc-modal-backdrop.open { display: flex; }
.nc-modal {
  background: var(--nc-surface);
  border: 1px solid var(--nc-border);
  border-radius: 16px;
  max-width: 440px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

/* Mobile Bottom Navigation Bar */
.nc-mobile-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--nc-surface);
  border-top: 1px solid var(--nc-border);
  z-index: 40;
}
@media (min-width: 900px) {
  .nc-mobile-bar { display: none; }
}
.nc-tab-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--nc-text-muted);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
}
.nc-tab-btn.active { color: var(--nc-emerald); }
.nc-tab-icon { font-size: 18px; }

/* Form inputs */
.nc-input-group {
  margin-bottom: 16px;
}
.nc-label {
  display: block;
  font-size: 12px;
  color: var(--nc-text-muted);
  margin-bottom: 6px;
}
.nc-input, .nc-select {
  width: 100%;
  padding: 12px 14px;
  background: var(--nc-surface-card);
  border: 1px solid var(--nc-border);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
}
.nc-input:focus, .nc-select:focus {
  border-color: var(--nc-emerald);
}

/* Risk Disclosure Banner */
.nc-disclaimer {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  line-height: 1.5;
  color: #FBBF24;
  margin-top: 24px;
}
</style>

<div id="nexus-crypto-app">
  <!-- Top Bar -->
  <header class="nc-header">
    <div class="nc-brand">
      <span>NEXUS</span>
      <span class="nc-brand-badge">PROTOCOL</span>
    </div>
    <div class="nc-wallet-pill">
      <span>Balance:</span>
      <span class="nc-wallet-amount" id="nc-header-balance">50.00 USDT</span>
    </div>
  </header>

  <!-- Layout Container -->
  <div class="nc-layout">
    <!-- Desktop Sidebar -->
    <aside class="nc-sidebar">
      <div class="nc-nav-item active" onclick="ncSwitchView('home')">🏠 Home</div>
      <div class="nc-nav-item" onclick="ncSwitchView('plans')">💎 Investment Plans</div>
      <div class="nc-nav-item" onclick="ncSwitchView('claim')">⚡ Daily Claim</div>
      <div class="nc-nav-item" onclick="ncSwitchView('referral')">👥 Referral Program</div>
      <div class="nc-nav-item" onclick="ncSwitchView('deposit')">📥 Deposit Crypto</div>
      <div class="nc-nav-item" onclick="ncSwitchView('withdraw')">📤 Withdraw</div>
      <div class="nc-nav-item" onclick="ncSwitchView('transactions')">📜 Transactions</div>
      <div class="nc-nav-item" onclick="ncSwitchView('profile')">👤 My Account</div>
    </aside>

    <!-- Main Content Area -->
    <main class="nc-content">
      <!-- 1. HOME VIEW -->
      <section id="view-home" class="nc-view active">
        <div class="nc-balance-card">
          <div class="nc-balance-label">Total Liquid Balance</div>
          <div class="nc-balance-val"><span id="nc-home-balance">50.00</span> <span style="font-size: 18px; color: var(--nc-text-muted);">USDT</span></div>
          <div class="nc-quick-stats">
            <div>
              <div class="nc-stat-sub">Active Plans</div>
              <div class="nc-stat-num" id="nc-stat-active">1</div>
            </div>
            <div>
              <div class="nc-stat-sub">Total Claimed</div>
              <div class="nc-stat-num" id="nc-stat-claimed">3.00 USDT</div>
            </div>
            <div>
              <div class="nc-stat-sub">Total Deposits</div>
              <div class="nc-stat-num" id="nc-stat-deposited">50.00 USDT</div>
            </div>
          </div>
        </div>

        <!-- 4-Grid Action Hub -->
        <div class="nc-hub-grid">
          <div class="nc-hub-btn" onclick="ncSwitchView('deposit')">
            <span class="nc-hub-icon">📥</span>
            <span class="nc-hub-title">Deposit</span>
          </div>
          <div class="nc-hub-btn" onclick="ncSwitchView('withdraw')">
            <span class="nc-hub-icon">📤</span>
            <span class="nc-hub-title">Withdraw</span>
          </div>
          <div class="nc-hub-btn" onclick="ncSwitchView('claim')">
            <span class="nc-hub-icon">⚡</span>
            <span class="nc-hub-title">Daily Claim</span>
          </div>
          <div class="nc-hub-btn" onclick="ncSwitchView('referral')">
            <span class="nc-hub-icon">👥</span>
            <span class="nc-hub-title">Referral</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 16px; font-weight: 700;">Featured Investment Plans (40 Days)</h3>
          <span style="font-size: 13px; color: var(--nc-emerald); cursor: pointer;" onclick="ncSwitchView('plans')">View All Plans &rarr;</span>
        </div>

        <div class="nc-plans-grid" id="nc-home-plans-container">
          <!-- Dynamically populated -->
        </div>

        <!-- Risk Disclosure -->
        <div class="nc-disclaimer">
          <strong>Mandatory Risk Disclosure:</strong> All listed payouts represent proposed contract yields over the 40-day staking period. Real blockchain deposits and server-verified payouts require backend node confirmations. Always verify financial capacity before deploying funds.
        </div>
      </section>

      <!-- 2. PLANS VIEW -->
      <section id="view-plans" class="nc-view">
        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 6px;">Investment Plans</h2>
        <p style="font-size: 13px; color: var(--nc-text-muted); margin-bottom: 20px;">All contracts feature a fixed 40-day duration with 24-hour daily claim distributions.</p>
        <div class="nc-plans-grid" id="nc-all-plans-container">
          <!-- Dynamically populated from JS -->
        </div>
      </section>

      <!-- 3. DAILY CLAIM VIEW -->
      <section id="view-claim" class="nc-view">
        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 6px;">Daily Yield Claim</h2>
        <p style="font-size: 13px; color: var(--nc-text-muted); margin-bottom: 20px;">Collect daily staking payouts once every 24 hours until contract maturity (40 days).</p>
        <div id="nc-claim-list">
          <!-- Dynamically populated -->
        </div>
      </section>

      <!-- 3.5 REFERRAL VIEW -->
      <section id="view-referral" class="nc-view">
        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 6px;">Referral & Affiliate Program</h2>
        <p style="font-size: 13px; color: var(--nc-text-muted); margin-bottom: 20px;">Invite friends and earn 10% direct + 5% sub-tier staking commissions in USDT.</p>

        <div style="background: var(--nc-surface-card); border: 1px solid var(--nc-border); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <div style="font-size: 12px; color: var(--nc-text-muted); margin-bottom: 6px;">Your Personal Referral Link</div>
          <div id="nc-ref-link-text" style="font-family: monospace; font-size: 13px; color: var(--nc-emerald); word-break: break-all; margin-bottom: 12px;">
            https://nexus-crypto.org/join?ref=U20261002YJYK
          </div>
          <button class="nc-claim-btn" onclick="ncCopyRefLink()">📋 Copy Referral Link</button>
        </div>

        <div class="nc-quick-stats" style="border: 1px solid var(--nc-border); border-radius: 12px; padding: 16px; background: var(--nc-surface); margin-bottom: 20px;">
          <div>
            <div class="nc-stat-sub">Invited Friends</div>
            <div class="nc-stat-num" id="nc-ref-count">18</div>
          </div>
          <div>
            <div class="nc-stat-sub">Active Stakers</div>
            <div class="nc-stat-num">12</div>
          </div>
          <div>
            <div class="nc-stat-sub">Pending Reward</div>
            <div class="nc-stat-num" id="nc-ref-pending" style="color: #F59E0B;">24.50 USDT</div>
          </div>
        </div>

        <button class="nc-invest-btn" onclick="ncClaimReferralReward()">⚡ Claim Referral Commission (+24.50 USDT)</button>
      </section>

      <!-- 4. DEPOSIT VIEW -->
      <section id="view-deposit" class="nc-view">
        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 6px;">Deposit Funds</h2>
        <p style="font-size: 13px; color: var(--nc-text-muted); margin-bottom: 20px;">Deposit from Binance, Trust Wallet, or any Web3 wallet. Funds credit after confirmation.</p>

        <div style="background: var(--nc-surface-card); border: 1px solid var(--nc-border); border-radius: 12px; padding: 20px; max-width: 520px;">
          <div class="nc-input-group">
            <label class="nc-label">Select Asset</label>
            <select class="nc-select" id="nc-deposit-asset">
              <option value="USDT">USDT (Tether USD)</option>
              <option value="BNB">BNB (Binance Coin)</option>
              <option value="TRX">TRX (Tron)</option>
              <option value="ETH">ETH (Ethereum)</option>
            </select>
          </div>

          <div class="nc-input-group">
            <label class="nc-label">Select Deposit Network</label>
            <select class="nc-select" id="nc-deposit-network">
              <option value="TRC20">TRON (TRC20) — Recommended (Low Fee)</option>
              <option value="BEP20">BNB Smart Chain (BEP20)</option>
              <option value="ERC20">Ethereum (ERC20)</option>
            </select>
          </div>

          <!-- Deposit Address Box -->
          <div style="background: var(--nc-surface); border: 1px dashed var(--nc-border); border-radius: 8px; padding: 14px; text-align: center; margin-bottom: 16px;">
            <div style="font-size: 11px; color: var(--nc-text-muted); margin-bottom: 6px;">Deposit Destination Address</div>
            <div id="nc-deposit-address-text" style="font-family: monospace; font-size: 12px; word-break: break-all; color: var(--nc-emerald); margin-bottom: 10px;">
              ${customAddress}
            </div>
            <div style="display: flex; gap: 8px; justify-content: center;">
              <button class="nc-claim-btn" onclick="ncCopyDepositAddress()">📋 Copy Address</button>
              <button class="nc-claim-btn" style="background: rgba(16, 185, 129, 0.15); color: var(--nc-emerald);" onclick="ncPromptCustomAddress()">✏️ Edit Address</button>
            </div>
          </div>

          <!-- TXID Field -->
          <div class="nc-input-group">
            <label class="nc-label">Transaction Hash (TxID) after transfer</label>
            <input type="text" class="nc-input" id="nc-deposit-txid" placeholder="Paste 64-character transaction hash here" />
          </div>

          <button class="nc-invest-btn" onclick="ncSubmitDepositTx()">Submit Deposit for Verification</button>
        </div>
      </section>

      <!-- 5. WITHDRAW VIEW -->
      <section id="view-withdraw" class="nc-view">
        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 6px;">Withdraw Crypto</h2>
        <p style="font-size: 13px; color: var(--nc-text-muted); margin-bottom: 20px;">Withdraw directly to your Binance, OKX, or hardware wallet address.</p>
        
        <div style="background: var(--nc-surface-card); border: 1px solid var(--nc-border); border-radius: 12px; padding: 20px; max-width: 520px;">
          <div class="nc-input-group">
            <label class="nc-label">Asset</label>
            <select class="nc-select" id="nc-withdraw-asset">
              <option value="USDT">USDT</option>
              <option value="BNB">BNB</option>
              <option value="TRX">TRX</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
          <div class="nc-input-group">
            <label class="nc-label">Network</label>
            <select class="nc-select" id="nc-withdraw-network">
              <option value="TRC20">TRON (TRC20) - Fee: 1.0 USDT</option>
              <option value="BEP20">BNB Smart Chain (BEP20) - Fee: 0.8 USDT</option>
              <option value="ERC20">Ethereum (ERC20) - Fee: 4.5 USDT</option>
            </select>
          </div>
          <div class="nc-input-group">
            <label class="nc-label">Recipient Wallet Address</label>
            <input type="text" class="nc-input" id="nc-withdraw-address" placeholder="Enter recipient wallet address" />
          </div>
          <div class="nc-input-group">
            <label class="nc-label">Amount (USDT)</label>
            <input type="number" class="nc-input" id="nc-withdraw-amount" placeholder="Min 10 USDT" />
          </div>
          <button class="nc-invest-btn" onclick="ncSubmitWithdrawal()">Submit Withdrawal Request</button>
        </div>
      </section>

      <!-- 6. TRANSACTIONS VIEW -->
      <section id="view-transactions" class="nc-view">
        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 16px;">Ledger & Transactions</h2>
        <div id="nc-tx-list"></div>
      </section>

      <!-- 7. PROFILE VIEW -->
      <section id="view-profile" class="nc-view">
        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 16px;">User Profile & Security</h2>
        <div style="background: var(--nc-surface-card); border: 1px solid var(--nc-border); border-radius: 12px; padding: 20px;">
          <p style="font-size: 14px; margin-bottom: 10px;"><strong>Account UID:</strong> <span style="font-family: monospace; color: var(--nc-emerald);">NX-982341-USD</span></p>
          <p style="font-size: 14px; margin-bottom: 10px;"><strong>Security Tier:</strong> 2FA Protected</p>
          <p style="font-size: 14px; color: var(--nc-text-muted);">In real production deployment, this view integrates with your backend user database session.</p>
        </div>
      </section>
    </main>
  </div>

  <!-- Mobile Bottom Navigation Bar -->
  <nav class="nc-mobile-bar">
    <button class="nc-tab-btn active" id="tab-home" onclick="ncSwitchView('home')">
      <span class="nc-tab-icon">🏠</span>
      <span>Home</span>
    </button>
    <button class="nc-tab-btn" id="tab-plans" onclick="ncSwitchView('plans')">
      <span class="nc-tab-icon">💎</span>
      <span>Plans</span>
    </button>
    <button class="nc-tab-btn" id="tab-claim" onclick="ncSwitchView('claim')">
      <span class="nc-tab-icon">⚡</span>
      <span>Claim</span>
    </button>
    <button class="nc-tab-btn" id="tab-referral" onclick="ncSwitchView('referral')">
      <span class="nc-tab-icon">👥</span>
      <span>Referral</span>
    </button>
    <button class="nc-tab-btn" id="tab-deposit" onclick="ncSwitchView('deposit')">
      <span class="nc-tab-icon">📥</span>
      <span>Deposit</span>
    </button>
  </nav>

  <!-- Invest Confirmation Modal -->
  <div class="nc-modal-backdrop" id="nc-invest-modal">
    <div class="nc-modal">
      <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;" id="nc-modal-plan-name">Confirm Contract</h3>
      <div style="font-size: 13px; line-height: 1.6; color: var(--nc-text-muted); margin-bottom: 16px;" id="nc-modal-plan-details">
        <!-- Details injected -->
      </div>
      <div style="display: flex; gap: 10px;">
        <button style="flex: 1; padding: 10px; background: rgba(255,255,255,0.1); border: none; border-radius: 8px; color: #fff; cursor: pointer;" onclick="ncCloseModal()">Cancel</button>
        <button class="nc-invest-btn" style="flex: 1; margin-top: 0;" id="nc-confirm-invest-btn" onclick="ncExecuteInvestment()">Invest Now</button>
      </div>
    </div>
  </div>
</div>

<script>
// Vanilla JS Application State Engine
(function() {
  const PLANS = [
    { id: 'p1', name: 'Starter Plan', deposit: 5, payout: 9, diff: 4, daily: 0.22, duration: 40 },
    { id: 'p2', name: 'Basic Plan', deposit: 10, payout: 18, diff: 8, daily: 0.45, duration: 40 },
    { id: 'p3', name: 'Standard Plan', deposit: 15, payout: 27, diff: 12, daily: 0.67, duration: 40 },
    { id: 'p4', name: 'Silver Plan', deposit: 20, payout: 36, diff: 16, daily: 0.90, duration: 40 },
    { id: 'p5', name: 'Gold Plan', deposit: 50, payout: 120, diff: 70, daily: 3.00, duration: 40 },
    { id: 'p6', name: 'Premium Plan', deposit: 100, payout: 250, diff: 150, daily: 6.30, duration: 40 }
  ];

  let state = {
    balance: 50.00,
    totalDeposited: 50.00,
    totalClaimed: 3.00,
    pendingCommission: 24.50,
    activeInvestments: [
      { id: 'inv-1', planName: 'Starter Plan', deposit: 5, daily: 0.22, claimed: 0.44, daysClaimed: 2, totalDays: 40, canClaim: true }
    ],
    selectedPlan: null
  };

  window.ncSwitchView = function(viewName) {
    document.querySelectorAll('.nc-view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nc-nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nc-tab-btn').forEach(el => el.classList.remove('active'));

    const target = document.getElementById('view-' + viewName);
    if (target) target.classList.add('active');

    const tab = document.getElementById('tab-' + viewName);
    if (tab) tab.classList.add('active');
  };

  function renderPlans() {
    const homeContainer = document.getElementById('nc-home-plans-container');
    const allContainer = document.getElementById('nc-all-plans-container');
    if (!homeContainer || !allContainer) return;

    let html = '';
    PLANS.forEach(p => {
      html += \`
        <div class="nc-plan-card \${p.deposit === 50 ? 'featured' : ''}">
          \${p.deposit === 50 ? '<span class="nc-plan-badge">Popular</span>' : ''}
          <div class="nc-plan-name">\${p.name}</div>
          <div class="nc-plan-deposit">\${p.deposit} <span>USDT</span></div>
          <div class="nc-plan-meta-row">
            <span class="nc-plan-meta-label">Total Payout</span>
            <span class="nc-plan-meta-val">\${p.payout} USDT</span>
          </div>
          <div class="nc-plan-meta-row">
            <span class="nc-plan-meta-label">Total Profit</span>
            <span class="nc-plan-meta-val" style="color: var(--nc-emerald);">+\${p.diff} USDT</span>
          </div>
          <div class="nc-plan-meta-row">
            <span class="nc-plan-meta-label">Daily Claim</span>
            <span class="nc-plan-meta-val">\${p.daily} USDT</span>
          </div>
          <div class="nc-plan-meta-row">
            <span class="nc-plan-meta-label">Contract Term</span>
            <span class="nc-plan-meta-val">\${p.duration} Days</span>
          </div>
          <button class="nc-invest-btn" onclick="ncOpenInvestModal('\${p.id}')">Invest Now</button>
        </div>
      \`;
    });

    allContainer.innerHTML = html;
    homeContainer.innerHTML = PLANS.slice(0, 3).map(p => \`
      <div class="nc-plan-card">
        <div class="nc-plan-name">\${p.name}</div>
        <div class="nc-plan-deposit">\${p.deposit} <span>USDT</span></div>
        <div class="nc-plan-meta-row"><span class="nc-plan-meta-label">Daily Claim</span><span class="nc-plan-meta-val">\${p.daily} USDT</span></div>
        <button class="nc-invest-btn" onclick="ncOpenInvestModal('\${p.id}')">Invest Now</button>
      </div>
    \`).join('');
  }

  function renderClaims() {
    const list = document.getElementById('nc-claim-list');
    if (!list) return;

    if (state.activeInvestments.length === 0) {
      list.innerHTML = '<div style="color: var(--nc-text-muted); font-size: 14px;">No active investments yet. Start a plan to claim daily yields!</div>';
      return;
    }

    list.innerHTML = state.activeInvestments.map((inv, idx) => \`
      <div class="nc-claim-card">
        <div class="nc-claim-header">
          <div>
            <div style="font-weight: 700; font-size: 15px;">\${inv.planName} (\${inv.deposit} USDT)</div>
            <div style="font-size: 12px; color: var(--nc-text-muted);">Days: \${inv.daysClaimed}/\${inv.totalDays} &bull; Claimed: \${inv.claimed.toFixed(2)} USDT</div>
          </div>
          <button class="nc-claim-btn" \${inv.canClaim ? '' : 'disabled'} onclick="ncExecuteClaim(\${idx})">
            \${inv.canClaim ? 'Claim Now (+' + inv.daily + ' USDT)' : 'Claimed Today'}
          </button>
        </div>
      </div>
    \`).join('');
  }

  window.ncOpenInvestModal = function(planId) {
    const p = PLANS.find(item => item.id === planId);
    if (!p) return;
    state.selectedPlan = p;
    document.getElementById('nc-modal-plan-name').innerText = 'Invest in ' + p.name;
    document.getElementById('nc-modal-plan-details').innerHTML = \`
      Deposit Requirement: <strong>\${p.deposit} USDT</strong><br/>
      Term Duration: <strong>\${p.duration} Days</strong><br/>
      Daily Reward: <strong>\${p.daily} USDT/day</strong><br/>
      Total Expected Payout: <strong>\${p.payout} USDT</strong><br/>
      Available Wallet: <strong>\${state.balance.toFixed(2)} USDT</strong>
    \`;
    document.getElementById('nc-invest-modal').classList.add('open');
  };

  window.ncCloseModal = function() {
    document.getElementById('nc-invest-modal').classList.remove('open');
  };

  window.ncExecuteInvestment = function() {
    const p = state.selectedPlan;
    if (!p) return;
    if (state.balance < p.deposit) {
      alert('Insufficient balance! Current balance: ' + state.balance.toFixed(2) + ' USDT. Please deposit funds first.');
      ncCloseModal();
      ncSwitchView('deposit');
      return;
    }
    state.balance -= p.deposit;
    state.activeInvestments.push({
      id: 'inv-' + Date.now(),
      planName: p.name,
      deposit: p.deposit,
      daily: p.daily,
      claimed: 0,
      daysClaimed: 0,
      totalDays: p.duration,
      canClaim: true
    });
    updateUI();
    ncCloseModal();
    alert('Congratulations! Staking active for ' + p.name + '. You can now claim daily rewards.');
    ncSwitchView('claim');
  };

  window.ncExecuteClaim = function(idx) {
    const inv = state.activeInvestments[idx];
    if (!inv || !inv.canClaim) return;
    inv.claimed += inv.daily;
    inv.daysClaimed += 1;
    inv.canClaim = false;
    state.balance += inv.daily;
    state.totalClaimed += inv.daily;
    updateUI();
    alert('Claimed ' + inv.daily + ' USDT! Credited to your wallet.');
  };

  window.ncCopyDepositAddress = function() {
    const txt = document.getElementById('nc-deposit-address-text').innerText.trim();
    navigator.clipboard.writeText(txt).then(() => {
      alert('Deposit address copied to clipboard!');
    });
  };

  window.ncPromptCustomAddress = function() {
    const newAddr = prompt('Enter your personal crypto deposit address:');
    if (newAddr && newAddr.trim().length > 10) {
      document.getElementById('nc-deposit-address-text').innerText = newAddr.trim();
      alert('Deposit address updated!');
    }
  };

  window.ncCopyRefLink = function() {
    const txt = document.getElementById('nc-ref-link-text').innerText.trim();
    navigator.clipboard.writeText(txt).then(() => {
      alert('Referral link copied to clipboard!');
    });
  };

  window.ncClaimReferralReward = function() {
    if (state.pendingCommission <= 0) {
      alert('No pending commission to claim.');
      return;
    }
    state.balance += state.pendingCommission;
    alert('Claimed +' + state.pendingCommission.toFixed(2) + ' USDT commission into liquid balance!');
    state.pendingCommission = 0;
    updateUI();
  };

  window.ncSubmitDepositTx = function() {
    const tx = document.getElementById('nc-deposit-txid').value.trim();
    if (!tx || tx.length < 10) {
      alert('Please enter a valid Transaction Hash / TxID from Binance or your wallet.');
      return;
    }
    alert('Transaction hash submitted! In production, the backend scanner verifies confirmations before crediting. For this demo, 20 USDT has been credited.');
    state.balance += 20;
    state.totalDeposited += 20;
    document.getElementById('nc-deposit-txid').value = '';
    updateUI();
    ncSwitchView('home');
  };

  window.ncSubmitWithdrawal = function() {
    const addr = document.getElementById('nc-withdraw-address').value.trim();
    const amt = parseFloat(document.getElementById('nc-withdraw-amount').value);
    if (!addr) {
      alert('Please enter a destination wallet address.');
      return;
    }
    if (!amt || amt < 10) {
      alert('Minimum withdrawal amount is 10 USDT.');
      return;
    }
    if (amt > state.balance) {
      alert('Withdrawal amount exceeds available balance.');
      return;
    }
    state.balance -= amt;
    updateUI();
    alert('Withdrawal request submitted! Status: Processing (Estimated 5-15 mins).');
    document.getElementById('nc-withdraw-address').value = '';
    document.getElementById('nc-withdraw-amount').value = '';
  };

  function updateUI() {
    document.getElementById('nc-header-balance').innerText = state.balance.toFixed(2) + ' USDT';
    const hb = document.getElementById('nc-home-balance');
    if (hb) hb.innerText = state.balance.toFixed(2);
    const sa = document.getElementById('nc-stat-active');
    if (sa) sa.innerText = state.activeInvestments.length;
    const sc = document.getElementById('nc-stat-claimed');
    if (sc) sc.innerText = state.totalClaimed.toFixed(2) + ' USDT';
    const sd = document.getElementById('nc-stat-deposited');
    if (sd) sd.innerText = state.totalDeposited.toFixed(2) + ' USDT';
    const rp = document.getElementById('nc-ref-pending');
    if (rp) rp.innerText = state.pendingCommission.toFixed(2) + ' USDT';
    renderClaims();
  }

  // Init
  renderPlans();
  renderClaims();
  updateUI();
})();
</script>
`;
}
