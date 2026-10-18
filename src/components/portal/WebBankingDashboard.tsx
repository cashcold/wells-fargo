import React, { useState } from 'react';
import {
  Landmark,
  CreditCard,
  PiggyBank,
  ArrowLeftRight,
  ArrowDownToLine,
  Search,
  ChevronRight,
  ChevronLeft,
  Star,
  Lock,
  Phone,
  HelpCircle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Eye,
  EyeOff,
  Sparkles,
  Calendar,
  Menu,
  X,
  User,
  Printer,
  Sliders,
  TrendingUp,
  DollarSign,
  Download,
  Smartphone,
} from 'lucide-react';
import { UserProfile, BankAccount, CheckDepositRecord, SetAsideBill, Transaction } from '../../types/banking';
import { WfLogo } from '../common/WfLogo';
import { FdicDisclaimer } from '../common/FdicDisclaimer';
import { DepositTab } from '../mobile/DepositTab';
import { SetAsideTab } from '../mobile/SetAsideTab';
import { PayTransferTab } from '../mobile/PayTransferTab';
import { AccountDetailModal } from '../mobile/AccountDetailModal';
import { AskFargoModal } from '../mobile/AskFargoModal';
import { useGreeting } from '../../utils/greeting';
import { OnlineMobileSecurityModal } from '../common/OnlineMobileSecurityModal';
import { AccountOpenFlow } from '../mobile/AccountOpenFlow';
import { SignatureCardModal } from './SignatureCardModal';
import { UserDetailsModal } from './UserDetailsModal';
import { LoanConfiguratorModal } from './LoanConfiguratorModal';
import { downloadLoanDisclosurePdf } from '../../utils/loanPdfGenerator';
import { TreasuryBillView } from './TreasuryBillView';
import { WellsTradeAccountChoiceView } from './WellsTradeAccountChoiceView';
import { downloadAccountStatementPdf, downloadTransactionReceiptPdf } from '../../utils/transactionPdfGenerator';
import { TransactionDetailModal } from '../common/TransactionDetailModal';
import { UserProfileAvatar } from '../common/UserProfileAvatar';
import { ImageCropPositionModal } from '../common/ImageCropPositionModal';
import { compressImageFile } from '../../utils/imageUtils';
import { authService } from '../../services/authService';

interface WebBankingDashboardProps {
  userData: UserProfile;
  onUpdateUserData: (data: UserProfile) => void;
  onSignOff: () => void;
  onOpenPublicPortal: () => void;
  onOpenSignatureCard: () => void;
  onOpenAccountOpenFlow: () => void;
  onOpenAskFargo: () => void;
  onOpenWorkflows?: () => void;
  onOpenAdminPortal?: () => void;
}

