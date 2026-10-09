import React, { useState } from 'react';
import {
  Home,
  ArrowDownToLine,
  ArrowLeftRight,
  PiggyBank,
  Compass,
  Menu,
  Bell,
  Search,
  Wifi,
  Battery,
  Signal,
  CheckCircle,
  X,
  CreditCard,
  PhoneCall,
  MapPin,
  Lock,
} from 'lucide-react';
import { UserProfile, BankAccount, CheckDepositRecord, SetAsideBill } from '../../types/banking';
import { AccountsTab } from './AccountsTab';
import { DepositTab } from './DepositTab';
import { SetAsideTab } from './SetAsideTab';
import { PayTransferTab } from './PayTransferTab';
import { AccountDetailModal } from './AccountDetailModal';
import { AskFargoModal } from './AskFargoModal';
import { AccountOpenFlow } from './AccountOpenFlow';
import { WfLogo } from '../common/WfLogo';

interface MobileShellProps {
  userData: UserProfile;
  onUpdateUserData: (data: UserProfile) => void;
  onSignOff: () => void;
  onOpenSignOn: () => void;
  isStandalonePhoneFrame?: boolean;
  onSwitchToWeb?: () => void;
  onOpenWorkflows?: () => void;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  userData,
  onUpdateUserData,
  onSignOff,
  onOpenSignOn,
  isStandalonePhoneFrame = true,
  onSwitchToWeb,
  onOpenWorkflows,
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'deposit' | 'pay' | 'set-aside' | 'explore' | 'menu'>('accounts');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isFargoOpen, setIsFargoOpen] = useState(false);
  const [isOpeningAccount, setIsOpeningAccount] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Handler for making loan payment
  const handleMakeLoanPayment = (accountId: string, amount: number) => {
    const updatedAccounts = userData.accounts.map((acc) => {
      if (acc.id === accountId) {
        const newPrincipal = Math.max(0, (acc.principalBalance || acc.availableBalance) - amount);
        const newPastDue = Math.max(0, (acc.pastDueAmount || 0) - amount);
        const newTotalDue = Math.max(0, (acc.totalAmountDue || 0) - amount);
        return {
          ...acc,
          availableBalance: newPrincipal,
          principalBalance: newPrincipal,
          pastDueAmount: newPastDue,
          totalAmountDue: newTotalDue,
          transactions: [
            {
              id: `tx-pay-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US'),
              description: 'WEB DIRECTDEBIT PAYMENT - THANK YOU',
              amount,
              type: 'credit' as const,
              category: 'Payment' as const,
            },
            ...acc.transactions,
          ],
        };
      }
      if (acc.id === 'checking-0987') {
        return {
          ...acc,
          availableBalance: acc.availableBalance - amount,
          transactions: [
            {
              id: `tx-debit-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US'),
              description: 'PAYMENT TO LOAN #5821',
              amount,
              type: 'debit' as const,
              category: 'Payment' as const,
            },
            ...acc.transactions,
          ],
        };
      }
      return acc;
    });

    onUpdateUserData({ ...userData, accounts: updatedAccounts });
  };

  // Handler for autopay toggle
  const handleToggleAutopay = (accountId: string) => {
    const updated = userData.accounts.map((acc) =>
      acc.id === accountId ? { ...acc, autopayEnabled: !acc.autopayEnabled } : acc
    );
    onUpdateUserData({ ...userData, accounts: updated });
    if (selectedAccount?.id === accountId) {
      setSelectedAccount({
        ...selectedAccount,
        autopayEnabled: !selectedAccount.autopayEnabled,
      });
    }
  };

  // Handler for completed deposit
  const handleDepositComplete = (record: CheckDepositRecord) => {
    const updatedAccounts = userData.accounts.map((acc) => {
      if (acc.id === record.targetAccountId) {
        return {
          ...acc,
          availableBalance: acc.availableBalance + record.availableTodayAmount,
          transactions: [
            {
              id: `tx-dep-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US'),
              description: `MOBILE CHECK DEPOSIT - CONF #${record.confirmationNumber}`,
              amount: record.amount,
              type: 'credit' as const,
              category: 'Income' as const,
            },
            ...acc.transactions,
          ],
        };
      }
      return acc;
    });

    onUpdateUserData({
      ...userData,
      accounts: updatedAccounts,
      recentDeposits: [record, ...userData.recentDeposits],
    });
  };

  // Handler for paying a bill in Set Aside
  const handlePayBill = (billId: string, amount: number) => {
    const updatedBills = userData.bills.map((b) =>
      b.id === billId ? { ...b, status: 'ready' as const, savedAmount: b.totalAmount } : b
    );

    const updatedAccounts = userData.accounts.map((a) => {
      if (a.id === 'checking-0987') {
        return {
          ...a,
          availableBalance: Math.max(0, a.availableBalance - amount),
          transactions: [
            {
              id: `tx-bill-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US'),
              description: `SET ASIDE BILL PAYMENT`,
              amount,
              type: 'debit' as const,
              category: 'Bills & Utilities' as const,
            },
            ...a.transactions,
          ],
        };
      }
      return a;
    });

    onUpdateUserData({ ...userData, bills: updatedBills, accounts: updatedAccounts });
  };

  // Handler for adding funds to a bill in Set Aside
  const handleAddFundsToBill = (billId: string, amount: number) => {
    const updatedBills = userData.bills.map((b) => {
      if (b.id === billId) {
        const newSaved = Math.min(b.totalAmount, b.savedAmount + amount);
        return {
          ...b,
          savedAmount: newSaved,
          status: newSaved >= b.totalAmount ? ('ready' as const) : ('saving' as const),
        };
      }
      return b;
    });

    const updatedAccounts = userData.accounts.map((a) => {
      if (a.id === 'checking-0987') {
        return {
          ...a,
          availableBalance: Math.max(0, a.availableBalance - amount),
        };
      }
      return a;
    });

    onUpdateUserData({ ...userData, bills: updatedBills, accounts: updatedAccounts });
  };

  // Handler for creating a bill in Set Aside
  const handleAddBill = (newBill: SetAsideBill) => {
    onUpdateUserData({
      ...userData,
      bills: [...userData.bills, newBill],
    });
  };

  // Handler for internal or Zelle transfers
  const handleExecuteTransfer = (fromId: string, toId: string, amount: number, memo: string) => {
    const updatedAccounts = userData.accounts.map((acc) => {
      if (acc.id === fromId) {
        return {
          ...acc,
          availableBalance: acc.availableBalance - amount,
          transactions: [
            {
              id: `tx-out-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US'),
              description: memo || 'TRANSFER OUT',
              amount,
              type: 'debit' as const,
              category: 'Transfers' as const,
            },
            ...acc.transactions,
          ],
        };
      }
      if (acc.id === toId) {
        return {
          ...acc,
          availableBalance: acc.availableBalance + amount,
          transactions: [
            {
              id: `tx-in-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US'),
              description: memo || 'TRANSFER IN',
              amount,
              type: 'credit' as const,
              category: 'Transfers' as const,
            },
            ...acc.transactions,
          ],
        };
      }
      return acc;
    });

    onUpdateUserData({ ...userData, accounts: updatedAccounts });
  };

  return (
    <div
      className={`mx-auto bg-stone-100 flex flex-col transition-all overflow-hidden ${
        isStandalonePhoneFrame
          ? 'max-w-[420px] rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-[8px] border-stone-800 my-4 min-h-[820px]'
          : 'w-full min-h-[720px] rounded-none border-0'
      }`}
    >
      {/* Phone Status Bar (matching iOS/Android screenshots) */}
      <div className="bg-gradient-to-b from-[#d9e2ec]/60 to-transparent px-6 pt-3 pb-1 flex justify-between items-center text-xs font-semibold text-stone-800 select-none shrink-0 z-20">
        <span>4:08</span>
        {/* Dynamic Island / Speaker Pill */}
        <div className="w-24 h-4 bg-stone-900 rounded-full mx-auto -mt-1 hidden sm:block shadow-inner" />
        <div className="flex items-center gap-1.5 text-stone-700">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Wells Fargo Brand Header with Official Logo for Android Phone */}
      <div className="bg-[#d71e28] text-white px-4 py-2 flex items-center justify-between shadow-xs select-none shrink-0 z-20">
        <WfLogo size="sm" variant="white" subtitle="MOBILE" />
        <div className="flex items-center gap-1.5">
          {onSwitchToWeb && (
            <button
              onClick={onSwitchToWeb}
              className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors"
              title="Switch to Web Banking"
            >
              Web
            </button>
          )}
        </div>
      </div>

      {/* Top Mobile App Header (matching EVD-app_promo-290x582.png) */}
      <header className="bg-gradient-to-b from-[#d9e2ec]/50 to-[#eef2f7]/30 px-4 py-2 flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Search with Ask Fargo Button */}
        <button
          onClick={() => setIsFargoOpen(true)}
          className="flex-1 bg-white/90 backdrop-blur-xs border border-stone-200/80 rounded-full px-3 py-1.5 flex items-center justify-between text-xs text-stone-500 shadow-2xs hover:bg-white transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-normal">Ask Fargo</span>
          </div>
          {/* Distinctive Wells Fargo Fargo icon */}
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7414CA] to-[#9b1d64] flex items-center justify-center text-white text-[10px] font-bold shadow-2xs">
            f
          </div>
        </button>

        {/* Notifications and Sign Off */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-stone-700 hover:text-stone-950 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {userData.unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d71e28] text-white text-[9px] font-bold px-1 py-0.2 rounded-full min-w-[16px] text-center shadow-2xs">
                  {userData.unreadNotifications}+
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-8 w-64 bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-30 animate-in fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-800">Notifications</span>
                  <button onClick={() => setShowNotifications(false)}>
                    <X className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                </div>
                <div className="py-2 space-y-2 text-xs">
                  <div className="p-2 bg-stone-50 rounded-lg">
                    <span className="font-semibold text-stone-900 block">Direct Deposit Received</span>
                    <span className="text-[11px] text-stone-500">$2,450.00 from ACME Corp was deposited.</span>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-lg">
                    <span className="font-semibold text-stone-900 block">FICO Score Updated</span>
                    <span className="text-[11px] text-stone-500">Your score increased by 10 points!</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onSignOff}
            className="text-xs font-semibold text-stone-700 hover:text-[#d71e28] transition-colors"
          >
            Sign off
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#eef2f7]/30 via-white to-white pb-20">
        {isOpeningAccount ? (
          <AccountOpenFlow
            onContinue={() => {
              setIsOpeningAccount(false);
              setActiveTab('accounts');
            }}
          />
        ) : activeTab === 'accounts' ? (
          <AccountsTab
            userData={userData}
            onSelectAccount={(acc) => setSelectedAccount(acc)}
            onOpenNewAccount={() => setIsOpeningAccount(true)}
            onOpenAskFargo={() => setIsFargoOpen(true)}
          />
        ) : activeTab === 'deposit' ? (
          <DepositTab
            accounts={userData.accounts}
            onDepositComplete={handleDepositComplete}
          />
        ) : activeTab === 'pay' ? (
          <PayTransferTab
            accounts={userData.accounts}
            onExecuteTransfer={handleExecuteTransfer}
          />
        ) : activeTab === 'set-aside' ? (
          <SetAsideTab
            bills={userData.bills}
            checkingBalance={
              userData.accounts.find((a) => a.id === 'checking-0987')?.availableBalance || 0
            }
            onPayBill={handlePayBill}
            onAddFundsToBill={handleAddFundsToBill}
            onAddBill={handleAddBill}
          />
        ) : activeTab === 'explore' ? (
          <div className="p-5 space-y-4">
            <h2 className="font-serif text-2xl text-stone-900">Explore Financial Products</h2>
            <div className="space-y-3">
              <div
                onClick={() => setIsOpeningAccount(true)}
                className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs cursor-pointer hover:border-[#d71e28] transition-all"
              >
                <div className="flex items-center gap-2 text-[#d71e28] font-bold text-xs">
                  <CreditCard className="w-4 h-4" />
                  <span>$325 Checking Bonus</span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Open Everyday Checking and receive $325 with qualifying direct deposits within 90 days.
                </p>
              </div>

              <div
                onClick={() => setIsOpeningAccount(true)}
                className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs cursor-pointer hover:border-[#d71e28] transition-all"
              >
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                  <CreditCard className="w-4 h-4 text-purple-700" />
                  <span>Wells Fargo Autograph® Card</span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Earn 20,000 bonus points after spending $1,000 in the first 3 months.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Menu Tab */
          <div className="p-5 space-y-4">
            <h2 className="font-serif text-2xl text-stone-900">Menu & Services</h2>
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden text-xs">
              <button
                onClick={() => setIsOpeningAccount(true)}
                className="w-full text-left p-3.5 hover:bg-stone-50 font-medium text-stone-800 flex justify-between items-center"
              >
                <span>Open New Account</span>
                <span className="text-[#d71e28] font-semibold">Bonus JA23OU</span>
              </button>
              <button
                onClick={() => setIsFargoOpen(true)}
                className="w-full text-left p-3.5 hover:bg-stone-50 font-medium text-stone-800 flex justify-between items-center"
              >
                <span>Ask Fargo® Virtual Assistant</span>
                <span className="text-purple-700 font-semibold">Insights</span>
              </button>
              <button
                onClick={() => setActiveTab('set-aside')}
                className="w-full text-left p-3.5 hover:bg-stone-50 font-medium text-stone-800 flex justify-between items-center"
              >
                <span>Set Aside (Bill Budgeting)</span>
                <span className="text-emerald-700 font-semibold">5 Envelopes</span>
              </button>
              <button
                onClick={onSignOff}
                className="w-full text-left p-3.5 hover:bg-stone-50 font-semibold text-[#d71e28] flex justify-between items-center"
              >
                <span>Sign Off Account</span>
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Tab Navigation Bar (matching EVD-app_promo & how-it-works screenshots) */}
      <nav className="fixed md:absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {/* Accounts Tab */}
        <button
          onClick={() => {
            setIsOpeningAccount(false);
            setActiveTab('accounts');
          }}
          className={`flex flex-col items-center py-1 px-2 transition-colors ${
            activeTab === 'accounts' && !isOpeningAccount
              ? 'text-[#d71e28]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold mt-0.5">Accounts</span>
        </button>

        {/* Deposit Tab */}
        <button
          onClick={() => {
            setIsOpeningAccount(false);
            setActiveTab('deposit');
          }}
          className={`flex flex-col items-center py-1 px-2 transition-colors ${
            activeTab === 'deposit'
              ? 'text-[#d71e28]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <ArrowDownToLine className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold mt-0.5">Deposit</span>
        </button>

        {/* Pay & Transfer Tab */}
        <button
          onClick={() => {
            setIsOpeningAccount(false);
            setActiveTab('pay');
          }}
          className={`flex flex-col items-center py-1 px-2 transition-colors ${
            activeTab === 'pay'
              ? 'text-[#d71e28]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold mt-0.5">Pay & Transfer</span>
        </button>

        {/* Set Aside Tab (From Set_Aside.jpg) */}
        <button
          onClick={() => {
            setIsOpeningAccount(false);
            setActiveTab('set-aside');
          }}
          className={`flex flex-col items-center py-1 px-2 transition-colors ${
            activeTab === 'set-aside'
              ? 'text-[#d71e28]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <PiggyBank className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold mt-0.5">Set Aside</span>
        </button>

        {/* Explore Tab */}
        <button
          onClick={() => {
            setIsOpeningAccount(false);
            setActiveTab('explore');
          }}
          className={`flex flex-col items-center py-1 px-2 transition-colors ${
            activeTab === 'explore'
              ? 'text-[#d71e28]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Compass className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold mt-0.5">Explore</span>
        </button>

        {/* Menu Tab */}
        <button
          onClick={() => {
            setIsOpeningAccount(false);
            setActiveTab('menu');
          }}
          className={`flex flex-col items-center py-1 px-2 transition-colors ${
            activeTab === 'menu'
              ? 'text-[#d71e28]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold mt-0.5">Menu</span>
        </button>
      </nav>

      {/* Account Details Modal (Loan details or Checking details) */}
      <AccountDetailModal
        account={selectedAccount}
        isOpen={Boolean(selectedAccount)}
        onClose={() => setSelectedAccount(null)}
        onMakePayment={handleMakeLoanPayment}
        onToggleAutopay={handleToggleAutopay}
      />

      {/* Ask Fargo AI Assistant Modal */}
      <AskFargoModal
        isOpen={isFargoOpen}
        onClose={() => setIsFargoOpen(false)}
        userData={userData}
        onNavigateToTab={(tab) => {
          setIsOpeningAccount(false);
          setActiveTab(tab as any);
        }}
      />
    </div>
  );
};
