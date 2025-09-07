"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Loader2Icon,
  RotateCw,
  ZoomInIcon,
  ZoomOutIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PdfViewProps {
  url?: string;
  fileId?: string;
  bucketName?: string;
}

function PdfView({ url, fileId, bucketName = "uploads" }: PdfViewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    const getPdfUrl = async () => {
      setLoading(true);
      setError(null);

      try {
        let finalUrl = "";

        if (url) {
          // Direct URL provided
          if (typeof url !== "string" || url.trim() === "") {
            throw new Error("Invalid URL provided");
          }
          finalUrl = url;
        } else if (fileId) {
          // Get signed URL from Supabase storage
          const { data, error } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(fileId, 3600); // 1 hour expiry

          if (error) throw error;
          finalUrl = data.signedUrl;
        } else {
          throw new Error("Either url or fileId must be provided");
        }

        setPdfUrl(finalUrl);
      } catch (err) {
        console.error("Error getting PDF URL:", err);
        setError(err instanceof Error ? err.message : "Failed to load PDF");
      } finally {
        setLoading(false);
      }
    };

    // Only run if we have url or fileId
    if (url || fileId) {
      getPdfUrl();
    } else {
      setError("Either url or fileId must be provided");
      setLoading(false);
    }
  }, [url, fileId, bucketName]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null); // Clear any previous errors
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setError(`Failed to load PDF document: ${error.message}`);
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Memoize the options object to prevent unnecessary reloads
  const documentOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    []
  );

  // Don't render anything during SSR
  if (typeof window === "undefined") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200">
        <div className="relative">
          <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 animate-ping"></div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Loading PDF Document
          </p>
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2Icon className="h-4 w-4 animate-spin" />
            <span>Please wait while we prepare your document...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-b from-red-50 to-white rounded-2xl border border-red-200 p-8">
        <div className="relative mb-4">
          <div className="h-16 w-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur-xl opacity-20"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Failed to Load PDF
        </h3>
        <p className="text-gray-600 text-center mb-4 max-w-md">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200">
        <div className="h-16 w-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <p className="text-gray-600 font-medium">No PDF URL available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Controls */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Left controls - Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-lg font-medium text-sm">
              {pageNumber} of {numPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right controls - Zoom and Rotate */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <ZoomOutIcon className="h-4 w-4" />
            </Button>

            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-lg font-medium text-sm min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <ZoomInIcon className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            <Button
              variant="outline"
              size="sm"
              onClick={rotate}
              className="hover:bg-green-50 hover:border-green-300"
            >
              <RotateCw className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Rotate</span>
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Document Container */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-center">
          <div className="relative group">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>

            {/* PDF Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                options={documentOptions}
                loading={
                  <div className="flex flex-col items-center justify-center h-96 p-8">
                    <div className="relative mb-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30 animate-ping"></div>
                    </div>
                    <p className="text-gray-600 font-medium">
                      Loading document...
                    </p>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  className="shadow-sm"
                  loading={
                    <div className="flex flex-col items-center justify-center h-96 p-8">
                      <div className="relative mb-4">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center animate-spin">
                          <Loader2Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-600 font-medium">
                        Loading page {pageNumber}...
                      </p>
                    </div>
                  }
                  onLoadError={(error) => {
                    console.error("Page load error:", error);
                    setError(
                      `Failed to load page ${pageNumber}: ${error.message}`
                    );
                  }}
                />
              </Document>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfView;
