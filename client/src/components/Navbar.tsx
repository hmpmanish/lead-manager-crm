import React, { useState } from 'react';
import { LayoutGrid, LogOut, Menu, X, Shield, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo: Always navigates cleanly to '/' */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
              aria-label="Navigate to Dashboard"
            >
              <div className="w-9 h-9 rounded-md bg-[#0F766E] flex items-center justify-center text-white transition-opacity group-hover:opacity-95">
                <LayoutGrid className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <span className="font-semibold text-base text-[#0F172A] tracking-tight block">
                  LeadManager
                </span>
                <span className="text-[11px] text-slate-500 block leading-none">
                  Sales CRM Workspace
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200">
                <button
                  onClick={() => handleNavClick('/')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    currentPath === '/'
                      ? 'bg-slate-100 text-[#0F172A]'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('/privacy')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    currentPath === '/privacy'
                      ? 'bg-slate-100 text-[#0F172A]'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  Privacy
                </button>
                <button
                  onClick={() => handleNavClick('/terms')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    currentPath === '/terms'
                      ? 'bg-slate-100 text-[#0F172A]'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  Terms
                </button>
              </nav>
            )}
          </div>

          {/* Desktop Right Side Auth / User State */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-[#0F172A]">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-md transition-colors"
                  title="Sign out of your account"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-[#0F172A] hover:bg-slate-50 rounded-md transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="px-3.5 py-1.5 text-sm font-medium text-white bg-[#0F766E] hover:bg-[#115E59] rounded-md transition-colors shadow-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button (< 768px) */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (< 768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
          {isAuthenticated && user && (
            <div className="p-3 mb-2 bg-slate-50 rounded-md border border-slate-200">
              <div className="text-sm font-medium text-[#0F172A]">{user.name}</div>
              <div className="text-xs text-slate-500">{user.email}</div>
            </div>
          )}

          <button
            onClick={() => handleNavClick('/')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
              currentPath === '/'
                ? 'bg-slate-100 text-[#0F172A]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleNavClick('/privacy')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
              currentPath === '/privacy'
                ? 'bg-slate-100 text-[#0F172A]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => handleNavClick('/terms')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
              currentPath === '/terms'
                ? 'bg-slate-100 text-[#0F172A]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
            <span>Terms of Service</span>
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 rounded-md flex items-center gap-2 mt-2 pt-2 border-t border-slate-100"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span>Logout</span>
            </button>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => handleNavClick('/login')}
                className="w-full text-center px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('/register')}
                className="w-full text-center px-3 py-2 text-sm font-medium text-white bg-[#0F766E] hover:bg-[#115E59] rounded-md"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
