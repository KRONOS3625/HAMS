# HAMS — Helpdesk & Asset Management System

A full-stack **Helpdesk and Asset Management System (HAMS)** designed to centralize IT complaint management, asset tracking, user administration, technician assignment, dashboards, and operational reporting in a single platform.

The system implements **role-based access control** for Employees, Technicians, and Administrators, with a RESTful backend and a lightweight JavaScript frontend.

---

## 📌 Overview

HAMS provides an organization with a centralized platform to:

* Register and manage IT assets
* Allow employees to raise and track complaints
* Assign complaints to technicians
* Track complaint status throughout its lifecycle
* Maintain complaint history and resolution notes
* Manage employees, technicians, and administrators
* Monitor assets and warranty information
* View dashboard statistics
* Generate operational reports
* Export report data as CSV
* Secure the application using JWT authentication and role-based authorization

The application follows a **client-server architecture**, with a JavaScript frontend communicating with a Node.js/Express REST API backed by MongoDB.

---

## ✨ Key Features

### 🎫 Helpdesk / Complaint Management

Employees can create complaints associated with their assigned assets.

Each complaint contains:

* Unique complaint ID
* Employee information
* Department
* Associated asset
* Complaint category
* Detailed description
* Priority
* Current status
* Assigned technician
* Attachments
* Administrative remarks
* Resolution notes
* Complete activity history
* Closure date

### Complaint Lifecycle

Complaints move through the following workflow:

```text
Open
  ↓
Assigned
  ↓
In Progress
  ↓
Resolved
  ↓
Closed
```

Only appropriate roles can perform each operation.

* **Employee** — raise and update complaints
* **Administrator** — assign technicians and close resolved complaints
* **Technician** — update complaint status and resolution information

---

### 💻 Asset Management

Administrators can manage the organization's IT asset inventory.

Asset records include:

* Asset ID
* Asset name
* Category
* Brand
* Purchase date
* Warranty expiry
* Assigned employee

Administrators can:

* Add assets
* Edit assets
* Delete assets
* View asset inventory
* Search assets
* View asset statistics
* Generate warranty-related information

---

### 👥 User Management

Administrators can manage system users.

Supported roles:

| Role          | Description                                              |
| ------------- | -------------------------------------------------------- |
| Employee      | Raises and tracks their own complaints                   |
| Technician    | Handles complaints assigned to them                      |
| Administrator | Manages users, assets, assignments, closure, and reports |

User records contain:

* Unique user ID
* Name
* Email
* Password
* Mobile number
* Department
* Role

---

### 📊 Dashboard

The dashboard provides role-specific statistics.

Complaint statistics include:

* Total complaints
* Open complaints
* Assigned complaints
* In Progress complaints
* Resolved complaints
* Closed complaints

Administrators additionally receive:

* Total users
* Total employees
* Total technicians
* Total assets

The dashboard also supports:

* Recent complaints
* Complaints by category
* Complaints by department

Dashboard data is filtered according to the authenticated user's role.

---

### 📈 Reports

Administrators can generate reports based on:

* Department
* Complaint category
* Monthly complaint volume
* Closed complaints
* Pending complaints

Reports can also be exported from the frontend as **CSV files**.

---

### 🔐 Authentication & Authorization

The backend uses **JWT-based authentication**.

Authentication flow:

```text
Login
  ↓
JWT Token Generated
  ↓
Token Stored by Client
  ↓
Bearer Token Sent with API Requests
  ↓
JWT Verification
  ↓
User Retrieved
  ↓
Role-Based Authorization
```

Passwords are protected using **bcryptjs** hashing.

Role-based middleware prevents unauthorized users from accessing restricted operations.

---

## 🏗️ System Architecture

