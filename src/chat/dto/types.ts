import type { FetchFn } from 'chatgpt'

import type { ChatMessage } from 'chatgpt'
import type fetch from 'node-fetch'

export interface RequestProps {
  prompt: string
  options?: ChatContext
  systemMessage: string
  temperature?: number
  top_p?: number
}

export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

export interface ChatGPTUnofficialProxyAPIOptions {
  accessToken: string
  apiReverseProxyUrl?: string
  model?: string
  debug?: boolean
  headers?: Record<string, string>
  fetch?: FetchFn
}

export interface ModelConfig {
  apiModel?: ApiModel
  reverseProxy?: string
  timeoutMs?: number
  socksProxy?: string
  httpsProxy?: string
  usage?: string
}

export type ApiModel = 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI' | undefined





export interface SetProxyOptions {
  fetch?: typeof fetch
}

export interface UsageResponse {
  total_usage: number
}
