import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";

interface ChatLabelProps {
  openMenu: { id: string | null; open: boolean };
  setOpenMenu: (openMenu: { id: string | null; open: boolean }) => void;
  chatId: string;
  name?: string;
}

export default function ChatLabel({ openMenu, setOpenMenu, chatId, name }: ChatLabelProps) {
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (openMenu.open && openMenu.id === chatId) {
      setOpenMenu({ id: null, open: false });
    } else {
      setOpenMenu({ id: chatId, open: true });
    }
  };


  const { fetchChats, chats, setSelectedChat } = useAppContext();
  
  const selectedChat = () => {
    const chatsData = chats.find(chat => chat._id === chatId);
    console.log(chatsData);
    if (chatsData) {
      setSelectedChat(chatsData);
    }
  };
  const renameChat = async () => {
    try {
      const newName = prompt("Enter new Name");
      if (!newName) return;
      const { data } = await axios.post("/api/chat/rename", { chatId: chatId, name: newName });
      if (data.success) {
        fetchChats();
        setOpenMenu({ id: null, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to rename chat");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const deleteChat = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this chat?");
      if (!confirm) return;
      const { data } = await axios.post("/api/chat/delete", { chatId: chatId });
      if (data.success) {
        fetchChats();
        setOpenMenu({ id: null, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to delete chat");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };









  return (
    <div onClick={selectedChat} className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer relative">
      <p className="truncate group-hover:max-w-5/6">{name || "Chat Name here!"}</p>

      {/* Dots button */}
      <div
        onClick={toggleMenu}
        className="flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg"
      >
        <Image src={assets.three_dots} alt="" className={`w-4 ${openMenu.open && openMenu.id === chatId ? "hidden" : "group-hover:block"}`} />
      </div>

      {/* Dropdown Menu */}
      {openMenu.open && openMenu.id === chatId && (
        <div onClick={renameChat} 
        className="absolute right-0 top-8 w-40 rounded-xl bg-gray-700 p-2 shadow-lg z-50">
          <div onClick={renameChat} className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer">
            <Image src={assets.pencil_icon} alt="rename" className="w-4" />
            <p>Rename</p>
          </div>
          <div onClick={deleteChat} className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer">
            <Image src={assets.delete_icon} alt="delete" className="w-4" />
            <p>Delete</p>
          </div>
        </div>
      )}
    </div>
  );
}