```text
┌──────────────────────────────┐
│          Frontend            │
│                              │
│ HTML + CSS + JavaScript      │
│                              │
│ Dashboard                    │
│ Complaints                   │
│ Assets                       │
│ Users                        │
│ Reports                      │
│ Profile                      │
└──────────────┬───────────────┘
               │
               │ REST API / JSON
               │
┌──────────────▼───────────────┐
│          Backend             │
│                              │
│ Node.js + Express.js         │
│                              │
│ Authentication               │
│ Role Authorization           │
│ Complaint Management         │
│ Asset Management             │
│ User Management              │
│ Dashboard                    │
│ Reporting                    │
│ File Uploads                 │
└──────────────┬───────────────┘
               │
               │ Mongoose
               │
┌──────────────▼───────────────┐
│          MongoDB             │
│                              │
│ Users                        │
│ Assets                       │
│ Complaints                   │
│ Notifications                │
│ Counters                     │
└──────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Font Awesome
* Fetch API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Morgan
* CORS
* dotenv

### Development

* Nodemon
* npm

---

## 📁 Project Structure

```text
HAMS/
│
├── client/
│   ├── index.html
│   ├── login.html
│   ├── static-server.cjs
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── api.js
│       ├── app.js
│       ├── assets.js
│       ├── auth.js
│       ├── complaint.js
│       ├── config.js
│       ├── dashboard.js
│       ├── helpers.js
│       ├── login.js
│       ├── modal.js
│       ├── profile.js
│       ├── reports.js
│       ├── router.js
│       ├── toast.js
│       └── users.js
│
└── server/
    ├── server.js
    ├── package.json
    ├── package-lock.json
    ├── .env.example
    ├── .gitignore
    │
    ├── config/
    │   └── db.js
    │
    ├── controllers/
    │   ├── assetController.js
    │   ├── authController.js
    │   ├── complaintController.js
    │   ├── dashboardController.js
    │   ├── reportController.js
    │   └── userController.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── roleMiddleware.js
    │   ├── uploadMiddleware.js
    │   └── validateObjectId.js
    │
    ├── models/
    │   ├── Asset.js
    │   ├── Complaint.js
    │   ├── Counter.js
    │   ├── Notification.js
    │   └── User.js
    │
    ├── routes/
    │   ├── assetRoutes.js
    │   ├── authRoutes.js
    │   ├── complaintRoutes.js
    │   ├── dashboardRoutes.js
    │   ├── reportRoutes.js
    │   └── userRoutes.js
    │
    ├── seed/
    │   └── seed.js
    │
    └── utils/
        ├── createNotification.js
        ├── generateAssetId.js
        ├── generateComplaintId.js
        └── generateUserId.js
```

---

## 🔌 API Endpoints

The backend runs under the `/api` prefix.

### Authentication

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/api/auth/login` | Authenticate user              |
| GET    | `/api/auth/me`    | Get current authenticated user |

### Users

| Method | Endpoint         | Access |
| ------ | ---------------- | ------ |
| GET    | `/api/users`     | Admin  |
| GET    | `/api/users/:id` | Admin  |
| POST   | `/api/users`     | Admin  |
| PUT    | `/api/users/:id` | Admin  |
| DELETE | `/api/users/:id` | Admin  |

### Assets

| Method | Endpoint               | Access        |
| ------ | ---------------------- | ------------- |
| GET    | `/api/assets`          | Authenticated |
| GET    | `/api/assets/search`   | Authenticated |
| GET    | `/api/assets/stats`    | Authenticated |
| GET    | `/api/assets/warranty` | Authenticated |
| GET    | `/api/assets/:id`      | Authenticated |
| POST   | `/api/assets`          | Admin         |
| PUT    | `/api/assets/:id`      | Admin         |
| DELETE | `/api/assets/:id`      | Admin         |

### Complaints

| Method | Endpoint                          | Access        |
| ------ | --------------------------------- | ------------- |
| POST   | `/api/complaints`                 | Employee      |
| GET    | `/api/complaints`                 | Authenticated |
| GET    | `/api/complaints/search`          | Authenticated |
| GET    | `/api/complaints/dashboard/stats` | Authenticated |
| GET    | `/api/complaints/my/history`      | Employee      |
| GET    | `/api/complaints/:id`             | Authenticated |
| PUT    | `/api/complaints/:id`             | Employee      |
| PUT    | `/api/complaints/assign/:id`      | Admin         |
| PUT    | `/api/complaints/status/:id`      | Technician    |
| PUT    | `/api/complaints/close/:id`       | Admin         |
| DELETE | `/api/complaints/:id`             | Admin         |

### Dashboard

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/api/dashboard`            | Dashboard overview       |
| GET    | `/api/dashboard/recent`     | Recent complaints        |
| GET    | `/api/dashboard/category`   | Complaints by category   |
| GET    | `/api/dashboard/department` | Complaints by department |

### Reports

| Method | Endpoint                  | Access |
| ------ | ------------------------- | ------ |
| GET    | `/api/reports`            | Admin  |
| GET    | `/api/reports/department` | Admin  |
| GET    | `/api/reports/category`   | Admin  |
| GET    | `/api/reports/monthly`    | Admin  |
| GET    | `/api/reports/closed`     | Admin  |
| GET    | `/api/reports/pending`    | Admin  |

---

## 🗄️ Database Models

### User

```text
User
├── userId
├── name
├── email
├── password
├── mobile
├── department
├── role
├── createdAt
└── updatedAt
```

### Asset

```text
Asset
├── assetId
├── assetName
├── category
├── brand
├── purchaseDate
├── warrantyExpiry
├── assignedEmployee
├── createdAt
└── updatedAt
```

### Complaint

```text
Complaint
├── complaintId
├── employee
├── employeeId
├── employeeName
├── department
├── asset
├── assetId
├── assetName
├── category
├── description
├── priority
├── status
├── technician
├── technicianId
├── technicianName
├── attachment
├── adminRemarks
├── resolutionNotes
├── history[]
├── dateClosed
├── createdAt
└── updatedAt
```

### Supporting Models

The backend also contains models for:

* Notifications
* Sequential ID counters

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB / MongoDB Atlas
* Git

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd HAMS
```

