"use client";
// This directive tells Next.js that this component runs on the browser
// so we can use stateful hooks and other client-side features.

import HandleComponent from "@/components/HandleComponent";
// Imports a custom component used as a handle for resizing.
import { AspectRatio } from "@/components/ui/aspect-ratio";
// Renders an element with a fixed aspect ratio.
import { ScrollArea } from "@/components/ui/scroll-area";
// A scrollable container component.
import { cn, formatPrice } from "@/lib/utils";
// cn: Utility to join class names conditionally.
// formatPrice: Formats a number as a price string.
import NextImage from "next/image";
// Next.js optimized image component.
import { Rnd } from "react-rnd";
// Rnd is a component that lets you drag and resize an element (React-Resizable & Draggable).
import { Description, Radio, RadioGroup } from "@headlessui/react";
// Importing UI components from Headless UI.
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validator/option-validator";
// These are options for different customization aspects.
import { useRef, useState } from "react";
// React hooks: useRef to reference DOM elements, and useState to store state.
import { Label } from "@/components/ui/label";
// A UI component for labels.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Components for a dropdown menu.
import { Button } from "@/components/ui/button";
// A button UI component.
import { ArrowRight, CheckCheckIcon, ChevronsUpDown } from "lucide-react";
// Icon components from lucide-react.
import { BASE_PRICE } from "@/config/products";
// Base price of the product.
import { useUploadThing } from "@/lib/uploadthing";
// A custom hook to handle uploading files.
import { toast } from "sonner";
// Library to show pop-up messages (toasts).
import { useMutation } from "@tanstack/react-query";
// Hook for performing asynchronous mutations (like saving configuration).
import { saveConfig as _saveConfig, SaveConfigArgs } from "./action";
// Action to save configuration and its type.
import { useRouter } from "next/navigation";
// Router hook (to navigate pages).

// This interface defines the props for the DesignConfigurator component.
interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: {
    width: number;
    height: number;
  };
}

