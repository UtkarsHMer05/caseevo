"use client"; // This ensures the component is rendered on the client side.

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// Import QueryClientProvider to supply the react-query client to your app.
// Import QueryClient which creates the client instance that manages caching and query state.
import { ReactNode } from "react";
// Import type ReactNode to type the children prop correctly.

/**
 * Create an instance of QueryClient.
 * This client holds the cache and configuration for all queries.
 */
const client = new QueryClient();

/**
 * Providers component is a wrapper that supplies the react-query client to its children.
 *
 * @param {Object} props - An object containing properties passed to the component.
 * @param {ReactNode} props.children - The components that are wrapped by Providers and will have
 * access to the QueryClient for data fetching and caching.
 *
 * Use of QueryClientProvider ensures that react-query hooks (like useQuery, useMutation) work correctly in the children components.
 */
const Providers = ({ children }: { children: ReactNode }) => {
  return (
    // QueryClientProvider makes the react-query client available to all descendant components.
    // This helps in managing data fetching, caching, and updating globally across the application.
    <QueryClientProvider client={client}>
      {children} {/* Render all wrapped child components */}
    </QueryClientProvider>
  );
};

export default Providers;
