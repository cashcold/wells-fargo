import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  DollarSign,
  Calendar,
  Percent,
  CheckCircle2,
  Building,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Info,
  Download,
  FileText,
} from 'lucide-react';
import { BankAccount, UserProfile } from '../../types/banking';
import { downloadLoanDisclosurePdf } from '../../utils/loanPdfGenerator';
import { apiFetch } from '../../utils/api';

interface LoanConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanAccount: BankAccount;
  userData?: UserProfile;
  onUpdateLoanAmount: (accountId: string, newPrincipal: number, monthlyPayment: number, termMonths: number, apr: number) => void;
}

export const LoanConfiguratorModal: React.FC<LoanConfiguratorModalProps> = ({
  isOpen,
  onClose,
  loanAccount,
  userData,
  onUpdateLoanAmount,
}) => {
  const currentBalance = loanAccount.principalBalance || 13643.95;
  const [loanAmount, setLoanAmount] = useState<number>(currentBalance);
  const [termMonths, setTermMonths] = useState<number>(60);
  const [loanType, setLoanType] = useState<'personal' | 'real-estate' | 'commercial' | 'corporate'>('commercial');
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverRates, setServerRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let isMounted = true;
    apiFetch('/api/rates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data?.lendingRates) return;
        const map: Record<string, number> = {};
        for (const item of data.lendingRates) {
          if (item.product?.includes('Personal')) map['personal'] = item.apr;
          if (item.product?.includes('Real Estate') || item.product?.includes('Mortgage')) map['real-estate'] = item.apr;
          if (item.product?.includes('Commercial')) map['commercial'] = item.apr;
          if (item.product?.includes('Corporate')) map['corporate'] = item.apr;
        }
        setServerRates(map);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen) return null;

  // Highest loan limit is 100 Million USD ($100,000,000.00), minimum loan is 700 USD ($700.00)
  const MAX_LOAN_LIMIT = 100000000;
  const MIN_LOAN_LIMIT = 700;

  // Determine APR based on loan type (synchronized with serverless rate API)
  const getApr = () => {
    if (serverRates && typeof serverRates[loanType] === 'number') {
      return serverRates[loanType];
    }
    switch (loanType) {
      case 'personal':
        return 6.99;
      case 'real-estate':
        return 5.99;
      case 'commercial':
        return 5.49;
      case 'corporate':
        return 4.99;
      default:
        return 5.75;
    }
  };

  const getLoanClassificationTitle = () => {
    switch (loanType) {
      case 'personal':
        return 'Personal Signature Credit';
      case 'real-estate':
        return 'Jumbo Real Estate Mortgage';
      case 'commercial':
        return 'Commercial & Executive Loan';
      case 'corporate':
        return 'Wells Fargo Corporate Line';
      default:
        return 'Commercial & Executive Loan';
    }
  };

  const apr = getApr();
  const monthlyRate = apr / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
      : loanAmount / termMonths;

  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setLoanAmount(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9.]/g, '');
    let val = parseFloat(rawVal) || 0;
    if (val > MAX_LOAN_LIMIT) val = MAX_LOAN_LIMIT;
    setLoanAmount(val);
  };

  const handleSelectPreset = (amount: number) => {
    setLoanAmount(amount);
  };

  const handleDownloadPdf = () => {
    const reg = userData?.registrationData;
    const userAddress = reg
      ? `${reg.c1StreetAddress || ''}, ${reg.c1City || ''}, ${reg.c1State || ''} ${reg.c1Zip || ''}`.trim()
      : '1048 Montgomery St, Apt 4B, San Francisco, CA 94133';

    downloadLoanDisclosurePdf({
      userName: reg?.c1FullName || userData?.name || 'Kate20',
      userAddress,
      userPhone: reg?.c1HomePhone || '(415) 890-2134',
      userEmail: 'kate20@wellsfargo-customer.com',
      userEmployer: reg?.c1Employer || 'Apex BioTech Corp',
      userDob: reg?.c1Dob || '06/14/1992',
      userTinLast4: reg?.c1Tin ? reg.c1Tin.slice(-4) : '4321',
      accountName: loanAccount.name,
      accountNumber: loanAccount.accountNumber,
      loanAmount,
      apr,
      termMonths,
      monthlyPayment,
      totalInterest,
      totalRepayment,
      loanTypeTitle: getLoanClassificationTitle(),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loanAmount < MIN_LOAN_LIMIT) return;

    onUpdateLoanAmount(
      loanAccount.id,
      loanAmount,
      monthlyPayment,
      termMonths,
      apr
    );

    // Auto-prompt download for the user
    handleDownloadPdf();

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-stone-300 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#242424] text-white px-5 py-3 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#d71e28] text-white p-1 rounded font-serif font-bold text-xs">
              WF
            </div>
            <div>
              <span className="font-semibold text-xs text-white block">
                Loan Amount & Credit Line Configurator
              </span>
              <span className="text-[10px] text-amber-300 font-mono">
                Wells Fargo Lending • Max Loan Limit: $100,000,000.00 USD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
              title="Download Truth in Lending & Loan Agreement PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wells Fargo Banner */}
        <div className="bg-[#d71e28] text-white px-5 py-2.5 border-b-2 border-[#ffcc00] flex items-center justify-between text-xs shrink-0">
          <span className="font-medium">
            Account: {loanAccount.name} ({loanAccount.accountNumber})
          </span>
          <span className="bg-black/30 text-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-300/30">
            Highest Loan Allowed: $100 Million USD
          </span>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-stone-50 text-stone-900">
          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-sm block">Loan Configured & PDF Generated!</span>
                  <span className="text-xs">
                    Updated principal balance to ${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} for {userData?.name || 'Borrower'}. Your official Truth-in-Lending Statement has been generated.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Again</span>
              </button>
            </div>
          )}

          {/* Amount Display & Keypad Input */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs text-center space-y-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Configured Loan Principal Amount
            </span>

            <div className="flex items-center justify-center gap-1.5">
              <span className="text-3xl sm:text-5xl font-light text-stone-400">$</span>
              <input
                type="text"
                value={loanAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                onChange={handleInputChange}
                className="text-3xl sm:text-5xl font-light text-stone-900 tabular-nums w-72 sm:w-96 text-center bg-transparent border-b-2 border-stone-300 focus:border-[#d71e28] focus:outline-none"
              />
            </div>

            <div className="text-[11px] text-stone-500 flex items-center justify-center gap-4">
              <span className="font-bold text-stone-800">Min: $700.00 (700 USD)</span>
              <span className="font-bold text-amber-700">Highest Loan: $100,000,000.00 (100 USD Million)</span>
            </div>

            {/* Slider */}
            <div className="pt-2">
              <input
                type="range"
                min={MIN_LOAN_LIMIT}
                max={MAX_LOAN_LIMIT}
                step={100}
                value={loanAmount}
                onChange={handleSliderChange}
                className="w-full accent-[#d71e28] cursor-pointer h-2 bg-stone-200 rounded-lg"
              />
            </div>

            {/* Quick Presets (From $700 up to $100M) */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {[
                { label: '$700 (Min)', val: 700 },
                { label: '$10,000', val: 10000 },
                { label: '$100,000', val: 100000 },
                { label: '$1,000,000 ($1M)', val: 1000000 },
                { label: '$10,000,000 ($10M)', val: 10000000 },
                { label: '$50,000,000 ($50M)', val: 50000000 },
                { label: '$100,000,000 ($100M MAX)', val: 100000000 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => handleSelectPreset(item.val)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                    loanAmount === item.val
                      ? 'bg-[#d71e28] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loan Category Selection */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              Loan Classification & Portfolio
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: 'commercial', title: 'Commercial & Executive Loan', desc: 'Up to $100,000,000 • 5.49% APR', apr: 5.49 },
                { id: 'corporate', title: 'Wells Fargo Corporate Line', desc: 'Up to $100,000,000 • 4.99% APR', apr: 4.99 },
                { id: 'real-estate', title: 'Jumbo Real Estate Mortgage', desc: 'Up to $100,000,000 • 5.99% APR', apr: 5.99 },
                { id: 'personal', title: 'Personal Signature Credit', desc: 'Up to $100,000 • 6.99% APR', apr: 6.99 },
              ].map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setLoanType(cat.id as any)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    loanType === cat.id
                      ? 'border-[#d71e28] bg-red-50/40 text-stone-900 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{cat.title}</span>
                    <span className="font-mono text-emerald-700 font-bold">{cat.apr}% APR</span>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">{cat.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Repayment Term Selection */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              Repayment Term Duration
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {[
                { months: 12, label: '1 Year (12 Mo)' },
                { months: 36, label: '3 Years (36 Mo)' },
                { months: 60, label: '5 Years (60 Mo)' },
                { months: 120, label: '10 Years (120 Mo)' },
                { months: 360, label: '30 Years (360 Mo)' },
              ].map((term) => (
                <button
                  key={term.months}
                  type="button"
                  onClick={() => setTermMonths(term.months)}
                  className={`p-2.5 rounded-lg border text-center font-semibold transition-colors ${
                    termMonths === term.months
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {term.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Summary Card */}
          <div className="bg-stone-900 text-white rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-bold uppercase text-amber-300 tracking-wider">
                Calculated Payment Breakdown
              </span>
              <span className="text-xs text-stone-400 font-mono">Interest Rate: {apr}% APR</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <span className="text-stone-400 text-xs block">Estimated Monthly Payment</span>
                <span className="text-2xl font-bold text-white tabular-nums">
                  ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-stone-400 text-xs block">Total Interest Over Term</span>
                <span className="text-lg font-semibold text-stone-300 tabular-nums">
                  ${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-stone-400 text-xs block">Total Principal & Interest</span>
                <span className="text-lg font-semibold text-emerald-400 tabular-nums">
                  ${totalRepayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-stone-300 text-stone-700 hover:bg-stone-100 px-5 py-2.5 rounded-full text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="bg-white border-2 border-stone-800 text-stone-900 hover:bg-stone-100 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                title="Download Truth in Lending & Loan Agreement PDF attached to your name"
              >
                <Download className="w-4 h-4 text-[#d71e28]" />
                <span>Download Loan (PDF)</span>
              </button>

              <button
                type="submit"
                className="bg-[#d71e28] hover:bg-[#b81620] text-white px-7 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <span>Apply & Save Configured Loan (${loanAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
