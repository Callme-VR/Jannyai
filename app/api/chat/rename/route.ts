import Chat from "@/models/Chat";
import ConnectDb from "@/config/db";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { ChatRenameRequest, ApiResponse } from "@/types";
import { logger, handleNetworkError } from "@/utils/errorHandling";

// Rename chat route
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    await ConnectDb();
    
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User Not Authenticated",
      }, { status: 401 });
    }
    
    const body: ChatRenameRequest = await req.json();
    const { chatId, name } = body;

    // Validate required fields
    if (!chatId || !name) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: chatId and name",
      }, { status: 400 });
    }

    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId, userId }, 
      { name },
      { new: true }
    );

    if (!updatedChat) {
      return NextResponse.json({
        success: false,
        message: "Chat not found or unauthorized",
      }, { status: 404 });
    }

    logger.info('Chat renamed successfully', { chatId, newName: name }, userId);

    return NextResponse.json({
      success: true,
      message: "Chat Updated",
    }, { status: 200 });
  } catch (error) {
    logger.error('Failed to rename chat', error instanceof Error ? error : new Error(String(error)));
    const errorMessage = handleNetworkError(error);
    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}
