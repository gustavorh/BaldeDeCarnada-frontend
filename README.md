# Balde de Carnada - Frontend

A comprehensive business management system built with Next.js, TypeScript, and Tailwind CSS. This frontend application provides a complete interface for managing products, stock, orders, users, attendance, and generating reports.

## 🏗️ Project Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── api/                     # API clients, organized by domain
│   │   ├── auth.ts              # Authentication API
│   │   ├── products.ts          # Product API
│   │   ├── stock.ts             # Stock API
│   │   ├── orders.ts            # Orders API
│   │   ├── users.ts             # Users API
│   │   ├── attendance.ts        # Attendance API
│   │   └── reports.ts           # Reports API
│   │
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Generic UI (buttons, inputs, etc.)
│   │   ├── auth/                # Auth-specific components
│   │   ├── products/            # Product UI components
│   │   ├── stock/               # Stock UI components
│   │   ├── orders/              # Order UI components
│   │   ├── users/               # User UI components
│   │   ├── attendance/          # Attendance UI components
│   │   └── reports/             # Report UI components
│   │
│   ├── features/                # Business logic per domain (hooks, etc.)
│   │   ├── auth/
│   │   │   └── useAuth.ts       # Custom hook (login, register, logout)
│   │   ├── products/
│   │   │   └── useProducts.ts   # Product management hooks
│   │   ├── stock/               # Stock management hooks
│   │   ├── orders/              # Order management hooks
│   │   ├── users/               # User management hooks
│   │   ├── attendance/          # Attendance hooks
│   │   └── reports/             # Report generation hooks
│   │
│   ├── contexts/                # React Contexts
│   │   └── AuthContext.tsx      # Authentication context
│   │
│   ├── services/                # Common utilities
│   │   ├── http.ts              # Axios setup with interceptors
│   │   ├── auth.ts              # Token handling
│   │   └── errorHandler.ts      # Centralized error processing
│   │
│   ├── schemas/                 # Validation schemas (Zod)
│   │   ├── auth.schema.ts       # Authentication schemas
│   │   ├── products.schema.ts   # Product schemas
│   │   ├── stock.schema.ts      # Stock schemas
│   │   ├── attendance.schema.ts # Attendance schemas
│   │   └── reports.schema.ts    # Report schemas
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── api.d.ts             # API response types
│   │   ├── product.d.ts         # Product types
│   │   ├── stock.d.ts           # Stock types
│   │   ├── user.d.ts            # User types
│   │   ├── attendance.d.ts      # Attendance types
│   │   └── reports.d.ts         # Report types
│   │
│   ├── utils/                   # Utility functions
│   │   ├── date.ts              # Date formatting and manipulation
│   │   ├── filters.ts           # Data filtering helpers
│   │   └── formatters.ts        # Value formatting (currency, numbers, etc.)
│   │
│   └── constants/               # App constants
│       └── endpoints.ts         # API endpoint definitions
│
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Homepage
│   └── ...                      # Additional routes
│
├── .env.local                   # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```
