"use client"

import { useState, useEffect } from "react"

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const storedState = localStorage.getItem("mcp-explorer-sidebar")
    if (storedState) {
      setIsOpen(storedState === "true")
    }
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("mcp-explorer-sidebar", String(isOpen))
  }, [isOpen])

  const toggle = () => setIsOpen(prev => !prev)

  return {
    isOpen,
    toggle
  }
}
