import './App.css'
import { Routes, Route } from "react-router"
import { useState } from "react"

import Landing from "./pages/Landing"
import Dashboard from "./pages/dashboard/Dashboard";
import SignInForm from "./pages/auth/SignInForm";
import Layout from "./components/layout/Layout";
import EmployeeList from "./pages/employees/EmployeeList";
import MyAttendance from "./pages/attendance/MyAttendance";
import MyLeave from "./pages/leave/MyLeave";
import Documents from "./pages/documents/Documents";

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
        <Route path="/sign-in" element={<SignInForm setUser={setUser} />} />

        {user && (
          <Route element={<Layout user={user} setUser={setUser} />}>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/attendance" element={<MyAttendance />} />
            <Route path="/leave" element={<MyLeave />} />
            <Route path="/documents" element={<Documents />} />
          </Route>
        )}

        {!user && (
          <Route path="/" element={<Landing />} />
        )}
      </Routes>
    </>
  )
}

export default App