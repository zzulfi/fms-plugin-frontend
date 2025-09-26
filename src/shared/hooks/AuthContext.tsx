import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthContextType, UserSession, LoginResult } from '../types'
import { authService } from '../../features/auth/services'

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Check for existing session on app load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('fms_user')
      
      if (savedToken && savedUser) {
        try {
          // Verify token is still valid by getting user profile
          await authService.getProfile()
          setUser(JSON.parse(savedUser))
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('fms_user')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      // Call the backend API
      const response = await authService.login({ email, password })

      if (response.user && response.token) {
        const userSession: UserSession = {
          id: response.user.uid,
          email: response.user.email,
          name: response.user.displayName,
          role: response.user.role,
          team: response.user.team?.name || null,
          avatar: response.user.photoURL || null,
        }

        setUser(userSession)
        localStorage.setItem('fms_user', JSON.stringify(userSession))
        localStorage.setItem('token', response.token)

        return {
          success: true,
          user: userSession,
        }
      } else {
        return {
          success: false,
          error: 'Invalid response from server',
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.message || 'An error occurred during login',
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fms_user')
    localStorage.removeItem('token')
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isTeamManager = () => {
    return user?.role === 'team-manager'
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isTeamManager
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext