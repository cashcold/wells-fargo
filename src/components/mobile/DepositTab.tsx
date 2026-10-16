import React, { useState } from 'react';
import { Camera, CheckCircle, Info, ChevronDown, Check, RefreshCw, Clock, ShieldCheck } from 'lucide-react';
import { BankAccount, CheckDepositRecord } from '../../types/banking';

interface DepositTabProps {
  accounts: BankAccount[];
  userName?: string;
  userId?: string;
  onDepositComplete: (record: CheckDepositRecord) => void;
  onOpenAdminPortal?: () => void;
}

export const DepositTab: React.FC<DepositTabProps> = ({
  accounts,
  userName = 'Account Holder',
  userId = 'usr-demo-01',
  onDepositComplete,
  onOpenAdminPortal,
}) => {
  const eligibleAccounts = accounts.filter((a) => a.type === 'checking' || a.type === 'savings');
  const [selectedAccountId, setSelectedAccountId] = useState(eligibleAccounts[0]?.id || '');
  const [amount, setAmount] = useState('250.00');
  const [hasFrontPhoto, setHasFrontPhoto] = useState(false);
  const [hasBackPhoto, setHasBackPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<CheckDepositRecord | null>(null);

  const selectedAccount = eligibleAccounts.find((a) => a.id === selectedAccountId) || eligibleAccounts[0] || {
    id: 'checking-0987',
    name: 'EVERYDAY CHECKING',
    accountNumber: '..0987',
    availableBalance: 0,
  };

  const handleCaptureFront = () => {
    setHasFrontPhoto(true);
  };

  const handleCaptureBack = () => {
    setHasBackPhoto(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) return;

    setIsSubmitting(true);

    try {
      // Real API call to post deposit to database with PENDING status
      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          targetAccountId: selectedAccount.id,
          targetAccountName: selectedAccount.name,
          amount: depositAmount,
          frontImage: 'captured_front',
          backImage: 'captured_back',
        }),
      });

      const data = await res.json();
      const confirmationNumber = data.deposit?.confirmationNumber || `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;

      const now = new Date();
      const record: CheckDepositRecord = {
        id: data.deposit?.id || `dep-${Date.now()}`,
        confirmationNumber,
        date:
          now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }) +
          ' at ' +
          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) +
          ' PT',
        targetAccountId: selectedAccount.id,
        amount: depositAmount,
        frontImage: 'captured_front',
        backImage: 'captured_back',
        status: 'submitted', // PENDING review
        creditDate: 'Pending Admin Approval',
        availableTodayAmount: 0.00, // Not credited until approved by admin portal!
      };

      setSubmittedRecord(record);
      onDepositComplete(record);
    } catch (err) {
      console.error('Failed to submit deposit API:', err);
      // Fallback local record
      const now = new Date();
      const record: CheckDepositRecord = {
        id: `dep-${Date.now()}`,
        confirmationNumber: `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
        date: now.toLocaleDateString('en-US') + ' at ' + now.toLocaleTimeString('en-US') + ' PT',
        targetAccountId: selectedAccount.id,
        amount: depositAmount,
        frontImage: 'captured_front',
        backImage: 'captured_back',
        status: 'submitted',
        creditDate: 'Pending Admin Approval',
        availableTodayAmount: 0.00,
      };
      setSubmittedRecord(record);
      onDepositComplete(record);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRecord(null);
    setAmount('250.00');
    setHasFrontPhoto(false);
    setHasBackPhoto(false);
  };

  // SUCCESS CONFIRMATION SCREEN: Pending Bank Operations Review
  if (submittedRecord) {
    return (
      <div className="p-6 bg-white min-h-[500px] flex flex-col justify-between animate-in fade-in duration-200">
        <div className="text-center pt-4">
          <div className="flex items-center justify-center gap-1.5 mb-6">
            <h2 className="text-lg font-normal text-stone-900">Mobile Check Deposit</h2>
            <Info className="w-4 h-4 text-stone-400" />
          </div>

          {/* Pending Amber Review Circle */}
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-amber-100">
            <Clock className="w-11 h-11 text-white stroke-[2.5]" />
          </div>

          <span className="bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-3">
            Pending Admin Approval
          </span>

          <p className="text-sm font-semibold text-stone-900 max-w-xs mx-auto">
            Your deposit was submitted on {submittedRecord.date}.
          </p>
          <p className="text-xs text-stone-600 mt-1 font-mono">
            Confirmation Number: {submittedRecord.confirmationNumber}
          </p>

          <div className="mt-6 border-t border-stone-200 pt-5 max-w-xs mx-auto space-y-2.5 text-xs text-stone-700">
            <div className="flex justify-between">
              <span className="uppercase tracking-wider text-stone-500">To Account</span>
              <span className="font-semibold text-stone-900">
                {selectedAccount.name} {selectedAccount.accountNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase tracking-wider text-stone-500">Deposit Amount</span>
              <span className="font-bold text-stone-900 tabular-nums">
                ${submittedRecord.amount.toFixed(2)} USD
              </span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase tracking-wider text-stone-500">Review Status</span>
              <span className="font-semibold text-amber-700">Awaiting Admin Verification</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase tracking-wider text-stone-500">Available Balance Credit</span>
              <span className="font-semibold text-stone-500 italic">
                Credited upon Admin Approval
              </span>
            </div>
          </div>

          {/* Admin Verification Notice & Fast Access */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs max-w-sm mx-auto space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Admin Operations Approval Required</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              In accordance with Wells Fargo security guidelines, all check deposits are held in queue until approved by bank operations. Once approved, the funds will immediately credit to your available balance.
            </p>
            {onOpenAdminPortal && (
              <button
                type="button"
                onClick={onOpenAdminPortal}
                className="w-full mt-1 bg-[#1c1917] hover:bg-black text-amber-300 py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Admin Portal to Approve Deposit</span>
              </button>
            )}
          </div>
        </div>

        <div className="pt-6 pb-2">
          <button
            onClick={handleReset}
            className="w-full border border-stone-800 text-stone-900 hover:bg-stone-50 font-medium py-3 rounded-full text-sm transition-colors text-center cursor-pointer"
          >
            Deposit another check
          </button>
        </div>
      </div>
    );
  }

  // DEPOSIT FORM
  return (
    <div className="p-4 sm:p-5 bg-white min-h-[520px]">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-normal text-stone-900">Mobile Check Deposit</h2>
          <Info className="w-4 h-4 text-stone-400" />
        </div>
        {onOpenAdminPortal && (
          <button
            type="button"
            onClick={onOpenAdminPortal}
            className="text-[11px] text-[#d71e28] hover:underline font-semibold flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Approvals Portal</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-6">
        {/* Account Selection */}
        <div>
          <label className="text-[11px] text-stone-500 font-medium uppercase tracking-wider block mb-1">To</label>
          <div className="relative">
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl p-3 pr-8 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#d71e28]"
            >
              {eligibleAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} {acc.accountNumber} — Available ${acc.availableBalance.toFixed(2)}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Deposit Amount */}
        <div className="text-center pt-2">
          <label className="text-[11px] text-stone-500 uppercase tracking-wider font-medium block mb-1">Amount</label>
          <div className="relative inline-flex items-center justify-center">
            <span className="text-3xl sm:text-4xl font-light text-stone-400 mr-0.5">$</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const clean = e.target.value.replace(/[^0-9.]/g, '');
                setAmount(clean);
              }}
              className="text-3xl sm:text-4xl font-light text-stone-900 tabular-nums w-44 sm:w-56 text-center bg-transparent border-b-2 border-stone-300 focus:border-[#d71e28] focus:outline-none"
              placeholder="0.00"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex justify-center gap-2 mt-3">
            {['100.00', '250.00', '500.00', '1000.00'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  amount === val ? 'bg-[#2b2b2b] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                ${val}
              </button>
            ))}
          </div>

          <div className="mt-2.5 text-[11px] text-stone-500 space-y-0.5">
            <p>Deposits are reviewed and approved by Bank Operations</p>
            <p>Daily limit $5,000.00 • 30-day limit $15,000.00</p>
          </div>
        </div>

        {/* Check Photos Section */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-semibold text-stone-700">Photos</span>
            <Info className="w-3.5 h-3.5 text-stone-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Front of Check */}
            <div
              onClick={handleCaptureFront}
              className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center min-h-[96px] text-center transition-all ${
                hasFrontPhoto
                  ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 shadow-xs'
                  : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-600'
              }`}
            >
              {hasFrontPhoto ? (
                <div className="w-full">
                  <div className="bg-amber-100 border border-amber-300 rounded p-1.5 text-left text-[9px] font-mono text-stone-800 shadow-inner">
                    <div className="flex justify-between border-b border-amber-200 pb-0.5 mb-1">
                      <span className="font-serif font-bold text-[#d71e28]">WELLS FARGO</span>
                      <span className="font-bold">${amount}</span>
                    </div>
                    <div className="text-[8px] text-stone-500">Pay to the order of: {userName}</div>
                    <div className="mt-1 flex items-center justify-between text-[7px] text-stone-400">
                      <span>⑆061000227⑆</span>
                      <span>0987654321098⑈</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 mt-1 inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> Front captured
                  </span>
                </div>
              ) : (
                <>
                  <Camera className="w-5 h-5 text-stone-400 mb-1" />
                  <span className="text-xs font-medium text-stone-600">Front of check</span>
                </>
              )}
            </div>

            {/* Back of Check */}
            <div
              onClick={handleCaptureBack}
              className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center min-h-[96px] text-center transition-all ${
                hasBackPhoto
                  ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 shadow-xs'
                  : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-600'
              }`}
            >
              {hasBackPhoto ? (
                <div className="w-full">
                  <div className="bg-stone-100 border border-stone-300 rounded p-1.5 text-left text-[8px] font-mono text-stone-700 shadow-inner">
                    <div className="border-b border-dashed border-stone-400 pb-1 mb-1">
                      <span className="italic font-serif text-[9px] text-blue-900">{userName}</span>
                    </div>
                    <span className="text-[7px] text-stone-500 block leading-tight">
                      FOR WELLS FARGO MOBILE DEPOSIT ONLY
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 mt-1 inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> Back endorsed
                  </span>
                </div>
              ) : (
                <>
                  <Camera className="w-5 h-5 text-stone-400 mb-1" />
                  <span className="text-xs font-medium text-stone-600">Back of check</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <button
            type="button"
            onClick={handleReset}
            className="border border-stone-800 text-stone-900 hover:bg-stone-50 font-medium py-3 rounded-full text-xs transition-colors text-center cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`font-semibold py-3 rounded-full text-xs transition-all text-center shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
              hasFrontPhoto && hasBackPhoto
                ? 'bg-[#2b2b2b] hover:bg-black text-white'
                : 'bg-stone-200 text-stone-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting for Review...</span>
              </>
            ) : (
              'Submit Deposit for Review'
            )}
          </button>
        </div>

        {(!hasFrontPhoto || !hasBackPhoto) && (
          <p className="text-[11px] text-center text-amber-700 font-medium">
            Tap both check boxes above to capture/simulate check front and endorsed back.
          </p>
        )}
      </form>
    </div>
  );
};
