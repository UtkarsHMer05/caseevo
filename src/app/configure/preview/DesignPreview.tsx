"use client";

// Import the Phone component which displays the phone case preview.
import Phone from "@/components/Phone";

// Import Button component from our UI library.
import { Button } from "@/components/ui/button";

// Import base price and product price details for different customization options.
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";

// Utility functions:
// - cn: to concatenate and conditionally merge class names.
// - formatPrice: to format numbers into price strings.
import { cn, formatPrice } from "@/lib/utils";

// Import supported colors and models from the options validator.
import { COLORS, MODELS } from "@/validator/option-validator";

// Import Configuration type from Prisma, which defines the shape of a configuration record.
import { Configuration } from "@prisma/client";

// Import useMutation hook from react-query to manage asynchronous actions such as fetching sessions.
import { useMutation } from "@tanstack/react-query";

// Import icons from lucide-react.
import { ArrowRight, Check } from "lucide-react";

// Next.js router for navigation (changing pages).
import { useRouter } from "next/navigation";

// Import useEffect and useState hooks from React for handling side-effects and component state.
import { useEffect, useState } from "react";

// Confetti component to display festive animations.
import Confetti from "react-dom-confetti";

// Import function to create a Stripe checkout session.
import { createCheckoutSession } from "./actions";

// Toast notifications for showing error messages or information.
import { toast } from "sonner";

// Hook to get the current authentication status of the user.
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

// Import LoginModal to allow users to log in if they are not authenticated.
import LoginModal from "@/components/LoginModal";

/**
 * DesignPreview component displays a preview of the customized phone case
 * along with pricing details and a checkout button.
 *
 * Props:
 * - configuration: The configuration object retrieved from the database.
 *   It contains details such as id, color, model, finish, material, and image URLs.
 */
