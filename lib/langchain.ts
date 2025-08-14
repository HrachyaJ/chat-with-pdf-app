// import { CreateHistoryAwareRetrieverParams } from './../node_modules/langchain/dist/chains/history_aware_retriever.d';
// import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { createRetrievalChain } from "langchain/chains/retrieval"
// import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import pineconeClient from './pinecone';
import { PineconeStore } from "@langchain/pinecone";
// import { PineconeConflictError } from '@pinecone-database/pinecone/dist/errors';
import { Index, RecordMetadata } from '@pinecone-database/pinecone';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { Ollama, OllamaEmbeddings } from "@langchain/ollama";

const model = new Ollama({
  baseUrl: "https://hrachyaj-ollama-chat-api.hf.space", // default Ollama URL
  model: "llama3.2:1b", // or llama3, mistral, etc.
  numCtx: 4096,
  // Reduce number of threads if you have limited CPU cores
  numThread: 4,
  // Enable GPU acceleration if available
  numGpu: 1,
  // Reduce batch size for faster initial response
  numBatch: 256,
  // Set temperature for more focused responses
  temperature: 0.7,
  // Reduce top_p for faster inference
  topP: 0.9,
});

const embeddings = new OllamaEmbeddings({
  model: "mxbai-embed-large", // This one is working fine
  baseUrl: "https://hrachyaj-ollama-chat-api.hf.space",
});

export const indexName = "luminous-juniper";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchMessageFromDb(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  console.log("--- Fetching chat history from the supabase database... ---")
  
  const { data: chats, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .eq('file_id', docId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch chat history: ${error.message}`);
  }

  const chatHistory = chats.map((doc) =>
   doc.role === "human"
      ? new HumanMessage(doc.message)
      : new AIMessage(doc.message)
  );

  console.log(`--- Fetched last ${chatHistory.length} messages successfully ---`)
  console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  console.log("--- Fetching document from Supabase... ---");
  
  // Fetch document metadata from your database table
  // Adjust this query based on your actual table structure
  const { data: documentData, error: fetchError } = await supabase
    .from('uploads')
    .select('*')
    .eq('id', docId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !documentData) {
    throw new Error(`Document not found: ${fetchError?.message}`);
  }

  // Get the file path or name from your document data
  // Adjust this based on your table structure
  const filePath = documentData.file_path || documentData.storage_path;
  
  if (!filePath) {
    throw new Error("File path not found in document data");
  }

  console.log(`--- Downloading file from Supabase Storage: ${filePath} ---`);

  // Download the file from Supabase Storage
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('uploads') // Replace with your actual bucket name
    .download(filePath);

  if (downloadError || !fileData) {
    throw new Error(`Failed to download file: ${downloadError?.message}`);
  }

  console.log("--- Loading PDF document... ---");
  const loader = new PDFLoader(fileData);
  const docs = await loader.load();

  console.log("--- Splitting document into chunks... ---");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`--- Split into ${splitDocs.length} parts ---`);
  return splitDocs;
} 

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace value provided.");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let pineconeVectorStore;

  console.log("Connecting to Pinecone index:", indexName);
  console.log("--- Generating embeddings for split documents.. ---");
  
  // Remove this line - use the global embeddings instance instead
  // const embeddings = new OllamaEmbeddings();

  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(`Namespace ${docId} already exists. Using existing namespace.`);
  
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    const splitDocs = await generateDocs(docId);

    console.log(
      `--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store... ---`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings, // Use the global embeddings instance
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );

    return pineconeVectorStore;
  }
}

const generateLangchainCompletion = async (docId: string, question: string) => {
  try {
    console.log("--- Starting completion generation ---");
    console.log("Question:", question);
    
    // Get vector store
    const pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);
    
    if (!pineconeVectorStore) {
      throw new Error("Pinecone vector store not found");
    }

    console.log("--- Creating a retriever... ---")
    const retriever = pineconeVectorStore.asRetriever({
      k: 3, // Get top 3 relevant documents
    });

    // Get chat history but limit and clean it
    console.log("--- Fetching chat history... ---")
    const allChatHistory = await fetchMessageFromDb(docId);
    
    // CRUCIAL: Limit and deduplicate chat history
    const recentHistory = allChatHistory
      .slice(-6) // Only last 6 messages
      .filter((msg, index, arr) => {
        // Remove consecutive duplicate messages
        if (index === 0) return true;
        return msg.content !== arr[index - 1].content;
      })
      .slice(-4); // Final limit to 4 messages
    
    console.log(`--- Using ${recentHistory.length} recent messages ---`);
    console.log("Recent messages:", recentHistory.map(msg => msg.content.toString().substring(0, 50)));

    // Get relevant documents for the current question
    console.log("--- Retrieving relevant documents... ---");
    const relevantDocs = await retriever.getRelevantDocuments(question);
    console.log(`--- Found ${relevantDocs.length} relevant documents ---`);

    // Create a simple, direct prompt
    const contextText = relevantDocs
      .map(doc => doc.pageContent)
      .join('\n\n')
      .substring(0, 3000); // Limit context length

    // Build conversation context from recent history
    const conversationContext = recentHistory.length > 0 
      ? recentHistory.map(msg => 
          `${msg instanceof HumanMessage ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')
      : '';

    // Simple, direct prompt
    const prompt = `Context from document:
${contextText}

${conversationContext ? `Recent conversation:\n${conversationContext}\n` : ''}
Current question: ${question}

Please answer the current question based on the document context provided. If the context doesn't contain relevant information, say so clearly. Keep your response concise and helpful.

Answer:`;

    console.log("--- Calling Ollama directly... ---");
    console.log("Prompt length:", prompt.length);
    
    // Direct call to model with timeout
    const response = await Promise.race([
      model.invoke(prompt),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Model response timeout')), 45000)
      )
    ]) as string;

    console.log("--- Response generated successfully ---");
    console.log("Response preview:", response.substring(0, 200));
    
    return response;

  } catch (error) {
    console.error("Error in generateLangchainCompletion:", error);
    
    // Fallback response
    if (error instanceof Error && error.message.includes('timeout')) {
      return "I apologize, but the response took too long to generate. Please try asking a shorter, more specific question.";
    }
    
    throw error;
  }
};

export { model, generateLangchainCompletion };