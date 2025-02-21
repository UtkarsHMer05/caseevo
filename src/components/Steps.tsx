"use client"; // This tells Next.js that this component should run in the browser (client-side).

// Import utility function "cn" to combine class names conditionally.
import { cn } from "@/lib/utils";
// (Note: The import "url" from "inspector" is likely unused and can be removed.)
import { usePathname } from "next/navigation";

/**
 * STEPS is a constant array that holds information about each step in a process.
 * Each step is an object with three properties:
 * - name: The title of the step.
 * - description: A short explanation of what the step is about.
 * - url: A path name to match the current page route.
 */
const STEPS = [
  {
    name: "Step 1: Add Image",
    description: "Upload an image for your case to get started",
    url: "/upload",
  },
  {
    name: "Step 2: Customize Design",
    description: "Make the case yours by customizing the design",
    url: "/design",
  },
  {
    name: "Step 3: Summary",
    description: "Review your Final Design",
    url: "/preview",
  },
];

/**
 * Steps is a React functional component that displays the list of steps as an ordered list.
 * It visually indicates which step is current and which have been completed.
 */
const Steps = () => {
  // usePathname hook retrieves the current URL path (e.g. "/upload", "/design", etc.).
  const pathname = usePathname();

  // The returned JSX is an ordered list (<ol>) containing a list item for each step.
  return (
    // <ol> is the container of the steps.
    // Tailwind classes used:
    // - "rounded-md": Gives the container rounded corners.
    // - "bg-white": Sets the background color to white.
    // - "lg:flex": Displays the children in a row (flex layout) on large screens.
    // - "lg:rounded-none": Removes rounding on larger screens.
    // - "lh:border-l", "lg:border-r", "lg:border-gray-200": Add left/right borders and set their color on large screens.
    <ol className="rounded-md bg-white lg:flex lg:rounded-none lh:border-l lg:border-r lg:border-gray-200">
      {STEPS.map((steps, i) => {
        // For each step, check if the current URL ends with the step's URL.
        // This means that step is the "current" step.
        const isCurrent = pathname.endsWith(steps.url);
        // Check if any later step has a URL that the current pathname ends with.
        // If so, then the current step is already completed.
        const isCompleted = STEPS.slice(i + 1).some((step) =>
          pathname.endsWith(step.url)
        );
        // Build the image path for a snake image which depends on the step number.
        const imgPath = `/snake-${i + 1}.png`;

        return (
          // Each list item (<li>) represents one step.
          // Tailwind classes here:
          // - "relative": Allows absolute positioning inside this element.
          // - "overflow-hidden": Hides any overflowing content.
          // - "lg:flex-1": On large screens, each step takes equal width in a row.
          <li key={steps.name} className="relative overflow-hidden lg:flex-1">
            <div>
              {/* This <span> creates a colored line that shows progress on the step.
                  It uses absolute positioning to stretch along the left edge or top.
                  Tailwind classes explained:
                  - "absolute": Positions this element absolutely relative to its parent.
                  - "left-0 top-0": Positions it at the top-left.
                  - "h-full w-1": By default, full height and 1 pixel (or 0.25rem) wide.
                  - "bg-zinc-400": Sets a light gray background.
                  - "lg:bottom-0 lg:top-auto": On large screens, the line is placed at the bottom.
                  - "lg:h-1 lg:w-full": On large screens, the line becomes 1 unit high and stretches full width.
                  Conditional classes:
                  - "bg-zinc-700" is applied if this step is current.
                  - "bg-primary" is applied if this step is completed.
              */}
              <span
                className={cn(
                  "absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full",
                  { "bg-zinc-700": isCurrent, "bg-primary": isCompleted }
                )}
                aria-hidden="true"
              />

              {/* This span holds the step's info and image.
                  Tailwind classes:
                  - "lg:pl-9": On large screens, add left padding (to offset the line).
                  - "flex": Uses flexbox layout.
                  - "items-center": Vertically centers content.
                  - "px-6 py-4": Horizontal and vertical padding.
                  - "text-sm": Sets text size to small.
                  - "font-medium": Uses a medium font weight.
              */}
              <span
                className={cn(
                  i !== 0 ? "lg:pl-9" : "", // If not the first step, add left padding on large screens.
                  "flex items-center px-6 py-4 text-sm font-medium "
                )}
              >
                {/* Container for the step's image */}
                <span className="flex-shrink-0">
                  <img
                    src={imgPath}
                    // Tailwind classes for the image:
                    // - "flex": Makes the image a flex item.
                    // - "h-20 w-20": Sets fixed height and width (5rem each).
                    // - "object-contain": Scales the image without cropping.
                    // - "items-center justify-center": Centers image content if using flex.
                    // Conditional classes:
                    // - "border-none" if the step is completed.
                    // - "border-zinc-700" if the step is current (this might add a colored border if defined in your CSS).
                    className={cn(
                      "flex h-20 w-20 object-contain  items-center  justify-center ",
                      {
                        "border-none": isCompleted,
                        "border-zinc-700": isCurrent,
                      }
                    )}
                  />
                </span>
                {/* Container for text (step title and description) */}
                <span className="ml-4 mg-full mt-0.5 flex min-w-0 flex-col justify-center ">
                  {/* The title of the step */}
                  {/* Tailwind classes:
                      - "text-sm font-semibold": Small text with a bold weight.
                      - "text-zinc-700": Sets text color to a dark gray.
                      Conditional classes:
                      - "text-primary" if the step is completed.
                      - "text-zinc-700" if the step is current.
                  */}
                  <span
                    className={cn("text-sm font-semibold text-zinc-700", {
                      "text-primary": isCompleted,
                      "text-zinc-700": isCurrent,
                    })}
                  >
                    {steps.name}
                  </span>
                  {/* The description of the step */}
                  {/* Tailwind classes:
                      - "text-sm": Sets text size to small.
                      - "text-zinc-500": Sets text color to a lighter gray.
                  */}
                  <span className="text-sm text-zinc-500 ">
                    {steps.description}
                  </span>
                </span>
              </span>

              {/* Separator: This SVG line appears between steps (except the first step) and visually separates them.
                  Tailwind classes for the container:
                  - "absolute inset-0": Absolutely positioned covering the whole parent.
                  - "hidden w-3": Hidden on default view, width of 3 (0.75rem) when shown.
                  - "lg:block": On large screens, display this element as a block.
              */}
              {i !== 0 ? (
                <div className="absolute inset-0 hidden w-3 lg:block ">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 12 82"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      // The path draws a line that connects the steps.
                      d="M0.5 0V31L10.5 41L0.5 51V82"
                      // stroke uses the current color (set to gray via the container class).
                      stroke="currentcolor"
                      // vectorEffect keeps the stroke width the same regardless of scaling.
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Steps;
