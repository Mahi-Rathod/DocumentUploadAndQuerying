import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout"
import Home from "./components/home/home";
import FileUpload from "./components/fileUpload/FileUpload";
import Dashboard from "./components/dashboard/Dashboard";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import VerifyOTP from "./components/verifyEmail/VerifyOTP";
import SendOTP from "./components/verifyEmail/SendOTP";

import PublicRoute from "./components/publicRoutes/PublicRoute";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute"

import { AuthProvider } from "./context/AuthContext";

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<Signup />} />
              <Route path="/send-verification-otp" element= { <SendOTP /> } />
            </Route>

            <Route element={<ProtectedRoute />} >
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
              
            <Route element={<ProtectedRoute />}>
              <Route path="/file-upload" element={<FileUpload />} />
            </Route>

            <Route path="/verify-otp" element={<VerifyOTP />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
