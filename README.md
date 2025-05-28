# 🛍️ StepStore

StepStore is a progressive microservices-based online marketplace designed for creatives to showcase, manage, and sell their products. The platform allows users to browse, search, and order items while enabling sellers to manage their inventory and product listings. Built with scalability, performance, and modularity in mind, StepStore leverages a modern microservice architecture with event-driven communication powered by Kafka.

---

## 🚀 Features

### 🧑‍💻 Users & Sellers

- Create and manage accounts
- Secure authentication and JWT-based authorization
- View seller profiles

### 🛒 Marketplace

- Browse, search, and filter products
- View product details and seller information
- Place and track orders

### 📦 Seller Tools

- Manage product listings and inventory
- Real-time notifications for activity
- Dashboard for sales and billing

---

## 🧱 Architecture Overview

                 +-------------+
                 |   Clients   |
                 +------+------+
                        |
                        v
                 +-------------+
                 |   NGINX     |  ← Reverse proxy
                 +------+------+
                        |
                        v
                 +-------------+
                 | API Gateway |  ← Unified entry point
                 +------+------+
                        |

---

Each service is:

- Developed independently using **Node.js**, **Express.js**, and **TypeScript**
- Owns its **PostgreSQL** database
- Uses **Zod** for input validation
- Integrates **Winston** for logging
- Communicates asynchronously via **Kafka**

---

## 🧰 Tech Stack

| Layer             | Technology                            |
| ----------------- | ------------------------------------- |
| Backend Framework | Node.js, Express.js (TypeScript)      |
| API Gateway       | Custom Gateway (Express + TypeScript) |
| Reverse Proxy     | NGINX                                 |
| Database          | PostgreSQL + TypeORM                  |
| Validation        | Zod                                   |
| Logging           | Winston                               |
| Event Bus         | Apache Kafka                          |
| Auth              | JWT                                   |

---

## 📦 Services Overview

### 🔐 Identify Service

- Handles user and seller registration
- Issues and validates JWT tokens
- Manages login/logout and account profiles

### 📦 Product Service

- CRUD operations for product listings
- Filtering, searching, and categorization
- Ownership validation for product edits

### 💬 Notification Service

- Sends email and in-app notifications
- Subscribes to key Kafka events (e.g., new order, product update)

### 💳 Payment Service

- Handles payment intents and verifications
- Integrates with external payment processors

### 🧾 Billing Service

- Tracks user billing history
- Generates invoices and transaction logs

### 🌉 API Gateway

- Routes requests to appropriate services
- Centralized error handling and response formatting

---

## 🐳 Dockerized Setup

Each service includes a `Dockerfile` for containerization. You can use `docker-compose` to orchestrate all services.

### 🔧 Starting with Docker Compose

```bash
docker-compose up --build
```

git clone https://github.com/sechibueze/stepstore.git
cd stepstore

| Service          | Status         |
| ---------------- | -------------- |
| Identify Service | 🟢 Started     |
| Product Service  | 🟢 In Progress |
| Notification     | 🟡 Planned     |
| Payment          | 🟡 Planned     |
| Billing          | 🔴 Not Started |
| API Gateway      | 🟢 In Progress |

# 🛠 Future Enhancements

- Add GraphQL support
- Integrate Redis caching layer
- Deploy with Kubernetes
- Add observability (Prometheus, Grafana)
- Enhance seller dashboard with analytics
