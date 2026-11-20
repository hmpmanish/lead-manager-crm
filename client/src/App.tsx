import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  // Listen for browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update dynamic document title and meta description on route changes
  useEffect(() => {
    let title = 'LeadManager | CRM Workspace';
    let description = 'Production-ready Lead Management CRM for sales professionals';

    switch (currentPath) {
      case '/':
        title = isAuthenticated
          ? 'Pipeline Dashboard | LeadManager CRM'
          : 'Sign In | LeadManager CRM';
        description = 'Manage and track prospective leads with real-time status transitions and metrics.';
        break;
      case '/login':
        title = 'Sign In | LeadManager CRM';
        description = 'Access your private sales pipeline with strict row-level security.';
        break;
      case '/register':
        title = 'Register Account | LeadManager CRM';
        description = 'Create a secure sales lead tracking account with salted bcrypt authentication.';
        break;
      case '/privacy':
        title = 'Privacy Policy | LeadManager CRM';
        description = 'Learn how LeadManager secures, encrypts, and isolates your customer records.';
        break;
      case '/terms':
        title = 'Terms of Service | LeadManager CRM';
        description = 'Terms and conditions governing use of the LeadManager workspace.';
        break;
      default:
        title = '404 Not Found | LeadManager CRM';
        description = 'The requested CRM page or resource could not be found.';
    }

    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [currentPath, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-700 border-t-transparent rounded animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          Initializing secure CRM session...
        </p>
      </div>
    );
  }

  // Routing renderer
  const renderContent = () => {
    // Unauthenticated routes
    if (!isAuthenticated) {
      if (currentPath === '/register') {
        return <RegisterPage onNavigate={navigate} />;
      }
      if (currentPath === '/privacy') {
        return <PrivacyPage onNavigate={navigate} />;
      }
      if (currentPath === '/terms') {
        return <TermsPage onNavigate={navigate} />;
      }
      if (currentPath === '/' || currentPath === '/login') {
        return <LoginPage onNavigate={navigate} />;
      }
      return <NotFoundPage onNavigate={navigate} />;
    }

    // Authenticated routes
    switch (currentPath) {
      case '/':
        return <DashboardPage />;
      case '/login':
      case '/register':
        // Already logged in, redirect to dashboard
        return <DashboardPage />;
      case '/privacy':
        return <PrivacyPage onNavigate={navigate} />;
      case '/terms':
        return <TermsPage onNavigate={navigate} />;
      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1 flex flex-col">{renderContent()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
};
