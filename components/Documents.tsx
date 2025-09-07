import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import PlaceholderDocument from "./PlaceholderDocument";
import Document from "./Document";
import {
  FileText,
  Sparkles,
  TrendingUp,
  Shield,
  AlertCircle,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function Documents() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="relative">
              <div className="h-20 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Authentication Required
              </h2>
              <p className="text-gray-600">
                Please log in to view your documents
              </p>
            </div>
          </div>
        </div>
      );
    }

    const { data: documents, error } = await supabase
      .from("uploads")
      .select("id, file_name, file_size, file_url")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="relative">
              <div className="h-20 w-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <AlertCircle className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Error Loading Documents
              </h2>
              <p className="text-gray-600 text-sm">{error.message}</p>
              <p className="text-gray-500 text-xs">
                Please try refreshing the page or contact support if the issue
                persists.
              </p>
            </div>
          </div>
        </div>
      );
    }

    const hasDocuments = documents && documents.length > 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Your Library
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Document Library
            </h1>
            {hasDocuments ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>
                    {documents.length} document
                    {documents.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>AI-powered analysis ready</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                Upload your first PDF to start chatting with your documents
                using AI
              </p>
            )}
          </div>

          {/* Documents Grid */}
          {hasDocuments ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {documents.map((doc) => (
                <Document
                  key={doc.id}
                  id={doc.id}
                  name={doc.file_name}
                  size={doc.file_size}
                  downloadUrl={doc.file_url}
                />
              ))}
              <PlaceholderDocument />
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="relative inline-block mb-8">
                <div className="h-24 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              </div>

              <div className="space-y-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  No Documents Yet
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Upload your first PDF to start chatting with your documents
                  using AI
                </p>
              </div>

              <div className="flex justify-center">
                <div className="max-w-sm">
                  <PlaceholderDocument />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Component error:", error);
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <div className="h-20 w-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Unexpected Error
            </h2>
            <p className="text-gray-600 text-sm">
              {error instanceof Error
                ? error.message
                : "An unknown error occurred"}
            </p>
            <p className="text-gray-500 text-xs">
              Please try refreshing the page or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Documents;
