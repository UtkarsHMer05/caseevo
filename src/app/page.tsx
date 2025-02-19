import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper"; // Custom wrapper for max width styling
import Phone from "@/components/Phone"; // Renders a phone component with an image
import { Review } from "@/components/Reviews";
import { Check, Star } from "lucide-react"; // Check and Star icons
import Image from "next/image"; // Next.js Image component

export default function Home() {
  return (
    // Main container with a slate background
    <div className="bg-slate-50">
      {/* Section to group related content */}
      <section>
        {/* Wrap content to limit max width and control layout */}
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          {/* First column area */}
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            {/* Container for heading and description */}
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              {/* Decorative image positioned absolutely */}
              <div className="absolute w-28 left-0 -top-20 hidden lg:block">
                <img src="/snake-1.png" className="w-full" />
              </div>
              {/* Main heading with custom styling */}
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">
                Your Image on a{" "}
                <span className="bg-blue-600 px-2 text-white">Custom</span>{" "}
                Phone Case
              </h1>
              {/* Supporting text below heading */}
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Preserve your favorite moments with a{" "}
                <span className="font-semibold">one-of-a-kind</span> case.
                Protect your phone—and your memories—with CaseEvo.
              </p>
              {/* List of features with Check icons */}
              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shirk-0 text-green-600" />
                    High-Quality, Durable Material
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shirk-0 text-green-600" />5 years
                    of print Guarantee
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shirk-0 text-green-600" />
                    Modern Iphone Models Supported
                  </li>
                </div>
              </ul>
              {/* Customer reviews section */}
              <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* User profile images */}
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
                {/* Stars and text showing happy customers */}
                <div className="flex flex-col justify-between items-center sm:items-start">
                  <div className="flex gap-0.5">
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                    <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                  </div>
                  <p>
                    <span className="font-semibold">1.250</span> Happy Customers
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Second column area: Image and Phone component */}
          <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lx:mt-0 lg:mt-20 h-fit ">
            <div className="relative md:max-w-xl">
              {/* Decorative image above the phone */}
              <img
                src="/your-image.png"
                className="absolute w-40 lg:w-52 left-56 -top-20 select-none hidden sm:block lg:hidden xl:block"
              />
              {/* Decorative image near bottom */}
              <img
                src="/line.png"
                className="absolute w-20 -left-6 -bottom-6 select-none"
              />
              {/* Phone component with an image prop */}
              <Phone className="w-64" imgSrc="/testimonials/1.jpg" />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
      {/*vaue propositon section */}
      <section className="bg-slate-100 py-24">
        <MaxWidthWrapper className=" flex flex-col items-center gap-16 sm:gap-32">
          <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
            <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
              What our{" "}
              <span className="relative px-2">
                Customers{" "}
                <Icons.underline className="hidden sm:block pointer-events-none absolute inset-x-0 -bottom-6 text-blue-600" />
              </span>{" "}
              say
            </h2>
            <img src="/snake-2.png" className="w-24 order-0 lg:order-2" />
          </div>
          <div className="mx-auto grid max-w-2xl  grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16"></div>
          <div className="flex flex-auto flex-col gap-4 lg:pr-8 x1:pr-20">
            <div className="flex gap-0.5 mb-2">
              <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
            </div>
            <div className="text-lg leading-8">
              <p>
                "The case feels durable and I even got an compliment on the
                design.Had the case for 2 years and{" "}
                <span className="p-0.5 bg-slate-800 text-white">
                  the image is super clear till now{" "}
                </span>{" "}
                whereas on the case i had before started to become yellow after
                few months of use. I'm very happy with ❤️my purchase❤️ . "
              </p>
            </div>
            <div className="flex gap-4 mt-2">
              <img
                className="rounded-full h-12 w-12 object-cover"
                src="/users/user-1.png"
                alt="user image"
              />
              <div className="flex flex-col">
                <p className="font-semibold">John</p>
                <div className="flex gap-1.5 items-center text-zinc-600">
                  <Check className="h-4 w-4 stroke-[3px] text-blue-600" />
                  <p className="text-sm">Verified Purchase</p>
                </div>
              </div>
            </div>
          </div>
          {/* Second review */}
          <div className="flex flex-auto flex-col gap-4 lg:pr-8 x1:pr-20">
            <div className="flex gap-0.5 mb-2">
              <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
              <Star className="h-5 w-5 text-blue-600 fill-blue-600" />
            </div>
            <div className="text-lg leading-8">
              <p>
                "I usally keep my phone together with my keys in my pocket and
                that led to some heavy scratch marks on all my last phone cases.
                This one, beside a barely noticable scratch on the corner{" "}
                <span className="p-0.5 bg-slate-800 text-white">
                  looks brand new after a half a year{" "}
                </span>{" "}
                . I dig it"
              </p>
            </div>
            <div className="flex gap-4 mt-2">
              <img
                className="rounded-full h-12 w-12 object-cover"
                src="/users/user-4.jpg"
                alt="user image"
              />
              <div className="flex flex-col">
                <p className="font-semibold">Mike</p>
                <div className="flex gap-1.5 items-center text-zinc-600">
                  <Check className="h-4 w-4 stroke-[3px] text-blue-600" />
                  <p className="text-sm">Verified Purchase</p>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>

        <div className="pt-16">
          <Review />
        </div>
      </section>
    </div>
  );
}
