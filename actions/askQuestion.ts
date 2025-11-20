"use server";

import { auth } from "@clerk/nextjs/server";
import { Message } from "@/components/Chat";
import { createClient } from "@supabase/supabase-js";
import { generateLangchainCompletion } from "@/lib/langchain";

const PRO_QUESTION_LIMIT = 20;
const FREE_QUESTION_LIMIT = 2; // Per document limit

export async function askQuestion(fileId: string, question: string) {
  try {
    auth.protect();
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Unauthorized", aiResponse: null };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("DEBUG: Missing Supabase environment variables");
      return {
        success: false,
        message: "Server configuration error",
        aiResponse: null,
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: userRef, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (userError) {
      console.error("DEBUG: User query error:", userError);
      return {
        success: false,
        message: `Failed to fetch user: ${userError.message}`,
        aiResponse: null,
      };
    }

    // Handle case where user doesn't exist
    if (!userRef) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([
          {
            clerk_user_id: userId,
            active_membership: false,
          },
        ])
        .select("*")
        .single();

      if (createError) {
        return {
          success: false,
          message: `Failed to create user: ${createError.message}`,
          aiResponse: null,
        };
      }
    }

    // Step 2: Determine membership status
    const hasActiveMembership = userRef?.active_membership || false;

    // Count messages for this specific user AND file combination
    const { data: fileMessages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("id, role, created_at, user_id, file_id, message")
      .eq("user_id", userId)
      .eq("file_id", fileId) // Filter by specific file
      .order("created_at", { ascending: false });

    if (messagesError) {
      return {
        success: false,
        message: `Failed to fetch messages: ${messagesError.message}`,
        aiResponse: null,
      };
    }

    // Count only human messages (questions) for this specific file
    const humanMessages = (fileMessages || []).filter(
      (msg) => msg.role === "human"
    );
    const questionsForThisFile = humanMessages.length;

    // Step 4: Check limits AFTER we add this question (per file basis)
    const limit = hasActiveMembership
      ? PRO_QUESTION_LIMIT
      : FREE_QUESTION_LIMIT;
    const membershipType = hasActiveMembership ? "PRO" : "FREE";

    // Check if adding this question would exceed the limit FOR THIS FILE
    if (questionsForThisFile >= limit) {
      const limitMessage = hasActiveMembership
        ? `You've reached the PRO limit of ${PRO_QUESTION_LIMIT} questions for this document!`
        : `You can only ask ${FREE_QUESTION_LIMIT} questions per document with the free plan. Upgrade to PRO for ${PRO_QUESTION_LIMIT} questions per document!`;

      return {
        success: false,
        message: limitMessage,
        aiResponse: null,
      };
    }

    // Step 5: Insert user message
    const userMessage: Message = {
      role: "human",
      message: question,
      createdAt: new Date(),
    };

    const { data: insertedUserMessage, error: userInsertError } = await supabase
      .from("chat_messages")
      .insert([
        {
          user_id: userId,
          file_id: fileId,
          role: userMessage.role,
          message: userMessage.message,
          created_at: userMessage.createdAt.toISOString(),
        },
      ])
      .select("*")
      .single();

    if (userInsertError) {
      return {
        success: false,
        message: `Failed to save question: ${userInsertError.message}`,
        aiResponse: null,
      };
    }

    // Step 6: Verify the message was actually inserted by querying again
    const { data: verifyMessages, error: verifyError } = await supabase
      .from("chat_messages")
      .select("id, role, message")
      .eq("user_id", userId)
      .eq("file_id", fileId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Step 7: Generate AI response
    const reply = await generateLangchainCompletion(fileId, question);

    if (!reply) {
      return {
        success: false,
        message: "Failed to generate AI response",
        aiResponse: null,
      };
    }

    // Step 8: Insert AI message
    const aiMessage: Message = {
      role: "ai",
      message: reply,
      createdAt: new Date(),
    };

    const { data: insertedAiMessage, error: aiInsertError } = await supabase
      .from("chat_messages")
      .insert([
        {
          user_id: userId,
          file_id: fileId,
          role: aiMessage.role,
          message: aiMessage.message,
          created_at: aiMessage.createdAt.toISOString(),
        },
      ])
      .select("*")
      .single();

    if (aiInsertError) {
      return {
        success: false,
        message: `Failed to save AI response: ${aiInsertError.message}`,
        aiResponse: reply, // Still return the reply even if we couldn't save it
      };
    }

    // Step 9: Final verification
    const { data: finalVerify, error: finalError } = await supabase
      .from("chat_messages")
      .select("id, role")
      .eq("user_id", userId)
      .eq("file_id", fileId);

    console.log(
      "DEBUG: Final count verification for this file:",
      finalVerify?.length || 0
    );

    return { success: true, message: null, aiResponse: reply };
  } catch (err: any) {
    console.error("=== DEBUG: Unhandled error in askQuestion ===");
    console.error("ERROR details:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return {
      success: false,
      message: err.message || "Server error",
      aiResponse: null,
    };
  }
}
