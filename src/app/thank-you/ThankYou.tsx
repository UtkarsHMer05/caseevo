"use client";

// Import the useQuery hook from React Query to fetch and cache data in our component.
import { useQuery } from "@tanstack/react-query";

// Import useSearchParams from Next.js to read the URL query parameters.
import { useSearchParams } from "next/navigation";

// Import Loader2 icon from lucide-react to show a spinning loading animation.
import { Loader2 } from "lucide-react";

// Import formatPrice, a helper function to turn numbers into formatted price strings.
import { formatPrice } from "@/lib/utils";

// Import getPaymentStatus from our actions file; this function checks if the order is paid.
import { getPaymentStatus } from "./actions";

// Import PhonePreview, a component that shows a preview image of the phone case.
import PhonePreview from "@/components/PhonePreview";

const ThankYou = () => {
  // useSearchParams returns an object that lets us read the URL parameters.
  const searchParams = useSearchParams();
  // Extract the "orderId" from the URL. If it is not found, we use an empty string.
  const orderId = searchParams.get("orderId") || "";

  /*
    useQuery is a React Query hook that fetches data.
    - queryKey: Unique name used to cache the query results.
    - queryFn: Our asynchronous function that calls getPaymentStatus with the orderId.
    - retry: If the request fails, it will try again.
    - retryDelay: How many milliseconds to wait before trying again (500 ms here).
  */
  const { data } = useQuery({
    queryKey: ["get-payment-status"],
    queryFn: async () => await getPaymentStatus({ orderId }),
    retry: true,
    retryDelay: 500,
  });

  // When the data is not yet available (undefined), show a loading state.
  if (data === undefined) {
    return (
      // This div takes full width (w-full), has a top margin (mt-24 means about 6rem),
      // and centers its content horizontally using flexbox (flex justify-center).
      <div className="w-full mt-24 flex justify-center">
        {/* A vertical flex container to stack the spinner, heading, and text.
            - flex-col: stacks children vertically.
            - items-center: centers items horizontally.
            - gap-2: adds a small gap between items.
        */}
        <div className="flex flex-col items-center gap-2">
          {/*
             Loader2 is an icon that spins because of the animate-spin class.
             Class breakdown:
               - h-8 and w-8: The icon is 2rem by 2rem in size.
               - animate-spin: Applies a spinning animation.
               - text-zinc-500: Colors the icon with a medium gray.
          */}
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          {/* A heading that tells the user we are loading their order.
              - font-semibold: Makes the text semi-bold.
              - text-xl: Extra-large text size.
          */}
          <h3 className="font-semibold text-xl">Loading your order...</h3>
          {/* A supportive message; no class means default styling. */}
          <p>This won't take long.</p>
        </div>
      </div>
    );
  }

  // If data is false, it means the order exists but payment is still being verified.
  if (data === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          {/*
             The Loader2 icon is used again to indicate that something is happening.
               - Same size (h-8, w-8).
               - animate-spin makes it rotate.
               - text-zinc-500 sets the color.
          */}
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          {/* The heading now informs the user that the system is verifying the payment. */}
          <h3 className="font-semibold text-xl">Verifying your payment...</h3>
          {/* Additional text to reassure the user that the process will be quick. */}
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  // Once data is successfully returned, we extract the order details.
  const { configuration, billingAddress, shippingAddress, amount } = data;
  // From the configuration, extract the color. This may be used for styling in PhonePreview.
  const { color } = configuration;

  return (
    // Main container for the ThankYou page with a white background.
    <div className="bg-white">
      {/*
         This inner container centers the content and provides padding.
         Class breakdown:
           - mx-auto: Centers the block horizontally.
           - max-w-3xl: Limits the maximum width to about 48rem.
           - px-4: Horizontal padding of 1rem.
           - py-16: Vertical padding of 4rem.
           - sm:px-6 sm:py-24: On small screens, increases padding.
           - lg:px-8: On large screens, increases horizontal padding further.
      */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/*
           This section contains the thank you message and order number.
           - max-w-xl constrains the width of this text block.
        */}
        <div className="max-w-xl">
          {/* A small paragraph with a thank you message.
              Classes:
                - text-base: The base font size.
                - font-medium: Medium weight text.
                - text-primary: Uses the primary color (as defined by your theme).
          */}
          <p className="text-base font-medium text-primary">Thank you!</p>
          {/*
             The main heading for the page.
             Classes:
               - mt-2: Adds a top margin (about 0.5rem).
               - text-4xl: Very large text size.
               - font-bold: Bold text.
               - tracking-tight: Slightly tighter spacing between letters.
               - sm:text-5xl: On small screens the text is even larger.
          */}
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is on the way!
          </h1>
          {/* A paragraph that explains that the order is being processed.
              Classes:
                - mt-2: Small margin on top.
                - text-base: Base font size.
                - text-zinc-500: Light gray text color.
          */}
          <p className="mt-2 text-base text-zinc-500">
            We've received your order and are now processing it.
          </p>

          {/*
             A container for displaying the order number.
             Classes:
               - mt-12: Adds a larger top margin.
               - text-sm: Makes the font size small.
               - font-medium: Medium font weight.
          */}
          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Order number</p>
            <p className="mt-2 text-zinc-500">{orderId}</p>
          </div>
        </div>

        {/*
           A divider section that shows extra information after a top border.
           Classes:
             - mt-10: Margin top to separate from previous content.
             - border-t: Adds a top border line.
             - border-zinc-200: Colors the border with a very light gray.
        */}
        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            {/*
               A heading that reassures the user.
               Classes:
                 - font-semibold: Medium-bold text.
                 - text-zinc-900: Dark gray (almost black) text color.
            */}
            <h4 className="font-semibold text-zinc-900">
              You made a great choice!
            </h4>
            {/*
               A paragraph that explains more about the quality of the phone case.
               Classes:
                 - mt-2: Adds a small top margin.
                 - text-sm: Small text.
                 - text-zinc-600: Medium gray color for the text.
            */}
            <p className="mt-2 text-sm text-zinc-600">
              At CaseEvo, we believe a phone case should look great and stand
              the test of time. We back each case with a 5-year print guarantee:
              if your case isn't as durable as promised, we'll replace it at no
              extra cost.
            </p>
          </div>
        </div>

        {/*
           This section displays a preview of the phone case.
           Outer div classes:
             - flex: Applies flexbox layout.
             - space-x-6: Puts a horizontal gap (1.5rem) between child elements.
             - overflow-hidden: Ensures any content outside boundaries is hidden.
             - mt-4: Adds a small top margin.
             - rounded-xl: Rounds the corners with extra-large radius.
             - bg-gray-900/5: Sets the background color to a very light gray (using opacity).
             - ring-1 ring-inset ring-gray-900/10: Adds a subtle border-like ring inside the element.
             - lg:rounded-2xl: On large screens, the rounding is even more pronounced.
        */}
        <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhonePreview
            // Pass the cropped image URL for the phone preview.
            croppedImageUrl={configuration.croppedImageUrl!}
            // Pass the color from configuration to style the preview appropriately.
            color={color!}
          />
        </div>

        <div>
          {/*
             This grid shows the shipping and billing addresses.
             Outer div classes:
               - grid: Activates CSS grid layout.
               - grid-cols-2: Creates two columns.
               - gap-x-6: Sets horizontal gaps between the columns.
               - py-10: Adds vertical padding (2.5rem on top and bottom).
               - text-sm: Makes font size small.
          */}
          <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
            <div>
              {/* Header for "Shipping address", styled in medium weight and dark gray. */}
              <p className="font-medium text-gray-900">Shipping address</p>
              <div className="mt-2 text-zinc-700">
                {/*
                   The <address> element semantically represents a physical address.
                   not-italic removes the default italic style.
                   Each <span> with class "block" makes sure the text is shown in its own line.
                */}
                <address className="not-italic">
                  <span className="block">{shippingAddress?.name}</span>
                  <span className="block">{shippingAddress?.street}</span>
                  <span className="block">
                    {shippingAddress?.postalCode} {shippingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
            <div>
              {/* Header for "Billing address" */}
              <p className="font-medium text-gray-900">Billing address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{billingAddress?.name}</span>
                  <span className="block">{billingAddress?.street}</span>
                  <span className="block">
                    {billingAddress?.postalCode} {billingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
          </div>

          {/*
             This grid displays the payment status and shipping method.
             Outer div classes:
               - grid: Using CSS grid.
               - grid-cols-2: Two columns.
               - gap-x-6: Horizontal gap between columns.
               - border-t: Top border line.
               - border-zinc-200: Border color set to a light gray.
               - py-10: Vertical padding.
               - text-sm: Small text.
          */}
          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Payment status</p>
              <p className="mt-2 text-zinc-700">Paid</p>
            </div>

            <div>
              <p className="font-medium text-zinc-900">Shipping Method</p>
              <p className="mt-2 text-zinc-700">
                DHL, takes up to 3 working days
              </p>
            </div>
          </div>
        </div>

        {/*
           This section displays a summary of the costs.
           Outer div classes:
             - space-y-6: Vertical space (1.5rem) between the child divs.
             - border-t: Top border to separate from above content.
             - border-zinc-200: Light gray color for the border.
             - pt-10: Padding on top (2.5rem) to push content below the border.
             - text-sm: Small text size.
        */}
        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Subtotal</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Shipping</p>
            <p className="text-zinc-700">{formatPrice(0)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Total</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the ThankYou component so it can be used on the Thank You page.
export default ThankYou;
