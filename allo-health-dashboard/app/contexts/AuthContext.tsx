"use client"

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

type User = {
  staffId: string
  name: string
  accessToken: string
}

type AuthContextType = {
  user: User | null
  login: (staffId: string, password: string) => Promise<void>
  logout: () => void
  register: (staffId: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {

  },
})

// Add axios interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          // Set default authorization header for all future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error('Token verification failed:', error)
          handleLogout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Prevent render until initial auth check is complete
  if (loading) {
    return null
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const login = async (staffId: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        staffId,
        password,
      })

      const { access_token, user: userData } = response.data
      const user = { staffId, ...userData }
      setUser(user)
      localStorage.setItem('accessToken', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      router.replace('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Invalid credentials')
    }
  }

  const register = async (staffId: string, password: string) => {
    try {
      const response = await api.post('/auth/register', {
        staffId,
        password,
      })

      const { accessToken, ...userData } = response.data
      const user = { staffId, ...userData, accessToken }

      setUser(user)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
      throw new Error('Registration failed')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout: handleLogout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

