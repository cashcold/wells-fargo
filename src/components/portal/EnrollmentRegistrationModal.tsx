import React, { useState, useRef } from 'react';
import {
  X,
  Check,
  Printer,
  Download,
  PenTool,
  FileText,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Share2,
  RotateCcw,
  Sparkles,
  Lock,
  ShieldCheck,
  Building,
  User,
  Users,
  Calendar,
  CreditCard,
  ClipboardList,
  CheckSquare,
  Square,
  FileSpreadsheet,
} from 'lucide-react';
import { WfLogo } from '../common/WfLogo';
import { FdicDisclaimer } from '../common/FdicDisclaimer';
import { downloadSignatureCardPdf } from '../../utils/pdfGenerator';

export interface EnrollmentFormData {
  // Accounts
  accountType: 'Everyday Checking' | 'Way2Save Savings' | 'Checking & Savings Bundle' | 'Platinum Savings' | 'Time CD';
  initialDeposit: string;
  offerCode: string;
  bankName: string;

  // Customer 1 (Primary)
  c1FullName: string;
  c1StreetAddress: string;
  c1HowLongYr: string;
  c1HowLongMo: string;
  c1DirectionalAddress: string;
  c1City: string;
  c1State: string;
  c1Zip: string;
  c1Country: string;
  c1Tin: string;
  c1HomePhone: string;
  c1PrevAddress: string;
  c1PrevYr: string;
  c1PrevMo: string;
  c1PrevCity: string;
  c1PrevState: string;
  c1PrevZip: string;
  c1PrevCountry: string;
  c1Employer: string;
  c1BusinessPhone: string;
  c1PrimaryIdDesc: string;
  c1PrimaryIdState: string;
  c1Dob: string;
  c1PrimaryIssueDate: string;
  c1PrimaryExpDate: string;
  c1SecondaryIdDesc: string;
  c1SecondaryIdState: string;
  c1SecondaryIssueDate: string;
  c1SecondaryExpDate: string;

  // Customer 2 (Joint / Optional)
  hasCustomer2: boolean;
  c2FullName: string;
  c2StreetAddress: string;
  c2HowLongYr: string;
  c2HowLongMo: string;
  c2DirectionalAddress: string;
  c2City: string;
  c2State: string;
  c2Zip: string;
  c2Country: string;
  c2Tin: string;
  c2HomePhone: string;
  c2PrevAddress: string;
  c2PrevYr: string;
  c2PrevMo: string;
  c2PrevCity: string;
  c2PrevState: string;
  c2PrevZip: string;
  c2PrevCountry: string;
  c2Employer: string;
  c2BusinessPhone: string;
  c2PrimaryIdDesc: string;
  c2PrimaryIdState: string;
  c2Dob: string;
  c2PrimaryIssueDate: string;
  c2PrimaryExpDate: string;
  c2SecondaryIdDesc: string;
  c2SecondaryIdState: string;
  c2SecondaryIssueDate: string;
  c2SecondaryExpDate: string;

  // W-9 Backup Withholding
  w9SubjectToBackup: boolean;
  w9ExemptFromBackup: boolean;
  w9ManualSubmit: boolean;
  w9Signature: string;

  // Wisconsin Only
  isWisconsinResident: boolean;
  c1MaritalStatus: 'married' | 'unmarried' | 'legally separated' | '';
  c2MaritalStatus: 'married' | 'unmarried' | 'legally separated' | '';
  wiSpouseName: string;
  wiSpouseAddress: string;

  // Texas Right of Survivorship
  isTexasResident: boolean;
  txAgreementAccepted: boolean;
  txC1Signature: string;
  txC2Signature: string;
  txManualSubmit: boolean;

  // Final Signatures & Agreement
  agreementAccepted: boolean;
  c1Signature: string;
  c1SignatureDate: string;
  c1ManualSubmit: boolean;
  c2Signature: string;
  c2SignatureDate: string;
  c2ManualSubmit: boolean;
}

const INITIAL_FORM_STATE: EnrollmentFormData = {
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  accountType: 'Checking & Savings Bundle',
  initialDeposit: '0.00',
  offerCode: 'JA23OU',
  bankName: 'Wells Fargo Bank, N.A.',

  c1FullName: '',
  c1StreetAddress: '',
  c1HowLongYr: '3',
  c1HowLongMo: '6',
  c1DirectionalAddress: '',
  c1City: '',
  c1State: 'CA',
  c1Zip: '',
  c1Country: 'USA',
  c1Tin: '',
  c1HomePhone: '',
  c1PrevAddress: '',
  c1PrevYr: '2',
  c1PrevMo: '0',
  c1PrevCity: '',
  c1PrevState: 'CA',
  c1PrevZip: '',
  c1PrevCountry: 'USA',
  c1Employer: '',
  c1BusinessPhone: '',
  c1PrimaryIdDesc: "Driver's License",
  c1PrimaryIdState: 'CA',
  c1Dob: '',
  c1PrimaryIssueDate: '',
  c1PrimaryExpDate: '',
  c1SecondaryIdDesc: 'Major Credit Card / Social Security Card',
  c1SecondaryIdState: 'US',
  c1SecondaryIssueDate: '',
  c1SecondaryExpDate: '',

  hasCustomer2: false,
  c2FullName: '',
  c2StreetAddress: '',
  c2HowLongYr: '',
  c2HowLongMo: '',
  c2DirectionalAddress: '',
  c2City: '',
  c2State: '',
  c2Zip: '',
  c2Country: 'USA',
  c2Tin: '',
  c2HomePhone: '',
  c2PrevAddress: '',
  c2PrevYr: '',
  c2PrevMo: '',
  c2PrevCity: '',
  c2PrevState: '',
  c2PrevZip: '',
  c2PrevCountry: 'USA',
  c2Employer: '',
  c2BusinessPhone: '',
  c2PrimaryIdDesc: '',
  c2PrimaryIdState: '',
  c2Dob: '',
  c2PrimaryIssueDate: '',
  c2PrimaryExpDate: '',
  c2SecondaryIdDesc: '',
  c2SecondaryIdState: '',
  c2SecondaryIssueDate: '',
  c2SecondaryExpDate: '',

  w9SubjectToBackup: false,
  w9ExemptFromBackup: false,
  w9ManualSubmit: false,
  w9Signature: '',

  isWisconsinResident: false,
  c1MaritalStatus: '',
  c2MaritalStatus: '',
  wiSpouseName: '',
  wiSpouseAddress: '',

  isTexasResident: false,
  txAgreementAccepted: false,
  txC1Signature: '',
  txC2Signature: '',
  txManualSubmit: false,

  agreementAccepted: true,
  c1Signature: '',
  c1SignatureDate: new Date().toLocaleDateString('en-US'),
  c1ManualSubmit: false,
  c2Signature: '',
  c2SignatureDate: new Date().toLocaleDateString('en-US'),
  c2ManualSubmit: false,
};

