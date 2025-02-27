"use client";

// Import useQuery hook from react-query for performing asynchronous queries.
import { useQuery } from "@tanstack/react-query";
// Import useEffect and useState hooks from React for managing side-effects and component state.
import { useEffect, useState } from "react";
// Import our custom function that checks the authentication status.
import { getAuthStatus } from "./actions";
// Import useRouter from Next.js for navigation (changing pages).
import { useRouter } from "next/navigation";
// Import Loader2 icon from lucide-react to show a spinner animation.
import { Loader2 } from "lucide-react";

const Page = () => {
  // Create a state variable named configId initialized to null.
  // This will store the configuration id read from the browser's local storage.
  const [configId, setConfigId] = useState<string | null>(null);

  // Get the router object to perform navigation.
  const router = useRouter();

  // useEffect hook that runs once when the component mounts.
  // It reads the "configurationId" from localStorage.
  useEffect(() => {
    // localStorage.getItem reads a value saved in the browser.
    const configurationId = localStorage.getItem("configurationId");
    // If a configuration id exists, update our state variable configId with its value.
    if (configurationId) setConfigId(configurationId);
  }, []); // Empty dependency array ensures this code runs only once on mount.

  // useQuery hook is used to call getAuthStatus function.
  // It asynchronously checks the authentication status.
  const { data } = useQuery({
    // Unique key for the query, useful for caching.
    queryKey: ["auth-callback"],
    // The function that returns a Promise to fetch the auth status.
    queryFn: async () => await getAuthStatus(),
    // If the request fails, it will retry.
    retry: true,
    // It will wait 500 milliseconds before retrying.
    retryDelay: 500,
  });

  // This useEffect runs every time the data (result from getAuthStatus), configId, or router changes.
  // It handles the redirection based on the authentication status.
  useEffect(() => {
    // If data exists and indicates success (data?.success is true)
    if (data?.success) {
      // If we have a configuration id saved in our state:
      if (configId) {
        // Remove the configurationId from local storage once it's used.
        localStorage.removeItem("configurationId");
        // Navigate to the preview page with the configuration id appended to the URL.
        router.push(`/configure/preview?id=${configId}`);
      } else {
        // Otherwise, if there's no configuration id, navigate to the home page.
        router.push("/");
      }
    }
  }, [data, configId, router]);
  // The dependency array makes sure this effect runs whenever data, configId, or router changes.

  // The component returns JSX to render the loading UI.
  return (
    // This outer div makes the content full width and adds top margin.
    // "w-full" sets the width to 100%.
    // "mt-24" applies a top margin (about 6rem).
    // "flex justify-center" centers the content horizontally using flexbox.
    <div className="w-full mt-24 flex justify-center">
      {/* This inner div arranges children in a vertical column, centered horizontally,
          and adds a gap of 2 units between children.
          "flex flex-col items-center gap-2" means:
          - "flex" starts a flex container.
          - "flex-col" stacks children vertically.
          - "items-center" centers children horizontally.
          - "gap-2" adds space between each child element.
      */}
      <div className="flex flex-col items-center gap-2">
        {/* Loader2 is an icon that spins to indicate a loading state.
            "h-8 w-8" sets its height and width to 2rem (about 32px).
            "animate-spin" applies a CSS animation to spin the icon.
            "text-zinc-500" sets the icon's color to a medium gray.
        */}
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        {/* Display a heading indicating that the login process is underway.
            "font-semibold" makes the font semi-bold.
            "text-xl" sets the font size to extra large.
        */}
        <h3 className="font-semibold text-xl">Logging you in...</h3>
        {/* A paragraph that explains the redirect will happen automatically. */}
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
