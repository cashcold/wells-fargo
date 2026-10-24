import React, { useState } from 'react';
import { X, Search, Info, CheckCircle2, ChevronRight, Copy, Check, ArrowDownLeft, ArrowUpRight, Download, FileText, Printer } from 'lucide-react';
import { BankAccount, Transaction } from '../../types/banking';
import { downloadAccountStatementPdf, downloadTransactionReceiptPdf } from '../../utils/transactionPdfGenerator';
import { TransactionDetailModal } from '../common/TransactionDetailModal';

interface AccountDetailModalProps {
  account: BankAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onMakePayment?: (accountId: string, amount: number) => void;
  onToggleAutopay?: (accountId: string) => void;
  onOpenLoanConfig?: () => void;
  userName?: string;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  isOpen,
  onClose,
  onMakePayment,
  onToggleAutopay,
  onOpenLoanConfig,
  userName,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'manage' | 'details'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [customPayAmount, setCustomPayAmount] = useState('587.68');
  const [paySuccess, setPaySuccess] = useState(false);
  const [selectedTxForModal, setSelectedTxForModal] = useState<Transaction | null>(null);
  const [statementSuccess, setStatementSuccess] = useState(false);

  if (!isOpen || !account) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredTransactions = account.transactions.filter((tx) =>
    tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.amount.toString().includes(searchQuery)
  );

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(customPayAmount) || 0;
    if (amt > 0 && onMakePayment) {
      onMakePayment(account.id, amt);
      setPaySuccess(true);
      setTimeout(() => {
        setPaySuccess(false);
        setShowPayModal(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-200 animate-in fade-in duration-200">
        {/* Top Header bar with light sky background as in screenshot */}
        <div className="bg-[#eef2ff] px-5 py-4 border-b border-stone-200 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center pt-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              {account.name} {account.accountNumber}
            </span>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-3xl sm:text-4xl font-light text-stone-900 tabular-nums">
                ${(account.principalBalance || account.availableBalance).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-stone-600 mt-1">
              <span>{account.type === 'loan' ? 'Outstanding principal balance' : 'Available balance'}</span>
              <Info className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

          {/* Segmented control navigation */}
          <div className="flex items-center justify-around mt-4 pt-2 border-t border-stone-200 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 relative font-semibold transition-colors ${
                activeTab === 'overview' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`pb-2 relative font-semibold transition-colors ${
                activeTab === 'manage' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Manage
              {activeTab === 'manage' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 relative font-semibold transition-colors ${
                activeTab === 'details' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {account.type === 'loan' ? 'Loan details' : 'Account details'}
              {activeTab === 'details' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Next Payment Card (Exact matching aesqkbioflrf1.jpeg) */}
              {account.type === 'loan' && (
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-lg font-normal text-stone-900 mb-4">Next payment</h3>
                  
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center text-stone-800">
                      <span>Payment due {account.nextPaymentDue || '10/31/2026'}</span>
                      <span className="font-semibold tabular-nums text-base">
                        ${(account.nextPaymentAmount || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-stone-600 text-xs pl-2 border-l-2 border-stone-200">
                      <span>Principal and interest</span>
                      <span className="tabular-nums">${(account.principalAndInterest || 0).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-stone-600 text-xs pl-2 border-l-2 border-stone-200">
                      <span>Past due amount</span>
                      <span className="tabular-nums text-amber-700 font-medium">
                        ${(account.pastDueAmount || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-stone-900 font-semibold">
                      <span>Total amount due</span>
                      <span className="tabular-nums">${(account.totalAmountDue || 0).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-stone-600 text-xs pt-1">
                      <span>Autopay</span>
                      <span className={`font-semibold ${account.autopayEnabled ? 'text-emerald-700' : 'text-stone-700'}`}>
                        {account.autopayEnabled ? 'On (10/31/2026)' : 'Off'}
                      </span>
                    </div>
                  </div>

                  {/* Payment Buttons matching screenshot */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={() => onToggleAutopay && onToggleAutopay(account.id)}
                      className="border border-stone-800 text-stone-900 hover:bg-stone-50 text-sm font-medium py-2.5 px-4 rounded-full transition-colors text-center"
                    >
                      {account.autopayEnabled ? 'Turn Off Autopay' : 'Set up Autopay'}
                    </button>
                    <button
                      onClick={() => setShowPayModal(true)}
                      className="bg-[#2b2b2b] hover:bg-black text-white text-sm font-medium py-2.5 px-4 rounded-full transition-colors text-center shadow-xs"
                    >
                      Make payment
                    </button>
                  </div>

                  {onOpenLoanConfig && (
                    <button
                      onClick={onOpenLoanConfig}
                      className="w-full mt-3 bg-[#d71e28] hover:bg-[#b81620] text-white text-xs font-bold py-2.5 px-4 rounded-full transition-colors text-center shadow-xs"
                    >
                      Configure Loan Amount (Up to $100,000,000.00 USD)
                    </button>
                  )}
                </div>
              )}

              {/* Transactions List & PDF Statement Tools */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-normal text-stone-900">Transactions</h3>
                    <Info className="w-4 h-4 text-stone-400" />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        downloadAccountStatementPdf(account, userName || 'Account Holder');
                        setStatementSuccess(true);
                        setTimeout(() => setStatementSuccess(false), 2500);
                      }}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs border border-stone-200"
                      title="Download complete account activity statement in official PDF format"
                    >
                      <Download className="w-3.5 h-3.5 text-[#d71e28]" />
                      <span>Download Statement (PDF)</span>
                    </button>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs pl-8 pr-3 py-1.5 border border-stone-200 rounded-full w-24 focus:w-32 transition-all focus:outline-none focus:border-stone-400"
                      />
                    </div>
                  </div>
                </div>

                {statementSuccess && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg p-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Official Statement PDF downloaded to your device!</span>
                  </div>
                )}

                <div className="border-t border-stone-200 divide-y divide-stone-100">
                  {filteredTransactions.length === 0 ? (
                    <div className="py-6 text-center text-xs text-stone-500">
                      No matching transactions found.
                    </div>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => setSelectedTxForModal(tx)}
                        className="py-3 px-2 -mx-2 flex justify-between items-center rounded-lg hover:bg-stone-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex-1 pr-3">
                          <span className="text-[11px] text-stone-500 block mb-0.5">{tx.date}</span>
                          <span className="text-xs font-medium text-stone-900 uppercase tracking-tight group-hover:text-[#d71e28] transition-colors block">
                            {tx.description}
                          </span>
                          <span className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <span className="bg-stone-100 px-1.5 py-0.2 rounded text-stone-600">{tx.category || 'Banking'}</span>
                            <span>•</span>
                            <span className="text-[#d71e28] font-medium group-hover:underline">Click for PDF receipt & print</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`font-semibold text-sm tabular-nums ${
                              tx.type === 'credit' ? 'text-emerald-700' : 'text-stone-900'
                            }`}
                          >
                            {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadTransactionReceiptPdf(tx, account, userName || 'Account Holder');
                            }}
                            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-[#d71e28] transition-colors"
                            title="Download PDF Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-3">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Account Management</h4>
                <div className="divide-y divide-stone-200">
                  <div className="py-2.5 flex items-center justify-between text-xs">
                    <span className="text-stone-700">Autopay Enrollment</span>
                    <button
                      onClick={() => onToggleAutopay && onToggleAutopay(account.id)}
                      className="text-xs font-semibold text-[#d71e28] hover:underline"
                    >
                      {account.autopayEnabled ? 'Disable' : 'Enable Autopay'}
                    </button>
                  </div>
                  <div className="py-2.5 flex items-center justify-between text-xs">
                    <span className="text-stone-700">Paperless Statements</span>
                    <span className="text-emerald-700 font-medium">Enrolled</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between text-xs">
                    <span className="text-stone-700">Alerts & Notifications</span>
                    <span className="text-stone-500">SMS & Push enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="border border-stone-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Numbers & Identifiers</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Routing Number:</span>
                    <div className="flex items-center gap-1.5 font-mono font-medium text-stone-900">
                      <span>{account.routingNumber}</span>
                      <button
                        onClick={() => handleCopy(account.routingNumber, 'routing')}
                        className="p-1 hover:bg-stone-100 rounded text-stone-500"
                        title="Copy routing number"
                      >
                        {copiedField === 'routing' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Account Number:</span>
                    <div className="flex items-center gap-1.5 font-mono font-medium text-stone-900">
                      <span>{account.accountNumber}</span>
                      <button
                        onClick={() => handleCopy(account.accountNumber, 'account')}
                        className="p-1 hover:bg-stone-100 rounded text-stone-500"
                        title="Copy account number"
                      >
                        {copiedField === 'account' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Account Type:</span>
                    <span className="capitalize font-medium text-stone-900">{account.type}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Financial Institution:</span>
                    <span className="font-medium text-stone-900">Wells Fargo Bank, N.A.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Make Payment */}
        {showPayModal && (
          <div className="absolute inset-0 bg-white z-20 p-6 flex flex-col justify-between animate-in slide-in-from-bottom duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-semibold text-stone-900 text-base">Make a Payment</h3>
                <button
                  onClick={() => setShowPayModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {paySuccess ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-stone-900">Payment Submitted!</h4>
                  <p className="text-xs text-stone-600">
                    Your payment of ${parseFloat(customPayAmount).toFixed(2)} has been scheduled.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleExecutePayment} className="mt-4 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Pay From</label>
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs">
                      <span className="font-semibold text-stone-900 block">EVERYDAY CHECKING ..0987</span>
                      <span className="text-stone-500">Available balance: $2,500,000.00</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Payment Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={customPayAmount}
                      onChange={(e) => setCustomPayAmount(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-base font-semibold text-stone-900 focus:outline-none focus:border-[#d71e28]"
                      required
                    />
                  </div>

                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCustomPayAmount('587.68')}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-medium"
                    >
                      Total Due ($587.68)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomPayAmount('100.00')}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-medium"
                    >
                      $100.00
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomPayAmount('350.00')}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-medium"
                    >
                      $350.00
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-3 rounded-lg text-sm font-semibold transition-colors mt-6 shadow-sm"
                  >
                    Submit Payment
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Transaction Receipt & Print Modal */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTxForModal)}
        onClose={() => setSelectedTxForModal(null)}
        transaction={selectedTxForModal}
        account={account}
        userName={userName || 'Account Holder'}
      />
    </div>
  );
};
