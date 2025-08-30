import { Webhook } from "svix";
import ConnectDb from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";

// Define Clerk webhook event type
interface ClerkWebhookEvent {
  type: "user.created" | "user.updated" | "user.deleted" | string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
}

export async function POST(req: Request) {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("WEBHOOK_SECRET is not defined in environment variables");
  }

  try {
    // Get headers and request body
    const headerPayload = headers();
    const body = await req.text();

    // Extract required Svix headers
    const svixId = (await headerPayload).get("svix-id");
    const svixTimestamp = (await headerPayload).get("svix-timestamp");
    const svixSignature = (await headerPayload).get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing required webhook headers", { status: 400 });
    }

    const svixHeaders = {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    };

    // Initialize webhook with secret
    const wh = new Webhook(webhookSecret);

    // Verify webhook payload
    const payload = wh.verify(body, svixHeaders) as ClerkWebhookEvent;

    // Connect to database
    await ConnectDb();

    const { type, data } = payload;

    // Prepare user data
    const userData = {
      clerkId: data.id,
      email: data.email_addresses[0]?.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      imageUrl: data.image_url,
    };

    // Handle events
    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated":
        await User.findOneAndUpdate({ clerkId: data.id }, userData, {
          new: true,
          upsert: true,
        });
        break;

      case "user.deleted":
        await User.findOneAndDelete({ clerkId: data.id });
        break;

      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
