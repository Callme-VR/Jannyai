"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useState, Dispatch, SetStateAction } from "react";

interface PromptBoxProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function PromptBox({ isLoading, setIsLoading }: PromptBoxProps) {
  const [prompt, setPrompt] = useState('');

  return (
    <form className="w-full bg-[#404045] p-4 rounded-2xl transition-all shadow-md">
      <textarea
        className="outline-none w-full resize-none overflow-hidden bg-transparent text-white placeholder-gray-400 text-sm"
        rows={2}
        placeholder="Message Sharky..."
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />

      <div className="flex items-center justify-between mt-3">
        {/* Left Options */}
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-1.5 text-xs border border-gray-400 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.deepthink_icon} alt="" className="w-3 h-3" />
            DeepThink(R3)
          </p>
          <p className="flex items-center gap-1.5 text-xs border border-gray-400 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.search_icon} alt="" className="w-3 h-3" />
            Search
          </p>
        </div>

        {/* Right Options */}
        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer opacity-80 hover:opacity-100" src={assets.pin_icon} alt="" />
          <button
            type="submit"
            disabled={!prompt}
            className={`${prompt ? 'bg-primary hover:bg-primary/90' : 'bg-gray-500'} rounded-full p-3 transition`}
          >
            <Image
              className="w-4"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt="Send"
            />
          </button>
        </div>
      </div>
    </form>
  );
}
