import { RetrievalService } from "../retrieval/service";
import { PromptBuilder } from "./promptBuilder";

import { ChatSessionService } from "../chatSession/service";
import { ChatSessionRepository } from "../chatSession/repository";
// import { llmService } from "@/src/providers/llm";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from "ai";
import { ollama } from "ai-sdk-ollama";

const chatSessionService = new ChatSessionService(new ChatSessionRepository());

export class ChatService {
  private retrievalService = new RetrievalService();
  private promptBuilder = new PromptBuilder();

  async streamAnswer(
    sessionId: string,
    query: string,
    reply: any,
    model = "phi3:mini",
    topK = 5,
  ) {
    // Save user message
    await chatSessionService.addMessage(sessionId, "user", query);

    // Retrieve context
    const retrieval = await this.retrievalService.retrieve(
      query,
      topK,
      true,
      model,
    );

    // Build prompt
    const prompt = this.promptBuilder.build(query, retrieval.context);

    reply.header("Content-Type", "text/plain; charset=utf-8");

    // Stream result -- working one
    // const result = await llmService.stream(prompt, model);
    // return reply.send(result.toUIMessageStreamResponse().body);

    let fullResponse = "";

    const stream = createUIMessageStream<any>({
      execute: ({ writer }) => {
        // 1. Send initial status (transient - won't be added to message history)
        writer.write({
          type: "data-notification",
          data: { message: "Processing your request...", level: "info" },
          transient: true, // This part won't be added to message history
        });

        const result = streamText({
          model: ollama(model),
          prompt: prompt,

          onChunk(event) {
            const chunk = event.chunk;

            // Only assistant text
            if (chunk.type === "text-delta") {
              fullResponse += chunk.text;
            }
          },

          onFinish() {
            writer.write({
              type: "data-citations",
              id: "citations-1", // Same ID = update existing part
              data: retrieval.citations,
            });

            writer.write({
              type: "data-chunks",
              id: "chunks-1", // Same ID = update existing part
              data: retrieval.chunks,
            });

            // Send completion notification (transient)
            writer.write({
              type: "data-notification",
              data: { message: "Request completed", level: "info" },
              transient: true, // Won't be added to message history
            });

            // Update Response in Chat
            chatSessionService.addMessage(sessionId, "assistant", fullResponse);
          },
        });

        writer.merge(result.toUIMessageStream());
      },
    });

    return createUIMessageStreamResponse({ stream });
  }
}
