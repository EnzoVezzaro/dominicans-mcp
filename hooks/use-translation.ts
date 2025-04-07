"use client"

import { useSettings } from "./use-settings"
import { translations } from "@/lib/translations"

export function useTranslation() {
  const { settings } = useSettings()

  const t = (key: string): string => {
    const lang = settings.language || "es"
    return translations[lang]?.[key] || translations["en"][key] || key
  }

  return { t }
}

