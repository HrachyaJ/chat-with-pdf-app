'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr';

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

function useSubscription() {
  const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  // Initialize Supabase client with error handling
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  let supabase: ReturnType<typeof createBrowserClient> | undefined;

  try {
    supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (initError) {
    console.error('Failed to initialize Supabase client:', initError);
  }

  // Fetch user subscription data
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setFilesLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      setFilesLoading(true);

      // 1. Check membership status
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('active_membership')
        .eq('clerk_user_id', user.id)
        .maybeSingle();

      if (userError) {
        setError(userError);
        setLoading(false);
        setFilesLoading(false);
        return;
      }

      const isPro = !!userData?.active_membership;
      setHasActiveMembership(isPro);

      // 2. Count files
      const { count, error: filesError } = await supabase
        .from('uploads')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (filesError) {
        setError(filesError);
        setFilesLoading(false);
        return;
      }

      // 3. Set file limit status
      if (isPro) {
        setIsOverFileLimit(count !== null && count >= PRO_LIMIT);
      } else {
        setIsOverFileLimit(count !== null && count >= FREE_LIMIT);
      }

      setFilesLoading(false);
      setLoading(false);
    };

    fetchUserData();

    // Set up real-time subscription for user data
    let userChannel: any;
    try {
      userChannel = supabase
        .channel('user-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'users',
            filter: `clerk_user_id=eq.${user.id}`,
          },
          (payload: { new: { active_membership: boolean | ((prevState: boolean | null) => boolean | null) | null; }; }) => {
            console.log('User data changed:', payload);
            if (payload.new && 'active_membership' in payload.new) {
              setHasActiveMembership(payload.new.active_membership);
            }
          }
        )
        .subscribe();
    } catch (subscriptionError) {
      console.warn('Could not set up real-time subscription:', subscriptionError);
    }

    return () => {
      if (userChannel) {
        supabase.removeChannel(userChannel);
      }
    };
  }, [user?.id, supabase]);

  // Fetch user files and check limit
  useEffect(() => {
    if (!user?.id || !supabase) {
      setFilesLoading(false);
      return;
    }

    const fetchFiles = async () => {
      try {
        setFilesLoading(true);
        
        console.log('Fetching files for user:', user.id);
        
        // FIXED: Use the correct table name and column name
        // Try 'uploads' table first (based on your deleteDocument.ts)
        let { data, error } = await supabase
          .from('uploads')
          .select('id')
          .eq('user_id', user.id); // Using user_id to match deleteDocument.ts

        // If uploads table doesn't exist or uses different column, try alternatives
        if (error && error.code === '42P01') { // Table doesn't exist
          console.log('uploads table not found, trying files table...');
          const result = await supabase
            .from('files')
            .select('id')
            .eq('clerk_user_id', user.id); // Try clerk_user_id
          
          data = result.data;
          error = result.error;
          
          if (error && error.code === '42703') { // Column doesn't exist
            console.log('clerk_user_id column not found, trying user_id...');
            const result2 = await supabase
              .from('files')
              .select('id')
              .eq('user_id', user.id);
            
            data = result2.data;
            error = result2.error;
          }
        }

        if (error) {
          console.error('Error fetching files:', error);
          setIsOverFileLimit(false);
          return;
        }

        const filesCount = data?.length || 0;
        const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

        console.log(
          "File count check:",
          { filesCount, usersLimit, hasActiveMembership, isOverLimit: filesCount >= usersLimit }
        );

        setIsOverFileLimit(filesCount >= usersLimit);
      } catch (err) {
        console.error('Unexpected error fetching files:', err);
        setIsOverFileLimit(false);
      } finally {
        setFilesLoading(false);
      }
    };

    // Only fetch files if we know the membership status
    if (hasActiveMembership !== null) {
      fetchFiles();

      // Set up real-time subscription for files
      let filesChannel: any;
      try {
        filesChannel = supabase
          .channel('files-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'uploads', // FIXED: Use correct table name
              filter: `user_id=eq.${user.id}`, // FIXED: Use correct column name
            },
            () => {
              console.log('Files changed, refetching...');
              fetchFiles();
            }
          )
          .subscribe();
      } catch (subscriptionError) {
        console.warn('Could not set up files real-time subscription:', subscriptionError);
      }

      return () => {
        if (filesChannel) {
          supabase.removeChannel(filesChannel);
        }
      };
    }
  }, [user?.id, hasActiveMembership, supabase]);

  return { 
    hasActiveMembership, 
    loading, 
    error, 
    isOverFileLimit, 
    filesLoading 
  };
}

export default useSubscription;