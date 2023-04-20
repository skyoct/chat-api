import { Injectable } from '@nestjs/common';
import { ChatRequestDto } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatGPTApi } from './gpt.service';
import { ChatMessage } from 'chatgpt';
import { Response } from 'express';

@Injectable()
export class ChatService {

  constructor(private readonly chatGPTApi: ChatGPTApi,
    ) {}

  async process( ChatRequestDto: ChatRequestDto, res: Response) {
    res.setHeader('Content-type', 'application/octet-stream')
    try {
      const { prompt, options = {}, systemMessage, temperature, top_p } = ChatRequestDto
      let firstChunk = true
      await this.chatGPTApi.chatReplyProcess({
        message: prompt,
        lastContext: options,
        process: (chat: ChatMessage) => {
          res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
          firstChunk = false
        },
        systemMessage,
        temperature,
        top_p,
      })
    }
    catch (error) {
      res.write(JSON.stringify(error))
    }
    finally {
      res.end()
    }
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
