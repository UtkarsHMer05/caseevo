"use client";
// This directive tells Next.js that this file should be rendered on the client side,
// allowing usage of hooks like useState, useEffect, etc.

import { HTMLAttributes, useEffect, useRef, useState } from "react";
// HTMLAttributes: a TypeScript type for regular HTML prop definitions
// useEffect: lets us run code after the component renders
// useRef: provides a way to hold a mutable value that persists across renders
// useState: a way to store and manage local state in a functional component

import MaxWidthWrapper from "./MaxWidthWrapper";
// Custom wrapper that likely constrains content to a preset maximum width

import { useInView } from "framer-motion";
// A hook from the Framer Motion library that tracks when an element is in the viewport

import { cn } from "@/lib/utils";
// Utility function to conditionally combine class names into one string

import Phone from "./Phone";
// Custom Phone component that displays a phone image with an overlay image inside

/**
 * An array holding the paths to 6 testimonial images.
 * We'll display these in a "marquee"-like scrolling view.
 */
const PHONES = [
  "/testimonials/1.jpg",
  "/testimonials/2.jpg",
  "/testimonials/3.jpg",
  "/testimonials/4.jpg",
  "/testimonials/5.jpg",
  "/testimonials/6.jpg",
];

/**
 * splitArray takes an array and a number of parts (numParts).
 * It splits the original array into 'numParts' groups
 * by distributing each item based on its index.
 *
 * Example: If you have [A, B, C, D, E, F] and numParts=3,
 * result might be [[A, D], [B, E], [C, F]].
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
 * ReviewColumn is a single vertical column that displays multiple "Review" items.
 * These items scroll upward in a marquee style.
 */
function ReviewColumn({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: {
  reviews: string[]; // The list of image sources to show in this column
  className?: string; // Additional class names for styling
  reviewClassName?: (reviewIndex: number) => string;
  // A function that returns extra class names per review, depending on its index
  msPerPixel?: number; // Determines how fast the marquee animation plays
}) {
  // We'll attach a ref to the column so we can measure its height
  const columnRef = useRef<HTMLDivElement | null>(null);
  // Keep track of the column's computed height in state
  const [columnHeight, setColumnHeight] = useState(0);

  // Convert the numeric height to a string like "4500ms" for the marquee's duration
  const duration = `${columnHeight * msPerPixel}ms`;

  // On mount (and when the element changes size), update 'columnHeight'
  useEffect(() => {
    if (!columnRef.current) return;

    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0);
    });

    // Start observing changes in the column's size
    resizeObserver.observe(columnRef.current);

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    /**
     * The outer <div>:
     * - ref={columnRef} attaches the ref so we can measure the height
     * - className={cn("animate-marquee space-y-8 py-4", className)}
     *   means:
     *   - "animate-marquee" => a keyframes-based animation that scrolls content upward
     *   - "space-y-8" => vertical space (2rem) between each child
     *   - "py-4" => top/bottom padding of 1rem
     * - style={{ "--marquee-duration": duration }}
     *   configures our marquee speed using CSS variable
     */
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      {/*
        We duplicate the array by concatenating it with itself, so that 
        when the first set scrolls out of view, the second set is ready to show.
      */}
      {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
        <Review
          key={reviewIndex}
          // Give each review an extra class (if any) from reviewClassName
          className={reviewClassName?.(reviewIndex % reviews.length)}
          imgSrc={imgSrc}
        />
      ))}
    </div>
  );
}

/**
 * Props for the Review component:
 * - imgSrc is the string path/URL to the image displayed inside the phone
 * - className is extra styling for the container
 */
interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
}

/**
 * Review is a single card-like item that shows a phone with a testimonial image inside it.
 * Fade-in and random animation delays produce a staggered visual effect.
 */
