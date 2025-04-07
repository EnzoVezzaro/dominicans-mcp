"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TestTube2 } from "lucide-react"

export function TestMcpDialog() {
  const [open, setOpen] = useState(false)
  const [connectionType, setConnectionType] = useState<"remote" | "local">("remote")
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [command, setCommand] = useState("")

  const handleSave = () => {
    const newMcp = {
      id: `test-${Date.now()}`,
      name,
      description: "Test MCP Server",
      type: "test",
      status: "online",
      tags: ["test"],
      connectionDetails: connectionType === "remote" 
        ? { type: "sse", url }
        : { type: "stdio", command, args: [] },
      sampleQuestions: [],
      mockResponses: []
    }

    const testMcps = JSON.parse(localStorage.getItem("test-mcps") || "[]")
    testMcps.push(newMcp)
    localStorage.setItem("test-mcps", JSON.stringify(testMcps))
    
    setOpen(false)
    window.location.reload() // Refresh to show new MCP
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <TestTube2 className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Test MCP Server</DialogTitle>
            <DialogDescription>
              Configure a local or remote MCP server for testing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Connection Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={connectionType === "remote" ? "default" : "outline"}
                  onClick={() => setConnectionType("remote")}
                >
                  Remote
                </Button>
                <Button
                  variant={connectionType === "local" ? "default" : "outline"}
                  onClick={() => setConnectionType("local")}
                >
                  Local
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Test MCP"
              />
            </div>

            {connectionType === "remote" ? (
              <div className="space-y-2">
                <Label>Server URL</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="http://localhost:3000/mcp"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Command</Label>
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="node server.js"
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
