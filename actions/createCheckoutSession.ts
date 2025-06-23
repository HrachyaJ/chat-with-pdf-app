'use server'

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { auth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';
import stripe from "@/lib/stripe";
import getBaseUrl from "@/lib/getBaseUrl";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

export async function createCheckoutSession(userDetails: UserDetails) {
  const { userId } = await auth();

  if(!userId) {
    throw new Error("User not found");
  }
  
  // first check if the user already has a stripeCustomerId
  let stripeCustomerId;

  const { data: user, error } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('clerk_user_id', userId)
    .single();

  // If user doesn't exist, we'll create them later
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  stripeCustomerId = user?.stripe_customer_id;

  if (!stripeCustomerId) {
    // create a new stripe customer
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: {
        userId,
      },
    });

    // Check if a user record exists but without clerk_user_id set
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('id')
      .is('clerk_user_id', null)
      .limit(1)
      .single();

    if (existingUser && !existingError) {
      // Update the existing user record
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          clerk_user_id: userId,
          stripe_customer_id: customer.id 
        })
        .eq('id', existingUser.id);

      if (updateError) {
        throw new Error(`Failed to update existing user: ${updateError.message}`);
      }
    } else {
      // Create a new user record
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          clerk_user_id: userId,
          stripe_customer_id: customer.id,
        });

      if (insertError) {
        throw new Error(`Failed to create user record: ${insertError.message}`);
      }
    }

    stripeCustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1RbOAi03bGLKQMpvs8lrSyFt",
        quantity: 1,
      }
    ],
    mode: "subscription",
    customer: stripeCustomerId,
    success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
    cancel_url: `${getBaseUrl()}/dashboard/upgrade`,
  });

  return session.id;
};