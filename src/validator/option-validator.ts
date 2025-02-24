//bg-blue-950 border-blue-950
//bg-zinc-900 border-zinc-900
//bg-rose-950 border-rose-950
//bg-green-950 border-green-950
//bg-orange-700 border-orange-700

import { PRODUCT_PRICES } from "@/config/products";
import { Description } from "@headlessui/react";

export const COLORS = [
  {
    label: "Black",
    value: "black",
    tw: "zinc-900",
  },
  {
    label: "Blue",
    value: "blue",
    tw: "blue-950",
  },
  {
    label: "Rose",
    value: "rose",
    tw: "rose-950",
  },
  {
    label: "Green",
    value: "green",
    tw: "green-950",
  },
  {
    label: "Orange",
    value: "orange",
    tw: "orange-700",
  },
] as const;

export const MODELS = {
  name: "models",
  options: [
    {
      label: "iPhone X",
      value: "iphonex",
    },
    {
      label: "iPhone 11",
      value: "iphone11",
    },
    {
      label: "iPhone 12",
      value: "iphone12",
    },
    {
      label: "iPhone 13",
      value: "iphone13",
    },
    {
      label: "iPhone 14",
      value: "iphone14",
    },
    {
      label: "iPhone 15",
      value: "iphone15",
    },
    {
      label: "iPhone 16",
      value: "iphone16",
    },
  ],
} as const;

export const MATERIALS = {
  name: "material",
  options: [
    {
      label: "Silicone",
      value: "silicone",
      description: undefined,
      price: PRODUCT_PRICES.material.silicone,
    },
    {
      label: "Soft Polycarbonate",
      value: "polycarbonate",
      description: "Scratch resistant coating",
      price: PRODUCT_PRICES.material.polycarbonate,
    },
  ],
} as const;
export const FINISHES = {
  name: "finish",
  options: [
    {
      label: "Smooth Finish",
      value: "smooth",
      description: undefined,
      price: PRODUCT_PRICES.finish.smooth,
    },
    {
      label: "Textured Finish",
      value: "textured",
      description: "Grippy soft texture",
      price: PRODUCT_PRICES.finish.textured,
    },
  ],
} as const;
