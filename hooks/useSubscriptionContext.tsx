"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";
import { getUserData, getUserFilesCount } from "@/actions/getUserData";

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

interface SubscriptionContextType {
  hasActiveMembership: boolean | null;
  isOverFileLimit: boolean | null;
  loading: boolean;
  filesLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  // Track subscription state to prevent multiple subscriptions
  const userChannelRef = useRef<any>(null);
  const filesChannelRef = useRef<any>(null);
  const isSubscribedRef = useRef<{ user: boolean; files: boolean }>({ user: false, files: false });
  const isInitializedRef = useRef(false);

  // Initialize Supabase client with error handling
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  let supabase: ReturnType<typeof createBrowserClient> | undefined;

  try {
    supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (initError) {
    console.error("Failed to initialize Supabase client:", initError);
  }

  // Helper function to safely remove a channel
  const safeRemoveChannel = async (channel: any, channelType: 'user' | 'files') => {
    if (channel && isSubscribedRef.current[channelType]) {
      try {
        await supabase?.removeChannel(channel);
        isSubscribedRef.current[channelType] = false;
        console.log(`Removed ${channelType} channel successfully`);
      } catch (error) {
        console.warn(`Error removing ${channelType} channel:`, error);
      }
    }
  };

  // Helper function to fetch user data
  const fetchUserData = async () => {
    if (!user?.id) return;

    setLoading(true);
    setFilesLoading(true);

    try {
      console.log("Fetching user data for:", user.id);
      
      // 1. Get user data using server action
      const userResult = await getUserData();
      
      if (userResult.error) {
        console.error("Error fetching user data:", userResult.error);
        setError(new Error(userResult.error));
        setLoading(false);
        setFilesLoading(false);
        return;
      }

      const { hasActiveMembership, userData } = userResult.data!;
      console.log("User data result:", { hasActiveMembership, userData });
      
      setHasActiveMembership(hasActiveMembership);

      // 2. Get files count using server action
      const filesResult = await getUserFilesCount();
      
      if (filesResult.error) {
        console.error("Error fetching files count:", filesResult.error);
        setError(new Error(filesResult.error));
        setFilesLoading(false);
        return;
      }

      const { filesCount } = filesResult.data!;
      console.log("Files count:", filesCount);

      // 3. Set file limit status
      if (hasActiveMembership) {
        setIsOverFileLimit(filesCount >= PRO_LIMIT);
      } else {
        setIsOverFileLimit(filesCount >= FREE_LIMIT);
      }

      setFilesLoading(false);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err as Error);
      setLoading(false);
      setFilesLoading(false);
    }
  };

  // Helper function to fetch files
  const fetchFiles = async (membershipStatus?: boolean | null) => {
    if (!user?.id) {
      setFilesLoading(false);
      return;
    }

    try {
      setFilesLoading(true);

      console.log("Fetching files for user:", user.id);

      // Get files count using server action
      const filesResult = await getUserFilesCount();
      
      if (filesResult.error) {
        console.error("Error fetching files:", filesResult.error);
        setIsOverFileLimit(false);
        return;
      }

      const filesCount = filesResult.data!.filesCount;
      // Use the passed membership status or fall back to current state
      const currentMembership = membershipStatus !== undefined ? membershipStatus : hasActiveMembership;
      const usersLimit = currentMembership ? PRO_LIMIT : FREE_LIMIT;

      console.log("File count check:", {
        filesCount,
        usersLimit,
        currentMembership,
        hasActiveMembership,
        isOverLimit: filesCount >= usersLimit,
      });

      setIsOverFileLimit(filesCount >= usersLimit);
    } catch (err) {
      console.error("Unexpected error fetching files:", err);
      setIsOverFileLimit(false);
    } finally {
      setFilesLoading(false);
    }
  };

  // Main effect to handle data fetching and subscriptions
  useEffect(() => {
    if (!user?.id || !supabase) {
      setLoading(false);
      setFilesLoading(false);
      return;
    }

    // Prevent multiple initializations
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    // Cleanup function
    const cleanup = async () => {
      await Promise.all([
        safeRemoveChannel(userChannelRef.current, 'user'),
        safeRemoveChannel(filesChannelRef.current, 'files')
      ]);
    };

    // Set up subscriptions first
    const setupSubscriptions = async () => {
      // Clean up any existing subscriptions first
      await cleanup();

      try {
        // User subscription
        if (!isSubscribedRef.current.user) {
          userChannelRef.current = supabase
            .channel(`user-changes-${user.id}`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "users",
                filter: `clerk_user_id=eq.${user.id}`,
              },
              (payload: any) => {
                console.log("User data changed - Full payload:", payload);
                console.log("Event type:", payload.eventType);
                console.log("New data:", payload.new);
                console.log("Old data:", payload.old);
                
                if (payload.new && "active_membership" in payload.new) {
                  const newMembershipStatus = payload.new.active_membership;
                  console.log("Updating membership status from", hasActiveMembership, "to", newMembershipStatus);
                  setHasActiveMembership(newMembershipStatus);
                  // Refetch files when membership changes, passing the new status
                  fetchFiles(newMembershipStatus);
                } else {
                  console.log("No active_membership field in payload.new");
                }
              }
            )
            .subscribe();

          isSubscribedRef.current.user = true;
          console.log("User subscription established");
        }

        // Files subscription
        if (!isSubscribedRef.current.files) {
          filesChannelRef.current = supabase
            .channel(`files-changes-${user.id}`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "uploads",
                filter: `user_id=eq.${user.id}`,
              },
              () => {
                console.log("Files changed, refetching...");
                fetchFiles();
              }
            )
            .subscribe();

          isSubscribedRef.current.files = true;
          console.log("Files subscription established");
        }
      } catch (subscriptionError) {
        console.warn("Could not set up real-time subscriptions:", subscriptionError);
      }
    };

    // Initial data fetch
    const initializeData = async () => {
      await fetchUserData();
      
      // Only fetch files if we have membership status
      if (hasActiveMembership !== null) {
        await fetchFiles();
      }
    };

    // Initialize everything
    const initialize = async () => {
      // Set up subscriptions first so they can catch any changes during data fetch
      await setupSubscriptions();
      // Then fetch initial data
      await initializeData();
    };

    initialize();

    // Return cleanup function
    return () => {
      cleanup();
      isInitializedRef.current = false;
    };
  }, [user?.id]); // Only depend on user.id, not supabase

  // Manual refresh function for testing
  const refreshData = async () => {
    console.log("Manual refresh triggered");
    await fetchUserData();
  };

  const value: SubscriptionContextType = {
    hasActiveMembership,
    isOverFileLimit,
    loading,
    filesLoading,
    error,
    refreshData,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
