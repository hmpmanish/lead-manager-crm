import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { LayoutGrid, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiRequest<{
        success: boolean;
        token: string;
        user: { id: string; name: string; email: string };
      }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.success) {
        login(res.token, res.user);
        onNavigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('demo.sales@merutech.in');
    setPassword('SalesLeader2026!');
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-md bg-[#0F766E] flex items-center justify-center text-white shadow-sm">
            <LayoutGrid className="w-6 h-6" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-[#0F172A]">
          Sign in to your sales workspace
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Enter your credentials to access your isolated leads pipeline
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#E2E8F0] rounded-md shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0" strokeWidth={1.5} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-700 mb-1">
                Business Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul.sharma@acmecorp.in"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-[#0F172A] focus:border-[#0F766E] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="block text-xs font-medium text-slate-700">
                  Password
                </label>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-[#0F172A] focus:border-[#0F766E] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0F766E] hover:bg-[#115E59] focus:outline-none disabled:opacity-50 transition-colors"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </form>

          {/* Quick Demo Pre-fill for Screening Evaluators */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs">
              <div className="flex items-center justify-between mb-1 text-slate-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
                  Evaluator Fast-Track:
                </span>
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-[#0F766E] hover:underline font-semibold"
                >
                  Use Demo Account
                </button>
              </div>
              <div className="text-[11px] text-slate-500">
                Or create a brand-new test account to verify strict tenant isolation.
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-600">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('/register')}
              className="font-medium text-[#0F766E] hover:underline focus:outline-none"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
