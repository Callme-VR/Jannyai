// Shared type definitions for the application

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Chat {
  _id: string;
  name: string;
  messages: Message[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  emailAddresses?: Array<{
    emailAddress: string;
  }>;
  firstName?: string;
  lastName?: string;
  username?: string;
  imageUrl?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface ChatApiResponse extends ApiResponse {
  chats?: Chat[];
  chat?: Chat;
  aiResponse?: string;
}

export interface SidebarProps {
  expand: boolean;
  setExpand: (expand: boolean) => void;
}

export interface PromptBoxProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MessagesProps {
  role: "user" | "assistant";
  content: string;
}

export interface ChatLabelProps {
  openMenu: { id: string | null; open: boolean };
  setOpenMenu: (openMenu: { id: string | null; open: boolean }) => void;
  chatId: string;
  name?: string;
}

export interface AppContextType {
  user: User | null;
  chats: Chat[];
  setChats: (chats: Chat[] | ((prev: Chat[]) => Chat[])) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null | ((prev: Chat | null) => Chat | null)) => void;
  fetchChats: () => Promise<void>;
  createNewChat: () => Promise<void>;
}

export interface AppContextProviderProps {
  children: React.ReactNode;
}

// Environment variables type
export interface EnvironmentVariables {
  MONGODB_URI: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  CLERK_WEBHOOK_SECRET: string;
  GOOGLE_GENAI_API_KEY: string;
}

// Database connection types
export interface MongooseCache {
  conn: typeof import('mongoose') | null;
  promise: Promise<typeof import('mongoose')> | null;
}

// API Request types
export interface ChatCreateRequest {
  userId: string;
  messages: Message[];
  name: string;
}

export interface ChatMessageRequest {
  chatId: string;
  message: string;
  conversationHistory: Message[];
}

export interface ChatRenameRequest {
  chatId: string;
  name: string;
}

export interface ChatDeleteRequest {
  chatId: string;
}