import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

/* ===============================
   SMART AUTO LANGUAGE PROMPT
================================ */

const buildSystemPrompt = () => {
  return `
You are Male Parikshan AI — a modern men's health assistant.

IMPORTANT LANGUAGE RULE:

1. Detect the language of the user's message.
2. If user writes in Hindi → respond fully in Hindi.
3. If user writes in English → respond fully in English.
4. If user writes in Hinglish (mixed) → respond naturally in Hinglish.
5. Never force a language.

STYLE RULES:
• Keep responses clean and well spaced.
• Use proper paragraphs.
• Do NOT use markdown symbols like ** or ##.
• Keep tone respectful and confident.
`;
};

/* ===============================
   STREAM CHAT
================================ */

export const chat = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const message = req.body.message;
    const file = req.file;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    let fileNote = "";
    if (file) {
      fileNote = `User attached file: ${file.originalname}`;
    }

    /* STREAM HEADERS */
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: `${fileNote}\n${message}` },
      ],
      stream: true,
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;

      if (content) {
        fullResponse += content;
        res.write(`data: ${content}\n\n`);
      }
    }

    await prisma.chatLog.create({
      data: {
        userId: req.user.userId,
        message,
        response: fullResponse,
      },
    });

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("STREAM ERROR:", error);
    res.write("data: ⚠️ AI Error\n\n");
    res.write("data: [DONE]\n\n");
    res.end();
  }
};

/* ===============================
   CHAT HISTORY
================================ */

export const getChatHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const history = await prisma.chatLog.findMany({
      where: { userId: req.user.userId },
      orderBy: { timestamp: "asc" },
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};