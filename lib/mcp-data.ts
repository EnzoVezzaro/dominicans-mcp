import type { MCP } from "./types"

export const mcpList: MCP[] = [
  {
    id: "dominican-congress",
    name: "Legislator MCP",
    description: "Dominican Republic legislative information",
    type: "government",
    status: "online",
    tags: ["legislative", "government"],
    connectionDetails: {
      type: "stdio",
      command: "node",
      args: ["/Users/mac/Desktop/Github/mcp-dominican-layer/build/index.js"]
    },
    apiBaseUrl: "http://localhost:8089/api/legislative",
    sampleQuestions: [
      "Who are the current senators?",
      "Show me recent legislative bills",
      "What are the latest congressional votes?"
    ]
  },
  ...(typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem("test-mcps") || "[]") 
    : [])
]

export const emptyMcp: Omit<MCP, 'id'> = {
  name: '',
  description: '',
  type: '',
  status: 'offline',
  tags: [],
  connectionDetails: {
    type: 'stdio',
    command: '',
    args: []
  },
  sampleQuestions: [],
  mockResponses: []
}
