'use server';

import { indexName } from '@/lib/langchain';
import pineconeClient from '@/lib/pinecone';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function deleteDocument(docId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  // 1. Delete the file record from Supabase 'uploads' table (assuming that's your files table)
  const { error: deleteError } = await supabase
    .from('uploads')
    .delete()
    .eq('id', docId)
    .eq('user_id', userId);

  if (deleteError) {
    throw new Error(`Failed to delete document record: ${deleteError.message}`);
  }

  // 2. Delete the file from Supabase Storage
  const { error: storageError } = await supabase
    .storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!)
    .remove([`users/${userId}/files/${docId}`]);

  if (storageError) {
    throw new Error(`Failed to delete file from storage: ${storageError.message}`);
  }

  // 3. Delete from Pinecone index
  const index = await pineconeClient.Index(indexName);
  await index.namespace(docId).deleteAll();

  // 4. Revalidate the documents page
  revalidatePath("/documents");
}