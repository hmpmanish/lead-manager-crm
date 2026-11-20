# LeadManager: Production-Ready Full Stack Sales CRM

A complete, production-grade Lead Management web application built for the **Meru Technosoft Pvt. Ltd.** Full Stack Developer screening assessment.

---

## 1. Architectural Overview & Tech Stack Rationale

This project is architected as a clean, modular monorepo dividing responsibilities between an isolated, security-hardened backend API (`/server`) and a utilitarian, grounded frontend workspace (`/client`).

```
lead-manager-monorepo/
├── client/                     # Vite + React + TypeScript + Tailwind CSS
│   ├── public/                 # Static assets & SVG favicon
│   ├── src/
│   │   ├── components/         # Reusable, accessible UI components
│   │   ├── context/            # React AuthContext (JWT session management)
│   │   ├── lib/                # API client with token injection & error normalization
│   │   ├── pages/              # Dashboard, Login, Register, Privacy, Terms, 404
│   │   ├── types/              # TypeScript domain types & API contracts
│   │   ├── App.tsx             # Client router & dynamic title/meta manager
│   │   └── main.tsx            # Application entrypoint
│   └── vite.config.ts          # Vite configuration with local API proxy
├── server/                     # Node.js + Express + TypeScript + Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma       # Active schema (SQLite zero-friction default)
│   │   └── schema.postgresql.prisma # Production PostgreSQL schema
│   ├── src/
│   │   ├── config/             # Zod environment validation & Prisma client
│   │   ├── controllers/        # Auth & Lead business logic
│   │   ├── middleware/         # JWT auth, Zod validation, Rate limiting, Error handler
│   │   ├── routes/             # Express API routes
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── utils/              # Stored XSS sanitization utilities
│   │   ├── app.ts              # Express application factory & security headers
│   │   └── server.ts           # HTTP server listener & graceful shutdown handlers
│   └── tests/                  # Automated integration tests (Vitest + Supertest)
└── README.md
```

### Technology Stack Choices

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite | Sub-millisecond HMR, type safety across API boundaries, zero unnecessary runtime bloat. |
| **Styling** | Tailwind CSS | Strict utilitarian design system adhering to B2B SaaS standards (zero AI-slop, no purple gradients, sharp corners). |
| **Icons** | Lucide React | Minimalist 1.5px stroke vector icons. Strictly zero emojis anywhere in the codebase or interface. |
| **Backend** | Node.js, Express, TypeScript | Lightweight, battle-tested REST API architecture with clear separation of concerns. |
| **Validation** | Zod (Dual-Layer) | Fail-fast schema validation on both server boundaries and client forms. |
| **Database** | Prisma ORM | Parameterized type-safe queries preventing SQL injection; indexed columns on `userId`, `status`, and `email`. |
| **Dual DB Engine**| SQLite + PostgreSQL | SQLite configured by default for zero-friction local testing and automated test suites; drop-in PostgreSQL schema included for cloud deployments. |
| **Testing** | Vitest, Supertest | Fast, in-memory automated integration testing covering auth, CRUD, validation, and multi-tenant isolation. |

---

## 2. Core & Bonus Feature Matrix

### Core Features (Completed)
- **Add Lead:** Capture name (2–100 chars), RFC-compliant email, phone, company (1–100 chars), acquisition source (`Website`, `Referral`, `Cold Outreach`, `LinkedIn`, `Event`, `Other`), and initial status (`New`, `Contacted`, `Qualified`, `Lost`).
- **List Leads:** Clean, dense tabular view displaying contact details, acquisition channels, and timestamps.
- **Edit Lead & Quick Status Transition:** In-place modal editing and inline status switcher for rapid pipeline updates.
- **Delete Lead with Confirmation:** Destructive action guarded by an explicit modal prompt displaying lead details.
- **Search & Filtering:** Case-insensitive search on `name`, `email`, or `company`, plus exact status filters.
- **Robust Input Validation:** Server-side and client-side validation rejecting invalid emails, missing required fields, or oversized payloads.

