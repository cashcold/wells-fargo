import React, { useState } from 'react';
import { Check, ArrowRight, FileText, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { SignatureCardModal } from '../portal/SignatureCardModal';
import { downloadSignatureCardPdf } from '../../utils/pdfGenerator';

interface AccountOpenFlowProps {
  onContinue: () => void;
  customerName?: string;
}

export const AccountOpenFlow: React.FC<AccountOpenFlowProps> = ({ onContinue, customerName = 'Account Holder' }) => {
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  return (
    <div className="bg-white min-h-[580px] flex flex-col justify-between">
      {/* Wells Fargo Red Top Bar with Yellow Underline (matching screenshot 31829E33) */}
      <div>
        <div className="bg-[#d71e28] text-white py-3 text-center border-b-4 border-[#ffcc00] shadow-sm">
          <span className="font-serif font-black text-xl tracking-widest uppercase">
            WELLS FARGO
          </span>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 max-w-lg mx-auto space-y-6">
          <div className="text-center pt-2">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#d71e28] font-normal tracking-tight">
              Your Account Is Open!
            </h1>
            <h2 className="text-lg text-stone-800 font-normal mt-2">
              Wells Fargo Everyday Checking
            </h2>
          </div>

          {/* Routing & Account Number */}
          <div className="flex justify-around items-center pt-1 text-center">
            <div>
              <div className="text-base font-semibold text-stone-900 font-mono">061000227</div>
              <div className="text-xs text-stone-500">Routing Number</div>
            </div>
            <div>
              <div className="text-base font-semibold text-stone-900 font-mono">•••• 5821</div>
              <div className="text-xs text-stone-500">Account Number</div>
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={() => {
                downloadSignatureCardPdf({ c1FullName: customerName, accountType: 'Wells Fargo Everyday Checking' } as any, customerName);
                try {
                  window.print();
                } catch (e) {}
              }}
              className="text-xs text-[#2853a8] hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          {/* Application Status Card with Green Checkmark */}
          <div className="border border-stone-400/80 rounded-sm p-4 flex items-center gap-4 bg-white shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-[#168843] flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white stroke-[3.5]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Application status</h3>
              <p className="text-xs text-stone-600">Signed and complete</p>
            </div>
          </div>

          {/* Description Text */}
          <p className="text-xs text-stone-700 leading-relaxed">
            Next, sign on to Wells Fargo Online<sup>®</sup> to access your account and select a PIN for your new card. If you don't create your PIN now, expect one in the mail a couple days after your card arrives.
          </p>

          {/* Continue Red Button */}
          <div className="pt-1 text-center">
            <button
              onClick={onContinue}
              className="w-full sm:w-64 bg-[#d71e28] hover:bg-[#b81620] text-white font-medium py-3 rounded-full text-sm transition-colors shadow-sm"
            >
              Continue
            </button>
          </div>

          {/* Offer Status */}
          <div className="pt-2 text-xs text-stone-800">
            <span className="font-bold">Offer status:</span> Your bonus offer code <span className="font-semibold font-mono">JA23OU</span> has been linked to this application.
          </div>

          {/* What's next Section with Yellow bar */}
          <div className="pt-4">
            <div className="border-b-2 border-[#ffcc00] pb-1 mb-4">
              <h3 className="font-bold text-base text-stone-900">What's next</h3>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-100 border border-stone-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <span className="font-semibold text-stone-900">Fund your new account</span>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Transfer from another bank or deposit a paper check using Mobile Deposit.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-100 border border-stone-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <span className="font-semibold text-stone-900">Set up Direct Deposit</span>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Receive your qualifying direct deposits to earn your $325 bonus reward.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-100 border border-stone-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <span className="font-semibold text-stone-900">Your contactless debit card</span>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Your card will arrive by mail in 5–7 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* View Signed Application Card Link */}
            <div className="mt-5 pt-3 border-t border-stone-100 text-center">
              <button
                onClick={() => setShowSignatureModal(true)}
                className="text-xs text-stone-600 hover:text-[#d71e28] inline-flex items-center gap-1 font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-[#d71e28]" />
                <span>View Consumer Account Application (Signature Card)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <SignatureCardModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        customerName={customerName}
      />
    </div>
  );
};
