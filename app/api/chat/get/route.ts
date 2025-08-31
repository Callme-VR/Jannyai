import ConnectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

// Define interfaces for type safety
interface GetChatResponse {
  success: boolean;
  data?: any;
  chats?: any[];
  message?: string;
  error?: string;
}

export async function GET(req: NextRequest): Promise<NextResponse<GetChatResponse>> {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 }
      );
    }

    // Get URL parameters
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    await ConnectDb();

    if (chatId) {
      // Get specific chat
      const chat = await Chat.findOne({ _id: chatId, userId });
      if (!chat) {
        return NextResponse.json(
          {
            success: false,
            message: "Chat not found or unauthorized",
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          data: chat,
        },
        { status: 200 }
      );
    } else {
      // Get all chats for user
      const chats = await Chat.find({ userId })
        .sort({ updatedAt: -1 })
        .select("name messages updatedAt createdAt");
      
      return NextResponse.json(
        {
          success: true,
          chats,
        },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
