import React from 'react';
import { CryptoProvider, useCrypto } from './context/CryptoContext';
import { TopHeader } from './components/TopHeader';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Toast } from './components/Toast';
import { SystemNoticeModal } from './components/SystemNoticeModal';
import { BloggerGuideModal } from './components/BloggerGuideModal';
import { InstallAppModal } from './components/InstallAppModal';

import { HomeView } from './views/HomeView';
import { PlansView } from './views/PlansView';
import { DailyClaimView } from './views/DailyClaimView';
import { DepositView } from './views/DepositView';
import { WithdrawView } from './views/WithdrawView';
import { MyInvestmentsView } from './views/MyInvestmentsView';
import { TransactionsView } from './views/TransactionsView';
import { ProfileView } from './views/ProfileView';
import { SupportView } from './views/SupportView';
import { ReferralView } from './views/ReferralView';
import { AdminPanelView } from './views/AdminPanelView';

function MainAppContent() {
  const { selectedNav, isAdminMode, installModalOpen, setInstallModalOpen } = useCrypto();

  const renderActiveView = () => {
    // If admin nav is selected or admin mode activated
    if (selectedNav === 'admin') {
      return <AdminPanelView />;
    }

    switch (selectedNav) {
      case 'home':
        return <HomeView />;
      case 'plans':
        return <PlansView />;
      case 'claim':
        return <DailyClaimView />;
      case 'referral':
        return <ReferralView />;
      case 'deposit':
        return <DepositView />;
      case 'withdraw':
        return <WithdrawView />;
      case 'my-investments':
        return <MyInvestmentsView />;
      case 'transactions':
        return <TransactionsView />;
      case 'profile':
        return <ProfileView />;
      case 'support':
        return <SupportView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080E1E] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Bar Header */}
      <TopHeader />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Left Sidebar */}
        <Sidebar />

        {/* View Port Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full pb-24 lg:pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Modals & Overlays */}
      <SystemNoticeModal />
      <BloggerGuideModal />
      <InstallAppModal isOpen={installModalOpen} onClose={() => setInstallModalOpen(false)} />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <CryptoProvider>
      <MainAppContent />
    </CryptoProvider>
  );
}