// The DesignConfigurator component renders the design customization page.
const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) => {
  // useRouter lets you change pages programmatically.
  const router = useRouter();

  // useMutation is used for saving configuration.
  // It runs saveConfiguration and then _saveConfig.
  const { mutate: saveConfig, isPending } = useMutation({
    mutationKey: ["saveConfig"],
    // This function will try to save the configuration.
    mutationFn: async (args: SaveConfigArgs) => {
      // saveConfiguration handles client-side pixel extraction from the phone.
      await Promise.all([saveConfiguration(), _saveConfig(args)]);
    },
    onError: () => {
      // If there's an error, show a toast with an error message.
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
    onSuccess: () => {
      // When save is successful, navigate to the preview page.
      router.push(`/configure/preview?id=${configId}`);
    },
  });

  // State to store the selected customization options.
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  // State to hold the current dimensions of the image as rendered
  const [renderedDimensions, setRenderedDimensions] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });
  // State to hold the current position of the draggable image.
  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  // References to DOM elements.
  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // startUpload is used for uploading the final configuration.
  const { startUpload } = useUploadThing("imageUploader");

  // saveConfiguration extracts the edited section of the phone case and submits the image.
  async function saveConfiguration() {
    try {
      // Get the bounding boxes of the phone case container.
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();
      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();
      // Calculate offset difference.
      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;
      // Adjust the position for the rendered draggable image.
      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      // Create a canvas to draw the cropped image.
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const userImage = new Image();
      userImage.crossOrigin = "anonymous"; // Avoid cross-origin issues.
      userImage.src = imageUrl;
      // Wait for the image to load before drawing.
      await new Promise((resolve) => {
        userImage.onload = resolve;
      });

      // Draw the image segment defined by the draggable area's position and dimensions.
      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimensions.width,
        renderedDimensions.height
      );
      // Convert canvas to base64 data.
      const base64 = canvas.toDataURL();
      // Extract just the base64 encoded data (remove the "data:image/png;base64," part).
      const base64Data = base64.split(",")[1];

      // Convert the base64 string to a Blob.
      const blob = base64ToBlob(base64Data, "image/png");
      // Create a file from the blob.
      const file = new File([blob], "filename.png", { type: "image/png" });
      // Upload the file and pass the configuration id.
      await startUpload([file], { configId });
    } catch (err) {
      // If any error, show a toast message.
      toast.error(
        <span style={{ color: "black" }}>Something Went Wrong</span>,
        {
          description: (
            <span style={{ color: "red" }}>
              There was a problem in your config. Please try again.
            </span>
          ),
        }
      );
    }
  }

  // Function to convert a base64 string into a Blob object.
  function base64ToBlob(base64: string, mimeType: string) {
    // atob decodes the base64 string into a binary string.
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    // Convert each character into its character code.
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    // Create a Uint8Array from the number array.
    const byteArray = new Uint8Array(byteNumbers);
    // Create and return a new Blob from the array.
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    // Main container for the design page.
    // Tailwind classes:
    // - "relative": Positions children absolutely relative to this container.
    // - "mt-20": Margin top of 5rem.
    // - "grid-cols-1 lg:grid-cols-3": Single column layout on small screens and 3 columns on large screens.
    // - "mb-20 pb-20": Bottom margin and padding of 5rem.
    <div className="relative mt-20 grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      {/* Container for the phone area (left section) */}
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {/* Phone template image container */}
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          {/* AspectRatio component forces a width-to-height ratio.
              Tailwind classes:
              - "pointer-events-none": Prevents clicks.
              - "relative z-50": Positions this element on top with z-index 50.
              - "aspect-[896/1831] w-full": Sets fixed aspect ratio and full width.
          */}
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone-image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          {/* Overlay for shadow effect.
              Tailwind classes:
              - "absolute z-40": Positioned above the base, with a lower z-index than the image.
              - "inset-0 left-[3px] top-px right-[3px] bottom-px": Positioned with small offsets.
              - "rounded-[32px]": Rounded corners with 32px radius.
              - "shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]": A big shadow to simulate a glow.
          */}
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          {/* Colored overlay.
              Uses the color from selected options.
              Tailwind classes:
              - "absolute inset-0": Covers the entire parent.
              - "left-[3px] top-px right-[3px] bottom-px rounded-[32px]": Same offsets as above.
              - ``bg-${options.color.tw}``: Sets background color dynamically from options.
          */}
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>
        {/* Draggable and resizable image (using Rnd) */}
        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          // onResizeStop: Called when user finishes resizing.
          // It updates the rendered dimensions and position.
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimensions({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          // onDragStop: Called when user finishes dragging.
          // It updates the rendered position.
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x, y });
          }}
          // Tailwind classes for Rnd container:
          // - "absolute": Positioned absolutely.
          // - "z-20": z-index of 20 so it appears above some elements but below others.
          // - "border-[3px] border-primary": 3px border with primary color.
          className="absolute z-20 border-[3px] border-primary"
          lockAspectRatio
          // Custom resize handles using HandleComponent.
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
        >
          {/* Container for the user's image inside the Rnd component */}
          <div className="relative w-full h-full">
            <NextImage
              src={imageUrl}
              fill
              alt="your image"
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>
      {/* Right section: Contains the scroll-able area with customization options */}
      <div className="h-[37.5rem] w-full col-span-full flex flex-col lg:col-span-1 bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          {/* A gradient overlay is placed at the bottom for a fade effect. */}
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
          <div className="px-8 pb-12 pt-8">
            {/* Heading text with tracking and bold style */}
            <h2 className="tracking-tight font-bold text-3xl">
              Customize your Case
            </h2>
            {/* A thin horizontal line to separate heading from options */}
            <div className="w-full h-px bg-zinc-200 my-6" />
            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                {/* RadioGroup for selecting the color.
                    Label and Radio controls let the user choose a color.
                */}
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: val,
                    }));
                  }}
                >
                  <Label>Colors: {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <Radio
                        key={color.label}
                        value={color}
                        className={({ checked }) =>
                          // Conditionally add a colored border if this color is selected.
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                            {
                              [`border-${color.tw}`]: checked,
                            }
                          )
                        }
                      >
                        <span
                          className={cn(
                            // Span with background color from the option.
                            `bg-${color.tw}`,
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        ></span>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
                {/* Dropdown for selecting the model */}
                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, model }));
                          }}
                        >
                          <CheckCheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              model.label === options.model.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* For MATERIALS and FINISHES options, map over both arrays */}
                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectTableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) => {
                        setOptions((prev) => ({
                          ...prev,
                          [name]: val,
                        }));
                      }}
                    >
                      <Label>
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>
                      <div className="mt-3 space-y-4">
                        {selectTableOptions.map((option) => (
                          <Radio
                            key={option.value}
                            value={option}
                            className={({ checked }) =>
                              cn(
                                "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-500 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",
                                {
                                  "border-primary": checked,
                                }
                              )
                            }
                          >
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <Label className="font-medium text-gray-900">
                                  {option.label}
                                </Label>
                                {option.description ? (
                                  <Description className="text-gray-500">
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </Description>
                                ) : null}
                              </span>
                            </span>
                            <Description className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right">
                              <span className="font-medium text-gray-900">
                                {formatPrice(option.price / 100)}
                              </span>
                            </Description>
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        {/* Bottom bar for the Continue button and price display */}
        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200" />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {formatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100
                )}
              </p>
              <Button
                isLoading={isPending}
                disabled={isPending}
                LoadingText="Saving..."
                onClick={() =>
                  saveConfig({
                    configId,
                    color: options.color.value,
                    finish: options.finish.value,
                    material: options.material.value,
                    model: options.model.value,
                  })
                }
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;