### Bonus Features (Completed)
- **Authentication & User Isolation:** Full registration and login workflows. Passwords hashed using `bcryptjs` with 12 salt rounds. Password hashes are never leaked in API responses.
- **Strict Row-Level Ownership:** Every query enforces `where: { id, userId }`. User A cannot view, edit, or delete leads belonging to User B.
- **Pagination & Multi-Column Sorting:** Server-side pagination (`?page=`, `?limit=`) and flexible sorting (`?sortBy=`, `?order=`).
- **Pipeline Metrics Bar:** Real-time summary counters showing total leads and breakdowns across all statuses (`New`, `Contacted`, `Qualified`, `Lost`). Cards double as instant filters.
- **Automated Integration Tests:** Comprehensive Vitest + Supertest test suite validating endpoints, authentication, boundary conditions, and isolation.
- **Utility & Legal Pages:**
  - `/privacy`: Comprehensive data-handling disclosure detailing encryption, retention, and isolation.
  - `/terms`: Terms of service for workspace operations.
  - `*`: Custom 404 fallback page with single-click return to workspace.

---

## 3. Defense-in-Depth Security Hardening

The application incorporates strict security controls at every layer:

1. **Fail-Fast Environment Validation:**
   - Server boots through `src/config/env.ts` validating all required variables via Zod schemas. The process immediately halts if `JWT_SECRET` or `DATABASE_URL` is missing or malformed.
   - `.env` files are strictly excluded via `.gitignore`.
2. **HTTP Security Headers (`helmet`):**
   - Strict Content Security Policy (CSP) restricting scripts, styles, and image origins.
   - `X-Frame-Options: DENY` preventing clickjacking.
   - `X-Content-Type-Options: nosniff` preventing MIME confusion attacks.
   - HTTP Strict Transport Security (HSTS) with 1-year max age.
   - `X-Powered-By` header completely disabled.
3. **CORS Explicit Allowlist:**
   - CORS is configured to reject wildcard `*` origins and strictly restrict access to `CLIENT_URL` (e.g., `http://localhost:5173`).
4. **DoS Mitigation & Rate Limiting:**
   - Strict rate limiter on `/api/auth/*` (15 requests per 15 minutes per IP) to prevent brute-force attacks.
   - Standard rate limiter on `/api/*` (200 requests per 15 minutes).
   - Strict JSON payload size ceiling enforced (`express.json({ limit: '10kb' })`).
5. **Stored XSS Prevention & Input Sanitization:**
   - Backend utility `sanitizeString()` strips all HTML tags (`/<[^>]*>?/gm`) and escapes HTML entities before database persistence.
6. **SQL/NoSQL Injection Immunity:**
   - Exclusively uses Prisma ORM with parameterized queries. Raw unescaped SQL queries are strictly avoided.
7. **Safe Authentication Flow:**
   - Passwords hashed with 12 bcrypt salt rounds.
   - Generic error messages on login (`Invalid email or password`) to prevent user enumeration.
   - Production error handler completely suppresses stack traces and internal debugging information.

---

## 4. Local Setup Guide (Zero-Friction)

### Prerequisites
- Node.js (v18 or higher recommended; developed and verified on Node v22.14.0)
- npm (v9 or higher)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Full_Stack_Developer_Assignment
```

### Step 2: Configure Environment Variables
Copy the provided `.env.example` templates to `.env`:

**Server configuration:**
```bash
cp server/.env.example server/.env
```
*(On Windows PowerShell: `Copy-Item server/.env.example server/.env`)*

Contents of `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_jwt_key_for_development_replace_in_production_min_32_chars
DATABASE_URL="file:./dev.db"
```
*Note: SQLite is configured by default for zero-friction local development without requiring external database services.*

**Client configuration:**
```bash
cp client/.env.example client/.env
```
*(On Windows PowerShell: `Copy-Item client/.env.example client/.env`)*

### Step 3: Install Dependencies
Run the installation script from the root workspace:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### Step 4: Initialize the Database
Generate the Prisma Client and push the database schema:
```bash
cd server
npx prisma generate
npx prisma db push
cd ..
```

### Step 5: Run Automated Integration Tests
Verify all API endpoints, authorization checks, validation logic, and multi-tenant isolation rules:
```bash
cd server
npm test
cd ..
```

### Step 6: Start the Development Servers
In two separate terminal windows:

**Terminal 1 (Backend API on port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client on port 5173):**
```bash
cd client
npm run dev
```

Open your browser to:
```
http://localhost:5173
```

---

## 5. Switching to Production PostgreSQL

To switch from SQLite to PostgreSQL:

1. Update `server/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   *(Or copy the pre-built `server/prisma/schema.postgresql.prisma`)*

