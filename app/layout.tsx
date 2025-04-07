import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/hooks/use-settings"
import { ChatSidebar } from "@/components/chat-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Dominican MCP Explorer",
  description: "Explore and chat with Dominican Model Context Protocol servers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <main className="min-h-screen bg-background">
              <ChatSidebar />
              {children}
            </main>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'