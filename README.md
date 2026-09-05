# 🏥 HealthQueue

> A full-stack doctor appointment booking platform built with **React 19**, **Node.js / Express 5**, and **MongoDB**.

HealthQueue is a **three-tier web application** that connects patients with verified doctors across multiple medical specialties. Patients can discover doctors, check real-time slot availability, and book appointments — all managed through dedicated admin and doctor dashboards.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Pages & Routes](#️-pages--routes)
- [Data Models](#-data-models)
- [Deployment](#️-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## Architecture Overview

HealthQueue is composed of three independently-running applications that communicate over HTTP:

| App | Description | Default Port |
|-----|-------------|:---:|
| **`frontend/`** | Patient-facing React app (browse doctors, book & manage appointments) | `5173` |
| **`admin/`** | Combined Admin + Doctor dashboard React app | `5174` |
| **`backend/`** | RESTful API server — Express 5 + MongoDB | `4000` |

```
Browser (Patient)          Browser (Admin / Doctor)
       │                            │
       ▼                            ▼
  frontend :5173              admin :5174
       │                            │
       └──────────┬─────────────────┘
                  ▼
           backend :4000
                  │
       ┌──────────┴──────────┐
       ▼                     ▼
   MongoDB Atlas         Cloudinary
  (data storage)      (image storage)
```

---

## ✨ Features

### 🧑‍💼 Patient (Frontend)
| Feature | Details |
|---------|---------|
| **Browse & Filter Doctors** | Filter by 6 medical specialities |
| **Book Appointments** | Interactive 7-day slot picker with 30-minute time windows (10 AM – 9 PM) |
| **Cancel Appointments** | Cancel upcoming bookings from the appointments page |
| **My Profile** | Update name, gender, DOB, address, phone, and profile picture |
| **My Appointments** | View all past and upcoming appointments with doctor details |
| **JWT Authentication** | Register & login with secure token-based sessions |
| **Related Doctors** | Smart suggestions for doctors sharing the same speciality |

### 🛡️ Admin Panel
| Feature | Details |
|---------|---------|
| **Add Doctor** | Register doctors with image upload (Cloudinary), speciality, degree, experience, fees, and address |
| **Doctors List** | View all registered doctors and toggle their availability |
| **All Appointments** | Full oversight of every booking on the platform; cancel any appointment |
| **Dashboard** | Live platform statistics — total doctors, patients, and appointments |

### 🩺 Doctor Portal
| Feature | Details |
|---------|---------|
| **Doctor Login** | Separate JWT-authenticated login for doctors |
| **My Appointments** | View upcoming appointments with patient details |
| **Complete / Cancel** | Mark appointments as completed or cancel them |
| **Doctor Dashboard** | Personal stats — earnings, patient count, and appointment totals |
| **Profile Management** | Update availability status, fees, and bio |

### ⚙️ Backend
| Feature | Details |
|---------|---------|
| **JWT Authentication** | Separate signed tokens for admin, doctor, and user roles |
| **Image Uploads** | Multipart form via Multer → Cloudinary cloud storage |
| **Password Hashing** | bcrypt for secure credential storage |
| **Input Validation** | Email format and password strength via `validator` |
| **CORS Configuration** | Whitelisted origins with `.onrender.com` wildcard support |

---

## 🛠️ Tech Stack

### Frontend & Admin
| Technology | Version | Purpose |
|------------|---------|---------|
| React | `^19.1.1` | UI framework |
| React Router DOM | `^7.9.4` | Client-side routing |
| Tailwind CSS | `^4.1.14` | Utility-first styling |
| Axios | `^1.12.2` | HTTP client |
| React Toastify | `^11.0.5` | Toast notifications |
| Vite | `^7.1.7` | Build tool & dev server |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js + Express | `^5.1.0` | REST API server |
| MongoDB + Mongoose | `^8.19.2` | Database & ODM |
| JSON Web Token | `^9.0.2` | Authentication |
| bcrypt | `^6.0.0` | Password hashing |
| Multer | `^2.0.2` | File upload handling |
| Cloudinary | `^2.8.0` | Cloud image storage |
| dotenv | `^17.2.3` | Environment configuration |
| validator | `^13.15.20` | Input sanitization |
| cors | `^2.8.5` | Cross-origin resource sharing |
| nodemon | `^3.1.10` | Dev hot-reloading |

---

## 📁 Project Structure

```
HealthQueue/
│
├── backend/                         # Express REST API
│   ├── config/
│   │   ├── mongodb.js               # MongoDB connection setup
│   │   └── cloudinary.js            # Cloudinary SDK configuration
│   ├── controllers/
│   │   ├── adminController.js       # Admin: login, add doctor, dashboard, appointments
│   │   ├── doctorController.js      # Doctor: login, appointments, profile, dashboard
│   │   └── userController.js        # User: register, login, profile, book/cancel appointments
│   ├── middlewares/
│   │   ├── authAdmin.js             # JWT admin authentication guard
│   │   ├── authDoctor.js            # JWT doctor authentication guard
│   │   ├── authUser.js              # JWT user authentication guard
│   │   └── multer.js                # Multer file upload handler
│   ├── models/
│   │   ├── userModel.js             # Patient Mongoose schema
│   │   ├── doctorModel.js           # Doctor Mongoose schema
│   │   └── appointmentModel.js      # Appointment Mongoose schema
│   ├── routes/
│   │   ├── adminRoute.js            # /api/admin routes
│   │   ├── doctorRoute.js           # /api/doctor routes
│   │   └── userRoute.js             # /api/user routes
│   ├── .env                         # Environment variables (never commit)
│   ├── package.json
│   └── server.js                    # App entry point
│
├── frontend/                        # Patient-facing React app
│   └── src/
│       ├── assets/                  # Images, icons, static data
│       ├── components/
│       │   ├── Navbar.jsx           # Global navigation bar with auth state
│       │   ├── Footer.jsx           # Global footer
│       │   ├── Header.jsx           # Hero/header section
│       │   ├── Banner.jsx           # CTA banner component
│       │   ├── TopDoctors.jsx       # Featured doctors section
│       │   ├── SpecialityMenu.jsx   # Speciality filter cards
│       │   └── RelatedDoctors.jsx   # Related doctors sidebar
│       ├── context/
│       │   └── AppContext.jsx       # Global state (doctors list, currency, user token)
│       ├── pages/
│       │   ├── Home.jsx             # Landing page
│       │   ├── Doctors.jsx          # Doctor listing with specialty filter
│       │   ├── Appointment.jsx      # Doctor detail + interactive slot booking UI
│       │   ├── Login.jsx            # Toggle between register and login
│       │   ├── About.jsx            # About HealthQueue page
│       │   ├── Contact.jsx          # Contact information page
│       │   ├── MyProfile.jsx        # Edit user details and profile photo
│       │   └── MyAppointments.jsx   # View and cancel booked appointments
│       ├── App.jsx                  # Root component with routes
│       ├── main.jsx                 # React entry point
│       └── index.css                # Global styles
│
└── admin/                           # Admin + Doctor dashboard React app
    └── src/
        ├── Components/
        │   ├── Navbar.jsx           # Top navigation (role-aware)
        │   └── Sidebar.jsx          # Side navigation (Admin vs Doctor views)
        ├── Context/
        │   ├── AdminContext.jsx     # Admin auth state & API helpers
        │   ├── AppContext.jsx       # Shared app state
        │   └── Doctorcontext.jsx   # Doctor auth state & API helpers
        ├── Pages/
        │   ├── Login.jsx            # Shared login gate (Admin / Doctor)
        │   ├── Admin/
        │   │   ├── Dashboard.jsx        # Admin stats overview
        │   │   ├── AddDoctor.jsx        # New doctor registration form
        │   │   ├── DoctorsList.jsx      # All doctors with availability toggle
        │   │   └── AllAppointment.jsx   # Platform-wide appointments list
        │   └── Doctor/
        │       ├── DoctorDashboard.jsx      # Doctor personal stats overview
        │       ├── DoctorAppointments.jsx   # Doctor's own appointments list
        │       └── DoctorProfile.jsx        # Doctor profile management
        ├── App.jsx
        └── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- **[Node.js](https://nodejs.org/)** — v18 or higher
- **[npm](https://www.npmjs.com/)** — v9 or higher
- **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** account — or a local MongoDB instance
- **[Cloudinary](https://cloudinary.com/)** account — for doctor profile image uploads

---

### Environment Variables

#### Backend — `backend/.env`

Create a `.env` file inside the `backend/` directory:

```env
# ── Server ──────────────────────────────────────────
PORT=4000

# ── MongoDB ─────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>

# ── Cloudinary ──────────────────────────────────────
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# ── Admin Credentials ────────────────────────────────
ADMIN_EMAIL=admin@healthqueue.com
ADMIN_PASSWORD=YourSecurePassword

# ── JWT ─────────────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key

# ── CORS ────────────────────────────────────────────
FRONTEND_URL=https://your-frontend-domain.vercel.app
ADMIN_FRONTEND_URL=https://your-admin-domain.vercel.app
```

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

#### Frontend — `frontend/.env.local`

```env
VITE_BACKEND_URL=http://localhost:4000
```

#### Admin — `admin/.env.local`

```env
VITE_BACKEND_URL=http://localhost:4000
```

---

### Installation

Install dependencies for each application:

```bash
# 1. Backend
cd backend
npm ci

# 2. Patient Frontend
cd ../frontend
npm ci

# 3. Admin & Doctor Panel
cd ../admin
npm ci
```

Use `npm install` instead of `npm ci` when intentionally updating a lockfile.

---

### Running the App

You need **three separate terminals** to run all parts simultaneously.

**Terminal 1 — Backend API**
```bash
cd backend
npm run server
# ✓ Server running at http://localhost:4000
```

**Terminal 2 — Patient Frontend**
```bash
cd frontend
npm run dev
# ✓ App running at http://localhost:5173
```

**Terminal 3 — Admin & Doctor Panel**
```bash
cd admin
npm run dev
# ✓ Dashboard running at http://localhost:5174
```

> **Tip:** The backend uses `nodemon` for hot-reloading during development. Use `npm start` (`node server.js`) for production.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. The server runs on `http://localhost:4000` by default.

Use `GET /api/health` to verify that the API is running.

> All **protected routes** require the HTTP header: `Authorization: Bearer <token>`

### Admin Routes — `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/admin/login` | ❌ | Admin login — returns JWT token |
| `POST` | `/api/admin/add-doctor` | ✅ Admin | Register a new doctor (multipart/form-data) |
| `POST` | `/api/admin/all-doctor` | ✅ Admin | Retrieve all registered doctors |
| `POST` | `/api/admin/change-availibility` | ✅ Admin | Toggle a doctor's availability |
| `GET` | `/api/admin/appointments` | ✅ Admin | Fetch all appointments on the platform |
| `POST` | `/api/admin/cancel-appointment` | ✅ Admin | Cancel any appointment by ID |
| `GET` | `/api/admin/dashboard` | ✅ Admin | Platform-wide statistics |

#### `POST /api/admin/login`
**Request Body:**
```json
{
  "email": "admin@healthqueue.com",
  "password": "Admin@123"
}
```
**Response `200`:**
```json
{
  "success": true,
  "token": "<jwt_token>"
}
```

#### `POST /api/admin/add-doctor`
**Headers:** `Authorization: Bearer <admin_token>`  
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Notes |
|-------|------|:--------:|-------|
| `name` | String | ✅ | Doctor's full name |
| `email` | String | ✅ | Must be a valid email |
| `password` | String | ✅ | Min 8 characters |
| `speciality` | String | ✅ | One of the 6 supported specialities |
| `degree` | String | ✅ | e.g., MBBS, MD |
| `experience` | String | ✅ | e.g., "5 Years" |
| `about` | String | ✅ | Short bio |
| `fees` | Number | ✅ | Consultation fee |
| `address` | JSON String | ✅ | `{ "line1": "...", "line2": "..." }` |
| `image` | File (image) | ✅ | Doctor profile photo |

---

### Doctor Routes — `/api/doctor`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/doctor/list` | ❌ | Retrieve all doctors (public) |
| `POST` | `/api/doctor/login` | ❌ | Doctor login — returns JWT token |
| `GET` | `/api/doctor/appointment` | ✅ Doctor | Get all appointments for the logged-in doctor |
| `POST` | `/api/doctor/complete-appointment` | ✅ Doctor | Mark an appointment as completed |
| `POST` | `/api/doctor/cancel-appointment` | ✅ Doctor | Cancel one of the doctor's appointments |
| `GET` | `/api/doctor/dashboard` | ✅ Doctor | Doctor-specific statistics |
| `GET` | `/api/doctor/profile` | ✅ Doctor | Retrieve the doctor's profile data |
| `POST` | `/api/doctor/update-profile` | ✅ Doctor | Update fees, availability, and bio |

#### `POST /api/doctor/login`
**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "DoctorPass123"
}
```
**Response `200`:**
```json
{
  "success": true,
  "token": "<doctor_jwt_token>"
}
```

---

### User Routes — `/api/user`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/user/register` | ❌ | Register a new patient account |
| `POST` | `/api/user/login` | ❌ | User login — returns JWT token |
| `GET` | `/api/user/get-profile` | ✅ User | Retrieve the logged-in user's profile |
| `POST` | `/api/user/update-profile` | ✅ User | Update profile info + profile picture |
| `POST` | `/api/user/book-appointment` | ✅ User | Book an appointment with a doctor |
| `GET` | `/api/user/appointments` | ✅ User | Retrieve all of the user's appointments |
| `POST` | `/api/user/cancel-appointment` | ✅ User | Cancel a booked appointment |

#### `POST /api/user/register`
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
**Response `200`:**
```json
{
  "success": true,
  "token": "<user_jwt_token>"
}
```

#### `POST /api/user/book-appointment`
**Headers:** `Authorization: Bearer <user_token>`  
**Request Body:**
```json
{
  "docId": "<doctor_mongodb_id>",
  "slotDate": "3_9_2026",
  "slotTime": "10:00 am"
}
```

---

## 🗺️ Pages & Routes

### Patient Frontend

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.jsx` | Landing page — hero, speciality menu, top doctors, CTA banner |
| `/doctors` | `Doctors.jsx` | Full doctor listing |
| `/doctors/:speciality` | `Doctors.jsx` | Pre-filtered by medical speciality |
| `/appointment/:docId` | `Appointment.jsx` | Doctor profile + interactive slot booking UI |
| `/login` | `Login.jsx` | Toggle between register and login |
| `/about` | `About.jsx` | About HealthQueue |
| `/contact` | `Contact.jsx` | Contact information |
| `/my-profile` | `MyProfile.jsx` | Edit user details and profile photo |
| `/my-appointments` | `MyAppointments.jsx` | View and cancel booked appointments |

### Admin Panel

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Login.jsx` | Shared login gate — role: Admin or Doctor |
| `/admin-dashboard` | `Dashboard.jsx` | Admin stats: total doctors, patients, appointments |
| `/add-doctor` | `AddDoctor.jsx` | Form to register a new doctor |
| `/doctor-list` | `DoctorsList.jsx` | All doctors with availability toggle |
| `/all-appointments` | `AllAppointment.jsx` | Platform-wide appointments with cancel action |
| `/doctor-dashboard` | `DoctorDashboard.jsx` | Doctor earnings, patients, and appointment counts |
| `/doctor-appointments` | `DoctorAppointments.jsx` | Doctor's own upcoming appointments |
| `/doctor-profile` | `DoctorProfile.jsx` | Edit doctor bio, fees, and availability |

---

## 🗄 Data Models

### User (Patient)

```js
{
  name:     { type: String,  required: true },
  email:    { type: String,  required: true, unique: true },
  password: { type: String,  required: true },            // bcrypt hashed
  image:    { type: String,  default: <base64_avatar> },  // Base64 default avatar
  address:  { type: Object,  default: { line1: "", line2: "" } },
  gender:   { type: String,  default: "Not Selected" },
  dob:      { type: String,  default: "Not Selected" },
  phone:    { type: Number,  default: 0000000000 },
}
```

### Doctor

```js
{
  name:         { type: String,  required: true },
  email:        { type: String,  required: true, unique: true },
  password:     { type: String,  required: true },       // bcrypt hashed
  image:        { type: String,  required: true },       // Cloudinary URL
  speciality:   { type: String,  required: true },
  degree:       { type: String,  required: true },
  experience:   { type: String,  required: true },
  about:        { type: String,  required: true },
  availability: { type: Boolean, default: true },
  fees:         { type: Number,  required: true },
  address:      { type: Object,  required: true },       // { line1, line2 }
  date:         { type: Number },                        // Creation timestamp
  slots_booked: { type: Object,  default: {} },          // { "date": ["slot1", "slot2"] }
}
```

### Appointment

```js
{
  userId:      { type: String,  required: true },  // Reference to User._id
  docId:       { type: String,  required: true },  // Reference to Doctor._id
  slotDate:    { type: String,  required: true },  // e.g. "3_9_2026"
  slotTime:    { type: String,  required: true },  // e.g. "10:30 am"
  userData:    { type: Object,  required: true },  // Snapshot of user data at booking time
  docData:     { type: Object,  required: true },  // Snapshot of doctor data at booking time
  amount:      { type: Number,  required: true },  // Consultation fee charged
  date:        { type: Number },                   // Booking creation timestamp (ms)
  cancelled:   { type: Boolean, default: false },
  payment:     { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
}
```

---

## 🛡 Admin Panel

The admin panel is a **separate React application** gated behind JWT-based authentication.

**Default Development Credentials:**
```
Email:    admin@healthqueue.com
Password: Admin@123
```

> 🔒 Change these in `backend/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) before deploying to production. Use strong, unique values before deploying to production.

**How authentication works:**
1. Admin submits credentials → backend validates against `.env` values.
2. On success, the backend returns a signed JWT token.
3. The token is stored in `AdminContext` (React state) and injected as a `Bearer` token into all protected API requests.
4. Unauthenticated visitors are automatically redirected to the login page.

---

## 🩺 Doctor Portal

The doctor portal lives inside the same `admin/` React app, toggled by role:

- Doctors log in via the shared `Login.jsx` page.
- `Doctorcontext.jsx` manages the doctor's JWT token and profile state.
- `Sidebar.jsx` renders doctor-specific navigation when a doctor is authenticated.
- Doctors can only view and manage **their own appointments** — they cannot access admin-only features like adding doctors or viewing all users.

---

## 🏥 Supported Specialities

| Icon | Speciality |
|:---:|------------|
| 🩺 | General Physician |
| 👶 | Pediatrician |
| 👩‍⚕️ | Gynecologist |
| 🧠 | Neurologist |
| 🦠 | Gastroenterologist |
| 🧴 | Dermatologist |

---

## ☁️ Deployment

The project is configured for deployment with the following targets:

| App | Recommended Platform | Config File |
|-----|---------------------|-------------|
| `frontend/` | [Vercel](https://vercel.com) | `frontend/vercel.json` |
| `admin/` | [Vercel](https://vercel.com) | `admin/vercel.json` |
| `backend/` | [Render](https://render.com) | — |

**Steps before deploying:**
1. Set `FRONTEND_URL` in `backend/.env` to your deployed frontend Vercel URL.
2. Set `VITE_BACKEND_URL` in `frontend/.env` and `admin/.env` to your Render backend URL.
3. Use `npm start` (`node server.js`) as the Render start command for the backend.
4. Use `npm run build` + serve the `dist/` folder for Vercel deployments (configured automatically via `vercel.json`).

### Docker

The root `Dockerfile` builds the frontend, admin panel, and backend from a single repository-root build context. Build the image from the repository root:

```bash
docker build -t healthqueue .
```

Run the container on port `4000`:

```bash
docker run --env-file backend/.env -p 4000:4000 healthqueue
```

The API is available at `http://localhost:4000`, including the health check at `http://localhost:4000/api/health`. The container requires the backend environment variables for MongoDB, Cloudinary, JWT authentication, and CORS origins.

For production, deploy the patient frontend, admin panel, and backend as separate services. The current Dockerfile copies both frontend build outputs into the backend's `public/` directory, so it is intended as a basic combined image rather than a complete multi-site production server.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a descriptive message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch

**Commit Message Convention:**

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `refactor:` | Code refactoring |
| `chore:` | Tooling / config changes |

---

## 📄 License

This project is open source and available under the **[ISC License](LICENSE)**.

---

<div align="center">
  Built with ❤️ by <strong>Sahil Singh</strong>
  <br/>
  <sub>HealthQueue — Connecting patients with the right doctors, faster.</sub>
</div>