interface EnrollmentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnrollSuccess?: (newCustomerName: string, accountType: string, fullData?: EnrollmentFormData) => void;
  initialCustomerName?: string;
  initialFormData?: EnrollmentFormData;
}

export const EnrollmentRegistrationModal: React.FC<EnrollmentRegistrationModalProps> = ({
  isOpen,
  onClose,
  onEnrollSuccess,
  initialCustomerName = '',
  initialFormData,
}) => {
  const [formData, setFormData] = useState<EnrollmentFormData>(() => {
    if (initialFormData) {
      return { ...initialFormData };
    }
    return {
      ...INITIAL_FORM_STATE,
      c1FullName: initialCustomerName || '',
      c1Signature: initialCustomerName || '',
      w9Signature: initialCustomerName || '',
    };
  });

  const [activeTab, setActiveTab] = useState<'interactive' | 'pdfView'>('interactive');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showFieldList, setShowFieldList] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'type' | 'draw'>('type');

  if (!isOpen) return null;

  const handleInputChange = (field: keyof EnrollmentFormData, value: any) => {
    setRegistrationError('');
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrefillSample = () => {
    setRegistrationError('');
    setFormData((prev) => ({
      ...prev,
      username: 'morgan_vance',
      password: 'vancePassword99!',
      confirmPassword: 'vancePassword99!',
      email: 'morgan.vance@example.com',
      c1FullName: 'Morgan Vance',
      c1StreetAddress: '1048 Montgomery St, Apt 4B',
      c1City: 'San Francisco',
      c1State: 'CA',
      c1Zip: '94133',
      c1Country: 'USA',
      c1Tin: '987-65-4321',
      c1HomePhone: '(415) 890-2134',
      c1Dob: '1992-06-14',
      c1Employer: 'Apex BioTech Corp',
      c1BusinessPhone: '(415) 555-0199',
      c1PrimaryIdDesc: "California Driver's License",
      c1PrimaryIdState: 'CA',
      c1PrimaryIssueDate: '2021-04-10',
      c1PrimaryExpDate: '2027-06-14',
      c1SecondaryIdDesc: 'Social Security Card (Official)',
      c1SecondaryIdState: 'USA',
      c1Signature: 'Morgan Vance',
      w9Signature: 'Morgan Vance',
      initialDeposit: '0.00',
    }));
  };

  // Field validation and completeness
  const requiredFields: { key: keyof EnrollmentFormData; label: string; step: number }[] = [
    { key: 'username', label: 'Online Banking Username', step: 1 },
    { key: 'password', label: 'Online Banking Password', step: 1 },
    { key: 'c1FullName', label: 'Customer 1 Full Name', step: 1 },
    { key: 'c1StreetAddress', label: 'Customer 1 Street Address', step: 1 },
    { key: 'c1City', label: 'Customer 1 City', step: 1 },
    { key: 'c1State', label: 'Customer 1 State', step: 1 },
    { key: 'c1Zip', label: 'Customer 1 Zip Code', step: 1 },
    { key: 'c1Tin', label: 'Taxpayer ID (SSN / TIN)', step: 1 },
    { key: 'c1HomePhone', label: 'Customer 1 Telephone', step: 1 },
    { key: 'c1Dob', label: 'Date of Birth', step: 1 },
    { key: 'c1Employer', label: 'Current Employer', step: 1 },
    { key: 'c1PrimaryIdDesc', label: 'Primary ID Description', step: 1 },
    { key: 'c1Signature', label: 'Customer 1 Authorized Signature', step: 4 },
  ];

  const filledCount = requiredFields.filter((f) => Boolean(String(formData[f.key] || '').trim())).length;
  const progressPercent = Math.round((filledCount / requiredFields.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError('');

    const cleanUsername = (formData.username || '').trim();
    const cleanPassword = (formData.password || '').trim();
    const confirmPassword = (formData.confirmPassword || '').trim();
    const finalName = formData.c1FullName.trim() || cleanUsername || 'New Account Holder';

    if (!cleanUsername || cleanUsername.length < 3) {
      setRegistrationError('Please provide an Online Banking Username with at least 3 characters (Step 1).');
      setStep(1);
      return;
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      setRegistrationError('Please provide an Online Banking Password with at least 4 characters (Step 1).');
      setStep(1);
      return;
    }

    if (confirmPassword && cleanPassword !== confirmPassword) {
      setRegistrationError('Passwords do not match. Please ensure both password fields match (Step 1).');
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword,
          registrationData: {
            ...formData,
            username: cleanUsername,
            initialDeposit: '0.00',
          },
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok || !data.success) {
        setRegistrationError(data.error || 'Registration failed. Please choose another username.');
        setStep(1);
        return;
      }

      if (onEnrollSuccess) {
        onEnrollSuccess(finalName, formData.accountType, formData);
      }
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setRegistrationError('Unable to connect to the banking registration database. Please try again.');
    }
  };

  const handleShareInvite = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-stone-300 animate-in zoom-in-95">
        
        {/* PDF Editor / Form Header (Matching User Prompt Specification) */}
        <div className="bg-[#242424] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#d71e28] text-white p-1 rounded font-serif font-black text-xs">
              WF
            </div>
            <div>
              <span className="font-semibold text-xs text-white block">
                Consumer Account Application (Signature Card)
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                FORM DSG8921 (02-07 105252) • Page 1 of 1
              </span>
            </div>
          </div>

          {/* PDF Editor Header Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'interactive'
                  ? 'bg-[#d71e28] text-white shadow-xs'
                  : 'bg-stone-800 text-stone-300 hover:text-white'
              }`}
              title="Edit & fill out application"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Edit & Fill Form</span>
            </button>

            <button
              onClick={() => setActiveTab('pdfView')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'pdfView'
                  ? 'bg-[#d71e28] text-white shadow-xs'
                  : 'bg-stone-800 text-stone-300 hover:text-white'
              }`}
              title="View authentic printable document"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Document / PDF View</span>
            </button>

            <button
              onClick={() => setShowFieldList(!showFieldList)}
              className="hidden md:inline-flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1.5 rounded text-xs transition-colors"
              title="List of fields to fill in"
            >
              <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
              <span>Fields ({filledCount}/{requiredFields.length})</span>
            </button>

            <button
              onClick={handleShareInvite}
              className="hidden lg:inline-flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1.5 rounded text-xs transition-colors"
              title="Invite joint co-signer to sign"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{copiedLink ? 'Link Copied!' : 'Invite to Sign'}</span>
            </button>

            <button
              onClick={() => downloadSignatureCardPdf(formData, initialCustomerName)}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors flex items-center gap-1 text-xs"
              title="Download Signature Card PDF"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wells Fargo Red Brand Ribbon & Instructions Notice */}
        <div className="bg-[#d71e28] text-white px-4 py-2 border-b-2 border-[#ffcc00] flex flex-wrap items-center justify-between text-xs gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <WfLogo size="sm" variant="white" />
            <span className="font-medium text-white/90">
              Online Consumer Account Enrollment & Signature Card
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrefillSample}
              className="bg-black/30 hover:bg-black/40 text-amber-200 hover:text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors border border-amber-300/30"
              title="Auto-fill sample data for quick preview"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Auto-Fill Sample Data</span>
            </button>

            <span className="hidden sm:inline text-white/80 text-[11px]">
              Assistance: 1-800-956-4442
            </span>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-2 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-4">
            <span className="font-bold text-stone-800">
              Completion: {progressPercent}%
            </span>
            <div className="w-32 sm:w-48 bg-stone-300 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {activeTab === 'interactive' && (
            <div className="flex items-center gap-1 sm:gap-2 text-[11px] font-semibold text-stone-600">
              {[
                { s: 1, label: 'Customer 1' },
                { s: 2, label: 'Customer 2 (Joint)' },
                { s: 3, label: 'W-9 & State' },
                { s: 4, label: 'Signatures' },
              ].map((st) => (
                <button
                  key={st.s}
                  onClick={() => setStep(st.s as any)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    step === st.s
                      ? 'bg-stone-900 text-white'
                      : 'hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {st.s}. {st.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-stone-50 relative flex">
          {/* Main Form Content */}
          <div className="flex-1 p-4 sm:p-6">

            {/* TAB 1: INTERACTIVE FORM FILL */}
            {activeTab === 'interactive' && (
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                
                {/* STEP 1: Account Selection & Customer 1 (Primary) */}
                {step === 1 && (
                  <div className="space-y-6 bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-in fade-in">
                    
                    {/* Mailing Instructions callout verbatim */}
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-stone-700 space-y-1">
                      <span className="font-bold text-stone-900 block">
                        Mailing & Account Instructions:
                      </span>
                      <p>
                        1. Complete the information on this Consumer Account Application. 2. Sign and date where indicated. 3. Wells Fargo Services, P.O. Box 5110, Sioux Falls, SD 57117-9939. (Please do not send deposits to this address. Unable to print? Call 1-800-956-4442).
                      </p>
                    </div>

                    {/* Registration Error Notification */}
                    {registrationError && (
                      <div className="p-3.5 bg-red-50 border border-red-300 rounded-lg text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Registration Error</span>
                          <span>{registrationError}</span>
                        </div>
                      </div>
                    )}

                    {/* Online Banking Sign-On Credentials (Saved into Database) */}
                    <div className="border border-stone-300 rounded-lg overflow-hidden shadow-xs">
                      <div className="bg-stone-900 text-white px-4 py-2 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#ffcc00]" />
                          <span>Online Banking Sign-On Credentials</span>
                        </span>
                        <span className="text-[10px] text-stone-300 font-normal">Saved to Database for Login</span>
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50/60">
                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">
                            Username <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.username || ''}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className="w-full border border-stone-300 bg-white rounded p-2 text-stone-900 focus:border-[#d71e28] focus:ring-1 focus:ring-[#d71e28]"
                            placeholder="Choose your username"
                          />
                          <p className="text-[11px] text-stone-500 mt-1">You will use this username to sign on.</p>
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">
                            Email Address <span className="text-stone-500">(Optional)</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full border border-stone-300 bg-white rounded p-2 text-stone-900 focus:border-[#d71e28]"
                            placeholder="name@example.com"
                          />
                          <p className="text-[11px] text-stone-500 mt-1">For e-statements and security updates.</p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="font-semibold text-stone-700 block">
                              Password <span className="text-red-600">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowRegPassword(!showRegPassword)}
                              className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                            >
                              {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              <span>{showRegPassword ? 'Hide' : 'Show'}</span>
                            </button>
                          </div>
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={formData.password || ''}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full border border-stone-300 bg-white rounded p-2 text-stone-900 focus:border-[#d71e28] focus:ring-1 focus:ring-[#d71e28]"
                            placeholder="Create your password (min 4 chars)"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">
                            Confirm Password <span className="text-red-600">*</span>
                          </label>
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword || ''}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="w-full border border-stone-300 bg-white rounded p-2 text-stone-900 focus:border-[#d71e28] focus:ring-1 focus:ring-[#d71e28]"
                            placeholder="Re-enter your password"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account(s) I Want to Open & Bank Use Only */}
                    <div className="border border-stone-300 rounded-lg overflow-hidden">
                      <div className="bg-stone-100 px-4 py-2 border-b border-stone-300 font-bold text-xs text-stone-800 uppercase tracking-wider flex items-center justify-between">
                        <span>Account(s) I Want to Open</span>
                        <span className="text-[11px] text-stone-500 font-mono font-normal">Bank Use: ROUTING #061000227</span>
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Select Account Type</label>
                          <select
                            value={formData.accountType}
                            onChange={(e) => handleInputChange('accountType', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900 focus:border-[#d71e28]"
                          >
                            <option value="Everyday Checking">Everyday Checking ($25 min deposit)</option>
                            <option value="Way2Save Savings">Way2Save® Savings</option>
                            <option value="Checking & Savings Bundle">Everyday Checking & Way2Save Bundle</option>
                            <option value="Platinum Savings">Platinum Savings (High Yield)</option>
                            <option value="Time CD">Fixed-Rate Certificate of Deposit (CD)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Opening Deposit ($)</label>
                          <input
                            type="text"
                            value={formData.initialDeposit}
                            onChange={(e) => handleInputChange('initialDeposit', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900 focus:border-[#d71e28]"
                            placeholder="100.00"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Promotion / Bonus Code</label>
                          <input
                            type="text"
                            value={formData.offerCode}
                            onChange={(e) => handleInputChange('offerCode', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900 font-mono bg-stone-50"
                            placeholder="JA23OU"
                          />
                        </div>
                      </div>
                    </div>

                    {/* USA PATRIOT Act verbatim notice */}
                    <div className="p-3 bg-stone-100 rounded text-[11px] text-stone-600 leading-relaxed border border-stone-200">
                      <span className="font-bold text-stone-800">Important Information About Procedures for Opening a New Account: </span>
                      To help the government fight the funding of terrorism and money laundering activities, U.S. Federal law requires financial institutions to obtain, verify, and record information that identifies each person (individuals and businesses) who opens an account. What this means for you: When you open an account, we will ask for your name, address, date of birth and other information that will allow us to identify you. We may also ask to see your driver's license or other identifying documents.
                    </div>

                    {/* Customer 1 Information Header */}
                    <div className="border-t border-stone-200 pt-4">
                      <h3 className="font-serif text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#d71e28]" />
                        <span>Customer 1 Information (Primary Applicant)</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div className="sm:col-span-2">
                          <label className="font-semibold text-stone-700 block mb-1">
                            Full Name <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.c1FullName}
                            onChange={(e) => handleInputChange('c1FullName', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900 focus:border-[#d71e28]"
                            placeholder="First Middle Last"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">
                            Taxpayer ID (SSN / TIN) <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.c1Tin}
                            onChange={(e) => handleInputChange('c1Tin', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900 font-mono focus:border-[#d71e28]"
                            placeholder="XXX-XX-XXXX"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-semibold text-stone-700 block mb-1">
                            Street Address <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.c1StreetAddress}
                            onChange={(e) => handleInputChange('c1StreetAddress', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900 focus:border-[#d71e28]"
                            placeholder="123 Main St, Apt 4B (No P.O. Box)"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">How Long at Address?</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={formData.c1HowLongYr}
                              onChange={(e) => handleInputChange('c1HowLongYr', e.target.value)}
                              className="w-1/2 border border-stone-300 rounded p-2 text-stone-900"
                              placeholder="Yrs"
                            />
                            <input
                              type="number"
                              value={formData.c1HowLongMo}
                              onChange={(e) => handleInputChange('c1HowLongMo', e.target.value)}
                              className="w-1/2 border border-stone-300 rounded p-2 text-stone-900"
                              placeholder="Mos"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="font-semibold text-stone-700 block mb-1">
                            Directional Address (Document directional address for customers who do not have physical residence, business or alternate street address)
                          </label>
                          <input
                            type="text"
                            value={formData.c1DirectionalAddress}
                            onChange={(e) => handleInputChange('c1DirectionalAddress', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="Optional: Landmarks, cross streets, rural route directions"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">City <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            required
                            value={formData.c1City}
                            onChange={(e) => handleInputChange('c1City', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="City"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">State & Zip <span className="text-red-600">*</span></label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={formData.c1State}
                              onChange={(e) => handleInputChange('c1State', e.target.value)}
                              className="w-20 border border-stone-300 rounded p-2 text-stone-900"
                              placeholder="State"
                            />
                            <input
                              type="text"
                              required
                              value={formData.c1Zip}
                              onChange={(e) => handleInputChange('c1Zip', e.target.value)}
                              className="flex-1 border border-stone-300 rounded p-2 text-stone-900"
                              placeholder="Zip"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Home / Mobile Phone <span className="text-red-600">*</span></label>
                          <input
                            type="tel"
                            required
                            value={formData.c1HomePhone}
                            onChange={(e) => handleInputChange('c1HomePhone', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="(555) 000-0000"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-semibold text-stone-700 block mb-1">Previous Street Address (If less than 2 years at current)</label>
                          <input
                            type="text"
                            value={formData.c1PrevAddress}
                            onChange={(e) => handleInputChange('c1PrevAddress', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="Previous street address"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Previous City, State & Zip</label>
                          <input
                            type="text"
                            value={formData.c1PrevCity}
                            onChange={(e) => handleInputChange('c1PrevCity', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="City, State, Zip"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Current Employer <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            required
                            value={formData.c1Employer}
                            onChange={(e) => handleInputChange('c1Employer', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="Company Name or Self-Employed"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Business Phone</label>
                          <input
                            type="tel"
                            value={formData.c1BusinessPhone}
                            onChange={(e) => handleInputChange('c1BusinessPhone', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="(555) 000-0000"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Date of Birth <span className="text-red-600">*</span></label>
                          <input
                            type="date"
                            required
                            value={formData.c1Dob}
                            onChange={(e) => handleInputChange('c1Dob', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Primary ID Description <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            required
                            value={formData.c1PrimaryIdDesc}
                            onChange={(e) => handleInputChange('c1PrimaryIdDesc', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="Driver's License / US Passport"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Primary ID State/Country & Issue Date</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={formData.c1PrimaryIdState}
                              onChange={(e) => handleInputChange('c1PrimaryIdState', e.target.value)}
                              className="w-20 border border-stone-300 rounded p-2 text-stone-900"
                              placeholder="CA"
                            />
                            <input
                              type="date"
                              value={formData.c1PrimaryIssueDate}
                              onChange={(e) => handleInputChange('c1PrimaryIssueDate', e.target.value)}
                              className="flex-1 border border-stone-300 rounded p-2 text-stone-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Primary ID Exp. Date</label>
                          <input
                            type="date"
                            value={formData.c1PrimaryExpDate}
                            onChange={(e) => handleInputChange('c1PrimaryExpDate', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-semibold text-stone-700 block mb-1">Secondary ID Description</label>
                          <input
                            type="text"
                            value={formData.c1SecondaryIdDesc}
                            onChange={(e) => handleInputChange('c1SecondaryIdDesc', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="Work ID / Student ID / Utility Bill / Credit Card"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Secondary ID State/Country</label>
                          <input
                            type="text"
                            value={formData.c1SecondaryIdState}
                            onChange={(e) => handleInputChange('c1SecondaryIdState', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="State or Country"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-stone-200">
                      <span className="text-xs text-stone-500">* Required fields to open account</span>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-[#d71e28] hover:bg-[#b81620] text-white px-6 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Next: Customer 2 (Joint)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Customer 2 Information (Joint Signer) */}
                {step === 2 && (
                  <div className="space-y-6 bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                          <Users className="w-5 h-5 text-[#d71e28]" />
                          <span>Customer 2 Information (Joint Account Holder)</span>
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Optional: Add a spouse, family member, or co-signer with equal access to the account
                        </p>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.hasCustomer2}
                          onChange={(e) => handleInputChange('hasCustomer2', e.target.checked)}
                          className="h-4 w-4 text-[#d71e28] rounded border-stone-300"
                        />
                        <span>Add Joint Owner</span>
                      </label>
                    </div>

                    {!formData.hasCustomer2 ? (
                      <div className="text-center py-10 space-y-3 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                        <Users className="w-10 h-10 text-stone-400 mx-auto" />
                        <h4 className="text-sm font-semibold text-stone-800">Applying as an Individual (No Joint Signer)</h4>
                        <p className="text-xs text-stone-500 max-w-md mx-auto">
                          You are currently applying as a single account holder. Check "Add Joint Owner" above if you wish to add a secondary customer to this signature card.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleInputChange('hasCustomer2', true)}
                          className="border border-stone-800 text-stone-900 px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-stone-100"
                        >
                          Enable Joint Customer 2
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div className="sm:col-span-2">
                          <label className="font-semibold text-stone-700 block mb-1">Customer 2 Full Name</label>
                          <input
                            type="text"
                            value={formData.c2FullName}
                            onChange={(e) => handleInputChange('c2FullName', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="Full Name"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Customer 2 Taxpayer ID (TIN / SSN)</label>
                          <input
                            type="text"
                            value={formData.c2Tin}
                            onChange={(e) => handleInputChange('c2Tin', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900 font-mono"
                            placeholder="XXX-XX-XXXX"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-semibold text-stone-700 block mb-1">Street Address</label>
                          <input
                            type="text"
                            value={formData.c2StreetAddress}
                            onChange={(e) => handleInputChange('c2StreetAddress', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="Street Address"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">City, State & Zip</label>
                          <input
                            type="text"
                            value={formData.c2City}
                            onChange={(e) => handleInputChange('c2City', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="City, State Zip"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Telephone</label>
                          <input
                            type="tel"
                            value={formData.c2HomePhone}
                            onChange={(e) => handleInputChange('c2HomePhone', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="(555) 000-0000"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Date of Birth</label>
                          <input
                            type="date"
                            value={formData.c2Dob}
                            onChange={(e) => handleInputChange('c2Dob', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-stone-700 block mb-1">Primary ID Description</label>
                          <input
                            type="text"
                            value={formData.c2PrimaryIdDesc}
                            onChange={(e) => handleInputChange('c2PrimaryIdDesc', e.target.value)}
                            className="w-full border border-stone-300 rounded p-2 text-stone-900"
                            placeholder="Driver's License / Passport"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex justify-between items-center border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="border border-stone-300 text-stone-700 px-5 py-2 rounded-full text-xs font-semibold hover:bg-stone-50"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="bg-[#d71e28] hover:bg-[#b81620] text-white px-6 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Next: W-9 & State Certifications</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Request for Taxpayer ID (Substitute W-9), Wisconsin & Texas Clauses */}
                {step === 3 && (
                  <div className="space-y-6 bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-in fade-in">
                    
                    {/* W-9 Verbatim Block */}
                    <div className="border border-stone-300 rounded-lg p-5 bg-stone-50/50 space-y-3 text-xs">
                      <div className="border-b border-stone-300 pb-2">
                        <span className="font-bold text-stone-900 text-sm block">
                          Request for Taxpayer Identification Number and Certification (Substitute Form W-9)
                        </span>
                        <span className="text-[11px] text-stone-500">Department of the Treasury • Internal Revenue Service</span>
                      </div>

                      <div className="space-y-2 text-stone-700 leading-relaxed text-[11px]">
                        <p className="font-semibold text-stone-900">
                          Certification: Under penalties of perjury, I certify that:
                        </p>
                        <p>1) The number shown on this form is my correct Taxpayer Identification Number, and</p>
                        <p>
                          2) UNLESS I HAVE CHECKED ONE OF THE BOXES BELOW, I am not subject to backup withholding either because I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or the IRS has notified me that I am no longer subject to backup withholding (does not apply to real estate transactions, mortgage interest paid, the acquisition or abandonment of secured property, contributions to an Individual Retirement Arrangement (IRA), and payments other than interest and dividends), and
                        </p>
                        <p>3) I am a U.S. person (including a U.S. resident alien).</p>
                        <p className="italic text-stone-500">
                          The Internal Revenue Service does not require your consent to any provision of this document other than the certifications required to avoid backup withholding.
                        </p>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-4 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                          <input
                            type="checkbox"
                            checked={formData.w9SubjectToBackup}
                            onChange={(e) => handleInputChange('w9SubjectToBackup', e.target.checked)}
                            className="h-4 w-4 text-[#d71e28] rounded border-stone-300"
                          />
                          <span>I am subject to backup withholding.</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                          <input
                            type="checkbox"
                            checked={formData.w9ExemptFromBackup}
                            onChange={(e) => handleInputChange('w9ExemptFromBackup', e.target.checked)}
                            className="h-4 w-4 text-[#d71e28] rounded border-stone-300"
                          />
                          <span>I am exempt from backup withholding.</span>
                        </label>
                      </div>

                      <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <label className="font-semibold text-stone-800 block mb-1">TIN Certification Signature</label>
                          <input
                            type="text"
                            value={formData.w9Signature}
                            onChange={(e) => handleInputChange('w9Signature', e.target.value)}
                            className="border border-stone-300 rounded p-1.5 w-64 text-stone-900 font-serif"
                            placeholder="Type full legal name as digital signature"
                          />
                        </div>

                        <label className="flex items-center gap-2 text-[11px] text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.w9ManualSubmit}
                            onChange={(e) => handleInputChange('w9ManualSubmit', e.target.checked)}
                            className="rounded border-stone-300"
                          />
                          <span>Submit manually / signature not required online</span>
                        </label>
                      </div>
                    </div>

                    {/* Wisconsin Residents Only Section verbatim */}
                    <div className="border border-amber-200 bg-amber-50/40 rounded-lg p-4 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">
                          Wisconsin Residents Only (Marital Property Act)
                        </span>
                        <label className="flex items-center gap-1.5 text-[11px] text-stone-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isWisconsinResident}
                            onChange={(e) => handleInputChange('isWisconsinResident', e.target.checked)}
                            className="rounded border-stone-300"
                          />
                          <span>I reside in Wisconsin</span>
                        </label>
                      </div>

                      {formData.isWisconsinResident && (
                        <div className="space-y-3 pt-2 text-[11px] text-stone-700 border-t border-amber-200 animate-in fade-in">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="font-semibold block mb-1">Customer 1 Marital Status:</span>
                              <div className="flex gap-3">
                                {['married', 'unmarried', 'legally separated'].map((m) => (
                                  <label key={m} className="flex items-center gap-1 capitalize cursor-pointer">
                                    <input
                                      type="radio"
                                      name="c1Marital"
                                      value={m}
                                      checked={formData.c1MaritalStatus === m}
                                      onChange={(e) => handleInputChange('c1MaritalStatus', e.target.value)}
                                      className="text-[#d71e28]"
                                    />
                                    <span>{m}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {formData.hasCustomer2 && (
                              <div>
                                <span className="font-semibold block mb-1">Customer 2 Marital Status:</span>
                                <div className="flex gap-3">
                                  {['married', 'unmarried', 'legally separated'].map((m) => (
                                    <label key={m} className="flex items-center gap-1 capitalize cursor-pointer">
                                      <input
                                        type="radio"
                                        name="c2Marital"
                                        value={m}
                                        checked={formData.c2MaritalStatus === m}
                                        onChange={(e) => handleInputChange('c2MaritalStatus', e.target.value)}
                                        className="text-[#d71e28]"
                                      />
                                      <span>{m}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <p className="leading-relaxed bg-white p-2.5 rounded border border-amber-200">
                            <strong>NOTICE TO MARRIED APPLICANTS:</strong> No provision of any marital property agreement, unilateral statement under Sec. 766.59 Wis. Stats, or a court decree under Sec. 766.70 adversely affects the interest of the creditor unless the creditor, prior to the time the credit is granted, is furnished a copy of the agreement, statement or court decree or has actual knowledge of the adverse provisions when the obligation to the creditor is incurred.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Joint Account with Right of Survivorship (Texas Only) verbatim */}
                    <div className="border border-blue-200 bg-blue-50/40 rounded-lg p-4 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">
                          Joint Account with Right of Survivorship (Texas Only)
                        </span>
                        <label className="flex items-center gap-1.5 text-[11px] text-stone-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isTexasResident}
                            onChange={(e) => handleInputChange('isTexasResident', e.target.checked)}
                            className="rounded border-stone-300"
                          />
                          <span>Texas Account / Resident</span>
                        </label>
                      </div>

                      {formData.isTexasResident && (
                        <div className="space-y-3 pt-2 text-[11px] text-stone-700 border-t border-blue-200 animate-in fade-in">
                          <p className="leading-relaxed bg-white p-2.5 rounded border border-blue-200">
                            The persons signing this section hereby agree with each other and the bank that this account is a joint account with right of survivorship, and that on the death of one party to a joint account, all sums in the account on the date of death vest in and belong to the surviving party as his or her separate property and estate. Each person signing this section who is married to a person who is not also signing this section represents and warrants that no funds now or hereafter deposited to the account, nor any interest earned on such funds, are subject to the management, control or disposition (jointly or otherwise) of such person's spouse.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="font-semibold block mb-1">Texas Customer 1 Signature</label>
                              <input
                                type="text"
                                value={formData.txC1Signature}
                                onChange={(e) => handleInputChange('txC1Signature', e.target.value)}
                                className="w-full border border-stone-300 rounded p-1.5 font-serif"
                                placeholder="Signature"
                              />
                            </div>
                            <div>
                              <label className="font-semibold block mb-1">Texas Customer 2 Signature</label>
                              <input
                                type="text"
                                value={formData.txC2Signature}
                                onChange={(e) => handleInputChange('txC2Signature', e.target.value)}
                                className="w-full border border-stone-300 rounded p-1.5 font-serif"
                                placeholder="Signature (if applicable)"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="border border-stone-300 text-stone-700 px-5 py-2 rounded-full text-xs font-semibold hover:bg-stone-50"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="bg-[#d71e28] hover:bg-[#b81620] text-white px-6 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Next: Signatures & Submit</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Signatures & Binding Authorization Agreement */}
                {step === 4 && (
                  <div className="space-y-6 bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-in fade-in">
                    
                    {/* General Signatures verbatim text */}
                    <div className="border border-stone-300 bg-stone-50 p-4 rounded-lg text-[11px] text-stone-700 space-y-2 leading-relaxed">
                      <span className="font-bold text-stone-900 text-xs block">
                        Signatures & Agreement:
                      </span>
                      <p>
                        Everything I have stated in this application is correct. You are authorized to make any inquiries that you consider appropriate to determine if you should open the account. This may include ordering a credit report or other report (i.e. information from any motor vehicle department or other state agency) on me. I have received a copy of the applicable account agreement and privacy brochure and agree to be bound by them, including the terms of the Direct Deposit Advance® Service and Deposit AdvanceSM Service (Deposit Advance Service not available in all states) described in the Service Agreement and Product Guide. I also agree to the terms of the dispute resolution program described in the account agreement and Service Agreement and Product Guide. Under this program our disputes will be decided before one or more neutral persons in an arbitration proceeding and not by a jury trial or a trial before a judge.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      {/* Customer 1 Signature Box */}
                      <div className="border border-stone-300 rounded-xl p-4 space-y-3 bg-stone-50/50">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900">
                            Customer 1 Authorized Signature <span className="text-red-600">*</span>
                          </span>
                          <span className="text-[11px] text-stone-500 font-mono">Date: {formData.c1SignatureDate}</span>
                        </div>

                        {!formData.c1ManualSubmit ? (
                          <div>
                            <label className="block text-[11px] text-stone-600 mb-1">
                              Type or Draw Signature:
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.c1Signature}
                              onChange={(e) => handleInputChange('c1Signature', e.target.value)}
                              className="w-full border-2 border-stone-400 focus:border-[#d71e28] rounded p-2.5 text-lg font-serif italic text-stone-900 bg-white"
                              placeholder="Your Legal Signature"
                            />
                            <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Legally binding e-signature under U.S. Electronic Signatures Act</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-stone-200/60 rounded text-center text-[11px] text-stone-600">
                            Manual submission selected. Please print out this form, sign by hand, and mail to Sioux Falls, SD.
                          </div>
                        )}

                        <label className="flex items-center gap-2 text-[11px] text-stone-600 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={formData.c1ManualSubmit}
                            onChange={(e) => handleInputChange('c1ManualSubmit', e.target.checked)}
                            className="rounded border-stone-300"
                          />
                          <span>Submit manually / signature not required</span>
                        </label>
                      </div>

                      {/* Customer 2 Signature Box (if applicable) */}
                      {formData.hasCustomer2 ? (
                        <div className="border border-stone-300 rounded-xl p-4 space-y-3 bg-stone-50/50">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900">
                              Customer 2 Authorized Signature
                            </span>
                            <span className="text-[11px] text-stone-500 font-mono">Date: {formData.c2SignatureDate}</span>
                          </div>

                          {!formData.c2ManualSubmit ? (
                            <div>
                              <input
                                type="text"
                                value={formData.c2Signature}
                                onChange={(e) => handleInputChange('c2Signature', e.target.value)}
                                className="w-full border-2 border-stone-400 focus:border-[#d71e28] rounded p-2.5 text-lg font-serif italic text-stone-900 bg-white"
                                placeholder="Customer 2 Signature"
                              />
                            </div>
                          ) : (
                            <div className="p-3 bg-stone-200/60 rounded text-center text-[11px] text-stone-600">
                              Customer 2 manual submission selected.
                            </div>
                          )}

                          <label className="flex items-center gap-2 text-[11px] text-stone-600 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={formData.c2ManualSubmit}
                              onChange={(e) => handleInputChange('c2ManualSubmit', e.target.checked)}
                              className="rounded border-stone-300"
                            />
                            <span>Submit manually / signature not required</span>
                          </label>
                        </div>
                      ) : (
                        <div className="border border-dashed border-stone-300 rounded-xl p-4 flex flex-col items-center justify-center text-center text-stone-500">
                          <User className="w-8 h-8 text-stone-400 mb-1" />
                          <span className="text-xs font-semibold">Single Customer Signature</span>
                          <span className="text-[11px]">No secondary signer designated</span>
                        </div>
                      )}
                    </div>

                    {/* Master Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-800">
                        <input
                          type="checkbox"
                          required
                          checked={formData.agreementAccepted}
                          onChange={(e) => handleInputChange('agreementAccepted', e.target.checked)}
                          className="mt-0.5 h-4 w-4 text-[#d71e28] rounded border-stone-300"
                        />
                        <span>
                          I acknowledge that I have read, understand, and agree to the Consumer Account Application (Signature Card Form DSG8921), terms, disclosures, and dispute resolution program.
                        </span>
                      </label>
                    </div>

                    <div className="pt-4 flex flex-wrap justify-between items-center gap-3 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="border border-stone-300 text-stone-700 px-5 py-2 rounded-full text-xs font-semibold hover:bg-stone-50"
                      >
                        Back
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveTab('pdfView')}
                          className="border border-stone-800 text-stone-900 px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-stone-50"
                        >
                          Preview PDF Document
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting || !formData.c1FullName.trim() || (!formData.c1Signature.trim() && !formData.c1ManualSubmit)}
                          className="bg-[#d71e28] hover:bg-[#b81620] text-white px-8 py-2.5 rounded-full text-xs font-bold transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <span>Submitting Application...</span>
                          ) : (
                            <>
                              <span>Submit Application & Open Account</span>
                              <CheckCircle2 className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}

            {/* TAB 2: AUTHENTIC DOCUMENT / PDF VIEW (DSG8921 EXACT LAYOUT) */}
            {activeTab === 'pdfView' && (
              <div className="max-w-4xl mx-auto bg-white border border-stone-400 p-8 shadow-xl text-stone-900 font-sans space-y-5 rounded-xs animate-in fade-in">
                
                {/* Form Header */}
                <div className="flex items-start justify-between border-b-2 border-stone-900 pb-3">
                  <div>
                    <div className="bg-[#d71e28] text-white font-serif font-black px-2.5 py-1 inline-block text-xs uppercase tracking-widest mb-1.5">
                      WELLS FARGO
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                      Consumer Account Application (Signature Card)
                    </h1>
                    <span className="text-xs text-stone-600">Wells Fargo Bank, N.A. • Deposit Products Group</span>
                  </div>
                  <div className="text-right text-[11px] text-stone-600 font-mono">
                    <span className="font-bold text-stone-900 block">DSG8921 (02-07 105252)</span>
                    <span>Page 1 of 1</span>
                  </div>
                </div>

                {/* Mailing Instructions Verbatim */}
                <div className="border border-stone-300 p-3 bg-stone-50 text-[11px] text-stone-800 space-y-1">
                  <span className="font-bold block">Mailing Instructions:</span>
                  <p>1. Print out this document. Complete the information on the Consumer Account Application.</p>
                  <p>2. Sign and date the form where indicated. (Opening more than one account? Please complete and return the designated Signature Card for each account and return them in one envelope.)</p>
                  <p>3. Mail your signed Consumer Account Application(s) to: <strong>Wells Fargo Services, P.O. Box 5110, Sioux Falls, SD 57117-9939</strong>. Please do not send deposits to this address.</p>
                  <p className="italic text-stone-600">
                    Unable to print at this time? Call us at 1-800-956-4442 for assistance. The Direct Deposit Advance® Service may be available to Wisconsin consumer checking accounts with directly deposited income.
                  </p>
                </div>

                {/* Account(s) I Want to Open & Bank Use Only */}
                <div className="border border-stone-900 text-xs">
                  <div className="grid grid-cols-2 divide-x divide-stone-900">
                    <div className="p-2.5 bg-stone-50">
                      <span className="font-bold block uppercase text-[10px] text-stone-600 mb-1">Account(s) I Want to Open</span>
                      <div className="font-bold text-stone-900 text-sm">
                        {formData.accountType}
                      </div>
                      <div className="text-[11px] text-stone-600 mt-1">
                        Initial Opening Deposit: ${formData.initialDeposit || '0.00'} • Offer Code: {formData.offerCode || 'JA23OU'}
                      </div>
                    </div>
                    <div className="p-2.5 bg-stone-100">
                      <span className="font-bold block uppercase text-[10px] text-stone-500 mb-1">Bank Use Only</span>
                      <div className="font-mono text-[11px] text-stone-700 space-y-0.5">
                        <div>ROUTING: 061000227 • BRANCH: 00481</div>
                        <div>DATE OPENED: {new Date().toLocaleDateString('en-US')} • PROMO: JA23OU</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patriot Act Verbatim */}
                <div className="p-2 border border-stone-300 text-[10px] text-stone-600 leading-tight bg-stone-50">
                  <strong>Important Information About Procedures for Opening a New Account:</strong> To help the government fight the funding of terrorism and money laundering activities, U.S. Federal law requires financial institutions to obtain, verify, and record information that identifies each person (individuals and businesses) who opens an account. What this means for you: When you open an account, we will ask for your name, address, date of birth and other information that will allow us to identify you. We may also ask to see your driver's license or other identifying documents.
                </div>

                {/* Customer 1 & Customer 2 Side-by-Side Table (DSG8921 Grid) */}
                <div className="border border-stone-900 text-xs">
                  <div className="grid grid-cols-2 bg-stone-200 border-b border-stone-900 divide-x divide-stone-900 font-bold uppercase text-[11px]">
                    <div className="p-2">Customer 1 Information</div>
                    <div className="p-2">Customer 2 Information</div>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-stone-900 text-[11px]">
                    {/* Customer 1 Column */}
                    <div className="p-2.5 space-y-2">
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase">Full Name</span>
                        <div className="font-bold text-stone-900">{formData.c1FullName || '—'}</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <span className="text-stone-500 block text-[9px] uppercase">Street Address</span>
                          <div>{formData.c1StreetAddress || '—'}</div>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">How long</span>
                          <div>{formData.c1HowLongYr}y {formData.c1HowLongMo}m</div>
                        </div>
                      </div>

                      {formData.c1DirectionalAddress && (
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">Directional Address</span>
                          <div>{formData.c1DirectionalAddress}</div>
                        </div>
                      )}

                      <div className="grid grid-cols-4 gap-1">
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">City</span>
                          <div>{formData.c1City || '—'}</div>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">State</span>
                          <div>{formData.c1State || '—'}</div>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">Zip</span>
                          <div>{formData.c1Zip || '—'}</div>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">Cntry</span>
                          <div>{formData.c1Country || 'USA'}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">TIN / SSN</span>
                          <div className="font-mono">{formData.c1Tin ? `***-**-${formData.c1Tin.slice(-4)}` : '—'}</div>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">Home Phone</span>
                          <div>{formData.c1HomePhone || '—'}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">Current Employer</span>
                          <div>{formData.c1Employer || '—'}</div>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">Business Phone</span>
                          <div>{formData.c1BusinessPhone || '—'}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1">
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">Primary ID</span>
                          <div>{formData.c1PrimaryIdDesc || '—'}</div>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">State/Cntry</span>
                          <div>{formData.c1PrimaryIdState || '—'}</div>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[9px] uppercase">DOB</span>
                          <div>{formData.c1Dob || '—'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Customer 2 Column */}
                    <div className="p-2.5 space-y-2">
                      {formData.hasCustomer2 ? (
                        <>
                          <div>
                            <span className="text-stone-500 block text-[9px] uppercase">Full Name</span>
                            <div className="font-bold text-stone-900">{formData.c2FullName || '—'}</div>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[9px] uppercase">Street Address</span>
                            <div>{formData.c2StreetAddress || '—'}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-stone-500 block text-[9px] uppercase">TIN / SSN</span>
                              <div className="font-mono">{formData.c2Tin || '—'}</div>
                            </div>
                            <div>
                              <span className="text-stone-500 block text-[9px] uppercase">Home Phone</span>
                              <div>{formData.c2HomePhone || '—'}</div>
                            </div>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[9px] uppercase">Primary ID</span>
                            <div>{formData.c2PrimaryIdDesc || '—'} ({formData.c2PrimaryIdState || '—'})</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-stone-400 italic text-center py-10">
                          (No Customer 2 designated / Individual application)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* W-9 Substitute Form Verbatim */}
                <div className="border border-stone-800 p-3 text-[10px] space-y-1.5 leading-tight">
                  <div className="font-bold text-stone-900 text-[11px]">
                    Request for Taxpayer Identification Number and Certification (Substitute Form W-9)
                  </div>
                  <p><strong>Certification: Under penalties of perjury, I certify that:</strong></p>
                  <p>1) The number shown on this form is my correct Taxpayer Identification Number, and</p>
                  <p>2) UNLESS I HAVE CHECKED ONE OF THE BOXES BELOW, I am not subject to backup withholding either because I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or the IRS has notified me that I am no longer subject to backup withholding, and</p>
                  <p>3) I am a U.S. person (including a U.S. resident alien).</p>
                  <div className="flex gap-4 pt-1 font-semibold">
                    <span>[ {formData.w9SubjectToBackup ? 'X' : ' '} ] I am subject to backup withholding.</span>
                    <span>[ {formData.w9ExemptFromBackup ? 'X' : ' '} ] I am exempt from backup withholding.</span>
                  </div>
                </div>

                {/* Wisconsin & Texas Disclosures */}
                <div className="grid grid-cols-2 gap-3 text-[10px] leading-tight text-stone-700">
                  <div className="border border-stone-300 p-2">
                    <span className="font-bold block mb-0.5">Wisconsin Only:</span>
                    <div>Customer 1: {formData.c1MaritalStatus || 'unmarried'}</div>
                    {formData.hasCustomer2 && <div>Customer 2: {formData.c2MaritalStatus || 'unmarried'}</div>}
                    <p className="text-[9px] mt-1 text-stone-500">
                      NOTICE TO MARRIED APPLICANTS: Subject to Sec. 766.59 and 766.70 Wis. Stats.
                    </p>
                  </div>

                  <div className="border border-stone-300 p-2">
                    <span className="font-bold block mb-0.5">Joint Account with Right of Survivorship (Texas Only):</span>
                    <p className="text-[9px] text-stone-500">
                      Vesting in surviving party as separate property and estate upon death under Texas banking code.
                    </p>
                  </div>
                </div>

                {/* Final Signatures Box */}
                <div className="border-2 border-stone-900 p-3 space-y-2">
                  <div className="font-bold text-xs uppercase">Signatures & Authorization</div>
                  <p className="text-[9px] text-stone-600 leading-tight">
                    Everything I have stated in this application is correct. You are authorized to make any inquiries that you consider appropriate. Binding arbitration agreement acknowledged.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="border-b border-stone-800 pb-1">
                      <span className="text-[9px] text-stone-500 block uppercase">Customer 1 Authorized signature</span>
                      <div className="font-serif italic text-base font-bold text-stone-900 min-h-[28px] pt-1">
                        {formData.c1ManualSubmit ? '(Submit manually by mail)' : formData.c1Signature || '_______________________'}
                      </div>
                      <span className="text-[9px] text-stone-500">Date: {formData.c1SignatureDate}</span>
                    </div>

                    <div className="border-b border-stone-800 pb-1">
                      <span className="text-[9px] text-stone-500 block uppercase">Customer 2 Authorized signature</span>
                      <div className="font-serif italic text-base font-bold text-stone-900 min-h-[28px] pt-1">
                        {formData.hasCustomer2
                          ? formData.c2ManualSubmit
                            ? '(Submit manually by mail)'
                            : formData.c2Signature || '_______________________'
                          : 'N/A'}
                      </div>
                      <span className="text-[9px] text-stone-500">Date: {formData.c2SignatureDate}</span>
                    </div>
                  </div>
                </div>

                {/* Action Bar below document */}
                <div className="pt-4 flex justify-between items-center border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('interactive')}
                    className="border border-stone-400 text-stone-700 px-4 py-2 rounded-full text-xs font-semibold hover:bg-stone-50"
                  >
                    &lt;&lt; Return to Form Editor
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => downloadSignatureCardPdf(formData, initialCustomerName)}
                      className="bg-white border border-stone-800 text-stone-900 px-5 py-2 rounded-full text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 shadow-2xs"
                      title="Download Signature Card as PDF file"
                    >
                      <Download className="w-3.5 h-3.5 text-[#d71e28]" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="border border-stone-800 text-stone-900 px-5 py-2 rounded-full text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Document</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-[#d71e28] hover:bg-[#b81620] text-white px-7 py-2 rounded-full text-xs font-bold transition-all shadow-sm"
                    >
                      Confirm & Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: "List of fields to fill in" (Matching User Prompt) */}
          {showFieldList && (
            <div className="w-72 bg-white border-l border-stone-200 p-4 shrink-0 shadow-lg overflow-y-auto hidden md:block">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <span className="font-bold text-xs text-stone-900 block">List of Fields to Fill In</span>
                  <span className="text-[10px] text-stone-500">{filledCount} of {requiredFields.length} completed</span>
                </div>
                <button onClick={() => setShowFieldList(false)}>
                  <X className="w-4 h-4 text-stone-400" />
                </button>
              </div>

              <div className="py-3 space-y-2 text-xs">
                {requiredFields.map((f, i) => {
                  const isDone = Boolean(String(formData[f.key]).trim());
                  return (
                    <div
                      key={f.key}
                      onClick={() => {
                        setActiveTab('interactive');
                        setStep(f.step as any);
                      }}
                      className={`p-2 rounded-lg cursor-pointer flex items-center justify-between border transition-colors ${
                        isDone
                          ? 'bg-emerald-50/60 border-emerald-200 text-stone-800'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-[#d71e28]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-stone-400 shrink-0" />
                        )}
                        <span className="text-[11px] font-medium">{f.label}</span>
                      </div>
                      <span className="text-[9px] text-stone-400 font-mono">S{f.step}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-200">
                <button
                  onClick={handlePrefillSample}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 rounded text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d71e28]" />
                  <span>Fill all sample fields</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
