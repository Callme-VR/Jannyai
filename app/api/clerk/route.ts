import { Webhook } from "svix";
import ConnectDb from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { logger, validateEnvVar } from "@/utils/errorHandling";

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
  try {
    const webhookSecret = validateEnvVar('CLERK_WEBHOOK_SECRET', process.env.CLERK_WEBHOOK_SECRET);

    // Get headers and request body
    const headerPayload = await headers();
    const body = await req.text();

    // Extract required Svix headers with proper validation
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      logger.warn('Missing required webhook headers');
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
        logger.info('User created via webhook', { clerkId: data.id });
        break;

      case "user.updated":
        await User.findOneAndUpdate({ clerkId: data.id }, userData, {
          new: true,
          upsert: true,
        });
        logger.info('User updated via webhook', { clerkId: data.id });
        break;

      case "user.deleted":
        await User.findOneAndDelete({ clerkId: data.id });
        logger.info('User deleted via webhook', { clerkId: data.id });
        break;

      default:
        logger.warn(`Unhandled webhook event type: ${type}`);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    logger.error('Webhook processing error', error instanceof Error ? error : new Error(String(error)));
    return new Response("Internal server error", { status: 500 });
  }
}
