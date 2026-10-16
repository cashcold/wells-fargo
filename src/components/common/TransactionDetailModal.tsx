import React, { useState } from 'react';
import { X, Download, Printer, ShieldCheck, ArrowDownLeft, ArrowUpRight, FileText, CheckCircle2 } from 'lucide-react';
import { BankAccount, Transaction } from '../../types/banking';
import { downloadTransactionReceiptPdf, printTransactionReceiptDirect, downloadAccountStatementPdf } from '../../utils/transactionPdfGenerator';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  account: BankAccount | null;
  userName: string;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
  account,
  userName,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !transaction || !account) return null;

  const isCredit = transaction.type === 'credit';
  const refCode = `WF-${(Math.abs(hashString(transaction.id + transaction.date)) % 9000000000 + 1000000000)}`;

  const handleDownloadPdf = () => {
    downloadTransactionReceiptPdf(transaction, account, userName);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handlePrint = () => {
    printTransactionReceiptDirect(transaction, account, userName);
  };

  const handleDownloadFullStatement = () => {
    downloadAccountStatementPdf(account, userName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-150">
        {/* Top Header with Wells Fargo Red */}
        <div className="bg-[#d71e28] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#ffcc00]" />
            <span className="font-serif font-black tracking-wider text-sm uppercase">
              WELLS FARGO
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/20 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accent gold line */}
        <div className="h-1 bg-[#ffcc00] w-full" />

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Amount and Status Hero */}
          <div className="text-center py-2 border-b border-stone-100">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Transaction Details & Receipt
            </span>
            <div className="flex items-center justify-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-700'
                }`}
              >
                {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
              </div>
              <span
                className={`text-3xl font-bold tabular-nums tracking-tight ${
                  isCredit ? 'text-emerald-700' : 'text-stone-900'
                }`}
              >
                {isCredit ? '+' : '-'}${transaction.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 mt-2 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Posted & Cleared</span>
            </div>
          </div>

          {/* Details List */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 divide-y divide-stone-200 text-xs">
            <div className="py-2 flex justify-between items-center">
              <span className="text-stone-500 font-medium">Description</span>
              <span className="text-stone-900 font-semibold text-right max-w-[200px] truncate">
                {transaction.description}
              </span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span className="text-stone-500 font-medium">Date Posted</span>
              <span className="text-stone-900 font-medium">{transaction.date}</span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span className="text-stone-500 font-medium">Account</span>
              <span className="text-stone-900 font-medium">
                {account.name} {account.accountNumber}
              </span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span className="text-stone-500 font-medium">Category</span>
              <span className="bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-700 font-medium">
                {transaction.category || 'Banking Service'}
              </span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span className="text-stone-500 font-medium">Confirmation Ref</span>
              <span className="text-stone-700 font-mono text-[11px]">{refCode}</span>
            </div>
          </div>

          {/* Success Toast */}
          {downloadSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg p-2.5 flex items-center justify-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>PDF downloaded successfully to your device!</span>
            </div>
          )}

          {/* Primary Action Buttons (Download PDF and Print) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleDownloadPdf}
              className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 px-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full border border-stone-300 hover:bg-stone-50 text-stone-800 py-2.5 px-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>Print / Save</span>
            </button>
          </div>

          {/* Download Full Statement Link */}
          <div className="text-center pt-1 border-t border-stone-100">
            <button
              onClick={handleDownloadFullStatement}
              className="inline-flex items-center gap-1.5 text-xs text-[#d71e28] hover:text-[#9b131c] font-semibold hover:underline cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Full Account Statement (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
