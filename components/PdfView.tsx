'use client'

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import { useMemo } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
// Configure PDF.js worker - try multiple approaches for better compatibility
if (typeof window !== 'undefined') {
  // Option 1: Use CDN worker (most reliable)
  // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  
  // Option 2: Alternative - use local worker if you have it in public folder
  // pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
  
  // Option 3: Alternative - use different CDN
  // pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

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

function PdfView({ url, fileId, bucketName = 'uploads' }: PdfViewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    const getPdfUrl = async () => {
      setLoading(true);
      setError(null);

      try {
        let finalUrl = '';

        if (url) {
          // Direct URL provided
          if (typeof url !== 'string' || url.trim() === '') {
            throw new Error('Invalid URL provided');
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
          throw new Error('Either url or fileId must be provided');
        }

        setPdfUrl(finalUrl);
      } catch (err) {
        console.error('Error getting PDF URL:', err);
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };

    // Only run if we have url or fileId
    if (url || fileId) {
      getPdfUrl();
    } else {
      setError('Either url or fileId must be provided');
      setLoading(false);
    }
  }, [url, fileId, bucketName]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null); // Clear any previous errors
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError(`Failed to load PDF document: ${error.message}`);
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Memoize the options object to prevent unnecessary reloads
  const documentOptions = useMemo(() => ({
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  }), []);

  // Don't render anything during SSR
  if (typeof window === 'undefined') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading PDF...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 space-y-2">
        <p>Error: {error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No PDF URL available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Controls */}
      <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
        >
          Previous
        </Button>
        
        <span className="px-2 text-sm">
          {pageNumber} of {numPages}
        </span>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
        >
          Next
        </Button>
        
        <div className="h-4 border-l border-gray-300 mx-2" />
        
        <Button variant="outline" size="sm" onClick={zoomOut}>
          <ZoomOutIcon className="h-4 w-4" />
        </Button>
        
        <span className="px-2 text-sm">{Math.round(scale * 100)}%</span>
        
        <Button variant="outline" size="sm" onClick={zoomIn}>
          <ZoomInIcon className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm" onClick={rotate}>
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* PDF Document */}
      <div className="border border-gray-200 shadow-lg">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          options={documentOptions}
          loading={
            <div className="flex items-center justify-center h-64">
              <Loader2Icon className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading document...</span>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            loading={
              <div className="flex items-center justify-center h-64">
                <Loader2Icon className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading page...</span>
              </div>
            }
            onLoadError={(error) => {
              console.error('Page load error:', error);
              setError(`Failed to load page ${pageNumber}: ${error.message}`);
            }}
          />
        </Document>
      </div>
    </div>
  );
}

export default PdfView;