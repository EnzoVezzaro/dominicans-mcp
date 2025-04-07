"use client"

import { useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, MessageSquare, Search, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useChatStore, type ChatSession } from "@/hooks/use-chat-store"
import { mcpList } from "@/lib/mcp-data"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export function ChatSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { chats, deleteChat } = useChatStore()
  const [isOpen, setIsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleChatClick = (chat: ChatSession) => {
    router.push(`/chat/${chat.mcpId}?chatId=${chat.id}`)
  }

  const handleNewChat = () => {
    router.push("/")
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const getMcpName = (mcpId: string) => {
    return mcpList.find((mcp) => mcp.id === mcpId)?.name || mcpId
  }

  return (
    <div
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%-2rem)]",
      )}
    >
      <div className={cn("h-full bg-card border-r w-72 flex flex-col", !isOpen && "opacity-0 pointer-events-none")}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Chat History</h2>
          <Button variant="ghost" size="sm" onClick={handleNewChat}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>

        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-2">
          {filteredChats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No chats yet</p>
              <p className="text-sm">Start a new conversation</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "p-3 rounded-md cursor-pointer hover:bg-accent group relative",
                    pathname.includes(`chatId=${chat.id}`) && "bg-accent",
                  )}
                  onClick={() => handleChatClick(chat)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate pr-6">{chat.title}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute right-2 top-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteChat(chat.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage || "No messages"}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">{getMcpName(chat.mcpId)}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex items-center h-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-r-full h-12 w-8 bg-card border-y border-r"
                onClick={toggleSidebar}
              >
                {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{isOpen ? "Hide chat history" : "Show chat history"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

