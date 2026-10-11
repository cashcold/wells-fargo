import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Landmark,
  PiggyBank,
  CreditCard,
  Home,
  ShieldCheck,
  Smartphone,
  Calendar,
  MapPin,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Check,
  Sparkles,
  FileText,
  CheckCircle2,
  Lock,
  AlertTriangle,
  PhoneCall,
  Info,
} from 'lucide-react';
import { WfLogo } from '../common/WfLogo';
import { FdicDisclaimer } from '../common/FdicDisclaimer';
import { InvestingWealthView } from './InvestingWealthView';
import { BusinessBankingView } from './BusinessBankingView';
import { CommercialBankingView } from './CommercialBankingView';
import { CorporateInvestmentBankingView } from './CorporateInvestmentBankingView';
import { AboutWellsFargoView } from './AboutWellsFargoView';
import { OnlineMobileSecurityModal } from '../common/OnlineMobileSecurityModal';
import { UserProfile } from '../../types/banking';

interface WebPortalViewProps {
  onOpenSignOn: () => void;
  onOpenAccountForm: () => void;
  onOpenFargoInsights: () => void;
  onOpenSignatureCard: () => void;
  onOpenDashboard: () => void;
  onOpenWorkflows?: () => void;
  isLoggedIn: boolean;
  userName: string;
  userData?: UserProfile;
  onUpdateUserData?: (updated: UserProfile) => void;
  justSignedOff?: boolean;
  onDismissSignedOff?: () => void;
}

