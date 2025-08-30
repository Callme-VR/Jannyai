import { Webhook } from "svix";
import ConnectDb from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";

export async function POST(req: Request) {
    // Type-safe environment variable access
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new Error("WEBHOOK_SECRET is not defined in environment variables");
    }

    try {
        // Get headers and request body
        const headerPayload = await headers();
        const body = await req.text();

        // Type-safe header extraction with null checks
        const svixId = headerPayload.get("svix-id");
        const svixTimestamp = headerPayload.get("svix-timestamp");
        const svixSignature = headerPayload.get("svix-signature");

        if (!svixId || !svixTimestamp || !svixSignature) {
            return new Response('Missing required webhook headers', { status: 400 });
        }

        const svixHeaders = {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature
        };

        // Initialize webhook with type-safe secret
        const wh = new Webhook(webhookSecret);
        
        // Verify webhook payload
        const payload = wh.verify(body, svixHeaders);
        
        // Connect to database
        await ConnectDb();
        
        // Handle the webhook event based on type
        const { type, data } = payload as any;
        
        // Prepare user data with proper field mapping
        const userData = {
            clerkId: data.id, // Use clerkId instead of _id for clarity
            email: data.email_addresses[0]?.email_address,
            firstName: data.first_name,
            lastName: data.last_name,
            imageUrl: data.image_url,
        };
        
        switch (type) {
            case "user.created":
                await User.create(userData);
                break;
            case "user.updated":
                await User.findOneAndUpdate(
                    { clerkId: data.id },
                    userData,
                    { new: true, upsert: true } 
                );
                break;
            case "user.deleted":
                await User.findOneAndDelete({ clerkId: data.id });
                break;
            default:
                console.log(`Unhandled webhook event type: ${type}`);
        }
        
        return new Response('Webhook processed successfully', { status: 200 });
        
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new Response('Internal server error', { status: 500 });
    }
}