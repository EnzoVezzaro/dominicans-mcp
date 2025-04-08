"use client"

import { streamText, type CoreMessage, type ToolCall } from "ai";
import { createOpenAI } from "@ai-sdk/openai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createGroq } from "@ai-sdk/groq"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import type { MCPCapabilities } from "./types"

// Define the structure for provider options, including API keys
interface ProviderOptions {
  apiKey?: string
  baseURL?: string // Optional: For self-hosted or proxy setups
}

// Map provider IDs to their corresponding AI SDK provider factory functions
const providerFactoryMap: Record<string, any> = {
  openai: createOpenAI,
  google: createGoogleGenerativeAI,
  anthropic: createAnthropic,
  qroq: createGroq, // Assuming 'qroq' uses the Groq SDK
  openrouter: createOpenRouter,
  // Add DeepSeek and xAI if/when official AI SDK providers are available
  // deepseek: createDeepSeek, // Placeholder
  // xai: createXAI, // Placeholder
}

interface MCPClientOptions {
  provider: string
  model: string
  apiKey: string
  mcp?: any
}

export function createMCPClient(options: MCPClientOptions) {
  const { provider: providerId, model, apiKey } = options

  const getProviderInstance = () => {
    const providerFactory = providerFactoryMap[providerId]
    if (!providerFactory) {
      throw new Error(`Unsupported provider: ${providerId}`)
    }

    // Configure the provider with the API key
    // Note: Some providers might have different configuration methods
    // This assumes a common pattern; adjust if needed per provider docs.
    const providerOptions: ProviderOptions = {}
    if (apiKey) {
      providerOptions.apiKey = apiKey
    }
    // Add baseURL or other options if necessary for specific providers
    // e.g., for OpenRouter, you might need to set baseURL

    // Special handling for OpenRouter base URL and headers if needed
    if (providerId === "openrouter") {
      // OpenRouter often requires headers for API key and potentially site identification
      // Check @openrouter/ai-sdk-provider docs for exact configuration
      // Example (may need adjustment):
      // providerOptions.headers = {
      //   'Authorization': `Bearer ${apiKey}`,
      //   'HTTP-Referer': 'YOUR_SITE_URL', // Optional but recommended
      //   'X-Title': 'YOUR_SITE_NAME', // Optional but recommended
      // };
      // providerOptions.apiKey = undefined; // API key might be passed via headers instead
      // OpenRouter specific: You might need to pass default headers here
      // providerOptions.headers = { 'HTTP-Referer': 'YOUR_SITE_URL', 'X-Title': 'YOUR_SITE_NAME' };
    }

    // Create the provider instance
    return providerFactory(providerOptions)
  }

  const getCapabilities = async (): Promise<MCPCapabilities> => {
    // TODO: Implement actual capability detection based on provider/model if possible
    // For now, return default values
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate brief check
    return {
      hasVision: false, // Placeholder - depends on model
      hasFileUpload: false, // Placeholder - depends on model/provider support
      hasToolCalling: false, // Placeholder - depends on model/provider support
      supportedTools: [], // Placeholder
    }
  }

  const sendMessage = async (messages: CoreMessage[]) => {
    if (!Array.isArray(messages)) {
      console.error("Invalid messages format. Expected an array.")
      throw new Error("Invalid messages format.")
    }

    const providerInstance = getProviderInstance()

    try {
      console.log('this tools: ', options);
      const result = await streamText({
        model: providerInstance.chat(model),
        messages: messages,
        tools: {
          [options.mcp.id]: {
            description: options.mcp.description || 'MCP tool for legislative information',
            parameters: {
              type: 'object',
              properties: {
                chamber: {
                  type: 'string',
                  enum: ['senado', 'diputados'],
                  description: 'Legislative chamber to query'
                }
              },
              required: ['chamber'],
              additionalProperties: false
            },
            execute: async (params) => {
              console.log('here: ', params);
              
              // Implementation would call the MCP server
              return { result: 'MCP tool executed' }
            }
          }
        },
        toolChoice: 'auto'
      })
      console.log('stream result:', result.textStream);
      
      return await result.textStream;
    } catch (error) {
      console.log(`Error sending message via ${providerId} (${model}):`, error)
      // Re-throw or handle error appropriately
      throw error
    }
  }

  const close = () => {
    // No explicit connection to close in this client-side SDK model
    console.log("MCP client cleanup (no-op for this implementation)")
  }

  return {
    getCapabilities,
    sendMessage,
    close,
  }
}

// Helper type for message structure (if not already defined elsewhere)
// export interface CoreMessage {
//   role: 'user' | 'assistant' | 'system' | 'tool';
//   content: string;
//   // Add tool_calls, tool_call_id etc. if using tool calling features
// }
