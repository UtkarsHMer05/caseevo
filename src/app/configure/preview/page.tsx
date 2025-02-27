// Import the database connection object to query the database.
import { db } from "@/db";
// Import notFound from next/navigation, which shows a 404 page if needed.
import { notFound } from "next/navigation";
// Import the DesignPreview component to display the preview of a configured phone case.
import DesignPreview from "./DesignPreview";

// Define an interface for the props passed to this page component.
// Here, searchParams is an object that holds key/value pairs from the URL query string.
interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

/**
 * Page is an asynchronous React server component that handles rendering the preview page.
 *
 * What this component does:
 * 1. It receives the URL query parameters (searchParams) and extracts the "id" field.
 * 2. It checks if "id" exists and is a string; if not, it returns a 404 page using notFound().
 * 3. It then queries the database for a configuration record with the given id.
 * 4. If no configuration is found, it returns a 404 page.
 * 5. If found, it renders the DesignPreview component, passing the configuration data.
 *
 * Even a 5-year-old could understand it like:
 * "We look for a magic id in the URL. If it's missing or wrong, we show a page that says 'Not Found'. If it's there, we fetch the details from our database and then show the preview page with those details."
 *
 * @param {PageProps} props - The properties passed to this component, including searchParams.
 */
const Page = async ({ searchParams }: PageProps) => {
  // Before using the searchParams object, we await it using Promise.resolve.
  // This ensures compatibility with Next.js requirements.
  const sp = await Promise.resolve(searchParams);
  // Destructure the "id" property from the searchParams.
  const { id } = sp;

  // Check if id is missing or not a string.
  // If so, return a 404 page by calling notFound().
  if (!id || typeof id !== "string") {
    return notFound();
  }

  // Query the database using the id to get the configuration record.
  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  // If no configuration is found in the database, return a 404 page.
  if (!configuration) {
    return notFound();
  }

  // Return the DesignPreview component with the configuration passed in as a prop.
  // This component will display the preview of the customized phone case.
  return <DesignPreview configuration={configuration} />;
};

// Export the Page component as the default export so that it can be used as a page route.
export default Page;
