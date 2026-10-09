import React, { useState } from 'react';
import { Plus, Smartphone, Dumbbell, Zap, Home, Wifi, Check, X, ArrowRight } from 'lucide-react';
import { SetAsideBill } from '../../types/banking';

interface SetAsideTabProps {
  bills: SetAsideBill[];
  checkingBalance: number;
  onPayBill: (billId: string, amount: number) => void;
  onAddFundsToBill: (billId: string, amount: number) => void;
  onAddBill: (newBill: SetAsideBill) => void;
}

export const SetAsideTab: React.FC<SetAsideTabProps> = ({
  bills,
  checkingBalance,
  onPayBill,
  onAddFundsToBill,
  onAddBill,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [newBillDays, setNewBillDays] = useState('7');
  const [newBillIcon, setNewBillIcon] = useState<'phone' | 'gym' | 'electric' | 'rent' | 'internet' | 'custom'>('custom');
  const [paidNotification, setPaidNotification] = useState<string | null>(null);

  const getBillIcon = (iconType: SetAsideBill['icon']) => {
    switch (iconType) {
      case 'phone':
        return <Smartphone className="w-5 h-5 text-stone-600" />;
      case 'gym':
        return <Dumbbell className="w-5 h-5 text-stone-600" />;
      case 'electric':
        return <Zap className="w-5 h-5 text-stone-600" />;
      case 'rent':
        return <Home className="w-5 h-5 text-stone-600" />;
      case 'internet':
        return <Wifi className="w-5 h-5 text-stone-600" />;
      default:
        return <Smartphone className="w-5 h-5 text-stone-600" />;
    }
  };

  const handlePay = (bill: SetAsideBill) => {
    onPayBill(bill.id, bill.totalAmount);
    setPaidNotification(`Paid $${bill.totalAmount.toFixed(2)} for ${bill.name}!`);
    setTimeout(() => setPaidNotification(null), 3000);
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newBillAmount);
    if (!newBillName.trim() || !amt || amt <= 0) return;

    const days = parseInt(newBillDays, 10) || 5;
    const now = new Date();
    now.setDate(now.getDate() + days);

    const newBill: SetAsideBill = {
      id: `bill-${Date.now()}`,
      name: newBillName,
      icon: newBillIcon,
      status: 'saving',
      totalAmount: amt,
      savedAmount: 0,
      daysRemaining: days,
      dueDate: now.toLocaleDateString('en-US'),
    };

    onAddBill(newBill);
    setShowAddModal(false);
    setNewBillName('');
    setNewBillAmount('');
  };

  return (
    <div className="bg-white min-h-[550px] p-4 sm:p-5 relative">
      {/* Title */}
      <div className="text-center pt-1 pb-4">
        <h2 className="font-serif text-2xl text-stone-800 tracking-wide font-normal">Set Aside</h2>
        <p className="text-[11px] text-stone-500 mt-0.5">
          Automatic envelopes for your upcoming bills
        </p>
      </div>

      {paidNotification && (
        <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3 py-2 rounded-lg flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{paidNotification}</span>
          </div>
          <button onClick={() => setPaidNotification(null)}>
            <X className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>
      )}

      {/* Bills Header row with red plus icon matching screenshot */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <span className="text-base font-medium text-stone-700">Bills</span>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-[#d71e28] hover:text-[#b81620] p-1 rounded-full hover:bg-stone-50 transition-colors"
          title="Add Bill"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Bills List matching Set_Aside.jpg */}
      <div className="divide-y divide-stone-100">
        {bills.map((bill) => {
          const percent = Math.min(100, Math.round((bill.savedAmount / bill.totalAmount) * 100));
          const isReady = bill.savedAmount >= bill.totalAmount;

          return (
            <div key={bill.id} className="py-4 space-y-2">
              {/* Row info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center bg-white shadow-2xs">
                    {getBillIcon(bill.icon)}
                  </div>
                  <span className="text-base font-normal text-stone-900">{bill.name}</span>
                </div>

                <div className="text-right">
                  {isReady ? (
                    <div>
                      <span className="text-[11px] font-bold text-stone-800 uppercase tracking-tight block">
                        READY TO PAY
                      </span>
                      <span className="text-xs text-stone-700 font-medium">
                        ${bill.totalAmount.toFixed(2)} in {bill.daysRemaining} days
                      </span>
                    </div>
                  ) : bill.status === 'scheduled' ? (
                    <div>
                      <span className="text-[11px] font-bold text-stone-800 uppercase tracking-tight block">
                        SCHEDULED TO PAY
                      </span>
                      <span className="text-xs text-stone-700 font-medium">
                        ${bill.totalAmount.toFixed(2)} in {bill.daysRemaining} days
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs text-stone-500 font-normal">I need</span>
                      <span className="text-sm font-semibold text-stone-900 tabular-nums ml-1">
                        ${bill.totalAmount.toFixed(2)}
                      </span>
                      <span className="text-xs text-stone-600 block">in {bill.daysRemaining} days</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Gradient Progress Bar */}
              <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden relative shadow-inner">
                <div
                  className="h-full bg-wf-gradient rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Saved amount tag / Pay Now button */}
              <div className="flex items-center justify-between pt-1">
                {percent > 0 && percent < 100 ? (
                  <span className="text-xs font-semibold text-stone-700 tabular-nums">
                    ${bill.savedAmount.toFixed(2)} set aside
                  </span>
                ) : percent === 0 ? (
                  <span className="text-xs text-stone-400">$0.00 allocated</span>
                ) : (
                  <span className="text-xs text-emerald-700 font-semibold">Fully funded</span>
                )}

                {/* If ready to pay, show the red outlined button as in screenshot */}
                {isReady && (
                  <button
                    onClick={() => handlePay(bill)}
                    className="border-2 border-[#d71e28] text-[#d71e28] hover:bg-[#d71e28] hover:text-white px-6 py-1 rounded-full text-xs font-bold transition-all shadow-xs"
                  >
                    Pay Now
                  </button>
                )}

                {/* If not fully funded, allow setting aside more from checking */}
                {!isReady && (
                  <button
                    onClick={() => onAddFundsToBill(bill.id, Math.min(25, bill.totalAmount - bill.savedAmount))}
                    className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    + Set aside $25
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-stone-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="font-semibold text-stone-900 text-sm">Add New Bill to Set Aside</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Bill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Water Bill, Car Insurance"
                  value={newBillName}
                  onChange={(e) => setNewBillName(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#d71e28]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Total Bill Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="85.00"
                  value={newBillAmount}
                  onChange={(e) => setNewBillAmount(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#d71e28]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Due In (Days)</label>
                <input
                  type="number"
                  value={newBillDays}
                  onChange={(e) => setNewBillDays(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#d71e28]"
                  min="1"
                  max="90"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Icon Category</label>
                <div className="flex gap-2">
                  {(['phone', 'electric', 'rent', 'gym', 'internet'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewBillIcon(cat)}
                      className={`p-2 rounded-lg border text-xs capitalize ${
                        newBillIcon === cat ? 'border-[#d71e28] bg-red-50 text-[#d71e28]' : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {getBillIcon(cat)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  Create Envelope
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
