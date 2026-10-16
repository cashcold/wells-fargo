import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  MapPin,
  Calendar,
  HelpCircle,
  ExternalLink,
  Shield,
  FileText,
  DollarSign,
  Briefcase,
  Check,
  X,
  CreditCard,
  Building,
  Smartphone,
  Send,
  Download,
  Search,
  Lock,
} from 'lucide-react';
import { useGreeting } from '../../utils/greeting';
import { OnlineMobileSecurityModal } from '../common/OnlineMobileSecurityModal';

interface BusinessBankingViewProps {
  onOpenSignOn: () => void;
  onOpenAccountForm: () => void;
  isLoggedIn: boolean;
  userName: string;
}

export const BusinessBankingView: React.FC<BusinessBankingViewProps> = ({
  onOpenSignOn,
  onOpenAccountForm,
  isLoggedIn,
  userName,
}) => {
  const greeting = useGreeting();
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('Checking');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Sign on card form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveUsername, setSaveUsername] = useState(false);

  // Product selector interactive state
  const [selectorStep, setSelectorStep] = useState(1);
  const [selectedBusinessType, setSelectedBusinessType] = useState('startup');
  const [selectedAnnualRevenue, setSelectedAnnualRevenue] = useState('<$100k');

  const handleHeroSignOn = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      onOpenSignOn();
    } else {
      onOpenSignOn();
    }
  };

  return (
    <div className="bg-white text-stone-900 flex flex-col font-sans">
      {/* =========================================================================
          SUB-NAVIGATION BAR matching Screenshot 1
         ========================================================================= */}
      <div className="bg-white border-b border-stone-200 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 sm:gap-8 py-2.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          {[
            'Checking',
            'Savings & CDs',
            'Credit Cards',
            'Merchant Services',
            'Lines & Loans',
            'Payroll Services',
            'Business Resources',
          ].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveSubTab(item);
                if (item === 'Lines & Loans') setActiveModal('lines-loans');
                else if (item === 'Merchant Services') setActiveModal('merchant-services');
                else if (item === 'Credit Cards') setActiveModal('credit-card-bonus');
                else if (item === 'Payroll Services') setActiveModal('payroll-services');
                else if (item === 'Business Resources') {
                  const el = document.getElementById('business-resources-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`cursor-pointer transition-colors ${
                activeSubTab === item
                  ? 'text-stone-900 font-bold border-b-2 border-stone-900 pb-0.5'
                  : 'text-stone-600 hover:text-stone-900 font-normal'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          HERO BANNER SECTION matching Screenshot 1
         ========================================================================= */}
      <div className="relative bg-gradient-to-r from-[#8b1017] via-[#b3141f] to-[#d71e28] text-white overflow-hidden py-10 sm:py-14 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Sign-on Card matching Screenshot 1 */}
          <div className="lg:col-span-4 z-10">
            <div className="bg-white text-stone-900 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-auto lg:mx-0 border border-stone-200">
              <h2 className="font-sans text-xl font-bold text-stone-900 mb-0.5">
                {greeting}
              </h2>
              <p className="text-xs text-stone-600 mb-4">
                Sign on to manage your accounts.
              </p>

              <form onSubmit={handleHeroSignOn} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full border-b border-stone-300 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#d71e28]"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full border-b border-stone-300 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#d71e28] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-2 text-xs text-[#2b2468] hover:underline font-semibold cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="saveUsernameCheck"
                    checked={saveUsername}
                    onChange={(e) => setSaveUsername(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-[#d71e28] focus:ring-[#d71e28] cursor-pointer"
                  />
                  <label htmlFor="saveUsernameCheck" className="text-xs text-stone-700 cursor-pointer">
                    Save username
                  </label>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <button
                    type="submit"
                    className="bg-[#d71e28] hover:bg-[#b81620] text-white px-7 py-2 rounded-full font-bold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    Sign On
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAccountForm}
                    className="text-xs text-[#2b2468] hover:underline font-semibold cursor-pointer"
                  >
                    Enroll
                  </button>
                </div>
              </form>

              <div className="mt-5 pt-4 border-t border-stone-100 space-y-2 text-xs text-[#2b2468]">
                <div>
                  <button
                    onClick={onOpenSignOn}
                    className="hover:underline cursor-pointer block"
                  >
                    Sign on with a passkey
                  </button>
                </div>
                <div>
                  <button
                    onClick={onOpenSignOn}
                    className="hover:underline cursor-pointer block"
                  >
                    Forgot username or password?
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setActiveModal('privacy-legal')}
                    className="hover:underline cursor-pointer block text-stone-500"
                  >
                    Privacy, Cookies, and Legal
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setShowSecurityModal(true)}
                    className="hover:underline cursor-pointer inline-flex items-center gap-1.5 text-stone-700 hover:text-[#d71e28] font-medium"
                  >
                    <Lock className="w-3.5 h-3.5 text-stone-600" />
                    <span>Online & Mobile Security</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Hero Value Proposition */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-sans font-bold text-white leading-tight">
              Choose Wells Fargo for<br />business checking
            </h1>
            <p className="text-sm sm:text-base text-stone-100 font-normal leading-relaxed max-w-md">
              Switch to a new business checking account and complete qualifying activities
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveModal('business-checking-bonus')}
                className="bg-white hover:bg-stone-100 text-stone-900 px-7 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>

          {/* Right Column: Giant Cash Bonus Banner matching Screenshot 1 */}
          <div className="lg:col-span-3 text-left lg:text-right space-y-1">
            <span className="text-stone-200 text-sm sm:text-base font-normal block">
              Earn up to an
            </span>
            <div className="text-6xl sm:text-7xl font-sans font-extrabold text-white tracking-tight tabular-nums">
              $825
            </div>
            <span className="text-stone-200 text-sm sm:text-base font-normal block">
              cash bonus
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          WELLS FARGO BUSINESS SECTION matching Screenshot 1 & 2
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Centered Yellow Accent Line */}
        <div className="w-12 h-[2px] bg-[#ffcc00] mx-auto mb-4" />

        <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 text-center mb-10">
          Wells Fargo Business
        </h2>

        {/* 4 Cards in a row matching Screenshot 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Funding for your business */}
          <div className="border border-stone-200 rounded-xl p-5 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="mb-4">
                {/* Hand holding dollar coin line icon */}
                <svg
                  className="w-10 h-10 text-stone-700"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="24" cy="14" r="8" />
                  <path d="M24 10V18" />
                  <path d="M21 12H27" />
                  <path d="M21 16H27" />
                  <path d="M12 36C12 36 16 32 24 32C32 32 36 36 36 36" />
                  <path d="M10 28C10 28 14 24 24 24C34 24 38 28 38 28" />
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                Funding for your<br />business
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Access funds for growth and cash<br />flow when you need them
              </p>
            </div>
            <div className="mt-6 pt-3">
              <button
                onClick={() => setActiveModal('lines-loans')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Business lines and loans</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Earn a $500 cash reward bonus */}
          <div className="border border-stone-200 rounded-xl p-5 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="mb-4">
                {/* Credit card outline icon */}
                <svg
                  className="w-10 h-10 text-stone-700"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="8" y="12" width="32" height="24" rx="4" />
                  <line x1="8" y1="20" x2="40" y2="20" />
                  <circle cx="16" cy="28" r="2" fill="currentColor" />
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                Earn a $500 cash reward<br />bonus
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Plus, earn unlimited 2% cash<br />rewards on purchases. Terms apply.
              </p>
            </div>
            <div className="mt-6 pt-3">
              <button
                onClick={() => setActiveModal('credit-card-bonus')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Take payments anytime, anywhere */}
          <div className="border border-stone-200 rounded-xl p-5 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="mb-4">
                {/* Mobile POS reader line icon */}
                <svg
                  className="w-10 h-10 text-stone-700"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="14" y="10" width="20" height="30" rx="3" />
                  <rect x="18" y="14" width="12" height="8" rx="1" />
                  <circle cx="24" cy="34" r="2" fill="currentColor" />
                  <path d="M20 26H28" />
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                Take payments anytime,<br />anywhere
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Get paid. Manage operations. Drive<br />growth. All with one connected<br />platform.
              </p>
            </div>
            <div className="mt-6 pt-3">
              <button
                onClick={() => setActiveModal('merchant-services')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Merchant Services</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Banking services evolved */}
          <div className="border border-stone-200 rounded-xl p-5 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="mb-4">
                {/* Paper check with dollar sign icon */}
                <svg
                  className="w-10 h-10 text-stone-700"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="8" y="12" width="32" height="24" rx="2" />
                  <line x1="12" y1="24" x2="28" y2="24" />
                  <line x1="12" y1="30" x2="22" y2="30" />
                  <path d="M32 18V26" />
                  <path d="M30 20H34" />
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                Banking services evolved
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Explore business checking accounts<br />that work for you today and<br />tomorrow
              </p>
            </div>
            <div className="mt-6 pt-3">
              <button
                onClick={() => setActiveModal('business-checking-bonus')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Business checking</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRODUCT SELECTOR SECTION matching Screenshot 2
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white">
          <div className="md:col-span-5 space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-normal text-stone-900 leading-tight">
              Get help finding<br />products and services<br />for your business
            </h2>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
              Use our Product Selector to find options<br />for your business needs
            </p>
            <div className="pt-3">
              <button
                onClick={() => setActiveModal('product-selector')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-7 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>

          <div className="md:col-span-7 h-72 sm:h-84 lg:h-96 rounded-xl overflow-hidden shadow-xs flex items-center justify-end">
            <img
              src="/assets/images/wf_business_tailor_designer_1791408920981.jpg"
              alt="Smiling African-American tailor and business owner in fashion studio"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          WHY CHOOSE WELLS FARGO? matching Screenshot 3
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 text-center mb-10">
          Why choose Wells Fargo?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Tailored */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/wf_business_florist_tablet_1791408939155.jpg"
                  alt="Young florist smiling with tablet in plant boutique"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Tailored
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We provide personalized options by working with you to develop a deep, long-term understanding of your business.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Supportive */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/wf_business_cafe_banker_1791408955045.jpg"
                  alt="Wells Fargo business banker consulting with bakery owner"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Supportive
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Our bankers have the knowledge to help you move your business forward — now and in the future.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Simple */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/wf_business_foodtruck_pos_1791408971469.jpg"
                  alt="Friendly food truck owner presenting payment reader"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Simple
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We provide easy-to-use products, tools, and resources for businesses to help simplify your financial life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ZELLE® FOR YOUR BUSINESS SECTION matching Screenshot 3 & 4
         ========================================================================= */}
      <div className="w-full bg-[#0c596f] text-white py-14 sm:py-16 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Phone Mockup matching Screenshot 3 & 4 */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-64 sm:w-72 bg-white rounded-3xl p-3 shadow-2xl border-4 border-stone-800 text-stone-900">
              <div className="flex items-center justify-between px-3 py-2 border-b border-stone-100 text-xs">
                <span className="text-stone-400 font-bold">&lt;</span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-900" />
                  <span className="text-[10px] text-stone-500 font-medium">Sign off</span>
                </div>
              </div>

              <div className="p-3 text-center">
                <p className="text-xs text-stone-600">
                  Send Money with <span className="font-bold text-[#7414bf]">zelle</span><sup className="text-[8px]">®</sup>
                </p>

                {/* 3 Action Buttons */}
                <div className="grid grid-cols-3 gap-2 my-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#7414bf] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <Send className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-stone-800 mt-1">Send</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#7414bf] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <Download className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-stone-800 mt-1">Request</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#7414bf] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <span className="text-[11px] font-bold">QR</span>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-800 mt-1">QR code</span>
                  </div>
                </div>

                {/* Menu list */}
                <div className="divide-y divide-stone-100 text-left text-xs text-stone-700 pt-2">
                  <div className="py-2 flex justify-between items-center">
                    <span>Activity</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <span>Recipients</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <span>Zelle<sup>®</sup> Preferences</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <span>Help</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-stone-100 text-[8px] text-stone-400">
                  Wells Fargo Bank, N.A. Member FDIC.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Zelle Copy & App Badges */}
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white leading-tight">
              Zelle<sup>®</sup> for your business
            </h2>
            <p className="text-lg text-stone-100 font-medium">
              Speed up your business with Zelle<sup>®</sup>
            </p>

            <div className="space-y-2 pt-2">
              <div className="font-bold text-white text-base">
                Get paid by your customers<sup>1</sup>
              </div>
              <div className="font-bold text-white text-base">
                Pay your suppliers<sup>1</sup>
              </div>
              <div className="font-bold text-white text-base">
                Issue reimbursements<sup>1</sup>
              </div>
            </div>

            {/* App Store Buttons matching Screenshot 4 */}
            <div className="flex items-center gap-3 pt-4 flex-wrap">
              <button
                onClick={() => setActiveModal('app-download')}
                className="bg-black hover:bg-stone-900 text-white border border-stone-600 px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="text-lg leading-none font-bold"></span>
                <div className="text-left leading-tight">
                  <span className="text-[9px] text-stone-400 block uppercase font-medium">Download on the</span>
                  <span className="text-xs font-semibold">App Store</span>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('app-download')}
                className="bg-black hover:bg-stone-900 text-white border border-stone-600 px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M3.6 2.4L13.8 12.6L3.6 22.8C3.2 22.4 3 21.8 3 21V3.9C3 3.1 3.2 2.5 3.6 2.4Z" fill="#2196F3"/>
                  <path d="M17.2 9.2L13.8 12.6L3.6 2.4C4.1 2.1 4.7 2.2 5.2 2.5L17.2 9.2Z" fill="#4CAF50"/>
                  <path d="M17.2 14.8L5.2 21.5C4.7 21.8 4.1 21.9 3.6 21.6L13.8 11.4L17.2 14.8Z" fill="#F44336"/>
                  <path d="M21 11.4L17.2 9.2L13.8 12.6L17.2 14.8L21 12.6C21.6 12.3 21.6 11.7 21 11.4Z" fill="#FFEB3B"/>
                </svg>
                <div className="text-left leading-tight">
                  <span className="text-[9px] text-stone-400 block uppercase font-medium">Get it on</span>
                  <span className="text-xs font-semibold">Google Play</span>
                </div>
              </button>
            </div>

            <div className="text-[11px] text-stone-200/80 space-y-1 pt-3">
              <p>Screen image is simulated</p>
              <p>
                Zelle<sup>®</sup> and the Zelle<sup>®</sup> related marks are owned by Early Warning Services, LLC and used under license.
              </p>
              <p>Terms apply.</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BUSINESS RESOURCES SECTION matching Screenshot 4, 5, 6
         ========================================================================= */}
      <div id="business-resources-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Centered Yellow Accent Line */}
        <div className="w-12 h-[2px] bg-[#ffcc00] mx-auto mb-4" />

        <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 text-center mb-10">
          Business resources
        </h2>

        {/* 2x2 Grid of 4 Resource Cards matching Screenshot 5 & 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Get the right resources for right now */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-56 sm:h-64 overflow-hidden">
                <img
                  src="/assets/images/wf_business_chef_kitchen_1791408989740.jpg"
                  alt="Cheerful Black female restaurant chef and catering business owner in commercial kitchen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Get the right resources for right now
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We're here to support you with tips, tools, and guidance to help your business thrive.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => setActiveModal('resources-guide')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-6 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Explore now
              </button>
            </div>
          </div>

          {/* Card 2: Prepare before you apply */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-56 sm:h-64 overflow-hidden">
                <img
                  src="/assets/images/wf_business_retail_laptop_1791409006005.jpg"
                  alt="Hispanic male shopkeeper in retail store typing on laptop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Prepare before you apply
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Gather the documents you'll need to open a business checking account.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => setActiveModal('prepare-documents')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-6 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>

          {/* Card 3: Help protect your business */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-56 sm:h-64 overflow-hidden">
                <img
                  src="/assets/images/wf_business_design_studio_1791409028589.jpg"
                  alt="Two creative fashion designers reviewing prototypes on desk"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Help protect your business
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Learn more about trademarks, copyrights, and patents.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => setActiveModal('protect-business')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-6 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Read the article
              </button>
            </div>
          </div>

          {/* Card 4: Payroll Services */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-56 sm:h-64 overflow-hidden">
                <img
                  src="/assets/images/wf_business_pottery_payroll_1791409043097.jpg"
                  alt="Mature woman artisan in yellow cardigan working on laptop at ceramics studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Payroll Services
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Helping you meet your payroll and HR needs.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => setActiveModal('payroll-services')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-6 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HOW CAN WE HELP? SECTION matching Screenshot 6
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full border-t border-stone-200">
        <h3 className="text-xl font-bold text-stone-900 mb-6">
          How can we help?
        </h3>

        <div className="flex flex-wrap items-center gap-6 sm:gap-10">
          {/* Find a location */}
          <button
            onClick={() => setActiveModal('find-location')}
            className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-800 hover:text-[#d71e28] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-stone-600 text-white flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span>Find a location</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Make an appointment */}
          <button
            onClick={() => setActiveModal('appointment')}
            className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#2b2468] hover:underline transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-stone-600 text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <span>Make an appointment</span>
          </button>

          {/* Quick help */}
          <button
            onClick={() => setActiveModal('quick-help')}
            className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-800 hover:text-[#d71e28] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-stone-600 text-white flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span>Quick help</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Numbered Footnotes & Disclaimers matching Screenshot 6 verbatim */}
        <div className="mt-10 pt-6 border-t border-stone-200 text-[11px] sm:text-xs text-stone-600 leading-relaxed space-y-4">
          <p>
            <strong>1.</strong> Enrollment with Zelle<sup>®</sup> through Wells Fargo Online<sup>®</sup> or Wells Fargo Business Online<sup>®</sup> is required. Terms and conditions apply. To send or receive money with Zelle<sup>®</sup>, both parties must have an eligible checking or savings account enrolled with Zelle<sup>®</sup> through their bank. Transactions between enrolled users typically occur in minutes. For your protection, Zelle<sup>®</sup> should only be used for sending money to friends, family, or others you trust. Neither Wells Fargo nor Zelle<sup>®</sup> offers purchase protection for payments made with Zelle<sup>®</sup> - for example, if you do not receive the item you paid for or the item is not as described or as you expected. Payment requests must be sent to enrolled Zelle<sup>®</sup> users. For more information, view the{' '}
            <button
              onClick={() => setActiveModal('zelle-terms')}
              className="text-[#2b2468] underline hover:text-[#1f194d] cursor-pointer"
            >
              Zelle<sup>®</sup> Transfer Service Addendum to the Wells Fargo Online Access Agreement
            </button>
            . Your mobile carrier's message and data rates may apply. Account fees (e.g., monthly service, overdraft, Business Account Analysis fees) may apply to Wells Fargo account(s) with which you use Zelle<sup>®</sup>.
          </p>

          <p>
            Android, Google Play, Chrome, Pixel and other marks are trademarks of Google LLC.
          </p>

          <p>
            Apple, the Apple logo, Apple Pay, Apple Watch, Face ID, iCloud Keychain, iPad, iPad Pro, iPhone, iTunes, Mac, Safari, and Touch ID are trademarks of Apple Inc., registered in the U.S. and other countries. Apple Wallet is a trademark of Apple Inc.
          </p>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE MODALS FOR ALL USER ACTIONS
         ========================================================================= */}

      {/* Business Checking $825 Bonus Modal */}
      {activeModal === 'business-checking-bonus' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d71e28]">
                  Exclusive Offer
                </span>
                <h3 className="font-sans text-xl font-bold text-stone-900">
                  Earn Up to $825 Business Checking Cash Bonus
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-red-950 font-medium">
                🎁 Open an eligible Wells Fargo Initiate Business Checking®, Navigate Business Checking®, or Optimize Business Checking® account by enrolling online.
              </div>

              <div className="space-y-2 border border-stone-200 p-4 rounded-xl bg-stone-50">
                <p><strong>Step 1:</strong> Open an eligible new business checking account online.</p>
                <p><strong>Step 2:</strong> Deposit $5,000+ within 30 days and maintain that balance through day 60 for the $525 bonus, or deposit $25,000+ for the full $825 bonus.</p>
                <p><strong>Step 3:</strong> Have 10 or more posted qualifying transactions by day 60.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    onOpenAccountForm();
                  }}
                  className="flex-1 bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-xl font-bold transition-colors cursor-pointer text-center"
                >
                  Apply Online Now
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 border border-stone-300 hover:bg-stone-100 rounded-xl font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Selector Interactive Modal */}
      {activeModal === 'product-selector' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d71e28]">
                  Wells Fargo Business Tools
                </span>
                <h3 className="font-sans text-xl font-bold text-stone-900">
                  Business Product Selector
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-stone-700">
              {selectorStep === 1 ? (
                <div>
                  <p className="font-semibold text-stone-900 mb-3">
                    What stage is your business currently in?
                  </p>
                  <div className="space-y-2">
                    {[
                      { id: 'startup', label: 'Starting up (under 2 years)' },
                      { id: 'growing', label: 'Growing & expanding operations' },
                      { id: 'established', label: 'Established enterprise ($1M+ revenue)' },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedBusinessType(opt.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                          selectedBusinessType === opt.id
                            ? 'border-[#d71e28] bg-red-50 text-red-950 font-bold'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {selectedBusinessType === opt.id && <Check className="w-4 h-4 text-[#d71e28]" />}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectorStep(2)}
                    className="mt-5 w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Next: Recommended Products
                  </button>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-stone-900 mb-2">
                    Recommended products for your {selectedBusinessType} business:
                  </p>
                  <div className="space-y-2.5 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                      <span className="font-bold text-stone-900 block">Initiate Business Checking®</span>
                      <span className="text-[11px] text-stone-600">Low minimum opening balance ($25), 100 fee-free monthly transactions.</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                      <span className="font-bold text-stone-900 block">Signify Business CashSM Card</span>
                      <span className="text-[11px] text-stone-600">Unlimited 2% cash rewards on every purchase with $0 annual fee.</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                      <span className="font-bold text-stone-900 block">Clover® Mobile Point-of-Sale</span>
                      <span className="text-[11px] text-stone-600">Accept tap-to-pay, chip, and digital wallet payments on the go.</span>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => setSelectorStep(1)}
                      className="px-4 py-2 border border-stone-300 rounded-xl font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        onOpenAccountForm();
                      }}
                      className="flex-1 bg-[#d71e28] hover:bg-[#b81620] text-white py-2 rounded-xl font-bold"
                    >
                      Open Recommended Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credit Card Bonus Modal */}
      {activeModal === 'credit-card-bonus' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-sans text-xl font-bold text-stone-900">
                Signify Business Cash℠ Card
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3.5 text-xs text-stone-700">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-950 font-medium">
                💳 Earn a $500 cash reward bonus after spending $5,000 on purchases in the first 3 months.
              </div>
              <ul className="space-y-2 list-disc list-inside bg-stone-50 p-4 rounded-xl border border-stone-200">
                <li>Unlimited 2% cash rewards on every business purchase</li>
                <li>$0 annual card fee for primary and employee cards</li>
                <li>0% intro APR on purchases for 12 months from account opening</li>
              </ul>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenAccountForm();
                }}
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Apply for Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lines & Loans Modal */}
      {activeModal === 'lines-loans' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-sans text-xl font-bold text-stone-900">
                Wells Fargo Business Lines & Loans
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3.5 text-xs text-stone-700">
              <p>
                From revolving working capital lines of credit to equipment loans and commercial real estate, Wells Fargo provides financing tailored to your business stage.
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <p><strong>Unsecured Lines of Credit:</strong> From $10,000 to $100,000</p>
                <p><strong>SBA 7(a) & 504 Loans:</strong> Preferred SBA lender nationwide up to $5,000,000</p>
                <p><strong>Commercial Real Estate:</strong> Financing options for owner-occupied properties</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Connect with a Business Loan Officer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Merchant Services Modal */}
      {activeModal === 'merchant-services' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-sans text-xl font-bold text-stone-900">
                Wells Fargo Merchant Services
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-stone-700">
              <p>
                Accept payments in-person, online, or on-the-go with Clover® point-of-sale systems powered by Wells Fargo Merchant Services.
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                <p>✓ Same-day or next-day deposits into your Wells Fargo checking account</p>
                <p>✓ Contactless Apple Pay, Google Pay, and EMV chip cards</p>
                <p>✓ Transparent flat-rate or interchange-plus processing models</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Explore Clover® POS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prepare Documents Modal */}
      {activeModal === 'prepare-documents' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-sans text-xl font-bold text-stone-900">
                Required Documents Checklist
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-stone-700">
              <p>Gather these items before starting your application:</p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <p><strong>1. Business Tax ID / EIN:</strong> Employer Identification Number or SSN for sole proprietors.</p>
                <p><strong>2. Organization Documents:</strong> Articles of Incorporation, LLC Operating Agreement, or Partnership Agreement.</p>
                <p><strong>3. Beneficial Ownership:</strong> Government IDs and SSN for owners with 25%+ equity.</p>
                <p><strong>4. Physical Business Address:</strong> Utility bill or commercial lease agreement.</p>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenAccountForm();
                }}
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Start Account Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generic Resource / Appointment / Location Modals */}
      {(activeModal === 'find-location' || activeModal === 'appointment' || activeModal === 'quick-help' || activeModal === 'app-download' || activeModal === 'payroll-services' || activeModal === 'resources-guide' || activeModal === 'protect-business') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-center">
            <h3 className="font-sans text-lg font-bold text-stone-900 mb-2">
              {activeModal === 'find-location' && 'Wells Fargo Business Branch Locator'}
              {activeModal === 'appointment' && 'Schedule an Appointment with a Banker'}
              {activeModal === 'quick-help' && 'Wells Fargo Business Customer Support'}
              {activeModal === 'app-download' && 'Wells Fargo Mobile® Banking App'}
              {activeModal === 'payroll-services' && 'Wells Fargo Payroll & HR Services'}
              {activeModal === 'resources-guide' && 'Business Resource Center'}
              {activeModal === 'protect-business' && 'Intellectual Property & Business Security'}
            </h3>
            <p className="text-xs text-stone-600 mb-5 leading-relaxed">
              {activeModal === 'find-location' && 'Over 4,000 branch locations and 12,000 ATMs available nationwide with dedicated commercial tellers.'}
              {activeModal === 'appointment' && 'Schedule a 1-on-1 meeting in-branch or over the phone with an authorized Wells Fargo business banker.'}
              {activeModal === 'quick-help' && 'Dedicated 24/7 business assistance line: 1-800-CALL-WELLS (1-800-225-5935).'}
              {activeModal === 'app-download' && 'Manage cash flow, send wires, deposit checks, and review payroll anytime using the Wells Fargo Mobile app.'}
              {activeModal === 'payroll-services' && 'Automate direct deposit payroll, tax withholdings, and benefits integration in partnership with ADP®.'}
              {activeModal === 'resources-guide' && 'Explore articles, cash flow spreadsheets, and tax planning guides curated by Wells Fargo Small Business.'}
              {activeModal === 'protect-business' && 'Learn how patents, trademarks, non-disclosure agreements, and cyber insurance protect enterprise valuation.'}
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-stone-900 hover:bg-black text-white py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Online & Mobile Security Center Modal */}
      <OnlineMobileSecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />
    </div>
  );
};
