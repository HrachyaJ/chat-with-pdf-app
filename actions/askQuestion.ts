'use server';

import { auth } from '@clerk/nextjs/server';
import { Message } from '@/components/Chat';
import { createClient } from '@supabase/supabase-js';
import { generateLangchainCompletion } from '@/lib/langchain';

const PRO_QUESTION_LIMIT = 20;
const FREE_QUESTION_LIMIT = 2; // Per document limit

export async function askQuestion(fileId: string, question: string) {
  try {
    auth.protect();
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: 'Unauthorized', aiResponse: null };
    }

    console.log('=== DEBUG: Starting askQuestion ===');
    console.log('DEBUG: userId:', userId);
    console.log('DEBUG: fileId:', fileId);
    console.log('DEBUG: question length:', question.length);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('DEBUG: Missing Supabase environment variables');
      return { success: false, message: 'Server configuration error', aiResponse: null };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Fetch user info with detailed debugging
    console.log('DEBUG: Fetching user data...');
    const { data: userRef, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .maybeSingle();

    if (userError) {
      console.error('DEBUG: User query error:', userError);
      return { success: false, message: `Failed to fetch user: ${userError.message}`, aiResponse: null };
    }

    console.log('DEBUG: User query result:', userRef);

    // Handle case where user doesn't exist
    if (!userRef) {
      console.log('DEBUG: User not found in database, creating new user...');
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          clerk_user_id: userId,
          active_membership: false,
        }])
        .select('*')
        .single();

      if (createError) {
        console.error('DEBUG: Failed to create user:', createError);
        return { success: false, message: `Failed to create user: ${createError.message}`, aiResponse: null };
      }

      console.log('DEBUG: New user created:', newUser);
    }

    // Step 2: Determine membership status
    const hasActiveMembership = userRef?.active_membership || false;
    console.log('DEBUG: Membership status:', {
      active_membership: userRef?.active_membership,
      resolved: hasActiveMembership
    });

    // Step 3: Count existing questions FOR THIS SPECIFIC FILE - FIXED VERSION
    console.log('DEBUG: Counting existing messages for this file...');
    
    // Count messages for this specific user AND file combination
    const { data: fileMessages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('id, role, created_at, user_id, file_id, message')
      .eq('user_id', userId)
      .eq('file_id', fileId) // Filter by specific file
      .order('created_at', { ascending: false });

    console.log('DEBUG: Messages query result for this file:', {
      found: fileMessages?.length || 0,
      error: messagesError?.message || 'none'
    });

    if (messagesError) {
      console.error('DEBUG: Messages query error:', messagesError);
      return { success: false, message: `Failed to fetch messages: ${messagesError.message}`, aiResponse: null };
    }

    console.log('DEBUG: Raw messages found for this file:', fileMessages?.length || 0);
    console.log('DEBUG: Sample messages:', fileMessages?.slice(0, 3));

    // Count only human messages (questions) for this specific file
    const humanMessages = (fileMessages || []).filter(msg => msg.role === 'human');
    const questionsForThisFile = humanMessages.length;

    console.log('DEBUG: Message breakdown for this file:', {
      totalMessages: fileMessages?.length || 0,
      humanMessages: questionsForThisFile,
      limit: hasActiveMembership ? PRO_QUESTION_LIMIT : FREE_QUESTION_LIMIT,
      hasActiveMembership,
      fileId
    });

    // Step 4: Check limits AFTER we add this question (per file basis)
    const limit = hasActiveMembership ? PRO_QUESTION_LIMIT : FREE_QUESTION_LIMIT;
    const membershipType = hasActiveMembership ? 'PRO' : 'FREE';

    console.log(`DEBUG: Checking ${membershipType} limit for file ${fileId}: ${questionsForThisFile + 1} > ${limit}?`);

    // Check if adding this question would exceed the limit FOR THIS FILE
    if (questionsForThisFile >= limit) {
      const limitMessage = hasActiveMembership 
        ? `You've reached the PRO limit of ${PRO_QUESTION_LIMIT} questions for this document!`
        : `You can only ask ${FREE_QUESTION_LIMIT} questions per document with the free plan. Upgrade to PRO for ${PRO_QUESTION_LIMIT} questions per document!`;
      
      console.log('DEBUG: Per-file limit exceeded, returning limit message');
      return {
        success: false,
        message: limitMessage,
        aiResponse: null
      };
    }

    console.log('DEBUG: Per-file limit check passed, proceeding with question...');

    // Step 5: Insert user message
    const userMessage: Message = {
      role: 'human',
      message: question,
      createdAt: new Date(),
    };

    console.log('DEBUG: Inserting user message...');
    const { data: insertedUserMessage, error: userInsertError } = await supabase
      .from('chat_messages')
      .insert([
        {
          user_id: userId,
          file_id: fileId,
          role: userMessage.role,
          message: userMessage.message,
          created_at: userMessage.createdAt.toISOString(),
        },
      ])
      .select('*')
      .single();

    if (userInsertError) {
      console.error('DEBUG: User message insert error:', userInsertError);
      return {
        success: false,
        message: `Failed to save question: ${userInsertError.message}`,
        aiResponse: null,
      };
    }

    console.log('DEBUG: User message inserted successfully:', insertedUserMessage);

    // Step 6: Verify the message was actually inserted by querying again
    const { data: verifyMessages, error: verifyError } = await supabase
      .from('chat_messages')
      .select('id, role, message')
      .eq('user_id', userId)
      .eq('file_id', fileId)
      .order('created_at', { ascending: false })
      .limit(5);

    console.log('DEBUG: Verification query - messages in DB for this file:', verifyMessages?.length || 0);
    console.log('DEBUG: Recent messages:', verifyMessages?.map(m => `${m.role}: ${m.message.substring(0, 20)}...`));

    // Step 7: Generate AI response
    console.log('DEBUG: Generating AI response...');
    const reply = await generateLangchainCompletion(fileId, question);
    console.log('DEBUG: AI response generated, length:', reply?.length);

    if (!reply) {
      console.error('DEBUG: AI response is empty or null');
      return {
        success: false,
        message: 'Failed to generate AI response',
        aiResponse: null,
      };
    }

    // Step 8: Insert AI message
    const aiMessage: Message = {
      role: 'ai',
      message: reply,
      createdAt: new Date(),
    };

    console.log('DEBUG: Inserting AI message...');
    const { data: insertedAiMessage, error: aiInsertError } = await supabase
      .from('chat_messages')
      .insert([
        {
          user_id: userId,
          file_id: fileId,
          role: aiMessage.role,
          message: aiMessage.message,
          created_at: aiMessage.createdAt.toISOString(),
        },
      ])
      .select('*')
      .single();

    if (aiInsertError) {
      console.error('DEBUG: AI message insert error:', aiInsertError);
      return {
        success: false,
        message: `Failed to save AI response: ${aiInsertError.message}`,
        aiResponse: reply, // Still return the reply even if we couldn't save it
      };
    }

    console.log('DEBUG: AI message inserted successfully:', insertedAiMessage);

    // Step 9: Final verification
    const { data: finalVerify, error: finalError } = await supabase
      .from('chat_messages')
      .select('id, role')
      .eq('user_id', userId)
      .eq('file_id', fileId);

    console.log('DEBUG: Final count verification for this file:', finalVerify?.length || 0);
    console.log('=== DEBUG: askQuestion completed successfully ===');

    return { success: true, message: null, aiResponse: reply };

  } catch (err: any) {
    console.error('=== DEBUG: Unhandled error in askQuestion ===');
    console.error('ERROR details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    return {
      success: false,
      message: err.message || 'Server error',
      aiResponse: null,
    };
  }
}