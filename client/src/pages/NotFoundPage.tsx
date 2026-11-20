import React from 'react';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-14 h-14 rounded-md bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center mb-4">
        <HelpCircle className="w-7 h-7" strokeWidth={1.5} />
      </div>
      <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
        404: Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        The route you requested does not exist or may have been relocated within the workspace.
      </p>
      <button
        onClick={() => onNavigate(isAuthenticated ? '/' : '/login')}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0F766E] hover:bg-[#115E59] rounded-md transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        <span>Return to {isAuthenticated ? 'Dashboard' : 'Sign In'}</span>
      </button>
    </div>
  );
};
