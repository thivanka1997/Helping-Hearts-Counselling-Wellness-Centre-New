"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Lock, UserCheck, GraduationCap, ShieldAlert, Sparkles, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { UserRole } from "@/src/types";

/** Returns the portal URL for a given role. */
function getTargetUrl(role: UserRole | string): string {
  const normalized = String(role || "").toUpperCase();
  if (normalized === "STUDENT") return "/student/dashboard";
  if (normalized === "LECTURER") return "/lecturer/dashboard";
  return "/admin";
}

// Inner component that uses useSearchParams (must be wrapped in Suspense)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [selectedRole, setSelectedRole] = useState<UserRole>("STUDENT");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Automatically adapt role and redirect target based on callbackUrl
  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl") || "";
    if (callbackUrl.startsWith("/admin")) {
      setSelectedRole("ADMIN");
    } else if (callbackUrl.startsWith("/lecturer")) {
      setSelectedRole("LECTURER");
    } else if (callbackUrl.startsWith("/student")) {
      setSelectedRole("STUDENT");
    }
  }, [searchParams]);

  // Auto-redirect if user is already authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = (session.user as any).role || "STUDENT";
      const callbackUrl = searchParams.get("callbackUrl");
      const target = callbackUrl || getTargetUrl(userRole);
      window.location.assign(target);
    }
  }, [status, session, searchParams]);

  // Show error from NextAuth redirect (e.g. ?error=CredentialsSignin)
  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      setErrorMsg("Invalid credentials. Please check your username and password.");
    }
  }, [searchParams]);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // Auto-detect role from username patterns if user didn't explicitly pick
    let roleToUse = selectedRole;
    const lowerUsername = username.toLowerCase().trim();
    if (lowerUsername === "admin" || lowerUsername === "admin_user" || lowerUsername.startsWith("admin")) {
      roleToUse = "ADMIN";
    } else if (lowerUsername === "counselling" || lowerUsername.includes("counselling")) {
      roleToUse = "COUNSELLING_ADMIN";
    } else if (lowerUsername === "lecturer" || lowerUsername.includes("lecturer") || lowerUsername.includes("ramsina") || lowerUsername === "sumihiri" || lowerUsername === "ruwan") {
      roleToUse = "LECTURER";
    }

    try {
      const res = await signIn("credentials", {
        username: lowerUsername,
        role: roleToUse,
        password,
        redirect: false,
      });

      if (res?.error) {
        setIsLoading(false);
        setErrorMsg("Invalid login credentials.");
      } else {
        const callbackUrl = searchParams.get("callbackUrl");
        const targetUrl = callbackUrl || getTargetUrl(roleToUse);
        window.location.assign(targetUrl);
      }
    } catch {
      setIsLoading(false);
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  };

  // One-click quick login for the currently selected portal role
  const handleQuickLoginForRole = (role: UserRole) => {
    setSelectedRole(role);
    let defaultUser = "admin";
    if (role === "STUDENT") defaultUser = "student";
    if (role === "LECTURER") defaultUser = "lecturer";
    if (role === "COUNSELLING_ADMIN") defaultUser = "counselling";
    setUsername(defaultUser);
    setPassword("demo12345");
  };

  return (
    <div className="min-h-screen bg-slate-900/90 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to website button */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between z-10">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-200 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800 text-white p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white p-0.5 border border-teal-300 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img
                src="/assets/images/helping_hearts_logo_1786214208419.jpg"
                alt="Helping Hearts Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Portal Authentication</h1>
              <p className="text-xs text-teal-200">Helping Hearts Integrated Platform</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {session?.user && (
            <div className="p-3.5 bg-emerald-50 text-emerald-950 text-xs rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Currently Signed In: {session.user.name || session.user.email} ({(session.user as any).role || 'STUDENT'})</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const callbackUrl = searchParams.get("callbackUrl");
                  const target = callbackUrl || getTargetUrl((session.user as any).role || 'STUDENT');
                  window.location.assign(target);
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue to {(session.user as any).role || 'User'} Portal &rarr;</span>
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Role Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Portal Role</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: "STUDENT" as UserRole, label: "Student LMS", icon: GraduationCap },
                { role: "LECTURER" as UserRole, label: "Lecturer", icon: UserCheck },
                { role: "ADMIN" as UserRole, label: "System Admin", icon: Lock },
                { role: "COUNSELLING_ADMIN" as UserRole, label: "Counselling Desk", icon: ShieldAlert },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleQuickLoginForRole(item.role)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-teal-700 bg-teal-50 text-teal-900 shadow-xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-teal-700" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-teal-700" /> Portal Role Info
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-bold uppercase">
                {selectedRole}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {selectedRole === "STUDENT" && "Access course modules, attendance tracking, and lecture notes."}
              {selectedRole === "LECTURER" && "Manage assigned courses, mark student attendance, and share lecture slides."}
              {selectedRole === "ADMIN" && "Full executive control over students, courses, appointments, CMS, and settings."}
              {selectedRole === "COUNSELLING_ADMIN" && "Confidential access to manage incoming client appointment inquiries."}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3.5 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username..."
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? "Authenticating..." : `Sign In as ${selectedRole}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
