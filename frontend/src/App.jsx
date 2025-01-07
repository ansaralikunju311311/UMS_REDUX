// import React from 'react'
import SignUp from './Components/user/SignUp'
import Login from './Components/user/Login'
import Profile from './Components/user/Profile'
import ProtectedRoute from './Components/ProtectedRoute'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AuthProtectedRoute from './Components/AuthProtectedRoute'
import AuthProtectedRouteSign from './Components/AuthProctedRouteSign'

const App = () => {
  const { isAuthenticated } = useSelector(state => state.user);

  console.log(isAuthenticated);

  return (
    <div>
      <Routes>
        {/* Redirect authenticated users away from login or signup */}
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
            <AuthProtectedRoute>
            <Login />
            </AuthProtectedRoute>
          }
        />

        {/* Profile route is protected */}
        <Route
          path='/user/profile'
          element={
            
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
          }
        />

        {/* Default fallback for unknown routes */}
        <Route
          path='*'
          element={
            isAuthenticated ? (
              <Navigate to="/user/profile" />
            ) : (
              <Navigate to="/user/login" />
            )
          }
        />
      </Routes>
    </div>
  )
}

export default App;
