import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req){
    const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);

    const returnUrl = '{{DOMAIN_URL}}';
const customerId = '{{CUSTOMER_ID}}';

const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: returnUrl,
});


    return NextResponse({});
}