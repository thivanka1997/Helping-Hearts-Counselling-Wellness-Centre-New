'use client';
import React, { useState } from 'react';
import { X, Lock, UserCheck, GraduationCap, ShieldAlert, Sparkles, KeyRound } from 'lucide-react';
import { UserRole, User } from '@/src/types';
import { api } from '@/lib/api-client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onSuccessToast?: (msg: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSuccessToast
}) => {
  if (!isOpen) return null;

  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: selectedRole })
      });
      const data = await res.json();
      if (data.user) {
        onLoginSuccess(data.user);
        onSuccessToast?.(`Signed in as ${data.user.name}`);
        onClose();
      }
    } catch (err) {
      alert('Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white p-6 relative">
          <button
            onClick={onClose}
            type="button"
            aria-label="Exit Portal Window"
            className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" />
            <span>Exit Window</span>
          </button>
          <div className="flex items-center gap-3 pr-24">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 border border-teal-300 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img
                src="/assets/images/helping_hearts_logo_1786214208419.jpg"
                alt="Helping Hearts Logo"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Portal Authentication</h2>
              <p className="text-xs text-teal-200">Helping Hearts Integrated Platform</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Role Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Portal Role</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'STUDENT' as UserRole, label: 'Student LMS', icon: GraduationCap },
                { role: 'LECTURER' as UserRole, label: 'Lecturer', icon: UserCheck },
                { role: 'ADMIN' as UserRole, label: 'System Admin', icon: Lock },
                { role: 'COUNSELLING_ADMIN' as UserRole, label: 'Counselling Desk', icon: ShieldAlert }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-teal-700 bg-teal-50 text-teal-900 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Registration & Login Instructions Accordion */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-teal-700" /> Registration & Login Instructions
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-bold uppercase">
                User Guide
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-white p-3 rounded-xl border border-slate-200/80">
              {selectedRole === 'STUDENT' && (
                <div className="space-y-1.5">
                  <p className="font-bold text-teal-900">🎓 Student Registration & Access Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-700">
                    <li><strong className="text-slate-900">Enrollment:</strong> Click "Student Enrollment" or "Register Now" on any Diploma course page.</li>
                    <li><strong className="text-slate-900">Payment Slip Upload:</strong> Submit your details and attach bank transfer payment receipt.</li>
                    <li><strong className="text-slate-900">Verification:</strong> Admin verifies your slip and activates your LMS credentials.</li>
                    <li><strong className="text-slate-900">LMS Portal Login:</strong> Sign in with your email to view lectures, download notes, and track attendance.</li>
                  </ol>
                </div>
              )}

              {selectedRole === 'LECTURER' && (
                <div className="space-y-1.5">
                  <p className="font-bold text-purple-900">👨‍🏫 Faculty & Lecturer Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-700">
                    <li><strong className="text-slate-900">Account Onboarding:</strong> Faculty accounts are created by the System Administrator.</li>
                    <li><strong className="text-slate-900">Login:</strong> Use your official institute email address.</li>
                    <li><strong className="text-slate-900">Lecturer Panel:</strong> Upload PDF lecture notes, schedule live zoom links, mark attendance, and evaluate students.</li>
                  </ol>
                </div>
              )}

              {selectedRole === 'ADMIN' && (
                <div className="space-y-1.5">
                  <p className="font-bold text-slate-900">🔐 System Administrator Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-700">
                    <li><strong className="text-slate-900">Access:</strong> Enter your admin security credentials.</li>
                    <li><strong className="text-slate-900">Management:</strong> Verify student payment slips, create courses, edit faculty profiles, and manage site media/content.</li>
                  </ol>
                </div>
              )}

              {selectedRole === 'COUNSELLING_ADMIN' && (
                <div className="space-y-1.5">
                  <p className="font-bold text-rose-900">🛡️ Counselling Desk Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-700">
                    <li><strong className="text-slate-900">Clients:</strong> Clients do NOT need an account to book confidential sessions—they use "Book Counselling".</li>
                    <li><strong className="text-slate-900">Counselling Desk Login:</strong> Desk managers sign in here to review encrypted appointment requests securely.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter account email..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600"
                required
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? 'Authenticating...' : `Sign In as ${selectedRole}`}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-sm font-bold transition-all border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 text-slate-500" />
                <span>Exit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
