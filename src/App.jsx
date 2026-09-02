import { Routes, Route } from "react-router"
import { useState } from "react"

// GENERAL PAGES
import Landing from "./pages/Landing"
import Dashboard from "./pages/dashboard/Dashboard";
import SignInForm from "./pages/auth/SignInForm";

// LAYOUT
import Layout from "./components/layout/Layout";

// PEOPLE PAGES
import MyProfile from "./pages/employees/MyProfile";
import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeForm from "./pages/employees/EmployeeForm";
import EmployeeDetails from "./pages/employees/EmployeeDetails";

// ATTENDANCE PAGES
import CheckIn from './pages/attendance/CheckIn';
import MyAttendance from './pages/attendance/MyAttendance';
import TeamAttendance from './pages/attendance/TeamAttendance';
import AttendanceCorrections from './pages/attendance/AttendanceCorrections';
import AttendanceManagement from './pages/attendance/AttendanceManagement';

// LEAVE PAGES
import MyLeave from "./pages/leave/MyLeave";
import LeaveRequestForm from "./pages/leave/LeaveRequestForm"
import LeaveRequestDetails from "./pages/leave/LeaveRequestDetails"
import LeaveTypes from './pages/leave/LeaveTypes';
import LeaveManagement from './pages/leave/LeaveManagement';
import LeaveTypeForm from './pages/leave/LeaveTypeForm';
import LeaveAllocations from './pages/leave/LeaveAllocations';
import LeaveAllocationForm from './pages/leave/LeaveAllocationForm'
import LeaveCalendar from './pages/leave/LeaveCalendar'

// DOCUMENT PAGES
import Documents from "./pages/documents/Documents";

// USER MANAGEMENT PAGES

// SETTINGS PAGES
import Banks from './pages/settings/Banks';
import Holidays from './pages/settings/Holidays';
import Company from './pages/settings/Company';
import ShiftTypes from './pages/settings/ShiftTypes';
import HolidayLists from './pages/settings/HolidayLists';
import Designations from './pages/settings/Designations';
import Departments from './pages/settings/Departments';
import DocumentTypes from './pages/settings/DocumentTypes';
import ShiftAssignments from './pages/settings/ShiftAssignments';

// NOTIFICATION PAGES
import Notifications from "./pages/notifications/Notifications";

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
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:employeeId" element={<EmployeeDetails />} />
            <Route path="/employees/:employeeId/edit" element={<EmployeeForm />} />

            {/* ATTENDANCE ROUTES */}
            <Route path="/attendance" element={<MyAttendance />} />
            <Route path='/attendance/check-in' element={<CheckIn />} />
            <Route path='/attendance/team' element={<TeamAttendance />} />
            <Route path='/attendance/manage' element={<AttendanceManagement />} />
            <Route path='/attendance/corrections' element={<AttendanceCorrections user={user} />} />

            {/* LEAVE ROUTES */}
            <Route path="/leave" element={<MyLeave user={user} />} />
            <Route path="/leave/new" element={<LeaveRequestForm user={user} />} />
            <Route path="/leave/:requestId" element={<LeaveRequestDetails user={user} />} />
            <Route path="/leave/types" element={<LeaveTypes user={user} />} />
            <Route path="/leave/types/new" element={<LeaveTypeForm user={user} />} />
            <Route path='/leave/types/:leaveTypeId/edit' element={<LeaveTypeForm user={user} />} />
            <Route path="/leave/manage" element={<LeaveManagement user={user} />} />
            <Route path="/leave/allocations" element={<LeaveAllocations user={user} />} />
            <Route path="/leave/allocations/new" element={<LeaveAllocationForm user={user} />} />
            <Route path="/leave/allocations/:leaveAllocationId/edit" element={<LeaveAllocationForm user={user} />} />
            <Route path="/leave/calendar" element={<LeaveCalendar user={user} />} />

            {/* DOCUMENT ROUTES */}
            <Route path="/documents" element={<Documents user={user} />} />

            {/* USER MANAGEMENT ROUTES */}

            {/* SETTINGS ROUTES */}
            <Route path='/settings/company' element={<Company user={user} />} />
            <Route path='/settings/departments' element={<Departments />} />
            <Route path='/settings/designations' element={<Designations />} />
            <Route path='/settings/banks' element={<Banks user={user} />} />
            <Route path='/settings/document-types' element={<DocumentTypes user={user} />} />
            <Route path='/settings/shift-types' element={<ShiftTypes user={user} />} />
            <Route path='/settings/shift-assignments' element={<ShiftAssignments user={user} />} />
            <Route path='/settings/holiday-lists' element={<HolidayLists user={user} />} />
            <Route path='/settings/holidays' element={<Holidays user={user} />} />

            {/* NOTIFICATION ROUTES */}
            <Route path='/notifications' element={<Notifications user={user} />} />
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