## DokoXpress
### Next-Gen Hyper-Local Multi-Vendor Marketplace & Delivery Ecosystem for Nepal

---

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)

**DokoXpress** is a premium, full-stack logistics and commerce platform engineered to bridge the gap between local Nepali vendors and urban consumers. By focusing on hyper-local relevance and robust verification, it provides a trusted ecosystem for rapid commerce in fragmented markets.

---

##  Key Features

###  Customer Marketplace
- **Hyper-Local Priority**: Search results weighted by city proximity.
- **Express Delivery**: Products tagged with a "15-Minute Badge" for local hubs.
- **Floating Island Cart**: Manage items seamlessly with a persistent, non-intrusive UI.
- **Midnight Glass Aesthetic**: A premium dark/light blend design for a modern look.
- **Zero-Interference Checkout**: Secure payment flow with body-scroll locking and background blurring.

###  Vendor Portal
- **Digital Storefront**: Comprehensive inventory and SKU management.
- **Rigorous Verification**: Integrated document upload (Citizenship/License) for KYC compliance.
- **Order Tracking**: Real-time status updates from preparation to rider assignment.

###  Rider Logistics
- **Performance Dashboard**: Real-time tracking of earnings, completed deliveries, and pending tasks.
- **Task Management**: Optimized pick-up and drop-off point visualization.
- **Verification Profile**: Vehicle and license management for platform trust.

###  Admin Workspace
- **Verification Engine**: Approval workflow for vendor and rider onboarding.
- **User Auditing**: Global oversight and permission management.
- **Platform Analytics**: High-level stats on marketplace health.

---

##  Technology Stack

### Backend (Java Spring Boot)
- **Spring Boot 4.x**: Core framework for RESTful micro-services.
- **Spring Security + JWT**: Robust stateless authentication and role-based access control (RBAC).
- **Spring Data JPA**: ORM layer for MySQL persistence.
- **MySQL**: Relational database for transactional integrity.
- **Hibernate Validator**: Enterprise-grade input validation.
- **Lombok**: Boilerplate reduction.

### Frontend (React + Vite)
- **React 18**: Component-based UI architecture.
- **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS**: Utility-first styling for the "Midnight Glass" aesthetic.
- **Lucide React**: Clean and minimal iconography.
- **React Hook Form + Zod**: Type-safe form management and validation.
- **Axios**: Promised-based HTTP client for API communication.

---

##  Getting Started

### Prerequisites
- **Java 21** or higher
- **Node.js 18+** & npm
- **MySQL 8.0+**
- **Maven 3.x**

### 1. Database Setup
Create a MySQL database named `doko_xpress`:
```sql
CREATE DATABASE doko_xpress;
```

### 2. Backend Configuration
Navigate to `backend/src/main/resources/application.properties` and update your database credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/doko_xpress
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
server.port=8081
```

Run the backend:
```bash
cd backend
mvn spring-boot:run
```

### 3. Frontend Configuration
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8081/api
```

Install dependencies and run:
```bash
npm install
npm run dev
```

---

##  Platform Credentials (Demo)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@dokoxpress.com` | `Developer_Secret` |
| **Vendor** | `milan.vendor@dokoxpress.com` | `Developer_Secret` |
| **Customer** | `ava.customer@dokoxpress.com` | `Developer_Secret` |
| **Delivery Patner** | `ava.rider@dokoxpress.com` | `Developer_Secret` |

---

##  Project Structure

```text
├── backend/                # Spring Boot Application
│   ├── src/main/java/      # Business logic & Controllers
│   ├── src/main/resources/ # Config & SQL scripts
│   └── pom.xml             # Maven dependencies
├── src/                    # React Frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Role-specific views
│   ├── services/           # API integration (Axios)
│   ├── utils/              # Helpers & Persistence
│   └── layouts/            # Page wrappers (Admin/Vendor/Public)
├── public/                 # Static assets
└── tailwind.config.js      # Design system configuration
```

---

##  Author
**Pratik Pokhrel**  
Full-Stack Developer | Nepali Market Specialization  
*Developed as a Capstone Project for DokoXpress.*

---
