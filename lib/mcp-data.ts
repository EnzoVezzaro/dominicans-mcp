import type { MCP } from "./types"

export const mcpList: MCP[] = [
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
  }
}