function Review({ imgSrc, className, ...props }: ReviewProps) {
  // A small list of possible animation delays
  const POSSIBLE_ANIMATION_DELAYS = [
    "0s",
    "0.1s",
    "0.2s",
    "0.3s",
    "0.4s",
    "0.5s",
  ];

  // We pick one delay from that list at random
  const animationDelay =
    POSSIBLE_ANIMATION_DELAYS[
      Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)
    ];

  return (
    /**
     * Container:
     * - "animate-fade-in" => a CSS animation that fades this component in
     * - "rounded-[2.25rem]" => large rounded corners (2.25rem)
     * - "bg-white p-6" => white background with padding
     * - "opacity-0" => initially invisible; fade-in sets it to visible
     * - "shadow-xl shadow-slate-900/5" => big shadow, slightly tinted
     *
     * Then we also apply any extra class names passed via className.
     * style={{ animationDelay }} sets the chosen random delay for fade-in.
     */
    <div
      className={cn(
        "animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      {/* Display the phone with the provided testimonial image */}
      <Phone imgSrc={imgSrc} />
    </div>
  );
}

/**
 * ReviewGrid is the layout that holds multiple ReviewColumn components
 * side by side to create a multi-column marquee effect.
 */
function ReviewGrid() {
  // We'll track this container so we can see if it's in the viewport (via Framer Motion)
  const containerRef = useRef<HTMLDivElement | null>(null);

  // isInView will be true once the container is scrolled into view (with 40% in view)
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  // We split the phone images into 3 main columns
  const columns = splitArray(PHONES, 3);
  // column1, column2, and a leftover array for column3
  const column1 = columns[0];
  const column2 = columns[1];
  // column3 might be further split into subcolumns
  const column3 = splitArray(columns[2], 2);

  return (
    /**
     * The container that holds all columns:
     * - "relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start
     *    gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
     *   means:
     *   - "relative" => can position child elements absolutely inside
     *   - "-mx-4" and "px-4" => negative left/right margin but also left/right padding
     *     to keep content nicely aligned
     *   - "mt-16" => margin top 4rem
     *   - "grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8" => single-column
     *     grid by default, with a large fixed height
     *   - "overflow-hidden" => anything beyond the container is hidden (for the marquee effect)
     *   - "sm:mt-20 md:grid-cols-2 lg:grid-cols-3" => more columns at medium and large breakpoints
     */
    <div
      ref={containerRef}
      className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {/**
       * Only show the scrolling columns once the user has scrolled them into view
       */}
      {isInView ? (
        <>
          {/**
           * A single column with the items from column1 plus column3 plus column2
           * The 'reviewClassName' function returns "md:hidden" or "lg:hidden" for certain
           * items so they won't appear on bigger breakpoints.
           */}
          <ReviewColumn
            reviews={[...column1, ...column3.flat(), ...column2]}
            reviewClassName={(reviewIndex) =>
              cn({
                "md:hidden": reviewIndex >= column1.length + column3[0].length,
                "lg:hidden": reviewIndex >= column1.length,
              })
            }
            msPerPixel={10}
          />

          {/**
           * A second column, hidden on small screens, that shows column2
           * plus the second half of column3.
           * "msPerPixel={15}" means it scrolls slightly faster/slower,
           * so there's a different effect.
           */}
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            className="hidden md:block"
            reviewClassName={(reviewIndex) =>
              reviewIndex >= column2.length ? "lg:hidden" : ""
            }
            msPerPixel={15}
          />

          {/**
           * A third column, also hidden on small screens, that shows column3 flattened
           */}
          <ReviewColumn
            reviews={column3.flat()}
            className="hidden md:block"
            msPerPixel={10}
          />
        </>
      ) : null}

      {/**
       * Two gradient overlays at the top and bottom to fade out the scrolling content
       */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100" />
    </div>
  );
}

/**
 * The main 'Reviews' component that we actually export:
 * Wraps the entire grid of reviews in a MaxWidthWrapper
 * to control its overall width, then positions a decorative image.
 */
export function Reviews() {
  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      {/**
       * A decorative image placed with absolutely-positioning on large screens only
       */}
      <img
        aria-hidden="true"
        src="/what-people-are-buying.png"
        className="absolute select-none hidden xl:block -left-32 top-1/3"
      />

      {/* The multi-column scrolling grid of phone testimonials */}
      <ReviewGrid />
    </MaxWidthWrapper>
  );
}
