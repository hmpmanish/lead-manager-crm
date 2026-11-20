import React from 'react';
import { FileText, CheckSquare, AlertOctagon, Scale, ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0F766E] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>Back to Workspace</span>
      </button>

      <div className="bg-white border border-[#E2E8F0] rounded-md p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
          <div className="w-10 h-10 rounded-md bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center">
            <FileText className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Terms and Conditions of Service
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Governing agreement for the LeadManager sales CRM workspace.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-teal-700" strokeWidth={1.5} />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, registering, or operating this application, you agree to comply with and be bound by these
              Terms and Conditions. This software is provided as part of the technical evaluation screening for
              Meru Technosoft Pvt. Ltd.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-700" strokeWidth={1.5} />
              2. User Obligations and Account Responsibility
            </h2>
            <p>
              Each registered user is responsible for maintaining the confidentiality of their credentials and session tokens.
              You agree not to disclose your password to unauthorized third parties and accept responsibility for all activity
              transacted under your authenticated session.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-teal-700" strokeWidth={1.5} />
              3. Acceptable Use and Security Policies
            </h2>
            <p>
              When utilizing the LeadManager API and client interface, users are strictly prohibited from:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>Attempting to bypass row-level authorization checks to inspect or modify leads belonging to another user ID.</li>
              <li>Executing automated Denial-of-Service attacks or flooding endpoints beyond configured rate limits.</li>
              <li>Injecting malicious scripts, payloads, or unescaped HTML content into lead fields.</li>
              <li>Utilizing the contact features (email or telephone links) for unauthorized spamming or unsolicited mass marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#0F172A] mb-2">
              4. Proprietary Rights and Data Ownership
            </h2>
            <p>
              All lead data, company names, contact emails, and phone numbers entered by you remain your property.
              The LeadManager platform claims no intellectual property rights over the prospective customer records
              you store within your private workspace.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#0F172A] mb-2">
              5. Limitation of Liability
            </h2>
            <p>
              This application is delivered on an "as-is" and "as-available" basis for technical screening purposes.
              The development team makes reasonable efforts to ensure maximum uptime, persistent database integrity,
              and strict security adherence.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
