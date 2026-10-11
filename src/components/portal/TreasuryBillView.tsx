import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
  Download,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Landmark,
  ChevronRight,
  X,
  ExternalLink,
  Percent,
} from 'lucide-react';
import {
  UserProfile,
  TreasuryBill,
  TreasuryTenderOrder,
  TBillTerm,
} from '../../types/banking';
import { MOCK_TREASURY_BILLS } from '../../data/mockData';
import { downloadTreasuryConfirmationPdf } from '../../utils/treasuryPdfGenerator';

interface TreasuryBillViewProps {
  userData: UserProfile;
  onUpdateUserData?: (updated: UserProfile) => void;
  onOpenSignOn?: () => void;
  isLoggedIn: boolean;
}

export const TreasuryBillView: React.FC<TreasuryBillViewProps> = ({
  userData,
  onUpdateUserData,
  onOpenSignOn,
  isLoggedIn,
}) => {
  const [activeTab, setActiveTab] = useState<'auctions' | 'holdings' | 'calculator'>('auctions');
  const [selectedBillForTender, setSelectedBillForTender] = useState<TreasuryBill | null>(null);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [tenderSuccessOrder, setTenderSuccessOrder] = useState<TreasuryTenderOrder | null>(null);

  // Tender form state
  const [tenderType, setTenderType] = useState<'Non-Competitive' | 'Competitive'>('Non-Competitive');
  const [competitiveBidYield, setCompetitiveBidYield] = useState<number>(5.20);
  const [faceValue, setFaceValue] = useState<number>(10000);
  const [autoRoll, setAutoRoll] = useState<boolean>(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    userData.accounts[0]?.id || 'checking-0987'
  );
  const [tenderError, setTenderError] = useState<string | null>(null);

  // Active holdings
  const holdings: TreasuryTenderOrder[] = userData.treasuryHoldings || [];

  // Open Tender modal for a specific bill
  const handleOpenTender = (bill: TreasuryBill) => {
    if (!isLoggedIn && onOpenSignOn) {
      onOpenSignOn();
      return;
    }
    setSelectedBillForTender(bill);
    setCompetitiveBidYield(bill.discountRate);
    setTenderError(null);
    setTenderSuccessOrder(null);
    setIsTenderModalOpen(true);
  };

  // Calculate discount price and yield
  const calculateTenderEconomics = (bill: TreasuryBill, par: number, discountRate: number) => {
    const days = bill.termDays;
    // Price = Par * (1 - (discountRate / 100 * days / 360))
    const price = par * (1 - (discountRate / 100 * days) / 360);
    const roundedPrice = Math.round(price * 100) / 100;
    const discountAmount = Math.round((par - roundedPrice) * 100) / 100;
    // Investment yield (CES) = (discountAmount / roundedPrice) * (365 / days) * 100
    const investmentYield =
      roundedPrice > 0 ? (discountAmount / roundedPrice) * (365 / days) * 100 : 0;
    return {
      price: roundedPrice,
      discountAmount,
      investmentYield: Math.round(investmentYield * 100) / 100,
    };
  };

  const currentRate =
    tenderType === 'Non-Competitive'
      ? selectedBillForTender?.discountRate || 5.18
      : competitiveBidYield || 5.18;

  const economics = selectedBillForTender
    ? calculateTenderEconomics(selectedBillForTender, faceValue, currentRate)
    : { price: 0, discountAmount: 0, investmentYield: 0 };

  const fundingAccount = userData.accounts.find((a) => a.id === selectedAccountId);
  const availableBal = fundingAccount?.availableBalance || 0;

  // Submit Tender / "Appear for Treasury Bill"
  const handleSubmitTender = () => {
    if (!selectedBillForTender) return;

    if (faceValue < 1000) {
      setTenderError('Minimum Treasury Bill purchase is $1,000.00 USD.');
      return;
    }

    if (faceValue % 1000 !== 0) {
      setTenderError('Treasury Bill orders must be in multiples of $1,000.00 USD.');
      return;
    }

    if (economics.price > availableBal) {
      setTenderError(
        `Insufficient available funds in ${fundingAccount?.name || 'account'}. Need $${economics.price.toLocaleString(
          'en-US',
          { minimumFractionDigits: 2 }
        )} USD, but only $${availableBal.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })} is available.`
      );
      return;
    }

    const orderId = `WF-TB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const confirmationNumber = `WF-SEC-${Math.floor(100000 + Math.random() * 900000)}-TB`;

    const newOrder: TreasuryTenderOrder = {
      orderId,
      tBillId: selectedBillForTender.id,
      cusip: selectedBillForTender.cusip,
      term: selectedBillForTender.term,
      faceValue,
      discountPrice: economics.price,
      totalDiscount: economics.discountAmount,
      discountRate: currentRate,
      investmentYield: economics.investmentYield,
      tenderType,
      bidYield: tenderType === 'Competitive' ? competitiveBidYield : undefined,
      autoRoll,
      fundingAccountId: selectedAccountId,
      fundingAccountName: `${fundingAccount?.name || 'Account'} (${fundingAccount?.accountNumber || '..0987'})`,
      status: 'Awarded / Active',
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }),
      settlementDate: selectedBillForTender.issueDate,
      maturityDate: selectedBillForTender.maturityDate,
      confirmationNumber,
    };

    // Update user accounts: deduct discounted purchase price
    const updatedAccounts = userData.accounts.map((acc) => {
      if (acc.id === selectedAccountId) {
        return {
          ...acc,
          availableBalance: Math.max(0, acc.availableBalance - economics.price),
          currentBalance: (acc.currentBalance ?? acc.availableBalance) - economics.price,
          transactions: [
            {
              id: `tx-tbill-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              }),
              description: `US TREASURY BILL AUCTION TENDER - ${selectedBillForTender.term} CUSIP:${selectedBillForTender.cusip}`,
              amount: economics.price,
              type: 'debit' as const,
              category: 'Transfers' as const,
            },
            ...acc.transactions,
          ],
        };
      }
      return acc;
    });

    const updatedUserData: UserProfile = {
      ...userData,
      accounts: updatedAccounts,
      treasuryHoldings: [newOrder, ...(userData.treasuryHoldings || [])],
    };

    if (onUpdateUserData) {
      onUpdateUserData(updatedUserData);
    }

    setTenderSuccessOrder(newOrder);
  };

  // Toggle Auto-Roll for existing holding
  const handleToggleAutoRoll = (orderId: string) => {
    if (!onUpdateUserData) return;
    const updated = {
      ...userData,
      treasuryHoldings: (userData.treasuryHoldings || []).map((h) =>
        h.orderId === orderId ? { ...h, autoRoll: !h.autoRoll } : h
      ),
    };
    onUpdateUserData(updated);
  };

  return (
    <div className="bg-white text-stone-900 font-sans">
      {/* Top Banner: Official Wells Fargo Fixed Income Desk */}
      <div className="bg-[#1c1917] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                <Landmark className="w-4 h-4" />
                <span>Wells Fargo Advisors & Fixed Income Capital Markets</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight">
                U.S. Treasury Bills (T-Bills) Auction Desk
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                Appear for scheduled weekly and monthly United States Treasury Bill auctions with zero online transaction fees. Backed by the full faith and credit of the U.S. government and 100% exempt from state and local income taxes.
              </p>
            </div>

            {/* Live Yield Summary Box */}
            <div className="bg-stone-900/90 border border-stone-700/80 rounded-xl p-4 sm:p-5 shrink-0 flex flex-col gap-3 min-w-[280px]">
              <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
                <span className="font-semibold text-white">Treasury Yield Benchmark</span>
                <span className="text-emerald-400 font-mono">LIVE / AUCTION OPEN</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-[10px] text-stone-400">4-Week</div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono">5.28%</div>
                  <div className="text-[9px] text-stone-400">Yield: 5.39%</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400">13-Week</div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono">5.18%</div>
                  <div className="text-[9px] text-stone-400">Yield: 5.32%</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400">26-Week</div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono">5.08%</div>
                  <div className="text-[9px] text-stone-400">Yield: 5.27%</div>
                </div>
              </div>
              <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1">
                <span>Minimum Par: $1,000</span>
                <span className="text-amber-400 font-semibold">State Tax Exempt</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="tab-scroll-container flex items-center gap-6 mt-8 pt-4 border-t border-stone-800 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => setActiveTab('auctions')}
              className={`pb-2 transition-colors relative cursor-pointer ${
                activeTab === 'auctions'
                  ? 'text-white font-bold'
                  : 'text-stone-400 hover:text-stone-200 font-medium'
              }`}
            >
              <span>Upcoming Auctions & Tender</span>
              {activeTab === 'auctions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d71e28]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('holdings')}
              className={`pb-2 transition-colors relative cursor-pointer ${
                activeTab === 'holdings'
                  ? 'text-white font-bold'
                  : 'text-stone-400 hover:text-stone-200 font-medium'
              }`}
            >
              <span>My Treasury Holdings ({holdings.length})</span>
              {activeTab === 'holdings' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d71e28]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`pb-2 transition-colors relative cursor-pointer ${
                activeTab === 'calculator'
                  ? 'text-white font-bold'
                  : 'text-stone-400 hover:text-stone-200 font-medium'
              }`}
            >
              <span>Tax-Equivalent Yield Calculator</span>
              {activeTab === 'calculator' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d71e28]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'auctions' && (
          <div className="space-y-8">
            {/* Featured Highlight Card */}
            <div className="bg-[#fcfbf9] border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Now Open for Competitive & Non-Competitive Tenders</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                    Appear for Upcoming U.S. Treasury Bill Auctions
                  </h2>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
                    Retail and wealth clients can place <strong>Non-Competitive Bids</strong> to guarantee full execution at the final clearing discount yield, or enter <strong>Competitive Bids</strong>. Interest is received as upfront discount savings and credited at full par upon maturity.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                  <button
                    onClick={() => handleOpenTender(MOCK_TREASURY_BILLS[2])}
                    className="bg-[#d71e28] hover:bg-[#b81620] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Appear for 13-Week T-Bill (5.18%)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenTender(MOCK_TREASURY_BILLS[0])}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Appear for 4-Week T-Bill (5.28%)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Treasury Auction Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs bg-white">
              <div className="bg-stone-50 px-5 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    United States Treasury Bill Offerings & Auction Calendar
                  </h3>
                  <p className="text-xs text-stone-500">
                    Direct primary dealer access through Wells Fargo Securities & Wells Fargo Advisors
                  </p>
                </div>
                <span className="text-xs text-stone-500 font-mono">
                  All auctions close at 11:00 AM ET on auction day
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-100/70 border-b border-stone-200 text-stone-800 font-semibold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Security / Term</th>
                      <th className="px-4 py-3.5">CUSIP</th>
                      <th className="px-4 py-3.5">Discount Rate</th>
                      <th className="px-4 py-3.5">Investment Yield</th>
                      <th className="px-4 py-3.5">Auction Date</th>
                      <th className="px-4 py-3.5">Maturity Date</th>
                      <th className="px-4 py-3.5">Price / $1k Par</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {MOCK_TREASURY_BILLS.map((bill) => (
                      <tr key={bill.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-4 font-semibold text-stone-900">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-sm">{bill.term} Treasury Bill</span>
                            <span
                              className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${
                                bill.status === 'Auction Open'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {bill.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 font-normal">
                            {bill.termDays} Days to Maturity
                          </span>
                        </td>
                        <td className="px-4 py-4 font-mono text-stone-600 font-medium">
                          {bill.cusip}
                        </td>
                        <td className="px-4 py-4 font-bold text-stone-900 font-mono text-sm">
                          {bill.discountRate.toFixed(2)}%
                        </td>
                        <td className="px-4 py-4 font-bold text-emerald-700 font-mono text-sm">
                          {bill.investmentYield.toFixed(2)}%
                        </td>
                        <td className="px-4 py-4 text-stone-700">
                          <div>{bill.auctionDate}</div>
                          <div className="text-[10px] text-stone-400">Issue: {bill.issueDate}</div>
                        </td>
                        <td className="px-4 py-4 font-medium text-stone-900">
                          {bill.maturityDate}
                        </td>
                        <td className="px-4 py-4 font-mono font-semibold text-stone-800">
                          ${bill.pricePer1000.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => handleOpenTender(bill)}
                            className="bg-[#d71e28] hover:bg-[#b81620] text-white font-bold text-xs px-4 py-2 rounded-full transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
                          >
                            Appear for Bill
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Why Invest in Treasury Bills with Wells Fargo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <div className="w-9 h-9 rounded-full bg-red-100 text-[#d71e28] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  Backed by U.S. Full Faith & Credit
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Treasury bills carry the highest credit rating possible, issued directly by the U.S. Department of the Treasury with zero sovereign default risk.
                </p>
              </div>

              <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Percent className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  100% State & Local Tax Free
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Unlike bank CDs or corporate bonds, all interest earnings on Treasury Bills are completely exempt from state and municipal income taxation.
                </p>
              </div>

              <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  Seamless Auto-Roll Reinvestment
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Enable Auto-Roll to automatically purchase the next on-the-run Treasury Bill auction when your current bill reaches maturity without missing a day of yield.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Treasury Holdings */}
        {activeTab === 'holdings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-5 rounded-xl border border-stone-200">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Active Treasury Bill Portfolio
                </h3>
                <p className="text-xs text-stone-600">
                  Total Par Value: $
                  {holdings
                    .reduce((acc, h) => acc + h.faceValue, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                  USD across {holdings.length} active positions
                </p>
              </div>
              <button
                onClick={() => setActiveTab('auctions')}
                className="bg-[#d71e28] hover:bg-[#b81620] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer self-start sm:self-auto"
              >
                + Appear for Another Auction
              </button>
            </div>

            {holdings.length === 0 ? (
              <div className="text-center py-16 bg-white border border-stone-200 rounded-xl">
                <Landmark className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                <h4 className="font-serif font-bold text-base text-stone-800">
                  No Active Treasury Holdings Found
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
                  You have not appeared for any Treasury Bill auctions yet. Review upcoming auctions to tender bids starting at $1,000.
                </p>
                <button
                  onClick={() => setActiveTab('auctions')}
                  className="bg-[#d71e28] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#b81620]"
                >
                  View Upcoming Auctions
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {holdings.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-stone-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-stone-900">
                            {order.term} U.S. Treasury Bill
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 font-mono mt-0.5">
                          CUSIP: {order.cusip} · Order #{order.orderId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-stone-900 font-mono">
                          ${order.faceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-stone-500">Par Value (at maturity)</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-lg text-center text-xs">
                      <div>
                        <div className="text-[10px] text-stone-500">Purchase Price</div>
                        <div className="font-mono font-bold text-stone-800">
                          ${order.discountPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-500">Discount Return</div>
                        <div className="font-mono font-bold text-emerald-700">
                          +${order.totalDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-500">Annual Yield</div>
                        <div className="font-mono font-bold text-[#d71e28]">
                          {order.investmentYield.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-600 border-t border-stone-100 pt-3">
                      <div>
                        <span className="text-stone-400">Settled:</span> {order.settlementDate} ·{' '}
                        <span className="text-stone-400">Matures:</span> {order.maturityDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-stone-700">
                          <input
                            type="checkbox"
                            checked={order.autoRoll}
                            onChange={() => handleToggleAutoRoll(order.orderId)}
                            className="w-3.5 h-3.5 accent-[#d71e28] rounded cursor-pointer"
                          />
                          <span>Auto-Roll</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                      <span className="text-stone-500 text-[11px]">
                        Funded via {order.fundingAccountName}
                      </span>
                      <button
                        onClick={() => downloadTreasuryConfirmationPdf(order, userData.name)}
                        className="text-[#d71e28] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Confirmation PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Tax-Equivalent Yield Calculator */}
        {activeTab === 'calculator' && (
          <div className="max-w-3xl mx-auto bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Treasury Bill Tax-Equivalent Yield Calculator
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Because Treasury Bills are 100% exempt from state and municipal taxes, their after-tax yield frequently surpasses bank certificates of deposit (CDs) and commercial paper.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Treasury Bill Rate (%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  defaultValue="5.18"
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-lg font-mono"
                  id="calc-tbill-rate"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Your State & Local Income Tax Bracket (%)
                </label>
                <select
                  defaultValue="9.3"
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-lg"
                  id="calc-state-tax"
                >
                  <option value="0">0% (TX, FL, WA, NV, WY, SD, TN, AK)</option>
                  <option value="4.5">4.5% (AZ, NC, CO, UT, GA)</option>
                  <option value="6.0">6.0% (IL, VA, PA, OH)</option>
                  <option value="9.3">9.3% (CA, NY State, MN, OR)</option>
                  <option value="13.3">13.3% (CA Top Bracket / NYC Resident)</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600">Standard Bank CD Rate Needed to Match:</span>
                <span className="font-mono font-bold text-lg text-[#d71e28]">5.71% APY</span>
              </div>
              <div className="text-[11px] text-stone-500 leading-relaxed">
                An investor in a 9.3% state tax bracket earning 5.18% in U.S. Treasury Bills takes home the same after-tax cash as a taxable commercial CD paying 5.71% APY.
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setActiveTab('auctions');
                  handleOpenTender(MOCK_TREASURY_BILLS[2]);
                }}
                className="bg-[#d71e28] text-white px-6 py-2.5 rounded-full font-bold text-xs hover:bg-[#b81620] transition-colors"
              >
                Appear for 13-Week Treasury Bill Auction
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          INTERACTIVE "APPEAR FOR TREASURY BILL" TENDER MODAL
         ========================================================================= */}
      {isTenderModalOpen && selectedBillForTender && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200 my-8">
            {/* Modal Header */}
            <div className="bg-[#d71e28] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-red-200 font-semibold">
                  U.S. Department of the Treasury · Auction Tender
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl">
                  Appear for {selectedBillForTender.term} Treasury Bill
                </h3>
              </div>
              <button
                onClick={() => setIsTenderModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {tenderSuccessOrder ? (
              /* Success Screen */
              <div className="p-6 sm:p-8 space-y-6 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl text-stone-900">
                    Tender Order Successfully Awarded!
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Your Treasury tender bid has been recorded with the Federal Reserve Bank.
                  </p>
                  <div className="font-mono text-xs font-bold text-[#d71e28] mt-2">
                    Confirmation #{tenderSuccessOrder.confirmationNumber}
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Security:</span>
                    <span className="font-semibold">{tenderSuccessOrder.term} T-Bill ({tenderSuccessOrder.cusip})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Par Value (Maturity Payout):</span>
                    <span className="font-bold text-stone-900 font-mono">
                      ${tenderSuccessOrder.faceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Discount Settlement Price:</span>
                    <span className="font-bold text-stone-900 font-mono">
                      ${tenderSuccessOrder.discountPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Interest Earned at Maturity:</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      +${tenderSuccessOrder.totalDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Maturity Date:</span>
                    <span className="font-semibold">{tenderSuccessOrder.maturityDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Auto-Roll Reinvestment:</span>
                    <span className="font-semibold">
                      {tenderSuccessOrder.autoRoll ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => downloadTreasuryConfirmationPdf(tenderSuccessOrder, userData.name)}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-2.5 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Official PDF Confirmation</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsTenderModalOpen(false);
                      setActiveTab('holdings');
                    }}
                    className="bg-[#d71e28] hover:bg-[#b81620] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    View in My Holdings
                  </button>
                </div>
              </div>
            ) : (
              /* Tender Entry Form */
              <div className="p-6 space-y-5 text-xs text-stone-800 max-h-[80vh] overflow-y-auto">
                {/* Security Info Summary */}
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-stone-900 block text-sm">
                      {selectedBillForTender.term} Treasury Bill
                    </span>
                    <span className="text-stone-500 font-mono text-[11px]">
                      CUSIP: {selectedBillForTender.cusip} · {selectedBillForTender.termDays} Days
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block">Expected Yield</span>
                    <span className="font-bold text-emerald-700 font-mono text-sm">
                      {selectedBillForTender.investmentYield.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Tender Type Selection */}
                <div>
                  <label className="block font-semibold text-stone-900 mb-1.5">
                    Select Tender Type:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTenderType('Non-Competitive')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        tenderType === 'Non-Competitive'
                          ? 'border-[#d71e28] bg-red-50/50 ring-1 ring-[#d71e28]'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-bold text-stone-900">Non-Competitive Tender</div>
                      <div className="text-[10px] text-stone-500 mt-1">
                        Guaranteed fill at high auction rate (recommended for retail/wealth). Up to $10M.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTenderType('Competitive')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        tenderType === 'Competitive'
                          ? 'border-[#d71e28] bg-red-50/50 ring-1 ring-[#d71e28]'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-bold text-stone-900">Competitive Tender</div>
                      <div className="text-[10px] text-stone-500 mt-1">
                        Specify the exact discount rate bid. Order only fills if rate is accepted.
                      </div>
                    </button>
                  </div>
                </div>

                {tenderType === 'Competitive' && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <label className="block font-semibold text-stone-900 mb-1">
                      Your Bid Discount Rate (%):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={competitiveBidYield}
                      onChange={(e) => setCompetitiveBidYield(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-md font-mono"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Current auction clearing rate benchmark is {selectedBillForTender.discountRate.toFixed(2)}%.
                    </span>
                  </div>
                )}

                {/* Par / Face Value Investment Amount */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-stone-900">
                      Par / Face Value (Maturity Payout Amount):
                    </label>
                    <span className="text-[11px] text-stone-500">$1,000 increments</span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-500 font-bold">$</span>
                    <input
                      type="number"
                      step="1000"
                      min="1000"
                      value={faceValue}
                      onChange={(e) => setFaceValue(parseInt(e.target.value) || 1000)}
                      className="w-full pl-7 pr-3 py-2 border border-stone-300 rounded-lg font-mono font-bold text-sm focus:ring-2 focus:ring-[#d71e28] focus:border-transparent"
                    />
                  </div>

                  {/* Preset Quick Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[1000, 5000, 10000, 25000, 50000, 100000, 1000000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFaceValue(amt)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                          faceValue === amt
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        ${amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}k`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Economics Calculation Box */}
                <div className="bg-[#fffdf8] border border-amber-300/80 rounded-xl p-4 space-y-2.5">
                  <div className="font-semibold text-stone-900 border-b border-amber-200 pb-1.5 flex items-center justify-between">
                    <span>Order Price & Yield Breakdown</span>
                    <span className="text-[10px] text-stone-500 font-normal">Discount Math</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                    <span className="text-stone-500">Par Value at Maturity:</span>
                    <span className="text-right font-mono font-bold text-stone-900">
                      ${faceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>

                    <span className="text-stone-500">Purchase Settlement Price:</span>
                    <span className="text-right font-mono font-bold text-[#d71e28] text-xs">
                      ${economics.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>

                    <span className="text-stone-500">Total Interest (Discount Profit):</span>
                    <span className="text-right font-mono font-bold text-emerald-700">
                      +${economics.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>

                    <span className="text-stone-500">Annualized Investment Yield:</span>
                    <span className="text-right font-mono font-bold text-stone-900">
                      {economics.investmentYield.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 pt-1 border-t border-amber-200">
                    *100% exempt from state and local income tax. Full par amount credited on {selectedBillForTender.maturityDate}.
                  </div>
                </div>

                {/* Funding Source Account */}
                <div>
                  <label className="block font-semibold text-stone-900 mb-1">
                    Select Funding Account:
                  </label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    {userData.accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.accountNumber}) — Available: $
                        {acc.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Auto-Roll Reinvestment Option */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRoll}
                      onChange={(e) => setAutoRoll(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-[#d71e28] rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-stone-900 block">
                        Enable Auto-Roll (Automatic Reinvestment)
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        When this Treasury Bill matures on {selectedBillForTender.maturityDate}, automatically tender a new {selectedBillForTender.term} bill without leaving idle cash. You can turn this off anytime.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Error Banner if any */}
                {tenderError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{tenderError}</span>
                  </div>
                )}

                {/* Disclosures & Action */}
                <div className="pt-2 border-t border-stone-200 space-y-3">
                  <div className="text-[10px] text-stone-500 leading-relaxed">
                    By submitting this tender, you authorize Wells Fargo Clearing Services, LLC (WFCS) to submit a non-competitive or competitive auction bid on your behalf to the Federal Reserve Bank. Funds equal to the discounted purchase price will be debited upon settlement on {selectedBillForTender.issueDate}.
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsTenderModalOpen(false)}
                      className="px-4 py-2 border border-stone-300 rounded-full font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitTender}
                      className="bg-[#d71e28] hover:bg-[#b81620] text-white font-bold px-6 py-2 rounded-full transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Appear for Auction / Submit Tender</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
