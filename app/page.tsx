"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "../assets/assets.js";
import Sidebar from "@/components/sidebar";
import PromptBox from "@/components/promptbox";
import Messages from "@/components/message";
import { useAppContext } from "@/context/AppContext";
import { Message } from "@/types";

export default function Home(): React.JSX.Element {
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
    <div className="flex h-screen bg-[#292a2d] text-white">
      {/* Sidebar Navigation */}
      <aside role="navigation" aria-label="Chat navigation">
        <Sidebar expand={expand} setExpand={setExpand} />
      </aside>

      <main className="flex flex-col items-center justify-between px-6 py-8 relative min-h-screen w-full" role="main">
        {/* Top Bar (Mobile) */}
        <header className="md:hidden absolute top-6 left-0 right-0 px-6 flex items-center justify-between">
          <button
            onClick={() => setExpand(!expand)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Toggle sidebar"
            type="button"
          >
            <Image
              className="w-6 h-6"
              src={assets.menu_icon}
              alt=""
            />
          </button>
          <Image className="opacity-80 w-6 h-6" src={assets.chat_icon} alt="Chat icon" />
        </header>

        {/* Main Content */}
        <section className="flex-1 flex flex-col items-center justify-center space-y-6 max-w-md mx-auto text-center">
          {messages.length === 0 ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <Image src={assets.logo_icon} alt="Sharky AI Logo" className="h-16 w-16" />
                <h1 className="text-3xl font-semibold">Hi, I'm Sharky</h1>
              </div>
              <p className="text-base text-gray-300 leading-relaxed px-4">
                How can I help you today?
              </p>
            </>
          ) : (
            <div 
              ref={containerRef} 
              className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-auto"
              role="log"
              aria-label="Chat messages"
              aria-live="polite"
            >
              <h2 className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">
                {selectedChat?.name || "Chat"}
              </h2>
              {messages.map((msg: Message, index: number) => (
                <Messages key={`${msg.timestamp}-${index}`} role={msg.role} content={msg.content} />
              ))}
              {isLoading && (
                <div className="flex gap-4 max-w-3xl w-full py-3" aria-label="AI is typing">
                  <Image 
                    src={assets.logo_icon} 
                    alt="AI assistant avatar" 
                    className="h-9 w-9 p-1 border border-white/15 rounded-full"
                  />
                  <div className="loader flex justify-center items-center gap-2" role="status">
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <span className="sr-only">AI is typing...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Prompt Box */}
        <section className="w-full max-w-2xl" aria-label="Message input">
          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
        </section>

        {/* Footer */}
        <footer className="absolute bottom-4 left-0 right-0 px-6">
          <p className="text-xs text-center text-gray-400" role="contentinfo">
            AI-Generated For Reference Only
          </p>
        </footer>
      </main>
    </div>
  );
}
