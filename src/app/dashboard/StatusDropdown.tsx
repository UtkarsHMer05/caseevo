"use client";

/*
  This file defines a small dropdown component that allows users (like store admins) 
  to change the status of an order. It uses a “DropdownMenu” from our UI library 
  and React Query to handle updating the order status on the server.
*/

import { Button } from "@/components/ui/button"; // A button component for user interaction
import {
  DropdownMenu, // The container that holds the dropdown logic
  DropdownMenuContent, // The popup area where items are listed
  DropdownMenuItem, // Each individual clickable item in the dropdown
  DropdownMenuTrigger, // An element that shows the dropdown menu when clicked
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils"; // A small helper function to merge class names
import { OrderStatus } from "@prisma/client"; // Enum with possible order statuses
import { useMutation } from "@tanstack/react-query"; // React Query hook for data mutation
import { Check, ChevronsUpDown } from "lucide-react"; // Icons for checking, toggling
import { changeOrderStatus } from "./actions"; // Function that updates an order status on the server
import { useRouter } from "next/navigation"; // Next.js router to refresh the page

/*
  LABEL_MAP maps each possible OrderStatus to a more user-friendly label. 
  For example, "fulfilled" -> "Fulfilled". This is shown to the user in the UI.
*/
const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
};

/*
  This component receives:
   - id: the unique order ID
   - orderStatus: the current status of that order
  It displays a dropdown button with status options. When the user clicks a different status,
  it uses 'mutate' to run 'changeOrderStatus' on the server, then refreshes the page.
*/
const StatusDropdown = ({
  id,
  orderStatus,
}: {
  id: string; // The unique order ID
  orderStatus: OrderStatus; // The order's current status
}) => {
  // A Next.js router, so we can refresh the page after changing status.
  const router = useRouter();

  // React Query mutation for changing the order’s status.
  const { mutate } = useMutation({
    // A unique key to identify this mutation
    mutationKey: ["change-order-status"],
    // The function that actually makes the server call
    mutationFn: changeOrderStatus,
    // When successful, refresh the router to see the updated status on the page
    onSuccess: () => router.refresh(),
  });

  return (
    /*
      DropdownMenu is the container that handles show/hide of items.
    */
    <DropdownMenu>
      {/* DropdownMenuTrigger asChild means the Button itself is the clickable trigger. */}
      <DropdownMenuTrigger asChild>
        {/* 
          Button with:
          - variant="outline": draws a button with an outlined style
          - className="w-52 flex justify-between items-center":
            w-52 -> width: 13rem (makes the button consistently wide)
            flex -> uses flexbox layout
            justify-between -> spaces content at the far ends
            items-center -> aligns content vertically in the middle
        */}
        <Button
          variant="outline"
          className="w-52 flex justify-between items-center"
        >
          {/* Show the label (like "Shipped") for the current order status. */}
          {LABEL_MAP[orderStatus]}
          {/* 
            ChevronsUpDown icon indicates this is a dropdown,
            ml-2 means a small left margin, h-4 w-4 sets its size,
            shrink-0 prevents the icon from shrinking,
            opacity-50 makes it slightly transparent.
          */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      {/* 
        DropdownMenuContent is the box that appears with options. 
        className="p-0" means we remove default padding to customize item spacing.
      */}
      <DropdownMenuContent className="p-0">
        {/* 
          Loop over each status option in OrderStatus.
          For each one, we show a DropdownMenuItem. 
        */}
        {Object.keys(OrderStatus).map((status) => (
          /*
            DropdownMenuItem is each clickable row in the dropdown.
            className tells us how it looks:
            - "flex text-sm gap-1 items-center p-2.5 cursor-default"
              means a flex container with small text, a small gap between items,
              vertically centered content, some padding, and the default cursor.
            - "hover:bg-zinc-100" adds a light gray background on hover.
            - "bg-zinc-100": we apply this if the current item is the active order status,
              so it looks highlighted.
            onClick calls mutate, which triggers a status change on the server.
          */
          <DropdownMenuItem
            key={status}
            className={cn(
              "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
              {
                "bg-zinc-100": orderStatus === status,
              }
            )}
            onClick={() => mutate({ id, newStatus: status as OrderStatus })}
          >
            {/* 
              Check icon indicates the item is selected when 'orderStatus' matches 'status'.
              We use "opacity-0" if not selected, or full opacity if selected. 
              text-primary -> uses our primary color for the icon.
            */}
            <Check
              className={cn(
                "mr-2 h-4 w-4 text-primary",
                orderStatus === status ? "opacity-100" : "opacity-0"
              )}
            />
            {/* Display the friendly label for this order status */}
            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
