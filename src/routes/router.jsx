import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../components/layout/Home'
import AdminLayout from '../components/layout/AdminLayout'
import TeamLayout from '../components/layout/TeamLayout'
import { LoginPage } from '../components/custom/LoginPage'
import ProtectedRoute from '../components/custom/ProtectedRoute'

// Create the router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
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

export default router
