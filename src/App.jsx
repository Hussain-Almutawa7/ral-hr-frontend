import './App.css'
import { Routes, Route } from "react-router"
import { useState } from "react"
import Landing from "./pages/Landing"
import Dashboard from "./pages/dashboard/Dashboard";
import SignInForm from "./pages/auth/SignInForm";
import Layout from "./components/layout/Layout";

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