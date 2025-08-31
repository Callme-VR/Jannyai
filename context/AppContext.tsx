"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import toast from "react-hot-toast";

// Define proper interfaces for type safety
interface Chat {
  _id: string;
  name: string;
  messages: Message[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// Define the context value type
interface AppContextType {
  user: unknown; // You can replace 'unknown' with the actual User type from Clerk if available
  chats: Chat[];
  setChats: (chats: Chat[] | ((prev: Chat[]) => Chat[])) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null | ((prev: Chat | null) => Chat | null)) => void;
  fetchChats: () => Promise<void>;
  createNewChat: () => Promise<void>;
}

// Define the provider props type
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const createNewChat = async (): Promise<void> => {
    try {
      if (!user) return;
      const token = await getToken();

      const response = await axios.post(
        "/api/chat/create", 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        await fetchChats();
        toast.success("New chat created successfully");
      } else {
        toast.error(response.data.message || "Failed to create chat");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create chat";
      toast.error(errorMessage);
    }
  };

  const fetchChats = async (): Promise<void> => {
    try {
      if (!user) return;
      
      const token = await getToken();
      const { data } = await axios.get("/api/chat/get", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (data.success) {
        console.log(data.chats);
        const userChats: Chat[] = data.chats || [];
        setChats(userChats);

        if (userChats.length === 0) {
          await createNewChat();
          return;
        } else {
          // Sort chats by updatedAt (newest first)
          userChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          setSelectedChat(userChats[0]);
          console.log(userChats[0]);
        }
      } else {
        toast.error(data.message || "Failed to fetch chats");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch chats";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const value: AppContextType = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchChats,
    createNewChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};