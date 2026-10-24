import React, { useState } from 'react';
import { ArrowLeftRight, Send, CheckCircle2, ChevronRight, User, ShieldCheck } from 'lucide-react';
import { BankAccount } from '../../types/banking';

interface PayTransferTabProps {
  accounts: BankAccount[];
  onExecuteTransfer: (fromId: string, toId: string, amount: number, memo: string) => void;
}

export const PayTransferTab: React.FC<PayTransferTabProps> = ({ accounts, onExecuteTransfer }) => {
  const [transferType, setTransferType] = useState<'internal' | 'zelle'>('internal');
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || '');
  const [amount, setAmount] = useState('50.00');
  const [memo, setMemo] = useState('');
  
  // Zelle state
  const [recipient, setRecipient] = useState('');
  const [zelleAmount, setZelleAmount] = useState('25.00');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fromAccount = accounts.find((a) => a.id === fromAccountId) || accounts[0];
  const toAccount = accounts.find((a) => a.id === toAccountId) || accounts[1];

  const handleInternalTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || fromAccountId === toAccountId) return;

    onExecuteTransfer(fromAccountId, toAccountId, amt, memo || 'Internal Account Transfer');
    setSuccessMessage(`Transferred $${amt.toFixed(2)} from ${fromAccount.name} to ${toAccount.name}`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleZelleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(zelleAmount);
    if (!amt || amt <= 0 || !recipient.trim()) return;

    onExecuteTransfer(fromAccountId, 'zelle-recipient', amt, `Zelle to ${recipient}`);
    setSuccessMessage(`Sent $${amt.toFixed(2)} with Zelle® to ${recipient}!`);
    setRecipient('');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="bg-white min-h-[520px] p-4 sm:p-5">
      <div className="text-center pb-4 border-b border-stone-100">
        <h2 className="text-lg font-normal text-stone-900">Pay & Transfer</h2>
        <div className="flex justify-center gap-2 mt-3">
          <button
            onClick={() => setTransferType('internal')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              transferType === 'internal'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Between Accounts
          </button>
          <button
            onClick={() => setTransferType('zelle')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              transferType === 'zelle'
                ? 'bg-[#7414CA] text-white shadow-xs'
                : 'bg-purple-50 text-[#7414CA] hover:bg-purple-100'
            }`}
          >
            <span className="font-bold">zelle</span>®
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="my-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {transferType === 'internal' ? (
        <form onSubmit={handleInternalTransfer} className="mt-4 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block mb-1">From</label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#d71e28]"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} {a.accountNumber} (${a.availableBalance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center my-1">
            <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block mb-1">To</label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#d71e28]"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id} disabled={a.id === fromAccountId}>
                  {a.name} {a.accountNumber} {a.type === 'loan' ? `(Due $${((a.totalAmountDue ?? a.nextPaymentAmount) || 0).toFixed(2)})` : `($${a.availableBalance.toFixed(2)})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-lg font-bold border border-stone-300 rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#d71e28] tabular-nums"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block mb-1">Memo (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Savings contribution, Loan payoff"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full text-xs border border-stone-300 rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#d71e28]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-3 rounded-full text-xs font-bold transition-colors shadow-sm mt-4"
          >
            Review & Transfer
          </button>
        </form>
      ) : (
        <form onSubmit={handleZelleSend} className="mt-4 space-y-4">
          <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#7414CA] flex items-center justify-center text-white shrink-0 font-bold text-xs">
              Z
            </div>
            <div>
              <span className="text-xs font-bold text-purple-950 block">Send money with Zelle®</span>
              <span className="text-[11px] text-purple-800">Fast, safe and free right from your account</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block mb-1">
              Recipient Email or U.S. Mobile Phone
            </label>
            <input
              type="text"
              placeholder="name@example.com or 555-0192"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full text-xs border border-stone-300 rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#7414CA]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={zelleAmount}
              onChange={(e) => setZelleAmount(e.target.value)}
              className="w-full text-lg font-bold border border-stone-300 rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#7414CA] tabular-nums"
              required
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Funds typically available within minutes</span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#7414CA] hover:bg-[#5e0ea6] text-white py-3 rounded-full text-xs font-bold transition-colors shadow-sm mt-4 flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send ${parseFloat(zelleAmount || '0').toFixed(2)} with Zelle</span>
          </button>
        </form>
      )}
    </div>
  );
};
