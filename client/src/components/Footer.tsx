import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>&copy; {currentYear} LeadManager CRM. Built for Meru Technosoft Pvt. Ltd. Screening Assessment.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('/privacy')}
              className="hover:text-[#0F172A] transition-colors focus:outline-none"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => onNavigate('/terms')}
              className="hover:text-[#0F172A] transition-colors focus:outline-none"
            >
              Terms of Service
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">Strict User Isolation Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
