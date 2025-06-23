'use client';

import { FrownIcon, PlusCircleIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { useState } from "react";

function PlaceholderDocument() {
  const { isOverFileLimit, loading, filesLoading } = useSubscription();
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async () => {
    // Prevent multiple clicks
    if (isClicked) return;
    
    setIsClicked(true);
    
    try {
      // If still loading, wait a bit for the data to load
      if (loading || filesLoading) {
        // Wait up to 2 seconds for loading to complete
        const maxWaitTime = 2000;
        const startTime = Date.now();
        
        while ((loading || filesLoading) && (Date.now() - startTime) < maxWaitTime) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Double-check the limit after loading
      if (isOverFileLimit) {
        router.push("/dashboard/upgrade");
      } else {
        router.push("/dashboard/upload");
      }
    } finally {
      // Reset click state after navigation
      setTimeout(() => setIsClicked(false), 1000);
    }
  };

  // Show loading state while data is being fetched
  if (loading || filesLoading) {
    return (
      <Button 
        disabled 
        className="flex flex-col items-center w-64 h-80 rounded-xl bg-gray-100 drop-shadow-md text-gray-400 cursor-not-allowed"
      >
        <Loader2 className="h-16 w-16 animate-spin" />
        <p className="font-semibold mt-2">Loading...</p>
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleClick} 
      disabled={isClicked}
      className={`flex flex-col items-center w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400 cursor-pointer ${
        isClicked 
          ? 'bg-gray-100 cursor-not-allowed' 
          : 'bg-gray-200 cursor-pointer hover:bg-gray-800'
      }`}
    >
      {isClicked ? (
        <Loader2 className="h-16 w-16 animate-spin" />
      ) : isOverFileLimit ? (
        <FrownIcon className="h-16 w-16" />
      ) : (
        <PlusCircleIcon className="h-16 w-16" />
      )}
      
      <p className="font-semibold mt-2">
        {isClicked 
          ? "Loading..." 
          : isOverFileLimit 
            ? "Upgrade to add more documents" 
            : "Add a Document"
        }
      </p>
    </Button>
  );
}

export default PlaceholderDocument;

//   return (
//     <Button onClick={handleClick} className="flex flex-col items-center w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400 cursor-pointer">
//       {isOverFileLimit ? (
//         <FrownIcon className="h-16 w-16" />
//       ) : (
//       <PlusCircleIcon className="h-16 w-16" />
//       )}
      
//       <p className="font-semibold">
//         {isOverFileLimit ? "Upgrade add more documents" : "Add a Document"}
//       </p>
//     </Button>
//   );
// }
