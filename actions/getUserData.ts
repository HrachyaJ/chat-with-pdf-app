'use server'

import { auth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

export async function getUserData() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    // Check if user exists
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("active_membership")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (userError) {
      console.error("Database query error:", userError);
      return { error: userError.message };
    }

    // If no user record exists, create one with default values
    if (!userData) {
      console.log("No user record found, creating one with default values...");
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          clerk_user_id: userId,
          active_membership: false
        })
        .select('active_membership')
        .single();

      if (createError) {
        console.error("Failed to create user record:", createError);
        return { error: createError.message };
      }

      return { 
        data: { 
          hasActiveMembership: !!newUser?.active_membership,
          userData: newUser 
        } 
      };
    }

    return { 
      data: { 
        hasActiveMembership: !!userData?.active_membership,
        userData 
      } 
    };

  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getUserFilesCount() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    // Count files
    const { count, error: filesError } = await supabase
      .from("uploads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (filesError) {
      console.error("Error counting files:", filesError);
      return { error: filesError.message };
    }

    return { data: { filesCount: count || 0 } };

  } catch (error) {
    console.error("Unexpected error counting files:", error);
    return { error: "An unexpected error occurred" };
  }
}
