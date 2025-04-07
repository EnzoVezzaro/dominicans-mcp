"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

export interface Settings {
  provider: string
  model: string
  apiKey: string
  language: string
}

const defaultSettings: Settings = {
  provider: "",
  model: "",
  apiKey: "",
  language: "es", // Spanish default
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Settings) => void
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
})

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem("mcp-explorer-settings")
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings))
      } catch (e) {
        console.error("Failed to parse stored settings:", e)
      }
    }
  }, [])

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings)
    localStorage.setItem("mcp-explorer-settings", JSON.stringify(newSettings))
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}

export const useSettings = () => useContext(SettingsContext)

