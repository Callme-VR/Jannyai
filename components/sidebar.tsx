"use client"
import { assets } from "@/assets/assets";
import Image from "next/image";

interface SidebarProps {
    expand: boolean;
    setExpand: (expand: boolean) => void;
}

export default function Sidebar({ expand, setExpand }: SidebarProps) {
    return (
        <div className={`flex flex-col justify-between bg-[#212327] transition-all duration-300 z-50 max-md:absolute max-md:h-screen h-screen ${expand ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-hidden px-2 py-4'}`}>
            <div className={`flex ${expand ? 'flex-row items-center gap-4' : 'flex-col items-center gap-6'}`}>
                <Image className={expand ? "w-32 h-auto" : "w-8 h-8"} src={expand ? assets.logo_text : assets.logo_icon} alt="DeepSeek Logo" />
                <div onClick={() => expand ? setExpand(false) : setExpand(true)} className="group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-10 w-10 rounded-lg cursor-pointer">
                    <Image src={assets.menu_icon} alt="" className="md:hidden" />
                    <Image src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} alt="Toggle sidebar" className="md:block w-6 h-6 hidden" />
                    <div className={`absolute w-max ${expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-1/2 -translate-x-1/2"} opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg pointer-events-none z-50`}>
                        {
                            expand ? 'Close sidebar' : 'Open sidebar'
                        }
                        <div className={`w-2 h-2 absolute bg-gray-900 rotate-45 ${expand ? "left-1/2 -top-1 -translate-x-1/2" : 'left-1/2 -bottom-1 -translate-x-1/2'}`}>
                        </div>
                    </div>
                </div>
            </div>
            <button className={`mt-6 flex items-center justify-center cursor-pointer transition-all duration-200 ${expand ? "bg-primary hover:bg-primary/90 rounded-xl gap-2 p-3 w-full" : "group relative h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"}`}>
                <Image className={expand ? "w-5 h-5" : "w-6 h-6"} src={expand ? assets.chat_icon : assets.chat_icon_dull} alt="New chat" />
                {!expand && (
                    <div className="absolute w-max -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg pointer-events-none z-50">
                        New chat
                        <div className="w-2 h-2 absolute bg-gray-900 rotate-45 left-1/2 -bottom-1 -translate-x-1/2">
                        </div>
                    </div>
                )}
                {
                    expand && <p className="text-white text-sm font-medium">New chat</p>
                }
            </button>
            <div className={`mt-6 text-white/60 text-xs font-medium ${expand ? "block px-2" : "hidden"}`}>
                <p className="mb-2">
                    Recents
                </p>
            </div>

            <div className="mt-auto space-y-2">
                <div className={`flex items-center cursor-pointer group relative transition-all duration-200 ${expand ? "gap-3 text-white/80 text-sm p-3 border border-primary/30 rounded-lg hover:bg-white/10 hover:border-primary/50" : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg justify-center"}`}>
                    <Image className={expand ? "w-5 h-5" : "w-6 h-6"} src={expand ? assets.phone_icon : assets.phone_icon_dull} alt="Get mobile app" />
                    <div className={`absolute -top-64 pb-6 ${!expand && "-right-44"} opacity-0 group-hover:opacity-100 hidden group-hover:block transition-all duration-300 z-50`}>
                        <div className='relative w-max bg-gray-900 text-white text-sm p-4 rounded-xl shadow-xl border border-gray-700'>
                            <Image src={assets.qrcode} alt="QR Code for mobile app" className="w-40 h-40 mb-2" />
                            <p className="text-center text-xs text-gray-300">Scan to get PortAi app</p>
                            <div className={`w-3 h-3 absolute bg-gray-900 rotate-45 ${expand ? "left-1/2 -bottom-1.5 -translate-x-1/2" : "left-6 -bottom-1.5"}`}>
                            </div>
                        </div>
                        {
                            expand &&
                            <div className="flex items-center gap-2 mt-3 text-primary font-medium text-sm">
                                <span>Get App</span>
                                <Image src={assets.new_icon} alt="New" className="w-4 h-4" />
                            </div>}
                        <div className={`flex items-center transition-all duration-200 ${expand ? 'hover:bg-white/10 rounded-lg gap-3 p-2' : 'justify-center w-full'} text-white/60 text-sm mt-3 cursor-pointer`}>
                            <Image src={assets.profile_icon} alt="User profile" className="w-6 h-6" />
                            {expand &&
                                <span className="font-medium">My Profile</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