---

## 2. Configure the Backend

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
```

> **Important:** Never commit `.env` to GitHub. Use `.env.example` as the template.

---

## 3. Start the Backend

For normal execution:

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

The API will run by default at:

```text
http://localhost:5000
```

You can verify that the backend is running by opening:

```text
http://localhost:5000
```

The API should return:

```json
{
  "success": true,
  "message": "Helpdesk Management System API Running"
}
```

---

## 4. Seed the Database

The project includes a database seeding script containing sample users, an asset, and a complaint.

From the `server` directory:

```bash
npm run seed
```

> **Warning:** The seed script clears existing Users, Assets, Complaints, and Counters before inserting the sample data. Do not run it against a production database containing data you want to preserve.

---

## 5. Start the Frontend

Open a second terminal and navigate to the client directory:

```bash
cd client
```

The client includes a lightweight Node.js static server.

Start it with:

```bash
node static-server.cjs
```

The frontend will run by default at:

```text
http://localhost:8080
```

Open the application in your browser:

```text
http://localhost:8080
```

---

## 🔑 Demo Accounts

The seed script creates sample accounts for each supported role.

| Role          | Email                  | Password       |
| ------------- | ---------------------- | -------------- |
| Administrator | `admin@company.com`    | `Admin@123`    |
| Employee      | `employee@company.com` | `Employee@123` |
| Technician    | `tech@company.com`     | `Tech@12345`   |

These credentials are intended **only for local/demo use**.

Change or remove seeded credentials before deploying the application to a real environment.

---

## 🔄 Example Workflow

### Employee

```text
Login
  ↓
Dashboard
  ↓
View Assigned Assets
  ↓
Raise Complaint
  ↓
Select Asset
  ↓
Enter Issue Details
  ↓
Submit Complaint
  ↓
Track Complaint Status
```

### Administrator

```text
Login
  ↓
Dashboard
  ↓
Review Complaints
  ↓
Assign Technician
  ↓
Monitor Resolution
  ↓
Close Resolved Complaint
```

### Technician

```text
Login
  ↓
View Assigned Complaints
  ↓
Open Complaint
  ↓
Update Status
  ↓
Add Resolution Notes
  ↓
Mark Complaint as Resolved
```

---

## 🔒 Security Features

The system implements several backend security mechanisms:

* JWT authentication
* Password hashing using bcryptjs
* Role-based authorization
* Protected API routes
* Bearer token authentication
* MongoDB ObjectId validation
* Controlled file uploads using Multer
* Environment-based configuration
* Password exclusion when retrieving authenticated users

---

## 🧩 Backend Architecture

The backend follows a modular Express architecture:

```text
Request
   ↓
Route
   ↓
Authentication Middleware
   ↓
Role Middleware
   ↓
Controller
   ↓
Mongoose Model
   ↓
MongoDB
   ↓
JSON Response
```

Responsibilities are separated between:

* **Routes** — define API endpoints
* **Middleware** — authentication, authorization, validation, uploads
* **Controllers** — business logic
* **Models** — MongoDB schemas
* **Utilities** — ID generation and notifications
* **Configuration** — database connection

---

## 📊 Reporting Architecture

Reports are generated server-side using MongoDB aggregation operations.

Available analytical views include:

```text
Department
   ├── Total Complaints
   ├── Open
   └── Closed

Category
   └── Complaint Count

Monthly
   └── Complaint Volume by Year/Month

Closed
   └── Closed Complaint Records

Pending
   └── Non-Closed Complaint Records
```

The frontend can export displayed report data as CSV.

---

## 📎 File Attachments

Complaint creation and updates support file attachments through **Multer**.

Uploaded files are exposed through the backend's:

```text
/uploads
```

static route.

---

## 🎯 Project Objectives

The primary objectives of HAMS are to:

1. Centralize IT complaint management.
2. Improve visibility into complaint status.
3. Establish clear technician responsibility.
4. Maintain an organized IT asset inventory.
5. Provide role-specific access to system functions.
6. Maintain historical complaint activity.
7. Provide administrators with operational analytics.
8. Reduce manual tracking of IT support requests.
9. Improve asset warranty and assignment visibility.
10. Provide a scalable REST-based architecture.

---

## 🔮 Future Enhancements

Potential improvements include:

* Email notifications
* Real-time notifications using WebSockets
* Advanced asset assignment workflows
* Asset maintenance scheduling
* SLA tracking and escalation
* Automatic warranty expiry alerts
* Advanced search and filtering
* Pagination for large datasets
* Password reset functionality
* Multi-factor authentication
* Audit logs
* Interactive analytics dashboards
* PDF report generation
* Cloud-based file storage
* Docker deployment
* Automated testing and CI/CD

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Varoon CK**

Helpdesk & Asset Management System — HAMS

Built using Node.js, Express.js, MongoDB, Mongoose, HTML, CSS, and JavaScript.
