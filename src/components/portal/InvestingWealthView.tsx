import React, { useState } from 'react';
import {
  ChevronRight,
  Shield,
  FileText,
  X,
  Briefcase,
  Check,
  Building,
  TrendingUp,
  DollarSign,
  PieChart,
  Smartphone,
  Info,
} from 'lucide-react';

interface InvestingWealthViewProps {
  onOpenSignOn: () => void;
  onOpenAccountForm: () => void;
  isLoggedIn: boolean;
  userName: string;
}

export const InvestingWealthView: React.FC<InvestingWealthViewProps> = ({
  onOpenSignOn,
  onOpenAccountForm,
  isLoggedIn,
  userName,
}) => {
  const [subTab, setSubTab] = useState<'investing' | 'private-wealth'>('investing');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="bg-white text-stone-900 flex flex-col font-sans">
      {/* Sub-Navigation Bar matching Screenshot 1: Investing | Private Wealth */}
      <div className="bg-white border-b border-stone-200 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 py-2.5">
          <button
            onClick={() => setSubTab('investing')}
            className={`cursor-pointer transition-colors ${
              subTab === 'investing'
                ? 'text-stone-900 font-bold border-b-2 border-stone-900 pb-0.5'
                : 'text-stone-600 hover:text-stone-900 font-medium'
            }`}
          >
            Investing
          </button>
          <button
            onClick={() => setSubTab('private-wealth')}
            className={`cursor-pointer transition-colors ${
              subTab === 'private-wealth'
                ? 'text-stone-900 font-bold border-b-2 border-stone-900 pb-0.5'
                : 'text-stone-500 hover:text-stone-800 font-medium'
            }`}
          >
            Private Wealth
          </button>
        </div>
      </div>

      {subTab === 'investing' ? (
        <>
          {/* =========================================================================
              HERO SECTION matching Screenshot 1
             ========================================================================= */}
          <div className="relative bg-[#ecebe8] overflow-hidden border-b border-stone-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center min-h-[380px] sm:min-h-[440px]">
              {/* Left Text Box */}
              <div className="lg:col-span-5 z-10 px-5 sm:px-10 py-10 sm:py-12">
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-stone-900 font-normal leading-tight">
                  A clear path to estate<br />planning strategies
                </h1>
                <p className="text-stone-800 text-sm sm:text-base mt-3 max-w-md font-sans leading-snug">
                  Our simple process helps you<br />plan with confidence.
                </p>
                <div className="mt-6 sm:mt-7">
                  <button
                    onClick={() => setActiveModal('estate-planning')}
                    className="bg-[#2b2468] hover:bg-[#1f194d] text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow cursor-pointer"
                  >
                    Start the conversation
                  </button>
                </div>
              </div>

              {/* Right Hero Image */}
              <div className="lg:col-span-7 h-64 sm:h-80 lg:h-[440px] relative overflow-hidden">
                <img
                  src="/assets/images/wf_estate_hero_1791404670674.jpg"
                  alt="Wells Fargo Estate Planning Advisor Consultation with Family"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              4 CARDS: WAYS TO INVEST matching Screenshot 1
             ========================================================================= */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Dedicated financial advisor */}
              <div className="border border-stone-200 rounded-xl p-5 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="mb-4">
                    {/* Handshake line art icon in warm bronze/gold #a3703c */}
                    <svg
                      className="w-10 h-10 text-[#a3703c]"
                      viewBox="0 0 48 48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 26L6 20L16 10L24 18L20 22" />
                      <path d="M36 26L42 20L32 10L24 18L28 22" />
                      <path d="M18 24L22 28L26 24" />
                      <path d="M22 28L26 32L30 28" />
                      <path d="M26 32L30 36L34 32" />
                      <path d="M20 22L28 22" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                    Dedicated financial<br />advisor
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Personalized investment planning<br />and advice
                  </p>
                </div>
                <div className="mt-6 pt-3">
                  <button
                    onClick={() => setActiveModal('advisor')}
                    className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Wells Fargo Advisors</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 2: Solutions Financial Advisor Team */}
              <div className="border border-stone-200 rounded-xl p-5 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="mb-4">
                    {/* Phone handset line art icon in #a3703c */}
                    <svg
                      className="w-9 h-9 text-[#a3703c]"
                      viewBox="0 0 48 48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 8C12 8 13.5 14 17 16L14 20C17 26 22 31 28 34L32 31C34 34.5 40 36 40 36C40 38.2 38.2 40 36 40C22.7 40 12 29.3 12 16C12 11.6 12 8 12 8Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm inline">
                      Solutions Financial<br />Advisor Team
                    </h3>
                    <span className="bg-[#ffcc00] text-stone-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ml-1.5 align-middle">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Investment guidance and goal-<br />based planning
                  </p>
                </div>
                <div className="mt-6 pt-3">
                  <button
                    onClick={() => setActiveModal('solutions-advisor')}
                    className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Solutions Advisors</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 3: Automated investing */}
              <div className="border border-stone-200 rounded-xl p-5 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="mb-4">
                    {/* Pie chart with dollar sign icon in #a3703c */}
                    <svg
                      className="w-10 h-10 text-[#a3703c]"
                      viewBox="0 0 48 48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="24" cy="24" r="18" />
                      <line x1="24" y1="6" x2="24" y2="24" />
                      <line x1="24" y1="24" x2="42" y2="24" />
                      <line x1="24" y1="24" x2="11.2" y2="36.8" />
                      <text
                        x="31"
                        y="19"
                        fontSize="11"
                        fill="currentColor"
                        stroke="none"
                        fontWeight="600"
                        fontFamily="sans-serif"
                      >
                        $
                      </text>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                    Automated investing
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Begin your investing journey with<br />just $500
                  </p>
                </div>
                <div className="mt-6 pt-3">
                  <button
                    onClick={() => setActiveModal('automated-investing')}
                    className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Intuitive Investor<sup>®</sup></span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 4: Do-it-yourself investing */}
              <div className="border border-stone-200 rounded-xl p-5 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="mb-4">
                    {/* Smartphone outline icon in #a3703c */}
                    <svg
                      className="w-9 h-9 text-[#a3703c]"
                      viewBox="0 0 48 48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="14" y="6" width="20" height="36" rx="4" />
                      <line x1="20" y1="36" x2="28" y2="36" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                    Do-it-yourself investing
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Hands-on control with $0 online<br />stock and ETF trades<sup>1</sup>
                  </p>
                </div>
                <div className="mt-6 pt-3">
                  <button
                    onClick={() => setActiveModal('wellstrade')}
                    className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>WellsTrade<sup>®</sup></span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Compare ways to invest button matching Screenshot 1 */}
            <div className="text-center mt-9 mb-4">
              <button
                onClick={() => setActiveModal('compare')}
                className="bg-[#2b2468] hover:bg-[#1f194d] text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-xs transition-colors cursor-pointer"
              >
                Compare ways to invest
              </button>
            </div>
          </div>

          {/* =========================================================================
              EXPERIENCE THE PRIVATE WEALTH DIFFERENCE matching Screenshot 2
             ========================================================================= */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white">
              <div className="md:col-span-5 space-y-3">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-[#9e7036] font-normal leading-tight">
                  Experience the Private<br />Wealth difference
                </h2>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                  Bring your personal and business<br />goals together.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setSubTab('private-wealth')}
                    className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-7 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Explore
                  </button>
                </div>
              </div>

              <div className="md:col-span-7 relative h-64 sm:h-76 lg:h-80 overflow-hidden flex items-center justify-end">
                <img
                  src="/assets/images/wf_private_wealth_jet_1791404685504.jpg"
                  alt="Father and daughter stepping down private jet airstair"
                  className="w-full h-full object-cover object-right"
                />
              </div>
            </div>
          </div>

          {/* Centered Divider matching Screenshot 2 */}
          <div className="w-14 h-[1px] bg-stone-300 mx-auto my-12" />

          {/* =========================================================================
              INVESTING STRATEGIES AND INSIGHTS matching Screenshot 2
             ========================================================================= */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
            <h2 className="font-serif text-2xl sm:text-[28px] text-[#9e7036] text-center font-normal mb-8">
              Investing strategies and insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Investment Strategy update */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="h-48 overflow-hidden">
                    <img
                      src="/assets/images/wf_bridge_strategy_1791404705051.jpg"
                      alt="Modern suspension bridge across open water"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                      Investment Strategy update
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      Weekly market insights and possible impacts on investors from Wells Fargo Investment Institute.
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <button
                    onClick={() => setActiveModal('strategy-report')}
                    className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Get the report
                  </button>
                </div>
              </div>

              {/* Card 2: Market charts */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="h-48 overflow-hidden">
                    <img
                      src="/assets/images/wf_market_charts_1791404719727.jpg"
                      alt="Market candlestick graphs and global financial trends"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                      Market charts
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      A curated collection of charts from Wells Fargo Investment Institute on economic and market topics that are top of mind for investors.
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <button
                    onClick={() => setActiveModal('market-charts')}
                    className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Gain insights
                  </button>
                </div>
              </div>

              {/* Card 3: Retirement strategies */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="h-48 overflow-hidden">
                    <img
                      src="/assets/images/wf_retirement_1791404771904.jpg"
                      alt="Smiling mature couple outdoors embracing at sunset"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                      Retirement strategies
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      Whether you're close to retirement or years away, we can help you build a retirement plan to help meet your goals.
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <button
                    onClick={() => setActiveModal('retirement')}
                    className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Retirement center
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              AWARD-WINNING DIGITAL EXPERIENCE matching Screenshot 3
             ========================================================================= */}
          <div className="w-full bg-[#544d49] text-white py-12 sm:py-16 my-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Trophy on Left */}
              <div className="md:col-span-4 flex justify-center">
                <div className="w-48 sm:w-56 h-56 sm:h-64 rounded-xl overflow-hidden shadow-2xl bg-transparent">
                  <img
                    src="/assets/images/wf_jd_trophy_1791404755863.jpg"
                    alt="J.D. Power #1 Customer Satisfaction Trophy for Wealth Management Digital Experience"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Trophy Text on Right */}
              <div className="md:col-span-8 space-y-3.5">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-white font-normal leading-tight">
                  Award-winning digital<br />experience
                </h2>
                <p className="text-stone-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Wells Fargo Advisors ranked #1 in Client<br className="hidden sm:inline" />Satisfaction with Wealth Management<br className="hidden sm:inline" />Digital Experience among Advised<br className="hidden sm:inline" />Investor<sup>2</sup>.
                </p>
                <div className="pt-2">
                  <p className="text-xs text-stone-300 mb-3">
                    Get the highly-acclaimed Wells Fargo Mobile<sup>®</sup> app<sup>3</sup>
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Apple App Store Button */}
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

                    {/* Google Play Button */}
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
                </div>
              </div>
            </div>
          </div>

          {/* Centered Divider matching Screenshot 3 */}
          <div className="w-14 h-[1px] bg-stone-300 mx-auto my-12" />

          {/* =========================================================================
              BENEFITS AND RESOURCES matching Screenshot 3
             ========================================================================= */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
            <h2 className="font-serif text-2xl sm:text-[28px] text-[#9e7036] text-center font-normal mb-8">
              Benefits and resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Make your money work for you */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden">
                    <img
                      src="/assets/images/wf_advisor_desk_1791404789202.jpg"
                      alt="Advisor meeting with couple discussing cash flow"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-stone-900 text-base">
                      Make your money work for you
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      Understand the importance of cash flow planning and how it can help you stay on track.
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => setActiveModal('cash-flow-planning')}
                    className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Tips to consider
                  </button>
                </div>
              </div>

              {/* Card 2: Understanding digital assets */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden">
                    <img
                      src="/assets/images/wf_digital_assets_1791404733724.jpg"
                      alt="Glowing 3D digital assets globe network"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-stone-900 text-base">
                      Understanding digital assets
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      Wells Fargo Investment Institute provides an overview of what digital assets are and their importance to the digital future.
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => setActiveModal('digital-assets')}
                    className="border border-stone-800 text-stone-900 hover:bg-stone-50 px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* =========================================================================
            PRIVATE WEALTH SUBTAB VIEW
           ========================================================================= */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-200">
          <div className="bg-[#29235c] text-white rounded-2xl p-8 sm:p-12 mb-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
            <div className="space-y-4 max-w-xl">
              <span className="text-[#ffcc00] font-semibold text-xs tracking-wider uppercase">
                Exclusive Service for High-Net-Worth Individuals & Families
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
                Wells Fargo Private Wealth Management
              </h2>
              <p className="text-stone-200 text-sm leading-relaxed">
                Tailored solutions for individuals, business owners, and multi-generational families with $2.5 million or more in investable assets.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveModal('private-wealth-inquiry')}
                  className="bg-[#ffcc00] text-stone-900 hover:bg-amber-300 px-6 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Request a Private Wealth Consultation
                </button>
                <button
                  onClick={() => setSubTab('investing')}
                  className="border border-white/40 text-white hover:bg-white/10 px-5 py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  Return to Investing Overview
                </button>
              </div>
            </div>
            <div className="w-full md:w-80 rounded-xl overflow-hidden shadow-xl border border-white/20">
              <img
                src="/assets/images/wf_private_wealth_jet_1791404685504.jpg"
                alt="Private Wealth Jet Service"
                className="w-full h-56 object-cover"
              />
            </div>
          </div>

          {/* Pillars of Private Wealth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border border-stone-200 rounded-xl p-6 bg-stone-50">
              <Shield className="w-8 h-8 text-[#9e7036] mb-3" />
              <h3 className="font-serif text-lg font-normal text-stone-900 mb-2">
                Custom Portfolio Construction
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Direct access to institutional asset managers, specialized fixed income solutions, private equity, and tax-loss harvesting strategies.
              </p>
            </div>
            <div className="border border-stone-200 rounded-xl p-6 bg-stone-50">
              <FileText className="w-8 h-8 text-[#9e7036] mb-3" />
              <h3 className="font-serif text-lg font-normal text-stone-900 mb-2">
                Trust & Estate Administration
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Comprehensive estate planning, dynastic revocable/irrevocable trusts, philanthropic endowments, and family governance guidance.
              </p>
            </div>
            <div className="border border-stone-200 rounded-xl p-6 bg-stone-50">
              <Briefcase className="w-8 h-8 text-[#9e7036] mb-3" />
              <h3 className="font-serif text-lg font-normal text-stone-900 mb-2">
                Customized Credit & Liquidity
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Specialized lending facilities, securities-backed lines of credit, luxury yacht and aircraft financing, and commercial real estate syndication.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          IMPORTANT DISCLOSURES & FOOTNOTES matching Screenshot 4
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full border-t border-stone-200">
        {/* Prominent Heavy Black-Bordered Box */}
        <div className="border-2 border-black p-5 sm:p-6 bg-white my-6 text-stone-900">
          <h3 className="font-bold text-sm sm:text-base mb-3 text-stone-900">
            Investment and Insurance Products are:
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm font-bold text-stone-900 list-disc list-inside">
            <li>Not Insured by the FDIC or Any Federal Government Agency</li>
            <li>Not a Deposit or Other Obligation of, or Guaranteed by, the Bank or Any Bank Affiliate</li>
            <li>Subject to Investment Risks, Including Possible Loss of the Principal Amount Invested</li>
          </ul>
        </div>

        {/* Detailed Numbered Footnotes & Regulatory Disclosures matching Screenshot 4 */}
        <div className="space-y-4 text-[11px] sm:text-xs text-stone-600 leading-relaxed font-sans pt-2">
          <p>
            <strong>1.</strong> $0 per trade is applicable to commissions for online and automated telephone trading of stocks and exchange-traded funds (ETFs). For stock and ETF trades placed with an agent over the telephone, a $25 agent-assisted trading fee is charged. Each trade order will be treated as a separate transaction subject to commission. An order that executes over multiple trading days may be subject to additional commission. One commission will be assessed for multiple trades, entered separately, that execute on the same day, on the same side of the market. Other fees and commissions apply to a WellsTrade account. For complete information on fees and commissions, refer to the{' '}
            <button
              onClick={() => setActiveModal('wellstrade-fee-schedule')}
              className="text-[#2b2468] underline hover:text-[#1f194d] cursor-pointer"
            >
              WellsTrade Account Commissions and Fees Schedule
            </button>
            . Schedule subject to change at any time.
          </p>

          <p>
            <strong>2.</strong> J.D. Power's 2025 U.S. Wealth Management Digital Experience Study (announced November 2025) is a benchmarking study of large U.S. wealth management firms assessing investor digital experiences across websites and mobile apps. Data was collected June–August 2025 from investors who identified Wells Fargo Advisors as their primary wealth management firm, had interacted with the firm's website or mobile app in the past year, and reported either an advised or DIY relationship. Results were weighted by market share, panel source mix, and evaluated channel to support comparability across firms. A minimum number of 100 surveys total and at least 30 surveys for each channel are required to be included. Survey included feedback on 4 main categories: Design, System, Information, and Tools/Capabilities. Study is independently conducted, and the participating firms do not pay to participate; however, use of award and promotional materials is subject to a license fee.
          </p>

          <p>
            <strong>3.</strong> Availability may be affected by your mobile carrier's coverage area. Your mobile carrier's message and data rates may apply.
          </p>

          <p>
            Investment products and services are offered through Wells Fargo Advisors. Wells Fargo Advisors is a trade name used by Wells Fargo Clearing Services, LLC (WFCS) and Wells Fargo Advisors Financial Network, LLC, Members{' '}
            <button
              onClick={() => setActiveModal('sipc-info')}
              className="text-[#2b2468] underline hover:text-[#1f194d] cursor-pointer"
            >
              SIPC
            </button>
            , separate registered broker-dealers and non-bank affiliates of Wells Fargo & Company.
          </p>

          <p>
            Wells Fargo Investment Institute, Inc., (WFII) is a registered investment adviser and wholly owned subsidiary of Wells Fargo Bank, N.A., a bank affiliate of Wells Fargo & Company.
          </p>

          <p>
            WellsTrade<sup>®</sup> and Intuitive Investor<sup>®</sup> accounts are offered through WFCS.
          </p>

          <p>
            Private Wealth is an exclusive and personalized service and product offering for qualifying clients of Wealth & Investment Management (WIM). WIM offers financial products and services through bank and brokerage affiliates of Wells Fargo & Company. Bank products and services are available through Wells Fargo Bank, N.A.
          </p>

          <p>
            Wells Fargo Bank, N.A. ("the Bank") offers various banking, advisory, fiduciary and custody products and services, including discretionary portfolio management. Wells Fargo affiliates, including Financial Advisors of Wells Fargo Advisors, may be paid an ongoing or one-time referral fee in relation to clients referred to the Bank. In these instances, the Bank is responsible for the day-to-day management of any referred accounts.
          </p>

          <p>
            Wells Fargo & Company and its affiliates do not provide tax or legal advice. This communication cannot be relied upon to avoid tax penalties. Please consult your tax and legal advisors to determine how this information may apply to your own situation. Whether any planned tax result is realized by you depends on the specific facts of your own situation at the time your tax return is filed.
          </p>

          <p className="text-[10px] text-stone-500 pt-2 border-t border-stone-200">
            Screen images are simulated. Features, functionality, and specifications appearing in those images may change without notice.
          </p>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE MODALS FOR ALL USER CLICKS
         ========================================================================= */}

      {/* Compare Ways to Invest Modal */}
      {activeModal === 'compare' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
                  Compare Ways to Invest with Wells Fargo
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Find the investment strategy that aligns with your goals and experience level.
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 text-xs">
              {/* Option 1 */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Hands-On
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">WellsTrade<sup>®</sup></h4>
                  <p className="text-stone-600 mt-2">
                    For self-directed investors who want direct control over their stocks, ETFs, and options.
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Minimum to open:</span>
                      <span className="font-bold text-stone-900">$0</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">Commissions:</span>
                      <span className="font-bold text-emerald-700">$0 online stock & ETF</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    onOpenAccountForm();
                  }}
                  className="mt-5 w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2 rounded-lg font-semibold text-center transition-colors cursor-pointer"
                >
                  Open WellsTrade
                </button>
              </div>

              {/* Option 2 */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Automated
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">Intuitive Investor<sup>®</sup></h4>
                  <p className="text-stone-600 mt-2">
                    A professionally crafted, digitally managed portfolio rebalanced automatically.
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Minimum to open:</span>
                      <span className="font-bold text-stone-900">$500</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">Advisory fee:</span>
                      <span className="font-bold text-stone-900">0.35% annual advisory</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    onOpenAccountForm();
                  }}
                  className="mt-5 w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2 rounded-lg font-semibold text-center transition-colors cursor-pointer"
                >
                  Start Automated
                </button>
              </div>

              {/* Option 3 */}
              <div className="border-2 border-[#ffcc00] rounded-xl p-4 bg-amber-50/40 flex flex-col justify-between relative">
                <span className="absolute -top-2.5 right-4 bg-[#ffcc00] text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  New
                </span>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Team-Based
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">Solutions Advisors</h4>
                  <p className="text-stone-600 mt-2">
                    Phone and digital guidance from licensed professionals when you need strategic counsel.
                  </p>
                  <div className="mt-4 pt-3 border-t border-amber-200 space-y-2">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Minimum to open:</span>
                      <span className="font-bold text-stone-900">$10,000</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">Advisory fee:</span>
                      <span className="font-bold text-stone-900">Tiered based on assets</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('solutions-advisor')}
                  className="mt-5 w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2 rounded-lg font-semibold text-center transition-colors cursor-pointer"
                >
                  Connect with Team
                </button>
              </div>

              {/* Option 4 */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Dedicated
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">Wells Fargo Advisors</h4>
                  <p className="text-stone-600 mt-2">
                    Work 1-on-1 with a personal financial advisor for comprehensive wealth planning.
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Minimum to open:</span>
                      <span className="font-bold text-stone-900">$25,000+</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">Relationship:</span>
                      <span className="font-bold text-stone-900">Full 1-on-1 fiduciary</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('advisor')}
                  className="mt-5 w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2 rounded-lg font-semibold text-center transition-colors cursor-pointer"
                >
                  Find an Advisor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estate Planning / Start The Conversation Modal */}
      {activeModal === 'estate-planning' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#2b2468] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-stone-900 font-normal">
                    Estate Planning Strategies
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Wells Fargo Advisors Wealth & Trust Consultation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <p className="text-stone-600 leading-relaxed">
                Whether creating a will, establishing a family trust, or safeguarding multi-generational wealth, our advisors help turn your intentions into actionable strategies.
              </p>

              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 text-stone-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Beneficiary designation & asset titling review</span>
                </div>
                <div className="flex items-center gap-2 text-stone-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Trust structuring and fiduciary management</span>
                </div>
                <div className="flex items-center gap-2 text-stone-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tax-efficient gifting & philanthropic giving plans</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveModal(null);
                  }}
                  className="w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2.5 rounded-xl font-semibold transition-colors cursor-pointer text-xs"
                >
                  Schedule Estate Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Report Modal */}
      {activeModal === 'strategy-report' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9e7036]">
                  Wells Fargo Investment Institute
                </span>
                <h3 className="font-serif text-xl text-stone-900 font-normal">
                  Investment Strategy Update
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 text-xs text-stone-700 leading-relaxed">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 font-medium">
                📊 Key Takeaway: Global economic momentum remains resilient, with fixed income yields stabilizing and diversified equities offering favorable risk-adjusted entries.
              </div>
              <p>
                <strong>Macro Outlook:</strong> Central bank policies continue toward neutral interest rate targets, benefiting short-to-intermediate duration municipal and corporate debt.
              </p>
              <p>
                <strong>Asset Allocation Guidance:</strong> Maintaining overweight allocations in quality dividend-growing equities and defensive sectors while rebalancing cash reserves.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2 rounded-xl font-semibold transition-colors cursor-pointer text-xs"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Charts Modal */}
      {activeModal === 'market-charts' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-xl text-stone-900 font-normal">
                Curated Market Charts & Indicators
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4 text-xs">
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-900">S&P 500 Index</span>
                  <span className="text-emerald-700 font-semibold">+14.2% YTD</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[78%]" />
                </div>
              </div>
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-900">10-Year U.S. Treasury Yield</span>
                  <span className="text-stone-800 font-semibold">4.12%</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2b2468] h-full w-[60%]" />
                </div>
              </div>
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-900">Headline CPI Inflation</span>
                  <span className="text-blue-700 font-semibold">2.4% YoY</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[45%]" />
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white py-2 rounded-xl font-semibold transition-colors cursor-pointer text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retirement Strategies Modal */}
      {activeModal === 'retirement' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-xl text-stone-900 font-normal">
                Wells Fargo Retirement Center
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3.5 text-xs text-stone-700">
              <p>
                From Traditional and Roth IRAs to 401(k) rollover strategies and required minimum distribution (RMD) modeling, our retirement specialists build tax-advantaged income solutions.
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between">
                  <span>IRA Contribution Limit (2026):</span>
                  <span className="font-bold text-stone-900">$7,000 ($8,000 if 50+)</span>
                </div>
                <div className="flex justify-between">
                  <span>Catch-up provisions:</span>
                  <span className="font-bold text-stone-900">Enhanced under SECURE 2.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Rollover consultation:</span>
                  <span className="font-bold text-emerald-700">$0 complimentary review</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2.5 rounded-xl font-semibold transition-colors cursor-pointer text-xs"
              >
                Close Retirement Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advisor Consultation Modal */}
      {(activeModal === 'advisor' || activeModal === 'solutions-advisor') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-xl text-stone-900 font-normal">
                {activeModal === 'advisor' ? 'Connect with a Wells Fargo Advisor' : 'Solutions Financial Advisor Team'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-stone-700">
              <p>
                Our licensed wealth advisors provide personalized advice tailored to your financial life goals, family milestones, and retirement timeline.
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <p><strong>Direct Line:</strong> 1-866-224-5708</p>
                <p><strong>Hours:</strong> Mon–Fri, 8:00 a.m. – 8:30 p.m. ET</p>
                <p><strong>Advisory Center:</strong> Available nationwide across Wells Fargo branch offices</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2.5 rounded-xl font-semibold transition-colors cursor-pointer text-xs mt-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intuitive Investor & WellsTrade Info Modal */}
      {(activeModal === 'wellstrade' || activeModal === 'automated-investing') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-xl text-stone-900 font-normal">
                {activeModal === 'wellstrade' ? 'WellsTrade® Self-Directed Investing' : 'Intuitive Investor® Automated Portfolios'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-stone-700">
              <p>
                {activeModal === 'wellstrade'
                  ? 'Trade online stocks, ETFs, and options with $0 commission. Seamlessly manage your banking and investments with a single sign-on.'
                  : 'Start investing for just $500. A professionally designed robo-portfolio aligned with your risk tolerance, automatic dividend reinvesting, and tax management.'}
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                <p>✓ Instant account funding from your Wells Fargo Everyday Checking</p>
                <p>✓ Award-winning Wells Fargo Mobile® app integration</p>
                <p>✓ Dedicated client service desk available 24/7</p>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenAccountForm();
                }}
                className="w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2.5 rounded-xl font-semibold transition-colors cursor-pointer text-xs mt-2"
              >
                Open Investment Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Store / Google Play Download Modal */}
      {activeModal === 'app-download' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
              Wells Fargo Mobile<sup>®</sup> App
            </h3>
            <p className="text-xs text-stone-600 mb-5">
              Scan or open your device store to download the #1 ranked Wealth Management digital experience app.
            </p>
            <div className="w-36 h-36 mx-auto bg-stone-100 rounded-xl flex items-center justify-center border border-stone-200 mb-5">
              <Smartphone className="w-12 h-12 text-[#d71e28]" />
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-stone-900 hover:bg-black text-white py-2 rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cash Flow Planning Modal */}
      {activeModal === 'cash-flow-planning' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-xl text-stone-900 font-normal">
                Cash Flow Planning Insights
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3.5 text-xs text-stone-700">
              <p>
                Managing cash flow is the foundation of long-term wealth creation. Our financial planning tools help forecast liquidity needs across your personal and business activities.
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <p><strong>1. Maintain 3–6 months liquidity buffer</strong> in high-yield reserves.</p>
                <p><strong>2. Align asset duration</strong> with upcoming capital expenditures.</p>
                <p><strong>3. Automate recurring transfers</strong> to dollar-cost average into index funds.</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2.5 rounded-xl font-semibold transition-colors cursor-pointer text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Assets Overview Modal */}
      {activeModal === 'digital-assets' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-xl text-stone-900 font-normal">
                Understanding Digital Assets
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3.5 text-xs text-stone-700">
              <p>
                Wells Fargo Investment Institute evaluates the macro implications of distributed ledger technologies, tokenized assets, and regulated spot ETFs for institutional and retail portfolios.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <strong>Important Note:</strong> Digital assets are highly speculative, volatile, and lack standard FDIC or SIPC protections applicable to traditional cash balances.
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-[#2b2468] hover:bg-[#1f194d] text-white py-2.5 rounded-xl font-semibold transition-colors cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WellsTrade Fee Schedule Modal */}
      {activeModal === 'wellstrade-fee-schedule' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-xl text-stone-900 font-normal">
                WellsTrade® Fee Schedule
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-stone-700">
              <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 space-y-2">
                <div className="flex justify-between">
                  <span>Online stock and ETF trades:</span>
                  <span className="font-bold text-emerald-700">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Options online contract fee:</span>
                  <span className="font-bold text-stone-900">$0.65 / contract</span>
                </div>
                <div className="flex justify-between">
                  <span>Agent-assisted telephone trade:</span>
                  <span className="font-bold text-stone-900">$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual account fee:</span>
                  <span className="font-bold text-emerald-700">$0.00</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-stone-900 hover:bg-black text-white py-2 rounded-xl font-semibold text-xs mt-2"
              >
                Close Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIPC Info Modal */}
      {activeModal === 'sipc-info' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                SIPC Coverage Information
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-xs text-stone-600 space-y-3">
              <p>
                Wells Fargo Clearing Services, LLC and Wells Fargo Advisors Financial Network, LLC are members of the Securities Investor Protection Corporation (SIPC).
              </p>
              <p>
                SIPC protects securities customers of its members up to $500,000 (including $250,000 for claims for cash). Explanatory brochure available upon request or at sipc.org. SIPC does not protect against investment market losses.
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-stone-900 hover:bg-black text-white py-2 rounded-xl text-xs font-semibold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
