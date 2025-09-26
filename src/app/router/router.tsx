
import { createBrowserRouter } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import Layout from '../../shared/components/Layout'
import AdminLayout from '../../shared/components/AdminLayout'
import TeamLayout from '../../shared/components/TeamLayout'
import NotFoundPage from '../../shared/components/NotFoundPage'
import { LoginPage } from '../../features/auth/components/LoginPage'
import ProtectedRoute from '../../features/auth/components/ProtectedRoute'

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
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
])

import { useAuth } from '../../shared/hooks/AuthContext'

function RootRedirect() {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isAdmin()) return <Navigate to="/admin" replace />
  return <Navigate to="/team" replace />
}

export default router
