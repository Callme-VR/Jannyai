import ConnectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { logger, handleNetworkError } from "@/utils/errorHandling";

export async function GET(req: NextRequest): Promise<NextResponse> {
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

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    await ConnectDb();

    if (chatId) {
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
          chat,
        },
        { status: 200 }
      );
    } else {
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
    logger.error(
      "Failed to fetch chats",
      error instanceof Error ? error : new Error(String(error))
    );
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
