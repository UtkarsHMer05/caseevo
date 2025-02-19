"use client";
// "use client" tells Next.js that this file should be rendered on the client side

import { useInView } from "framer-motion"; // Hook to track if an element is in or out of view
import { useEffect, useRef, useState } from "react";
// useEffect: Allows side effects (e.g., updating state on mount)
// useRef: Creates a mutable ref object that persists across renders
// useState: Creates state variables within functional components

import MaxWidthWrapper from "./MaxWidthWrapper";
// A custom wrapper component that constrains content to a maximum width
import { cn } from "@/lib/utils";
// Utility function that conditionally combines class names

// An array of image paths for phone testimonial images.
const PHONES = [
  "/testimonials/1.jpg",
  "/testimonials/2.jpg",
  "/testimonials/3.jpg",
  "/testimonials/4.jpg",
  "/testimonials/5.jpg",
  "/testimonials/6.jpg",
];

/**
 * Utility function to split an array into 'numParts' groups.
 * Each element in the original array is placed into a subarray
 * based on its index modulo 'numParts'.
 */
function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = [];

  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }

  return result;
}

/**
 * A component that displays a column of 'review' elements.
 * The column scrolls up continuously (via the 'animate-marquee' class).
 */
function ReviewColumn({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: {
  reviews: string[]; // The list of review images to render
  className?: string; // Additional class names for the container
  reviewClassName?: (reviewIndex: number) => string; // Class generator for each review item
  msPerPixel?: number; // Speed factor for the marquee animation
}) {
  // Use a ref to keep track of the column element
  const columnRef = useRef<HTMLDivElement | null>(null);
  // Store the column's height in state so we can calculate the scroll duration
  const [columnHeight, setColumnHeight] = useState(0);

  // Convert the numeric result into a CSS time value
  const duration = `${columnHeight * msPerPixel}ms`;

  // On mount, use a ResizeObserver to update the columnHeight whenever the element resizes
  useEffect(() => {
    if (!columnRef.current) return;

    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0);
    });

    resizeObserver.observe(columnRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    // A container that animates its children in a marquee-like scroll
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      {/* Duplicate the array by concatenating it with itself to create a continuous loop */}
      {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
        // Render a Review component for each item
        <Review />
      ))}
    </div>
  );
}

/**
 * Individual review component to represent a single testimonial.
 * Currently empty; can be expanded to show user details or images.
 */
function Review({}) {
  return null;
}

/**
 * A grid layout that holds multiple ReviewColumns side by side.
 * Each column may contain a subset of the reviews.
 */
function ReviewGrid() {
  // Keep a ref to the container element in order to detect when it's in the viewport
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Use Framer Motion's useInView to determine when the element is visible on screen
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  // Split the PHONES array into three main columns
  const columns = splitArray(PHONES, 3);
  const columns1 = columns[0];
  const columns2 = columns[1];
  // Split the last column again into two parts (nested columns)
  const columns3 = splitArray(columns[2], 2);

  return (
    // Container for the review columns
    <div
      ref={containerRef}
      className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1
                 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {/* Only render the child elements if 'isInView' is true */}
      {isInView ? (
        <>
          {/* Each of these would be a <ReviewColumn> with its own subset of reviews */}
          <ReviewColumn />
          {/* Additional columns can be placed here, e.g. <ReviewColumn reviews={...} /> */}
        </>
      ) : null}
    </div>
  );
}

/**
 * The main exported component. It wraps the ReviewGrid
 * inside a MaxWidthWrapper to constrain the layout
 * and optionally displays a decorative image.
 */
export function Review() {
  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      {/* A decorative image placed absolutely to the left side, 
          only shown on larger screens */}
      <img
        aria-hidden="true"
        src="/what-people-are-buying.png"
        className="absolute select-none hidden x1:block  -left-32 top-1/3"
      />
      {/* The grid that displays the columns of reviews */}
      <ReviewGrid />
    </MaxWidthWrapper>
  );
}
