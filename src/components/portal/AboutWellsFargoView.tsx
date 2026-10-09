import React, { useState } from 'react';
import {
  ChevronRight,
  ExternalLink,
  Shield,
  FileText,
  TrendingUp,
  X,
  Building,
  Check,
  Download,
  Award,
  Users,
  Heart,
  Globe,
  Radio,
  BookOpen,
  Briefcase,
  History,
  HelpCircle,
  Edit3,
  Star,
  Search,
  MapPin,
  Lock,
  PhoneCall,
  Mail,
  CheckCircle2,
  Calendar,
  DollarSign,
  Handshake,
  Cpu,
} from 'lucide-react';

interface AboutWellsFargoViewProps {
  onOpenSignOn: () => void;
  onOpenAccountForm: () => void;
  isLoggedIn: boolean;
  userName: string;
  onNavigateCategory?: (category: string) => void;
}

export const AboutWellsFargoView: React.FC<AboutWellsFargoViewProps> = ({
  onOpenSignOn,
  onOpenAccountForm,
  isLoggedIn,
  userName,
  onNavigateCategory,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('Investor Relations');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackCategory, setFeedbackCategory] = useState<string>('Ease of Navigation');
  const [feedbackComments, setFeedbackComments] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Careers search filter state
  const [jobSearchTerm, setJobSearchTerm] = useState<string>('');
  const [jobLocation, setJobLocation] = useState<string>('All Locations');

  // Newsroom search state
  const [newsFilter, setNewsFilter] = useState<string>('All');

  const subNavItems = [
    { label: 'Investor Relations', modal: 'investor-relations' },
    { label: 'Leadership & Governance', modal: 'leadership-governance' },
    { label: 'Inclusion & Accessibility', modal: 'inclusion-accessibility' },
    { label: 'Careers', modal: 'careers' },
    { label: 'Responsibility & Impact', modal: 'responsibility-impact' },
    { label: 'Newsroom', modal: 'news-releases' },
    { label: 'Our Stories', modal: 'wf-stories' },
  ];

  return (
    <div className="bg-white text-stone-900 flex flex-col font-sans">
      {/* =========================================================================
          SUB-NAVIGATION BAR matching Screenshot 1
         ========================================================================= */}
      <div className="bg-white border-b border-stone-200 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 sm:gap-8 py-2.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          {subNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveSubTab(item.label);
                setActiveModal(item.modal);
              }}
              className={`transition-colors cursor-pointer pb-0.5 ${
                activeSubTab === item.label
                  ? 'text-stone-900 font-bold border-b-2 border-[#d71e28]'
                  : 'text-stone-600 hover:text-stone-900 hover:underline'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PAGE TITLE AND HERO SECTION matching Screenshot 1
         ========================================================================= */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mb-6 tracking-tight">
            About Wells Fargo
          </h1>

          {/* Hero Image Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-xs border border-stone-200">
            <img
              src="/src/assets/images/wf_about_hero_woman_1791568529970.jpg"
              alt="Wells Fargo Team Member Putting People and Communities First"
              className="w-full h-72 sm:h-96 md:h-[440px] lg:h-[500px] object-cover object-[center_20%]"
            />
          </div>

          {/* Floating Card Overlapping Hero Bottom matching Screenshot 1 */}
          <div className="-mt-10 sm:-mt-14 relative z-10 max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg border border-stone-200/90 py-6 sm:py-8 px-6 text-center">
              <div className="w-12 h-1 bg-[#fbbd1a] mx-auto mb-4 rounded-full" />
              <h2 className="font-sans text-2xl sm:text-3xl text-stone-900 font-light tracking-tight">
                Putting people and communities first
              </h2>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3-CARD GRID 1 matching Screenshot 2
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Investor Relations */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-8 flex flex-col justify-between items-center text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-full flex flex-col items-center">
                {/* Custom Icon matching Screenshot 2: Folder, document, pie chart & bars in yellow/orange */}
                <div className="w-32 h-32 rounded-full bg-[#fff8eb] flex items-center justify-center mb-6">
                  <svg
                    className="w-20 h-20"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Folder base */}
                    <path
                      d="M16 28C16 25.7909 17.7909 24 20 24H32L38 29H60C62.2091 29 64 30.7909 64 33V58C64 60.2091 62.2091 62 60 62H20C17.7909 62 16 60.2091 16 58V28Z"
                      fill="#FBBF24"
                    />
                    {/* Folder inner flap */}
                    <path
                      d="M20 32H60C61.6569 32 63 33.3431 63 35V56C63 58.2091 61.2091 60 59 60H21C18.7909 60 17 58.2091 17 56V35C17 33.3431 18.3431 32 20 32Z"
                      fill="#F59E0B"
                    />
                    {/* Pie Chart */}
                    <circle cx="36" cy="46" r="12" fill="#FEE2E2" />
                    <path
                      d="M36 46L36 34C42.6274 34 48 39.3726 48 46H36Z"
                      fill="#EF4444"
                    />
                    <path
                      d="M36 46L44.4853 54.4853C41.2166 57.754 36.313 58.4688 32.2882 56.2625C28.2635 54.0562 26 49.7719 26 45C26 41.5 27.5 38 30 36L36 46Z"
                      fill="#FBBF24"
                    />
                    {/* Vertical bars */}
                    <rect x="52" y="44" width="4" height="14" rx="1" fill="#F87171" />
                    <rect x="58" y="38" width="4" height="20" rx="1" fill="#F43F5E" />
                  </svg>
                </div>

                <h3 className="font-bold text-stone-900 text-lg mb-2">Investor relations</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Providing investors with information about our financial performance
                </p>
              </div>

              <button
                onClick={() => setActiveModal('investor-relations')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-100 rounded-full px-6 py-2 text-xs font-medium transition-colors cursor-pointer"
              >
                Learn more
              </button>
            </div>

            {/* Card 2: Leadership and Governance */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-8 flex flex-col justify-between items-center text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-full flex flex-col items-center">
                {/* Custom Icon matching Screenshot 2: Three team silhouettes with gear cog */}
                <div className="w-32 h-32 rounded-full bg-[#fff4eb] flex items-center justify-center mb-6">
                  <svg
                    className="w-20 h-20"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Team Members */}
                    {/* Left person */}
                    <circle cx="28" cy="30" r="5" fill="#FBBF24" />
                    <path
                      d="M21 44C21 39.5817 24.5817 36 29 36H30C32.2091 36 34 37.7909 34 40V44H21Z"
                      fill="#F59E0B"
                    />
                    {/* Center person */}
                    <circle cx="40" cy="26" r="6" fill="#F87171" />
                    <path
                      d="M32 42C32 37.5817 35.5817 34 40 34C44.4183 34 48 37.5817 48 42V45H32V42Z"
                      fill="#EF4444"
                    />
                    {/* Right person */}
                    <circle cx="52" cy="30" r="5" fill="#FBBF24" />
                    <path
                      d="M46 40C46 37.7909 47.7909 36 50 36H51C55.4183 36 59 39.5817 59 44H46V40Z"
                      fill="#F59E0B"
                    />
                    {/* Gear / Cog Wheel */}
                    <path
                      d="M36 49C36 47.8954 36.8954 47 38 47H42C43.1046 47 44 47.8954 44 49V51.1C44.7 51.4 45.4 51.8 46 52.3L47.7 50.8C48.5 50.1 49.7 50.2 50.4 50.9L51.8 52.3C52.5 53 52.6 54.2 51.9 55L50.4 56.7C50.9 57.3 51.3 58 51.6 58.7H53.7C54.8 58.7 55.7 59.6 55.7 60.7V62.7C55.7 63.8 54.8 64.7 53.7 64.7H51.6C51.3 65.4 50.9 66.1 50.4 66.7L51.9 68.4C52.6 69.2 52.5 70.4 51.8 71.1L50.4 72.5C49.7 73.2 48.5 73.3 47.7 72.6L46 71.1C45.4 71.6 44.7 72 44 72.3V74.4C44 75.5 43.1 76.4 42 76.4H38C36.9 76.4 36 75.5 36 74.4V72.3C35.3 72 34.6 71.6 34 71.1L32.3 72.6C31.5 73.3 30.3 73.2 29.6 72.5L28.2 71.1C27.5 70.4 27.4 69.2 28.1 68.4L29.6 66.7C29.1 66.1 28.7 65.4 28.4 64.7H26.3C25.2 64.7 24.3 63.8 24.3 62.7V60.7C24.3 59.6 25.2 58.7 26.3 58.7H28.4C28.7 58 29.1 57.3 29.6 56.7L28.1 55C27.4 54.2 27.5 53 28.2 52.3L29.6 50.9C30.3 50.2 31.5 50.1 32.3 50.8L34 52.3C34.6 51.8 35.3 51.4 36 51.1V49Z"
                      fill="#F87171"
                    />
                    <circle cx="40" cy="61.7" r="4.5" fill="#FBBF24" />
                  </svg>
                </div>

                <h3 className="font-bold text-stone-900 text-lg mb-2">Leadership and governance</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Earning trust by doing the right thing in the right way for customers, communities, and employees
                </p>
              </div>

              <button
                onClick={() => setActiveModal('leadership-governance')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-100 rounded-full px-6 py-2 text-xs font-medium transition-colors cursor-pointer"
              >
                Learn more
              </button>
            </div>

            {/* Card 3: Inclusion and Accessibility */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-8 flex flex-col justify-between items-center text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-full flex flex-col items-center">
                {/* Custom Icon matching Screenshot 2: Three overlapping translucent circles (Venn Diagram) */}
                <div className="w-32 h-32 rounded-full bg-[#fff1f2] flex items-center justify-center mb-6">
                  <svg
                    className="w-20 h-20"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Top Circle - Coral */}
                    <circle cx="40" cy="30" r="14" fill="#F87171" fillOpacity="0.85" />
                    {/* Bottom Left Circle - Gold */}
                    <circle cx="32" cy="46" r="14" fill="#FBBF24" fillOpacity="0.85" />
                    {/* Bottom Right Circle - Pink/Rose */}
                    <circle cx="48" cy="46" r="14" fill="#FB7185" fillOpacity="0.85" />
                    {/* Central Intersection highlight */}
                    <circle cx="40" cy="41" r="5" fill="#FFFBEB" fillOpacity="0.9" />
                  </svg>
                </div>

                <h3 className="font-bold text-stone-900 text-lg mb-2">Inclusion and accessibility</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Championing inclusion and accessibility in every aspect of our business
                </p>
              </div>

              <button
                onClick={() => setActiveModal('inclusion-accessibility')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-100 rounded-full px-6 py-2 text-xs font-medium transition-colors cursor-pointer"
              >
                Learn more
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CAREERS BANNER: WORK-LIFE BALANCE matching Screenshot 2 & 3
           ========================================================================= */}
        <section className="bg-[#fef8e7] border-y border-amber-200/50 mt-14 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Text & Join Us Button */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-light leading-snug">
                Imagine a rewarding career with great work-life balance
              </h2>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-xl">
                Wherever you may be on your journey, discover your sweet spot at Wells Fargo.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveModal('careers')}
                  className="border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white rounded-full px-7 py-2.5 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  Join us
                </button>
              </div>
            </div>

            {/* Right Column: Illustration of Woman Working at Laptop with Sleeping Dog matching Screenshot 2 & 3 */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative rounded-2xl overflow-hidden shadow-sm max-w-sm sm:max-w-md bg-white border border-amber-200/40">
                <img
                  src="/src/assets/images/wf_about_career_balance_1791568547251.jpg"
                  alt="Wells Fargo Employee Working from Home with Companion Pet"
                  className="w-full h-auto object-cover max-h-80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3-CARD GRID 2 matching Screenshot 3
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 4: Responsibility and Impact */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-8 flex flex-col justify-between items-center text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-full flex flex-col items-center">
                {/* Custom Icon matching Screenshot 3: Hand holding globe in coral tones */}
                <div className="w-32 h-32 rounded-full bg-[#fff4eb] flex items-center justify-center mb-6">
                  <svg
                    className="w-20 h-20"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Globe */}
                    <circle cx="44" cy="34" r="16" fill="#FED7AA" />
                    <path
                      d="M32 30C34 26 39 24 44 24C49 24 53 26 56 30"
                      stroke="#FB923C"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M30 36C33 39 38 41 44 41C50 41 55 39 58 36"
                      stroke="#FB923C"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <ellipse cx="44" cy="34" rx="7" ry="15" stroke="#FB923C" strokeWidth="2.5" />
                    {/* Cupped Hand */}
                    <path
                      d="M22 58C25 54 30 52 35 52C40 52 46 54 52 50C55 48 58 46 62 44C63 43.5 64 45 63 46C60 50 56 53 50 56C46 58 41 60 36 62C30 64 24 62 22 58Z"
                      fill="#F87171"
                    />
                    <path
                      d="M20 54C22 51 26 49 31 50L35 52C32 55 26 58 20 54Z"
                      fill="#EF4444"
                    />
                  </svg>
                </div>

                <h3 className="font-bold text-stone-900 text-lg mb-2">Responsibility and impact</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Focusing on making a positive impact by supporting a sustainable and inclusive future
                </p>
              </div>

              <button
                onClick={() => setActiveModal('responsibility-impact')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-100 rounded-full px-6 py-2 text-xs font-medium transition-colors cursor-pointer"
              >
                Learn more
              </button>
            </div>

            {/* Card 5: News Releases */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-8 flex flex-col justify-between items-center text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-full flex flex-col items-center">
                {/* Custom Icon matching Screenshot 3: Megaphone and newspaper/document */}
                <div className="w-32 h-32 rounded-full bg-[#fff8eb] flex items-center justify-center mb-6">
                  <svg
                    className="w-20 h-20"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Document / Newspaper behind */}
                    <rect
                      x="34"
                      y="20"
                      width="28"
                      height="38"
                      rx="3"
                      fill="#FED7AA"
                    />
                    <circle cx="42" cy="27" r="3" fill="#F97316" />
                    <rect x="48" y="25" width="10" height="3" rx="1.5" fill="#FB923C" />
                    <rect x="40" y="34" width="18" height="2" rx="1" fill="#FDBA74" />
                    <rect x="40" y="39" width="18" height="2" rx="1" fill="#FDBA74" />
                    <rect x="40" y="44" width="14" height="2" rx="1" fill="#FDBA74" />
                    <rect x="40" y="49" width="16" height="2" rx="1" fill="#FDBA74" />
                    {/* Megaphone in front */}
                    <path
                      d="M18 41L30 35V51L18 45V41Z"
                      fill="#F87171"
                    />
                    <path
                      d="M30 35L42 28V58L30 51V35Z"
                      fill="#EF4444"
                    />
                    <ellipse cx="42" cy="43" rx="3" ry="15" fill="#FCA5A5" />
                    <path
                      d="M24 45L22 55H26L28 47"
                      stroke="#DC2626"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Sparkle sound waves */}
                    <path d="M47 34L51 32" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
                    <path d="M48 43H53" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
                    <path d="M47 52L51 54" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                <h3 className="font-bold text-stone-900 text-lg mb-2">News releases</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Keeping you informed with the latest, breaking news from within and around Wells Fargo
                </p>
              </div>

              <button
                onClick={() => setActiveModal('news-releases')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-100 rounded-full px-6 py-2 text-xs font-medium transition-colors cursor-pointer"
              >
                Learn more
              </button>
            </div>

            {/* Card 6: Wells Fargo Stories */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-8 flex flex-col justify-between items-center text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-full flex flex-col items-center">
                {/* Custom Icon matching Screenshot 3: Speech bubble with heart */}
                <div className="w-32 h-32 rounded-full bg-[#fff1f2] flex items-center justify-center mb-6">
                  <svg
                    className="w-20 h-20"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Speech bubble */}
                    <path
                      d="M22 36C22 25.5066 30.5066 17 41 17C51.4934 17 60 25.5066 60 36C60 46.4934 51.4934 55 41 55C37.5 55 34.2 54 31.5 52.3L23 57L25 48.5C23.1 45 22 40.7 22 36Z"
                      fill="#FED7AA"
                    />
                    {/* Heart inside */}
                    <path
                      d="M41 47C41 47 31 40.5 31 33.5C31 29.5 34 26.5 37.5 26.5C39.5 26.5 40.5 27.5 41 28.5C41.5 27.5 42.5 26.5 44.5 26.5C48 26.5 51 29.5 51 33.5C51 40.5 41 47 41 47Z"
                      fill="#EF4444"
                    />
                  </svg>
                </div>

                <h3 className="font-bold text-stone-900 text-lg mb-2">Wells Fargo Stories</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Expert tips, real stories, and customer spotlights to inform businesses, empower communities, and spark ideas.
                </p>
              </div>

              <button
                onClick={() => setActiveModal('wf-stories')}
                className="border border-stone-800 text-stone-900 hover:bg-stone-100 rounded-full px-6 py-2 text-xs font-medium transition-colors cursor-pointer"
              >
                Get inspired
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            HISTORY IN THE MAKING SECTION matching Screenshot 4
           ========================================================================= */}
        <section className="max-w-4xl mx-auto px-4 text-center my-14 sm:my-16">
          <div className="w-12 h-1 bg-[#fbbd1a] mx-auto mb-4 rounded-full" />
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-light mb-4">
            History in the making
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm md:text-base leading-relaxed mb-5 max-w-3xl mx-auto">
            We've helped people go further with their money since our founding by Henry Wells and William Fargo in 1852. With innovative solutions that evolve with the times, we continue to help our customers get ahead.
          </p>
          <button
            onClick={() => setActiveModal('history')}
            className="text-[#3b2a82] hover:text-[#251859] font-medium text-xs sm:text-sm underline cursor-pointer inline-block"
          >
            Explore our history
          </button>
        </section>

        {/* =========================================================================
            3 LOWER RESOURCE CARDS matching Screenshot 4
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Supplier resource center */}
            <div className="bg-[#f9f9f9] border border-stone-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:bg-stone-100/60 transition-colors">
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-2">Supplier resource center</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Get the information you need to do business with Wells Fargo.
                </p>
              </div>
              <button
                onClick={() => setActiveModal('supplier-center')}
                className="text-[#3b2a82] hover:text-[#251859] font-semibold text-xs mt-5 inline-flex items-center gap-1 cursor-pointer text-left"
              >
                <span>Learn more</span>
                <span>&gt;</span>
              </button>
            </div>

            {/* Card 2: Sponsorships */}
            <div className="bg-[#f9f9f9] border border-stone-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:bg-stone-100/60 transition-colors">
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-2">Sponsorships</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Check out how to apply for a Wells Fargo sponsorship.
                </p>
              </div>
              <button
                onClick={() => setActiveModal('sponsorships')}
                className="text-[#3b2a82] hover:text-[#251859] font-semibold text-xs mt-5 inline-flex items-center gap-1 cursor-pointer text-left"
              >
                <span>Learn more</span>
                <span>&gt;</span>
              </button>
            </div>

            {/* Card 3: Teamworks for employees */}
            <div className="bg-[#f9f9f9] border border-stone-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:bg-stone-100/60 transition-colors">
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-2">Teamworks for employees</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Access employee benefits and services privately — anytime, anywhere.
                </p>
              </div>
              <button
                onClick={() => setActiveModal('teamworks')}
                className="text-[#3b2a82] hover:text-[#251859] font-semibold text-xs mt-5 inline-flex items-center gap-1 cursor-pointer text-left"
              >
                <span>Learn more</span>
                <span>&gt;</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FEEDBACK PROMPT & FOOTER DISCLAIMER matching Screenshot 4
           ========================================================================= */}
        <div className="border-t border-stone-200 py-6 text-center text-xs text-stone-600 flex items-center justify-center gap-2">
          <Edit3 className="w-3.5 h-3.5 text-stone-500" />
          <span>How was your experience?</span>
          <button
            onClick={() => {
              setFeedbackSubmitted(false);
              setActiveModal('feedback');
            }}
            className="text-[#3b2a82] hover:underline font-medium cursor-pointer"
          >
            Give us feedback.
          </button>
        </div>

        {/* Regulatory Code and Links matching Screenshot 4 */}
        <div className="border-t border-stone-200 bg-stone-50/50 py-8 px-4 sm:px-6 lg:px-8 text-xs text-stone-600">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="text-[11px] font-mono text-stone-500">
              DT1-09232027-18-8840423-1.1
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-stone-600">
              <span className="hover:underline cursor-pointer">Privacy, Cookies, Security & Legal</span>
              <span className="text-stone-300">|</span>
              <span className="hover:underline cursor-pointer">Do Not Sell or Share My Personal Information</span>
              <span className="text-stone-300">|</span>
              <span className="hover:underline cursor-pointer">Notice of Data Collection</span>
              <span className="text-stone-300">|</span>
              <span className="hover:underline cursor-pointer">General Terms of Use</span>
              <span className="text-stone-300">|</span>
              <span className="hover:underline cursor-pointer">Report Fraud</span>
              <span className="text-stone-300">|</span>
              <span className="hover:underline cursor-pointer">Sitemap</span>
              <span className="text-stone-300">|</span>
              <button
                onClick={() => onNavigateCategory && onNavigateCategory('Personal')}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <span className="text-stone-300">|</span>
              <span className="font-semibold text-stone-900">About Wells Fargo</span>
              <span className="text-stone-300">|</span>
              <button
                onClick={() => setActiveModal('careers')}
                className="hover:underline cursor-pointer"
              >
                Careers
              </button>
              <span className="text-stone-300">|</span>
              <button
                onClick={() => setActiveModal('inclusion-accessibility')}
                className="hover:underline cursor-pointer"
              >
                Inclusion and Accessibility
              </button>
            </div>

            <div className="pt-2 text-stone-500 text-[11px]">
              © 1999 - 2026 Wells Fargo. NMLSR ID 399801
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          INTERACTIVE MODALS FOR ALL ABOUT WELLS FARGO SECTIONS
         ========================================================================= */}

      {/* 1. Investor Relations Modal */}
      {activeModal === 'investor-relations' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">Investor Relations</h3>
                  <p className="text-xs text-red-100">Wells Fargo & Company (NYSE: WFC)</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-stone-800">
              {/* Live stock snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-center">
                <div>
                  <div className="text-xs text-stone-500 uppercase">Stock Price</div>
                  <div className="text-2xl font-bold text-stone-900">$58.42</div>
                  <div className="text-xs text-emerald-600 font-semibold">+1.24 (+2.17%)</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase">Market Cap</div>
                  <div className="text-xl font-bold text-stone-900">$206.5B</div>
                  <div className="text-xs text-stone-500">NYSE: WFC</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase">Dividend Yield</div>
                  <div className="text-xl font-bold text-stone-900">2.74%</div>
                  <div className="text-xs text-stone-500">$0.40 / quarter</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase">P/E Ratio</div>
                  <div className="text-xl font-bold text-stone-900">11.8x</div>
                  <div className="text-xs text-stone-500">TTM</div>
                </div>
              </div>

              {/* Financial reports */}
              <div>
                <h4 className="font-bold text-stone-900 text-base mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#d71e28]" />
                  <span>Latest Financial Disclosures & SEC Filings</span>
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    { title: '2025 Form 10-K Annual Report', date: 'Feb 21, 2026', size: '14.2 MB PDF' },
                    { title: 'Q4 2025 Quarterly Earnings Release & Presentation', date: 'Jan 16, 2026', size: '3.8 MB PDF' },
                    { title: '2026 Notice of Annual Meeting & Proxy Statement', date: 'Mar 12, 2026', size: '5.1 MB PDF' },
                    { title: 'Pillar 3 Regulatory Capital Disclosure', date: 'Feb 15, 2026', size: '2.4 MB PDF' },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-lg border border-stone-200 flex items-center justify-between hover:bg-stone-50"
                    >
                      <div>
                        <div className="font-semibold text-stone-900 text-xs sm:text-sm">{doc.title}</div>
                        <div className="text-[11px] text-stone-500">{doc.date} • {doc.size}</div>
                      </div>
                      <button
                        onClick={() => alert(`Downloading ${doc.title}...`)}
                        className="flex items-center gap-1 text-[#d71e28] hover:underline font-semibold text-xs cursor-pointer ml-2 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investor Contacts */}
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs space-y-1">
                <div className="font-bold text-stone-900">Shareholder Services & Investor Inquiries</div>
                <div className="text-stone-700">Wells Fargo Investor Relations: 1-866-878-5814 | investorrelations@wellsfargo.com</div>
                <div className="text-stone-600">Transfer Agent (Computershare): P.O. Box 43078, Providence, RI 02940</div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Leadership & Governance Modal */}
      {activeModal === 'leadership-governance' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">Leadership and Governance</h3>
                  <p className="text-xs text-red-100">Guiding our culture of accountability & service</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-stone-800">
              <div>
                <h4 className="font-bold text-stone-900 text-base mb-3">Executive Operating Committee</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {[
                    { name: 'Charlie Scharf', role: 'Chief Executive Officer and President', bio: 'Appointed 2019; leading transformation toward customer trust, risk controls, and simplified operations.' },
                    { name: 'Michael Santomassimo', role: 'Chief Financial Officer and Senior EVP', bio: 'Oversees financial management, capital planning, and corporate strategy.' },
                    { name: 'Ather Williams III', role: 'Head of Strategy, Digital Platform & Innovation', bio: 'Drives enterprise digital transformation, mobile app ecosystem, and fintech partnerships.' },
                    { name: 'Saul Van Beurden', role: 'Head of Technology and Senior EVP', bio: 'Directs global cybersecurity, cloud modernization, and software engineering.' },
                    { name: 'Mary Mack', role: 'Senior EVP, Head of Consumer & Small Business Banking', bio: 'Oversees nationwide branch network, digital branch experiences, and retail clients.' },
                    { name: 'Perry Pelos', role: 'Senior EVP, Head of Commercial Banking', bio: 'Leads treasury solutions, middle-market lending, and commercial real estate.' },
                  ].map((exec, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1">
                      <div className="font-bold text-stone-900 text-sm">{exec.name}</div>
                      <div className="text-[#d71e28] font-semibold">{exec.role}</div>
                      <div className="text-stone-600 leading-relaxed pt-1">{exec.bio}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-base mb-3">Corporate Governance Commitments</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900">Independent Board Oversight:</span> Independent Board Chair leadership structure with comprehensive annual committee audits.
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900">Code of Ethics & Business Conduct:</span> Mandatory annual ethics training and zero-retaliation whistleblower hotline for all 230,000+ employees.
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900">Risk & Capital Committee:</span> Rigorous liquidity, credit, and operational risk standards benchmarked by the Federal Reserve and OCC.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Inclusion & Accessibility Modal */}
      {activeModal === 'inclusion-accessibility' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">Inclusion and Accessibility</h3>
                  <p className="text-xs text-red-100">Championing dignity, belonging, and full digital access</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-stone-800">
              <div>
                <h4 className="font-bold text-stone-900 text-base mb-2">Accessible Banking Services</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-stone-900 mb-1">Audio-Assisted ATMs</div>
                    <div className="text-stone-600">All 12,000+ ATMs feature headphone jacks and spoken voice instructions in English and Spanish.</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-stone-900 mb-1">Telecommunications Relay (TTY)</div>
                    <div className="text-stone-600">Dial 711 or call our dedicated TTY line at 1-800-877-4833 for 24/7 deaf or hard-of-hearing service.</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-stone-900 mb-1">Web Accessibility Standards</div>
                    <div className="text-stone-600">Built to WCAG 2.1 Level AA conformance with full keyboard navigation and high-contrast color modes.</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-stone-900 mb-1">Accessible Document Formats</div>
                    <div className="text-stone-600">Request statements in Braille, large print (18pt font), and audio CD formats with zero added fees.</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-base mb-2">Employee Resource Networks (ERNs)</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    'Disability Connection ERN',
                    'Pride ERN (LGBTQ+)',
                    'Veterans Network',
                    'Black & African American Team Member Network',
                    'Hispanic & Latino Network',
                    'Asian & Pacific Islander Network',
                    "Women's Team Member Network",
                    'Generations ERN',
                  ].map((ern, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-800 px-3 py-1.5 rounded-full border border-stone-200 font-medium">
                      {ern}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Careers Modal */}
      {activeModal === 'careers' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">Careers at Wells Fargo</h3>
                  <p className="text-xs text-red-100">Find your sweet spot with great work-life balance</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-stone-800">
              {/* Job search filter */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
                <div className="font-bold text-stone-900 text-sm">Search Open Opportunities</div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                  <div className="sm:col-span-7 relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Title, skill, or keyword (e.g. Software Engineer, Wealth Advisor)"
                      value={jobSearchTerm}
                      onChange={(e) => setJobSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg bg-white"
                    />
                  </div>
                  <div className="sm:col-span-5 relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <select
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg bg-white"
                    >
                      <option value="All Locations">All Locations / Remote</option>
                      <option value="San Francisco, CA">San Francisco, CA</option>
                      <option value="Charlotte, NC">Charlotte, NC</option>
                      <option value="New York, NY">New York, NY</option>
                      <option value="Minneapolis, MN">Minneapolis, MN</option>
                      <option value="Dallas, TX">Dallas, TX</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sample listings */}
              <div>
                <h4 className="font-bold text-stone-900 text-base mb-3">Featured Positions</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { title: 'Senior Full Stack Engineer - Fargo AI & Digital Banking', loc: 'San Francisco, CA / Hybrid', dept: 'Technology', req: 'R-384912' },
                    { title: 'Commercial Banking Relationship Manager', loc: 'Charlotte, NC', dept: 'Commercial Banking', req: 'R-384102' },
                    { title: 'Private Wealth Financial Consultant', loc: 'New York, NY', dept: 'Wealth Management', req: 'R-383774' },
                    { title: 'Cybersecurity Threat Intelligence Lead', loc: 'Dallas, TX / Remote', dept: 'Information Security', req: 'R-384661' },
                    { title: 'Branch Associate Banker', loc: 'Atlanta, GA', dept: 'Consumer Banking', req: 'R-382901' },
                  ].map((job, idx) => (
                    <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between hover:bg-stone-100">
                      <div>
                        <div className="font-bold text-stone-900 text-sm">{job.title}</div>
                        <div className="text-stone-500 text-[11px] mt-0.5">{job.dept} • {job.loc} • Req: {job.req}</div>
                      </div>
                      <button
                        onClick={() => alert(`Application submitted for ${job.title}!`)}
                        className="bg-[#d71e28] hover:bg-[#b0141d] text-white px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer shrink-0 ml-3"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits highlight */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-900 text-xs sm:text-sm mb-2">Why Join Wells Fargo?</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-2 bg-white rounded-lg border border-stone-200">
                    <div className="font-bold text-[#d71e28]">6% 401(k) Match</div>
                    <div className="text-[11px] text-stone-500">Dollar-for-dollar after 1 year</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200">
                    <div className="font-bold text-[#d71e28]">16 Weeks Leave</div>
                    <div className="text-[11px] text-stone-500">Paid parental leave</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200">
                    <div className="font-bold text-[#d71e28]">$5,250 Tuition</div>
                    <div className="text-[11px] text-stone-500">Annual education reimbursement</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200">
                    <div className="font-bold text-[#d71e28]">Wellness & PTO</div>
                    <div className="text-[11px] text-stone-500">Comprehensive health & mental care</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Responsibility & Impact Modal */}
      {activeModal === 'responsibility-impact' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">Responsibility and Impact</h3>
                  <p className="text-xs text-red-100">Supporting sustainable growth and community resilience</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-700">$500B</div>
                  <div className="text-xs font-semibold text-stone-800 mt-1">Sustainable Financing</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">Committed toward clean energy & climate transition by 2030.</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="text-2xl font-bold text-amber-700">$1.6B</div>
                  <div className="text-xs font-semibold text-stone-800 mt-1">Open for Small Business</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">Empowering underrepresented small business owners.</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">100,000+</div>
                  <div className="text-xs font-semibold text-stone-800 mt-1">Affordable Homes</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">Down payment assistance grants across 50 markets.</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-base mb-2">Key Impact Pillars</h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-stone-900">Housing Affordability:</div>
                    <div className="text-stone-600 mt-0.5">Collaborating with local CDFIs to provide up to $10,000 in homebuyer closing grants for low- and moderate-income families.</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-stone-900">Financial Health & Education:</div>
                    <div className="text-stone-600 mt-0.5">Offering free Hands on Banking® financial curriculum reached by over 2.4 million learners annually.</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-stone-900">Environmental Stewardship:</div>
                    <div className="text-stone-600 mt-0.5">Achieved 100% renewable electricity powering our domestic retail and corporate facilities since 2017.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. News Releases Modal */}
      {activeModal === 'news-releases' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Radio className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">Wells Fargo Newsroom</h3>
                  <p className="text-xs text-red-100">Official press releases and corporate announcements</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-stone-800">
              {/* Category tabs */}
              <div className="flex gap-2 overflow-x-auto text-xs pb-1">
                {['All', 'Corporate', 'Community', 'Technology & AI', 'Earnings'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewsFilter(cat)}
                    className={`px-3 py-1 rounded-full border cursor-pointer ${
                      newsFilter === cat
                        ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* News list */}
              <div className="space-y-3 text-xs">
                {[
                  {
                    date: 'Oct 08, 2026',
                    cat: 'Technology & AI',
                    title: 'Wells Fargo Expands Fargo AI Virtual Assistant with Predictive Budgeting and Voice Auth',
                    snippet: 'Over 14 million active digital mobile customers now utilize Fargo for personalized financial insights and immediate balance protection.',
                  },
                  {
                    date: 'Sep 29, 2026',
                    cat: 'Community',
                    title: 'Wells Fargo Foundation Announces $45M Grant Commitment for Clean Energy Small Businesses',
                    snippet: 'Grant funds distributed across 18 regional non-profit lenders to accelerate local solar installations and commercial energy retrofits.',
                  },
                  {
                    date: 'Sep 15, 2026',
                    cat: 'Corporate',
                    title: 'Wells Fargo Board of Directors Declares Quarterly Common Stock Dividend of $0.40 Per Share',
                    snippet: 'Quarterly dividend payable Dec 1, 2026 to stockholders of record at the close of business on Nov 6, 2026.',
                  },
                  {
                    date: 'Aug 22, 2026',
                    cat: 'Corporate',
                    title: 'Wells Fargo Names New Chief Information Security Officer to Accelerate Quantum-Resistant Encryption',
                    snippet: 'Strategic leadership appointment brings deep cloud infrastructure and enterprise cryptography expertise.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200 hover:bg-stone-100 transition-colors">
                    <div className="flex items-center gap-2 text-stone-500 text-[11px] mb-1">
                      <span className="font-medium text-[#d71e28]">{item.cat}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                    <div className="font-bold text-stone-900 text-sm mb-1">{item.title}</div>
                    <div className="text-stone-600 leading-relaxed">{item.snippet}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-stone-100 rounded-lg text-xs text-stone-600 flex items-center justify-between">
                <span>Media Relations Inquiries: media@wellsfargo.com | 1-415-396-3606</span>
                <span className="text-stone-400">Available 24/7 for journalists</span>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Wells Fargo Stories Modal */}
      {activeModal === 'wf-stories' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">Wells Fargo Stories</h3>
                  <p className="text-xs text-red-100">Real customer journeys, local impact, and innovation</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="text-[11px] font-bold text-amber-600 uppercase">Customer Spotlight</div>
                  <div className="font-bold text-stone-900 text-sm">How a Family Bakery in Detroit Expanded to 4 Locations</div>
                  <div className="text-stone-600 leading-relaxed">
                    With an initial $25,000 micro-loan and dedicated treasury advice from their local branch banker, the Garcia family turned a secret sourdough recipe into a regional distribution powerhouse.
                  </div>
                  <div className="text-stone-400 text-[11px]">4 min read • Community Banking</div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-600 uppercase">Sustainability</div>
                  <div className="font-bold text-stone-900 text-sm">Solar Canopies Powering Community Centers in Phoenix</div>
                  <div className="text-stone-600 leading-relaxed">
                    Through Wells Fargo Clean Energy grants, neighborhood recreational centers installed 1.2 megawatts of solar shade structures, reducing municipal electricity bills by 45%.
                  </div>
                  <div className="text-stone-400 text-[11px]">3 min read • Clean Energy</div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="text-[11px] font-bold text-purple-600 uppercase">Employee Voice</div>
                  <div className="font-bold text-stone-900 text-sm">Mentoring First-Generation College Students in STEM</div>
                  <div className="text-stone-600 leading-relaxed">
                    Senior software engineer Maya Lin shares how Wells Fargo’s 16 hours of paid volunteer time allows her to teach robotics and coding in underserved high schools every month.
                  </div>
                  <div className="text-stone-400 text-[11px]">5 min read • Our People</div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="text-[11px] font-bold text-blue-600 uppercase">Innovation</div>
                  <div className="font-bold text-stone-900 text-sm">Designing Mobile Banking with Voice & Accessibility First</div>
                  <div className="text-stone-600 leading-relaxed">
                    Inside the Wells Fargo Human-Centered Design Lab where designers collaborate directly with vision-impaired and neurodivergent customers to build seamless banking.
                  </div>
                  <div className="text-stone-400 text-[11px]">4 min read • Technology</div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Explore History Modal */}
      {activeModal === 'history' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">History in the Making: Since 1852</h3>
                  <p className="text-xs text-red-100">Over 170 years of financial resilience & innovation</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-stone-800">
              <div className="border-l-2 border-[#d71e28] pl-5 space-y-6 text-xs">
                <div>
                  <div className="font-bold text-[#d71e28] text-sm">1852 — The Founding in California</div>
                  <div className="text-stone-700 leading-relaxed mt-1">
                    Henry Wells and William G. Fargo found Wells, Fargo & Co. in New York City to provide express delivery and banking services to the booming California Gold Rush frontier in San Francisco.
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[#d71e28] text-sm">1860s — The Concord Stagecoach & Pony Express</div>
                  <div className="text-stone-700 leading-relaxed mt-1">
                    Wells Fargo purchases the Pioneer Stage Line and consolidates major western stagecoach routes, transporting gold bullion, mail, and travelers with legendary speed and security.
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[#d71e28] text-sm">1918 — The World War I Transition to Pure Commercial Banking</div>
                  <div className="text-stone-700 leading-relaxed mt-1">
                    Express transportation is merged into American Railway Express during wartime nationalization, allowing Wells Fargo to focus entirely on commercial and consumer banking innovation.
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[#d71e28] text-sm">1995 — Pioneer of Internet Banking</div>
                  <div className="text-stone-700 leading-relaxed mt-1">
                    Wells Fargo becomes the very first major financial institution in the United States to give customers personal online banking access through the World Wide Web.
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[#d71e28] text-sm">2026 & Beyond — Digital, Modern & Inclusive</div>
                  <div className="text-stone-700 leading-relaxed mt-1">
                    Today, Wells Fargo serves 1 in 3 American households with state-of-the-art mobile banking, Fargo AI financial guidance, instant payments, and industry-leading security.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Supplier Resource Center Modal */}
      {activeModal === 'supplier-center' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Handshake className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">Supplier Resource Center</h3>
                  <p className="text-xs text-red-100">Doing business with Wells Fargo</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-800">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="font-bold text-stone-900 text-sm">Supplier Diversity Program</div>
                <p className="text-stone-600 leading-relaxed">
                  We are committed to building economic vitality by partnering with certified minority-, woman-, veteran-, LGBTQ+-, and disability-owned enterprises across all procurement categories.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-stone-900 text-sm">Key Supplier Resources:</div>
                <div className="p-3 bg-white rounded-lg border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-900">Supplier Registration Portal:</span> Register your business credentials and catalog.
                  </div>
                  <button onClick={() => alert('Redirecting to secure Supplier Registration Portal...')} className="text-[#d71e28] font-bold hover:underline shrink-0 ml-2">Access</button>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-900">Invoice & Payment Guidelines:</span> Electronic invoicing specs and net-30 terms.
                  </div>
                  <button onClick={() => alert('Downloading Electronic Invoicing Standard Guide PDF...')} className="text-[#d71e28] font-bold hover:underline shrink-0 ml-2">Guide</button>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-900">Third-Party Risk & Compliance:</span> Information security requirements for vendors.
                  </div>
                  <button onClick={() => alert('Opening Third-Party Risk Guidelines...')} className="text-[#d71e28] font-bold hover:underline shrink-0 ml-2">Review</button>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Sponsorships Modal */}
      {activeModal === 'sponsorships' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">Wells Fargo Sponsorships</h3>
                  <p className="text-xs text-red-100">Partnering with athletics, arts, and community programs</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-800">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="font-bold text-stone-900 text-sm">Major Sponsorship Commitments</div>
                <p className="text-stone-600 leading-relaxed">
                  We invest in national and local partnerships that bring communities together, support youth development, and champion financial education through sports and culture.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900">Wells Fargo Championship</div>
                  <div className="text-stone-500 mt-1">PGA TOUR signature event driving over $30M in regional charitable contributions.</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900">Major League Soccer (MLS)</div>
                  <div className="text-stone-500 mt-1">Official bank of MLS and sponsor of grassroots community soccer youth clinics.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-stone-700">
                <div className="font-bold text-stone-900 mb-1">Applying for a Sponsorship:</div>
                <div>Applications for charitable event or sports sponsorships must be submitted at least 180 days prior to the event date via our corporate partnerships portal.</div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Teamworks for Employees Modal */}
      {activeModal === 'teamworks' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-serif text-xl font-bold">Teamworks for Employees</h3>
                  <p className="text-xs text-red-100">Private internal portal for Wells Fargo team members</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-800">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-stone-700">
                <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Authorized personnel only. Requires Wells Fargo Enterprise RSA Token / VIP Multi-Factor Sign-On.</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Enterprise Employee ID</label>
                  <input
                    type="text"
                    placeholder="e.g. U123456"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Network Password / VIP Token</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert('Simulating employee secure login authentication...')}
                  className="w-full bg-[#d71e28] hover:bg-[#b0141d] text-white py-2.5 rounded-xl font-semibold cursor-pointer"
                >
                  Sign On to Teamworks
                </button>
              </div>

              <div className="pt-2 text-stone-500 text-[11px] text-center">
                Need HR assistance? Call the Team Member Care Center: 1-877-HR-WELLS (1-877-479-3557)
              </div>
            </div>

            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. Feedback Modal */}
      {activeModal === 'feedback' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="bg-[#d71e28] text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-serif text-lg font-bold">Share Your Feedback</h3>
                  <p className="text-xs text-red-100">Help us improve your Wells Fargo digital experience</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-800">
              {feedbackSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-stone-900 text-base">Thank you for your feedback!</h4>
                  <p className="text-stone-600 text-xs max-w-sm mx-auto">
                    Your insights help us continuously refine and improve our digital banking tools.
                  </p>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="bg-[#d71e28] hover:bg-[#b0141d] text-white px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-2">Overall Experience Rating:</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= feedbackRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-stone-500 font-medium ml-2">
                        {feedbackRating === 5 && 'Excellent'}
                        {feedbackRating === 4 && 'Good'}
                        {feedbackRating === 3 && 'Average'}
                        {feedbackRating === 2 && 'Fair'}
                        {feedbackRating === 1 && 'Poor'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Feedback Category:</label>
                    <select
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50 text-xs"
                    >
                      <option value="Ease of Navigation">Ease of Navigation</option>
                      <option value="About Wells Fargo Info">About Wells Fargo Information</option>
                      <option value="Online Banking & Tools">Online Banking & Tools</option>
                      <option value="Customer Service & Help">Customer Service & Help</option>
                      <option value="Other">Other Suggestion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Comments or Suggestions:</label>
                    <textarea
                      rows={4}
                      value={feedbackComments}
                      onChange={(e) => setFeedbackComments(e.target.value)}
                      placeholder="Tell us what you liked or what we can do better..."
                      className="w-full p-3 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-50 text-stone-700 cursor-pointer font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackSubmitted(true)}
                      className="bg-[#d71e28] hover:bg-[#b0141d] text-white px-5 py-2 rounded-xl font-semibold cursor-pointer"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