const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
  // useRouter from Next.js to navigate to different pages (for checkout process).
  const router = useRouter();

  // State to control whether the confetti animation (celebration effect) is shown.
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Get the configuration id from the configuration object.
  const { id } = configuration;

  // Access the current user using Kinde's browser client.
  // The "user" object will contain the logged in user's information if available.
  const { user } = useKindeBrowserClient();

  // State to determine if the LoginModal (login/sign up dialog) is open.
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // useEffect to trigger confetti animation when the component mounts.
  useEffect(() => setShowConfetti(true));

  // Destructure customization options from the configuration.
  // These options define the look and pricing of the case.
  const { color, model, finish, material } = configuration;

  // Find the Tailwind class from COLORS that matches the configuration's color.
  // The variable "tw" now holds the Tailwind class string for the background color.
  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color
  )?.tw;

  // Find the model label (e.g., "iPhone X") from the list of supported models.
  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model
  )!;

  // Calculate the overall total price based on base price and additional options.
  let totalPrice = BASE_PRICE;
  if (material === "polycarbonate") {
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  }
  if (finish === "textured") {
    totalPrice += PRODUCT_PRICES.finish.textured;
  }

  // useMutation hook manages the async action to create a checkout session.
  // The options include:
  // - mutationKey: a unique key for caching.
  // - mutationFn: the function that creates the session.
  // - onSuccess: callback when the session is successfully created.
  // - onError: callback if something goes wrong showing a toast error.
  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      // On success, if the URL for the Stripe checkout session is returned, navigate the user there.
      if (url) {
        router.push(url);
      } else {
        throw new Error("Error creating checkout session");
      }
    },
    onError: (error) => {
      // Display a toast error notification to the user if the checkout session creation fails.
      toast.error(
        <span style={{ color: "black" }}>Something Went Wrong</span>,
        {
          description: (
            <span style={{ color: "red" }}>
              There was a problem at our end, please try again.
            </span>
          ),
        }
      );
    },
  });

  /**
   * handleCheckout function is invoked when the user clicks the checkout button.
   *
   * If the user is authenticated, it triggers the creation of a payment session.
   * Otherwise, it stores the configuration id in localStorage and opens the LoginModal
   * to prompt the user to log in or sign up.
   */
  const handleCheckout = () => {
    if (user) {
      // User is logged in; proceed to create a payment session.
      createPaymentSession({ configId: id });
    } else {
      // User is not logged in.
      // Save the configuration id to localStorage so that it can be used after login.
      localStorage.setItem("configurationId", id);
      // Open the login modal to prompt the user for authentication.
      setIsLoginModalOpen(true);
    }
  };

  // The component's JSX structure.
  return (
    <>
      {/*
        A div that acts as the container for the confetti animation.
        Tailwind classes:
          - "pointer-events-none": Disables mouse events on this element.
          - "selected-none": (likely a typo or custom class to disable selection)
          - "absolute": Positions the element absolutely relative to its first positioned ancestor.
          - "inset-0": Sets all top, bottom, left, right values to 0, making it cover the entire area.
          - "overflow-hidden": Hides any overflowing content.
          - "flex justify-center": Uses flexbox to center its child horizontally.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none selected-none absolute inset-0 overflow-hidden flex justify-center"
      >
        {/* Confetti animation component with configuration options:
             - active: Boolean to trigger the animation.
             - config: Pass config with elementCount (number of confetti pieces) and spread.
        */}
        <Confetti
          active={showConfetti}
          config={{ elementCount: 500, spread: 500 }}
        />
      </div>

      {/*
        Render the LoginModal component.
        It receives two props:
          - isOpen: Determines whether the login modal is open.
          - setIsOpen: Function to update the open state.
        The modal will appear if the user is not logged in and clicks the checkout button.
      */}
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      {/*
        Main layout container for the design preview.
        Tailwind classes:
          - "mt-20": Margin top of 5rem.
          - "grid": Uses a CSS grid for layout.
          - "grid-cols-1": Single column layout on extra small screens.
          - "text-sm": Small base font size.
          - Responsive grid settings (sm, md, lg): Adjust columns and gaps based on screen size.
      */}
      <div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-12 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        {/*
          Column for the phone preview.
          Tailwind classes:
            - "sm:col-span-4": On small screens, span 4 grid columns.
            - "md:col-span-3": On medium screens, span 3 grid columns.
            - "md:row-span-2": On medium screens, the element spans 2 rows.
            - "md:row-end-2": Ends at row 2 on medium screens.
        */}
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          {/*
            <Phone> component renders the phone case image.
            The "className" is generated using the "cn" helper function.
            Here, `bg-${tw}` dynamically applies a background color based on the selected color.
          */}
          <Phone
            className={cn(`bg-${tw}`)}
            imgSrc={configuration.croppedImageUrl!}
          />
        </div>

        {/*
          Column for the case title and availability details.
          Tailwind classes:
            - "mt-6": Margin top of 1.5rem to create spacing.
            - "sm:col-span-9": On small screens, span 9 grid columns.
            - "sm:mt-0": Reset top margin to 0 on small screens.
            - "md:row-end-1": Ends at the first row on medium screens.
        */}
        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          {/*
            Heading for the case preview.
            Tailwind classes:
              - "text-3xl": Sets font size to 3xl (large).
              - "font-bold": Makes the text bold.
              - "tracking-tight": Reduces letter spacing.
              - "text-gray-900": Uses a dark gray for text.
          */}
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} Case{" "}
          </h3>
          {/*
            A sub-container for displaying stock status.
            Tailwind classes:
              - "mt-3": Margin top of 0.75rem.
              - "flex": Uses flexbox layout.
              - "items-center": Aligns items vertically in the center.
              - "gap-1.5": Adds a gap of 0.375rem between items.
              - "text-base": Base text size.
          */}
          <div className="mt-3 flex items-center gap-1.5 text-base ">
            {/*
              The Check icon:
              Tailwind classes:
                - "h-4 w-4": Sets height and width to 1rem.
                - "text-blue-500": Sets its color to blue.
            */}
            <Check className="h-4 w-4 text-blue-500" />
            In Stock and ready to be Shipped...
          </div>
        </div>

        {/*
          Main container for the pricing and order details.
          Tailwind classes for this container and inner elements ensure good spacing,
          borders, and typography.
        */}
        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights </p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside ">
                <li>Wireless Charging Compatible</li>
                <li>TPU Shock absorbing material</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print Warranty</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High Quality, Durable Material (like your memories😊)</li>
                <li>Scratch and FingerPrint Resistant Coating</li>
              </ol>
            </div>
          </div>
          <div className="mt-8 ">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                {/*
                  Row for displaying the base price.
                  Tailwind classes:
                    - "flex": Creates a flex container.
                    - "items-center": Vertically aligns items.
                    - "justify-between": Positions items at the extremes (left and right).
                    - "py-1": Adds vertical padding of 0.25rem.
                    - "mt-2": Adds top margin of 0.5rem.
                */}
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Base Price</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE / 100)}
                  </p>
                </div>
                {/*
                  Conditionally render the textured finish pricing if applicable.
                  Same flexbox layout is used for consistent spacing.
                */}
                {finish === "textured" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Textured Finish</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                    </p>
                  </div>
                ) : null}
                {/*
                  Conditionally render the material pricing if the material is polycarbonate.
                */}
                {material === "polycarbonate" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Soft Polycarbonate Material</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                    </p>
                  </div>
                ) : null}
                {/*
                  A horizontal divider line.
                  Tailwind classes:
                    - "my-2": Vertical margin of 0.5rem on top and bottom.
                    - "h-px": Height of 1 pixel.
                    - "bg-gray-200": Background color for the line.
                */}
                <div className="my-2 h-px bg-gray-200" />
                {/*
                  Row displaying the final order total.
                */}
                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order Total</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPrice / 100)}
                  </p>
                </div>
              </div>
            </div>
            {/*
              Container for the checkout button.
              Tailwind classes:
                - "mt-8": Top margin of 2rem.
                - "flex justify-end": Uses flexbox to align the button to the right.
                - "pb-12": Padding bottom of 3rem.
            */}
            <div className="mt-8 flex justify-end pb-12 ">
              {/*
                <Button> triggers the handleCheckout function.
                Tailwind classes for the Button:
                  - "px-4": Horizontal padding of 1rem.
                  - "sm:px-6": On small screens, horizontal padding of 1.5rem.
                  - "lg:px-8": On large screens, horizontal padding of 2rem.
                */}
              <Button
                onClick={() => handleCheckout()}
                className="px-4 sm:px-6 lg:px-8"
              >
                Check out{" "}
                {/* ArrowRight icon styled with:
                      - "h-4 w-4": Sets size to 1rem by 1rem.
                      - "ml-1.5": Left margin of 0.375rem.
                      - "inline": Makes the icon display inline with text.
                */}
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview;
