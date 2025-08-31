import ConnectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

// Define interfaces for type safety
interface ChatData {
  userId: string;
  message: any[]; // Consider defining a proper Message interface
  name: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

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

    const chatData: ChatData = {
      userId,
      message: [],
      name: "New chat",
    };

    await ConnectDb();
    await Chat.create(chatData);

    return NextResponse.json(
      {
        success: true,
        message: "New Chat Created",
      },
      { status: 201 }
    );
  } catch (error) {
    // Type-safe error handling
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
