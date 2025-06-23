'use server'

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { generateEmbeddingsInPineconeVectorStore } from '@/lib/langchain';

export async function generateEmbeddings(docId: string) {
  await auth.protect();

  await generateEmbeddingsInPineconeVectorStore(docId);

  revalidatePath('/dashboard');

  return { completed: true };
}