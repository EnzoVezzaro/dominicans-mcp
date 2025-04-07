"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Send, AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mcpList } from "@/lib/mcp-data"
import { motion, AnimatePresence } from "framer-motion"
import { useMCPChat } from "@/hooks/use-mcp-chat"
import { FileUpload } from "@/components/file-upload"
import { useChatStore } from "@/hooks/use-chat-store"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatId = searchParams.get("chatId")
  const id = params.id as string
  const mcp = mcpList.find((m) => m.id === id)
  const [input, setInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatCreatedRef = useRef(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get chat store functions
  const { getChat, createChat, updateChat } = useChatStore()

  // Initialize with existing chat if available
  const existingChat = chatId ? getChat(chatId) : null
  const initialMessages = existingChat && existingChat.mcpId === id ? existingChat.messages : []

  // Use custom hook for chat functionality
  const {
    messages,
    setMessages, // Add this to the hook return value
    sendMessage,
    isLoading,
    capabilities,
    error,
  } = useMCPChat(id, initialMessages) // Pass initialMessages

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage(input, file || undefined)
      setInput("")
      setFile(null)
    }
  }

  // Save messages to chat store when they change
  useEffect(() => {
    // Skip if no messages
    if (messages.length === 0) return

    // If we have a chatId, update the existing chat
    if (chatId) {
      updateChat(chatId, messages)
    }
    // If we don't have a chatId and have at least one exchange, create a new chat
    else if (messages.length >= 2 && !chatCreatedRef.current) {
      chatCreatedRef.current = true

      const newChatId = createChat(
        id,
        // Use first few words of first message as title
        messages[0].content.split(" ").slice(0, 5).join(" ") + "...",
      )

      // Update URL to include chatId
      router.replace(`/chat/${id}?chatId=${newChatId}`)

      // Save messages to the new chat
      updateChat(newChatId, messages)
    }
  }, [messages])

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
  }

  const handleNewChat = () => {
    router.push(`/chat/${id}`)
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (!isClient) return null

  if (!mcp) {
    return (
      <div className="container mx-auto py-8 px-4 text-center" suppressHydrationWarning>
        <h1 className="text-2xl font-bold mb-4">MCP not found</h1>
        <Button onClick={() => router.push("/")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 px-4 flex flex-col h-[calc(100vh-2rem)]">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button onClick={() => router.push("/")} variant="ghost" className="mr-4" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={mcp.name} />
              <AvatarFallback>{mcp.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">{mcp.name}</h1>
              <div className="flex items-center">
                <Badge variant={mcp.status === "online" ? "default" : "secondary"} className="mr-2">
                  {mcp.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{mcp.type}</span>
              </div>
            </div>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleNewChat} className="flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          New Chat
        </Button>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="flex-1 overflow-hidden flex flex-col mb-4">
        <CardHeader className="py-3 px-4 border-b">
          <CardTitle className="text-sm font-medium">Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="max-w-md">
                  <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                  <p className="text-muted-foreground mb-4">Send a message to begin chatting with {mcp.name}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {mcp.sampleQuestions.map((question, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInput(question)
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"} max-w-[80%]`}>
                    <Avatar className="h-8 w-8 mt-1">
                      {message.role === "user" ? (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                          <AvatarFallback>U</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={mcp.name} />
                          <AvatarFallback>{mcp.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`mx-2 px-4 py-2 rounded-lg ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.file && (
                        <div className="mb-2">
                          <img
                            src={message.file || "/placeholder.svg"}
                            alt="Uploaded file"
                            className="max-w-full max-h-48 rounded-md"
                          />
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="relative flex items-center">
        {capabilities?.hasVision && (
          <div className="mr-2">
            <FileUpload onFileSelect={handleFileSelect} isUploading={isLoading} />
          </div>
        )}
        <div className="relative flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            className="pr-12 py-6"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
