import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  FileText,
  Printer,
  Copy,
  Check,
  Eye,
  EyeOff,
  Building,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  Lock,
  ExternalLink,
  Edit3,
  Award,
  Download,
} from 'lucide-react';
import { UserProfile, EnrollmentFormData } from '../../types/banking';
import { WfLogo } from '../common/WfLogo';
import { FdicDisclaimer } from '../common/FdicDisclaimer';
import { downloadSignatureCardPdf } from '../../utils/pdfGenerator';
import { useGreeting } from '../../utils/greeting';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfile;
  onOpenEditRegistration?: () => void;
  onOpenPdfSignatureCard?: () => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  userData,
  onOpenEditRegistration,
  onOpenPdfSignatureCard,
}) => {
  const greeting = useGreeting();
  const [showSsn, setShowSsn] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'personal' | 'id' | 'tax' | 'account'>('all');

  if (!isOpen) return null;

  const reg: EnrollmentFormData = userData.registrationData || {
    accountType: 'Checking & Savings Bundle',
    initialDeposit: '100.00',
    offerCode: userData.bonusCode || 'JA23OU',
    bankName: 'Wells Fargo Bank, N.A.',
    c1FullName: userData.name || 'Account Holder',
    c1StreetAddress: '1048 Montgomery St, Apt 4B',
    c1HowLongYr: '3',
    c1HowLongMo: '6',
    c1DirectionalAddress: 'Cross street: Broadway & Pacific Ave',
    c1City: 'San Francisco',
    c1State: 'CA',
    c1Zip: '94133',
    c1Country: 'USA',
    c1Tin: '987-65-4321',
    c1HomePhone: '(415) 890-2134',
    c1PrevAddress: '742 Evergreen Terrace',
    c1PrevYr: '2',
    c1PrevMo: '0',
    c1PrevCity: 'San Francisco',
    c1PrevState: 'CA',
    c1PrevZip: '94107',
    c1PrevCountry: 'USA',
    c1Employer: 'Apex BioTech Corp',
    c1BusinessPhone: '(415) 555-0199',
    c1PrimaryIdDesc: "California Driver's License",
    c1PrimaryIdState: 'CA',
    c1Dob: '06/14/1992',
    c1PrimaryIssueDate: '04/10/2021',
    c1PrimaryExpDate: '06/14/2027',
    c1SecondaryIdDesc: 'Official Social Security Card',
    c1SecondaryIdState: 'USA',
    c1SecondaryIssueDate: '05/01/2010',
    c1SecondaryExpDate: 'N/A',
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
    w9Signature: userData.name || 'Account Holder',
    isWisconsinResident: false,
    c1MaritalStatus: 'unmarried',
    c2MaritalStatus: '',
    wiSpouseName: '',
    wiSpouseAddress: '',
    isTexasResident: false,
    txAgreementAccepted: false,
    txC1Signature: '',
    txC2Signature: '',
    txManualSubmit: false,
    agreementAccepted: true,
    c1Signature: userData.name || 'Account Holder',
    c1SignatureDate: '10/02/2026',
    c1ManualSubmit: false,
    c2Signature: '',
    c2SignatureDate: '',
    c2ManualSubmit: false,
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-300 animate-in zoom-in-95">
        
        {/* Top Header Bar */}
        <div className="bg-[#d71e28] text-white px-5 py-3 border-b-2 border-[#ffcc00] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <WfLogo size="sm" variant="white" />
            <div className="border-l border-white/20 pl-3">
              <span className="text-xs font-bold block uppercase tracking-wider">
                Registration & Consumer Application Details
              </span>
              <span className="text-[10px] text-white/80 font-mono">
                Official Signature Card Record • Form DSG8921
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadSignatureCardPdf(reg, userData.name)}
              className="p-1.5 hover:bg-black/20 rounded text-white flex items-center gap-1.5 text-xs transition-colors"
              title="Download Signature Card PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 hover:bg-black/20 rounded text-white flex items-center gap-1 text-xs transition-colors"
              title="Print Profile Details"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-white hover:bg-black/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Personalized Welcome Banner with Good Afternoon */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-red-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#ffcc00] text-stone-900 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Verified Account Holder
              </span>
              <span className="text-xs text-stone-300 font-mono">
                REF: DSG8921-061000227
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              {greeting}, {userData.name}!
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Here is the complete record of the information you used to complete the Consumer Account Application & Signature Card.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => downloadSignatureCardPdf(reg, userData.name)}
              className="bg-white hover:bg-stone-100 text-stone-900 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download Signature Card as PDF"
            >
              <Download className="w-3.5 h-3.5 text-[#d71e28]" />
              <span>Download Signature Card (PDF)</span>
            </button>

            {onOpenPdfSignatureCard && (
              <button
                onClick={onOpenPdfSignatureCard}
                className="bg-[#d71e28] hover:bg-[#b81620] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Signature Card (PDF)</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="bg-stone-100 px-6 py-2 border-b border-stone-200 flex flex-wrap items-center justify-between text-xs gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Information' },
              { id: 'personal', label: 'Customer 1 (Personal)' },
              { id: 'account', label: 'Account & Banking' },
              { id: 'id', label: 'ID Documents' },
              { id: 'tax', label: 'Form W-9 & Signatures' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                  activeCategory === tab.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted & Verified Record</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50 text-stone-900">
          
          {/* SECTION 1: ACCOUNT & BANKING DETAILS */}
          {(activeCategory === 'all' || activeCategory === 'account') && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#d71e28] flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Account(s) Opened & Banking Setup</h3>
                    <span className="text-[11px] text-stone-500">{reg.bankName}</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-200">
                  Active & Funded
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 text-[11px] block">Selected Account</span>
                  <span className="font-bold text-stone-900 text-sm">{reg.accountType}</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 text-[11px] block">Routing Number</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-stone-900">061000227</span>
                    <button
                      onClick={() => handleCopy('061000227', 'routing')}
                      className="text-stone-400 hover:text-stone-700"
                      title="Copy routing number"
                    >
                      {copiedField === 'routing' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 text-[11px] block">Account Number</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-stone-900">
                      {showSsn ? '1048590987' : '•••• 0987'}
                    </span>
                    <button
                      onClick={() => setShowSsn(!showSsn)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      {showSsn ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 text-[11px] block">Opening Deposit & Offer</span>
                  <span className="font-bold text-stone-900">${reg.initialDeposit} • {reg.offerCode}</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CUSTOMER 1 (PRIMARY) INFORMATION */}
          {(activeCategory === 'all' || activeCategory === 'personal') && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Customer 1 Information (Primary Applicant)</h3>
                    <span className="text-[11px] text-stone-500">Legal Name & Residence Data</span>
                  </div>
                </div>
                <span className="text-xs text-stone-500 font-mono">Customer ID: C1-9872</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 text-[11px] block">Full Legal Name</span>
                  <span className="font-bold text-stone-900 text-sm">{reg.c1FullName}</span>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Taxpayer ID (SSN / TIN)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">
                      {showSsn ? reg.c1Tin : `***-**-${reg.c1Tin.slice(-4) || '4321'}`}
                    </span>
                    <button
                      onClick={() => setShowSsn(!showSsn)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      {showSsn ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Date of Birth</span>
                  <span className="font-semibold text-stone-900">{reg.c1Dob || '06/14/1992'}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-stone-500 text-[11px] block">Street Address</span>
                  <span className="font-semibold text-stone-900">{reg.c1StreetAddress}</span>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">How Long at Address</span>
                  <span className="font-semibold text-stone-900">{reg.c1HowLongYr} Years, {reg.c1HowLongMo} Months</span>
                </div>

                {reg.c1DirectionalAddress && (
                  <div className="sm:col-span-3">
                    <span className="text-stone-500 text-[11px] block">Directional Address (Alternate / Landmark)</span>
                    <span className="text-stone-800 italic">{reg.c1DirectionalAddress}</span>
                  </div>
                )}

                <div>
                  <span className="text-stone-500 text-[11px] block">City, State, Zip & Country</span>
                  <span className="font-semibold text-stone-900">
                    {reg.c1City}, {reg.c1State} {reg.c1Zip}, {reg.c1Country}
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Home / Mobile Phone</span>
                  <span className="font-semibold text-stone-900">{reg.c1HomePhone}</span>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Business / Work Phone</span>
                  <span className="font-semibold text-stone-900">{reg.c1BusinessPhone || 'None Provided'}</span>
                </div>

                {reg.c1PrevAddress && (
                  <div className="sm:col-span-3 p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 text-[11px] block">Previous Address (If &lt; 2 years at current)</span>
                    <span className="font-medium text-stone-800">
                      {reg.c1PrevAddress}, {reg.c1PrevCity}, {reg.c1PrevState} {reg.c1PrevZip} ({reg.c1PrevYr}y {reg.c1PrevMo}m)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: EMPLOYMENT & IDENTIFICATION */}
          {(activeCategory === 'all' || activeCategory === 'id') && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Employment & Government Identification</h3>
                    <span className="text-[11px] text-stone-500">Patriot Act Customer Identification Program</span>
                  </div>
                </div>
                <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ID Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 text-[11px] block">Current Employer</span>
                  <span className="font-bold text-stone-900 text-sm">{reg.c1Employer}</span>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Primary ID Document</span>
                  <span className="font-semibold text-stone-900">{reg.c1PrimaryIdDesc}</span>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Issuing State / Country</span>
                  <span className="font-semibold text-stone-900">{reg.c1PrimaryIdState}</span>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Primary Issue Date</span>
                  <span className="font-semibold text-stone-900">{reg.c1PrimaryIssueDate || '04/10/2021'}</span>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Primary Expiration Date</span>
                  <span className="font-semibold text-stone-900">{reg.c1PrimaryExpDate || '06/14/2027'}</span>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Secondary ID Document</span>
                  <span className="font-semibold text-stone-900">{reg.c1SecondaryIdDesc || 'Social Security Card'}</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: TAX CERTIFICATION (SUBSTITUTE W-9) & STATE DISCLOSURES */}
          {(activeCategory === 'all' || activeCategory === 'tax') && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Taxpayer Certification (Substitute Form W-9)</h3>
                    <span className="text-[11px] text-stone-500">IRS Certification Under Penalties of Perjury</span>
                  </div>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Certified U.S. Person
                </span>
              </div>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="p-3 bg-stone-50 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">Backup Withholding Status:</span>
                    <span className="font-bold text-emerald-700">
                      {reg.w9ExemptFromBackup ? 'Exempt' : reg.w9SubjectToBackup ? 'Subject to backup' : 'NOT Subject to Backup Withholding'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Certified correct Taxpayer Identification Number and not notified by IRS of backup withholding.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 text-[11px] block">Wisconsin Marital Property Status</span>
                    <span className="font-semibold text-stone-900 capitalize">
                      {reg.isWisconsinResident ? reg.c1MaritalStatus || 'Resident' : 'Not Applicable (Non-WI)'}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 text-[11px] block">Texas Right of Survivorship</span>
                    <span className="font-semibold text-stone-900">
                      {reg.isTexasResident ? 'Vesting in survivor' : 'Not Applicable (Non-TX)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: SIGNATURE CARD E-SIGNATURES */}
          {(activeCategory === 'all' || activeCategory === 'tax') && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Binding Signatures & Authorization</h3>
                    <span className="text-[11px] text-stone-500">Form DSG8921 Signature Card</span>
                  </div>
                </div>
                <span className="text-xs text-stone-500 font-mono">Date: {reg.c1SignatureDate}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 text-[11px] block mb-1">Customer 1 Authorized Digital Signature</span>
                  <div className="font-serif italic text-2xl font-bold text-stone-900 border-b border-stone-300 pb-2">
                    {reg.c1Signature || reg.c1FullName}
                  </div>
                  <div className="flex items-center justify-between pt-2 text-[11px] text-stone-500">
                    <span>E-Sign Timestamp: {reg.c1SignatureDate} 14:22 PT</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Authenticated
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between">
                  <div>
                    <span className="text-stone-500 text-[11px] block mb-1">Agreement Acknowledgement</span>
                    <p className="text-stone-700 text-[11px] leading-relaxed">
                      Binding arbitration program acknowledged. Credit inquiries and account agreements confirmed.
                    </p>
                  </div>
                  <div className="pt-2 text-stone-500 text-[11px] font-mono">
                    Document Code: DSG8921 (02-07 105252) Page 1 of 1
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
            <button
              onClick={onClose}
              className="border border-stone-300 text-stone-700 hover:bg-stone-100 px-5 py-2 rounded-full text-xs font-semibold transition-colors"
            >
              Close Details
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => downloadSignatureCardPdf(reg, userData.name)}
                className="bg-white hover:bg-stone-50 border border-stone-800 text-stone-900 px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Download full signature card document"
              >
                <Download className="w-3.5 h-3.5 text-[#d71e28]" />
                <span>Download PDF File</span>
              </button>

              {onOpenPdfSignatureCard && (
                <button
                  onClick={onOpenPdfSignatureCard}
                  className="bg-[#d71e28] hover:bg-[#b81620] text-white px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Printable Signature Card (PDF)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
