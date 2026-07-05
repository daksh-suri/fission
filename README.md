# Restaurant Reservation Management System

A full-stack web application for managing restaurant table reservations. Customers can book tables for predefined time slots, and administrators have full visibility and control over reservations, tables, and slots. Built with role-based access control and automatic best-fit table allocation.

---

## Features

### Customer
- Sign up and sign in with JWT-based authentication
- Create a reservation by selecting a date, a predefined time slot, and the number of guests
- View a list of all personal reservations with status, table number, and time details
- Cancel a reservation (soft delete — status changes to `cancelled`)

### Administrator
- View all reservations with pagination and optional date filtering
- Update any reservation (change date, time slot, or guest count — table is reassigned automatically if needed)
- Cancel any reservation
- Full CRUD on restaurant tables (table number and capacity)
- Full CRUD on time slots (name, start time, end time)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 7, Axios, Tailwind CSS 4 |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB with Mongoose 9 |
| **Authentication** | JSON Web Tokens (JWT) with bcrypt password hashing |


---

## Folder Structure

```
restaurant-reservations/
├── backend/
│   ├── config/              # MongoDB connection
│   ├── controllers/         # Request handlers, delegate to services
│   ├── middleware/           # auth (JWT), authorize (role gate), errorHandler, notFound
│   ├── models/              # Mongoose schemas (User, Table, Reservation, Slot)
│   ├── routes/              # Route definitions (auth, customer, admin, table, slot)
│   ├── seed/                # Database seed scripts (admin, tables, slots)
│   ├── services/            # Business logic (allocation, CRUD)
│   ├── utils/               # AppError, asyncHandler, logger, withTransaction
│   ├── app.js               # Express app entry point
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI (layouts, forms, cards)
│   │   ├── constants/       # Shared constants (status colors)
│   │   ├── context/         # AuthContext (React Context for auth state)
│   │   ├── pages/           # Route-level pages (auth, customer, admin)
│   │   ├── services/        # API client functions (api, reservation, slot, table)
│   │   └── utils/           # Shared helpers (format, computeSlotTimes)
│   ├── vercel.json            # SPA rewrite rules for Vercel
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local instance or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd restaurant-reservations
```

### 2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../client
npm install
```

### 3. Environment variables
```bash
cp backend/.env.example backend/.env
cp client/.env.example client/.env
```

See the [Environment Variables](#environment-variables) section for details.

### 4. Seed the database
```bash
# From the backend directory
npm run seed         # Create 9 tables (2-seat, 4-seat, 6-seat, 8-seat)
npm run seed:admin   # Create admin account
npm run seed:slots   # Create time slots (Breakfast, Lunch, Early Dinner, Late Dinner)
```

The admin credentials are:
- **Email:** admin@restaurant.com
- **Password:** admin123

### 5. Run the backend
```bash
cd backend
npm start
```
The API server starts at `http://localhost:5000`.

### 6. Run the frontend
In a separate terminal:
```bash
cd client
npm run dev
```
The dev server starts at `http://localhost:5173`.

### 7. Use the application
- Open `http://localhost:5173` in your browser
- **Sign up** as a new customer, or
- **Sign in** as admin using the seeded credentials

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/restaurant_reservations` |
| `JWT_SECRET` | Secret key for signing JWT tokens | _(required)_ |
| `JWT_EXPIRES_IN` | JWT token expiration duration | `1d` |
| `NODE_ENV` | Environment mode (`development`, `production`) | `development` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

### Frontend (`client/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Running the Project

