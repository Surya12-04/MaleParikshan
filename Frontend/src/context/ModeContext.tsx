import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface ModeContextType {
  isAdultMode: boolean
  toggleMode: () => void
  showGate: boolean
  setShowGate: (v: boolean) => void
  isSwitching: boolean
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isAdultMode, setIsAdultMode] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  // Apply theme to root element
  useEffect(() => {
    const root = document.documentElement
    if (isAdultMode) {
      root.setAttribute('data-mode', 'adult')
    } else {
      root.removeAttribute('data-mode')
    }
  }, [isAdultMode])

  // Reset to normal if user logs out
  useEffect(() => {
    if (!user) setIsAdultMode(false)
  }, [user])

  const toggleMode = () => {
    if (isAdultMode) {
      setIsSwitching(true)
      setTimeout(() => {
        setIsAdultMode(false)
        setIsSwitching(false)
      }, 1000)
      return
    }
    // If already enabled in account, switch directly
    if (user?.adultModeEnabled) {
      setIsSwitching(true)
      setTimeout(() => {
        setIsAdultMode(true)
        setIsSwitching(false)
      }, 1000)
    } else {
      setShowGate(true)
    }
  }

  return (
    <ModeContext.Provider value={{ isAdultMode, toggleMode, showGate, setShowGate, isSwitching }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used within ModeProvider')
  return ctx
}