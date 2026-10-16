import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { WfLogo } from '../common/WfLogo';
import { FdicDisclaimer } from '../common/FdicDisclaimer';
import { useGreeting } from '../../utils/greeting';
import { OnlineMobileSecurityModal } from '../common/OnlineMobileSecurityModal';

import { authService } from '../../services/authService';

interface SignOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string, profileData?: any) => void;
  onOpenEnroll?: () => void;
  onOpenAdminPortal?: () => void;
}

export const SignOnModal: React.FC<SignOnModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenEnroll,
  onOpenAdminPortal,
}) => {
  const greeting = useGreeting();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveUsername, setSaveUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setErrorMessage('Please enter both your username and password.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await authService.login(cleanUsername, cleanPassword);
      setIsLoading(false);

      if (result.isAdmin) {
        onClose();
        if (onOpenAdminPortal) onOpenAdminPortal();
        return;
      }

      if (result.success && result.user) {
        onLoginSuccess(result.user.name || cleanUsername, result.user.profile);
        onClose();
      } else {
        setErrorMessage(
          result.error ||
            'Invalid username or password. Please verify your credentials or click Enroll to create an account.'
        );
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Authentication service error. Please try again.');
    }
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
            className="hidden sm:inline-flex items-center gap-1 hover:underline text-white cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Enroll</span>
          </button>
          <span className="hidden md:inline hover:underline cursor-pointer">Customer Service</span>
          <span className="hidden md:inline hover:underline cursor-pointer">ATMs/Locations</span>
          <span className="hidden sm:inline hover:underline cursor-pointer">Español</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/20 rounded-full transition-colors ml-2 cursor-pointer"
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
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url('/assets/images/wf_scenic_backdrop_1791067224285.jpg')`,
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
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-stone-300 rounded px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#d71e28] focus:ring-1 focus:ring-[#d71e28]"
                  required
                />
                {username && (
                  <button
                    type="button"
                    onClick={() => setUsername('')}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
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
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
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

            {errorMessage && (
              <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full mt-4 bg-[#d71e28] hover:bg-[#b81620] text-white font-medium py-3 rounded-md text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? 'Signing on...' : 'Sign on'}
            </button>

            <div className="text-center pt-3 space-y-2.5">
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
                  className="font-semibold text-[#d71e28] hover:underline cursor-pointer"
                >
                  Enroll
                </button>
              </div>

              {onOpenAdminPortal && (
                <div className="pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdminPortal();
                    }}
                    className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 flex items-center justify-center gap-1 mx-auto"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Administrator Console</span>
                  </button>
                </div>
              )}
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