### Development
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd client && npm run dev
```

### Production build
```bash
cd client && npm run build
```
Output is written to `client/dist/`. Serve it with any static file server or configure the backend to serve it.

---

## Seed Scripts

| Script | Command | What it creates |
|---|---|---|
| Tables | `npm run seed` | 9 tables (2×2-seat, 4×4-seat, 2×6-seat, 1×8-seat) |
| Admin | `npm run seed:admin` | Admin user (`admin@restaurant.com` / `admin123`) |
| Slots | `npm run seed:slots` | 4 time slots (Breakfast 08:00-10:00, Lunch 12:00-14:00, Early Dinner 18:00-20:00, Late Dinner 20:00-22:00) |

---

## API Overview

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | Public | Register a new customer account |
| `POST` | `/auth/signin` | Public | Sign in and receive a JWT |

### Customer Reservations
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/reservations` | Customer | Create a new reservation |
| `GET` | `/reservations/my` | Customer | List own reservations |
| `DELETE` | `/reservations/:id` | Customer | Cancel own reservation |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/reservations` | Admin | List all reservations (`?date=&page=&limit=`) |
| `PATCH` | `/admin/reservations/:id` | Admin | Update any reservation |
| `DELETE` | `/admin/reservations/:id` | Admin | Cancel any reservation |

### Table Management (Admin)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/tables` | Admin | List all tables |
| `POST` | `/tables` | Admin | Create a table |
| `PATCH` | `/tables/:id` | Admin | Update a table |
| `DELETE` | `/tables/:id` | Admin | Delete a table |

### Slot Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/slots` | Authenticated | List all time slots |
| `POST` | `/slots` | Admin | Create a time slot |
| `PATCH` | `/slots/:id` | Admin | Update a time slot |
| `DELETE` | `/slots/:id` | Admin | Delete a time slot |

### Health
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Server health check |

All API responses follow the format:
```json
{ "success": true, "data": { ... } }
```

Error responses:
```json
{ "success": false, "message": "Error description" }
```

HTTP status codes: 200 (success), 201 (created), 400 (validation), 401 (unauthenticated), 403 (forbidden), 404 (not found), 409 (conflict), 500 (server error). In development mode, error responses include a `stack` field.

---

## Reservation & Availability Logic

### Table Allocation Strategy

When a customer creates a reservation, the system automatically assigns a table using a **best-fit** strategy:

1. **Busy table detection** — Queries all existing reservations overlapping the requested time slot with status `confirmed` or `seated`. Those tables are excluded from consideration.
2. **Smallest suitable table** — From the remaining available tables, selects the smallest table that can accommodate the requested number of guests (sorted by capacity ascending). This preserves larger tables for bigger parties.
3. **Fallback** — If no table is found, checks whether any table in the restaurant has sufficient capacity (returns 400) or if all suitable tables are occupied (returns 409).

### Overlap Detection

Two reservations overlap if one starts before the other ends AND ends after the other starts (`startTime < otherEnd && endTime > otherStart`). Strict inequality is used, so a reservation ending exactly when another begins is **not** a conflict — this allows back-to-back bookings on the same table.

### Concurrency Protection

All reservation mutations (create, update, cancel) are wrapped in **MongoDB transactions**. The allocation, conflict detection, and write operations execute within a single transaction with snapshot isolation. If two customers simultaneously book overlapping times, one transaction commits and the other is automatically aborted and retried by the driver. A compound unique index on `{ table, startTime }` provides an additional safety net against same-startTime collisions.

### Update Logic

When an administrator updates a reservation, the system first checks whether the currently assigned table remains suitable (has enough capacity and is free during the new time). If it does, the table is kept. Otherwise, the allocation algorithm re-runs to find the best alternative, excluding the current reservation from conflict detection.

### Cancellation

Cancellations use a soft-delete approach — the reservation status changes from `confirmed` to `cancelled`. Cancelled reservations are excluded from overlap checks, freeing the table. Reservations with status `seated` or `completed` cannot be cancelled.

---

## Slot Management

Time slots are predefined windows (e.g., Lunch 12:00-14:00) that customers select when creating a reservation. Slots are managed by administrators via the admin panel. Each slot has a name, start time, and end time. When a slot is deleted, the system checks for active reservations whose time range overlaps with the slot's time range and blocks deletion if conflicts exist.

---

## Role-Based Access Control

### Roles
The system defines two roles: **customer** and **admin**.

