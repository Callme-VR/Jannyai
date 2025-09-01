"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import { useClerk, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import ChatLabel from "./chatlabel";
import { SidebarProps } from "@/types";

export default function Sidebar({ expand, setExpand }: SidebarProps): React.JSX.Element {
  const { openSignIn } = useClerk();
  const { user, chats, createNewChat } = useAppContext();

  // track which chat has menu open
  const [openMenu, setOpenMenu] = useState<{ id: string | null; open: boolean }>({
    id: null,
    open: false,
  });

  return (
    <div
      className={`flex flex-col justify-between bg-[#212327] transition-all duration-300 z-50 
        max-md:absolute max-md:h-screen h-screen 
        ${expand ? "p-4 w-64" : "md:w-20 w-0 max-md:overflow-hidden px-2 py-4"}`}
    >
      {/* Header */}
      <div
        className={`flex ${expand ? "flex-row items-center gap-4" : "flex-col items-center gap-6"
          }`}
      >
        <Image
          className={expand ? "w-32 h-auto" : "w-8 h-8"}
          src={expand ? assets.logo_text : assets.logo_icon}
          alt="Logo"
        />
        <div
          onClick={() => setExpand(!expand)}
          className="group relative flex items-center justify-center hover:bg-gray-600/20 transition-all h-10 w-10 rounded-lg cursor-pointer"
        >
          <Image src={assets.menu_icon} alt="Menu" className="md:hidden w-5 h-5" />
          <Image
            src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
            alt="Toggle sidebar"
            className="md:block w-6 h-6 hidden"
          />
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t border-gray-700/50 my-4 ${expand ? "mx-0" : "mx-2"}`} />

      {/* New Chat */}
      <button
        onClick={createNewChat}
        className={`mt-2 flex items-center justify-center transition-all duration-200
        ${expand
            ? "bg-primary hover:bg-primary/90 rounded-xl gap-2 p-3 w-full text-white font-medium"
            : "group relative h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"
          }`}
      >
        <Image
          className={expand ? "w-5 h-5" : "w-6 h-6"}
          src={expand ? assets.chat_icon : assets.chat_icon_dull}
          alt="New chat"
        />
        {expand && <p className="text-sm">New chat</p>}
        {!expand && (
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
            New chat
          </div>
        )}
      </button>

      {/* Recents */}
      <div
        className={`mt-6 text-white/70 text-xs font-medium ${expand ? "block px-2" : "hidden"
          }`}
      >
        <p className="mb-2">Recents</p>
        <div className="space-y-2">
          {chats.map((chat, index) => (
            <ChatLabel
              key={chat._id}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              name={chat.name}
              chatId={chat._id}
            />
          ))}

          {/* Fallback example chats when no chats exist */}
          {chats.length === 0 && (
            <>
              <ChatLabel chatId="chat-1" openMenu={openMenu} setOpenMenu={setOpenMenu} />
              <ChatLabel chatId="chat-2" openMenu={openMenu} setOpenMenu={setOpenMenu} />
            </>
          )}
        </div>
      </div>

      {/* Footer (Scanner + Profile) */}
      <div className="mt-auto space-y-3">
        {/* QR Scanner / Get App */}
        <div
          className={`flex items-center cursor-pointer group relative transition-all duration-200 
          ${expand
              ? "gap-3 text-white/80 text-sm p-3 border border-primary/30 rounded-lg hover:bg-white/10"
              : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg justify-center"
            }`}
        >
          <Image
            className={expand ? "w-5 h-5" : "w-6 h-6"}
            src={expand ? assets.phone_icon : assets.phone_icon_dull}
            alt="Get mobile app"
          />
          {expand && <span className="text-sm">Get mobile app</span>}
          {!expand && (
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
              Get mobile app
            </div>
          )}

          {/* QR Popup */}
          <div
            className={`absolute -top-64 pb-6 ${!expand && "-right-44"
              } opacity-0 group-hover:opacity-100 hidden group-hover:block transition-all duration-300 z-50`}
          >
            <div className="relative w-max bg-gray-900 text-white text-sm p-4 rounded-xl shadow-xl border border-gray-700">
              <Image
                src={assets.qrcode}
                alt="QR Code"
                className="w-40 h-40 mb-2"
              />
              <p className="text-center text-xs text-gray-300">
                Scan to get jannyai app
              </p>
              <div
                className={`w-3 h-3 absolute bg-gray-900 rotate-45 ${expand
                  ? "left-1/2 -bottom-1.5 -translate-x-1/2"
                  : "left-6 -bottom-1.5"
                  }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Profile with Clerk */}
        <SignedIn>
          <div
            className={`flex items-center transition-all duration-200 cursor-pointer group
            ${expand
                ? "hover:bg-white/10 rounded-lg gap-3 p-2 text-white/70 text-sm"
                : "justify-center h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg relative"
              }`}
          >
            <UserButton afterSignOutUrl="/" />
            {expand && <span className="font-medium">My Account</span>}
            {!expand && (
              <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                My Account
              </div>
            )}
          </div>
        </SignedIn>

        <SignedOut>
          <div
            onClick={() => openSignIn()}
            className={`flex items-center transition-all duration-200 cursor-pointer group
            ${expand
                ? "hover:bg-white/10 rounded-lg gap-3 p-2 text-white/70 text-sm"
                : "justify-center h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg relative"
              }`}
          >
            <Image
              src={assets.profile_icon}
              alt="Profile"
              className="w-6 h-6"
            />
            {expand && <span className="font-medium">Sign In</span>}
            {!expand && (
              <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                Sign In
              </div>
            )}
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
