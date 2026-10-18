import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  RefreshCw,
  Search,
  Eye,
  FileText,
  DollarSign,
  Landmark,
  Building,
  Check,
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  Database,
  Upload,
  Camera,
} from 'lucide-react';
import { WfLogo } from '../common/WfLogo';
import { authService } from '../../services/authService';
import { compressImageFile } from '../../utils/imageUtils';
import { ImageCropPositionModal } from '../common/ImageCropPositionModal';

interface StoredDeposit {
  id: string;
  userId: string;
  userName: string;
  targetAccountId: string;
  targetAccountName: string;
  amount: number;
  confirmationNumber: string;
  date: string;
  frontImage: string;
  backImage: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  processedAt?: string;
  processedBy?: string;
}

interface StoredUser {
  id: string;
  username: string;
  name: string;
  createdAt: string;
  role: string;
  phone?: string;
  email?: string;
  profile: any;
}

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositApproved?: (depositId: string, updatedUser?: any) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  onDepositApproved,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'history'>('pending');

  const [deposits, setDeposits] = useState<StoredDeposit[]>([]);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<StoredUser | null>(null);
  const [rejectReasonPrompt, setRejectReasonPrompt] = useState<{ id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('Image unreadable or endorsement missing');

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [photoCropTargetUser, setPhotoCropTargetUser] = useState<StoredUser | null>(null);
  const [adminPendingPhotoSrc, setAdminPendingPhotoSrc] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const adminPhotoFileInputRef = useRef<HTMLInputElement>(null);

  const adminPassword = 'admin12345@';

  const triggerAdminPhotoChange = (user: StoredUser) => {
    setPhotoCropTargetUser(user);
    adminPhotoFileInputRef.current?.click();
  };

  const handleAdminPhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !photoCropTargetUser) return;
    try {
      const dataUrl = await compressImageFile(file);
      setAdminPendingPhotoSrc(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAdminPendingPhotoSrc(dataUrl);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleAdminCropComplete = async (croppedDataUrl: string) => {
    if (!photoCropTargetUser) return;
    setIsUploadingPhoto(true);
    try {
      await authService.adminUpdateUserPhoto(photoCropTargetUser.id, croppedDataUrl, adminPassword);

      // Update local users array
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === photoCropTargetUser.id) {
            const updatedProfile = {
              ...(u.profile || {}),
              avatarUrl: croppedDataUrl,
              idPhotoUrl: croppedDataUrl,
              registrationData: {
                ...(u.profile?.registrationData || {}),
                idPhotoUrl: croppedDataUrl,
              },
            };
            return { ...u, profile: updatedProfile };
          }
          return u;
        })
      );

      // Update selectedUserDetail if open
      if (selectedUserDetail && selectedUserDetail.id === photoCropTargetUser.id) {
        setSelectedUserDetail({
          ...selectedUserDetail,
          profile: {
            ...(selectedUserDetail.profile || {}),
            avatarUrl: croppedDataUrl,
            idPhotoUrl: croppedDataUrl,
            registrationData: {
              ...(selectedUserDetail.profile?.registrationData || {}),
              idPhotoUrl: croppedDataUrl,
            },
          },
        });
      }

      setActionSuccessMessage(
        `Official customer photo for "${photoCropTargetUser.name}" successfully updated by Administrator.`
      );
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Failed to update photo by admin:', err);
    } finally {
      setIsUploadingPhoto(false);
      setAdminPendingPhotoSrc(null);
      setPhotoCropTargetUser(null);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchAdminData();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === adminPassword) {
      setIsAuthenticated(true);
      setAuthError('');
      fetchAdminData();
    } else {
      setAuthError('Invalid Admin Password. Access restricted to authorized personnel.');
    }
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch deposits
      try {
        const depRes = await fetch('/api/admin/deposits', {
          headers: { 'x-admin-key': adminPassword },
        });
        if (depRes.ok) {
          const depData = await depRes.json();
          setDeposits(depData.deposits || []);
        } else {
          const pubRes = await fetch('/api/deposits');
          if (pubRes.ok) {
            const pubData = await pubRes.json();
            setDeposits(pubData.deposits || []);
          }
        }
      } catch (e) {
        console.warn('Deposits fetch error:', e);
      }

      // 2. Fetch server users
      let serverUsers: StoredUser[] = [];
      try {
        const usersRes = await fetch('/api/admin/users', {
          headers: { 'x-admin-key': adminPassword },
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          serverUsers = usersData.users || [];
        } else {
          const altRes = await fetch(`/api/admin?action=users&key=${encodeURIComponent(adminPassword)}`, {
            headers: { 'x-admin-key': adminPassword },
          });
          if (altRes.ok) {
            const altData = await altRes.json();
            serverUsers = altData.users || [];
          }
        }
      } catch (err) {
        console.warn('Server users fetch error:', err);
      }

      // 3. Fetch client local storage users
      const localUsers = (authService.getAllUsers() || []) as unknown as StoredUser[];

      // 4. Merge both databases (deduplicating by username)
      const userMap = new Map<string, StoredUser>();
      localUsers.forEach((u) => {
        if (u && u.username) {
          userMap.set(u.username.toLowerCase(), u);
        }
      });
      serverUsers.forEach((u) => {
        if (u && u.username) {
          const key = u.username.toLowerCase();
          const existing = userMap.get(key);
          userMap.set(key, { ...existing, ...u });
        }
      });

      const mergedUsers = Array.from(userMap.values());
      setUsers(mergedUsers);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDatabaseJson = () => {
    const exportUsersObj: Record<string, any> = {};
    users.forEach((u) => {
      exportUsersObj[u.id] = u;
    });

    const exportPayload = {
      users: exportUsersObj,
      deposits,
      version: 1,
      exportedAt: new Date().toISOString(),
    };

    const dataUri =
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(exportPayload, null, 2));

    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', 'bank_database.json');
    document.body.appendChild(exportLink);
    exportLink.click();
    exportLink.remove();
  };

  const handleApproveDeposit = async (deposit: StoredDeposit) => {
    setProcessingId(deposit.id);
    setActionSuccessMessage(null);
    try {
      const res = await fetch(`/api/admin/deposits/${deposit.id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminPassword,
        },
        body: JSON.stringify({
          action: 'APPROVE',
          adminKey: adminPassword,
          note: 'Approved and verified by Bank Operations Administrator',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMessage(
          `Deposit of $${deposit.amount.toFixed(2)} for ${deposit.userName} APPROVED! Funds have been credited to account ${deposit.targetAccountId}.`
        );
        fetchAdminData();
        if (onDepositApproved) {
          onDepositApproved(deposit.id, data.user);
        }
      } else {
        alert(data.error || 'Failed to approve deposit');
      }
    } catch (err: any) {
      alert('Error connecting to server to approve deposit');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectDeposit = async (depositId: string) => {
    setProcessingId(depositId);
    setActionSuccessMessage(null);
    try {
      const res = await fetch(`/api/admin/deposits/${depositId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminPassword,
        },
        body: JSON.stringify({
          action: 'REJECT',
          adminKey: adminPassword,
          note: rejectReason,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMessage(`Deposit ${depositId} has been rejected.`);
        setRejectReasonPrompt(null);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to reject deposit');
      }
    } catch (err: any) {
      alert('Error connecting to server to reject deposit');
    } finally {
      setProcessingId(null);
    }
  };

  if (!isOpen) return null;

  const pendingDeposits = deposits.filter((d) => d.status === 'PENDING');
  const processedDeposits = deposits.filter((d) => d.status !== 'PENDING');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-300 animate-in zoom-in-95">
        
        {/* Top Operations Header */}
        <div className="bg-[#1c1917] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#ffcc00] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#d71e28] text-white p-1 rounded font-serif font-black text-xs">
              WF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">
                  Wells Fargo Bank Operations • Administrative Portal
                </span>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  OPERATIONS CONSOLE
                </span>
              </div>
              <span className="text-[11px] text-stone-400">
                Authorized Check Deposit Approval Gateway & User Database
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={fetchAdminData}
                disabled={isLoading}
                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs flex items-center gap-1 transition-colors"
                title="Refresh database records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors ml-1"
              aria-label="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Unauthenticated Password Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#d71e28] flex items-center justify-center mb-5 border border-red-200 shadow-inner">
              <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-1">Administrator Sign In</h3>
            <p className="text-xs text-stone-600 mb-6 leading-relaxed">
              Enter the bank administrative password to access pending deposit approvals and inspect live customer accounts stored in the database.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Admin Security Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError('');
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-stone-900 focus:outline-none focus:border-[#d71e28] focus:ring-1 focus:ring-[#d71e28]"
                    autoFocus
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
                </div>
                {authError && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{authError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-3 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer"
              >
                Authenticate & Access Console
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Management Tabs */
          <div className="flex-1 flex flex-col min-h-0 bg-stone-50">
            {/* Top Sub-Navigation */}
            <div className="bg-white border-b border-stone-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-[#d71e28] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Deposits</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      activeTab === 'pending'
                        ? 'bg-white text-[#d71e28]'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {pendingDeposits.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-[#d71e28] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Database Registered Users</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      activeTab === 'users'
                        ? 'bg-white text-[#d71e28]'
                        : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {users.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-[#d71e28] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Processed History</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-800 font-bold">
                    {processedDeposits.length}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-600">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-medium">Admin Mode Active</span>
              </div>
            </div>

            {/* Action Feedback Notification */}
            {actionSuccessMessage && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setActionSuccessMessage(null)}
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tab Contents */}
            <div className="flex-1 p-5 overflow-y-auto">
              
              {/* TAB 1: PENDING DEPOSITS FOR ADMIN APPROVAL */}
              {activeTab === 'pending' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">
                        Check & Funds Deposits Awaiting Approval
                      </h4>
                      <p className="text-xs text-stone-500">
                        Review customer submitted deposits. When you click Approve, funds are immediately credited to the customer account in the database.
                      </p>
                    </div>
                  </div>

                  {pendingDeposits.length === 0 ? (
                    <div className="bg-white rounded-xl border border-stone-200 p-10 text-center text-stone-500">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-stone-800">
                        No Pending Deposits
                      </p>
                      <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                        All customer check deposits have been reviewed and approved. New deposits submitted via the mobile or web deposit tab will show up here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {pendingDeposits.map((dep) => (
                        <div
                          key={dep.id}
                          className="bg-white rounded-xl border-2 border-amber-300 p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  Pending Admin Approval
                                </span>
                                <span className="text-xs font-mono text-stone-400">
                                  Conf #{dep.confirmationNumber}
                                </span>
                              </div>
                              <h5 className="font-bold text-stone-900 text-base mt-1">
                                {dep.userName}
                              </h5>
                              <span className="text-xs text-stone-500 block">
                                Target: {dep.targetAccountName} ({dep.targetAccountId}) • Submitted: {dep.date}
                              </span>
                            </div>

                            <div className="text-right sm:self-center">
                              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold block">
                                Deposit Amount
                              </span>
                              <span className="text-2xl font-bold text-stone-900 tabular-nums">
                                ${dep.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Check Photo Simulation Preview */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                            {/* Front Check Visual */}
                            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs">
                              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                                Front Check Capture
                              </span>
                              <div className="bg-white border border-amber-200 rounded p-2.5 shadow-2xs font-mono text-[10px] space-y-1">
                                <div className="flex justify-between font-bold text-stone-900">
                                  <span className="text-[#d71e28] font-serif font-black">WELLS FARGO</span>
                                  <span>${dep.amount.toFixed(2)} USD</span>
                                </div>
                                <div className="text-[9px] text-stone-600">
                                  PAY TO: {dep.userName}
                                </div>
                                <div className="text-[8px] text-stone-400 flex justify-between pt-1">
                                  <span>⑆061000227⑆</span>
                                  <span>{dep.confirmationNumber}⑈</span>
                                </div>
                              </div>
                            </div>

                            {/* Back Check Visual */}
                            <div className="bg-stone-100 border border-stone-200 rounded-lg p-3 text-xs">
                              <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                                Back Endorsement Capture
                              </span>
                              <div className="bg-white border border-stone-200 rounded p-2.5 shadow-2xs font-mono text-[10px] space-y-1">
                                <div className="border-b border-dashed border-stone-300 pb-1">
                                  <span className="italic text-blue-900 font-serif text-[10px] font-semibold">
                                    {dep.userName}
                                  </span>
                                </div>
                                <div className="text-[8px] text-stone-500 uppercase">
                                  FOR WELLS FARGO MOBILE DEPOSIT ONLY
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Approval Actions */}
                          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs text-stone-500">
                              Review check alignment and endorsement before authorizing credit.
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setRejectReasonPrompt({ id: dep.id })}
                                disabled={processingId === dep.id}
                                className="px-4 py-2 border border-red-300 hover:bg-red-50 text-red-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject Deposit</span>
                              </button>

                              <button
                                onClick={() => handleApproveDeposit(dep)}
                                disabled={processingId === dep.id}
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                {processingId === dep.id ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Processing Credit...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-4 h-4 stroke-[3]" />
                                    <span>Approve & Credit ${dep.amount.toFixed(2)}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Rejection reason inline popover */}
                          {rejectReasonPrompt?.id === dep.id && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                              <label className="text-xs font-semibold text-red-900 block">
                                Reason for Rejection
                              </label>
                              <input
                                type="text"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full bg-white border border-red-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setRejectReasonPrompt(null)}
                                  className="px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleRejectDeposit(dep.id)}
                                  className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded"
                                >
                                  Confirm Rejection
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DATABASE REGISTERED USERS & ACCOUNTS */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-stone-900">
                          Registered User Records in Database
                        </h4>
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>MongoDB Atlas: Connected</span>
                        </span>
                        <span className="bg-stone-200 text-stone-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {users.length} Accounts
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Live synced with MongoDB Atlas (<code className="font-mono text-stone-700 bg-stone-200/60 px-1 py-0.5 rounded text-[10px]">WellsFargo.users</code>). All newly opened accounts are permanently saved in cloud storage.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportDatabaseJson}
                        className="bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        title="Download bank_database.json for local editor"
                      >
                        <Download className="w-3.5 h-3.5 text-stone-600" />
                        <span>Export JSON</span>
                      </button>

                      <button
                        onClick={fetchAdminData}
                        disabled={isLoading}
                        className="bg-stone-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search accounts by customer name, @username, email, or user ID..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#d71e28]"
                    />
                    {userSearchQuery && (
                      <button
                        onClick={() => setUserSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* User List or Empty State */}
                  {users.filter((u) => {
                    if (!userSearchQuery.trim()) return true;
                    const q = userSearchQuery.toLowerCase();
                    return (
                      u.name?.toLowerCase().includes(q) ||
                      u.username?.toLowerCase().includes(q) ||
                      u.email?.toLowerCase().includes(q) ||
                      u.id?.toLowerCase().includes(q)
                    );
                  }).length === 0 ? (
                    <div className="bg-white rounded-xl border border-stone-200 p-8 text-center space-y-3">
                      <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-sm text-stone-900">
                          {userSearchQuery ? 'No matching registered accounts found' : 'No user accounts found in database'}
                        </h5>
                        <p className="text-xs text-stone-500 max-w-sm mx-auto">
                          {userSearchQuery
                            ? `No users matched "${userSearchQuery}". Try clearing your search filter.`
                            : 'Click "Enroll" on the homepage or sign on modal to register a new customer account.'}
                        </p>
                      </div>
                      {userSearchQuery && (
                        <button
                          onClick={() => setUserSearchQuery('')}
                          className="text-xs font-semibold text-[#d71e28] hover:underline"
                        >
                          Clear search query
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {users
                        .filter((u) => {
                          if (!userSearchQuery.trim()) return true;
                          const q = userSearchQuery.toLowerCase();
                          return (
                            u.name?.toLowerCase().includes(q) ||
                            u.username?.toLowerCase().includes(q) ||
                            u.email?.toLowerCase().includes(q) ||
                            u.id?.toLowerCase().includes(q)
                          );
                        })
                        .map((usr) => {
                      const reg = usr.profile?.registrationData;
                      const checkingAcc = usr.profile?.accounts?.find((a: any) => a.type === 'checking');
                      const savingsAcc = usr.profile?.accounts?.find((a: any) => a.type === 'savings');

                      return (
                        <div
                          key={usr.id}
                          className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-3">
                              {(usr.profile?.avatarUrl || usr.profile?.idPhotoUrl || reg?.idPhotoUrl) ? (
                                <img
                                  src={usr.profile?.avatarUrl || usr.profile?.idPhotoUrl || reg?.idPhotoUrl}
                                  alt={usr.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-[#ffcc00] shrink-0 bg-white shadow-2xs"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 shrink-0">
                                  <User className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-stone-900 text-base">
                                    {usr.name}
                                  </h5>
                                  <span className="bg-stone-100 text-stone-700 font-mono text-[10px] px-2 py-0.5 rounded">
                                    @{usr.username}
                                  </span>
                                </div>
                                <span className="text-xs text-stone-500">
                                  User ID: {usr.id} • Registered: {new Date(usr.createdAt).toLocaleDateString('en-US')}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <button
                                type="button"
                                onClick={() => triggerAdminPhotoChange(usr)}
                                className="border border-stone-300 hover:bg-stone-50 text-stone-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                title="Update customer photo as Administrator"
                              >
                                <Camera className="w-3.5 h-3.5 text-[#ffcc00]" />
                                <span>Update Photo</span>
                              </button>

                              <button
                                onClick={() => setSelectedUserDetail(selectedUserDetail?.id === usr.id ? null : usr)}
                                className="border border-stone-300 hover:bg-stone-50 text-stone-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#d71e28]" />
                                <span>{selectedUserDetail?.id === usr.id ? 'Hide Full Info' : 'Inspect Specific Details'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Accounts & Balances Summary */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                            <div className="bg-stone-50 rounded-lg p-3 border border-stone-200">
                              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                                Everyday Checking
                              </span>
                              <div className="flex justify-between items-baseline mt-1">
                                <span className="text-xs font-mono text-stone-700">
                                  {checkingAcc?.accountNumber || '..0987'}
                                </span>
                                <span className="text-lg font-bold text-stone-900 tabular-nums">
                                  ${(checkingAcc?.availableBalance ?? 0).toFixed(2)} USD
                                </span>
                              </div>
                            </div>

                            <div className="bg-stone-50 rounded-lg p-3 border border-stone-200">
                              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                                Way2Save Savings
                              </span>
                              <div className="flex justify-between items-baseline mt-1">
                                <span className="text-xs font-mono text-stone-700">
                                  {savingsAcc?.accountNumber || '..3478'}
                                </span>
                                <span className="text-lg font-bold text-stone-900 tabular-nums">
                                  ${(savingsAcc?.availableBalance ?? 0).toFixed(2)} USD
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Specific User Details */}
                          {selectedUserDetail?.id === usr.id && (
                            <div className="mt-4 pt-4 border-t border-stone-200 bg-amber-50/40 rounded-xl p-4 border border-amber-200 text-xs space-y-3">
                              <h6 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-[#d71e28]" />
                                <span>Specific User Registration Details Stored in Database</span>
                              </h6>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                                    Legal Residential Address
                                  </span>
                                  <span className="font-medium text-stone-900">
                                    {reg?.c1StreetAddress || '1048 Montgomery St'}, {reg?.c1City || 'San Francisco'}, {reg?.c1State || 'CA'} {reg?.c1Zip || '94133'}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                                    Taxpayer ID / SSN
                                  </span>
                                  <span className="font-mono font-medium text-stone-900">
                                    {reg?.c1Tin || '***-**-4321'}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                                    Primary Phone
                                  </span>
                                  <span className="font-medium text-stone-900">
                                    {reg?.c1HomePhone || usr.phone || '(415) 890-2134'}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                                    Employer / Occupation
                                  </span>
                                  <span className="font-medium text-stone-900">
                                    {reg?.c1Employer || 'Apex BioTech Corp'}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                                    Primary ID Document
                                  </span>
                                  <span className="font-medium text-stone-900">
                                    {reg?.c1PrimaryIdDesc || "California Driver's License"} ({reg?.c1PrimaryIdState || 'CA'})
                                  </span>
                                </div>

                                <div>
                                  <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                                    Date of Birth
                                  </span>
                                  <span className="font-medium text-stone-900">
                                    {reg?.c1Dob || '06/14/1992'}
                                  </span>
                                </div>

                                <div className="sm:col-span-3 pt-3 border-t border-amber-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] text-stone-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                      <ShieldCheck className="w-3.5 h-3.5 text-[#d71e28]" />
                                      <span>Attached Government Photo ID Image</span>
                                    </span>
                                    <span className="text-amber-800 text-[10px] font-semibold bg-amber-100/80 px-2 py-0.5 rounded flex items-center gap-1">
                                      <Lock className="w-3 h-3 text-amber-600" />
                                      <span>Customer Modification Locked (Admin Only)</span>
                                    </span>
                                  </div>

                                  {(usr.profile?.idPhotoUrl || reg?.idPhotoUrl) ? (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs">
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <img
                                          src={usr.profile?.idPhotoUrl || reg?.idPhotoUrl}
                                          alt="Uploaded Government ID"
                                          className="h-28 w-44 object-contain rounded border border-stone-300 bg-stone-50 shadow-2xs p-1 shrink-0"
                                        />
                                        <div className="text-xs space-y-1">
                                          <div className="font-bold text-stone-900 text-sm">
                                            {reg?.c1PrimaryIdDesc || "Driver's License"}
                                          </div>
                                          <div className="text-stone-500 text-[11px]">
                                            Issuing State/Jurisdiction: {reg?.c1PrimaryIdState || 'USA'}
                                          </div>
                                          <div className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1 pt-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> CIP ID Document Stored in Database
                                          </div>
                                          <p className="text-[10px] text-stone-500 max-w-sm pt-0.5">
                                            Account holder is legally restricted from replacing this photo. Only an authorized Bank Administrator can update this official image.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="shrink-0 flex flex-col gap-1.5 w-full sm:w-auto">
                                        <button
                                          type="button"
                                          onClick={() => triggerAdminPhotoChange(usr)}
                                          disabled={isUploadingPhoto}
                                          className="bg-[#d71e28] hover:bg-[#b81620] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        >
                                          <Upload className="w-3.5 h-3.5" />
                                          <span>Replace Photo (Admin Override)</span>
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-white p-4 rounded-lg border border-dashed border-amber-300 text-center space-y-2">
                                      <p className="text-xs text-stone-500">No customer ID photo has been uploaded yet for this record.</p>
                                      <button
                                        type="button"
                                        onClick={() => triggerAdminPhotoChange(usr)}
                                        disabled={isUploadingPhoto}
                                        className="bg-[#d71e28] hover:bg-[#b81620] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                      >
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>Upload Customer Photo (Admin Override)</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PROCESSED DEPOSITS HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">
                        Deposit Audit Log & Approval History
                      </h4>
                      <p className="text-xs text-stone-500">
                        Complete administrative log of all cleared and rejected deposit events.
                      </p>
                    </div>
                  </div>

                  {processedDeposits.length === 0 ? (
                    <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
                      No processed deposit history recorded yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-200 bg-white rounded-xl border border-stone-200 overflow-hidden">
                      {processedDeposits.map((dep) => (
                        <div key={dep.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-3">
                            {dep.status === 'APPROVED' ? (
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                                <XCircle className="w-4 h-4" />
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900">{dep.userName}</span>
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    dep.status === 'APPROVED'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {dep.status}
                                </span>
                              </div>
                              <span className="text-[11px] text-stone-500">
                                Conf: {dep.confirmationNumber} • {dep.adminNote || 'Processed'}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-stone-900 text-sm tabular-nums block">
                              ${dep.amount.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {dep.processedAt ? new Date(dep.processedAt).toLocaleTimeString() : dep.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {/* Hidden file input for Admin Photo Override */}
        <input
          ref={adminPhotoFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAdminPhotoFileChange}
        />
      </div>

      {/* Interactive Face & Image Positioner Modal for Admin */}
      {adminPendingPhotoSrc && (
        <ImageCropPositionModal
          isOpen={Boolean(adminPendingPhotoSrc)}
          imageSrc={adminPendingPhotoSrc}
          cropShape="circle"
          title={`Admin Override: Position Face for ${photoCropTargetUser?.name || 'Customer'}`}
          onCropComplete={handleAdminCropComplete}
          onCancel={() => {
            setAdminPendingPhotoSrc(null);
            setPhotoCropTargetUser(null);
          }}
        />
      )}
    </div>
  );
};
