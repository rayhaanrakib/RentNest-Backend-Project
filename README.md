<div align="center">

<br />

# RentNest Backend

<p>A production-oriented REST API backend for a full-featured rental marketplace platform.</p>
<p>Designed with multi-role access control, transactional workflows, and secure payment processing.</p>

<br />

<p>
  <img src="https://img.shields.io/badge/Node.js-20+-111111?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-5.x-111111?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-111111?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-ORM-111111?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-111111?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Payments-111111?style=for-the-badge&logo=stripe&logoColor=white" />
</p>

<br />

<p>
  <a href="https://rayhaanrakib-rentnest-backend.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20API-Deployed-111111?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  <a href="https://documenter.getpostman.com/view/55143757/2sBY4LQM5J">
    <img src="https://img.shields.io/badge/API%20Docs-Postman-111111?style=for-the-badge&logo=postman&logoColor=white" />
  </a>
</p>

<br />

</div>

---

## Project Summary

<table>
  <tr>
    <td><strong>Project</strong></td>
    <td>RentNest Backend</td>
  </tr>
  <tr>
    <td><strong>Type</strong></td>
    <td>REST API — Rental Marketplace Platform</td>
  </tr>
  <tr>
    <td><strong>Roles</strong></td>
    <td>Tenant, Landlord, Admin</td>
  </tr>
  <tr>
    <td><strong>Live API</strong></td>
    <td><a href="https://rayhaanrakib-rentnest-backend.vercel.app/">https://rayhaanrakib-rentnest-backend.vercel.app</a></td>
  </tr>
  <tr>
    <td><strong>API Documentation</strong></td>
    <td><a href="https://documenter.getpostman.com/view/55143757/2sBY4LQM5J">View Full API Reference on Postman</a></td>
  </tr>
  <tr>
    <td><strong>Language</strong></td>
    <td>TypeScript (Strict Mode)</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>PostgreSQL via Prisma ORM</td>
  </tr>
  <tr>
    <td><strong>Authentication</strong></td>
    <td>JWT with bcrypt password hashing</td>
  </tr>
  <tr>
    <td><strong>Payments</strong></td>
    <td>Stripe Checkout with Webhook Verification</td>
  </tr>
  <tr>
    <td><strong>Deployment</strong></td>
    <td>Vercel</td>
  </tr>
</table>

---

## Overview

RentNest Backend is a marketplace API designed for property rental workflows. It supports property discovery, rental request management, payment processing, reviews, and administrative oversight across multiple user roles.

This project demonstrates the backend design of a real-world transactional platform, with secure authentication, role-based authorization, relational data modeling, and payment integration.

---

## Product Scope

### Tenant
- Register and authenticate securely
- Browse and search available properties with filters
- Submit rental requests for preferred listings
- Complete secure payments through Stripe Checkout
- Track rental and payment history
- Leave a verified review after completing a rental

### Landlord
- Create, update, and remove property listings
- Manage property availability
- Review and approve or reject incoming rental requests
- Monitor listings and associated activity

### Admin
- View and manage all users and account statuses
- Monitor property listings across the platform
- Access platform-wide statistics and revenue data
- Moderate core marketplace resources

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express.js 5.x |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcrypt |
| Payments | Stripe |
| Deployment | Vercel |
| Supporting Libraries | cors, dotenv, cookie-parser, http-status, tsup, tsx |

---

## Project Structure

```
RentNest-Backend-Project/
├── src/
│   ├── config/
│   ├── lib/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── property/
│   │   ├── rental/
│   │   ├── payment/
│   │   ├── review/
│   │   ├── category/
│   │   └── admin/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── prisma/
│   │   ├── migrations/
│   │   ├── schema/
└── package.json
```

Each module is fully self-contained with its own routes, controller, service layer, and validation — following a consistent pattern across the entire codebase.

---

## Local Setup

### Prerequisites

- Node.js 20 or higher
- npm or bun
- PostgreSQL
- Stripe account

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/rayhaanrakib/RentNest-Backend-Project.git
cd RentNest-Backend-Project
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the root directory and add the values below.

**4. Run database migrations**
```bash
npx prisma migrate dev
```

**5. Generate Prisma Client**
```bash
npx prisma generate
```

**6. Start development server**
```bash
npm run dev
```

**7. Build for production**
```bash
npm run build
```

---

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/rentnest?schema=public"

# Authentication
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
BCRYPT_SALT_ROUNDS=rounds_number
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
STRIPE_PRODUCT_PRICE_ID=pk_test_your_stripe_product_price_id
```

---

## License

Licensed under the ISC License. See `LICENSE` for details.