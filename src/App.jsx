import Nav from "./components/Nav"
import './App.css'
import { Routes, Route } from "react-router"
import { useState } from "react"
import Landing from "./pages/Landing"
import Dashboard from "./pages/dashboard/Dashboard";
import SignInForm from "./pages/auth/SignInForm";

const getUserFromToken = () => {
  const token = localStorage.getItem('token')

  if (!token) return null

  return JSON.parse(atob(token.split('.')[1])).payload
}

const App = () => {

  const [user, setUser] = useState(getUserFromToken())

  return (
    <>
      <Nav user={user} setUser={setUser} />
      <main className="app-main">
        <Routes>
          <Route path='/sign-in' element={<SignInForm setUser={setUser} />} />
          <Route path="/" element={user ? <Dashboard user={user} /> : <Landing />} />
        </Routes>
      </main>
    </>
  )
}

export default App