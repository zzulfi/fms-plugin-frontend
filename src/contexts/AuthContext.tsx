import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import roleplayers from '@/data/roleplayers'
import { AuthContextType, UserSession, LoginResult } from '@/types'

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
    const savedUser = localStorage.getItem('fms_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      // Find user in roleplayers data
      const foundUser = roleplayers.find(
        (player) => player.mail === email && player.password === password
      )

      if (foundUser) {
        const userSession = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.mail,
          accessLevel: foundUser.accessLevel
        }
        
        setUser(userSession)
        localStorage.setItem('fms_user', JSON.stringify(userSession))
        return { success: true, user: userSession }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fms_user')
  }

  const isAdmin = () => {
    return user?.accessLevel === 'Full'
  }

  const isTeamLead = () => {
    return user?.accessLevel === 'Limited'
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isTeamLead
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext