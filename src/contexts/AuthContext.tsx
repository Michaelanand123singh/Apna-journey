'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  phone?: string
  status: 'active' | 'banned'
  resumeUrl?: string
  createdAt: string
}

interface Admin {
  _id: string
  name: string
  email: string
  role: 'super-admin' | 'editor'
  permissions: string[]
  lastLogin: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  admin: Admin | null
  token: string | null
  adminToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (userData: User, token: string) => void
  adminLogin: (adminData: Admin, token: string) => void
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const isAuthenticated = !!user || !!admin
  const isAdmin = !!admin

  const login = (userData: User, userToken: string) => {
    setUser(userData)
    setAdmin(null)
    setToken(userToken)
    setAdminToken(null)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
  }

  const adminLogin = (adminData: Admin, adminTokenValue: string) => {
    setAdmin(adminData)
    setUser(null)
    setToken(null)
    setAdminToken(adminTokenValue)
    localStorage.setItem('admin', JSON.stringify(adminData))
    localStorage.setItem('adminToken', adminTokenValue)
  }

  const logout = () => {
    setUser(null)
    setAdmin(null)
    setToken(null)
    setAdminToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')
    
    // Redirect based on current page
    if (pathname.startsWith('/admin')) {
      router.push('/admin/login')
    } else {
      router.push('/')
    }
  }

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem('user')
      const adminData = localStorage.getItem('admin')
      const userToken = localStorage.getItem('token')
      const adminTokenValue = localStorage.getItem('adminToken')
      
      if (userData && userToken) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setToken(userToken)
        setAdmin(null)
        setAdminToken(null)
      } else if (adminData && adminTokenValue) {
        const parsedAdmin = JSON.parse(adminData)
        setAdmin(parsedAdmin)
        setAdminToken(adminTokenValue)
        setUser(null)
        setToken(null)
      } else {
        setUser(null)
        setAdmin(null)
        setToken(null)
        setAdminToken(null)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setUser(null)
      setAdmin(null)
      setToken(null)
      setAdminToken(null)
      localStorage.clear()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Auto-redirect logic
  useEffect(() => {
    if (isLoading) return

    // Admin pages - redirect to admin login if not admin
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (!admin) {
        router.push('/admin/login')
      }
    }
    
    // User pages that require authentication
    if (pathname.startsWith('/user') && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, pathname, admin, isAuthenticated, router])

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      token,
      adminToken,
      isLoading,
      isAuthenticated,
      isAdmin,
      login,
      adminLogin,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
