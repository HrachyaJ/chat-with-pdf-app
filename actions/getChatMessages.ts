"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

type DatabaseMessage = {
  id: string;
  role: "human" | "ai";
  message: string | number;
  created_at: string;
  user_id: string;
  file_id: string;
};

export async function getChatMessages(fileId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Unauthorized",
        data: [] as DatabaseMessage[],
      };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        success: false,
        message: "Server configuration error",
        data: [] as DatabaseMessage[],
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .eq("file_id", fileId)
      .order("created_at", { ascending: true });

    if (error) {
      return {
        success: false,
        message: error.message,
        data: [] as DatabaseMessage[],
      };
    }

    return {
      success: true,
      message: null,
      data: (data || []) as DatabaseMessage[],
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Server error",
      data: [] as DatabaseMessage[],
    };
  }
}
