import React, { useState } from 'react';
import { X, Send, PieChart, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { UserProfile } from '../../types/banking';

interface AskFargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfile;
  onNavigateToTab: (tab: string) => void;
}

interface Message {
  id: string;
  sender: 'fargo' | 'user';
  text: string;
  action?: { label: string; tab: string };
}

export const AskFargoModal: React.FC<AskFargoModalProps> = ({
  isOpen,
  onClose,
  userData,
  onNavigateToTab,
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'chat'>('insights');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'fargo',
      text: `Hello ${userData.name}! I'm Fargo, your Wells Fargo virtual assistant. I can help analyze your spending, show your account routing numbers, configure loans (from $700 up to $100M), or guide you through mobile check deposits.`,
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: String(Date.now()), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const checking = userData.accounts.find((a) => a.type === 'checking')?.availableBalance || 4289.4;
      const savings = userData.accounts.find((a) => a.type === 'savings')?.availableBalance || 18450;
      const total = userData.accounts.reduce(
        (acc, a) => acc + (a.type !== 'loan' && a.type !== 'credit' ? a.availableBalance : 0),
        0
      );

      const response = await fetch('/api/fargo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userContext: {
            name: userData.name,
            checkingBalance: checking.toLocaleString('en-US', { minimumFractionDigits: 2 }),
            savingsBalance: savings.toLocaleString('en-US', { minimumFractionDigits: 2 }),
            totalBalance: total.toLocaleString('en-US', { minimumFractionDigits: 2 }),
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: 'fargo',
            text: data.reply,
            action: data.action,
          },
        ]);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Serverless Fargo endpoint offline, using local fallback:', err);
    }

    // Local fallback
    setTimeout(() => {
      let reply: Message;
      const lower = text.toLowerCase();

      if (lower.includes('routing') || lower.includes('account number')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'fargo',
          text: `Your Wells Fargo routing number is 061000227. Your Everyday Checking account ends in 0987 and Way2Save ends in 3478.`,
          action: { label: 'View Accounts', tab: 'accounts' },
        };
      } else if (lower.includes('deposit') || lower.includes('check')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'fargo',
          text: `You can deposit paper checks in seconds using Wells Fargo Mobile Deposit! Your daily limit is $5,000.00 and 30-day limit is $15,000.00.`,
          action: { label: 'Open Mobile Deposit', tab: 'deposit' },
        };
      } else if (lower.includes('bill') || lower.includes('set aside') || lower.includes('rent') || lower.includes('pay')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'fargo',
          text: `You currently have 5 bills in Set Aside. Your Phone bill ($89.00) is ready to pay in 1 day, and Gym Membership ($45.00) is scheduled in 3 days.`,
          action: { label: 'Go to Set Aside', tab: 'set-aside' },
        };
      } else if (lower.includes('loan') || lower.includes('borrow') || lower.includes('limit') || lower.includes('credit line')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'fargo',
          text: `You can configure loan amounts starting from $700.00 USD up to our highest allowable facility of $100,000,000.00 USD (100 Million) with instant Truth-in-Lending PDF generation!`,
          action: { label: 'Configure Loans', tab: 'loans' },
        };
      } else if (lower.includes('fico') || lower.includes('credit score')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'fargo',
          text: `Your FICO® Score is 785 (Excellent). It increased by 10 points on 04/19/2026. Keep up the consistent on-time payments!`,
        };
      } else if (lower.includes('spend') || lower.includes('balance')) {
        const total = userData.accounts.reduce(
          (acc, a) => acc + (a.type !== 'loan' && a.type !== 'credit' ? a.availableBalance : 0),
          0
        );
        reply = {
          id: String(Date.now() + 1),
          sender: 'fargo',
          text: `Your total liquid balance across checking and savings is $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}. This month's largest expenditure was Bills & Utilities at $890.00.`,
        };
      } else {
        reply = {
          id: String(Date.now() + 1),
          sender: 'fargo',
          text: `I'm happy to help with that! You can check your account balances, transfer funds, configure loans from $700 to $100M, or deposit a check anytime.`,
          action: { label: 'Review Accounts', tab: 'accounts' },
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-inner text-white font-bold text-base">
              f
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base tracking-tight">Ask Fargo®</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-purple-100 font-medium">Virtual Assistant</span>
              </div>
              <p className="text-[11px] text-purple-200">Insights into your spending & banking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-purple-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'insights'
                ? 'border-purple-700 text-purple-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Spending Insights</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-purple-700 text-purple-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chat with Fargo</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'insights' ? (
            <div className="space-y-5">
              <div className="text-center">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">March 1 – March 31, 2026</span>
                <h3 className="text-3xl font-bold text-stone-900 mt-1 tabular-nums">$1,725.34</h3>
                <p className="text-xs text-amber-600 font-medium mt-0.5">+$1,100.66 from February</p>
              </div>

              {/* Donut Chart representation */}
              <div className="relative flex justify-center py-2">
                <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
                  {/* Background Circle */}
                  <circle cx="90" cy="90" r="70" stroke="#f1f5f9" strokeWidth="22" fill="none" />
                  {/* Bills Segment: 51% (stroke-dasharray circumference approx 440) */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    stroke="#8b5cf6"
                    strokeWidth="22"
                    fill="none"
                    strokeDasharray="225 440"
                    strokeDashoffset="0"
                  />
                  {/* Shopping Segment: 20% */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    stroke="#ec4899"
                    strokeWidth="22"
                    fill="none"
                    strokeDasharray="90 440"
                    strokeDashoffset="-225"
                  />
                  {/* Travel Segment: 15% */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    stroke="#f59e0b"
                    strokeWidth="22"
                    fill="none"
                    strokeDasharray="65 440"
                    strokeDashoffset="-315"
                  />
                  {/* Food Segment: 14% */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    stroke="#06b6d4"
                    strokeWidth="22"
                    fill="none"
                    strokeDasharray="60 440"
                    strokeDashoffset="-380"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-stone-500 font-medium">Total Spent</span>
                  <span className="text-sm font-bold text-stone-800 tabular-nums">$1,725</span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-2.5 pt-1">
                <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Top Categories</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                      <span className="font-medium text-stone-800">Bills & Utilities</span>
                    </div>
                    <span className="font-semibold text-stone-900 tabular-nums">$890.00 (51%)</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                      <span className="font-medium text-stone-800">Shopping</span>
                    </div>
                    <span className="font-semibold text-stone-900 tabular-nums">$350.23 (20%)</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="font-medium text-stone-800">Travel & Commute</span>
                    </div>
                    <span className="font-semibold text-stone-900 tabular-nums">$249.89 (15%)</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                      <span className="font-medium text-stone-800">Food & Dining</span>
                    </div>
                    <span className="font-semibold text-stone-900 tabular-nums">$235.22 (14%)</span>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-purple-950">Save more with Set Aside</h5>
                  <p className="text-[11px] text-purple-700 mt-0.5">Automate your upcoming bills before they are due.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToTab('set-aside');
                  }}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-medium rounded-lg shrink-0 flex items-center gap-1 shadow-sm"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 flex flex-col h-full justify-between">
              {/* Message log */}
              <div className="space-y-3 min-h-[220px]">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs ${
                        m.sender === 'user'
                          ? 'bg-[#d71e28] text-white rounded-br-none'
                          : 'bg-stone-100 text-stone-800 border border-stone-200 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                      {m.action && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToTab(m.action!.tab);
                          }}
                          className="mt-2 inline-flex items-center gap-1 font-semibold text-[11px] text-purple-700 bg-white px-2.5 py-1 rounded border border-purple-200 hover:bg-purple-50 transition-colors"
                        >
                          <span>{m.action.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-stone-100 text-stone-500 border border-stone-200 rounded-xl px-3.5 py-2 text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse [animation-delay:0.4s]" />
                      <span className="ml-1 text-[11px] text-stone-500 font-medium">Fargo is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick suggestions */}
              <div className="pt-2">
                <span className="text-[11px] text-stone-500 font-medium block mb-1.5">Suggested Questions:</span>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['What is my routing number?', 'How do I deposit a check?', 'What are the loan limits?', 'Show upcoming bills'].map(
                    (prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSendMessage(prompt)}
                        disabled={isLoading}
                        className="text-[11px] bg-stone-100 hover:bg-purple-50 hover:text-purple-900 border border-stone-200 rounded-full px-2.5 py-1 text-stone-700 transition-colors disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    )
                  )}
                </div>

                {/* Input box */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isLoading ? 'Fargo is responding...' : 'Ask Fargo a question...'}
                    disabled={isLoading}
                    className="flex-1 text-xs border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-600 disabled:bg-stone-100"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputMessage.trim()}
                    className="p-2 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