export const WebPortalView: React.FC<WebPortalViewProps> = ({
  onOpenSignOn,
  onOpenAccountForm,
  onOpenFargoInsights,
  onOpenSignatureCard,
  onOpenDashboard,
  onOpenWorkflows,
  isLoggedIn,
  userName,
  userData,
  onUpdateUserData,
  justSignedOff = false,
  onDismissSignedOff,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('About');
  const [showScamTipsModal, setShowScamTipsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [investingSubTab, setInvestingSubTab] = useState<'investing' | 'wellstrade' | 'treasury' | 'private-wealth'>('investing');

  React.useEffect(() => {
    try {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash.includes('treasury') || path.includes('treasury') || hash.includes('tbill') || path.includes('t-bill')) {
        setActiveCategory('Investing & Wealth');
        setInvestingSubTab('treasury');
      } else if (hash.includes('wellstrade') || path.includes('wellstrade') || hash.includes('brokerage')) {
        setActiveCategory('Investing & Wealth');
        setInvestingSubTab('wellstrade');
      } else if (hash.includes('about') || path.includes('about')) {
        setActiveCategory('About');
      } else if (hash.includes('corporate') || path.includes('corporate') || hash.includes('cib')) {
        setActiveCategory('Corporate');
      } else if (hash.includes('commercial') || path.includes('commercial')) {
        setActiveCategory('Commercial');
      } else if (hash.includes('business') || path.includes('business')) {
        setActiveCategory('Business');
      } else if (hash.includes('investing') || hash.includes('wealth')) {
        setActiveCategory('Investing & Wealth');
      } else if (hash.includes('personal')) {
        setActiveCategory('Personal');
      }
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans">
      {/* Top Notification if User Just Signed Off */}
      {justSignedOff && (
        <div className="bg-[#f0f9ff] border-b border-[#bae6fd] text-stone-800 px-4 py-3 flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block">
                  You have successfully signed off from Wells Fargo Online<sup>®</sup>.
                </span>
                <span className="text-stone-600 text-[11px]">
                  Thank you for banking with us. For your security, please close this browser tab if you are on a public computer.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={onOpenSignOn}
                className="bg-[#d71e28] hover:bg-[#b81620] text-white px-3.5 py-1.5 rounded-full font-semibold text-xs transition-colors shadow-2xs whitespace-nowrap"
              >
                Sign On Again
              </button>
              {onDismissSignedOff && (
                <button
                  onClick={onDismissSignedOff}
                  className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  aria-label="Dismiss notice"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Red Wells Fargo Header matching Screenshot 1 */}
      <header className="bg-[#d71e28] text-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <WfLogo size="md" variant="white" />
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {activeCategory === 'Commercial' || activeCategory === 'Corporate' ? (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-white hover:underline text-xs hidden md:inline-flex items-center cursor-pointer font-medium"
              >
                Customer Service
              </button>
            ) : (
              <>
                {/* ATMs/Locations link matching Screenshot 1 */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="text-white hover:underline text-xs hidden md:inline-flex items-center cursor-pointer font-medium"
                >
                  ATMs/Locations
                </button>

                {/* Help link matching Screenshot 1 */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="text-white hover:underline text-xs hidden md:inline-flex items-center cursor-pointer font-medium"
                >
                  Help
                </button>

                {/* Español link matching Screenshot 1 */}
                <button
                  onClick={() => {}}
                  className="text-white hover:underline text-xs hidden md:inline-flex items-center cursor-pointer font-medium"
                >
                  Español
                </button>
              </>
            )}

            {/* Search Icon matching Screenshot 1 */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-white hover:opacity-80 p-1 cursor-pointer transition-opacity"
              aria-label="Search Wells Fargo"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Sign on Pill Button matching Screenshot 1 */}
            {isLoggedIn ? (
              <button
                onClick={onOpenDashboard}
                className="bg-white hover:bg-stone-100 text-stone-900 px-4 py-1.5 rounded-full text-xs font-bold transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Hi, {userName}
              </button>
            ) : (
              <button
                onClick={onOpenSignOn}
                className="bg-white hover:bg-stone-100 text-stone-900 px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Sign on
              </button>
            )}

            {/* Subtle Hamburger Menu Toggle for Mobile Navigation */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-black/20 hover:bg-black/30 p-1.5 rounded-md text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Primary Category Navigation Bar matching Screenshot 1 */}
      <nav className="bg-white border-b border-stone-200 sticky top-14 sm:top-16 z-30 shadow-2xs">
        <div className="tab-scroll-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 sm:gap-8 text-xs whitespace-nowrap py-1">
          {[
            { id: 'Personal', label: 'Personal' },
            { id: 'Investing & Wealth', label: 'Investing & Wealth Management' },
            { id: 'Business', label: 'Business' },
            { id: 'Commercial', label: 'Commercial Banking' },
            { id: 'Corporate', label: 'Corporate & Investment Banking' },
            { id: 'About', label: 'About Wells Fargo' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`py-2 px-0.5 transition-colors relative cursor-pointer ${
                activeCategory === tab.id
                  ? 'text-stone-900 font-bold'
                  : 'text-stone-600 hover:text-stone-900 font-normal'
              }`}
            >
              <span>{tab.label}</span>
              {activeCategory === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#d71e28] rounded-t-sm" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Slide-out Menu Drawer matching Screenshot_20261003_222908_Chrome.jpg */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-14 sm:top-16 z-30 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Search */}
              <div className="p-4 border-b border-stone-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-stone-300 rounded-sm pl-8 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#d71e28]"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Fast Feature Actions inside Drawer */}
              <div className="bg-stone-50 p-3 border-b border-stone-200 space-y-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="w-full bg-[#d71e28] text-white py-2 px-3 rounded text-xs font-bold flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Landmark className="w-4 h-4" />
                    <span>Go to Web Banking Dashboard</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAccountForm();
                  }}
                  className="w-full bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 py-2 px-3 rounded text-xs font-semibold flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Open Account (Offer Code JA23OU)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSignatureCard();
                  }}
                  className="w-full bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 py-2 px-3 rounded text-xs font-semibold flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#d71e28]" />
                    <span>Signature Card (Substitute Form W-9)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              </div>

              {/* Segmented Category Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 bg-[#ffcc00] p-1 gap-1 text-center font-bold text-xs text-stone-900 border-b border-stone-300">
                {[
                  { id: 'Personal', label: 'Personal' },
                  { id: 'Investing & Wealth', label: 'Investing & Wealth' },
                  { id: 'Business', label: 'Business' },
                  { id: 'Commercial', label: 'Commercial Banking' },
                  { id: 'Corporate', label: 'Corporate & CIB' },
                  { id: 'About', label: 'About Wells Fargo' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`py-2 px-2 rounded transition-colors ${
                      activeCategory === cat.id ? 'bg-white shadow-xs text-stone-900' : 'hover:bg-amber-400/40 text-stone-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Category Links List */}
              <div className="divide-y divide-stone-100 text-xs">
                {[
                  { title: 'Checking Accounts', desc: 'Everyday Checking, Clear Access Banking, Prime Checking' },
                  { title: 'Savings Accounts & CDs', desc: 'Way2Save®, Platinum Savings, CDs' },
                  { title: 'Credit Cards', desc: 'Active Cash®, Reflect®, Autograph®, One Key™ Cards' },
                  { title: 'Home Loans', desc: 'Purchase mortgages, Refinancing, Home equity lines' },
                  { title: 'Personal Loans', desc: 'Consolidate debt, large purchases, home improvements' },
                  { title: 'Auto Loans', desc: 'Apply through authorized Wells Fargo dealerships' },
                  { title: 'Premier Banking', desc: 'Relationship benefits & dedicated advisor support' },
                  { title: 'Education & Student Resources', desc: 'Student loans, budgeting & FICO® score tools' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAccountForm();
                    }}
                    className="p-3.5 hover:bg-stone-50 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-stone-900 group-hover:text-[#d71e28] transition-colors block">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">{item.desc}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#d71e28] transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Bottom Sign On */}
            <div className="p-4 bg-stone-50 border-t border-stone-200">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenSignOn();
                }}
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2 rounded-sm text-xs font-bold transition-colors"
              >
                Sign On to Online Banking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Body View: Conditional on activeCategory */}
      {activeCategory === 'Investing & Wealth' ? (
        <InvestingWealthView
          onOpenSignOn={onOpenSignOn}
          onOpenAccountForm={onOpenAccountForm}
          isLoggedIn={isLoggedIn}
          userName={userName}
          userData={userData}
          onUpdateUserData={onUpdateUserData}
          onTalkToAssistant={onOpenFargoInsights}
          initialSubTab={investingSubTab}
        />
      ) : activeCategory === 'Business' ? (
        <BusinessBankingView
          onOpenSignOn={onOpenSignOn}
          onOpenAccountForm={onOpenAccountForm}
          isLoggedIn={isLoggedIn}
          userName={userName}
        />
      ) : activeCategory === 'Commercial' ? (
        <CommercialBankingView
          onOpenSignOn={onOpenSignOn}
          onOpenAccountForm={onOpenAccountForm}
          isLoggedIn={isLoggedIn}
          userName={userName}
        />
      ) : activeCategory === 'Corporate' ? (
        <CorporateInvestmentBankingView
          onOpenSignOn={onOpenSignOn}
          onOpenAccountForm={onOpenAccountForm}
          isLoggedIn={isLoggedIn}
          userName={userName}
        />
      ) : activeCategory === 'About' ? (
        <AboutWellsFargoView
          onOpenSignOn={onOpenSignOn}
          onOpenAccountForm={onOpenAccountForm}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onNavigateCategory={setActiveCategory}
        />
      ) : (
        <>
          {/* Hero Section matching Screenshot_20261003_222900_Chrome.jpg with High-Res Image */}
          <section className="bg-gradient-to-b from-stone-50 via-white to-stone-50 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-stone-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Bonus Offer Copy */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-block">
                  <span className="text-stone-600 font-semibold text-sm sm:text-base uppercase tracking-wider block">
                    Enjoy
                  </span>
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-light text-[#9b1d64] tracking-tight tabular-nums block font-serif">
                    $325
                  </span>
                  <div className="h-1.5 bg-[#9b1d64] w-28 mt-1 rounded-full" />
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-normal leading-tight">
                  $325 checking bonus on us
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                  New customers: open an eligible Wells Fargo Everyday Checking account with qualifying direct deposits within 90 days. Offer code JA23OU applied.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={onOpenAccountForm}
                    className="border-2 border-stone-800 hover:border-black bg-stone-900 hover:bg-black text-white px-7 py-2.5 rounded-full text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>Get started &gt;&gt;</span>
                  </button>
                  <button
                    onClick={onOpenSignOn}
                    className="border border-stone-300 hover:border-stone-400 bg-white text-stone-800 px-6 py-2.5 rounded-full text-xs font-semibold transition-colors"
                  >
                    Already a customer? Sign on
                  </button>
                </div>
              </div>

              {/* Right Column: High Quality Photography Asset */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200">
                  <img
                    src="/assets/images/wf_hero_checking_1791070369236.jpg"
                    alt="Wells Fargo Online Banking Customer with Coffee"
                    referrerPolicy="no-referrer"
                    className="w-full h-64 sm:h-72 object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs rounded-xl p-3 shadow-md flex items-center justify-between border border-stone-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#d71e28] flex items-center justify-center font-bold text-xs">
                        WF
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Everyday Checking</span>
                        <span className="text-[10px] text-stone-500">Contactless debit • 24/7 fraud monitoring</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#d71e28]">$325 Bonus</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Product Grid Icons matching Screenshot_20261003_222900 */}
            <div className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mt-12 pt-8 border-t border-stone-200 text-center">
              {[
                { label: 'Checking', icon: Landmark, color: 'text-purple-600', action: onOpenAccountForm },
                { label: 'Savings & CDs', icon: PiggyBank, color: 'text-amber-600', action: onOpenAccountForm },
                { label: 'Credit Cards', icon: CreditCard, color: 'text-red-600', action: onOpenAccountForm },
                { label: 'Home Loans', icon: Home, color: 'text-blue-600', action: onOpenAccountForm },
                { label: 'Personal Loans', icon: ShieldCheck, color: 'text-emerald-600', action: onOpenAccountForm },
                {
                  label: 'Investing',
                  icon: Landmark,
                  color: 'text-stone-700',
                  action: () => {
                    setActiveCategory('Investing & Wealth');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  },
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center p-2 rounded-xl hover:bg-white hover:shadow-xs transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 group-hover:bg-red-50 flex items-center justify-center transition-colors">
                    <item.icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <span className="text-[11px] font-medium text-stone-700 group-hover:text-stone-900 mt-2">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

      {/* 4-Card Promo Grid matching Screenshot_20261003_222916_Chrome.jpg with GENERATED IMAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-6 text-center sm:text-left">
          <h2 className="font-serif text-2xl text-stone-900 font-normal">Featured Solutions & Offers</h2>
          <p className="text-xs text-stone-500 mt-1">Explore credit cards, student checking accounts, travel rewards, and savings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: $125 student/clear access with Student Image */}
          <div className="border border-stone-200 rounded-2xl bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src="/assets/images/wf_student_bonus_1791070378807.jpg"
                  alt="Clear Access Banking Student Promo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-purple-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  STUDENT & TEEN BANKING
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-serif text-lg font-normal text-stone-900 group-hover:text-[#d71e28] transition-colors">
                  New customer? Say hello to a $125 bonus
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Open a Clear Access Banking account, great for students & young adults. No overdraft fees, mobile deposit, and contactless Visa debit card included.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={onOpenAccountForm}
                className="text-xs font-semibold text-[#5c35b3] hover:underline flex items-center gap-1"
              >
                <span>See offer details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Find a credit card with Reflect Card Image */}
          <div className="border border-stone-200 rounded-2xl bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src="/assets/images/wf_reflect_card_hero_1791070276541.jpg"
                  alt="Wells Fargo Credit Cards Promo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#d71e28]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  0% INTRO APR
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-serif text-lg font-normal text-stone-900 group-hover:text-[#d71e28] transition-colors">
                  Find a credit card tailored for your goals
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Low intro rate, cash back, rewards and more with up to 21 months of 0% intro APR on purchases and qualifying balance transfers with Wells Fargo Reflect<sup>®</sup>.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={onOpenAccountForm}
                className="text-xs font-semibold text-[#5c35b3] hover:underline flex items-center gap-1"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: OneKeyCash with Family Travel Image */}
          <div className="border border-stone-200 rounded-2xl bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src="/assets/images/wf_family_travel_savings_1791070297838.jpg"
                  alt="OneKeyCash Travel Rewards Promo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-amber-800/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  TRAVEL & REWARDS
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-serif text-lg font-normal text-stone-900 group-hover:text-[#d71e28] transition-colors">
                  Earn $250 in OneKeyCash<sup>®</sup>
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Use rewards towards eligible hotels, flights, and vacation rentals on Expedia<sup>®</sup>, Hotels.com<sup>®</sup>, and Vrbo<sup>®</sup>. Terms apply.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={onOpenAccountForm}
                className="text-xs font-semibold text-[#5c35b3] hover:underline flex items-center gap-1"
              >
                <span>See travel card details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Interest rates today with Sunset Lifestyle Image */}
          <div className="border border-stone-200 rounded-2xl bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src="/assets/images/wf_man_dog_sunset_1791070307161.jpg"
                  alt="High Yield Savings and CDs Rates"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-emerald-800/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  GUARANTEED FIXED APY
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-serif text-lg font-normal text-stone-900 group-hover:text-[#d71e28] transition-colors">
                  Interest rates today
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Competitive CD rates and high-yield Way2Save<sup>®</sup> options. Lock in guaranteed returns from 3 months to 5 years with FDIC insurance peace of mind.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={onOpenAccountForm}
                className="text-xs font-semibold text-[#5c35b3] hover:underline flex items-center gap-1"
              >
                <span>Check CD & Savings rates</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Autograph Card Showcase matching Screenshot_20261003_222920 with Sunset Background Image */}
      <section className="relative overflow-hidden bg-stone-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/wf_autograph_sunset_1791070287983.jpg"
            alt="Wells Fargo Autograph Card Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-black/85 to-amber-950/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-block bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-amber-300/30">
            WELLS FARGO AUTOGRAPH<sup>®</sup>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif">
            20K BONUS POINTS
          </h2>
          <p className="text-xs sm:text-base text-stone-200 max-w-xl mx-auto leading-relaxed">
            Earn 20,000 bonus points after spending $1,000 in purchases in the first 3 months. Plus earn 3X points on dining, travel, gas, transit, popular streaming services & phone plans.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onOpenAccountForm}
              className="bg-white text-stone-950 hover:bg-stone-100 px-7 py-2.5 rounded-full text-xs font-bold transition-colors shadow-lg"
            >
              Apply Now
            </button>
            <button
              onClick={onOpenAccountForm}
              className="border border-white/40 text-white hover:bg-white/10 px-6 py-2.5 rounded-full text-xs font-medium transition-colors"
            >
              Card Benefits & Terms
            </button>
          </div>
        </div>
      </section>

      {/* Scam Prevention & Security Banner with Image */}
      <section className="bg-stone-50 border-y border-stone-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 rounded-xl overflow-hidden shadow-sm border border-stone-200">
            <img
              src="/assets/images/wf_scam_security_1791070400473.jpg"
              alt="Cybersecurity and Scam Awareness"
              referrerPolicy="no-referrer"
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d71e28] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Security & Fraud Education</span>
            </div>
            <h3 className="font-serif text-2xl text-stone-900 font-normal">
              Learn what to do if a scammer calls
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Wells Fargo will never call, text, or email you asking for your password, a one-time access code, or to send money with Zelle<sup>®</sup> to "reverse a fraudulent charge."
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowScamTipsModal(true)}
                className="border-2 border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white px-5 py-2 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Get 5 fraud prevention tips</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowSecurityModal(true)}
                className="bg-[#d71e28] hover:bg-[#b81620] text-white px-5 py-2 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Online & Mobile Security Guarantee</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* "Need help? Ask Fargo" Promo matching Screenshot_20261003_222924_Chrome.jpg */}
      <section className="bg-gradient-to-b from-[#2b2b2b] to-[#1c1c1c] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-purple-900/60 border border-purple-500/30 px-3 py-1 rounded-full text-xs text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI-Powered Financial Insights</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              Need help? Ask Fargo<sup>®</sup>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Fargo gives you valuable insights like a summary of your spending by category, merchant breakdown, credit score alerts, and upcoming bill envelopes across your accounts.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenFargoInsights}
                className="bg-[#d71e28] hover:bg-[#b81620] text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span className="w-4 h-4 rounded-full bg-white text-[#d71e28] flex items-center justify-center font-bold text-[10px]">f</span>
                <span>Launch Fargo Simulator</span>
              </button>
              <button
                onClick={onOpenDashboard}
                className="border border-stone-400 text-stone-200 hover:bg-white/10 px-5 py-2.5 rounded-full text-xs font-semibold transition-colors"
              >
                Go to Web Banking
              </button>
            </div>
          </div>

          {/* Fargo Phone Graphic Preview */}
          <div className="w-60 bg-stone-900 border-4 border-stone-700 rounded-3xl p-3 shadow-2xl text-stone-900 text-center">
            <div className="bg-white rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-6 h-6 rounded bg-[#521375] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  f
                </span>
                <span className="font-bold text-xs">Fargo Insights</span>
              </div>
              <span className="text-[10px] text-stone-500 block">Total Monthly Spending</span>
              <span className="text-xl font-bold tabular-nums text-stone-900 block">$1,725.34</span>
              
              <div className="bg-stone-50 p-2 rounded-lg text-left text-[10px] text-stone-700 space-y-1">
                <div className="flex justify-between">
                  <span>Groceries & Dining</span>
                  <span className="font-bold">$640.20</span>
                </div>
                <div className="flex justify-between">
                  <span>Bills & Utilities</span>
                  <span className="font-bold">$820.00</span>
                </div>
              </div>

              <button
                onClick={onOpenFargoInsights}
                className="text-[11px] font-bold text-[#521375] hover:underline block mx-auto pt-1"
              >
                Open Full Fargo Dialog &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* "Serving our customers and communities" matching Screenshot_20261003_222928_Chrome.jpg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="w-12 h-1 bg-[#ffcc00] mx-auto rounded-full mb-3" />
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
            Serving our customers and communities
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            It doesn't happen with one transaction, in one day on the job, or in one quarter. It's earned relationship by relationship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Community Volunteers */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <img
                src="/assets/images/wf_community_volunteers_1791067235210.jpg"
                alt="Wells Fargo Community Volunteers at Food Market"
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover"
              />
              <div className="p-6 space-y-3">
                <h3 className="font-serif text-xl font-normal text-stone-900">Who we are</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Wells Fargo helps strengthen communities through economic empowerment, financial inclusion, and environmental sustainability across our nationwide branch network.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  setActiveCategory('About');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="border border-stone-800 hover:bg-stone-50 px-5 py-2 rounded-full text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
              >
                About Wells Fargo
              </button>
            </div>
          </div>

          {/* Card 2: Small Business & Community Commitment */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <img
                src="/assets/images/wf_small_business_1791070390692.jpg"
                alt="Small Local Business Owner Supported by Wells Fargo"
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover"
              />
              <div className="p-6 space-y-3">
                <h3 className="font-serif text-xl font-normal text-stone-900">Why we're committed to communities</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  We don't just serve our communities—we are our communities. We're committed to helping local entrepreneurs and neighborhoods thrive with small business grants and first-time homebuyer programs.
                </p>
                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>$420M+ in community development grants distributed</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Down payment assistance for qualifying first-time homebuyers</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={onOpenAccountForm}
                className="border border-stone-800 hover:bg-stone-50 px-5 py-2 rounded-full text-xs font-semibold text-stone-800 transition-colors"
              >
                Wells Fargo Stories
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How can we help section */}
      <section className="border-t border-stone-200 bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-bold text-sm text-stone-900 mb-4">How can we help?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-stone-700">
            <div
              onClick={onOpenAccountForm}
              className="flex items-center gap-2 hover:text-[#d71e28] cursor-pointer bg-white p-3 rounded-lg border border-stone-200"
            >
              <MapPin className="w-4 h-4 text-[#d71e28]" />
              <span>Find an ATM or Branch location ∨</span>
            </div>
            <div
              onClick={onOpenAccountForm}
              className="flex items-center gap-2 hover:text-[#d71e28] cursor-pointer bg-white p-3 rounded-lg border border-stone-200"
            >
              <Calendar className="w-4 h-4 text-[#d71e28]" />
              <span>Make an appointment with a banker</span>
            </div>
            <div
              onClick={() => setShowScamTipsModal(true)}
              className="flex items-center gap-2 hover:text-[#d71e28] cursor-pointer bg-white p-3 rounded-lg border border-stone-200"
            >
              <HelpCircle className="w-4 h-4 text-[#d71e28]" />
              <span>Security & fraud help ∨</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )}

      {/* Official Legal Footer matching Screenshot_20261003_222928 */}
      <footer className="border-t border-stone-300 bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-stone-600">
            <button
              onClick={() => setShowSecurityModal(true)}
              className="hover:underline cursor-pointer inline-flex items-center gap-1 text-[#d71e28] font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Online & Mobile Security</span>
            </button>
            <span className="text-stone-300">|</span>
            <span className="hover:underline cursor-pointer">Privacy, Cookies, Security & Legal</span>
            <span className="text-stone-300">|</span>
            <span className="hover:underline cursor-pointer">Do Not Sell or Share My Personal Information</span>
            <span className="text-stone-300">|</span>
            <span className="hover:underline cursor-pointer">Notice of Data Collection</span>
            <span className="text-stone-300">|</span>
            <span className="hover:underline cursor-pointer">General Terms of Use</span>
            <span className="text-stone-300">|</span>
            <span className="hover:underline cursor-pointer">Online Access Agreement</span>
            <span className="text-stone-300">|</span>
            <span className="hover:underline cursor-pointer">Report Fraud</span>
            <span className="text-stone-300">|</span>
            <span className="hover:underline cursor-pointer">Sitemap</span>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => {
                setActiveCategory('About');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:underline cursor-pointer text-stone-700 font-semibold"
            >
              About Wells Fargo
            </button>
          </div>

          <FdicDisclaimer />
        </div>
      </footer>

      {/* Scam Prevention Tips Modal */}
      {showScamTipsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2 text-[#d71e28] font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>5 Fraud & Scam Prevention Tips</span>
              </div>
              <button
                onClick={() => setShowScamTipsModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block">1. Don't trust Caller ID alone</span>
                <p>Scammers can easily "spoof" numbers so your caller ID displays "Wells Fargo." Hang up and dial the number printed directly on the back of your card.</p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block">2. Never share one-time security codes</span>
                <p>One-time access codes sent via SMS or email are like keys to your account. Wells Fargo employees will never ask you for this code over the phone.</p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block">3. Never send money to "reverse" a transaction</span>
                <p>A legitimate bank will never ask you to transfer funds to yourself or an external account using Zelle or wire transfer to reverse unauthorized charges.</p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block">4. Beware of urgent payment demands or gift cards</span>
                <p>Government agencies or utility companies will never demand payment through prepaid gift cards or cryptocurrency.</p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block">5. Turn on instant card push alerts</span>
                <p>Receive immediate alerts whenever a purchase is made on your debit or credit cards via the Wells Fargo Online dashboard.</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowScamTipsModal(false)}
                className="bg-stone-900 hover:bg-black text-white px-5 py-2 rounded-full text-xs font-semibold"
              >
                Got It, Close
              </button>
            </div>
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
