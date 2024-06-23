import { systemPrompt } from "@/app/api/chat/prompt";
import { anthropic } from "@ai-sdk/anthropic";
import { CoreMessage, streamText } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    system: systemPrompt,
    messages,
  });
  return result.toAIStreamResponse();
}
