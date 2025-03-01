{
  /*Landing Page */
}

import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Phone from "@/components/Phone";
import { Reviews } from "@/components/Reviews";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check, Star } from "lucide-react";
import Link from "next/link";

/**
 * This 'Home' function is our main component:
 * It returns a bunch of sections with text, images, and buttons
 * that explain and showcase the product features.
 */
export default function Home() {
  return (
    /**
     * The outermost <div> uses:
     * - "bg-slate-50" => a very light gray background color
     * - "grainy-light" => a custom class that probably adds a grainy texture
     */
    <div className="bg-slate-50 grainy-light">
      {/* 
        First <section> with a large wrapper, 
        plus some padding at the bottom (pb-24) and top (pt-10), etc.
       */}
      <section>
        {/**
         * 'MaxWidthWrapper' is a custom component that constrains the width
         * so our content doesn't stretch too wide.
         * We also use classes like:
         * - "pb-24" => padding bottom for spacing
         * - "pt-10" => padding top
         * - "lg:grid lg:grid-cols-3" => on large screens, make a 3-column grid
         * - "sm:pb-32" => at small breakpoints, increase the bottom padding
         * - "lg:gap-x-0 xl:gap-x-8" => define horizontal gaps in the grid
         * - "lg:pt-24 xl:pt-32 lg:pb-52" => more responsive spacing for large screens
         */}
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          {/**
           * This <div> covers two of the three grid columns ("col-span-2")
           * sets left/right padding on smaller screens, and top padding on large screens
           */}
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            {/**
             * A flex container that centers elements on smaller screens
             * and aligns them left on large screens.
             * "relative" => we might position absolutely some elements inside
             */}
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              {/**
               * This <div> is absolutely positioned with a "w-28"
               * and placed at the left side above the text,
               * only visible on large screens ("hidden lg:block").
               * There's a gradient overlay inside it and an image of a snake.
               */}
              <div className="absolute w-28 left-0 -top-20 hidden lg:block">
                {/* 
                  A semi-transparent gradient 
                  that probably fades the bottom of the snake image.
                */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t via-slate-50/50 from-slate-50 h-28" />
                <img src="/snake-1.png" className="w-full" />
              </div>

              {/**
               * The big headline:
               * - "text-5xl md:text-6xl lg:text-7xl" => text size changes at breakpoints
               * - "font-bold" => bold text
               * - "text-gray-900" => text color is a dark gray
               * - "tracking-tight" => reduces letter spacing
               * - "text-balance" => a custom class that might help text wrap/process well
               */}
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">
                Your Image on a{" "}
                {/**
                 * "bg-blue-600 px-2 text-white" => blue background, some left-right padding, white text
                 */}
                <span className="bg-blue-600 px-2 text-white">Custom</span>{" "}
                Phone Case
              </h1>

              {/**
               * A paragraph below the heading with:
               * - "mt-8 text-lg" => margin top + font size
               * - "lg:pr-10" => extra right padding on large screens
               * - "max-w-prose" => preferred readable width
               * - "text-balance" => custom class possibly controlling word wrapping
               */}
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Elevate your everyday with a{" "}
                <span className="font-semibold">one-of-one</span> phone case.
                Harness the power of caseEvo to keep every cherished memory
                alive in stunning detail.
              </p>

              {/**
               * A <ul> that lists product features with check icons:
               * - "mt-8 space-y-2" => spacing around list items
               * - "flex flex-col items-center sm:items-start" => center on smaller screens, left align on bigger
               */}
              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li className="flex gap-1.5 items-center text-left">
                    {/**
                     * <Check> is an icon from lucide-react, sized 5x5 with a blue color
                     */}
                    <Check className="h-5 w-5 shrink-0 text-blue-600" />
                    High-quality, durable material
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-blue-600" />5 year
                    print guarantee
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-blue-600" />
                    Modern iPhone models supported
                  </li>
                </div>
              </ul>

              {/**
               * A container that holds user avatars images and star ratings
               * "mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5" =>
               *   margin top 3rem, and a flexible row on bigger screens with spacing 1.25rem
               */}
              <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/**
                 * A row of user images that slightly overlap (-space-x-4).
                 */}
                <div className="flex -space-x-4">
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                    src="/users/user-1.png"
                    alt="user image"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                    src="/users/user-2.png"
                    alt="user image"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                    src="/users/user-3.png"
                    alt="user image"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
                    src="/users/user-4.jpg"
                    alt="user image"
                  />
                  <img
                    className="inline-block object-cover h-10 w-10 rounded-full ring-2 ring-slate-100"
                    src="/users/user-5.jpg"
                    alt="user image"
                  />
                </div>

                {/**
                 * Another small area showing star icons and a "happy customers" text
                 */}
                <div className="flex flex-col justify-between items-center sm:items-start">
                  <div className="flex gap-0.5">
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                  </div>

                  <p>
                    <span className="font-semibold">1.250+</span> happy
                    customers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/**
           * The third column in the grid (col-span-full then overridden to col-span-1 on large)
           * "flex justify-center" => center the content horizontally
           * "mt-32 lg:mt-20" => margin top that changes on large screens
           */}
          <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
            <div className="relative md:max-w-xl">
              {/**
               * Absolute images for decorative elements
               * "select-none" => user can't highlight/drag them
               */}
              <img
                src="/your-image.png"
                className="absolute w-40 lg:w-52 left-56 -top-20 select-none hidden sm:block lg:hidden xl:block"
              />
              <img
                src="/line.png"
                className="absolute w-20 -left-6 -bottom-6 select-none"
              />
              {/**
               * Renders a phone with an image inside it
               */}
              <Phone className="w-64" imgSrc="/testimonials/1.jpg" />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/**
       * A section with a darker background using "bg-slate-100 grainy-dark"
       * "py-24" => top and bottom padding
       */}
      <section className="bg-slate-100 grainy-dark py-24">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-32">
          {/**
           * A heading that says "What our customers say"
           * plus a snake image
           */}
          <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
            <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
              What our{" "}
              {/**
               * A highlighted word with an underline on bigger screens
               */}
              <span className="relative px-2">
                customers{" "}
                <Icons.underline className="hidden sm:block pointer-events-none absolute inset-x-0 -bottom-6 text-blue-500" />
              </span>{" "}
              say
            </h2>
            <img src="/snake-2.png" className="w-24 order-0 lg:order-2" />
          </div>

          {/**
           * A grid with 2 columns on large screens
           * containing user review blocks
           */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16">
            {/**
             * First user review block
             */}
            <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
              {/**
               * The star icons for rating
               */}
              <div className="flex gap-0.5 mb-2">
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              </div>
              <div className="text-lg leading-8">
                <p>
                  "The case feels durable and I even got a compliment on the
                  design. Had the case for two and a half months now and{" "}
                  <span className="p-0.5 bg-slate-800 text-white">
                    the image is super clear
                  </span>
                  , on the case I had before, the image started fading into
                  yellow-ish color after a couple weeks. Love it."
                </p>
              </div>
              {/**
               * A small user block with an avatar and a "Verified Purchase" note
               */}
              <div className="flex gap-4 mt-2">
                <img
                  className="rounded-full h-12 w-12 object-cover"
                  src="/users/user-1.png"
                  alt="user"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">Rahul</p>
                  <div className="flex gap-1.5 items-center text-zinc-600">
                    <Check className="h-4 w-4 stroke-[3px] text-blue-600" />
                    <p className="text-sm">Verified Purchase</p>
                  </div>
                </div>
              </div>
            </div>

            {/**
             * Second user review block
             */}
            <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
              <div className="flex gap-0.5 mb-2">
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              </div>
              <div className="text-lg leading-8">
                <p>
                  "I usually keep my phone together with my keys in my pocket
                  and that led to some pretty heavy scratchmarks on all of my
                  last phone cases. This one, besides a barely noticeable
                  scratch on the corner,{" "}
                  <span className="p-0.5 bg-slate-800 text-white">
                    looks brand new after about half a year
                  </span>
                  . I dig it."
                </p>
              </div>
              <div className="flex gap-4 mt-2">
                <img
                  className="rounded-full h-12 w-12 object-cover"
                  src="/users/user-4.jpg"
                  alt="user"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">Utkarsh</p>
                  <div className="flex gap-1.5 items-center text-zinc-600">
                    <Check className="h-4 w-4 stroke-[3px] text-blue-600" />
                    <p className="text-sm">Verified Purchase</p>
                  </div>
                </div>
              </div>
            </div>

            {/**
             * Third user review block
             */}
            <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
              <div className="flex gap-0.5 mb-2">
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
                <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              </div>
              <div className="text-lg leading-8">
                <p>
                  "The colors on my design are incredibly vibrant.{" "}
                  <span className="p-0.5 bg-slate-800 text-white">
                    It's surprisingly comfortable to hold
                  </span>{" "}
                  and people always ask where I got it. Great purchase!"
                </p>
              </div>
              <div className="flex gap-4 mt-2">
                <img
                  className="rounded-full h-12 w-12 object-cover"
                  src="/users/user-3.png"
                  alt="user"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">Ritu</p>
                  <div className="flex gap-1.5 items-center text-zinc-600">
                    <Check className="h-4 w-4 stroke-[3px] text-blue-600" />
                    <p className="text-sm">Verified Purchase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>

        {/**
         * A little space after the reviews, then a custom 'Reviews' component
         */}
        <div className="pt-16">
          <Reviews />
        </div>
      </section>

      {/**
       * Another <section> that promotes
       * uploading a photo to create a custom case
       */}
      <section>
        {/**
         * The 'MaxWidthWrapper' again for consistent spacing,
         * plus "py-24" for big top/bottom space
         */}
        <MaxWidthWrapper className="py-24">
          {/**
           * Text explaining how to upload a custom photo and prompt to get started
           */}
          <div className="mb-12 px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
                Upload your photo and get{" "}
                {/**
                 * A highlight with "bg-blue-600 text-white"
                 */}
                <span className="relative px-2 bg-blue-600 text-white">
                  your own case
                </span>{" "}
                now
              </h2>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            {/**
             * A 'relative' flex layout that on bigger screens (md)
             * turns into a grid with 2 columns.
             * "gap-40" => large space between the columns.
             */}
            <div className="relative flex flex-col items-center md:grid grid-cols-2 gap-40">
              {/**
               * An arrow image absolutely centered
               * to visually connect the two images.
               */}
              <img
                src="/arrow.png"
                className="absolute top-[25rem] md:top-1/2 -translate-y-1/2 z-10 left-1/2 -translate-x-1/2 rotate-90 md:rotate-0"
              />

              {/**
               * A "horse.jpg" image in a styled container:
               * - "h-80 md:h-full w-full" => dynamic height/width
               * - "max-w-sm" => limit maximum width for the image
               * - "rounded-xl" => rounded corners
               * - "bg-gray-900/5 ring-inset ring-gray-900/10" => a faint inner ring/border
               */}
              <div className="relative h-80 md:h-full w-full md:justify-self-end max-w-sm rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl">
                <img
                  src="/horse.jpg"
                  className="rounded-md object-cover bg-white shadow-2xl ring-1 ring-gray-900/10 h-full w-full"
                />
              </div>

              {/**
               * A Phone component to demonstrate how the custom image
               * might look on the phone case
               */}
              <Phone className="w-60" imgSrc="/horse_phone.jpg" />
            </div>
          </div>

          {/**
           * A list of product highlights with
           * check icons next to them
           */}
          <ul className="mx-auto mt-12 max-w-prose sm:text-lg space-y-2 w-fit">
            <li className="w-fit">
              <Check className="h-5 w-5 text-blue-600 inline mr-1.5" />
              High-quality silicone material
            </li>
            <li className="w-fit">
              <Check className="h-5 w-5 text-blue-600 inline mr-1.5" />
              Scratch- and fingerprint resistant coating
            </li>
            <li className="w-fit">
              <Check className="h-5 w-5 text-blue-600 inline mr-1.5" />
              Wireless charging compatible
            </li>
            <li className="w-fit">
              <Check className="h-5 w-5 text-blue-600 inline mr-1.5" />5 year
              print warranty
            </li>

            {/**
             * A centered link (button) that takes the user to
             * "/configure/upload" to create their custom case
             */}
            <div className="flex justify-center">
              <Link
                className={buttonVariants({
                  size: "lg",
                  className: "mx-auto mt-8",
                })}
                href="/configure/upload"
              >
                Create your case now <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </div>
          </ul>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
