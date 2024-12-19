import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let data;
  let eventType;

  // Check if webhook signing is configured.
  const webhookSecret = process.env.STRIPE_WEB_HOOK_KEY;

  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    const signature = req.headers.get("stripe-signature");
    let event;
    try {
      const rawBody = await req.text(); // Parse raw body for webhook verification
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
    }
    // Extract the object from the event.
    data = event.data.object;
    eventType = event.type;
  } else {
    // Webhook signing is not configured, retrieve the event data directly from the request body.
    const body = await req.json();
    data = body.data;
    eventType = body.type;
  }
  // Handle the event
  switch (eventType) {
    case "checkout.session.completed":
      console.log("✅ Payment completed: ", data);
      const result=await db.update(USER_TABLE).set({
        isMember:true
      }).where(eq(USER_TABLE.email,data.customer_detials.email));

      
      // Add your logic for handling successful payments here
      break;
    case "invoice.paid":
      console.log("✅ Invoice paid: ", data);
      // Add your logic for handling invoice payments here
      break;
    case "invoice.payment_failed":
      console.log("❌ Invoice payment failed: ", data);
      // Add your logic for handling failed payments here
      break;
    default:
      console.warn(`Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ result: "success" });
}
