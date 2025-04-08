export interface MCP {
  id: string
  name: string
  description: string
  github: string
  type: string
  status: "online" | "offline" | "maintenance"
  tags: string[]
  connectionDetails: MCPConnectionDetails
  sampleQuestions: string[]
  mockResponses: {
    keywords: string[]
    response: string
  }[]
}

export interface MCPConnectionDetails {
  type: "sse" | "stdio"
  url?: string
  command?: string
  args?: string[]
}

export interface MCPCapabilities {
  hasVision: boolean
  hasFileUpload: boolean
  hasToolCalling: boolean
  supportedTools: string[]
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  id?: string
  file?: string
}

export interface Settings {
  provider: string
  model: string
  apiKey: string
  language: string
}

