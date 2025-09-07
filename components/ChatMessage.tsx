"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Loader2Icon, Sparkles, User } from "lucide-react";
import Markdown from "react-markdown";
import { Message } from "./Chat";

function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.role === "human";
  const { user } = useUser();

  return (
    <div
      className={`flex w-full mb-6 ${
        isHuman ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[85%] md:max-w-[75%] ${
          isHuman ? "flex-row-reverse" : "flex-row"
        } items-start gap-3`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isHuman ? (
            <div className="relative group">
              {user?.imageUrl ? (
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-purple-200 group-hover:ring-purple-300 transition-all duration-200">
                  <Image
                    src={user.imageUrl}
                    alt="User"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center ring-2 ring-purple-200 group-hover:ring-purple-300 transition-all duration-200 shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ) : (
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-200">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm ${
            isHuman
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/20"
              : "bg-white border border-gray-200 text-gray-800 shadow-gray-200/50"
          }`}
        >
          {/* Gradient overlay for AI messages */}
          {!isHuman && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          )}

          <div className="relative z-10">
            {message.message === "Thinking..." ? (
              <div className="flex items-center gap-3 py-1">
                <div className="relative">
                  <Loader2Icon className="animate-spin h-4 w-4 text-purple-500" />
                  <div className="absolute inset-0 bg-purple-500 rounded-full blur-sm opacity-30 animate-pulse"></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  AI is thinking...
                </span>
              </div>
            ) : (
              <div
                className={`prose prose-sm max-w-none ${
                  isHuman
                    ? "prose-invert [&>*]:text-white [&_p]:text-white [&_strong]:text-white [&_code]:text-purple-100 [&_code]:bg-white/20 [&_code]:rounded"
                    : "prose-gray [&>*]:text-gray-800 [&_p]:text-gray-800 [&_strong]:text-gray-900 [&_code]:text-indigo-600 [&_code]:bg-indigo-50 [&_code]:rounded [&_ul]:text-gray-800 [&_li]:text-gray-800"
                }`}
              >
                <Markdown
                  components={{
                    p: ({ children }) => (
                      <div className="leading-relaxed mb-2 last:mb-0">
                        {children}
                      </div>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-4 space-y-1 my-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-4 space-y-1 my-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    code: (props) => {
                      const { inline, children, ...rest } = props as {
                        inline?: boolean;
                        children?: React.ReactNode;
                      };
                      if (inline) {
                        return (
                          <code
                            className={`px-1.5 py-0.5 text-xs font-medium ${
                              isHuman
                                ? "bg-white/20 text-purple-100 rounded"
                                : "bg-indigo-50 text-indigo-600 rounded border"
                            }`}
                            {...rest}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code
                          className={`block p-3 rounded-lg text-sm ${
                            isHuman
                              ? "bg-white/10 text-purple-100"
                              : "bg-gray-100 text-gray-800 border"
                          }`}
                          {...rest}
                        >
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote
                        className={`border-l-4 pl-4 py-2 my-2 italic ${
                          isHuman
                            ? "border-white/30 text-white/90"
                            : "border-purple-300 text-gray-700 bg-purple-50/50"
                        }`}
                      >
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {String(message.message)}
                </Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
