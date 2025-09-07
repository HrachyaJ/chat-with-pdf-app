"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  RocketIcon,
  Upload,
  HammerIcon,
  SaveIcon,
  CheckCircleIcon,
  FileText,
  Sparkles,
  Crown,
} from "lucide-react";
import { useUpload } from "@/hooks/useUpload";
import { StatusText } from "@/hooks/useUpload";
import useSubscription from "@/hooks/useSubscription";
import { useToast } from "./ui/use-toast";

function FileUploader() {
  const { progress, handleUpload, status } = useUpload();
  const { isOverFileLimit, filesLoading } = useSubscription();
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        if (!isOverFileLimit && !filesLoading) {
          await handleUpload(acceptedFiles[0]);
        } else {
          toast({
            className: "text-white",
            variant: "destructive",
            title: "Free Plan File Limit Reached",
            description:
              "You have reached your file upload limit. Please upgrade to Pro to upload more files.",
          });
        }
      }
    },
    [handleUpload, isOverFileLimit, filesLoading, toast]
  );

  const statusConfig: {
    [key in StatusText]: {
      icon: React.ReactElement;
      message: string;
      gradient: string;
    };
  } = {
    [StatusText.UPLOADING]: {
      icon: <RocketIcon className="h-12 w-12 text-white animate-spin" />,
      message: "Uploading your document...",
      gradient: "from-blue-500 to-purple-500",
    },
    [StatusText.UPLOADED]: {
      icon: <CheckCircleIcon className="h-12 w-12 text-white" />,
      message: "Document uploaded successfully!",
      gradient: "from-green-500 to-emerald-500",
    },
    [StatusText.SAVING]: {
      icon: <SaveIcon className="h-12 w-12 text-white animate-pulse" />,
      message: "Saving to your library...",
      gradient: "from-purple-500 to-pink-500",
    },
    [StatusText.GENERATING]: {
      icon: <HammerIcon className="h-12 w-12 text-white animate-bounce" />,
      message: "AI is analyzing your document...",
      gradient: "from-orange-500 to-red-500",
    },
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      multiple: false,
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {!uploadInProgress && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Upload className="h-4 w-4" />
              Upload Document
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Add Your PDF Document
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Upload a PDF and let AI help you extract insights, answer
              questions, and analyze content instantly
            </p>
          </div>
        )}

        {/* Upload Progress */}
        {uploadInProgress && (
          <div className="flex flex-col items-center justify-center space-y-8 py-16">
            {/* Progress Circle */}
            <div className="relative">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 56 * (1 - (progress || 0) / 100)
                  }`}
                  className="text-purple-600 transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(progress || 0)}%
                </span>
              </div>
            </div>

            {/* Status Card */}
            {status &&
              Object.values(StatusText).includes(status as StatusText) && (
                <div className="text-center">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${
                      statusConfig[status as StatusText].gradient
                    } rounded-3xl shadow-2xl mb-4`}
                  >
                    {statusConfig[status as StatusText].icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {statusConfig[status as StatusText].message}
                  </h3>
                  <p className="text-gray-600">
                    This may take a few moments, please don't close this page
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Upload Zone */}
        {!uploadInProgress && (
          <div className="relative">
            <div
              {...getRootProps()}
              className={`relative group cursor-pointer transition-all duration-300 ${
                isOverFileLimit ? "cursor-not-allowed" : ""
              }`}
            >
              <input {...getInputProps()} disabled={isOverFileLimit ?? false} />

              {/* Upload Area */}
              <div
                className={`relative rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                  isOverFileLimit
                    ? "border-orange-300 bg-orange-50"
                    : isDragActive || isFocused || isDragAccept
                    ? "border-purple-400 bg-purple-50 scale-[1.02]"
                    : "border-purple-300 bg-white hover:border-purple-400 hover:bg-purple-50 hover:scale-[1.01]"
                } shadow-lg hover:shadow-xl`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
                    isOverFileLimit
                      ? "bg-gradient-to-br from-orange-500/5 to-yellow-500/5"
                      : isDragActive
                      ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                      : "bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100"
                  }`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`relative h-20 w-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
                        isOverFileLimit
                          ? "bg-gradient-to-r from-orange-400 to-yellow-500"
                          : isDragActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 scale-110"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-110"
                      }`}
                    >
                      {isOverFileLimit ? (
                        <Crown className="h-10 w-10 text-white" />
                      ) : isDragActive ? (
                        <RocketIcon className="h-10 w-10 text-white animate-pulse" />
                      ) : (
                        <Upload className="h-10 w-10 text-white" />
                      )}

                      {/* Glow Effect */}
                      {!isOverFileLimit && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      )}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-4">
                    {isOverFileLimit ? (
                      <>
                        <h3 className="text-xl font-semibold text-orange-700">
                          Upgrade Required
                        </h3>
                        <p className="text-orange-600">
                          You've reached your file upload limit
                        </p>
                        <div className="space-y-2 text-sm text-orange-600">
                          <div className="flex items-center justify-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            <span>Pro: Upload up to 20 PDFs</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            <span>Pro: 100 messages per document</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {isDragActive
                            ? "Drop your PDF here!"
                            : "Upload Your PDF Document"}
                        </h3>
                        <p className="text-gray-600">
                          {isDragActive
                            ? "Release to upload your document"
                            : "Drag and drop your PDF here, or click to browse"}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>PDF only</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            <span>Max 50MB</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span>AI-powered analysis</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Your documents are encrypted and processed securely. We never
                store your content permanently.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploader;
