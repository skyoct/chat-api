import type { ChatMessage } from 'chatgpt'

export class ChatRequestDto {
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


  export interface RequestOptions {
    message: string
    lastContext?: { conversationId?: string; parentMessageId?: string }
    process?: (chat: ChatMessage) => void
    systemMessage?: string
    temperature?: number
    top_p?: number
  }
  