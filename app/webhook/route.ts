// import { UserDetails } from '@/app/dashboard/upgrade/page';
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const body = await req.text();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("Stripe webhook secret was not set.")
    return new NextResponse("Stripe webhook secret is not set", {
      status: 400
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    console.log(`Webhook Error: ${err}`);
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  const getUserDetails = async (customerId: string) => {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, clerk_user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error) {
      console.log(`Error fetching user: ${error.message}`);
      return null;
    }

    return user;
  };

  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;
      
      const userDetails = await getUserDetails(customerId);
      if (!userDetails?.id) {
        return new NextResponse("User not found", { status: 404 })        
      }

      const { error } = await supabase
        .from('users')
        .update({ active_membership : true })
        .eq('id', userDetails.id);

      if (error) {
        console.log(`Error updating user membership: ${error.message}`);
        return new NextResponse("Failed to update user membership", { status: 500 });
      }

      break;
    }
    case "customer.subscription.deleted":
    case "subscription_schedule.canceled": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const userDetails = await getUserDetails(customerId);
      if (!userDetails?.id) {
        return new NextResponse("User not found", { status: 404 })        
      }

      const { error } = await supabase
        .from('users')
        .update({ active_membership: false })
        .eq('id', userDetails.id);

      if (error) {
        console.log(`Error updating user membership: ${error.message}`);
        return new NextResponse("Failed to update user membership", { status: 500 });
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({message: "Webhook received"});
}