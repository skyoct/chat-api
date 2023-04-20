import 'isomorphic-fetch'
import type { ChatGPTAPIOptions, ChatMessage, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { ResponseUtil } from '../common/utils/response'
import { isNotEmptyString } from '../common/utils/is'
import type { ApiModel } from './dto/types'
import { Injectable } from '@nestjs/common'
import { ServerConfig } from 'src/config'
import { RequestOptions } from './dto/chat.dto'


const importDynamic = new Function( 'modulePath', 'return import(modulePath)', )



const ErrorCodeMessage: Record<string, string> = {
  401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
  403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[OpenAI] 错误的网关 |  Bad Gateway',
  503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[OpenAI] 网关超时 | Gateway Time-out',
  500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
}

const timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 100 * 1000
const disableDebug: boolean = process.env.OPENAI_API_DISABLE_DEBUG === 'true'

let apiModel: ApiModel
const model = isNotEmptyString(process.env.OPENAI_API_MODEL) ? process.env.OPENAI_API_MODEL : 'gpt-3.5-turbo'

if (!isNotEmptyString(ServerConfig.OPENAI_API_KEY) && !isNotEmptyString(process.env.OPENAI_ACCESS_TOKEN))
  throw new Error('Missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN environment variable')

@Injectable()
export class ChatGPTApi {

  private api: ChatGPTAPI

  constructor() {
    this.init()
  }

  async init() {
    const { ChatGPTAPI } = await importDynamic("chatgpt"); 
    const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL
    const options: ChatGPTAPIOptions = {
      apiKey: process.env.OPENAI_API_KEY,
      completionParams: { model },
      debug: !disableDebug,
    }

    if (isNotEmptyString(OPENAI_API_BASE_URL))
    options.apiBaseUrl = `${OPENAI_API_BASE_URL}/v1`

    setProxy(options)

    this.api = new ChatGPTAPI({ ...options })
  }

  async chatReplyProcess(chatRequestDto: RequestOptions) {
    const { message, lastContext, process, systemMessage, temperature, top_p } = chatRequestDto
    try {
      let options: SendMessageOptions = { timeoutMs }
  
      if (apiModel === 'ChatGPTAPI') {
        if (isNotEmptyString(systemMessage))
          options.systemMessage = systemMessage
        options.completionParams = { model, temperature, top_p }
      }
  
      if (lastContext != null) {
        if (apiModel === 'ChatGPTAPI')
          options.parentMessageId = lastContext.parentMessageId
        else
          options = { ...lastContext }
      }
  
      const response = await this.api.sendMessage(message, {
        ...options,
        onProgress: (partialResponse) => {
          process?.(partialResponse)
        },
      })
      return { type: 'Success', data: response }
    }
    catch (error: any) {
      const code = error.statusCode
      global.console.log(error)
      if (Reflect.has(ErrorCodeMessage, code))
        return ResponseUtil.serverError(ErrorCodeMessage[code])
      return ResponseUtil.serverError(error.message ?? 'Please check the back-end console')
    }
  }

}

function setProxy(options: ChatGPTAPIOptions) {
  if (isNotEmptyString(ServerConfig.OPENAI_PROXY_URL)) {
    options.fetch = (url, options = {}) => {
      const defaultOptions = {
          agent: require('https-proxy-agent')(ServerConfig.OPENAI_PROXY_URL)
      };
      const mergedOptions = {
          ...defaultOptions,
          ...options
      };
      return require('node-fetch').default(url, mergedOptions);
    }
  }

}


// (async () => {
//   const { ChatGPTAPI } = await import('chatgpt')
  
//   // More Info: https://github.com/transitive-bullshit/chatgpt-api

//   if (isNotEmptyString(process.env.OPENAI_API_KEY)) {
//     const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL

//     const options: ChatGPTAPIOptions = {
//       apiKey: process.env.OPENAI_API_KEY,
//       completionParams: { model },
//       debug: !disableDebug,
//     }

//     // increase max token limit if use gpt-4
//     if (model.toLowerCase().includes('gpt-4')) {
//       // if use 32k model
//       if (model.toLowerCase().includes('32k')) {
//         options.maxModelTokens = 32768
//         options.maxResponseTokens = 8192
//       }
//       else {
//         options.maxModelTokens = 8192
//         options.maxResponseTokens = 2048
//       }
//     }

//     if (isNotEmptyString(OPENAI_API_BASE_URL))
//       options.apiBaseUrl = `${OPENAI_API_BASE_URL}/v1`

//     // setupProxy(options)

//     const { ChatGPTAPI } = await importDynamic("chatgpt"); 

//     api = new ChatGPTAPI({ ...options })
//     apiModel = 'ChatGPTAPI'
//   }
//   else {
//     const options: ChatGPTUnofficialProxyAPIOptions = {
//       accessToken: process.env.OPENAI_ACCESS_TOKEN,
//       apiReverseProxyUrl: isNotEmptyString(process.env.API_REVERSE_PROXY) ? process.env.API_REVERSE_PROXY : 'https://bypass.churchless.tech/api/conversation',
//       model,
//       debug: !disableDebug,
//     }

//     // setupProxy(options)

//     api = new ChatGPTUnofficialProxyAPI({ ...options })
//     apiModel = 'ChatGPTUnofficialProxyAPI'
//   }
// })()

// async function chatReplyProcess(options: RequestOptions) {
//   const { message, lastContext, process, systemMessage, temperature, top_p } = options
//   try {
//     let options: SendMessageOptions = { timeoutMs }

//     if (apiModel === 'ChatGPTAPI') {
//       if (isNotEmptyString(systemMessage))
//         options.systemMessage = systemMessage
//       options.completionParams = { model, temperature, top_p }
//     }

//     if (lastContext != null) {
//       if (apiModel === 'ChatGPTAPI')
//         options.parentMessageId = lastContext.parentMessageId
//       else
//         options = { ...lastContext }
//     }

//     const response = await api.sendMessage(message, {
//       ...options,
//       onProgress: (partialResponse) => {
//         process?.(partialResponse)
//       },
//     })
//     return ResponseUtil.ok(response)
//   }
//   catch (error: any) {
//     const code = error.statusCode
//     global.console.log(error)
//     if (Reflect.has(ErrorCodeMessage, code))
//       return ResponseUtil.serverError(ErrorCodeMessage[code])
//     return ResponseUtil.serverError(error.message ?? 'Please check the back-end console')
//   }
// }

// async function fetchUsage() {
//   const OPENAI_API_KEY = process.env.OPENAI_API_KEY
//   const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL

//   if (!isNotEmptyString(OPENAI_API_KEY))
//     return Promise.resolve('-')

//   const API_BASE_URL = isNotEmptyString(OPENAI_API_BASE_URL)
//     ? OPENAI_API_BASE_URL
//     : 'https://api.openai.com'

//   const [startDate, endDate] = formatDate()

//   // 每月使用量
//   const urlUsage = `${API_BASE_URL}/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`

//   const headers = {
//     'Authorization': `Bearer ${OPENAI_API_KEY}`,
//     'Content-Type': 'application/json',
//   }

//   const options = {} as SetProxyOptions

//   setupProxy(options)

//   try {
//     // 获取已使用量
//     const useResponse = await options.fetch(urlUsage, { headers })
//     if (!useResponse.ok)
//       throw new Error('获取使用量失败')
//     const usageData = await useResponse.json() as UsageResponse
//     const usage = Math.round(usageData.total_usage) / 100
//     return Promise.resolve(usage ? `$${usage}` : '-')
//   }
//   catch (error) {
//     global.console.log(error)
//     return Promise.resolve('-')
//   }
// }

// function formatDate(): string[] {
//   const today = new Date()
//   const year = today.getFullYear()
//   const month = today.getMonth() + 1
//   const lastDay = new Date(year, month, 0)
//   const formattedFirstDay = `${year}-${month.toString().padStart(2, '0')}-01`
//   const formattedLastDay = `${year}-${month.toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`
//   return [formattedFirstDay, formattedLastDay]
// }

// async function chatConfig() {
//   const usage = await fetchUsage()
//   const reverseProxy = process.env.API_REVERSE_PROXY ?? '-'
//   const httpsProxy = (process.env.HTTPS_PROXY || process.env.ALL_PROXY) ?? '-'
//   const socksProxy = (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT)
//     ? (`${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}`)
//     : '-'

//   return ResponseUtil.ok({ apiModel, reverseProxy, timeoutMs, socksProxy, httpsProxy, usage })
// }

// function setupProxy(options: SetProxyOptions) {
//   if (isNotEmptyString(process.env.SOCKS_PROXY_HOST) && isNotEmptyString(process.env.SOCKS_PROXY_PORT)) {
//     const agent = new SocksProxyAgent({
//       hostname: process.env.SOCKS_PROXY_HOST,
//       port: process.env.SOCKS_PROXY_PORT,
//       userId: isNotEmptyString(process.env.SOCKS_PROXY_USERNAME) ? process.env.SOCKS_PROXY_USERNAME : undefined,
//       password: isNotEmptyString(process.env.SOCKS_PROXY_PASSWORD) ? process.env.SOCKS_PROXY_PASSWORD : undefined,
//     })
//     options.fetch = (url, options) => {
//       return fetch(url, { agent, ...options })
//     }
//   }
//   else if (isNotEmptyString(process.env.HTTPS_PROXY) || isNotEmptyString(process.env.ALL_PROXY)) {
//     const httpsProxy = process.env.HTTPS_PROXY || process.env.ALL_PROXY
//     if (httpsProxy) {
//       const agent = new HttpsProxyAgent(httpsProxy)
//       options.fetch = (url, options) => {
//         return fetch(url, { agent, ...options })
//       }
//     }
//   }
//   else {
//     options.fetch = (url, options) => {
//       return fetch(url, { ...options })
//     }
//   }
// }

// function currentModel(): ApiModel {
//   return apiModel
// }



// export type { ChatContext, ChatMessage }

// export { chatReplyProcess, chatConfig, currentModel }


