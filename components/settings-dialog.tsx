"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Settings, Download, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSettings } from "@/hooks/use-settings"
import { useChatStore } from "@/hooks/use-chat-store"
import { useTheme } from "next-themes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PROVIDERS } from "@/lib/constants"

export function SettingsDialog() {
  const { settings, updateSettings } = useSettings()
  const { clearAllChats, exportChats, importChats } = useChatStore()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [apiKey, setApiKey] = useState(settings.apiKey || "")
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string }[]>([])
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update available models when provider changes
  const handleProviderChange = (providerId: string) => {
    const provider = PROVIDERS.find((p) => p.id === providerId)
    updateSettings({
      ...settings,
      provider: providerId,
      model: "", // Reset model when provider changes
    })
    setAvailableModels(provider?.models || [])
  }

  const handleSave = () => {
    updateSettings({
      ...settings,
      apiKey,
    })
    setOpen(false)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string
        const success = importChats(jsonData)

        if (!success) {
          setImportError("Invalid chat data format")
        } else {
          setImportError(null)
        }
      } catch (error) {
        setImportError("Failed to import chats")
        console.error("Import error:", error)
      }
    }
    reader.readAsText(file)

    // Reset the input
    e.target.value = ""
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setOpen(true)}>
        <Settings className="h-5 w-5" />
        <span className="sr-only">Settings</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Configure your MCP connection settings and preferences.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="connection">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="connection" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <select
                  id="provider"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={settings.provider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                >
                  <option value="">Select provider...</option>
                  {PROVIDERS.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <select
                  id="model"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={settings.model}
                  onChange={(e) => updateSettings({ ...settings, model: e.target.value })}
                  disabled={!settings.provider}
                >
                  <option value="">Select model...</option>
                  {PROVIDERS.find((p) => p.id === settings.provider)?.models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>
            </TabsContent>
            <TabsContent value="preferences" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">Switch between light and dark theme</div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-3">Chat Management</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={exportChats}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chats
                  </Button>

                  <Button variant="outline" className="w-full justify-start" onClick={handleImportClick}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Chats
                  </Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />

                  {importError && <p className="text-sm text-destructive mt-1">{importError}</p>}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All Chats
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all your chat history.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={clearAllChats}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
