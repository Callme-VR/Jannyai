"use client";
import Image from "next/image"
import { assets } from "../assets/assets.js"
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import PromptBox from "@/components/promptbox";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
              <div className="w-full"></div>
            )}
          </div>

          {/* Prompt Box */}
          <div className="w-full max-w-2xl">
            <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-0 right-0 px-6">
            <p className="text-xs text-center text-gray-400">
              AI-Generated, For Reference Only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
