"use client";

import { useEffect, useState } from "react";
import { Code, PaperPlaneRight, Spinner } from "@phosphor-icons/react";
import { useChat } from "ai/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Markdown from "@/components/markdown/markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Message = {
  role: string;
  content: string;
  id: string;
};

const Artifact = ({
  title,
  loading = true,
}: {
  title: string;
  loading?: boolean;
}) => (
  <Card className="w-full max-w-sm bg-background border border-border ml-5">
    <CardContent className="flex items-center gap-3 p-3">
      <div className="bg-muted rounded-md p-2">
        {loading ? (
          <Spinner className="h-5 w-5 text-foreground animate-spin" />
        ) : (
          <Code className="h-5 w-5 text-foreground" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">
          {loading ? "Generating..." : "Click to open component"}
        </p>
      </div>
    </CardContent>
  </Card>
);

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
  setIsCodeLoading,
}: {
  setArtifactContent: (content: string) => void;
  setIsCodeLoading: (loading: boolean) => void;
}) {
  const { messages, input, setInput, append, isLoading } = useChat();
  const [parsedMessages, setParsedMessages] = useState<Message[]>([]);
  const [currentArtifact, setCurrentArtifact] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]!;
      parseMessage(lastMessage);
    }
  }, [messages]);

  const parseMessage = (message: Message) => {
    let content = message.content;

    // Check for thinking tags
    if (content.includes("<antthinking>")) {
      setIsThinking(true);
      setCurrentArtifact("");
    }
    if (content.includes("</antthinking>")) {
      setIsThinking(false);
    }

    // Remove thinking tags and their content
    content = content.replace(/<antthinking>.*?<\/antthinking>/gs, "");

    // Handle artifact tags
    const artifactStartIndex = content.indexOf("<antartifact");
    const artifactEndIndex = content.indexOf("</antartifact>");

    if (artifactStartIndex !== -1) {
      if (artifactEndIndex !== -1) {
        // Complete artifact
        const artifactContent = content.slice(
          content.indexOf(">", artifactStartIndex) + 1,
          artifactEndIndex
        );
        setArtifactContent(artifactContent);
        setIsCodeLoading(false);
        setCurrentArtifact(null);
        content =
          content.slice(0, artifactStartIndex) +
          content.slice(artifactEndIndex + "</antartifact>".length);
      } else {
        setCurrentArtifact(content.slice(artifactStartIndex));
        setIsCodeLoading(true);
        content = content.slice(0, artifactStartIndex);
      }
    } else if (currentArtifact) {
      if (artifactEndIndex !== -1) {
        // End of artifact
        const fullArtifact =
          currentArtifact + content.slice(0, artifactEndIndex);
        const artifactContent = fullArtifact.slice(
          fullArtifact.indexOf(">") + 1
        );
        setArtifactContent(artifactContent);
        setCurrentArtifact(null);
        content = content.slice(artifactEndIndex + "</antartifact>".length);
      } else {
        // Continuing artifact
        setCurrentArtifact(currentArtifact + content);
        content = "";
      }
    }

    // Update parsed messages if there's content
    if (content.trim() && !isThinking) {
      setParsedMessages((prevMessages) => {
        const existingIndex = prevMessages.findIndex(
          (m) => m.id === message.id
        );
        if (existingIndex !== -1) {
          const updatedMessages = [...prevMessages];
          updatedMessages[existingIndex] = {
            ...message,
            content: content.trim(),
          };
          return updatedMessages;
        } else {
          return [...prevMessages, { ...message, content: content.trim() }];
        }
      });
    }
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
          <div className="ml-5">
            {currentArtifact && (
              <Artifact title="Loading Artifact..." loading={true} />
            )}
            {isLoading && !currentArtifact && (
              <Spinner className="size-5 animate-spin" />
            )}
          </div>
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
