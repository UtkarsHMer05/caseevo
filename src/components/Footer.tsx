import Link from "next/link"; // Import Next.js Link component for client side navigation
import MaxWidthWrapper from "./MaxWidthWrapper"; // Import a custom component that constrains content to a max width

/**
 * Footer is a React functional component that renders the bottom section of the page.
 * It shows copyright information and some important links.
 *
 * The component uses Tailwind CSS classes to style the footer.
 * Examples of classes:
 * - "bg-white": sets the background color to white.
 * - "h-20": sets the height to 5rem (20 * 0.25rem).
 * - "relative": positions the element relative to its normal position.
 */
const Footer = () => {
  return (
    // The <footer> tag represents the footer section.
    // Class "bg-white" gives it a white background.
    // Class "h-20" sets its fixed height.
    // Class "relative" enables absolute positioning for its child elements if needed.
    <footer className="bg-white h-20 relative">
      {/* MaxWidthWrapper centers content and limits its width for better layout on large screens */}
      <MaxWidthWrapper>
        {/* A horizontal line (border-top) for visual separation */}
        {/* "border-t" adds a top border, and "border-gray-200" sets its color */}
        <div className="border-t border-gray-200" />

        {/* This container holds all footer content and makes sure it's aligned properly */}
        {/* "h-full" makes the container take the full height of the footer */}
        {/* "flex" makes it use flexbox for layout */}
        {/* "flex-col md:flex-row": column layout on small screens and row layout on medium ("md:") screens */}
        {/* "md:justify-between": space out items evenly on medium screens */}
        {/* "justify-center": center items on smaller screens */}
        {/* "items-center": align items vertically in the center */}
        <div className="h-full flex flex-col md:flex-row md:justify-between justify-center items-center">
          {/* Left side of the footer: copyright text */}
          {/* "text-center": center text on small screens, "md:text-left": left-align text on medium screens */}
          {/* "pb-2 md:pb-0": adds padding-bottom on small screens, removed on medium screens */}
          <div className="text-center md:text-left pb-2 md:pb-0">
            {/* "text-sm" makes the text smaller */}
            {/* "text-muted-foreground" applies a subtle muted color (custom or Tailwind text color) */}
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All rights reserved
              {/* The "new Date().getFullYear()" returns the current year */}
            </p>
          </div>

          {/* Right side of the footer: links (Terms, Privacy, Cookies) */}
          <div className="flex items-center justify-center">
            {/* "flex space-x-8" makes a horizontal flex container with spacing (2rem) between items */}
            <div className="flex space-x-8">
              {/**
               * Each Link creates a clickable text.
               * "text-sm" ensures the text is small.
               * "text-muted-foreground" gives the text a muted color.
               * "hover:text-gray-600" changes the text color to a darker gray when the user hovers over it.
               */}
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Terms and Conditions
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
