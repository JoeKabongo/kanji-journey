import { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '../../../shared/types/user'

/**
 * @interface AuthContextType
 * Defines the shape of the data and functions that will be available
 * through the authentication context.
 */
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provides authentication state (user, isAuthenticated) and functions (login, logout)
 * to its children components.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const isAuthenticated = !!user

  const value = { user, login, logout, isAuthenticated }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to easily access the authentication context from any component.
 * Throws an error if used outside the scope of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  // Ensure the hook is used within the provider's scope.
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
