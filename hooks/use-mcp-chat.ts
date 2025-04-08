"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { CoreMessage } from "ai" // Import CoreMessage
import type { ChatMessage, MCPCapabilities } from "@/lib/types"
import { mcpList } from "@/lib/mcp-data"
import { useSettings } from "./use-settings"
import { createMCPClient } from "@/lib/mcp-client"
// Removed: import { readStreamableValue } from "ai/rsc"

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
    console.log('aqui: ', settings, mcp);
    const initMCP = async () => {
      try {
        setIsLoading(true)
        
        // Create MCP client (remove mcpId and connectionDetails)
        mcpClientRef.current = createMCPClient({
          provider: settings.provider,
          model: settings.model,
          apiKey: settings.apiKey,
          mcp: mcp
        })

        // Fetch capabilities
        const caps = await mcpClientRef.current.getCapabilities()
        console.log('get cap: ', caps);
        
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
      if (!mcp) {
        setError("MCP configuration not found")
        return
      }
      
      if (!mcpClientRef.current) { 
        // Initialize client if not already done (remove mcpId and connectionDetails)
        try {
          mcpClientRef.current = createMCPClient({
            provider: settings.provider,
            model: settings.model,
            apiKey: settings.apiKey,
            mcp: mcp
          })
        } catch (err) {
          console.error("Error re-initializing MCP:", err)
          setError("Failed to re-initialize MCP connection")
          return
        }
      }

      // Add user message
      const userMessage: ChatMessage = {
        role: "user",
        content,
        // File handling needs separate implementation if required by the model/provider
        // file: file ? URL.createObjectURL(file) : undefined,
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setIsLoading(true)
      setError(null)

      // Map internal ChatMessage[] to CoreMessage[] for the AI SDK
      const coreMessages: CoreMessage[] = updatedMessages
        .filter((msg) => msg.role === "user" || msg.role === "assistant") // Filter relevant roles
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
          // Add tool calls/results here if needed
        }))

      try {
        // Create a placeholder for the assistant's response
        const assistantMessageId = Date.now().toString()
        setMessages((prev) => [...prev, { role: "assistant", content: "", id: assistantMessageId }])

        // Stream the response - pass the CoreMessage array
        const stream = await mcpClientRef.current.sendMessage(coreMessages)

        // Process the stream (it yields strings directly)
        const reader = stream.getReader();
        let accumulatedContent = "";

        try {
            while (true) {
                const { value, done } = await reader.read(); // value is a string chunk
                if (done) {
                    break; // Exit the loop when the stream is finished
                }

                // Append the string chunk
                accumulatedContent += value;

                // Update the message content incrementally
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId ? { ...msg, content: accumulatedContent } : msg,
                    ),
                );
            }
        } finally {
            // Ensure the reader lock is released, regardless of errors
            reader.releaseLock();
        }

      } catch (err) {
        console.error("MCP communication error:", err)
        const errorMsg = err instanceof Error ? err.message : "MCP connection failed"
        setError(`MCP Error: ${errorMsg}`)

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `MCP Error: ${errorMsg}`
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
