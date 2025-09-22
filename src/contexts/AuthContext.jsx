import React, { createContext, useContext, useState, useEffect } from 'react'
import rolePlayers from '../data/rolePlayers'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('fms_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Find user in rolePlayers data
      const foundUser = rolePlayers.find(
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