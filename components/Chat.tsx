'use client';

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useUser } from "@clerk/nextjs";
import { createBrowserClient } from '@supabase/ssr';
import { askQuestion } from "@/actions/askQuestion";
import { useToast } from "@/components/ui/use-toast"
// import { ChatMessage } from "@langchain/core/messages";

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
  const { toast } = useToast()
  // const supabase = createClientComponentClient();
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
  }, [messages])

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .eq('file_id', id)
        .order('created_at', { ascending: true });

      setSnapshot(data);
      setError(error);
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
      })
      
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
      // 🔥 CRITICAL: Handle success case - replace "Thinking..." with actual response
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
    <div className="flex flex-col h-full overflow-scroll">
      {/* Chat content */}
      <div className="flex-1 w-full">
                
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
          </div>
        ): (
          <div>
            {messages.length === 0 && (
              <ChatMessage
                key={"placeholder"}
                message={{
                  role: "ai",
                  message: "Ask me anything about the document!",
                  createdAt: new Date(),
                }}
              />
            )}
        </div>
        )}

        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        <div ref={bottomOfChatRef}/>
      </div>

      <form
        onSubmit={handleSubmit}  
        className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75"    
      >
        <Input
          placeholder="Ask a Question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white"
        />

        <Button className="cursor-pointer" type="submit" disabled={!input || isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin text-indigo-600" />
          ) : (
            "Ask"
          )}
        </Button>
      </form>
    </div>
  );
}

export default Chat;