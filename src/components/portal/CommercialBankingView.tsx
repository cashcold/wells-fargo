import React, { useState } from 'react';
import {
  ChevronRight,
  ExternalLink,
  Shield,
  FileText,
  DollarSign,
  TrendingUp,
  X,
  Lock,
  Building,
  Check,
  Download,
  Headphones,
  Play,
  Share2,
} from 'lucide-react';

interface CommercialBankingViewProps {
  onOpenSignOn: () => void;
  onOpenAccountForm: () => void;
  isLoggedIn: boolean;
  userName: string;
}

export const CommercialBankingView: React.FC<CommercialBankingViewProps> = ({
  onOpenSignOn,
  onOpenAccountForm,
  isLoggedIn,
  userName,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('Customers and Industries');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Vantage Sign-On modal state
  const [vantageCompanyId, setVantageCompanyId] = useState('');
  const [vantageUserId, setVantageUserId] = useState('');
  const [vantagePassword, setVantagePassword] = useState('');

  return (
    <div className="bg-white text-stone-900 flex flex-col font-sans">
      {/* =========================================================================
          SUB-NAVIGATION BAR matching Screenshot 1
         ========================================================================= */}
      <div className="bg-white border-b border-stone-200 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 sm:gap-8 py-2.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          {[
            'Customers and Industries',
            'Solutions',
            'Commercial Banking Leadership',
            'Insights & Reports',
          ].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveSubTab(item);
                if (item === 'Solutions') {
                  const el = document.getElementById('commercial-solutions');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                } else if (item === 'Insights & Reports') {
                  const el = document.getElementById('commercial-insights');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                } else if (item === 'Commercial Banking Leadership') {
                  setActiveModal('leadership');
                } else if (item === 'Customers and Industries') {
                  const el = document.getElementById('commercial-industries');
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
          HERO SECTION matching Screenshot 1
         ========================================================================= */}
      <div className="relative bg-stone-100 overflow-hidden border-b border-stone-200 min-h-[460px] sm:min-h-[520px]">
        {/* Full-bleed Executive Photography Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/wf_commercial_hero_executive_1791410543063.jpg"
            alt="Corporate executive looking out high-rise office window over city skyline"
            className="w-full h-full object-cover object-right lg:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent lg:via-white/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px] sm:min-h-[520px]">
          {/* Left Column: Wells Fargo Vantage® Sign-On Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200/80 max-w-xs w-full">
              <div className="p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-5">
                  Wells Fargo Vantage<sup>®</sup>
                </h3>

                <button
                  onClick={() => setActiveModal('vantage-login')}
                  className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-full font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Sign On
                </button>
              </div>

              {/* Bottom Card Gray Links Container */}
              <div className="bg-stone-50/80 p-5 border-t border-stone-100 text-xs space-y-2 text-[#2b2468]">
                <div>
                  <button
                    onClick={() => setActiveModal('vantage-forgot')}
                    className="hover:underline cursor-pointer block text-stone-700 hover:text-stone-900"
                  >
                    Forgot password?
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setActiveModal('about-vantage')}
                    className="hover:underline cursor-pointer block text-stone-700 hover:text-stone-900"
                  >
                    About Vantage
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setActiveModal('fraud-security')}
                    className="hover:underline cursor-pointer block text-stone-700 hover:text-stone-900"
                  >
                    Fraud & Security
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
              </div>
            </div>
          </div>

          {/* Center/Right Column: Hero Copy & Report Buttons matching Screenshot 1 */}
          <div className="lg:col-span-8 space-y-6 max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-stone-900 font-normal leading-[1.15] tracking-tight">
              Double-digit revenue<br />growth and investment<br />momentum characterize<br />America's middle market
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveModal('infographic-pdf')}
                className="border border-stone-900 hover:bg-stone-50 bg-white/90 text-stone-900 px-6 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                View infographic (PDF)
              </button>
              <button
                onClick={() => setActiveModal('full-report-pdf')}
                className="border border-stone-900 hover:bg-stone-50 bg-white/90 text-stone-900 px-6 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                View full report (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEAMLESS, SCALABLE, SMART SECTION matching Screenshot 1 & 2
         ========================================================================= */}
      <div id="commercial-solutions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        {/* Centered Yellow Accent Line */}
        <div className="w-12 h-[2px] bg-[#ffcc00] mx-auto mb-4" />

        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 text-center font-normal mb-3">
          Seamless, scalable, smart
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
          Turn to our team for market-leading financial solutions, trusted insights, and the strength of our global network to support your strategic goals.
        </p>

        {/* 2 Solution Cards matching Screenshot 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {/* Card 1: Flexible capital for growth */}
          <div className="border border-stone-200 rounded-xl p-6 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="mb-4">
                {/* Red trending up chart icon */}
                <svg
                  className="w-10 h-10 text-[#d71e28]"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 38L18 26L28 32L42 14" />
                  <path d="M32 14H42V24" />
                  <path d="M10 40H38" />
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 text-base leading-snug">
                Flexible capital for<br />growth
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Explore lending options to help support expansion, working capital, and strategic priorities
              </p>
            </div>
            <div className="mt-6 pt-3">
              <button
                onClick={() => setActiveModal('commercial-lending')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Finance your business</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Move money efficiently; Optimize liquidity */}
          <div className="border border-stone-200 rounded-xl p-6 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="mb-4">
                {/* Red circulating arrows with dollar sign */}
                <svg
                  className="w-10 h-10 text-[#d71e28]"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20C14 14 20 10 28 10C36 10 42 16 42 24" />
                  <path d="M42 16V24H34" />
                  <path d="M36 28C34 34 28 38 20 38C12 38 6 32 6 24" />
                  <path d="M6 32V24H14" />
                  <path d="M24 18V30" />
                  <path d="M21 21H27" />
                  <path d="M21 27H27" />
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 text-base leading-snug">
                Move money efficiently;<br />Optimize liquidity
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Tools to help strengthen payments, visibility, and working capital
              </p>
            </div>
            <div className="mt-6 pt-3">
              <button
                onClick={() => setActiveModal('payments-liquidity')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Payments & liquidity</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            NAVIGATING THE UNIQUE CHALLENGES OF YOUR INDUSTRY matching Screenshot 2
           ========================================================================= */}
        <div id="commercial-industries" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white pt-4">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal text-stone-900 leading-tight">
              Navigating the unique<br />challenges of your<br />industry
            </h2>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
              From health care to technology, food to manufacturing, we have broad and deep experience across many industries and sectors. We'll help you identify and take advantage of key opportunities throughout the cycles of your business and the economy.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveModal('industry-solutions')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-6 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Explore industry solutions
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 h-72 sm:h-84 lg:h-96 rounded-xl overflow-hidden shadow-xs">
            <img
              src="/assets/images/wf_commercial_boardroom_1791410560135.jpg"
              alt="Diverse executive board meeting around white conference table in corporate glass boardroom"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          SHARING INSIGHTS ON WHAT MATTERS TO YOU matching Screenshot 3
         ========================================================================= */}
      <div id="commercial-insights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full border-t border-stone-200">
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 text-center font-normal mb-3">
          Sharing insights on what matters to you
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
          Take a deep dive with our experts as they present valuable research, analysis, and perspectives on current innovations and industry trends.
        </p>

        {/* 4 Insight Cards in a row with yellow stripe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: 2026 MY Middle Market Indicator */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_commercial_corridor_walk_1791410577043.jpg"
                  alt="Two young corporate professionals walking along bright office glass corridor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-5">
                <h3 className="font-sans text-xs sm:text-sm font-semibold text-stone-900 leading-snug">
                  2026 MY Middle Market Indicator: Despite an uncertain operating environment, economic confidence and expansionary activity remain stable
                </h3>
              </div>
            </div>
            <div className="p-5 pt-0 space-y-2 text-xs font-semibold text-[#2b2468]">
              <div>
                <button
                  onClick={() => setActiveModal('infographic-pdf')}
                  className="hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View infographic (PDF)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('full-report-pdf')}
                  className="hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Access full report (PDF)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: EXIM Bank */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_commercial_cargo_ship_1791410591552.jpg"
                  alt="Large container cargo vessel loaded with multicolored shipping containers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-5">
                <h3 className="font-sans text-xs sm:text-sm font-semibold text-stone-900 leading-snug">
                  EXIM Bank and the working capital guarantee
                </h3>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('exim-podcast')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Listen to the latest</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Cyber and payments fraud */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_commercial_cyber_phone_1791410610450.jpg"
                  alt="Hands holding smartphone confirming digital payment on office desk"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-5">
                <h3 className="font-sans text-xs sm:text-sm font-semibold text-stone-900 leading-snug">
                  Four steps toward cyber and payments-fraud resilience for Mid-Corporate technology companies
                </h3>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('cyber-article')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read article</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Safeguarding your business */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_commercial_padlock_keyboard_1791410625073.jpg"
                  alt="Brass padlock sitting securely on laptop keyboard with illuminated keys"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-5">
                <h3 className="font-sans text-xs sm:text-sm font-semibold text-stone-900 leading-snug">
                  Safeguarding your business: How to help fight fraud with Wells Fargo Vantage<sup>®</sup>
                </h3>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('vantage-video')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View video</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Centered Red Pill Button matching Screenshot 3 */}
        <div className="text-center mt-10">
          <button
            onClick={() => setActiveModal('all-insights')}
            className="bg-[#d71e28] hover:bg-[#b81620] text-white px-7 py-2.5 rounded-full font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Explore all insights
          </button>
        </div>
      </div>

      {/* =========================================================================
          CELEBRATING CUSTOMER SUCCESSES matching Screenshot 4
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full border-t border-stone-200">
        {/* Centered Yellow Accent Line */}
        <div className="w-12 h-[2px] bg-[#ffcc00] mx-auto mb-4" />

        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 text-center font-normal mb-10">
          Celebrating customer successes
        </h2>

        {/* 2 Customer Story Banners */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Story 1: Ranger Construction */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-5 h-64 sm:h-72 overflow-hidden">
              <img
                src="/assets/images/wf_commercial_ranger_veterans_1791410639962.jpg"
                alt="Five business executive partners standing together in business suits at veteran banquet"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-7 p-6 sm:p-8 space-y-3">
              <h3 className="font-bold text-stone-900 text-base sm:text-lg leading-snug">
                Military experience, strong relationships drive veteran-owned Ranger Construction to success
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Wells Fargo's expertise supports commercial contractor from startup to second-generation family business.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveModal('story-ranger')}
                  className="border border-stone-900 text-stone-900 hover:bg-stone-50 px-6 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  Read article
                </button>
              </div>
            </div>
          </div>

          {/* Story 2: H & N Group */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-5 h-64 sm:h-72 overflow-hidden">
              <img
                src="/assets/images/wf_commercial_hn_seafood_family_1791410655090.jpg"
                alt="Vintage family photograph of Asian family standing proudly at seafood enterprise"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-7 p-6 sm:p-8 space-y-3">
              <h3 className="font-bold text-stone-900 text-base sm:text-lg leading-snug">
                H & N Group: How a family business overcame adversity to create a global seafood enterprise
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                From humble beginnings through international expansion, Wells Fargo and Ngo family built a trusted 30-year banking relationship.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveModal('story-hn-group')}
                  className="border border-stone-900 text-stone-900 hover:bg-stone-50 px-6 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  Read article
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          REACH OUT TO GET STARTED matching Screenshot 5
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full border-t border-stone-200 text-center">
        {/* Centered Yellow Accent Line */}
        <div className="w-12 h-[2px] bg-[#ffcc00] mx-auto mb-4" />

        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mb-4">
          Reach out to get started
        </h2>
        <p className="text-xs sm:text-sm text-stone-700 max-w-2xl mx-auto leading-relaxed mb-6">
          Let's connect. We're focused on providing tailored products and services to meet the unique banking needs of commercial businesses with annual revenues ranging from $25 million to $2 billion.
        </p>

        <div>
          <button
            onClick={() => setActiveModal('contact-commercial')}
            className="border border-stone-900 hover:bg-stone-50 text-stone-900 px-8 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer"
          >
            Contact us
          </button>
        </div>

        {/* Regulatory Disclaimers & Footnotes matching Screenshot 5 */}
        <div className="mt-16 text-left text-[11px] sm:text-xs text-stone-500 leading-relaxed space-y-3 max-w-5xl mx-auto border-t border-stone-200 pt-6">
          <p>
            Commercial Banking products and services are provided by Wells Fargo Bank, N.A. and its subsidiaries and affiliates. Wells Fargo Bank, N.A., a bank affiliate of Wells Fargo & Company, is not liable or responsible for obligations of its affiliates. Deposits held in non-U.S. branches are not FDIC insured. Products and services require credit approval.
          </p>
          <p>
            Wells Fargo Bank, N.A. Member FDIC. Deposits held in non-U.S. branches are not FDIC insured.
          </p>
          <p className="font-mono text-[10px] text-stone-400">
            RO-5397012
          </p>
          <p className="font-mono text-[10px] text-stone-400">
            LRC-0426
          </p>
        </div>

        {/* Bottom Legal Footer Links matching Screenshot 5 */}
        <div className="mt-8 pt-6 border-t border-stone-200 text-left text-[11px] text-stone-600 leading-relaxed flex flex-wrap gap-x-4 gap-y-2">
          <span className="hover:underline cursor-pointer">Privacy, Cookies, Security & Legal</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">Do Not Sell or Share My Personal Information</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">Notice of Data Collection</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">General Terms of Use</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">Report Fraud</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">Sitemap</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">Home</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">About Wells Fargo</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">Careers</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">Inclusion & Accessibility</span>
        </div>

        <div className="text-left text-[11px] text-stone-500 mt-4">
          © 1999 - 2026 Wells Fargo & Company. NMLSR ID 399801
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE MODALS FOR COMMERCIAL BANKING
         ========================================================================= */}

      {/* Vantage Sign-On Modal */}
      {activeModal === 'vantage-login' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d71e28]">
                  Commercial Portal
                </span>
                <h3 className="font-serif text-xl font-normal text-stone-900">
                  Wells Fargo Vantage<sup>®</sup> Sign On
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onOpenSignOn();
                setActiveModal(null);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Company ID</label>
                <input
                  type="text"
                  placeholder="Enter Company ID"
                  value={vantageCompanyId}
                  onChange={(e) => setVantageCompanyId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#d71e28]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">User ID</label>
                <input
                  type="text"
                  placeholder="Enter User ID"
                  value={vantageUserId}
                  onChange={(e) => setVantageUserId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#d71e28]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Password / RSA SecurID</label>
                <input
                  type="password"
                  value={vantagePassword}
                  onChange={(e) => setVantagePassword(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#d71e28]"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Secure Sign On
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Middle Market Infographic PDF Modal */}
      {activeModal === 'infographic-pdf' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d71e28]">
                  Research & Analysis
                </span>
                <h3 className="font-serif text-xl font-normal text-stone-900">
                  2026 Middle Market Indicator Infographic
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
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                  <div className="text-2xl font-bold text-[#d71e28]">+11.4%</div>
                  <div className="text-[10px] text-stone-600 mt-1">Average annual revenue growth</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">76%</div>
                  <div className="text-[10px] text-stone-600 mt-1">Expect to hire in next 12 months</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">82%</div>
                  <div className="text-[10px] text-stone-600 mt-1">Confidence in regional economy</div>
                </div>
              </div>

              <p className="leading-relaxed">
                Middle-market companies continue to show tremendous agility, investing heavily in automation, workforce upskilling, and supply-chain diversification.
              </p>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-stone-900 hover:bg-black text-white py-2.5 rounded-xl font-semibold"
              >
                Close Infographic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Report PDF Modal */}
      {activeModal === 'full-report-pdf' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d71e28]">
                  Wells Fargo Commercial Banking Research
                </span>
                <h3 className="font-serif text-xl font-normal text-stone-900">
                  Middle Market Executive Outlook (Comprehensive PDF)
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
              <p>
                This semi-annual executive survey surveys over 1,000 CFOs, treasurers, and managing directors of U.S. middle-market businesses with revenues between $25 million and $2 billion.
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <p><strong>1. Capital Expenditure:</strong> 68% plan to deploy capital into plant expansion or robotics.</p>
                <p><strong>2. Working Capital Optimization:</strong> Increased adoption of dynamic discounting and virtual card programs.</p>
                <p><strong>3. FX & Hedging:</strong> Active interest rate hedging against volatile short-term benchmark rates.</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Commercial Banker Modal */}
      {activeModal === 'contact-commercial' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d71e28]">
                  Direct Commercial Inquiries
                </span>
                <h3 className="font-serif text-xl font-normal text-stone-900">
                  Connect with a Commercial Banker
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-stone-700">
              <p>
                Our commercial banking teams are organized by industry and geographic market to deliver tailored financing and liquidity strategies.
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <p><strong>Eligibility:</strong> Businesses with annual revenue of $25M to $2B</p>
                <p><strong>Specialty Divisions:</strong> Healthcare, Tech & Life Sciences, Food & Agribusiness, Heavy Industrial</p>
                <p><strong>Direct Desk:</strong> 1-877-224-9355 (Mon–Fri 8:00 a.m. – 6:00 p.m. CT)</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Submit Inquiries
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generic Informational Modals */}
      {(activeModal === 'commercial-lending' || activeModal === 'payments-liquidity' || activeModal === 'industry-solutions' || activeModal === 'exim-podcast' || activeModal === 'cyber-article' || activeModal === 'vantage-video' || activeModal === 'all-insights' || activeModal === 'story-ranger' || activeModal === 'story-hn-group' || activeModal === 'vantage-forgot' || activeModal === 'about-vantage' || activeModal === 'fraud-security' || activeModal === 'privacy-legal' || activeModal === 'leadership') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-center">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
              {activeModal === 'commercial-lending' && 'Commercial Financing & Capital Solutions'}
              {activeModal === 'payments-liquidity' && 'Treasury Management & Liquidity Solutions'}
              {activeModal === 'industry-solutions' && 'Wells Fargo Specialized Industry Groups'}
              {activeModal === 'exim-podcast' && 'EXIM Bank Working Capital Podcast'}
              {activeModal === 'cyber-article' && 'Cyber & Payments-Fraud Resilience Briefing'}
              {activeModal === 'vantage-video' && 'Wells Fargo Vantage® Fraud Defense Overview'}
              {activeModal === 'all-insights' && 'Wells Fargo Commercial Insights Library'}
              {activeModal === 'story-ranger' && 'Ranger Construction: 25-Year Relationship'}
              {activeModal === 'story-hn-group' && 'H & N Group: Global Seafood Enterprise Case Study'}
              {activeModal === 'vantage-forgot' && 'Vantage Password Reset Assistance'}
              {activeModal === 'about-vantage' && 'About Wells Fargo Vantage®'}
              {activeModal === 'fraud-security' && 'Commercial Security & Dual-Control Approvals'}
              {activeModal === 'privacy-legal' && 'Commercial Banking Legal Terms'}
              {activeModal === 'leadership' && 'Commercial Banking Executive Leadership'}
            </h3>
            <p className="text-xs text-stone-600 mb-5 leading-relaxed">
              {activeModal === 'commercial-lending' && 'Syndicated credit facilities, equipment leases, asset-based lending, and commercial real estate term loans.'}
              {activeModal === 'payments-liquidity' && 'Real-time payments (RTP), ACH origination, global wires, target-balance sweep accounts, and multi-currency liquidity.'}
              {activeModal === 'industry-solutions' && 'Dedicated teams serving Healthcare, Technology & Media, Commercial Real Estate, Energy, Consumer Retail, and Agribusiness.'}
              {activeModal === 'exim-podcast' && 'Expert discussion on securing Export-Import Bank guarantees to finance international supply chains and foreign receivables.'}
              {activeModal === 'cyber-article' && 'Essential fraud protection tactics: Positive Pay, account validation APIs, Out-of-Band verification, and employee training.'}
              {activeModal === 'vantage-video' && 'Comprehensive walkthrough of dual-authorization workflows, granular entitlements, and biometric approval alerts.'}
              {activeModal === 'all-insights' && 'Access white papers, market forecasts, and regional economic indices published monthly by Wells Fargo strategists.'}
              {activeModal === 'story-ranger' && 'How veteran-led Ranger Construction expanded bonding capacity and working capital through 2 generations with Wells Fargo.'}
              {activeModal === 'story-hn-group' && 'How the Ngo family scaled from local processing to worldwide cold-chain seafood distribution with trade finance lines.'}
              {activeModal === 'vantage-forgot' && 'Contact your company Vantage Administrator or call Commercial Customer Support at 1-800-AT-WELLS.'}
              {activeModal === 'about-vantage' && 'Wells Fargo Vantage® connects your enterprise accounts, payment rails, foreign exchange, and reporting in a single unified portal.'}
              {activeModal === 'fraud-security' && 'Bank-grade 256-bit encryption, tokenized authentication, behavioral anomaly detection, and automated audit trails.'}
              {activeModal === 'privacy-legal' && 'Enterprise data handling, GDPR/CCPA compliance notices, and customer confidentiality safeguards.'}
              {activeModal === 'leadership' && 'Meet the executive leadership team guiding Wells Fargo Commercial Banking across 50 states and international hubs.'}
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
    </div>
  );
};
