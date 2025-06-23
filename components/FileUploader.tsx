'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { RocketIcon, CircleArrowDown, HammerIcon, SaveIcon, CheckCircleIcon } from 'lucide-react';
import { useUpload } from '@/hooks/useUpload'; 
import { StatusText } from '@/hooks/useUpload';
// import { useRouter } from 'next/navigation';
import useSubscription from '@/hooks/useSubscription';
import { useToast } from './ui/use-toast';

function FileUploader() {
  const { progress, handleUpload, status } = useUpload();
  const { isOverFileLimit, filesLoading } = useSubscription();
  // const router = useRouter();
  const { toast } = useToast();

  console.log("isOverFileLimit:", isOverFileLimit, "filesLoading:", filesLoading);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
          if (!isOverFileLimit && !filesLoading) {
            await handleUpload(acceptedFiles[0]);
          } else {
            toast({
              className: 'text-white',
              variant: 'destructive',
              title: 'Free Plan File Limit Reached',
              description: 'You have reached your file upload limit. Please upgrade to Pro to upload more files.',
            });
          }
      } else {
        // do nothing...
      }
    },
    [handleUpload, isOverFileLimit, filesLoading, toast]
  );

    const statusIcons: {
      [key in StatusText]: React.ReactElement;
     } = {
        [StatusText.UPLOADING]: (
          <RocketIcon className="h-10 w-10 animate-spin text-indigo-600" />
        ),
        [StatusText.UPLOADED]: (
          <CheckCircleIcon className="h-10 w-10 text-indigo-600" />
        ),
        [StatusText.SAVING]: <SaveIcon className="h-10 w-10 text-indigo-600" />,
        [StatusText.GENERATING]: (
          <HammerIcon className="h-15 w-15 text-indigo-600 animate-bounce" />
        ),
      };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
  } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${progress === 100 && "hidden"}`}
          role="progressbar"
          style={{
            // @ts-expect-error - CSS custom properties not recognized by React types
            "--value": progress,
            "--size": "12rem",
            "--thickness": "1.3rem",
          }}
          >{progress}%</div>
          {/* render status icon */}
          {
            /* @ts-expect-error - Status key guaranteed to exist in statusIcons object */
            statusIcons[status!]
          }

          {/* @ts-expect-error - Status enum not properly typed in component props */}
          <p className="text-indigo-600 animate-pulse">{status}</p>
        </div>
        )}
        
      { !uploadInProgress && (
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed mt-10 w-[90%] border-indigo-600 text-indigo-600 rounded-lg h-96 flex items-center justify-center ${
          isFocused || isDragAccept ? 'bg-indigo-300' : 'bg-indigo-100'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          {isDragActive ? (
            <>
              <RocketIcon className="h-20 w-20 animate-ping" />
              <p>Drop the files here ...</p>
            </>
          ) : (
            <>
              <CircleArrowDown className="h-20 w-20 animate-bounce" />
              <p>Drag n drop a PDF here, or click to select</p>
            </>
          )}
        </div>
      </div> )}
    </div>
  );
}

export default FileUploader;