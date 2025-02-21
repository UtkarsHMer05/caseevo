"use client";
// This directive tells Next.js that this component should run in the browser (client-side)
// which allows us to use hooks like useState, useTransition, and others.

import { Progress } from "@/components/ui/progress";
// Imports a Progress component (likely a progress bar UI) to show upload progress.
import { useUploadThing } from "@/lib/uploadthing";
// Imports a custom hook that handles file uploading through UploadThing.
import { cn } from "@/lib/utils";
// Imports a utility function to conditionally join class names.
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
// Imports some icon components (Image, Loader2, MousePointerSquareDashed) from lucide-react.
import { useRouter } from "next/navigation";
// Imports Next.js router hook to programmatically navigate between pages.
import { useState, useTransition } from "react";
// Imports React hooks: useState (for keeping state) and useTransition (for scheduling state transitions).
import Dropzone, { FileRejection } from "react-dropzone";
// Imports Dropzone and its FileRejection type to handle file drag-and-drop.
import { toast } from "sonner";
// Imports a toast notification library to show messages to the user.

const Page = () => {
  // useState hook for whether the user is currently dragging a file over the drop zone.
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  // useState hook to store the current upload progress (a number from 0 to 100 probably).
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  // useRouter from next/navigation allows us to navigate to a different page after upload.
  const router = useRouter();

  // IMPORTANT: We must declare useTransition before using startTransition in the upload hook.
  // useTransition returns a boolean (indicating if a transition is pending) and a function (startTransition) to start a non-urgent update.
  const [isPending, startTransition] = useTransition();

  // useUploadThing is a custom hook that manages file uploads.
  // We pass it a string "imageUploader" which is the slug identifying this upload route.
  // It accepts configuration callbacks:
  // - onClientUploadComplete: called when the upload successfully completes.
  // - onUploadProgress: called repeatedly to update the upload progress.
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    // When the upload is complete, this callback receives an array (we use [data]) where data contains the information we need.
    onClientUploadComplete: ([data]) => {
      // Extract configId from the response data; this might be used to know which configuration to load next.
      const configId = data.serverData.configId;
      // Use startTransition to schedule a navigation update that is lower priority.
      // This means the UI stays responsive while transitioning.
      startTransition(() => {
        // Navigate the user to the design configuration page with the configId as a query param.
        router.push(`/configure/design?id=${configId}`);
      });
    },
    // This callback updates the upload progress state.
    onUploadProgress(p) {
      // p is the progress value (likely a percentage or similar metric).
      setUploadProgress(p);
    },
  });

  // Callback that is called when files are rejected (e.g. wrong file type).
  // It receives an array of FileRejection objects.
  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    // Take the first rejected file for displaying an error.
    const [file] = rejectedFiles;

    // Reset the drag over state to false.
    setIsDragOver(false);
    // Show a toast notification error with the name of the file not accepted
    // and a message telling the user to upload a valid image file.
    toast.error(
      <span style={{ color: "black" }}>{file.file.name} is not supported</span>,
      {
        description: (
          <span style={{ color: "red" }}>
            Please upload a valid image file (PNG, JPG, JPEG)
          </span>
        ),
      }
    );
  };

  // Callback that is called when files are accepted.
  // It receives an array of accepted File objects.
  const onDropAccepted = (acceptedFiles: File[]) => {
    // Begin the upload process using the startUpload function from useUploadThing.
    // The second argument can hold additional data, here we set configId as undefined.
    startUpload(acceptedFiles, { configId: undefined });

    // Reset the drag state.
    setIsDragOver(false);
  };

  return (
    // Main container div for the upload page.
    // Tailwind classes used here:
    // - "relative": positions the element relative so that any absolutely positioned child is relative to it.
    // - "h-full flex-1": makes the div take full available height and flex-grow.
    // - "my-16": applies vertical margin (spacing on top and bottom).
    // - "w-full": full width.
    // - "rounded-xl": gives the container extra-large rounded corners.
    // - "bg-gray-900/5": a background color that is a very transparent gray.
    // - "p-2": padding of 0.5rem on all sides.
    // - "ring-1 ring-inset ring-gray-900/10": an inset border (ring) with a slight gray color.
    // - "lg:rounded-2xl": on large screens, use even larger rounded corners.
    // - "flex justify-center flex-col items-center": a flex container that centers its items both horizontally and vertically.
    // Additionally, the conditional classes:
    // - When isDragOver is true, it also adds "ring-blue-900/25 bg-blue-900/10": a blue tinted border and background.
    <div
      className={cn(
        "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
        {
          "ring-blue-900/25 bg-blue-900/10": isDragOver,
        }
      )}
    >
      {/* Inner container div for the upload area */}
      {/* Tailwind classes:
          - "relative": for any absolute positioning inside.
          - "flex flex-1 flex-col items-center justify-center": sets a flex layout that centers children vertically and horizontally.
          - "w-full": takes full width.
      */}
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        {/* Dropzone component to handle drag-and-drop file uploads.
            Props passed to Dropzone:
            - onDropRejected: callback when file is rejected.
            - onDropAccepted: callback when file is accepted.
            - accept: specifies allowed file types.
            - onDragEnter & onDragLeave: update state when file is dragged over.
        */}
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            // getRootProps provides properties to attach to the container element that acts as the drop area.
            // getInputProps provides properties for the hidden input element.
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              {/* Hidden input element for choosing files via clicking. */}
              <input {...getInputProps()} />
              {/* Conditional rendering based on the state:
                  - If a file is being dragged over (isDragOver), show an icon (MousePointerSquareDashed).
                  - If uploading is happening (isUploading) or a transition is pending (isPending), show a spinning loader icon (Loader2).
                  - Otherwise, display the Image icon as the default.
              */}
              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
              ) : (
                <Image className="h-6 w-6 text-zinc-500 mb-2" />
              )}
              {/* A container for the text instructions and upload status */}
              {/* Tailwind classes:
                  - "flex flex-col justify-center": makes a flex column centered vertically.
                  - "mb-2": margin-bottom.
                  - "text-sm": small text.
                  - "text-zinc-700": text color (zinc is a type of gray).
              */}
              <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                {/* Conditional rendering:
                    - If the file is uploading, show "Uploading..." text along with a progress bar.
                    - If a transition is pending (after upload complete and before navigation), show "Redirecting, please wait...".
                    - If a file is being dragged over, instruct the user to "Drop file" to upload.
                    - Otherwise, instruct the user to either click to upload or drag and drop.
                */}
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    {/* Progress bar showing the upload progress.
                        Tailwind classes:
                        - "mt-2": margin-top.
                        - "w-40": fixed width (10rem).
                        - "h-2": fixed height (0.5rem).
                        - "bg-gray-300": background color of the bar.
                    */}
                    <Progress
                      value={uploadProgress}
                      className="mt-2 w-40 h-2 bg-gray-300"
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirecting, please wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Drop file</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                )}
              </div>
              {/* If there is no pending transition, display accepted file types */}
              {isPending ? null : (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default Page;
