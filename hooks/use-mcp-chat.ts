"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { ChatMessage, MCPCapabilities } from "@/lib/types"
import { mcpList } from "@/lib/mcp-data"
import { useSettings } from "./use-settings"
import { createMCPClient } from "@/lib/mcp-client"

export function useMCPChat(mcpId: string, initialMessages: ChatMessage[] = []) {
  const { settings } = useSettings()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [capabilities, setCapabilities] = useState<MCPCapabilities | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mcp = mcpList.find((m) => m.id === mcpId)
  const mcpClientRef = useRef<ReturnType<typeof createMCPClient> | null>(null)

  // Initialize MCP client and fetch capabilities
  useEffect(() => {
    if (!mcp || !settings.provider || !settings.model || !settings.apiKey) return

    const initMCP = async () => {
      try {
        setIsLoading(true)

        // Create MCP client
        mcpClientRef.current = createMCPClient({
          mcpId: mcp.id,
          connectionDetails: mcp.connectionDetails,
          provider: settings.provider,
          model: settings.model,
          apiKey: settings.apiKey,
        })

        // Fetch capabilities
        const caps = await mcpClientRef.current.getCapabilities()
        setCapabilities(caps)
        setError(null)
      } catch (err) {
        console.error("Error initializing MCP:", err)
        setError("Failed to connect to MCP. Please check your settings and try again.")
      } finally {
        setIsLoading(false)
      }
    }

    initMCP()

    return () => {
      // Cleanup MCP client
      if (mcpClientRef.current) {
        mcpClientRef.current.close()
      }
    }
  }, [mcp, settings.provider, settings.model, settings.apiKey])

  const sendMessage = useCallback(
    async (content: string, file?: File) => {
      if (!mcp || !mcpClientRef.current) {
        setError("MCP client not initialized. Please check your settings.")
        return
      }

      // Add user message
      const userMessage: ChatMessage = {
        role: "user",
        content,
        file: file ? URL.createObjectURL(file) : undefined,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        // Create a placeholder for the assistant's response
        const assistantMessageId = Date.now().toString()
        setMessages((prev) => [...prev, { role: "assistant", content: "", id: assistantMessageId }])

        // Stream the response
        const stream = await mcpClientRef.current.sendMessage(content, file)

        // Process the stream
        for await (const chunk of stream) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk } : msg)),
          )
        }
      } catch (err) {
        console.error("Error sending message to MCP:", err)
        setError("Failed to send message. Please try again.")

        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, there was an error connecting to this MCP. Please try again later.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [mcp],
  )

  return {
    messages,
    setMessages,
    sendMessage,
    isLoading,
    capabilities,
    error,
  }
}

