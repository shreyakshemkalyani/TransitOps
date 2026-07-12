npx create-next-app@latest
npm install prisma @prisma/client

npm install bcryptjs jsonwebtoken cookie-parser

npm install react-hook-form

npm install axios

npm install react-hot-toast

npm install flowbite flowbite-react

npm install recharts

npm install lucide-react react-icons


Project structure:-
transit-ops/
│
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.js
│   │
│   ├── dashboard/
│   │   └── page.js
│   │
│   ├── vehicles/
│   │   ├── page.js
│   │   ├── add/
│   │   │   └── page.js
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.js
│   │
│   ├── drivers/
│   │   ├── page.js
│   │   ├── add/
│   │   │   └── page.js
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.js
│   │
│   ├── trips/
│   │   ├── page.js
│   │   ├── add/
│   │   │   └── page.js
│   │   └── [id]/
│   │       └── page.js
│   │
│   ├── maintenance/
│   │   ├── page.js
│   │   └── add/
│   │       └── page.js
│   │
│   ├── fuel/
│   │   ├── page.js
│   │   └── add/
│   │       └── page.js
│   │
│   ├── expenses/
│   │   ├── page.js
│   │   └── add/
│   │       └── page.js
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── vehicles/
│   │   ├── drivers/
│   │   ├── trips/
│   │   ├── maintenance/
│   │   ├── fuel/
│   │   └── expenses/
│   │
│   ├── layout.js
│   ├── page.js
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── dashboard/
│   │   ├── DashboardCards.jsx
│   │   ├── FleetChart.jsx
│   │   └── ExpenseChart.jsx
│   │
│   ├── vehicles/
│   ├── drivers/
│   ├── trips/
│   ├── maintenance/
│   ├── fuel/
│   ├── expenses/
│   │
│   └── common/
│       ├── Loader.jsx
│       ├── Modal.jsx
│       ├── DeleteModal.jsx
│       ├── SearchBar.jsx
│       └── StatusBadge.jsx
│
├── lib/
│   ├── prisma.js
│   ├── jwt.js
│   ├── auth.js
│   └── validations.js
│
├── middleware.js
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── .env
├── package.json
└── README.md



👩 Shreya (Authentication + Dashboard)
Owns
app/(auth)/
app/dashboard/

app/api/auth/
app/api/dashboard/

components/layout/
components/dashboard/

lib/auth.js
lib/jwt.js
middleware.js
Responsibilities
Login
Logout
JWT Authentication
Middleware
Dashboard
Charts
KPI Cards
Navbar
Sidebar
👨 Sahil (Vehicle + Driver)
Owns
app/vehicles/
app/drivers/

app/api/vehicles/
app/api/drivers/

components/vehicles/
components/drivers/
Responsibilities

Vehicle CRUD

Driver CRUD

Search

Filters

Validation

Status

👨 Dhruv (Trip Management)
Owns
app/trips/

app/api/trips/

components/trips/
Responsibilities

Trip CRUD

Dispatch

Complete

Cancel

Business Rules

Status Automation

👨 Dev (Maintenance + Fuel + Expenses)
Owns
app/maintenance/
app/fuel/
app/expenses/

app/api/maintenance/
app/api/fuel/
app/api/expenses/

components/maintenance/
components/fuel/
components/expenses/
Responsibilities

Maintenance

Fuel Logs

Expense Logs

Operational Cost

Fuel Efficiency

CSV Export (if time permits)

Shared Files (Nobody Modifies Without Discussion)
prisma/schema.prisma

lib/prisma.js

globals.css

layout.js

package.json

.env
API Ownership
API	Owner
/api/auth/*	Shreya
/api/dashboard/*	Shreya
/api/vehicles/*	Sahil
/api/drivers/*	Sahil
/api/trips/*	Dhruv
/api/maintenance/*	Dev
/api/fuel/*	Dev
/api/expenses/*	Dev
Prisma Models
User
Role
Vehicle
Driver
Trip
Maintenance
FuelLog
Expense
Git Branches
main

feature/shreya-auth-dashboard

feature/sahil-vehicle-driver

feature/dhruv-trip-management

feature/dev-maintenance-expenses
Integration Flow
Vehicle
     │
     ▼
Driver
     │
     ▼
Trip
     │
     ▼
Maintenance
     │
     ▼
Fuel & Expenses
     │
     ▼
Dashboard Analytics