"use client";
import React, { useState, Dispatch, SetStateAction, FormEvent } from "react";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { Message, Chat, PromptBoxProps, ChatApiResponse } from "@/types";

export default function PromptBox({ isLoading, setIsLoading }: PromptBoxProps): React.JSX.Element {
  const [prompt, setPrompt] = useState('');

  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
  } = useAppContext();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e as any);
    }
  }
  const sendPrompt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const promptCopy = prompt;
    try {
      if (!user) {
        toast.error("Please login to send prompt");
        return;
      }
      if (isLoading) {
        toast.error("Wait for response");
        return;
      }

      if (!selectedChat) {
        toast.error("Please select a chat");
        return;
      }

      if (!prompt.trim()) {
        toast.error("Please enter a message");
        return;
      }

      setIsLoading(true);
      setPrompt('');

      const userMessage: Message = {
        role: "user",
        content: prompt.trim(),
        timestamp: Date.now(),
      };

      // Update selected chat with user message
      if (selectedChat) {
        const updatedChat: Chat = {
          ...selectedChat,
          messages: [...selectedChat.messages, userMessage]
        };
        setSelectedChat(updatedChat);

        // Update chats array with user message
        setChats((prevChats: Chat[]) =>
          prevChats.map((chat: Chat) =>
            chat._id === selectedChat._id
              ? updatedChat
              : chat
          )
        );
      }

      // Send message to AI API
      const { data }: { data: ChatApiResponse } = await axios.post("/api/chat/ai", {
        chatId: selectedChat._id,
        message: prompt.trim(),
        conversationHistory: selectedChat.messages
      });

      if (data.success && data.aiResponse) {
        const aiMessage: Message = {
          role: "assistant",
          content: data.aiResponse,
          timestamp: Date.now(),
        };

        // Update selected chat with AI response
        if (selectedChat) {
          const updatedChatWithAI: Chat = {
            ...selectedChat,
            messages: [...selectedChat.messages, userMessage, aiMessage]
          };
          setSelectedChat(updatedChatWithAI);

          // Update chats array with AI response
          setChats((prevChats: Chat[]) =>
            prevChats.map((chat: Chat) =>
              chat._id === selectedChat._id
                ? updatedChatWithAI
                : chat
            )
          );
        }

        toast.success("Response received");
      } else {
        toast.error(data.message || "Failed to get AI response");
        setPrompt(promptCopy);

        // Remove the user message if AI failed
        if (selectedChat) {
          const revertedChat: Chat = {
            ...selectedChat,
            messages: selectedChat.messages.slice(0, -1)
          };
          setSelectedChat(revertedChat);

          setChats((prevChats: Chat[]) =>
            prevChats.map((chat: Chat) =>
              chat._id === selectedChat._id
                ? revertedChat
                : chat
            )
          );
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      toast.error(errorMessage);
      setPrompt(promptCopy);

      // Remove the user message if request failed
      if (selectedChat) {
        const revertedChat: Chat = {
          ...selectedChat,
          messages: selectedChat.messages.slice(0, -1)
        };
        setSelectedChat(revertedChat);

        setChats((prevChats: Chat[]) =>
          prevChats.map((chat: Chat) =>
            chat._id === selectedChat._id
              ? revertedChat
              : chat
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="w-full bg-[#404045] p-4 rounded-2xl transition-all shadow-md"
      onSubmit={sendPrompt}
      role="form"
      aria-label="Send message to AI"
    >
      <label htmlFor="message-input" className="sr-only">
        Type your message to Sharky
      </label>
      <textarea
        id="message-input"
        className="outline-none w-full resize-none overflow-hidden bg-transparent text-white placeholder-gray-400 text-sm"
        rows={2}
        placeholder="Message Sharky..."
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        disabled={isLoading}
        onKeyDown={handleKeyDown}
        aria-describedby="message-help"
      />
      <div id="message-help" className="sr-only">
        Press Enter to send, Shift+Enter for new line
      </div>

      <div className="flex items-center justify-between mt-3">
        {/* Left Options */}
        <div className="flex items-center gap-2" role="group" aria-label="Message options">
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs border border-gray-400 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition"
            aria-label="Enable DeepThink mode"
          >
            <Image src={assets.deepthink_icon} alt="" className="w-3 h-3" />
            DeepThink(R3)
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs border border-gray-400 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition"
            aria-label="Enable search mode"
          >
            <Image src={assets.search_icon} alt="" className="w-3 h-3" />
            Search
          </button>
        </div>

        {/* Right Options */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Pin message"
          >
            <Image
              className="w-4"
              src={assets.pin_icon}
              alt=""
            />
          </button>
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`${prompt.trim() && !isLoading
              ? 'bg-primary hover:bg-primary/90'
              : 'bg-gray-500'
              } rounded-full p-3 transition`}
            aria-label={isLoading ? 'Sending message...' : 'Send message'}
          >
            <Image
              className="w-4"
              src={prompt.trim() && !isLoading ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  );
}
