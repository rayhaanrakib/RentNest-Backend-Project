<div align="center">

# RentNest Backend

A production-oriented backend API for a rental marketplace, built with **Express.js**, **TypeScript**, **Prisma**, **PostgreSQL**, and **Stripe**.

</div>

---

## Overview

RentNest Backend powers a rental marketplace where users can discover properties, request rentals, complete payments, and leave reviews. The system supports multiple user roles and provides dedicated workflows for tenants, landlords, and administrators.

This project demonstrates backend architecture for a real-world marketplace application, including authentication, role-based authorization, relational data modeling, payment integration, and admin-level management.

---

## Core Capabilities

### Tenant Features
- Register and authenticate securely
- Browse and search available properties
- View detailed property information
- Submit rental requests
- Complete rental payments through Stripe
- Leave reviews for rented properties
- Access payment and rental history

### Landlord Features
- Create, update, and remove property listings
- Manage property availability
- Review incoming rental requests
- Approve or reject rental applications
- Monitor property-related activity

### Admin Features
- Manage users and their statuses
- Oversee properties and marketplace activity
- Access platform-level statistics
- Moderate core resources

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime / Framework | Node.js, Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcrypt |
| Payments | Stripe |
| Utilities | cookie-parser, cors, dotenv, http-status |

---

## Key Backend Highlights

- **Role-based access control** for Tenant, Landlord, and Admin
- **RESTful API design** with modular architecture
- **Prisma-powered relational database modeling**
- **Stripe payment integration** with webhook handling
- **Secure authentication flow** using JWT and password hashing
- **Validation and structured error handling**
- **Scalable codebase organization** for marketplace workflows

---

## Project Structure

```bash
src/
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── property/
│   │   ├── rental/
│   │   ├── payment/
│   │   ├── review/
│   │   └── admin/
│   ├── middlewares/
│   ├── utils/
│   └── config/
├── prisma/
└── server.ts