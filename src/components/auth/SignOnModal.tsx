import React, { useState } from 'react';
import { X, Lock, KeyRound, Eye, EyeOff, Search } from 'lucide-react';
import { WfLogo } from '../common/WfLogo';
import { FdicDisclaimer } from '../common/FdicDisclaimer';
import { useGreeting } from '../../utils/greeting';
import { OnlineMobileSecurityModal } from '../common/OnlineMobileSecurityModal';

interface SignOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void;
  onOpenEnroll?: () => void;
}

export const SignOnModal: React.FC<SignOnModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenEnroll,
}) => {
  const greeting = useGreeting();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveUsername, setSaveUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(username.trim());
      onClose();
    }, 500);
  };

  const handlePasskeySignOn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(username.trim() || 'Online Banking Member');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex flex-col justify-between">
      {/* Top Wells Fargo Red Banner */}
      <header className="bg-[#d71e28] text-white px-4 md:px-8 py-2.5 flex items-center justify-between border-b-2 border-[#ffcc00] shadow-md shrink-0">
        <div className="flex items-center gap-4">
          <WfLogo size="sm" variant="white" />
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenEnroll) onOpenEnroll();
            }}
            className="hidden sm:inline-flex items-center gap-1 hover:underline text-white"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Enroll</span>
          </button>
          <span className="hidden md:inline hover:underline cursor-pointer">Customer Service</span>
          <span className="hidden md:inline hover:underline cursor-pointer">ATMs/Locations</span>
          <span className="hidden sm:inline hover:underline cursor-pointer">Español</span>
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-white text-stone-900 text-xs px-2.5 py-1 rounded-sm pr-6 w-28 focus:w-40 transition-all focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-stone-500 absolute right-1.5 top-1.5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/20 rounded-full transition-colors ml-2"
            aria-label="Close Sign On"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* Main Lake Background Container */}
      <div
        className="flex-1 relative flex items-center justify-center py-10 px-4 min-h-[560px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url('/src/assets/images/wf_scenic_backdrop_1791067224285.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 sm:p-8 border border-stone-200">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">{greeting}</h2>
            <button
              type="button"
              onClick={() => setShowSecurityModal(true)}
              className="inline-flex items-center justify-center gap-1.5 text-xs text-stone-600 hover:text-[#d71e28] mt-2 font-medium hover:underline transition-colors cursor-pointer group focus:outline-hidden"
              title="Learn about Wells Fargo Online & Mobile Security Guarantee"
            >
              <Lock className="w-3.5 h-3.5 text-stone-700 group-hover:text-[#d71e28] transition-colors" />
              <span>Online & Mobile Security</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#d71e28] focus:ring-1 focus:ring-[#d71e28]"
                  required
                />
                {username && (
                  <button
                    type="button"
                    onClick={() => setUsername('')}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-stone-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-stone-300 rounded px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#d71e28] focus:ring-1 focus:ring-[#d71e28]"
                required
              />
            </div>

            {/* Save Username */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="saveUsername"
                checked={saveUsername}
                onChange={(e) => setSaveUsername(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#d71e28] focus:ring-[#d71e28]"
              />
              <label htmlFor="saveUsername" className="text-xs text-stone-600">
                <span className="font-medium text-stone-800">Save username</span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  To help keep your account secure, save your username only on devices that aren't used by other people.
                </p>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full mt-4 bg-[#d71e28] hover:bg-[#b81620] text-white font-medium py-3 rounded-md text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing on...' : 'Sign on'}
            </button>

            {/* Alternative Auth */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <span className="relative bg-white px-3 text-xs text-stone-500 uppercase tracking-wider">or</span>
            </div>

            <button
              type="button"
              onClick={handlePasskeySignOn}
              className="w-full border border-stone-800 text-stone-900 hover:bg-stone-50 font-medium py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-stone-700" />
              <span>Use a passkey</span>
            </button>

            <div className="text-center pt-2 space-y-2">
              <a href="#forgot" className="block text-xs font-medium text-stone-700 hover:text-[#d71e28] hover:underline">
                Forgot username or password?
              </a>
              <div className="text-xs text-stone-600">
                New to Wells Fargo Online?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenEnroll) onOpenEnroll();
                  }}
                  className="font-medium text-[#d71e28] hover:underline"
                >
                  Enroll
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Legal Section */}
      <footer className="bg-white border-t border-stone-200 px-4 md:px-8 py-3 text-center shrink-0">
        <FdicDisclaimer compact />
      </footer>

      {/* Online & Mobile Security Center Modal */}
      <OnlineMobileSecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />
    </div>
  );
};
