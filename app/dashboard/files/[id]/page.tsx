import Chat from "@/components/Chat";
import PdfView from "@/components/PdfView";
import { auth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);
async function ChatToFilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {  
  auth.protect();
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }
  
  // Query the file from Supabase
  const { data: fileData, error } = await supabase
    .from('uploads')
    .select('*') // Get all fields to have more info for debugging
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Supabase query error:', error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading File</h1>
          <p className="text-gray-600">Database error: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">File Not Found</h1>
          <p className="text-gray-600">The requested file could not be found or you don&apos;t have access to it.</p>
        </div>
      </div>
    );
  }

  const url = fileData.file_url; // Changed from download_url to file_url

  if (!url) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid File URL</h1>
          <p className="text-gray-600">The file URL is missing or invalid.</p>
          <p className="text-sm text-gray-500 mt-2">File data: {JSON.stringify(fileData, null, 2)}</p>
        </div>
      </div>
    );
  }
  
  return ( 
    <div className="grid lg:grid-cols-5 h-full overflow-hidden">
      {/*Right */}
      <div className="col-span-5 lg:col-span-2 overflow-auto">
        {/* Chat */}
        <Chat id={id} />
      </div>
      
      {/* Left */}
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
        {/* PDFView */}
        <PdfView fileId={fileData.file_path} />
      </div>
    </div>
  );
}

export default ChatToFilePage;