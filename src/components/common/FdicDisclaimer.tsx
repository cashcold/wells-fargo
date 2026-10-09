import React from 'react';
import { Home } from 'lucide-react';

export const FdicDisclaimer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className={`text-stone-600 text-xs ${compact ? 'py-4' : 'py-8'}`}>
      <div className="border border-stone-300 bg-stone-50 p-4 rounded-xs mb-4">
        <h4 className="font-semibold text-stone-900 mb-1">Investment and Insurance Products are:</h4>
        <ul className="list-disc list-inside space-y-0.5 text-stone-700">
          <li>Not Insured by the FDIC or Any Federal Government Agency</li>
          <li>Not a Deposit or Other Obligation of, or Guaranteed by, the Bank or Any Bank Affiliate</li>
          <li>Subject to Investment Risks, Including Possible Loss of the Principal Amount Invested</li>
        </ul>
      </div>

      <div className="space-y-2 text-[11px] text-stone-500 leading-relaxed">
        <p>
          Deposit products offered by Wells Fargo Bank, N.A. Member FDIC.
        </p>
        <div className="flex items-center gap-1 text-stone-600 font-medium">
          <Home className="w-3.5 h-3.5" />
          <span>Equal Housing Lender</span>
        </div>
        <p>
          © 2026 Wells Fargo. NMLSR ID 399801. All rights reserved.
        </p>
      </div>
    </div>
  );
};
