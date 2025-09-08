"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon, Send, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useUser } from "@clerk/nextjs";
import { askQuestion } from "@/actions/askQuestion";
import { useToast } from "@/components/ui/use-toast";
import { getChatMessages } from "@/actions/getChatMessages";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string | number;
  createdAt: Date;
};

// Define types for Supabase data
type DatabaseMessage = {
  id: string;
  role: "human" | "ai";
  message: string | number;
  created_at: string;
};

type PostgrestError = {
  message: string;
  details: string;
  hint: string;
  code: string;
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [snapshot, setSnapshot] = useState<DatabaseMessage[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setError] = useState<PostgrestError | null>(null);
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { success, data, message } = await getChatMessages(id);
      if (!success) {
        setError({ message: message || "Failed to fetch messages", details: "", hint: "", code: "" });
        setSnapshot([]);
      } else {
        setSnapshot(data as DatabaseMessage[]);
      }
      setLoading(false);
    };

    if (user?.id && id) {
      fetchMessages();
    }
  }, [user?.id, id]);

  useEffect(() => {
    if (!snapshot) return;

    console.log("Updated snapshot", snapshot);

    // Check if the last message in current messages is "Thinking..."
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "ai" && lastMessage.message === "Thinking...") {
      return;
    }

    const newMessages = snapshot.map((msg: DatabaseMessage) => {
      const { id, role, message, created_at } = msg;

      return {
        id,
        role,
        message,
        createdAt: created_at ? new Date(created_at) : new Date(),
      };
    });

    setMessages(newMessages);
  }, [snapshot]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const q = input;
    setInput("");

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: q,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);

    startTransition(async () => {
      const { success, message, aiResponse } = await askQuestion(id, q);

      if (!success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });

        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: `Whoops... ${message}`,
              createdAt: new Date(),
            },
          ])
        );
      } else {
        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: aiResponse || "Response generated successfully",
              createdAt: new Date(),
            },
          ])
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-2 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-[18px]">
              AI Assistant
            </h3>
            <p className="text-white/80 text-[14px]">
              Ready to help with your document
            </p>
          </div>
        </div>
      </div>

      {/* Chat content */}
      <div className="flex-1 w-full overflow-y-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative">
              <div className="h-20 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-ping"></div>
            </div>
            <p className="text-gray-600 mt-4 font-medium">
              Loading your conversations...
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="pb-12">
                <ChatMessage
                  key={"placeholder"}
                  message={{
                    role: "ai",
                    message:
                      "👋 Hello! I'm your AI assistant. Ask me anything about your document and I'll help you find the information you need instantly!",
                    createdAt: new Date(),
                  }}
                />
              </div>
            )}

            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </div>
        )}

        <div ref={bottomOfChatRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="p-4 max-w-4xl mx-auto">
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="Ask me anything about your document..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pr-12 bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl shadow-sm text-gray-800 placeholder-gray-500"
                disabled={isPending}
              />
              {input && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={!input || isPending}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin h-4 w-4" />
                  <span>Thinking...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Ask</span>
                </div>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              AI-powered responses
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></div>
              Instant document analysis
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
              Context-aware answers
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
