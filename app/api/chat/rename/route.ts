import Chat from "@/models/Chat";
import ConnectDb from "@/config/db";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// Define interfaces for type safety
interface RenameRequestBody {
  chatId: string;
  name: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

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
    
    const body: RenameRequestBody = await req.json();
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

    return NextResponse.json({
      success: true,
      message: "Chat Updated",
    }, { status: 200 });
  } catch (error) {
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}
