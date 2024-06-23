"use client";

import { useEffect, useState } from "react";
import { PaperPlaneRight, Spinner } from "@phosphor-icons/react";
import { useChat } from "ai/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Markdown from "@/components/markdown/markdown";

type Message = {
  role: string;
  content: string;
  id: string;
};

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 border">
          <AvatarImage src="/placeholder-ai.jpg" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        } max-w-[70%] rounded-lg px-4 py-3`}
      >
        <Markdown text={message.content} />
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 border">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export function ClientChat({
  setArtifactContent,
}: {
  setArtifactContent: (content: string) => void;
}) {
  const { messages, input, setInput, append, isLoading } = useChat();
  const [parsedMessages, setParsedMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]!;
      parseMessage(lastMessage);
    }
  }, [messages]);

  const parseMessage = (message: Message) => {
    const content = message.content;

    // Remove thinking tags
    const withoutThinking = content.replace(
      /<antthinking>.*?<\/antthinking>/gs,
      ""
    );

    // Extract artifact content and set it
    const artifactRegex = /<antartifact.*?>([\s\S]*?)<\/antartifact>/g;
    const artifactMatch = artifactRegex.exec(withoutThinking);

    if (artifactMatch) {
      setArtifactContent(artifactMatch[1] || "");
    }

    // Replace artifacts with placeholder
    const withArtifactPlaceholder = withoutThinking.replace(
      /<antartifact.*?<\/antartifact>/gs,
      "[Artifact]"
    );

    setParsedMessages((prevMessages) => [
      ...prevMessages.filter((m) => m.id !== message.id),
      { ...message, content: withArtifactPlaceholder },
    ]);
  };

  const handleSend = () => {
    if (input.trim()) {
      append({ content: input, role: "user" });
      setInput("");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          {parsedMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && <Spinner className="size-5 animate-spin" />}
        </div>
      </div>
      <div className="bg-background flex items-center gap-2 border-t px-4 py-3">
        <Input
          placeholder="Type your message..."
          className="flex-1 rounded-lg pr-12"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleSend}
        >
          <PaperPlaneRight className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
