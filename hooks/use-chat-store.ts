"use client"

import { useState, useEffect } from "react"
import type { ChatMessage } from "@/lib/types"

export interface ChatSession {
  id: string
  mcpId: string
  title: string
  lastMessage: string
  timestamp: number
  messages: ChatMessage[]
}

export function useChatStore() {
  const [chats, setChats] = useState<ChatSession[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load chats from localStorage on mount
  useEffect(() => {
    const storedChats = localStorage.getItem("mcp-explorer-chats")
    if (storedChats) {
      try {
        setChats(JSON.parse(storedChats))
      } catch (e) {
        console.error("Failed to parse stored chats:", e)
      }
    }
    setLoaded(true)
  }, [])

  // Save chats to localStorage when they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("mcp-explorer-chats", JSON.stringify(chats))
    }
  }, [chats, loaded])

  const getChat = (chatId: string) => {
    return chats.find((chat) => chat.id === chatId) || null
  }

  const createChat = (mcpId: string, title: string) => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      mcpId,
      title,
      lastMessage: "",
      timestamp: Date.now(),
      messages: [],
    }

    setChats((prev) => [newChat, ...prev])
    return newChat.id
  }

  // Update the updateChat function to prevent unnecessary updates
  const updateChat = (chatId: string, messages: ChatMessage[]) => {
    // First check if the chat exists
    const existingChat = chats.find((chat) => chat.id === chatId)
    if (!existingChat) return

    // Only update if messages have actually changed
    if (JSON.stringify(existingChat.messages) === JSON.stringify(messages)) {
      return // Skip update if messages are the same
    }

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const lastMsg = messages[messages.length - 1]
          return {
            ...chat,
            messages,
            lastMessage: lastMsg ? lastMsg.content.substring(0, 50) + (lastMsg.content.length > 50 ? "..." : "") : "",
            timestamp: Date.now(),
          }
        }
        return chat
      }),
    )
  }

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
  }

  const clearAllChats = () => {
    setChats([])
  }

  const exportChats = () => {
    const dataStr = JSON.stringify(chats, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `mcp-chats-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importChats = (jsonData: string) => {
    try {
      const importedChats = JSON.parse(jsonData) as ChatSession[]
      setChats((prev) => [...importedChats, ...prev])
      return true
    } catch (e) {
      console.error("Failed to import chats:", e)
      return false
    }
  }

  return {
    chats,
    getChat,
    createChat,
    updateChat,
    deleteChat,
    clearAllChats,
    exportChats,
    importChats,
  }
}

