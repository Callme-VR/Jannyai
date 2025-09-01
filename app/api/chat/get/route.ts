import ConnectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { ChatApiResponse } from "@/types";
import { logger, handleNetworkError } from "@/utils/errorHandling";

// Type Chat model as any to bypass strict typing
const ChatModel = Chat as any;

export async function GET(req: NextRequest): Promise<NextResponse<ChatApiResponse>> {
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
      const chat = await ChatModel.findOne({ _id: chatId, userId });
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
          chat,
        },
        { status: 200 }
      );
    } else {
      // Get all chats for user
      const chats = await ChatModel.find({ userId })
        .sort({ updatedAt: -1 })
        .select("name messages updatedAt createdAt");
      
      logger.info('Fetched user chats', { chatCount: chats?.length }, userId);
      
      return NextResponse.json(
        {
          success: true,
          chats,
        },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    logger.error('Failed to fetch chats', error instanceof Error ? error : new Error(String(error)));
    const errorMessage = handleNetworkError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
