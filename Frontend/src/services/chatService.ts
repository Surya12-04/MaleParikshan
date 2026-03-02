import api from "./api"
import type { ChatMessage } from "../types"

export const chatService = {
  async send(
    message: string,
    mode: "normal" | "adult" = "normal"
  ) {
    const res = await api.post("/chat", {
      message,
      mode,
    })

    // Backend returns:
    // {
    //   success: true,
    //   data: { message, response, timestamp }
    // }

    return res.data.data
  },

  async history(): Promise<ChatMessage[]> {
    const res = await api.get("/chat/history")
    // returns array of logs: { message, response, timestamp }
    const logs: Array<{ message: string; response: string; timestamp: string }> =
      res.data.data
    // convert to ChatMessage[] interleaving user/assistant
    const messages: ChatMessage[] = []
    logs.forEach((log, idx) => {
      messages.push({
        id: `${log.timestamp}-u-${idx}`,
        role: "user",
        content: log.message,
        createdAt: log.timestamp,
      })
      messages.push({
        id: `${log.timestamp}-a-${idx}`,
        role: "assistant",
        content: log.response,
        createdAt: log.timestamp,
      })
    })
    return messages
  },
}