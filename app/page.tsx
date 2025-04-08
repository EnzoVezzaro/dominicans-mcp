"use client"

import { useState } from "react"
import { Search, Github } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { mcpList } from "@/lib/mcp-data"
import { SettingsDialog } from "@/components/settings-dialog"
import { LanguageSwitcher } from "@/components/language-switcher"
import { TestMcpDialog } from "@/components/test-mcp-dialog"
import { useTranslation } from "@/hooks/use-translation"
import { useSidebar } from "@/hooks/use-sidebar"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useTranslation()
  const { isOpen } = useSidebar()

  const filteredMcps = mcpList.filter(
    (mcp) =>
      mcp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mcp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mcp.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <>
      <div className={`max-w-7xl w-full py-8 px-4 transition-all duration-300 mx-auto ml-0`}>
        <header className="mb-12 text-center relative">
          <div className="absolute right-0 top-0 flex space-x-2">
            {/** <TestMcpDialog /> */}
            <LanguageSwitcher />
            {/** <SettingsDialog /> */}
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-transparent bg-clip-text">
            Dominican MCP Explorer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("home_description")}
          </p>
        </header>

        <div className="relative max-w-xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder={t("search_placeholder")}
            className="pl-10 w-full h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMcps.map((mcp, index) => (
            <motion.div
              key={mcp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`${mcp.github}`} target="_blank" className="block h-full">
                <Card className="h-full hover:shadow-md transition-shadow duration-300 border-2 hover:border-emerald-200">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{mcp.name}</span>
                      <Badge variant={mcp.status === "online" ? "default" : "secondary"}>{t(mcp.status)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{mcp.description}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 flex-wrap">
                      {mcp.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <footer className="text-center mt-8 text-muted-foreground absolute bottom-0 text-center w-full pb-8">
        <Link href="https://github.com/EnzoVezzaro/dominicans-mcp" target="_blank" rel="noopener noreferrer">
          <Github className="inline-block align-text-top mx-1 mb-4" size={21} />
        </Link>
        <br />Made with 💚☕️👨🏽‍💻🇩🇴
      </footer>
    </>
  )
}
