import ConnectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { ChatDeleteRequest, ApiResponse } from "@/types";
import { logger, handleNetworkError } from "@/utils/errorHandling";

// Type Chat model as any to bypass strict typing

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        {
          message: "User not Authenticated",
          success: false,
        },
        { status: 401 }
      );
    }

    const body: ChatDeleteRequest = await req.json();
    const { chatId } = body;

    // Validate required fields
    if (!chatId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required field: chatId",
        },
        { status: 400 }
      );
    }

    await ConnectDb();

    const deletedChat = await Chat.findOneAndDelete({ _id: chatId, userId });

    if (!deletedChat) {
      return NextResponse.json(
        {
          success: false,
          message: "Chat not found or unauthorized",
        },
        { status: 404 }
      );
    }

    logger.info('Chat deleted successfully', { chatId }, userId);

    return NextResponse.json(
      {
        message: "Chat Deleted",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Failed to delete chat', error instanceof Error ? error : new Error(String(error)));
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
