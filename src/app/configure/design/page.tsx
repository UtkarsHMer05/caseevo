/**
 * Import our database connection from "@/db".
 * This allows us to query our database for configuration data.
 */
import { db } from "@/db";

/**
 * Import the notFound function from Next.js.
 * Calling notFound() causes Next.js to render a 404 (Not Found) page.
 */
import { notFound } from "next/navigation";

/**
 * Import the DesignConfigurator component.
 * This component shows the design customizer with phone image, draggable area, etc.
 */
import DesignConfigurator from "./DesignConfigurator";

/**
 * Define our interface for the props we expect in this page component.
 * Here, searchParams is an object that holds query parameters from the URL.
 */
interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

/**
 * The Page function is an async component that loads configuration data based on the query parameter "id".
 * It's written as an async function so we can await database requests.
 */
const Page = async ({ searchParams }: PageProps) => {
  // Destructure the "id" from searchParams.
  // The id should be present in the URL query (e.g., /configure/design?id=someId).
  const { id } = searchParams;

  // Check if id is not provided or if it is not a string.
  // If it's missing or not in the expected format, return a 404 page.
  if (!id || typeof id !== "string") {
    return notFound();
  }

  /**
   * Query the database for a configuration with the given id.
   * We use findUnique which returns a single configuration that matches the id.
   */
  const configuration = await db.configuration.findUnique({
    where: {
      id,
    },
  });

  // If no configuration is found in the database, show the 404 page.
  if (!configuration) {
    return notFound();
  }

  // Destructure values we need from the found configuration.
  // imageUrl: URL of the phone image to be passed.
  // width and height: dimensions of the image, used to size the design.
  const { imageUrl, width, height } = configuration;

  // Return the DesignConfigurator component filled with the configuration data.
  // We pass the configuration id, the image dimensions, and the imageUrl.
  return (
    <DesignConfigurator
      configId={configuration.id}
      imageDimensions={{ width, height }}
      imageUrl={imageUrl}
    />
  );
};

// Export the Page component as default.
// This is the main component for the /configure/design route.
export default Page;
