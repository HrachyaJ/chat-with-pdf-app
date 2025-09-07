"use client";

import {
  FrownIcon,
  PlusCircleIcon,
  Loader2,
  Sparkles,
  Crown,
  Upload,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { useState } from "react";

function PlaceholderDocument() {
  const { isOverFileLimit, loading, filesLoading } = useSubscription();
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async () => {
    if (isClicked) return;

    setIsClicked(true);

    try {
      if (loading || filesLoading) {
        const maxWaitTime = 2000;
        const startTime = Date.now();

        while (
          (loading || filesLoading) &&
          Date.now() - startTime < maxWaitTime
        ) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      if (isOverFileLimit) {
        router.push("/dashboard/upgrade");
      } else {
        router.push("/dashboard/upload");
      }
    } finally {
      setTimeout(() => setIsClicked(false), 1000);
    }
  };

  // Loading state
  if (loading || filesLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Main content area - matches document card height */}
        <div className="p-6 flex flex-col items-center justify-center h-48">
          <div className="flex justify-center mb-4 mt-24">
            <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          </div>
          <h3 className="font-medium text-gray-600 text-sm mb-1">Loading...</h3>
          <p className="text-gray-400 text-xs">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isClicked}
      className={`group relative bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 w-full cursor-pointer ${
        isOverFileLimit
          ? "border-orange-200 hover:border-orange-300 hover:shadow-orange-100/50"
          : "border-dashed border-gray-200 hover:border-purple-300 hover:shadow-purple-100/50"
      } ${
        isClicked ? "scale-95 opacity-75" : "hover:scale-[1.02] hover:shadow-lg"
      }`}
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isOverFileLimit
            ? "bg-gradient-to-br from-orange-50/80 to-yellow-50/80"
            : "bg-gradient-to-br from-purple-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/30"
        }`}
      ></div>

      {/* Main content area - matches document card dimensions */}
      <div className="relative p-6 flex flex-col items-center justify-center h-48">
        {/* Icon container */}
        <div className="flex justify-center mb-4">
          <div
            className={`relative h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isOverFileLimit
                ? "bg-gradient-to-br from-orange-400 to-yellow-500 shadow-lg shadow-orange-500/25"
                : "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40"
            }`}
          >
            {isClicked ? (
              <Loader2 className="h-7 w-7 text-white animate-spin" />
            ) : isOverFileLimit ? (
              <Crown className="h-7 w-7 text-white" />
            ) : (
              <Upload className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-200" />
            )}

            {/* Animated glow effect */}
            {!isOverFileLimit && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-1">
          <h3
            className={`font-medium text-sm transition-colors duration-200 ${
              isOverFileLimit
                ? "text-orange-700"
                : "text-gray-900 group-hover:text-purple-700"
            }`}
          >
            {isClicked
              ? "Loading..."
              : isOverFileLimit
              ? "Upgrade to Add More"
              : "Add New Document"}
          </h3>

          <p
            className={`text-xs transition-colors duration-200 ${
              isOverFileLimit
                ? "text-orange-600"
                : "text-gray-500 group-hover:text-gray-600"
            }`}
          >
            {isClicked
              ? "Please wait..."
              : isOverFileLimit
              ? "Unlock unlimited uploads"
              : "Upload PDF and start chatting"}
          </p>
        </div>

        {/* Pro features for upgrade state */}
        {isOverFileLimit && !isClicked && (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-xs text-orange-600 font-medium">
              <Sparkles className="h-3 w-3 text-orange-500" />
              <span>Up to 20 PDFs</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-orange-600 font-medium">
              <Sparkles className="h-3 w-3 text-orange-500" />
              <span>100 messages per doc</span>
            </div>
          </div>
        )}
      </div>
      {/* Animated border for regular state */}
      {!isOverFileLimit && (
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-purple-200 opacity-0 group-hover:opacity-60 transition-all duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-purple-300 animate-pulse"></div>
        </div>
      )}
    </button>
  );
}

export default PlaceholderDocument;
