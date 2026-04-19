# DokoXpress Frontend

Multi-vendor e-commerce frontend built with React, Vite, JSX, Tailwind CSS, React Router, Axios, React Hook Form, and Zod.

## Highlights

- Role-based auth simulation for `Customer`, `Vendor`, and `Admin`
- JWT/session handling with `localStorage` or `sessionStorage`
- Customer product discovery, filters, cart, checkout simulation, order history, and profile
- Vendor product CRUD, order management, and verification-aware profile
- Admin overview, user/vendor listings, and vendor approval panel
- API/service layer structured for future Spring Boot + JWT integration
- Account creation for customer, vendor, and admin roles

## Examples of some Platform Credentials

- Customer: `ava.customer@dokoxpress.com`
- Vendor: `milan.vendor@dokoxpress.com`
- Admin: `admin@dokoxpress.com`
- Password: `Developer_Secret`

## Project Structure

```text
src/
  components/
  hooks/
  layouts/
  pages/
  router/
  schemas/
  services/
  store/
  types/
  utils/
```

## Run Locally

```bash
npm install
npm run dev
```

## Backend Integration Notes

- Axios client is defined in [src/services/api/client.ts](/c:/Users/KIIT0001/Downloads/Captson%20Project/src/services/api/client.ts)
- Current service modules use browser-backed sample persistence, but the call boundaries are already isolated under `src/services/api/`
- Auth/session helpers live in [src/utils/token.ts](/c:/Users/KIIT0001/Downloads/Captson%20Project/src/utils/token.ts)
- Sample seed data lives in [src/services/mocks/seed.ts](/c:/Users/KIIT0001/Downloads/Captson%20Project/src/services/mocks/seed.ts)
