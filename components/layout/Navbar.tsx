'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Heart, Phone, Calendar, UserCheck, Menu, X, GraduationCap, Lock, LogOut, ChevronDown, Sparkles, ShieldAlert, MessageSquare } from 'lucide-react';
import { User, SiteSettings } from '@/src/types';
import { useSession, signOut } from 'next-auth/react';

interface NavbarProps {
  currentView?: string;
  setCurrentView?: (view: string) => void;
  currentUser?: User | null;
  onOpenLogin?: () => void;
  onOpenAppointment?: () => void;
  onOpenRegister?: () => void;
  onLogout?: () => void;
  settings?: SiteSettings;
}

const VIEW_MAP: Record<string, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  counselling: '/services',
  courses: '/courses',
  lecturers: '/lecturers',
  events: '/events',
  blog: '/blog',
  gallery: '/gallery',
  testimonials: '/testimonials',
  faq: '/faq',
  contact: '/contact',
  'student-dashboard': '/student/dashboard',
  'lecturer-dashboard': '/lecturer/dashboard',
  'admin-dashboard': '/admin'
};

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser: propUser,
  onOpenLogin,
  onOpenAppointment,
  onOpenRegister,
  onLogout,
  settings
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentUser = propUser || (session?.user as any) || null;
  const userRole = String(currentUser?.role || '').toUpperCase();

  const portalInfo = currentUser ? {
    STUDENT: {
      label: 'Student LMS Dashboard',
      menuLabel: '🎓 LMS Dashboard',
      shortLabel: 'Student Portal',
      viewId: 'student-dashboard',
      href: '/student/dashboard',
      icon: GraduationCap,
      badge: 'STUDENT',
      bgClass: 'bg-teal-700 hover:bg-teal-600 text-white'
    },
    LECTURER: {
      label: 'Faculty & Lecturer Portal',
      menuLabel: '👨‍🏫 Faculty Dashboard',
      shortLabel: 'Lecturer Portal',
      viewId: 'lecturer-dashboard',
      href: '/lecturer/dashboard',
      icon: UserCheck,
      badge: 'LECTURER',
      bgClass: 'bg-purple-800 hover:bg-purple-700 text-white'
    },
    ADMIN: {
      label: 'System Admin Console',
      menuLabel: '👑 Admin Dashboard',
      shortLabel: 'Admin Portal',
      viewId: 'admin-dashboard',
      href: '/admin',
      icon: Lock,
      badge: 'ADMIN',
      bgClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
    },
    COUNSELLING_ADMIN: {
      label: 'Counselling Desk Console',
      menuLabel: '🛡️ Counselling Desk',
      shortLabel: 'Counselling Desk',
      viewId: 'admin-dashboard',
      href: '/admin',
      icon: ShieldAlert,
      badge: 'COUNSELLING',
      bgClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
    }
  }[userRole as 'STUDENT' | 'LECTURER' | 'ADMIN' | 'COUNSELLING_ADMIN'] || {
    label: 'My Portal Dashboard',
    menuLabel: '🚀 My Dashboard',
    shortLabel: 'My Portal',
    viewId: 'student-dashboard',
    href: '/student/dashboard',
    icon: GraduationCap,
    badge: userRole || 'USER',
    bgClass: 'bg-teal-800 hover:bg-teal-700 text-white'
  } : null;

  const navLinks = [
    ...(portalInfo ? [{
      id: portalInfo.viewId,
      label: portalInfo.menuLabel,
      href: portalInfo.href,
      icon: portalInfo.icon,
      isDashboard: true
    }] : []),
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About Us', href: '/about' },
    { id: 'services', label: 'Counselling Services', href: '/services' },
    { id: 'courses', label: 'Courses', href: '/courses' },
    { id: 'lecturers', label: 'Lecturer Panel', href: '/lecturers' },
    { id: 'events', label: 'Events & Workshops', href: '/events' },
    { id: 'blog', label: 'Blog', href: '/blog' },
    { id: 'gallery', label: 'Gallery', href: '/gallery' },
    { id: 'testimonials', label: 'Testimonials', href: '/testimonials' },
    { id: 'faq', label: 'FAQ', href: '/faq' },
    { id: 'contact', label: 'Contact', href: '/contact' }
  ];

  const handleNavClick = (viewId: string) => {
    if (setCurrentView) {
      setCurrentView(viewId);
    }
    const targetHref = VIEW_MAP[viewId] || ('/' + viewId);
    router.push(targetHref);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      signOut({ callbackUrl: '/' });
    }
    setUserMenuOpen(false);
  };

  const isLinkActive = (link: typeof navLinks[0]) => {
    if (currentView) return currentView === link.id;
    if (link.href === '/') return pathname === '/';
    return pathname.startsWith(link.href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Utility & Action Bar */}
      <div className="bg-teal-950 text-teal-100 text-xs py-2 px-4 sm:px-6 border-b border-teal-800/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Left: Emergency Helpline & Hours */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <a
              href={`tel:${settings?.emergencyHelpline || '1333'}`}
              className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200 transition-colors bg-teal-900/60 px-2.5 py-1 rounded-lg border border-teal-800/80"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>24/7 Helpline: {settings?.emergencyHelpline || '1333'}</span>
            </a>
            <span className="hidden md:inline text-teal-700">|</span>
            <span className="hidden md:inline text-teal-200/90 font-medium">
              {settings?.openingHours || 'Mon - Sat: 8:30 AM - 6:00 PM'}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
            <a
              href="https://wa.me/94742344251?text=Hello%20Helping%20Hearts%20Admin,%20I%20would%20like%20to%20book%20a%20counselling%20appointment."
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>WhatsApp: +94 74 234 4251</span>
            </a>

            <button
              onClick={() => onOpenAppointment ? onOpenAppointment() : router.push('/services')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-950" />
              <span>Book Counselling</span>
            </button>

            {portalInfo ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-3 py-1.5 rounded-lg bg-teal-900/90 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-2 transition-all border border-teal-700/80 cursor-pointer shadow-xs active:scale-95"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shrink-0">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[130px] sm:max-w-[170px] truncate font-bold text-amber-200">
                    {currentUser?.name || 'My Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                      <p className="text-[11px] text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.name || currentUser?.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold uppercase">
                        {userRole} Portal
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleNavClick(portalInfo.viewId);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-teal-900 hover:bg-teal-50 flex items-center gap-2 cursor-pointer"
                    >
                      <portalInfo.icon className="w-4 h-4 text-teal-700" /> {portalInfo.label}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenLogin ? onOpenLogin() : router.push('/login')}
                className="px-3.5 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-teal-100 hover:text-white text-xs font-bold border border-teal-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Portal Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.25rem] py-2 gap-4">
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group py-1 shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-teal-100 flex items-center justify-center p-0.5 shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img
                src={settings?.logoUrl || '/assets/images/helping_hearts_logo_1786214208419.jpg'}
                alt="Helping Hearts Logo"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="shrink-0">
              <span className="block text-base sm:text-lg xl:text-xl font-black tracking-tight text-slate-900 leading-tight group-hover:text-teal-800 transition-colors whitespace-nowrap">
                HELPING HEARTS
              </span>
              <span className="block text-[10px] sm:text-xs font-bold tracking-wider uppercase text-teal-700 whitespace-nowrap">
                Counselling &amp; Wellness Centre
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2.5 2xl:gap-3 shrink-0">
            {navLinks.map((link) => {
              const Icon = (link as any).icon;
              const isDashboard = (link as any).isDashboard;
              const active = isLinkActive(link);

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isDashboard
                      ? active
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                        : 'bg-teal-900 text-amber-300 hover:bg-teal-850 hover:text-amber-200 border border-teal-700 shadow-xs'
                      : active
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'text-slate-700 hover:text-teal-900 hover:bg-slate-100/80'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex lg:hidden items-center gap-2 shrink-0">
            {/* Quick Mobile Portal Icon when logged in */}
            {portalInfo && (
              <button
                onClick={() => handleNavClick(portalInfo.viewId)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 max-w-[130px] truncate ${portalInfo.bgClass}`}
              >
                <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[9px] font-black shrink-0">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="truncate">{currentUser?.name ? currentUser.name.split(' ')[0] : 'Portal'}</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-hidden border border-slate-200 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = (link as any).icon;
              const isDashboard = (link as any).isDashboard;
              const active = isLinkActive(link);

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2.5 cursor-pointer ${
                    isDashboard
                      ? active
                        ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                        : 'bg-teal-900 text-amber-300 font-bold border border-teal-700 shadow-xs'
                      : active
                      ? 'bg-teal-50 text-teal-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0 text-amber-400" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <a
              href="https://wa.me/94742344251?text=Hello%20Helping%20Hearts%20Admin,%20I%20would%20like%20to%20book%20a%20counselling%20appointment."
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-amber-300" /> WhatsApp (+94 74 234 4251)
            </a>
            <button
              onClick={() => {
                if (onOpenAppointment) onOpenAppointment();
                else router.push('/services');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-teal-800 text-white font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-300" /> Book Counselling Session
            </button>
            <button
              onClick={() => {
                if (onOpenRegister) onOpenRegister();
                else router.push('/courses');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" /> Enroll as LMS Student
            </button>

            {currentUser && portalInfo ? (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mt-2 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                      {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name || 'Logged User'}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[160px]">{currentUser.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-teal-800 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                    {userRole}
                  </span>
                </div>

                <button
                  onClick={() => handleNavClick(portalInfo.viewId)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${portalInfo.bgClass}`}
                >
                  <portalInfo.icon className="w-4 h-4" />
                  <span>Open {portalInfo.label} &rarr;</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-center text-xs text-rose-600 font-semibold py-1 hover:underline flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onOpenLogin) onOpenLogin();
                  else router.push('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-slate-100 text-slate-800 font-medium text-sm border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" /> Portal Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
