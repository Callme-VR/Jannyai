"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  Chat, 
  Message, 
  AppContextType, 
  AppContextProviderProps,
  ChatApiResponse 
} from "@/types";
import { logger, handleNetworkError } from "@/utils/errorHandling";

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
      if (!user) {
        logger.warn('Create chat attempted without authenticated user');
        return;
      }
      
      const token = await getToken();
      logger.info('Creating new chat', undefined, user.id);

      const response = await axios.post(
        "/api/chat/create", 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        await fetchChats();
        toast.success("New chat created successfully");
        logger.info('New chat created successfully', undefined, user.id);
      } else {
        const errorMessage = response.data.message || "Failed to create chat";
        toast.error(errorMessage);
        logger.error('Failed to create chat', new Error(errorMessage), undefined, user.id);
      }
    } catch (error) {
      const errorMessage = handleNetworkError(error);
      toast.error(errorMessage);
      logger.error('Create chat request failed', error instanceof Error ? error : new Error(String(error)), undefined, user?.id);
    }
  };

  const fetchChats = async (): Promise<void> => {
    try {
      if (!user) {
        logger.warn('Fetch chats attempted without authenticated user');
        return;
      }
      const token = await getToken();
      logger.info('Fetching chats', undefined, user.id);
      
      const { data }: { data: ChatApiResponse } = await axios.get("/api/chat/get", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (data.success) {
        logger.debug('Chats fetched successfully', { chatCount: data.chats?.length }, user.id);
        const userChats: Chat[] = data.chats || [];
        setChats(userChats);

        if (userChats.length === 0) {
          logger.info('No chats found, creating new chat', undefined, user.id);
          await createNewChat();
          return;
        } else {
          // Sort chats by updatedAt (newest first)
          userChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          const selectedChatToSet = userChats[0];
          if (selectedChatToSet) {
            setSelectedChat(selectedChatToSet);
            logger.debug('Selected most recent chat', { selectedChatId: selectedChatToSet._id }, user.id);
          }
        }
      } else {
        const errorMessage = data.message || "Failed to fetch chats";
        toast.error(errorMessage);
        logger.error('Failed to fetch chats', new Error(errorMessage), undefined, user.id);
      }
    } catch (error) {
      const errorMessage = handleNetworkError(error);
      toast.error(errorMessage);
      logger.error('Fetch chats request failed', error instanceof Error ? error : new Error(String(error)), undefined, user?.id);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const value: AppContextType = {
    user: user as any, // Type assertion to handle Clerk's UserResource type
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchChats,
    createNewChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};