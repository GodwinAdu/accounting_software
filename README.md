# SyncBooks

A modern financial management SaaS platform built with Next.js, TypeScript, and MongoDB.

## Features

- **Complete Accounting**: Real-time bookkeeping with automated reconciliation and financial reporting
- **Inventory Management**: Product tracking with variants, stock adjustments, and reorder alerts
- **Sales & Invoicing**: Professional invoices, sales orders, and customer management
- **Purchase Orders**: Vendor management with product and expense tracking
- **Automated Payroll**: Process wages with automated calculations, tax deductions, and direct deposits
- **Tax Compliance**: Automatic tax calculations, filings, and year-end reporting
- **Time Tracking**: Integrated time tracking with automatic wage calculations
- **Expense Management**: Track expenses, manage reimbursements, and maintain audit trails
- **Financial Analytics**: Cash flow forecasting, P&L statements, and custom reports
- **Multi-tenant Architecture**: Organization-based routing with isolated dashboards
- **Secure Authentication**: JWT-based auth with MFA and trusted devices

## Tech Stack

- **Framework**: Next.js 16.1.6 (Turbopack)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens, bcrypt password hashing
- **Validation**: Zod schemas with React Hook Form
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance
- npm/yarn/pnpm/bun

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
findit/
├── app/
│   ├── (auth)/              # Authentication routes
│   ├── (organisation)/      # Organization-specific routes
│   ├── api/                 # API endpoints
│   └── dashboard/           # Dashboard redirect
├── components/
│   └── sidebar/             # Sidebar components
├── lib/
│   ├── actions/             # Server actions
│   ├── helpers/             # Utility functions
│   └── models/              # Mongoose models
└── providers/               # React context providers
```

## Core Modules

- **Accounting & Bookkeeping**: Complete double-entry accounting system
- **Inventory Management**: Product variants, stock tracking, and reorder alerts
- **Sales Management**: Invoices, sales orders, and customer portal
- **Purchase Management**: Purchase orders, bills, and vendor management
- **Payroll Management**: Automated wage processing and direct deposits
- **General Ledger**: Complete accounting with journal entries
- **Tax Management**: Automated tax compliance and reporting
- **Employee Portal**: Self-service portal for employees
- **Financial Reports**: Real-time insights and analytics

## API Routes

- `POST /api/auth/logout` - Clear auth cookies and logout

## Key Models

- **User**: Authentication, roles, verification status
- **Organization**: Multi-tenant organization data
- **Session**: In-memory cache with 15-minute TTL

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

Deploy on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/findit)

See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.

## License

MIT
