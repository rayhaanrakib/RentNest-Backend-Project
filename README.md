# RentNest Backend API

<div align="center">
  <h3>RentNest - A Full-Featured Rental Marketplace Backend</h3>
  <p>Built with Express.js, TypeScript, Prisma ORM, and Stripe</p>
</div>

---

## 📋 Table of Contents

1. [About the Project](#about-the-project)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [API Endpoints](#api-endpoints)
7. [Project Structure](#project-structure)
8. [License](#license)
9. [Contact](#contact)

---

## About The Project

RentNest is a comprehensive backend API for a rental marketplace. It provides a robust platform where:

- **Tenants** can browse properties, submit rental requests, make payments, and leave reviews
- **Landlords** can list properties, manage availability, and handle rental requests
- **Admins** can manage users and moderate content

---

## Tech Stack

| Category         | Technologies                                                                 |
|------------------|-----------------------------------------------------------------------------|
| **Backend**      | Express.js 5.x, TypeScript 7.x                                              |
| **Database**     | PostgreSQL, Prisma ORM 7.8.x                                                |
| **Payments**     | Stripe API                                                                   |
| **Authentication** | JWT (JSON Web Tokens), bcrypt                                              |
| **Other Tools**  | cookie-parser, cors, dotenv, http-status, tsx, tsup                        |

---

## Key Features

### User Management
- User registration and login
- Role-based access control (Tenant, Landlord, Admin)
- User profile management

### Property Management
- Create, update, delete properties (Landlords only)
- Browse properties with advanced filtering and search
- Property details with reviews and statistics

### Rental Requests
- Submit rental requests (Tenants)
- Approve/Reject requests (Landlords)
- Track rental status

### Payment Processing
- Secure Stripe checkout for rental payments
- Webhook integration for payment status updates
- Payment history tracking

### Reviews
- Tenants can review properties they've rented
- One review per tenant per property

### Admin Dashboard
- User management (view, update status)
- Dashboard statistics (users, properties, rentals, revenue)

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js >= 20.x
- npm or bun
- PostgreSQL database
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rentnest-backend.git
   cd rentnest-backend
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) section)

4. **Run Prisma migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**
   ```bash
   npm run generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/rentnest?schema=public"

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

---

## 📜 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 📧 Contact

Rayhan - [@rayhaanrakib](https://github.com/rayhaanrakib)

---

<div align="center">
  <p>Made with ❤️ by Rayhan</p>
</div>
