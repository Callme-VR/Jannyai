import ConnectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { ApiResponse, ChatCreateRequest } from "@/types";
import { logger, handleNetworkError } from "@/utils/errorHandling";

// Create new chat in database
export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User not Authenticated",
        },
        { status: 401 }
      );
    }

    const chatData: ChatCreateRequest = {
      userId,
      messages: [],
      name: "New chat",
    };

    await ConnectDb();
    await Chat.create(chatData);

    logger.info('New chat created successfully', undefined, userId);

    return NextResponse.json(
      {
        success: true,
        message: "New Chat Created",
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Failed to create chat', error instanceof Error ? error : new Error(String(error)));
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
