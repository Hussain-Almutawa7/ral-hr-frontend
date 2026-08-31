import './App.css'
import { Routes, Route } from "react-router"
import { useState } from "react"

// GENERAL PAGES
import Landing from "./pages/Landing"
import Dashboard from "./pages/dashboard/Dashboard";
import SignInForm from "./pages/auth/SignInForm";

// LAYOUT
import Layout from "./components/layout/Layout";

// PEOPLE PAGES
import EmployeeList from "./pages/employees/EmployeeList";

// ATTENDANCE PAGES
import AttendanceManagement from './pages/attendance/AttendanceManagement';
import AttendanceCorrections from './pages/attendance/AttendanceCorrections';
import TeamAttendance from './pages/attendance/TeamAttendance';
import MyAttendance from "./pages/attendance/MyAttendance";
import CheckIn from './pages/attendance/CheckIn';

// LEAVE PAGES
import MyLeave from "./pages/leave/MyLeave";

// DOCUMENT PAGES
import Documents from "./pages/documents/Documents";

// USER MANAGEMENT PAGES

// SETTINGS PAGES

// NOTIFICATION PAGES

// AUDIT LOG PAGES

const getUserFromToken = () => {
  const token = localStorage.getItem('token')

  if (!token) return null

  return JSON.parse(atob(token.split('.')[1])).payload
}

const App = () => {

  const [user, setUser] = useState(getUserFromToken())

  return (
    <>
      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/sign-in" element={<SignInForm setUser={setUser} />} />

        {/* AUTHENTICATED ROUTES */}
        {user && (
          <Route element={<Layout user={user} setUser={setUser} />}>

            {/* DASHBOARD ROUTES */}
            <Route path="/" element={<Dashboard user={user} />} />

            {/* PEOPLE ROUTES */}
            <Route path="/employees" element={<EmployeeList />} />

            {/* ATTENDANCE ROUTES */}
            <Route path="/attendance" element={<MyAttendance />} />
            <Route path='/attendance/check-in' element={<CheckIn />} />
            <Route path='/attendance/team' element={<TeamAttendance />} />
            <Route path='/attendance/manage' element={<AttendanceManagement />} />
            <Route path='/attendance/corrections' element={<AttendanceCorrections user={user} />} />

            {/* LEAVE ROUTES */}
            <Route path="/leave" element={<MyLeave />} />

            {/* DOCUMENT ROUTES */}
            <Route path="/documents" element={<Documents />} />

            {/* USER MANAGEMENT ROUTES */}

            {/* SETTINGS ROUTES */}

            {/* NOTIFICATION ROUTES */}

            {/* AUDIT LOG ROUTES */}

          </Route>
        )}

        {/* PUBLIC ROUTES */}
        {!user && (
          <Route path="/" element={<Landing />} />
        )}

      </Routes>
    </>
  )
}

export default App