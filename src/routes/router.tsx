import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import AdminLayout from '../components/layout/AdminLayout'
import TeamLayout from '../components/layout/TeamLayout'
import { LoginPage } from '../components/custom/LoginPage'
import ProtectedRoute from '../components/custom/ProtectedRoute'

// Create the router configuration
import { Navigate } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RootRedirect />
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        )
      },
      {
        path: "team",
        element: (
          <ProtectedRoute>
            <TeamLayout />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  }
])

import { useAuth } from '../contexts/AuthContext'

function RootRedirect() {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isAdmin()) return <Navigate to="/admin" replace />
  return <Navigate to="/team" replace />
}

export default router
