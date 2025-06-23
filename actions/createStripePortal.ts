'use server'

import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function createStripePortal() {
  auth.protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found")
  }

  // Fetch user from Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('clerk_user_id', userId)
    .single();

  if (error) {
    console.log(`Error fetching user: ${error.message}`);
    throw new Error("Failed to fetch user data");
  }

  const stripeCustomerId = user?.stripe_customer_id;

  if (!stripeCustomerId) {
    throw new Error("Stripe customer not found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getBaseUrl()}/dashboard`,
  });

  return session.url;
}