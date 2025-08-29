"use client";
import Image from "next/image"
import { assets } from "../assets/assets.js"
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import PromptBox from "@/components/promptbox";
export default function Home() {

  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isloading, setIsLoading] = useState(false);





  return (
    <div>
      <div className="flex h-screen">
        {/* sidebar */}
        <Sidebar expand={expand} setExpand={setExpand} />
        <div className="flex flex-col items-center justify-center px-6 py-8 bg-[#292a2d] text-white relative min-h-screen">
          <div className="md:hidden absolute top-6 left-0 right-0 px-6 flex items-center justify-between">
            <Image 
              onClick={() => (expand ? setExpand(false) : setExpand(true))} 
              className="rotate-180 cursor-pointer hover:opacity-80 transition-opacity" 
              src={assets.menu_icon} 
              alt="Menu" 
            />
            <Image className="opacity-70" src={assets.chat_icon} alt="Chat" />
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
            {
              messages.length === 0 ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <Image src={assets.logo_icon} alt="Logo" className="h-16 w-16" />
                    <p className="text-3xl font-medium text-center">Hi, I'm Sharky</p>
                  </div>
                  <p className="text-base text-center text-gray-300 leading-relaxed px-4">
                    How can I help you today?
                  </p>
                </>
              ) : (
                <div className="w-full">
                </div>
              )
            }
          </div>
          <PromptBox  isLoading={isloading} setIsLoading={setIsLoading}/>
          <div className="absolute bottom-6 left-0 right-0 px-6">
            <p className="text-xs text-center text-gray-400 leading-relaxed">
              AI-Generated, For Reference Only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
