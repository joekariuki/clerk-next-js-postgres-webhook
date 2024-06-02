import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Create user in database webhook
  if (evt.type === "user.created") {
    try {
      const userId = evt.data.id;
      const email = evt.data.email_addresses[0].email_address;
      const firstName = evt.data.first_name;
      const lastName = evt.data.last_name;

      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }

      if (!email) {
        return new NextResponse("Email is required", { status: 400 });
      }

      if (!firstName) {
        return new NextResponse("First name is required", { status: 400 });
      }

      if (!lastName) {
        return new NextResponse("Last name is required", { status: 400 });
      }

      const account = await prismadb.user.create({
        data: {
          clerkId: userId,
          email,
          firstName,
          lastName,
        },
      });

      return NextResponse.json(account);
    } catch (error) {
      console.log("[USER_CREATER_ERROR]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }

  // Update user in database webhook
  if (evt.type === "user.updated") {
    try {
      const userId = evt.data.id;
      const email = evt.data.email_addresses[0].email_address;
      const firstName = evt.data.first_name;
      const lastName = evt.data.last_name;

      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }

      if (!email) {
        return new NextResponse("Email is required", { status: 400 });
      }

      if (!firstName) {
        return new NextResponse("First name is required", { status: 400 });
      }

      if (!lastName) {
        return new NextResponse("Last name is required", { status: 400 });
      }

      const account = await prismadb.user.update({
        where: { clerkId: userId },
        data: {
          email,
          firstName,
          lastName,
        },
      });

      return NextResponse.json(account);
    } catch (error) {
      console.log("[USER_UPDATE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }

  if (evt.type === "user.deleted") {
    try {
      const userId = evt.data.id;

      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }

      const account = await prismadb.user.delete({
        where: { clerkId: userId },
      });

      return NextResponse.json(account);
    } catch (error) {
      console.log("[USER_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}
