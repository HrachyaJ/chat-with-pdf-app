import { auth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';
import PlaceholderDocument from "./PlaceholderDocument";
import Document from "./Document";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function Documents() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return <div>Please log in to view documents</div>;
    }

    const { data: documents, error } = await supabase
      .from('uploads')
      .select('id, file_name, file_size, file_url') // Select all columns first
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      return <div>Error loading documents: {error.message}</div>;
    }

    return (
      <div className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
        {documents.map((doc) => (
          <Document
            key={doc.id}
            id={doc.id}
            name={doc.file_name} // Adjust based on your column name
            size={doc.file_size}
            downloadUrl={doc.file_url}
          />
        ))}
        <PlaceholderDocument />
      </div>
    );
  } catch (error) {
    console.error('Component error:', error);
    return <div>Unexpected error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }
}

export default Documents;