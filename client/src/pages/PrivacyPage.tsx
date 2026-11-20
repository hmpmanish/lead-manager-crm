import React from 'react';
import { Shield, Lock, Database, UserCheck, ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
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
            <Shield className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Privacy Policy and Data Protection
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Effective Date: January 1, 2026. Last updated: November 2026.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-700" strokeWidth={1.5} />
              1. Information We Collect and Process
            </h2>
            <p>
              LeadManager processes information provided directly by registered sales professionals.
              When creating an account or managing prospect records, the following categories of data are processed:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>
                <strong>Account Credentials:</strong> Full name, verified business email address, and cryptographically salted password hashes.
              </li>
              <li>
                <strong>Lead Records:</strong> Prospect contact name, corporate email address, business telephone number, employing organization, acquisition source, and sales pipeline status.
              </li>
              <li>
                <strong>Audit Telemetry:</strong> Creation timestamps, update timestamps, and session tokens strictly necessary for authentication and rate-limiting enforcement.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-700" strokeWidth={1.5} />
              2. Strict Tenant Isolation and Ownership Architecture
            </h2>
            <p>
              Every lead entry stored in the database is strictly tied to the unique identifier of the user who created it (foreign key relation).
              Our backend API strictly enforces row-level ownership on every read, update, and delete operation.
              Under no circumstances can one registered user view, query, modify, or delete another user's leads.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-700" strokeWidth={1.5} />
              3. Data Security and Cryptographic Standards
            </h2>
            <p>
              We implement defense-in-depth security measures to protect your commercial pipeline data:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>
                <strong>Password Encryption:</strong> Passwords are encrypted using bcryptjs with 12 salt rounds before database insertion. Plaintext passwords and hashes are never exposed via API responses.
              </li>
              <li>
                <strong>Transport Security:</strong> All client-to-server traffic is governed by HTTP Strict Transport Security (HSTS) and modern TLS encryption.
              </li>
              <li>
                <strong>XSS and Injection Defense:</strong> All incoming payloads undergo strict schema validation via Zod and HTML entity stripping to prevent Cross-Site Scripting (XSS) and SQL injection.
              </li>
              <li>
                <strong>Rate Limiting:</strong> Authentication endpoints enforce strict IP-based rate limiting to eliminate brute-force credential stuffing attempts.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#0F172A] mb-2">
              4. Data Retention and Deletion Rights
            </h2>
            <p>
              Users retain full ownership of their lead records. When you delete a lead via the CRM interface,
              that record is permanently removed from the active database. Account deletion purges all associated
              prospect data via cascading database constraints.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#0F172A] mb-2">
              5. Contact Information
            </h2>
            <p>
              For privacy inquiries, audit logs, or compliance queries regarding this screening assignment application,
              please contact the engineering team at Meru Technosoft Pvt. Ltd.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
