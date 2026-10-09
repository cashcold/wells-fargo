import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Smartphone,
  KeyRound,
  AlertTriangle,
  PhoneCall,
  Mail,
  CheckCircle2,
  ExternalLink,
  X,
  FileText,
  Clock,
  Eye,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { WfLogo } from './WfLogo';

interface OnlineMobileSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnlineMobileSecurityModal: React.FC<OnlineMobileSecurityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'guarantee' | 'features' | 'scams' | 'report'>('guarantee');
  const [checklist, setChecklist] = useState({
    twoFactor: true,
    alerts: true,
    biometrics: true,
    passphrase: false,
    cardLockAwareness: true,
  });

  if (!isOpen) return null;

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header with Wells Fargo Red Bar */}
        <div className="bg-[#d71e28] text-white px-5 sm:px-7 py-4 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-amber-200 font-semibold">
                Security & Fraud Center
              </div>
              <h2 id="security-modal-title" className="text-lg sm:text-xl font-bold font-serif leading-tight">
                Online & Mobile Security
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Security Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 sm:px-6 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('guarantee')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guarantee'
                ? 'border-[#d71e28] text-[#d71e28]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security Guarantee</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'features'
                ? 'border-[#d71e28] text-[#d71e28]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Protection Layers</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scams')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'scams'
                ? 'border-[#d71e28] text-[#d71e28]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Spotting Scams</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'report'
                ? 'border-[#d71e28] text-[#d71e28]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>24/7 Assistance</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-stone-800 text-xs sm:text-sm">
          {activeTab === 'guarantee' && (
            <div className="space-y-6">
              {/* Guarantee Hero Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#d71e28] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-7 h-7 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#b3141f]">
                      Zero Liability Protection
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-bold mt-0.5">
                      Wells Fargo Online<sup>®</sup> Security Guarantee
                    </h3>
                    <p className="mt-2 text-stone-700 leading-relaxed text-xs sm:text-sm">
                      We guarantee that you will not be held liable for unauthorized transactions made using
                      Wells Fargo Online or Mobile Banking when you report them promptly.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Pillar Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-[#d71e28] flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">256-Bit Encryption</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Industry-leading TLS 1.3 protocol and bank-level cryptography shield your credentials and transfers.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-[#d71e28] flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">24/7 Anomaly Monitoring</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Continuous automated systems analyze account behavior to spot and intercept suspicious activity immediately.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-[#d71e28] flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">Instant Card Lock</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Misplaced your card? Temporarily turn off new purchases and ATM transactions anytime right from the app.
                  </p>
                </div>
              </div>

              {/* Your Role In Security */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
                <h4 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-600" />
                  How to maintain full protection coverage
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                  <li>Review your account statements and digital transaction logs regularly.</li>
                  <li>Notify Wells Fargo immediately if you notice unauthorized charges or a lost card.</li>
                  <li>Never disclose your one-time verification codes, usernames, or passwords to anyone.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              <p className="text-stone-600 text-xs sm:text-sm">
                Wells Fargo employs multiple defense layers working simultaneously to protect your wealth, identities, and transactions.
              </p>

              <div className="space-y-3">
                <div className="p-4 border border-stone-200 rounded-xl flex items-start gap-3.5 hover:border-stone-300 transition-colors">
                  <div className="p-2 bg-red-50 text-[#d71e28] rounded-lg shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-stone-900 text-sm">2-Step Verification & Passkeys</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Whenever you sign on from an unrecognized device or execute significant transfers, we verify your identity via secure push alerts, passkeys, or single-use verification codes.
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-stone-200 rounded-xl flex items-start gap-3.5 hover:border-stone-300 transition-colors">
                  <div className="p-2 bg-red-50 text-[#d71e28] rounded-lg shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-stone-900 text-sm">Biometric Authentication</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Use Face ID<sup>®</sup>, Touch ID<sup>®</sup>, or Windows Hello biometrics so only you can unlock access on your trusted mobile and desktop devices.
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-stone-200 rounded-xl flex items-start gap-3.5 hover:border-stone-300 transition-colors">
                  <div className="p-2 bg-red-50 text-[#d71e28] rounded-lg shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-stone-900 text-sm">Automatic Session Timeouts</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      If you step away from your computer or tablet, your secure online session will log off automatically after a brief period of inactivity to prevent unauthorized access.
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-stone-200 rounded-xl flex items-start gap-3.5 hover:border-stone-300 transition-colors">
                  <div className="p-2 bg-red-50 text-[#d71e28] rounded-lg shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-stone-900 text-sm">Instant Card On/Off Controls</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Lock your debit or credit card instantly if misplaced, preventing new retail transactions while preserving recurring automatic bill payments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Security Health Check */}
              <div className="mt-5 p-4 bg-stone-50 border border-stone-200 rounded-xl">
                <h4 className="font-bold text-stone-900 text-sm mb-3 flex items-center justify-between">
                  <span>Your Account Security Health Check</span>
                  <span className="text-[11px] font-normal text-stone-500">Click to toggle your protections</span>
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.twoFactor}
                      onChange={() => toggleCheck('twoFactor')}
                      className="rounded text-[#d71e28] focus:ring-[#d71e28] h-4 w-4"
                    />
                    <span className={checklist.twoFactor ? 'font-medium text-stone-900' : 'text-stone-500'}>
                      2-Step Verification enabled on all logins
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.alerts}
                      onChange={() => toggleCheck('alerts')}
                      className="rounded text-[#d71e28] focus:ring-[#d71e28] h-4 w-4"
                    />
                    <span className={checklist.alerts ? 'font-medium text-stone-900' : 'text-stone-500'}>
                      Real-time push alerts for transactions &gt; $0.00
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.biometrics}
                      onChange={() => toggleCheck('biometrics')}
                      className="rounded text-[#d71e28] focus:ring-[#d71e28] h-4 w-4"
                    />
                    <span className={checklist.biometrics ? 'font-medium text-stone-900' : 'text-stone-500'}>
                      Biometric / Passkey credentials registered
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.passphrase}
                      onChange={() => toggleCheck('passphrase')}
                      className="rounded text-[#d71e28] focus:ring-[#d71e28] h-4 w-4"
                    />
                    <span className={checklist.passphrase ? 'font-medium text-stone-900' : 'text-stone-500'}>
                      Unique 16+ character passphrase used exclusively for Wells Fargo
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scams' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d71e28]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Important Security Rule</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-stone-900">
                  Wells Fargo will NEVER call, text, or email asking for your password, PIN, or one-time access code.
                </p>
                <p className="text-xs text-stone-600">
                  If someone contacts you claiming to be Wells Fargo and asks for this information, hang up immediately.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 border border-stone-200 rounded-xl space-y-1 bg-white">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm flex items-center justify-between">
                    <span>1. Imposter Caller ID Spoofing</span>
                    <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono">High Risk</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Scammers can easily falsify Caller ID so your phone displays "Wells Fargo Fraud Dept." Always hang up and dial the telephone number printed directly on the back of your debit card.
                  </p>
                </div>

                <div className="p-3.5 border border-stone-200 rounded-xl space-y-1 bg-white">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm flex items-center justify-between">
                    <span>2. Fake "Reversal" Transfers with Zelle<sup>®</sup></span>
                    <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono">Scam Alert</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Fraudsters ask victims to send money to their own phone number or email to "reverse a fraudulent wire." In reality, this sends money straight to the fraudster. Wells Fargo never asks you to transfer funds to protect your money.
                  </p>
                </div>

                <div className="p-3.5 border border-stone-200 rounded-xl space-y-1 bg-white">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm flex items-center justify-between">
                    <span>3. Phishing Emails & Smishing Text Messages</span>
                    <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono">Phishing</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Unsolicited SMS alerts with links to "confirm suspicious charges" often lead to fake lookalike login portals. Always enter wellsfargo.com directly in your browser.
                  </p>
                </div>

                <div className="p-3.5 border border-stone-200 rounded-xl space-y-1 bg-white">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm flex items-center justify-between">
                    <span>4. Urgent Demands for Gift Cards or Crypto</span>
                    <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono">Extortion</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    No legitimate bank or government agency will ever ask you to settle an account or resolve an issue using prepaid gift cards, Western Union, or cryptocurrency ATMs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
                <h4 className="font-bold text-stone-900 text-sm mb-2">Immediate Steps If You Suspect Fraud</h4>
                <p className="text-xs text-stone-600 mb-3">
                  If you suspect your credentials have been compromised or you observe unfamiliar transactions, act quickly:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-stone-200 rounded-lg">
                    <span className="font-bold text-xs text-stone-900 block mb-1">Step 1: Lock Your Card</span>
                    <p className="text-[11px] text-stone-600">
                      Use the card management tool in your dashboard to immediately freeze debit and credit cards.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-stone-200 rounded-lg">
                    <span className="font-bold text-xs text-stone-900 block mb-1">Step 2: Reset Password</span>
                    <p className="text-[11px] text-stone-600">
                      Update your password and revoke untrusted devices from your security profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Hotlines */}
              <div className="space-y-3">
                <div className="p-4 border border-stone-200 rounded-xl flex items-center justify-between bg-white hover:border-stone-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 text-[#d71e28] rounded-xl">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">24/7 Online & Mobile Fraud Support</div>
                      <div className="text-xs text-stone-600">Speak with an authorized fraud specialist anytime</div>
                    </div>
                  </div>
                  <a
                    href="tel:1-800-956-4442"
                    className="font-mono font-bold text-xs sm:text-sm text-[#d71e28] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
                  >
                    1-800-956-4442
                  </a>
                </div>

                <div className="p-4 border border-stone-200 rounded-xl flex items-center justify-between bg-white hover:border-stone-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 text-[#d71e28] rounded-xl">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">General Wells Fargo Customer Care</div>
                      <div className="text-xs text-stone-600">Personal accounts, debit cards, and general inquiries</div>
                    </div>
                  </div>
                  <a
                    href="tel:1-800-869-3557"
                    className="font-mono font-bold text-xs sm:text-sm text-stone-800 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-300 transition-colors"
                  >
                    1-800-869-3557
                  </a>
                </div>

                <div className="p-4 border border-stone-200 rounded-xl flex items-center justify-between bg-white hover:border-stone-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">Forward Suspicious Emails / Texts</div>
                      <div className="text-xs text-stone-600">Send unedited phishing emails or screenshots</div>
                    </div>
                  </div>
                  <a
                    href="mailto:reportphish@wellsfargo.com"
                    className="font-mono text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                  >
                    reportphish@wellsfargo.com
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-5 sm:px-7 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Wells Fargo Zero Liability Protection &bull; Member FDIC</span>
          </div>
          <button
            onClick={onClose}
            className="bg-stone-900 hover:bg-black text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Security Center
          </button>
        </div>
      </div>
    </div>
  );
};
