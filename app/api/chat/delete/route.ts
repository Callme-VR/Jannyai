import ConnectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

// Define interfaces for type safety
interface DeleteRequestBody {
  chatId: string;
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
          message: "User not Authenticated",
          success: false,
        },
        { status: 401 }
      );
    }

    const body: DeleteRequestBody = await req.json();
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

    return NextResponse.json(
      {
        message: "Chat Deleted",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
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
