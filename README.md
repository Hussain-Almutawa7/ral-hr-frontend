# RAL HR - Frontend

RAL HR is a Human Resources Management System developed for RAL Technologies Bahrain.

This repository contains the React frontend for the system.

The application provides role-based access for Employees, Managers, HR Officers, HR Managers, and Owner/Finance users to manage employee information, attendance, leave, documents, users, settings, and other HR operations.

<img width="2313" height="1356" alt="image" src="https://github.com/user-attachments/assets/40707d64-d2c4-48f8-a391-2dbc011b7a5a" />

## Backend Repository

The backend for this project can be found here:

[RAL HR Backend](https://github.com/Hussain-Almutawa7/ral-hr-backend)

---

## Features

### Authentication

- Secure user sign in
- JWT-based authentication
- Role-based interface and navigation
- User activation and deactivation
- Secure sign out

### Employee Management

- View employee directory
- Add employees
- Edit employee information
- View employee profiles
- Manage employee status
- Assign departments and designations
- Assign reporting managers
- Assign shifts and holiday lists
- Employees can view their own profile
- Employees can update permitted contact information

### Attendance Management

- Employee check in and check out
- View personal attendance
- View team attendance
- Generate attendance records
- Track attendance status, check-in time, check-out time, worked hours, late entry, early exit, incomplete attendance, and overtime
- Attendance correction workflow
- Overtime approval workflow

### Leave Management

- View leave types
- View leave balances and allocations
- Submit leave requests
- Upload supporting documents
- Submit draft requests
- Manager and HR review
- Approve or reject requests
- Cancel leave requests
- Leave calendar

### Document Management

- Upload employee documents
- HR can upload documents for employees
- Download documents
- Document verification
- Document rejection with reason
- Archive documents
- Track document expiry
- Support configurable document types

### User Management

HR Managers can:

- View system users
- Create user accounts for employees
- Update user email and role
- Activate and deactivate users
- Reset passwords

### Audit Logs

- View system changes
- Track table/model, action, changed field, old value, new value, user responsible for the change, user role, date and time, and IP address
- Filter audit logs by user, table, and action

### Settings

HR users can manage:

- Company information
- Departments
- Designations
- Banks
- Leave types
- Document types
- Shift types
- Shift assignments
- Holiday lists
- Holidays

### Dashboard

Role-based dashboards provide live information such as:

- Total employees
- Active employees
- Pending leave requests
- Pending documents
- Team members
- User accounts
- Inactive accounts

---

## User Roles

The system supports the following roles:

- Employee
- Manager
- HR Officer
- HR Manager
- Owner/Finance

Each role has different permissions and access to system features.

---

## Technologies Used

- React
- React Router
- JavaScript
- HTML
- CSS
- Fetch API
- JWT Authentication
- Vite

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Hussain-Almutawa7/ral-hr-frontend.git
```

Navigate into the project:

```bash
cd ral-hr-frontend
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
VITE_BACK_END_SERVER_URL=http://localhost:3000
```

Change the URL if the backend is running on a different server or port.

---

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will normally run at:

```text
http://localhost:5173
```

---

## Project Structure

```text
src/
├── assets/
│   └── branding/
├── components/
│   ├── common/
│   └── layout/
├── pages/
│   ├── attendance/
│   ├── audit/
│   ├── auth/
│   ├── dashboard/
│   ├── documents/
│   ├── employees/
│   ├── leave/
│   ├── notifications/
│   ├── settings/
│   └── users/
├── services/
├── styles/
├── utils/
├── App.jsx
└── main.jsx
```

---

## Authentication

After signing in, the backend returns a JWT token.

The token is stored in `localStorage` and included in protected API requests:

```js
Authorization: `Bearer ${localStorage.getItem("token")}`
```

The backend remains responsible for enforcing permissions and role-based access.

---

## Attendance Flow

Attendance is connected to configurable shifts.

```text
Employee
    ↓
Shift Assignment
    ↓
Shift Type
    ↓
Check In / Check Out
    ↓
Attendance Generation
    ↓
Attendance Record
```

A Shift Type defines working hours, while a Shift Assignment determines which shift applies to an employee for a specific period.

The generated attendance record can then identify late entry, early exit, incomplete attendance, worked hours, and overtime.

---

## Document Uploads

Files are sent using browser `FormData`.

The frontend does not manually set the `Content-Type` header for file uploads because the browser automatically generates the required multipart boundary.

Uploaded employee documents and leave supporting documents are stored by the backend using MongoDB GridFS.

---

## Developed By

- Hussain Almutawa
- Hawra Markhoos

Developed as part of the General Assembly Software Engineering Bootcamp.