export const WebBankingDashboard: React.FC<WebBankingDashboardProps> = ({
  userData,
  onUpdateUserData,
  onSignOff,
  onOpenPublicPortal,
  onOpenSignatureCard,
  onOpenAccountOpenFlow,
  onOpenAskFargo,
  onOpenWorkflows,
  onOpenAdminPortal,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'accounts'
    | 'transfer'
    | 'deposit'
    | 'set-aside'
    | 'loans'
    | 'treasury'
    | 'wellstrade'
    | 'open-account'
    | 'signature-card'
    | 'profile'
  >('accounts');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isFargoOpen, setIsFargoOpen] = useState(false);
  const [isSignatureCardOpen, setIsSignatureCardOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isLoanConfigOpen, setIsLoanConfigOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hideBalances, setHideBalances] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [selectedTxForModal, setSelectedTxForModal] = useState<{ tx: Transaction; account: BankAccount } | null>(null);
  const [statementToast, setStatementToast] = useState(false);
  const [photoCropSrc, setPhotoCropSrc] = useState<string | null>(null);
  const [showPhotoLockNotice, setShowPhotoLockNotice] = useState(false);
  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);
  const greeting = useGreeting();

  const handleAvatarFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setPhotoCropSrc(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhotoCropSrc(dataUrl);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleAvatarCropComplete = async (croppedDataUrl: string) => {
    const updatedProfile: UserProfile = {
      ...userData,
      idPhotoUrl: croppedDataUrl,
      avatarUrl: croppedDataUrl,
      registrationData: {
        ...(userData.registrationData || {}),
        idPhotoUrl: croppedDataUrl,
      } as any,
    };
    onUpdateUserData(updatedProfile);
    const username = userData.registrationData?.username || userData.name;
    await authService.updateUserProfile(username, updatedProfile);
    setPhotoCropSrc(null);
  };

  // Scroll ref & controls for mobile/desktop navigation tabs
  const navScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = React.useCallback(() => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  }, []);

  React.useEffect(() => {
    checkScrollButtons();
    const el = navScrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollButtons, { passive: true });
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        el.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [checkScrollButtons]);

  // Center active tab into view whenever tab changes
  React.useEffect(() => {
    if (navScrollRef.current) {
      const activeBtn = navScrollRef.current.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
    checkScrollButtons();
  }, [activeTab, checkScrollButtons]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      navScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const checkingAcc =
    userData.accounts.find((a) => a.type === 'checking') ||
    userData.accounts[0] || {
      id: 'checking-0987',
      name: 'EVERYDAY CHECKING',
      accountNumber: '..0987',
      routingNumber: '061000227',
      type: 'checking' as const,
      availableBalance: 0,
      currentBalance: 0,
      transactions: [],
    };
  const savingsAcc =
    userData.accounts.find((a) => a.type === 'savings') ||
    userData.accounts[1] || {
      id: 'savings-3478',
      name: 'WAY2SAVE SAVINGS',
      accountNumber: '..3478',
      routingNumber: '061000227',
      type: 'savings' as const,
      availableBalance: 0,
      currentBalance: 0,
      transactions: [],
    };
  const creditAcc = userData.accounts.find((a) => a.type === 'credit') || null;
  const loanAcc =
    userData.accounts.find((a) => a.type === 'loan') || {
      id: 'loan-5821',
      name: 'WELLS FARGO AUTO & PERSONAL LOAN',
      accountNumber: '..5821',
      routingNumber: '061000227',
      type: 'loan' as const,
      availableBalance: 0,
      principalBalance: 0,
      nextPaymentDue: '10/31/2026',
      nextPaymentAmount: 0,
      principalAndInterest: 0,
      pastDueAmount: 0,
      totalAmountDue: 0,
      autopayEnabled: false,
      transactions: [],
    };

  const totalLiquid = (checkingAcc?.availableBalance || 0) + (savingsAcc?.availableBalance || 0);

  // Handler for loan payment
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

  // Handler for configuring loan amount (up to $100,000,000.00 USD)
  const handleUpdateLoanAmount = (
    accountId: string,
    newPrincipal: number,
    monthlyPayment: number,
    termMonths: number,
    apr: number
  ) => {
    const updatedAccounts = userData.accounts.map((acc) => {
      if (acc.id === accountId || acc.type === 'loan') {
        return {
          ...acc,
          principalBalance: newPrincipal,
          nextPaymentAmount: monthlyPayment,
          principalAndInterest: monthlyPayment * 0.9,
          totalAmountDue: monthlyPayment,
          transactions: [
            {
              id: `tx-loan-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US'),
              description: `LOAN PRINCIPAL ADJUSTMENT - $${newPrincipal.toLocaleString('en-US', { maximumFractionDigits: 0 })} (${apr}% APR / ${termMonths} MO)`,
              amount: newPrincipal,
              type: 'credit' as const,
              category: 'Transfers' as const,
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
    });
  };

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

  const handleDepositComplete = (record: CheckDepositRecord) => {
    // Deposit is pending admin approval - do NOT credit balance yet
    onUpdateUserData({
      ...userData,
      recentDeposits: [record, ...(userData.recentDeposits || [])],
    });
  };

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

  const handleAddBill = (newBill: SetAsideBill) => {
    onUpdateUserData({
      ...userData,
      bills: [...userData.bills, newBill],
    });
  };

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
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      {/* Top Wells Fargo Red Banner with Gold Underline - Ultra-compact header */}
      <header className="bg-[#d71e28] text-white border-b-2 border-[#ffcc00] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Single Compact Header Row */}
          <div className="h-12 sm:h-14 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenPublicPortal}
                className="text-left focus:outline-none"
                title="Return to Wells Fargo Home"
              >
                <WfLogo size="md" variant="white" />
              </button>
              <div
                onClick={() => setIsUserDetailsOpen(true)}
                className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/20 cursor-pointer hover:opacity-90 transition-opacity"
                title="View Account Profile & Verified ID"
              >
                {(userData.avatarUrl || userData.idPhotoUrl) && (
                  <img
                    src={userData.avatarUrl || userData.idPhotoUrl}
                    alt={userData.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#ffcc00] shadow-2xs bg-white"
                  />
                )}
                <span className="text-xs text-white/90 font-medium">
                  {greeting}, {userData.name}!
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Registration & Profile Details Button */}
              <button
                onClick={() => setIsUserDetailsOpen(true)}
                className="inline-flex items-center gap-1.5 bg-black/25 hover:bg-black/35 text-white px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors border border-white/20"
                title="View registration information and profile details"
              >
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">My Registration Info</span>
              </button>

              {/* Link to Wells Fargo Homepage */}
              <button
                onClick={onOpenPublicPortal}
                className="hidden md:inline-flex items-center gap-1 text-xs text-white/90 hover:text-white bg-black/15 hover:bg-black/25 px-2.5 py-1.5 rounded transition-colors"
                title="Visit WellsFargo.com Public Home"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#ffcc00]" />
                <span>WellsFargo.com</span>
              </button>

              {/* Ask Fargo Virtual Assistant button */}
              <button
                onClick={onOpenAskFargo}
                className="inline-flex items-center gap-1.5 bg-[#521375] hover:bg-[#681994] text-white px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-2xs"
                title="Ask Fargo Virtual Assistant"
              >
                <span className="w-4 h-4 rounded-full bg-white text-[#521375] flex items-center justify-center font-bold text-[10px]">
                  f
                </span>
                <span className="hidden sm:inline">Ask Fargo®</span>
              </button>

              {/* Sign Off */}
              <button
                onClick={onSignOff}
                className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-stone-200 bg-black/25 hover:bg-black/35 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
                title="Sign off your account"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign Off</span>
              </button>

              {/* Hamburger Side Menu Toggle */}
              <button
                onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
                className="p-1.5 bg-[#a8131c] hover:bg-[#8e1017] rounded text-white transition-colors"
                aria-label="Toggle Banking Menu"
              >
                {isSideMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Navigation Tabs on Web Banking - Compact Single Row with Smooth Scrolling & Touch Controls */}
          <div className="relative w-full max-w-full my-0.5 overflow-hidden">
            {/* Left Scroll Button on mobile & desktop */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 bg-[#a8131c] hover:bg-[#8e1017] text-white rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ring-2 ring-white/40 active:scale-95"
                aria-label="Scroll tabs left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <nav
              ref={navScrollRef}
              className="tab-scroll-container w-full min-w-0 flex items-center gap-1.5 sm:gap-2 pb-2 pt-0.5 text-xs font-bold whitespace-nowrap scroll-smooth overflow-x-auto px-2 sm:px-4"
              style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
            >
              <button
                data-tab="accounts"
                onClick={() => setActiveTab('accounts')}
                className={`px-3 py-1.5 rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'accounts'
                    ? 'bg-white text-[#d71e28] shadow-xs ring-1 ring-black/10'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                Accounts Summary
              </button>

              <button
                data-tab="transfer"
                onClick={() => setActiveTab('transfer')}
                className={`px-3 py-1.5 rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'transfer'
                    ? 'bg-white text-[#d71e28] shadow-xs ring-1 ring-black/10'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                Transfer & Pay
              </button>

              <button
                data-tab="deposit"
                onClick={() => setActiveTab('deposit')}
                className={`px-3 py-1.5 rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'deposit'
                    ? 'bg-white text-[#d71e28] shadow-xs ring-1 ring-black/10'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                Deposit Checks
              </button>

              <button
                data-tab="set-aside"
                onClick={() => setActiveTab('set-aside')}
                className={`px-3 py-1.5 rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'set-aside'
                    ? 'bg-white text-[#d71e28] shadow-xs ring-1 ring-black/10'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                Set Aside™ (Bills)
              </button>

              <button
                data-tab="loans"
                onClick={() => setActiveTab('loans')}
                className={`px-3 py-1.5 rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'loans'
                    ? 'bg-white text-[#d71e28] shadow-xs ring-1 ring-black/10'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                Loans & Credit Details
              </button>

              <button
                data-tab="treasury"
                onClick={() => setActiveTab('treasury')}
                className={`px-3 py-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'treasury'
                    ? 'bg-white text-[#d71e28] shadow-xs ring-1 ring-black/10'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                <span>Treasury Bills (T-Bills)</span>
                <span className="bg-[#ffcc00] text-stone-900 text-[10px] px-1.5 py-0.2 rounded font-black">
                  Auctions
                </span>
              </button>

              <button
                data-tab="wellstrade"
                onClick={() => setActiveTab('wellstrade')}
                className={`px-3 py-1.5 rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'wellstrade'
                    ? 'bg-white text-[#d71e28] shadow-xs ring-1 ring-black/10'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                WellsTrade<sup>®</sup> Brokerage
              </button>

              <button
                data-tab="open-account"
                onClick={() => setActiveTab('open-account')}
                className={`px-3 py-1.5 rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'open-account'
                    ? 'bg-white text-[#d71e28] shadow-xs ring-1 ring-black/10'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                Open Account (JA23OU)
              </button>

              <button
                data-tab="profile"
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded-md transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-white text-[#d71e28] shadow-xs ring-1 ring-black/10'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                My Profile & Registration
              </button>
            </nav>

            {/* Right Scroll Button on mobile & desktop */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 bg-[#a8131c] hover:bg-[#8e1017] text-white rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ring-2 ring-white/40 active:scale-95"
                aria-label="Scroll tabs right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Side Drawer for Secondary Banking Tools */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Top Header with Close Button */}
              <div className="p-4 bg-[#d71e28] text-white flex items-center justify-between border-b border-red-700">
                <div className="flex items-center gap-2">
                  <WfLogo size="sm" variant="white" />
                  <span className="text-xs font-bold uppercase tracking-wider">Navigation Menu</span>
                </div>
                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="p-1 rounded bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Drawer User Bar */}
              <div className="bg-stone-50 p-4 border-b border-stone-200">
                <span className="text-xs font-bold text-stone-900 block">{userData.name}</span>
                <span className="text-[11px] text-stone-500 font-mono">Routing: 061000227</span>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Session</span>
                </div>
              </div>

              {/* Primary Navigation Tabs inside Mobile Drawer */}
              <div className="p-3 bg-stone-100/90 border-b border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-2 px-1">
                  Banking Navigation Tabs
                </span>
                <div className="space-y-1">
                  {[
                    { id: 'accounts', label: 'Accounts Summary' },
                    { id: 'transfer', label: 'Transfer & Pay' },
                    { id: 'deposit', label: 'Deposit Checks' },
                    { id: 'set-aside', label: 'Set Aside™ (Bills)' },
                    { id: 'loans', label: 'Loans & Credit Details' },
                    { id: 'treasury', label: 'Treasury Bills (T-Bills)', badge: 'Auctions' },
                    { id: 'wellstrade', label: 'WellsTrade® Brokerage' },
                    { id: 'open-account', label: 'Open Account (JA23OU)' },
                    { id: 'profile', label: 'My Profile & Registration' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setIsSideMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-[#d71e28] text-white shadow-xs'
                          : 'text-stone-800 hover:bg-stone-200/70 bg-white border border-stone-200/60'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.badge ? (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                            activeTab === tab.id
                              ? 'bg-white text-[#d71e28]'
                              : 'bg-[#ffcc00] text-stone-900'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      ) : (
                        <ChevronRight
                          className={`w-3.5 h-3.5 ${
                            activeTab === tab.id ? 'text-white' : 'text-stone-400'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Menu Links */}
              <div className="divide-y divide-stone-100 text-xs">
                {onOpenAdminPortal && (
                  <button
                    onClick={() => {
                      setIsSideMenuOpen(false);
                      onOpenAdminPortal();
                    }}
                    className="w-full px-4 py-3 text-left font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Admin Operations & Approvals</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-amber-600" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    setIsUserDetailsOpen(true);
                  }}
                  className="w-full px-4 py-3 text-left font-semibold text-stone-800 hover:bg-stone-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#d71e28]" />
                    <span>View Registration & Profile Details</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    onOpenAskFargo();
                  }}
                  className="w-full px-4 py-3 text-left font-semibold text-purple-900 hover:bg-stone-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                    <span>Ask Fargo® Virtual Assistant</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    onOpenSignatureCard();
                  }}
                  className="w-full px-4 py-3 text-left font-medium text-stone-700 hover:bg-stone-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#d71e28]" />
                    <span>Signature Card (Form W-9)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    onOpenAccountOpenFlow();
                  }}
                  className="w-full px-4 py-3 text-left font-medium text-stone-700 hover:bg-stone-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Account Open Flow (JA23OU)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    onOpenPublicPortal();
                  }}
                  className="w-full px-4 py-3 text-left font-medium text-stone-700 hover:bg-stone-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-[#ffcc00]" />
                    <span>WellsFargo.com Public Home</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => setHideBalances(!hideBalances)}
                  className="w-full px-4 py-3 text-left font-medium text-stone-700 hover:bg-stone-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {hideBalances ? <Eye className="w-4 h-4 text-stone-600" /> : <EyeOff className="w-4 h-4 text-stone-600" />}
                    <span>{hideBalances ? 'Show Account Balances' : 'Hide Account Balances'}</span>
                  </span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200">
              <button
                onClick={() => {
                  setIsSideMenuOpen(false);
                  onSignOff();
                }}
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign Off Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Base Web Banking Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: ACCOUNTS SUMMARY (Full Web View) */}
        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Bank Accounts Stack */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personalized Greeting Banner with User Image ID */}
              {(() => {
                const primaryChecking = userData.accounts?.find((a) => a.type === 'checking') || userData.accounts?.[0];
                const userImg = userData.avatarUrl || userData.idPhotoUrl || userData.registrationData?.idPhotoUrl || userData.registrationData?.selfieUrl;

                return (
                  <div className="bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 text-white rounded-2xl p-5 sm:p-6 shadow-xs border border-stone-800">
                    <div className="flex items-center gap-4 sm:gap-5">
                      {/* User Image ID with Professional Luxury Border Radius (Locked: Admin Only) */}
                      <UserProfileAvatar
                        src={userImg}
                        name={userData.name}
                        size="lg"
                        shape="rounded"
                        showVerifiedBadge={true}
                        onEditClick={() => setShowPhotoLockNotice(true)}
                      />

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-[#ffcc00] text-stone-900 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Verified Account Holder
                          </span>
                          <span className="text-[11px] text-stone-300 font-mono">
                            Routing: 061000227 • Everyday Checking {primaryChecking?.accountNumber || '..0987'}
                          </span>
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                          {greeting}, {userData.name}!
                        </h2>
                        <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                          Welcome to your Wells Fargo accounts summary. Review your active balances, schedule payments, and manage your daily finances securely.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Account Quick Stats Banner */}
              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                    Total Liquid Available (Checking & Savings)
                  </span>
                  <div className="text-3xl font-light text-stone-900 mt-1 tabular-nums">
                    {hideBalances
                      ? '••••••••'
                      : `$${totalLiquid.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('transfer')}
                    className="bg-[#d71e28] hover:bg-[#b81620] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Transfer Money</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('deposit')}
                    className="border border-stone-800 hover:bg-stone-50 text-stone-900 text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>Deposit Check</span>
                  </button>
                </div>
              </div>

              {/* Deposit Accounts Group (Checking & Savings) */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-800 uppercase tracking-wider">
                    Deposit Accounts
                  </h3>
                  <span className="text-xs text-stone-500 font-mono">Routing: 061000227</span>
                </div>

                <div className="divide-y divide-stone-100">
                  {/* Everyday Checking */}
                  <div
                    onClick={() => setSelectedAccount(checkingAcc)}
                    className="p-5 hover:bg-stone-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-[#d71e28] flex items-center justify-center shrink-0 mt-0.5">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900 group-hover:text-[#d71e28] transition-colors">
                            {checkingAcc.name}
                          </span>
                          <span className="text-xs text-stone-500 font-mono font-medium">{checkingAcc.accountNumber}</span>
                        </div>
                        <span className="text-xs text-stone-500 block mt-0.5">
                          Standard Overdraft Protection • Contactless Visa Debit Enrolled
                        </span>
                      </div>
                    </div>

                    <div className="text-right sm:self-center">
                      <div className="text-xl font-normal text-stone-900 tabular-nums">
                        {hideBalances ? '••••' : `$${checkingAcc.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </div>
                      <span className="text-[11px] text-stone-500">Available balance</span>
                    </div>
                  </div>

                  {/* Way2Save Savings */}
                  <div
                    onClick={() => setSelectedAccount(savingsAcc)}
                    className="p-5 hover:bg-stone-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <PiggyBank className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900 group-hover:text-[#d71e28] transition-colors">
                            {savingsAcc.name}
                          </span>
                          <span className="text-xs text-stone-500 font-mono font-medium">{savingsAcc.accountNumber}</span>
                        </div>
                        <span className="text-xs text-stone-500 block mt-0.5">
                          Save-As-You-Go Transfer Active • APY 0.25%
                        </span>
                      </div>
                    </div>

                    <div className="text-right sm:self-center">
                      <div className="text-xl font-normal text-stone-900 tabular-nums">
                        {hideBalances ? '••••' : `$${savingsAcc.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </div>
                      <span className="text-[11px] text-stone-500">Available balance</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credit Card Account Group */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-800 uppercase tracking-wider">
                    Credit Cards
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>${(creditAcc?.rewardsBalance || 0).toFixed(2)} Cash Rewards</span>
                  </div>
                </div>

                {creditAcc ? (
                  <div
                    onClick={() => setSelectedAccount(creditAcc)}
                    className="p-5 hover:bg-stone-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900 group-hover:text-[#d71e28] transition-colors">
                            {creditAcc.name}
                          </span>
                          <span className="text-xs text-stone-500 font-mono font-medium">{creditAcc.accountNumber}</span>
                        </div>
                        <span className="text-xs text-stone-500 block mt-0.5">
                          2% Unlimited Cash Back on Purchases • Next payment due 10/24/2026
                        </span>
                      </div>
                    </div>

                    <div className="text-right sm:self-center">
                      <div className="text-xl font-normal text-stone-900 tabular-nums">
                        {hideBalances ? '••••' : `$${creditAcc.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </div>
                      <span className="text-[11px] text-stone-500">Current balance</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-stone-900 block">
                          Wells Fargo Active Cash® Card
                        </span>
                        <span className="text-xs text-stone-500">
                          Earn unlimited 2% cash rewards on purchases with $0 annual fee.
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenAccountOpenFlow()}
                      className="bg-[#d71e28] hover:bg-[#b81620] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                    >
                      Apply Now
                    </button>
                  </div>
                )}
              </div>

              {/* Loans Account Group (matching aesqkbioflrf1.jpeg) */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-800 uppercase tracking-wider">
                    Loans & Credit Lines
                  </h3>
                  <button
                    onClick={() => setActiveTab('loans')}
                    className="text-xs font-semibold text-[#d71e28] hover:underline"
                  >
                    View Details & Make Payment &gt;
                  </button>
                </div>

                <div
                  onClick={() => setActiveTab('loans')}
                  className="p-5 hover:bg-stone-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 group-hover:text-[#d71e28] transition-colors">
                          {loanAcc.name}
                        </span>
                        <span className="text-xs text-stone-500 font-mono font-medium">{loanAcc.accountNumber}</span>
                      </div>
                      <span className="text-xs text-stone-500 block mt-0.5">
                        Payment due 10/31/2026: ${(loanAcc.nextPaymentAmount || 587.68).toFixed(2)} • Autopay {loanAcc.autopayEnabled ? 'On' : 'Off'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <div className="text-xl font-normal text-stone-900 tabular-nums">
                      {hideBalances ? '••••' : `$${(loanAcc.principalBalance || 13643.95).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    </div>
                    <span className="text-[11px] text-stone-500">Outstanding principal balance</span>
                  </div>
                </div>
              </div>

              {/* Investments & U.S. Treasury Bills (T-Bills) Group */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-stone-800 uppercase tracking-wider">
                      Investments & U.S. Treasury Bills (T-Bills)
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Full Faith & Credit
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('treasury')}
                    className="text-xs font-semibold text-[#d71e28] hover:underline cursor-pointer"
                  >
                    Auction Desk &gt;
                  </button>
                </div>

                <div className="p-5 hover:bg-stone-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">
                          U.S. TREASURY BILL PORTFOLIO
                        </span>
                        <span className="text-xs text-stone-500 font-mono font-medium">
                          {(userData.treasuryHoldings || []).length} Active Holdings
                        </span>
                      </div>
                      <span className="text-xs text-stone-600 block mt-0.5">
                        Discount yields up to 5.28% • 100% exempt from state/local taxes • Weekly auctions
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => setActiveTab('treasury')}
                          className="bg-[#d71e28] hover:bg-[#b81620] text-white text-xs font-bold px-3.5 py-1 rounded-full transition-colors cursor-pointer shadow-2xs"
                        >
                          Appear for Treasury Bill
                        </button>
                        <button
                          onClick={() => setActiveTab('wellstrade')}
                          className="border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer"
                        >
                          WellsTrade<sup>®</sup> Brokerage
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <div className="text-xl font-normal text-stone-900 tabular-nums font-mono">
                      {hideBalances
                        ? '••••'
                        : `$${(userData.treasuryHoldings || [])
                            .reduce((sum, h) => sum + h.faceValue, 0)
                            .toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    </div>
                    <span className="text-[11px] text-stone-500">Total Par Value (at maturity)</span>
                  </div>
                </div>
              </div>

              {/* Recent Transactions List on Web with PDF Statement & Receipt Tools */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                      Recent Activity across accounts
                    </h3>
                    <span className="text-[11px] text-stone-500">
                      Click any transaction for official receipt & print-to-PDF
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        downloadAccountStatementPdf(checkingAcc, userData.name);
                        setStatementToast(true);
                        setTimeout(() => setStatementToast(false), 2500);
                      }}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs border border-stone-200"
                      title="Download complete account activity statement in official PDF format"
                    >
                      <Download className="w-3.5 h-3.5 text-[#d71e28]" />
                      <span>Download Statement (PDF)</span>
                    </button>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search transactions"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs pl-8 pr-3 py-1.5 border border-stone-200 rounded-lg w-36 sm:w-44 focus:w-52 transition-all focus:outline-none focus:border-[#d71e28]"
                      />
                    </div>
                  </div>
                </div>

                {statementToast && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg p-2.5 flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Official Account Statement PDF downloaded successfully to your device!</span>
                  </div>
                )}

                <div className="divide-y divide-stone-100">
                  {checkingAcc.transactions.length === 0 ? (
                    <div className="py-8 text-center text-stone-500 space-y-2">
                      <FileText className="w-8 h-8 text-stone-300 mx-auto" />
                      <div className="text-xs font-medium">No recent transactions recorded yet</div>
                      <button
                        onClick={() => downloadAccountStatementPdf(checkingAcc, userData.name)}
                        className="text-xs text-[#d71e28] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download $0.00 Opening Statement (PDF)</span>
                      </button>
                    </div>
                  ) : (
                    checkingAcc.transactions
                      .filter((t) => t.description.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((tx) => (
                        <div
                          key={tx.id}
                          onClick={() => setSelectedTxForModal({ tx, account: checkingAcc })}
                          className="py-3 px-2 -mx-2 flex items-center justify-between text-xs rounded-lg hover:bg-stone-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex-1 pr-3">
                            <span className="font-semibold text-stone-900 group-hover:text-[#d71e28] transition-colors block">
                              {tx.description}
                            </span>
                            <div className="flex items-center gap-2 text-stone-500 text-[11px] mt-0.5">
                              <span>{tx.date}</span>
                              <span>•</span>
                              <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">
                                {tx.category}
                              </span>
                              <span>•</span>
                              <span className="text-[#d71e28] font-medium group-hover:underline">Save PDF / Print</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`font-bold tabular-nums text-sm ${
                                tx.type === 'credit' ? 'text-emerald-700' : 'text-stone-900'
                              }`}
                            >
                              {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadTransactionReceiptPdf(tx, checkingAcc, userData.name);
                              }}
                              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-[#d71e28] transition-colors"
                              title="Download PDF Receipt"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar: FICO Score, Set Aside preview, Promos */}
            <div className="space-y-6">
              {/* FICO Score Card matching screenshot */}
              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                    Your FICO<sup>®</sup> Score
                  </h4>
                  <span className="text-[11px] text-stone-500">Updated 04/19/2026</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-stone-200"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-600"
                        strokeDasharray="85, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-bold text-sm text-stone-900">
                      {userData.ficoScore}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      Your FICO Score went up {userData.ficoChange} points
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                      Rating: Excellent
                    </span>
                  </div>
                </div>
              </div>

              {/* Set Aside™ Envelopes Quick Widget */}
              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                    Set Aside™ Bills (Envelopes)
                  </h4>
                  <button
                    onClick={() => setActiveTab('set-aside')}
                    className="text-xs font-semibold text-[#d71e28] hover:underline"
                  >
                    View All &gt;
                  </button>
                </div>

                <div className="space-y-3">
                  {userData.bills.slice(0, 3).map((bill) => {
                    const percent = Math.min(100, Math.round((bill.savedAmount / bill.totalAmount) * 100));
                    return (
                      <div key={bill.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-stone-800">{bill.name}</span>
                          <span className="tabular-nums font-medium text-stone-700">
                            ${bill.totalAmount.toFixed(2)} in {bill.daysRemaining}d
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-wf-gradient rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveTab('set-aside')}
                  className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 py-2 rounded-lg text-xs font-semibold text-stone-800 transition-colors"
                >
                  Manage Bill Envelopes
                </button>
              </div>

              {/* Wells Fargo Autograph 20k Points Promo with Image */}
              <div className="rounded-xl overflow-hidden shadow-xs border border-stone-200 bg-stone-900 text-white">
                <div className="relative h-28 overflow-hidden">
                  <img
                    src="/assets/images/wf_autograph_sunset_1791070287983.jpg"
                    alt="Wells Fargo Autograph Sunset Promo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                    Featured Card Offer
                  </span>
                </div>
                <div className="p-4 space-y-2 bg-gradient-to-b from-stone-900 to-stone-950">
                  <h4 className="font-serif text-base font-normal text-white">Wells Fargo Autograph<sup>®</sup></h4>
                  <p className="text-[11px] text-stone-300 leading-snug">
                    Earn 20,000 bonus points after spending $1,000 in your first 3 months. Plus 3X points on travel and dining.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => setActiveTab('open-account')}
                      className="bg-white text-stone-950 hover:bg-stone-100 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Tools */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2 text-xs">
                <span className="font-bold text-stone-800 uppercase tracking-wider block mb-2">
                  Quick Service Links
                </span>
                <button
                  onClick={() => setIsUserDetailsOpen(true)}
                  className="w-full text-left text-stone-700 hover:text-[#d71e28] flex items-center justify-between py-1"
                >
                  <span className="font-semibold text-stone-900">View Registration & Profile Data</span>
                  <User className="w-3.5 h-3.5 text-[#d71e28]" />
                </button>
                <button
                  onClick={() => setIsSignatureCardOpen(true)}
                  className="w-full text-left text-stone-700 hover:text-[#d71e28] flex items-center justify-between py-1"
                >
                  <span>Consumer Signature Card (Form W-9)</span>
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <div className="text-stone-700 hover:text-[#d71e28] flex items-center justify-between py-1 cursor-pointer">
                  <span>Download Voided Check & Direct Deposit Form</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <div className="text-stone-700 hover:text-[#d71e28] flex items-center justify-between py-1 cursor-pointer">
                  <span>Card Lock & Replacement Controls</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSFER & PAY (Full Web View) */}
        {activeTab === 'transfer' && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <PayTransferTab
              accounts={userData.accounts}
              onExecuteTransfer={handleExecuteTransfer}
            />
          </div>
        )}

        {/* TAB 3: DEPOSIT CHECKS (Full Web View) */}
        {activeTab === 'deposit' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <DepositTab
              accounts={userData.accounts}
              userName={userData.name}
              onDepositComplete={handleDepositComplete}
              onOpenAdminPortal={onOpenAdminPortal}
            />
          </div>
        )}

        {/* TAB 4: SET ASIDE™ BILLS (Full Web View) */}
        {activeTab === 'set-aside' && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <SetAsideTab
              bills={userData.bills}
              checkingBalance={checkingAcc.availableBalance}
              onPayBill={handlePayBill}
              onAddFundsToBill={handleAddFundsToBill}
              onAddBill={handleAddBill}
            />
          </div>
        )}

        {/* TAB 5: LOANS & CREDIT DETAILS (Full Web View - Matching aesqkbioflrf1.jpeg) */}
        {activeTab === 'loans' && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            {/* Top balance banner with Loan Configurator trigger */}
            <div className="bg-[#eef2ff] px-6 py-6 border-b border-stone-200 text-center">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                {loanAcc.name} {loanAcc.accountNumber}
              </span>
              <div className="text-4xl font-light text-stone-900 mt-1 tabular-nums">
                ${(loanAcc.principalBalance || 13643.95).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-xs text-stone-600 block mt-1">Outstanding principal balance</span>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => setIsLoanConfigOpen(true)}
                  className="bg-[#d71e28] hover:bg-[#b81620] text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  title="Configure loan amount from $700 up to $100,000,000.00 USD"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Loan Amount (From $700 to $100M USD)</span>
                </button>
              </div>
            </div>

            {/* Quick Loan Configurator Card */}
            <div className="p-6 space-y-6">
              <div className="bg-stone-50 border border-stone-300 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-[#d71e28]" />
                      <span>Loan Amount Configuration & Limit Settings</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Adjust your loan balance or credit line. Minimum loan: <strong className="text-stone-900">$700.00 USD</strong> • Highest allowable limit: <strong className="text-stone-900">$100,000,000.00 USD (100 Million)</strong>.
                    </p>
                  </div>

                  <span className="bg-red-100 text-[#d71e28] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-red-200">
                    $700 Min - $100M Max
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-stone-700 block">Quick Loan Amount Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: '$700 (Min)', val: 700 },
                      { label: '$10,000', val: 10000 },
                      { label: '$100,000', val: 100000 },
                      { label: '$1,000,000 ($1M)', val: 1000000 },
                      { label: '$10,000,000 ($10M)', val: 10000000 },
                      { label: '$50,000,000 ($50M)', val: 50000000 },
                      { label: '$100,000,000 ($100M MAX)', val: 100000000 },
                    ].map((chip) => (
                      <button
                        key={chip.val}
                        onClick={() => handleUpdateLoanAmount(loanAcc.id, chip.val, (chip.val * 0.0549) / 12 + chip.val / 60, 60, 5.49)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors border ${
                          Math.round(loanAcc.principalBalance || 0) === chip.val
                            ? 'bg-[#d71e28] text-white border-[#d71e28] shadow-xs'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    onClick={() => {
                      const reg = userData.registrationData;
                      const userAddress = reg
                        ? `${reg.c1StreetAddress || ''}, ${reg.c1City || ''}, ${reg.c1State || ''} ${reg.c1Zip || ''}`.trim()
                        : '1048 Montgomery St, Apt 4B, San Francisco, CA 94133';

                      downloadLoanDisclosurePdf({
                        userName: reg?.c1FullName || userData.name || 'Kate20',
                        userAddress,
                        userPhone: reg?.c1HomePhone || '(415) 890-2134',
                        userEmail: 'kate20@wellsfargo-customer.com',
                        userEmployer: reg?.c1Employer || 'Apex BioTech Corp',
                        userDob: reg?.c1Dob || '06/14/1992',
                        userTinLast4: reg?.c1Tin ? reg.c1Tin.slice(-4) : '4321',
                        accountName: loanAcc.name,
                        accountNumber: loanAcc.accountNumber,
                        loanAmount: loanAcc.principalBalance || 13643.95,
                        apr: 5.49,
                        termMonths: 60,
                        monthlyPayment: loanAcc.nextPaymentAmount || 587.68,
                        totalInterest: (loanAcc.nextPaymentAmount || 587.68) * 60 - (loanAcc.principalBalance || 13643.95),
                        totalRepayment: (loanAcc.nextPaymentAmount || 587.68) * 60,
                        loanTypeTitle: 'Commercial & Executive Loan',
                      });
                    }}
                    className="border border-stone-800 text-stone-900 hover:bg-stone-100 text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-2xs"
                    title="Download official Truth in Lending loan agreement (PDF)"
                  >
                    <Download className="w-3.5 h-3.5 text-[#d71e28]" />
                    <span>Download Loan (PDF)</span>
                  </button>

                  <button
                    onClick={() => setIsLoanConfigOpen(true)}
                    className="bg-[#2b2b2b] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-300" />
                    <span>Open Full Loan Configurator (APR & Terms)</span>
                  </button>
                </div>
              </div>

              {/* Next Payment Card */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-normal text-stone-900 mb-4">Next payment</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-stone-800">
                    <span>Payment due {loanAcc.nextPaymentDue || '10/31/2026'}</span>
                    <span className="font-semibold tabular-nums text-base">
                      ${(loanAcc.nextPaymentAmount || 587.68).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-stone-600 text-xs pl-2 border-l-2 border-stone-200">
                    <span>Principal and interest</span>
                    <span className="tabular-nums">${(loanAcc.principalAndInterest || 534.42).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-stone-600 text-xs pl-2 border-l-2 border-stone-200">
                    <span>Past due amount</span>
                    <span className="tabular-nums text-amber-700 font-medium">
                      ${(loanAcc.pastDueAmount || 53.26).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-stone-900 font-semibold">
                    <span>Total amount due</span>
                    <span className="tabular-nums">${(loanAcc.totalAmountDue || 587.68).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-stone-600 text-xs pt-1">
                    <span>Autopay</span>
                    <span className={`font-semibold ${loanAcc.autopayEnabled ? 'text-emerald-700' : 'text-stone-700'}`}>
                      {loanAcc.autopayEnabled ? 'On (10/31/2026)' : 'Off'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => handleToggleAutopay(loanAcc.id)}
                    className="border border-stone-800 text-stone-900 hover:bg-stone-50 text-sm font-medium py-2.5 px-4 rounded-full transition-colors text-center"
                  >
                    {loanAcc.autopayEnabled ? 'Turn Off Autopay' : 'Set up Autopay'}
                  </button>
                  <button
                    onClick={() => setSelectedAccount(loanAcc)}
                    className="bg-[#2b2b2b] hover:bg-black text-white text-sm font-medium py-2.5 px-4 rounded-full transition-colors text-center shadow-xs"
                  >
                    Make payment
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                    Payment History & Direct Debits
                  </h4>
                  <button
                    type="button"
                    onClick={() => downloadAccountStatementPdf(loanAcc, userData.name)}
                    className="text-xs text-[#d71e28] hover:text-[#9b131c] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Loan Statement (PDF)</span>
                  </button>
                </div>

                <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 p-2">
                  {loanAcc.transactions.length === 0 ? (
                    <div className="py-6 text-center text-xs text-stone-500">
                      No loan payments recorded for this period.
                    </div>
                  ) : (
                    loanAcc.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => setSelectedTxForModal({ tx, account: loanAcc })}
                        className="p-3 flex justify-between items-center text-xs rounded-lg hover:bg-stone-50 cursor-pointer group transition-colors"
                      >
                        <div className="flex-1 pr-3">
                          <span className="text-[11px] text-stone-500 block">{tx.date}</span>
                          <span className="font-medium text-stone-900 group-hover:text-[#d71e28] transition-colors block">
                            {tx.description}
                          </span>
                          <span className="text-[10px] text-[#d71e28] group-hover:underline">
                            Click for official receipt & print-to-PDF
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-semibold tabular-nums text-emerald-700 text-sm">
                            +${tx.amount.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadTransactionReceiptPdf(tx, loanAcc, userData.name);
                            }}
                            className="p-1 rounded-full hover:bg-stone-200 text-stone-400 hover:text-[#d71e28] transition-colors"
                            title="Download PDF Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: U.S. TREASURY BILLS (T-BILLS) AUCTION DESK */}
        {activeTab === 'treasury' && (
          <div className="space-y-6">
            <TreasuryBillView
              userData={userData}
              onUpdateUserData={onUpdateUserData}
              isLoggedIn={true}
            />
          </div>
        )}

        {/* TAB: CHOOSE WELLSTRADE ACCOUNT */}
        {activeTab === 'wellstrade' && (
          <div className="space-y-6">
            <WellsTradeAccountChoiceView
              userData={userData}
              onOpenAccountForm={onOpenSignatureCard}
              onNavigateToTreasuryBills={() => setActiveTab('treasury')}
              onTalkToAssistant={() => setIsFargoOpen(true)}
              isLoggedIn={true}
            />
          </div>
        )}

        {/* TAB 6: OPEN AN ACCOUNT (Full Web View - Matching 31829E33-2B14-4FD9-AAC1-25F6C4F27480.jpeg) */}
        {activeTab === 'open-account' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <AccountOpenFlow
              onContinue={() => setActiveTab('accounts')}
            />
          </div>
        )}
        {/* TAB 7: PROFILE & REGISTRATION DATA (Full Web View) */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 text-white rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  Wells Fargo Online® Profile
                </span>
                <h2 className="font-serif text-3xl font-normal text-white">
                  {greeting}, {userData.name}!
                </h2>
                <p className="text-xs text-stone-300 mt-1">
                  Full registration records and Consumer Account Application (Form DSG8921) submitted data.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsUserDetailsOpen(true)}
                  className="bg-white text-stone-900 px-5 py-2 rounded-full text-xs font-semibold hover:bg-stone-100 flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#d71e28]" />
                  <span>Open Interactive Modal</span>
                </button>
                <button
                  onClick={() => setIsSignatureCardOpen(true)}
                  className="border border-white/30 text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Printable PDF</span>
                </button>
              </div>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-bold text-xs uppercase text-stone-800">Primary Customer Info</span>
                  <span className="text-xs text-stone-500 font-mono">FORM DSG8921</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Full Legal Name</span>
                    <span className="font-bold text-stone-900 text-sm">{userData.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Street Address</span>
                    <span className="font-medium text-stone-800">
                      {userData.registrationData?.c1StreetAddress || '1048 Montgomery St, Apt 4B, San Francisco, CA 94133'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Taxpayer ID</span>
                      <span className="font-mono font-bold text-stone-900">
                        {userData.registrationData?.c1Tin ? `***-**-${userData.registrationData.c1Tin.slice(-4)}` : '***-**-4321'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Telephone</span>
                      <span className="font-medium text-stone-900">
                        {userData.registrationData?.c1HomePhone || '(415) 890-2134'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-bold text-xs uppercase text-stone-800">Account & Verification</span>
                  <span className="text-emerald-700 font-bold text-xs">Verified</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Bank Name & Branch</span>
                    <span className="font-semibold text-stone-900">Wells Fargo Bank, N.A. • Branch 00481</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Routing Number</span>
                      <span className="font-mono font-bold text-stone-900">061000227</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Primary Account</span>
                      <span className="font-mono font-bold text-stone-900">{checkingAcc.accountNumber}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">W-9 Certification & Signature</span>
                    <span className="font-serif italic font-bold text-stone-900 text-sm">{userData.name}</span>
                  </div>
                </div>
              </div>

              {/* Verified Government Photo ID Card */}
              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-bold text-xs uppercase text-stone-800">Government Photo ID</span>
                  <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    CIP Active
                  </span>
                </div>
                {userData.idPhotoUrl || userData.registrationData?.idPhotoUrl ? (
                  <div className="space-y-2 text-xs">
                    <div
                      onClick={() => setIsUserDetailsOpen(true)}
                      className="relative h-24 w-full bg-stone-50 rounded-lg overflow-hidden border border-stone-300 cursor-pointer group flex items-center justify-center shadow-2xs"
                    >
                      <img
                        src={userData.idPhotoUrl || userData.registrationData?.idPhotoUrl}
                        alt="Government Photo ID"
                        className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View ID Document</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block truncate">
                        {userData.registrationData?.c1PrimaryIdDesc || "Driver's License"}
                      </span>
                      <span className="text-stone-500 text-[11px] block">
                        State/Jurisdiction: {userData.registrationData?.c1PrimaryIdState || 'CA'} • Official Copy
                      </span>
                    </div>
                    <div className="pt-1 flex items-center gap-3">
                      <button
                        onClick={() => setIsUserDetailsOpen(true)}
                        className="text-xs text-[#d71e28] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View & Update ID Details &gt;</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-stone-50 rounded-lg text-center space-y-2">
                    <span className="text-stone-500 text-xs block">No government ID photo uploaded yet.</span>
                    <button
                      onClick={() => setIsUserDetailsOpen(true)}
                      className="text-xs bg-[#d71e28] hover:bg-[#b81620] text-white px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer"
                    >
                      Upload ID Document
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsUserDetailsOpen(true)}
                className="bg-[#d71e28] hover:bg-[#b81620] text-white px-8 py-3 rounded-full text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Open Complete Registration Profile & Disclosures</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* User Details Modal (Displays all registration form data) */}
      <UserDetailsModal
        isOpen={isUserDetailsOpen}
        onClose={() => setIsUserDetailsOpen(false)}
        userData={userData}
        onUpdateUserData={onUpdateUserData}
        onOpenEditRegistration={() => {
          setIsUserDetailsOpen(false);
          onOpenSignatureCard();
        }}
        onOpenPdfSignatureCard={() => {
          setIsUserDetailsOpen(false);
          onOpenSignatureCard();
        }}
      />

      {/* Account Details Modal (when clicked from any list) */}
      <AccountDetailModal
        account={selectedAccount}
        isOpen={Boolean(selectedAccount)}
        onClose={() => setSelectedAccount(null)}
        onMakePayment={handleMakeLoanPayment}
        onToggleAutopay={handleToggleAutopay}
        userName={userData.name}
        onOpenLoanConfig={() => {
          setSelectedAccount(null);
          setIsLoanConfigOpen(true);
        }}
      />

      {/* Transaction Details & PDF Receipt / Print Modal */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTxForModal)}
        onClose={() => setSelectedTxForModal(null)}
        transaction={selectedTxForModal?.tx || null}
        account={selectedTxForModal?.account || null}
        userName={userData.name}
      />

      {/* Loan Amount Configurator Modal (From $700 up to $100 Million USD) */}
      <LoanConfiguratorModal
        isOpen={isLoanConfigOpen}
        onClose={() => setIsLoanConfigOpen(false)}
        loanAccount={loanAcc}
        userData={userData}
        onUpdateLoanAmount={handleUpdateLoanAmount}
      />

      {/* Ask Fargo Modal */}
      <AskFargoModal
        isOpen={isFargoOpen}
        onClose={() => setIsFargoOpen(false)}
        userData={userData}
        onNavigateToTab={(tab) => {
          setActiveTab(tab as any);
        }}
      />

      {/* Signature Card Modal */}
      <SignatureCardModal
        isOpen={isSignatureCardOpen}
        onClose={() => setIsSignatureCardOpen(false)}
        customerName={userData.name}
      />

      {/* Base Web Footer with Legal Disclaimers */}
      <footer className="border-t border-stone-300 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap gap-4 text-xs text-stone-600">
            <button
              onClick={() => setShowSecurityModal(true)}
              className="hover:underline cursor-pointer inline-flex items-center gap-1 text-[#d71e28] font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Online & Mobile Security</span>
            </button>
            <span>|</span>
            <span className="hover:underline cursor-pointer">Privacy, Cookies & Legal</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">Notice of Data Collection</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">General Terms of Use</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">Equal Housing Lender</span>
          </div>
          <FdicDisclaimer compact />
        </div>
      </footer>

      {/* Online & Mobile Security Center Modal */}
      {/* Hidden file input for changing profile photo */}
      <input
        ref={avatarFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFileSelected}
      />

      {/* Interactive Face & Photo Positioner Modal */}
      {photoCropSrc && (
        <ImageCropPositionModal
          isOpen={Boolean(photoCropSrc)}
          imageSrc={photoCropSrc}
          cropShape="circle"
          title="Position Face & Adjust Profile Photo"
          onCropComplete={handleAvatarCropComplete}
          onCancel={() => setPhotoCropSrc(null)}
        />
      {/* Official Photo ID Lock Notice Modal */}
      {showPhotoLockNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-300 animate-in zoom-in-95">
            <div className="bg-[#d71e28] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#ffcc00]" />
                <h4 className="font-bold text-sm tracking-tight">Verified ID Photo Record Locked</h4>
              </div>
              <button
                onClick={() => setShowPhotoLockNotice(false)}
                className="p-1 rounded-full hover:bg-black/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-stone-700">
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900 text-xs">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="leading-relaxed">
                  <strong>Banking KYC & Security Compliance:</strong> Under Federal banking regulations, once an account is opened and an identification photo is submitted, the image is permanently locked as an official record. Account holders cannot modify identity photos.
                </p>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                If your legal appearance, name, or government credentials have changed, please contact an authorized <strong>Bank Administrator</strong> who can review and update your official identity photo.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  onClick={() => {
                    setShowPhotoLockNotice(false);
                    setIsUserDetailsOpen(true);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  View Application Details
                </button>
                <button
                  onClick={() => setShowPhotoLockNotice(false)}
                  className="px-4 py-2 bg-[#d71e28] hover:bg-[#b81620] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
