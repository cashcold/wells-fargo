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
  Award,
  Video,
} from 'lucide-react';

interface CorporateInvestmentBankingViewProps {
  onOpenSignOn: () => void;
  onOpenAccountForm: () => void;
  isLoggedIn: boolean;
  userName: string;
}

export const CorporateInvestmentBankingView: React.FC<CorporateInvestmentBankingViewProps> = ({
  onOpenSignOn,
  onOpenAccountForm,
  isLoggedIn,
  userName,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('Investment Banking');
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
            'Investment Banking',
            'Global Markets',
            'Commercial Real Estate',
            'Lending',
            'Global Payments & Liquidity',
            'Our Approach',
            'Economics & Insights',
          ].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveSubTab(item);
                const targetId = item === 'Economics & Insights' ? 'cib-perspectives' : 'cib-solutions';
                const el = document.getElementById(targetId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
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
            src="/assets/images/wf_cib_hero_atrium_1791411858434.jpg"
            alt="Corporate executives walking together through modern sunlit glass atrium"
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

          {/* Center/Right Column: Hero Copy & Client Testimonial Button matching Screenshot 1 */}
          <div className="lg:col-span-8 space-y-6 max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-stone-900 font-normal leading-[1.18] tracking-tight">
              People you trust and<br />respect, with the strategic<br />solutions and financial<br />strength to help power<br />your business
            </h1>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal('client-voices')}
                className="border border-stone-900 hover:bg-stone-50 bg-white/90 text-stone-900 px-6 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Hear what our clients are saying
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EXPLORE RECENT PERSPECTIVES AND INSIGHTS matching Screenshot 1, 2, 3
         ========================================================================= */}
      <div id="cib-perspectives" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        {/* Centered Yellow Accent Line */}
        <div className="w-12 h-[2px] bg-[#ffcc00] mx-auto mb-4" />

        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 text-center font-normal mb-3">
          Explore recent perspectives and insights
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
          Explore how our team elevates industry solutions and enhances client experiences to drive growth and achievement across sectors.
        </p>

        {/* 8 Perspective Cards in 2 Rows matching Screenshot 2 & 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Card 1: Client Success Stories */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_executives_skyline_1791411880367.jpg"
                  alt="Boardroom executives looking out over metropolitan skyline"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-stone-900 text-sm mb-1">
                  Client Success Stories
                </h3>
                <span className="text-[11px] font-semibold text-stone-500 block mb-2">
                  The Next Horizon series
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  From differentiated solutions to strategic guidance, Wells Fargo helps clients pursue their ambitions. Discover how leading companies rely on our long-standing partnership and expertise to help power growth and create what's next.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('next-horizon-video')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Watch the videos</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Deal Feature: Schroders Sale to Nuveen */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              {/* Logo Banner */}
              <div className="h-44 bg-stone-50 border-b border-stone-200 flex flex-col items-center justify-center p-4 text-center">
                <span className="font-serif text-2xl font-bold text-[#0c2340] tracking-tight">
                  Schroders
                </span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest my-1">
                  sale to
                </span>
                <span className="font-serif text-xl font-bold text-[#002f6c] tracking-tight">
                  nuveen
                </span>
                <span className="text-[9px] text-stone-400">A TIAA Company</span>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Deal Feature
                </span>
                <h3 className="font-bold text-stone-900 text-sm mb-1">
                  Schroders Sale to Nuveen
                </h3>
                <span className="text-xs font-bold text-stone-900 block mb-2">
                  ~£9.9 billion
                </span>
                <p className="text-xs text-stone-600 leading-relaxed mb-1">
                  Wells Fargo to serve as the Lead Financial Advisor to Schroders
                </p>
                <span className="text-[11px] text-stone-500 block">
                  February 2026
                </span>
              </div>
            </div>
            <div className="p-5 pt-0 flex justify-between items-center text-xs font-semibold text-[#2b2468]">
              <button
                onClick={() => setActiveModal('deal-schroders')}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveModal('all-deals')}
                className="hover:underline cursor-pointer"
              >
                See more deals &gt;
              </button>
            </div>
          </div>

          {/* Card 3: Bank of the Year IFR */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              {/* IFR Award Banner */}
              <div className="h-44 bg-[#23204e] text-white flex flex-col items-center justify-center p-4 text-center">
                <span className="font-serif text-lg font-light text-stone-200 mb-2">
                  Bank of the Year
                </span>
                <div className="bg-[#b38f48] text-stone-900 font-extrabold px-3 py-1.5 rounded-sm shadow-md text-xs tracking-wider uppercase">
                  IFR AWARDS 2025
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-stone-900 text-sm leading-snug">
                  International Financing Review names Wells Fargo Corporate and Investment Banking the 2025 Bank of the Year
                </h3>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('ifr-award')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>More information</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Deal Feature: Netflix to acquire Warner Bros */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              {/* Netflix / WB Banner */}
              <div className="h-44 bg-stone-50 border-b border-stone-200 flex flex-col items-center justify-center p-4 text-center">
                <span className="font-sans text-2xl font-black text-[#e50914] tracking-tight">
                  NETFLIX
                </span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest my-1">
                  to acquire
                </span>
                <div className="w-8 h-8 rounded-full bg-[#004785] text-[#ffcc00] flex items-center justify-center font-serif font-black text-xs border border-[#ffcc00]">
                  WB
                </div>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Deal Feature
                </span>
                <span className="text-[11px] font-semibold text-stone-500 block">
                  Mergers & Acquisitions
                </span>
                <h3 className="font-bold text-stone-900 text-sm mb-1">
                  Netflix to acquire Warner Bros.
                </h3>
                <span className="text-xs font-bold text-stone-900 block mb-2">
                  $82.7 billion
                </span>
                <p className="text-xs text-stone-600 leading-relaxed mb-1">
                  Wells Fargo acted as Left Lead Arranger and Financial Advisor to Netflix
                </p>
                <span className="text-[11px] text-stone-500 block">
                  December 2025
                </span>
              </div>
            </div>
            <div className="p-5 pt-0 space-y-1.5 text-xs font-semibold text-[#2b2468]">
              <div>
                <button
                  onClick={() => setActiveModal('deal-netflix')}
                  className="hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read press release</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <button
                  onClick={() => setActiveModal('deal-netflix-pdf')}
                  className="hover:underline cursor-pointer"
                >
                  Bloomberg commentary (PDF) &gt;
                </button>
                <button
                  onClick={() => setActiveModal('all-deals')}
                  className="hover:underline cursor-pointer"
                >
                  See more deals &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: 4 Perspective Cards matching Screenshot 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 5: CIB's growth featured in WSJ */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_speaker_podium_1791411898871.jpg"
                  alt="Senior executive speaking into podium microphone at Wall Street conference"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-stone-900 text-sm leading-snug">
                  CIB's growth featured in The Wall Street Journal
                </h3>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('wsj-story')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read the story</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 6: Record M&A Volume */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 bg-[#23204e] text-white flex flex-col items-center justify-center p-4 text-center">
                <span className="font-serif text-2xl font-bold tracking-tight">
                  M&A
                </span>
                <span className="font-serif text-xl tracking-tight text-stone-200">
                  Market Pulse
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-stone-900 text-sm mb-2 leading-snug">
                  Record M&A Volume Driven By Mega-Deals
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  M&A activity in 2Q 2026 and 1H 2026 reached record levels driven by a significant increase in transactions valued at over $10 billion. The overall dealmaking environment remains highly constructive across industries.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('ma-pulse-pdf')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read more (PDF)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 7: Charlie Scharf featured in Fortune */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_charlie_scharf_1791411919139.jpg"
                  alt="Charlie Scharf CEO corporate portrait smiling in navy suit"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-stone-900 text-sm mb-2 leading-snug">
                  Charlie Scharf featured in Fortune
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Our CEO talks about Wells Fargo's comeback. See how CIB is playing a critical role
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('fortune-story')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read the story</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 8: The Future of Financing AI */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_ai_roundtable_1791411938685.jpg"
                  alt="Roundtable executive discussion on financing artificial intelligence infrastructure"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-stone-900 text-sm mb-2 leading-snug">
                  The Future of Financing AI
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The AI boom brings both opportunities and challenges across the ecosystem. What's the path ahead, and how can companies and investors meet the moment?
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('ai-financing-video')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Watch Video</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SOLUTIONS CUSTOMIZED FOR YOUR BUSINESS matching Screenshot 3, 4, 5
         ========================================================================= */}
      <div id="cib-solutions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full border-t border-stone-200">
        {/* Centered Yellow Accent Line */}
        <div className="w-12 h-[2px] bg-[#ffcc00] mx-auto mb-4" />

        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 text-center font-normal mb-3">
          Solutions customized for your business
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
          Leverage our deep industry expertise, powerful financial support, and comprehensive solutions for corporate and investment banking
        </p>

        {/* 6 Solution Cards in 3x2 Grid with Yellow Stripe */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Solution 1: Investment Banking */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_two_execs_walking_1791411957129.jpg"
                  alt="Two investment banking executives walking past modern glass skyscraper"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Investment Banking
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Utilize the depth and breadth of our experience to help optimize your strategy to move forward confidently
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => setActiveModal('sol-investment-banking')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Solution 2: Global Markets */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_trio_stairs_1791411974360.jpg"
                  alt="Trio of financial executives walking down modern outdoor corporate stone stairs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Global Markets
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Access our personalized services, execution, and insightful market analytics and advisory
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => setActiveModal('sol-global-markets')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Solution 3: Commercial Real Estate */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_cre_lounge_1791411989247.jpg"
                  alt="Two commercial real estate executives conversing in high-rise corner lounge"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Commercial Real Estate
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Access to financing, banking, and advisory solutions for investors and developers
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => setActiveModal('sol-cre')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Solution 4: Lending */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_lending_crane_1791412011602.jpg"
                  alt="Corporate lending executive and engineer discussing development overlooking construction crane"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Lending
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Take advantage of customized solutions to increase value and mitigate risk
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => setActiveModal('sol-lending')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Solution 5: Global Payments & Liquidity */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_tech_laptop_1791412029760.jpg"
                  alt="Two corporate treasury executives working collaboratively at laptop screen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Global Payments & Liquidity
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Treasury management solutions to help optimize cash flow and liquidity and mitigate financial risk for your business
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => setActiveModal('sol-payments')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Solution 6: Our Approach */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_board_review_1791412046842.jpg"
                  alt="Three corporate finance professionals reviewing financial reports around sleek white table"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-6">
                <h3 className="font-bold text-stone-900 text-base mb-2">
                  Our Approach
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Experience the Wells Fargo difference: industry expertise, customized solutions, execution, and access to global services
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => setActiveModal('sol-approach')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BE A PART OF WHAT'S NEXT matching Screenshot 6 & 7
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full border-t border-stone-200">
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 text-center font-normal mb-3">
          Be a part of what's next
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
          Our greatest asset is our people. Join our team in unlocking economic growth and human potential across industries and within our communities.
        </p>

        {/* 4 People & Leadership Cards with Yellow Accent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* People 1: Leadership Perspective - Charlotte Weir */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_charlotte_weir_1791412062192.jpg"
                  alt="Charlotte Weir Head of Corporate Banking EMEA executive portrait in red blouse"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-5">
                <h3 className="font-bold text-stone-900 text-sm mb-1">
                  Leadership Perspective
                </h3>
                <span className="text-[11px] font-semibold text-stone-500 block mb-2">
                  Charlotte Weir, Head of Corporate Banking, EMEA
                </span>
                <p className="text-xs text-stone-600 italic leading-relaxed">
                  “Leadership isn't about directing from the sidelines. It's about standing shoulder to shoulder with your team, celebrating success together and, when things don't go to plan, being the first to own it.”
                </p>
              </div>
            </div>
            <div className="p-5 pt-0 space-y-1.5 text-xs font-semibold text-[#2b2468]">
              <div>
                <button
                  onClick={() => setActiveModal('leader-charlotte')}
                  className="hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('all-leaders')}
                  className="hover:underline text-[11px] cursor-pointer"
                >
                  See more inspiring leaders &gt;
                </button>
              </div>
            </div>
          </div>

          {/* People 2: Foreign Exchange team */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_fx_awards_gala_1791412076549.jpg"
                  alt="Wells Fargo FX team in formal evening wear on stage holding trophy award"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-5">
                <h3 className="font-bold text-stone-900 text-sm mb-2 leading-snug">
                  Foreign Exchange team recognized as the 2025 Best Bank in North America by Euromoney
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Since 2021, our FX client base has almost doubled, and we have made substantial investments in both top-tier talent and advanced technology, underscoring our commitment to growth, innovation, and delivering exceptional service to our clients. Read more about the recognition and the strides made over the past few years.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('fx-euromoney')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* People 3: Supporting veterans */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_veteran_soldier_1791412091219.jpg"
                  alt="Smiling Black female military veteran in camouflage uniform"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-5">
                <h3 className="font-bold text-stone-900 text-sm mb-2 leading-snug">
                  A history of supporting veterans
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Wells Fargo has a long history supporting military communities, and our investment bank is no exception at in supporting our clients who have served by providing dedicated coverage and by investing in the success of veteran owned and led businesses.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('veterans-program')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* People 4: Championing your future */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src="/assets/images/wf_cib_wheelchair_lounge_1791412107181.jpg"
                  alt="Colleagues in modern high-rise office lounge talking near panoramic glass windows"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="h-1 bg-[#ffcc00] w-full" />
              <div className="p-5">
                <h3 className="font-bold text-stone-900 text-sm mb-2 leading-snug">
                  Championing your future
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Tune into our Leading Voices podcast{' '}
                  <button
                    onClick={() => setActiveModal('podcast-intern')}
                    className="text-[#2b2468] underline cursor-pointer"
                  >
                    “Intern to leader”
                  </button>{' '}
                  as CIB leaders discuss their journeys and how they have taken the learnings to continue to drive success for the business and forge their own career paths.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveModal('careers-cib')}
                className="text-xs font-semibold text-[#2b2468] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore our careers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          REGULATORY DISCLOSURES & FOOTNOTES matching Screenshot 7
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full border-t border-stone-200">
        <div className="text-[11px] sm:text-xs text-stone-600 leading-relaxed space-y-3 max-w-5xl">
          <p>
            Wells Fargo Corporate & Investment Banking (CIB) and Wells Fargo Securities (WFS) are the trade names used for the corporate banking, capital markets, and investment banking services of Wells Fargo & Company and its subsidiaries, including but not limited to Wells Fargo Securities, LLC, member of{' '}
            <button
              onClick={() => setActiveModal('regulatory-nyse')}
              className="text-[#2b2468] underline cursor-pointer"
            >
              NYSE
            </button>
            ,{' '}
            <button
              onClick={() => setActiveModal('regulatory-finra')}
              className="text-[#2b2468] underline cursor-pointer"
            >
              FINRA
            </button>
            ,{' '}
            <button
              onClick={() => setActiveModal('regulatory-nfa')}
              className="text-[#2b2468] underline cursor-pointer"
            >
              NFA
            </button>
            , and{' '}
            <button
              onClick={() => setActiveModal('regulatory-sipc')}
              className="text-[#2b2468] underline cursor-pointer"
            >
              SIPC
            </button>
            , Wells Fargo Prime Services, LLC, member of FINRA, NFA and SIPC, and Wells Fargo Bank, N.A., member NFA and swap dealer registered with the CFTC and security-based swap dealer registered with the SEC, member FDIC. Wells Fargo Securities, LLC and Wells Fargo Prime Services, LLC, are distinct entities from affiliated banks and thrifts.
          </p>

          <p className="font-mono text-[10px] text-stone-400">
            RO-5919505
          </p>
          <p className="font-mono text-[10px] text-stone-400">
            LRC-0926
          </p>
        </div>

        {/* Bottom Legal Footer Links matching Screenshot 7 */}
        <div className="mt-8 pt-6 border-t border-stone-200 text-[11px] text-stone-600 leading-relaxed flex flex-wrap gap-x-4 gap-y-2">
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

        <div className="text-[11px] text-stone-500 mt-4">
          © 1999 - 2026 Wells Fargo. NMLSR ID 399801
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE MODALS FOR CIB
         ========================================================================= */}

      {/* Vantage Sign-On Modal */}
      {activeModal === 'vantage-login' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d71e28]">
                  CIB Enterprise Portal
                </span>
                <h3 className="font-serif text-xl font-normal text-stone-900">
                  Wells Fargo Vantage<sup>®</sup>
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
                  placeholder="Enter Company Identifier"
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

      {/* Generic Informational & Case Study Modals */}
      {activeModal && activeModal !== 'vantage-login' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d71e28]">
                  Corporate & Investment Banking
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  {activeModal === 'client-voices' && 'Hear What Our Clients Are Saying'}
                  {activeModal === 'next-horizon-video' && 'The Next Horizon: Client Perspectives'}
                  {activeModal === 'deal-schroders' && 'Deal Feature: Schroders Sale to Nuveen (~£9.9B)'}
                  {activeModal === 'ifr-award' && 'IFR 2025 Bank of the Year Citation'}
                  {activeModal === 'deal-netflix' && 'Deal Feature: Netflix $82.7B Acquisition of Warner Bros.'}
                  {activeModal === 'deal-netflix-pdf' && 'Bloomberg Analysis: Netflix Mega-Acquisition'}
                  {activeModal === 'all-deals' && 'CIB Tombstone Deal Registry'}
                  {activeModal === 'wsj-story' && 'Wall Street Journal: CIB Market Share Growth'}
                  {activeModal === 'ma-pulse-pdf' && 'M&A Market Pulse 2026: Mega-Deal Dominance'}
                  {activeModal === 'fortune-story' && 'Fortune: CEO Charlie Scharf on Wells Fargo’s Momentum'}
                  {activeModal === 'ai-financing-video' && 'Executive Panel: The Future of Financing AI'}
                  {activeModal === 'sol-investment-banking' && 'Investment Banking Division Overview'}
                  {activeModal === 'sol-global-markets' && 'Global Markets Institutional Sales & Trading'}
                  {activeModal === 'sol-cre' && 'Commercial Real Estate Syndication & Debt'}
                  {activeModal === 'sol-lending' && 'Corporate Syndicated Lending & Credit Facilities'}
                  {activeModal === 'sol-payments' && 'Global Payments & Multi-Currency Liquidity'}
                  {activeModal === 'sol-approach' && 'The Wells Fargo CIB Approach'}
                  {activeModal === 'leader-charlotte' && 'Charlotte Weir: Leading Corporate Banking EMEA'}
                  {activeModal === 'all-leaders' && 'CIB Executive Leadership Council'}
                  {activeModal === 'fx-euromoney' && 'Euromoney 2025: Best FX Bank in North America'}
                  {activeModal === 'veterans-program' && 'CIB Military Veterans Leadership Program'}
                  {activeModal === 'podcast-intern' && 'Leading Voices Podcast: Intern to Leader'}
                  {activeModal === 'careers-cib' && 'Careers at Corporate & Investment Banking'}
                  {activeModal === 'vantage-forgot' && 'Vantage Security & Password Recovery'}
                  {activeModal === 'about-vantage' && 'Wells Fargo Vantage® Capabilities'}
                  {activeModal === 'fraud-security' && 'Enterprise Cybersecurity & Dual Authorization'}
                  {activeModal === 'privacy-legal' && 'Corporate Banking Regulatory Governance'}
                  {activeModal.startsWith('regulatory-') && 'Regulatory Entity & Membership Disclosures'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-stone-700 leading-relaxed max-h-[75vh] overflow-y-auto pr-1">
              {activeModal === 'deal-netflix' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-950 font-medium">
                    🎬 <strong>Wells Fargo Securities</strong> acted as Left Lead Arranger, Lead Financial Advisor, and Joint Bookrunner for Netflix’s historic $82.7 billion acquisition of Warner Bros.
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-lg border border-stone-200 text-[11px]">
                    <div><span className="text-stone-500">Transaction Value:</span> <strong className="text-stone-900 block">$82.7 Billion</strong></div>
                    <div><span className="text-stone-500">Announced Date:</span> <strong className="text-stone-900 block">December 2025</strong></div>
                    <div><span className="text-stone-500">Lead Role:</span> <strong className="text-stone-900 block">Financial Advisor & Bookrunner</strong></div>
                    <div><span className="text-stone-500">Financing Structure:</span> <strong className="text-stone-900 block">Multi-Tranche Bridge & Notes</strong></div>
                  </div>
                  <p>
                    The multi-tranche syndicated facility included $40 billion in investment-grade term loans, revolving credit commitments, and high-yield bridge financing to support global digital streaming consolidation and studio production capabilities.
                  </p>
                </div>
              )}

              {activeModal === 'deal-netflix-pdf' && (
                <div className="space-y-3">
                  <div className="p-3 bg-stone-100 rounded-lg border border-stone-200">
                    <span className="font-semibold text-stone-900 block">Bloomberg Intelligence Briefing (PDF Summary)</span>
                    <span className="text-stone-500 text-[11px]">Published January 2026 • 12-page transaction analysis</span>
                  </div>
                  <p>
                    Key findings from the institutional research briefing highlight accretive EPS synergies, long-term content library valuation, and Wells Fargo’s innovative debt package structure.
                  </p>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px]">
                    ✓ Full syndicate report available for institutional clients through the Wells Fargo Vantage® research portal.
                  </div>
                </div>
              )}

              {activeModal === 'deal-schroders' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 font-medium">
                    🏛️ Wells Fargo served as Lead Financial Advisor on the ~£9.9 billion sale of Schroders to Nuveen (A TIAA Company).
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-lg border border-stone-200 text-[11px]">
                    <div><span className="text-stone-500">Transaction Value:</span> <strong className="text-stone-900 block">~£9.9 Billion</strong></div>
                    <div><span className="text-stone-500">Effective Date:</span> <strong className="text-stone-900 block">February 2026</strong></div>
                    <div><span className="text-stone-500">Target:</span> <strong className="text-stone-900 block">Schroders plc (London, UK)</strong></div>
                    <div><span className="text-stone-500">Acquirer:</span> <strong className="text-stone-900 block">Nuveen / TIAA (New York, US)</strong></div>
                  </div>
                  <p>
                    This landmark cross-border asset management transaction expands global private credit, real assets, and ESG investment footprints across Europe, North America, and the Asia-Pacific region.
                  </p>
                </div>
              )}

              {activeModal === 'all-deals' && (
                <div className="space-y-3">
                  <span className="font-semibold text-stone-900 block">Recent Notable Tombstone Transactions</span>
                  <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden text-[11px]">
                    {[
                      { deal: 'Netflix / Warner Bros.', val: '$82.7B', role: 'Left Lead Arranger & Financial Advisor', date: 'Dec 2025' },
                      { deal: 'Schroders / Nuveen', val: '£9.9B', role: 'Lead Financial Advisor to Schroders', date: 'Feb 2026' },
                      { deal: 'NextEra Energy Partners', val: '$3.5B', role: 'Joint Bookrunner Green Bond Facility', date: 'Jan 2026' },
                      { deal: 'Brookfield Infrastructure', val: '$4.2B', role: 'Global Coordinator & Syndicated Term Loan', date: 'Nov 2025' },
                      { deal: 'Equinix Data Centers', val: '$5.0B', role: 'Lead Arranger AI Hyperscale Credit Facility', date: 'Jan 2026' },
                    ].map((row, idx) => (
                      <div key={idx} className="p-2.5 bg-white hover:bg-stone-50 flex items-center justify-between">
                        <div>
                          <strong className="text-stone-900 block">{row.deal}</strong>
                          <span className="text-stone-500">{row.role}</span>
                        </div>
                        <div className="text-right">
                          <strong className="text-[#d71e28] block">{row.val}</strong>
                          <span className="text-stone-400 text-[10px]">{row.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'ifr-award' && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#23204e] text-white rounded-xl">
                    <span className="text-[#ffcc00] font-bold text-xs uppercase tracking-wider block">IFR Awards 2025 Winner</span>
                    <h4 className="font-serif text-base font-normal mt-1">Bank of the Year: Wells Fargo Corporate & Investment Banking</h4>
                  </div>
                  <p>
                    International Financing Review praised Wells Fargo’s transformative expansion across debt capital markets, equity underwriting, and large-cap M&A advisory.
                  </p>
                  <p className="italic text-stone-600 bg-stone-50 p-2.5 rounded-lg border-l-2 border-stone-300">
                    “Wells Fargo has demonstrated that strategic patience, investment in world-class banking talent, and fortress balance-sheet execution can reshape the institutional league tables.”
                  </p>
                </div>
              )}

              {activeModal === 'wsj-story' && (
                <div className="space-y-3">
                  <div className="border-b border-stone-200 pb-2">
                    <span className="font-serif text-base font-bold text-stone-900 block">The Wall Street Journal</span>
                    <span className="text-stone-500 text-[10px]">Markets & Dealmaking In-Depth</span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-stone-900">
                    How Wells Fargo's Investment Bank Became Wall Street's Fastest Growing Franchise
                  </h4>
                  <p>
                    Over the last 36 months, Wells Fargo Corporate & Investment Banking added over 120 managing directors from competing global firms, resulting in market share gains in technology, healthcare, and energy transition banking.
                  </p>
                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                    Investment banking fees grew by 42% year-over-year, outperforming industry averages and proving the strength of the firm's integrated corporate lending model.
                  </div>
                </div>
              )}

              {activeModal === 'fortune-story' && (
                <div className="space-y-3">
                  <div className="border-b border-stone-200 pb-2">
                    <span className="font-serif text-base font-bold text-stone-900 block">FORTUNE Magazine</span>
                    <span className="text-stone-500 text-[10px]">Leadership Cover Story</span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-stone-900">
                    Charlie Scharf on Rebuilding Wells Fargo into an Institutional Juggernaut
                  </h4>
                  <p>
                    In an exclusive interview, CEO Charlie Scharf discussed simplifying operations, restoring regulatory standing, and backing CIB with the capital needed to serve Fortune 500 treasurers.
                  </p>
                  <p className="italic text-stone-600 bg-stone-50 p-2.5 rounded-lg border-l-2 border-[#d71e28]">
                    “We are not just offering loans; we are offering strategic ideas, risk solutions, and long-term partnership to the companies powering the world economy.”
                  </p>
                </div>
              )}

              {activeModal === 'ma-pulse-pdf' && (
                <div className="space-y-3">
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 block text-xs">M&A Market Pulse: 2026 Mid-Year Outlook</span>
                    <span className="text-stone-500 text-[11px]">Authored by CIB Global Mergers & Acquisitions Advisory</span>
                  </div>
                  <p>
                    Global transaction volume reached $2.1 trillion in 1H 2026, driven by a sharp rebound in mega-deals exceeding $10 billion across AI infrastructure, pharmaceuticals, and digital media.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-stone-600">
                    <li>Cross-border M&A up 28% year-over-year</li>
                    <li>Private equity sponsor dry-powder deployments accelerating</li>
                    <li>Syndicated leverage loan yields stabilizing at historical medians</li>
                  </ul>
                </div>
              )}

              {activeModal === 'ai-financing-video' && (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 font-medium">
                    ⚡ Financing AI: High-compute data centers, nuclear/clean energy PPAs, and sovereign AI infrastructure demand unprecedented debt syndication.
                  </div>
                  <p>
                    Wells Fargo CIB’s Technology, Media & Telecom (TMT) and Energy Infrastructure groups are structuring specialized green bond facilities and equipment leaseback mechanisms for hyper-scaler expansions.
                  </p>
                  <div className="bg-stone-900 text-white p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-stone-400 text-[10px] block uppercase">Roundtable Recording</span>
                      <strong className="text-xs">The $500B AI Infrastructure Horizon</strong>
                    </div>
                    <span className="text-xs bg-[#d71e28] px-2.5 py-1 rounded font-bold">24:18 min</span>
                  </div>
                </div>
              )}

              {activeModal === 'client-voices' && (
                <div className="space-y-3">
                  <span className="font-semibold text-stone-900 block">What Our Clients Say</span>
                  <div className="space-y-2">
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                      <p className="italic text-stone-700">“Wells Fargo provided flawless underwriting and certainty of execution on our multi-currency debt facility in Europe.”</p>
                      <span className="text-[10px] text-stone-500 font-bold block mt-1">— Chief Financial Officer, Global Logistics Corp</span>
                    </div>
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                      <p className="italic text-stone-700">“Their Vantage liquidity management portal gave our treasury team real-time visibility across 40 bank accounts worldwide.”</p>
                      <span className="text-[10px] text-stone-500 font-bold block mt-1">— Corporate Treasurer, SaaS Enterprise Solutions</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'next-horizon-video' && (
                <div className="space-y-3">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="font-bold text-stone-900 block text-xs">The Next Horizon Series: Episodes 1–6</span>
                    <span className="text-stone-500 text-[11px]">Exclusive executive discussions on growth, digital innovation, and capital strategy</span>
                  </div>
                  <p>
                    Learn how visionary business leaders navigated supply-chain realignment, transitioned to sustainable operations, and secured multi-year liquidity buffers with Wells Fargo’s dedicated industry teams.
                  </p>
                </div>
              )}

              {activeModal === 'leader-charlotte' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/images/wf_cib_charlotte_weir_1791412062192.jpg"
                      alt="Charlotte Weir"
                      className="w-14 h-14 rounded-full object-cover border border-stone-300"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Charlotte Weir</h4>
                      <span className="text-stone-500 text-[11px] block">Head of Corporate Banking, EMEA</span>
                    </div>
                  </div>
                  <p>
                    Leading Wells Fargo’s corporate banking franchise across the UK, Europe, and Middle East, Charlotte brings more than two decades of cross-border lending and capital structuring leadership.
                  </p>
                  <p className="italic text-stone-600 bg-stone-50 p-2.5 rounded-lg border-l-2 border-[#d71e28]">
                    “Our European clients value that Wells Fargo combines deep global reach with the agility and responsiveness of a dedicated local coverage team.”
                  </p>
                </div>
              )}

              {activeModal === 'all-leaders' && (
                <div className="space-y-3">
                  <span className="font-semibold text-stone-900 block">CIB Executive Committee</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-stone-50 border border-stone-200 rounded">
                      <strong className="block text-stone-900">Fernando Rivas</strong>
                      <span className="text-stone-500">Co-CEO, Corporate & Investment Banking</span>
                    </div>
                    <div className="p-2 bg-stone-50 border border-stone-200 rounded">
                      <strong className="block text-stone-900">Walter Dolhare</strong>
                      <span className="text-stone-500">Co-CEO, Corporate & Investment Banking</span>
                    </div>
                    <div className="p-2 bg-stone-50 border border-stone-200 rounded">
                      <strong className="block text-stone-900">Charlotte Weir</strong>
                      <span className="text-stone-500">Head of Corporate Banking, EMEA</span>
                    </div>
                    <div className="p-2 bg-stone-50 border border-stone-200 rounded">
                      <strong className="block text-stone-900">Tim Sloan</strong>
                      <span className="text-stone-500">Head of Global Markets Institutional Sales</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'fx-euromoney' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 font-medium">
                    🏆 Euromoney Foreign Exchange Survey 2025: Wells Fargo named #1 Best FX Bank in North America.
                  </div>
                  <p>
                    With continuous algorithmic price-making in 75+ currencies and seamless integration into client ERP systems via the Vantage FX portal, our trading desk provides superior liquidity and tight execution.
                  </p>
                </div>
              )}

              {activeModal === 'veterans-program' && (
                <div className="space-y-3">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="font-bold text-stone-900 block text-xs">Military Veterans in Banking Initiative</span>
                    <span className="text-stone-500 text-[11px]">Supporting transition from active duty to Wall Street careers</span>
                  </div>
                  <p>
                    Wells Fargo has contributed more than $100M to veteran organizations and maintains a bespoke CIB Veterans Fellowship providing fast-track training, executive mentorship, and financial sponsorship for veteran-owned business enterprises.
                  </p>
                </div>
              )}

              {activeModal === 'podcast-intern' && (
                <div className="space-y-3">
                  <div className="bg-stone-900 text-white p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#ffcc00]">Leading Voices Podcast</span>
                      <span className="text-[10px] text-stone-400">Episode 48</span>
                    </div>
                    <h4 className="font-serif text-sm font-semibold mb-2">Intern to Leader: Navigating Investment Banking</h4>
                    <div className="w-full bg-stone-700 h-1.5 rounded-full overflow-hidden mb-2">
                      <div className="bg-[#d71e28] w-2/5 h-full rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>13:42</span>
                      <span>34:10</span>
                    </div>
                  </div>
                  <p>
                    In this episode, managing directors share how they began their careers as summer analysts and grew to lead multi-billion-dollar syndicates, sharing mentorship strategies for next-generation talent.
                  </p>
                </div>
              )}

              {activeModal === 'careers-cib' && (
                <div className="space-y-3">
                  <span className="font-semibold text-stone-900 block text-xs">Join Our High-Performing Team</span>
                  <p>
                    Wells Fargo Corporate & Investment Banking hires top undergraduate and MBA graduates, as well as seasoned industry practitioners across New York, Charlotte, London, Paris, Tokyo, and Hong Kong.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-stone-50 border border-stone-200 rounded">
                      <strong className="block text-stone-900">Summer Analyst Program</strong>
                      <span className="text-stone-500">10-week immersive internship</span>
                    </div>
                    <div className="p-2.5 bg-stone-50 border border-stone-200 rounded">
                      <strong className="block text-stone-900">Lateral Opportunities</strong>
                      <span className="text-stone-500">VP & Managing Director roles</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal?.startsWith('sol-') && (
                <div className="space-y-3">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="font-bold text-stone-900 block text-xs">
                      {activeModal === 'sol-investment-banking' && 'Investment Banking Division'}
                      {activeModal === 'sol-global-markets' && 'Global Markets Division'}
                      {activeModal === 'sol-cre' && 'Commercial Real Estate Financing'}
                      {activeModal === 'sol-lending' && 'Corporate Syndicated Lending'}
                      {activeModal === 'sol-payments' && 'Global Payments & Treasury Management'}
                      {activeModal === 'sol-approach' && 'Our Client-First Approach'}
                    </span>
                    <span className="text-stone-500 text-[11px]">Tailored solutions for corporations, institutions, and financial sponsors</span>
                  </div>
                  <p>
                    Our multidisciplinary coverage teams combine industry-specific domain insight with deep balance sheet commitment, delivering structuring excellence, rapid transaction turnaround, and global market access.
                  </p>
                </div>
              )}

              {activeModal?.startsWith('vantage-') && (
                <div className="space-y-3">
                  <p>
                    Wells Fargo Vantage® is the next-generation digital corporate banking platform providing commercial treasurers with integrated cash management, foreign exchange execution, trade finance, and credit monitoring in a unified secure interface.
                  </p>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
                    To reset corporate login credentials or request RSA token assistance, contact your dedicated CIB Treasury Relationship Officer or call 1-800-AT-WELLS.
                  </div>
                </div>
              )}

              {activeModal?.startsWith('regulatory-') && (
                <div className="space-y-3">
                  <span className="font-bold text-stone-900 block text-xs">Regulatory Agency Disclosure</span>
                  <p>
                    Wells Fargo Securities, LLC is a registered broker-dealer and investment adviser registered with the U.S. Securities and Exchange Commission (SEC), and is a member of the Financial Industry Regulatory Authority (FINRA), National Futures Association (NFA), and Securities Investor Protection Corporation (SIPC).
                  </p>
                </div>
              )}

              {activeModal === 'fraud-security' && (
                <div className="space-y-3">
                  <span className="font-bold text-stone-900 block text-xs">Enterprise Cybersecurity Protocols</span>
                  <p>
                    Protecting institutional assets with FIDO2 multi-factor biometrics, out-of-band wire verification, AI-driven behavioral anomaly detection, and dedicated 24/7 Security Operations Center monitoring.
                  </p>
                </div>
              )}

              {activeModal === 'privacy-legal' && (
                <div className="space-y-3">
                  <span className="font-bold text-stone-900 block text-xs">Corporate Legal & Privacy Terms</span>
                  <p>
                    Institutional data governed under strict SOC 2 Type II compliance, Gramm-Leach-Bliley Act (GLBA) provisions, and international cross-border data transfer safeguards.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
