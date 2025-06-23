'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { generateEmbeddings } from '@/actions/generateEmbeddings';

export enum StatusText {
  UPLOADING = 'Uploading...',
  UPLOADED = 'File uploaded successfully!',
  SAVING = 'Saving file to database...',
  GENERATING = 'Generating AI Embeddings, This will only take a few seconds...',
}

export type Status = StatusText[keyof StatusText];

export function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file || !user) {
      setError('No file or user');
      return;
    }

    try {
      setStatus(StatusText.UPLOADING);
      setProgress(0);
      setError(null);

      const id = uuidv4();
      const filePath = `user_${user.id}/file_${id}.pdf`;

      // Upload file (Supabase does not support progress tracking natively)
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setError(`Upload failed: ${uploadError.message}`);
        setProgress(null);
        return;
      }

      setProgress(50);
      setStatus(StatusText.UPLOADED);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      setProgress(75);
      setStatus(StatusText.SAVING);

      // Insert into database
      const { data, error: dbError } = await supabase
        .from('uploads')
        .insert([{
          id: id,
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_url: publicUrl,
          created_at: new Date().toISOString(),
          file_size: file.size,
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        setError(`Database error: ${dbError.message || 'Unknown error'}`);
        setProgress(null);
        return;
      }

      setProgress(100);
      setStatus(StatusText.GENERATING);
      setFileId(data?.id || id);
      
      // Start embeddings generation but don't wait for it
      generateEmbeddings(id).catch(console.error);
      
      // Keep progress at 100% for a shorter time before resetting
      setTimeout(() => {
        setProgress(null);
      }, 1000);
      
    } catch (error) {
      console.error('Unexpected error in handleUpload:', error);
      setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setProgress(null);
    }
  };

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  return { handleUpload, status, fileId, error, progress };
}