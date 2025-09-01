import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import ConnectDb from "@/config/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = headers();

  const svix_id = (await headersList).get("svix-id");
  const svix_timestamp = (await headersList).get("svix-timestamp");
  const svix_signature = (await headersList).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  try {
    await ConnectDb();

    if (type === "user.created") {
      const email = data.email_addresses?.[0]?.email_address;

      await User.create({
        clerkId: data.id,
        email: email,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
      });

      console.log("✅ User created:", data.id);
    }

    if (type === "user.deleted") {
      await User.findOneAndDelete({ clerkId: data.id });
      console.log("🗑️ User deleted:", data.id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
