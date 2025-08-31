"use client";
import Image from "next/image";
import { assets } from "../assets/assets.js";
import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/sidebar";
import PromptBox from "@/components/promptbox";
import Messages from "@/components/message";
import { useAppContext } from "@/context/AppContext";

// Define interfaces for type safety
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export default function Home() {
  const [expand, setExpand] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedChat } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);

  // Update messages when selectedChat changes
  useEffect(() => {
    if (selectedChat && selectedChat.messages) {
      setMessages(selectedChat.messages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);



  return (
    <div>
      <div className="flex h-screen bg-[#292a2d] text-white">
        {/* Sidebar */}
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex flex-col items-center justify-between px-6 py-8 relative min-h-screen w-full">
          {/* Top Bar (Mobile) */}
          <div className="md:hidden absolute top-6 left-0 right-0 px-6 flex items-center justify-between">
            <Image
              onClick={() => setExpand(!expand)}
              className="cursor-pointer hover:opacity-80 transition-opacity w-6 h-6"
              src={assets.menu_icon}
              alt="Menu"
            />
            <Image className="opacity-80 w-6 h-6" src={assets.chat_icon} alt="Chat" />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 max-w-md mx-auto text-center">
            {messages.length === 0 ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <Image src={assets.logo_icon} alt="Logo" className="h-16 w-16" />
                  <p className="text-3xl font-semibold">Hi, I'm Sharky</p>
                </div>
                <p className="text-base text-gray-300 leading-relaxed px-4">
                  How can I help you today?
                </p>
              </>
            ) : (
              <div ref={containerRef} className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-auto">
                <p className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">
                  {selectedChat?.name || "Chat"}
                </p>
                {messages.map((msg: Message, index: number) => (
                  <Messages key={index} role={msg.role} content={msg.content} />
                ))}
                {isLoading && (
                  <div className="flex gap-4 max-w-3xl w-full py-3">
                    <Image 
                      src={assets.logo_icon} 
                      alt="logo" 
                      className="h-9 w-9 p-1 border border-white/15 rounded-full"
                    />
                    <div className="loader flex justify-center items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prompt Box */}
          <div className="w-full max-w-2xl">
            <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-0 right-0 px-6">
            <p className="text-xs text-center text-gray-400">
              AI-Generated For Reference Only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