### Customer Permissions
- Create a reservation
- View only their own reservations
- Cancel only their own reservations

### Administrator Permissions
- View all reservations with pagination and date filtering
- Update any reservation
- Cancel any reservation
- Full CRUD on tables and time slots

### Authentication Flow
1. User signs up or signs in. Server returns a signed JWT containing `id` and `role`.
2. The client stores the token in `localStorage` and attaches it as `Authorization: Bearer <token>` on all requests.
3. The Axios interceptor automatically attaches the token. On 401 responses it clears credentials and dispatches a custom `auth:expired` event; `AuthContext` listens and clears state, causing `ProtectedRoute` to redirect to `/signin` via client-side navigation.

### Authorization Middleware
- **`auth` middleware** — Verifies the JWT, attaches `{ id, role }` to `req.user`. Returns 401 if missing/invalid.
- **`authorize` middleware** — Accepts allowed roles, returns 403 if the user's role is not included.

Routes are protected by chaining these middleware functions:
```javascript
router.use(auth, authorize('admin'));   // Admin-only
router.use(auth, authorize('customer')); // Customer-only
router.use(auth);                        // Any authenticated user
```

---

## Assumptions

- The system manages a **single restaurant** with a fixed set of tables and predefined time slots.
- Tables and slots are seeded before the application is used and can be managed by the admin afterwards.
- Customers can book **back-to-back time slots** — a reservation ending exactly when another begins is not considered an overlap.
- The **customer role is hardcoded at signup** — users cannot change their role. Admin accounts are created only through the seed script.
- Tables are **assigned automatically** — customers cannot choose a specific table.
- Reservation times are defined by the selected time slot. Overnight slots (e.g., 22:00-02:00) are supported.
- The server's local timezone is assumed to match the restaurant's timezone for slot conflict detection.
- Email notifications, payment processing, and real-time updates are out of scope.

---

## Known Limitations

- **Timezone sensitivity** — Slot conflict detection during slot deletion uses the server's local timezone. If the server timezone differs from the restaurant's timezone, the check may produce false negatives or positives.
- **No email notifications** — Customers are not notified when a reservation is created, updated, or cancelled.
- **No payment integration** — Reservations are free and do not require a deposit.
- **No real-time updates** — The page must be refreshed to see changes.
- **No reservation reminders** — Customers are not reminded of upcoming reservations.
- **No analytics dashboard** — The admin dashboard is a minimal landing page without statistics.
- **No client-side input sanitization** — Input validation is performed server-side only.
- **No rate limiting** — Authentication endpoints are not rate-limited, making them vulnerable to brute force attacks.

---

## Future Improvements

- **Timezone configuration** — Store the restaurant's timezone and convert consistently for all slot-related queries.
- **Email notifications** — Send confirmation and reminder emails via Nodemailer or SendGrid.
- **Real-time updates** — Use WebSockets to push reservation updates without polling.
- **Waitlist management** — Allow customers to join a waitlist and notify them when a slot opens.
- **Restaurant hours** — Add configurable opening/closing times to prevent out-of-hours bookings.
- **Unit and integration tests** — Add test coverage for allocation logic, overlap detection, and API endpoints.
- **Multi-restaurant support** — Extend the data model to support multiple restaurants, each with its own tables, slots, and settings.

---

## Deployment

### Frontend (Vercel)
Deploy the `client/` directory to Vercel. The included `vercel.json` rewrites all routes to `index.html` so React Router handles client-side navigation properly.

### Backend (Render / any Node host)
```bash
cd backend && npm start
```
Set all required environment variables on the hosting platform.

### Environment Variables for Production
Ensure all production values are set in `.env`:
- `NODE_ENV=production`
- `JWT_SECRET` — a strong random secret
- `MONGODB_URI` — production database connection string
- `CLIENT_URL` — the frontend's production URL (for CORS)

### Security in Production
- Stack traces are hidden from error responses when `NODE_ENV=production`.

---

## License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
