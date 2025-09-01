import { GoogleGenAI } from "@google/genai";
import ConnectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

// Define interfaces for type safety
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface AiRequestBody {
  chatId: string;
  message: string;
  conversationHistory?: Message[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  aiResponse?: string;
  error?: string;
}

// Initialize Gemini AI with environment variable validation
function initializeGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  return new GoogleGenAI({ apiKey });
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    // Authenticate user
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

    // Parse and validate request body
    const body: AiRequestBody = await req.json();
    const { chatId, message, conversationHistory = [] } = body;

    if (!chatId || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: chatId and message",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await ConnectDb();

    // Verify chat ownership and existence
    const existingChat = await (Chat.findOne({ _id: chatId, userId }) as any);
    if (!existingChat) {
      return NextResponse.json(
        {
          success: false,
          message: "Chat not found or unauthorized",
        },
        { status: 404 }
      );
    }

    // Prepare conversation context for AI
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .slice(-10) // Limit to last 10 messages to avoid token limits
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");
      conversationContext += "\n";
    }

    // Create the prompt with context
    const prompt = conversationContext + `user: ${message}`;

    // Initialize Gemini AI
    const genAI = initializeGeminiAI();
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const aiResponse =
      response.text || "Sorry, I couldn't generate a response.";

    // Create message objects
    const timestamp = Date.now();
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp,
    };
    const assistantMessage: Message = {
      role: "assistant",
      content: aiResponse,
      timestamp: timestamp + 1,
    };

    // Update chat with new messages
    await (Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          messages: {
            $each: [userMessage, assistantMessage],
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    ) as any);

    return NextResponse.json(
      {
        success: true,
        message: "AI response generated successfully",
        aiResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AI API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    if (errorMessage.includes("API_KEY")) {
      return NextResponse.json(
        {
          success: false,
          error: "AI service configuration error",
        },
        { status: 500 }
      );
    }

    if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
      return NextResponse.json(
        {
          success: false,
          error: "AI service temporarily unavailable. Please try again later.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate AI response",
      },
      { status: 500 }
    );
  }
}
