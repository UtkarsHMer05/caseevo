"use client"; // This file runs on the client side (in the browser).

// Import everything from React so we can use components, refs, etc.
import * as React from "react";
// Import all primitive dialog components from Radix UI, which provides accessible dialog components.
import * as DialogPrimitive from "@radix-ui/react-dialog";
// Import the X icon from lucide-react to use as a close button icon.
import { X } from "lucide-react";

// Import the cn helper function, which helps combine multiple class names into one string.
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// 1. Basic Dialog Components Setup
// -----------------------------------------------------------------------------

// We assign the root of the dialog to a constant. This is the main container for our dialog.
const Dialog = DialogPrimitive.Root;

// Define a trigger that will open the dialog when clicked.
const DialogTrigger = DialogPrimitive.Trigger;

// The DialogPortal is used to render the dialog outside the main DOM hierarchy.
// This is useful for modals so that they can appear on top of all other content.
const DialogPortal = DialogPrimitive.Portal;

// DialogClose is a component that will allow users to close the dialog.
const DialogClose = DialogPrimitive.Close;

// -----------------------------------------------------------------------------
// 2. DialogOverlay Component
// -----------------------------------------------------------------------------

/*
  The DialogOverlay component creates a dark transparent layer in the background when
  the dialog is open. This overlay helps focus the user's attention on the dialog.
*/
const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  // Render the overlay from Radix UI.
  <DialogPrimitive.Overlay
    ref={ref}
    // Combine default classes with any extra passed via className.
    className={cn(
      // "fixed": Positions the overlay fixed relative to the viewport.
      // "inset-0": Sets top, right, bottom, left to 0, covering the whole screen.
      // "z-[99999]": Very high z-index to ensure it appears on top.
      // "bg-black/80": Black background with 80% opacity.
      // "data-[state=open]:animate-in": When open, run the "animate-in" animation.
      // "data-[state=closed]:animate-out": When closing, run the "animate-out" animation.
      // "data-[state=closed]:fade-out-0": Fade out when closing.
      // "data-[state=open]:fade-in-0": Fade in when opening.
      "fixed inset-0 z-[99999] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props} // Spread any additional props.
  />
));
// Give the DialogOverlay a display name for debugging purposes.
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// -----------------------------------------------------------------------------
// 3. DialogContent Component
// -----------------------------------------------------------------------------

/*
  DialogContent is the main container for the content of the dialog (the modal).
  It uses a portal to render over the rest of the document and includes animations
  for opening and closing.
*/
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  // Use the Portal to render the DialogContent outside the normal DOM hierarchy.
  <DialogPortal>
    {/* Render the overlay behind the content */}
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      // Compose a string of classes to style the content.
      className={cn(
        // "fixed": Positions the content in a fixed position.
        // "left-[50%] top-[50%]": Positions the content at the center of the viewport.
        // "z-50": A high z-index so it appears above the overlay.
        // "grid": Use CSS Grid for layout.
        // "w-full max-w-lg": Full width up to a maximum width (large size).
        // "translate-x-[-50%] translate-y-[-50%]": Adjusts position so the element is perfectly centered.
        // "gap-4": Provides a gap between child elements.
        // "border bg-background p-6": Adds a border, background color, and padding.
        // "shadow-lg": Applies a large shadow for a raised effect.
        // "duration-200": Sets the animation duration to 200ms.
        // Data attribute animations for state open/close:
        //   "data-[state=open]:animate-in": Animate in when open.
        //   "data-[state=closed]:animate-out": Animate out when closing.
        //   "data-[state=closed]:fade-out-0" and "data-[state=open]:fade-in-0": Fade effects.
        //   "data-[state=closed]:zoom-out-95" and "data-[state=open]:zoom-in-95": Zoom effects.
        //   "data-[state=closed]:slide-out-to-left-1/2" and "data-[state=closed]:slide-out-to-top-[48%]": Slide effects.
        //   "data-[state=open]:slide-in-from-left-1/2" and "data-[state=open]:slide-in-from-top-[48%]": Slide in effects.
        // "sm:rounded-lg": On small screens and above, round the corners.
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {/* Render the children passed into the content */}
      {children}
      {/* Include a close button in the top-right corner */}
      <DialogPrimitive.Close
        // Classes to style the close button:
        // "absolute right-4 top-4": Positions the button absolutely 1rem from the top and right.
        // "rounded-sm": Slightly rounds the corners.
        // "opacity-70": Semi-transparent initially.
        // "ring-offset-background": Sets the offset background for focus ring.
        // "transition-opacity": Smooth transition for opacity changes.
        // "hover:opacity-100": Fully opaque on hover.
        // "focus:outline-none": No default outline when focused.
        // "focus:ring-2 focus:ring-ring focus:ring-offset-2": Shows a focus ring for accessibility.
        // "disabled:pointer-events-none": Disables pointer events when the button is disabled.
        // "data-[state=open]:bg-accent": When the dialog is open, sets a background accent.
        // "data-[state=open]:text-muted-foreground": When open, sets text color for muted foreground.
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        {/* Render the X icon as the close symbol */}
        <X className="h-4 w-4" />
        {/* "sr-only" makes the following text only available to screen readers for accessibility */}
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// -----------------------------------------------------------------------------
// 4. DialogHeader Component
// -----------------------------------------------------------------------------

/*
  DialogHeader is a simple container for the header of the dialog.
  It groups together elements like the title and description.
*/
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    // Combine provided classes with the default ones:
    // "flex flex-col": Displays children in a column using flexbox.
    // "space-y-1.5": Adds vertical spacing between children (1.5 units).
    // "text-center": Centers text; on small screens, it remains centered.
    // "sm:text-left": On small screens and above, text aligns to the left.
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// -----------------------------------------------------------------------------
// 5. DialogFooter Component
// -----------------------------------------------------------------------------

/*
  DialogFooter is a container for actions at the bottom of the dialog.
  It arranges buttons or other elements for actions (like "Cancel" or "Submit").
*/
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    // Classes explained:
    // "flex flex-col-reverse": Displays children in a column in reverse order.
    // "sm:flex-row": On small screens and up, changes layout to a row.
    // "sm:justify-end": Aligns children to the end (right side) on small screens.
    // "sm:space-x-2": Adds horizontal spacing between children on small screens.
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

// -----------------------------------------------------------------------------
// 6. DialogTitle Component
// -----------------------------------------------------------------------------

/*
  DialogTitle displays the title of the dialog.
  It is important for screen readers and for giving users an idea of what the dialog is about.
*/
const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    // Class names:
    // "text-lg": Sets the text size to large.
    // "font-semibold": Uses a semi-bold font.
    // "leading-none": Removes extra line height.
    // "tracking-tight": Reduces space between letters.
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// -----------------------------------------------------------------------------
// 7. DialogDescription Component
// -----------------------------------------------------------------------------

/*
  DialogDescription is used to provide additional information or instructions in the dialog.
  It is styled to appear less prominent than the title.
*/
const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    // Class names:
    // "text-sm": Small text size.
    // "text-muted-foreground": Uses a muted color (less contrast) for less prominence.
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// -----------------------------------------------------------------------------
// 8. Exporting Dialog Components
// -----------------------------------------------------------------------------

// Export all the dialog components so that they can be used in other parts of the application.
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
