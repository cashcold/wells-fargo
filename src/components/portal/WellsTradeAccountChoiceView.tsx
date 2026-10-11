import React, { useState } from 'react';
import {
  Printer,
  Share2,
  ChevronRight,
  Shield,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  FileText,
  Phone,
  Landmark,
  X,
  TrendingUp,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../../types/banking';
import { VoiceTypingWidget } from '../common/VoiceTypingWidget';

interface WellsTradeAccountChoiceViewProps {
  userData: UserProfile;
  onOpenSignOn?: () => void;
  onOpenAccountForm?: (accountType: string) => void;
  onNavigateToTreasuryBills?: () => void;
  onTalkToAssistant?: (prompt: string) => void;
  isLoggedIn: boolean;
}

export const WellsTradeAccountChoiceView: React.FC<WellsTradeAccountChoiceViewProps> = ({
  userData,
  onOpenSignOn,
  onOpenAccountForm,
  onNavigateToTreasuryBills,
  onTalkToAssistant,
  isLoggedIn,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [openedAccountType, setOpenedAccountType] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent('Choose The WellsTrade® Account That Works Best For You | Wells Fargo Advisors');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
  };

  const handleOpenAccount = (type: string) => {
    setOpenedAccountType(type);
    if (onOpenAccountForm) {
      onOpenAccountForm(type);
    } else {
      setActiveModal('open-account-modal');
    }
  };

  return (
    <div className="bg-white text-stone-900 font-sans">
      {/* Breadcrumb Navigation matching the exact user brief */}
      <div className="border-b border-stone-200 bg-[#f9f8f6] text-[11px] text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center flex-wrap gap-1">
          <span className="hover:underline cursor-pointer">Investing & Wealth Management</span>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="hover:underline cursor-pointer">Investment Services</span>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="hover:underline cursor-pointer">WellsTrade<sup>®</sup> Online and Mobile Brokerage</span>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="text-stone-900 font-semibold truncate">
            Choose The WellsTrade<sup>®</sup> Account That Works Best For You
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Left Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header with Title and Print / Share Bar */}
            <div className="border-b border-stone-200 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-stone-900 font-normal leading-tight">
                  Choose The WellsTrade<sup>®</sup> Account That Works Best For You
                </h1>

                {/* Print & Share Tools matching exact user request */}
                <div className="flex items-center gap-3 shrink-0 text-xs text-stone-600 pt-1">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 hover:text-[#d71e28] transition-colors cursor-pointer"
                    title="Print this page"
                  >
                    <Printer className="w-3.5 h-3.5 text-stone-500" />
                    <span>Print</span>
                  </button>

                  <span className="text-stone-300">|</span>

                  <div className="relative flex items-center gap-1.5">
                    <button
                      onClick={handleShareFacebook}
                      className="hover:text-[#d71e28] transition-colors cursor-pointer"
                      title="Share this page on Facebook, opens a dialog"
                    >
                      Share on Facebook
                    </button>
                    <span className="text-stone-300">·</span>
                    <button
                      onClick={handleShareTwitter}
                      className="hover:text-[#d71e28] transition-colors cursor-pointer"
                      title="Share this page on Twitter, opens a dialog"
                    >
                      Share on Twitter
                    </button>
                  </div>
                </div>
              </div>

              {/* Introductory Paragraph matching user brief verbatim */}
              <p className="text-stone-700 text-xs sm:text-sm mt-4 leading-relaxed">
                A WellsTrade account offered by Wells Fargo Advisors opened online comes with Brokerage Cash Services, which give you convenient money-movement options such as online money transfers between your Wells Fargo accounts and mobile check deposits using your smartphone<sup>1</sup>. You can also visit the tellers at Wells Fargo branches and make deposits, which are processed through an associated limited-purpose Wells Fargo Bank account in your name.
              </p>
            </div>

            {/* Special Highlight: Treasury Bills Auction Integration */}
            <div className="bg-[#fffdf8] border border-amber-300/80 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <Landmark className="w-4 h-4 text-amber-700" />
                  <span>Looking for Fixed Income & Treasury Bills?</span>
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Appear for U.S. Treasury Bill Auctions (T-Bills)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                  Trade 4-week, 8-week, 13-week, and 26-week U.S. Treasury Bills at competitive and non-competitive auctions with $0 online commissions. 100% exempt from state and local income tax.
                </p>
              </div>
              <button
                onClick={onNavigateToTreasuryBills}
                className="bg-[#d71e28] hover:bg-[#b81620] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Appear for Treasury Bill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* =========================================================================
                THE 3 ACCOUNT OPTIONS matching user brief verbatim:
                1. Standard Account
                2. Traditional IRA
                3. Roth IRA
               ========================================================================= */}
            <div className="space-y-6 pt-2">
              {/* 1. Standard Account */}
              <div className="bg-white border border-stone-200 rounded-xl p-6 hover:border-stone-300 transition-all shadow-xs flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                    Standard Account
                  </h2>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700 list-disc list-inside mb-6">
                    <li>Trade stocks, bonds, Treasury bills, no-load mutual funds, ETFs and more</li>
                    <li>Maintain your investments with robust tools and resources</li>
                  </ul>
                </div>
                <div>
                  <button
                    onClick={() => handleOpenAccount('Standard Account')}
                    className="bg-[#d71e28] hover:bg-[#b81620] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Open a Standard account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. Traditional IRA */}
              <div className="bg-white border border-stone-200 rounded-xl p-6 hover:border-stone-300 transition-all shadow-xs flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                    Traditional IRA
                  </h2>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700 list-disc list-inside mb-6">
                    <li>Contributions may be tax deductible</li>
                    <li>Potential earnings grow tax-deferred</li>
                  </ul>
                </div>
                <div>
                  <button
                    onClick={() => handleOpenAccount('Traditional IRA')}
                    className="bg-[#d71e28] hover:bg-[#b81620] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Open a Traditional IRA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. Roth IRA */}
              <div className="bg-white border border-stone-200 rounded-xl p-6 hover:border-stone-300 transition-all shadow-xs flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                    Roth IRA
                  </h2>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700 list-disc list-inside mb-6">
                    <li>Tax-free qualified distributions<sup>2</sup></li>
                    <li>Access to your contributions anytime: tax-free</li>
                  </ul>
                </div>
                <div>
                  <button
                    onClick={() => handleOpenAccount('Roth IRA')}
                    className="bg-[#d71e28] hover:bg-[#b81620] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Open a Roth IRA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Commissions & Fee Schedule Link verbatim */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700">
              For complete information on fees and commissions, refer to the{' '}
              <button
                onClick={() => setActiveModal('fee-schedule')}
                className="text-[#d71e28] font-semibold underline hover:text-[#b81620] cursor-pointer"
              >
                WellsTrade Account Commissions and Fee Schedule
              </button>
              . The Schedule is subject to change at any time.
            </div>

            {/* Voice Typing Section verbatim integration */}
            <div className="pt-2">
              <VoiceTypingWidget
                onSendToAssistant={onTalkToAssistant}
                savedNotes={userData.voiceNotes}
              />
            </div>

            {/* =========================================================================
                LEGAL DISCLOSURES BOX verbatim from user brief
               ========================================================================= */}
            <div className="border-t border-stone-200 pt-6 space-y-4 text-[11px] text-stone-600 leading-relaxed">
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
                <div className="font-bold text-stone-900 text-xs">
                  Investment and Insurance Products are:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-medium text-stone-800 text-[11px]">
                  <div className="p-2 bg-white rounded border border-stone-200">
                    Not Insured by the FDIC or Any Federal Government Agency
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-200">
                    Not a Deposit or Other Obligation of, or Guaranteed by, the Bank or Any Bank Affiliate
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-200">
                    Subject to Investment Risks, Including Possible Loss of the Principal Amount Invested
                  </div>
                </div>
              </div>

              <p>
                Investment products and services are offered through Wells Fargo Advisors. Wells Fargo Advisors is a trade name used by Wells Fargo Clearing Services, LLC (WFCS) and Wells Fargo Advisors Financial Network, LLC, Members SIPC, separate registered broker-dealers and non-bank affiliates of Wells Fargo & Company.
              </p>

              <p>
                <strong>1.</strong> Mobile deposit is only available through the Wells Fargo Mobile<sup>®</sup> app on eligible mobile devices. Deposit limits and other restrictions apply. Some accounts are not eligible for mobile deposit. Availability may be affected by your mobile carrier's coverage area. Your mobile carrier's message and data rates may apply. See Wells Fargo’s Online Access Agreement and your applicable business account fee disclosures for other terms, conditions, and limitations.
              </p>

              <p>
                <strong>2.</strong> Qualified distributions, which are tax-free and not included in gross income, occur when your Roth IRA has been open for more than five years and you are at least age 59½, or you are disabled, or you are using the first-time homebuyer exception, or the payment is made to your beneficiary due to your death.
              </p>

              <p>
                WellsTrade<sup>®</sup> brokerage accounts are offered through WFCS.
              </p>

              <p>
                Wells Fargo and Company and its Affiliates do not provide tax or legal advice. This communication cannot be relied upon to avoid tax penalties. Please consult your tax and legal advisors to determine how this information may apply to your own situation. Whether any planned tax result is realized by you depends on the specific facts of your own situation at the time your tax return is filed.
              </p>

              <p>
                Wells Fargo Bank, N.A. is a bank affiliate of Wells Fargo & Company.
              </p>

              <div className="text-[10px] text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-stone-100">
                <span>PM-09092027-5275964</span>
                <span>DT2-09092027-18-8822302-1.1</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SIDEBAR: Questions & Need Help Deciding (4 Cols) verbatim from brief
             ========================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Questions? We can help. Call us 1-877-573-7997 */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Questions? We can help.
              </h3>
              <div className="flex items-center gap-2.5 text-stone-800 font-bold text-sm">
                <Phone className="w-4 h-4 text-[#d71e28]" />
                <a href="tel:1-877-573-7997" className="hover:underline">
                  Call us 1-877-573-7997
                </a>
              </div>
              <p className="text-[11px] text-stone-500">
                Monday – Friday: 8:30 a.m. – 9:30 p.m. ET<br />
                Saturday: 9:00 a.m. – 5:00 p.m. ET
              </p>
            </div>

            {/* Need Help Deciding? List */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
              <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
                Need Help Deciding?
              </h3>

              <div className="space-y-2.5 text-xs text-stone-800">
                <button
                  onClick={() => setActiveModal('features')}
                  className="w-full text-left flex items-center justify-between hover:text-[#d71e28] py-1 border-b border-stone-100 cursor-pointer"
                >
                  <span>WellsTrade account features, fees and services</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>

                <button
                  onClick={() => setActiveModal('eligibility')}
                  className="w-full text-left flex items-center justify-between hover:text-[#d71e28] py-1 border-b border-stone-100 cursor-pointer"
                >
                  <span>Find out: Are you eligible?</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>

                <button
                  onClick={() => setActiveModal('compare-ira')}
                  className="w-full text-left flex items-center justify-between hover:text-[#d71e28] py-1 border-b border-stone-100 cursor-pointer"
                >
                  <span>Compare Traditional and Roth IRAs</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>

                <button
                  onClick={() => setActiveModal('form-crs')}
                  className="w-full text-left flex items-center justify-between hover:text-[#d71e28] py-1 border-b border-stone-100 cursor-pointer"
                >
                  <span>Form CRS: Relationship Summary</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>

              <div className="pt-2 text-xs space-y-1">
                <div className="font-semibold text-stone-900">Wells Fargo Advisors</div>
                <div className="text-stone-600 text-[11px]">Wells Fargo Advisors Financial Network</div>
              </div>

              {/* FINRA's BrokerCheck */}
              <div className="mt-4 pt-3 border-t border-stone-200 text-xs">
                <a
                  href="https://brokercheck.finra.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-700 hover:text-[#d71e28] flex items-start gap-1.5"
                >
                  <div>
                    <span className="font-bold block">FINRA’s BrokerCheck:</span>
                    <span className="text-[11px] text-stone-500">
                      Obtain information about Wells Fargo Advisors and its financial professionals.
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                </a>
              </div>
            </div>

            {/* Quick Treasury Action Card */}
            <div className="bg-[#1c1917] text-white rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>Treasury Auction Calendar</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-white">
                Upcoming 13-Week T-Bill Auction
              </h4>
              <p className="text-xs text-stone-300">
                Clearing discount rate currently 5.18% with 5.32% coupon equivalent yield. Auction closes Monday 11:00 AM ET.
              </p>
              <button
                onClick={onNavigateToTreasuryBills}
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white font-bold text-xs py-2 rounded-full transition-colors cursor-pointer"
              >
                Appear for Auction Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODALS & DIALOGS
         ========================================================================= */}
      {activeModal === 'fee-schedule' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                WellsTrade<sup>®</sup> Fee Schedule
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-stone-700">
              <div className="flex justify-between py-1.5 border-b">
                <span>Online Stock & ETF Trades</span>
                <span className="font-bold text-emerald-700">$0.00 Commission</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>U.S. Treasury Bill Auctions (T-Bills)</span>
                <span className="font-bold text-emerald-700">$0.00 Transaction Fee</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>Secondary Market Treasuries</span>
                <span className="font-bold text-emerald-700">$0.00 Online</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>No-Load Mutual Funds</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>Agent-Assisted Telephone Trade</span>
                <span className="font-bold">$25.00</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>Annual Account Maintenance Fee</span>
                <span className="font-bold text-emerald-700">$0.00 (Waived)</span>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-[#d71e28] text-white py-2 rounded-full font-bold text-xs hover:bg-[#b81620]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Account Opening Flow Confirmation */}
      {activeModal === 'open-account-modal' && openedAccountType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Open Your {openedAccountType}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              You are applying for a self-directed <strong>{openedAccountType}</strong> with Wells Fargo Advisors. Includes $0 online commissions and Brokerage Cash Services.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border rounded-full text-xs font-semibold text-stone-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  if (onOpenAccountForm) onOpenAccountForm(openedAccountType);
                }}
                className="bg-[#d71e28] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-[#b81620]"
              >
                Continue Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
