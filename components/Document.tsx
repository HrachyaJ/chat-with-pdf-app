"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { useTransition } from "react";
import useSubscription from "@/hooks/useSubscription";
import { DownloadCloud, Trash2Icon, FileText, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { deleteDocument } from "@/actions/deleteDocument";

function Document({
  id,
  name,
  size,
  downloadUrl,
}: {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
}) {
  const router = useRouter();
  const [isDeleting, startTransition] = useTransition();
  const { hasActiveMembership } = useSubscription();

  return (
    <div className="group relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 overflow-hidden">
      {/* Header */}
      <div
        className="py-15 cursor-pointer"
        onClick={() => {
          router.push(`/dashboard/files/${id}`);
        }}
      >
        {/* Pro Badge */}
        {!hasActiveMembership && (
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <Crown className="h-3 w-3" />
              PRO
            </div>
          </div>
        )}

        {/* File Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* File Info */}
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-purple-700 transition-colors">
            {name}
          </h3>
          <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
            <span>
              {byteSize(size).value} {byteSize(size).unit}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 cursor-pointer"
            disabled={isDeleting || !hasActiveMembership}
            onClick={(e) => {
              e.stopPropagation();
              const prompt = window.confirm(
                "Are you sure you want to delete this document? This action cannot be undone."
              );
              if (prompt) {
                startTransition(async () => {
                  await deleteDocument(id);
                });
              }
            }}
          >
            <Trash2Icon className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
            {!hasActiveMembership && (
              <Crown className="h-3 w-3 ml-1 text-yellow-500" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={downloadUrl}
              download
              className="flex items-center justify-center gap-2"
            >
              <DownloadCloud className="h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Document;
