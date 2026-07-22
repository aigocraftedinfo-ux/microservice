# Amazon Clone Microservices Architecture

An enterprise-style eCommerce platform built with **Node.js, Express, TypeScript, React 19, Vite, and Tailwind CSS**. Features **6 isolated backend microservices** coordinated by an **API Gateway** with live microservice health monitoring and aggregated OpenAPI/Swagger documentation.

---

## 🏗️ System Architecture Overview

```
                               ┌───────────────────────────────────┐
                               │     React 19 + Vite Frontend      │
                               └─────────────────┬─────────────────┘
                                                 │
                                                 ▼
                               ┌───────────────────────────────────┐
                               │   API Gateway (Port 3000)         │
                               │   - Reverse Proxy Routing         │
                               │   - Service Health Dashboard      │
                               │   - OpenAPI / Swagger Docs        │
                               └─────────────────┬─────────────────┘
                                                 │
      ┌──────────────────┬──────────────────────┼──────────────────────┬──────────────────┐
      │                  │                      │                      │                  │
      ▼                  ▼                      ▼                      ▼                  ▼
┌───────────┐      ┌───────────┐          ┌───────────┐          ┌───────────┐      ┌───────────┐
│ User      │      │ Product   │          │ Cart      │          │ Order     │      │ Payment   │
│ Service   │      │ Service   │          │ Service   │          │ Service   │      │ Service   │
│ (Port 3001│      │ (Port 3002│          │ (Port 3003│          │ (Port 3004│      │ (Port 3005│
└───────────┘      └───────────┘          └───────────┘          └─────┬─────┘      └───────────┘
                                                                       │
                                                                       ▼
                                                                 ┌───────────┐
                                                                 │Notif.     │
                                                                 │Service    │
                                                                 │(Port 3006)│
                                                                 └───────────┘
```

---

## 📦 Microservices Breakdown

| Service Name | Port | Primary Responsibilities | Data Store |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `3000` | Central entrypoint, microservice health cluster dashboard, reverse proxying, aggregated Swagger UI. | N/A |
| **User Service** | `3001` | User registration, JWT auth token issuance/verification, profile CRUD, role management. | In-Memory `UserStore` |
| **Product Service** | `3002` | Catalog search, category filtering, stock inventory tracking & decrementing. | In-Memory `ProductStore` |
| **Cart Service** | `3003` | User-bound shopping cart sessions, line item management, stock availability validation. | In-Memory `CartStore` |
| **Order Service** | `3004` | Orchestrates multi-service checkout (Cart -> Product stock deduction -> Payment -> Notification -> Order record). | In-Memory `OrderStore` |
| **Payment Service** | `3005` | Simulates UPI (GPay/PhonePe/Paytm), Card, Net Banking, Wallet payments; issues `TXN-xxxxxxxx` tokens. | In-Memory `PaymentStore` |
| **Notification Service** | `3006` | Logs platform events (`ORDER_CREATED`, `PAYMENT_SUCCESS`, `ORDER_CANCELLED`, `EMAIL_SENT`). | In-Memory `NotificationStore` |

---

## ⚡ Quick Start & Running Instructions

### 1. Installation
Dependencies are pre-configured in root `package.json`.

### 2. Start Development Cluster
Run all 6 backend microservices and the Vite frontend simultaneously:
```bash
npm run dev
```
- **Web App & Gateway:** `http://localhost:3000`
- **Cluster Health Monitor:** `http://localhost:3000/dashboard`
- **Aggregated Swagger API Specs:** `http://localhost:3000/api/docs`

### 3. Production Build & Start
```bash
npm run build
npm start
```

---

## 🔑 Pre-Configured Demo Accounts

Use these pre-loaded accounts on the Login page for instant testing:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Customer** | `john@example.com` | `user123` | Browsing, Shopping Cart, Checkout, Order Tracking, Profile |
| **Admin** | `admin@amazon.com` | `admin123` | All Customer rights + Live Cluster Health Dashboard, Product Management, System Users, All Orders, Payments, Notification Logs |

---

## 🛠️ API Reference Summary

### User Service (`/api/user`)
- `POST /api/user/register` - Create account
- `POST /api/user/login` - Authenticate & receive JWT
- `GET /api/user/profile` - Get user profile (Requires Bearer Token)
- `PUT /api/user/profile/update` - Update profile details
- `DELETE /api/user/profile/delete` - Remove user account

### Product Service (`/api/product`)
- `GET /api/product/products` - Search, filter by price/category/rating
- `GET /api/product/products/:id` - Fetch product detail
- `GET /api/product/categories` - Fetch all categories
- `POST /api/product/products` - Add product (Admin only)
- `DELETE /api/product/products/:id` - Remove product (Admin only)

### Cart Service (`/api/cart`)
- `GET /api/cart` - Get user active cart
- `POST /api/cart/add` - Add product line item
- `PUT /api/cart/increase` - Increment item count
- `PUT /api/cart/decrease` - Decrement item count
- `DELETE /api/cart/items/:productId` - Remove item
- `POST /api/cart/clear` - Empty cart

### Order Service (`/api/order`)
- `POST /api/order/checkout` - Execute checkout orchestration across services
- `GET /api/order/my-orders` - User order history
- `GET /api/order/all-orders` - Admin view of all orders
- `POST /api/order/:id/cancel` - Cancel active order
- `PUT /api/order/:id/status` - Update order shipment status

### Payment Service (`/api/payment`)
- `POST /api/payment/process` - Execute fake payment (UPI / Card / Net Banking / Wallet)
- `GET /api/payment/history` - Get transaction records

### Notification Service (`/api/notification`)
- `POST /api/notification/send` - Record event notification
- `GET /api/notification/logs` - Fetch audit logs

---

## 🔒 Security & Architecture Standards
- **REST Isolation:** Microservices do not share code imports or direct database connections; all communication happens through REST calls via `axios`.
- **JWT Authorization:** Auth headers (`Authorization: Bearer <token>`) protect private endpoints.
- **Microservices Health Monitoring:** Real-time ping latency tests and cluster state indicators directly in the Admin Dashboard.