2. Update `server/.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lead_manager?schema=public"
   ```

3. Run migrations:
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

---

## 6. UI/UX Aesthetic Decisions (Grounded B2B Design)

- **Palette:** Crisp utilitarian off-white canvas (`#F8FAFC`), pure white container cards (`#FFFFFF`), crisp 1px borders (`#E2E8F0`), deep charcoal typography (`#0F172A`), and a muted forest-teal primary accent (`#0F766E`).
- **No Purple Gradients:** Completely avoided trendy gradient fills and saturated decorative patterns.
- **Sharp Corners:** Enforced structured `rounded-md` (6px) corners. Pill-shaped buttons (`rounded-full`) are strictly forbidden.
- **Zero Emojis:** All iconography is provided exclusively via clean 1.5px stroke Lucide React SVGs.
- **Clickable Contact Actions:** Phone numbers are direct `<a href="tel:...">` links and emails are `<a href="mailto:...">` links for instant sales outreach.
- **Contained Scrolling:** Horizontal overflow on small viewports is restricted to the table container with a custom minimal scrollbar; the parent page never scrolls horizontally.
- **Accessible Feedback:** Every action (creation, edit, quick status transition, delete) produces an immediate visual toast notification with auto-dismiss and manual close.

---

## 7. Assumptions & Production Enhancements with More Time

### Assumptions Made
1. **Single-Tenant per User Account:** Leads are private to each user account (`userId`), modeling an individual sales rep workspace.
2. **Local Zero-Config Priority:** SQLite was designated as the default database for local evaluation so reviewing engineers do not need running PostgreSQL daemons or Docker services to run the project and tests immediately.
3. **Session Persistence:** Client persists JWT in `localStorage` for responsive state rehydration on refresh, verified through `/api/auth/me`.

### Enhancements with More Time
1. **Activity Audit Log:** A historical timeline table tracking every status change (e.g., `New -> Contacted on 2026-11-21 by Sarah`).
2. **Bulk Operations & CSV Import/Export:** Ability to import leads via CSV file upload with streaming parser and export filtered views.
3. **WebSockets / Server-Sent Events:** Real-time push updates for multi-device synchronization.
4. **Redis Caching:** Invalidation-tagged Redis caching on summary metrics counters for ultra-high-volume pipelines.
5. **Two-Factor Authentication (2FA):** TOTP-based authentication layer via Authenticator apps for enhanced account security.

---

## 8. Suggested Git Commit History Plan

For clean repository presentation, the following commit history sequence is recommended:

```
1. chore: initialize project structure, gitignore, and root monorepo scripts
2. feat(server): configure Prisma schema, SQLite/Postgres support, and Zod env validation
3. feat(server): implement security middleware, JWT auth, and rate limiters
4. feat(server): implement leads CRUD controller, pagination, and status metrics
5. test(server): add comprehensive Vitest + Supertest integration test suite
6. feat(client): setup Vite, Tailwind CSS, utilitarian theme, and routing
7. feat(client): build Auth context, Login and Register views with validation
8. feat(client): build Lead Dashboard, table, search/filter bar, and status badges
9. feat(client): implement Add/Edit modal and explicit delete confirmation dialog
10. feat(client): add Privacy Policy, Terms of Service, and custom 404 page
11. docs: add comprehensive README with architecture, security checklist, and local setup
```
