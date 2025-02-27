// Import React to use its features like state and refs.
import * as React from "react";
// Import Slot from Radix UI to allow rendering a custom component as a child.
import { Slot } from "@radix-ui/react-slot";
// Import cva for class variance (to create variant-based className strings)
// and VariantProps which infers types from the cva function.
import { cva, type VariantProps } from "class-variance-authority";

// cn is a helper function to join class names together.
// It helps combine multiple class strings into one.
import { cn } from "@/lib/utils";

/*
  buttonVariants is created using the cva (class variance authority) function.
  It helps define different styles (variants and sizes) for the button component. 
  
  The base class names are always applied:
    - "inline-flex": Makes the button an inline flex container, 
      meaning it displays like text and uses flex layout for its children.
    - "items-center": Vertically centers the child elements.
    - "justify-center": Horizontally centers the child elements.
    - "gap-2": Adds a small space (gap) between child elements.
    - "whitespace-nowrap": Prevents the text inside from wrapping to another line.
    - "rounded-md": Applies medium rounded corners to the button.
    - "text-sm": Sets the text size as small.
    - "font-medium": Uses a medium font weight.
    - "transition-colors": Animates color changes smoothly.
    - "focus-visible:outline-none": Removes default outline when focused visibly.
    - "focus-visible:ring-1": Applies a ring (border) of 1px when focused.
    - "focus-visible:ring-ring": Sets the ring color using a custom CSS variable.
    - "disabled:pointer-events-none": Disables click events when the button is disabled.
    - "disabled:opacity-50": Lowers the button's opacity when disabled.
    - "[&_svg]:pointer-events-none": Prevents SVGs (inside the button) from capturing pointer events.
    - "[&_svg]:size-4": Sets a default size (4 units) for all SVG icons.
    - "[&_svg]:shrink-0": Prevents SVG icons from shrinking.
  
  Under "variants", we define two variant keys: "variant" and "size".
  Each key has several options that add more classes:
  
  "variant" styles:
    - default: uses primary colors and a shadow; on hover the background becomes slightly transparent.
    - destructive: red-themed style for destructive actions.
    - outline: adds a border and a background, plus hover effects that change background and text color.
    - secondary: secondary color styles.
    - ghost: minimal styling with only hover effects.
    - link: styled as a link with underline on hover.
  
  "size" styles:
    - default: height of 9 units and horizontal padding.
    - sm: small size with a slightly smaller height and text.
    - lg: large size with a bit more height and horizontal padding.
    - icon: square size for icon-only buttons.
  
  Finally, defaultVariants provide automatic defaults if none are specified.
*/
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90", // primary background, contrasting text, shadow, and hover effect
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90", // red theme for delete actions with a small shadow
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground", // outlined button with border, background, shadow, and changes on hover
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80", // secondary styling with a hover effect to darken the background
        ghost: "hover:bg-accent hover:text-accent-foreground", // minimal styling that only shows change on hover
        link: "text-primary underline-offset-4 hover:underline", // styled as a hyperlink with underline on hover
      },
      size: {
        default: "h-9 px-4 py-2", // default size: height 9 units, padding x-4 and y-2
        sm: "h-8 rounded-md px-3 text-xs", // small size: slightly shorter, small text, and less padding
        lg: "h-10 rounded-md px-8", // large size: taller and more horizontal padding
        icon: "h-9 w-9", // icon-only variant: perfect square button of 9 units height and width
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Export ButtonProps interface which extends default button HTML properties.
// It also takes variant properties from buttonVariants, and two additional props:
// - asChild: to allow rendering as a different component if needed.
// - isLoading: a boolean to manage a loading state.
// - LoadingText: optional text to show when loading.
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  LoadingText?: string;
}

/**
 * Button Component
 * ---------------------------
 * A reusable button component that supports different styles (variants and sizes) and includes an optional loading state.
 * It can also render as a different component if required (using the asChild prop).
 *
 * How it works:
 * 1. We use React.forwardRef to forward a ref to the underlying HTML button element.
 * 2. Depending on the "asChild" prop, we either render a Slot (if true) or a standard "button" element.
 * 3. The className is computed using the cn helper and buttonVariants function. This
 *    composes the final set of CSS classes based on "variant", "size", and any extra classes passed.
 * 4. If "isLoading" is true, the button shows LoadingText (if provided) and a loading animation.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className, // Additional custom class names
      isLoading, // A flag indicating whether the button is in a loading state
      LoadingText, // Optional text to show when the button is loading
      variant, // The visual variant of the button (determines colors and style)
      children, // The button content (text, icons, etc.)
      size, // The size variant of the button (small, medium, large, etc.)
      asChild = false, // By default, render as a button; can be changed to render a different element
      ...props // All other button HTML attributes
    },
    ref // Ref forwarded to the button element for accessing it externally
  ) => {
    // If asChild is true, use the Slot component to render your own custom element instead of a button.
    // Otherwise, default to using the regular "button" HTML element.
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        // Compute the final class name by combining default variant classes, size classes and any custom classes.
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props} // Spread any other props onto the button/Custom component.
      >
        {/*
          If isLoading and LoadingText are provided:
          - Display the loading text instead of the usual children.
          Otherwise, display the children (normal button content).
        */}
        {isLoading && LoadingText ? LoadingText : children}
        {/*
          If isLoading is true, show a little loading animation.
          This consists of a span that contains three small dots (styled as circles) that flash.
        */}
        {isLoading ? (
          <span className="ml-1.5 flex items-center gap-1">
            {/*
              Each dot:
              - "animate-flashing": Applies a custom flashing animation.
              - "w-1 h-1": Sets the width and height to 0.25rem (small circle).
              - "bg-white": The dot's background color is white.
              - "rounded-full": Makes the dot fully circular.
              - "inline-block": Displays the dot inline with text.
              - "delay-100" and "delay-200": These add delays to the animation for staggered effects.
            */}
            <span className="animate-flashing w-1 h-1 bg-white rounded-full inline-block" />
            <span className="animate-flashing w-1 h-1 delay-100 bg-white rounded-full inline-block" />
            <span className="animate-flashing w-1 h-1 delay-200 bg-white rounded-full inline-block" />
          </span>
        ) : null}
      </Comp>
    );
  }
);

// Set a display name for the component for easier debugging in React DevTools.
Button.displayName = "Button";

// Export the Button component and its variant configuration.
export { Button, buttonVariants };
