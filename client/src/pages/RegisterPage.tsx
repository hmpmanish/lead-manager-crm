import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { LayoutGrid, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Business email is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one letter and one number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await apiRequest<{
        success: boolean;
        token: string;
        user: { id: string; name: string; email: string };
      }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (res.success) {
        login(res.token, res.user);
        onNavigate('/');
      }
    } catch (err: any) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          Create your sales workspace
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Sign up to manage your private sales pipeline with strict user isolation
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#E2E8F0] rounded-md shadow-sm">
          {apiError && (
            <div className="mb-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0" strokeWidth={1.5} />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="block text-xs font-medium text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3 py-2 text-sm border rounded-md bg-white text-[#0F172A] focus:outline-none transition-colors ${
                  errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-[#0F766E]'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-medium text-slate-700 mb-1">
                Business Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul.sharma@acmecorp.in"
                className={`w-full px-3 py-2 text-sm border rounded-md bg-white text-[#0F172A] focus:outline-none transition-colors ${
                  errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-[#0F766E]'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-medium text-slate-700 mb-1">
                Master Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters (letters & numbers)"
                className={`w-full px-3 py-2 text-sm border rounded-md bg-white text-[#0F172A] focus:outline-none transition-colors ${
                  errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-[#0F766E]'
                }`}
              />
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 space-y-1">
              <div className="font-medium text-slate-700">Security Guarantee:</div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" strokeWidth={1.5} />
                <span>Salted bcrypt hashing (12 rounds)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" strokeWidth={1.5} />
                <span>Strict row-level ownership isolation</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0F766E] hover:bg-[#115E59] focus:outline-none disabled:opacity-50 transition-colors"
            >
              <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="font-medium text-[#0F766E] hover:underline focus:outline-none"
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
