import React, { useState } from 'react';
import { INITIAL_USER_DATA } from './data/mockData';
import { UserProfile } from './types/banking';
import { WebBankingDashboard } from './components/portal/WebBankingDashboard';
import { WebPortalView } from './components/portal/WebPortalView';
import { SignOnModal } from './components/auth/SignOnModal';
import { AskFargoModal } from './components/mobile/AskFargoModal';
import { SignatureCardModal } from './components/portal/SignatureCardModal';
import { AccountOpenFlow } from './components/mobile/AccountOpenFlow';
import { AndroidWorkflowsModal } from './components/workflow/AndroidWorkflowsModal';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  const [userData, setUserData] = useState<UserProfile>(INITIAL_USER_DATA);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [webSection, setWebSection] = useState<'banking' | 'public'>('public');
  const [isSignOnOpen, setIsSignOnOpen] = useState(false);
  const [isFargoOpen, setIsFargoOpen] = useState(false);
  const [isSignatureCardOpen, setIsSignatureCardOpen] = useState(false);
  const [isAccountOpenFlowActive, setIsAccountOpenFlowActive] = useState(false);
  const [isWorkflowsOpen, setIsWorkflowsOpen] = useState(false);
  const [justSignedOff, setJustSignedOff] = useState(false);

  React.useEffect(() => {
    try {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (pathname.includes('/login') || pathname.includes('/signon')) {
        setIsSignOnOpen(true);
      } else if (pathname.includes('/portal') || pathname.includes('/dashboard') || pathname.includes('/banking')) {
        setWebSection('banking');
        setIsLoggedIn(true);
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
        if (decoded.includes('/login')) setIsSignOnOpen(true);
        if (decoded.includes('/enroll')) setIsSignatureCardOpen(true);
        if (decoded.includes('/workflows') || decoded.includes('/apk')) setIsWorkflowsOpen(true);
        if (decoded.includes('/portal') || decoded.includes('/dashboard')) {
          setWebSection('banking');
          setIsLoggedIn(true);
        }
      }
    } catch (e) {
      // Safe fallback
    }
  }, []);

  const handleLoginSuccess = (enteredName: string) => {
    setIsLoggedIn(true);
    setWebSection('banking');
    setJustSignedOff(false);
    const cleanName = enteredName.trim().replace(/_wf$/i, '');
    const displayName = cleanName
      ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
      : 'Account Holder';

    setUserData((prev) => ({
      ...prev,
      name: displayName,
    }));
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
    setUserData((prev) => ({
      ...prev,
      name: newCustomerName,
      registrationData: fullData || prev.registrationData,
    }));
    setIsAccountOpenFlowActive(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#d71e28] selection:text-white">
      {/* Base Web Banking is the root layout (No top developer bar) */}
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
