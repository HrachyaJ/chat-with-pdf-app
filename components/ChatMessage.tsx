'use client'
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { BotIcon, Loader2Icon } from "lucide-react";
import Markdown from "react-markdown";
import { Message } from "./Chat";

function ChatMessage({message}: {message: Message}) {
  const isHuman = message.role === "human";
  const { user } = useUser();

  return (
    <div className={`flex w-full mb-4 ${isHuman ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[70%] ${isHuman ? "flex-row-reverse" : "flex-row"} items-start gap-3 mt-3`}>
        <br />
        {/* Avatar */}
        <div className="w-10 rounded-full">
          {isHuman ? (
            user?.imageUrl ? (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={user.imageUrl}
                  alt="User"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-300">
                <span className="text-indigo-700 font-semibold text-lg">
                  {user?.firstName?.[0]?.toUpperCase() || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )
          ) : (
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <BotIcon className="text-white h-5 w-5" />
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`px-3 py-2 rounded-2xl max-w-full ${
          isHuman 
            ? "bg-indigo-600 text-white" 
            : "bg-gray-100 text-white-800"
        }`}>
          {message.message === "Thinking..." ? (
            <div className="flex items-center gap-2">
              <Loader2Icon className="animate-spin h-3 w-3 text-gray-500" />
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          ) : (
            <div className={`prose prose-sm max-w-none ${
              isHuman 
                ? "prose-invert [&>*]:text-white [&_strong]:text-white [&_code]:text-blue-100 [&_code]:bg-blue-600/30" 
                : "prose-gray [&>*]:text-gray-800 [&_strong]:text-gray-900 [&_code]:text-blue-600 [&_code]:bg-blue-50"
            }`}>
              <Markdown 
                components={{
                  p: ({children}) => (
                    <div className="leading-relaxed">
                      {children}
                    </div>
                  ),
                  code: (props) => {
                    const {inline, className, children, ...rest} = props as {inline?: boolean, className?: string, children?: React.ReactNode};
                    if (inline) {
                      return (
                        <code 
                          className={`px-1 py-0.5 rounded text-xs ${
                            isHuman 
                              ? "bg-blue-600/30 text-blue-100" 
                              : "bg-blue-50 text-blue-600"
                          }`} 
                          {...rest}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={className} {...rest}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {String(message.message)}
              </Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;