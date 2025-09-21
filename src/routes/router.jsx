import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../components/layout/Home'
import AdminDashBoard from '../components/admin/AdminDashBoard'
import TeamDashBoard from '../components/team-manager/TeamDashBoard'
import { LoginPage } from '../components/LoginPage'
import ProtectedRoute from '../components/ProtectedRoute'

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
            <AdminDashBoard />
          </ProtectedRoute>
        )
      },
      {
        path: "team",
        element: (
          <ProtectedRoute>
            <TeamDashBoard />
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
