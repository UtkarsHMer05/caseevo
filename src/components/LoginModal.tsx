// Import types for managing React state
import type { Dispatch, SetStateAction } from "react";

// Import dialog components that define the modal structure and accessibility features.
import {
  Dialog, // The root component for the modal dialog.
  DialogContent, // The main container for the content of the dialog.
  DialogDescription, // A component to provide descriptive text.
  DialogHeader, // Container for the header of the dialog.
  DialogTitle, // The title heading of the dialog.
} from "./ui/dialog";

// Import Next.js's Image component for optimized images.
import Image from "next/image";

// Import prebuilt links for login and register from the authentication library.
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

// Import a helper function to generate button styles based on variant.
import { buttonVariants } from "./ui/button";

/**
 * LoginModal component renders a modal dialog that prompts the user to log in or sign up.
 *
 * Props:
 * - isOpen: Boolean value that determines whether the modal is currently visible.
 * - setIsOpen: Function to update the isOpen state (used to open or close the dialog).
 */
const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    // <Dialog> is the container for the modal dialog.
    // onOpenChange: Callback that fires when the open state changes (e.g., clicking outside closes it).
    // open: Controls whether the dialog is displayed.
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      {/*
        <DialogContent> wraps the actual content inside the dialog.
        Tailwind Classes used:
          - "z-[9999999]": Sets a very high z-index to keep the modal on top of all other elements.
      */}
      <DialogContent className="z-[9999999]">
        {/*
          <DialogHeader> wraps header elements such as the image, title, and description,
          providing a clear grouping of heading content.
        */}
        <DialogHeader>
          {/*
            Container for the image.
            Tailwind classes:
              - "relative": Enables absolute positioning inside this block.
              - "mx-auto": Centers the container horizontally.
              - "w-24": Sets the width to 6rem (24 * 0.25rem).
              - "h-24": Sets the height to 6rem, making it a square.
              - "mb-2": Adds bottom margin (0.5rem) to separate from following elements.
          */}
          <div className="relative mx-auto w-24 h-24 mb-2">
            {/*
              <Image> renders the snake image.
              Attributes:
                - src: Location of the image file.
                - alt: Alternative text for accessibility.
                - className "object-contain": Ensures the image scales correctly without being cropped.
                - fill: Makes the image fill the parent container.
            */}
            <Image
              src="/snake-1.png"
              alt="snake image"
              className="object-contain"
              fill
            />
          </div>

          {/*
            <DialogTitle> is used for the dialog's title.
            Tailwind classes:
              - "text-3xl": Sets the font size to 3xl (large text).
              - "text-center": Centers the text horizontally.
              - "font-bold": Applies bold font weight.
              - "tracking-tight": Reduces the letter spacing.
              - "text-gray-900": Uses a very dark gray for the text color.
          */}
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
            Log in to continue
          </DialogTitle>

          {/*
            <DialogDescription> provides additional details about the dialog.
            Tailwind classes:
              - "text-base": Sets the base text size.
              - "text-center": Centers the text horizontally.
              - "py-2": Adds vertical padding (0.5rem top and bottom).
          */}
          <DialogDescription className="text-base text-center py-2">
            {/*
              The text within a <span> is styled with:
                - "font-medium": Semi-bold font weight.
                - "text-zinc-900": Uses a dark shade from the Zinc palette.
            */}
            <span className="font-medium text-zinc-900">
              Your configuration was saved!
            </span>{" "}
            Please login or create an account to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        {/*
          A grid layout for the login and register links.
          Tailwind classes:
            - "grid": Sets display to grid.
            - "grid-cols-2": Divides the grid into 2 equal columns.
            - "gap-6": Applies a gap of 1.5rem between grid items.
            - "divide-x": Creates a vertical divider between columns.
            - "divide-gray-200": Sets the divider color to a light gray.
        */}
        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          {/*
            <LoginLink> is a prebuilt component (link) that navigates to the login page.
            It receives className generated from buttonVariants:
              - buttonVariants is passed an object { variant: "outline" } meaning it uses
                the outline style of the button.
          */}
          <LoginLink className={buttonVariants({ variant: "outline" })}>
            Login
          </LoginLink>
          {/*
            <RegisterLink> is a prebuilt component (link) that navigates to the sign up page.
            It receives className generated from buttonVariants with default styling.
          */}
          <RegisterLink className={buttonVariants({ variant: "default" })}>
            Sign up
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
