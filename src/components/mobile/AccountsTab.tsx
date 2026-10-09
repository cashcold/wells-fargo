import React from 'react';
import { ChevronRight, PlusCircle, CreditCard, Landmark, PiggyBank, Home, Star, TrendingUp, Sparkles } from 'lucide-react';
import { BankAccount, UserProfile } from '../../types/banking';
import { useGreeting } from '../../utils/greeting';

interface AccountsTabProps {
  userData: UserProfile;
  onSelectAccount: (account: BankAccount) => void;
  onOpenNewAccount: () => void;
  onOpenAskFargo: () => void;
}

export const AccountsTab: React.FC<AccountsTabProps> = ({
  userData,
  onSelectAccount,
  onOpenNewAccount,
  onOpenAskFargo,
}) => {
  const greeting = useGreeting();

  return (
    <div className="space-y-4 p-4 sm:p-5">
      {/* Greeting Header matching EVD-app_promo-290x582.png */}
      <div className="pt-1">
        <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight">
          {greeting},
        </h1>
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
          {userData.name}
        </h2>
      </div>

      {/* Account Cards Stack */}
      <div className="space-y-3 pt-2">
        {userData.accounts.map((account) => {
          const isCredit = account.type === 'credit';
          const isLoan = account.type === 'loan';
          const balance = isLoan
            ? account.principalBalance || account.availableBalance
            : account.availableBalance;

          return (
            <div
              key={account.id}
              onClick={() => onSelectAccount(account)}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 hover:border-stone-300 transition-all cursor-pointer active:scale-[0.99]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-tight block">
                    {account.name} {account.accountNumber}
                  </span>
                  <div className="text-2xl sm:text-3xl font-normal text-stone-900 mt-1 tabular-nums">
                    ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium block mt-0.5">
                    {isCredit || isLoan ? 'Outstanding balance' : 'Available balance'}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 mt-2" />
              </div>

              {/* Cash Rewards Bar for Credit Card (matching how-it-works-get-started) */}
              {isCredit && account.rewardsBalance !== undefined && (
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-800">
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>${account.rewardsBalance.toFixed(2)} cash rewards</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              )}
            </div>
          );
        })}

        {/* "+ Open new account" link button */}
        <button
          onClick={onOpenNewAccount}
          className="flex items-center gap-2 text-xs font-semibold text-[#5c35b3] hover:text-[#412185] py-2 px-1 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open new account</span>
        </button>
      </div>

      {/* Open an account quick action bar (matching how-it-works-get-started.png) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-stone-800">Open an account</span>
          <button
            onClick={onOpenNewAccount}
            className="text-[11px] font-semibold text-[#5c35b3] hover:underline flex items-center gap-0.5"
          >
            <span>Explore all</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            onClick={onOpenNewAccount}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-1 shadow-2xs">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-stone-700">Checking</span>
          </button>

          <button
            onClick={onOpenNewAccount}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-1 shadow-2xs">
              <PiggyBank className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-stone-700">Savings & CDs</span>
          </button>

          <button
            onClick={onOpenNewAccount}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-[#d71e28] mb-1 shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-stone-700">Credit cards</span>
          </button>

          <button
            onClick={onOpenNewAccount}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-1 shadow-2xs">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-stone-700">Loans</span>
          </button>
        </div>
      </div>

      {/* FICO Score Card matching EVD-app_promo */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center gap-4">
        {/* Circular Gauge */}
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-stone-200"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-600"
              strokeDasharray="85, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute font-bold text-xs text-stone-800">{userData.ficoScore}</span>
        </div>

        <div className="flex-1">
          <span className="text-xs font-semibold text-stone-900 block">
            Your FICO<sup>®</sup> Score went up {userData.ficoChange} points
          </span>
          <span className="text-[11px] text-stone-500 block mt-0.5">
            Updated {userData.ficoUpdatedDate}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
      </div>

      {/* Credit Card Autograph Promo Card */}
      <div className="bg-gradient-to-r from-red-900 via-stone-900 to-amber-950 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-300" />
            <span>Earn 20k bonus points</span>
          </div>
          <h3 className="font-serif text-lg font-normal">Wells Fargo Autograph<sup>®</sup></h3>
          <p className="text-[11px] text-stone-300 leading-snug">
            Earn 3X points on dining, travel, popular streaming services & gas.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenNewAccount}
              className="text-xs bg-white text-stone-900 px-3 py-1.5 rounded-full font-semibold hover:bg-stone-100 transition-colors"
            >
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
