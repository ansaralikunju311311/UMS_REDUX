import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// User Components
import SignUp from './Components/user/SignUp'
import Login from './Components/user/Login'
import Profile from './Components/user/Profile'

// Admin Components
import AdminLogin from './Components/admin/AdminLogin'
import AdminDash from './Components/admin/AdminDash'

// Route Protection Components
import ProtectedRoute from './Components/ProtectedRoute'
import ProtectedDash from './Components/ProtectedDash'
import AuthProtectedRoute from './Components/AuthProtectedRoute'
import AuthProtectedRouteSign from './Components/AuthProctedRouteSign'
import AuthProtectedDash from './Components/AuthProtectedDash'

const App = () => {
  const { isAuthenticated } = useSelector(state => state.user)
  const { isAuthenticated: isAdminAuthenticated } = useSelector(state => state.admin)

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div>
        <Routes>
          {/* Public routes with authentication check */}
          <Route
            path='/user/signup'
            element={
              <AuthProtectedRouteSign>
                <SignUp />
              </AuthProtectedRouteSign>
            }
          />
          <Route
            path='/user/login'
            element={
              <AuthProtectedRouteSign>
                <Login />
              </AuthProtectedRouteSign>
            }
          />

          {/* Protected user routes */}
          <Route
            path='/user/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/login"
            element={
              <AuthProtectedDash>
                <AdminLogin />
              </AuthProtectedDash>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedDash>
                <AdminDash />
              </ProtectedDash>
            }
          />

          {/* Default route */}
          <Route
            path='/'
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin/dashboard" />
              ) : isAuthenticated ? (
                <Navigate to="/user/profile" />
              ) : (
                <Navigate to="/user/login" />
              )
            }
          />

          {/* Catch all unknown routes */}
          <Route
            path='*'
            element={<Navigate to="/" />}
          />
        </Routes>
      </div>
    </>
  )
}

export default App
