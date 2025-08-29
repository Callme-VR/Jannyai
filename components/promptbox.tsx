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
    <form className={`w-full ${false ? 'max-w-3xl' : 'max-w-2xl'} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
      <textarea className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message janny" required
        onChange={(e) => setPrompt(e.target.value)} value={prompt}
      />

      <div className="flex items-center text-sm justify-between">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.deepthink_icon} alt="" />
            DeepThink(R3)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.search_icon} alt="" />
            Search
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
          <button className={`${prompt ? 'bg-primary' : 'bg-[#71717a]'} rounded-full p-3 cursor-pointer`}>
            <Image className="w-4 cursor-pointer" src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt="" />
          </button>
        </div>
      </div>
    </form>
  )
};