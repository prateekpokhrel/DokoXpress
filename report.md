# PROJECT REPORT: DOKOXPRESS
## Hyper-Local Multi-Vendor Marketplace & Delivery Ecosystem for Nepal

---

### 1. TITLE
**DokoXpress** — A premier, next-generation hyper-local logistics and commerce platform engineered to bridge the gap between local Nepali vendors and urban consumers through a role-optimized digital ecosystem.

---

### 2. PROBLEM STATEMENT (Nepal Market Focus)
Despite the digital push in Nepal, the local commerce sector remains highly fragmented. The current market faces several critical challenges:
*   **The "Last-Mile" Address Gap**: Unlike Western markets, Nepal lacks a standardized house-numbering system. Delivery riders often waste 30-40% of their time navigating narrow gallis through phone calls.
*   **Fragmented Local Markets**: Small shopkeepers in Biratnagar, Pokhara, and Kathmandu are often invisible to local customers who live just 2 km away, losing out to centralized giants or requiring customers to travel physically.
*   **Logistics Latency for Essentials**: Existing platforms focus on 24-48 hour delivery. Daily necessities like fresh milk, vegetables, or emergency pharmacy items require sub-30 minute delivery, which remains unaddressed.
*   **Verification & Trust Deficit**: For a multi-vendor system to work in Nepal, there must be a rigorous verification system (using Citizenship/License) to prevent fraud, which is often bypassed in casual social media selling.

---

### 3. COMPREHENSIVE SOLUTION & CORE FEATURES
DokoXpress provides a unified digital bridge with specialized interfaces for all stakeholders:

#### A. Customer Experience (Marketplace)
*   **Hyper-Local Relevance**: Products matching the user's city are automatically prioritized using "City-Weighting" logic.
*   **15-Minute Badge**: Visual markers for products ready for "Express Delivery" within local hubs.
*   **Floating Island Cart**: A compact, floating UI that manages items without page navigation.
*   **Immersive Payment Flow**: A centered, background-blurred `PaymentModal` that supports diverse methods (COD, UPI, Card).

#### B. Vendor Management Portal
*   **Digital Storefront**: Easy inventory management for local shop owners.
*   **Document Verification**: Native support for uploading trade licenses and citizenship IDs.
*   **Real-time Order Tracking**: Dynamic status updates to bridge the gap between shop-prep and rider-assignment.

#### C. Rider Logistics Dashboard
*   **Performance Metrics**: Real-time stats tracking (Deliveries completed, pending tasks, and earnings).
*   **Logistics Verification**: Specialized profile management for vehicle numbers and license verification.
*   **Dynamic Task Management**: Compact interfaces for riders to view pick-up locations and drop-points.

#### D. Centralized Admin Workspace
*   **Verification Module**: Interface for Admins to inspect uploaded documents and approve/reject applications.
*   **User Auditing**: Full oversight of platform users with the ability to manage access permissions.

---

### 4. TECHNOLOGY STACK

#### 4.1 Backend — Spring Boot
*   **Spring Boot** – To build RESTful APIs
*   **Spring Security + JWT** – Authentication and authorization
*   **Spring Data JPA (Hibernate)** – ORM layer for database access
*   **MySQL** – Relational database
*   **Maven** – Build and dependency management
*   **Hibernate Validator** – Input validation
*   **JUnit 5, Mockito** – Testing framework
*   **Swagger / OpenAPI** – API documentation

#### 4.2 Frontend — React
*   **React** – Component-based UI framework
*   **React Router** – For navigation
*   **Axios** – For API calls
*   **useState and useEffect** – State management (basic)
*   **Tailwind CSS** – Styling
*   **Vite** – Development and builds

#### 4.3 Database — MySQL (Using ORM)
*   **MySQL** – Used as the primary relational database
*   **Hibernate (via JPA)** – Handles ORM (Object Relational Mapping)
*   **Entity Classes** – Represent database tables
*   **Repository Interfaces** – Perform CRUD operations without writing SQL
*   **Automatic Table Mapping** – Java objects mapped to database tables
*   **Query Methods / JPQL** – For custom data retrieval
*   **Database Relationships** – One-to-One, One-to-Many, Many-to-Many mappings
*   **Transaction Management** – Ensures data consistency and integrity

---

### 5. UNIQUE SELLING POINTS (USP)
*   **"Midnight Glass" Aesthetic**: The world-class dark/light blend creates a premium impression.
*   **Zero-Interference Checkout**: While paying, the main site is blurred and disabled (`body-scroll lock`).
*   **Smart Sizing Logic**: Components are capped at specific widths to avoid UI stretching.
*   **Nepali Cultural Context**: Native integration of local slogans and icons.

---

### 6. FUTURE IMPROVEMENTS
*   **Automated Galli-Route Mapping**: Integrating custom map layers for narrow Nepali neighborhoods.
*   **Khet-to-Kitchen Integration**: Same-day delivery from farms to consumers.
*   **Offline Mode for Riders**: Ensuring riders can view delivery details without constant connectivity.

---
**Prepared by**: Pratik Pokhrel
**Student Roll No.**: 23053498
**Format Standards**: A4 Optimized | Justified Text | Bottom-Right Page Numbering
**Font Standards**: Heading: 15px | Subheading: 14px | Body: 12px
